import uuid
import logging
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
import httpx

from backend.app.core.config import settings
from backend.app.schemas.assistant import (
    AssistantChatRequest,
    AssistantChatResponse,
    SubstitutionItem,
)

logger = logging.getLogger("food_verse.assistant")

# Culinary Knowledge Base for Substitutions and Storage
COMMON_SUBSTITUTIONS: Dict[str, SubstitutionItem] = {
    "buttermilk": SubstitutionItem(
        original="1 cup Buttermilk",
        substitute="1 cup Whole Milk + 1 tbsp Lemon Juice or White Vinegar",
        ratio="1:1 equivalent volume",
        culinary_notes="Let stand for 5-10 minutes until slightly curdled. Perfect for pancakes, biscuits, and marinades."
    ),
    "egg": SubstitutionItem(
        original="1 large Egg (in baking)",
        substitute="1 tbsp ground flaxseed + 3 tbsp warm water (Flax Egg) OR 1/4 cup unsweetened applesauce",
        ratio="1 flax egg per whole chicken egg",
        culinary_notes="Whisk flaxseed and water; rest 5 mins until gelatinous. Excellent for muffins, quick breads, and brownies."
    ),
    "heavy cream": SubstitutionItem(
        original="1 cup Heavy Cream",
        substitute="3/4 cup Whole Milk + 1/3 cup melted unsalted Butter OR full-fat Coconut Cream",
        ratio="1:1 equivalent volume",
        culinary_notes="Coconut cream works best for dairy-free sauces and soups. Milk+butter blend does not whip stiff for piping."
    ),
    "soy sauce": SubstitutionItem(
        original="1 tbsp Traditional Soy Sauce",
        substitute="1 tbsp Coconut Aminos OR Tamari (Gluten-Free)",
        ratio="1:1 ratio (add pinch of salt if using coconut aminos)",
        culinary_notes="Coconut aminos is slightly sweeter and 65% lower in sodium. Tamari is 100% gluten-free and deeply savory."
    ),
    "cornstarch": SubstitutionItem(
        original="1 tbsp Cornstarch (thickener)",
        substitute="2 tbsp All-Purpose Flour OR 1 tbsp Arrowroot Powder / Tapioca Starch",
        ratio="2:1 for flour; 1:1 for arrowroot",
        culinary_notes="Make a cold slurry first to prevent clumping. Arrowroot creates a glossy clear finish ideal for acidic sauces."
    ),
    "sour cream": SubstitutionItem(
        original="1 cup Sour Cream",
        substitute="1 cup Plain Whole Milk Greek Yogurt",
        ratio="1:1 replacement",
        culinary_notes="Provides identical tangy acidity with twice the protein and significantly less saturated fat."
    ),
    "brown sugar": SubstitutionItem(
        original="1 cup Packed Brown Sugar",
        substitute="1 cup Granulated White Sugar + 1 tbsp Blackstrap Molasses",
        ratio="1:1 blend",
        culinary_notes="Mix thoroughly with a fork until moist and uniform. Replicates moisture and deep caramel notes."
    )
}

STORAGE_GUIDANCE: Dict[str, str] = {
    "basil": "Store like fresh flowers: trim stems and place in a jar of water at room temperature. DO NOT refrigerate, as cold air turns leaves black.",
    "cilantro": "Trim stem bottoms, submerge roots in a mason jar of water, cover loosely with a reusable produce bag, and store in the refrigerator door.",
    "mushrooms": "Keep unwashed in their original paper bag or wrap loosely in dry paper towels. Never store in sealed plastic, which traps moisture and induces slimy decay.",
    "avocado": "Leave unripened avocados at room temp on counter. Once ripe and yielding to gentle pressure, transfer to refrigerator to pause ripening for 3-5 days.",
    "onions": "Store in a cool, dark, well-ventilated dry pantry away from potatoes. Potatoes release ethylene gas and moisture which cause onions to sprout rapidly.",
    "garlic": "Store whole unpeeled bulbs in a wire basket or terra-cotta garlic keeper with airflow at 60-65°F. Do not freeze or refrigerate whole bulbs."
}

