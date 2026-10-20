from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    ENVIRONMENT: str = "development"
    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"
    
    # Database
    MONGODB_URI: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "food_verse_ai"
    
    # AI/LLM
    LLM_PROVIDER: str = "none"  # "none", "gemini", "openai", "groq", "ollama"
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    GROQ_API_KEY: str = ""
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    
    # Vision
    VISION_MODEL_PROVIDER: str = "hybrid"  # "hybrid", "local_cv", "mock"
    CONFIDENCE_THRESHOLD: float = 0.60
    
    # Uploads
    MAX_UPLOAD_SIZE_MB: int = 25
    ALLOWED_IMAGE_TYPES: str = "image/jpeg,image/png,image/webp,image/jpg"
    ALLOWED_VIDEO_TYPES: str = "video/mp4,video/webm,video/quicktime"
    
    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def allowed_image_types_list(self) -> List[str]:
        return [t.strip() for t in self.ALLOWED_IMAGE_TYPES.split(",") if t.strip()]

    @property
    def allowed_video_types_list(self) -> List[str]:
        return [t.strip() for t in self.ALLOWED_VIDEO_TYPES.split(",") if t.strip()]

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
