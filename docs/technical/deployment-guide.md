# Deployment Guide

## Infrastructure

| Component | Technology | Notes |
|-----------|-----------|-------|
| Server | Ubuntu VPS (22.04+) | Single server Phase 1 |
| Reverse Proxy | Nginx | SSL termination, static files |
| Process Manager | PM2 | Auto-restart, clustering |
| SSL | Certbot (Let's Encrypt) | Auto-renewal |
| Database | PostgreSQL 15+ | Same server or managed DB |
| Container (optional) | Docker Compose | For consistency across envs |

## Domain Setup

| Subdomain | Points To | Purpose |
|-----------|-----------|---------|
| `satujasa.my.id` | VPS IP | Frontend (web app) |
| `api.satujasa.my.id` | VPS IP | Backend API |

## Directory Structure (Server)

```
/opt/satujasa/
├── backend/          # Built backend
├── frontend/         # Built frontend (static)
├── .env              # Production environment
├── ecosystem.config.js  # PM2 config
└── nginx/            # Nginx site configs
```

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/satujasa

# Auth
SESSION_SECRET=<random-64-chars>
JWT_SECRET=<random-64-chars>
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://satujasa.my.id

# Super Admin (seed)
SUPER_ADMIN_EMAIL=admin@satujasa.my.id
SUPER_ADMIN_PASSWORD=<initial-password>
```

## Deployment Steps

### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install Certbot
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Database Setup
```bash
sudo -u postgres psql
CREATE USER satujasa WITH PASSWORD '<password>';
CREATE DATABASE satujasa OWNER satujasa;
\q
```

### 3. Build & Deploy
```bash
# Clone & build
git clone <repo> /opt/satujasa/source
cd /opt/satujasa/source
npm install
npm run build --workspace=packages/backend
npm run build --workspace=packages/frontend

# Copy builds
cp -r packages/backend/dist /opt/satujasa/backend
cp -r packages/frontend/dist /opt/satujasa/frontend

# Run migrations
cd /opt/satujasa/backend
npx drizzle-kit migrate

# Seed super admin
node seed.js
```

### 4. PM2 Configuration

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'satujasa-api',
    script: './backend/server.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 5. Nginx Configuration

```nginx
# /etc/nginx/sites-available/satujasa-api
server {
    server_name api.satujasa.my.id;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# /etc/nginx/sites-available/satujasa-web
server {
    server_name satujasa.my.id;
    root /opt/satujasa/frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/satujasa-api /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/satujasa-web /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. SSL
```bash
sudo certbot --nginx -d satujasa.my.id -d api.satujasa.my.id
```

## CI/CD (Phase 2)

- GitHub Actions: build → test → deploy on push to `release` branch
- Zero-downtime deploy via PM2 reload
- Database migration as part of deploy pipeline

## Monitoring

- PM2 logs: `pm2 logs satujasa-api`
- Nginx logs: `/var/log/nginx/access.log`, `error.log`
- Health check: `GET /api/v1/health`

## Rollback

```bash
# Keep previous build
cp -r /opt/satujasa/backend /opt/satujasa/backend.bak

# If deploy fails
cp -r /opt/satujasa/backend.bak /opt/satujasa/backend
pm2 reload satujasa-api
```
