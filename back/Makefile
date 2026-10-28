.PHONY: build install reload up down logs logs-nginx sh dependencies assets database fixtures migration test test-browser jwt jwt-test series xdebug

# All the PHP side runs in the php container (back/Dockerfile).
# npm/node stay on the host.

build: reload dependencies assets database fixtures series

install: hooks build

reload: up

up:
	docker compose up -d --remove-orphans

down:
	docker compose down

logs:
	docker compose logs -f php nginx

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

# Panther tests (tests/Functional) need a browser in the php image: ticket #3.
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

hooks:
	chmod +x hooks/pre-commit.sh
	chmod +x hooks/pre-push.sh
	rm -f .git/hooks/pre-commit
	rm -f .git/hooks/pre-push
	ln -s -f ../../hooks/pre-commit.sh .git/hooks/pre-commit
	ln -s -f ../../hooks/pre-push.sh .git/hooks/pre-push
