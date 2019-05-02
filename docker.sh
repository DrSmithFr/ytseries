#!/usr/bin/env bash
YOUR_ID=$(id -u)
DOCKER_GID=$(id -g)

function composer() {
    docker-compose exec --user="${YOUR_ID}:${DOCKER_GID}" phpfpm /bin/sh -c "composer $*"
}

function php() {
    docker-compose exec --user="${YOUR_ID}:${DOCKER_GID}" phpfpm /bin/sh -c "php $*"
}

function phpcs() {
    docker-compose exec --user="${YOUR_ID}:${DOCKER_GID}" phpfpm /bin/sh -c "php vendor/bin/phpcs --ignore=vendor,bin,src/Migrations,pub"
}

function phpmd() {
    docker-compose run -T phpfpm /bin/sh -c "php vendor/phpmd/phpmd/src/bin/phpmd src text ruleset.xml --exclude src/Migrations"
    exit $?
}

function phpunit() {
    docker-compose exec --user="${YOUR_ID}:${DOCKER_GID}" phpfpm /bin/sh -c "php bin/phpunit $*"
}

function console() {
    docker-compose exec --user="${YOUR_ID}:${DOCKER_GID}" phpfpm /bin/sh -c "php bin/console $*"
}

function psql() {
     docker-compose exec --user="${YOUR_ID}:${DOCKER_GID}" postgres /bin/sh -c "psql --dbname=symfony $*"
}

function tslint() {
    ./front/node_modules/tslint/bin/tslint --project ./front
}

function install() {
    #
    # Adding git hook
    #
    #ln -sf $(pwd)/hooks/pre-commit .git/hooks/pre-commit

    #
    # starting docker containers
    #
    docker-compose kill && \
    docker-compose rm -f && \
    docker volume rm $(basename $(pwd) | awk '{print tolower($0)}')_bdd
    docker-compose build && \
    docker-compose up -d --remove-orphans && \

    sleep 5

    #
    # Symfony init
    #
    composer install
    console doctrine:migration:migrate -n
    console doctrine:fixtures:load -n
    console app:series:imp
    console app:series:ind

    #
    # angular init
    #

    cd front && npm install && ng serve
}

function reload() {
    docker-compose kill && \
    docker-compose rm -f && \
    docker-compose build && \
    docker-compose up --remove-orphans -d && \
    sleep 10
    console app:series:imp
    console app:series:ind
    cd front && ng serve
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
