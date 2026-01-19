#!/bin/bash

# Setup script for Fraud Detection System

echo "======================================"
echo "FraudShield - Setup Script"
echo "======================================"
echo ""

# Check Python version
echo "Checking Python version..."
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "Python version: $python_version"
echo ""

# Check Node version
echo "Checking Node version..."
node_version=$(node --version)
npm_version=$(npm --version)
echo "Node version: $node_version"
echo "NPM version: $npm_version"
echo ""

# Setup Backend
echo "Setting up Backend..."
cd backend
echo "Installing Python dependencies..."
pip install -r requirements.txt
cd ..
echo "✓ Backend setup complete"
echo ""

# Setup Frontend
echo "Setting up Frontend..."
cd frontend
echo "Installing Node dependencies..."
npm install
cd ..
echo "✓ Frontend setup complete"
echo ""

# Create directories
echo "Creating necessary directories..."
mkdir -p ml-models/models
mkdir -p data
mkdir -p logs
echo "✓ Directories created"
echo ""

# Copy environment file
echo "Creating environment file..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✓ Environment file created (.env)"
else
    echo "✓ Environment file already exists"
fi
echo ""

echo "======================================"
echo "Setup Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Train the model: cd ml-models && python train_model.py"
echo "2. Start backend: cd backend && python app.py"
echo "3. Start frontend: cd frontend && npm start"
echo ""
