## Base ##
FROM node:23.11.0-alpine3.21 AS base

# python: sqlite compilation and supervisord
# ffmpeg: video post-processing
# nginx: serve static files and reverse proxy
# supervisor: run multiple processes in a container
RUN apk update --no-cache && \
	apk add --no-cache \
		python3=3.12.10-r0 \
		ffmpeg=6.1.2-r2 \
		nginx=1.26.3-r4 \
		supervisor=4.2.5-r5

## Depdencies ##
FROM alpine:2436f2b3b7d2 AS dependencies

RUN wget -q https://github.com/yt-dlp/yt-dlp/releases/download/2025.01.26/yt-dlp \
		-O /tmp/yt-dlp && \
	chmod +x /tmp/yt-dlp

## Builder ##
FROM base AS builder

WORKDIR /temp

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# ref: https://github.com/nodejs/corepack/issues/612#issuecomment-2631462297
ENV COREPACK_INTEGRITY_KEYS="{\"npm\":[{\"expires\":\"2025-01-29T00:00:00.000Z\",\"keyid\":\"SHA256:jl3bwswu80PjjokCgh0o2w5c2U4LhQAE57gj9cz1kzA\",\"keytype\":\"ecdsa-sha2-nistp256\",\"scheme\":\"ecdsa-sha2-nistp256\",\"key\":\"MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE1Olb3zMAFFxXKHiIkQO5cJ3Yhl5i6UPp+IhuteBJbuHcA5UogKo0EWtlWwW6KSaKoTNEYL7JlCQiVnkhBktUgg==\"},{\"expires\":null,\"keyid\":\"SHA256:DhQ8wR5APBvFHLF/+Tc+AYvPOdTpcIDqOhxsBHRwC7U\",\"keytype\":\"ecdsa-sha2-nistp256\",\"scheme\":\"ecdsa-sha2-nistp256\",\"key\":\"MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEY6Ya7W++7aUPzvMTrezH6Ycx3c+HOKYCcNGybJZSCJq/fd7Qa8uuAKtdIkUQtQiEKERhAmE5lMMJhP8OkDOa2g==\"}]}"

# If there's no sqlite pre-built binary, we need to build it
RUN apk add --no-cache \
	build-base=0.5-r3

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.json .npmrc ./
COPY apps/api ./apps/api/
COPY packages ./packages/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
	corepack enable pnpm && \
	corepack use pnpm@10.8.1 && \
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
