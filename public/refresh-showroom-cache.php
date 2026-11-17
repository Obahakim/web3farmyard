<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

set_time_limit(0);

const SHOWROOM_API = 'https://api.llama.fi';
const SHOWROOM_CACHE = __DIR__ . '/showroom-data.json';

function fetchJsonBatch(array $requests, int $concurrency = 8): array
{
    $responses = [];
    $errors = [];

    foreach (array_chunk($requests, $concurrency, true) as $batch) {
        $multiHandle = curl_multi_init();
        $handles = [];

        foreach ($batch as $key => $url) {
            $handle = curl_init($url);
            if ($handle === false) {
                $responses[$key] = null;
                $errors[$key] = 'Could not initialize request';
                continue;
            }

            $configured = curl_setopt_array($handle, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_CONNECTTIMEOUT => 8,
                CURLOPT_TIMEOUT => 15,
                CURLOPT_ENCODING => '',
                CURLOPT_HTTPHEADER => ['Accept: application/json'],
                CURLOPT_USERAGENT => 'Web3Farmyard-Showroom/1.0',
            ]);

            if (!$configured || curl_multi_add_handle($multiHandle, $handle) !== CURLM_OK) {
                curl_close($handle);
                $responses[$key] = null;
                $errors[$key] = 'Could not add request to the batch';
                continue;
            }

            $handles[] = ['key' => $key, 'handle' => $handle];
        }

        $running = 0;
        do {
            $multiStatus = curl_multi_exec($multiHandle, $running);
            if ($multiStatus !== CURLM_OK) {
                break;
            }
            if ($running > 0 && curl_multi_select($multiHandle, 1.0) === -1) {
                usleep(100000);
            }
        } while ($running > 0);

        foreach ($handles as $entry) {
            $key = $entry['key'];
            $handle = $entry['handle'];
            $body = curl_multi_getcontent($handle);
            $status = (int) curl_getinfo($handle, CURLINFO_HTTP_CODE);

            if ($multiStatus !== CURLM_OK || $status !== 200 || !is_string($body) || $body === '') {
                $responses[$key] = null;
                $errors[$key] = 'Upstream request failed';
            } else {
                $decoded = json_decode($body, true);
                if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
                    $responses[$key] = null;
                    $errors[$key] = 'Upstream returned invalid JSON';
                } else {
                    $responses[$key] = $decoded;
                }
            }

            curl_multi_remove_handle($multiHandle, $handle);
            curl_close($handle);
        }

        curl_multi_close($multiHandle);
    }

    return [$responses, $errors];
}

function changeOverDays(array $history, int $days): ?float
{
    $points = array_values(array_filter($history, static function ($point): bool {
        return is_array($point)
            && isset($point['date'], $point['tvl'])
            && is_numeric($point['date'])
            && is_numeric($point['tvl']);
    }));

    if (count($points) < 2) {
        return null;
    }

    usort($points, static function (array $a, array $b): int {
        return (int) $a['date'] <=> (int) $b['date'];
    });

    $latest = $points[count($points) - 1];
    $targetDate = (int) $latest['date'] - ($days * 86400);
    $baseline = null;

    foreach ($points as $point) {
        if ((int) $point['date'] <= $targetDate) {
            $baseline = $point;
        } else {
            break;
        }
    }

    if ($baseline === null || (float) $baseline['tvl'] <= 0) {
        return null;
    }

    return (((float) $latest['tvl'] - (float) $baseline['tvl']) / (float) $baseline['tvl']) * 100;
}

