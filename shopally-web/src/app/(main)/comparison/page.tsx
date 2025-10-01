"use client";

import { AIRecommendation } from "@/app/components/ComparisonComponents/AIRecommendation";
import { ComparisonTable } from "@/app/components/ComparisonComponents/ComparisonTable";
import { ProductCard } from "@/app/components/ComparisonComponents/ProductCard";
import { useLanguage } from "@/hooks/useLanguage";
import type {
  ComparisonItem,
  OverallComparison,
} from "@/types/Compare/Comparison";
import { useEffect, useState } from "react";

export default function ComparePage() {
  const [comparison, setComparison] = useState<ComparisonItem[]>([]);
  const [overallComparison, setOverallComparison] =
    useState<OverallComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  // Load comparison from localStorage
  useEffect(() => {
    const data = localStorage.getItem("comparisonResults");
    const overallData = localStorage.getItem("overallComparison");

    console.log("📂 Loading comparison from storage");
    console.log("   Products:", data ? "exists" : "missing");
    console.log("   Overall:", overallData ? "exists" : "missing");

    if (data) {
      try {
        const parsed = JSON.parse(data);
        console.log(
          "✅ Parsed data type:",
          typeof parsed,
          Array.isArray(parsed)
        );
        console.log("✅ Parsed data:", parsed);
        console.log("✅ Length:", parsed?.length || 0);

        if (Array.isArray(parsed) && parsed.length > 0) {
          setComparison(parsed);
        } else {
          console.warn("⚠️ Data is not an array or is empty");
        }
      } catch (e) {
        console.error("❌ Failed to parse comparison results:", e);
      }
    }

    if (overallData) {
      try {
        const parsedOverall = JSON.parse(overallData);
        console.log("✅ Overall comparison:", parsedOverall);
        setOverallComparison(parsedOverall);
      } catch (e) {
        console.error("❌ Failed to parse overall comparison:", e);
      }
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
        <div className="text-center">
          {/* Loading Spinner */}
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
          </div>
          <p
            className="text-lg transition-colors"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {t("Loading comparison...")}
          </p>
        </div>
      </div>
    );
  }

  // Show empty state if no comparison data
  if (comparison.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center transition-colors"
        style={{
          backgroundColor: "var(--color-bg-primary)",
          color: "var(--color-text-primary)",
        }}
      >
        <div className="text-center max-w-md mx-4">
          <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">⚖️</span>
          </div>
          <h2
            className="text-xl font-semibold mb-4 transition-colors"
            style={{ color: "var(--color-text-primary)" }}
          >
            {t("No Products to Compare")}
          </h2>
          <p
            className="text-sm mb-6 transition-colors"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {t(
              "Add products to your comparison list from the home page to see them here."
            )}
          </p>
          <a
            href="/home"
            className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 px-6 rounded-xl transition-colors duration-200"
          >
            {t("Go to Home")}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col gap-4 p-2 sm:p-4 lg:p-8 transition-colors"
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
      <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6 sm:mb-8">
        {comparison.map((item, index) => (
          <ProductCard
            key={item.product.id || index}
            product={item.product} // Pass the product object
          />
        ))}
      </div>

      {/* Comparison Table & AI Recommendation */}
      <ComparisonTable comparison={comparison} />
      <AIRecommendation
        comparison={comparison}
        overallComparison={overallComparison}
      />
    </div>
  );
}
