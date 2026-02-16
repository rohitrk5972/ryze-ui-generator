# ⚡ Quick Start Guide

Get Ryze UI Generator running in **5 minutes**!

---

## 🚀 Super Fast Setup

### Step 1: Clone & Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/yourusername/ryze-ui-generator.git
cd ryze-ui-generator

# Install dependencies
npm install
```

---

### Step 2: Configure API Key (1 minute)

```bash
# Create .env file
cp .env.example .env

# Edit .env and add your OpenAI key
# Get it from: https://platform.openai.com/api-keys
```

Your `.env` should look like:
```bash
OPENAI_API_KEY=sk-proj-your-actual-key-here
```

**Don't have an API key?**
1. Go to https://platform.openai.com/signup
2. Add credit card (no charge initially)
3. Create API key
4. Copy and paste above

---

### Step 3: Run! (1 minute)

```bash
# Start the development server
npm run dev
```

Open **http://localhost:3000** in your browser!

---

## ✅ Verify It's Working

1. **See the interface**: 3 panels - Chat, Code, Preview
2. **Type a prompt**: "Create a login form"
3. **Press Enter** and wait 5-10 seconds
4. **See the result**: Generated code + live preview!

---

## 🎯 Try These Example Prompts

**Beginner:**
```
Create a simple button
```

**Intermediate:**
```
Create a login form with email and password
```

**Advanced:**
```
Create a dashboard with sidebar navigation, top navbar, 
and three stats cards showing user count, revenue, and growth
```

---

## 🐛 Troubleshooting

### Error: "OpenAI API key not configured"

**Fix:**
```bash
# Check .env file exists
ls .env

# Verify it has OPENAI_API_KEY
cat .env

# Make sure no spaces around =
OPENAI_API_KEY=sk-...  # Correct
OPENAI_API_KEY = sk-...  # Wrong
```

---

### Error: "Module not found"

**Fix:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

---

### Error: "Port 3000 already in use"

**Fix:**
```bash
# Use different port
PORT=3001 npm run dev

# Or kill the process using port 3000
lsof -ti:3000 | xargs kill
```

---

### Monaco Editor Not Loading

**Fix:**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

---

## 📦 What's Included?

```
ryze-ui-generator/
├── app/                    # Next.js app directory
│   ├── api/generate/      # API endpoint
│   ├── page.tsx           # Main UI
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── library/           # 8 fixed components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   └── ui/               # UI components
│       ├── ChatPanel.tsx
│       ├── CodeEditor.tsx
│       └── LivePreview.tsx
├── lib/
│   ├── agent/            # AI agent system
│   │   ├── planner.ts
│   │   ├── generator.ts
│   │   ├── explainer.ts
│   │   └── orchestrator.ts
│   ├── types.ts          # TypeScript types
│   └── openai.ts         # OpenAI client
└── Documentation/
    ├── README.md
    ├── ARCHITECTURE.md
    ├── DEPLOYMENT_GUIDE.md
    └── DEMO_SCRIPT.md
```

---

## 🎓 Next Steps

1. **Read the README**: Full project documentation
2. **Try different prompts**: Experiment with UI generation
3. **Edit the code**: Monaco editor is fully functional
4. **Check versions**: History panel shows all versions
5. **Deploy it**: See DEPLOYMENT_GUIDE.md

---

## 🔗 Important Links

- **OpenAI Platform**: https://platform.openai.com
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Deployment Guide**: See DEPLOYMENT_GUIDE.md
- **Architecture**: See ARCHITECTURE.md

---

## 💡 Pro Tips

**Tip 1: Clear and Specific**
```
❌ "Make a form"
✅ "Create a login form with email, password, and remember me checkbox"
```

**Tip 2: Iterate, Don't Restart**
```
First: "Create a card"
Then: "Add a button to the card"
```

**Tip 3: Use the History**
```
Try different variations, then roll back to the best one
```

**Tip 4: Edit Directly**
```
Generated code not perfect? Edit it in Monaco editor!
```

---

## 🆘 Need Help?

**Check the logs:**
```bash
# In terminal where you ran npm run dev
# Look for error messages
```

**Check browser console:**
```
F12 → Console tab
Look for red error messages
```

**Common issues:**
- API key not set → Add to .env
- Port in use → Use different port
- Dependencies missing → npm install
- OpenAI rate limit → Wait a minute

---

## ✨ You're Ready!

Start creating UIs with AI! 🚀

Try it now:
```bash
npm run dev
```

Then open http://localhost:3000 and type:
```
Create a beautiful landing page with a hero section
```

---

**Happy Coding!** 🎉
