'use client';

import { motion, Variants } from "framer-motion";
import { useDarkMode } from "@/app/components/ProfileComponents/DarkModeContext";
import { useLanguage } from "@/hooks/useLanguage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Header() {
  const { isDarkMode } = useDarkMode();
  const { t } = useLanguage();
  const router = useRouter();

  const navItems = ["Features", "How It Works", "Demo", "Testimonials"];
  const [activeSection, setActiveSection] = useState<string>("");

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  // Scrollspy effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; 
      let currentSection = "";

      navItems.forEach((label) => {
        const section = document.getElementById(label.toLowerCase().replace(/\s/g, '-'));
        if (section) {
          const offsetTop = section.offsetTop;
          const offsetHeight = section.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            currentSection = label;
          }
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        {navItems.map((label, i) => {
          const id = label.toLowerCase().replace(/\s/g, '-');
          const isActive = activeSection === label;

          return (
            <motion.a
              key={i}
              href={`#${id}`}
              variants={fadeInUp}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(id);
              }}
              className={`transition-colors cursor-pointer ${
                isActive ? "text-[#FFD300]" : "text-gray-700 hover:text-[#FFD300]"
              }`}
            >
              {t(label)}
            </motion.a>
          );
        })}
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
