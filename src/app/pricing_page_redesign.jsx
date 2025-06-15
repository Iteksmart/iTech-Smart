// app/pricing/page.jsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";

const plans = [
  {
    name: "Free",
    price: "$0/mo",
    features: [
      "Basic AI troubleshooting",
      "5 AI chat queries/day",
      "Limited command suggestions",
      "No ticket exports",
      "No team features"
    ],
    cta: "Start for Free"
  },
  {
    name: "Pro",
    price: "$15/mo",
    features: [
      "Unlimited AI chat & command suggestions",
      "Ticket note generator",
      "Playbooks & checklist access",
      "Basic team sharing",
      "Export capabilities"
    ],
    cta: "Upgrade to Pro"
  },
  {
    name: "Team",
    price: "$49/mo",
    features: [
      "All Pro features",
      "5 team seats included",
      "Add/manage team members",
      "Analytics dashboard (coming soon)",
      "Priority support"
    ],
    cta: "Start Team Plan"
  }
];

export default function PricingPage() {
  const router = useRouter();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">Choose Your Plan</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, idx) => (
          <div key={idx} className="border rounded-xl p-6 shadow hover:shadow-lg bg-white">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">{plan.name}</h2>
            <p className="text-2xl font-bold text-blue-600 mb-4">{plan.price}</p>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              {plan.features.map((f, i) => (
                <li key={i}>• {f}</li>
              ))}
            </ul>
            <button
              onClick={() => router.push("/signup")}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
