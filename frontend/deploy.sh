#!/bin/bash

# Build and Start Script for My-DQA Application
# This script builds the Docker image and starts the container

set -e  # Exit on any error

# Configuration
IMAGE_NAME="my-dqa-app"
CONTAINER_NAME="my-dqa-container"
HOST_PORT="8080"
CONTAINER_PORT="80"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_success "Docker is running"
}

# Function to stop and remove existing container
cleanup_existing() {
    if docker ps -q -f name=${CONTAINER_NAME} | grep -q .; then
        print_warning "Stopping existing container: ${CONTAINER_NAME}"
        docker stop ${CONTAINER_NAME} > /dev/null 2>&1
    fi
    
    if docker ps -aq -f name=${CONTAINER_NAME} | grep -q .; then
        print_warning "Removing existing container: ${CONTAINER_NAME}"
        docker rm ${CONTAINER_NAME} > /dev/null 2>&1
    fi
}

# Function to build Docker image
build_image() {
    print_status "Building Docker image: ${IMAGE_NAME}"
    if docker build -t ${IMAGE_NAME} .; then
        print_success "Docker image built successfully"
    else
        print_error "Failed to build Docker image"
        exit 1
    fi
}

# Function to start container
start_container() {
    print_status "Starting container: ${CONTAINER_NAME}"
    if docker run -d \
        --name ${CONTAINER_NAME} \
        -p ${HOST_PORT}:${CONTAINER_PORT} \
        ${IMAGE_NAME}; then
        print_success "Container started successfully"
        print_status "Container ID: $(docker ps -q -f name=${CONTAINER_NAME})"
    else
        print_error "Failed to start container"
        exit 1
    fi
}

# Function to show container status
show_status() {
    print_status "Container Status:"
    docker ps -f name=${CONTAINER_NAME} --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    echo ""
    print_status "Application URLs:"
    echo "  🌐 Main Application: http://localhost:${HOST_PORT}"
    echo "  ❤️  Health Check:    http://localhost:${HOST_PORT}/health"
    
    echo ""
    print_status "Useful Commands:"
    echo "  📋 View logs:        docker logs ${CONTAINER_NAME}"
    echo "  🔄 Follow logs:      docker logs -f ${CONTAINER_NAME}"
    echo "  🛑 Stop container:   docker stop ${CONTAINER_NAME}"
    echo "  🗑️  Remove container: docker rm ${CONTAINER_NAME}"
}

# Function to test health endpoint
test_health() {
    print_status "Testing health endpoint..."
    sleep 2  # Wait for container to be ready
    
    if curl -s http://localhost:${HOST_PORT}/health > /dev/null; then
        print_success "Health check passed ✅"
    else
        print_warning "Health check failed - container might still be starting"
    fi
}

# Main execution
main() {
    echo "🚀 Building and Starting My-DQA Application"
    echo "============================================"
    
    # Check prerequisites
    check_docker
    
    # Clean up any existing containers
    cleanup_existing
    
    # Build and start
    build_image
    start_container
    
    # Show status and test
    show_status
    test_health
    
    echo ""
    print_success "🎉 Application is ready!"
    print_status "Visit http://localhost:${HOST_PORT} to access your application"
}

# Handle script arguments
case "${1:-}" in
    "build")
        print_status "Building Docker image only..."
        check_docker
        build_image
        ;;
    "start")
        print_status "Starting container only..."
        check_docker
        cleanup_existing
        start_container
        show_status
        test_health
        ;;
    "stop")
        print_status "Stopping container..."
        if docker ps -q -f name=${CONTAINER_NAME} | grep -q .; then
            docker stop ${CONTAINER_NAME}
            print_success "Container stopped"
        else
            print_warning "No running container found"
        fi
        ;;
    "logs")
        print_status "Showing container logs..."
        docker logs -f ${CONTAINER_NAME}
        ;;
    "clean")
        print_status "Cleaning up containers and images..."
        cleanup_existing
        if docker images -q ${IMAGE_NAME} | grep -q .; then
            docker rmi ${IMAGE_NAME}
            print_success "Docker image removed"
        fi
        ;;
    "help"|"-h"|"--help")
        echo "My-DQA Application Deploy Script"
        echo ""
        echo "Usage: $0 [COMMAND]"
        echo ""
        echo "Commands:"
        echo "  (no args)  Build image and start container (default)"
        echo "  build      Build Docker image only"
        echo "  start      Start container only"
        echo "  stop       Stop the running container"
        echo "  logs       Show container logs"
        echo "  clean      Remove container and image"
        echo "  help       Show this help message"
        ;;
    "")
        main
        ;;
    *)
        print_error "Unknown command: $1"
        print_status "Use '$0 help' for available commands"
        exit 1
        ;;
esac