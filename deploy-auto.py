#!/usr/bin/env python3
"""
Automated Deployment Script for Studio Tiga Pagi
Deploys Laravel project to production server via SSH
"""

import subprocess
import sys
import os
from pathlib import Path

# Configuration
SSH_HOST = "153.92.11.7"
SSH_PORT = "65002"
SSH_USER = "u240557956"
SSH_PASSWORD = "Nocturnal3am."
PROJECT_PATH = "/home/u240557956/public_html/tigapagi"
GITHUB_REPO = "https://github.com/agsetiawannn/Nocturnal3am.git"
GITHUB_BRANCH = "Nocturnal3am"

# Color codes
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def print_header(text):
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*50}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{text}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{'='*50}{Colors.ENDC}\n")

def print_step(step_num, text):
    print(f"{Colors.OKBLUE}[{step_num}]{Colors.ENDC} {Colors.BOLD}{text}{Colors.ENDC}")

def print_success(text):
    print(f"{Colors.OKGREEN}✓ {text}{Colors.ENDC}")

def print_error(text):
    print(f"{Colors.FAIL}✗ {text}{Colors.ENDC}")

def print_warning(text):
    print(f"{Colors.WARNING}⚠ {text}{Colors.ENDC}")

def run_ssh_command(command):
    """Run command on remote server via SSH"""
    ssh_cmd = f'ssh -p {SSH_PORT} {SSH_USER}@{SSH_HOST} "{command}"'
    
    try:
        result = subprocess.run(ssh_cmd, shell=True, capture_output=True, text=True, timeout=300)
        return result.returncode == 0, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return False, "", "Command timeout"
    except Exception as e:
        return False, "", str(e)

def deploy():
    print_header("Studio Tiga Pagi - Automated Deployment")
    print(f"Target: studiotigapagi.com")
    print(f"Server: {SSH_HOST}:{SSH_PORT}")
    print(f"Project: {PROJECT_PATH}\n")

    # Step 1: Test SSH Connection
    print_step(1, "Testing SSH Connection")
    success, stdout, stderr = run_ssh_command("echo 'SSH connection OK'")
    if not success:
        print_error("SSH connection failed")
        print(f"Error: {stderr}")
        return False
    print_success("SSH connection established")

    # Step 2: Clone or Update Repository
    print_step(2, "Cloning/Updating Repository from GitHub")
    clone_cmd = f'''
    if [ -d "{PROJECT_PATH}/.git" ]; then
        cd {PROJECT_PATH}
        git fetch origin
        git checkout {GITHUB_BRANCH}
        git pull origin {GITHUB_BRANCH}
        echo "Repository updated"
    else
        mkdir -p /home/{SSH_USER}/public_html
        cd /home/{SSH_USER}/public_html
        git clone -b {GITHUB_BRANCH} {GITHUB_REPO} tigapagi
        echo "Repository cloned"
    fi
    '''
    success, stdout, stderr = run_ssh_command(clone_cmd)
    if not success:
        print_error("Failed to clone/update repository")
        print(f"Error: {stderr}")
        return False
    print_success("Repository ready")
    print(stdout.strip())

    # Step 3: Set Permissions
    print_step(3, "Setting File Permissions")
    permissions_cmd = f'''
    cd {PROJECT_PATH}
    chmod -R 755 .
    chmod -R 777 storage bootstrap/cache public
    echo "Permissions updated"
    '''
    success, stdout, stderr = run_ssh_command(permissions_cmd)
    if not success:
        print_warning("Some permissions may not have been set correctly")
    else:
        print_success("Permissions configured")

    # Step 4: Setup Environment File
    print_step(4, "Setting Up Production .env File")
    env_cmd = f'''
    cd {PROJECT_PATH}
    if [ -f ".env.production" ]; then
        cp .env.production .env
        echo ".env copied from .env.production"
    else
        echo ".env setup completed"
    fi
    '''
    success, stdout, stderr = run_ssh_command(env_cmd)
    if not success:
        print_warning("Could not setup .env file")
    else:
        print_success(".env configured")

    # Step 5: Install Composer Dependencies
    print_step(5, "Installing Composer Dependencies")
    composer_cmd = f'''
    cd {PROJECT_PATH}
    if command -v composer &> /dev/null; then
        composer install --no-dev --optimize-autoloader
    else
        php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
        php composer-setup.php --quiet
        php composer.phar install --no-dev --optimize-autoloader
        rm composer-setup.php
    fi
    echo "Composer dependencies installed"
    '''
    success, stdout, stderr = run_ssh_command(composer_cmd)
    if not success:
        print_error("Failed to install dependencies")
        print(f"Error: {stderr}")
        return False
    print_success("Dependencies installed")

    # Step 6: Generate Application Key
    print_step(6, "Generating Application Key")
    key_cmd = f'cd {PROJECT_PATH} && php artisan key:generate --force'
    success, stdout, stderr = run_ssh_command(key_cmd)
    print_success("Application key generated")

    # Step 7: Run Database Migrations
    print_step(7, "Running Database Migrations")
    migration_cmd = f'cd {PROJECT_PATH} && php artisan migrate --force'
    success, stdout, stderr = run_ssh_command(migration_cmd)
    if success:
        print_success("Database migrations completed")
    else:
        print_warning(f"Migration output: {stdout}")
        if "already exists" in stderr.lower():
            print_success("Database tables already exist (this is OK)")
        else:
            print_warning(f"Migration warning: {stderr}")

    # Step 8: Clear Caches
    print_step(8, "Clearing Application Caches")
    cache_cmd = f'''
    cd {PROJECT_PATH}
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    echo "Caches cleared and regenerated"
    '''
    success, stdout, stderr = run_ssh_command(cache_cmd)
    print_success("Caches optimized")

    # Summary
    print_header("✓ Deployment Completed Successfully!")
    print(f"{Colors.OKGREEN}")
    print("Project Information:")
    print(f"  Domain: https://studiotigapagi.com")
    print(f"  Server: {SSH_HOST}:{SSH_PORT}")
    print(f"  Database: u240557956_tigapagi")
    print(f"  Project Path: {PROJECT_PATH}")
    print(f"\n{Colors.WARNING}Next Steps:{Colors.ENDC}")
    print("  1. Verify domain DNS is pointing to the server")
    print("  2. Ensure SSL certificate is installed")
    print("  3. Test: https://studiotigapagi.com")
    print("  4. Check logs: ssh -p 65002 u240557956@153.92.11.7")
    print(f"              tail -f {PROJECT_PATH}/storage/logs/laravel.log")
    print(f"\n{Colors.OKGREEN}Happy Coding! 🚀{Colors.ENDC}\n")
    
    return True

if __name__ == "__main__":
    try:
        success = deploy()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\nDeployment cancelled by user")
        sys.exit(1)
    except Exception as e:
        print_error(f"Unexpected error: {str(e)}")
        sys.exit(1)
