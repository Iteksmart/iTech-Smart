// components/SSOSupportInfo.jsx
"use client";
import React from "react";

export default function SSOSupportInfo() {
  return (
    <div className="p-6 bg-white border rounded shadow space-y-4">
      <h2 className="text-xl font-bold text-blue-700">SSO & Enterprise Identity Integration</h2>
      <p className="text-sm text-gray-600">
        Support for SSO via SAML, OAuth2, and LDAP is available for enterprise customers.
        To enable enterprise login for your organization, please contact us directly to begin configuration.
      </p>

      <ul className="list-disc list-inside text-sm text-gray-700">
        <li>🔐 SAML 2.0 (Okta, Azure AD, Google Workspace)</li>
        <li>🧠 OAuth2-based login (Microsoft, GitHub, Google)</li>
        <li>🗂 LDAP directory sync for internal user provisioning</li>
        <li>📄 Enterprise audit logging & access control</li>
      </ul>

      <p className="text-sm mt-4 text-gray-600">
        Need a quote or technical documentation? Reach out at <a className="text-blue-600 underline" href="mailto:enterprise@aiitassistant.com">enterprise@aiitassistant.com</a>
      </p>
    </div>
  );
}
