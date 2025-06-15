// components/FeedbackPrompt.jsx
"use client";
import React, { useState } from "react";

export default function FeedbackPrompt({ context = "this suggestion" }) {
  const [feedback, setFeedback] = useState(null);

  const handleFeedback = (value) => {
    setFeedback(value);
    // Here you could send feedback to a backend or analytics service
    console.log(`User feedback for ${context}:`, value);
  };

  if (feedback) {
    return (
      <div className="text-sm text-green-700 bg-green-50 border border-green-300 p-2 rounded mt-3">
        Thanks for your feedback!
      </div>
    );
  }

  return (
    <div className="mt-3 text-sm text-gray-600">
      Was {context} helpful?
      <button
        onClick={() => handleFeedback("yes")}
        className="ml-2 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
      >
        Yes
      </button>
      <button
        onClick={() => handleFeedback("no")}
        className="ml-2 px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
      >
        No
      </button>
    </div>
  );
}
