# 📋 DEPLOYMENT CHECKLIST - Studio Tiga Pagi

Date: April 6, 2026
Status: 🟢 READY FOR DEPLOYMENT

---

## Pre-Deployment Checklist

### Code Repository
- [x] All code committed to Git
- [x] Latest version pushed to GitHub (branch: Nocturnal3am)
- [x] `.env.production` configured with production database
- [x] `.gitignore` configured (excludes .env, vendor, node_modules)
- [x] Deployment scripts ready

### Production Environment
- [x] Database created: `u240557956_tigapagi`
- [x] Database user: `u240557956_nocturnal`
- [x] Database password: `nocturnal3am`
- [x] SSH access available: `u240557956@153.92.11.7:65002`
- [x] SSH password: `Nocturnal3am.`

### Application Configuration
- [x] APP_KEY generated
- [x] .env.production configured
- [x] Mail service configured (Gmail SMTP)
- [x] Session & security settings ready
- [x] Laravel migrations ready

---

## Deployment Steps

### Phase 1: Initial Setup (STEP 0)
- [ ] SSH to server: `ssh -p 65002 u240557956@153.92.11.7`
- [ ] Navigate to public_html: `cd /home/u240557956/public_html`

### Phase 2: Clone/Update Code (STEP 1)
- [ ] Clone repository:
  ```bash
  git clone -b Nocturnal3am https://github.com/agsetiawannn/Nocturnal3am.git tigapagi
  cd tigapagi
  ```
  OR Update existing:
  ```bash
  cd tigapagi
  git pull origin Nocturnal3am
  ```

### Phase 3: Setup Permissions (STEP 2)
- [ ] Set directory permissions:
  ```bash
  chmod -R 755 .
  chmod -R 777 storage bootstrap/cache
  ```

### Phase 4: Install Dependencies (STEP 3)
- [ ] Install Composer packages:
  ```bash
  composer install --no-dev --optimize-autoloader
  ```

### Phase 5: Environment Setup (STEP 4)
- [ ] Copy production env:
  ```bash
  cp .env.production .env
  ```
- [ ] Verify .env configuration:
  - [ ] APP_ENV = production
  - [ ] APP_DEBUG = false
  - [ ] DB_HOST = localhost (from server)
  - [ ] DB_DATABASE = u240557956_tigapagi
  - [ ] DB_USERNAME = u240557956_nocturnal
  - [ ] DB_PASSWORD = nocturnal3am

### Phase 6: Generate Key (STEP 5)
- [ ] Generate Laravel app key:
  ```bash
  php artisan key:generate --force
  ```

### Phase 7: Database Setup (STEP 6)
- [ ] Run migrations:
  ```bash
  php artisan migrate --force
  ```
- [ ] Check migration status:
  ```bash
  php artisan migrate:status
  ```

### Phase 8: Optimize Caches (STEP 7)
- [ ] Generate config cache:
  ```bash
  php artisan config:cache
  ```
- [ ] Generate route cache:
  ```bash
  php artisan route:cache
  ```
- [ ] Generate view cache:
  ```bash
  php artisan view:cache
  ```

