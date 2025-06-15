// components/PlaybookChecklist.jsx
"use client";
import React, { useState } from "react";

const samplePlaybooks = {
  "Internet Not Working": [
    "Check physical cable connection",
    "Verify IP address with ipconfig",
    "Ping gateway and external server",
    "Flush DNS cache",
    "Restart router/modem"
  ],
  "Printer Not Responding": [
    "Ping printer IP",
    "Restart print spooler service",
    "Check printer cables",
    "Verify printer is online in settings"
  ]
};

export default function PlaybookChecklist() {
  const [selectedPlaybook, setSelectedPlaybook] = useState("");
  const [completedSteps, setCompletedSteps] = useState({});

  const handleToggle = (step) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [step]: !prev[step]
    }));
  };

  const steps = samplePlaybooks[selectedPlaybook] || [];

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Troubleshooting Playbooks</h2>
      <p className="text-sm text-gray-500">Select a playbook and track progress through its steps.</p>
      <select
        className="border p-2 rounded w-full"
        value={selectedPlaybook}
        onChange={(e) => setSelectedPlaybook(e.target.value)}
      >
        <option value="">-- Select a Playbook --</option>
        {Object.keys(samplePlaybooks).map((title) => (
          <option key={title} value={title}>{title}</option>
        ))}
      </select>

      {steps.length > 0 && (
        <ul className="space-y-2 mt-4">
          {steps.map((step, index) => (
            <li key={index} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!completedSteps[step]}
                onChange={() => handleToggle(step)}
              />
              <span className={completedSteps[step] ? "line-through text-gray-500" : "text-gray-800"}>{step}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
