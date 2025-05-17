# Hive

YouTube channel archiver

## ⚠️ Warning ⚠️

This is under active development and should not be used. Only nightly builds will be available for now.

## Installation

### Docker compose

```yaml
services:
  hive:
    image: ghcr.io/killbasa/hive:nightly
    restart: unless-stopped
    environment:
      AUTH_SECRET: <secret> # openssl rand -base64 32
      AUTH_ORIGIN: http://localhost:3000
      REDIS_HOST: redis
      REDIS_PORT: 6379
      REDIS_PASSWORD: password
      YT_API_KEY: <secret>
      METRICS_ENABLED: true
    volumes:
      - hive:/var/lib/hive
    ports:
      - 127.0.0.1:3001:3001
    depends_on:
      - redis
    networks:
      - hive

  redis:
    image: redis:7.4.3-alpine3.21
    restart: unless-stopped
    command: ['redis-server', '--requirepass password']
    networks:
      - hive

volumes:
  hive:

networks:
  hive:
```

## Using your own yt-dlp binary

This would be considered advanced usage since Hive already comes with a version of yt-dlp installed, however you could provide your own if you wish.

You can do so by adding the following mount on the `hive` image:

```yaml
volumes:
  - /path/to/binary:/hive/bin/yt-dlp:ro
```

### Supported yt-dlp versions

The only version of yt-dlp that is guarateed to work is the version that is bundled in the Docker image. Once this project stabilizes a table specifying the yt-dlp versions support by each Hive release.

## Contibuting

1. Download yt-dlp binary

```sh
wget https://github.com/yt-dlp/yt-dlp/releases/download/2025.04.30/yt-dlp
chmod +x yt-dlp
mv ./yt-dlp ./apps/api/bin
```

or run the setup script

```sh
sh ./apps/api/scripts/deps.sh
```

1. Setup .env files

```sh
cp apps/api/.env.example apps/api/.env
```

3. Start services

```sh
docker compose -f apps/api/compose.yml up -d
```

4. Build applications and dependencies

```sh
pnpm build
```

### Developing on Mac OS

You'll need to use a virtualization method that supports host mode networking (required by the API nginx).
