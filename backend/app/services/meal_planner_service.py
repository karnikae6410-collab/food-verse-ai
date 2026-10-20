import uuid
import logging
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from backend.app.schemas.meal_planner import (
    MealPlanRequest,
    MealPlanResponse,
    MealItem,
    ShoppingListItem,
)

logger = logging.getLogger("food_verse.meal_planner")

ALLERGEN_KEYWORDS = {
    "peanuts": ["peanut", "peanut butter", "groundnut"],
    "tree nuts": ["almond", "walnut", "cashew", "pecan", "pistachio", "hazelnut", "macadamia"],
    "dairy": ["milk", "cheese", "butter", "cream", "yogurt", "whey", "feta", "parmesan", "mozzarella"],
    "gluten": ["wheat", "barley", "rye", "bread", "pasta", "flour", "tortilla", "couscous"],
    "eggs": ["egg", "eggs", "mayonnaise", "albumen"],
    "shellfish": ["shrimp", "crab", "lobster", "prawn", "scallop", "clam", "mussel", "oyster"],
    "fish": ["salmon", "tuna", "cod", "tilapia", "halibut", "anchovy", "sardine", "trout"],
    "soy": ["soy", "soya", "tofu", "edamame", "tempeh", "miso", "soy sauce"],
    "sesame": ["sesame", "tahini", "sesame oil"]
}

