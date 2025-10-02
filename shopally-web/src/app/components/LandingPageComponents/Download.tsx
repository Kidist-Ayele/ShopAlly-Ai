"use client";

import { motion, Variants } from "framer-motion";
import { useDarkMode } from "@/app/components/ProfileComponents/DarkModeContext";
import { useLanguage } from "@/hooks/useLanguage";
import { QRCodeCanvas } from "qrcode.react";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const downloadOptions = [
  { platform: "Google Play", icon: "📱", link: "https://shop-ally-ai.vercel.app/" },
  { platform: "App Store", icon: "🍏", link: "https://shop-ally-ai.vercel.app/" },
];

export default function Download() {
  const { isDarkMode } = useDarkMode();
  const { t } = useLanguage();

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
          <div className="bg-[#FFD300] p-6 rounded-lg shadow-md flex items-center justify-center">
            <QRCodeCanvas
              value="https://shop-ally-ai.vercel.app/"
              size={200}
              bgColor="#FFFFFF"  // White background inside QR for clarity
              fgColor="#000000"  // Black QR code
              includeMargin={true}
            />
          </div>

          <div className="flex gap-4">
            {downloadOptions.map((d) => (
              <motion.a
                key={d.platform}
                href={d.link}
                target="_blank"
                rel="noopener noreferrer"
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
