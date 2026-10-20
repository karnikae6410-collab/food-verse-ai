import io
import pytest
from fastapi.testclient import TestClient
from PIL import Image

from backend.app.main import app

client = TestClient(app)

def create_test_image(format="JPEG", color=(180, 220, 100), size=(100, 100)) -> bytes:
    img = Image.new("RGB", size, color=color)
    buf = io.BytesIO()
    img.save(buf, format=format)
    return buf.getvalue()

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["app_name"] == "Food Verse AI"
    assert "database_mode" in data

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["app"] == "Food Verse AI"
    assert "operational" in data["status"]

def test_food_analyze_valid_image():
    img_bytes = create_test_image(format="JPEG", color=(100, 200, 100))
    files = {"file": ("salmon_quinoa.jpg", img_bytes, "image/jpeg")}
    response = client.post("/api/food/analyze", files=files)
    assert response.status_code == 200
    data = response.json()
    assert "food_name" in data
    assert "calories" in data
    assert "macronutrients" in data
    assert data["macronutrients"]["protein_g"] > 0
    assert "micronutrients" in data
    assert len(data["top_candidates"]) > 0

def test_food_analyze_invalid_format():
    files = {"file": ("document.txt", b"This is plain text not an image", "text/plain")}
    response = client.post("/api/food/analyze", files=files)
    assert response.status_code == 400
    assert "Unsupported file type" in response.json()["detail"]

def test_freshness_analyze():
    img_bytes = create_test_image(format="JPEG", color=(220, 180, 60))
    files = {"file": ("fresh_apple.jpg", img_bytes, "image/jpeg")}
    response = client.post("/api/freshness/analyze", files=files)
    assert response.status_code == 200
    data = response.json()
    assert "freshness_score" in data
    assert data["freshness_score"] > 0
    assert "status" in data
    assert len(data["visual_indicators"]) > 0
    assert "safety_disclaimer" in data
    assert "CRITICAL FOOD SAFETY NOTICE" in data["safety_disclaimer"]

def test_hygiene_analyze():
    img_bytes = create_test_image(format="JPEG", color=(200, 200, 210))
    files = {"file": ("prep_station.jpg", img_bytes, "image/jpeg")}
    data = {"facility_zone": "Cold Prep & Assembly Line"}
    response = client.post("/api/hygiene/analyze", files=files, data=data)
    assert response.status_code == 200
    res_data = response.json()
    assert "overall_hygiene_score" in res_data
    assert "visible_metrics" in res_data
    assert "manual_checklist" in res_data
    assert len(res_data["manual_checklist"]) >= 4

def test_hygiene_video_analyze():
    video_bytes = b"FAKE_MP4_HEADER_VIDEO_STREAM"
    files = {"file": ("prep_line_monitoring.mp4", video_bytes, "video/mp4")}
    data = {"facility_zone": "Main Grill & Fryer Station"}
    response = client.post("/api/hygiene/video-analyze", files=files, data=data)
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["source_type"] == "video"
    assert res_data["video_frames_sampled"] > 0
    assert len(res_data["frame_analyses"]) > 0

def test_meal_planner_allergy_avoidance():
    # Request with severe peanut and shellfish allergy
    payload = {
        "dietary_preference": "Mediterranean",
        "allergies": ["Peanuts", "Shellfish"],
        "foods_to_avoid": ["Mushrooms"],
        "calorie_target": 2200,
        "budget_preference": "Moderate"
    }
    response = client.post("/api/meals/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["calorie_target"] == 2200
    assert "meals" in data
    assert "breakfast" in data["meals"]
    assert "lunch" in data["meals"]
    assert "dinner" in data["meals"]
    assert "snack" in data["meals"]

    # Ensure no peanut or shellfish in generated meal plans
    all_ingredients = []
    for slot, meal in data["meals"].items():
        all_ingredients.extend([i.lower() for i in meal["ingredients"]])
    
    assert not any("peanut" in ing for ing in all_ingredients)
    assert not any("shrimp" in ing or "crab" in ing or "shellfish" in ing for ing in all_ingredients)
    assert len(data["shopping_list"]) > 0

def test_assistant_chat_substitution():
    payload = {
        "message": "What can I substitute for buttermilk in pancakes?",
        "mode": "substitutions"
    }
    response = client.post("/api/assistant/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert "provider_used" in data
    assert len(data["substitutions"]) > 0
    assert "milk" in data["substitutions"][0]["substitute"].lower()

def test_assistant_chat_storage():
    payload = {
        "message": "How do I store fresh basil?",
        "mode": "storage"
    }
    response = client.post("/api/assistant/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert len(data["storage_tips"]) > 0

def test_history_and_stats():
    # History
    response = client.get("/api/history")
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert "history" in data
    assert len(data["history"]) > 0

    # Stats
    response_stats = client.get("/api/history/stats")
    assert response_stats.status_code == 200
    stats = response_stats.json()
    assert "total_food_scans" in stats
    assert "average_freshness_score" in stats

def test_recipes_crud():
    # Get initial recipes
    res = client.get("/api/recipes")
    assert res.status_code == 200
    recipes = res.json()
    assert len(recipes) > 0

    # Create new recipe
    new_recipe = {
        "title": "Avocado Citrus Summer Salad",
        "cuisine": "Californian",
        "prep_time_minutes": 10,
        "cook_time_minutes": 0,
        "servings": 2,
        "calories_per_serving": 240,
        "protein_g": 4,
        "carbs_g": 18,
        "fats_g": 18,
        "ingredients": ["1 Hass avocado", "1 blood orange", "Baby arugula", "Citrus vinaigrette"],
        "instructions": ["Slice avocado and blood orange.", "Arrange over arugula.", "Drizzle with vinaigrette."]
    }
    post_res = client.post("/api/recipes", json=new_recipe)
    assert post_res.status_code == 201
    recipe_id = post_res.json()["id"]

    # Delete recipe
    del_res = client.delete(f"/api/recipes/{recipe_id}")
    assert del_res.status_code == 200
