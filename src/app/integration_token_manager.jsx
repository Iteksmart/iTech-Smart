// components/IntegrationTokenManager.jsx
"use client";
import React, { useState } from "react";

const INTEGRATIONS = [
  {
    key: "jira",
    name: "Jira",
    fields: ["email", "apiToken", "domain"]
  },
  {
    key: "zendesk",
    name: "Zendesk",
    fields: ["email", "apiToken", "subdomain"]
  },
  {
    key: "connectwise",
    name: "ConnectWise",
    fields: ["companyId", "publicKey", "privateKey", "baseUrl"]
  }
];

export default function IntegrationTokenManager() {
  const [formData, setFormData] = useState({});
  const [activeIntegration, setActiveIntegration] = useState(null);
  const [status, setStatus] = useState("");

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTest = () => {
    setStatus("Testing credentials...");
    setTimeout(() => setStatus("✅ Connection test successful."), 1500); // Mock
  };

  const integration = INTEGRATIONS.find((i) => i.key === activeIntegration);

  return (
    <div className="p-6 bg-white border rounded shadow space-y-6">
      <h2 className="text-xl font-bold text-blue-700">Integration Credentials Manager</h2>

      <div className="flex gap-4 flex-wrap">
        {INTEGRATIONS.map((i) => (
          <button
            key={i.key}
            onClick={() => {
              setActiveIntegration(i.key);
              setFormData({});
              setStatus("");
            }}
            className={`px-4 py-2 rounded text-white text-sm ${
              activeIntegration === i.key ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {i.name}
          </button>
        ))}
      </div>

      {integration && (
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-gray-800">{integration.name} Credentials</h3>
          {integration.fields.map((field) => (
            <input
              key={field}
              type="text"
              placeholder={field}
              className="w-full p-2 border rounded text-sm"
              value={formData[field] || ""}
              onChange={(e) => handleChange(field, e.target.value)}
            />
          ))}

          <button
            onClick={handleTest}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Test Connection
          </button>
          {status && <p className="text-sm text-green-600">{status}</p>}
        </div>
      )}
    </div>
  );
}
