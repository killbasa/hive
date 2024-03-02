# Hive

## Contibuting

Setup .env files

```sh
cp apps/api/.env.example apps/api/.env
cp apps/backup/.env.example apps/backup/.env
cp apps/chat/.env.example apps/chat/.env
```

Start services

```sh
docker compose up -d
```

Build applications

```sh
yarn build
```
