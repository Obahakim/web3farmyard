# Hostinger API proxy security setup

The site is deployed as a static export. Copy the repository-root `api-proxy.php` into the generated `out/` folder before uploading the contents of `out/` to Hostinger `public_html/`.

## 1. Create a private secrets file

Do not place this file inside `public_html`, the repository, or the Next.js `public/` folder.

The proxy looks by default for:

```
/home/<account>/domains/web3farmyard.com/private/web3farmyard-secrets.php
```

That is a sibling of `public_html`. If your Hostinger directory layout differs, set the server environment variable `W3F_CONFIG_PATH` to the absolute path of the private file.

Create the file with this structure:

```php
<?php
return [
    'supabase_url' => 'https://YOUR_PROJECT_REF.supabase.co',
    'supabase_service_role_key' => 'YOUR_ROTATED_SUPABASE_SERVICE_ROLE_KEY',
    'resend_api_key' => 'YOUR_ROTATED_RESEND_API_KEY',
    'anthropic_api_key' => 'YOUR_ROTATED_ANTHROPIC_API_KEY',
    'admin_password_hash' => 'OPTIONAL_PASSWORD_HASH',
    // If you cannot generate a PHP password hash yet, use admin_password temporarily.
    // This file must remain outside public_html and readable only by your hosting account.
    // 'admin_password' => 'A_LONG_UNIQUE_ADMIN_PASSWORD',
    'session_secret' => 'REPLACE_WITH_AT_LEAST_64_RANDOM_CHARACTERS',
    'unsubscribe_secret' => 'REPLACE_WITH_A_DIFFERENT_64_CHARACTER_RANDOM_SECRET',
];
```

Use either `admin_password_hash` (recommended) or `admin_password`, not both. Never commit the real secrets file.

## 2. Secret handling

- Supabase service-role key: server-side only. Never prefix it with `NEXT_PUBLIC_`.
- Resend and Anthropic keys: use newly rotated values.
- Admin password: replace the old dashboard password. Do not reuse the old password.
- Session and unsubscribe secrets: generate two different random values. Do not reuse API keys for either.
- Restrict the private file to the hosting account (normally file permission 600 or the tightest available permission).

## 3. Deployment

1. Build the static site.
2. Copy `api-proxy.php` into the root of `out/`.
3. Upload the contents of `out/` to `public_html/`.
4. Upload the private secrets file to the private path above.
5. Open `https://www.web3farmyard.com/api-proxy.php?action=admin-session`. A JSON response with `authenticated:false` and HTTP 401 is expected when logged out. A PHP error or 500 means the config path/values need attention.
6. Do not test the admin login until the dashboard frontend using the new session endpoints is deployed.

## 4. Important compatibility notes

- This proxy intentionally removes the generic Supabase table pass-through and old Resend-derived admin token.
- Public newsletter signup is handled server-side and does not expose subscriber rows.
- Public onboarding progress is not written to the database until a verifiable learner identity is available. The existing browser-side streak remains local to that browser.
- Admin operations are allowlisted by table and HTTP method; arbitrary table names and arbitrary PostgREST filters are not accepted.
