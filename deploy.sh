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
npm run build

# 5. Zero-Downtime Reload with PM2
echo "🔄 Reloading Application (Zero Downtime)..."
pm2 reload ecosystem.config.js --env production

# 6. Success
echo "✅ Deployment Successful! Site is live and updated."
