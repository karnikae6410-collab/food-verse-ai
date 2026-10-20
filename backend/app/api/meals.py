from fastapi import APIRouter, HTTPException, status
from typing import List, Dict, Any
from backend.app.schemas.meal_planner import MealPlanRequest, MealPlanResponse
from backend.app.services.meal_planner_service import meal_planner_service
from backend.app.database.connection import get_db

router = APIRouter(prefix="/meals", tags=["Personalized Meal Planner"])

@router.post("/generate", response_model=MealPlanResponse)
def generate_meal_plan(req: MealPlanRequest):
    try:
        plan = meal_planner_service.generate_plan(req)
        return plan
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate meal plan: {str(e)}"
        )

@router.get("", response_model=List[Dict[str, Any]])
def get_saved_meal_plans(limit: int = 20):
    db = get_db()
    if hasattr(db, "find"):
        plans = db.find("meal_plans", limit=limit)
    else:
        cursor = db["meal_plans"].find({}, {"_id": 0}).sort("timestamp", -1).limit(limit)
        plans = list(cursor)
    return plans

@router.post("", status_code=status.HTTP_201_CREATED)
def save_meal_plan(plan: Dict[str, Any]):
    db = get_db()
    if hasattr(db, "insert_one"):
        new_id = db.insert_one("meal_plans", plan)
    else:
        res = db["meal_plans"].insert_one(plan)
        new_id = str(res.inserted_id)
    return {"success": True, "message": "Meal plan saved successfully", "id": new_id}
