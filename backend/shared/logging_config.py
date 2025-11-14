import logging
import sys
from typing import Any
import json
from datetime import datetime

class JSONFormatter(logging.Formatter):
    """Custom JSON formatter for structured logging"""
    
    def format(self, record: logging.LogRecord) -> str:
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno
        }
        
        # Add extra fields if present
        if hasattr(record, 'user_id'):
            log_entry["user_id"] = record.user_id
        
        if hasattr(record, 'request_id'):
            log_entry["request_id"] = record.request_id
            
        if hasattr(record, 'service'):
            log_entry["service"] = record.service
        
        # Add exception info if present
        if record.exc_info:
            log_entry["exception"] = self.formatException(record.exc_info)
        
        return json.dumps(log_entry)

def setup_logging(service_name: str, log_level: str = "INFO") -> logging.Logger:
    """Setup structured logging for a service"""
    
    # Create logger
    logger = logging.getLogger(service_name)
    logger.setLevel(getattr(logging, log_level.upper()))
    
    # Remove existing handlers
    for handler in logger.handlers[:]:
        logger.removeHandler(handler)
    
    # Create console handler with JSON formatter
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JSONFormatter())
    
    logger.addHandler(handler)
    logger.propagate = False
    
    return logger

def log_request(logger: logging.Logger, method: str, path: str, user_id: str = None, request_id: str = None):
    """Log HTTP request"""
    logger.info(
        f"{method} {path}",
        extra={
            "user_id": user_id,
            "request_id": request_id,
            "service": logger.name,
            "event_type": "http_request"
        }
    )

def log_error(logger: logging.Logger, error: Exception, context: dict = None):
    """Log error with context"""
    extra_data = {"service": logger.name, "event_type": "error"}
    if context:
        extra_data.update(context)
    
    logger.error(f"Error: {str(error)}", extra=extra_data, exc_info=True)