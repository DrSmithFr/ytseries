# PHP 8.4 (FPM + CLI) for the Symfony back end.
#
# The code is NOT copied into the image: it comes from the bind mount declared
# in compose.override.yaml (dev) or from the CI checkout (see ticket #3).
# That keeps the image buildable once and reusable everywhere.
FROM php:8.4-fpm

# --- System libraries ---------------------------------------------------------
RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
        git \
        unzip \
        libicu-dev \
        libpq-dev \
        libzip-dev \
        libpng-dev \
        libjpeg-dev \
        libfreetype6-dev \
        libonig-dev \
        libxml2-dev \
        libxslt1-dev \
        zlib1g-dev \
        libsqlite3-dev \
        # Browser for the Panther tests (tests/Functional): Debian ships
        # chromium and chromium-driver from the same source, so they match.
        chromium \
        chromium-driver; \
    rm -rf /var/lib/apt/lists/*

# --- PHP extensions -----------------------------------------------------------
# gd needs freetype/jpeg, pdo_pgsql needs libpq.
RUN set -eux; \
    docker-php-ext-configure gd --with-freetype --with-jpeg; \
    docker-php-ext-install -j"$(nproc)" \
        pdo_pgsql \
        pgsql \
        intl \
        zip \
        gd \
        bcmath \
        opcache; \
    pecl install redis xdebug; \
    docker-php-ext-enable redis xdebug

# --- PHP configuration --------------------------------------------------------
# Development defaults (display_errors on, no opcache caching of stale files).
RUN set -eux; \
    cp "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini"; \
    { \
        echo 'date.timezone = Europe/Paris'; \
        echo 'memory_limit = 512M'; \
        echo 'upload_max_filesize = 50M'; \
        echo 'post_max_size = 50M'; \
        echo 'opcache.enable_cli = 0'; \
        echo 'xdebug.mode = debug'; \
        echo 'xdebug.start_with_request = no'; \
        echo 'xdebug.discover_client_host = 0'; \
        echo 'xdebug.client_host = host.docker.internal'; \
        echo 'xdebug.client_port = 9003'; \
        echo 'xdebug.idekey = PHPSTORM'; \
    } > "$PHP_INI_DIR/conf.d/app.ini"

# --- Composer -----------------------------------------------------------------
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer
ENV COMPOSER_HOME=/usr/local/composer
RUN set -eux; \
    mkdir -p "$COMPOSER_HOME"; \
    chmod 777 "$COMPOSER_HOME"

WORKDIR /var/www/back

# The container HOME is "/" which is not writable: chromium (Panther) needs a
# writable place for its "headless user data directory".
ENV HOME=/tmp

CMD ["php-fpm"]
