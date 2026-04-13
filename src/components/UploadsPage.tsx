"use client";

import { Upload } from "lucide-react";

interface UploadItem {
  id: string;
  title: string;
  type: "PDF" | "DOCX" | "JPG" | "PNG" | "CSV" | "TXT" | "XLSX";
  size: string;
  preview: "image" | "text" | "spreadsheet" | "document";
  previewContent?: string;
  previewLines?: number;
  conversation: string;
}

const mockUploads: UploadItem[] = [
  {
    id: "1",
    title: "headshot-2024.jpg",
    type: "JPG",
    size: "340 KB",
    preview: "image",
    conversation: "Research inbound founder",
  },
  {
    id: "2",
    title: "Q1 Pipeline Review.pdf",
    type: "PDF",
    size: "1.2 MB",
    preview: "document",
    previewContent: "Q1 2026 Pipeline Review\n\nTotal pipeline value: $24.3M across 18 active opportunities. Key highlights include 3 deals in final stages totaling $8.2M, with expected close dates in April.",
    conversation: "Weekly competitor digest",
  },
  {
    id: "3",
    title: "fund-III-deck-final.pdf",
    type: "PDF",
    size: "8.4 MB",
    preview: "document",
    previewContent: "Primordial Soup Labs\nFund III\n\nInvestment Strategy & Track Record\n\nTarget: $150M · Focus: Pre-seed & Seed\nSectors: AI Infrastructure, Developer Tools, Vertical SaaS",
    conversation: "Weekly competitor digest",
  },
  {
    id: "4",
    title: "CONSULTING AGREEMENT _ PSL x Kevin Korpi.docx",
    type: "DOCX",
    size: "42 KB",
    preview: "text",
    previewContent: "CONSULTING AGREEMENT\n\nThis CONSULTING AGREEMENT (this \"Agreement\") is made and entered into as of the Effective Date set forth below by and between Primordial Soup Labs, Inc., a Delaware corporation (\"Client\"), and Kevin Korpi (\"Consultant\").",
    previewLines: 110,
    conversation: "Research inbound founder",
  },
  {
    id: "5",
    title: "portfolio-data-export.csv",
    type: "CSV",
    size: "156 KB",
    preview: "spreadsheet",
    previewContent: "Company,Stage,Amount,Date\nAbridge,Series C,$150M,2026-02\nNovaTech,Seed,$4.2M,2025-11\nClearStack,Seed,$3.1M,2025-09",
    conversation: "Forward Asana digest to Slack",
  },
  {
    id: "6",
    title: "competitor-landscape.png",
    type: "PNG",
    size: "520 KB",
    preview: "image",
    conversation: "Weekly competitor digest",
  },
  {
    id: "7",
    title: "Linus - Brand Identity Brief.txt",
    type: "TXT",
    size: "8 KB",
    preview: "text",
    previewContent: "Linus Analytics was founded by leaders with firsthand experience in the challenges—and opportunities—of the manufacturing and scrap metal industries. Drawing on decades of expertise, our founders are committed to developing solutions that help our customers harness their data to drive better business outcomes.",
    previewLines: 113,
    conversation: "Research inbound founder",
  },
  {
    id: "8",
    title: "LP Meeting Notes - March.txt",
    type: "TXT",
    size: "4 KB",
    preview: "text",
    previewContent: "LP Meeting Notes\nMarch 2026\n\nAttendees: Katie Chen, Fund III LPs\n\nAgenda:\n1. Portfolio performance update\n2. New deal pipeline review\n3. Fund III deployment timeline\n4. Q&A",
    previewLines: 45,
    conversation: "Research inbound founder",
  },
];

function ImagePreview() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-bg3">
      <div className="flex flex-col items-center gap-2 text-t4">
        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
    </div>
  );
}

function TextPreview({ content, lines }: { content: string; lines?: number }) {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-bg3 p-4">
      <p className="flex-1 overflow-hidden text-[11px] leading-[1.5] text-t3 whitespace-pre-wrap">
        {content}
      </p>
      {lines && (
        <div className="mt-auto pt-2 text-[10px] text-t4">{lines} lines</div>
      )}
    </div>
  );
}

function SpreadsheetPreview({ content }: { content: string }) {
  const rows = content.split("\n").filter(Boolean);
  const headers = rows[0]?.split(",") ?? [];
  const data = rows.slice(1).map((r) => r.split(","));

  return (
    <div className="flex h-full flex-col overflow-hidden bg-bg3 p-3">
      <table className="w-full text-[10px]">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="border-b border-b1 pb-1.5 text-left font-medium text-t3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="py-1 text-t4">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DocumentPreview({ content }: { content: string }) {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-bg3 p-4">
      <p className="flex-1 overflow-hidden text-[11px] leading-[1.5] text-t3 whitespace-pre-wrap">
        {content}
      </p>
    </div>
  );
}

export function UploadsPage() {
  return (
    <div className="relative flex min-w-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[900px] px-8 py-8 max-md:px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[18px] font-semibold text-t1">Uploads</h1>
              <p className="mt-1 text-[13px] text-t3">Files you&apos;ve shared with Sai for reference.</p>
            </div>
            <button className="flex items-center gap-2 rounded-md border border-b1 px-3 py-2 text-[12px] font-medium text-t2 transition-colors hover:border-b2 hover:bg-bg3 hover:text-t1">
              <Upload className="h-3.5 w-3.5" />
              Upload file
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 max-md:grid-cols-1">
            {mockUploads.map((upload) => (
              <button
                key={upload.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-b1 bg-bg2 text-left transition-colors hover:border-b2"
              >
                {/* Preview area */}
                <div className="aspect-[4/3] w-full overflow-hidden">
                  {upload.preview === "image" && <ImagePreview />}
                  {upload.preview === "text" && <TextPreview content={upload.previewContent ?? ""} lines={upload.previewLines} />}
                  {upload.preview === "spreadsheet" && <SpreadsheetPreview content={upload.previewContent ?? ""} />}
                  {upload.preview === "document" && <DocumentPreview content={upload.previewContent ?? ""} />}
                </div>

                {/* Info footer */}
                <div className="flex items-center gap-2 border-t border-b1 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-medium text-t1 group-hover:text-t1">{upload.title}</div>
                  </div>
                  <span className="shrink-0 rounded border border-b1 bg-bg3 px-1.5 py-0.5 text-[10px] text-t3">{upload.type}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
