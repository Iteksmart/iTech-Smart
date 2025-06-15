// components/DarkModeToggle.jsx
"use client";
import React, { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Dark Mode
      </label>
      <button
        onClick={() => setIsDark(!isDark)}
        className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700 text-xs dark:bg-gray-200 dark:text-black dark:hover:bg-gray-300"
      >
        {isDark ? "On" : "Off"}
      </button>
    </div>
  );
}
