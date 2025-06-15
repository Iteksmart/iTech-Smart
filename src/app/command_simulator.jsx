// components/CommandSimulator.jsx
"use client";
import React, { useState } from "react";

const mockResponses = {
  "ping 8.8.8.8": "Pinging 8.8.8.8 with 32 bytes of data:\nReply from 8.8.8.8: bytes=32 time=24ms TTL=117",
  "ipconfig": "Windows IP Configuration\n\nEthernet adapter Ethernet:\n   IPv4 Address. . . . . . . . . . . : 192.168.1.100\n   Subnet Mask . . . . . . . . . . . : 255.255.255.0\n   Default Gateway . . . . . . . . . : 192.168.1.1",
  "netstat": "Active Connections\n\n  Proto  Local Address          Foreign Address        State\n  TCP    192.168.1.100:49704    93.184.216.34:443      ESTABLISHED"
};

export default function CommandSimulator() {
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState("");

  const handleRun = () => {
    const trimmed = command.trim().toLowerCase();
    const result = mockResponses[trimmed] || "Command not recognized or not supported in demo.";
    setOutput(result);
  };

  return (
    <div className="p-4 bg-white border rounded shadow space-y-4">
      <h2 className="text-xl font-bold text-blue-700">Command Simulator</h2>
      <p className="text-sm text-gray-600">Enter a network or system command to simulate its output.</p>
      <div className="flex gap-2">
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          className="w-full border p-2 rounded font-mono"
          placeholder="e.g., ping 8.8.8.8"
        />
        <button
          onClick={handleRun}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Run
        </button>
      </div>
      {output && (
        <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto whitespace-pre-wrap">
          {output}
        </pre>
      )}
    </div>
  );
}
