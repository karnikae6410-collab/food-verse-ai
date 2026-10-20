export interface Macronutrients {
  protein_g: number;
  carbs_g: number;
  fats_g: number;
  fiber_g: number;
}

export interface Micronutrients {
  sodium_mg?: number;
  potassium_mg?: number;
  calcium_mg?: number;
  iron_mg?: number;
  vitamin_c_mg?: number;
  vitamin_d_mcg?: number;
  cholesterol_mg?: number;
}

export interface FoodCandidate {
  name: string;
  confidence: number;
  category: string;
}

export interface FoodAnalysisResponse {
  id: string;
  timestamp: string;
  filename: string;
  food_name: string;
  confidence: number;
  category: string;
  serving_size: string;
  calories: number;
  macronutrients: Macronutrients;
  micronutrients: Micronutrients;
  top_candidates: FoodCandidate[];
  dietary_flags: string[];
  allergen_warnings: string[];
  health_insights: string;
  inference_mode: string;
  status_note: string;
}

export interface VisualIndicator {
  indicator: string;
  status: string;
  score: number;
  details: string;
}

export interface SpoilageSign {
  sign: string;
  severity: "Low" | "Moderate" | "High" | "Critical";
  description: string;
}

export interface FreshnessAnalysisResponse {
  id: string;
  timestamp: string;
  filename: string;
  item_name: string;
  category: string;
  freshness_score: number;
  status: string;
  confidence: number;
  estimated_shelf_life_days: number;
  visual_indicators: VisualIndicator[];
  spoilage_signs: SpoilageSign[];
  storage_recommendation: string;
  safety_disclaimer: string;
  inference_mode: string;
}

export interface ChecklistItem {
  id: string;
  category: string;
  item: string;
  passed: boolean;
  notes?: string;
}

export interface VisibleHygieneMetric {
  metric_name: string;
  score: number;
  status: string;
  observation: string;
}

export interface VideoFrameAnalysis {
  frame_number: number;
  timestamp_sec: number;
  score: number;
  flags: string[];
}

export interface KitchenHygieneResponse {
  id: string;
  timestamp: string;
  source_type: "image" | "video";
  filename: string;
  overall_hygiene_score: number;
  status: string;
  confidence: number;
  facility_zone: string;
  visible_metrics: VisibleHygieneMetric[];
  video_frames_sampled?: number;
  frame_analyses?: VideoFrameAnalysis[];
  manual_checklist: ChecklistItem[];
  actionable_recommendations: string[];
  compliance_disclaimer: string;
  inference_mode: string;
}

export interface MealItem {
  name: string;
  description: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fats_g: number;
  fiber_g: number;
  prep_time_minutes: number;
  cook_time_minutes: number;
  ingredients: string[];
  instructions: string[];
  dietary_tags: string[];
}

export interface ShoppingListItem {
  category: string;
  item: string;
  quantity?: string;
}

export interface MealPlanRequest {
  dietary_preference: string;
  allergies: string[];
  foods_to_avoid: string[];
  calorie_target: number;
  available_ingredients?: string[];
  budget_preference: string;
  cuisine_preference: string;
  meals_count?: number;
}

export interface MealPlanResponse {
  id: string;
  timestamp: string;
  title: string;
  dietary_preference: string;
  calorie_target: number;
  total_calculated_calories: number;
  total_protein_g: number;
  total_carbs_g: number;
  total_fats_g: number;
  total_fiber_g: number;
  allergies_filtered: string[];
  meals: {
    breakfast: MealItem;
    lunch: MealItem;
    dinner: MealItem;
    snack: MealItem;
    [key: string]: MealItem;
  };
  shopping_list: ShoppingListItem[];
  medical_disclaimer: string;
  generator_engine: string;
}

export interface SubstitutionItem {
  original: string;
  substitute: string;
  ratio: string;
  culinary_notes: string;
}

export interface AssistantChatRequest {
  message: string;
  conversation_history?: { role: string; content: string }[];
  mode?: string;
  ingredients?: string[];
  dietary_preference?: string;
  allergies?: string[];
}

export interface AssistantChatResponse {
  id: string;
  reply: string;
  suggested_recipes?: any[];
  substitutions?: SubstitutionItem[];
  storage_tips?: string[];
  provider_used: string;
  is_fallback: boolean;
}

export interface RecipeItem {
  id?: string;
  title: string;
  cuisine: string;
  prep_time_minutes: number;
  cook_time_minutes: number;
  servings: number;
  calories_per_serving: number;
  protein_g: number;
  carbs_g: number;
  fats_g: number;
  ingredients: string[];
  instructions: string[];
  substitutions?: { original: string; substitute: string }[];
  is_favorite?: boolean;
  timestamp?: string;
}

export interface HealthStatus {
  status: string;
  app_name: string;
  version: string;
  environment: string;
  database_connected: boolean;
  database_mode: string;
  llm_provider: string;
  vision_provider: string;
}

export interface DashboardStats {
  total_food_scans: number;
  total_freshness_checks: number;
  total_hygiene_audits: number;
  total_meal_plans: number;
  total_saved_recipes: number;
  average_freshness_score: number;
  average_hygiene_score: number;
  nutrition_summary: {
    avg_calories: number;
    avg_protein_g: number;
    avg_carbs_g: number;
    avg_fats_g: number;
  };
}
