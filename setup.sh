#!/bin/bash

# 🎯 RYZE AI UI GENERATOR - AUTO SETUP SCRIPT
# Bas is file ko run karo, sab automatic ho jayega!

echo "🚀 Ryze AI UI Generator - Setup Starting..."
echo ""

# Colors for pretty output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check Node.js
echo "📋 Step 1: Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "${RED}❌ Node.js not found!${NC}"
    echo "Please install Node.js from: https://nodejs.org"
    echo "Download the LTS version (18 or higher)"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "${GREEN}✓ Node.js found: $NODE_VERSION${NC}"
echo ""

# Step 2: Install dependencies
echo "📦 Step 2: Installing dependencies..."
echo "This will take 2-3 minutes. Please wait..."
npm install

if [ $? -eq 0 ]; then
    echo "${GREEN}✓ Dependencies installed successfully!${NC}"
else
    echo "${RED}❌ Installation failed!${NC}"
    exit 1
fi
echo ""

# Step 3: Setup environment
echo "🔑 Step 3: Setting up OpenAI API Key..."
echo ""
echo "You need an OpenAI API key to use this app."
echo "Get it from: https://platform.openai.com/api-keys"
echo ""
read -p "Enter your OpenAI API Key (starts with sk-): " OPENAI_KEY

if [ -z "$OPENAI_KEY" ]; then
    echo "${RED}❌ No API key provided!${NC}"
    echo "Creating .env.local file with placeholder..."
    echo "OPENAI_API_KEY=your-key-here" > .env.local
    echo "${BLUE}⚠️  Please edit .env.local and add your real API key!${NC}"
else
    echo "OPENAI_API_KEY=$OPENAI_KEY" > .env.local
    echo "${GREEN}✓ API key saved!${NC}"
fi
echo ""

# Step 4: Done!
echo "🎉 Setup Complete!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ${GREEN}✓ All set! Ready to launch!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Start the app:"
echo "   ${BLUE}npm run dev${NC}"
echo ""
echo "2. Open in browser:"
echo "   ${BLUE}http://localhost:3000${NC}"
echo ""
echo "3. Try this prompt:"
echo "   ${BLUE}\"Create a login form with email and password\"${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Need help? Check these files:"
echo "  • README.md - Complete guide"
echo "  • PROJECT_SUMMARY.md - Quick overview"
echo "  • QUICK_START.md - Fast start guide"
echo ""
echo "🚀 Good luck with your submission!"
