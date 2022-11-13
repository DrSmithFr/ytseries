FROM php:7.2-fpm-alpine

RUN set -ex && \
    apk --no-cache add \
    postgresql-dev \
    zlib-dev

RUN docker-php-ext-install \
    pdo \
    pdo_pgsql \
    zip

# Install xdebug
RUN apk add --no-cache $PHPIZE_DEPS
RUN pecl install -f xdebug
RUN docker-php-ext-enable xdebug

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer && \
    composer self-update --1 && \
    mkdir -p /.composer/cache && \
    chmod 777 /.composer/cache

# Configure xdebug
RUN echo "xdebug.remote_enable=1" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini && \
    echo "xdebug.remote_connect_back=1" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini && \
    echo "xdebug.remote_port=9000" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini && \
    echo "xdebug.scream=0" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini && \
    echo "xdebug.cli_color=1" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini && \
    echo "xdebug.show_local_vars=1" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini

# keep composer cache
VOLUME ["/.composer/cache"]

WORKDIR /www/
