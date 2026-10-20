from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from typing import Optional
from backend.app.core.config import settings
from backend.app.schemas.hygiene import KitchenHygieneResponse
from backend.app.services.hygiene_inspector import hygiene_inspector
from backend.app.database.connection import get_db, is_mongo_active

router = APIRouter(prefix="/hygiene", tags=["Kitchen & Restaurant Hygiene"])

@router.post("/analyze", response_model=KitchenHygieneResponse)
async def analyze_hygiene_image(
    file: UploadFile = File(...),
    facility_zone: Optional[str] = Form("Cold Prep & Cutting Station")
):
    if file.content_type not in settings.allowed_image_types_list:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported image type '{file.content_type}'. Allowed: {settings.ALLOWED_IMAGE_TYPES}"
        )

    file_bytes = await file.read()
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(file_bytes) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Image file exceeds maximum allowable size of {settings.MAX_UPLOAD_SIZE_MB}MB."
        )

    try:
        result = hygiene_inspector.analyze_image_hygiene(
            file_bytes,
            file.filename or "kitchen.jpg",
            facility_zone or "Cold Prep"
        )
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Hygiene inspection error: {str(e)}")

    # Persist to database
    try:
        db = get_db()
        doc = result.model_dump()
        if not is_mongo_active():
            db.insert_one("hygiene_audits", doc)
        else:
            db["hygiene_audits"].insert_one(doc)
    except Exception:
        pass

    return result

@router.post("/video-analyze", response_model=KitchenHygieneResponse)
async def analyze_hygiene_video(
    file: UploadFile = File(...),
    facility_zone: Optional[str] = Form("Main Cook Line & Grills")
):
    if file.content_type not in settings.allowed_video_types_list:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported video type '{file.content_type}'. Allowed: {settings.ALLOWED_VIDEO_TYPES}"
        )

    file_bytes = await file.read()
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(file_bytes) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Video file exceeds maximum allowable size of {settings.MAX_UPLOAD_SIZE_MB}MB."
        )

    try:
        result = hygiene_inspector.analyze_video_hygiene(
            file_bytes,
            file.filename or "kitchen_monitoring.mp4",
            facility_zone or "Main Cook Line"
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Video frame analysis error: {str(e)}")

    try:
        db = get_db()
        doc = result.model_dump()
        if not is_mongo_active():
            db.insert_one("hygiene_audits", doc)
        else:
            db["hygiene_audits"].insert_one(doc)
    except Exception:
        pass

    return result
