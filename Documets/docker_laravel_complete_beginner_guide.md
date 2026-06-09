# Complete Docker + Laravel Learning Guide

# Chapter 1 — What is Docker?

## Simple Definition

Docker is a tool that lets you run applications inside isolated environments called containers.

A container contains:

- application code
- runtime
- libraries
- dependencies
- configurations

This means:

```text
Your project works the same on every machine.
```

Without Docker:

```text
Your laptop:
PHP 8.2

Friend laptop:
PHP 7.4

Server:
PHP 8.1
```

This creates problems.

With Docker:

```text
Everything runs inside the same environment.
```

---

# Chapter 2 — What is a Container?

A container is a small isolated running environment.

Think like:

```text
Mini operating system for one application
```

Example:

| Container | Purpose |
|---|---|
| nginx container | Web server |
| php container | Executes PHP |
| mysql container | Database |
| redis container | Cache |

Each container:

- has its own filesystem
- has its own processes
- has its own network
- is isolated

---

# Chapter 3 — Important Docker Terms

## 1. Image

An image is a blueprint/template.

Example:

```text
php:8.2-fpm
mysql:8
nginx:latest
```

Image does NOT run.

It only defines:

- OS
- packages
- runtime
- dependencies

---

## 2. Container

A running instance of an image.

Example:

```bash
docker run nginx
```

Now nginx container is running.

---

## 3. Dockerfile

A file that defines how to build a custom image.

Example:

```Dockerfile
FROM php:8.2-fpm

RUN apt-get update
```

---

## 4. Docker Compose

Docker Compose manages multiple containers together.

Instead of running:

```bash
docker run php

docker run mysql

docker run nginx
```

You define everything in one file:

```text
docker-compose.yml
```

Then run:

```bash
docker compose up
```

---

## 5. Volume

Volumes share data between:

- host machine
- container

Example:

```yaml
volumes:
  - ./src:/var/www
```

Meaning:

```text
Laptop folder ./src
↓
Container folder /var/www
```

Changes sync automatically.

---

## 6. Network

Docker containers communicate through networks.

Example:

```env
DB_HOST=db
```

Why?

Because:

```yaml
services:
  db:
```

The service name becomes hostname.

---

# Chapter 4 — Docker Architecture

## How Docker Works

```text
Docker CLI
    ↓
Docker Engine
    ↓
Containers
```

---

## Your Laravel Architecture

```text
Browser
   ↓
Nginx Container
   ↓
PHP-FPM Container
   ↓
Laravel Application
   ↓
MySQL Container
```

---

# Chapter 5 — Installing Docker

## Ubuntu Installation

Official website:

https://docs.docker.com/engine/install/ubuntu/

Check installation:

```bash
docker --version
```

Check compose:

```bash
docker compose version
```

---

# Chapter 6 — Basic Docker Commands

## Images

See images:

```bash
docker images
```

Remove image:

```bash
docker rmi IMAGE_ID
```

---

## Containers

Running containers:

```bash
docker ps
```

All containers:

```bash
docker ps -a
```

Start container:

```bash
docker start CONTAINER_ID
```

Stop container:

```bash
docker stop CONTAINER_ID
```

Delete container:

```bash
docker rm CONTAINER_ID
```

---

## Logs

```bash
docker logs container_name
```

Live logs:

```bash
docker logs -f container_name
```

---

## Access Container Terminal

```bash
docker exec -it container_name bash
```

---

# Chapter 7 — Docker Compose

## Why Compose?

Modern applications need multiple services.

Example Laravel app:

| Service | Purpose |
|---|---|
| app | PHP |
| nginx | Web server |
| db | MySQL |
| redis | Cache |

Managing manually becomes difficult.

Compose solves this.

---

## docker-compose.yml

Example:

```yaml
services:
  app:
    image: php:8.2-fpm

  db:
    image: mysql:8
```

---

# Chapter 8 — Understanding docker-compose.yml Line by Line

## services

```yaml
services:
```

