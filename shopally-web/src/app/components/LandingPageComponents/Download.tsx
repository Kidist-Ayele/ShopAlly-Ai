"use client";

import { motion, Variants } from "framer-motion";
import { useDarkMode } from "@/app/components/ProfileComponents/DarkModeContext";
import { useLanguage } from "@/hooks/useLanguage";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const downloadOptions = [
  { platform: "Google Play", icon: "📱", link: "#" },
  { platform: "App Store", icon: "🍏", link: "#" },
];

export default function Download() {
  const { isDarkMode } = useDarkMode();
  const { t } = useLanguage();

  return (
    <section className={`py-20 px-6 text-center ${isDarkMode ? "bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]" : "bg-white text-[#262B32]"}`}>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: false }}>
        <motion.h2 variants={fadeInUp} className="text-2xl font-bold mb-2">{t("Download ShopAlly Instantly")}</motion.h2>
        <motion.p variants={fadeInUp} className="mb-8">{t("Scan the QR code below to try ShopAlly on your phone")}</motion.p>

        <motion.div variants={fadeInUp} className="flex flex-col items-center gap-6">
          <div className="bg-gray-200 dark:bg-gray-700 p-10 rounded-lg shadow-md w-64 h-64 flex items-center justify-center">
            <span className="text-black font-bold text-lg">QR CODE</span>
          </div>
          <div className="flex gap-4">
            {downloadOptions.map((d) => (
              <motion.a
                key={d.platform}
                href={d.link}
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 bg-[#FFD300] text-black font-semibold px-4 py-2 rounded shadow"
              >
                <span>{d.icon}</span>
                {t(d.platform)}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
