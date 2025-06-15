// components/SavedSessionViewer.jsx
"use client";
import React, { useState, useEffect } from "react";

export default function SavedSessionViewer() {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("savedSessions");
    if (stored) setSessions(JSON.parse(stored));
  }, []);

  const handleSelectSession = (index) => {
    setActiveSession(sessions[index]);
  };

  return (
    <div className="p-4 border rounded shadow bg-white">
      <h2 className="text-xl font-bold mb-3">Saved Sessions</h2>

      {sessions.length === 0 && (
        <p className="text-sm text-gray-500">No saved sessions found.</p>
      )}

      {sessions.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          <ul className="space-y-2">
            {sessions.map((s, i) => (
              <li key={i}>
                <button
                  onClick={() => handleSelectSession(i)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Session {i + 1} — {s.title || "Untitled"}
                </button>
              </li>
            ))}
          </ul>

          {activeSession && (
            <div className="border rounded p-4 bg-gray-50 text-sm">
              <h3 className="font-semibold text-blue-700 mb-2">{activeSession.title || "Session Details"}</h3>
              <pre className="whitespace-pre-wrap text-gray-800">{activeSession.content}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
