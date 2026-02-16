# 🚀 Deployment Guide

Complete step-by-step guide to deploy the Ryze AI UI Generator.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] OpenAI API Key ([Get here](https://platform.openai.com/api-keys))
- [ ] GitHub account
- [ ] Git installed locally
- [ ] Node.js 18+ installed
- [ ] Project tested locally

---

## 🌐 Option 1: Deploy to Vercel (Recommended)

### Why Vercel?
✅ **Zero-config deployment** for Next.js  
✅ **Automatic HTTPS**  
✅ **Global CDN**  
✅ **Free for hobby projects**  
✅ **Built by Next.js creators**

### Method A: One-Click Deploy

1. **Click the deploy button:**

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ryze-ui-generator)

2. **Follow the prompts:**
   - Connect your GitHub account
   - Name your project
   - Add environment variable: `OPENAI_API_KEY`

3. **Done!** Your app will be live in ~2 minutes

### Method B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Navigate to project
cd ryze-ui-generator

# Deploy
vercel

# Follow prompts:
# ? Set up and deploy "~/ryze-ui-generator"? Y
# ? Which scope? [Select your account]
# ? Link to existing project? N
# ? What's your project's name? ryze-ui-generator
# ? In which directory is your code located? ./

# Add environment variables
vercel env add OPENAI_API_KEY

# Paste your OpenAI API key when prompted

# Deploy to production
vercel --prod
```

### Method C: GitHub Integration

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/ryze-ui-generator.git
git push -u origin main
```

2. **Connect to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your repo
   - Add `OPENAI_API_KEY` environment variable
   - Click "Deploy"

3. **Automatic deployments:**
   - Every push to `main` auto-deploys
   - Preview deployments for PRs
   - Instant rollbacks available

---

## 🔧 Option 2: Deploy to Netlify

### Step-by-Step

1. **Build the project:**
```bash
npm run build
```

2. **Create `netlify.toml`:**
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

3. **Deploy via Netlify CLI:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize site
netlify init

# Add environment variable
netlify env:set OPENAI_API_KEY your_key_here

# Deploy
netlify deploy --prod
```

4. **Or deploy via UI:**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "Add new site"
   - Import from GitHub
   - Configure build settings
   - Add environment variables
   - Deploy

---

## 🐳 Option 3: Docker Deployment

### Create Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Deploy with Docker

```bash
# Build image
docker build -t ryze-ui-generator .

# Run container
docker run -p 3000:3000 \
  -e OPENAI_API_KEY=your_key_here \
  ryze-ui-generator

# Or use docker-compose
cat > docker-compose.yml << EOF
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - OPENAI_API_KEY=\${OPENAI_API_KEY}
EOF

docker-compose up -d
```

---

## ☁️ Option 4: Deploy to AWS

### Using AWS Amplify

1. **Install Amplify CLI:**
```bash
npm install -g @aws-amplify/cli
amplify configure
```

2. **Initialize Amplify:**
```bash
amplify init
# Follow prompts
```

3. **Deploy:**
```bash
amplify push
amplify publish
```

### Using AWS Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init

# Create environment
eb create production

# Deploy
eb deploy

# Set environment variables
eb setenv OPENAI_API_KEY=your_key_here
```

---

## 🔐 Environment Variables Setup

### Required Variables

```bash
# OpenAI API Key (Required)
OPENAI_API_KEY=sk-your-openai-key-here

# Optional: App URL for absolute links
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Platform-Specific Setup

**Vercel:**
```bash
vercel env add OPENAI_API_KEY
```

**Netlify:**
```bash
netlify env:set OPENAI_API_KEY your_key_here
```

**Heroku:**
```bash
heroku config:set OPENAI_API_KEY=your_key_here
```

**Railway:**
```bash
railway variables set OPENAI_API_KEY=your_key_here
```

---

## 🧪 Post-Deployment Testing

### Checklist

After deployment, verify:

- [ ] **Homepage loads** without errors
- [ ] **Chat input** accepts messages
- [ ] **UI generation** works end-to-end
- [ ] **Code editor** displays correctly
- [ ] **Live preview** renders UIs
- [ ] **Version history** saves/loads
- [ ] **Mobile responsive** layout works
- [ ] **Environment variables** are set

### Test Commands

```bash
# Health check
curl https://your-app.vercel.app

# API test
curl -X POST https://your-app.vercel.app/api/generate \
  -H "Content-Type: application/json" \
  -d '{"userIntent":"Create a simple button","conversationHistory":[],"isModification":false}'
```

---

## 🐛 Troubleshooting

### Common Issues

#### **Issue: "OpenAI API key not found"**

**Solution:**
```bash
# Check if variable is set
vercel env ls

# Add if missing
vercel env add OPENAI_API_KEY

# Redeploy
vercel --prod
```

#### **Issue: Build fails on deployment**

**Solution:**
```bash
# Test build locally first
npm run build

# Check for TypeScript errors
npm run type-check

# Check for missing dependencies
npm install
```

#### **Issue: Module not found errors**

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or use exact versions
npm ci
```

#### **Issue: Preview not rendering**

**Solution:**
- Check browser console for errors
- Verify iframe sandbox permissions
- Test with different browsers
- Check component library imports

#### **Issue: Slow API responses**

**Solution:**
- Check OpenAI API quota/limits
- Verify network connectivity
- Consider edge functions (Vercel)
- Monitor API usage

---

## 📊 Monitoring & Analytics

### Vercel Analytics

```bash
# Add Vercel Analytics
npm install @vercel/analytics

# In app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Error Tracking with Sentry

```bash
npm install @sentry/nextjs

# Run configuration
npx @sentry/wizard@latest -i nextjs
```

---

## 🔄 CI/CD Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🎯 Performance Optimization

### Pre-Deployment Optimization

```bash
# Analyze bundle size
npm run build
npm run analyze

# Optimize images (if any)
npx next-optimize-images

# Check lighthouse score
npx lighthouse https://your-app.vercel.app
```

### Vercel-Specific Optimizations

1. **Enable Edge Functions:**
```javascript
// app/api/generate/route.ts
export const runtime = 'edge'; // Use Edge Runtime
```

2. **Add caching headers:**
```javascript
export async function GET() {
  return new Response('...', {
    headers: {
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
```

---

## 📝 Maintenance

### Regular Tasks

**Weekly:**
- [ ] Check error logs
- [ ] Monitor API usage
- [ ] Review user feedback

**Monthly:**
- [ ] Update dependencies
- [ ] Review performance metrics
- [ ] Check security advisories

**As Needed:**
- [ ] Scale based on traffic
- [ ] Update OpenAI models
- [ ] Add new features

---

## 📞 Support

### Getting Help

**Vercel Issues:**
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Discord](https://vercel.com/discord)
- [Vercel Support](https://vercel.com/support)

**Next.js Issues:**
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js GitHub](https://github.com/vercel/next.js)
- [Next.js Discord](https://nextjs.org/discord)

**Project Issues:**
- GitHub Issues: [yourusername/ryze-ui-generator/issues](#)
- Email: your.email@example.com

---

## ✅ Final Checklist

Before considering deployment complete:

- [ ] App is live and accessible
- [ ] All environment variables set
- [ ] Custom domain configured (optional)
- [ ] HTTPS enabled
- [ ] Error tracking set up
- [ ] Analytics configured
- [ ] Performance tested
- [ ] Mobile tested
- [ ] README updated with live URL
- [ ] Demo video shows deployed app

---

**Congratulations! Your app is now live! 🎉**

Share it: `https://your-app.vercel.app`
