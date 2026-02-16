# 🚀 Deployment Guide

Complete step-by-step guide to deploy Ryze UI Generator to production.

---

## 📋 Pre-Deployment Checklist

- [ ] Code is committed to Git
- [ ] All tests pass locally
- [ ] `.env.example` is updated
- [ ] README is complete
- [ ] OpenAI API key is ready
- [ ] GitHub account is ready
- [ ] Vercel account is ready (or alternative platform)

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended) ⭐

**Why Vercel?**
- ✅ Zero config for Next.js
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Free tier available
- ✅ Easy environment variables
- ✅ Instant rollbacks

**Time: ~5 minutes**

---

### Option 2: Netlify

**Why Netlify?**
- ✅ Simple UI
- ✅ Good free tier
- ✅ Form handling
- ✅ Split testing

**Time: ~10 minutes**

---

### Option 3: Railway

**Why Railway?**
- ✅ Full stack support
- ✅ Database hosting
- ✅ Simple pricing

**Time: ~10 minutes**

---

## 🎯 Detailed Instructions

### OPTION 1: Deploy to Vercel (Detailed)

#### Step 1: Push to GitHub

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Ryze UI Generator"

# Create GitHub repo and push
# Go to github.com → New Repository → ryze-ui-generator

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/ryze-ui-generator.git

# Push
git branch -M main
git push -u origin main
```

---

#### Step 2: Sign up/Login to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" or "Login"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access GitHub

---

#### Step 3: Import Project

1. Click "Add New..." → "Project"
2. Select "Import Git Repository"
3. Find `ryze-ui-generator` in the list
4. Click "Import"

---

#### Step 4: Configure Project

**Framework Preset:** Next.js (auto-detected)

**Root Directory:** `./` (leave as is)

**Build Command:** `npm run build` (auto-filled)

**Output Directory:** `.next` (auto-filled)

**Install Command:** `npm install` (auto-filled)

Click "Deploy" - **BUT WAIT!** First add environment variables:

---

#### Step 5: Add Environment Variables

Before deploying, click "Environment Variables" section:

**Add these variables:**

| Key | Value | Environment |
|-----|-------|-------------|
| `OPENAI_API_KEY` | `sk-your-actual-key` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |

**To get OpenAI API Key:**
1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create new key
3. Copy immediately (you can't see it again!)
4. Paste in Vercel

---

#### Step 6: Deploy!

1. Click "Deploy"
2. Wait 2-3 minutes
3. See build logs in real-time
4. Get your live URL! 🎉

**Your URL will be:**
```
https://ryze-ui-generator.vercel.app
```

---

#### Step 7: Test Deployment

1. Open your Vercel URL
2. Try creating a simple UI
3. Check if generation works
4. Verify live preview loads
5. Test all features

**If something fails:**
- Check Vercel logs: Project → Deployments → Latest → View Function Logs
- Verify environment variables: Project → Settings → Environment Variables
- Check build logs: Look for errors during build

---

#### Step 8: Custom Domain (Optional)

1. Go to Project → Settings → Domains
2. Click "Add"
3. Enter your domain: `your-custom-domain.com`
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-60 minutes)

---

### Vercel Pro Tips

**Automatic Deployments:**
- Every push to `main` branch → Production deployment
- Every push to other branches → Preview deployment
- Every PR → Preview deployment with unique URL

**Environment Variables per Branch:**
```
Production only: Add to "Production" environment
Preview + Production: Select both
```

**Instant Rollbacks:**
1. Go to Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

**View Logs:**
```
Vercel Dashboard → Your Project → View Function Logs
```

---

## 🔧 Troubleshooting

### Common Issues

#### Issue 1: Build Fails

**Error:**
```
Module not found: Can't resolve '@/components/library'
```

**Fix:**
```bash
# Check tsconfig.json paths are correct
# Verify all imports use @/ prefix
# Rebuild locally first: npm run build
```

---

#### Issue 2: OpenAI API Fails

**Error:**
```
OpenAI API failed: Invalid API key
```

**Fix:**
1. Verify API key is correct
2. Check Vercel environment variables
3. Redeploy after adding key
4. Test key locally first

---

#### Issue 3: Preview Not Loading

**Error:**
```
Iframe sandbox blocked
```

**Fix:**
```typescript
// In LivePreview.tsx, check iframe sandbox attributes
sandbox="allow-scripts allow-same-origin"
```

---

#### Issue 4: Monaco Editor Not Loading

**Error:**
```
Monaco editor failed to initialize
```

**Fix:**
```bash
# Ensure monaco-editor is in dependencies, not devDependencies
npm install monaco-editor @monaco-editor/react
```

---

## 🎨 Post-Deployment Optimization

### 1. Add Analytics

```typescript
// app/layout.tsx
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

