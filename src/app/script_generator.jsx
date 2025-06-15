// components/ScriptGenerator.jsx
"use client";
import React, { useState } from "react";

const sampleCommands = [
  "ipconfig /release",
  "ipconfig /renew",
  "ipconfig /flushdns",
  "netsh winsock reset"
];

export default function ScriptGenerator() {
  const [commands, setCommands] = useState(sampleCommands);
  const [scriptName, setScriptName] = useState("network_reset.bat");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const script = commands.join("\n");
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 border rounded bg-white shadow space-y-4">
      <h2 className="text-xl font-bold text-blue-700">Script Generator</h2>
      <p className="text-sm text-gray-600">Review and copy your generated script.</p>

      <input
        type="text"
        value={scriptName}
        onChange={(e) => setScriptName(e.target.value)}
        className="w-full p-2 border rounded text-sm"
        placeholder="Enter script name..."
      />

      <pre className="bg-gray-900 text-green-400 p-4 rounded whitespace-pre-wrap overflow-x-auto text-sm">
{commands.join("\n")}
      </pre>

      <button
        onClick={handleCopy}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {copied ? "Copied!" : "Copy to Clipboard"}
      </button>
    </div>
  );
}
