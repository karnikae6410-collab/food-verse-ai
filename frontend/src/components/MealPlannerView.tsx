"use client";

import React, { useState } from "react";
import {
  CalendarCheck2,
  Sparkles,
  ShieldCheck,
  Clock,
  ShoppingCart,
  Copy,
  BookmarkCheck,
  Check,
  AlertTriangle,
  RefreshCw,
  Plus,
  X,
  Flame,
} from "lucide-react";
import { api } from "@/services/api";
import { MealPlanResponse, MealPlanRequest } from "@/types";

export const MealPlannerView: React.FC = () => {
  const [diet, setDiet] = useState("Mediterranean");
  const [calorieTarget, setCalorieTarget] = useState(2100);
  const [allergies, setAllergies] = useState<string[]>(["Peanuts", "Shellfish"]);
  const [newAllergy, setNewAllergy] = useState("");
  const [budget, setBudget] = useState("Moderate");
  const [cuisine, setCuisine] = useState("Mediterranean");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<MealPlanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedShopping, setCopiedShopping] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const commonAllergens = [
    "Peanuts",
    "Tree nuts",
    "Dairy",
    "Gluten",
    "Eggs",
    "Shellfish",
    "Fish",
    "Soy",
    "Sesame",
  ];

  const toggleAllergen = (item: string) => {
    if (allergies.includes(item)) {
      setAllergies(allergies.filter((a) => a !== item));
    } else {
      setAllergies([...allergies, item]);
    }
  };

  const addCustomAllergy = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAllergy.trim() && !allergies.includes(newAllergy.trim())) {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy("");
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setSavedSuccess(false);
    try {
      const req: MealPlanRequest = {
        dietary_preference: diet,
        allergies: allergies,
        foods_to_avoid: [],
        calorie_target: calorieTarget,
        budget_preference: budget,
        cuisine_preference: cuisine,
        meals_count: 4,
      };
      const data = await api.generateMealPlan(req);
      setPlan(data);
    } catch (err: any) {
      setError(err.message || "Failed to generate personalized meal plan.");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = async () => {
    if (!plan) return;
    try {
      await api.saveMealPlan(plan);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert("Error saving meal plan: " + err.message);
    }
  };

  const handleCopyShoppingList = () => {
    if (!plan) return;
    const text = plan.shopping_list.map((s) => `[ ] ${s.item} (${s.category})`).join("\n");
    navigator.clipboard.writeText(text);
    setCopiedShopping(true);
    setTimeout(() => setCopiedShopping(false), 2500);
  };

  const toggleShopCheck = (item: string) => {
    setCheckedItems((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
          <CalendarCheck2 className="h-3.5 w-3.5 text-emerald-600" />
          <span>Module 4: Personalized Nutrition & Meal Planning</span>
        </div>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
          Allergy-Safe Personalized Meal Blueprint
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Tailored breakfast, lunch, dinner, and snack routines matching calorie targets with rigorous allergen avoidance protocols.
        </p>
      </div>

      {/* Main Grid: Preferences Form vs Generated Output */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Form (4 cols) */}
        <div className="space-y-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-xs lg:col-span-4">
          <h3 className="text-base font-bold text-stone-900">Dietary Preferences</h3>

          {/* Diet style */}
          <div>
            <label className="text-xs font-semibold text-stone-700">Dietary Style</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {["Mediterranean", "Omnivore", "Vegetarian", "Vegan", "Keto", "High-Protein"].map(
                (d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDiet(d)}
                    className={`rounded-xl border py-2 text-xs font-semibold transition-all ${
                      diet === d
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                        : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    {d}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Calorie Target Slider */}
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-700">Daily Calorie Target</span>
              <span className="font-bold text-emerald-700">{calorieTarget} kcal</span>
            </div>
            <input
              type="range"
              min={1200}
              max={3800}
              step={50}
              value={calorieTarget}
              onChange={(e) => setCalorieTarget(Number(e.target.value))}
              className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 accent-emerald-600"
            />
            <div className="mt-1 flex justify-between text-[10px] text-stone-400">
              <span>1200 kcal</span>
              <span>2500 kcal</span>
              <span>3800 kcal</span>
            </div>
          </div>

          {/* Strict Allergies Avoidance */}
          <div className="space-y-2 border-t border-stone-100 pt-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-800">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Strict Allergies & Exclusions</span>
            </div>
            <p className="text-[11px] text-stone-500">
              Ingredients containing these will be 100% eliminated.
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {commonAllergens.map((allergen) => {
                const isSelected = allergies.includes(allergen);
                return (
                  <button
                    key={allergen}
                    type="button"
                    onClick={() => toggleAllergen(allergen)}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-all ${
                      isSelected
                        ? "bg-rose-100 text-rose-800 ring-1 ring-rose-300 font-semibold"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {isSelected ? `✕ ${allergen}` : `+ ${allergen}`}
                  </button>
                );
              })}
            </div>

            {/* Custom avoid input */}
            <form onSubmit={addCustomAllergy} className="mt-2 flex gap-2">
              <input
                type="text"
                placeholder="Add custom food to avoid..."
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                className="flex-1 rounded-xl border border-stone-200 px-3 py-1.5 text-xs text-stone-900 focus:border-emerald-500 focus:outline-hidden"
              />
              <button
                type="submit"
                className="rounded-xl bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-200"
              >
                Add
              </button>
            </form>
          </div>

          {/* Budget & Cuisine */}
          <div className="grid grid-cols-2 gap-3 border-t border-stone-100 pt-4 text-xs">
            <div>
              <label className="font-semibold text-stone-700">Budget</label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-2.5 py-1.5 text-xs text-stone-800 focus:outline-hidden"
              >
                <option value="Budget">Budget-Friendly</option>
                <option value="Moderate">Moderate</option>
                <option value="Gourmet">Gourmet Organic</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-stone-700">Cuisine Focus</label>
              <select
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-2.5 py-1.5 text-xs text-stone-800 focus:outline-hidden"
              >
                <option value="Mediterranean">Mediterranean</option>
                <option value="Asian">Asian Fusion</option>
                <option value="Mexican">Fresh Mexican</option>
                <option value="American">Hearty American</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-emerald-800"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Validating Allergies & Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate Allergy-Safe Plan</span>
              </>
            )}
          </button>
        </div>

        {/* Right Output Area (8 cols) */}
        <div className="space-y-6 lg:col-span-8">
          {plan ? (
            <div className="space-y-6">
              {/* Plan Summary Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Allergen Filtering Verified</span>
                  </div>
                  <h3 className="mt-1.5 text-xl font-bold text-stone-900">{plan.title}</h3>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-stone-500">
                    <span>Target: {plan.calorie_target} kcal</span>
                    <span>•</span>
                    <span>Actual: {plan.total_calculated_calories} kcal</span>
                    <span>•</span>
                    <span>Protein: {plan.total_protein_g}g</span>
                    <span>•</span>
                    <span>Carbs: {plan.total_carbs_g}g</span>
                    <span>•</span>
                    <span>Fats: {plan.total_fats_g}g</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSavePlan}
                    className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-semibold text-stone-700 shadow-2xs hover:bg-stone-50"
                  >
                    {savedSuccess ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-600" />
                        <span className="text-emerald-700">Saved!</span>
                      </>
                    ) : (
                      <>
                        <BookmarkCheck className="h-4 w-4 text-emerald-600" />
                        <span>Save Plan</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="rounded-xl border border-stone-200 bg-[#FCFAF6] p-3 text-xs text-stone-500">
                <strong className="text-stone-700">MEDICAL DISCLAIMER:</strong> {plan.medical_disclaimer}
              </div>

              {/* 4 Meal Cards Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Object.entries(plan.meals).map(([slot, meal]) => (
                  <div
                    key={slot}
                    className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-5 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
                          {slot}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-medium text-stone-500">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{meal.prep_time_minutes + meal.cook_time_minutes}m</span>
                        </div>
                      </div>

                      <h4 className="mt-3 text-base font-bold text-stone-900">{meal.name}</h4>
                      <p className="mt-1 text-xs text-stone-500">{meal.description}</p>

                      {/* Macros row */}
                      <div className="mt-3 flex items-center gap-3 rounded-lg bg-[#FCFAF6] p-2 text-center text-xs">
                        <div className="flex-1">
                          <div className="font-bold text-stone-900">{meal.calories}</div>
                          <div className="text-[10px] text-stone-400">kcal</div>
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-emerald-700">{meal.protein_g}g</div>
                          <div className="text-[10px] text-stone-400">Protein</div>
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-orange-600">{meal.carbs_g}g</div>
                          <div className="text-[10px] text-stone-400">Carbs</div>
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-amber-600">{meal.fats_g}g</div>
                          <div className="text-[10px] text-stone-400">Fats</div>
                        </div>
                      </div>

                      {/* Ingredients */}
                      <div className="mt-3">
                        <div className="text-xs font-semibold text-stone-700">Key Ingredients:</div>
                        <ul className="mt-1 list-inside list-disc space-y-0.5 text-xs text-stone-600">
                          {meal.ingredients.slice(0, 4).map((ing, i) => (
                            <li key={i}>{ing}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="mt-4 border-t border-stone-100 pt-3 text-[11px] text-stone-600">
                      <strong>Method:</strong> {meal.instructions[0]}
                    </div>
                  </div>
                ))}
              </div>

              {/* Consolidated Shopping List */}
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-emerald-700" />
                    <h4 className="text-base font-bold text-stone-900">
                      Consolidated Grocery Shopping List
                    </h4>
                  </div>
                  <button
                    onClick={handleCopyShoppingList}
                    className="flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                  >
                    {copiedShopping ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy List</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {plan.shopping_list.map((item, idx) => {
                    const isChecked = !!checkedItems[item.item];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleShopCheck(item.item)}
                        className={`flex cursor-pointer items-center justify-between rounded-xl border p-2.5 text-xs transition-colors ${
                          isChecked
                            ? "border-emerald-200 bg-emerald-50/50 text-stone-400 line-through"
                            : "border-stone-100 bg-[#FCFAF6] text-stone-800 hover:bg-[#F8F5EE]"
                        }`}
                      >
                        <span className="font-medium">{item.item}</span>
                        <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] text-stone-500">
                          {item.category}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-96 flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white p-8 text-center text-stone-400">
              <CalendarCheck2 className="h-12 w-12 stroke-1 text-stone-300" />
              <h4 className="mt-3 text-sm font-semibold text-stone-600">
                Ready to Personalize Your Nutrition
              </h4>
              <p className="mt-1 max-w-sm text-xs text-stone-400">
                Configure your dietary preference, daily calories, and any allergies on the left, then click Generate to create a verified meal blueprint.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
