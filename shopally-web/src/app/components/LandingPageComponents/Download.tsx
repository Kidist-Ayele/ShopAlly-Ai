"use client";

import { motion, Variants } from "framer-motion";
import { useDarkMode } from "@/app/components/ProfileComponents/DarkModeContext";
import { useLanguage } from "@/hooks/useLanguage";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Download() {
  const { isDarkMode } = useDarkMode();
  const { t } = useLanguage();
  const router = useRouter();

  return (
    <section
      id="download"
      className={`py-20 px-6 text-center ${
        isDarkMode
          ? "bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]"
          : "bg-white text-[#262B32]"
      }`}
    >
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: false }}>
        <motion.h2 variants={fadeInUp} className="text-2xl font-bold mb-2">
          {t("Download ShopAlly Instantly")}
        </motion.h2>
        <motion.p variants={fadeInUp} className="mb-8">
          {t("Scan the QR code below to try ShopAlly on your phone")}
        </motion.p>

        <motion.div variants={fadeInUp} className="flex flex-col items-center gap-6">
          {/* QR Code with Yellow Background */}
          <div className="bg-[#FFD300] p-6 rounded-lg shadow-md flex items-center justify-center">
            <QRCodeCanvas
              value="https://shop-ally-ai.vercel.app/"
              size={200}
              bgColor="#FFD300"  
              fgColor="#000000" 
              includeMargin={true}
            />
          </div>

          {/* Or Click to Get Started Button */}
          <motion.button
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/signin")}
            className="mt-4 bg-black text-[#FFD300] font-semibold px-6 py-3 rounded shadow-lg hover:scale-105 transition-transform"
          >
            {t("Or Click to Get Started")}
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
