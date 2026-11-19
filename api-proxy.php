<?php
declare(strict_types=1);

/**
 * Web3Farmyard server-side API proxy.
 *
 * Deploy as /api-proxy.php in the Hostinger document root.
 * Secrets MUST live outside the document root in a PHP file returning an array.
 * Set W3F_CONFIG_PATH if the default path is not correct.
 */

$allowedOrigins = ['https://web3farmyard.com', 'https://www.web3farmyard.com'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && !in_array($origin, $allowedOrigins, true)) {
    http_response_code(403);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Forbidden origin']);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    if ($origin !== '') {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
    }
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-W3F-CSRF');
    header('Access-Control-Max-Age: 600');
    http_response_code(204);
    exit;
}

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');
if ($origin !== '') {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Credentials: true');
}

$configPath = getenv('W3F_CONFIG_PATH') ?: dirname(__DIR__) . '/private/web3farmyard-secrets.php';
if (!is_file($configPath) || !is_readable($configPath)) {
    fail(500, 'Server configuration is missing.');
}
$config = require $configPath;
if (!is_array($config)) {
    fail(500, 'Server configuration is invalid.');
}

$required = ['supabase_url', 'supabase_service_role_key', 'resend_api_key', 'session_secret', 'unsubscribe_secret'];
foreach ($required as $key) {
    if (empty($config[$key]) || !is_string($config[$key])) {
        fail(500, 'A required server secret is not configured.');
    }
}
$SUPABASE_URL = rtrim($config['supabase_url'], '/');
$SUPABASE_KEY = $config['supabase_service_role_key'];
$RESEND_KEY = $config['resend_api_key'];
$SESSION_SECRET = $config['session_secret'];
$UNSUBSCRIBE_SECRET = $config['unsubscribe_secret'];
if ((!isset($config['admin_password_hash']) || !is_string($config['admin_password_hash'])) && (!isset($config['admin_password']) || !is_string($config['admin_password']))) {
    fail(500, 'An admin password or password hash is not configured.');
}
if (strlen($SESSION_SECRET) < 32 || strlen($UNSUBSCRIBE_SECRET) < 32) {
    fail(500, 'Session and unsubscribe secrets must each be at least 32 characters.');
}

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$action = (string)($_GET['action'] ?? '');
$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
rateLimit($ip, $action === 'subscribe' ? 3 : (in_array($action, ['admin-login', 'claude'], true) ? 5 : ($action === 'analytics' ? 60 : 30)), $action === 'subscribe' ? 3600 : 60);

ini_set('session.use_strict_mode', '1');
session_name('w3f_admin_' . substr(hash('sha256', $SESSION_SECRET), 0, 8));
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => '',
    'secure' => true,
    'httponly' => true,
    'samesite' => 'Strict',
]);
session_start();

