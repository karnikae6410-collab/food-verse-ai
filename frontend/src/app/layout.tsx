import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Food Verse AI – Multimodal Food Intelligence Agent",
  description:
    "Multimodal AI platform combining computer vision food recognition, nutrition estimation, food freshness detection, restaurant hygiene monitoring, smart cooking assistance, and allergy-safe meal planning.",
  keywords: [
    "Food AI",
    "Nutrition Analysis",
    "Food Freshness",
    "Kitchen Hygiene",
    "Meal Planner",
    "Cooking Assistant",
    "Multimodal AI"
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#FDFBF7] text-[#1C1917]">
        {children}
      </body>
    </html>
  );
}
