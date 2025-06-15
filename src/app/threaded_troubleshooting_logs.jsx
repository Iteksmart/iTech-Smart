// components/ThreadedLogs.jsx
"use client";
import React, { useEffect, useState } from "react";

const mockThreadedLog = [
  { type: "input", text: "Issue reported: Can't connect to the internet." },
  { type: "ai", text: "Start at OSI Layer 1: Check Ethernet cable connection." },
  { type: "user", text: "Cable is securely connected." },
  { type: "ai", text: "Move to Layer 3: Try 'ping 8.8.8.8'." },
  { type: "user", text: "Ping returned successful replies." },
  { type: "ai", text: "DNS issue suspected. Run 'ipconfig /flushdns'." },
  { type: "user", text: "Ran flushdns. Site loads now." },
  { type: "ai", text: "Issue resolved. Logging steps to ticket notes." }
];

export default function ThreadedLogs() {
  const [log, setLog] = useState([]);

  useEffect(() => {
    // Pull from localStorage or use mock
    const saved = JSON.parse(localStorage.getItem("threadedLog") || "null");
    setLog(saved || mockThreadedLog);
  }, []);

  return (
    <div className="p-4 border rounded bg-white shadow space-y-4">
      <h2 className="text-xl font-bold text-blue-700">Troubleshooting Log Timeline</h2>
      <div className="space-y-3 text-sm">
        {log.map((entry, i) => (
          <div
            key={i}
            className={`p-3 rounded border ${
              entry.type === "ai"
                ? "bg-blue-50 border-blue-300 text-blue-800"
                : entry.type === "user"
                ? "bg-green-50 border-green-300 text-green-800"
                : "bg-gray-50 border-gray-300 text-gray-700"
            }`}
          >
            <strong className="block mb-1 capitalize">{entry.type}:</strong>
            {entry.text}
          </div>
        ))}
      </div>
    </div>
  );
}
