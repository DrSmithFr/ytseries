#!/usr/bin/env bash
#
# no PHP, no local Symfony server on the host anymore: every PHP tool runs
# inside the php container (see back/Dockerfile).
#
# The compose stack lives in back/ (compose.yaml + compose.override.yaml).
export UID GID

# docker compose, always run from back/ so the override file is picked up
dc() {
    (cd back && docker compose "$@")
}

# Run anything inside the php service.
# -T: no TTY, required for pipes, redirections and git hooks.
php_run() {
    (cd back && docker compose up -d --wait php >/dev/null && docker compose exec -T php "$@")
}

function composer() {
    php_run composer "$@" || exit $?
}

function php() {
    php_run php "$@" || exit $?
}

function console() {
    php_run php bin/console "$@" || exit $?
}

function phpunit() {
    php_run php bin/phpunit "$@" || exit $?
}

function phpcs() {
    # paths given to phpcs are relative to back/ (the container workdir)
    php_run php vendor/bin/phpcs --ignore=vendor,bin,src/Migrations,pub,config "$@" || exit $?
}

function phpmd() {
    # -d: pdepend is not PHP 8.4 clean yet, its deprecations only pollute the
    # hook output.
    # Without argument: the whole src/. With arguments (relative to back/, the
    # container workdir): only those files, so a git hook does not rescan src/.
    if [ "$#" -eq 0 ]; then
        php_run php -d 'error_reporting=E_ALL & ~E_DEPRECATED' vendor/bin/phpmd src text phpmd.xml --exclude src/Migrations || exit $?
    else
        php_run php -d 'error_reporting=E_ALL & ~E_DEPRECATED' vendor/bin/phpmd "$@" text phpmd.xml || exit $?
    fi
}

function psql() {
    dc exec -T database psql -U symfony -d symfony "$@" || exit $?
}

function tslint() {
    ./front/node_modules/tslint/bin/tslint --project ./front || exit $?
}

# Wait until postgres answers (no arbitrary sleep).
function wait_for_database() {
    local tries=60

    while [ "$tries" -gt 0 ]; do
        dc exec -T database pg_isready -U symfony -d symfony >/dev/null 2>&1 && return 0
        tries=$((tries - 1))
        sleep 1
    done

    echo "timeout waiting for database" >&2
    return 1
}

function install() {
    #
    # Adding git hook
    #
    ln -sf "$(pwd)/hooks/pre-commit" .git/hooks/pre-commit

    #
    # Building and starting docker containers
    #
    dc build && \
    dc up -d --remove-orphans && \
    wait_for_database && \

    #
    # Symfony init
    #
    composer install && \
    ([ -f back/config/jwt/private.pem ] || console lexik:jwt:generate-keypair) && \
    console doctrine:migration:migrate -n && \
    console doctrine:fixtures:load -n && \
    console app:series:import && \
    console app:series:indexation
}

function reload() {
    ln -sf "$(pwd)/hooks/pre-commit" .git/hooks/pre-commit

    dc up -d --remove-orphans && \
    wait_for_database && \

    console app:series:import && \
    console app:series:indexation
}

function reset() {
    dc up -d --remove-orphans && \
    wait_for_database

    console doctrine:database:drop --force
    console doctrine:database:create

    console doctrine:migration:migrate -n
    console doctrine:fixtures:load -n

    console app:series:import
    console app:series:indexation
}

$@
