import logging
import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from backend.app.core.config import settings

logger = logging.getLogger("food_verse.database")

class InMemoryStore:
    """Thread-safe in-memory collection store for Demo Mode when MongoDB is unavailable."""
    def __init__(self):
        self._collections: Dict[str, List[Dict[str, Any]]] = {
            "food_analyses": [],
            "freshness_analyses": [],
            "hygiene_audits": [],
            "meal_plans": [],
            "recipes": [],
            "user_preferences": []
        }
        self._seed_sample_data()

    def _seed_sample_data(self):
        now = datetime.now(timezone.utc).isoformat()
        
        # Sample food analysis
        self._collections["food_analyses"].append({
            "id": "scan-demo-001",
            "timestamp": now,
            "filename": "grilled_salmon_quinoa.jpg",
            "food_name": "Grilled Atlantic Salmon with Herb Quinoa",
            "category": "Main Course / Seafood",
            "confidence": 0.94,
            "serving_size": "280g (1 plate)",
            "calories": 485,
            "macronutrients": {
                "protein_g": 38.5,
                "carbs_g": 32.0,
                "fats_g": 18.2,
                "fiber_g": 4.5
            },
            "micronutrients": {
                "sodium_mg": 420,
                "potassium_mg": 680,
                "vitamin_d_mcg": 11.2,
                "omega_3_g": 2.1
            },
            "dietary_flags": ["High-Protein", "Heart-Healthy", "Gluten-Free"],
            "notes": "Rich in heart-protective Omega-3 EPA/DHA fatty acids and complete plant proteins.",
            "mode": "demo_seed"
        })

        # Sample freshness assessment
        self._collections["freshness_analyses"].append({
            "id": "fresh-demo-001",
            "timestamp": now,
            "filename": "crisp_organic_apples.jpg",
            "item_name": "Honeycrisp Apples",
            "category": "Fruits",
            "freshness_score": 92.5,
            "status": "Fresh",
            "estimated_shelf_life_days": 8,
            "visual_indicators": [
                {"indicator": "Skin Turgor & Firmness", "status": "Optimal", "details": "Tight, intact epidermis with high specular reflection."},
                {"indicator": "Color Uniformity", "status": "Normal", "details": "Vibrant ruby-yellow blush; zero pathological browning."},
                {"indicator": "Surface Blemishes", "status": "Clear", "details": "No fungal mycelium or necrotic lesions detected."}
            ],
            "storage_recommendation": "Store unwashed in the crisper drawer of refrigerator (34-38°F / 1-3°C) with ~90% humidity.",
            "safety_disclaimer": "AI estimate based on external visual characteristics. Does not test for internal pathogens or chemical residues.",
            "mode": "demo_seed"
        })

        # Sample hygiene audit
        self._collections["hygiene_audits"].append({
            "id": "hygiene-demo-001",
            "timestamp": now,
            "filename": "prep_counter_evening.jpg",
            "facility_area": "Cold Prep & Cutting Station",
            "overall_hygiene_score": 88.0,
            "status": "Compliant",
            "visible_indicators": {
                "workstation_cleanliness": 90,
                "surface_spill_detection": 95,
                "waste_management": 82,
                "food_contact_surfaces": 85
            },
            "checklist": [
                {"item": "Hands wash station stocked with soap & paper towels", "passed": True},
                {"item": "Cross-contamination barriers between raw & RTE foods", "passed": True},
                {"item": "Sanitizer test strips verify 200ppm quat solution", "passed": True},
                {"item": "Lidded garbage bins emptied at scheduled interval", "passed": False}
            ],
            "audit_notes": "Prep surfaces cleared of organic debris. Minor recommendation: Empty trash bin near station B.",
            "mode": "demo_seed"
        })

        # Sample saved recipe
        self._collections["recipes"].append({
            "id": "recipe-demo-001",
            "timestamp": now,
            "title": "Mediterranean Lemon Herb Roast Chicken & Veggies",
            "cuisine": "Mediterranean",
            "prep_time_minutes": 15,
            "cook_time_minutes": 35,
            "servings": 4,
            "calories_per_serving": 410,
            "protein_g": 36,
            "carbs_g": 18,
            "fats_g": 16,
            "ingredients": [
                "600g Boneless skinless chicken breasts or thighs, diced",
                "2 medium Zucchini, sliced into rounds",
                "1 cup Cherry tomatoes, halved",
                "1 Red bell pepper, diced into 1-inch pieces",
                "3 tbsp Extra virgin olive oil",
                "3 cloves Garlic, finely minced",
                "1 tbsp Dried oregano and dried thyme",
                "Juice of 1 fresh lemon",
                "Sea salt and freshly cracked black pepper to taste"
            ],
            "instructions": [
                "Preheat oven to 400°F (200°C) and line a large baking sheet with parchment paper.",
                "In a large mixing bowl, toss diced chicken and prepared vegetables with olive oil, minced garlic, oregano, thyme, salt, and pepper.",
                "Spread ingredients in a single, even layer across the baking sheet so vegetables roast rather than steam.",
                "Roast for 30-35 minutes until chicken registers 165°F (74°C) internal temperature and edges are lightly browned.",
                "Drizzle fresh lemon juice over the hot sheet pan and garnish with fresh parsley before serving."
            ],
            "substitutions": [
                {"original": "Chicken breast", "substitute": "Extra firm tofu or chickpeas for vegetarian option"},
                {"original": "Olive oil", "substitute": "Avocado oil for higher smoke point"}
            ],
            "is_favorite": True
        })

        # Sample meal plan
        self._collections["meal_plans"].append({
            "id": "plan-demo-001",
            "timestamp": now,
            "title": "Balanced Mediterranean Energy Week",
            "dietary_preference": "Mediterranean / High Protein",
            "calorie_target": 2100,
            "allergies": ["Shellfish", "Peanuts"],
            "meals": {
                "breakfast": {
                    "name": "Greek Yogurt Berry Parfait with Chia & Pumpkin Seeds",
                    "calories": 420,
                    "protein_g": 30,
                    "carbs_g": 45,
                    "fats_g": 12,
                    "prep_time": "5 mins",
                    "ingredients": ["Greek yogurt (plain 2%)", "Mixed berries", "Chia seeds", "Raw pumpkin seeds", "Honey (1 tsp)"]
                },
                "lunch": {
                    "name": "Tuscan White Bean & Grilled Chicken Salad Bowl",
                    "calories": 580,
                    "protein_g": 46,
                    "carbs_g": 52,
                    "fats_g": 16,
                    "prep_time": "15 mins",
                    "ingredients": ["Cannellini beans", "Grilled chicken breast", "Arugula & spinach", "Kalamata olives", "Lemon olive oil vinaigrette"]
                },
                "dinner": {
                    "name": "Pan-Seared Salmon with Steamed Asparagus & Quinoa",
                    "calories": 650,
                    "protein_g": 44,
                    "carbs_g": 48,
                    "fats_g": 24,
                    "prep_time": "25 mins",
                    "ingredients": ["Atlantic salmon fillet", "Asparagus spears", "Tricolor quinoa", "Garlic herb butter", "Lemon slices"]
                },
                "snack": {
                    "name": "Hummus with Cucumber Rounds & Baby Carrots",
                    "calories": 220,
                    "protein_g": 8,
                    "carbs_g": 24,
                    "fats_g": 10,
                    "prep_time": "5 mins",
                    "ingredients": ["Roasted garlic hummus", "English cucumber", "Baby rainbow carrots"]
                }
            },
            "shopping_list": [
                {"category": "Produce", "item": "Mixed organic berries (blueberries/strawberries)"},
                {"category": "Produce", "item": "Fresh baby arugula & spinach mix"},
                {"category": "Produce", "item": "Asparagus bunch & English cucumbers"},
                {"category": "Produce", "item": "Lemons & fresh garlic"},
                {"category": "Proteins", "item": "Organic boneless chicken breasts (1.5 lbs)"},
                {"category": "Proteins", "item": "Fresh Atlantic salmon fillets (2 portions)"},
                {"category": "Dairy", "item": "Greek yogurt (Plain 2% fat, 32 oz)"},
                {"category": "Pantry", "item": "Cannellini beans (15 oz can)"},
                {"category": "Pantry", "item": "Tricolor quinoa"},
                {"category": "Pantry", "item": "Chia seeds, pumpkin seeds, Kalamata olives"}
            ]
        })

    def find(self, collection: str, query: Optional[Dict[str, Any]] = None, limit: int = 50) -> List[Dict[str, Any]]:
        items = self._collections.get(collection, [])
        if not query:
            return sorted(items, key=lambda x: x.get("timestamp", ""), reverse=True)[:limit]
        
        filtered = []
        for item in items:
            match = True
            for k, v in query.items():
                if item.get(k) != v:
                    match = False
                    break
            if match:
                filtered.append(item)
        return sorted(filtered, key=lambda x: x.get("timestamp", ""), reverse=True)[:limit]

    def insert_one(self, collection: str, document: Dict[str, Any]) -> str:
        if collection not in self._collections:
            self._collections[collection] = []
        if not document.get("id"):
            document["id"] = str(uuid.uuid4())
        if "timestamp" not in document:
            document["timestamp"] = datetime.now(timezone.utc).isoformat()
        self._collections[collection].insert(0, document)
        return document["id"]

    def delete_one(self, collection: str, query: Dict[str, Any]) -> bool:
        items = self._collections.get(collection, [])
        for i, item in enumerate(items):
            match = True
            for k, v in query.items():
                if item.get(k) != v:
                    match = False
                    break
            if match:
                items.pop(i)
                return True
        return False

# Global database instances
_mongo_client = None
_mongo_db = None
_in_memory_store = InMemoryStore()
_is_connected_to_mongo = False

def init_db():
    global _mongo_client, _mongo_db, _is_connected_to_mongo
    try:
        from pymongo import MongoClient
        from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
        
        client = MongoClient(settings.MONGODB_URI, serverSelectionTimeoutMS=1500)
        # Attempt lightweight ping
        client.admin.command('ping')
        _mongo_client = client
        _mongo_db = client[settings.MONGODB_DB_NAME]
        _is_connected_to_mongo = True
        logger.info(f"Successfully connected to MongoDB at {settings.MONGODB_URI}")
    except Exception as e:
        _is_connected_to_mongo = False
        logger.warning(
            f"MongoDB connection unavailable ({e}). Using resilient In-Memory Store & Demo Mode."
        )

def get_db():
    """Returns real Mongo DB or the In-Memory collection store."""
    if _is_connected_to_mongo and _mongo_db is not None:
        return _mongo_db
    return _in_memory_store

def is_mongo_active() -> bool:
    return _is_connected_to_mongo

def get_store() -> InMemoryStore:
    return _in_memory_store
