"use client";

import React, { useState } from "react";

export default function ToggleSwitch({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [enabled, setEnabled] = useState(defaultChecked);

  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors duration-300 ${
        enabled ? "bg-[#FFD300]" : "bg-gray-300"
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}
