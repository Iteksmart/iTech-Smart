// components/PrivacyConsentBanner.jsx
"use client";
import React, { useEffect, useState } from "react";

export default function PrivacyConsentBanner() {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("privacyConsent");
    if (consent === "accepted") setAccepted(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("privacyConsent", "accepted");
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white text-sm px-4 py-3 flex flex-col md:flex-row items-center justify-between z-50">
      <p className="mb-2 md:mb-0">
        We use cookies and local storage to enhance your experience. See our{' '}
        <a href="/privacy" className="underline text-blue-300" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </a>{' '}for details.
      </p>
      <button
        onClick={handleAccept}
        className="bg-blue-600 px-4 py-1 rounded text-white text-sm hover:bg-blue-700"
      >
        Accept
      </button>
    </div>
  );
}
