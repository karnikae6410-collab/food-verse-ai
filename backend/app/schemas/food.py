from typing import List, Optional, Dict
from pydantic import BaseModel, Field

class Macronutrients(BaseModel):
    protein_g: float
    carbs_g: float
    fats_g: float
    fiber_g: float = 0.0

class Micronutrients(BaseModel):
    sodium_mg: Optional[float] = 0.0
    potassium_mg: Optional[float] = 0.0
    calcium_mg: Optional[float] = 0.0
    iron_mg: Optional[float] = 0.0
    vitamin_c_mg: Optional[float] = 0.0
    vitamin_d_mcg: Optional[float] = 0.0
    cholesterol_mg: Optional[float] = 0.0

class FoodCandidate(BaseModel):
    name: str
    confidence: float
    category: str

class FoodAnalysisResponse(BaseModel):
    id: str
    timestamp: str
    filename: str
    food_name: str
    confidence: float
    category: str
    serving_size: str
    calories: float
    macronutrients: Macronutrients
    micronutrients: Micronutrients
    top_candidates: List[FoodCandidate] = []
    dietary_flags: List[str] = []
    allergen_warnings: List[str] = []
    health_insights: str
    inference_mode: str = "vision_engine"
    status_note: str = "Food identified via multimodal vision feature inspection."
