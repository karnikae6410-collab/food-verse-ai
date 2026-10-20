"use client";

import React, { useEffect, useState } from "react";
import {
  History,
  Camera,
  Leaf,
  ShieldCheck,
  Search,
  Filter,
  Calendar,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { api } from "@/services/api";

export const HistoryView: React.FC = () => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async (categoryFilter?: string) => {
    setLoading(true);
    try {
      const cat = categoryFilter && categoryFilter !== "all" ? categoryFilter : undefined;
      const res = await api.getHistory(cat);
      setItems(res.history || []);
    } catch (err) {
      console.error("Failed to load history", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(filter);
  }, [filter]);

  const filteredItems = items.filter((item) => {
    const text = (
      (item.food_name || "") +
      " " +
      (item.item_name || "") +
      " " +
      (item.facility_zone || "") +
      " " +
      (item.category || "")
    ).toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-semibold text-stone-700">
          <History className="h-3.5 w-3.5 text-stone-600" />
          <span>Unified Telemetry Logs & Analysis History</span>
        </div>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
          Food Intelligence Activity Log
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Persistent audit record of all computer vision food scans, freshness determinations, and smart kitchen sanitation checks.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All Logs" },
            { id: "food_analysis", label: "Food Scans" },
            { id: "freshness_analysis", label: "Produce Freshness" },
            { id: "hygiene_audit", label: "Kitchen Audits" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                filter === cat.id
                  ? "bg-emerald-700 text-white shadow-2xs"
                  : "border border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white py-1.5 pl-9 pr-4 text-xs text-stone-900 shadow-2xs focus:border-emerald-600 focus:outline-hidden sm:w-64"
          />
        </div>
      </div>

      {/* History Stream */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <RefreshCw className="h-6 w-6 animate-spin text-emerald-600" />
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="space-y-3">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id || idx}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold ${
                    item.type === "food_analysis"
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                      : item.type === "freshness_analysis"
                      ? "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20"
                      : "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20"
                  }`}
                >
                  {item.type === "food_analysis" ? (
                    <Camera className="h-5 w-5" />
                  ) : item.type === "freshness_analysis" ? (
                    <Leaf className="h-5 w-5" />
                  ) : (
                    <ShieldCheck className="h-5 w-5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-stone-900">
                      {item.food_name || item.item_name || item.facility_zone}
                    </h4>
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-600">
                      {item.category || item.status || "Audit"}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-stone-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {item.timestamp ? new Date(item.timestamp).toLocaleString() : "Recent"}
                    </span>
                    <span>•</span>
                    <span>File: {item.filename || "image.jpg"}</span>
                  </div>
                </div>
              </div>

              {/* Data tags right */}
              <div className="flex items-center gap-3 self-end sm:self-center">
                {item.calories && (
                  <div className="text-right">
                    <div className="font-bold text-stone-900">{item.calories} kcal</div>
                    <div className="text-[10px] text-stone-400">
                      {item.macronutrients?.protein_g}g P / {item.macronutrients?.carbs_g}g C
                    </div>
                  </div>
                )}

                {item.freshness_score && (
                  <div className="text-right">
                    <div className="font-bold text-emerald-700">{item.freshness_score}%</div>
                    <div className="text-[10px] text-stone-400">{item.status}</div>
                  </div>
                )}

                {item.overall_hygiene_score && (
                  <div className="text-right">
                    <div className="font-bold text-blue-700">{item.overall_hygiene_score}%</div>
                    <div className="text-[10px] text-stone-400">{item.status}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white p-8 text-center text-stone-400">
          <History className="h-10 w-10 text-stone-300" />
          <h4 className="mt-2 text-sm font-semibold text-stone-600">No Historical Records</h4>
          <p className="mt-1 text-xs text-stone-400">
            No analysis results found matching your search or category filter.
          </p>
        </div>
      )}
    </div>
  );
};
