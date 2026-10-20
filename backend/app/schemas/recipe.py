from typing import List, Optional, Dict
from pydantic import BaseModel, Field

class RecipeItem(BaseModel):
    id: Optional[str] = None
    title: str
    cuisine: str = "International"
    prep_time_minutes: int
    cook_time_minutes: int
    servings: int = 2
    calories_per_serving: float
    protein_g: float
    carbs_g: float
    fats_g: float
    ingredients: List[str]
    instructions: List[str]
    substitutions: Optional[List[Dict[str, str]]] = []
    is_favorite: Optional[bool] = False
    timestamp: Optional[str] = None
