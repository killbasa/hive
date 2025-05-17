## Base ##
FROM node:24.0.1-alpine3.21 AS base

# python: sqlite compilation and supervisord
# ffmpeg: video post-processing
# nginx: serve static files and reverse proxy
# supervisor: run multiple processes in a container
RUN apk update --no-cache && \
	apk add --no-cache \
		python3=3.12.10-r0 \
		ffmpeg=6.1.2-r1 \
		nginx=1.26.3-r0 \
		supervisor=4.2.5-r5

## Depdencies ##
FROM alpine@sha256:a8560b36e8b8210634f77d9f7f9efd7ffa463e380b75e2e74aff4511df3ef88c AS dependencies

RUN wget -q https://github.com/yt-dlp/yt-dlp/releases/download/2025.04.30/yt-dlp \
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
COPY apps/web ./apps/web/
COPY packages ./packages/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
	corepack enable pnpm && \
	corepack use pnpm@10.11.0 && \
	pnpm install && \
	pnpm --recursive run build && \
	pnpm --filter @hive/api run build:prod && \
	mkdir -p output/api && mkdir -p output/ui && \
	pnpm --filter @hive/api deploy --prod output/api && pnpm --filter @hive/web deploy --prod output/ui

## App ##
FROM base AS app

LABEL org.opencontainers.image.authors="killbasa <git@killbasa.com>"
LABEL org.opencontainers.image.source=https://github.com/killbasa/hive
LABEL org.opencontainers.image.licenses=AGPL-3.0-or-later

ENV NODE_ENV=production
ENV IS_CONTAINER=true
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
