import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.app.core.config import settings
from backend.app.database.connection import init_db, is_mongo_active
from backend.app.api.health import router as health_router
from backend.app.api.food import router as food_router
from backend.app.api.freshness import router as freshness_router
from backend.app.api.hygiene import router as hygiene_router
from backend.app.api.meals import router as meals_router
from backend.app.api.assistant import router as assistant_router
from backend.app.api.recipes import router as recipes_router
from backend.app.api.history import router as history_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("food_verse")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing Food Verse AI Backend...")
    init_db()
    logger.info(f"Database status: {'MongoDB' if is_mongo_active() else 'In-Memory Demo Store'}")
    yield
    logger.info("Shutting down Food Verse AI Backend.")

app = FastAPI(
    title="Food Verse AI – Multimodal Food Intelligence Agent",
    description="Multimodal AI-powered food intelligence platform: food recognition, nutrition analysis, freshness detection, restaurant hygiene audit, smart cooking assistant, and allergy-safe meal planner.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list or ["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all API routers under /api
app.include_router(health_router, prefix="/api")
app.include_router(food_router, prefix="/api")
app.include_router(freshness_router, prefix="/api")
app.include_router(hygiene_router, prefix="/api")
app.include_router(meals_router, prefix="/api")
app.include_router(assistant_router, prefix="/api")
app.include_router(recipes_router, prefix="/api")
app.include_router(history_router, prefix="/api")

@app.get("/")
def root():
    return JSONResponse({
        "app": "Food Verse AI",
        "tagline": "Smarter Food Choices. Safer Meals. Healthier Living.",
        "version": "1.0.0",
        "docs_url": "/docs",
        "health_check": "/api/health",
        "status": "operational"
    })

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
