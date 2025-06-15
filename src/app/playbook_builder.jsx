// components/PlaybookBuilder.jsx
"use client";
import React, { useState } from "react";

export default function PlaybookBuilder() {
  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState([""]);
  const [savedPlaybooks, setSavedPlaybooks] = useState([]);

  const handleStepChange = (index, value) => {
    const updated = [...steps];
    updated[index] = value;
    setSteps(updated);
  };

  const addStep = () => setSteps([...steps, ""]);

  const handleSave = () => {
    if (!title || steps.some((s) => !s.trim())) return;
    const newPlaybook = { title, steps };
    setSavedPlaybooks([...savedPlaybooks, newPlaybook]);
    setTitle("");
    setSteps([""]);
  };

  return (
    <div className="p-4 border rounded bg-white shadow space-y-6">
      <h2 className="text-xl font-bold">Create a New Playbook</h2>
      <input
        type="text"
        placeholder="Playbook Title"
        className="w-full border p-2 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="space-y-2">
        {steps.map((step, index) => (
          <input
            key={index}
            type="text"
            className="w-full border p-2 rounded"
            placeholder={`Step ${index + 1}`}
            value={step}
            onChange={(e) => handleStepChange(index, e.target.value)}
          />
        ))}
        <button onClick={addStep} className="text-sm text-blue-600 hover:underline">
          + Add Step
        </button>
      </div>
      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Playbook
      </button>

      {savedPlaybooks.length > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-semibold mb-2">Saved Playbooks</h3>
          <ul className="space-y-3">
            {savedPlaybooks.map((pb, idx) => (
              <li key={idx} className="border p-3 rounded">
                <strong className="block text-blue-700 mb-1">{pb.title}</strong>
                <ol className="text-sm list-decimal list-inside space-y-1">
                  {pb.steps.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
