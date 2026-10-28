# Working on project

   - Run `make` to rebuild and reload the containers

# Installation

The whole PHP side of the project runs in Docker: **no PHP, no nginx, no Symfony
Local Server on the host**. Only Docker and Node/npm are needed.

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
| `php` | php-fpm 8.4 + cli, composer, phpunit/phpcs/phpmd (`back/Dockerfile`) |
| `database` | postgres 16 (`symfony`/`symfony`) |
| `redis` | redis 7 |
| `elasticsearch` | elasticsearch 8 |
| `mailer` | mailpit (dev only, `compose.override.yaml`) |

The code is mounted in the container at `/var/www/back` by
`compose.override.yaml`, so there is nothing to rebuild when a file changes.

## Make targets

    make up            # docker compose up -d
    make down          # docker compose down
    make dependencies  # composer install (in the container)
    make assets        # assets:install + npm install && npm run build (npm on the host)
    make database      # drop/create/migrate
    make fixtures      # doctrine:fixtures:load
    make migration     # doctrine:migration:diff
    make jwt           # lexik:jwt:generate-keypair
    make series        # import + indexation + cache-images
    make test          # phpunit
    make sh            # a shell inside the php container
    make logs          # follow the php logs
    make xdebug CMD="php bin/console ..."   # same command, Xdebug enabled

## JWT keys

    make jwt

`config/jwt/*.pem` and `config/jwt-test/*.pem` are gitignored: generate them
before running the API tests.

## Xdebug

Xdebug is installed but idle (`xdebug.start_with_request = no`). Enable it per
command:

    XDEBUG_TRIGGER=1 docker compose exec -T php php bin/console ...
    make xdebug CMD="php bin/console app:series:import"

It connects to `host.docker.internal:9003` (see `extra_hosts` in
`compose.override.yaml`).
