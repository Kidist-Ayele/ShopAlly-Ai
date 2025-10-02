"use client";

import { motion, Variants } from "framer-motion";
import { useDarkMode } from "@/app/components/ProfileComponents/DarkModeContext";
import { useLanguage } from "@/hooks/useLanguage";
import { FaTwitter, FaFacebookF, FaLinkedinIn } from "react-icons/fa";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Footer() {
  const { isDarkMode } = useDarkMode();
  const { t } = useLanguage();

  const quickLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Demo", href: "#demo" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Download", href: "#download" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <footer
      className={`px-6 py-10 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-[#090C11] text-white"
      }`}
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto"
      >
        {/* Left Column */}
        <motion.div variants={fadeInUp}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-[#FFD300] rounded flex items-center justify-center">
              <img
                src="WebsiteLogo/Frame.png"
                alt="ShopAlly Logo"
                className="object-contain w-5 h-5"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const fallback = document.createElement("span");
                  fallback.textContent = "S";
                  fallback.className = "text-black font-bold text-sm";
                  e.currentTarget.parentNode?.appendChild(fallback);
                }}
              />
            </div>
            <h3 className="font-bold text-lg">ShopAlly</h3>
          </div>
          <p className="text-sm">
            {t(
              "Your AI-powered shopping assistant that makes online shopping in Ethiopia smarter, faster, and more affordable."
            )}
          </p>
          <div className="flex gap-4 text-xl mt-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md bg-[#FFD300] text-black hover:opacity-80 transition"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md bg-[#FFD300] text-black hover:opacity-80 transition"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md bg-[#FFD300] text-black hover:opacity-80 transition"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </motion.div>

        {/* Middle Column - Quick Links */}
        <motion.div variants={fadeInUp}>
          <h3 className="font-bold mb-2">{t("Quick Links")}</h3>
          <ul className="space-y-1 text-sm">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="hover:text-[#FFD300] transition-colors"
                >
                  {t(link.label)}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Right Column */}
        <motion.div variants={fadeInUp}>
          <h3 className="font-bold mb-2">{t("Follow Us")}</h3>
          <p className="text-sm mb-4">
            {t(
              "Stay updated with the latest features and shopping tips from ShopAlly."
            )}
          </p>
          {/* Logo again in yellow */}
          <div className="w-8 h-8 bg-[#FFD300] rounded flex items-center justify-center">
            <img
              src="WebsiteLogo/Frame.png"
              alt="ShopAlly Logo"
              className="object-contain w-5 h-5"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const fallback = document.createElement("span");
                fallback.textContent = "S";
                fallback.className = "text-black font-bold text-sm";
                e.currentTarget.parentNode?.appendChild(fallback);
              }}
            />
          </div>
        </motion.div>
      </motion.div>

      <motion.p
        variants={fadeInUp}
        className="text-xs text-center mt-8 text-gray-400"
      >
        © 2025 ShopAlly. {t("All rights reserved.")}
      </motion.p>
    </footer>
  );
}
