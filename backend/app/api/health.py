from fastapi import APIRouter
from backend.app.core.config import settings
from backend.app.schemas.common import HealthStatus
from backend.app.database.connection import is_mongo_active

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthStatus)
def get_health():
    mongo_active = is_mongo_active()
    return HealthStatus(
        status="healthy",
        app_name="Food Verse AI",
        version="1.0.0",
        environment=settings.ENVIRONMENT,
        database_connected=mongo_active,
        database_mode="mongodb" if mongo_active else "demo_in_memory",
        llm_provider=settings.LLM_PROVIDER if settings.GEMINI_API_KEY else "rule_based_fallback",
        vision_provider=settings.VISION_MODEL_PROVIDER
    )
