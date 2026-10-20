from fastapi import APIRouter, HTTPException, status
from typing import List, Dict, Any
from backend.app.schemas.recipe import RecipeItem
from backend.app.database.connection import get_db, is_mongo_active

router = APIRouter(prefix="/recipes", tags=["Saved Recipes & Culinary Creations"])

@router.get("", response_model=List[Dict[str, Any]])
def get_recipes(limit: int = 50):
    db = get_db()
    if not is_mongo_active():
        recipes = db.find("recipes", limit=limit)
    else:
        cursor = db["recipes"].find({}, {"_id": 0}).sort("timestamp", -1).limit(limit)
        recipes = list(cursor)
    return recipes

@router.post("", status_code=status.HTTP_201_CREATED)
def save_recipe(recipe: RecipeItem):
    db = get_db()
    doc = recipe.model_dump()
    if not is_mongo_active():
        new_id = db.insert_one("recipes", doc)
    else:
        res = db["recipes"].insert_one(doc)
        new_id = str(res.inserted_id)
    return {"success": True, "message": "Recipe saved to your favorites collection", "id": new_id}

@router.delete("/{recipe_id}")
def delete_recipe(recipe_id: str):
    db = get_db()
    if not is_mongo_active():
        success = db.delete_one("recipes", {"id": recipe_id})
    else:
        res = db["recipes"].delete_one({"id": recipe_id})
        success = res.deleted_count > 0
    if not success:
        raise HTTPException(status_code=404, detail="Recipe not found.")
    return {"success": True, "message": "Recipe deleted successfully."}
