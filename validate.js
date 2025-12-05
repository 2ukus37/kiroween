#!/usr/bin/env node

/**
 * DeadTrendTracker Validation Script
 * Checks for common setup issues
 */

const fs = require('fs');
const path = require('path');

console.log('🎃 DeadTrendTracker Validation Script 👻');
console.log('=========================================\n');

let errors = 0;
let warnings = 0;

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
if (majorVersion < 18) {
  console.error('❌ Node.js 18+ required. Current:', nodeVersion);
  errors++;
} else {
  console.log('✅ Node.js version:', nodeVersion);
}

// Check for required files
const requiredFiles = [
  'package.json',
  'backend/package.json',
  'frontend/package.json',
  'backend/hardhat.config.ts',
  'backend/contracts/CreatorToken.sol',
  'backend/contracts/ContentNFT.sol',
  'backend/contracts/RewardPool.sol',
];

console.log('\n📁 Checking required files...');
requiredFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.error(`❌ Missing: ${file}`);
    errors++;
  }
});

// Check for .env files
console.log('\n🔐 Checking environment files...');
if (fs.existsSync('backend/.env')) {
  console.log('✅ backend/.env exists');
  
  // Check for required env vars
  const envContent = fs.readFileSync('backend/.env', 'utf8');
  const requiredVars = [
    'FIREBASE_PROJECT_ID',
    'PINATA_API_KEY',
    'GEMINI_API_KEY',
    'POLYGON_RPC_URL',
  ];
  
  requiredVars.forEach((varName) => {
    if (envContent.includes(varName + '=') && !envContent.includes(varName + '=your_')) {
      console.log(`  ✅ ${varName} is set`);
    } else {
      console.warn(`  ⚠️  ${varName} needs to be configured`);
      warnings++;
    }
  });
} else {
  console.warn('⚠️  backend/.env not found (copy from .env.example)');
  warnings++;
}

if (fs.existsSync('frontend/.env')) {
  console.log('✅ frontend/.env exists');
} else {
  console.warn('⚠️  frontend/.env not found (copy from .env.example)');
  warnings++;
}

// Check for node_modules
console.log('\n📦 Checking dependencies...');
if (fs.existsSync('node_modules')) {
  console.log('✅ Root dependencies installed');
} else {
  console.warn('⚠️  Root dependencies not installed (run: npm install)');
  warnings++;
}

if (fs.existsSync('backend/node_modules')) {
  console.log('✅ Backend dependencies installed');
} else {
  console.warn('⚠️  Backend dependencies not installed (run: cd backend && npm install)');
  warnings++;
}

if (fs.existsSync('frontend/node_modules')) {
  console.log('✅ Frontend dependencies installed');
} else {
  console.warn('⚠️  Frontend dependencies not installed (run: cd frontend && npm install)');
  warnings++;
}

// Check for compiled contracts
console.log('\n🔨 Checking smart contracts...');
if (fs.existsSync('backend/artifacts')) {
  console.log('✅ Smart contracts compiled');
} else {
  console.warn('⚠️  Smart contracts not compiled (run: cd backend && npx hardhat compile)');
  warnings++;
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 Validation Summary');
console.log('='.repeat(50));

if (errors === 0 && warnings === 0) {
  console.log('✅ All checks passed! You\'re ready to go! 🎉');
  console.log('\n📋 Next steps:');
  console.log('1. Configure API keys in backend/.env');
  console.log('2. Deploy contracts: cd backend && npm run deploy:mumbai');
  console.log('3. Start backend: cd backend && npm run dev');
  console.log('4. Start frontend: cd frontend && npm run dev');
} else {
  if (errors > 0) {
    console.error(`\n❌ ${errors} error(s) found - please fix before proceeding`);
  }
  if (warnings > 0) {
    console.warn(`⚠️  ${warnings} warning(s) found - recommended to fix`);
  }
  console.log('\n📚 Check TROUBLESHOOTING.md for help');
}

console.log('\n🎃 Happy haunting! 👻\n');

process.exit(errors > 0 ? 1 : 0);
