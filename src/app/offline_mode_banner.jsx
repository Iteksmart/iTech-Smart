// components/OfflineModeBanner.jsx
"use client";
import React, { useEffect, useState } from "react";

export default function OfflineModeBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const updateStatus = () => setOffline(!navigator.onLine);
    updateStatus();
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="bg-yellow-100 text-yellow-800 border border-yellow-300 px-4 py-2 text-sm text-center">
      ⚠️ You’re currently offline. Changes will be saved locally until you reconnect.
    </div>
  );
}
