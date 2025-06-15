// components/AutoLearnedKnowledgeBase.jsx
"use client";
import React, { useEffect, useState } from "react";

export default function AutoLearnedKnowledgeBase() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("ticketNotes") || "[]");
    const grouped = {};

    stored.forEach((note) => {
      const topic = note.topic || "General";
      if (!grouped[topic]) grouped[topic] = [];
      grouped[topic].push(note);
    });

    setEntries(grouped);
  }, []);

  return (
    <div className="p-4 bg-white border rounded shadow space-y-6">
      <h2 className="text-xl font-bold text-blue-700">Auto-Learned Knowledge Base</h2>
      {Object.entries(entries).length === 0 && (
        <p className="text-sm text-gray-500">No saved ticket notes yet.</p>
      )}

      {Object.entries(entries).map(([topic, notes], idx) => (
        <div key={idx} className="border rounded p-4 bg-gray-50">
          <h3 className="text-md font-semibold text-blue-600 mb-2">{topic}</h3>
          <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
            {notes.map((n, i) => (
              <li key={i}>{n.text}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
