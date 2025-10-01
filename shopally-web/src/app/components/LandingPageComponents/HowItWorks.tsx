"use client";

import { motion, Variants } from "framer-motion";
import { useDarkMode } from "@/app/components/ProfileComponents/DarkModeContext";
import { useLanguage } from "@/hooks/useLanguage";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const sectionStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function HowItWorks() {
  const { isDarkMode } = useDarkMode();
  const { t } = useLanguage();

  const steps = [
    {
      step: 1,
      title: t("Chat Screenshot"),
      caption: t("Ask ShopAlly"),
      desc: t("Simply chat with our AI assistant about what you’re looking for."),
    },
    {
      step: 2,
      title: t("Product Suggestions ETB"),
      caption: t("Get Curated Suggestions"),
      desc: t("Receive personalized product recommendations."),
    },
    {
      step: 3,
      title: t("Compare Save Buy"),
      caption: t("Compare & Buy"),
      desc: t("Review comparisons, save favorites, and buy easily."),
    },
  ];

  return (
    <section
      id="how-it-works"
      className={`py-16 px-6 text-center ${
        isDarkMode ? "bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]" : "bg-[#F7F9FB] text-[#262B32]"
      }`}
    >
      <motion.div
        variants={sectionStagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        className="max-w-6xl mx-auto"
      >
        <motion.h2 variants={fadeInUp} className="text-2xl font-bold mb-2">{t("How ShopAlly Works")}</motion.h2>
        <motion.p variants={fadeInUp} className="mb-12">{t("Three simple steps to smarter shopping in Ethiopia")}</motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              className={`bg-white dark:bg-[var(--color-card-bg)] p-6 rounded shadow-md text-left relative`}
            >
              <div className="absolute -top-4 -left-4 bg-[#FFD300] w-8 h-8 text-black font-bold rounded-full flex items-center justify-center">
                {step.step}
              </div>
              <h4 className="font-bold text-[#262B32] dark:text-white mb-2">{step.title}</h4>
              <p className="font-semibold">{step.caption}</p>
              <p className="text-sm mt-2">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
