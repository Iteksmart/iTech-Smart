// app/dashboard/page.jsx
"use client";
import React from "react";
import OSIFlow from "@/components/OSIFlow";
import CommandSuggestor from "@/components/CommandSuggestor";
import TicketNoteGenerator from "@/components/TicketNoteGenerator";
import PlaybookChecklist from "@/components/PlaybookChecklist";
import KnowledgeBase from "@/components/KnowledgeBase";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
        AI IT Assistant – Unified Troubleshooting Dashboard
      </h1>

      <section>
        <OSIFlow />
      </section>

      <hr className="my-4 border-gray-300" />

      <section>
        <CommandSuggestor />
      </section>

      <hr className="my-4 border-gray-300" />

      <section>
        <TicketNoteGenerator />
      </section>

      <hr className="my-4 border-gray-300" />

      <section>
        <PlaybookChecklist />
      </section>

      <hr className="my-4 border-gray-300" />

      <section>
        <KnowledgeBase />
      </section>
    </div>
  );
}
