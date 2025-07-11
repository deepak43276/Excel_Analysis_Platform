# Excel Analytics Platform - Deployment Guide

This guide covers multiple hosting options for your Excel Analytics Platform.

## Prerequisites

1. **MongoDB Database**: You'll need a MongoDB database (local or cloud)
2. **Environment Variables**: Configure all required environment variables
3. **Domain/Subdomain**: Optional but recommended for production

## Environment Setup

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/excel_analytics

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Admin Configuration
ADMIN_CODE=your_secure_admin_code

# CORS Configuration
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=https://your-backend-domain.com/api
```

## Hosting Options

### Option 1: Vercel (Recommended for Frontend)

**Frontend Deployment:**

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy Frontend:**
   ```bash
   cd frontend
   vercel
   ```

3. **Set Environment Variables in Vercel Dashboard:**
   - Go to your project settings
   - Add `VITE_API_URL` with your backend URL

**Backend Deployment:**

1. **Deploy Backend:**
   ```bash
   cd backend
   vercel
   ```

2. **Set Environment Variables in Vercel Dashboard:**
   - Add all backend environment variables
   - Connect your MongoDB database

### Option 2: Railway

**Deploy Both Frontend and Backend:**

1. **Install Railway CLI:**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login to Railway:**
   ```bash
   railway login
   ```

3. **Deploy Backend:**
   ```bash
   cd backend
   railway init
   railway up
   ```

4. **Deploy Frontend:**
   ```bash
   cd frontend
   railway init
   railway up
   ```

5. **Set Environment Variables in Railway Dashboard**

### Option 3: Render

**Backend Deployment:**

1. **Connect your GitHub repository to Render**
2. **Create a new Web Service**
3. **Configure:**
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Environment: Node

**Frontend Deployment:**

1. **Create a new Static Site**
2. **Configure:**
   - Build Command: `npm run build`
   - Publish Directory: `dist`

### Option 4: Heroku

**Backend Deployment:**

1. **Install Heroku CLI:**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Deploy:**
   ```bash
   cd backend
   heroku create your-app-name
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

3. **Set Environment Variables:**
   ```bash
   heroku config:set MONGO_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set NODE_ENV=production
   ```

**Frontend Deployment:**

1. **Create a new Heroku app for frontend**
2. **Use the static buildpack:**
   ```bash
   heroku buildpacks:set https://github.com/heroku/heroku-buildpack-static.git
   ```

### Option 5: DigitalOcean App Platform

1. **Connect your GitHub repository**
2. **Create two apps:**
   - Backend: Node.js service
   - Frontend: Static site
3. **Configure environment variables for both**

### Option 6: AWS (Advanced)

**Using AWS Elastic Beanstalk:**

1. **Install AWS CLI and EB CLI**
2. **Initialize EB application:**
   ```bash
   cd backend
   eb init
   eb create
   ```

3. **Deploy:**
   ```bash
   eb deploy
   ```

**Frontend on S3 + CloudFront:**

1. **Build frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Upload to S3 bucket**
3. **Configure CloudFront distribution**

## Database Setup

### MongoDB Atlas (Recommended)

1. **Create MongoDB Atlas account**
2. **Create a new cluster**
3. **Create database user**
4. **Get connection string**
5. **Add to environment variables**

### Local MongoDB

For development only:
```bash
# Install MongoDB locally
# Update MONGO_URI to: mongodb://localhost:27017/excel_analytics
```

## Post-Deployment Steps

1. **Test all functionality:**
   - User registration/login
   - File upload
   - Chart generation
   - Admin panel

2. **Set up monitoring:**
   - Error tracking (Sentry)
   - Performance monitoring
   - Uptime monitoring

3. **Configure SSL certificates** (if not provided by hosting platform)

4. **Set up custom domain** (optional)

## Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Update CORS configuration in `server.js`
   - Ensure frontend URL is correct

2. **Database Connection:**
   - Check MongoDB connection string
   - Verify network access

3. **File Upload Issues:**
   - Check file size limits
   - Verify upload directory permissions

4. **Environment Variables:**
   - Ensure all variables are set
   - Check for typos

### Performance Optimization:

1. **Enable compression:**
   ```javascript
   app.use(compression());
   ```

2. **Add caching headers**
3. **Optimize images and assets**
4. **Use CDN for static files**

## Security Checklist

- [ ] Strong JWT secret
- [ ] Secure admin code
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] File upload validation
- [ ] Input sanitization
- [ ] Rate limiting (consider adding)
- [ ] Security headers

## Cost Estimation

**Free Tier Options:**
- Vercel: Free tier available
- Railway: Free tier available
- Render: Free tier available
- Heroku: No free tier (paid only)

**Paid Options:**
- DigitalOcean: $5-12/month
- AWS: Pay-as-you-go
- Google Cloud: Pay-as-you-go

## Recommended Setup

For a production application, I recommend:

1. **Frontend:** Vercel (excellent performance, free tier)
2. **Backend:** Railway or Render (good free tiers)
3. **Database:** MongoDB Atlas (free tier available)
4. **Domain:** Custom domain with SSL

This combination provides excellent performance, reliability, and cost-effectiveness for most use cases. 