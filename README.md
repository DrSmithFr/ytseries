# Yt Series
## Installation

 - Install the latest version of docker-ce. ( [Ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/) | [Debian](https://docs.docker.com/install/linux/docker-ce/debian/) )
 - Install the latest version of [docker-compose](https://docs.docker.com/compose/install/#install-compose) 
 - Install the latest version of [npm](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-18-04)
 - Add your user to the `docker` group, using `sudo adduser $USER docker`, them logout/logback to your computer
 - Copy `docker-compose.dist.yml` to `docker-compose.yml`
 - Then run the `./docker install` script.
 - Use `ng serve --port={PORT}` to access front office on `http://localhost:{PORT}/`
 - if the connexion doesn't work, try

         ./docker.sh console doctrine:migration:migrate
         ./docker.sh console doctrine:fixture:load -n

## Generate your JWT keys

rmms need public/private key to generate JWT tokens. 
Those tokens are used by rmms API for authentication and reconnection mechanisms.

Execute the following commands within `/back` folder

    mkdir -p config/jwt
    
    openssl genrsa -out config/jwt/private.pem -aes256 4096
    openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem
    openssl rsa -in config/jwt/private.pem -out config/jwt/private2.pem
    
    mv config/jwt/private2.pem config/jwt/private.pem
    chmod 777 config/jwt/*

## Coding style and Standards

- Respect best practices for [javascript](https://github.com/ryanmcdermott/clean-code-javascript) and [php](https://github.com/jupeter/clean-code-php/blob/master/README.md).
- Respect the [PSR-2 coding standards](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-2-coding-style-guide.md) for all php files.
- Respect [PHP mess detector](https://phpmd.org/rules/index.html).
- Respect [AirBnB standards guideline](https://github.com/airbnb/javascript) for javascript.

Try to inspire you as mush as you can of [functional programing](https://www.youtube.com/watch?v=BMUiFMZr7vk&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84), it will make your code cleaner, reusable and easy to test. 
You will find equivalent in every programming language.

## Git

Follow [the documentation](documentation/who-to-git.md) to learn who to use git on this project.
Please use the [git configuration](documentation/git-config.md) of this project.

### Git Hooks

rmms Git hooks exist as simple text files in your `/hooks` directory.
They are inject inside `.git/hooks` using symbolic link.

### pre-commit hook

This will run syntactic checkup over the all code base
- PSR-4 checkup
- PHP Mess Detector Checkup
- TsLint checkup

This hook is triggered with:
- Commit
- Amend
- Merge Resolve

## Every day usage

 Run the `./bin/docker reload` script and start coding!
 
 Use the `./bin/docker` script also as an entry point to use command within containers:

    ./bin/docker composer ...
Use composer inside /symfony folder (flex ready)

    ./bin/docker console ...
Direct access to symfony console

    ./bin/docker php ...
Direct access to php

    ./bin/docker phpcs ...
Direct access to phpcs

    ./bin/docker phpunit ...
Direct access to phpunit

    ./bin/docker psql ...
Direct access to psql
