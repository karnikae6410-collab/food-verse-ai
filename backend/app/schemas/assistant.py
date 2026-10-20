from typing import List, Optional, Dict
from pydantic import BaseModel, Field

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant" or "system"
    content: str
    timestamp: Optional[str] = None

class AssistantChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[ChatMessage]] = []
    mode: Optional[str] = "general"  # "general", "substitutions", "storage", "recipe_maker"
    ingredients: Optional[List[str]] = []
    dietary_preference: Optional[str] = None
    allergies: Optional[List[str]] = []

class SubstitutionItem(BaseModel):
    original: str
    substitute: str
    ratio: str
    culinary_notes: str

class AssistantChatResponse(BaseModel):
    id: str
    reply: str
    suggested_recipes: Optional[List[Dict]] = []
    substitutions: Optional[List[SubstitutionItem]] = []
    storage_tips: Optional[List[str]] = []
    provider_used: str  # e.g., "gemini", "openai", "groq", "rule_based_culinary_system"
    is_fallback: bool = False
