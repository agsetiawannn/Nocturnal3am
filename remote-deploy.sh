#!/bin/bash

# Remote deployment script - ini akan dijalankan di server
# Buat file ini terlebih dahulu di server sebelum menjalankan deployment

PROJECT_DIR="/home/u240557956/public_html/tigapagi"
GITHUB_REPO="https://github.com/agsetiawannn/Nocturnal3am.git"
BRANCH="Nocturnal3am"

echo "Mulai deployment..."

# Jika directory belum ada
if [ ! -d "$PROJECT_DIR" ]; then
    mkdir -p /home/u240557956/public_html
    cd /home/u240557956/public_html
    git clone -b "$BRANCH" "$GITHUB_REPO" tigapagi
else
    cd "$PROJECT_DIR"
    git fetch origin
    git checkout "$BRANCH"
    git pull origin "$BRANCH"
fi

cd "$PROJECT_DIR"

# Setup permissions
chmod -R 755 .
chmod -R 777 storage bootstrap/cache 2>/dev/null || true

# Copy production env
if [ -f ".env.production" ]; then
    cp .env.production .env
fi

# Install dependencies
if command -v composer &> /dev/null; then
    composer install --no-dev --optimize-autoloader
elif command -v php &> /dev/null; then
    # Laravel ships with composer
    php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
    php composer-setup.php --quiet
    php composer.phar install --no-dev --optimize-autoloader
    rm composer-setup.php
fi

# Generate key if not exists
php artisan key:generate --force

# Run migrations
php artisan migrate --force

# Cache
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Deployment selesai!"
echo "Akses aplikasi di: https://studiotigapagi.com"
