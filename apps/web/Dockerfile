FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ── 1. Install all dependencies ────────────────────────────────────────────
FROM base AS deps
WORKDIR /app

# Copy manifests only (better layer caching)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/web/package.json ./apps/web/package.json
COPY apps/api/package.json ./apps/api/package.json

# Install native build tools needed by better-sqlite3 / sharp
RUN apk add --no-cache python3 make g++ libc6-compat

RUN pnpm install --frozen-lockfile

# ── 2. Build Next.js app ───────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY . .

# NEXT_PUBLIC_* vars are baked into the client bundle at build time
ARG NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SOLANA_RPC_URL=$NEXT_PUBLIC_SOLANA_RPC_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter @omenaai/web build

# ── 3. Production runner ───────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Standalone output bundles everything needed to run
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "apps/web/server.js"]
