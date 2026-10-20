from fastapi import APIRouter, UploadFile, File, HTTPException, status
from backend.app.core.config import settings
from backend.app.schemas.food import FoodAnalysisResponse
from backend.app.services.food_recognizer import food_recognizer
from backend.app.database.connection import get_db, is_mongo_active

router = APIRouter(prefix="/food", tags=["Food Recognition & Nutrition"])

@router.post("/analyze", response_model=FoodAnalysisResponse)
async def analyze_food(file: UploadFile = File(...)):
    # Validate content type
    if file.content_type not in settings.allowed_image_types_list:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '{file.content_type}'. Allowed: {settings.ALLOWED_IMAGE_TYPES}"
        )

    # Read bytes and check size
    file_bytes = await file.read()
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(file_bytes) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Image file exceeds maximum allowable size of {settings.MAX_UPLOAD_SIZE_MB}MB."
        )

    try:
        result = await food_recognizer.analyze_food_image(file_bytes, file.filename or "unknown.jpg")
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Inference error: {str(e)}")

    # Persist to database
    try:
        db = get_db()
        doc = result.model_dump()
        if not is_mongo_active():
            db.insert_one("food_analyses", doc)
        else:
            db["food_analyses"].insert_one(doc)
    except Exception as err:
        pass

    return result
