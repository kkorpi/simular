"use client";

import { Upload, FileText, Image, FileArchive } from "lucide-react";

const mockUploads = [
  { id: "1", title: "CONSULTING AGREEMENT _ PSL x Kevin Korpi.docx", type: "DOCX", size: "42 KB", date: "Today", conversation: "Research inbound founder" },
  { id: "2", title: "Q1 Pipeline Review.pdf", type: "PDF", size: "1.2 MB", date: "Yesterday", conversation: "Weekly competitor digest" },
  { id: "3", title: "headshot-2024.jpg", type: "JPG", size: "340 KB", date: "Mar 10", conversation: "Research inbound founder" },
  { id: "4", title: "fund-III-deck-final.pdf", type: "PDF", size: "8.4 MB", date: "Mar 8", conversation: "Weekly competitor digest" },
  { id: "5", title: "portfolio-data-export.csv", type: "CSV", size: "156 KB", date: "Mar 5", conversation: "Forward Asana digest to Slack" },
];

function TypeIcon({ type }: { type: string }) {
  const cls = "h-4 w-4 text-t3";
  switch (type) {
    case "JPG": case "PNG": return <Image className={cls} />;
    case "ZIP": return <FileArchive className={cls} />;
    default: return <FileText className={cls} />;
  }
}

export function UploadsPage() {
  return (
    <div className="relative flex min-w-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[700px] px-8 py-8 max-md:px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[18px] font-semibold text-t1">Uploads</h1>
              <p className="mt-1 text-[13px] text-t3">Files you've shared with Sai for reference.</p>
            </div>
            <button className="flex items-center gap-2 rounded-md border border-b1 px-3 py-2 text-[12px] font-medium text-t2 transition-colors hover:border-b2 hover:bg-bg3 hover:text-t1">
              <Upload className="h-3.5 w-3.5" />
              Upload file
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            {mockUploads.map((upload) => (
              <button
                key={upload.id}
                className="flex items-center gap-3 rounded-lg border border-b1 bg-bg3/30 px-4 py-3 text-left transition-colors hover:border-b2 hover:bg-bg3/60"
              >
                <TypeIcon type={upload.type} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium text-t1">{upload.title}</div>
                  <div className="mt-0.5 text-[11px] text-t4">{upload.conversation}</div>
                </div>
                <div className="shrink-0 text-[11px] text-t4">{upload.size}</div>
                <div className="shrink-0 text-[11px] text-t4">{upload.date}</div>
                <span className="shrink-0 rounded border border-b1 bg-bg3 px-1.5 py-0.5 text-[10px] text-t3">{upload.type}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
