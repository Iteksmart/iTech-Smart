// components/CommandSuggestor.jsx
"use client";
import React, { useState } from "react";

const sampleCommands = {
  "Can't connect to internet": [
    { command: "ping 8.8.8.8", description: "Test connectivity to external network" },
    { command: "ipconfig /release && ipconfig /renew", description: "Renew IP address from DHCP" },
    { command: "netsh winsock reset", description: "Reset Winsock Catalog" }
  ],
  "Printer not responding": [
    { command: "net start spooler", description: "Restart the Print Spooler service" },
    { command: "ping printer-ip", description: "Check printer connectivity" },
    { command: "\"Control Printers\"", description: "Open printer settings GUI" }
  ]
};

export default function CommandSuggestor() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    const matches = sampleCommands[query];
    setResults(matches || []);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Command Suggestion Engine</h2>
      <p className="text-sm text-gray-500">Type an issue or keyword to get recommended commands.</p>
      <div className="flex gap-2">
        <input
          type="text"
          className="border p-2 rounded w-full"
          placeholder="e.g., Can't connect to internet"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>
      {results.length > 0 && (
        <div className="mt-4 space-y-3">
          {results.map((cmd, index) => (
            <div key={index} className="border p-3 rounded-lg bg-gray-50">
              <p className="font-mono text-blue-800">{cmd.command}</p>
              <p className="text-sm text-gray-600">{cmd.description}</p>
            </div>
          ))}
        </div>
      )}
      {results.length === 0 && query && (
        <p className="text-sm text-red-500">No suggestions found for "{query}".</p>
      )}
    </div>
  );
}
