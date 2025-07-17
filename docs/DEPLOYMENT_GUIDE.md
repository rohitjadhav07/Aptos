# 🚀 Deployment Guide - AptosAI Grid

This guide will help you deploy AptosAI Grid to Vercel and set up your production environment.

## 📋 Prerequisites

- GitHub account
- Vercel account
- Node.js 18+ installed locally
- Aptos CLI (for smart contract deployment)

## 🔧 Environment Setup

### 1. Environment Variables

Create a `.env` file in the root directory:

```env
# Aptos Configuration
VITE_APTOS_NETWORK=testnet
VITE_CONTRACT_ADDRESS=0x8fd669458715f59eee97ff0baa117b648c8649f9d43f423578261dd26e663a3a

# API Configuration
VITE_API_BASE_URL=https://your-app.vercel.app/api

# Database (if using)
DATABASE_URL=your_database_connection_string

# Optional: Analytics
VITE_ANALYTICS_ID=your_analytics_id
```

### 2. Vercel Environment Variables

In your Vercel dashboard, add these environment variables:

```
NODE_ENV=production
VITE_APTOS_NETWORK=testnet
VITE_CONTRACT_ADDRESS=0x8fd669458715f59eee97ff0baa117b648c8649f9d43f423578261dd26e663a3a
```

## 🌐 Vercel Deployment

### Method 1: GitHub Integration (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "🚀 Initial deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Visit [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select "AptosAiGrid" repository

3. **Configure Build Settings**
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave empty)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-app.vercel.app`

### Method 2: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

## 🔗 Custom Domain Setup

1. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Configure DNS records as instructed

2. **DNS Configuration**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   
   Type: A
   Name: @
   Value: 76.76.19.61
   ```

## 📊 Performance Optimization

### 1. Build Optimization

Update `vite.config.ts`:
```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          aptos: ['@aptos-labs/ts-sdk'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
```

### 2. Image Optimization

Add to `vercel.json`:
```json
{
  "images": {
    "domains": ["your-domain.com"],
    "formats": ["image/webp", "image/avif"]
  }
}
```

## 🔒 Security Configuration

### 1. Headers Configuration

Add to `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### 2. CORS Configuration

For API routes, add CORS headers:
```typescript
export default function handler(req: Request, res: Response) {
  res.setHeader('Access-Control-Allow-Origin', 'https://your-domain.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Your API logic here
}
```

## 📈 Monitoring & Analytics

### 1. Vercel Analytics

Enable in `vercel.json`:
```json
{
  "analytics": {
    "id": "your-analytics-id"
  }
}
```

### 2. Error Tracking

Add Sentry or similar:
```bash
npm install @sentry/react @sentry/vite-plugin
```

## 🔄 CI/CD Pipeline

### 1. GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Run tests
        run: npm test
        
      - name: Build project
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### 2. Automated Testing

Add to `package.json`:
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

## 🌍 Multi-Environment Setup

### 1. Staging Environment

Create `vercel-staging.json`:
```json
{
  "env": {
    "NODE_ENV": "staging",
    "VITE_APTOS_NETWORK": "testnet"
  }
}
```

### 2. Production Environment

Create `vercel-production.json`:
```json
{
  "env": {
    "NODE_ENV": "production",
    "VITE_APTOS_NETWORK": "mainnet"
  }
}
```

## 🔧 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Environment Variables Not Working**
   - Ensure variables start with `VITE_` for client-side
   - Redeploy after adding new variables
   - Check Vercel dashboard for correct values

3. **API Routes Not Working**
   - Verify `vercel.json` routing configuration
   - Check function timeout limits
   - Review server logs in Vercel dashboard

### Performance Issues

1. **Slow Build Times**
   - Enable build cache in Vercel
   - Optimize dependencies
   - Use dynamic imports for large libraries

2. **Large Bundle Size**
   - Analyze bundle with `npm run build -- --analyze`
   - Implement code splitting
   - Remove unused dependencies

## 📱 Mobile Optimization

1. **PWA Configuration**
   ```typescript
   // vite.config.ts
   import { VitePWA } from 'vite-plugin-pwa';
   
   export default defineConfig({
     plugins: [
       VitePWA({
         registerType: 'autoUpdate',
         workbox: {
           globPatterns: ['**/*.{js,css,html,ico,png,svg}']
         }
       })
     ]
   });
   ```

2. **Responsive Design**
   - Test on multiple devices
   - Optimize touch interactions
   - Ensure wallet compatibility on mobile

## 🚀 Go Live Checklist

- [ ] Environment variables configured
- [ ] Custom domain set up
- [ ] SSL certificate active
- [ ] Analytics tracking enabled
- [ ] Error monitoring configured
- [ ] Performance optimized
- [ ] Mobile testing completed
- [ ] Security headers configured
- [ ] Backup strategy in place
- [ ] Monitoring alerts set up

## 📞 Support

Need help with deployment?
- **Discord**: [Join our community](https://discord.gg/aptosai)
- **GitHub**: [Create an issue](https://github.com/rohitjadhav07/AptosAiGrid/issues)
- **Email**: support@aptosai-grid.com

---

*Happy deploying! 🚀*