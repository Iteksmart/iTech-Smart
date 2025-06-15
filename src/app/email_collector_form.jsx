// components/EmailCollectorForm.jsx
"use client";
import React, { useState } from "react";

export default function EmailCollectorForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) return alert("Please enter a valid email.");

    // TODO: Connect to backend or mailing list platform
    console.log("Collected email:", email);
    setSubmitted(true);
  };

  return (
    <div className="bg-blue-50 p-6 rounded-lg text-center max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-blue-800 mb-2">Join the Beta List</h2>
      <p className="text-sm text-gray-600 mb-4">Be the first to try new features, get updates, and receive early access perks.</p>
      {submitted ? (
        <p className="text-green-700 font-medium">✅ You’re on the list!</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded text-sm"
            placeholder="you@example.com"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Notify Me
          </button>
        </form>
      )}
    </div>
  );
}
