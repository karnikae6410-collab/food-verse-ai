from typing import List, Optional, Dict
from pydantic import BaseModel, Field

class MealItem(BaseModel):
    name: str
    description: str
    calories: float
    protein_g: float
    carbs_g: float
    fats_g: float
    fiber_g: float = 0.0
    prep_time_minutes: int
    cook_time_minutes: int
    ingredients: List[str]
    instructions: List[str]
    dietary_tags: List[str] = []

class ShoppingListItem(BaseModel):
    category: str  # e.g., "Produce", "Proteins", "Dairy & Eggs", "Pantry & Grains", "Spices"
    item: str
    quantity: Optional[str] = ""

class MealPlanRequest(BaseModel):
    dietary_preference: str = "Omnivore"
    allergies: List[str] = []
    foods_to_avoid: List[str] = []
    calorie_target: int = Field(default=2000, ge=1000, le=5000)
    available_ingredients: Optional[List[str]] = []
    budget_preference: str = "Moderate"  # "Budget", "Moderate", "Gourmet"
    cuisine_preference: str = "Any"
    meals_count: Optional[int] = 4  # Breakfast, Lunch, Dinner, Snack

class MealPlanResponse(BaseModel):
    id: str
    timestamp: str
    title: str
    dietary_preference: str
    calorie_target: int
    total_calculated_calories: float
    total_protein_g: float
    total_carbs_g: float
    total_fats_g: float
    total_fiber_g: float
    allergies_filtered: List[str]
    meals: Dict[str, MealItem]  # {"breakfast": ..., "lunch": ..., "dinner": ..., "snack": ...}
    shopping_list: List[ShoppingListItem]
    medical_disclaimer: str = (
        "NUTRITION DISCLAIMER: Meal plans and macronutrient calculations are mathematical estimations. "
        "They do not constitute medical, dietetic, or clinical advice. Consult a licensed physician or registered dietitian before beginning any restrictive diet."
    )
    generator_engine: str = "rule_based_nutrition_engine"
