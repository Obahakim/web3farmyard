#!/usr/bin/env bash
set -euo pipefail
cp -n .env.example .env || true
docker compose -f infra/docker/docker-compose.yml up -d
pnpm install
pnpm db:generate
pnpm db:migrate
