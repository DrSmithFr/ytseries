# Working on project

   - Run `make` to rebuild and reload the containers

# Installation

The whole PHP side of the project runs in Docker: **no PHP, no web server and
no Symfony CLI on the host**. Only Docker and Node/npm are needed.

  - Install [Docker](https://docs.docker.com/get-docker/) and the [Docker Compose
    plugin](https://docs.docker.com/compose/install/)
  - Install Node/npm (see `.nvmrc`, `make nvm` uses [nvm](https://github.com/nvm-sh/nvm))
  - Install everything with `make install`
    (or `./aliases.sh install` from the repository root)

The php image is built from [Dockerfile](Dockerfile) (`php:8.4-fpm`): it provides
the `cli` and `fpm` SAPIs, the extensions required by `composer.json`, composer,
Xdebug, phpunit/phpcs/phpmd and **chromium + chromium-driver** (the browser used
by the Panther tests).

## Containers

| Service | Role |
|---|---|
| `nginx` | `nginx:1.29-alpine`, HTTP only on `http://localhost:8080`, conf: [`config/nginx/default.conf`](config/nginx/default.conf) |
| `php` | php-fpm 8.4 + cli, composer, phpunit/phpcs/phpmd, chromium (`back/Dockerfile`), reached by nginx over `php:9000` (port 9000 is not published) |
| `worker` | same image, `php bin/console messenger:consume async` (see "Workers" below) |
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
    make watch         # encore dev --watch (npm on the host, see "Workers")
    make worker        # starts the messenger consumer as a service
    make consume       # same consumer, one shot, in the foreground
    make database      # drop/create/migrate
    make fixtures      # doctrine:fixtures:load
    make migration     # doctrine:migration:diff
    make jwt           # lexik:jwt:generate-keypair (dev keys)
    make jwt-test      # test keys, generated on demand (see below)
    make series        # import + indexation + cache-images
    make test          # phpunit, full suite (Panther included)
    make test-browser  # Panther tests only (tests/Functional)
    make ci            # composer install + phpcs + phpmd + phpunit, in containers
    make sh            # a shell inside the php container
    make logs          # follow the php + nginx + worker logs
    make logs-nginx    # follow the nginx logs only
    make xdebug CMD="php bin/console ..."   # same command, Xdebug enabled

## Workers

Nothing runs a PHP process on the host anymore: the messenger consumer is a
container, and the asset watcher stays on the host (the image has no node).

    make worker     # docker compose up -d worker  -> "Consuming messages from async"
    make consume    # docker compose run --rm worker php bin/console messenger:consume async -vvv
    make watch      # . nvm && npm run watch  (encore dev --watch, in back/)
    make logs       # php + nginx + worker together

The `worker` service uses the same image as `php`, runs as your own user
(`UID:GID`, so `var/` and `public/media/cache` stay writable) and restarts
unless stopped. `MESSENGER_TRANSPORT_DSN=doctrine://default?auto_setup=0` in
`back/.env.docker`: the messenger table already exists in the migrations.

## CI

Local, in the same containers, from the checkout and without publishing any port:

    make ci

It runs, in order: `composer install`, `phpcs`, `phpmd`, JWT test keys,
`php bin/phpunit` (full suite). It uses its own compose project (`-p back-ci`,
`compose.yaml` + `compose.ci.yaml`) so it never touches the dev containers.

On GitHub: [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) runs the
same steps on every push and pull request, plus a `npm ci && npm run build` job
for the front.

## JWT keys

```
make jwt        # config/jwt/*.pem
make jwt-test   # config/jwt-test/*.pem (used by phpunit)
```

Both are gitignored. `make test` runs `jwt-test` first (`--skip-if-exists`), so
the API tests work on a fresh clone.

## Tests

```
make test                              # or ./aliases.sh phpunit  (full suite)
./aliases.sh phpunit tests/Functional  # Panther (browser) tests only
```

The default suite includes `tests/Functional`: the php image ships chromium and
chromedriver (same version, from Debian), `PANTHER_NO_SANDBOX=1` and `HOME=/tmp`
are provided by `compose.override.yaml` / `compose.ci.yaml`. Panther runs with
the `test` env (`PANTHER_APP_ENV=test` in `back/.env.test`).

An environment without the image (a phpunit run outside Docker) fails on those
tests: use `make test` / `./aliases.sh phpunit`, which go through the container.

## Git hooks

`hooks/pre-commit` (merge tags, `dump`, `console.log`, phpcs + phpmd on the
committed files) and `hooks/pre-push` (the whole phpunit suite) are plain shell
files in `hooks/`, linked into the git hooks directory:

    make -C back hooks      # or ./aliases.sh install, which links pre-commit

A push runs ~25 tests; in a hurry, use `git push --no-verify`.

## Xdebug

Xdebug is installed but idle (`xdebug.start_with_request = no`). Enable it per
command:

    XDEBUG_TRIGGER=1 docker compose exec -T php php bin/console ...
    make xdebug CMD="php bin/console app:series:import"

It connects to `host.docker.internal:9003` (see `extra_hosts` in
`compose.override.yaml`).
