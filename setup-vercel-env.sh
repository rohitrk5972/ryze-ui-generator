#!/bin/bash

# Vercel Environment Variables Setup Script
# This script helps you set up environment variables for your Vercel deployment

echo "🚀 Setting up Vercel Environment Variables for OpenRouter AI"
echo ""
echo "This script will add the required environment variables to your Vercel project."
echo ""

# Check if vercel CLI is available
if ! command -v vercel &> /dev/null && ! command -v npx &> /dev/null; then
    echo "❌ Error: Neither 'vercel' nor 'npx' is available."
    echo "Please install Node.js and npm first."
    exit 1
fi

# Use npx vercel if vercel is not installed globally
VERCEL_CMD="npx vercel"
if command -v vercel &> /dev/null; then
    VERCEL_CMD="vercel"
fi

echo "📝 Adding OPENAI_API_KEY..."
echo "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" | $VERCEL_CMD env add OPENAI_API_KEY production

echo ""
echo "📝 Adding OPENAI_API_KEY for preview..."
echo "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" | $VERCEL_CMD env add OPENAI_API_KEY preview

echo ""
echo "📝 Adding OPENAI_API_KEY for development..."
echo "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" | $VERCEL_CMD env add OPENAI_API_KEY development

echo ""
echo "📝 Adding OPENAI_BASE_URL..."
echo "https://openrouter.ai/api/v1" | $VERCEL_CMD env add OPENAI_BASE_URL production

echo ""
echo "📝 Adding OPENAI_BASE_URL for preview..."
echo "https://openrouter.ai/api/v1" | $VERCEL_CMD env add OPENAI_BASE_URL preview

echo ""
echo "📝 Adding OPENAI_BASE_URL for development..."
echo "https://openrouter.ai/api/v1" | $VERCEL_CMD env add OPENAI_BASE_URL development

echo ""
echo "✅ Environment variables added successfully!"
echo ""
echo "🚀 Now redeploying your application..."
$VERCEL_CMD --prod

echo ""
echo "✅ Done! Your application should now be working with OpenRouter AI."
