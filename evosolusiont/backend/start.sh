#!/bin/bash

# EVOLUTION ENERGY TECH System Backend Startup Script

echo "🚀 Starting EVOLUTION ENERGY TECH System Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   You can start MongoDB with: mongod"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from config.js..."
    cp config.js .env
    echo "📝 Please edit .env file with your configuration before running again."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Create uploads directory if it doesn't exist
if [ ! -d "uploads" ]; then
    echo "📁 Creating uploads directory..."
    mkdir -p uploads/epc uploads/coordinators
fi

# Start the server
echo "🌟 Starting server..."
npm run dev
