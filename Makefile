COMPOSE = docker compose -f back/compose.yaml -f back/compose.override.yaml

build: hooks containers vendors imports serve
hooks:
	-ln -sf $(pwd)/hooks/pre-commit .git/hooks/pre-commit
containers:
	$(COMPOSE) kill
	$(COMPOSE) rm -f
	$(COMPOSE) build
	$(COMPOSE) up -d --remove-orphans
vendors:
	-./aliases.sh composer install
imports:
	-./aliases.sh console app:series:import
	-./aliases.sh console app:series:indexation
serve:
	cd front && npm install
	cd front && ng serve
