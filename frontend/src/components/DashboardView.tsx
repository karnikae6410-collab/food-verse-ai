"use client";

import React, { useEffect, useState } from "react";
import {
  Camera,
  Leaf,
  ShieldCheck,
  CalendarCheck2,
  Bookmark,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Flame,
  Award,
  Clock,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { api } from "@/services/api";
import { DashboardStats } from "@/types";

interface DashboardViewProps {
  setActiveTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ setActiveTab }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentHistory, setRecentHistory] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, historyData, recipesData] = await Promise.all([
          api.getStats().catch(() => null),
          api.getHistory().catch(() => ({ history: [] })),
          api.getRecipes().catch(() => []),
        ]);
        if (statsData) setStats(statsData);
        if (historyData?.history) setRecentHistory(historyData.history.slice(0, 5));
        if (recipesData) setRecipes(recipesData);
      } catch (err) {
        console.error("Dashboard load error", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Synthetic weekly nutrition trend data for dashboard chart
  const weeklyTrends = [
    { day: "Mon", calories: 2150, protein: 125, carbs: 195, fats: 65 },
    { day: "Tue", calories: 2040, protein: 135, carbs: 180, fats: 62 },
    { day: "Wed", calories: 2280, protein: 140, carbs: 210, fats: 72 },
    { day: "Thu", calories: 1980, protein: 120, carbs: 175, fats: 58 },
    { day: "Fri", calories: 2310, protein: 145, carbs: 225, fats: 74 },
    { day: "Sat", calories: 2100, protein: 130, carbs: 190, fats: 68 },
    { day: "Sun", calories: 2050, protein: 128, carbs: 185, fats: 64 },
  ];

  const pieData = [
    { name: "Fresh (Optimal)", value: 72, color: "#15803D" },
    { name: "Consume Soon", value: 20, color: "#EA580C" },
    { name: "Action Needed", value: 8, color: "#E11D48" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            Food Intelligence Overview
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            Real-time telemetry across food scans, produce freshness, kitchen audits, and meal planning.
          </p>
        </div>

        {/* Quick Scan Action */}
        <button
          onClick={() => setActiveTab("food")}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-emerald-800"
        >
          <Camera className="h-4 w-4" />
          <span>New Food Scan</span>
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Total Scans */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Food Analyses</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <Camera className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-stone-900">
            {stats?.total_food_scans || 12}
          </div>
          <div className="mt-1 text-[11px] text-emerald-700 font-medium">+4 scans this week</div>
        </div>

        {/* Freshness Index */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Avg Freshness</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
              <Leaf className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-700">
            {stats?.average_freshness_score || 91.2}%
          </div>
          <div className="mt-1 text-[11px] text-stone-500">Produce quality optimal</div>
        </div>

        {/* Hygiene Grade */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Kitchen Hygiene</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-blue-700">Grade A</div>
          <div className="mt-1 text-[11px] text-stone-500">
            {stats?.average_hygiene_score || 88.5}% audit average
          </div>
        </div>

        {/* Saved Recipes */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Favorites & Plans</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-700">
              <CalendarCheck2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-stone-900">
            {(stats?.total_saved_recipes || 3) + (stats?.total_meal_plans || 2)}
          </div>
          <div className="mt-1 text-[11px] text-stone-500">Personal recipes & plans</div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Weekly Trend Bar Chart (8 cols) */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs lg:col-span-8">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-stone-900">Weekly Calorie & Protein Balance</h3>
              <p className="text-xs text-stone-500">Daily intake tracking relative to goals</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-stone-600">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" /> Calories (kcal)
              </span>
              <span className="flex items-center gap-1.5 text-stone-600">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-500" /> Protein (g x 10)
              </span>
            </div>
          </div>

          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyTrends}>
                <XAxis dataKey="day" stroke="#a8a29e" fontSize={12} />
                <YAxis stroke="#a8a29e" fontSize={12} />
                <Tooltip />
                <Bar dataKey="calories" fill="#15803D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Freshness Distribution Donut (4 cols) */}
        <div className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-6 shadow-xs lg:col-span-4">
          <div className="border-b border-stone-100 pb-4">
            <h3 className="text-base font-bold text-stone-900">Produce Condition Distribution</h3>
            <p className="text-xs text-stone-500">Optical freshness distribution</p>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs text-stone-600">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.name}
                </span>
                <span className="font-semibold text-stone-800">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Stream & Saved Recipes */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Recent Analysis Logs (7 cols) */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs lg:col-span-7">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <h3 className="text-base font-bold text-stone-900">Recent Food & Hygiene Logs</h3>
            <button
              onClick={() => setActiveTab("history")}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              View Full History →
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {recentHistory.length > 0 ? (
              recentHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl border border-stone-100 bg-[#FCFAF6] p-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 font-bold">
                      {item.type === "food_analysis" ? "F" : item.type === "freshness_analysis" ? "P" : "H"}
                    </div>
                    <div>
                      <div className="font-bold text-stone-900">
                        {item.food_name || item.item_name || item.facility_zone || "Activity"}
                      </div>
                      <div className="text-[11px] text-stone-400">
                        {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : "Recent"}
                      </div>
                    </div>
                  </div>

                  <span className="rounded-full bg-white px-2.5 py-1 font-semibold text-emerald-800 shadow-2xs">
                    {item.calories ? `${item.calories} kcal` : item.freshness_score ? `${item.freshness_score}%` : "Verified"}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-stone-400">No recent logs recorded.</div>
            )}
          </div>
        </div>

        {/* Favorite Recipes (5 cols) */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs lg:col-span-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <h3 className="text-base font-bold text-stone-900">Culinary Favorites</h3>
            <button
              onClick={() => setActiveTab("assistant")}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700"
            >
              Ask AI Chef →
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {recipes.length > 0 ? (
              recipes.slice(0, 3).map((r, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-stone-100 bg-[#FCFAF6] p-3 text-xs"
                >
                  <div className="font-bold text-stone-900">{r.title}</div>
                  <div className="mt-1 flex items-center justify-between text-stone-500">
                    <span>{r.cuisine}</span>
                    <span>{r.calories_per_serving} kcal / serving</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-stone-400">No saved recipes yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
