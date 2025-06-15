// components/KnowledgeBase.jsx
"use client";
import React, { useState } from "react";

const articles = [
  {
    title: "How to Flush DNS Cache (Windows)",
    tags: ["Network", "DNS"],
    content: `Open Command Prompt as Administrator and run:

ipconfig /flushdns

This clears the local DNS resolver cache.`
  },
  {
    title: "Restart Print Spooler Service",
    tags: ["Printing", "Windows Services"],
    content: `Use the following command in Command Prompt:

net stop spooler && net start spooler

This restarts the print queue system.`
  },
  {
    title: "Check Default Gateway Availability",
    tags: ["Network", "Gateway"],
    content: `Run:

ping 192.168.1.1

Replace with your actual default gateway IP address.`
  }
];

export default function KnowledgeBase() {
  const [search, setSearch] = useState("");

  const filtered = articles.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Knowledge Base</h2>
      <p className="text-sm text-gray-500">Search how-tos and common command usage.</p>
      <input
        type="text"
        placeholder="Search by title or tag..."
        className="border p-2 rounded w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="space-y-4 mt-4">
        {filtered.map((article, idx) => (
          <div key={idx} className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
            <p className="text-xs text-gray-400 mb-2">Tags: {article.tags.join(", ")}</p>
            <pre className="whitespace-pre-wrap text-sm text-gray-800">{article.content}</pre>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-sm text-red-500">No articles match your search.</p>
        )}
      </div>
    </div>
  );
}