Defines all containers.

---

## app

```yaml
app:
```

Service name.

Also becomes hostname inside Docker network.

---

## image

```yaml
image: mysql:8
```

Use ready-made image from Docker Hub.

---

## build

```yaml
build:
  context: .
  dockerfile: Dockerfile
```

Build custom image using Dockerfile.

---

## container_name

```yaml
container_name: laravel_app
```

Custom container name.

---

## restart

```yaml
restart: unless-stopped
```

Auto restart container if it crashes.

Options:

| Option | Meaning |
|---|---|
| no | Do not restart |
| always | Always restart |
| on-failure | Restart only on failure |
| unless-stopped | Restart until manually stopped |

---

## ports

```yaml
ports:
  - "8000:80"
```

Meaning:

```text
Host port : Container port
```

So:

```text
localhost:8000
↓
container port 80
```

---

## volumes

```yaml
volumes:
  - ./src:/var/www
```

Sync files between host and container.

---

## environment

```yaml
environment:
  MYSQL_ROOT_PASSWORD: root
```

Environment variables.

Used for:

- passwords
- config
- app settings

---

## depends_on

```yaml
depends_on:
  - db
```

Start db before app.

---

## networks

```yaml
networks:
  - laravel
```

Connect services together.

---

# Chapter 9 — Dockerfile Complete Understanding

## Purpose

Dockerfile creates custom images.

---

## Example

```Dockerfile
FROM php:8.2-fpm

RUN apt-get update

WORKDIR /var/www
```

---

## FROM

```Dockerfile
FROM php:8.2-fpm
```

Base image.

Everything starts from here.

---

## RUN

```Dockerfile
RUN apt-get update
```

Execute commands while building image.

Used for:

- install packages
- configure system
- install PHP extensions

---

## WORKDIR

```Dockerfile
WORKDIR /var/www
```

Default working directory.

Equivalent to:

```bash
cd /var/www
```

---

## COPY

```Dockerfile
COPY . .
```

Copy files into image.

---

## CMD

```Dockerfile
CMD ["php", "artisan", "serve"]
```

Default command when container starts.

---

## EXPOSE

```Dockerfile
EXPOSE 9000
```

Documents container port.

---

# Chapter 10 — PHP-FPM

## What is PHP-FPM?

PHP-FPM means:

```text
PHP FastCGI Process Manager
```

It executes PHP files.

Nginx cannot execute PHP directly.

So:

```text
Nginx → PHP-FPM → PHP Execution
```

---

# Chapter 11 — Nginx

## What is Nginx?

Nginx is a web server.

Responsibilities:

- handle HTTP requests
- serve static files
- forward PHP requests
- reverse proxy

---

## Laravel Nginx Flow

```text
Browser Request
    ↓
Nginx
    ↓
PHP-FPM
    ↓
Laravel
```

---

# Chapter 12 — Understanding Nginx Config

## Example

```nginx
server {
    listen 80;

    root /var/www/public;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass app:9000;

        include fastcgi_params;

        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }
}
```

---

## listen 80

Listen on port 80.

---

## root

```nginx
root /var/www/public;
```

Laravel public folder.

---

## try_files

Checks:

```text
Requested file exists?
```

Otherwise redirect to:

```text
index.php
```

Laravel handles routing.

---

## fastcgi_pass

```nginx
fastcgi_pass app:9000;
```

Send PHP requests to app container.

---

## include fastcgi_params

Load FastCGI configs.

---

# Chapter 13 — Volumes Deep Understanding

# Important Volume Confusion Explained

Most beginners think:

```text
Docker automatically creates a visible folder called volume
```

But that is NOT always true.

Docker has TWO different storage systems:

| Type | Example | Stored Where |
|---|---|---|
| Bind Mount | `./src:/var/www` | Your local folder |
| Named Volume | `dbdata:/var/lib/mysql` | Docker internal storage |

---

# Bind Mount Example

```yaml
volumes:
  - ./src:/var/www
```

