// components/RepeatOffenderTags.jsx
"use client";
import React, { useEffect, useState } from "react";

const mockIssues = [
  { device: "PC-101", issue: "Outlook crash", count: 4 },
  { device: "PC-102", issue: "VPN drop", count: 1 },
  { device: "PC-103", issue: "Printer error", count: 3 },
  { device: "PC-101", issue: "Outlook crash", count: 2 },
  { device: "PC-103", issue: "Printer error", count: 2 }
];

export default function RepeatOffenderTags() {
  const [tagged, setTagged] = useState([]);

  useEffect(() => {
    const counts = {};
    mockIssues.forEach(({ device, issue, count }) => {
      const key = `${device}|${issue}`;
      counts[key] = (counts[key] || 0) + count;
    });
    const offenders = Object.entries(counts)
      .filter(([_, c]) => c >= 3)
      .map(([key, count]) => {
        const [device, issue] = key.split("|");
        return { device, issue, count };
      });
    setTagged(offenders);
  }, []);

  return (
    <div className="p-4 border rounded bg-white shadow space-y-4">
      <h2 className="text-xl font-bold text-blue-700">🚩 Repeat Offender Devices</h2>
      <ul className="text-sm space-y-2">
        {tagged.map((t, i) => (
          <li key={i} className="border p-3 rounded bg-red-50">
            <strong className="text-red-700">{t.device}</strong> has triggered <em>{t.issue}</em> {t.count} times
          </li>
        ))}
      </ul>
    </div>
  );
}
