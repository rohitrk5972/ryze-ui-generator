@echo off
REM 🎯 RYZE AI UI GENERATOR - AUTO SETUP SCRIPT (WINDOWS)
REM Bas is file ko run karo, sab automatic ho jayega!

echo.
echo ========================================
echo  RYZE AI UI GENERATOR - Setup Starting
echo ========================================
echo.

REM Step 1: Check Node.js
echo [Step 1] Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not found!
    echo.
    echo Please install Node.js from: https://nodejs.org
    echo Download the LTS version (18 or higher^)
    echo.
    pause
    exit /b 1
)

node -v
echo ✓ Node.js found!
echo.

REM Step 2: Install dependencies
echo [Step 2] Installing dependencies...
echo This will take 2-3 minutes. Please wait...
echo.
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Installation failed!
    pause
    exit /b 1
)

echo ✓ Dependencies installed successfully!
echo.

REM Step 3: Setup environment
echo [Step 3] Setting up OpenAI API Key...
echo.
echo You need an OpenAI API key to use this app.
echo Get it from: https://platform.openai.com/api-keys
echo.
set /p OPENAI_KEY="Enter your OpenAI API Key (starts with sk-): "

if "%OPENAI_KEY%"=="" (
    echo WARNING: No API key provided!
    echo Creating .env.local file with placeholder...
    echo OPENAI_API_KEY=your-key-here > .env.local
    echo.
    echo Please edit .env.local and add your real API key!
) else (
    echo OPENAI_API_KEY=%OPENAI_KEY% > .env.local
    echo ✓ API key saved!
)
echo.

REM Step 4: Done!
echo ========================================
echo  ✓ Setup Complete! Ready to launch!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Start the app:
echo    npm run dev
echo.
echo 2. Open in browser:
echo    http://localhost:3000
echo.
echo 3. Try this prompt:
echo    "Create a login form with email and password"
echo.
echo ========================================
echo.
echo Need help? Check these files:
echo   • README.md - Complete guide
echo   • PROJECT_SUMMARY.md - Quick overview
echo   • QUICK_START.md - Fast start guide
echo.
echo Good luck with your submission!
echo.
pause
