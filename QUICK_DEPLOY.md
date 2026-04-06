# 🚀 QUICK START - Deployment Studio Tiga Pagi

## ✅ Yang Sudah Selesai

1. ✓ Commit dan push semua project changes ke GitHub
2. ✓ Update `.env.production` dengan database credentials production
3. ✓ Create deployment scripts (automated dan manual)
4. ✓ Create comprehensive deployment guide

---

## 🎯 LANGKAH SELANJUTNYA - 3 OPSI

### OPSI 1: Deployment Manual (Recommended untuk first time)

Jalankan command ini di terminal:

```bash
ssh -p 65002 u240557956@153.92.11.7
# Password: Nocturnal3am.
```

Setelah login ke server, jalankan:

```bash
cd /home/u240557956/public_html

# Clone repository
git clone -b Nocturnal3am https://github.com/agsetiawannn/Nocturnal3am.git tigapagi
cd tigapagi

# Setup
chmod -R 755 .
chmod -R 777 storage bootstrap/cache
cp .env.production .env

# Install dependencies
composer install --no-dev --optimize-autoloader

# Generate key & migrate database
php artisan key:generate --force
php artisan migrate --force

# Cache
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "✓ Deployment selesai!"
```

---

### OPSI 2: Quick Deploy dengan Script (Dari Local Machine)

Di local machine Anda (Mac):

```bash
cd ~/aplikasi/3am  # atau folder project Anda

# Run automated deployment
python3 deploy-auto.py
```

**Note:** Script ini akan otomatis menghandle semua proses deployment via SSH.

---

### OPSI 3: Copy-Paste Command Blok Lengkap (Fastest)

SSH ke server:

```bash
ssh -p 65002 u240557956@153.92.11.7
```

Masukkan password: `Nocturnal3am.`

Kemudian copy-paste command ini di server:

```bash
cd /home/u240557956/public_html && \
([ -d "tigapagi" ] && cd tigapagi && git pull origin Nocturnal3am || (git clone -b Nocturnal3am https://github.com/agsetiawannn/Nocturnal3am.git tigapagi && cd tigapagi)) && \
chmod -R 755 . && chmod -R 777 storage bootstrap/cache && \
cp .env.production .env && \
composer install --no-dev --optimize-autoloader && \
php artisan key:generate --force && \
php artisan migrate --force && \
php artisan config:cache && php artisan route:cache && php artisan view:cache && \
echo "✓ DEPLOYMENT SELESAI!"
```

---

## 📋 Informasi Server

```
Domain:       studiotigapagi.com
Server IP:    153.92.11.7
SSH Port:     65002
SSH User:     u240557956
SSH Pass:     Nocturnal3am.

Database:     u240557956_tigapagi
DB User:      u240557956_nocturnal
DB Pass:      nocturnal3am
DB Host:      localhost (dari server perspective)

Project Path: /home/u240557956/public_html/tigapagi
Public Path:  /home/u240557956/public_html/tigapagi/public
```

---

## 🔧 Domain Setup

Setelah deployment, Anda perlu setup domain di cPanel:

1. Login ke **cPanel** (biasanya: cPanel.yourhostingprovider.com)
2. Cari **"Addon Domains"** atau **"Domains"**
3. Tambah domain `studiotigapagi.com`
4. Pastikan **Document Root** menunjuk ke:
   ```
   /home/u240557956/public_html/tigapagi/public
   ```
5. Install **SSL Certificate** (AutoSSL if available)

---

## ✅ Verification Checklist

Setelah deployment, verify:

```bash
# 1. SSH ke server
ssh -p 65002 u240557956@153.92.11.7

# 2. Cek file .env
cat /home/u240557956/public_html/tigapagi/.env | grep "APP_ENV\|DB_HOST"

# 3. Cek database connection
cd /home/u240557956/public_html/tigapagi
php artisan tinker
> DB::connection()->getPdo()
# Should return connection object, then exit with Ctrl+D

# 4. Cek logs untuk error
tail -f /home/u240557956/public_html/tigapagi/storage/logs/laravel.log

# 5. Check routes
php artisan route:list
```

---

## 🌐 Test Aplikasi

Setelah semua selesai:

```
https://studiotigapagi.com
```

Akses domain Anda di browser!

---

## 🆘 Troubleshooting

### Error: "Permission denied"
```bash
chmod -R 755 /home/u240557956/public_html/tigapagi
chmod -R 777 /home/u240557956/public_html/tigapagi/storage
```

### Error: "Database connection refused"
```bash
# Test database dari server
mysql -h localhost -u u240557956_nocturnal -p u240557956_tigapagi
# Password: nocturnal3am
```

### Error: "Class not found"
```bash
cd /home/u240557956/public_html/tigapagi
composer dump-autoload -o
```

### Check Laravel Log
```bash
tail -n 100 /home/u240557956/public_html/tigapagi/storage/logs/laravel.log
```

---

## 📚 Files Tersedia di Repository

- `deploy-auto.py` - Automated deployment script (Python)
- `deploy.sh` - Deployment shell script
- `remote-deploy.sh` - Remote deployment helper
- `DEPLOYMENT_GUIDE_ID.md` - Detailed deployment documentation
- `.env.production` - Production environment configuration

---

## 📞 Support

Ada yang tidak jelas? Reference files:

1. Read: `DEPLOYMENT_GUIDE_ID.md` (detailed guide)
2. Check: GitHub Issues di repository
3. Debug: SSH ke server dan check logs

---

**Status**: ✅ Ready for deployment  
**Last Updated**: April 6, 2026  
**Repository**: https://github.com/agsetiawannn/Nocturnal3am  
**branch**: Nocturnal3am
