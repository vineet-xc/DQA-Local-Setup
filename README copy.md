# DQA - Data Quality Analytics Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Frontend: React](https://img.shields.io/badge/Frontend-React-blue.svg)](https://reactjs.org/)
[![Backend: FastAPI](https://img.shields.io/badge/Backend-FastAPI-green.svg)](https://fastapi.tiangolo.com/)
[![Database: PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue.svg)](https://postgresql.org/)

A comprehensive Data Quality Analytics platform built with modern web technologies, featuring a React frontend and FastAPI microservices backend.

## 🏗️ Architecture

```
DQA/
├── dqa-frontend/          # React + TypeScript frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── lib/          # Utilities and helpers
│   │   └── assets/       # Static assets
│   ├── public/           # Public assets
│   └── package.json      # Frontend dependencies
│
└── dqa-backend/          # FastAPI microservices
    ├── main-api/         # API Gateway (Port 8000)
    ├── microservices/
    │   ├── user-service/ # User management (Port 8001)
    │   ├── auth-service/ # Authentication (Port 8002)
    │   └── data-service/ # Analytics & reports (Port 8003)
    ├── shared/           # Shared utilities
    └── docker-compose.yml # Container orchestration
```

## ✨ Features

### Frontend (React + TypeScript)
- 🎨 Modern UI with Tailwind CSS
- 🌙 Dark/Light theme support
- 📱 Responsive design
- 🔒 Protected routes with authentication
- 📊 Interactive dashboard
- 📈 Data visualization components
- 🧩 Modular component architecture

### Backend (FastAPI Microservices)
- 🚀 High-performance FastAPI services
- 🔐 JWT-based authentication
- 👥 User management system
- 📊 Data analytics and reporting
- 🐳 Docker containerization
- 📚 Automatic API documentation
- 🔄 Health monitoring
- 🛡️ CORS and security middleware

### Infrastructure
- 🐳 Docker & Docker Compose
- 🗄️ PostgreSQL database
- 📦 Redis for caching
- 🌐 Nginx reverse proxy
- 🔄 CI/CD with GitHub Actions

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+)
- Python (v3.11+)
- Docker & Docker Compose
- Git

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd DQA
```

### 2. Backend Setup

```bash
cd dqa-backend

# Using Docker (Recommended)
docker-compose up -d

# Or manual setup
pip install -r requirements.txt
./setup.sh
```

### 3. Frontend Setup

```bash
cd dqa-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API Docs**: http://localhost:8000/docs
- **User Service**: http://localhost:8001/docs
- **Auth Service**: http://localhost:8002/docs
- **Data Service**: http://localhost:8003/docs

## 📋 Development Workflow

### Backend Development

```bash
cd dqa-backend

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Run individual service
cd microservices/user-service
uvicorn main:app --reload --port 8001

# Stop services
docker-compose down
```

### Frontend Development

```bash
cd dqa-frontend

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint and format
npm run lint
npm run format
```

## 🧪 Testing

### Backend Tests

```bash
cd dqa-backend
pytest

# With coverage
pytest --cov=./ --cov-report=html
```

### Frontend Tests

```bash
cd dqa-frontend
npm test

# With coverage
npm test -- --coverage
```

## 🚀 Deployment

### Production Deployment

1. **Build containers:**
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

2. **Deploy with Docker:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Frontend build:**
   ```bash
   cd dqa-frontend
   npm run build
   # Deploy dist/ folder to your web server
   ```

### Environment Variables

Create `.env` files based on the `.env.example` templates:

```bash
# Backend
cp dqa-backend/.env.example dqa-backend/.env

# Frontend
cp dqa-frontend/.env.example dqa-frontend/.env
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token

### Users
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `GET /api/users/{id}` - Get user details
- `PUT /api/users/{id}` - Update user

### Analytics
- `GET /api/data/analytics` - Get analytics data
- `GET /api/data/reports` - Generate reports
- `GET /api/data/metrics` - Dashboard metrics

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library
- **Routing**: React Router
- **State Management**: React Context/Hooks
- **Build Tool**: Vite
- **Package Manager**: npm

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.11+
- **Database**: PostgreSQL
- **Cache**: Redis
- **Authentication**: JWT
- **ORM**: SQLAlchemy
- **Validation**: Pydantic
- **Documentation**: OpenAPI/Swagger

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Reverse Proxy**: Nginx
- **CI/CD**: GitHub Actions
- **Code Quality**: ESLint, Prettier, Black, isort

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Development**: React/TypeScript specialists
- **Backend Development**: Python/FastAPI experts
- **DevOps**: Container and infrastructure management
- **UI/UX**: Design and user experience

## 📞 Support

- 📧 Email: support@dqa-platform.com
- 📋 Issues: [GitHub Issues](https://github.com/your-org/DQA/issues)
- 📖 Documentation: [Wiki](https://github.com/your-org/DQA/wiki)

## 🗺️ Roadmap

- [ ] Advanced data visualization
- [ ] Real-time analytics
- [ ] Machine learning integration
- [ ] Multi-tenant support
- [ ] Advanced security features
- [ ] Performance optimization
- [ ] Mobile application

---

⭐ **Star this repo** if you find it helpful!

Built with ❤️ by the DQA Team