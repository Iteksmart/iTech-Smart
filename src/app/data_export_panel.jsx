// components/DataExportPanel.jsx
"use client";
import React, { useState } from "react";

export default function DataExportPanel() {
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    const ticketNotes = JSON.parse(localStorage.getItem("ticketNotes") || "[]");
    const sessions = JSON.parse(localStorage.getItem("savedSessions") || "[]");
    const clients = JSON.parse(localStorage.getItem("clientProfiles") || "[]");

    const data = {
      exportedAt: new Date().toISOString(),
      ticketNotes,
      sessions,
      clients
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ai-it-export-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  return (
    <div className="p-6 border rounded bg-white shadow space-y-4">
      <h2 className="text-xl font-bold text-blue-700">Export Your Data</h2>
      <p className="text-sm text-gray-600">Backup or migrate your stored ticket notes, sessions, and client profiles.</p>

      <button
        onClick={handleExport}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Export to JSON
      </button>

      {exported && (
        <p className="text-green-600 text-sm mt-2">✅ Export complete. Check your downloads.</p>
      )}
    </div>
  );
}
