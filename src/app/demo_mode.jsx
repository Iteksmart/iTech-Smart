// components/DemoNotice.jsx
"use client";
import React, { useEffect, useState } from "react";

export default function DemoNotice() {
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const isDemoSession = url.searchParams.get("demo") === "true";
    setIsDemo(isDemoSession);
  }, []);

  if (!isDemo) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 p-3 rounded text-sm mt-4">
      <p>
        You are using <strong>Demo Mode</strong>. Some features may be limited, and data will not be saved.
      </p>
    </div>
  );
}
