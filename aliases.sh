#!/usr/bin/env bash
YOUR_ID=$(id -u)
DOCKER_GID=$(id -g)

function composer() {
    cd back && symfony composer $* || exit $?
}

function php() {
    cd back && symfony php $* || exit $?
}

function phpcs() {
    cd back && symfony php vendor/bin/phpcs --ignore=vendor,bin,src/Migrations,pub,config $* || exit $?
}

function phpmd() {
    cd back && symfony php vendor/phpmd/phpmd/src/bin/phpmd src text ruleset.xml --exclude src/Migrations || exit $?
}

function phpunit() {
    cd back && symfony php bin/phpunit $* || exit $?
}

function console() {
    cd back && symfony console $* || exit $?
}

function psql() {
     docker-compose exec --user="${YOUR_ID}:${DOCKER_GID}" postgres /bin/sh -c "psql --dbname=symfony $*" || exit $?
}

function tslint() {
    ./front/node_modules/tslint/bin/tslint --project ./front || exit $?
}

function install() {
    #
    # Adding git hook
    #
    ln -sf $(pwd)/hooks/pre-commit .git/hooks/pre-commit

    #
    # starting docker containers
    #
    docker-compose kill && \
    docker-compose rm -f && \
    docker volume rm $(basename $(pwd) | awk '{print tolower($0)}')_bdd
    docker-compose up -d --remove-orphans && \

    sleep 5

    #
    # Symfony init
    #
    composer install && \
    console doctrine:migration:migrate -n && \
    console doctrine:fixtures:load -n && \
    console app:series:imp && \
    console app:series:ind
}

function reload() {
    ln -sf $(pwd)/hooks/pre-commit .git/hooks/pre-commit

    docker-compose kill && \
    docker-compose rm -f && \
    docker-compose up --remove-orphans -d && \

    sleep 10

    console app:series:imp && \
    console app:series:ind
}

function reset() {
    console doctrine:database:drop --force
    console doctrine:database:create

    console doctrine:migration:migrate -n
    console doctrine:fixtures:load -n

    console app:series:imp
    console app:series:ind
}

$@
