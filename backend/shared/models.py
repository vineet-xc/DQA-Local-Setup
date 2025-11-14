from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class BaseResponse(BaseModel):
    """Base response model for all API responses"""
    success: bool = True
    message: str = "Operation completed successfully"
    data: Optional[Any] = None
    timestamp: datetime = datetime.utcnow()

class ErrorResponse(BaseModel):
    """Error response model"""
    success: bool = False
    error_code: str
    error_message: str
    details: Optional[Dict[str, Any]] = None
    timestamp: datetime = datetime.utcnow()

class PaginationParams(BaseModel):
    """Pagination parameters"""
    page: int = 1
    size: int = 10
    
    @property
    def skip(self) -> int:
        return (self.page - 1) * self.size

class PaginatedResponse(BaseModel):
    """Paginated response model"""
    items: list
    total: int
    page: int
    size: int
    pages: int
    
    @classmethod
    def create(cls, items: list, total: int, page: int, size: int):
        pages = (total + size - 1) // size  # Calculate total pages
        return cls(
            items=items,
            total=total,
            page=page,
            size=size,
            pages=pages
        )