switch ($action) {
    case 'admin-login':
        requireMethod('POST');
        requireSameOrigin($allowedOrigins);
        $body = readJson();
        $password = (string)($body['password'] ?? '');
        $passwordValid = false;
        if (isset($config['admin_password_hash']) && is_string($config['admin_password_hash'])) {
            $passwordValid = password_verify($password, $config['admin_password_hash']);
        } elseif (isset($config['admin_password']) && is_string($config['admin_password'])) {
            $passwordValid = hash_equals($config['admin_password'], $password);
        }
        if ($password === '' || strlen($password) > 1024 || !$passwordValid) {
            usleep(350000);
            fail(401, 'Invalid admin credentials.');
        }
        session_regenerate_id(true);
        $_SESSION['w3f_admin'] = true;
        $_SESSION['w3f_auth_at'] = time();
        $_SESSION['w3f_csrf'] = bin2hex(random_bytes(32));
        echo json_encode(['authenticated' => true, 'csrfToken' => $_SESSION['w3f_csrf']]);
        exit;

    case 'admin-session':
        requireMethod('GET');
        if (!isAdmin()) {
            http_response_code(401);
            echo json_encode(['authenticated' => false]);
            exit;
        }
        echo json_encode(['authenticated' => true, 'csrfToken' => $_SESSION['w3f_csrf'] ?? null]);
        exit;

    case 'admin-logout':
        requireMethod('POST');
        requireSameOrigin($allowedOrigins);
        requireAdmin();
        requireCsrf();
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $p = session_get_cookie_params();
            setcookie(session_name(), '', ['expires' => time() - 42000, 'path' => $p['path'], 'domain' => $p['domain'], 'secure' => true, 'httponly' => true, 'samesite' => 'Strict']);
        }
        session_destroy();
        echo json_encode(['authenticated' => false]);
        exit;

    case 'admin-data':
        requireAdmin();
        requireSameOrigin($allowedOrigins);
        if ($method !== 'GET') requireCsrf();
        adminData($SUPABASE_URL, $SUPABASE_KEY, $method);
        exit;

    case 'analytics':
        requireMethod('POST');
        requireSameOrigin($allowedOrigins);
        trackAnalytics($SUPABASE_URL, $SUPABASE_KEY, $ip);
        exit;

    case 'admin-newsletter':
        requireMethod('POST');
        requireAdmin();
        requireSameOrigin($allowedOrigins);
        requireCsrf();
        sendNewsletter($SUPABASE_URL, $SUPABASE_KEY, $RESEND_KEY, $UNSUBSCRIBE_SECRET);
        exit;

    case 'subscribe':
        requireMethod('POST');
        requireSameOrigin($allowedOrigins);
        subscribePublic($SUPABASE_URL, $SUPABASE_KEY, $RESEND_KEY, $UNSUBSCRIBE_SECRET, $ip);
        exit;

    case 'unsubscribe':
        requireMethod('GET');
        unsubscribePublic($SUPABASE_URL, $SUPABASE_KEY, $UNSUBSCRIBE_SECRET);
        exit;

    case 'claude':
        requireMethod('POST');
        requireSameOrigin($allowedOrigins);
        if (empty($config['anthropic_api_key'])) fail(503, 'AI service is not configured.');
        $body = readJson();
        $messages = $body['messages'] ?? null;
        if (!is_array($messages) || count($messages) < 1 || count($messages) > 30) fail(400, 'Invalid messages.');
        $payload = [
            'model' => 'claude-sonnet-4-20250514',
            'max_tokens' => max(1, min((int)($body['max_tokens'] ?? 2000), 3000)),
            'messages' => $messages,
        ];
        if (isset($body['system']) && is_string($body['system'])) $payload['system'] = substr($body['system'], 0, 12000);
        proxyJson('https://api.anthropic.com/v1/messages', $payload, [
            'x-api-key: ' . $config['anthropic_api_key'],
            'anthropic-version: 2023-06-01',
            'Content-Type: application/json',
        ]);
        exit;

    default:
        fail(404, 'Unknown action.');
}

