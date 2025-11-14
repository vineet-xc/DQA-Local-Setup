from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
import httpx
from typing import Optional, Dict, Any
import asyncio
import time
import uuid

async def proxy_to_service(
    service_url: str,
    path: str,
    method: str = "GET",
    headers: Optional[Dict[str, str]] = None,
    json_data: Optional[Dict[str, Any]] = None,
    timeout: float = 10.0
) -> Dict[str, Any]:
    """Proxy request to another service"""
    
    full_url = f"{service_url.rstrip('/')}{path}"
    
    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            if method.upper() == "GET":
                response = await client.get(full_url, headers=headers)
            elif method.upper() == "POST":
                response = await client.post(full_url, headers=headers, json=json_data)
            elif method.upper() == "PUT":
                response = await client.put(full_url, headers=headers, json=json_data)
            elif method.upper() == "DELETE":
                response = await client.delete(full_url, headers=headers)
            elif method.upper() == "PATCH":
                response = await client.patch(full_url, headers=headers, json=json_data)
            else:
                raise HTTPException(status_code=405, detail=f"Method {method} not supported")
            
            if response.status_code >= 400:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Service error: {response.text}"
                )
            
            return response.json()
            
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail=f"Timeout calling service at {service_url}"
        )
    except httpx.ConnectError:
        raise HTTPException(
            status_code=503,
            detail=f"Cannot connect to service at {service_url}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error calling service: {str(e)}"
        )

class CircuitBreaker:
    """Simple circuit breaker implementation"""
    
    def __init__(self, failure_threshold: int = 5, timeout: float = 60.0):
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.failure_count = 0
        self.last_failure_time = None
        self.state = "CLOSED"  # CLOSED, OPEN, HALF_OPEN
    
    def can_execute(self) -> bool:
        """Check if request can be executed"""
        if self.state == "CLOSED":
            return True
        
        if self.state == "OPEN":
            if time.time() - self.last_failure_time >= self.timeout:
                self.state = "HALF_OPEN"
                return True
            return False
        
        # HALF_OPEN state
        return True
    
    def on_success(self):
        """Called on successful request"""
        self.failure_count = 0
        self.state = "CLOSED"
    
    def on_failure(self):
        """Called on failed request"""
        self.failure_count += 1
        self.last_failure_time = time.time()
        
        if self.failure_count >= self.failure_threshold:
            self.state = "OPEN"

# Global circuit breakers for each service
circuit_breakers = {}

def get_circuit_breaker(service_name: str) -> CircuitBreaker:
    """Get or create circuit breaker for service"""
    if service_name not in circuit_breakers:
        circuit_breakers[service_name] = CircuitBreaker()
    return circuit_breakers[service_name]

async def resilient_service_call(
    service_name: str,
    service_url: str,
    path: str,
    method: str = "GET",
    **kwargs
) -> Dict[str, Any]:
    """Make a resilient service call with circuit breaker"""
    
    circuit_breaker = get_circuit_breaker(service_name)
    
    if not circuit_breaker.can_execute():
        raise HTTPException(
            status_code=503,
            detail=f"Service {service_name} is temporarily unavailable (circuit breaker open)"
        )
    
    try:
        result = await proxy_to_service(service_url, path, method, **kwargs)
        circuit_breaker.on_success()
        return result
    except Exception as e:
        circuit_breaker.on_failure()
        raise e

def generate_request_id() -> str:
    """Generate unique request ID"""
    return str(uuid.uuid4())

def extract_user_id(request: Request) -> Optional[str]:
    """Extract user ID from request headers or token"""
    # Try to get from headers first
    user_id = request.headers.get("X-User-ID")
    if user_id:
        return user_id
    
    # Try to get from Authorization header (simplified)
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        # In a real implementation, you would decode the JWT token here
        # For now, return None
        pass
    
    return None