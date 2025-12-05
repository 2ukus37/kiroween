#!/bin/bash

# DeadTrendTracker Setup Script
# This script sets up the entire project

echo "🎃 DeadTrendTracker Setup Script 👻"
echo "===================================="
echo ""

# Check Node.js version
echo "Checking Node.js version..."
node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$node_version" -lt 18 ]; then
    echo "❌ Error: Node.js 18+ required. Current version: $(node -v)"
    exit 1
fi
echo "✅ Node.js version: $(node -v)"
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..
echo ""

# Check for .env files
echo "🔍 Checking environment files..."
if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env not found. Copying from example..."
    cp backend/.env.example backend/.env
    echo "📝 Please edit backend/.env with your API keys"
fi

if [ ! -f "frontend/.env" ]; then
    echo "⚠️  frontend/.env not found. Copying from example..."
    cp frontend/.env.example frontend/.env
    echo "📝 Please edit frontend/.env with your configuration"
fi
echo ""

# Compile smart contracts
echo "🔨 Compiling smart contracts..."
cd backend
npx hardhat compile
if [ $? -eq 0 ]; then
    echo "✅ Smart contracts compiled successfully"
else
    echo "❌ Smart contract compilation failed"
    exit 1
fi
cd ..
echo ""

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit backend/.env with your API keys"
echo "2. Edit frontend/.env with your configuration"
echo "3. Deploy contracts: cd backend && npm run deploy:mumbai"
echo "4. Start backend: cd backend && npm run dev"
echo "5. Start frontend: cd frontend && npm run dev"
echo ""
echo "📚 Documentation:"
echo "- QUICKSTART.md - 10-minute setup guide"
echo "- DEPLOYMENT.md - Full deployment guide"
echo "- API_DOCUMENTATION.md - API reference"
echo "- TROUBLESHOOTING.md - Common issues"
echo ""
echo "🎃 Happy haunting! 👻"