class CookingAssistantService:
    """Conversational culinary assistant with pluggable LLM and rule-based expert system."""

    async def _call_gemini_api(self, prompt: str) -> Optional[str]:
        if not settings.GEMINI_API_KEY:
            return None
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={settings.GEMINI_API_KEY}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0.4, "maxOutputTokens": 800}
        }
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(url, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    candidates = data.get("candidates", [])
                    if candidates and "content" in candidates[0]:
                        parts = candidates[0]["content"].get("parts", [])
                        if parts:
                            return parts[0].get("text", "")
        except Exception as e:
            logger.warning(f"Gemini API request failed: {e}")
        return None

    def _expert_rule_response(self, req: AssistantChatRequest) -> AssistantChatResponse:
        """Intelligent culinary expert system when no external LLM is configured."""
        msg = req.message.lower().strip()
        matched_substitutions: List[SubstitutionItem] = []
        storage_tips: List[str] = []
        suggested_recipes: List[Dict[str, Any]] = []

        # Check for substitution queries
        for key, sub in COMMON_SUBSTITUTIONS.items():
            if key in msg or ("substitute" in msg and key in msg):
                matched_substitutions.append(sub)

        # Check for storage queries
        for key, tip in STORAGE_GUIDANCE.items():
            if key in msg or ("store" in msg and key in msg):
                storage_tips.append(f"Storage tip for {key.capitalize()}: {tip}")

        # Check for recipe generation from ingredients
        if req.ingredients or any(w in msg for w in ["recipe", "make with", "cook with", "what can i make"]):
            user_ings = req.ingredients if req.ingredients else [w.strip() for w in msg.replace("make with", "").replace("what can i make", "").split(",") if len(w.strip()) > 2]
            suggested_recipes.append({
                "title": "Chef's Artisanal Skillet Medley",
                "cook_time": "20 mins",
                "ingredients": user_ings if user_ings else ["Olive oil", "Garlic", "Sea salt", "Fresh garden vegetables", "Choice protein"],
                "steps": [
                    "Preheat a heavy stainless steel or cast iron skillet over medium heat.",
                    "Add 1 tbsp high-smoke-point oil (avocado or olive oil) and aromatic garlic/herbs.",
                    "Sauté hearty vegetables and proteins first, searing for deep Maillard browning.",
                    "Deglaze pan with a splash of broth or wine, reduce heat, and finish with fresh acid (lemon juice)."
                ]
            })

        # Craft helpful, structured culinary reply
        lines = []
        if matched_substitutions:
            lines.append("### Recommended Ingredient Substitutions:")
            for sub in matched_substitutions:
                lines.append(f"- **{sub.original}** ➔ **{sub.substitute}** ({sub.ratio})")
                lines.append(f"  *Chef's Note:* {sub.culinary_notes}")
            lines.append("")

        if storage_tips:
            lines.append("### Proper Food Preservation & Storage:")
            for t in storage_tips:
                lines.append(f"- {t}")
            lines.append("")

        if suggested_recipes:
            lines.append("### Recipe Suggestion Based on Your Ingredients:")
            r = suggested_recipes[0]
            lines.append(f"**{r['title']}** (Ready in {r['cook_time']})")
            lines.append("Instructions:")
            for i, step in enumerate(r["steps"], 1):
                lines.append(f"{i}. {step}")
            lines.append("")

        if not lines:
            # General culinary guidance
            lines.append(
                f"Chef Food Verse at your service! Regarding: *\"{req.message}\"*.\n\n"
                "Here are key culinary recommendations for peak flavor and food safety:\n"
                "1. **Season in Layers**: Salt early during cooking to draw out natural sweetness and penetrate cellular structures, then finish with fresh acid (lemon, vinegar) to brighten.\n"
                "2. **Pan Temperature Control**: Always heat your pan before adding fat, and let oil shimmer before adding ingredients to prevent sticking and achieve a crisp sear.\n"
                "3. **Food Safety & Resting**: Allow cooked meats to rest 5-10 minutes to redistribute internal juices. Always keep cold foods below 40°F (4°C) and hot foods above 140°F (60°C)."
            )

        reply_text = "\n".join(lines)
        now = datetime.now(timezone.utc).isoformat()

        return AssistantChatResponse(
            id=f"chat-{uuid.uuid4().hex[:10]}",
            reply=reply_text,
            suggested_recipes=suggested_recipes,
            substitutions=matched_substitutions,
            storage_tips=storage_tips,
            provider_used="rule_based_culinary_system",
            is_fallback=True
        )

    async def chat(self, req: AssistantChatRequest) -> AssistantChatResponse:
        # Check if Gemini or external LLM is configured
        if settings.LLM_PROVIDER == "gemini" and settings.GEMINI_API_KEY:
            prompt = (
                f"You are Food Verse AI, an expert professional chef and food scientist. "
                f"Provide helpful, precise culinary guidance, substitutions, step-by-step instructions, "
                f"and food safety facts for this user inquiry: {req.message}"
            )
            llm_text = await self._call_gemini_api(prompt)
            if llm_text:
                return AssistantChatResponse(
                    id=f"chat-{uuid.uuid4().hex[:10]}",
                    reply=llm_text,
                    suggested_recipes=[],
                    substitutions=[],
                    storage_tips=[],
                    provider_used="gemini-1.5-flash",
                    is_fallback=False
                )

        # Fallback to rich expert rule system
        return self._expert_rule_response(req)

cooking_assistant_service = CookingAssistantService()
