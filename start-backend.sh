#!/bin/bash

# Module Masters Content Generator - Start Backend Server
# This script starts the Flask backend server

echo "🚀 Starting Module Masters Content Generator Backend..."
echo ""

cd "$(dirname "$0")/backend"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found!"
    echo "Please run: cd backend && python -m venv venv && ./venv/bin/pip install -r requirements.txt"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Please edit backend/.env and add your ANTHROPIC_API_KEY"
    echo "Get your API key from: https://console.anthropic.com/"
    echo ""
fi

# Check if database exists
if [ ! -f "database.db" ]; then
    echo "📦 Database not found. Initializing..."
    ./venv/bin/python -c "from models import init_db; init_db()"
    echo "✅ Database initialized!"
    echo ""

    echo "📝 Adding sample data..."
    ./venv/bin/python seed.py
    echo ""
fi

# Activate virtual environment and start server
echo "🟢 Starting Flask server on http://localhost:5000"
echo "Press Ctrl+C to stop"
echo ""

source venv/bin/activate
export PYTHONUNBUFFERED=1
python app.py
