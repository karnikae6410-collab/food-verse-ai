"use client";

import React from "react";
import { Utensils, Sparkles, Activity, ShieldCheck, Menu, X } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  backendHealthy: boolean | null;
  dbMode: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  backendHealthy,
  dbMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: "landing", label: "Home" },
    { id: "dashboard", label: "Dashboard" },
    { id: "food", label: "Food Recognition" },
    { id: "freshness", label: "Freshness & Spoilage" },
    { id: "hygiene", label: "Kitchen Hygiene" },
    { id: "meals", label: "Meal Planner" },
    { id: "assistant", label: "Cooking Assistant" },
    { id: "history", label: "History" },
    { id: "settings", label: "Settings" },
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 bg-[#FDFBF7]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div
          onClick={() => setActiveTab("landing")}
          className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-90"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/20">
            <Utensils className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-stone-900">Food Verse AI</span>
              <span className="hidden rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-600/20 sm:inline-block">
                Multimodal AI
              </span>
            </div>
            <p className="hidden text-[11px] text-stone-500 md:block">
              Smarter Food Choices. Safer Meals. Healthier Living.
            </p>
          </div>
        </div>

        {/* Right Status Indicators & CTA */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Health Badge */}
          <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs text-stone-600 shadow-xs">
            <span
              className={`h-2 w-2 rounded-full ${
                backendHealthy === true
                  ? "bg-emerald-500 animate-pulse"
                  : backendHealthy === false
                  ? "bg-rose-500"
                  : "bg-amber-400"
              }`}
            />
            <span className="font-medium">
              {backendHealthy === true
                ? "API Active"
                : backendHealthy === false
                ? "API Connecting..."
                : "Checking..."}
            </span>
            <span className="text-stone-300">|</span>
            <span className="text-[11px] text-stone-500">
              {dbMode === "mongodb" ? "MongoDB Live" : "Demo Mode Active"}
            </span>
          </div>

          <button
            onClick={() => setActiveTab("food")}
            className="flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-800 hover:shadow-md"
          >
            <Sparkles className="h-4 w-4" />
            <span>Scan Food</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-stone-600 hover:bg-stone-100"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-stone-200 bg-white px-4 py-3 md:hidden">
          <div className="grid grid-cols-2 gap-2 pb-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`rounded-lg px-3 py-2 text-left text-sm font-medium ${
                  activeTab === item.id
                    ? "bg-emerald-50 text-emerald-800 font-semibold"
                    : "text-stone-700 hover:bg-stone-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-2 border-t border-stone-100 pt-2 text-xs text-stone-500">
            Status: {backendHealthy ? "Connected (Demo Mode)" : "Offline / Standalone"}
          </div>
        </div>
      )}
    </header>
  );
};
