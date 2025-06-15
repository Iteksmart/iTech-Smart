// components/RBACSettingsPanel.jsx
"use client";
import React, { useState } from "react";

const roles = ["Admin", "Technician", "Junior Technician"];

export default function RBACSettingsPanel() {
  const [users, setUsers] = useState([
    { email: "admin@example.com", role: "Admin" },
    { email: "tech@example.com", role: "Technician" }
  ]);

  const handleRoleChange = (index, newRole) => {
    const updated = [...users];
    updated[index].role = newRole;
    setUsers(updated);
  };

  const handleAddUser = () => {
    const email = prompt("Enter user email:");
    if (!email || !email.includes("@")) return;
    setUsers([...users, { email, role: "Junior Technician" }]);
  };

  const handleRemoveUser = (index) => {
    const updated = [...users];
    updated.splice(index, 1);
    setUsers(updated);
  };

  return (
    <div className="p-6 border rounded bg-white shadow space-y-6">
      <h2 className="text-xl font-bold text-blue-700">Role-Based Access Control (RBAC)</h2>
      <p className="text-sm text-gray-600">Assign user roles to control access within your team.</p>

      <ul className="space-y-4">
        {users.map((user, index) => (
          <li key={index} className="flex justify-between items-center border p-4 rounded bg-gray-50">
            <div>
              <p className="text-sm font-medium text-gray-800">{user.email}</p>
              <select
                value={user.role}
                onChange={(e) => handleRoleChange(index, e.target.value)}
                className="mt-1 text-sm border rounded p-1"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => handleRemoveUser(index)}
              className="text-xs text-red-600 hover:underline"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={handleAddUser}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Add Team Member
      </button>
    </div>
  );
}
