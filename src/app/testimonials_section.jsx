// components/TestimonialsSection.jsx
"use client";
import React from "react";

const testimonials = [
  {
    name: "Jake M.",
    role: "IT Support Lead @ MSP Group",
    quote: "This tool cut our resolution time in half. It's like having a junior tech that never sleeps."
  },
  {
    name: "Sandra T.",
    role: "Sysadmin, Mid-Sized Retail Chain",
    quote: "I used to Google commands constantly. Now they're just there — with notes!"
  },
  {
    name: "Kevin R.",
    role: "Tech Intern, University Helpdesk",
    quote: "I’ve learned more in 2 weeks using this than in a semester of IT classes."
  }
];

export default function TestimonialsSection() {
  return (
    <div className="bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-blue-700 mb-8">What IT Pros Are Saying</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="border rounded-lg bg-white p-4 shadow-sm text-left">
              <p className="text-gray-700 italic mb-3">“{t.quote}”</p>
              <p className="text-sm font-semibold text-gray-900">{t.name}</p>
              <p className="text-xs text-gray-500">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
