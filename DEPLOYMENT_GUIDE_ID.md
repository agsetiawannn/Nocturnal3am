# 🚀 PANDUAN DEPLOYMENT LENGKAP - Studio Tiga Pagi

## Informasi Server Production

- **Domain**: studiotigapagi.com
- **Server**: 153.92.11.7  
- **SSH Port**: 65002
- **Username**: u240557956
- **Password**: Nocturnal3am.
- **Database Name**: u240557956_tigapagi
- **DB Username**: u240557956_nocturnal
- **DB Password**: nocturnal3am

---

## 📋 LANGKAH-LANGKAH DEPLOYMENT

### Langkah 1: Koneksi ke Server via SSH

```bash
ssh -p 65002 u240557956@153.92.11.7
# Masukkan password: Nocturnal3am.
```

---

### Langkah 2: Navigasi ke Public HTML

```bash
cd /home/u240557956/public_html
ls -la
```

---

### Langkah 3: Clone Repository Laravel

Jika folder `tigapagi` belum ada:

```bash
git clone -b Nocturnal3am https://github.com/agsetiawannn/Nocturnal3am.git tigapagi
cd tigapagi
```

Jika folder sudah ada, update dari GitHub:

```bash
cd tigapagi
git fetch origin
git pull origin Nocturnal3am
```

---

### Langkah 4: Setup Environment & Dependencies

```bash
# Set permissions
chmod -R 755 .
chmod -R 777 storage bootstrap/cache

# Copy production environment
cp .env.production .env

# Install dependencies (jika composer belum ada, install terlebih dahulu)
composer install --no-dev --optimize-autoloader
```

**Jika Composer belum terinstall:**

```bash
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php
php composer.phar install --no-dev --optimize-autoloader
```

---

### Langkah 5: Generate Application Key

```bash
php artisan key:generate --force
```

---

### Langkah 6: Setup Database

#### Opsi A: Jika database sudah ada kosong

```bash
php artisan migrate --force
```

#### Opsi B: Jika perlu reset database (HATI-HATI, akan menghapus data)

```bash
php artisan migrate:refresh --force
```

---

### Langkah 7: Clear Caches (Penting!)

```bash
php artisan config:cache
php artisan route:cache  
php artisan view:cache
```

---

### Langkah 8: Setup Domain & Web Server

#### Jika menggunakan cPanel:

1. Masuk ke cPanel
2. Buka **Addon Domains** atau **Domains**
3. Tambahkan domain `studiotigapagi.com`
4. Pastikan document root menunjuk ke `/home/u240557956/public_html/tigapagi/public`

#### Update .htaccess

File `/home/u240557956/public_html/tigapagi/public/.htaccess` harus terlihat seperti ini:

```apache
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_METHOD} !POST
    RewriteRule ^(.*)/$ /$1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```

---

### Langkah 9: Setup SSL (HTTPS)

#### Menggunakan cPanel AutoSSL:

1. Masuk ke cPanel
2. Cari **AutoSSL** atau **SSL/TLS**
3. Install certificate untuk domain `studiotigapagi.com`

#### Manual dengan Let's Encrypt:

```bash
# Jika server support Let's Encrypt
cd /home/u240557956/public_html/tigapagi
certbot certonly --webroot -w . -d studiotigapagi.com
```

---

### Langkah 10: Verifikasi Deployment ✓

```bash
# Test database connection
php artisan tinker
DB::connection()->getPdo();
exit

# Test routes
php artisan route:list

# Check logs untuk error
tail -f storage/logs/laravel.log
```

---

## 🔍 TROUBLESHOOTING

### Error: "Database connection refused"

```bash
# Koneksi ke database lokal (server hosting)
mysql -h localhost -u u240557956_nocturnal -p u240557956_tigapagi
# Password: nocturnal3am
```

### Error: "Permission denied"

```bash
# Fix permissions
chmod -R 755 .
chmod -R 777 storage bootstrap/cache
chmod -R 777 public
```

### Error: "No such file or directory"

```bash
# Pastikan file .env ada
ls -la .env

# Jika tidak ada:
cp .env.production .env
```

### Error: "Class not found"

```bash
# Regenerate autoloader
composer dump-autoload -o
```

### Check Laravel error logs

```bash
tail -n 50 storage/logs/laravel.log
```

---

## 📝 AUTOMATIC DEPLOYMENT SCRIPT

Simpan script ini sebagai `deploy.sh` dan jalankan:

```bash
#!/bin/bash

cd /home/u240557956/public_html/tigapagi

# Update dari GitHub
git fetch origin
git pull origin Nocturnal3am

# Set permissions
chmod -R 755 .
chmod -R 777 storage bootstrap/cache

# Setup environment
cp .env.production .env

# Install dependencies
composer install --no-dev --optimize-autoloader

# Generate key
php artisan key:generate --force

# Run migrations
php artisan migrate --force

# Cache
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "✓ Deployment complete!"
```

Jalankan dengan:

```bash
bash deploy.sh
```

---

## 🔐 SECURITY CHECKLIST

- [ ] APP_DEBUG diset ke `false`
- [ ] APP_ENV diset ke `production`
- [ ] Database password tidak dalam kode public
- [ ] SSL/HTTPS diaktifkan
- [ ] Storage folder writable tapi tidak public
- [ ] `.env` file tidak di-commit ke Git
- [ ] Cron jobs dikonfigurasi (jika perlu queue)
- [ ] Backup database diatur

---

## 📊 NEXT STEPS

1. ✓ Push kode ke GitHub  
2. ✓ Deploy ke server
3. ✓ Setup database
4. ✓ Test aplikasi
5. → Monitor logs
6. → Setup CDN (optional)
7. → Setup email worker (optional)

---

## 📞 SUPPORT

Jika ada masalah:

1. Check logs: `storage/logs/laravel.log`
2. SSH ke server dan test
3. Gunakan `php artisan tinker` untuk debug
4. Contact hosting support jika technical issues

---

**Last Updated**: April 6, 2026  
**Project**: Studio Tiga Pagi  
**GitHub**: https://github.com/agsetiawannn/Nocturnal3am
