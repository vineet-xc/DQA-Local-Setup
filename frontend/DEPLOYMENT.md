# My-DQA Deployment Scripts

This directory contains two deployment scripts for building and running the My-DQA application using Docker.

## 🚀 Quick Start

### Option 1: Full Featured Deploy Script
```bash
./deploy.sh
```

### Option 2: Simple Quick Deploy
```bash
./quick-deploy.sh
```

## 📋 Deploy Script Commands

The `deploy.sh` script supports multiple commands:

### Basic Usage
```bash
# Build and start (default)
./deploy.sh

# Build image only
./deploy.sh build

# Start container only
./deploy.sh start

# Stop container
./deploy.sh stop

# View container logs
./deploy.sh logs

# Clean up (remove container and image)
./deploy.sh clean

# Show help
./deploy.sh help
```

## 🔧 Configuration

Both scripts use these default settings:

| Setting | Value |
|---------|-------|
| Image Name | `my-dqa-app` |
| Container Name | `my-dqa-container` |
| Host Port | `8080` |
| Container Port | `80` |

## 🌐 Access Points

After deployment, your application will be available at:

- **Main Application**: http://localhost:8080
- **Health Check**: http://localhost:8080/health

## 📦 What the Scripts Do

### deploy.sh (Full Featured)
- ✅ Checks if Docker is running
- ✅ Stops and removes existing containers
- ✅ Builds Docker image with progress output
- ✅ Starts container in detached mode
- ✅ Shows container status and useful commands
- ✅ Tests health endpoint automatically
- ✅ Colored output for better readability
- ✅ Error handling and validation

### quick-deploy.sh (Simple)
- ✅ Quick build and deploy
- ✅ Minimal output
- ✅ Perfect for development workflow

## 🛠 Troubleshooting

### Container Not Starting
```bash
# Check logs
./deploy.sh logs

# Or use docker directly
docker logs my-dqa-container
```

### Port Already in Use
```bash
# Stop existing container
./deploy.sh stop

# Or change port in script (edit HOST_PORT variable)
```

### Clean Start
```bash
# Remove everything and start fresh
./deploy.sh clean
./deploy.sh
```

## 📁 File Structure

```
my-dqa/
├── deploy.sh          # Full featured deployment script
├── quick-deploy.sh    # Simple deployment script
├── Dockerfile         # Multi-stage build configuration
├── default.conf       # Nginx server configuration
├── .dockerignore      # Docker build exclusions
└── DEPLOYMENT.md      # This file
```

## 🐳 Docker Commands Reference

If you prefer using Docker commands directly:

```bash
# Build image
docker build -t my-dqa-app .

# Run container
docker run -d --name my-dqa-container -p 8080:80 my-dqa-app

# View logs
docker logs -f my-dqa-container

# Stop container
docker stop my-dqa-container

# Remove container
docker rm my-dqa-container

# Remove image
docker rmi my-dqa-app
```