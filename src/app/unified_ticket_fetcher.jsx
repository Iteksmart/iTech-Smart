// components/UnifiedTicketFetcher.jsx
"use client";
import React, { useState } from "react";

export default function UnifiedTicketFetcher() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAllTickets = async () => {
    setLoading(true);
    setError("");
    try {
      const [jiraRes, zendeskRes, cwRes] = await Promise.all([
        fetch("/api/helpdesk/jira").then((r) => r.json()),
        fetch("/api/helpdesk/zendesk").then((r) => r.json()),
        fetch("/api/helpdesk/connectwise").then((r) => r.json())
      ]);

      const formatted = [
        ...(jiraRes || []).map((t) => ({
          id: t.key,
          subject: t.fields?.summary || "No subject",
          status: t.fields?.status?.name || "Unknown",
          source: "Jira"
        })),
        ...(zendeskRes || []).map((t) => ({
          id: `ZD-${t.id}`,
          subject: t.subject,
          status: t.status,
          source: "Zendesk"
        })),
        ...(cwRes || []).map((t) => ({
          id: `CW-${t.id}`,
          subject: t.summary,
          status: t.status?.name || "Open",
          source: "ConnectWise"
        }))
      ];

      setTickets(formatted);
    } catch (err) {
      console.error("Ticket sync error:", err);
      setError("Failed to fetch from one or more sources.");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white border rounded shadow space-y-4">
      <h2 className="text-xl font-bold text-blue-700">Unified Ticket Feed</h2>
      <p className="text-sm text-gray-600">Live tickets pulled from Jira, Zendesk, and ConnectWise.</p>

      <button
        onClick={fetchAllTickets}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Sync Tickets
      </button>

      {loading && <p className="text-sm text-gray-500">Fetching tickets...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <ul className="mt-4 space-y-3">
        {tickets.map((ticket, idx) => (
          <li key={idx} className="border p-3 rounded bg-gray-50 text-sm">
            <p className="font-semibold text-gray-800">{ticket.subject}</p>
            <p className="text-gray-500 text-xs">{ticket.id} • {ticket.status} • {ticket.source}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
