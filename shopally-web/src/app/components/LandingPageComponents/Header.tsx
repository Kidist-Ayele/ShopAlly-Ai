"use client";

import { motion, Variants } from "framer-motion";
import { useDarkMode } from "@/app/components/ProfileComponents/DarkModeContext";
import { useLanguage } from "@/hooks/useLanguage";
import { useRouter } from "next/navigation";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Header() {
  const { isDarkMode } = useDarkMode();
  const { t } = useLanguage();
  const router = useRouter();

  const navItems = ["Features", "How It Works", "Demo", "Testimonials", "Download"];

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`flex justify-between items-center px-6 py-4 border-b sticky top-0 z-50 backdrop-blur ${
        isDarkMode ? "bg-[var(--color-bg-primary)] border-gray-700" : "bg-white border-[#E5E7EB]"
      }`}
    >
      {/* Logo + Text */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        className="flex items-center justify-center lg:justify-start gap-2 font-bold text-xl"
      >
        <div className="w-6 h-6 lg:w-8 lg:h-8 bg-[#FFD300] rounded flex items-center justify-center">
          <img
            src="WebsiteLogo/Frame.png"
            alt="ShopAlly Logo"
            className="object-contain w-4 h-4 lg:w-5 lg:h-5"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const fallback = document.createElement("span");
              fallback.textContent = "S";
              fallback.className = "text-black font-bold text-sm";
              e.currentTarget.parentNode?.appendChild(fallback);
            }}
          />
        </div>
        <span
          className="text-xl font-bold transition-colors hidden lg:block"
          style={{ color: "var(--color-text-primary)" }}
        >
          ShopAlly
        </span>
      </motion.div>

      {/* Navigation */}
      <nav className="hidden md:flex gap-6 text-sm font-medium">
        {navItems.map((label, i) => (
          <motion.a
            key={i}
            href={`#${label.toLowerCase().replace(/\s/g, '-')}`}
            variants={fadeInUp}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(label.toLowerCase().replace(/\s/g, '-'));
            }}
            className="hover:text-[#FFD300]"
          >
            {t(label)}
          </motion.a>
        ))}
      </nav>

      {/* Get Started Button */}
      <motion.button
        variants={fadeInUp}
        initial={{ y: 0 }}
        animate={{ y: [0, -4, 0, 4, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        onClick={() => router.push("/signin")}
        className="bg-[#FFD300] text-black px-4 py-2 rounded font-semibold text-sm shadow-lg hover:scale-105 transition-transform"
      >
        {t("Get Started")}
      </motion.button>
    </header>
  );
}
