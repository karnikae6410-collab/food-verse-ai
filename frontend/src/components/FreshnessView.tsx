"use client";

import React, { useState } from "react";
import {
  Leaf,
  UploadCloud,
  AlertTriangle,
  ShieldAlert,
  Clock,
  Sparkles,
  Thermometer,
  RefreshCw,
  CheckCircle2,
  Info,
} from "lucide-react";
import { api } from "@/services/api";
import { FreshnessAnalysisResponse } from "@/types";

export const FreshnessView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FreshnessAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const produceSamples = [
    { name: "Orchard Honeycrisp Apple", filename: "apple_fresh.jpg", color: [220, 50, 45] },
    { name: "Ripe Cavendish Banana", filename: "banana_ripe.jpg", color: [240, 205, 50] },
    { name: "Vine-Ripened Tomato", filename: "tomato_vine.jpg", color: [215, 60, 40] },
    { name: "Crisp Leafy Greens", filename: "spinach_fresh.jpg", color: [45, 150, 65] },
    { name: "Fresh Strawberries", filename: "strawberries.jpg", color: [200, 30, 50] },
  ];

  const handleFileChange = (file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
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

  const createSampleProduce = (name: string, filename: string, color: number[]) => {
    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(150, 150, 30, 150, 150, 150);
      grad.addColorStop(0, `rgb(${color[0]}, ${color[1]}, ${color[2]})`);
      grad.addColorStop(1, `rgb(${Math.max(0, color[0] - 50)}, ${Math.max(0, color[1] - 50)}, ${Math.max(0, color[2] - 50)})`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(150, 150, 130, 0, Math.PI * 2);
      ctx.fill();

      // Stem or leaf detail
      ctx.fillStyle = "#15803D";
      ctx.fillRect(145, 10, 10, 30);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 18px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(name, 150, 150);

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
      setError("Please select an image first.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await api.analyzeFreshness(selectedFile);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to analyze produce freshness.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
          <Leaf className="h-3.5 w-3.5 text-amber-600" />
          <span>Module 2: Optical Freshness & Spoilage Detection</span>
        </div>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
          Food Freshness & Shelf-Life Assessment
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Multispectral surface analysis measuring epidermal firmness, browning, and cellular oxidation to predict shelf-life and optimize preservation.
        </p>
      </div>

      {/* Quick Test Produce Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-stone-400">Quick Test Items:</span>
        {produceSamples.map((sample) => (
          <button
            key={sample.filename}
            onClick={() => createSampleProduce(sample.name, sample.filename, sample.color)}
            className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-700 shadow-2xs transition-all hover:border-amber-500 hover:bg-amber-50 hover:text-amber-800"
          >
            {sample.name}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Upload Column (5 cols) */}
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
                ? "border-amber-500 bg-amber-50/50"
                : "border-stone-300 bg-white hover:border-amber-400 hover:bg-[#FDFBF7]"
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
                  alt="Produce Preview"
                  className="mx-auto max-h-64 rounded-xl object-contain shadow-xs"
                />
                <p className="mt-2 text-xs font-medium text-stone-500">
                  {selectedFile?.name} (Click or drag new image to replace)
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 ring-1 ring-amber-600/20">
                  <UploadCloud className="h-7 w-7" />
                </div>
                <h4 className="mt-4 text-sm font-semibold text-stone-900">
                  Upload Produce Image
                </h4>
                <p className="mt-1 text-xs text-stone-500">
                  Fruits, vegetables, bread, or dairy items
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
                : "bg-amber-600 hover:bg-amber-700 hover:shadow-lg"
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Assessing Cellular Turgor & Optical Decay...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Inspect Freshness & Spoilage Signs</span>
              </>
            )}
          </button>
        </div>

        {/* Results Column (7 cols) */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="space-y-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
              {/* Mandatory Food Safety Disclaimer Banner */}
              <div className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-3.5 text-xs text-amber-900">
                <ShieldAlert className="h-5 w-5 shrink-0 text-amber-700" />
                <div>
                  <div className="font-bold">CRITICAL FOOD SAFETY NOTICE</div>
                  <div className="mt-0.5 leading-relaxed text-amber-800">
                    {result.safety_disclaimer}
                  </div>
                </div>
              </div>

              {/* Title & Freshness Score Hero */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-100 pb-5">
                <div>
                  <div className="text-xs font-medium text-stone-400">{result.category}</div>
                  <h3 className="text-2xl font-bold text-stone-900">{result.item_name}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                        result.status === "Fresh"
                          ? "bg-emerald-100 text-emerald-800"
                          : result.status === "Consume Soon"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{result.status}</span>
                    </span>
                    <span className="text-xs text-stone-500">
                      Vision Confidence: {Math.round(result.confidence * 100)}%
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`text-3xl font-extrabold ${
                      result.freshness_score >= 80
                        ? "text-emerald-700"
                        : result.freshness_score >= 60
                        ? "text-amber-600"
                        : "text-rose-600"
                    }`}
                  >
                    {result.freshness_score}
                    <span className="text-base font-medium text-stone-400">/100</span>
                  </div>
                  <div className="text-[11px] text-stone-400">Freshness Index</div>
                </div>
              </div>

              {/* Estimated Shelf Life Card */}
              <div className="flex items-center gap-4 rounded-xl border border-stone-100 bg-[#FCFAF6] p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-stone-700">Estimated Usable Shelf-Life</div>
                  <div className="text-lg font-bold text-stone-900">
                    ~{result.estimated_shelf_life_days} Days Remaining
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Subject to proper refrigeration and relative humidity control.
                  </div>
                </div>
              </div>

              {/* Visual Evidence Indicators */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Optical Evidence Breakdown
                </h4>
                <div className="space-y-2">
                  {result.visual_indicators.map((ind, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-stone-100 bg-[#FCFAF6] p-3 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-stone-800">{ind.indicator}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            ind.status === "Optimal" || ind.status === "Balanced"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {ind.status} ({ind.score}%)
                        </span>
                      </div>
                      <p className="mt-1 text-stone-600">{ind.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spoilage Signs Alert if any */}
              {result.spoilage_signs.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-600">
                    Detected Spoilage Signals
                  </h4>
                  {result.spoilage_signs.map((sign, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-rose-100 bg-rose-50/70 p-3 text-xs text-rose-900"
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span>{sign.sign}</span>
                        <span className="rounded-full bg-rose-200 px-2 py-0.5 text-[10px] text-rose-800">
                          {sign.severity} Severity
                        </span>
                      </div>
                      <p className="mt-1 text-rose-800">{sign.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Storage Recommendation */}
              <div className="rounded-xl border border-stone-200 bg-[#FBF9F4] p-4 text-xs">
                <div className="flex items-center gap-2 font-semibold text-stone-800">
                  <Thermometer className="h-4 w-4 text-amber-600" />
                  <span>Optimal Preservation Protocol</span>
                </div>
                <p className="mt-1 leading-relaxed text-stone-600">
                  {result.storage_recommendation}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-80 flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white p-8 text-center text-stone-400">
              <Leaf className="h-12 w-12 stroke-1 text-stone-300" />
              <h4 className="mt-3 text-sm font-semibold text-stone-600">
                No Produce Scanned Yet
              </h4>
              <p className="mt-1 max-w-sm text-xs text-stone-400">
                Select an image on the left or click a produce preset above to run freshness and spoilage estimation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
