// app/privacy/page.jsx
"use client";
import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-blue-700">Privacy Policy</h1>

      <p className="text-sm text-gray-700">
        This Privacy Policy describes how we collect, use, and protect your information when you use AI IT Assistant.
      </p>

      <h2 className="text-xl font-semibold text-gray-800 mt-6">1. Information We Collect</h2>
      <ul className="list-disc list-inside text-sm text-gray-700">
        <li>Basic user information (name, email, role)</li>
        <li>Diagnostic session logs and support tickets</li>
        <li>Usage statistics and metadata</li>
        <li>Local storage preferences (e.g., dark mode, saved sessions)</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-800 mt-6">2. How We Use Your Data</h2>
      <ul className="list-disc list-inside text-sm text-gray-700">
        <li>To provide AI-powered support tools and analytics</li>
        <li>To improve troubleshooting suggestions and product performance</li>
        <li>To provide customer support and respond to inquiries</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-800 mt-6">3. Data Sharing & Retention</h2>
      <ul className="list-disc list-inside text-sm text-gray-700">
        <li>We do not sell your data</li>
        <li>Data is shared only with service providers as required for operation</li>
        <li>Session and usage data may be anonymized for analysis</li>
        <li>Enterprise customers can request full on-prem isolation</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-800 mt-6">4. Your Rights</h2>
      <ul className="list-disc list-inside text-sm text-gray-700">
        <li>Request data export or deletion</li>
        <li>Withdraw consent at any time</li>
        <li>Review or update your profile info</li>
      </ul>

      <p className="text-sm text-gray-500 mt-8">
        Questions? Contact us at <a href="mailto:privacy@aiitassistant.com" className="underline text-blue-600">privacy@aiitassistant.com</a>
      </p>
    </div>
  );
}
