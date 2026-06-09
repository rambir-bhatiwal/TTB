# Laravel 12 + React + Inertia + Docker Complete Setup Guide

## Project Architecture

This project uses:

- Laravel 12 backend
- React frontend
- Inertia.js bridge
- Vite frontend bundler
- Docker-based development setup
- MySQL database
- Nginx web server

Important:

- Blade is NOT used as frontend UI
- React is the frontend UI
- Laravel still handles:
  - routing
  - authentication
  - sessions
  - validation
  - controllers
  - middleware

---

# Final Architecture Understanding

## Request Flow

```text
Browser
   ↓
Nginx
   ↓
Laravel Route
   ↓
Inertia::render()
   ↓
React Page
```

---

# Docker Container Responsibilities

## app container

Purpose:

- PHP runtime
- Laravel backend
- Artisan commands
- Composer
- PHP-FPM

Commands run here:

```bash
composer install
php artisan migrate
php artisan make:model
```

---

## node container

Purpose:

- React
- npm
- Vite dev server
- frontend compilation

Commands run here:

```bash
npm install
npm run dev
npm run build
```

---

## nginx container

Purpose:

- Public web server
- Serves Laravel application
- Forwards PHP requests to app container

---

## mysql container

Purpose:

- Database server

---

# Why Separate Containers?

This is proper Docker architecture.

Each container should have:

- single responsibility
- isolated environment
- independent service

Benefits:

- easier debugging
- cleaner architecture
- scalable
- production friendly
- easier deployments

---

# Docker Compose Final Understanding

## docker-compose.yml

### app service

```yaml
app:
```

Runs Laravel backend.

---

### node service

```yaml
node:
```

Runs:

```bash
npm run dev
```

Automatically starts Vite.

---

### nginx service

```yaml
nginx:
```

Public entry point.

Browser accesses:

```text
http://localhost:8000
```

---

### db service

```yaml
db:
```

Runs MySQL.

---

# Important Port Understanding

## Development Ports

| Service | Internal Port | Host Port | Purpose |
|---|---|---|---|
| nginx | 80 | 8000 | Browser access |
| vite | 5173 | 5173 | React dev server |
| mysql | 3306 | 3306 | Database access |

---

# What Does This Mean?

Example:

```yaml
ports:
  - "8000:80"
```

Meaning:

```text
Your PC port 8000
→ Docker container port 80
```

Format:

```text
HOST_PORT:CONTAINER_PORT
```

---

# Why Vite Uses Port 5173

During development:

```text
Vite runs live development server
```

Features:

- hot reload
- instant frontend updates
- fast refresh
- live React rebuilding

Browser directly connects to Vite.

---

# Why Blank Screen Happened

Problem:

Two Vite servers were running.

One inside:

- app container
- node container

Both tried using:

```text
5173
```

So Vite automatically changed:

```text
5173 → 5174
```

But Docker exposed only:

```text
5173
```

Result:

- frontend assets failed
- blank page

---

# Correct Solution

Only node container should run Vite.

App container should NEVER run:

```bash
npm run dev
```

---

# Correct Dockerfile

```dockerfile
FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev

RUN docker-php-ext-install \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip

RUN mkdir -p /tmp && chmod 777 /tmp

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

CMD ["php-fpm"]
```

---

# Important Understanding About Dockerfile

This container should ONLY run:

```text
PHP + Laravel
```

NOT:

- Vite
- npm
- React dev server

---

# Correct Node Service

```yaml
node:
  image: node:22

  container_name: laravel_node

  working_dir: /var/www

  volumes:
    - ./src:/var/www

  ports:
    - "5173:5173"

  command: sh -c "npm install && npm run dev -- --host 0.0.0.0"

  networks:
    - laravel
```

---

# Why --host 0.0.0.0 Is Needed

Without it:

```text
Vite only accessible inside container
```

With:

```bash
--host 0.0.0.0
```

Docker can expose Vite outside container.

---

# Correct vite.config.js

```js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        hmr: {
            host: 'localhost',
        },
    },

    plugins: [
        laravel({
            input: ['resources/js/app.jsx'],
            refresh: true,
        }),

        react(),
    ],
});
```

---

# Why strictPort: true

Without it:

```text
5173 busy → vite changes to 5174 automatically
```

That breaks Docker port mapping.

With:

```js
strictPort: true
```

Vite fails instead of silently changing ports.

