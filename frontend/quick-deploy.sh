#!/bin/bash

# Quick Deploy Script for My-DQA Application
# Simple build and run script

IMAGE_NAME="my-dqa-app"
CONTAINER_NAME="my-dqa-container"

echo "🚀 Quick Deploy: Building and Starting My-DQA..."

# Stop existing container if running
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

# Build and run
echo "📦 Building Docker image..."
docker build -t $IMAGE_NAME .

echo "🏃 Starting container..."
docker run -d --name $CONTAINER_NAME -p 8080:80 $IMAGE_NAME

echo "✅ Done! Application running at: http://localhost:8080"
echo "📋 View logs with: docker logs -f $CONTAINER_NAME"