// components/PushResolutionToHelpdesk.jsx
"use client";
import React, { useState } from "react";

const resolvedNotes = `Step 1: Verified network connectivity.\nStep 2: Flushed DNS cache.\nStep 3: Restarted network adapter.\nIssue resolved.`;

const ticketList = [
  { id: "JIRA-1001", subject: "User can't connect to VPN" },
  { id: "ZD-2345", subject: "Printer not responding" },
  { id: "CW-8997", subject: "Disk usage over 90% on FileServer01" }
];

export default function PushResolutionToHelpdesk() {
  const [selectedTicket, setSelectedTicket] = useState("");
  const [status, setStatus] = useState("");

  const handlePush = () => {
    if (!selectedTicket) return alert("Please select a ticket.");
    console.log(`Pushed to ${selectedTicket}:\n${resolvedNotes}`);
    setStatus(`✅ Resolution pushed to ${selectedTicket}`);
  };

  return (
    <div className="p-6 border rounded bg-white shadow space-y-4">
      <h2 className="text-xl font-bold text-blue-700">Push Resolution to Helpdesk</h2>
      <p className="text-sm text-gray-600">Send your AI-generated resolution notes to the original ticket.</p>

      <select
        value={selectedTicket}
        onChange={(e) => setSelectedTicket(e.target.value)}
        className="w-full border p-2 rounded text-sm"
      >
        <option value="">-- Select Ticket --</option>
        {ticketList.map((ticket) => (
          <option key={ticket.id} value={ticket.id}>{ticket.id} — {ticket.subject}</option>
        ))}
      </select>

      <pre className="bg-gray-100 p-3 rounded text-sm text-gray-800">
{resolvedNotes}
      </pre>

      <button
        onClick={handlePush}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Push to Helpdesk
      </button>

      {status && <p className="text-green-600 text-sm mt-2">{status}</p>}
    </div>
  );
}
