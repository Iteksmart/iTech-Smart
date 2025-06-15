// components/RemediationPanel.jsx
"use client";
import React, { useState } from "react";

const issueOptions = [
  "Fix DNS Issues",
  "Restart Printer Spooler",
  "Flush Network Cache"
];

export default function RemediationPanel() {
  const [issue, setIssue] = useState("");
  const [script, setScript] = useState("");
  const [explanation, setExplanation] = useState("");
  const [mode, setMode] = useState("explain");
  const [approved, setApproved] = useState(false);
  const [running, setRunning] = useState(false);

  const handleGenerate = async () => {
    setScript("");
    setExplanation("");
    setApproved(false);
    const prompt = `Generate a PowerShell or Bash script to: ${issue}. Include a step-by-step explanation.`;
    const res = await fetch("/api/chatgpt/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    const [generatedScript, ...rest] = data.response.split("Explanation:");
    setScript(generatedScript.trim());
    setExplanation(rest.join("Explanation:").trim());
  };

  const runScript = () => {
    setRunning(true);
    setTimeout(() => {
      alert("✅ Simulated script run complete.");
      setRunning(false);
    }, 2000);
  };

  return (
    <div className="p-6 border rounded bg-white shadow space-y-4">
      <h2 className="text-xl font-bold text-blue-700">AI-Generated Fix with Safety Toggle</h2>

      <select
        value={issue}
        onChange={(e) => setIssue(e.target.value)}
        className="w-full p-2 border rounded text-sm"
      >
        <option value="">-- Select Issue --</option>
        {issueOptions.map((opt, i) => (
          <option key={i} value={opt}>{opt}</option>
        ))}
      </select>

      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-700">Mode:</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="border p-1 rounded text-sm"
        >
          <option value="explain">Explain then Execute</option>
          <option value="auto">Run Automatically</option>
        </select>
      </div>

      <button
        onClick={handleGenerate}
        disabled={!issue}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Generate Fix Script
      </button>

      {script && (
        <div className="mt-4 space-y-2">
          <pre className="bg-gray-900 text-green-300 p-3 rounded text-sm whitespace-pre-wrap">{script}</pre>
          {mode === "explain" && (
            <div className="bg-gray-100 p-3 rounded text-sm">
              <strong className="text-blue-600 block mb-1">Explanation:</strong>
              {explanation}
            </div>
          )}
          {mode === "auto" || approved ? (
            <button
              onClick={runScript}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              disabled={running}
            >
              {running ? "Running..." : "Execute Script"}
            </button>
          ) : (
            <button
              onClick={() => setApproved(true)}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            >
              ✅ Approve & Continue
            </button>
          )}
        </div>
      )}
    </div>
  );
}
