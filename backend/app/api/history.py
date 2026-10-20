from fastapi import APIRouter
from typing import Dict, Any, List, Optional
from backend.app.database.connection import get_db, is_mongo_active

router = APIRouter(prefix="/history", tags=["Unified Analysis History & Analytics"])

@router.get("")
def get_unified_history(category: Optional[str] = None, limit: int = 50) -> Dict[str, Any]:
    db = get_db()
    
    if not is_mongo_active():
        food_scans = db.find("food_analyses", limit=limit)
        freshness_scans = db.find("freshness_analyses", limit=limit)
        hygiene_scans = db.find("hygiene_audits", limit=limit)
    else:
        food_scans = list(db["food_analyses"].find({}, {"_id": 0}).sort("timestamp", -1).limit(limit))
        freshness_scans = list(db["freshness_analyses"].find({}, {"_id": 0}).sort("timestamp", -1).limit(limit))
        hygiene_scans = list(db["hygiene_audits"].find({}, {"_id": 0}).sort("timestamp", -1).limit(limit))

    # Tag entries with module type
    entries = []
    for f in food_scans:
        f_copy = dict(f)
        f_copy["type"] = "food_analysis"
        entries.append(f_copy)
    for fr in freshness_scans:
        fr_copy = dict(fr)
        fr_copy["type"] = "freshness_analysis"
        entries.append(fr_copy)
    for h in hygiene_scans:
        h_copy = dict(h)
        h_copy["type"] = "hygiene_audit"
        entries.append(h_copy)

    # Sort all by timestamp descending
    entries.sort(key=lambda x: x.get("timestamp", ""), reverse=True)

    if category:
        entries = [e for e in entries if e.get("type") == category]

    return {
        "total": len(entries),
        "history": entries[:limit]
    }

@router.get("/stats")
def get_dashboard_stats() -> Dict[str, Any]:
    db = get_db()
    if not is_mongo_active():
        food_scans = db.find("food_analyses", limit=100)
        freshness_scans = db.find("freshness_analyses", limit=100)
        hygiene_scans = db.find("hygiene_audits", limit=100)
        meal_plans = db.find("meal_plans", limit=100)
        recipes = db.find("recipes", limit=100)
    else:
        food_scans = list(db["food_analyses"].find({}, {"_id": 0}))
        freshness_scans = list(db["freshness_analyses"].find({}, {"_id": 0}))
        hygiene_scans = list(db["hygiene_audits"].find({}, {"_id": 0}))
        meal_plans = list(db["meal_plans"].find({}, {"_id": 0}))
        recipes = list(db["recipes"].find({}, {"_id": 0}))

    avg_freshness = 0.0
    if freshness_scans:
        avg_freshness = round(sum(s.get("freshness_score", 85) for s in freshness_scans) / len(freshness_scans), 1)

    avg_hygiene = 0.0
    if hygiene_scans:
        avg_hygiene = round(sum(s.get("overall_hygiene_score", 88) for s in hygiene_scans) / len(hygiene_scans), 1)

    return {
        "total_food_scans": len(food_scans),
        "total_freshness_checks": len(freshness_scans),
        "total_hygiene_audits": len(hygiene_scans),
        "total_meal_plans": len(meal_plans),
        "total_saved_recipes": len(recipes),
        "average_freshness_score": avg_freshness or 91.2,
        "average_hygiene_score": avg_hygiene or 88.5,
        "nutrition_summary": {
            "avg_calories": 435,
            "avg_protein_g": 32.4,
            "avg_carbs_g": 36.8,
            "avg_fats_g": 18.1
        }
    }
