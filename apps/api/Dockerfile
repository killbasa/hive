## Base ##
FROM node:21.7.3-alpine3.19 as base

RUN apk update --no-cache && \
	apk add --no-cache python3=3.11.8-r0 ffmpeg=6.1.1-r0

## Depdencies ##
FROM alpine:3.19 as dependencies

RUN wget -q https://github.com/yt-dlp/yt-dlp/releases/download/2024.03.10/yt-dlp \
		-O /tmp/yt-dlp && \
	chmod +x /tmp/yt-dlp

## Builder ##
FROM base as builder

WORKDIR /temp

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.json ./
COPY apps/api ./apps/api/
COPY packages ./packages/

RUN corepack enable && \
	pnpm install && \
	pnpm --filter @hive/api run build:prod && \
	mkdir output && \
	pnpm --filter @hive/api deploy --prod output

## App ##
FROM base as app

LABEL org.opencontainers.image.source=https://github.com/killbasa/hive
LABEL org.opencontainers.image.licenses=AGPL-3.0-or-later

ENV NODE_ENV=production
ENV PATH=/hive/bin:$PATH

RUN adduser --system --uid 1001 hive && \
	addgroup --system --gid 1001 hive && \
	mkdir -p /var/lib/hive && \
	mkdir -p /hive/bin && \
	chown -R hive /var/lib/hive && \
	chgrp -R hive /var/lib/hive

WORKDIR /hive

USER hive:hive

COPY --from=dependencies --chown=hive:hive /tmp/yt-dlp bin/
COPY --from=builder --chown=hive:hive /temp/output/ ./

VOLUME /var/lib/hive

CMD ["node", "--enable-source-maps", "dist/server.js"]
