from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import logging
import httpx

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="DQA Auth Service",
    description="Authentication and Authorization Microservice",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security configuration
SECRET_KEY = "your-secret-key-change-in-production"  # Change this in production!
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# User service URL
USER_SERVICE_URL = "http://localhost:8001"

# Pydantic Models
class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int

class TokenData(BaseModel):
    username: Optional[str] = None
    user_id: Optional[int] = None

class UserCredentials(BaseModel):
    username: str
    password: str

# In-memory storage for demo (replace with database/Redis in production)
user_credentials = {
    "admin": {
        "username": "admin",
        "hashed_password": pwd_context.hash("admin123"),
        "user_id": 1
    },
    "user1": {
        "username": "user1", 
        "hashed_password": pwd_context.hash("password123"),
        "user_id": 2
    }
}

refresh_tokens = set()  # Store valid refresh tokens

# Utility functions
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict):
    """Create JWT refresh token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user from JWT token"""
    token = credentials.credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        user_id: int = payload.get("user_id")
        if username is None or user_id is None:
            raise credentials_exception
        token_data = TokenData(username=username, user_id=user_id)
    except JWTError:
        raise credentials_exception
    
    return token_data

async def verify_user_with_service(username: str) -> Dict[str, Any]:
    """Verify user exists in user service"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{USER_SERVICE_URL}/users/by-username/{username}")
            if response.status_code == 200:
                return response.json()
            else:
                return None
    except Exception as e:
        logger.error(f"Error contacting user service: {str(e)}")
        return None

@app.get("/")
async def root():
    return {"message": "DQA Auth Service", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "auth-service"}

@app.post("/login", response_model=TokenResponse)
async def login(login_request: LoginRequest):
    """Authenticate user and return tokens"""
    username = login_request.username
    password = login_request.password
    
    # Check credentials
    if username not in user_credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    user_data = user_credentials[username]
    if not verify_password(password, user_data["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    # Verify user exists in user service
    user_info = await verify_user_with_service(username)
    if not user_info:
        logger.warning(f"User {username} not found in user service")
    
    # Create tokens
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": username, "user_id": user_data["user_id"]},
        expires_delta=access_token_expires
    )
    
    refresh_token = create_refresh_token(
        data={"sub": username, "user_id": user_data["user_id"]}
    )
    
    # Store refresh token
    refresh_tokens.add(refresh_token)
    
    logger.info(f"User {username} logged in successfully")
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

@app.post("/logout")
async def logout(current_user: TokenData = Depends(get_current_user)):
    """Logout user (invalidate tokens)"""
    # In a real implementation, you would invalidate the token
    # For now, we'll just log the logout
    logger.info(f"User {current_user.username} logged out")
    return {"message": "Logged out successfully"}

@app.post("/refresh", response_model=TokenResponse)
async def refresh_token(refresh_token: str):
    """Refresh access token using refresh token"""
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        user_id: int = payload.get("user_id")
        token_type: str = payload.get("type")
        
        if username is None or user_id is None or token_type != "refresh":
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        
        if refresh_token not in refresh_tokens:
            raise HTTPException(status_code=401, detail="Refresh token revoked")
        
        # Create new access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        new_access_token = create_access_token(
            data={"sub": username, "user_id": user_id},
            expires_delta=access_token_expires
        )
        
        # Create new refresh token
        new_refresh_token = create_refresh_token(
            data={"sub": username, "user_id": user_id}
        )
        
        # Remove old refresh token and add new one
        refresh_tokens.discard(refresh_token)
        refresh_tokens.add(new_refresh_token)
        
        return TokenResponse(
            access_token=new_access_token,
            refresh_token=new_refresh_token,
            expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
        
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

@app.get("/verify-token")
async def verify_token(current_user: TokenData = Depends(get_current_user)):
    """Verify if the current token is valid"""
    return {
        "valid": True,
        "username": current_user.username,
        "user_id": current_user.user_id
    }

@app.post("/register-credentials")
async def register_credentials(credentials: UserCredentials):
    """Register new user credentials (for demo purposes)"""
    if credentials.username in user_credentials:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    hashed_password = get_password_hash(credentials.password)
    user_id = len(user_credentials) + 1
    
    user_credentials[credentials.username] = {
        "username": credentials.username,
        "hashed_password": hashed_password,
        "user_id": user_id
    }
    
    logger.info(f"Registered credentials for user: {credentials.username}")
    return {"message": "Credentials registered successfully"}

@app.get("/protected")
async def protected_route(current_user: TokenData = Depends(get_current_user)):
    """Example protected route"""
    return {
        "message": f"Hello {current_user.username}!",
        "user_id": current_user.user_id,
        "protected": True
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002, reload=True)