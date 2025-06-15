// components/AddOnStore.jsx
"use client";
import React, { useState } from "react";

const addons = [
  {
    id: "export-playbooks",
    name: "Export Playbooks",
    price: "$4.99",
    description: "Download troubleshooting playbooks as PDFs."
  },
  {
    id: "command-history",
    name: "Command History Access",
    price: "$2.99",
    description: "View and re-run previously used commands."
  },
  {
    id: "extra-seats",
    name: "Add 5 Extra Team Seats",
    price: "$9.99",
    description: "Extend your team capacity by 5 seats."
  }
];

export default function AddOnStore() {
  const [purchased, setPurchased] = useState([]);

  const handlePurchase = (id) => {
    if (!purchased.includes(id)) {
      setPurchased([...purchased, id]);
      alert(`Thank you! You've purchased the ${id.replace(/-/g, " ")}.`);
    }
  };

  return (
    <div className="p-4 bg-white border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Optional Add-Ons</h2>
      <ul className="space-y-4">
        {addons.map((addon) => (
          <li
            key={addon.id}
            className="border p-4 rounded flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <h3 className="text-md font-semibold">{addon.name}</h3>
              <p className="text-sm text-gray-600">{addon.description}</p>
            </div>
            <div className="flex flex-col items-start md:items-end">
              <span className="text-blue-600 font-bold">{addon.price}</span>
              <button
                onClick={() => handlePurchase(addon.id)}
                disabled={purchased.includes(addon.id)}
                className={`mt-2 px-3 py-1 rounded text-white ${
                  purchased.includes(addon.id) ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {purchased.includes(addon.id) ? "Purchased" : "Buy Now"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
