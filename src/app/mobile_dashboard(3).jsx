// components/MobileDashboard.jsx
"use client";
import React, { useState } from "react";
import ScriptVaultMobile from "@/components/ScriptVault";
import ChatGPTFrontend from "@/components/ChatGPTFrontend";
import TaskMonitorPanel from "@/components/TaskMonitorPanel";
import AuditLogViewerPanel from "@/components/AuditLogViewerPanel";
import InstallPromptButton from "@/components/InstallPromptButton";



const tabs = ["Scripts", "Chat", "Tasks", "Audit"];


export default function MobileDashboard() {
  const [active, setActive] = useState("Scripts");

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="p-4 text-center text-blue-700 font-bold border-b sticky top-0 bg-white z-10">
        AI IT Assistant
      </header>

      <main className="flex-1 p-2 overflow-y-auto text-sm space-y-4 max-w-md mx-auto">
        {active === "Scripts" && <ScriptVaultMobile />}
        {active === "Chat" && <ChatGPTFrontend />}
        {active === "Tasks" && <TaskMonitorPanel />}
		{active === "Audit" && <AuditLogViewerPanel />}
		<InstallPromptButton />


      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around text-xs z-10">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`flex-1 py-3 ${active === tab ? "text-blue-600 font-semibold" : "text-gray-500"}`}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
}
