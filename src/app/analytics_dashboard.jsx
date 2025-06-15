// components/AnalyticsDashboard.jsx
"use client";
import React, { useEffect, useState } from "react";

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState({
    ticketsResolved: 0,
    commandsUsed: 0,
    avgResolutionTime: "--",
    commonIssues: []
  });

  useEffect(() => {
    // Simulated analytics pull
    const demoStats = {
      ticketsResolved: 42,
      commandsUsed: 97,
      avgResolutionTime: "4m 35s",
      commonIssues: [
        "Can't connect to internet",
        "Printer not responding",
        "Slow Wi-Fi"
      ]
    };
    setStats(demoStats);
  }, []);

  return (
    <div className="p-6 bg-white border rounded shadow space-y-6">
      <h2 className="text-xl font-bold text-blue-700">Team Analytics Dashboard</h2>
      <div className="grid md:grid-cols-3 gap-6 text-center">
        <div>
          <p className="text-3xl font-bold text-blue-600">{stats.ticketsResolved}</p>
          <p className="text-sm text-gray-600">Tickets Resolved</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-blue-600">{stats.commandsUsed}</p>
          <p className="text-sm text-gray-600">Commands Suggested</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-blue-600">{stats.avgResolutionTime}</p>
          <p className="text-sm text-gray-600">Avg. Resolution Time</p>
        </div>
      </div>

      <div>
        <h3 className="text-md font-semibold text-gray-800 mt-4 mb-2">Top Issues</h3>
        <ul className="list-disc list-inside text-sm text-gray-700">
          {stats.commonIssues.map((issue, i) => (
            <li key={i}>{issue}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
