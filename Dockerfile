# syntax=docker/dockerfile:1.7
FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /app

# Dependencies layer
FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json pnpm-lock.yaml .npmrc* ./
RUN corepack prepare pnpm@11.1.1 --activate
# pnpm 11 blocks build scripts (sharp, unrs-resolver) unless explicitly allowed.
# Inside an isolated Docker build we trust our own lockfile, so allow all.
RUN pnpm install --frozen-lockfile --dangerously-allow-all-builds

# Builder layer
FROM base AS builder
WORKDIR /app
RUN corepack prepare pnpm@11.1.1 --activate
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_CALENDLY_URL
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_CALENDLY_URL=$NEXT_PUBLIC_CALENDLY_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=2048"

RUN pnpm build

# Runtime layer
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static    ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public          ./public

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
