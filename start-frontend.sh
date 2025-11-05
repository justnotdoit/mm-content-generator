#!/bin/bash

# Module Masters Content Generator - Start Frontend Development Server
# This script starts the React development server

echo "🚀 Starting Module Masters Content Generator Frontend..."
echo ""

cd "$(dirname "$0")/frontend"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "🟢 Starting React development server on http://localhost:3000"
echo "The app should open automatically in your browser"
echo "Press Ctrl+C to stop"
echo ""

npm start
