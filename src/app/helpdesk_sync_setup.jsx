// components/HelpdeskSyncSetup.jsx
"use client";
import React, { useState } from "react";

const helpdeskTools = [
  { name: "Jira Service Management", key: "jira" },
  { name: "Zendesk", key: "zendesk" },
  { name: "Freshservice", key: "freshservice" },
  { name: "ConnectWise", key: "connectwise" }
];

export default function HelpdeskSyncSetup() {
  const [selected, setSelected] = useState(null);
  const [connected, setConnected] = useState({});

  const handleConnect = (tool) => {
    alert(`Connecting to ${tool.name}... (OAuth flow or API token step here)`);
    setConnected((prev) => ({ ...prev, [tool.key]: true }));
  };

  return (
    <div className="p-6 bg-white border rounded shadow space-y-4">
      <h2 className="text-xl font-bold text-blue-700">Two-Way Helpdesk Integration</h2>
      <p className="text-sm text-gray-600">
        Connect your current helpdesk to sync tickets and resolution logs in real time.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        {helpdeskTools.map((tool) => (
          <div key={tool.key} className="border p-4 rounded bg-gray-50">
            <h3 className="text-md font-semibold text-gray-800">{tool.name}</h3>
            {connected[tool.key] ? (
              <p className="text-sm text-green-600 mt-2">✅ Connected</p>
            ) : (
              <button
                onClick={() => handleConnect(tool)}
                className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm"
              >
                Connect
              </button>
            )}
          </div>
        ))}
      </div>

      {selected && (
        <div className="mt-6 text-sm text-blue-700">
          Selected tool: <strong>{selected.name}</strong>
        </div>
      )}
    </div>
  );
}
