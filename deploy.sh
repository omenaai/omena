#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "==> Installing Docker..."
if ! command -v docker &>/dev/null; then
  curl -fsSL https://get.docker.com | sh
  sudo usermod -aG docker "$USER"
  echo "Docker installed. You may need to log out and back in for group changes."
fi

if ! docker compose version &>/dev/null; then
  echo "ERROR: Docker Compose plugin not found. Make sure Docker >= 23 is installed."
  exit 1
fi

cd "$REPO_DIR"

if [ ! -f .env ]; then
  cp .env.example .env
  echo ""
  echo "IMPORTANT: .env created from .env.example."
  echo "Fill in all required values before continuing:"
  echo "  POSTGRES_PASSWORD  - run: openssl rand -hex 32"
  echo "  BETTER_AUTH_SECRET - run: openssl rand -hex 32"
  echo "  AUTH_SESSION_SECRET - optional, defaults to BETTER_AUTH_SECRET in docker-compose"
  echo "  BETTER_AUTH_URL    - your public domain, e.g. https://yourdomain.com"
  echo "  HELIUS_API_KEY     - from helius.dev"
  echo "  COINGECKO_API_KEY  - from coingecko.com"
  echo ""
  echo "Edit .env now, then re-run this script."
  exit 0
fi

echo "==> Building and starting services..."
docker compose pull --ignore-pull-failures || true
docker compose build --no-cache
docker compose up -d

echo ""
echo "==> Services started. Check status with: docker compose ps"
echo ""
echo "==> To set up HTTPS with Let's Encrypt, run after DNS is pointed to this server:"
echo ""
echo "  sudo apt-get update"
echo "  sudo apt-get install -y certbot"
echo "  sudo certbot certonly --webroot -w ./nginx/certbot -d yourdomain.com"
echo "  sudo mkdir -p ./nginx/ssl/live/yourdomain.com"
echo "  sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./nginx/ssl/live/yourdomain.com/"
echo "  sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./nginx/ssl/live/yourdomain.com/"
echo "  docker compose exec nginx nginx -s reload"
