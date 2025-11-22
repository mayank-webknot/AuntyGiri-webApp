#!/bin/bash

# Quick Start Script for AuntyGiri Web App
# This script builds and runs the application

echo "🚀 Starting AuntyGiri Web App..."
echo ""

# Navigate to project directory
cd "$(dirname "$0")"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check for TypeScript errors
echo "🔍 Checking for TypeScript errors..."
npx tsc --noEmit
if [ $? -ne 0 ]; then
    echo "❌ TypeScript errors found. Please fix them before building."
    exit 1
fi
echo "✅ No TypeScript errors found!"
echo ""

# Build the app
echo "🔨 Building the application..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
echo "✅ Build successful!"
echo ""

# Start dev server
echo "🌐 Starting development server..."
echo "The app will be available at http://localhost:8080"
echo "Press Ctrl+C to stop the server"
echo ""
npm run dev

