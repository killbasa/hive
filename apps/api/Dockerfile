## Base ##
FROM node:22.2.0-alpine3.19 as base

# python: sqlite compilation and supervisord
# ffmpeg: video post-processing
# nginx: serve static files and reverse proxy
# supervisor: run multiple processes in a container
RUN apk update --no-cache && \
	apk add --no-cache \
		python3=3.11.9-r0 \
		ffmpeg=6.1.1-r0 \
		nginx=1.24.0-r16 \
		supervisor=4.2.5-r4

## Depdencies ##
FROM alpine:3.19 as dependencies

RUN wget -q https://github.com/yt-dlp/yt-dlp/releases/download/2024.04.09/yt-dlp \
		-O /tmp/yt-dlp && \
	chmod +x /tmp/yt-dlp

RUN wget https://github.com/yt-dlp/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-linux64-gpl.tar.xz \
		-O /tmp/ffmpeg.tar.xz && \
	tar -xf /tmp/ffmpeg.tar.xz -C /tmp && \
	mv /tmp/ffmpeg-master-latest-linux64-gpl/bin/ffmpeg /tmp/ffmpeg && \
	mv /tmp/ffmpeg-master-latest-linux64-gpl/bin/ffprobe /tmp/ffprobe && \
	chmod +x /tmp/ffmpeg && \
	chmod +x /tmp/ffprobe

## Builder ##
FROM base as builder

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
	corepack use pnpm@9.1.2 && \
	pnpm install && \
	pnpm --filter @hive/common run build && \
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
COPY --from=dependencies --chown=hive:hive /tmp/ffmpeg bin/
COPY --from=dependencies --chown=hive:hive /tmp/ffprobe bin/
COPY --from=builder --chown=hive:hive /temp/apps/api/configs/supervisord.conf /etc/supervisord.conf
COPY --from=builder --chown=hive:hive /temp/apps/api/configs/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder --chown=hive:hive /temp/output/ ./

USER hive:hive

VOLUME /var/lib/hive

EXPOSE 3001

CMD ["/usr/bin/supervisord"]
