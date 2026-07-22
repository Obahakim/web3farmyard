# Security Architecture

## Baseline Controls

- TLS is expected at the edge in production.
- The web middleware applies defensive browser security headers and request IDs.
- Zod validation is centralized in `@deepn/security`.
- Rate limiting uses an adapter interface with an in-memory development implementation and Redis-ready architecture.
- Audit logs hash IP and user-agent values and never store private emotional content.

## Encryption

`@deepn/encryption` provides AES-256-GCM field encryption for server-side sensitive fields. The Locked Vault design is intentionally stricter: clients derive keys from a secondary PIN/passphrase, encrypt locally, and the server cannot recover forgotten locked data.

## AI Privacy

AI processing must be explicit and opt-in. Plaintext should only exist transiently during processing. Provider adapters must be swappable so DeePn can move from OpenAI API to self-hosted models when privacy, cost, or scale requires it.

## Authentication System

The authentication system uses Better Auth with the Prisma adapter and hashed, single-use magic-link verification tokens. Session state is stored in PostgreSQL, cached in a short-lived cookie by Better Auth, and exposed through protected server utilities instead of trusting client state.

Protected application routes are enforced in two layers:

1. `apps/web/middleware.ts` performs a fast cookie-presence redirect for known protected URL prefixes.
2. `apps/web/app/(protected)/layout.tsx` calls the server-side Better Auth session API and redirects unauthenticated users.

Account and privacy mutations are implemented as server actions. Every mutation validates input with Zod, requires a server-side session, updates only the authenticated user's rows, and writes content-free audit events.
