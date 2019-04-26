Installation
============

 1) Install the latest version of docker.
 
 2) Install the latest version of docker-compose.

 3) Then run the `./bin/docker install.sh` script.
 
 4) Follow back/README.md to generate your jwt keys

 5) Let's rock: `http://localhost/`
 
Every day usage
===============

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