Much easier debugging.

---

# Manual React + Inertia Installation Steps

## Step 1 — Install React Packages

Inside node container:

```bash
npm install react react-dom
npm install @vitejs/plugin-react
npm install @inertiajs/react
```

---

## Step 2 — Install Laravel Inertia Package

Inside app container:

```bash
composer require inertiajs/inertia-laravel
```

---

# Why Inertia Exists

Inertia acts as bridge between:

```text
Laravel backend
↔
React frontend
```

Without creating separate API architecture.

---

# app.jsx

File:

```text
resources/js/app.jsx
```

Purpose:

- bootstraps React
- initializes Inertia
- loads pages dynamically

---

# Why import.meta.glob() Used

```js
import.meta.glob('./Pages/**/*.jsx', { eager: true })
```

Automatically loads React pages.

Example:

```text
resources/js/Pages/Home.jsx
resources/js/Pages/Login.jsx
resources/js/Pages/Dashboard.jsx
```

---

# Why app.blade.php Needed

Very important concept.

Even though frontend uses React:

```text
Inertia still needs ONE Blade root file
```

This file is NOT frontend UI.

It only:

- loads React
- loads Vite assets
- provides root mounting point

Equivalent to:

```text
index.html in React
```

---

# Important Difference

## Traditional Laravel

```text
Blade = frontend UI
```

Example:

```text
home.blade.php
login.blade.php
```

---

## Inertia Architecture

```text
React = frontend UI
Blade = React bootstrap container only
```

---

# app.blade.php Example

```php
<!DOCTYPE html>
<html>
<head>
    @viteReactRefresh
    @vite('resources/js/app.jsx')
    @inertiaHead
</head>
<body>
    @inertia
</body>
</html>
```

---

# Why @inertia Needed

This is React mounting point.

Equivalent idea:

```html
<div id="app"></div>
```

---

# Route Setup

```php
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});
```

---

# What Inertia::render('Home') Means

Laravel loads:

```text
resources/js/Pages/Home.jsx
```

Automatically.

---

# React Page Example

```jsx
export default function Home() {
    return (
        <div>
            <h1>Laravel 12 + React + Inertia</h1>
        </div>
    );
}
```

---

# Development vs Production

## Development

Uses:

```bash
npm run dev
```

Vite server runs continuously.

Needs:

```text
5173 port
```

---

## Production

Uses:

```bash
npm run build
```

Creates:

```text
public/build/
```

Now Vite server NOT needed.

No port 5173 in production.

---

# Production Architecture

Usually:

```text
Internet
   ↓
Nginx :80 / :443
   ↓
PHP-FPM
   ↓
Laravel
```

No running Vite dev server.

---

# Common Errors Faced

## Error

```text
View [app] not found
```

Reason:

Missing:

```text
resources/views/app.blade.php
```

---

## Error

```text
Vite manifest not found
```

Reason:

Laravel could not connect to Vite dev server.

Usually because:

- Vite crashed
- wrong port
- duplicate Vite server

---

## Blank Screen

Usually:

- Vite assets not loading
- wrong port
- React compile error
- Vite inaccessible from browser

---

# Useful Docker Commands

## Start containers

```bash
docker compose up -d
```

---

## Rebuild containers

```bash
docker compose up --build -d
```

---

## Stop containers

```bash
docker compose down
```

---

## Check running containers

```bash
docker compose ps
```

---

## View node logs

```bash
docker compose logs -f node
```

---

## Enter app container

```bash
docker compose exec app bash
```

---

## Enter node container

```bash
docker compose exec node sh
```

---

# Final Important Understanding

This architecture gives benefits of:

- Laravel backend simplicity
- React frontend power
- No API complexity
- Session-based authentication
- Modern SPA-like experience
- Easier fullstack development

Best for:

- admin panels
- dashboards
- SaaS apps
- internal tools
- CRM systems
- management systems

without needing separate frontend/backend projects.


# How to update Custom Inertia Root ID

Default Inertia root:

```php
@inertia
```

Custom root example:

```php
@inertia('xman')
```

File:

```text
resources/views/app.blade.php
```

Also update React side:

```js
createInertiaApp({
    id: 'xman',
});
```

File:

```text
resources/js/app.jsx
```

Important:

Both ids must match exactly.

Otherwise error comes:

```text
Cannot read properties of null (reading 'component')
```
