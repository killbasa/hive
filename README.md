# Hive

## Contibuting

Setup .env files

```sh
cp apps/api/.env.example apps/api/.env
cp apps/backup/.env.example apps/backup/.env
cp apps/chat/.env.example apps/chat/.env
cp apps/web/.env.example apps/web/.env
```

Start services

```sh
docker compose up -d
```

Build applications

```sh
yarn build
```
