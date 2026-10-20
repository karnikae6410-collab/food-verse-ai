"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { LandingHero } from "@/components/LandingHero";
import { DashboardView } from "@/components/DashboardView";
import { FoodRecognitionView } from "@/components/FoodRecognitionView";
import { FreshnessView } from "@/components/FreshnessView";
import { HygieneView } from "@/components/HygieneView";
import { MealPlannerView } from "@/components/MealPlannerView";
import { AssistantView } from "@/components/AssistantView";
import { HistoryView } from "@/components/HistoryView";
import { SettingsView } from "@/components/SettingsView";
import { api } from "@/services/api";
import { Utensils, Heart, Shield } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("landing");
  const [backendHealthy, setBackendHealthy] = useState<boolean | null>(null);
  const [dbMode, setDbMode] = useState<string>("demo_in_memory");
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    async function checkHealth() {
      try {
        const health = await api.getHealth();
        setBackendHealthy(health.status === "healthy");
        setDbMode(health.database_mode);
      } catch {
        setBackendHealthy(false);
        setDbMode("demo_in_memory");
      }
    }

    async function loadStats() {
      try {
        const s = await api.getStats();
        setStats(s);
      } catch {
        // Fallback default statistics for demo
        setStats({
          total_food_scans: 14,
          total_freshness_checks: 9,
          total_hygiene_audits: 6,
          total_meal_plans: 3,
          total_saved_recipes: 4,
          average_freshness_score: 91.2,
          average_hygiene_score: 88.5,
        });
      }
    }

    checkHealth();
    loadStats();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#FDFBF7]">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendHealthy={backendHealthy}
        dbMode={dbMode}
      />

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} stats={stats} />

        {/* Main Content Area */}
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            {activeTab === "landing" && (
              <LandingHero setActiveTab={setActiveTab} stats={stats} />
            )}

            {activeTab === "dashboard" && (
              <DashboardView setActiveTab={setActiveTab} />
            )}

            {activeTab === "food" && <FoodRecognitionView />}

            {activeTab === "freshness" && <FreshnessView />}

            {activeTab === "hygiene" && <HygieneView />}

            {activeTab === "meals" && <MealPlannerView />}

            {activeTab === "assistant" && <AssistantView />}

            {activeTab === "history" && <HistoryView />}

            {activeTab === "settings" && <SettingsView />}
          </div>
        </main>
      </div>

      {/* Global Footer */}
      <footer className="border-t border-stone-200 bg-white/80 py-8 text-xs text-stone-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-700 text-white">
              <Utensils className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold text-stone-800">Food Verse AI</span>
            <span>– Smarter Food Choices. Safer Meals. Healthier Living.</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <button
              onClick={() => setActiveTab("food")}
              className="hover:text-emerald-700 transition-colors"
            >
              Food Scanner
            </button>
            <button
              onClick={() => setActiveTab("freshness")}
              className="hover:text-emerald-700 transition-colors"
            >
              Freshness Check
            </button>
            <button
              onClick={() => setActiveTab("hygiene")}
              className="hover:text-emerald-700 transition-colors"
            >
              Kitchen Hygiene
            </button>
            <button
              onClick={() => setActiveTab("meals")}
              className="hover:text-emerald-700 transition-colors"
            >
              Meal Planner
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className="hover:text-emerald-700 transition-colors"
            >
              System Status
            </button>
          </div>

          <div className="text-[11px] text-stone-400">
            © 2026 Food Verse AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
