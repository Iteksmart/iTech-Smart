// components/UnifiedHelpdeskWorkflow.jsx
"use client";
import React, { useState } from "react";

const mockTickets = [
  { id: "JIRA-1001", subject: "User can't connect to VPN" },
  { id: "ZD-2345", subject: "Printer not responding" },
  { id: "CW-8997", subject: "Disk usage over 90% on FileServer01" }
];

const resolutionNote = `Step 1: Verified connectivity\nStep 2: Reset DNS resolver\nStep 3: Confirmed resolution with user.`;

export default function UnifiedHelpdeskWorkflow() {
  const [connectedTools, setConnectedTools] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState("");
  const [pushStatus, setPushStatus] = useState("");

  const helpdeskTools = ["Jira", "Zendesk", "Freshservice", "ConnectWise"];

  const handleConnect = (tool) => {
    setConnectedTools((prev) => [...prev, tool]);
  };

  const handlePullTickets = () => {
    setTickets(mockTickets);
  };

  const handlePushNotes = () => {
    if (!selectedTicket) return alert("Select a ticket first.");
    setPushStatus(`✅ Resolution pushed to ${selectedTicket}`);
  };

  return (
    <div className="p-6 space-y-6 bg-white border rounded shadow">
      <h2 className="text-xl font-bold text-blue-700">Helpdesk Sync Workflow</h2>

      {/* Step 1: Connect Tools */}
      <div>
        <h3 className="text-md font-semibold text-gray-800 mb-2">Step 1: Connect Helpdesk Tools</h3>
        <div className="flex flex-wrap gap-2">
          {helpdeskTools.map((tool) => (
            <button
              key={tool}
              onClick={() => handleConnect(tool)}
              className={`px-3 py-1 rounded text-sm ${connectedTools.includes(tool) ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}
            >
              {connectedTools.includes(tool) ? `${tool} ✅` : `Connect ${tool}`}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Pull Tickets */}
      <div>
        <h3 className="text-md font-semibold text-gray-800 mb-2">Step 2: Pull Open Tickets</h3>
        <button
          onClick={handlePullTickets}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
        >
          Pull Tickets
        </button>
        {tickets.length > 0 && (
          <select
            onChange={(e) => setSelectedTicket(e.target.value)}
            value={selectedTicket}
            className="w-full mt-2 border p-2 rounded text-sm"
          >
            <option value="">-- Select Ticket --</option>
            {tickets.map((ticket) => (
              <option key={ticket.id} value={ticket.id}>{ticket.id} — {ticket.subject}</option>
            ))}
          </select>
        )}
      </div>

      {/* Step 3: Push Notes */}
      <div>
        <h3 className="text-md font-semibold text-gray-800 mb-2">Step 3: Push AI Resolution Notes</h3>
        <pre className="bg-gray-100 p-3 rounded text-sm text-gray-800">{resolutionNote}</pre>
        <button
          onClick={handlePushNotes}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Push to Helpdesk
        </button>
        {pushStatus && <p className="text-green-600 text-sm mt-2">{pushStatus}</p>}
      </div>
    </div>
  );
}
