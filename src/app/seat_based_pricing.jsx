// components/TeamSeatManager.jsx
"use client";
import React, { useState } from "react";

export default function TeamSeatManager() {
  const [teamMembers, setTeamMembers] = useState(["admin@example.com"]);
  const maxSeats = 5; // Default team plan allowance

  const handleAddMember = () => {
    if (teamMembers.length < maxSeats) {
      const email = prompt("Enter new team member's email:");
      if (email && email.includes("@")) {
        setTeamMembers([...teamMembers, email]);
      }
    } else {
      alert("You've reached the maximum seat limit.");
    }
  };

  const handleRemoveMember = (email) => {
    setTeamMembers(teamMembers.filter((member) => member !== email));
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow">
      <h2 className="text-xl font-bold mb-2">Team Members</h2>
      <p className="text-sm text-gray-600 mb-4">Seats used: {teamMembers.length} / {maxSeats}</p>

      <ul className="space-y-2">
        {teamMembers.map((email, idx) => (
          <li key={idx} className="flex justify-between items-center border p-2 rounded">
            <span className="text-sm text-gray-800">{email}</span>
            {email !== "admin@example.com" && (
              <button
                onClick={() => handleRemoveMember(email)}
                className="text-xs text-red-500 hover:underline"
              >
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>

      <button
        onClick={handleAddMember}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Add Member
      </button>
    </div>
  );
}
