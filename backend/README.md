# DQA Backend Services

A microservices architecture using FastAPI for the DQA application.

## Project Structure

```
dqa-backend/
├── main-api/              # Main API Gateway
├── microservices/
│   ├── user-service/      # User management service
│   ├── auth-service/      # Authentication service
│   └── data-service/      # Data processing service
├── shared/               # Shared utilities and models
├── docker-compose.yml    # Docker orchestration
└── requirements.txt      # Global dependencies
```

## Services

### Main API (Port 8000)
- API Gateway and main entry point
- Routes requests to appropriate microservices
- Handles cross-cutting concerns

### User Service (Port 8001)
- User registration and management
- User profile operations
- User data CRUD operations

### Auth Service (Port 8002)
- Authentication and authorization
- JWT token management
- Session management

### Data Service (Port 8003)
- Data processing and analytics
- Report generation
- Data visualization endpoints

## Quick Start

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run all services with Docker:
   ```bash
   docker-compose up -d
   ```

3. Run individual services:
   ```bash
   # Main API
   cd main-api && uvicorn main:app --host 0.0.0.0 --port 8000 --reload

   # User Service
   cd microservices/user-service && uvicorn main:app --host 0.0.0.0 --port 8001 --reload

   # Auth Service
   cd microservices/auth-service && uvicorn main:app --host 0.0.0.0 --port 8002 --reload

   # Data Service
   cd microservices/data-service && uvicorn main:app --host 0.0.0.0 --port 8003 --reload
   ```

## API Documentation

- Main API: http://localhost:8000/docs
- User Service: http://localhost:8001/docs
- Auth Service: http://localhost:8002/docs
- Data Service: http://localhost:8003/docs