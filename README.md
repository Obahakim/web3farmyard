# DeePn

**Your Private Emotional Vault**

This repository is the production-ready foundation for DeePn: a privacy-first emotional wellness platform designed to support the Emotional Vault, Audio Dumps, AI Companion, Locked Vault, Emotional Timeline, future Commons, future Sleepagotchi integration, and future self-hosted AI.

## Stack

- Next.js 15 App Router, TypeScript, Tailwind CSS, shadcn/ui-ready configuration
- Next.js Route Handlers and Server Actions
- PostgreSQL with Prisma ORM
- Better Auth with email magic-link architecture and passkey/wallet extension points
- Redis and BullMQ workers
- S3-compatible storage abstraction plus local development storage
- OpenAI provider behind a provider-agnostic AI interface
- Field-level encryption, audit logging, rate limiting, Zod validation, and security headers

## Local Development

```bash
cp .env.example .env
docker compose -f infra/docker/docker-compose.yml up -d
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm dev
```

## Monorepo Boundaries

- `apps/web`: Next.js web entrypoint, route handlers, server actions, middleware.
- `packages/auth`: Better Auth configuration and future wallet/passkey auth contracts.
- `packages/database`: Prisma schema, migrations, singleton client.
- `packages/encryption`: field encryption and locked-vault key derivation primitives.
- `packages/ai`: AI provider interface and OpenAI implementation.
- `packages/queue`: BullMQ queue contracts and worker helpers.
- `packages/storage`: local and S3-compatible storage adapters.
- `packages/security`: validation, rate-limit interface, security headers.
- `packages/audit`: privacy-preserving audit event writer.
- `packages/types`: cross-package domain types.
- `workers/deepn-worker`: background worker process foundation.

## Authentication Foundation

- Better Auth is mounted at `/api/auth/*` through the App Router catch-all route.
- Email magic links are requested through `requestMagicLinkAction`; generated links are currently logged in development and can be wired to a production email provider.
- Protected route groups use a server layout session check and middleware redirect guard.
- Account, onboarding, privacy, and session-management mutations live under `apps/web/src/actions/auth`.