try {
    if (!function_exists('curl_multi_init')) {
        throw new RuntimeException('The PHP cURL extension is required.');
    }

    $lockPath = sys_get_temp_dir() . '/web3farmyard-showroom-' . hash('sha256', __DIR__) . '.lock';
    $lockHandle = fopen($lockPath, 'c');
    if ($lockHandle === false) {
        throw new RuntimeException('Could not open the Showroom refresh lock.');
    }
    if (!flock($lockHandle, LOCK_EX | LOCK_NB)) {
        fclose($lockHandle);
        fwrite(STDOUT, "A Showroom refresh is already running.\n");
        exit(0);
    }

    $force = in_array('--force', $argv ?? [], true);
    clearstatcache(true, SHOWROOM_CACHE);
    $cacheModifiedAt = is_file(SHOWROOM_CACHE) ? filemtime(SHOWROOM_CACHE) : false;
    if (!$force && $cacheModifiedAt !== false && time() - $cacheModifiedAt < 86400) {
        fwrite(STDOUT, "The Showroom snapshot is less than 24 hours old; no refresh needed.\n");
        flock($lockHandle, LOCK_UN);
        fclose($lockHandle);
        exit(0);
    }

    $baseRequests = [
        'chains' => SHOWROOM_API . '/v2/chains',
        'dexOverview' => SHOWROOM_API . '/overview/dexs?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true',
        'nftOverview' => SHOWROOM_API . '/overview/nft-volume?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true',
    ];
    [$baseResponses, $baseErrors] = fetchJsonBatch($baseRequests, 2);
    if (isset($baseErrors['chains']) || isset($baseErrors['dexOverview'])) {
        throw new RuntimeException('Could not load the DeFiLlama chain list or DEX overview.');
    }
    $nftFailureCount = isset($baseErrors['nftOverview']) ? 1 : 0;

    $chains = [];
    foreach ($baseResponses['chains'] as $chain) {
        if (!is_array($chain) || !isset($chain['name'], $chain['tvl']) || !is_numeric($chain['tvl'])) {
            continue;
        }

        $name = trim((string) $chain['name']);
        if ($name === '') {
            continue;
        }

        $key = strtolower($name);
        $chains[$key] = [
            'name' => $name,
            'tvl' => (float) $chain['tvl'],
            'change_1d' => null,
            'change_7d' => null,
            'change_1m' => null,
            'dexVolume24h' => null,
            'nftVolume24h' => null,
            'tokenSymbol' => isset($chain['tokenSymbol']) ? (string) $chain['tokenSymbol'] : null,
            'chainId' => isset($chain['chainId']) && is_numeric($chain['chainId']) ? (int) $chain['chainId'] : null,
            'gecko_id' => isset($chain['gecko_id']) ? (string) $chain['gecko_id'] : null,
        ];
    }

    $volumeChains = $baseResponses['dexOverview']['allChains'] ?? null;
    if (!is_array($volumeChains)) {
        throw new RuntimeException('The DeFiLlama DEX overview did not include its supported chains.');
    }

    $volumeKeys = [];
    foreach ($volumeChains as $volumeChain) {
        if (!is_string($volumeChain) || trim($volumeChain) === '') {
            continue;
        }

        $name = trim($volumeChain);
        $key = strtolower($name);
        if (isset($chains[$key])) {
            $volumeKeys[$key] = $name;
        }
    }

    $nftProtocols = $baseResponses['nftOverview']['protocols'] ?? null;
    if (!is_array($nftProtocols)) {
        $nftFailureCount++;
    } else {
        foreach ($nftProtocols as $nftProtocol) {
            if (
                !is_array($nftProtocol) ||
                ($nftProtocol['category'] ?? null) !== 'Chain' ||
                !isset($nftProtocol['name']) ||
                !is_string($nftProtocol['name']) ||
                !isset($nftProtocol['total24h']) ||
                !is_numeric($nftProtocol['total24h'])
            ) {
                continue;
            }

            $chainKey = strtolower(trim($nftProtocol['name']));
            if (!isset($chains[$chainKey]) && isset($nftProtocol['chains']) && is_array($nftProtocol['chains'])) {
                foreach ($nftProtocol['chains'] as $alias) {
                    if (is_string($alias) && isset($chains[strtolower(trim($alias))])) {
                        $chainKey = strtolower(trim($alias));
                        break;
                    }
                }
            }

            if (isset($chains[$chainKey])) {
                $chains[$chainKey]['nftVolume24h'] = (float) $nftProtocol['total24h'];
            }
        }
    }

    $volumeRequests = [];
    foreach ($volumeKeys as $key => $name) {
        $volumeRequests[$key] = SHOWROOM_API . '/overview/dexs/' . rawurlencode($name)
            . '?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true';
    }

    $volumeFailureCount = 0;
    foreach (array_chunk($volumeRequests, 6, true) as $batch) {
        [$volumeBatch, $batchErrors] = fetchJsonBatch($batch, 6);
        $volumeFailureCount += count($batchErrors);

        foreach ($volumeBatch as $key => $volume) {
            if (isset($batchErrors[$key])) {
                continue;
            }
            if (!is_array($volume) || !isset($volume['total24h']) || !is_numeric($volume['total24h'])) {
                $volumeFailureCount++;
                continue;
            }
            $chains[$key]['dexVolume24h'] = (float) $volume['total24h'];
        }
    }

    $tvlRanked = array_values($chains);
    usort($tvlRanked, static function (array $a, array $b): int {
        return $b['tvl'] <=> $a['tvl'];
    });
    $volumeRanked = array_values(array_filter($chains, static function (array $chain): bool {
        return $chain['dexVolume24h'] !== null;
    }));
    usort($volumeRanked, static function (array $a, array $b): int {
        return $b['dexVolume24h'] <=> $a['dexVolume24h'];
    });

    $historyTargets = [];
    foreach (array_merge(array_slice($tvlRanked, 0, 50), array_slice($volumeRanked, 0, 50)) as $chain) {
        $key = strtolower($chain['name']);
        $historyTargets[$key] = $chain['name'];
    }

    $historyRequests = [];
    foreach ($historyTargets as $key => $name) {
        $historyRequests[$key] = SHOWROOM_API . '/v2/historicalChainTvl/' . rawurlencode($name);
    }

    $historyFailureCount = 0;
    foreach (array_chunk($historyRequests, 6, true) as $batch) {
        [$historyBatch, $batchErrors] = fetchJsonBatch($batch, 6);
        $historyFailureCount += count($batchErrors);

        foreach ($historyBatch as $key => $history) {
            if (!isset($chains[$key]) || !is_array($history)) {
                continue;
            }
            $chains[$key]['change_1d'] = changeOverDays($history, 1);
            $chains[$key]['change_7d'] = changeOverDays($history, 7);
            $chains[$key]['change_1m'] = changeOverDays($history, 30);
        }
    }

    $chainList = array_values($chains);
    usort($chainList, static function (array $a, array $b): int {
        return $b['tvl'] <=> $a['tvl'];
    });

    $snapshot = [
        'updatedAt' => gmdate(DATE_ATOM),
        'partialFailures' => $nftFailureCount + $historyFailureCount + $volumeFailureCount,
        'chains' => $chainList,
    ];
    $json = json_encode($snapshot, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if ($json === false) {
        throw new RuntimeException('Could not encode the Showroom snapshot.');
    }

    $temporaryPath = SHOWROOM_CACHE . '.tmp';
    $bytesWritten = file_put_contents($temporaryPath, $json, LOCK_EX);
    if ($bytesWritten !== strlen($json)) {
        @unlink($temporaryPath);
        throw new RuntimeException('Could not write the temporary Showroom snapshot.');
    }
    if (!rename($temporaryPath, SHOWROOM_CACHE)) {
        @unlink($temporaryPath);
        throw new RuntimeException('Could not publish the Showroom snapshot.');
    }

    flock($lockHandle, LOCK_UN);
    fclose($lockHandle);
    fwrite(STDOUT, sprintf(
        "Showroom snapshot refreshed: %d chains, %d partial upstream failures.\n",
        count($chainList),
        $snapshot['partialFailures']
    ));
} catch (Throwable $error) {
    if (isset($lockHandle) && is_resource($lockHandle)) {
        flock($lockHandle, LOCK_UN);
        fclose($lockHandle);
    }
    fwrite(STDERR, 'Showroom refresh failed: ' . $error->getMessage() . "\n");
    exit(1);
}
