// components/HelpdeskTicketPull.jsx
"use client";
import React, { useState } from "react";

// Mock data simulating pulled tickets from a helpdesk API
const sampleTickets = [
  {
    id: "JIRA-1001",
    subject: "User can't connect to VPN",
    status: "Open",
    created: "2024-06-01",
    source: "Jira"
  },
  {
    id: "ZD-2345",
    subject: "Printer not responding",
    status: "Open",
    created: "2024-06-03",
    source: "Zendesk"
  },
  {
    id: "CW-8997",
    subject: "Disk usage over 90% on FileServer01",
    status: "In Progress",
    created: "2024-06-05",
    source: "ConnectWise"
  }
];

export default function HelpdeskTicketPull() {
  const [tickets, setTickets] = useState([]);

  const handlePullTickets = () => {
    // Simulate API call
    setTickets(sampleTickets);
  };

  return (
    <div className="p-6 border rounded bg-white shadow space-y-4">
      <h2 className="text-xl font-bold text-blue-700">Linked Helpdesk Tickets</h2>
      <p className="text-sm text-gray-600">View and interact with tickets from Jira, Zendesk, or ConnectWise.</p>

      <button
        onClick={handlePullTickets}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Pull Tickets from Linked Helpdesk(s)
      </button>

      {tickets.length > 0 && (
        <div className="mt-4 space-y-3">
          {tickets.map((ticket, i) => (
            <div key={i} className="border rounded p-4 bg-gray-50">
              <p className="font-semibold text-gray-800">{ticket.subject}</p>
              <p className="text-xs text-gray-500">{ticket.id} • {ticket.status} • {ticket.created} • Source: {ticket.source}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
