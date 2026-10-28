<p align="center">
    <img src="front/src/assets/logo.png">
</p>

## Installation

Everything PHP related runs inside Docker: the `php` service (image built from
[`back/Dockerfile`](back/Dockerfile), `php:8.4-fpm`) provides php-fpm, the php
cli, composer, phpunit, phpcs, phpmd and Xdebug. **No PHP and no nginx have to be
installed on the host**, only Docker and npm.

  - Install [Docker Engine](https://docs.docker.com/engine/install/) and the [Docker Compose plugin](https://docs.docker.com/compose/install/)
  - Add your user to the `docker` group, using `sudo adduser $USER docker`, then logout/login again
  - Install the latest version of [npm](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-18-04)
  - Then run the `./aliases.sh install` script: it builds the images, starts the containers, installs the composer dependencies, migrates and fills the database
  - Use `ng serve --port={PORT}` (in `front/`) to access the app on `http://localhost:{PORT}/`
  - if the connexion doesn't work, try

         ./aliases.sh console doctrine:migration:migrate
         ./aliases.sh console doctrine:fixtures:load -n

The compose stack lives in [`back/compose.yaml`](back/compose.yaml) (`php`,
`database`, `redis`, `elasticsearch`) and the dev overrides in
[`back/compose.override.yaml`](back/compose.override.yaml) (bind mount of the
code, host user, mailer).

### Generate your JWT keys

YtSeries need public/private key to generate JWT tokens.
Those tokens are used by API for authentication and reconnection mechanisms.

    make -C back jwt

or, from the `back` folder:

    docker compose exec php php bin/console lexik:jwt:generate-keypair

`back/config/jwt/*.pem` is gitignored.

## How work on YtSeries

### Coding style and Standards

- Respect best practices for [javascript](https://github.com/ryanmcdermott/clean-code-javascript) and [php](https://github.com/jupeter/clean-code-php/blob/master/README.md).
- Respect [PSR-2 coding standards](documentation/PSR/PSR-2-coding-style-guide.md) for all php files.
- Respect [PHP mess detector](https://phpmd.org/rules/index.html).
- Respect every PSR for php files/classes.
- Respect [AirBnB standards guideline](https://github.com/airbnb/javascript) for javascript.
- Respect [PHPdoc standard](documentation/phpdoc.md).

Try to inspire you as mush as you can of [functional programing](https://www.youtube.com/watch?v=BMUiFMZr7vk&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84), it will make your code cleaner, reusable and easy to test. 
You will find equivalent in every programming language.

### Git

 - Follow [the documentation](documentation/who-to-git.md) to learn who to use git on this project.
 - Please use the [git configuration](documentation/git-config.md) of this project.

Git hooks exist as simple text files in your `/hooks` directory.
They are inject inside `.git/hooks` using symbolic link.

#### pre-commit checkup


- JS console.log finder
- PHP dump finder
- Merge tag finder
- PSR-2 checkup
- PHP Mess Detector Checkup
- TsLint checkup

Checks will run only over the committed code base

## Every day usage

Run the `./aliases.sh reload` script and start coding!

### Useful PHP commands

Every command below runs **inside the php container** (no PHP on the host):

    ./aliases.sh php ...
Direct access to php

    ./aliases.sh composer ...
Use composer inside /back folder (flex ready)

    ./aliases.sh console ...
Direct access to symfony console

    ./aliases.sh phpcs ...
Direct access to phpcs

    ./aliases.sh phpmd ...
Direct access to phpmd

    ./aliases.sh phpunit ...
Direct access to phpunit

### Useful Docker commands

    docker compose -f back/compose.yaml ps|logs|up|down
State of the containers (or `make -C back up|down|logs`)

    ./aliases.sh console ...            # same, from the repository root
    docker compose -f back/compose.yaml exec php sh
A shell inside the php container

### Useful Database commands 

    ./aliases.sh psql ...
Direct access to postgres
