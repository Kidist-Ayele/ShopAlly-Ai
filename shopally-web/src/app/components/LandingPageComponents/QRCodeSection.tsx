"use client";

import { useDarkMode } from "@/app/components/ProfileComponents/DarkModeContext";
import { useLanguage } from "@/hooks/useLanguage";

export default function QRCodeSection() {
  const { isDarkMode } = useDarkMode();
  const { t } = useLanguage();

  return (
    <section
      className={`py-12 px-6 md:px-12 transition-colors ${
        isDarkMode
          ? "bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">{t("Get Our App")}</h2>
        <p className="text-gray-500 mb-6">
          {t("Scan this QR code to download our mobile app")}
        </p>

        {/* QR Code Placeholder */}
        <div className="w-40 h-40 border-2 border-dashed border-gray-400 mx-auto flex items-center justify-center">
          <span className="text-gray-500 text-sm">{t("QR Code Here")}</span>
        </div>
      </div>
    </section>
  );
}