---

### 2. Enable Speed Insights

```bash
npm install @vercel/speed-insights

# Then in layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';
```

---

### 3. Add SEO Metadata

```typescript
// app/layout.tsx
export const metadata = {
  title: 'Ryze UI Generator',
  description: 'AI-powered deterministic UI generation',
  openGraph: {
    title: 'Ryze UI Generator',
    description: 'Generate UIs from natural language',
    url: 'https://ryze-ui-generator.vercel.app',
    images: ['/og-image.png'],
  },
};
```

---

### 4. Configure Caching

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, must-revalidate' },
        ],
      },
    ];
  },
};
```

---

## 📊 Monitoring & Maintenance

### Check Application Health

**Vercel Dashboard:**
- Deployments: See all deployments
- Analytics: User metrics
- Logs: Runtime logs
- Performance: Core Web Vitals

**Manual Testing:**
```bash
# Test API endpoint
curl https://your-app.vercel.app/api/generate \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"userIntent": "Create a button"}'
```

---

### Set Up Alerts

**Vercel Integrations:**
1. Go to Integrations marketplace
2. Add Slack/Discord/Email notifications
3. Configure alert thresholds
4. Get notified on failures

---

## 💰 Cost Estimation

### Vercel Costs

**Free Tier (Hobby):**
- ✅ 100 GB bandwidth/month
- ✅ Unlimited deployments
- ✅ 100 hours serverless function execution
- ✅ Perfect for this project!

**Pro Tier ($20/month):**
- More bandwidth
- Longer function timeouts
- Team collaboration
- Only needed for high traffic

---

### OpenAI Costs

**GPT-4 Turbo Pricing:**
- Input: $0.01 per 1K tokens
- Output: $0.03 per 1K tokens

**Estimated cost per generation:**
- Average: ~2000 tokens total
- Cost: ~$0.05 per generation
- 100 generations: ~$5
- 1000 generations: ~$50

**Cost Optimization:**
- Use GPT-3.5 Turbo for testing ($0.002/1K tokens)
- Cache common prompts
- Implement rate limiting
- Set usage quotas

---

## 🔐 Security Best Practices

### 1. Environment Variables

```bash
# Never commit .env files
echo ".env" >> .gitignore

# Use different keys for dev/prod
OPENAI_API_KEY_DEV=sk-dev-key
OPENAI_API_KEY_PROD=sk-prod-key
```

---

### 2. Rate Limiting

```typescript
// lib/ratelimit.ts
const RATE_LIMIT = 10; // requests per minute

export function checkRateLimit(userId: string): boolean {
  // Implement rate limiting logic
  return true;
}
```

---

### 3. API Key Protection

```typescript
// app/api/generate/route.ts
if (!process.env.OPENAI_API_KEY) {
  return Response.json(
    { error: 'API key not configured' },
    { status: 500 }
  );
}
```

---

## ✅ Final Deployment Checklist

- [ ] Application deployed and accessible
- [ ] All features work in production
- [ ] Environment variables configured
- [ ] OpenAI API key is valid
- [ ] Live preview loads correctly
- [ ] Code editor works
- [ ] Chat interface functional
- [ ] Version history works
- [ ] Mobile responsive
- [ ] Performance is acceptable (< 3s load time)
- [ ] No console errors
- [ ] README has deployment URL
- [ ] Demo video mentions live URL

---

## 🎉 Success!

Your application is now live! 

**Share your work:**
- Add URL to GitHub README
- Tweet about it
- Add to portfolio
- Include in resume

**Get feedback:**
- Share with friends
- Post on Reddit/HN
- Join Discord communities
- Get code review

---

## 📚 Additional Resources

**Vercel Documentation:**
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Custom Domains](https://vercel.com/docs/concepts/projects/domains)

**OpenAI Resources:**
- [API Documentation](https://platform.openai.com/docs)
- [Rate Limits](https://platform.openai.com/docs/guides/rate-limits)
- [Best Practices](https://platform.openai.com/docs/guides/production-best-practices)

**Next.js Resources:**
- [Deployment](https://nextjs.org/docs/deployment)
- [API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Optimization](https://nextjs.org/docs/advanced-features/measuring-performance)

---

**Need Help?**

Create an issue on GitHub or reach out to the Ryze AI team.

Good luck with your deployment! 🚀
