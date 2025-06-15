// app/page.jsx
"use client";
import React from "react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-white min-h-screen px-6 py-12 text-center">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-blue-700">
          Resolve IT Tickets 2x Faster with AI
        </h1>
        <p className="text-lg text-gray-600">
          Troubleshoot smarter, automate fixes, and log tickets instantly. Your AI-powered IT sidekick is here.
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <Link href="/dashboard?demo=true">
            <button className="bg-yellow-500 text-white px-6 py-3 rounded hover:bg-yellow-600">
              Try Demo Now
            </button>
          </Link>
          <Link href="/signup">
            <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
              Get Started Free
            </button>
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3 text-left">
          {[
            {
              title: "AI-Guided OSI Troubleshooting",
              desc: "Diagnose issues layer by layer using OSI logic — from Physical to Application."
            },
            {
              title: "Smart Command Suggestions",
              desc: "Get the exact PowerShell, CMD, or Bash command needed to fix the issue."
            },
            {
              title: "One-Click Ticket Notes",
              desc: "Auto-generate resolution notes for logs or ticket systems."
            }
          ].map((feature, i) => (
            <div key={i} className="p-4 border rounded shadow-sm bg-gray-50">
              <h3 className="text-md font-semibold text-blue-700 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-700">{feature.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-500 mt-16">
          No credit card required. Try it free — boost your IT team’s productivity today.
        </p>
      </div>
    </div>
  );
}