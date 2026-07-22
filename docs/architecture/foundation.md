# DeePn Foundation Architecture

## Domain-Driven Boundaries

DeePn is split by privacy-sensitive domains instead of by framework concerns:

1. **Identity**: Better Auth email magic links now, passkeys and Solana wallet signatures later.
2. **Vault**: encrypted journal payloads, privacy levels, mood metadata, and AI consent flags.
3. **Audio**: encrypted object metadata, transcription status, and transcript storage.
4. **AI**: provider abstraction, mode-aware reflection, transcription, embeddings, safety classification, and future self-hosted routing.
5. **Locked Vault**: client-side encryption boundary. The server stores encrypted blobs only and cannot recover forgotten keys.
6. **Timeline**: asynchronous jobs that derive encrypted summaries and theme metadata from opted-in content.
7. **Storage**: adapter boundary for local development and S3-compatible production storage.
8. **Audit**: content-free security events for accountability without leaking emotional data.
9. **Workers**: background queues for AI, transcription, deletion, export, moderation, and timeline jobs.

## API Structure

- `app/api/auth/[...all]/route.ts`: Better Auth route handler.
- `app/api/health/route.ts`: operational health and feature flag visibility.
- Future feature APIs should live under `app/api/<domain>/route.ts` and delegate to package/domain services.
- Server Actions should remain thin, validated with Zod, audited, and rate-limited.

## Data Sensitivity Rules

- Journal content, transcripts, and AI messages are field-encrypted.
- Audio bytes live in encrypted object storage; database rows store metadata and storage keys only.
- Audit logs never include emotional content.
- Locked Vault content is designed for client-derived keys and no recovery.
