from fastapi import APIRouter, HTTPException, status
from backend.app.schemas.assistant import AssistantChatRequest, AssistantChatResponse
from backend.app.services.cooking_assistant_service import cooking_assistant_service

router = APIRouter(prefix="/assistant", tags=["AI Cooking Assistant"])

@router.post("/chat", response_model=AssistantChatResponse)
async def chat_with_assistant(req: AssistantChatRequest):
    if not req.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message cannot be empty."
        )
    try:
        response = await cooking_assistant_service.chat(req)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Cooking assistant error: {str(e)}"
        )
