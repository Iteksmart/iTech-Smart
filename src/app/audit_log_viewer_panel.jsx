// components/AuditLogViewerPanel.jsx
"use client";
import React, { useEffect, useState } from "react";

export default function AuditLogViewerPanel() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const loadLogs = async () => {
      const res = await fetch("/api/audit-log/list");
      const data = await res.json();
      setLogs(data);
    };
    loadLogs();
  }, []);

  return (
    <div className="p-4 border rounded bg-white shadow space-y-4">
      <h2 className="text-lg font-bold text-blue-700">Audit Log</h2>
      <ul className="text-sm space-y-2">
        {logs.map((log) => (
          <li key={log.id} className="border p-3 rounded bg-gray-50">
            <div className="flex justify-between">
              <span><strong>{log.action}</strong> on {log.target}</span>
              <span className="text-xs text-gray-500">{log.timestamp}</span>
            </div>
            <p className="text-xs text-gray-700">By: {log.userId}</p>
            {log.details && <p className="text-xs text-gray-600 mt-1">{log.details}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
