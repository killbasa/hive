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
COPY apps/backup ./apps/backup/

RUN yarn install && \
	yarn workspace hive-backup build && \
	yarn workspaces focus hive-backup --production

## App ##
FROM base as app

LABEL org.opencontainers.image.source=https://github.com/killbasa/hive
LABEL org.opencontainers.image.licenses=AGPL-3.0-or-later

WORKDIR /app

RUN addgroup --system --gid 1001 hive && \
	adduser --system --uid 1001 hive

USER hive

COPY --from=builder --chown=hive:hive /temp/node_modules node_modules/
COPY --from=builder --chown=hive:hive /temp/apps/backup/dist dist/
COPY --from=builder --chown=hive:hive /temp/apps/backup/package.json ./

CMD ["node", "--enable-source-maps", "dist/index.js"]
