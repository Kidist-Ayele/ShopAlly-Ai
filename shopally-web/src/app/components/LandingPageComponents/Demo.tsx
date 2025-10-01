"use client";

import { forwardRef } from "react";
import { motion, Variants } from "framer-motion";
import { useDarkMode } from "@/app/components/ProfileComponents/DarkModeContext";
import { useLanguage } from "@/hooks/useLanguage";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Demo = forwardRef<HTMLDivElement>((props, ref) => {
  const { isDarkMode } = useDarkMode();
  const { t } = useLanguage();

  return (
    <section
      ref={ref}
      id="demo"
      className={`py-20 px-6 text-center ${
        isDarkMode ? "bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]" : "bg-white text-[#262B32]"
      }`}
    >
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: false }}>
        <motion.h2 variants={fadeInUp} className="text-2xl font-bold mb-2">
          {t("See ShopAlly in Action")}
        </motion.h2>
        <motion.p variants={fadeInUp} className="mb-8">
          {t("Affordable shopping made simple")}
        </motion.p>

        <motion.div
          variants={fadeInUp}
          className={`max-w-5xl mx-auto p-12 rounded-xl shadow-lg relative ${
            isDarkMode ? "bg-[var(--color-card-bg)]" : "bg-[#F7F9FB]"
          }`}
        >
          <div className="text-2xl md:text-3xl font-semibold mb-4">{t("ShopAlly Demo Video")}</div>
          <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center bg-gray-300 dark:bg-gray-700">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.96 }}
                className="bg-[#FFD300] w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-2xl shadow-lg"
                aria-label="Play demo"
              >
                ▶️
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
});

Demo.displayName = "Demo";

export default Demo;