Meaning:

```text
Local Folder
~/laravel-docker/src
↓ mounted into ↓
Container Folder
/var/www
```

This does NOT create a special Docker volume folder.

It simply shares your local folder with the container.

---

# Important Understanding

Your Laravel files physically exist here:

```text
~/laravel-docker/src
```

Container only USES them.

So if container is deleted:

```text
Your source code remains safe.
```

---

# Named Volume Example

```yaml
volumes:
  - dbdata:/var/lib/mysql

volumes:
  dbdata:
```

Here:

```text
dbdata
```

is a real Docker-managed volume.

Docker stores it internally.

---

# Where Docker Stores Volumes

Usually:

```text
/var/lib/docker/volumes/
```

Check volumes:

```bash
docker volume ls
```

Inspect volume:

```bash
docker volume inspect VOLUME_NAME
```

Example:

```bash
docker volume inspect larvel-docker_dbdata
```

---

# Important Commands

See Docker volume files:

```bash
sudo ls /var/lib/docker/volumes
```

See actual MySQL data:

```bash
sudo ls /var/lib/docker/volumes/larvel-docker_dbdata/_data
```

---

# Very Important Rule

Safe command:

```bash
docker compose down
```

Keeps:

- database volume
- local code

---

Dangerous command:

```bash
docker compose down -v
```

Deletes:

- containers
- Docker volumes
- MySQL database data

---

# Development vs Production Storage

## Development

Usually:

```yaml
volumes:
  - ./src:/var/www
```

because live sync is useful.

---

## Production

Usually:

```Dockerfile
COPY . /var/www
```

instead of bind mounts.

Reasons:

- safer
- faster
- stable
- immutable deployment

---


## Bind Mounts

```yaml
volumes:
  - ./src:/var/www
```

Real-time sync.

Best for development.

---

## Named Volumes

```yaml
volumes:
  dbdata:
```

Managed by Docker.

Best for:

- databases
- persistent storage

---

# Chapter 14 — Docker Networks

Containers communicate internally.

Example:

```text
app container
↓
db container
```

Inside Docker:

```env
DB_HOST=db
```

because service name acts as hostname.

---

# Chapter 15 — Dependency Management

## PHP Dependencies

Laravel uses Composer.

Install:

```bash
composer install
```

File:

```text
composer.json
```

---

## Node Dependencies

Frontend dependencies:

```bash
npm install
```

Files:

```text
package.json
```

---

## Why Dependencies Matter

Libraries/packages your app needs.

Examples:

| Package | Purpose |
|---|---|
| Laravel Sanctum | Authentication |
| Spatie Permission | Roles |
| Guzzle | HTTP Requests |

---

# Chapter 16 — Container Lifecycle

## Build

```bash
docker compose build
```

Creates images.

---

## Start

```bash
docker compose up -d
```

Starts containers.

---

## Stop

```bash
docker compose down
```

Stops containers.

---

## Restart

```bash
docker compose restart
```

Restarts services.

---

# Chapter 17 — Laravel Installation Using Docker

## Step 1

Create project:

```bash
mkdir laravel-docker
cd laravel-docker
```

---

## Step 2

Create:

```text
Dockerfile
docker-compose.yml
nginx/default.conf
src/
```

---

## Step 3

Build containers:

```bash
docker compose up -d --build
```

---

## Step 4

Install Laravel:

```bash
docker compose exec app composer create-project laravel/laravel .
```

---

## Step 5

Fix permissions:

```bash
docker compose exec app chmod -R 777 storage bootstrap/cache
```

---

## Step 6

Generate app key:

```bash
docker compose exec app php artisan key:generate
```

---

## Step 7

Run migrations:

```bash
docker compose exec app php artisan migrate
```

---

## Step 8

Open browser:

```text
http://localhost:8000
```

---

# Chapter 18 — Important Daily Commands

# Very Important Notes

## DO NOT Use `php artisan serve` In This Setup

Your project already uses:

```text
Nginx + PHP-FPM
```

