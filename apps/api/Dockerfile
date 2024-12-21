## Base ##
FROM node:22.12.0-alpine3.20 AS base

# python: sqlite compilation and supervisord
# ffmpeg: video post-processing
# nginx: serve static files and reverse proxy
# supervisor: run multiple processes in a container
RUN apk update --no-cache && \
	apk add --no-cache \
		python3=3.12.7-r0 \
		ffmpeg=6.1.1-r8 \
		nginx=1.26.2-r0 \
		supervisor=4.2.5-r5

## Depdencies ##
FROM alpine:3.20 AS dependencies

RUN wget -q https://github.com/yt-dlp/yt-dlp/releases/download/2024.11.18/yt-dlp \
		-O /tmp/yt-dlp && \
	chmod +x /tmp/yt-dlp

## Builder ##
FROM base AS builder

WORKDIR /temp

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# If there's no sqlite pre-built binary, we need to build it
RUN apk add --no-cache \
	build-base=0.5-r3

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.json ./
COPY apps/api ./apps/api/
COPY packages ./packages/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
	corepack enable pnpm && \
	corepack use pnpm@9.15.1 && \
	pnpm install && \
	pnpm --filter @hive/common run build && \
	pnpm --filter @hive/api run build:prod && \
	mkdir output && \
	pnpm --filter @hive/api deploy --prod output

## App ##
FROM base AS app

LABEL org.opencontainers.image.source=https://github.com/killbasa/hive
LABEL org.opencontainers.image.licenses=AGPL-3.0-or-later

ENV NODE_ENV=production
ENV PATH=/hive/bin:$PATH

RUN adduser --system --uid 1001 hive && \
	addgroup --system --gid 1001 hive && \
	mkdir -p /var/lib/hive/media && mkdir -p /var/lib/hive/downloads && chown -R hive:hive /var/lib/hive && \
	mkdir -p /hive/bin && chown -R hive:hive /hive/bin

# setup nginx - https://hg.nginx.org/nginx/
RUN chown -R hive:hive /var/lib/nginx && \
	chown -R hive:hive /var/log/nginx && \
	touch /run/nginx/nginx.pid && chown -R hive:hive /run/nginx/nginx.pid

# setup supervisord - https://github.com/Supervisor/supervisor
RUN mkdir -p /var/log/supervisor && chown -R hive:hive /var/log/supervisor && \
	mkdir -p /var/run/supervisor && chown -R hive:hive /var/run/supervisor && \
	touch /hive/supervisord.pid && chown -R hive:hive /hive/supervisord.pid

WORKDIR /hive

COPY --from=dependencies --chown=hive:hive /tmp/yt-dlp bin/
COPY --from=builder --chown=hive:hive /temp/apps/api/configs/supervisord.conf /etc/supervisord.conf
COPY --from=builder --chown=hive:hive /temp/apps/api/configs/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder --chown=hive:hive /temp/output/ ./

USER hive:hive

VOLUME /var/lib/hive

EXPOSE 3001

CMD ["/usr/bin/supervisord"]
