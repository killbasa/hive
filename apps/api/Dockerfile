## Base ##
FROM node:20.11.1-alpine3.19 as base

RUN apk update --no-cache

## Builder ##
FROM base as builder

ENV NODE_ENV=production

WORKDIR /temp

COPY .yarn .yarn/
COPY scripts ./scripts/
COPY .yarnrc.yml yarn.lock package.json ./
COPY apps/api ./apps/api/

RUN yarn install && \
	yarn workspace hive build && \
	yarn workspaces focus hive --production

## App ##
FROM base as app

LABEL org.opencontainers.image.source=https://github.com/killbasa/hive
LABEL org.opencontainers.image.licenses=AGPL-3.0-or-later

WORKDIR /app

RUN addgroup --system --gid 1001 hive && \
	adduser --system --uid 1001 hive

USER hive

COPY --from=builder --chown=hive:hive /temp/node_modules node_modules/
COPY --from=builder --chown=hive:hive /temp/apps/api/db db/
COPY --from=builder --chown=hive:hive /temp/apps/api/dist dist/
COPY --from=builder --chown=hive:hive /temp/apps/api/package.json ./

RUN apk add --no-cache ffmpeg && \
	mkdir -p /data/ && \
	wget -q https://github.com/yt-dlp/yt-dlp-master-builds/releases/download/2024.03.09.155247/yt-dlp && \
	mv yt-dlp /data/ && \
	chmod +x /data/yt-dlp && \
	chown -R hive:hive /data/

CMD ["node", "--enable-source-maps", "dist/server.js"]
