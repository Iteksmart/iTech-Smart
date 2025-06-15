// components/UpsellNotice.jsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function UpsellNotice({ featureName = "this feature" }) {
  const router = useRouter();

  const handleUpgrade = () => {
    router.push("/pricing");
  };

  return (
    <div className="border border-yellow-300 bg-yellow-50 p-4 rounded-md shadow-sm mt-4">
      <p className="text-sm text-yellow-800 font-medium">
        Want to unlock <strong>{featureName}</strong>? Upgrade to Pro or Team to access it.
      </p>
      <button
        onClick={handleUpgrade}
        className="mt-2 bg-yellow-600 text-white px-4 py-1 rounded hover:bg-yellow-700"
      >
        Upgrade Now
      </button>
    </div>
  );
}