So Laravel is already being served properly.

Do NOT run:

```bash
php artisan serve
```

inside:

- Dockerfile
- docker-compose
- terminal

Why?

Because:

```text
Nginx already handles HTTP requests.
```

Correct flow:

```text
Browser
↓
Nginx
↓
PHP-FPM
↓
Laravel
```

---

# Most Important Docker Commands

## See Running Containers

```bash
docker ps
```

---

## See All Containers

```bash
docker ps -a
```

---

## See Logs

All services:

```bash
docker compose logs
```

Specific service:

```bash
docker compose logs app
```

Live logs:

```bash
docker compose logs -f app
```

---

## Enter Container Terminal

App container:

```bash
docker compose exec app bash
```

Database container:

```bash
docker compose exec db bash
```

Nginx container:

```bash
docker compose exec nginx bash
```

---

## Run Commands Inside Container

Example:

```bash
docker compose exec app php artisan migrate
```

Another example:

```bash
docker compose exec app composer install
```

Another:

```bash
docker compose exec app php artisan optimize:clear
```

---

## Restart Containers

```bash
docker compose restart
```

Specific service:

```bash
docker compose restart nginx
```

---

## Stop Containers

```bash
docker compose down
```

---

## Start Containers

```bash
docker compose up -d
```

---

## Rebuild Containers

```bash
docker compose up -d --build
```

Use this when:

- Dockerfile changed
- dependencies changed
- configs changed

---

# Understanding `.env`

## Purpose

Stores environment configuration.

Example:

```env
APP_NAME=Laravel
APP_ENV=local
APP_DEBUG=true
DB_HOST=db
DB_DATABASE=laravel
```

---

## VERY IMPORTANT RULE

Never push real `.env` to GitHub.

Reason:

It contains:

- database passwords
- API keys
- secrets
- mail credentials

---

## Correct Practice

Push:

```text
.env.example
```

Do NOT push:

```text
.env
```

---

## Production Server

Production server should have its own:

```text
.env
```

Example:

```env
APP_ENV=production
APP_DEBUG=false
```

---

# Git Important Rules

## Before Push

Always check:

```bash
git status
```

---

## Never Push

Never commit:

```text
.env
vendor
node_modules
```

---

## Use `.gitignore`

Example:

```gitignore
/vendor
/node_modules
.env
```

---

# Production Checklist

Before production deployment:

| Check | Status |
|---|---|
| APP_DEBUG=false | Required |
| Production DB configured | Required |
| `.env` not committed | Required |
| Logs working | Required |
| Storage permissions fixed | Required |
| HTTPS enabled | Recommended |
| Backups enabled | Recommended |

---

# Important Laravel Production Commands

## Cache Config

```bash
php artisan config:cache
```

---

## Cache Routes

```bash
php artisan route:cache
```

---

## Cache Views

```bash
php artisan view:cache
```

---

## Clear All Cache

```bash
php artisan optimize:clear
```

---

# Production `.env` Settings

Recommended:

```env
APP_ENV=production
APP_DEBUG=false
LOG_LEVEL=error
```

---

# Important Docker Concepts For Production

## Development Mode

Usually:

```yaml
volumes:
  - ./src:/var/www
```

because live file sync is useful.

---

## Production Mode

Usually avoid bind mounts.

Why?

- security
- stability
- performance

Instead:

```text
Code is copied directly into image.
```

---

# Important Real World Workflow

Typical workflow:

```text
Write code
↓
Git commit
↓
Git push
↓
Server pull
↓
Docker rebuild
↓
Run migrations
↓
Clear/cache configs
↓
Application live
```

---

# Common Mistakes Beginners Make

| Mistake | Problem |
|---|---|
| Running `php artisan serve` | Wrong architecture |
| Pushing `.env` to GitHub | Security issue |
| Using localhost for DB_HOST | Docker network issue |
| Forgetting storage permissions | Laravel errors |
| Not rebuilding after Dockerfile change | Old image still used |
| Forgetting migrations | Database errors |

