#!/bin/bash

# Excel Analytics Platform - Quick Deployment Script
# This script helps you deploy your application

echo "🚀 Excel Analytics Platform - Deployment Helper"
echo "=============================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if environment files exist
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend .env file not found. Please create it based on backend/env.example"
    echo "   cp backend/env.example backend/.env"
    echo "   # Then edit backend/.env with your actual values"
fi

if [ ! -f "frontend/.env" ]; then
    echo "⚠️  Frontend .env file not found. Please create it based on frontend/env.example"
    echo "   cp frontend/env.example frontend/.env"
    echo "   # Then edit frontend/.env with your actual values"
fi

echo ""
echo "📋 Choose your deployment platform:"
echo "1. Vercel (Recommended - Free tier available)"
echo "2. Railway (Free tier available)"
echo "3. Render (Free tier available)"
echo "4. Heroku (Paid only)"
echo "5. DigitalOcean App Platform"
echo "6. Manual deployment instructions"

read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo ""
        echo "🎯 Deploying to Vercel..."
        echo ""
        echo "Step 1: Install Vercel CLI"
        echo "   npm i -g vercel"
        echo ""
        echo "Step 2: Deploy Backend"
        echo "   cd backend"
        echo "   vercel"
        echo ""
        echo "Step 3: Deploy Frontend"
        echo "   cd frontend"
        echo "   vercel"
        echo ""
        echo "Step 4: Set environment variables in Vercel dashboard"
        echo "   - Go to your project settings"
        echo "   - Add all required environment variables"
        ;;
    2)
        echo ""
        echo "🚂 Deploying to Railway..."
        echo ""
        echo "Step 1: Install Railway CLI"
        echo "   npm i -g @railway/cli"
        echo ""
        echo "Step 2: Login to Railway"
        echo "   railway login"
        echo ""
        echo "Step 3: Deploy Backend"
        echo "   cd backend"
        echo "   railway init"
        echo "   railway up"
        echo ""
        echo "Step 4: Deploy Frontend"
        echo "   cd frontend"
        echo "   railway init"
        echo "   railway up"
        ;;
    3)
        echo ""
        echo "🎨 Deploying to Render..."
        echo ""
        echo "Step 1: Connect your GitHub repository to Render"
        echo "Step 2: Create a new Web Service for backend"
        echo "   - Build Command: npm install"
        echo "   - Start Command: node server.js"
        echo "Step 3: Create a new Static Site for frontend"
        echo "   - Build Command: npm run build"
        echo "   - Publish Directory: dist"
        ;;
    4)
        echo ""
        echo "🦊 Deploying to Heroku..."
        echo ""
        echo "Step 1: Install Heroku CLI"
        echo "   # Download from https://devcenter.heroku.com/articles/heroku-cli"
        echo ""
        echo "Step 2: Deploy Backend"
        echo "   cd backend"
        echo "   heroku create your-app-name"
        echo "   git add ."
        echo "   git commit -m 'Deploy to Heroku'"
        echo "   git push heroku main"
        echo ""
        echo "Step 3: Set Environment Variables"
        echo "   heroku config:set MONGO_URI=your_mongodb_uri"
        echo "   heroku config:set JWT_SECRET=your_jwt_secret"
        echo "   heroku config:set NODE_ENV=production"
        ;;
    5)
        echo ""
        echo "🐙 Deploying to DigitalOcean App Platform..."
        echo ""
        echo "Step 1: Connect your GitHub repository to DigitalOcean"
        echo "Step 2: Create two apps:"
        echo "   - Backend: Node.js service"
        echo "   - Frontend: Static site"
        echo "Step 3: Configure environment variables for both"
        ;;
    6)
        echo ""
        echo "📖 Manual Deployment Instructions"
        echo "================================"
        echo ""
        echo "1. Set up MongoDB database (MongoDB Atlas recommended)"
        echo "2. Configure environment variables"
        echo "3. Build frontend: cd frontend && npm run build"
        echo "4. Start backend: cd backend && npm start"
        echo "5. Serve frontend files from a web server"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md"
echo "🔧 For troubleshooting, check the deployment guide"
echo ""
echo "✅ Deployment instructions completed!" 