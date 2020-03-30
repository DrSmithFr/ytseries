APP_DIR := $(abspath $(lastword $(MAKEFILE_LIST)))

reload: stop start series index

install:
	sudo apt install php7.4-fpm php7.4-common php7.4-curl php7.4-json php7.4-pgsql php7.4-dom php7.4-mbstring php-xdebug
	sudo apt install nginx

build:
	symfony composer install
	symfony console cache:clear

start:
	docker-compose -f docker-compose.yaml -f docker-compose.override.yaml up -d
	symfony server:start --daemon

stop:
	docker-compose kill; docker-compose rm -f
	symfony server:stop

database:
	symfony console doctrine:database:drop --force
	symfony console doctrine:database:create
	symfony console doctrine:migration:migrate -n
	symfony console doctrine:fixtures:load -n

series:
	symfony console app:series:import

index:
	symfony console app:series:indexation

test:
	symfony console doctrine:schema:update --force --env=test
	symfony console doctrine:fixtures:load -n --env=test
	symfony php bin/phpunit

git_hooks:
	chmod +x hooks/syntax-checkup.sh
	rm -f .git/hooks/pre-commit
	rm -f .git/hooks/pre-push
	ln -s hooks/syntax-checkup.sh .git/hooks/pre-commit
	ln -s hooks/syntax-checkup.sh .git/hooks/pre-push
