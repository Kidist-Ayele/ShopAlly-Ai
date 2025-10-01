"use client";

import { motion, Variants } from "framer-motion";
import { useDarkMode } from "@/app/components/ProfileComponents/DarkModeContext";
import { useLanguage } from "@/hooks/useLanguage";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Header() {
  const { isDarkMode } = useDarkMode();
  const { t } = useLanguage();

  return (
    <header className={`flex justify-between items-center px-6 py-4 border-b sticky top-0 z-50 backdrop-blur ${isDarkMode ? "bg-[var(--color-bg-primary)] border-gray-700" : "bg-white border-[#E5E7EB]"}`}>
      <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" className="font-bold text-xl text-[#262B32]">
        ShopAlly
      </motion.div>
      <nav className="hidden md:flex gap-6 text-sm font-medium">
        {["Features", "How It Works", "Demo", "Testimonials", "Download"].map((label, i) => (
          <motion.a
            key={i}
            href={`#${label.toLowerCase().replace(/\s/g, '-')}`}
            variants={fadeInUp}
            className="hover:text-[#FFD300]"
          >
            {t(label)}
          </motion.a>
        ))}
      </nav>
      <motion.button variants={fadeInUp} className="bg-[#FFD300] text-black px-4 py-2 rounded font-semibold text-sm">
        {t("Get Started")}
      </motion.button>
    </header>
  );
}
