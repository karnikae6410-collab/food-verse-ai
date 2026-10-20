from fastapi import APIRouter, UploadFile, File, HTTPException, status
from backend.app.core.config import settings
from backend.app.schemas.freshness import FreshnessAnalysisResponse
from backend.app.services.freshness_analyzer import freshness_analyzer
from backend.app.database.connection import get_db

router = APIRouter(prefix="/freshness", tags=["Food Freshness & Spoilage"])

@router.post("/analyze", response_model=FreshnessAnalysisResponse)
async def analyze_freshness(file: UploadFile = File(...)):
    if file.content_type not in settings.allowed_image_types_list:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '{file.content_type}'. Allowed: {settings.ALLOWED_IMAGE_TYPES}"
        )

    file_bytes = await file.read()
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(file_bytes) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Image file exceeds maximum allowable size of {settings.MAX_UPLOAD_SIZE_MB}MB."
        )

    try:
        result = freshness_analyzer.analyze_freshness(file_bytes, file.filename or "produce.jpg")
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Freshness analysis error: {str(e)}")

    # Persist to database
    try:
        db = get_db()
        doc = result.model_dump()
        if hasattr(db, "insert_one"):
            db.insert_one("freshness_analyses", doc)
        else:
            db["freshness_analyses"].insert_one(doc)
    except Exception:
        pass

    return result
