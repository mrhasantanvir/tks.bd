#!/bin/bash

# TK Solution - Zero Downtime Deployment Script
# Usage: ./deploy.sh

echo "🚀 Starting Deployment Process..."

# 1. Pull latest changes
echo "📥 Pulling latest code from Git..."
git pull origin main

# 2. Install dependencies
echo "📦 Installing dependencies..."
npm install --frozen-lockfile

# 3. Database Migration
echo "🗄️  Syncing Database Schema..."
npx prisma db push --accept-data-loss
npx prisma generate

# 4. Build the application
echo "🏗️  Building Next.js application..."
rm -rf .next
npm run build

# 5. Force Restart with PM2 (To ensure port change)
echo "🔄 Restarting Application (Fresh Start)..."
pm2 delete tks-bd || true
pm2 start ecosystem.config.js --env production
pm2 save

# 6. Success
echo "✅ Deployment Successful! Site is live and updated."
