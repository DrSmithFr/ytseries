AmsTranslations
===============

Basic starter pack with:
 - php7.1 fpm, ngnix
 - symfony3.4(lts), redis
 - flex, composer
 
Generate your jwt keys
======================

`mkdir -p config/jwt # For Symfony3+, no need of the -p option`

`openssl genrsa -out config/jwt/private.pem -aes256 4096`

`openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem`

`openssl rsa -in config/jwt/private.pem -out config/jwt/private2.pem`

`mv config/jwt/private.pem config/jwt/private.pem-back`

`mv config/jwt/private2.pem config/jwt/private.pem`

`chmod 777 config/jwt/*`
