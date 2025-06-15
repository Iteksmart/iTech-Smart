// components/IssuePatternRecognition.jsx
"use client";
import React, { useEffect, useState } from "react";

// Simulated recent issue logs (could be fetched from backend or logs)
const recentIssues = [
  "Outlook disconnects",
  "Outlook disconnects",
  "Outlook disconnects",
  "Printer offline",
  "VPN timeout",
  "Outlook disconnects",
  "Printer offline",
  "VPN timeout",
  "Outlook disconnects",
  "VPN timeout"
];

// Simulated system scan result (lightweight agent)
const systemInfo = {
  hostname: "Tech-PC01",
  ip: "192.168.1.45",
  os: "Windows 10 Pro",
  antivirus: "Enabled",
  disk: "82% used",
  network: "Stable"
};

export default function IssuePatternRecognition() {
  const [patterns, setPatterns] = useState([]);

  useEffect(() => {
    const freqMap = {};
    recentIssues.forEach((issue) => {
      freqMap[issue] = (freqMap[issue] || 0) + 1;
    });

    const detected = Object.entries(freqMap)
      .filter(([_, count]) => count >= 3)
      .map(([issue, count]) => ({ issue, count }));

    setPatterns(detected);
  }, []);

  return (
    <div className="p-6 border rounded bg-white shadow space-y-6">
      <div>
        <h2 className="text-xl font-bold text-blue-700">Issue Pattern Recognition</h2>
        <p className="text-sm text-gray-600">AI-detected issue trends across recent tickets.</p>

        {patterns.length > 0 ? (
          <ul className="list-disc list-inside text-sm text-gray-800 space-y-2">
            {patterns.map((p, i) => (
              <li key={i}>
                ⚠️ <strong>{p.issue}</strong> occurred <strong>{p.count}</strong> times — Possible shared root cause.
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-green-600">No recurring issues detected in recent logs.</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold text-blue-700">Live System Snapshot</h2>
        <p className="text-sm text-gray-600">Collected via lightweight diagnostic agent.</p>
        <ul className="list-inside list-disc text-sm text-gray-800 space-y-1">
          <li><strong>Hostname:</strong> {systemInfo.hostname}</li>
          <li><strong>IP Address:</strong> {systemInfo.ip}</li>
          <li><strong>Operating System:</strong> {systemInfo.os}</li>
          <li><strong>Antivirus:</strong> {systemInfo.antivirus}</li>
          <li><strong>Disk Usage:</strong> {systemInfo.disk}</li>
          <li><strong>Network Status:</strong> {systemInfo.network}</li>
        </ul>
      </div>
    </div>
  );
}
