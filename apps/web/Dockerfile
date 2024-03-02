FROM node:20.11.1-alpine3.19 as base

ARG API_URL
ENV VITE_API_URL=${API_URL}

WORKDIR /app

COPY .yarn .yarn/
COPY .yarnrc.yml yarn.lock package.json ./
COPY apps/web ./apps/web/

RUN yarn install && \
	yarn workspace hive-web build && \
	yarn workspaces focus hive-web --production

FROM nginx:1.25.4-alpine3.18

COPY --from=base /app/apps/web/dist /usr/share/nginx/html
RUN <<EOF cat >> /etc/nginx/conf.d/default.conf
server {
	listen 80 default_server;

	root /usr/share/nginx/html;
	index index.html;
	try_files $uri $uri/ /index.html;

	location = 50x.html {
		root /usr/share/nginx/html;
	}
}
EOF

CMD ["nginx", "-g", "daemon off;"]
