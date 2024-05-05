## Base ##
FROM node:22.0.0-alpine3.19 as base

RUN apk update --no-cache

## Builder ##
FROM base as builder

WORKDIR /temp

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.json ./
COPY apps/web ./apps/web/
COPY packages ./packages/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store corepack enable && \
	pnpm install && \
	pnpm --filter @hive/common run build && \
	pnpm --filter @hive/web run build && \
	pnpm --filter @hive/web deploy --prod output

## App ##
FROM base as app

LABEL org.opencontainers.image.source=https://github.com/killbasa/hive
LABEL org.opencontainers.image.licenses=AGPL-3.0-or-later

ENV NODE_ENV=production

RUN adduser --system --uid 1001 hive && \
	addgroup --system --gid 1001 hive

WORKDIR /hive

USER hive:hive

COPY --from=builder --chown=hive:hive /temp/output/ ./

CMD ["node", "--enable-source-maps", "dist/index.js"]
