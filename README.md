# Food Verse AI – Multimodal Food Intelligence Agent

> **"Smarter Food Choices. Safer Meals. Healthier Living."**

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=karnikae6410-collab/food-verse-ai)
[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/karnikae6410-collab/food-verse-ai)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/karnikae6410-collab/food-verse-ai)

---

## ⚡ Instant 1-Click Runnable & Executable Links

| Environment | 1-Click Runnable Link | Description |
|---|---|---|
| **Cloud Web Browser** | [🚀 Run in GitHub Codespaces](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=karnikae6410-collab/food-verse-ai) | Launches and executes the entire full-stack app directly in your browser with zero installation. |
| **Gitpod Cloud** | [☁️ Run on Gitpod](https://gitpod.io/#https://github.com/karnikae6410-collab/food-verse-ai) | Automated cloud sandbox executing FastAPI & Next.js. |
| **Local Windows** | Run [`run.bat`](./run.bat) | Double-click to launch backend, frontend, and open `http://localhost:3000` automatically. |
| **Demo Video Stream** | [🎬 Watch Demo Video](http://localhost:8000/demo-video) | Browser playable MP4 walkthrough of all modules. |

---

## 🥗 Core Modules Overview

### 1. Food Recognition & Nutrition Intelligence
- **Computer Vision Model**: Upload photos or select 1-click test samples (e.g. Grilled Atlantic Salmon, Greek Salad, Avocado Toast, Margherita Pizza).
- **Nutritional Profiles**: High-precision estimation of calories, protein, carbohydrates, healthy fats, fiber, sodium, potassium, and micronutrients.
- **Dynamic Visuals**: Recharts interactive macronutrient distribution donut and calorie breakdowns.
- **Allergen & Dietary Profiling**: Automatic labeling of dietary tags (Keto, Vegan, High-Protein) and allergen flags.

### 2. Optical Food Freshness & Spoilage Detection
- **Multispectral Surface Analysis**: Evaluates epidermal firmness/turgor, pigment vibrancy, blemish/darkening ratios, and cellular decay.
- **Freshness Gauge (0–100)**: Categorizes items into *Fresh (Optimal)*, *Consume Soon*, and *Spoilage Detected*.
- **Scientific Storage Protocols**: Preservation advice with optimal storage temperature and container types.
- **Mandatory Food Safety Notice**: Prominently informs users that visual optical inspections cannot detect odorless pathogens (salmonella, E. coli, botulinum toxins) and is not a definitive clinical safety guarantee.

### 3. Smart Kitchen & Restaurant Hygiene Monitoring
- **Dual Stream Analysis**: Supports high-res still image audits and video monitoring with temporal frame sampling.
- **Surface Cleanliness**: Detects counter grime, organic spills, clutter, and waste containment.
- **Interactive Manual Checklist**: Five-point food safety inspection protocol (handwashing, quat sanitizing strips, temperature logging, cross-contamination barriers, waste lid closure) with toggleable pass/fail states.
- **Inspection Grade**: Letter grades (Grade A, B, C) with corrective action steps.

### 4. Allergy-Safe Personalized Meal Planner
- **Strict Allergen Exclusion**: Filters ingredients across all major allergens (Peanuts, Tree Nuts, Dairy, Gluten, Eggs, Shellfish, Fish, Soy, Sesame) and custom exclusion terms.
- **Macro Target Matching**: Configurable daily calorie targets (1,200–3,800 kcal) with custom dietary preferences (Mediterranean, Keto, Vegan, Vegetarian, Omnivore).
- **Comprehensive Daily Blueprint**: Detailed breakfast, lunch, dinner, and snack routines with cook times and instructions.
- **Consolidated Grocery List**: Categorized shopping items with checklist and 1-click clipboard copy.

### 5. Conversational AI Cooking Assistant ("Chef Verse")
- **Dual-Engine Architecture**: Integrated with Google Gemini 1.5 Flash when `GEMINI_API_KEY` is provided, paired with a deterministic culinary expert rule engine fallback when offline.
- **Culinary Substitutions**: Exact substitution ratios (e.g., buttermilk, eggs, heavy cream, soy sauce) with chef notes.
- **Food Preservation Hacks**: Scientifically verified storage tips (e.g., fresh basil water-stem storage, avocado ripening delay).
- **Ingredient-Based Recipes**: Generates customized skillet and pan meals directly from available fridge ingredients.

### 6. Executive Dashboard, Unified History & Settings
- **Live Telemetry & KPIs**: Real-time scan metrics, average freshness ratings, and hygiene compliance tracking.
- **Recharts Analytics**: Weekly calorie/protein distribution bar charts and produce quality pie charts.
- **Unified Activity History**: Full-text searchable audit log combining food scans, produce tests, and kitchen inspections.
- **System Diagnostics**: Real-time verification of FastAPI endpoints, PyMongo/In-Memory database status, and LLM providers.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS v4, Lucide Icons, Recharts.
- **Backend**: Python 3.11+ / 3.13, FastAPI, Pydantic v2, Uvicorn, Pillow, NumPy, OpenCV.
- **Database**: MongoDB via PyMongo with zero-configuration in-memory demo store fallback when MongoDB is not running.
- **Testing**: Pytest & pytest-asyncio with 100% endpoint test coverage.

---

## 🚀 Quickstart Guide (Windows PowerShell)

### Prerequisites
- Node.js (v20+) and npm
- Python (v3.11+)
- Git

### 1. Clone & Setup Workspace
```powershell
cd d:\food-verse-ai
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```powershell
Copy-Item .env.example .env
```
*(The default configuration runs out of the box in resilient Demo Mode without requiring paid API keys or MongoDB!)*

### 3. Backend Setup & Run
Create the virtual environment, install dependencies, and start FastAPI:
```powershell
# Create virtual environment
python -m venv backend/venv

# Activate and install dependencies
backend\venv\Scripts\pip install -r backend/requirements.txt

# Run backend automated test suite
backend\venv\Scripts\pytest -v

# Start FastAPI server (runs on http://localhost:8000)
backend\venv\Scripts\python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 4. Frontend Setup & Run
In a second PowerShell terminal:
```powershell
cd d:\food-verse-ai\frontend

# Install frontend dependencies
npm install

# Start development server (or run production build)
npm run dev
# or for production:
npm run build
npm start
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 🧪 Testing & Verification

Run the full automated test suite anytime using pytest:
```powershell
backend\venv\Scripts\pytest -v
```
All 12 unit tests verify:
- `GET /api/health` — System status and database readiness.
- `POST /api/food/analyze` — Valid image processing & rejection of invalid MIME types.
- `POST /api/freshness/analyze` — Freshness scoring & food safety disclaimer checks.
- `POST /api/hygiene/analyze` & `video-analyze` — Cleanliness scores & frame sampling.
- `POST /api/meals/generate` — 100% strict allergen elimination logic.
- `POST /api/assistant/chat` — Culinary advice & ingredient substitution lookup.
- `GET /api/history` & `GET /api/history/stats` — Chronological history querying.
- `GET /api/recipes` & `POST /api/recipes` — Full CRUD recipe management.

---

## 🛡️ Food Safety & Medical Disclaimer

Food Verse AI provides mathematical nutrition estimates, computer vision surface evaluations, and general culinary suggestions for informational purposes only. Optical analysis cannot detect microscopic bacteria, foodborne pathogens, or internal contamination. Always adhere to local health department food safety guidelines and consult certified medical or dietetic professionals for clinical dietary advice.
