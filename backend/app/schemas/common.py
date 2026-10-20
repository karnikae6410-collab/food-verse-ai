from typing import Optional, Any
from pydantic import BaseModel, Field

class ApiResponse(BaseModel):
    success: bool = True
    message: str = "Operation successful"
    data: Optional[Any] = None

class HealthStatus(BaseModel):
    status: str = "healthy"
    app_name: str = "Food Verse AI"
    version: str = "1.0.0"
    environment: str
    database_connected: bool
    database_mode: str  # "mongodb" or "demo_in_memory"
    llm_provider: str
    vision_provider: str