---


## Laravel Artisan

```bash
php artisan migrate
php artisan route:list
php artisan optimize:clear
```

Docker version:

```bash
docker compose exec app php artisan migrate
```

---

## Composer

```bash
docker compose exec app composer install
```

---

## NPM

```bash
docker compose exec app npm install
```

---

# Chapter 19 — Debugging

## Logs

```bash
docker compose logs
```

Specific service:

```bash
docker compose logs nginx
```

---

## Container Shell

```bash
docker compose exec app bash
```

---

## Laravel Logs

```text
storage/logs/laravel.log
```

---

# Chapter 20 — Automatic Database Backup System

# Why Backups Matter

Docker volumes are persistent.

But they are NOT backups.

If:

- disk crashes
- Docker corrupts
- volume deleted accidentally
- server failure happens

then database can still be lost.

So real production systems always use:

- automated backups
- snapshots
- replicas
- disaster recovery

---

# Beginner Production-Like Backup System

Best simple setup:

```text
cron + mysqldump + backup folder
```

---

# Step 1 — Create Backup Folder

Inside project:

```bash
mkdir backups
```

Example:

```text
~/laravel-docker/backups
```

---

# Step 2 — Create Backup Script

Create:

```bash
nano backup.sh
```

Add:

```bash
#!/bin/bash

BACKUP_DIR="$HOME/laravel-docker/backups"

mkdir -p $BACKUP_DIR

docker compose -f $HOME/laravel-docker/docker-compose.yml exec -T db \
mysqldump -u root -proot laravel | gzip \
> $BACKUP_DIR/backup-$(date +%F-%H-%M-%S).sql.gz

find $BACKUP_DIR -type f -mtime +7 -delete
```

---

# Understanding This Script

## `mkdir -p`

Creates backup folder if missing.

---

## `docker compose exec -T db`

Runs command inside database container.

---

## `mysqldump`

Exports database.

---

## `gzip`

Compresses backup.

---

## `$(date ...)`

Creates timestamp backup name.

Example:

```text
backup-2026-05-25-10-45-00.sql.gz
```

---

## `find ... -mtime +7 -delete`

Deletes backups older than 7 days.

Prevents unlimited storage usage.

---

# Step 3 — Make Script Executable

```bash
chmod +x backup.sh
```

---

# Step 4 — Test Backup

```bash
./backup.sh
```

Check:

```bash
ls backups
```

---

# Step 5 — Automate With Cron

Open cron:

```bash
crontab -e
```

Add:

```bash
0 * * * * /home/cat/laravel-docker/backup.sh
```

Meaning:

```text
Run every hour
```

---

# Common Cron Examples

## Daily at 2 AM

```bash
0 2 * * * /home/cat/laravel-docker/backup.sh
```

---

## Every 30 Minutes

```bash
*/30 * * * * /home/cat/laravel-docker/backup.sh
```

---

# Restore Backup

```bash
gunzip < backup.sql.gz | docker compose exec -T db mysql -u root -proot laravel
```

---

# Recommended Real Workflow

## Keep Docker Volume

```yaml
- dbdata:/var/lib/mysql
```

AND ALSO:

## Keep SQL backups

```text
~/laravel-docker/backups
```

This gives:

- persistent Docker storage
- disaster recovery
- portable backups
- safer development

---

# Real Production Concepts

Large systems usually add:

- cloud backups
- replicas
- snapshots
- point-in-time recovery
- multi-region storage
- backup verification

---

# Chapter 21 — Production Concepts

Learn later:

- Redis
- Queue workers
- Supervisor
- CI/CD
- GitHub Actions
- SSL
- Domain setup
- Docker Swarm
- Kubernetes
- Laravel Horizon
- Laravel Octane
- Multi-stage Docker builds

---

# Final Goal

You should eventually be comfortable with:

```text
Clone project
↓
Docker compose up
↓
Everything works
```

That is modern backend development workflow.

