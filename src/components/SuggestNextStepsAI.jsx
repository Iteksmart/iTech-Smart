"use client";
import React, { useState } from "react";

export default function SuggestNextStepsAI({ lastAction }) {
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);

  const getSuggestion = async () => {
    setLoading(true);
    const res = await fetch("/api/chatgpt/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: `Based on the user’s recent action (${lastAction}), suggest the next diagnostic step in an IT troubleshooting process.`
      })
    });
    const data = await res.json();
    setSuggestion(data.response || "No suggestion available.");
    setLoading(false);
  };

  return (
    <div className="mt-4 bg-blue-50 border border-blue-200 p-4 rounded text-sm text-blue-800">
      <p className="mb-2 font-medium">💡 Next Step Suggestion:</p>
      {suggestion ? <p>{suggestion}</p> : <button onClick={getSuggestion} className="bg-blue-600 text-white px-3 py-1 rounded text-xs">Get Suggestion</button>}
      {loading && <p className="text-xs italic mt-2 text-gray-500">Thinking...</p>}
    </div>
  );
}