### Phase 9: Domain Configuration (STEP 8)
- [ ] Login to cPanel
- [ ] Add "Addon Domain" or "Parked Domain": `studiotigapagi.com`
- [ ] Set Document Root to: `/home/u240557956/public_html/tigapagi/public`
- [ ] Install SSL Certificate (AutoSSL or Let's Encrypt)

---

## Post-Deployment Verification

### Test Database Connection
- [ ] SSH to server and run:
  ```bash
  cd /home/u240557956/public_html/tigapagi
  php artisan tinker
  > DB::connection()->getPdo()  // Should succeed
  > exit
  ```

### Test Routes
- [ ] Verify routes loaded:
  ```bash
  php artisan route:list
  ```

### Check Error Logs
- [ ] Monitor application logs:
  ```bash
  tail -f /home/u240557956/public_html/tigapagi/storage/logs/laravel.log
  ```

### Test Web Access
- [ ] Visit: `https://studiotigapagi.com`
- [ ] Verify: homepage loads correctly
- [ ] Test: contact form or main features

### Performance Check
- [ ] Check page load speed
- [ ] Verify all assets load (CSS, JS, images)
- [ ] Test responsive design on mobile

---

## Optional Post-Deployment

### Setup Backup Script
- [ ] Create daily backup cron job
- [ ] Test backup process
- [ ] Verify backup storage location

### Setup Email Testing
- [ ] Send test email from contact form
- [ ] Verify email received correctly
- [ ] Check admin notification email

### Setup Monitoring
- [ ] Setup error notification
- [ ] Setup uptime monitoring
- [ ] Configure log rotation

### Performance Optimization (Optional)
- [ ] Enable HTTP/2 if available
- [ ] Setup CDN for assets
- [ ] Enable PHP opcode cache
- [ ] Configure database indexing

---

## Quick Deploy Command (All-in-One)

Save this as a single SSH command if manual steps too tedious:

```bash
ssh -p 65002 u240557956@153.92.11.7 << 'DEPLOY'
cd /home/u240557956/public_html && \
([ -d "tigapagi" ] && cd tigapagi && git pull origin Nocturnal3am || (git clone -b Nocturnal3am https://github.com/agsetiawannn/Nocturnal3am.git tigapagi && cd tigapagi)) && \
chmod -R 755 . && chmod -R 777 storage bootstrap/cache && \
cp .env.production .env && \
composer install --no-dev --optimize-autoloader && \
php artisan key:generate --force && \
php artisan migrate --force && \
php artisan config:cache && php artisan route:cache && php artisan view:cache && \
echo "✅ DEPLOYMENT COMPLETE - Visit https://studiotigapagi.com"
DEPLOY
```

---

## Troubleshooting Guide

| Problem | Solution |
|---------|----------|
| Permission denied | `chmod -R 755 .` and `chmod -R 777 storage bootstrap/cache` |
| Database connection error | Check .env DB credentials, verify MySQL running locally on server |
| Class not found | Run `composer dump-autoload -o` |
| 500 error | Check `storage/logs/laravel.log` for details |
| Too many redirects | Check APP_URL in .env matches domain |
| CSS/JS not loading | Run `php artisan view:cache` and clear browser cache |
| Email not sending | Verify Gmail SMTP settings in .env |

---

## Useful Commands (Post-Deployment)

```bash
# View application logs
tail -f /home/u240557956/public_html/tigapagi/storage/logs/laravel.log

# List all routes
php artisan route:list

# Check database status
php artisan migrate:status

# Clear all cache
php artisan cache:clear && php artisan config:clear

# View Tinker (PHP REPL)
php artisan tinker

# Check server info
uname -a
php -v
mysql --version
```

---

## Important Files Location

```
Project Root:     /home/u240557956/public_html/tigapagi
Environment:      /home/u240557956/public_html/tigapagi/.env
Logs:             /home/u240557956/public_html/tigapagi/storage/logs
Database:         localhost (MySQL)
Public Assets:    /home/u240557956/public_html/tigapagi/public
Storage:          /home/u240557956/public_html/tigapagi/storage
```

---

## Support & Resources

- Documentation: `DEPLOYMENT_GUIDE_ID.md`
- Quick Start: `QUICK_DEPLOY.md`
- Repository: https://github.com/agsetiawannn/Nocturnal3am
- Laravel Docs: https://laravel.com/docs

---

## Final Notes

✅ **Project is ready for production deployment**

- All code is in Git
- All configuration is prepared
- Database is ready
- Server access is confirmed
- Deployment scripts are tested

**Next action:** Follow the deployment steps above or use the all-in-one command.

---

**Deployment prepared by:** Copilot  
**Date:** April 6, 2026  
**Target:** studiotigapagi.com on 153.92.11.7:65002
