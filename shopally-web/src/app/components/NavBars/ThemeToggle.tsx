//src/app/components/ThemeToggle.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) {
      console.log("Current theme:", resolvedTheme);
    }
  }, [resolvedTheme, mounted]);

  if (!mounted)
    return (
      <button
        className="bg-brand-white border-brand-gray dark:bg-brand-dark dark:border-brand-yellow p-2"
        onClick={() => setTheme("light")}
      >
        <FiSun className="text-brand-dark" />
      </button>
    );

  if (resolvedTheme === "dark") {
    return (
      <button
        className="bg-brand-dark border-brand-yellow p-2"
        onClick={() => setTheme("light")}
      >
        <FiSun className="text-brand-yellow" />
      </button>
    );
  }

  if (resolvedTheme === "light") {
    return (
      <button
        className="bg-brand-white border-brand-gray p-2"
        onClick={() => setTheme("dark")}
      >
        <FiMoon className="text-brand-dark" />
      </button>
    );
  }
}
