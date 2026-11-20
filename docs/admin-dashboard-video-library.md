# Admin dashboard and YouTube video library

The admin dashboard is available at `/hakim/dashboard` after signing in.

## YouTube workflow

1. Paste a YouTube watch URL, Shorts URL, youtu.be URL, or 11-character video ID.
2. Select **Fetch Preview**. The authenticated PHP proxy validates the host and retrieves title, channel and thumbnail metadata from YouTube oEmbed.
3. Review the embedded player and metadata. Add an editorial summary and at least one difficulty level.
4. Categories are stored for admin-side filtering only; no public category UI is enabled yet.
5. Save as Draft, Approved or Rejected. Approved records are the only records intended for the later public video catalogue.
6. Use Featured and Display Order to control future public presentation.

Only admin sessions with a valid CSRF token can preview or change records. The `youtube_videos` table has RLS enabled and no anon/authenticated table or sequence grants. The PHP proxy uses the server-side Supabase secret.

## Welcome email

New newsletter subscriptions receive the onboarding message in `api-proxy.php`. It links to Airdrops, Showroom, Junkyard, Toolkit and Blog and includes the signed unsubscribe link.

## Deployment

Apply the migration `supabase/migrations/202611200001_youtube_video_library.sql` to the target Supabase project before deploying the updated static export and PHP proxy. The production Web3Farmyard Supabase project has already had this migration applied and the table/RLS state verified.

Build from the repository root with `npm ci` and `npm run build`. Upload the contents of `out/` to Hostinger `public_html/`, retaining the existing Showroom cron/data endpoint files and `uploads/` folder as documented in `README-DEPLOY.md`. Keep the secrets file outside `public_html/`.
