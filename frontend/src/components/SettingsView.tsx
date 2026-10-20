"use client";

import React, { useEffect, useState } from "react";
import {
  Settings,
  Server,
  Database,
  Cpu,
  Sparkles,
  Key,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { api } from "@/services/api";
import { HealthStatus } from "@/types";

export const SettingsView: React.FC = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [checking, setChecking] = useState(false);

  const checkStatus = async () => {
    setChecking(true);
    try {
      const data = await api.getHealth();
      setHealth(data);
    } catch {
      setHealth(null);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-semibold text-stone-700">
          <Settings className="h-3.5 w-3.5 text-stone-600" />
          <span>System Diagnostics & Telemetry Hub</span>
        </div>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
          Settings & Architecture Health
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Inspect backend service status, database connectivity, and external AI provider credentials.
        </p>
      </div>

      {/* Live Services Status Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* API Backend */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-emerald-600" />
              <span className="text-sm font-bold text-stone-900">FastAPI Backend</span>
            </div>
            {health ? (
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                <span>Online</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-800">
                <AlertCircle className="h-3 w-3 text-rose-600" />
                <span>Offline</span>
              </span>
            )}
          </div>
          <div className="mt-3 text-xs text-stone-500">
            <div>Target: {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}</div>
            <div>Version: {health?.version || "1.0.0"}</div>
            <div>Environment: {health?.environment || "development"}</div>
          </div>
        </div>

        {/* Database */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-bold text-stone-900">Database Layer</span>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                health?.database_connected
                  ? "bg-emerald-50 text-emerald-800"
                  : "bg-amber-50 text-amber-800"
              }`}
            >
              {health?.database_mode === "mongodb" ? "MongoDB Live" : "Demo Store (In-Memory)"}
            </span>
          </div>
          <div className="mt-3 text-xs text-stone-500">
            <div>Engine: PyMongo / In-Memory Fallback</div>
            <div>Status: {health?.database_connected ? "Connected" : "Resilient Fallback Active"}</div>
            <div>Persisting: Food Scans, Recipes, Plans</div>
          </div>
        </div>

        {/* AI & Vision Provider */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-bold text-stone-900">AI Intelligence Core</span>
            </div>
            <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[11px] font-semibold text-purple-800">
              Active
            </span>
          </div>
          <div className="mt-3 text-xs text-stone-500">
            <div>Vision Engine: {health?.vision_provider || "hybrid_cv_model"}</div>
            <div>Chef Assistant: {health?.llm_provider || "rule_based_culinary_system"}</div>
            <div>Allergy Safety: 100% Deterministic Rule Engine</div>
          </div>
        </div>
      </div>

      {/* Re-check Button */}
      <div className="flex justify-end">
        <button
          onClick={checkStatus}
          disabled={checking}
          className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-stone-700 shadow-2xs hover:bg-stone-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${checking ? "animate-spin" : ""}`} />
          <span>Ping API Health Check</span>
        </button>
      </div>

      {/* Environment Configuration Guide */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 font-bold text-stone-900">
          <Key className="h-4 w-4 text-emerald-700" />
          <span>Configuring Environment Variables</span>
        </div>
        <p className="mt-1 text-xs text-stone-500">
          To connect a real MongoDB database or activate Google Gemini / OpenAI LLM providers, edit your root <code>.env</code> file:
        </p>

        <div className="mt-4 rounded-xl bg-stone-900 p-4 font-mono text-xs text-stone-100">
          <pre>{`# MongoDB Connection (Optional: app runs seamlessly in Demo Mode without it)
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=food_verse_ai

# LLM Provider for Cooking Assistant (Optional: rule-based fallback active by default)
LLM_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here

# Vision Provider
VISION_MODEL_PROVIDER=hybrid
CONFIDENCE_THRESHOLD=0.60`}</pre>
        </div>
      </div>
    </div>
  );
};
