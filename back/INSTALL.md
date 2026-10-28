# Working on project

   - Run `make` to rebuild and reload the containers

# Installation

The whole PHP side of the project runs in Docker: **no PHP, no Symfony Local
Server on the host**. Only Docker and Node/npm are needed.

  - Install [Docker](https://docs.docker.com/get-docker/) and the [Docker Compose
    plugin](https://docs.docker.com/compose/install/)
  - Install Node/npm (see `.nvmrc`, `make nvm` uses [nvm](https://github.com/nvm-sh/nvm))
  - Install everything with `make install`
    (or `./aliases.sh install` from the repository root)

The php image is built from [Dockerfile](Dockerfile) (`php:8.4-fpm`): it provides
the `cli` and `fpm` SAPIs, the extensions required by `composer.json`, composer,
and Xdebug.

## Containers

| Service | Role |
|---|---|
| `nginx` | `nginx:1.29-alpine`, HTTP only on `http://localhost:8080`, conf: [`config/nginx/default.conf`](config/nginx/default.conf) |
| `php` | php-fpm 8.4 + cli, composer, phpunit/phpcs/phpmd (`back/Dockerfile`), reached by nginx over `php:9000` (port 9000 is not published) |
| `database` | postgres 16 (`symfony`/`symfony`) |
| `redis` | redis 7 |
| `elasticsearch` | elasticsearch 8 |
| `mailer` | mailpit (dev only, `compose.override.yaml`) |

The code is mounted in the container at `/var/www/back` by
`compose.override.yaml`, so there is nothing to rebuild when a file changes.

## Accessing the app

The API and the Symfony pages are served by the `nginx` container, **HTTP only**:

    http://localhost:8080          # back office + /api/*
    http://localhost:8080/documentation   # swagger UI

The front (`ng serve`, port 4200) calls `http://127.0.0.1:8080/api`
(see `front/src/environments/environment.ts`). The CORS headers come from
nelmio, not from nginx. Change the published port with `API_PORT=9000 make up`.

## Make targets

    make up            # docker compose up -d
    make down          # docker compose down
    make dependencies  # composer install (in the container)
    make assets        # assets:install + npm install && npm run build (npm on the host)
    make database      # drop/create/migrate
    make fixtures      # doctrine:fixtures:load
    make migration     # doctrine:migration:diff
    make jwt           # lexik:jwt:generate-keypair (dev keys)
    make jwt-test      # test keys, generated on demand (see below)
    make series        # import + indexation + cache-images
    make test          # phpunit (default suite, no browser needed)
    make test-browser  # Panther tests (tests/Functional), needs a browser: ticket #3
    make sh            # a shell inside the php container
    make logs          # follow the php + nginx logs
    make logs-nginx    # follow the nginx logs only
    make xdebug CMD="php bin/console ..."   # same command, Xdebug enabled

## JWT keys

```
make jwt        # config/jwt/*.pem
make jwt-test   # config/jwt-test/*.pem (used by phpunit)
```

Both are gitignored. `make test` runs `jwt-test` first (`--skip-if-exists`), so
the API tests work on a fresh clone.

## Tests

```
make test                              # or ./aliases.sh phpunit
./aliases.sh phpunit tests/Functional  # Panther (browser) tests
```

`tests/Functional` is excluded from the default suite: Panther needs chromium +
`libglib-2.0` inside the php image, which is ticket #3. Until then those tests
are run explicitly (they fail with `chromedriver: error while loading shared
libraries: libglib-2.0.so.0`).

## Xdebug

Xdebug is installed but idle (`xdebug.start_with_request = no`). Enable it per
command:

    XDEBUG_TRIGGER=1 docker compose exec -T php php bin/console ...
    make xdebug CMD="php bin/console app:series:import"

It connects to `host.docker.internal:9003` (see `extra_hosts` in
`compose.override.yaml`).
