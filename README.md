# Hive

## Contibuting

1. Download yt-dlp binary

```sh
wget https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp
chmod +x yt-dlp
mv ./yt-dlp ./apps/api/data
```

1. Setup .env files

```sh
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

3. Start services

```sh
docker compose up -d
```

4. Build applications

```sh
yarn build
```
