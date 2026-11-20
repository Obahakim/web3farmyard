# Admin dashboard and YouTube video library

The admin dashboard is available at `/hakim/dashboard` after signing in.

## YouTube workflow

1. Paste a YouTube watch URL, Shorts URL, youtu.be URL, or 11-character video ID.
2. Select **Fetch Preview**. The authenticated PHP proxy validates the host and retrieves title, channel and thumbnail metadata from YouTube oEmbed.
3. Review the embedded player and metadata. Add an editorial summary and at least one difficulty level.
4. Categories are stored for admin-side filtering only; no public category UI is enabled yet. Search tags are separate: add up to 20 comma-separated terms (for example `nft-live-streaming`, `nft-marketplace`, `nft-minting`) that accurately describe the lesson.
5. Save as Draft, Approved or Rejected. Only Approved records are returned by the public Videos endpoint.
6. Use Featured and Display Order to control public presentation.

Only admin sessions with a valid CSRF token can preview or change records. The `youtube_videos` table has RLS enabled and no anon/authenticated table or sequence grants. The PHP proxy uses the server-side Supabase secret.

## Public Videos catalogue

The public catalogue is `/videos/` and is linked from the main site navigation. It reads approved records from `api-proxy.php?action=public-videos`; the PHP proxy uses the server-side Supabase secret and returns only selected editorial fields for approved records. The underlying `youtube_videos` table remains private with RLS enabled and no anon/authenticated grants. The catalogue supports search across title, channel, summary and tags, plus difficulty filtering. Lesson playback is available at `/videos/watch/?v=<record-id>` using the YouTube privacy-enhanced embed domain.

The catalogue is included in the sitemap and has page-level SEO metadata for NFT tutorials, NFT live streaming, NFT livestreams, NFT minting, NFT marketplaces, NFT collections, NFT gaming, NFT art, Web3 creators and blockchain education. Do not add a tag to a video unless that topic is genuinely covered by it.

## Welcome email

New newsletter subscriptions receive the onboarding message in `api-proxy.php`. It links to Airdrops, Showroom, Junkyard, Toolkit and Blog and includes the signed unsubscribe link.

## Deployment

Apply both migrations in order: `supabase/migrations/20261120010652_youtube_video_library.sql` and `supabase/migrations/20261120050450_add_youtube_video_search_tags.sql`. Both have been applied to the production Web3Farmyard Supabase project; the `tags` column and private-table RLS state were verified.

Build from the repository root with `npm ci` and `npm run build`. Upload the contents of `out/` to Hostinger `public_html/`, retaining the existing Showroom cron/data endpoint files and `uploads/` folder as documented in `README-DEPLOY.md`. Keep the secrets file outside `public_html/`.
