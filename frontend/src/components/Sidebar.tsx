"use client";

import React from "react";
import {
  LayoutDashboard,
  Camera,
  Leaf,
  ShieldAlert,
  CalendarCheck2,
  ChefHat,
  History,
  Settings,
  Sparkles,
  Home,
  CheckCircle2,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  stats?: any;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, stats }) => {
  const menuItems = [
    { id: "landing", label: "Home / Overview", icon: Home, badge: null },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: "Live" },
    {
      id: "food",
      label: "Food Recognition",
      icon: Camera,
      badge: stats?.total_food_scans ? `${stats.total_food_scans}` : null,
    },
    {
      id: "freshness",
      label: "Freshness & Spoilage",
      icon: Leaf,
      badge: stats?.average_freshness_score ? `${stats.average_freshness_score}%` : null,
    },
    {
      id: "hygiene",
      label: "Kitchen Hygiene",
      icon: ShieldAlert,
      badge: "Grade A",
    },
    {
      id: "meals",
      label: "Meal Planner",
      icon: CalendarCheck2,
      badge: "Allergy Safe",
    },
    {
      id: "assistant",
      label: "Cooking Assistant",
      icon: ChefHat,
      badge: "AI Chef",
    },
    {
      id: "history",
      label: "Analysis History",
      icon: History,
      badge: null,
    },
    {
      id: "settings",
      label: "Settings & Status",
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside className="hidden w-64 shrink-0 border-r border-stone-200 bg-white/70 py-6 md:block">
      <div className="flex h-full flex-col justify-between px-3">
        {/* Navigation list */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
            Navigation
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "text-stone-700 hover:bg-stone-100/80 hover:text-stone-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                      isActive ? "text-white" : "text-stone-500"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      isActive
                        ? "bg-emerald-800 text-emerald-100"
                        : "bg-stone-100 text-stone-600 group-hover:bg-stone-200"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom System Banner */}
        <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3.5 text-xs">
          <div className="flex items-center gap-2 font-semibold text-emerald-900">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Multimodal Pipeline</span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-emerald-700">
            Computer vision optical metrics, allergen safety rules, and AI culinary engines active.
          </p>
        </div>
      </div>
    </aside>
  );
};
