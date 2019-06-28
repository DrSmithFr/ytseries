build: hooks containers vendors imports serve

hooks:
	-ln -sf $(pwd)/hooks/pre-commit .git/hooks/pre-commit

containers:
	docker-compose kill
	docker-compose rm -f
	docker-compose build
	docker-compose up -d --remove-orphans

vendors:
	./aliases.sh composer install

imports:
	./aliases.sh console app:series:import
	./aliases.sh console app:series:index

serve:
	cd front && npm install
	cd front && ng serve
