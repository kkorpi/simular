"use client";

import { FileText, FileSpreadsheet, Mail, Code, File } from "lucide-react";

const mockArtifacts = [
  { id: "1", title: "Founder Dossier — Abridge", type: "Document", format: "document", date: "Today", conversation: "Research inbound founder" },
  { id: "2", title: "Deal Sourcing Digest — Feb 13", type: "Spreadsheet", format: "spreadsheet", date: "Today", conversation: "Weekly competitor digest" },
  { id: "3", title: "LP Meeting Prep Briefing", type: "Document", format: "document", date: "Yesterday", conversation: "Research inbound founder" },
  { id: "4", title: "Draft follow-up email to Sequoia", type: "Email", format: "email", date: "Yesterday", conversation: "Research inbound founder" },
  { id: "5", title: "Competitor Landscape Analysis", type: "Spreadsheet", format: "spreadsheet", date: "Mar 8", conversation: "Weekly competitor digest" },
  { id: "6", title: "Asana Digest Workflow Script", type: "Code", format: "code", date: "Mar 5", conversation: "Forward Asana digest to Slack" },
];

function FormatIcon({ format }: { format: string }) {
  const cls = "h-4 w-4 text-t3";
  switch (format) {
    case "spreadsheet": return <FileSpreadsheet className={cls} />;
    case "email": return <Mail className={cls} />;
    case "code": return <Code className={cls} />;
    default: return <FileText className={cls} />;
  }
}

export function ArtifactsPage() {
  return (
    <div className="relative flex min-w-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[700px] px-8 py-8 max-md:px-4">
          <h1 className="text-[18px] font-semibold text-t1">Artifacts</h1>
          <p className="mt-1 text-[13px] text-t3">Files and documents created by Sai across your conversations.</p>

          <div className="mt-6 flex flex-col gap-2">
            {mockArtifacts.map((artifact) => (
              <button
                key={artifact.id}
                className="flex items-center gap-3 rounded-lg border border-b1 bg-bg3/30 px-4 py-3 text-left transition-colors hover:border-b2 hover:bg-bg3/60"
              >
                <FormatIcon format={artifact.format} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium text-t1">{artifact.title}</div>
                  <div className="mt-0.5 text-[11px] text-t4">{artifact.conversation}</div>
                </div>
                <div className="shrink-0 text-[11px] text-t4">{artifact.date}</div>
                <span className="shrink-0 rounded border border-b1 bg-bg3 px-1.5 py-0.5 text-[10px] text-t3">{artifact.type}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
