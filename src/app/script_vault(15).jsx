// components/ScriptVault.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import jsPDF from "jspdf";
import SuggestNextStepsAI from "@/components/SuggestNextStepsAI";


export default function ScriptVault() {
  const { data: session } = useSession();
  const [orgId, setOrgId] = useState("default");
  const userId = session?.user?.email || "anonymous";
  const STORAGE_KEY = `script_vault_${orgId}_${userId}`;

  const [scriptName, setScriptName] = useState("");
  const [scriptContent, setScriptContent] = useState("");
  const [scripts, setScripts] = useState([]);
  const [orgs, setOrgs] = useState(["default", "clientA", "clientB"]);
  const [newOrg, setNewOrg] = useState("");
  const [explanations, setExplanations] = useState({});
  const [sandboxOutput, setSandboxOutput] = useState("");
  const [sandboxMode, setSandboxMode] = useState("success");
  const [checklist, setChecklist] = useState({ orgAdded: false, scriptCreated: false, sandboxRun: false, exported: false, explained: false });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setScripts(JSON.parse(saved));
  }, [STORAGE_KEY]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scripts));
  }, [scripts, STORAGE_KEY]);

  const handleSave = () => {
    if (!scriptName.trim() || !scriptContent.trim()) return;
    const newEntry = { name: scriptName, content: scriptContent };
    setScripts([...scripts, newEntry]);
    setScriptName("");
    setScriptContent("");
    setChecklist((prev) => ({ ...prev, scriptCreated: true }));
  };

  const handleDelete = (index) => {
    const updated = scripts.filter((_, i) => i !== index);
    setScripts(updated);
  };

  const handleExportPDF = (script) => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`Script: ${script.name}`, 10, 10);
    const lines = doc.splitTextToSize(script.content, 180);
    doc.text(lines, 10, 20);
    doc.save(`${script.name}.pdf`);
    setChecklist((prev) => ({ ...prev, exported: true }));
  };

  const switchOrg = (e) => {
    const selectedOrg = e.target.value;
    setOrgId(selectedOrg);
    const key = `script_vault_${selectedOrg}_${userId}`;
    const saved = localStorage.getItem(key);
    setScripts(saved ? JSON.parse(saved) : []);
  };

  const handleAddOrg = () => {
    if (newOrg.trim() && !orgs.includes(newOrg)) {
      setOrgs([...orgs, newOrg.trim()]);
      setNewOrg("");
      setChecklist((prev) => ({ ...prev, orgAdded: true }));
    }
  };

  const explainScript = async (script) => {
    try {
      const res = await fetch("/api/chatgpt/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Explain each line of this script in context:\n${script.content}`
        })
      });
      const data = await res.json();
      setExplanations((prev) => ({ ...prev, [script.name]: data.response }));
      setChecklist((prev) => ({ ...prev, explained: true }));
    } catch (err) {
      alert("Failed to get explanation from AI.");
    }
  };

  const runInSandbox = (script) => {
    const output = script.content
      .split("\n")
      .map((line, i) => {
        const isError = sandboxMode === "error" && (line.toLowerCase().includes("fail") || line.includes("404") || line.includes("not found"));
        const result = isError ? `❌ Simulated error: Command failed` : `✅ Simulated output: OK`;
        return `> ${line}\n${result}`;
      })
      .join("\n\n");
    setSandboxOutput(output);
    setChecklist((prev) => ({ ...prev, sandboxRun: true }));
  };

  async function sendToTeams(script) {
  try {
    const webhookUrl = process.env.NEXT_PUBLIC_TEAMS_WEBHOOK_URL;
    const payload = {
      text: `📦 *Script Shared: ${script.name}*

\`\`\`${script.content}\`\`\``
    };
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    alert("✅ Script sent to Microsoft Teams!");
  } catch (err) {
    alert("❌ Failed to send to Teams.");
  }
}

const [scheduleTime, setScheduleTime] = useState("");

  const scheduleScript = (script) => {
    if (!scheduleTime) return alert("⏰ Please select a time.");
    alert(`🗓️ Script '${script.name}' scheduled to run at ${scheduleTime}. (Simulated)`);
  };

  return (
    <div className="p-6 bg-white border rounded shadow space-y-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-blue-700">Script Vault</h2>

      <div className="bg-blue-50 p-4 border rounded">
        <h3 className="font-semibold mb-2 text-blue-700">✅ Onboarding Checklist</h3>
        <ul className="text-sm list-disc list-inside text-gray-800 space-y-1">
          <li>{checklist.orgAdded ? "✅" : "⬜"} Add a new organization</li>
          <li>{checklist.scriptCreated ? "✅" : "⬜"} Create and save a script</li>
          <li>{checklist.sandboxRun ? "✅" : "⬜"} Run a script in sandbox</li>
          <li>{checklist.exported ? "✅" : "⬜"} Export a script as PDF</li>
          <li>{checklist.explained ? "✅" : "⬜"} Use AI to explain a script</li>
        </ul>
      </div>

      <div className="space-y-4">
        {scripts.map((s, i) => (
          <div key={i} className="border rounded p-4 bg-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-semibold text-blue-700">{s.name}</h3>
              $1
                <button
                  onClick={() => scheduleScript(s)}
                  className="text-xs text-orange-600 hover:underline"
                >
                  Schedule
                </button>
                <button
                  onClick={() => runInSandbox(s)}
                  className="text-xs text-yellow-600 hover:underline"
                >
                  Run in Sandbox
                </button>
                <button
                  onClick={() => handleExportPDF(s)}
                  className="text-xs text-green-600 hover:underline"
                >
                  Export PDF
                </button>
                <button
                  onClick={() => handleDelete(i)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Delete
                </button>
                <button onClick={() => sendToSlack(s)} className="text-xs text-blue-600 hover:underline">Send to Slack</button>
<button onClick={() => sendToTeams(s)} className="text-xs text-purple-600 hover:underline">Send to Teams</button>
              <div className="mt-2">
              <label className="block text-xs text-gray-600 mb-1">Schedule Time:</label>
              <input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="border p-1 rounded text-xs w-32"
              />
            </div>
$1"text-sm mt-2 whitespace-pre-wrap text-gray-800">{s.content}</pre>
<SuggestNextStepsAI lastAction={`Ran script: ${s.name}`} />
            {explanations[s.name] && (
              <div className="mt-3 bg-white border rounded p-3 text-sm text-gray-700">
                <strong className="block text-blue-600 mb-2">AI Explanation:</strong>
                <p className="whitespace-pre-wrap">{explanations[s.name]}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {sandboxOutput && (
        <div className="mt-6 p-4 border rounded bg-black text-green-400 text-sm whitespace-pre-wrap">
          <strong className="text-white block mb-2">🧪 Sandbox Output</strong>
          {sandboxOutput}
        </div>
      )}
    </div>
  );

  async function sendToSlack(script) {
    try {
      const webhookUrl = process.env.NEXT_PUBLIC_SLACK_WEBHOOK_URL;
      const payload = {
        text: `📦 *Script Shared: ${script.name}*

\`\`\`${script.content}\`\`\``
      };
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      alert("✅ Script sent to Slack!");
    } catch (err) {
      alert("❌ Failed to send to Slack.");
    }
  }
