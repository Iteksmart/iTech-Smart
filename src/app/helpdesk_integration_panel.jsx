// components/HelpdeskIntegrationPanel.jsx
"use client";
import React, { useState } from "react";

const integrations = [
  {
    name: "Jira",
    status: "Available",
    description: "Create or sync tickets directly with your Jira board."
  },
  {
    name: "Zendesk",
    status: "Coming Soon",
    description: "Push resolution notes and ticket metadata to Zendesk."
  },
  {
    name: "Freshdesk",
    status: "Coming Soon",
    description: "Connect to Freshdesk and streamline support workflows."
  }
];

export default function HelpdeskIntegrationPanel() {
  const [connected, setConnected] = useState(false);

  const handleConnect = (name) => {
    if (name === "Jira") {
      setConnected(true);
      alert("Connected to Jira successfully!");
    }
  };

  return (
    <div className="p-6 border rounded bg-white shadow space-y-6">
      <h2 className="text-xl font-bold text-blue-700">Helpdesk Integrations</h2>
      <p className="text-sm text-gray-600">Connect your favorite support tools for streamlined workflows.</p>

      <ul className="space-y-4">
        {integrations.map((tool, i) => (
          <li key={i} className="border p-4 rounded bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-md font-semibold text-gray-800">{tool.name}</h3>
                <p className="text-sm text-gray-500">{tool.description}</p>
              </div>
              <div>
                {tool.status === "Available" ? (
                  <button
                    onClick={() => handleConnect(tool.name)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                  >
                    {connected ? "Connected" : "Connect"}
                  </button>
                ) : (
                  <span className="text-xs text-yellow-600">{tool.status}</span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
