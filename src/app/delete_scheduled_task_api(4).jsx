// components/TaskMonitorPanel.jsx
"use client";
import React, { useEffect, useState } from "react";

export default function TaskMonitorPanel() {
  const [commandHistory, setCommandHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTasks = async () => {
    setLoading(true);
    const res = await fetch("/api/tasks/list");
    const data = await res.json();
    setTasks(data);
    setLoading(false);
  };

  const cancelTask = async (id) => {
    const res = await fetch("/api/tasks/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    if (res.ok) loadTasks();
  };

  useEffect(() => {
    const loadCommandHistory = async () => {
      const res = await fetch("/api/command-history/list");
      const data = await res.json();
      setCommandHistory(data);
    };
    loadCommandHistory();
    loadTasks();
    const interval = setInterval(loadTasks, 30000);
    const [filter, setFilter] = useState("all");

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "scheduled" && task.status === "scheduled") ||
      (filter === "completed" && task.status === "completed");
    const matchesSearch =
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 bg-white border rounded shadow space-y-4">
      <h2 className="text-lg font-bold text-blue-700">Scheduled Tasks Monitor</h2>
      {loading && <p className="text-sm text-gray-500">Refreshing...</p>}
      <div className="flex gap-4 text-sm items-center">
        <label>Search:</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name or content"
          className="border p-1 rounded text-sm"
        />
      </div>

      <div className="flex gap-4 text-sm items-center">
        <label>Filter:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="all">All</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <ul className="text-sm space-y-2">
        {filteredTasks.map((t, i) => (
          <li key={i} className="border p-3 rounded bg-gray-50">
            <div className="flex justify-between items-center">
              <span><strong>{t.name}</strong> — {t.status}</span>
              <span className="text-xs text-gray-500">{t.runAt}</span>
            </div>
            <pre className="mt-2 text-xs text-gray-700 whitespace-pre-wrap">{t.content}</pre>
            {t.status === "completed" ? (
              <p className="text-xs text-green-600 mt-1">✅ Completed at {t.completedAt}</p>
            ) : (
              <button
                onClick={() => cancelTask(t.id)}
                className="text-xs text-red-600 mt-2 hover:underline"
              >
                ❌ Cancel Task
              </button>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-10">
        <h2 className="text-lg font-bold text-blue-700">Command History</h2>
        <ul className="text-sm space-y-2 mt-3">
          {commandHistory.map((entry, i) => (
            <li key={i} className="border p-3 rounded bg-white">
              <div className="flex justify-between items-center">
                <strong className="text-blue-600">{entry.command}</strong>
                <span className="text-xs text-gray-400">{entry.timestamp}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">{entry.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
