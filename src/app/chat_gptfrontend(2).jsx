// components/ChatGPTFrontend.jsx
"use client";
import React, { useEffect, useState } from "react";

const STORAGE_KEY = "chatgpt_session_messages";

export default function ChatGPTFrontend() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const sendPrompt = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    const userMessage = { role: "user", content: prompt };
    setMessages((prev) => [...prev, userMessage]);

    const res = await fetch("/api/chatgpt/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    const aiMessage = { role: "assistant", content: data.response };
    setMessages((prev) => [...prev, aiMessage]);
    setPrompt("");
    setLoading(false);
  };

  const clearSession = () => {
    localStorage.removeItem(STORAGE_KEY);
    setMessages([]);
  };

  return (
    <div className="p-6 border rounded bg-white shadow max-w-3xl mx-auto space-y-4">
      <h2 className="text-xl font-bold text-blue-700">ChatGPT Assistant</h2>

      <div className="h-64 overflow-y-auto border p-3 rounded bg-gray-50 space-y-3 text-sm">
        {messages.map((msg, idx) => (
          <div key={idx} className={`p-2 rounded ${msg.role === "user" ? "bg-blue-100 text-blue-800" : "bg-gray-200 text-gray-800"}`}>
            <strong>{msg.role === "user" ? "You" : "AI"}:</strong> {msg.content}
          </div>
        ))}
        {loading && <p className="text-sm text-gray-500 italic">AI is thinking...</p>}
      </div>

      <div className="flex gap-2">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendPrompt()}
          className="flex-1 border p-2 rounded text-sm"
          placeholder="Ask a question or describe an issue..."
        />
        <button
          onClick={sendPrompt}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
        <button
          onClick={clearSession}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
