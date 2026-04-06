#!/bin/bash

# Deployment script untuk Studio Tiga Pagi
# Production deployment ke studiotigapagi.com

set -e

echo "=========================================="
echo "Studio Tiga Pagi - Deployment Script"
echo "=========================================="

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/home/u240557956/public_html/tigapagi"
GITHUB_REPO="https://github.com/agsetiawannn/Nocturnal3am.git"
BRANCH="Nocturnal3am"

# Step 1: Create project directory
echo -e "${YELLOW}[1/8] Creating project directory...${NC}"
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

# Step 2: Clone or update repository
echo -e "${YELLOW}[2/8] Cloning/updating repository from GitHub...${NC}"
if [ -d ".git" ]; then
    echo "Repository exists, pulling latest changes..."
    git fetch origin
    git checkout "$BRANCH"
    git pull origin "$BRANCH"
else
    echo "Cloning repository..."
    cd ..
    rm -rf tigapagi
    git clone -b "$BRANCH" "$GITHUB_REPO" tigapagi
    cd "$PROJECT_DIR"
fi

# Step 3: Set permissions
echo -e "${YELLOW}[3/8] Setting file permissions...${NC}"
chmod -R 755 .
chmod -R 777 storage bootstrap/cache

# Step 4: Setup .env file
echo -e "${YELLOW}[4/8] Setting up production .env file...${NC}"
if [ -f ".env.production" ]; then
    cp .env.production .env
    echo "✓ .env configured from .env.production"
else
    echo "Warning: .env.production not found, creating new .env..."
    cat > .env << 'EOF'
APP_NAME="Studio Tiga Pagi"
APP_ENV=production
APP_KEY=base64:Kwi+guvLmu3k2FyW4tCxTo+n4Ny+CHA6PoOinRDW4GA=
APP_DEBUG=false
APP_URL=https://studiotigapagi.com

APP_LOCALE=id
APP_FALLBACK_LOCALE=id
APP_FAKER_LOCALE=id_ID

APP_MAINTENANCE_DRIVER=file

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=u240557956_tigapagi
DB_USERNAME=u240557956_nocturnal
DB_PASSWORD=nocturnal3am

SESSION_DRIVER=cookie
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=.studiotigapagi.com

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync

CACHE_STORE=file

MEMCACHED_HOST=127.0.0.1

REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_SCHEME=tls
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=produksitigapagi@gmail.com
MAIL_PASSWORD="jhbf hznf okog ubbz"
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="contact@studiotigapagi.com"
MAIL_FROM_NAME="Studio Tiga Pagi"
MAIL_ADMIN_ADDRESS="produksitigapagi@gmail.com"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

VITE_APP_NAME="${APP_NAME}"

# Security Settings
SETUP_ENABLED=false
SETUP_KEY=nocturnal0300
EOF
fi

# Step 5: Install dependencies
echo -e "${YELLOW}[5/8] Installing Composer dependencies...${NC}"
if command -v composer &> /dev/null; then
    composer install --no-dev --optimize-autoloader
else
    echo "Warning: Composer not found, downloading..."
    php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
    php composer-setup.php
    php -r "unlink('composer-setup.php');"
    php composer.phar install --no-dev --optimize-autoloader
fi

# Step 6: Generate app key
echo -e "${YELLOW}[6/8] Generating app key...${NC}"
php artisan key:generate

# Step 7: Run migrations
echo -e "${YELLOW}[7/8] Running database migrations...${NC}"
php artisan migrate --force

# Step 8: Clear caches
echo -e "${YELLOW}[8/8] Clearing caches...${NC}"
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo -e "${GREEN}=========================================="
echo "✓ Deployment completed successfully!"
echo "=========================================${NC}"
echo ""
echo "Project Location: $PROJECT_DIR"
echo "Domain: https://studiotigapagi.com"
echo "Database: u240557956_tigapagi"
echo ""
echo "Next steps:"
echo "1. Verify the domain is pointing to this directory"
echo "2. Make sure SSL certificate is configured"
echo "3. Test the application at https://studiotigapagi.com"
echo "4. Check logs in storage/logs if any issues"
echo ""
