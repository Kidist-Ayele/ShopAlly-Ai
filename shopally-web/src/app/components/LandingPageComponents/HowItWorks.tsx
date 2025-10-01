"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { useDarkMode } from "@/app/components/ProfileComponents/DarkModeContext";

export default function HowItWorks() {
  const { t } = useLanguage();
  const { isDarkMode } = useDarkMode();

  return (
    <section
      id="how-it-works"
      className={`mt-32 mb-32 px-6 py-20 text-center ${
        isDarkMode
          ? "bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]"
          : "bg-[#F7F9FB] text-[#262B32]"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <h2 className="text-3xl lg:text-4xl font-bold mb-6">
          {t("How")} <span className="text-brand">ShopAlly</span> {t("Works")}
        </h2>

        <p className="text-gray-500 mb-16 text-lg">
          {t("Get personalized product recommendations in three simple steps")}
        </p>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 flex items-center justify-center bg-[#FFD300] text-white rounded-lg mb-4 text-2xl">
              💬
            </div>
            <h3 className="font-semibold text-xl mb-3">{t("Ask a Question")}</h3>
            <p className="text-gray-500 text-sm max-w-xs">
              {t("Type your question in English or Amharic about what you need to buy")}
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 flex items-center justify-center bg-[#FFD300] text-white rounded-lg mb-4 text-2xl">
              💡
            </div>
            <h3 className="font-semibold text-xl mb-3">{t("Get Smart Recommendations")}</h3>
            <p className="text-gray-500 text-sm max-w-xs">
              {t("Our AI analyzes your needs and suggests the best products with Ethiopian pricing")}
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 flex items-center justify-center bg-[#FFD300] text-white rounded-lg mb-4 text-2xl">
              📊
            </div>
            <h3 className="font-semibold text-xl mb-3">{t("Compare & Buy")}</h3>
            <p className="text-gray-500 text-sm max-w-xs">
              {t("Compare prices, reviews, and shipping options to make the best choice")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
