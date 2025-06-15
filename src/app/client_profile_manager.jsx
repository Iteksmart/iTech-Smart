// components/ClientProfileManager.jsx
"use client";
import React, { useState } from "react";

export default function ClientProfileManager() {
  const [clients, setClients] = useState([]);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");

  const handleAddClient = () => {
    if (!name.trim()) return;
    const newClient = { name, notes };
    setClients([...clients, newClient]);
    setName("");
    setNotes("");
  };

  const handleRemove = (index) => {
    const updated = [...clients];
    updated.splice(index, 1);
    setClients(updated);
  };

  return (
    <div className="p-6 bg-white border rounded shadow space-y-6">
      <h2 className="text-xl font-bold text-blue-700">Client/Environment Profiles</h2>

      <div className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Client or Site Name"
        />
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border p-2 rounded"
          rows={3}
          placeholder="Environment details, IP schemes, credentials, devices, etc."
        />
        <button
          onClick={handleAddClient}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Client Profile
        </button>
      </div>

      {clients.length > 0 && (
        <div>
          <h3 className="text-md font-semibold text-gray-800 mt-6 mb-2">Saved Profiles</h3>
          <ul className="space-y-4">
            {clients.map((c, i) => (
              <li key={i} className="border p-4 rounded bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-blue-700 font-semibold">{c.name}</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{c.notes}</p>
                  </div>
                  <button
                    onClick={() => handleRemove(i)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}