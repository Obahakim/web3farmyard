# Web3Farmyard v2.0 — Next.js Static Export

## Local Build Steps (run on your computer)

1. Install Node.js 18+ from https://nodejs.org
2. Extract this ZIP to a folder
3. Open terminal in that folder and run:

```bash
npm install
npm run build
```

4. The `out/` folder is generated — this is your website
5. Also copy into the `out/` folder:
   - `api-proxy.php` (from your existing Hostinger files)
   - `hakim.html` (admin panel)
   - `uploads/` folder (ebook PDF)
   - `SUPABASE_RUN_THIS.sql` (run in Supabase SQL Editor first)

## Upload to Hostinger

Upload the ENTIRE contents of `out/` to `public_html/`.
The `.htaccess` file is included automatically in the build.

## Environment Variables

Create `.env.local` in the project root:
```
NEXT_PUBLIC_SUPA_URL=https://lzanqqvvpwccrtprzxvu.supabase.co
NEXT_PUBLIC_SUPA_KEY=sb_publishable_L9yp9YHqL9vfSkJKTFKaoA_NhqV4dbA
```

## What This Generates

- `/` — Homepage
- `/airdrops/` — Airdrop listings  
- `/showroom/` — Chain TVL grid
- `/showroom/[chain]/` — Individual page for EVERY chain (~200+ pages)
- `/junkyard/` — Dead projects grid
- `/junkyard/[project]/` — Individual project post-mortems
- `/resources/mobile-farmer/` — Ebook landing page
- `/sitemap.xml` — Auto-generated with all 200+ chain pages
- `/robots.txt` — Proper crawl rules

## PageSpeed Expectations
- Desktop: 90-95
- Mobile: 80-88
- No render-blocking resources (Babel is gone)
- CSS is Tailwind — compiled, cached, tiny
- Fonts: Google Fonts with display=swap (no render-block)
