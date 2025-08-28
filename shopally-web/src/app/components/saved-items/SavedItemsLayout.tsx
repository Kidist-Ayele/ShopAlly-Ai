"use client";

import { useDarkMode } from "@/app/components/saved-items/DarkModeContext";
import OfflineAlert from "@/app/components/saved-items/OfflineAlert";
export default function SavedItemsLayout({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`min-h-screen flex transition-colors ${isDarkMode ? "bg-[#090C11]" : "bg-gray-50"}`}>
      {/* SideNavBar */}

      {/* Right content */}
      <main className="flex-1 p-6 lg:p-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-[#0D2A4B]"}`}>
            Saved Items <span className="text-gray-500 text-base">(6 items saved)</span>
          </h1>
          <button className="px-4 py-2 rounded-lg bg-[#0D2A4B] text-white hover:bg-[#133864] transition">
            Clear All
          </button>
        </div>

        {/* Offline Alert */}
        <OfflineAlert />

        {children}
      </main>
    </div>
  );
}
