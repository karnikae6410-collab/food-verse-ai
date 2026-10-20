import {
  HealthStatus,
  DashboardStats,
  FoodAnalysisResponse,
  FreshnessAnalysisResponse,
  KitchenHygieneResponse,
  MealPlanRequest,
  MealPlanResponse,
  AssistantChatRequest,
  AssistantChatResponse,
  RecipeItem,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      let errorDetail = `Request failed with status ${res.status}`;
      try {
        const errorJson = await res.json();
        if (errorJson.detail) {
          errorDetail = typeof errorJson.detail === "string" ? errorJson.detail : JSON.stringify(errorJson.detail);
        }
      } catch {
        // ignore
      }
      throw new Error(errorDetail);
    }

    return (await res.json()) as T;
  } catch (err: any) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Health & Stats
  async getHealth(): Promise<HealthStatus> {
    return request<HealthStatus>("/api/health");
  },

  async getStats(): Promise<DashboardStats> {
    return request<DashboardStats>("/api/history/stats");
  },

  // Food Recognition & Nutrition
  async analyzeFood(file: File): Promise<FoodAnalysisResponse> {
    const formData = new FormData();
    formData.append("file", file);
    return request<FoodAnalysisResponse>("/api/food/analyze", {
      method: "POST",
      body: formData,
    });
  },

  // Freshness & Spoilage
  async analyzeFreshness(file: File): Promise<FreshnessAnalysisResponse> {
    const formData = new FormData();
    formData.append("file", file);
    return request<FreshnessAnalysisResponse>("/api/freshness/analyze", {
      method: "POST",
      body: formData,
    });
  },

  // Hygiene & Kitchen Monitoring
  async analyzeHygieneImage(file: File, facilityZone?: string): Promise<KitchenHygieneResponse> {
    const formData = new FormData();
    formData.append("file", file);
    if (facilityZone) {
      formData.append("facility_zone", facilityZone);
    }
    return request<KitchenHygieneResponse>("/api/hygiene/analyze", {
      method: "POST",
      body: formData,
    });
  },

  async analyzeHygieneVideo(file: File, facilityZone?: string): Promise<KitchenHygieneResponse> {
    const formData = new FormData();
    formData.append("file", file);
    if (facilityZone) {
      formData.append("facility_zone", facilityZone);
    }
    return request<KitchenHygieneResponse>("/api/hygiene/video-analyze", {
      method: "POST",
      body: formData,
    });
  },

  // Meal Planner
  async generateMealPlan(params: MealPlanRequest): Promise<MealPlanResponse> {
    return request<MealPlanResponse>("/api/meals/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
  },

  async getSavedMealPlans(): Promise<any[]> {
    return request<any[]>("/api/meals");
  },

  async saveMealPlan(plan: any): Promise<{ success: boolean; id: string }> {
    return request<{ success: boolean; id: string }>("/api/meals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(plan),
    });
  },

  // AI Cooking Assistant
  async chatAssistant(params: AssistantChatRequest): Promise<AssistantChatResponse> {
    return request<AssistantChatResponse>("/api/assistant/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
  },

  // Recipes
  async getRecipes(): Promise<RecipeItem[]> {
    return request<RecipeItem[]>("/api/recipes");
  },

  async saveRecipe(recipe: RecipeItem): Promise<{ success: boolean; id: string }> {
    return request<{ success: boolean; id: string }>("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recipe),
    });
  },

  async deleteRecipe(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/api/recipes/${id}`, {
      method: "DELETE",
    });
  },

  // Unified History
  async getHistory(category?: string): Promise<{ total: number; history: any[] }> {
    const query = category ? `?category=${category}` : "";
    return request<{ total: number; history: any[] }>(`/api/history${query}`);
  },
};
