FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev

# Install PHP extensions
RUN docker-php-ext-install \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip 

# Install Xdebug
RUN pecl install xdebug \
    && docker-php-ext-enable xdebug
# xdebug configuration desabled due to some setting not working
# COPY ./docker/php/xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini

# Configure Xdebug
RUN echo "xdebug.mode=debug" > /usr/local/etc/php/conf.d/99-xdebug.ini \
    && echo "xdebug.start_with_request=yes" >> /usr/local/etc/php/conf.d/99-xdebug.ini \
    && echo "xdebug.client_host=host.docker.internal" >> /usr/local/etc/php/conf.d/99-xdebug.ini \
    && echo "xdebug.client_port=9003" >> /usr/local/etc/php/conf.d/99-xdebug.ini


# create tmp dir 
RUN mkdir -p /tmp && chmod 777 /tmp

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs

# Install Composer
# COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# CMD sh -c "composer install && npm install && npm run dev -- --host 0.0.0.0 & php-fpm"
CMD ["php-fpm"]