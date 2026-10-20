"use client";

import React from "react";
import {
  Sparkles,
  Camera,
  Leaf,
  ShieldCheck,
  CalendarCheck2,
  ChefHat,
  ArrowRight,
  CheckCircle,
  Activity,
  Flame,
  Award,
} from "lucide-react";

interface LandingHeroProps {
  setActiveTab: (tab: string) => void;
  stats?: any;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ setActiveTab, stats }) => {
  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-linear-to-b from-white via-[#FCFAF6] to-[#F7F3EA] p-8 md:p-14 shadow-sm">
        <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-amber-100/40 blur-3xl" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-800">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Next-Generation Multimodal Food Intelligence Agent</span>
          </div>

          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl md:text-6xl">
            Smarter Food Choices. <br />
            <span className="text-emerald-700">Safer Meals.</span> Healthier Living.
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-stone-600">
            Food Verse AI unifies multimodal computer vision, optical freshness analysis, commercial kitchen hygiene auditing, strict allergy-safe meal planning, and an intelligent culinary assistant into one comprehensive platform.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => setActiveTab("food")}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-3.5 text-base font-semibold text-white shadow-md transition-all hover:bg-emerald-800 hover:shadow-lg"
            >
              <Camera className="h-5 w-5" />
              <span>Analyze Food Photo</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => setActiveTab("dashboard")}
              className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-6 py-3.5 text-base font-semibold text-stone-700 shadow-xs transition-all hover:bg-stone-50"
            >
              <span>Explore Dashboard</span>
            </button>
          </div>

          {/* Quick value badges */}
          <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-stone-200/60 pt-6 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span>Multispectral Optical Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span>Zero-Allergen Risk Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span>FastAPI & PyMongo Resilient Core</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            Five Intelligent Multimodal Pillars
          </h2>
          <p className="mt-2 text-stone-500">
            Engineered for home cooks, certified nutritionists, and food service professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <div
            onClick={() => setActiveTab("food")}
            className="group cursor-pointer rounded-2xl border border-stone-200 bg-white p-6 shadow-xs transition-all hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Camera className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-stone-900 group-hover:text-emerald-700 transition-colors">
              Food Recognition & Nutrition
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              Upload photos of any meal. Computer vision identifies food items, calculates serving size, and extracts macronutrient & micronutrient profiles.
            </p>
            <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
              <span>Try Food Scan</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => setActiveTab("freshness")}
            className="group cursor-pointer rounded-2xl border border-stone-200 bg-white p-6 shadow-xs transition-all hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700 ring-1 ring-amber-600/20 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Leaf className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-stone-900 group-hover:text-amber-700 transition-colors">
              Freshness & Spoilage Detection
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              Evaluates surface discoloration, epidermal turgor, and cellular breakdown. Receives shelf-life estimates and scientifically backed storage advice.
            </p>
            <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
              <span>Inspect Produce</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => setActiveTab("hygiene")}
            className="group cursor-pointer rounded-2xl border border-stone-200 bg-white p-6 shadow-xs transition-all hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-600/20 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-stone-900 group-hover:text-blue-700 transition-colors">
              Kitchen & Restaurant Hygiene
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              Audit prep counters via still photos or uploaded video with frame sampling. Interactive sanitation checklists and compliance grades.
            </p>
            <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-700">
              <span>Run Sanitation Audit</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 4 */}
          <div
            onClick={() => setActiveTab("meals")}
            className="group cursor-pointer rounded-2xl border border-stone-200 bg-white p-6 shadow-xs transition-all hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <CalendarCheck2 className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-stone-900 group-hover:text-emerald-700 transition-colors">
              Allergy-Safe Meal Planner
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              Personalized plans matching calorie targets and strict dietary styles (Vegan, Keto, Mediterranean) with complete allergen cross-check.
            </p>
            <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
              <span>Generate Meal Plan</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 5 */}
          <div
            onClick={() => setActiveTab("assistant")}
            className="group cursor-pointer rounded-2xl border border-stone-200 bg-white p-6 shadow-xs transition-all hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-700 ring-1 ring-orange-600/20 group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <ChefHat className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-stone-900 group-hover:text-orange-700 transition-colors">
              AI Cooking Assistant
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              Conversational culinary adviser powered by LLM or expert chef rules. Instant ingredient substitutions, storage hacks, and recipe ideas.
            </p>
            <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-orange-700">
              <span>Ask Chef Verse</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 6: Dashboard & Audit Hub */}
          <div
            onClick={() => setActiveTab("dashboard")}
            className="group cursor-pointer rounded-2xl border border-stone-200 bg-white p-6 shadow-xs transition-all hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-700 ring-1 ring-purple-600/20 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Activity className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-stone-900 group-hover:text-purple-700 transition-colors">
              Unified Dashboard & Analytics
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              Comprehensive analytics tracking calorie averages, freshness scores, hygiene compliance logs, and saved favorites.
            </p>
            <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-purple-700">
              <span>View Analytics</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Teaser Banner */}
      <section className="rounded-3xl border border-stone-200 bg-white p-6 md:p-8 shadow-xs">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Live Architecture Status
            </span>
            <h3 className="text-xl font-bold text-stone-900">
              Active Multimodal Intelligence Network
            </h3>
            <p className="mt-1 text-sm text-stone-500">
              Continuous computer vision processing and persistent data storage.
            </p>
          </div>
          <button
            onClick={() => setActiveTab("dashboard")}
            className="rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-stone-800"
          >
            Launch Full Dashboard
          </button>
        </div>

        {/* Quick KPI stats row */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-stone-100 bg-[#FBF9F4] p-4 text-center">
            <div className="text-2xl font-bold text-emerald-700">
              {stats?.total_food_scans || 12}+
            </div>
            <div className="mt-1 text-xs text-stone-500">Food Analyses Logged</div>
          </div>
          <div className="rounded-xl border border-stone-100 bg-[#FBF9F4] p-4 text-center">
            <div className="text-2xl font-bold text-emerald-700">
              {stats?.average_freshness_score || 92.5}%
            </div>
            <div className="mt-1 text-xs text-stone-500">Avg Freshness Index</div>
          </div>
          <div className="rounded-xl border border-stone-100 bg-[#FBF9F4] p-4 text-center">
            <div className="text-2xl font-bold text-emerald-700">Grade A</div>
            <div className="mt-1 text-xs text-stone-500">Kitchen Hygiene Rating</div>
          </div>
          <div className="rounded-xl border border-stone-100 bg-[#FBF9F4] p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">100%</div>
            <div className="mt-1 text-xs text-stone-500">Allergy Filter Accuracy</div>
          </div>
        </div>
      </section>
    </div>
  );
};
