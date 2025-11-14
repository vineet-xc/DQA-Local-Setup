#!/bin/bash

# DQA Backend Development Setup Script

echo "🚀 Setting up DQA Backend Development Environment"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOL
# DQA Backend Environment Variables
APP_NAME=DQA Backend
DEBUG=true
LOG_LEVEL=INFO

# Database
DATABASE_URL=postgresql://dqa_user:password@localhost:5432/dqa_users

# Authentication
SECRET_KEY=your-development-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Service URLs
USER_SERVICE_URL=http://localhost:8001
AUTH_SERVICE_URL=http://localhost:8002
DATA_SERVICE_URL=http://localhost:8003
MAIN_API_URL=http://localhost:8000

# Redis
REDIS_URL=redis://localhost:6379
EOL
    echo "✅ Created .env file"
fi

echo "📦 Installing Python dependencies..."

# Install dependencies for each service
services=("main-api" "microservices/user-service" "microservices/auth-service" "microservices/data-service")

for service in "${services[@]}"; do
    if [ -f "$service/requirements.txt" ]; then
        echo "Installing dependencies for $service..."
        cd "$service"
        pip install -r requirements.txt
        cd - > /dev/null
    fi
done

echo "🐳 Building Docker containers..."
docker-compose build

echo "🗄️ Setting up database..."
docker-compose up -d postgres redis

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

echo "🚀 Starting all services..."
docker-compose up -d

echo "⏳ Waiting for services to start..."
sleep 15

echo "🔍 Checking service health..."

# Check if services are responding
services_check=(
    "http://localhost:8000/health:Main API"
    "http://localhost:8001/health:User Service"
    "http://localhost:8002/health:Auth Service"
    "http://localhost:8003/health:Data Service"
)

for service_check in "${services_check[@]}"; do
    url=$(echo $service_check | cut -d: -f1)
    name=$(echo $service_check | cut -d: -f2)
    
    if curl -s $url > /dev/null 2>&1; then
        echo "✅ $name is running at $url"
    else
        echo "❌ $name is not responding at $url"
    fi
done

echo ""
echo "🎉 DQA Backend setup complete!"
echo ""
echo "📖 Service Documentation:"
echo "  Main API:    http://localhost:8000/docs"
echo "  User Service: http://localhost:8001/docs" 
echo "  Auth Service: http://localhost:8002/docs"
echo "  Data Service: http://localhost:8003/docs"
echo ""
echo "🔧 Management Commands:"
echo "  View logs:    docker-compose logs -f"
echo "  Stop services: docker-compose down"
echo "  Restart:      docker-compose restart"
echo ""
echo "📊 Database Access:"
echo "  PostgreSQL:   localhost:5432"
echo "  Redis:        localhost:6379"