// components/OSIFlow.jsx
"use client";
import React, { useState } from "react";

const osiLayers = [
  { name: "Physical", description: "Check cables, hardware connections, power" },
  { name: "Data Link", description: "Check MAC address tables, NIC status" },
  { name: "Network", description: "Run ping, traceroute, check IP routes" },
  { name: "Transport", description: "Verify TCP/UDP port access, use netstat" },
  { name: "Session", description: "Check sessions, authentication services" },
  { name: "Presentation", description: "Look at data formatting, SSL/TLS issues" },
  { name: "Application", description: "Inspect DNS, HTTP, SMTP, app-layer services" },
];

export default function OSIFlow() {
  const [activeLayer, setActiveLayer] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");

  const handleDiagnose = (layer) => {
    setActiveLayer(layer.name);
    // Placeholder AI suggestion
    setDiagnosis(`Suggested test for ${layer.name}: ${layer.description}.\nRecommended command: example-command-${layer.name.toLowerCase()}`);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">OSI Troubleshooting Flow</h2>
      <p className="text-sm text-gray-500">Step through the OSI model to diagnose issues layer by layer.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {osiLayers.map((layer) => (
          <div
            key={layer.name}
            className={`border p-4 rounded-xl shadow hover:shadow-md cursor-pointer transition ${
              activeLayer === layer.name ? "border-blue-500 bg-blue-50" : "border-gray-200"
            }`}
            onClick={() => handleDiagnose(layer)}
          >
            <h3 className="font-semibold text-lg">{layer.name} Layer</h3>
            <p className="text-sm text-gray-600">{layer.description}</p>
          </div>
        ))}
      </div>
      {diagnosis && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          <h4 className="font-semibold text-md mb-2 text-blue-700">AI Diagnosis</h4>
          <pre className="text-sm whitespace-pre-wrap text-gray-800">{diagnosis}</pre>
        </div>
      )}
    </div>
  );
}
