# Hive CLI

## Dev dependencies

- [OpenAPI Generator](https://openapi-generator.tech/)

## Contributing

1. Start the API

```
cd apps/api
docker compose up -d
yarn build && yarn start
```

2. Generate the client

```
just gen
```
