"use client";

import { motion, Variants } from "framer-motion";
import { useDarkMode } from "@/app/components/ProfileComponents/DarkModeContext";
import { useLanguage } from "@/hooks/useLanguage";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Footer() {
  const { isDarkMode } = useDarkMode();
  const { t } = useLanguage();

  return (
    <footer className={`px-6 py-10 ${isDarkMode ? "bg-gray-900 text-white" : "bg-[#090C11] text-white"}`}>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: false }} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <motion.div variants={fadeInUp}>
          <h3 className="font-bold mb-2">ShopAlly</h3>
          <p>{t("Your AI-powered shopping assistant that makes online shopping in Ethiopia smarter, faster, and more affordable.")}</p>
          <div className="flex gap-4 text-xl mt-4">
            <span>🐦</span>
            <span>📘</span>
            <span>📷</span>
          </div>
        </motion.div>
        <motion.div variants={fadeInUp}>
          <h3 className="font-bold mb-2">{t("Quick Links")}</h3>
          <ul className="space-y-1 text-sm">
            {["Features", "How It Works", "Demo", "Testimonials", "Download", "Contact"].map((link) => (
              <li key={link}><a href={`#${link.toLowerCase().replace(/\s/g, '-')}`}>{t(link)}</a></li>
            ))}
          </ul>
        </motion.div>
        <motion.div variants={fadeInUp}>
          <h3 className="font-bold mb-2">{t("Follow Us")}</h3>
          <p className="text-sm">{t("Stay updated with the latest features and shopping tips from ShopAlly.")}</p>
        </motion.div>
      </motion.div>
      <motion.p variants={fadeInUp} className="text-xs text-center mt-8">
        © 2025 ShopAlly. {t("All rights reserved.")}
      </motion.p>
    </footer>
  );
}
