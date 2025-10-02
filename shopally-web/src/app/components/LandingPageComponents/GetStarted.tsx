"use client";

import { useRouter } from "next/navigation";
import { useDarkMode } from "@/app/components/ProfileComponents/DarkModeContext";
import { useLanguage } from "@/hooks/useLanguage";
import { motion } from "framer-motion";

export default function GetStarted() {
  const { isDarkMode } = useDarkMode();
  const { t } = useLanguage();
  const router = useRouter();

  return (
    <section
      className={`w-full py-20 px-4 flex flex-col items-center text-center ${
        isDarkMode
          ? "bg-[#FFD300] text-[#262B32]"
          : "bg-[#FFD300] text-[#262B32]"
      }`}
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-5xl font-bold mb-4"
      >
        {t("Start shopping smarter today with")}{" "}
        <span className="text-[#262B32]">ShopAlly</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-lg md:text-xl mb-8"
      >
        {t(
          "Join thousands of Ethiopian shoppers who save time and money every day"
        )}
      </motion.p>

      <motion.button
        onClick={() => router.push("/signin")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="bg-[#262B32] text-white px-6 py-3 rounded shadow-lg font-semibold transition"
      >
        {t("Try ShopAlly Now")}
      </motion.button>
    </section>
  );
}
