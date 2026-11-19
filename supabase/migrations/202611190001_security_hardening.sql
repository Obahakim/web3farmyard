-- Web3Farmyard public API least-privilege hardening
-- Applied to the connected production project on 2026-11-19.
-- Safe to re-run: policies are dropped before recreation.

BEGIN;

-- Revoke broad API access. The PHP proxy uses service_role server-side.
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM anon, authenticated, PUBLIC;
REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated, PUBLIC;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL ON TABLES FROM anon, authenticated, PUBLIC;

-- Explicit public content reads.
GRANT SELECT ON TABLE public.airdrops, public.junkyard, public.posts,
  public.chat_messages, public.comments TO anon, authenticated;

-- Explicit public submissions. RLS policies constrain rows and fields.
GRANT INSERT ON TABLE public.airdrops, public.junkyard,
  public.chat_messages, public.comments, public.messages TO anon, authenticated;

-- Airdrops use a sequence-backed numeric ID. Other public submission IDs
-- are generated without a public sequence grant.
GRANT USAGE ON SEQUENCE public.airdrops_id_seq TO anon, authenticated;

-- Private/admin data is accessible only through authenticated server-side code.
REVOKE ALL PRIVILEGES ON TABLE public.subscribers, public.farmer_profiles,
  public.user_progress, public.newsletter_sends, public.analytics_events
  FROM anon, authenticated, PUBLIC;

-- Remove overly broad and obsolete write policies.
DROP POLICY IF EXISTS comments_admin_write ON public.comments;
DROP POLICY IF EXISTS comments_public_insert_pending ON public.comments;
DROP POLICY IF EXISTS messages_admin_all ON public.messages;
DROP POLICY IF EXISTS messages_public_insert ON public.messages;
DROP POLICY IF EXISTS messages_public_insert_validated ON public.messages;
DROP POLICY IF EXISTS analytics_events_public_insert ON public.analytics_events;

-- Public comments may only be created as pending, bounded submissions.
CREATE POLICY comments_public_insert_pending
  ON public.comments FOR INSERT TO anon, authenticated
  WITH CHECK (
    status = 'pending'
    AND NULLIF(btrim(body), '') IS NOT NULL
    AND char_length(body) <= 2000
    AND char_length(COALESCE(alias, 'Anonymous')) <= 40
  );

-- Contact form submissions are insert-only and field-bounded.
CREATE POLICY messages_public_insert_validated
  ON public.messages FOR INSERT TO anon, authenticated
  WITH CHECK (
    NULLIF(btrim(name), '') IS NOT NULL
    AND char_length(name) <= 100
    AND email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
    AND char_length(email) <= 254
    AND char_length(COALESCE(subject, '')) <= 200
    AND NULLIF(btrim(body), '') IS NOT NULL
    AND char_length(body) <= 10000
  );

-- Analytics ingestion now goes through the rate-limited PHP proxy.
-- Public and authenticated clients cannot write directly to analytics_events.

-- Keep RLS enabled on every application table.
ALTER TABLE public.airdrops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.junkyard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_sends ENABLE ROW LEVEL SECURITY;

-- The old public SECURITY DEFINER signup RPC is no longer used; PHP handles
-- signup with server-side service_role access and validation.
REVOKE ALL PRIVILEGES ON FUNCTION public.subscribe_newsletter(text, text)
  FROM PUBLIC, anon, authenticated;

-- Pin function search paths to avoid search_path hijacking.
ALTER FUNCTION public.pgrst_watch() SET search_path = pg_catalog;
ALTER FUNCTION public.set_updated_at() SET search_path = pg_catalog;
ALTER FUNCTION public.subscribe_newsletter(text, text) SET search_path = pg_catalog;

COMMIT;