function fail(int $status, string $message): never {
    http_response_code($status);
    echo json_encode(['error' => $message]);
    exit;
}
function requireMethod(string $expected): void {
    if (strtoupper($_SERVER['REQUEST_METHOD'] ?? '') !== $expected) {
        header('Allow: ' . $expected . ', OPTIONS');
        fail(405, 'Method not allowed.');
    }
}
function readJson(): array {
    $raw = file_get_contents('php://input');
    if ($raw === false || strlen($raw) > 1000000) fail(413, 'Request too large.');
    $data = json_decode($raw, true);
    if (!is_array($data)) fail(400, 'Invalid JSON body.');
    return $data;
}
function requireSameOrigin(array $allowed): void {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin === '' || !in_array($origin, $allowed, true)) fail(403, 'Invalid request origin.');
}
function isAdmin(): bool {
    return !empty($_SESSION['w3f_admin']) && !empty($_SESSION['w3f_auth_at'])
        && (time() - (int)$_SESSION['w3f_auth_at']) < 43200;
}
function requireAdmin(): void {
    if (!isAdmin()) fail(401, 'Admin session expired. Sign in again.');
}
function requireCsrf(): void {
    $provided = $_SERVER['HTTP_X_W3F_CSRF'] ?? '';
    $expected = $_SESSION['w3f_csrf'] ?? '';
    if (!is_string($provided) || $expected === '' || !hash_equals($expected, $provided)) fail(403, 'Invalid request token.');
}
function rateLimit(string $ip, int $limit, int $window): void {
    $file = sys_get_temp_dir() . '/w3f_' . hash('sha256', $ip . '|' . ($_GET['action'] ?? '')) . '.json';
    $fp = fopen($file, 'c+');
    if (!$fp) return;
    flock($fp, LOCK_EX);
    $raw = stream_get_contents($fp);
    $state = json_decode($raw ?: '[]', true);
    if (!is_array($state) || time() - (int)($state['start'] ?? 0) >= $window) $state = ['start' => time(), 'count' => 0];
    $state['count']++;
    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, json_encode($state));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
    if ($state['count'] > $limit) fail(429, 'Rate limit exceeded. Try again later.');
}
function supabaseRequest(string $base, string $key, string $method, string $path, ?array $body = null, array $extraHeaders = []): array {
    $ch = curl_init($base . '/rest/v1/' . ltrim($path, '/'));
    $headers = array_merge([
        'apikey: ' . $key,
        'Authorization: Bearer ' . $key,
        'Content-Type: application/json',
        'Accept: application/json',
    ], $extraHeaders);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_TIMEOUT => 25,
        CURLOPT_CONNECTTIMEOUT => 8,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);
    if ($body !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body, JSON_UNESCAPED_SLASHES));
    $response = curl_exec($ch);
    $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    if ($response === false) fail(502, 'Database request failed.');
    $decoded = json_decode($response, true);
    if ($status < 200 || $status >= 300) {
        error_log('Web3Farmyard Supabase error ' . $status . ': ' . substr((string)$response, 0, 500));
        fail(502, 'Database operation failed.');
    }
    return ['status' => $status, 'data' => $decoded, 'raw' => $response, 'curl_error' => $error];
}
function adminData(string $base, string $key, string $method): void {
    $table = (string)($_GET['table'] ?? '');
    $allowed = [
        'airdrops' => ['GET' => true, 'POST' => true, 'PATCH' => true, 'DELETE' => true],
        'subscribers' => ['GET' => true, 'PATCH' => true],
        'farmer_profiles' => ['GET' => true],
        'user_progress' => ['GET' => true],
        'analytics_events' => ['GET' => true],
        'newsletter_sends' => ['GET' => true],
    ];
    if (!isset($allowed[$table][$method])) fail(403, 'This table/operation is not permitted.');
    $query = [];
    if (isset($_GET['id'])) {
        $id = (string)$_GET['id'];
        if (!preg_match('/^[0-9]{1,20}$/', $id)) fail(400, 'Invalid record id.');
        $query[] = 'id=eq.' . rawurlencode($id);
    }
    
    if (isset($_GET['status']) && $table === 'airdrops') {
        $status = (string)$_GET['status'];
        if (!in_array($status, ['live', 'pending', 'draft', 'completed', 'expired'], true)) fail(400, 'Invalid status.');
        $query[] = 'status=eq.' . rawurlencode($status);
    }
    $limit = isset($_GET['limit']) ? max(1, min(500, (int)$_GET['limit'])) : 200;
    if ($method === 'GET') {
        $query[] = 'select=*';
        $query[] = 'limit=' . $limit;
        $orderBy = [
            'airdrops' => 'created_at', 'subscribers' => 'created_at',
            'farmer_profiles' => 'updated_at', 'user_progress' => 'last_updated',
            'analytics_events' => 'timestamp', 'newsletter_sends' => 'sent_at',
        ][$table] ?? 'created_at';
        $query[] = 'order=' . $orderBy . '.desc';
        $result = supabaseRequest($base, $key, 'GET', $table . '?' . implode('&', $query));
        echo $result['raw'];
        return;
    }
    $body = readJson();
    if ($method === 'POST') {
        if ($table !== 'airdrops') fail(403, 'Insert not permitted.');
        $fields = ['name','logo','reward_amount','task','chain','risk','deadline','url','image_url','topics','status'];
        $clean = [];
        foreach ($fields as $field) if (array_key_exists($field, $body)) $clean[$field] = $body[$field];
        if (empty($clean['name']) || empty($clean['reward_amount'])) fail(400, 'Airdrop name and reward are required.');
        $clean['status'] = 'live';
        $result = supabaseRequest($base, $key, 'POST', 'airdrops?select=*', $clean, ['Prefer: return=representation']);
        echo $result['raw'];
        return;
    }
    if ($method === 'PATCH') {
        if (!$query || !isset($_GET['id'])) fail(400, 'A record id is required.');
        if ($table === 'airdrops') {
            $fields = ['name','logo','reward_amount','task','chain','risk','deadline','url','image_url','topics','status'];
        } else {
            $fields = ['subscribed','topics','frequency','farmer_name'];
        }
        $clean = [];
        foreach ($fields as $field) if (array_key_exists($field, $body)) $clean[$field] = $body[$field];
        if (!$clean) fail(400, 'No permitted fields supplied.');
        $result = supabaseRequest($base, $key, 'PATCH', $table . '?' . implode('&', $query), $clean, ['Prefer: return=representation']);
        echo $result['raw'];
        return;
    }
    if ($method === 'DELETE') {
        if ($table !== 'airdrops' || !isset($_GET['id'])) fail(403, 'Delete not permitted.');
        $result = supabaseRequest($base, $key, 'DELETE', $table . '?' . implode('&', $query), null, ['Prefer: return=representation']);
        echo $result['raw'];
        return;
    }
}
function subscribePublic(string $base, string $key, string $resendKey, string $unsubscribeSecret, string $ip): void {
    $body = readJson();
    $email = strtolower(trim((string)($body['email'] ?? '')));
    $name = trim(strip_tags((string)($body['farmerName'] ?? $body['farmer_name'] ?? '')));
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254) fail(400, 'Enter a valid email address.');
    if (strlen($name) > 100) fail(400, 'Name is too long.');
    if (!empty($body['website'])) { echo json_encode(['success' => true]); return; }
    $blocked = ['mailinator.com','guerrillamail.com','tempmail.com','throwam.com','yopmail.com','sharklasers.com'];
    $domain = strtolower(substr(strrchr($email, '@') ?: '', 1));
    if (in_array($domain, $blocked, true)) fail(400, 'Please use a permanent email address.');
    $lookup = supabaseRequest($base, $key, 'GET', 'subscribers?email=eq.' . rawurlencode($email) . '&select=id,subscribed,farmer_name&limit=1');
    $existing = is_array($lookup['data']) && count($lookup['data']) ? $lookup['data'][0] : null;
    if ($existing && !empty($existing['subscribed'])) {
        echo json_encode(['success' => true, 'message' => 'Already subscribed.']);
        return;
    }
    $payload = [
        'email' => $email,
        'farmer_name' => $name !== '' ? $name : ($existing['farmer_name'] ?? null),
        'subscribed' => true,
        'subscribed_at' => gmdate('c'),
        'unsubscribed_at' => null,
        'updated_at' => gmdate('c'),
    ];
    if ($existing) {
        supabaseRequest($base, $key, 'PATCH', 'subscribers?id=eq.' . rawurlencode((string)$existing['id']), $payload);
    } else {
        $payload['topics'] = is_array($body['topics'] ?? null) ? array_slice(array_values(array_filter($body['topics'], 'is_string')), 0, 20) : [];
        $payload['frequency'] = in_array(($body['frequency'] ?? 'weekly'), ['daily','weekly','monthly'], true) ? $body['frequency'] : 'weekly';
        $payload['created_at'] = gmdate('c');
        supabaseRequest($base, $key, 'POST', 'subscribers', $payload);
    }
    $displayName = htmlspecialchars($name !== '' ? $name : 'Web3 learner', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $unsubscribeToken = hash_hmac('sha256', $email, $unsubscribeSecret);
    $unsubscribeUrl = 'https://web3farmyard.com/api-proxy.php?action=unsubscribe&email=' . rawurlencode($email) . '&token=' . $unsubscribeToken;
    $welcome = '<html><body style="background:#080808;color:#d0d0d0;font-family:Georgia,serif;padding:40px"><div style="max-width:560px;margin:0 auto"><div style="font-family:monospace;font-size:10px;color:#c8ff00;letter-spacing:.2em;margin-bottom:12px">WEB3FARMYARD.COM</div><h1 style="font-size:22px;color:#f0f0f0">Welcome to the Farmyard, ' . $displayName . '.</h1><p style="color:#aaa;line-height:1.8">You will hear from us when there is something worth reading.</p><a href="https://web3farmyard.com" style="color:#c8ff00">Visit Web3Farmyard</a><p style="margin-top:28px;font-size:12px"><a href="' . htmlspecialchars($unsubscribeUrl, ENT_QUOTES, 'UTF-8') . '" style="color:#888">Unsubscribe</a></p></div></body></html>';
    resendSend($resendKey, $email, 'Welcome to Web3Farmyard 🌾', $welcome);
    echo json_encode(['success' => true, 'message' => 'Welcome to Web3Farmyard.']);
}
function unsubscribePublic(string $base, string $key, string $secret): void {
    $email = strtolower(trim((string)($_GET['email'] ?? '')));
    $token = (string)($_GET['token'] ?? '');
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !hash_equals(hash_hmac('sha256', $email, $secret), $token)) fail(400, 'Invalid unsubscribe link.');
    supabaseRequest($base, $key, 'PATCH', 'subscribers?email=eq.' . rawurlencode($email), ['subscribed' => false, 'unsubscribed_at' => gmdate('c')]);
    header('Content-Type: text/html; charset=utf-8');
    echo '<!doctype html><html><body style="background:#080808;color:#ddd;font-family:Arial,sans-serif;text-align:center;padding:80px"><h1>Unsubscribed</h1><p>You have been removed from the Web3Farmyard mailing list.</p><a href="https://web3farmyard.com" style="color:#c8ff00">Back to Web3Farmyard</a></body></html>';
}
function resendSend(string $key, string $email, string $subject, string $html): bool {
    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $key, 'Content-Type: application/json'],
        CURLOPT_POSTFIELDS => json_encode(['from' => 'Web3Farmyard <newsletter@web3farmyard.com>', 'to' => [$email], 'subject' => $subject, 'html' => $html]),
        CURLOPT_TIMEOUT => 20,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);
    $response = curl_exec($ch);
    $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return $response !== false && $status >= 200 && $status < 300;
}

