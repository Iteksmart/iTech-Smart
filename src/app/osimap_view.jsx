// components/OSIMapView.jsx
"use client";
import React from "react";

const osiLayers = [
  { name: "Physical", status: "ok" },
  { name: "Data Link", status: "ok" },
  { name: "Network", status: "ok" },
  { name: "Transport", status: "warn" },
  { name: "Session", status: "ok" },
  { name: "Presentation", status: "ok" },
  { name: "Application", status: "fail" }
];

const statusColors = {
  ok: "bg-green-500",
  warn: "bg-yellow-400",
  fail: "bg-red-500"
};

export default function OSIMapView() {
  return (
    <div className="p-6 bg-white border rounded shadow">
      <h2 className="text-xl font-bold text-blue-700 mb-4">OSI Layer Diagnostic Map</h2>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 text-center">
        {osiLayers.map((layer, idx) => (
          <div key={idx} className="space-y-2">
            <div className={`w-6 h-6 mx-auto rounded-full ${statusColors[layer.status]}`}></div>
            <p className="text-sm text-gray-700 font-medium">{layer.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
