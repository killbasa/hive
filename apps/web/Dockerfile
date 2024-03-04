FROM node:20.11.1-alpine3.19 as base

ARG API_URL
ENV VITE_API_URL=${API_URL}

WORKDIR /app

COPY .yarn .yarn/
COPY .yarnrc.yml yarn.lock package.json ./
COPY apps/web ./apps/web/

RUN yarn install && \
	yarn workspace hive-web build

FROM nginx:1.25.4-alpine3.18

COPY --from=base /app/apps/web/dist /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