function trackAnalytics(string $base, string $key, string $ip): void {
    $body = readJson();
    $eventType = trim((string)($body['event_type'] ?? $body['event'] ?? ''));
    $page = trim((string)($body['page'] ?? ''));
    if (!preg_match('/^[a-zA-Z0-9_.:-]{1,80}$/', $eventType)) fail(400, 'Invalid analytics event type.');
    if ($page === '' || strlen($page) > 2048) fail(400, 'Invalid analytics page.');
    $duration = $body['duration_ms'] ?? $body['duration'] ?? null;
    if ($duration !== null && (!is_numeric($duration) || (int)$duration < 0 || (int)$duration > 3600000)) fail(400, 'Invalid duration.');
    $metadata = is_array($body['metadata'] ?? null) ? $body['metadata'] : [];
    unset($metadata['email'], $metadata['user_email'], $metadata['userEmail']);
    $metadataJson = json_encode($metadata, JSON_UNESCAPED_SLASHES);
    if ($metadataJson === false || strlen($metadataJson) > 10000) fail(400, 'Analytics metadata is too large.');
    supabaseRequest($base, $key, 'POST', 'analytics_events', [
        'event_type' => $eventType,
        'page' => $page,
        'metadata' => $metadata,
        'duration_ms' => $duration === null ? null : (int)$duration,
        'timestamp' => gmdate('c'),
    ]);
    echo json_encode(['success' => true]);
}

