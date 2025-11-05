#!/bin/bash

# Module Masters Content Generator - Complete Setup Script
# This script performs initial setup of the application

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Module Masters Social Media Content Generator - Setup    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check Python
if ! command -v python &> /dev/null && ! command -v python3 &> /dev/null; then
    echo "❌ Python is not installed!"
    echo "Please install Python 3.8+ from https://www.python.org/"
    exit 1
fi

PYTHON_CMD=$(command -v python3 || command -v python)
PYTHON_VERSION=$($PYTHON_CMD --version 2>&1 | awk '{print $2}')
echo "✅ Python $PYTHON_VERSION found"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js 16+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✅ Node.js $NODE_VERSION found"
echo ""

# Backend Setup
echo "═══ Backend Setup ═══"
cd backend

if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    $PYTHON_CMD -m venv venv
    echo "✅ Virtual environment created"
fi

echo "📦 Installing Python dependencies..."
./venv/bin/pip install -q -r requirements.txt
echo "✅ Python dependencies installed"

if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created"
fi

if [ ! -f "database.db" ]; then
    echo "🗄️  Initializing database..."
    ./venv/bin/python -c "from models import init_db; init_db()"
    echo "✅ Database initialized"

    echo "📝 Adding sample data..."
    ./venv/bin/python seed.py
    echo "✅ Sample data added"
else
    echo "✅ Database already exists"
fi

cd ..
echo ""

# Frontend Setup
echo "═══ Frontend Setup ═══"
cd frontend

echo "📦 Installing Node.js dependencies (this may take a minute)..."
npm install --silent
echo "✅ Node.js dependencies installed"

cd ..
echo ""

# Success message
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    ✅ Setup Complete!                       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "⚠️  IMPORTANT: Configure your API key"
echo ""
echo "1. Get an Anthropic API key from: https://console.anthropic.com/"
echo "2. Edit the file: backend/.env"
echo "3. Replace YOUR_API_KEY_HERE with your actual API key"
echo ""
echo "📖 To start the application:"
echo ""
echo "  Terminal 1 - Backend:"
echo "    ./start-backend.sh"
echo ""
echo "  Terminal 2 - Frontend:"
echo "    ./start-frontend.sh"
echo ""
echo "🌐 Then open: http://localhost:3000"
echo ""
echo "📚 For detailed instructions, see README.md"
echo ""
