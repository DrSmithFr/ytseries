FROM php:7.2-fpm-alpine

RUN set -ex && \
    apk --no-cache add \
    postgresql-dev \
    zlib-dev

RUN docker-php-ext-install \
    pdo \
    pdo_pgsql \
    zip

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer && \
    mkdir -p /.composer/cache && \
    chmod 777 /.composer/cache

# keep composer cache
VOLUME ["/.composer/cache"]

WORKDIR /www/
