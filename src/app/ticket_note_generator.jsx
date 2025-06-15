// components/TicketNoteGenerator.jsx
"use client";
import React, { useState } from "react";

export default function TicketNoteGenerator() {
  const [actions, setActions] = useState([""]);
  const [notes, setNotes] = useState("");

  const handleChange = (index, value) => {
    const updated = [...actions];
    updated[index] = value;
    setActions(updated);
  };

  const handleAddAction = () => {
    setActions([...actions, ""]);
  };

  const handleGenerateNotes = () => {
    const result = actions.filter(Boolean).map((action, i) => `Step ${i + 1}: ${action}`).join("\n");
    setNotes(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(notes);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Ticket Note Generator</h2>
      <p className="text-sm text-gray-500">List your steps and export formatted ticket notes.</p>
      <div className="space-y-2">
        {actions.map((action, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Step ${index + 1}`}
            className="w-full border p-2 rounded"
            value={action}
            onChange={(e) => handleChange(index, e.target.value)}
          />
        ))}
        <button
          onClick={handleAddAction}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          + Add Step
        </button>
      </div>
      <button
        onClick={handleGenerateNotes}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Generate Notes
      </button>

      {notes && (
        <div className="mt-4">
          <h4 className="text-md font-semibold text-blue-700 mb-2">Generated Ticket Notes:</h4>
          <pre className="bg-gray-50 border p-3 rounded text-sm whitespace-pre-wrap text-gray-800">{notes}</pre>
          <button
            onClick={handleCopy}
            className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}
