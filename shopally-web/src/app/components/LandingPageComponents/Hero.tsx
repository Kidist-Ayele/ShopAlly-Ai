"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { useDarkMode } from "@/app/components/ProfileComponents/DarkModeContext";
import { useLanguage } from "@/hooks/useLanguage";
import { useRouter } from "next/navigation";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Hero() {
  const { isDarkMode } = useDarkMode();
  const { t } = useLanguage();
  const router = useRouter();

  const scrollToDemo = () => {
    // Use a short timeout to ensure the element exists
    setTimeout(() => {
      const demoSection = document.getElementById("demo");
      if (demoSection) {
        demoSection.scrollIntoView({ behavior: "smooth" });
      } else {
        console.warn("Demo section not found!");
      }
    }, 50);
  };

  return (
    <section
      className={`flex flex-col-reverse md:flex-row items-center justify-between px-6 py-16 max-w-7xl mx-auto ${
        isDarkMode
          ? "bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]"
          : "bg-white text-[#262B32]"
      }`}
    >
      <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" className="md:w-1/2 space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold">
          {t("Shop Smarter in Ethiopia with")} <span className="text-[#FFD300]">ShopAlly</span>
        </h1>
        <p>
          {t("Your AI-powered shopping assistant that finds the best products, compares prices in ETB, and saves you time.")}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {t("Supports Image Search – find products by uploading a photo!")}
        </p>

        <div className="flex gap-4 mt-4">
          <motion.button
            onClick={() => router.push("/signin")}
            animate={{ y: [0, -4, 0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#FFD300] text-black px-6 py-3 rounded font-semibold shadow-lg"
          >
            {t("Get Started")}
          </motion.button>

          <motion.button
            onClick={scrollToDemo}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="border border-[#262B32] text-[#262B32] px-6 py-3 rounded font-semibold"
          >
            {t("Watch Demo")}
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        className="md:w-1/2"
        animate={{ x: [0, 100, 0, -100, 0], rotate: [0, 0, 360, 0, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      >
        <Image src="/landing/cart.png" alt="App Mockup" width={400} height={400} priority />
      </motion.div>
    </section>
  );
}
