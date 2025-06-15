// components/TrialBanner.jsx
"use client";
import React, { useEffect, useState } from "react";

export default function TrialBanner() {
  const [daysLeft, setDaysLeft] = useState(null);
  const [isTrialExpired, setIsTrialExpired] = useState(false);

  useEffect(() => {
    // Mocked trial logic using localStorage for MVP
    const startDate = localStorage.getItem("trialStart");
    if (!startDate) {
      const today = new Date();
      localStorage.setItem("trialStart", today.toISOString());
      setDaysLeft(14);
    } else {
      const start = new Date(startDate);
      const now = new Date();
      const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
      const remaining = 14 - diff;
      setDaysLeft(remaining);
      setIsTrialExpired(remaining <= 0);
    }
  }, []);

  if (isTrialExpired) {
    return (
      <div className="bg-red-100 border border-red-300 text-red-800 p-3 rounded">
        <p>Your 14-day free trial has expired. Upgrade to continue using Pro features.</p>
      </div>
    );
  }

  return (
    <div className="bg-green-100 border border-green-300 text-green-800 p-3 rounded">
      <p>
        You are currently on a free trial. <strong>{daysLeft}</strong> day{daysLeft !== 1 && "s"} remaining.
        Upgrade anytime to unlock permanent access.
      </p>
    </div>
  );
}
