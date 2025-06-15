// components/QuickIssueInput.jsx
"use client";
import React, { useState } from "react";

const commonIssues = [
  "Can't connect to internet",
  "Printer not responding",
  "Outlook email delays",
  "Shared folder not accessible",
  "Slow Wi-Fi performance"
];

export default function QuickIssueInput({ onSelectIssue }) {
  const [selectedIssue, setSelectedIssue] = useState("");

  const handleSelect = (e) => {
    const value = e.target.value;
    setSelectedIssue(value);
    if (onSelectIssue) onSelectIssue(value);
  };

  return (
    <div className="p-4 bg-white border rounded shadow">
      <h2 className="text-xl font-bold mb-2">Quick Issue Selector</h2>
      <p className="text-sm text-gray-600 mb-4">Choose a common problem to start guided troubleshooting.</p>
      <select
        value={selectedIssue}
        onChange={handleSelect}
        className="border rounded p-2 w-full"
      >
        <option value="">-- Select an Issue --</option>
        {commonIssues.map((issue, idx) => (
          <option key={idx} value={issue}>{issue}</option>
        ))}
      </select>

      {selectedIssue && (
        <div className="mt-4 text-sm text-blue-700">
          You selected: <strong>{selectedIssue}</strong>
        </div>
      )}
    </div>
  );
}
