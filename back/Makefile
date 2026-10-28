.PHONY: build install reload up down logs logs-nginx sh dependencies assets database fixtures migration test test-browser jwt jwt-test series xdebug worker consume watch ci

# All the PHP side runs in the php container (back/Dockerfile).
# npm/node stay on the host.

# CI stack: same services, code taken from the checkout, no published port.
CI = docker compose -f compose.yaml -f compose.ci.yaml

build: reload dependencies assets database fixtures series

install: hooks build

reload: up

up:
	docker compose up -d --remove-orphans

down:
	docker compose down

logs:
	docker compose logs -f php nginx worker

logs-nginx:
	docker compose logs -f nginx

sh:
	docker compose exec php sh

# Run a command with Xdebug enabled: make xdebug CMD="php bin/console ..."
xdebug:
	XDEBUG_TRIGGER=1 docker compose exec -T php $(CMD)

dependencies:
	docker compose exec -T php composer install

assets:
	docker compose exec -T php php bin/console assets:install --symlink
	. ${NVM_DIR}/nvm.sh && nvm use $(cat .nvmrc) && npm install && npm run build

nvm:
	. ${NVM_DIR}/nvm.sh && nvm install $(cat .nvmrc)

database:
	-docker compose exec -T php php bin/console doctrine:database:drop --force
	docker compose exec -T php php bin/console doctrine:database:create
	docker compose exec -T php php bin/console doctrine:migration:migrate -n

fixtures:
	docker compose exec -T php php bin/console doctrine:fixtures:load -n

migration:
	docker compose exec -T php php bin/console doctrine:migration:diff

test: jwt-test
	docker compose exec -T php php bin/phpunit --stop-on-failure

# Panther tests (tests/Functional): chromium + chromium-driver are in the image.
test-browser: jwt-test
	docker compose exec -T php php bin/phpunit tests/Functional

jwt:
	docker compose exec -T php php bin/console lexik:jwt:generate-keypair

# Test keys, same passphrase as phpunit.xml.dist (gitignored, never committed).
jwt-test:
	docker compose exec -T php env \
		JWT_SECRET_KEY=%kernel.project_dir%/config/jwt-test/private.pem \
		JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt-test/public.pem \
		JWT_PASSPHRASE=extzh99p6xfc6u9g2ucrzsqg89rffqcu \
		php bin/console lexik:jwt:generate-keypair --skip-if-exists -n

series:
	docker compose exec -T php php bin/console app:series:import
	docker compose exec -T php php bin/console app:series:indexation
	docker compose exec -T php php bin/console app:series:cache-images

# Messenger consumer, as a permanent service (compose.yaml).
worker:
	docker compose up -d worker

# Same consumer, one shot, in the foreground (Ctrl-C stops it).
consume:
	docker compose run --rm worker php bin/console messenger:consume async -vvv

# Encore watch: npm stays on the host (the container has no node).
watch:
	. ${NVM_DIR}/nvm.sh && nvm use $(cat .nvmrc) && npm run watch

# Full check of the back, in containers, from the checkout: no PHP on the host.
ci:
	$(CI) up -d --wait database redis elasticsearch
	$(CI) run --rm php composer install --no-interaction --prefer-dist
	$(CI) run --rm php vendor/bin/phpcs --ignore=vendor,bin,src/Migrations,pub,config src
	$(CI) run --rm php vendor/phpmd/phpmd/src/bin/phpmd src text ruleset.xml --exclude src/Migrations
	$(CI) run --rm php env \
		JWT_SECRET_KEY=%kernel.project_dir%/config/jwt-test/private.pem \
		JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt-test/public.pem \
		JWT_PASSPHRASE=extzh99p6xfc6u9g2ucrzsqg89rffqcu \
		php bin/console lexik:jwt:generate-keypair --skip-if-exists -n
	$(CI) run --rm php php bin/phpunit
	$(CI) down --remove-orphans

# Git hooks: the real files live in <repo>/hooks, linked into the git hooks dir.
hooks:
	chmod +x ../hooks/pre-commit ../hooks/pre-push
	ln -sfn $(CURDIR)/../hooks/pre-commit $(shell git rev-parse --git-common-dir)/hooks/pre-commit
	ln -sfn $(CURDIR)/../hooks/pre-push $(shell git rev-parse --git-common-dir)/hooks/pre-push