function sendNewsletter(string $base, string $key, string $resendKey, string $unsubscribeSecret): void {
    $body = readJson();
    $subject = trim((string)($body['subject'] ?? ''));
    $content = (string)($body['content'] ?? '');
    $topic = (string)($body['topic'] ?? 'all');
    if ($subject === '' || strlen($subject) > 200 || trim($content) === '' || strlen($content) > 100000) fail(400, 'Subject and content are required and must be within limits.');
    if ($topic !== 'all' && !preg_match('/^[a-z0-9_-]{1,40}$/', $topic)) fail(400, 'Invalid topic.');
    $result = supabaseRequest($base, $key, 'GET', 'subscribers?subscribed=eq.true&select=email,farmer_name,topics&limit=1000');
    $recipients = is_array($result['data']) ? $result['data'] : [];
    if ($topic !== 'all') $recipients = array_values(array_filter($recipients, static fn($s) => is_array($s['topics'] ?? null) && in_array($topic, $s['topics'], true)));
    if (!$recipients) {
        echo json_encode(['successCount' => 0, 'failureCount' => 0, 'total' => 0, 'message' => 'No subscribers match this audience.']);
        return;
    }
    $success = 0;
    $failure = 0;
    foreach ($recipients as $recipient) {
        $name = htmlspecialchars((string)($recipient['farmer_name'] ?? 'Web3 learner'), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $recipientEmail = strtolower((string)$recipient['email']);
        $unsubscribeToken = hash_hmac('sha256', $recipientEmail, $unsubscribeSecret);
        $unsubscribeUrl = 'https://web3farmyard.com/api-proxy.php?action=unsubscribe&email=' . rawurlencode($recipientEmail) . '&token=' . $unsubscribeToken;
        $html = '<!doctype html><html><body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:24px"><main style="max-width:640px;margin:auto;background:#fff;padding:32px"><h2>Hello ' . $name . ',</h2><div style="line-height:1.7;color:#333">' . $content . '</div><hr><p style="font-size:12px;color:#777">You receive this because you subscribed to Web3Farmyard. <a href="https://web3farmyard.com">Visit the site</a> · <a href="' . htmlspecialchars($unsubscribeUrl, ENT_QUOTES, 'UTF-8') . '">Unsubscribe</a>.</p></main></body></html>';
        if (resendSend($resendKey, (string)$recipient['email'], $subject, $html)) $success++; else $failure++;
        usleep(120000);
    }
    supabaseRequest($base, $key, 'POST', 'newsletter_sends', [
        'subject' => $subject,
        'content' => $content,
        'recipient_count' => count($recipients),
        'sent_count' => $success,
        'status' => $failure === 0 ? 'sent' : 'partial',
        'sent_at' => gmdate('c'),
    ]);
    echo json_encode(['successCount' => $success, 'failureCount' => $failure, 'total' => count($recipients), 'message' => 'Newsletter processing completed.']);
}
function proxyJson(string $url, array $payload, array $headers): void {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_TIMEOUT => 45,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);
    $response = curl_exec($ch);
    $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($response === false) fail(502, 'Upstream service request failed.');
    http_response_code($status ?: 502);
    echo $response;
}
