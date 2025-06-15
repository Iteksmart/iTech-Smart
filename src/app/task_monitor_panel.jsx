// components/TaskMonitorPanel.jsx
"use client";
import React, { useEffect, useState } from "react";

export default function TaskMonitorPanel() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTasks = async () => {
    setLoading(true);
    const res = await fetch("/api/tasks/list");
    const data = await res.json();
    setTasks(data);
    setLoading(false);
  };

  useEffect(() => {
    loadTasks();
    const interval = setInterval(loadTasks, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 bg-white border rounded shadow space-y-4">
      <h2 className="text-lg font-bold text-blue-700">Scheduled Tasks Monitor</h2>
      {loading && <p className="text-sm text-gray-500">Refreshing...</p>}
      <ul className="text-sm space-y-2">
        {tasks.map((t, i) => (
          <li key={i} className="border p-3 rounded bg-gray-50">
            <div className="flex justify-between">
              <span><strong>{t.name}</strong> — {t.status}</span>
              <span className="text-xs text-gray-500">{t.runAt}</span>
            </div>
            <pre className="mt-2 text-xs text-gray-700 whitespace-pre-wrap">{t.content}</pre>
            {t.status === "completed" && (
              <p className="text-xs text-green-600 mt-1">✅ Completed at {t.completedAt}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
