# Shared utilities package for DQA microservices

This package contains shared utilities, models, and configurations that can be used across all microservices.

## Modules

- `models.py`: Common Pydantic models for requests/responses
- `config.py`: Application configuration using Pydantic Settings
- `logging_config.py`: Structured logging setup
- `utils.py`: Utility functions for service communication and resilience

## Usage

To use these utilities in your microservices:

1. Add the shared directory to your Python path
2. Import the required modules:

```python
from shared.models import BaseResponse, ErrorResponse
from shared.config import get_settings
from shared.logging_config import setup_logging
from shared.utils import proxy_to_service, resilient_service_call
```

## Environment Variables

Create a `.env` file in each service directory with the following variables:

```
APP_NAME=DQA User Service
DEBUG=false
DATABASE_URL=sqlite:///./users.db
SECRET_KEY=your-secret-key-here
LOG_LEVEL=INFO
```