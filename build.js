#!/usr/bin/env node

// Simple build script for Render.com deployment
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting custom build process...');

try {
  // Step 1: Install all dependencies including dev dependencies for build
  console.log('📦 Installing all dependencies...');
  execSync('npm install --include=dev', { stdio: 'inherit' });

  // Step 2: Build frontend with Vite
  console.log('🏗️ Building frontend...');
  execSync('npx vite build', { stdio: 'inherit' });

  // Step 3: Build backend with esbuild
  console.log('⚙️ Building backend...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });

  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}