// components/AutoCategorizeTickets.jsx
"use client";
import React, { useEffect, useState } from "react";

const mockTickets = [
  { subject: "Can't print to HP LaserJet", content: "Printer not found on network." },
  { subject: "VPN timeout on remote login", content: "VPN drops every 30 minutes." },
  { subject: "Permission denied error", content: "User can't access shared folder on server." },
  { subject: "Wi-Fi unstable", content: "Laptop disconnects from Wi-Fi intermittently." },
  { subject: "Outlook won't launch", content: "Startup failure on Office 365." }
];

export default function AutoCategorizeTickets() {
  const [categorized, setCategorized] = useState([]);

  useEffect(() => {
    const categorize = (content) => {
      const text = content.toLowerCase();
      if (text.includes("printer")) return "Printing";
      if (text.includes("vpn")) return "Networking";
      if (text.includes("permission") || text.includes("access")) return "Permissions";
      if (text.includes("wi-fi") || text.includes("wifi") || text.includes("network")) return "Networking";
      if (text.includes("outlook") || text.includes("office")) return "Applications";
      return "General";
    };

    const result = mockTickets.map((t) => ({
      ...t,
      category: categorize(`${t.subject} ${t.content}`)
    }));

    setCategorized(result);
  }, []);

  return (
    <div className="p-4 border rounded bg-white shadow space-y-4">
      <h2 className="text-xl font-bold text-blue-700">🧠 Auto-Categorized Tickets</h2>
      <ul className="space-y-3 text-sm">
        {categorized.map((t, i) => (
          <li key={i} className="border rounded p-3 bg-gray-50">
            <p><strong>{t.subject}</strong></p>
            <p className="text-gray-600">{t.content}</p>
            <p className="text-xs text-blue-600 mt-1">Category: {t.category}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
