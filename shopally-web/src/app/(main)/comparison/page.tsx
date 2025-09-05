// src/app/(main)/comparison/page.tsx
"use client";

import { AIRecommendation } from "@/app/components/ComparisonComponents/AIRecommendation";
import { ComparisonTable } from "@/app/components/ComparisonComponents/ComparisonTable";
import { ProductCard } from "@/app/components/ComparisonComponents/ProductCard";
import { useDarkMode } from "@/app/components/ProfileComponents/DarkModeContext";
import { useLanguage } from "@/hooks/useLanguage";
import type { ComparisonItem } from "@/types/Compare/Comparison";
import { useEffect, useState } from "react";

export default function ComparePage() {
  const [comparison, setComparison] = useState<ComparisonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useDarkMode();
  const { t } = useLanguage();

  // Load comparison from localStorage
  useEffect(() => {
    const data = localStorage.getItem("comparisonResults");
    if (data) {
      setComparison(JSON.parse(data));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center transition-colors"
        style={{
          backgroundColor: "var(--color-bg-primary)",
          color: "var(--color-text-primary)",
        }}
      >
        <p
          className="text-lg transition-colors"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {t("Loading comparison...")}
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col p-4 lg:p-8 transition-colors"
      style={{
        backgroundColor: "var(--color-bg-primary)",
        color: "var(--color-text-primary)",
      }}
    >
      <h1
        className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 transition-colors"
        style={{ color: "var(--color-text-primary)" }}
      >
        {t("Product Comparison")}
      </h1>
      <p
        className="text-sm sm:text-base mb-6 sm:mb-8 transition-colors"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {t("Compare selected products to make the best choice")}
      </p>

      {/* Product cards */}
      <div className="grid gap-4 sm:gap-6 lg:gap-8 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {comparison.map((c) => (
          <ProductCard key={c.product.id} product={c.product} />
        ))}
      </div>

      {/* Comparison Table & AI Recommendation */}
      <ComparisonTable comparison={comparison} />
      <AIRecommendation comparison={comparison} />
    </div>
  );
}
