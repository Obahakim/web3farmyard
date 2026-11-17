<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

$cachePath = __DIR__ . '/showroom-data.json';
$contents = is_file($cachePath) ? file_get_contents($cachePath) : false;
$snapshot = is_string($contents) ? json_decode($contents, true) : null;

if (!is_array($snapshot) || empty($snapshot['chains']) || !isset($snapshot['updatedAt'])) {
    http_response_code(503);
    echo json_encode(['error' => 'The daily Showroom snapshot is not available.']);
    exit;
}

echo $contents;
