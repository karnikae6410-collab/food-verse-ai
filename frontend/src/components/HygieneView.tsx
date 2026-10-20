"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  UploadCloud,
  Video,
  Camera,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCheck,
  RefreshCw,
  Sparkles,
  Layers,
} from "lucide-react";
import { api } from "@/services/api";
import { KitchenHygieneResponse, ChecklistItem } from "@/types";

export const HygieneView: React.FC = () => {
  const [mode, setMode] = useState<"image" | "video">("image");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [facilityZone, setFacilityZone] = useState("Cold Prep & Cutting Station");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<KitchenHygieneResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);

  const sampleStations = [
    { name: "Cold Prep Counter", zone: "Cold Prep & Cutting Station", color: [200, 210, 215] },
    { name: "Grill & Sauté Line", zone: "Hot Line & Sauté Station", color: [220, 160, 120] },
    { name: "Dishwashing & Sanitation", zone: "Scullery & Sanitizing Sink", color: [180, 210, 230] },
  ];

  const createSampleKitchen = (name: string, zone: string, color: number[]) => {
    setFacilityZone(zone);
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Draw kitchen counter representation
      ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
      ctx.fillRect(0, 0, 320, 240);

      // Stainless steel horizontal lines
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 2;
      for (let y = 30; y < 240; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(320, y);
        ctx.stroke();
      }

      ctx.fillStyle = "#1C1917";
      ctx.font = "bold 16px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(name, 160, 110);
      ctx.font = "12px system-ui";
      ctx.fillText(`Station: ${zone}`, 160, 140);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `${zone.replace(/\s+/g, "_")}.jpg`, { type: "image/jpeg" });
          setSelectedFile(file);
          setPreviewUrl(canvas.toDataURL("image/jpeg"));
        }
      }, "image/jpeg");
    }
  };

  const handleFileChange = (file: File) => {
    setError(null);
    setSelectedFile(file);
    if (file.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(file));
      setMode("image");
    } else if (file.type.startsWith("video/")) {
      setPreviewUrl(null);
      setMode("video");
    }
  };

  const handleInspect = async () => {
    if (!selectedFile) {
      setError("Please select an image or video to inspect.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let data: KitchenHygieneResponse;
      if (mode === "video") {
        data = await api.analyzeHygieneVideo(selectedFile, facilityZone);
      } else {
        data = await api.analyzeHygieneImage(selectedFile, facilityZone);
      }
      setResult(data);
      setChecklist(data.manual_checklist);
    } catch (err: any) {
      setError(err.message || "Failed to inspect kitchen hygiene.");
    } finally {
      setLoading(false);
    }
  };

  const toggleChecklistPassed = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, passed: !item.passed } : item))
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
          <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
          <span>Module 3: Commercial Kitchen & Restaurant Hygiene Vision</span>
        </div>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
          Smart Kitchen Cleanliness & Sanitization Auditing
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          AI optical inspection of food prep stations, spill detection, temporal video frame stability, and manual health checklists.
        </p>
      </div>

      {/* Preset quick test buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-stone-400">Quick Test Stations:</span>
        {sampleStations.map((station) => (
          <button
            key={station.zone}
            onClick={() => createSampleKitchen(station.name, station.zone, station.color)}
            className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-700 shadow-2xs transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-800"
          >
            {station.name}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column (5 cols) */}
        <div className="space-y-4 lg:col-span-5">
          {/* Mode Switcher */}
          <div className="flex rounded-xl border border-stone-200 bg-white p-1 shadow-2xs">
            <button
              onClick={() => setMode("image")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all ${
                mode === "image"
                  ? "bg-blue-700 text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Camera className="h-3.5 w-3.5" />
              <span>Still Photo Inspection</span>
            </button>
            <button
              onClick={() => setMode("video")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all ${
                mode === "video"
                  ? "bg-blue-700 text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Video className="h-3.5 w-3.5" />
              <span>Video Frame Sampling</span>
            </button>
          </div>

          {/* Facility Zone Input */}
          <div>
            <label className="text-xs font-semibold text-stone-700">Kitchen Station / Zone</label>
            <input
              type="text"
              value={facilityZone}
              onChange={(e) => setFacilityZone(e.target.value)}
              className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-sm text-stone-900 shadow-2xs focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileChange(e.dataTransfer.files[0]);
              }
            }}
            className={`relative flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
              isDragOver
                ? "border-blue-500 bg-blue-50/50"
                : "border-stone-300 bg-white hover:border-blue-400 hover:bg-[#FDFBF7]"
            }`}
          >
            <input
              type="file"
              accept={mode === "video" ? "video/mp4,video/webm" : "image/jpeg,image/png,image/webp"}
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
                  alt="Kitchen Preview"
                  className="mx-auto max-h-56 rounded-xl object-contain shadow-xs"
                />
                <p className="mt-2 text-xs font-medium text-stone-500">
                  {selectedFile?.name} (Click or drag to replace)
                </p>
              </div>
            ) : selectedFile && mode === "video" ? (
              <div className="flex flex-col items-center">
                <Video className="h-10 w-10 text-blue-600" />
                <div className="mt-2 text-sm font-semibold text-stone-800">
                  {selectedFile.name}
                </div>
                <div className="text-xs text-stone-500">Ready for temporal frame sampling</div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-600/20">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <h4 className="mt-3 text-sm font-semibold text-stone-900">
                  {mode === "video" ? "Upload Kitchen Video (MP4)" : "Upload Kitchen Photo"}
                </h4>
                <p className="mt-1 text-xs text-stone-500">
                  Clear view of work surfaces, sink, or food prep line
                </p>
                <div className="mt-3 rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-600">
                  Browse File
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
            onClick={handleInspect}
            disabled={!selectedFile || loading}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white shadow-md transition-all ${
              !selectedFile || loading
                ? "bg-stone-300 cursor-not-allowed"
                : "bg-blue-700 hover:bg-blue-800 hover:shadow-lg"
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Auditing Surfaces & Workstation Hygiene...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Run Sanitation & Hygiene Audit</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Audit Results & Manual Checklist (7 cols) */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="space-y-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
              {/* Hygiene Disclaimer */}
              <div className="rounded-xl border border-stone-200 bg-[#FCFAF6] p-3.5 text-xs text-stone-600">
                <strong className="text-stone-800">HYGIENE NOTICE:</strong> {result.compliance_disclaimer}
              </div>

              {/* Title & Grade Row */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-100 pb-5">
                <div>
                  <div className="text-xs font-medium text-stone-400">Inspected Area</div>
                  <h3 className="text-xl font-bold text-stone-900">{result.facility_zone}</h3>
                  <div className="mt-1 text-xs text-stone-500">
                    Source: {result.source_type === "video" ? `Video Stream (${result.video_frames_sampled} frames sampled)` : "High-Res Image"}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-extrabold text-blue-700">
                    {result.overall_hygiene_score}
                    <span className="text-base font-normal text-stone-400">/100</span>
                  </div>
                  <div className="inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                    {result.status}
                  </div>
                </div>
              </div>

              {/* Video Frame Samples if video mode */}
              {result.frame_analyses && result.frame_analyses.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-stone-700">
                    <Layers className="h-4 w-4 text-blue-600" />
                    <span>Temporal Sampled Frames</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                    {result.frame_analyses.map((f) => (
                      <div
                        key={f.frame_number}
                        className="rounded-lg border border-stone-100 bg-[#FCFAF6] p-2 text-center text-xs"
                      >
                        <div className="font-bold text-blue-800">{f.score}%</div>
                        <div className="text-[10px] text-stone-400">{f.timestamp_sec}s</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Optical Cleanliness Metrics */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  AI Optical Surface Observations
                </h4>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {result.visible_metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-stone-100 bg-[#FCFAF6] p-3 text-xs"
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-stone-800">{m.metric_name}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] ${
                            m.status === "Compliant"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {m.score}%
                        </span>
                      </div>
                      <p className="mt-1 text-stone-600">{m.observation}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Manual Inspection Checklist */}
              <div className="space-y-3 border-t border-stone-100 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">
                      Manual Health Inspection Checklist
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Click any item to toggle pass/fail for your food safety log.
                    </p>
                  </div>
                  <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-700">
                    {checklist.filter((c) => c.passed).length}/{checklist.length} Passed
                  </span>
                </div>

                <div className="space-y-2">
                  {checklist.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleChecklistPassed(item.id)}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-xs transition-all ${
                        item.passed
                          ? "border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50/70"
                          : "border-rose-200 bg-rose-50/40 hover:bg-rose-50/70"
                      }`}
                    >
                      {item.passed ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      ) : (
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-stone-800">{item.category}</span>
                          <span
                            className={`text-[10px] font-bold uppercase ${
                              item.passed ? "text-emerald-700" : "text-rose-700"
                            }`}
                          >
                            {item.passed ? "Passed" : "Action Required"}
                          </span>
                        </div>
                        <p className="mt-0.5 text-stone-600">{item.item}</p>
                        {item.notes && (
                          <div className="mt-1 text-[11px] text-stone-500 italic">
                            Note: {item.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Recommendations */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-xs">
                <div className="font-semibold text-blue-900">Recommended Sanitation Corrective Actions</div>
                <ul className="mt-2 list-inside list-disc space-y-1 text-blue-800">
                  {result.actionable_recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-80 flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white p-8 text-center text-stone-400">
              <ShieldCheck className="h-12 w-12 stroke-1 text-stone-300" />
              <h4 className="mt-3 text-sm font-semibold text-stone-600">
                No Kitchen Area Audited Yet
              </h4>
              <p className="mt-1 max-w-sm text-xs text-stone-400">
                Select an image/video or choose a sample station on the left to inspect kitchen cleanliness and sanitation checklists.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