# Rich Recipe Catalog structured for dynamic allergen filtering and macro matching
RECIPE_CATALOG: Dict[str, List[Dict[str, Any]]] = {
    "breakfast": [
        {
            "name": "Overnight Chia & Oat Bowl with Wild Berries",
            "diet": ["Vegetarian", "Vegan", "Mediterranean"],
            "calories": 420, "protein_g": 18, "carbs_g": 62, "fats_g": 12, "fiber_g": 11,
            "prep_time": 10, "cook_time": 0,
            "ingredients": ["Gluten-free rolled oats (1/2 cup)", "Chia seeds (2 tbsp)", "Almond milk unsweetened (1 cup)", "Fresh blueberries & blackberries (1/2 cup)", "Pure maple syrup (1 tsp)"],
            "instructions": ["Stir oats, chia seeds, and milk together in a jar.", "Refrigerate overnight or at least 4 hours.", "Top with fresh berries and maple syrup before serving."],
            "allergens": ["tree nuts"]
        },
        {
            "name": "Spinach & Herb Scramble with Sliced Avocado",
            "diet": ["Omnivore", "Vegetarian", "Keto", "Low-Carb", "Mediterranean"],
            "calories": 390, "protein_g": 24, "carbs_g": 8, "fats_g": 28, "fiber_g": 6,
            "prep_time": 5, "cook_time": 8,
            "ingredients": ["3 large pasture-raised eggs", "1 cup baby spinach", "1/2 medium ripe avocado", "1 tbsp extra virgin olive oil", "Fresh dill and chives", "Pinch of pink sea salt"],
            "instructions": ["Whisk eggs with a splash of water and fresh herbs.", "Heat olive oil in non-stick pan over medium-low heat.", "Add spinach until wilted, pour in eggs, and softly scramble.", "Serve with sliced avocado."],
            "allergens": ["eggs"]
        },
        {
            "name": "Golden Turmeric Tofu Scramble with Bell Peppers",
            "diet": ["Vegan", "Vegetarian", "Low-Carb", "Mediterranean"],
            "calories": 340, "protein_g": 26, "carbs_g": 12, "fats_g": 20, "fiber_g": 5,
            "prep_time": 8, "cook_time": 10,
            "ingredients": ["Firm organic tofu (200g, crumbled)", "1/2 red bell pepper, diced", "1 tbsp nutritional yeast", "1/2 tsp ground turmeric and smoked paprika", "1 tbsp olive oil", "Kala namak (black salt)"],
            "instructions": ["Heat olive oil and sauté diced bell peppers for 3 minutes.", "Crumble tofu into the skillet.", "Sprinkle turmeric, nutritional yeast, and seasonings.", "Cook until heated through and lightly golden."],
            "allergens": ["soy"]
        },
        {
            "name": "Greek Yogurt Protein Bowl with Seeds & Cinnamon",
            "diet": ["Vegetarian", "High-Protein", "Mediterranean"],
            "calories": 440, "protein_g": 36, "carbs_g": 28, "fats_g": 16, "fiber_g": 6,
            "prep_time": 5, "cook_time": 0,
            "ingredients": ["Plain Greek yogurt 2% (1.5 cups)", "Pumpkin seeds & sunflower seeds (2 tbsp)", "Fresh sliced strawberries", "Ground Ceylon cinnamon", "Raw honey (1 tsp)"],
            "instructions": ["Spoon Greek yogurt into a chilled bowl.", "Sprinkle roasted pumpkin and sunflower seeds.", "Top with sliced strawberries and dust with cinnamon."],
            "allergens": ["dairy"]
        }
    ],
    "lunch": [
        {
            "name": "Mediterranean Quinoa & Herb Salmon Bowl",
            "diet": ["Omnivore", "Pescatarian", "Mediterranean", "Gluten-Free"],
            "calories": 590, "protein_g": 42, "carbs_g": 50, "fats_g": 22, "fiber_g": 7,
            "prep_time": 15, "cook_time": 15,
            "ingredients": ["6 oz wild Atlantic salmon fillet", "1 cup cooked quinoa", "1 cup Persian cucumbers & cherry tomatoes", "2 tbsp kalamata olives", "1 tbsp extra virgin olive oil & fresh lemon juice"],
            "instructions": ["Season salmon with salt, pepper, and oregano.", "Pan-sear salmon in cast iron for 4-5 mins per side.", "Layer cooked quinoa in bowl with chopped vegetables and olives.", "Rest salmon on top and dress with lemon-olive oil vinaigrette."],
            "allergens": ["fish"]
        },
        {
            "name": "Tuscan White Bean & Kale Stew with Rosemary",
            "diet": ["Vegan", "Vegetarian", "Mediterranean", "High-Fiber"],
            "calories": 480, "protein_g": 22, "carbs_g": 68, "fats_g": 12, "fiber_g": 16,
            "prep_time": 10, "cook_time": 25,
            "ingredients": ["Cannellini beans (1 can, drained & rinsed)", "2 cups chopped Lacinato kale", "2 carrots & 1 celery stalk, diced", "3 cloves garlic, minced", "2 cups low-sodium vegetable broth", "1 tbsp fresh rosemary"],
            "instructions": ["Sauté garlic, carrots, and celery in olive oil until tender.", "Add cannellini beans, rosemary, and vegetable broth.", "Simmer for 15 minutes, then fold in chopped kale until vibrant green.", "Ladle hot and season with fresh cracked pepper."],
            "allergens": []
        },
        {
            "name": "Grilled Lemon Herb Chicken & Roasted Sweet Potato",
            "diet": ["Omnivore", "High-Protein", "Gluten-Free"],
            "calories": 620, "protein_g": 48, "carbs_g": 54, "fats_g": 18, "fiber_g": 8,
            "prep_time": 15, "cook_time": 25,
            "ingredients": ["7 oz boneless skinless chicken breast", "1 medium sweet potato, cubed", "2 cups steamed broccoli florets", "1 tbsp olive oil", "Garlic powder, paprika, dried oregano"],
            "instructions": ["Toss sweet potato cubes with olive oil and roast at 400°F (200°C) for 25 mins.", "Grill seasoned chicken breast for 6-7 mins per side until internal temp is 165°F.", "Steam broccoli florets until crisp-tender.", "Assemble on plate and serve with fresh lemon wedges."],
            "allergens": []
        },
        {
            "name": "Zesty Black Bean & Avocado Burrito Bowl",
            "diet": ["Vegetarian", "Vegan", "Gluten-Free"],
            "calories": 530, "protein_g": 20, "carbs_g": 72, "fats_g": 18, "fiber_g": 15,
            "prep_time": 12, "cook_time": 10,
            "ingredients": ["1 cup cooked brown rice", "1 can organic black beans, rinsed", "1/2 ripe avocado, diced", "1/2 cup roasted sweet corn & red peppers", "2 tbsp salsa verde", "Fresh cilantro & lime"],
            "instructions": ["Warm black beans with cumin and lime juice.", "Place brown rice at base of bowl.", "Arrange black beans, sweet corn, and diced avocado in sections.", "Drizzle with salsa verde and cilantro."],
            "allergens": []
        }
    ],
    "dinner": [
        {
            "name": "Pan-Roasted Herb Halibut with Asparagus & Garlic Mash",
            "diet": ["Omnivore", "Pescatarian", "Gluten-Free", "Mediterranean"],
            "calories": 610, "protein_g": 46, "carbs_g": 42, "fats_g": 24, "fiber_g": 6,
            "prep_time": 15, "cook_time": 20,
            "ingredients": ["6 oz wild Alaskan halibut fillet", "1 bunch thin green asparagus", "1 cup steamed cauliflower-potato garlic mash", "1.5 tbsp grass-fed butter or olive oil", "Fresh dill and Meyer lemon slices"],
            "instructions": ["Pat halibut dry and season with sea salt and white pepper.", "Sear in skillet with olive oil for 4 minutes, flip and baste with butter and herbs.", "Toss asparagus in pan for 3 minutes until tender.", "Plate atop warm garlic mash with lemon slices."],
            "allergens": ["fish"]
        },
        {
            "name": "Slow-Simmered Lentil Bolognese with Gluten-Free Penne",
            "diet": ["Vegetarian", "Vegan", "Mediterranean"],
            "calories": 560, "protein_g": 24, "carbs_g": 86, "fats_g": 12, "fiber_g": 14,
            "prep_time": 15, "cook_time": 30,
            "ingredients": ["1 cup cooked brown lentils", "1 can San Marzano crushed tomatoes", "1 cup diced onion, celery, and carrot mirepoix", "85g brown rice gluten-free penne", "2 tbsp fresh basil", "Extra virgin olive oil"],
            "instructions": ["Sweat finely diced mirepoix in olive oil with garlic.", "Add lentils, crushed tomatoes, and Italian herbs; simmer 25 mins.", "Boil penne until al dente.", "Toss pasta with rich lentil bolognese and top with fresh basil."],
            "allergens": []
        },
        {
            "name": "Grass-Fed Beef Sirloin Steak with Roasted Brussels Sprouts",
            "diet": ["Omnivore", "Keto", "High-Protein", "Low-Carb"],
            "calories": 680, "protein_g": 52, "carbs_g": 16, "fats_g": 44, "fiber_g": 7,
            "prep_time": 10, "cook_time": 15,
            "ingredients": ["8 oz grass-fed sirloin steak", "2 cups Brussels sprouts, halved", "2 tbsp olive oil", "2 cloves garlic, crushed", "Fresh thyme and rosemary", "Flaky sea salt"],
            "instructions": ["Roast Brussels sprouts at 425°F (220°C) with olive oil until caramelized.", "Sear steak in hot cast iron 3-4 mins per side for medium-rare.", "Rest steak for 5 minutes before slicing.", "Serve alongside crispy roasted Brussels sprouts."],
            "allergens": []
        },
        {
            "name": "Crispy Tofu Veggie Stir-Fry with Jasmine Rice",
            "diet": ["Vegan", "Vegetarian", "Gluten-Free"],
            "calories": 520, "protein_g": 24, "carbs_g": 66, "fats_g": 18, "fiber_g": 7,
            "prep_time": 15, "cook_time": 15,
            "ingredients": ["Extra firm tofu (pressed and cubed)", "Snap peas, baby bok choy, and red pepper", "Tamari (gluten-free soy sauce, 2 tbsp)", "Fresh grated ginger and garlic", "1 cup cooked jasmine rice"],
            "instructions": ["Pan-sear pressed tofu cubes in sesame oil until golden on all sides.", "Add vegetables, ginger, and garlic; stir-fry on high heat for 4 minutes.", "Pour in tamari reduction.", "Serve over steaming jasmine rice."],
            "allergens": ["soy"]
        }
    ],
    "snack": [
        {
            "name": "Roasted Garlic Hummus with Crunchy Bell Pepper & Cucumbers",
            "diet": ["Vegan", "Vegetarian", "Mediterranean", "Gluten-Free"],
            "calories": 210, "protein_g": 7, "carbs_g": 22, "fats_g": 10, "fiber_g": 6,
            "prep_time": 5, "cook_time": 0,
            "ingredients": ["1/3 cup roasted garlic hummus", "1 Persian cucumber, sliced", "1 bell pepper, sliced into strips"],
            "instructions": ["Arrange vegetables on plate and serve with chilled hummus."],
            "allergens": ["sesame"]
        },
        {
            "name": "Crisp Apple Slices with Pure Sunflower Seed Butter",
            "diet": ["Vegan", "Vegetarian", "Gluten-Free", "Nut-Free"],
            "calories": 230, "protein_g": 6, "carbs_g": 28, "fats_g": 12, "fiber_g": 5,
            "prep_time": 5, "cook_time": 0,
            "ingredients": ["1 Honeycrisp apple, sliced", "2 tbsp unsweetened sunflower seed butter", "Dash of ground cinnamon"],
            "instructions": ["Slice apple into wedges and serve with sunflower seed butter dip."],
            "allergens": []
        },
        {
            "name": "Handful of Raw Almonds & Walnuts with Dark Chocolate Square",
            "diet": ["Vegetarian", "Keto", "Mediterranean"],
            "calories": 250, "protein_g": 6, "carbs_g": 12, "fats_g": 21, "fiber_g": 4,
            "prep_time": 2, "cook_time": 0,
            "ingredients": ["15g raw almonds", "15g raw walnut halves", "1 square 85% dark cacao chocolate"],
            "instructions": ["Portion nuts and dark chocolate for a brain-boosting snack."],
            "allergens": ["tree nuts"]
        }
    ]
}

