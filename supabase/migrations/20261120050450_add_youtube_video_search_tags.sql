-- Add public-facing search tags to the admin-managed YouTube video library.
-- The table remains private; the PHP server proxy exposes approved rows only.

BEGIN;
ALTER TABLE public.youtube_videos
  ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}';

ALTER TABLE public.youtube_videos
  DROP CONSTRAINT IF EXISTS youtube_videos_tags_limit_check;
ALTER TABLE public.youtube_videos
  ADD CONSTRAINT youtube_videos_tags_limit_check
  CHECK (cardinality(tags) <= 20);

CREATE INDEX IF NOT EXISTS youtube_videos_tags_gin_idx
  ON public.youtube_videos USING gin (tags);
COMMIT;
