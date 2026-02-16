# Vercel Environment Variable Setup (OpenRouter AI)

## What was fixed:
- ✅ Removed invalid Vercel secret references from `vercel.json`
- ✅ Configured for OpenRouter AI compatibility
- ✅ Added base URL configuration for OpenRouter
- ✅ Created `.env.local` for local development (not tracked by git)

## Add Environment Variables in Vercel Dashboard:

### Vercel Dashboard Setup (Recommended - Easiest)
1. Go to https://vercel.com/dashboard
2. Select your project: **ryze-ui-generator**
3. Click on **Settings** tab
4. Click on **Environment Variables** in the left sidebar
5. Add these two variables:

   **Variable 1:**
   - **Key:** `OPENAI_API_KEY`
   - **Value:** `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`
   - **Environments:** Select all (Production, Preview, Development)
   
   **Variable 2:**
   - **Key:** `OPENAI_BASE_URL`
   - **Value:** `https://openrouter.ai/api/v1`
   - **Environments:** Select all (Production, Preview, Development)

6. Click **Save** for each
7. **Redeploy:** Go to Deployments tab → Click the three dots on the latest deployment → Click "Redeploy"

### Vercel CLI (Alternative)
```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Login to Vercel
vercel login

# Add OPENAI_API_KEY for all environments
vercel env add OPENAI_API_KEY production
# When prompted, paste: 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

vercel env add OPENAI_API_KEY preview
vercel env add OPENAI_API_KEY development

# Add OPENAI_BASE_URL for all environments
vercel env add OPENAI_BASE_URL production
# When prompted, paste: https://openrouter.ai/api/v1

vercel env add OPENAI_BASE_URL preview
vercel env add OPENAI_BASE_URL development

# Redeploy
vercel --prod
```

## Verification:
After adding the environment variables and redeploying:
- ✅ The deployment should complete successfully
- ✅ Your app will use OpenRouter AI with your API key
- ✅ No more "Secret does not exist" errors

## Local Development:
Your `.env.local` file is already set up with OpenRouter configuration:
```bash
npm install
npm run dev
```

The app will run at http://localhost:3000