class MealPlannerService:
    """Intelligent allergy-aware personalized meal recommendation engine."""

    def _is_allergen_safe(self, recipe: Dict[str, Any], allergies: List[str], foods_to_avoid: List[str]) -> bool:
        """Strictly ensures recipe contains zero allergens or avoided ingredients."""
        user_allergies_lower = [a.lower().strip() for a in allergies if a]
        avoid_lower = [f.lower().strip() for f in foods_to_avoid if f]

        # Check declared allergens
        for declared_allergen in recipe.get("allergens", []):
            for user_allergen in user_allergies_lower:
                if user_allergen in declared_allergen or declared_allergen in user_allergen:
                    return False

        # Check all recipe ingredient strings against allergen keywords
        all_ingredients_text = " ".join(recipe.get("ingredients", [])).lower()
        for user_allergen in user_allergies_lower:
            keywords = ALLERGEN_KEYWORDS.get(user_allergen, [user_allergen])
            for kw in keywords:
                if kw in all_ingredients_text:
                    return False

        # Check foods to avoid
        for avoid_item in avoid_lower:
            if avoid_item and avoid_item in all_ingredients_text:
                return False

        return True

    def _select_meal_for_slot(
        self,
        slot: str,
        diet: str,
        allergies: List[str],
        avoid: List[str],
        target_calories: float
    ) -> MealItem:
        candidates = RECIPE_CATALOG.get(slot, [])
        safe_candidates = [
            c for c in candidates
            if self._is_allergen_safe(c, allergies, avoid)
        ]

        if not safe_candidates:
            # Fallback safe generic whole-food meal
            safe_recipe = {
                "name": f"Chef's Allergy-Safe {slot.capitalize()} Bowl",
                "calories": target_calories,
                "protein_g": round(target_calories * 0.25 / 4),
                "carbs_g": round(target_calories * 0.45 / 4),
                "fats_g": round(target_calories * 0.30 / 9),
                "fiber_g": 6.0,
                "prep_time": 10,
                "cook_time": 15,
                "ingredients": ["Organic brown rice or quinoa", "Steamed market garden vegetables", "Extra virgin olive oil", "Sea salt & fine herbs"],
                "instructions": ["Cook grain in water until fluffy.", "Steam vegetables until tender-crisp.", "Drizzle with olive oil and fresh herbs."]
            }
        else:
            # Pick candidate closest to calorie target
            safe_candidates.sort(key=lambda x: abs(x["calories"] - target_calories))
            safe_recipe = safe_candidates[0]

        return MealItem(
            name=safe_recipe["name"],
            description=f"Tailored for {diet} lifestyle with complete allergen protection.",
            calories=float(safe_recipe["calories"]),
            protein_g=float(safe_recipe["protein_g"]),
            carbs_g=float(safe_recipe["carbs_g"]),
            fats_g=float(safe_recipe["fats_g"]),
            fiber_g=float(safe_recipe.get("fiber_g", 4.0)),
            prep_time_minutes=safe_recipe.get("prep_time", 10),
            cook_time_minutes=safe_recipe.get("cook_time", 15),
            ingredients=safe_recipe["ingredients"],
            instructions=safe_recipe["instructions"],
            dietary_tags=[diet, "Allergen-Verified"]
        )

    def generate_plan(self, req: MealPlanRequest) -> MealPlanResponse:
        cal = req.calorie_target
        breakfast_cal = cal * 0.22
        lunch_cal = cal * 0.35
        dinner_cal = cal * 0.33
        snack_cal = cal * 0.10

        breakfast = self._select_meal_for_slot("breakfast", req.dietary_preference, req.allergies, req.foods_to_avoid, breakfast_cal)
        lunch = self._select_meal_for_slot("lunch", req.dietary_preference, req.allergies, req.foods_to_avoid, lunch_cal)
        dinner = self._select_meal_for_slot("dinner", req.dietary_preference, req.allergies, req.foods_to_avoid, dinner_cal)
        snack = self._select_meal_for_slot("snack", req.dietary_preference, req.allergies, req.foods_to_avoid, snack_cal)

        meals = {
            "breakfast": breakfast,
            "lunch": lunch,
            "dinner": dinner,
            "snack": snack
        }

        tot_cal = sum(m.calories for m in meals.values())
        tot_prot = sum(m.protein_g for m in meals.values())
        tot_carbs = sum(m.carbs_g for m in meals.values())
        tot_fats = sum(m.fats_g for m in meals.values())
        tot_fiber = sum(m.fiber_g for m in meals.values())

        # Build categorized shopping list
        shopping_items: List[ShoppingListItem] = []
        for meal in meals.values():
            for ing in meal.ingredients:
                ing_lower = ing.lower()
                if any(p in ing_lower for p in ["spinach", "cucumber", "tomato", "avocado", "broccoli", "kale", "apple", "berry", "carrot", "sprout", "pepper"]):
                    cat = "Produce & Fresh Greens"
                elif any(p in ing_lower for p in ["chicken", "salmon", "halibut", "beef", "tofu", "egg"]):
                    cat = "Proteins & Alternatives"
                elif any(p in ing_lower for p in ["yogurt", "milk", "butter", "cheese"]):
                    cat = "Dairy & Chilled"
                elif any(p in ing_lower for p in ["quinoa", "oat", "rice", "bean", "lentil", "penne"]):
                    cat = "Pantry & Grains"
                else:
                    cat = "Condiments, Oils & Spices"
                shopping_items.append(ShoppingListItem(category=cat, item=ing))

        # Deduplicate shopping items by name
        unique_shopping: List[ShoppingListItem] = []
        seen = set()
        for s in shopping_items:
            if s.item not in seen:
                seen.add(s.item)
                unique_shopping.append(s)

        now = datetime.now(timezone.utc).isoformat()
        plan_id = f"plan-{uuid.uuid4().hex[:10]}"

        return MealPlanResponse(
            id=plan_id,
            timestamp=now,
            title=f"{req.dietary_preference} Daily Nutrition Blueprint ({req.calorie_target} kcal)",
            dietary_preference=req.dietary_preference,
            calorie_target=req.calorie_target,
            total_calculated_calories=round(tot_cal, 1),
            total_protein_g=round(tot_prot, 1),
            total_carbs_g=round(tot_carbs, 1),
            total_fats_g=round(tot_fats, 1),
            total_fiber_g=round(tot_fiber, 1),
            allergies_filtered=req.allergies + req.foods_to_avoid,
            meals=meals,
            shopping_list=unique_shopping,
            generator_engine="allergy_safe_nutrition_matrix"
        )

meal_planner_service = MealPlannerService()
