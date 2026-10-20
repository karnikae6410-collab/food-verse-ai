"use client";

import React, { useState } from "react";
import {
  ChefHat,
  Send,
  Sparkles,
  BookmarkPlus,
  BookmarkCheck,
  Check,
  HelpCircle,
  RefreshCw,
  Lightbulb,
  Utensils,
  BookOpen,
} from "lucide-react";
import { api } from "@/services/api";
import { AssistantChatResponse, RecipeItem } from "@/types";

interface Message {
  sender: "user" | "assistant";
  text: string;
  data?: AssistantChatResponse;
}

export const AssistantView: React.FC = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "assistant",
      text: "Hello! I am your Food Verse AI Cooking Assistant. Ask me about ingredient substitutions, how to store fresh produce, culinary cooking techniques, or tell me what ingredients you have in your fridge!",
    },
  ]);
  const [savedRecipeIds, setSavedRecipeIds] = useState<Record<string, boolean>>({});

  const quickPrompts = [
    "What can I substitute for buttermilk in pancakes?",
    "How do I store fresh basil without it turning black?",
    "I have eggs, spinach, and tomatoes. What can I cook?",
    "How do I get a crispy sear on salmon without overcooking it?",
    "Substitute for heavy cream in savory soup",
  ];

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: Message = { sender: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.chatAssistant({
        message: query,
        conversation_history: messages.map((m) => ({
          role: m.sender,
          content: m.text,
        })),
      });

      const assistantMsg: Message = {
        sender: "assistant",
        text: res.reply,
        data: res,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "assistant",
          text: "I encountered an error connecting to the culinary reasoning engine. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipeFromAssistant = async (r: any, idx: number) => {
    try {
      const newRecipe: RecipeItem = {
        title: r.title || "Custom Skillet Creation",
        cuisine: "Chef's Special",
        prep_time_minutes: 10,
        cook_time_minutes: 15,
        servings: 2,
        calories_per_serving: 380,
        protein_g: 28,
        carbs_g: 22,
        fats_g: 14,
        ingredients: r.ingredients || ["Olive oil", "Garlic", "Seasonings"],
        instructions: r.steps || ["Heat pan", "Cook ingredients"],
      };
      await api.saveRecipe(newRecipe);
      setSavedRecipeIds((prev) => ({ ...prev, [idx]: true }));
    } catch (err: any) {
      alert("Error saving recipe: " + err.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-800">
          <ChefHat className="h-3.5 w-3.5 text-orange-600" />
          <span>Module 5: Conversational AI Cooking & Culinary Assistant</span>
        </div>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
          Chef Verse Culinary Advisor
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Expert kitchen guidance: instant ingredient substitutions, optimal storage methods, and creative recipe generation.
        </p>
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-stone-400">Try Asking:</span>
        {quickPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-700 shadow-2xs transition-all hover:border-orange-400 hover:bg-orange-50 hover:text-orange-900"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Thread Container */}
      <div className="flex flex-col rounded-2xl border border-stone-200 bg-white shadow-xs">
        {/* Messages Stream */}
        <div className="min-h-96 max-h-[550px] space-y-4 overflow-y-auto p-6">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-2xl rounded-2xl p-4 text-sm leading-relaxed ${
                  m.sender === "user"
                    ? "bg-emerald-700 text-white"
                    : "border border-stone-200/80 bg-[#FCFAF6] text-stone-900"
                }`}
              >
                {/* Assistant header tag */}
                {m.sender === "assistant" && (
                  <div className="mb-2 flex items-center justify-between border-b border-stone-200/60 pb-1.5 text-[11px] text-stone-500">
                    <span className="flex items-center gap-1 font-semibold text-emerald-800">
                      <ChefHat className="h-3.5 w-3.5" />
                      <span>Food Verse Chef</span>
                    </span>
                    {m.data && (
                      <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px]">
                        Engine: {m.data.provider_used}
                      </span>
                    )}
                  </div>
                )}

                {/* Body markdown-like formatted text */}
                <div className="whitespace-pre-line">{m.text}</div>

                {/* Structured Substitutions Cards */}
                {m.data?.substitutions && m.data.substitutions.length > 0 && (
                  <div className="mt-3 space-y-2 border-t border-stone-200/60 pt-3">
                    {m.data.substitutions.map((sub, sIdx) => (
                      <div
                        key={sIdx}
                        className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-900"
                      >
                        <div className="font-bold text-amber-950">
                          {sub.original} ➔ {sub.substitute}
                        </div>
                        <div className="mt-0.5 text-[11px] font-semibold text-amber-800">
                          Ratio: {sub.ratio}
                        </div>
                        <div className="mt-1 text-stone-700">{sub.culinary_notes}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggested Recipes with Save button */}
                {m.data?.suggested_recipes && m.data.suggested_recipes.length > 0 && (
                  <div className="mt-4 space-y-3 border-t border-stone-200/60 pt-3">
                    {m.data.suggested_recipes.map((r, rIdx) => (
                      <div
                        key={rIdx}
                        className="rounded-xl border border-emerald-200 bg-white p-3 text-xs shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-900">{r.title}</span>
                          <button
                            onClick={() => handleSaveRecipeFromAssistant(r, rIdx)}
                            className="flex items-center gap-1 rounded-md border border-stone-200 bg-stone-50 px-2 py-1 text-[11px] font-semibold text-stone-700 hover:bg-stone-100"
                          >
                            {savedRecipeIds[rIdx] ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-600" />
                                <span className="text-emerald-700">Saved</span>
                              </>
                            ) : (
                              <>
                                <BookmarkPlus className="h-3 w-3" />
                                <span>Save Recipe</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="mt-2 text-stone-600">
                          Ready in: {r.cook_time}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-[#FCFAF6] p-4 text-xs text-stone-500">
                <RefreshCw className="h-4 w-4 animate-spin text-emerald-600" />
                <span>Chef Verse is reasoning culinary science...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="border-t border-stone-200 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything: substitutions, recipe ideas, storage hacks..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 shadow-2xs focus:border-emerald-600 focus:outline-hidden"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className={`flex items-center justify-center rounded-xl p-3 text-white shadow-xs transition-all ${
                loading || !input.trim()
                  ? "bg-stone-300 cursor-not-allowed"
                  : "bg-emerald-700 hover:bg-emerald-800"
              }`}
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
