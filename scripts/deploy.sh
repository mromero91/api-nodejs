#!/bin/bash

# Production Deployment Script
set -e

echo "Starting production deployment..."

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "ERROR: .env.production file not found!"
    echo "Please create .env.production with your production variables"
    exit 1
fi

# Load environment variables
export $(cat .env.production | grep -v '^#' | xargs)

# Build the application
echo "Building application..."
npm run build

# Build Docker image
echo "Building Docker image..."
docker build -t aura-backend:latest .

# Stop existing containers
echo "Stopping existing containers..."
docker compose -f docker-compose.prod.yml down

# Start production services
echo "Starting production services..."
docker compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 30

# Run database migrations
echo "Running database migrations..."
docker compose -f docker-compose.prod.yml exec app npm run migrate:prod

# Health check
echo "Performing health check..."
if curl -f http://localhost:3000/health; then
    echo "Deployment successful!"
    echo "Application is running at http://localhost:3000"
else
    echo "Health check failed!"
    echo "Checking logs..."
    docker compose -f docker-compose.prod.yml logs app
    exit 1
fi

echo "Production deployment completed successfully!"
