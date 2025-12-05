@echo off
REM DeadTrendTracker Setup Script for Windows
REM This script sets up the entire project

echo.
echo 🎃 DeadTrendTracker Setup Script 👻
echo ====================================
echo.

REM Check Node.js
echo Checking Node.js version...
node -v >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Node.js not found. Please install Node.js 18+
    exit /b 1
)
echo ✅ Node.js version:
node -v
echo.

REM Install root dependencies
echo 📦 Installing root dependencies...
call npm install
echo.

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install
cd ..
echo.

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
call npm install
cd ..
echo.

REM Check for .env files
echo 🔍 Checking environment files...
if not exist "backend\.env" (
    echo ⚠️  backend\.env not found. Copying from example...
    copy backend\.env.example backend\.env
    echo 📝 Please edit backend\.env with your API keys
)

if not exist "frontend\.env" (
    echo ⚠️  frontend\.env not found. Copying from example...
    copy frontend\.env.example frontend\.env
    echo 📝 Please edit frontend\.env with your configuration
)
echo.

REM Compile smart contracts
echo 🔨 Compiling smart contracts...
cd backend
call npx hardhat compile
if errorlevel 1 (
    echo ❌ Smart contract compilation failed
    cd ..
    exit /b 1
)
echo ✅ Smart contracts compiled successfully
cd ..
echo.

echo ✅ Setup complete!
echo.
echo 📋 Next steps:
echo 1. Edit backend\.env with your API keys
echo 2. Edit frontend\.env with your configuration
echo 3. Deploy contracts: cd backend ^&^& npm run deploy:mumbai
echo 4. Start backend: cd backend ^&^& npm run dev
echo 5. Start frontend: cd frontend ^&^& npm run dev
echo.
echo 📚 Documentation:
echo - QUICKSTART.md - 10-minute setup guide
echo - DEPLOYMENT.md - Full deployment guide
echo - API_DOCUMENTATION.md - API reference
echo - TROUBLESHOOTING.md - Common issues
echo.
echo 🎃 Happy haunting! 👻
pause
