"use client";

import React, { useState } from "react";
import {
  UploadCloud,
  Camera,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  PieChart as PieIcon,
  Flame,
  Info,
  RefreshCw,
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { api } from "@/services/api";
import { FoodAnalysisResponse } from "@/types";

export const FoodRecognitionView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FoodAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Sample presets for 1-click instant demo
  const samplePresets = [
    { name: "Grilled Atlantic Salmon", filename: "grilled_salmon.jpg", color: [220, 110, 80] },
    { name: "Greek Salad with Feta", filename: "mediterranean_salad.jpg", color: [80, 180, 90] },
    { name: "Avocado Toast with Seeds", filename: "avocado_toast.jpg", color: [100, 190, 80] },
    { name: "Margherita Pizza", filename: "margherita_pizza.jpg", color: [230, 90, 60] },
    { name: "Berry Oatmeal Bowl", filename: "berry_oatmeal.jpg", color: [140, 80, 160] },
  ];

  const handleFileChange = (file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPEG, PNG, WebP).");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const createSampleFile = async (name: string, filename: string, color: number[]) => {
    // Generate synthetic image canvas for preset
    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Draw background gradient
      const grad = ctx.createLinearGradient(0, 0, 300, 300);
      grad.addColorStop(0, `rgb(${color[0]}, ${color[1]}, ${color[2]})`);
      grad.addColorStop(1, `rgb(${Math.max(0, color[0] - 40)}, ${Math.max(0, color[1] - 40)}, ${Math.max(0, color[2] - 40)})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 300, 300);

      // Add text label
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(name, 150, 140);
      ctx.font = "14px system-ui";
      ctx.fillText("Food Verse Sample", 150, 170);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], filename, { type: "image/jpeg" });
          setSelectedFile(file);
          setPreviewUrl(canvas.toDataURL("image/jpeg"));
        }
      }, "image/jpeg");
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError("Please select or drop an image first.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await api.analyzeFood(selectedFile);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to analyze food image.");
    } finally {
      setLoading(false);
    }
  };

  // Recharts data for macronutrient donut
  const macroChartData = result
    ? [
        { name: "Protein", value: result.macronutrients.protein_g, color: "#15803D" },
        { name: "Carbs", value: result.macronutrients.carbs_g, color: "#EA580C" },
        { name: "Fats", value: result.macronutrients.fats_g, color: "#EAB308" },
      ]
    : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
          <Camera className="h-3.5 w-3.5 text-emerald-600" />
          <span>Module 1: Computer Vision & Nutrition Intelligence</span>
        </div>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
          Food Recognition & Calorie Estimation
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Upload any meal picture to identify dishes, estimate serving portions, and calculate macronutrient & micronutrient breakdowns.
        </p>
      </div>

      {/* Preset Quick-Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-stone-400">Quick Test Samples:</span>
        {samplePresets.map((preset) => (
          <button
            key={preset.filename}
            onClick={() => createSampleFile(preset.name, preset.filename, preset.color)}
            className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-700 shadow-2xs transition-all hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-800"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Main Grid: Upload & Preview vs Results */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Image Uploader (5 cols) */}
        <div className="space-y-4 lg:col-span-5">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`relative flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
              isDragOver
                ? "border-emerald-500 bg-emerald-50/50"
                : "border-stone-300 bg-white hover:border-emerald-400 hover:bg-[#FDFBF7]"
            }`}
          >
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
              className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
            />

            {previewUrl ? (
              <div className="relative w-full">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="mx-auto max-h-64 rounded-xl object-contain shadow-xs"
                />
                <p className="mt-2 text-xs font-medium text-stone-500">
                  {selectedFile?.name} (Click or drag new image to replace)
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20">
                  <UploadCloud className="h-7 w-7" />
                </div>
                <h4 className="mt-4 text-sm font-semibold text-stone-900">
                  Upload food image
                </h4>
                <p className="mt-1 text-xs text-stone-500">
                  Drag and drop JPG, PNG, or WebP (up to 25MB)
                </p>
                <div className="mt-4 rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-600">
                  Browse Files
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!selectedFile || loading}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white shadow-md transition-all ${
              !selectedFile || loading
                ? "bg-stone-300 cursor-not-allowed"
                : "bg-emerald-700 hover:bg-emerald-800 hover:shadow-lg"
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Running Computer Vision Inference...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Run Food Intelligence Analysis</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Analysis Results (7 cols) */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="space-y-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
              {/* Header result row */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-100 pb-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Food Identified</span>
                  </div>
                  <h3 className="mt-2 text-2xl font-bold text-stone-900">
                    {result.food_name}
                  </h3>
                  <p className="text-xs text-stone-500">{result.category}</p>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-extrabold text-emerald-700">
                    {Math.round(result.confidence * 100)}%
                  </div>
                  <div className="text-[11px] font-medium text-stone-400">Vision Confidence</div>
                </div>
              </div>

              {/* Nutrition KPI cards */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-stone-100 bg-[#FCFAF6] p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-xs text-stone-500">
                    <Flame className="h-3.5 w-3.5 text-amber-500" />
                    <span>Calories</span>
                  </div>
                  <div className="mt-1 text-xl font-bold text-stone-900">
                    {result.calories}
                  </div>
                  <div className="text-[10px] text-stone-400">kcal</div>
                </div>

                <div className="rounded-xl border border-stone-100 bg-[#FCFAF6] p-3 text-center">
                  <div className="text-xs text-stone-500">Protein</div>
                  <div className="mt-1 text-xl font-bold text-emerald-700">
                    {result.macronutrients.protein_g}g
                  </div>
                  <div className="text-[10px] text-stone-400">Lean build</div>
                </div>

                <div className="rounded-xl border border-stone-100 bg-[#FCFAF6] p-3 text-center">
                  <div className="text-xs text-stone-500">Carbs</div>
                  <div className="mt-1 text-xl font-bold text-orange-600">
                    {result.macronutrients.carbs_g}g
                  </div>
                  <div className="text-[10px] text-stone-400">{result.macronutrients.fiber_g}g fiber</div>
                </div>

                <div className="rounded-xl border border-stone-100 bg-[#FCFAF6] p-3 text-center">
                  <div className="text-xs text-stone-500">Healthy Fats</div>
                  <div className="mt-1 text-xl font-bold text-amber-600">
                    {result.macronutrients.fats_g}g
                  </div>
                  <div className="text-[10px] text-stone-400">Essential lipids</div>
                </div>
              </div>

              {/* Charts & Serving Details */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
                {/* Donut Chart */}
                <div className="flex flex-col items-center justify-center rounded-xl border border-stone-100 bg-[#FCFAF6] p-4 sm:col-span-5">
                  <div className="text-xs font-semibold text-stone-700">Macro Ratio</div>
                  <div className="h-36 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={macroChartData}
                          innerRadius={38}
                          outerRadius={55}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {macroChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex gap-3 text-[10px] font-medium text-stone-500">
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-700" /> Protein
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-orange-600" /> Carbs
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-amber-500" /> Fats
                    </span>
                  </div>
                </div>

                {/* Candidates & Portions */}
                <div className="space-y-3 sm:col-span-7">
                  <div className="rounded-xl border border-stone-100 bg-[#FCFAF6] p-3 text-xs">
                    <div className="font-semibold text-stone-700">Estimated Serving Size</div>
                    <div className="mt-1 text-stone-600">{result.serving_size}</div>
                  </div>

                  <div className="rounded-xl border border-stone-100 bg-[#FCFAF6] p-3 text-xs">
                    <div className="font-semibold text-stone-700">Alternative Candidates</div>
                    <div className="mt-1 space-y-1">
                      {result.top_candidates.map((cand, idx) => (
                        <div key={idx} className="flex justify-between text-stone-600">
                          <span>{cand.name}</span>
                          <span className="font-medium text-stone-500">
                            {Math.round(cand.confidence * 100)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dietary Tags & Allergen Warnings */}
              <div className="space-y-2 border-t border-stone-100 pt-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-stone-600">Dietary Profile:</span>
                  {result.dietary_flags.map((flag, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700"
                    >
                      {flag}
                    </span>
                  ))}
                </div>

                {result.allergen_warnings.length > 0 && (
                  <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-2.5 text-xs text-amber-800">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                    <span>
                      <strong>Allergen Notice:</strong> {result.allergen_warnings.join(", ")}
                    </span>
                  </div>
                )}
              </div>

              {/* Health Insights */}
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5 text-xs leading-relaxed text-emerald-900">
                <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
                  <Info className="h-3.5 w-3.5 text-emerald-700" />
                  <span>Biochemical & Nutritional Insights</span>
                </div>
                <p className="mt-1">{result.health_insights}</p>
              </div>

              {/* Inference Engine footer */}
              <div className="flex items-center justify-between text-[11px] text-stone-400">
                <span>Model: {result.inference_mode}</span>
                <span>Auto-saved to history</span>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-80 flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white p-8 text-center text-stone-400">
              <Camera className="h-12 w-12 stroke-1 text-stone-300" />
              <h4 className="mt-3 text-sm font-semibold text-stone-600">
                No Food Analyzed Yet
              </h4>
              <p className="mt-1 max-w-sm text-xs text-stone-400">
                Select an image on the left or click one of the quick test samples above to generate calorie and macronutrient intelligence.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
