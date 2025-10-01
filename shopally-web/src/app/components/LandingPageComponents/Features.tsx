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

export default function Features() {
  const { isDarkMode } = useDarkMode();
  const { t } = useLanguage();

  const features = [
    { icon: "🌍", title: "Bilingual Support", desc: "Amharic & English language support for seamless shopping." },
    { icon: "💰", title: "ETB-Aware Pricing", desc: "Live foreign exchange updates ensure accurate pricing." },
    { icon: "📊", title: "Compare & Save", desc: "Side-by-side product analysis to help you save." },
    { icon: "🔒", title: "Official API Integration", desc: "Secure integration with Alibaba/AliExpress APIs." },
    { icon: "🖼️", title: "Image Search", desc: "Find products by uploading or searching with a photo." },
    { icon: "🔔", title: "Price Alerts", desc: "Receive notifications when product prices drop." },
  ];

  return (
    <section className={`py-16 px-6 ${isDarkMode ? "bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]" : "bg-white text-[#262B32]"}`}>
      <motion.div variants={sectionStagger} initial="hidden" whileInView="visible" className="max-w-7xl mx-auto text-center">
        <motion.h2 variants={fadeInUp} className="text-2xl font-bold mb-6">{t("Why Choose ShopAlly?")}</motion.h2>
        <motion.p variants={fadeInUp} className="mb-12">{t("Discover the features that make ShopAlly the smartest shopping companion for Ethiopian consumers.")}</motion.p>
        <div className="overflow-hidden">
          <motion.div className="flex gap-6" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
            {[...features, ...features].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} whileHover={{ scale: 1.05 }} className="min-w-[280px] md:min-w-[300px] bg-white dark:bg-[var(--color-card-bg)] p-8 rounded-lg text-center shadow-lg inline-block">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{t(item.title)}</h3>
                <p className="text-sm">{t(item.desc)}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
