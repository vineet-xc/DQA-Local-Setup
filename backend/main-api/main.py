from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import httpx
from pydantic import BaseModel
from typing import Dict, Any
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="DQA Main API Gateway",
    description="Main API Gateway for DQA Backend Services",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Service URLs - Configure these based on your deployment
SERVICE_URLS = {
    "user": "http://localhost:8001",
    "auth": "http://localhost:8002", 
    "data": "http://localhost:8003"
}

class ServiceResponse(BaseModel):
    service: str
    status: str
    data: Any = None
    error: str = None

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "DQA Main API Gateway", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "services": SERVICE_URLS}

@app.get("/health/services")
async def services_health():
    """Check health of all microservices"""
    health_status = {}
    
    async with httpx.AsyncClient() as client:
        for service_name, service_url in SERVICE_URLS.items():
            try:
                response = await client.get(f"{service_url}/health", timeout=5.0)
                health_status[service_name] = {
                    "status": "healthy" if response.status_code == 200 else "unhealthy",
                    "url": service_url,
                    "response_time": response.elapsed.total_seconds()
                }
            except Exception as e:
                health_status[service_name] = {
                    "status": "unreachable",
                    "url": service_url,
                    "error": str(e)
                }
    
    return {"services": health_status}

# User Service Proxy Routes
@app.get("/api/users/{user_id}")
async def get_user(user_id: int):
    """Get user by ID - proxy to user service"""
    return await proxy_request("user", f"/users/{user_id}")

@app.post("/api/users")
async def create_user(user_data: Dict[str, Any]):
    """Create user - proxy to user service"""
    return await proxy_request("user", "/users", method="POST", json_data=user_data)

# Auth Service Proxy Routes
@app.post("/api/auth/login")
async def login(credentials: Dict[str, Any]):
    """Login - proxy to auth service"""
    return await proxy_request("auth", "/login", method="POST", json_data=credentials)

@app.post("/api/auth/logout")
async def logout():
    """Logout - proxy to auth service"""
    return await proxy_request("auth", "/logout", method="POST")

# Data Service Proxy Routes
@app.get("/api/data/analytics")
async def get_analytics():
    """Get analytics data - proxy to data service"""
    return await proxy_request("data", "/analytics")

@app.get("/api/data/reports")
async def get_reports():
    """Get reports - proxy to data service"""
    return await proxy_request("data", "/reports")

async def proxy_request(service: str, path: str, method: str = "GET", json_data: Dict[str, Any] = None):
    """Helper function to proxy requests to microservices"""
    if service not in SERVICE_URLS:
        raise HTTPException(status_code=404, detail=f"Service '{service}' not found")
    
    service_url = SERVICE_URLS[service]
    full_url = f"{service_url}{path}"
    
    try:
        async with httpx.AsyncClient() as client:
            if method == "GET":
                response = await client.get(full_url, timeout=10.0)
            elif method == "POST":
                response = await client.post(full_url, json=json_data, timeout=10.0)
            elif method == "PUT":
                response = await client.put(full_url, json=json_data, timeout=10.0)
            elif method == "DELETE":
                response = await client.delete(full_url, timeout=10.0)
            else:
                raise HTTPException(status_code=405, detail=f"Method {method} not allowed")
            
            if response.status_code >= 400:
                raise HTTPException(status_code=response.status_code, detail=response.text)
            
            return response.json()
            
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail=f"Timeout calling {service} service")
    except httpx.ConnectError:
        raise HTTPException(status_code=503, detail=f"Cannot connect to {service} service")
    except Exception as e:
        logger.error(f"Error proxying to {service}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)