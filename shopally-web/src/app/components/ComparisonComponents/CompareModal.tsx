"use client";

import { useDarkMode } from "@/app/components/ProfileComponents/DarkModeContext";
import { useLanguage } from "@/hooks/useLanguage";
import { useState } from "react";

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customCriteria?: string) => void;
  isLoading: boolean;
}

export default function CompareModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: CompareModalProps) {
  const { t } = useLanguage();
  const { isDarkMode } = useDarkMode();
  const [compareInput, setCompareInput] = useState("");

  const handleClose = () => {
    setCompareInput("");
    onClose();
  };

  const handleSubmit = (useCustomCriteria: boolean) => {
    const criteria = useCustomCriteria ? compareInput.trim() : undefined;
    console.log("🎯 Modal:", useCustomCriteria ? `"${criteria}"` : "skip");
    onSubmit(criteria);
    setCompareInput("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={`rounded-xl shadow-lg max-w-md w-full p-6 ${
          isDarkMode ? "bg-[#262B32]" : "bg-white"
        }`}
      >
        <h3
          className={`text-lg font-semibold mb-4 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {t("Customize Your Comparison")}
        </h3>
        <p
          className={`text-sm mb-4 ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {t(
            "Add specific criteria for comparison (optional). Leave empty for default comparison."
          )}
        </p>
        <textarea
          value={compareInput}
          onChange={(e) => setCompareInput(e.target.value)}
          placeholder={t(
            "e.g, Compare based on price, quality, and customer reviews..."
          )}
          className={`w-full p-3 rounded-lg border resize-none h-24 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          }`}
        />
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleClose}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDarkMode
                ? "bg-gray-600 text-white hover:bg-gray-500"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {t("Cancel")}
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={isLoading}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-yellow-400 text-black hover:bg-yellow-500 disabled:opacity-50"
          >
            {isLoading ? t("Comparing...") : t("Compare")}
          </button>
          <button
            onClick={() => handleSubmit(false)}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDarkMode
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } disabled:opacity-50`}
          >
            {t("Skip")}
          </button>
        </div>
      </div>
    </div>
  );
}
