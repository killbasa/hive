## Base ##
FROM node:22.13.1-alpine3.21 AS base

RUN apk update --no-cache

## Builder ##
FROM base AS builder

WORKDIR /temp

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# ref: https://github.com/nodejs/corepack/issues/612#issuecomment-2631462297
ENV COREPACK_INTEGRITY_KEYS="{\"npm\":[{\"expires\":\"2025-01-29T00:00:00.000Z\",\"keyid\":\"SHA256:jl3bwswu80PjjokCgh0o2w5c2U4LhQAE57gj9cz1kzA\",\"keytype\":\"ecdsa-sha2-nistp256\",\"scheme\":\"ecdsa-sha2-nistp256\",\"key\":\"MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE1Olb3zMAFFxXKHiIkQO5cJ3Yhl5i6UPp+IhuteBJbuHcA5UogKo0EWtlWwW6KSaKoTNEYL7JlCQiVnkhBktUgg==\"},{\"expires\":null,\"keyid\":\"SHA256:DhQ8wR5APBvFHLF/+Tc+AYvPOdTpcIDqOhxsBHRwC7U\",\"keytype\":\"ecdsa-sha2-nistp256\",\"scheme\":\"ecdsa-sha2-nistp256\",\"key\":\"MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEY6Ya7W++7aUPzvMTrezH6Ycx3c+HOKYCcNGybJZSCJq/fd7Qa8uuAKtdIkUQtQiEKERhAmE5lMMJhP8OkDOa2g==\"}]}"

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.json .npmrc ./
COPY apps/web ./apps/web/
COPY packages ./packages/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
	corepack enable pnpm && \
	corepack use pnpm@10.4.0 && \
	pnpm install && \
	pnpm --filter @hive/common run build && \
	pnpm --filter @hive/web run build && \
	pnpm --filter @hive/web deploy --prod output

## App ##
FROM base AS app

LABEL org.opencontainers.image.source=https://github.com/killbasa/hive
LABEL org.opencontainers.image.licenses=AGPL-3.0-or-later

ENV NODE_ENV=production

RUN adduser --system --uid 1001 hive && \
	addgroup --system --gid 1001 hive

WORKDIR /hive

USER hive:hive

COPY --from=builder --chown=hive:hive /temp/output/ ./

CMD ["node", "--enable-source-maps", "dist/index.js"]
