"use client";

import { useState, useEffect, useCallback } from "react";

/* ── Section definitions ── */

type Section = "colors" | "typography" | "icons" | "spacing" | "radius" | "shadows" | "animations";

const sections: { id: Section; label: string }[] = [
  { id: "colors", label: "Colors" },
  { id: "typography", label: "Typography" },
  { id: "icons", label: "Icons" },
  { id: "spacing", label: "Spacing" },
  { id: "radius", label: "Radius" },
  { id: "shadows", label: "Shadows" },
  { id: "animations", label: "Animations" },
];

/* ── Color token groups ── */

const colorGroups: { label: string; tokens: { name: string; var: string }[] }[] = [
  {
    label: "Backgrounds",
    tokens: [
      { name: "bg", var: "--bg" },
      { name: "bg2", var: "--bg2" },
      { name: "bg3", var: "--bg3" },
      { name: "bg3h", var: "--bg3h" },
      { name: "bgcard", var: "--bgcard" },
      { name: "bgi", var: "--bgi" },
      { name: "bgm", var: "--bgm" },
      { name: "bgmb", var: "--bgmb" },
    ],
  },
  {
    label: "Borders",
    tokens: [
      { name: "b1", var: "--b1" },
      { name: "b2", var: "--b2" },
      { name: "bf", var: "--bf" },
    ],
  },
  {
    label: "Text",
    tokens: [
      { name: "t1", var: "--t1" },
      { name: "t2", var: "--t2" },
      { name: "t3", var: "--t3" },
      { name: "t4", var: "--t4" },
    ],
  },
  {
    label: "Accent",
    tokens: [
      { name: "as", var: "--as" },
      { name: "as2", var: "--as2" },
      { name: "ab", var: "--ab" },
      { name: "abt", var: "--abt" },
    ],
  },
  {
    label: "Green",
    tokens: [
      { name: "g", var: "--g" },
      { name: "gs", var: "--gs" },
      { name: "gg", var: "--gg" },
      { name: "gt", var: "--gt" },
    ],
  },
  {
    label: "Amber",
    tokens: [
      { name: "am", var: "--am" },
      { name: "ams", var: "--ams" },
    ],
  },
  {
    label: "Blue",
    tokens: [
      { name: "bl", var: "--bl" },
      { name: "bls", var: "--bls" },
      { name: "blt", var: "--blt" },
    ],
  },
  {
    label: "UI",
    tokens: [
      { name: "lb", var: "--lb" },
      { name: "lt", var: "--lt" },
      { name: "st", var: "--st" },
      { name: "sb", var: "--sb" },
    ],
  },
];

/* ── Extended colors (Tailwind direct, not CSS vars) ── */

const extendedColorGroups: { label: string; desc: string; swatches: { name: string; bg: string; hex: string }[] }[] = [
  {
    label: "Violet — Teach / Learn Mode",
    desc: "Used for teach mode UI: step logs, recording indicators, workspace coaching bar, session dividers.",
    swatches: [
      { name: "violet-600", bg: "#7c3aed", hex: "#7C3AED" },
      { name: "violet-500", bg: "#8b5cf6", hex: "#8B5CF6" },
      { name: "violet-400", bg: "#a78bfa", hex: "#A78BFA" },
      { name: "violet-500/20", bg: "rgba(139, 92, 246, 0.2)", hex: "rgba(139,92,246,0.2)" },
      { name: "violet-500/10", bg: "rgba(139, 92, 246, 0.1)", hex: "rgba(139,92,246,0.1)" },
      { name: "violet-500/[0.04]", bg: "rgba(139, 92, 246, 0.04)", hex: "rgba(139,92,246,0.04)" },
    ],
  },
  {
    label: "Red — Error / Destructive",
    desc: "Used sparingly: invalid input borders, error text, cancel/destructive actions, schedule deletion.",
    swatches: [
      { name: "red-500", bg: "#ef4444", hex: "#EF4444" },
      { name: "red-400", bg: "#f87171", hex: "#F87171" },
      { name: "red-300", bg: "#fca5a5", hex: "#FCA5A5" },
    ],
  },
  {
    label: "Amber — Extended Warning",
    desc: "Used for trial urgency badges, warning borders, attention states beyond the --am token.",
    swatches: [
      { name: "amber-500", bg: "#f59e0b", hex: "#F59E0B" },
      { name: "amber-500/30", bg: "rgba(245, 158, 11, 0.3)", hex: "rgba(245,158,11,0.3)" },
      { name: "amber-500/15", bg: "rgba(245, 158, 11, 0.15)", hex: "rgba(245,158,11,0.15)" },
      { name: "amber-500/[0.04]", bg: "rgba(245, 158, 11, 0.04)", hex: "rgba(245,158,11,0.04)" },
    ],
  },
  {
    label: "Brand",
    desc: "Third-party brand colors used in login cards. Currently only LinkedIn is hardcoded in the prototype.",
    swatches: [
      { name: "LinkedIn", bg: "#0A66C2", hex: "#0A66C2" },
    ],
  },
];

/* ── Type ramp definitions ── */

const headings = [
  { label: "heading-1", size: "24px", weight: 600, sample: "The quick brown fox jumps" },
  { label: "heading-2", size: "20px", weight: 600, sample: "The quick brown fox jumps" },
  { label: "heading-3", size: "18px", weight: 600, sample: "The quick brown fox jumps" },
  { label: "heading-4", size: "16px", weight: 600, sample: "The quick brown fox jumps" },
  { label: "heading-5", size: "14px", weight: 500, sample: "The quick brown fox jumps" },
  { label: "heading-6", size: "12px", weight: 500, sample: "The quick brown fox jumps" },
];

const bodyStyles = [
  { label: "body-1", size: "13px", weight: 400, sample: "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs." },
  { label: "body-2", size: "12px", weight: 400, sample: "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs." },
  { label: "body-3", size: "11px", weight: 400, sample: "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs." },
  { label: "caption", size: "10px", weight: 500, sample: "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG" },
];

const monoStyles = [
  { label: "mono-1", size: "13px", weight: 400, sample: "const agent = new Simular({ model: 'opus' });" },
  { label: "mono-2", size: "12px", weight: 400, sample: "git commit -m 'fix: resolve auth token refresh'" },
];

/* ── Spacing scale ── */

const spacingScale = [
  { label: "0.5", px: 2 },
  { label: "1", px: 4 },
  { label: "1.5", px: 6 },
  { label: "2", px: 8 },
  { label: "2.5", px: 10 },
  { label: "3", px: 12 },
  { label: "4", px: 16 },
  { label: "5", px: 20 },
  { label: "6", px: 24 },
  { label: "8", px: 32 },
];

/* ── Radius scale ── */

const radiusScale = [
  { label: "rounded-md", value: "6px", css: "0.375rem" },
  { label: "rounded-lg", value: "8px", css: "0.5rem" },
  { label: "rounded-xl", value: "12px", css: "0.75rem" },
  { label: "rounded-2xl", value: "16px", css: "1rem" },
  { label: "rounded-full", value: "9999px", css: "9999px" },
];

/* ── Shadow definitions ── */

const shadowDefs = [
  { label: "Card shadow", var: "--sc", desc: "Standard card/modal" },
  { label: "Card shadow (light)", var: "--card-shadow", desc: "Light mode card shadow" },
  { label: "Thumbnail shadow", var: "--thumb-shadow", desc: "Floating workspace thumbnail" },
];

/* ── Animation definitions ── */

const animationDefs = [
  { label: "pulse-dot", desc: "Status indicator pulse", className: "h-2 w-2 rounded-full bg-g animate-[pulse-dot_2s_ease-in-out_infinite]" },
  { label: "working-dots", desc: "Loading indicator", className: "" /* custom render */ },
  { label: "running-ping", desc: "Active task ring", className: "h-3 w-3 rounded-full bg-g/40 animate-[running-ping_2s_ease-in-out_infinite]" },
  { label: "shimmer-text", desc: "Text loading sweep", className: "" /* custom render */ },
  { label: "fade-in", desc: "Element entrance", className: "h-8 w-8 rounded-md bg-as animate-[fade-in_0.4s_ease-out]" },
];

/* ── Helpers ── */

function resolveVar(varName: string): string {
  if (typeof window === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

function rgbToHex(rgb: string): string {
  // Handle already-hex values
  if (rgb.startsWith("#")) return rgb;
  // Handle rgba(r, g, b, a) or rgb(r, g, b)
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return rgb;
  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function formatColor(raw: string): string {
  if (!raw) return "–";
  if (raw.startsWith("rgba")) return raw;
  return rgbToHex(raw).toUpperCase();
}

/* ── Swatch component ── */

function Swatch({ name, cssVar, resolvedColors }: { name: string; cssVar: string; resolvedColors: Record<string, string> }) {
  const [copied, setCopied] = useState(false);
  const resolved = resolvedColors[cssVar] || "";
  const display = formatColor(resolved);
  const isTransparent = resolved.includes("rgba") && resolved.includes("0.");

  const handleCopy = () => {
    navigator.clipboard.writeText(display);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <button onClick={handleCopy} className="group flex flex-col gap-1.5 text-left">
      <div
        className={`h-[64px] w-full rounded-lg border border-b1 transition-all group-hover:scale-[1.03] ${isTransparent ? "bg-[repeating-conic-gradient(#333_0%_25%,#222_0%_50%)_0_0/12px_12px]" : ""}`}
        style={{ backgroundColor: resolved }}
      />
      <div className="text-[11px] font-medium text-t2">{name}</div>
      <div className="text-[10px] font-mono text-t4">
        {copied ? (
          <span className="text-g">Copied</span>
        ) : (
          display
        )}
      </div>
    </button>
  );
}

/* ── Hard swatch (for non-CSS-var colors) ── */

function HardSwatch({ name, bg, hex }: { name: string; bg: string; hex: string }) {
  const [copied, setCopied] = useState(false);
  const isTransparent = bg.includes("rgba") && bg.includes("0.");

  const handleCopy = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <button onClick={handleCopy} className="group flex flex-col gap-1.5 text-left">
      <div
        className={`h-[64px] w-full rounded-lg border border-b1 transition-all group-hover:scale-[1.03] ${isTransparent ? "bg-[repeating-conic-gradient(#333_0%_25%,#222_0%_50%)_0_0/12px_12px]" : ""}`}
        style={{ backgroundColor: bg }}
      />
      <div className="text-[11px] font-medium text-t2">{name}</div>
      <div className="text-[10px] font-mono text-t4">
        {copied ? <span className="text-g">Copied</span> : hex}
      </div>
    </button>
  );
}

/* ── Icon definitions ── */

type IconDef = { name: string; usage: string; svg: React.ReactNode };

const iconGroups: { label: string; icons: IconDef[] }[] = [
  {
    label: "Navigation",
    icons: [
      { name: "Close", usage: "Modals, overlays, panels", svg: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg> },
      { name: "Chevron down", usage: "Collapsible sections, dropdowns", svg: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg> },
      { name: "Chevron right", usage: "List items, navigation links", svg: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg> },
      { name: "Back arrow", usage: "Panel back navigation", svg: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg> },
      { name: "External link", usage: "Open in new context", svg: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg> },
    ],
  },
  {
    label: "Actions",
    icons: [
      { name: "Checkmark", usage: "Success, completed steps, confirmation", svg: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> },
      { name: "Search", usage: "Task input, search fields", svg: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg> },
      { name: "Edit / Pencil", usage: "Draft editing, inline edit", svg: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg> },
      { name: "Send", usage: "Message submit button", svg: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></svg> },
      { name: "Plus", usage: "Attach, add new item", svg: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg> },
      { name: "Repeat / Recurring", usage: "Recurring task suggestions", svg: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 014-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 01-4 4H3" /></svg> },
    ],
  },
  {
    label: "Status",
    icons: [
      { name: "Warning triangle", usage: "Warnings, severity badges", svg: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg> },
      { name: "Info circle", usage: "Info badges, help indicators", svg: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg> },
      { name: "Error circle", usage: "Failed steps, error states", svg: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg> },
      { name: "Clock", usage: "Schedule, time references, rate limits", svg: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> },
    ],
  },
  {
    label: "Security",
    icons: [
      { name: "Lock", usage: "Auth required, login cards", svg: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg> },
      { name: "Shield", usage: "Trust signals, encryption", svg: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg> },
    ],
  },
  {
    label: "Objects",
    icons: [
      { name: "Document", usage: "Result cards, file references", svg: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg> },
      { name: "Grid / Gallery", usage: "Card gallery, dashboard views", svg: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg> },
      { name: "Star", usage: "Skills, favorites", svg: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg> },
      { name: "Bolt / Lightning", usage: "Quick actions, slash commands", svg: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg> },
      { name: "Book", usage: "Teach mode", svg: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" /></svg> },
      { name: "Phone / Mobile", usage: "App promo card", svg: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg> },
    ],
  },
  {
    label: "Settings & UI",
    icons: [
      { name: "Settings / Gear", usage: "Settings overlay, preferences", svg: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" /></svg> },
      { name: "Sidebar panel", usage: "Mobile panel toggle, expand/collapse", svg: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="15" y1="3" x2="15" y2="21" /><polyline points="10 8 7 12 10 16" /></svg> },
      { name: "Credit card", usage: "Payment, subscription", svg: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg> },
      { name: "Layers", usage: "Credits, stacked items", svg: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg> },
      { name: "Log out", usage: "Avatar menu logout", svg: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg> },
      { name: "Design system", usage: "Design system page link", svg: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><line x1="21.17" y1="8" x2="12" y2="8" /><line x1="3.95" y1="6.06" x2="8.54" y2="14" /><line x1="10.88" y1="21.94" x2="15.46" y2="14" /></svg> },
    ],
  },
  {
    label: "Brand Logos",
    icons: [
      { name: "LinkedIn", usage: "Login card, integration", svg: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg> },
      { name: "Gmail", usage: "Login card, integration", svg: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M2 6l10 7 10-7" stroke="#EA4335" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><rect x="2" y="4" width="20" height="16" rx="2" stroke="#EA4335" strokeWidth="2" /></svg> },
      { name: "Salesforce", usage: "Login card, integration", svg: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#00A1E0"><path d="M10.05 4.55c.91-.94 2.18-1.52 3.58-1.52 1.81 0 3.39.98 4.24 2.44A5.48 5.48 0 0119.5 5c3.04 0 4.5 2.46 4.5 5.5S22.54 16 19.5 16h-.52c-.61 1.77-2.28 3.04-4.24 3.04-1.14 0-2.18-.42-2.97-1.12A4.47 4.47 0 018.5 19.5c-1.7 0-3.18-.95-3.93-2.34A4 4 0 014 17.25c-2.21 0-4-1.79-4-4s1.79-4 4-4c.23 0 .46.02.68.06A5.49 5.49 0 0110.05 4.55z" /></svg> },
      { name: "Slack", usage: "Integration", svg: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="#4A154B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z" /><path d="M20.5 10H19v-1.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" /><path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z" /><path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z" /><path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z" /><path d="M14 20.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5z" /></svg> },
      { name: "Notion", usage: "Integration", svg: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L18.29 2.168c-.42-.326-.98-.7-2.055-.607L3.01 2.721c-.466.046-.56.28-.374.466l1.823 1.021zm.793 3.358v13.904c0 .747.373 1.027 1.213.98l14.523-.84c.84-.046.933-.56.933-1.166V6.727c0-.607-.233-.933-.747-.886l-15.176.886c-.56.047-.746.327-.746.84zm14.337.745c.093.42 0 .84-.42.886l-.7.14v10.264c-.607.327-1.166.514-1.633.514-.746 0-.933-.234-1.493-.933l-4.571-7.178v6.952l1.446.327s0 .84-1.166.84l-3.218.187c-.093-.187 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.093-.42.14-1.026.793-1.073l3.451-.233 4.758 7.272V9.294l-1.213-.14c-.093-.514.28-.886.747-.933l3.218-.187z" /></svg> },
      { name: "X / Twitter", usage: "Integration, social", svg: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg> },
      { name: "Crunchbase", usage: "Integration, data source", svg: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="#0288D1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 12a4 4 0 108 0 4 4 0 00-8 0" /></svg> },
      { name: "Google Calendar", usage: "Integration", svg: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg> },
      { name: "Simular", usage: "Top bar branding", svg: <div className="flex h-[24px] w-[24px] items-center justify-center rounded-[6px] bg-[var(--logo-bg)]"><div className="h-[10px] w-[10px] rounded-full bg-[var(--logo-fg)]" /></div> },
    ],
  },
];

/* ── Main component ── */

export function DesignSystem({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [activeSection, setActiveSection] = useState<Section>("colors");
  const [resolvedColors, setResolvedColors] = useState<Record<string, string>>({});
  const [refreshKey, setRefreshKey] = useState(0);

  // Resolve all CSS variables on mount and when theme changes
  const resolveAll = useCallback(() => {
    const resolved: Record<string, string> = {};
    for (const group of colorGroups) {
      for (const token of group.tokens) {
        resolved[token.var] = resolveVar(token.var);
      }
    }
    setResolvedColors(resolved);
  }, []);

  useEffect(() => {
    if (!open) return;
    resolveAll();

    // Watch for theme changes via attribute mutation
    const observer = new MutationObserver(() => {
      resolveAll();
      setRefreshKey((k) => k + 1);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, [open, resolveAll]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-bg">
      {/* Top bar */}
      <div className="flex h-[52px] shrink-0 items-center justify-between border-b border-b1 px-5">
        <div className="flex items-center gap-3">
          <svg className="h-4 w-4 text-t3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
            <line x1="21.17" y1="8" x2="12" y2="8" />
            <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
            <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
          </svg>
          <span className="text-[14px] font-semibold text-t1">Design System</span>
          <span className="rounded-full bg-bg3h px-2 py-0.5 text-[10px] font-medium text-t3">{sections.length} sections</span>
        </div>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-md text-t3 transition-all hover:bg-bg3 hover:text-t1"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden max-md:flex-col">
        {/* Section nav */}
        <div className="flex w-[200px] shrink-0 flex-col border-r border-b1 bg-bg2 overflow-y-auto max-md:w-full max-md:flex-row max-md:border-r-0 max-md:border-b max-md:overflow-y-visible max-md:overflow-x-auto max-md:shrink-0">
          <div className="py-4 max-md:py-0 max-md:flex max-md:items-stretch max-md:px-2 max-md:gap-0">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full px-5 py-2.5 text-left transition-all max-md:w-auto max-md:shrink-0 max-md:px-3 max-md:py-2.5 max-md:text-center max-md:rounded-md max-md:my-1.5 ${
                  activeSection === s.id ? "bg-bg3" : "hover:bg-bg3/50"
                }`}
              >
                <div className={`text-[13px] font-medium max-md:text-[12px] max-md:whitespace-nowrap ${activeSection === s.id ? "text-t1" : "text-t3"}`}>
                  {s.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-8 max-md:px-4 max-md:py-5" key={refreshKey}>
          {/* Page header */}
          <div className="mb-8">
            <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-t4 mb-1">Design System</div>
            <div className="text-[24px] font-semibold text-t1 leading-tight">Simular Tokens</div>
          </div>

          {/* ── Colors ── */}
          {activeSection === "colors" && (
            <div className="space-y-10">
              <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-t3 mb-2">CSS Token Colors — Theme Aware</div>
              {colorGroups.map((group) => (
                <div key={group.label}>
                  <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-t4 mb-4">{group.label}</div>
                  <div className="grid grid-cols-4 gap-4 max-md:grid-cols-3 max-sm:grid-cols-2">
                    {group.tokens.map((token) => (
                      <Swatch key={token.var} name={token.name} cssVar={token.var} resolvedColors={resolvedColors} />
                    ))}
                  </div>
                </div>
              ))}

              {/* Extended (direct Tailwind) colors */}
              <div className="mt-4 pt-8 border-t border-b1">
                <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-t3 mb-6">Extended Colors — Tailwind Direct</div>
                <div className="text-[11px] text-t4 mb-8">These colors are used via Tailwind classes directly, not through CSS custom properties. They do not change between themes.</div>
                {extendedColorGroups.map((group) => (
                  <div key={group.label} className="mb-8">
                    <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-t4 mb-1">{group.label}</div>
                    <div className="text-[11px] text-t4 mb-4">{group.desc}</div>
                    <div className="grid grid-cols-4 gap-4 max-md:grid-cols-3 max-sm:grid-cols-2">
                      {group.swatches.map((s) => (
                        <HardSwatch key={s.name} name={s.name} bg={s.bg} hex={s.hex} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Typography ── */}
          {activeSection === "typography" && (
            <div className="space-y-10">
              {/* Headings */}
              <div>
                <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-t4 mb-6">Headings — Inter Semibold</div>
                <div className="space-y-5">
                  {headings.map((h) => (
                    <div key={h.label} className="flex items-baseline gap-6 border-b border-b1 pb-4 max-md:flex-col max-md:gap-1">
                      <div className="w-[120px] shrink-0 text-[11px] font-mono text-t4 max-md:w-auto">
                        {h.label} · {h.size}
                      </div>
                      <div style={{ fontSize: h.size, fontWeight: h.weight }} className="text-t1 leading-tight">
                        {h.sample}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Body */}
              <div>
                <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-t4 mb-6">Body — Inter Regular</div>
                <div className="space-y-5">
                  {bodyStyles.map((b) => (
                    <div key={b.label} className="flex items-baseline gap-6 border-b border-b1 pb-4 max-md:flex-col max-md:gap-1">
                      <div className="w-[120px] shrink-0 text-[11px] font-mono text-t4 max-md:w-auto">
                        {b.label} · {b.size}
                      </div>
                      <div style={{ fontSize: b.size, fontWeight: b.weight }} className="text-t2 leading-relaxed">
                        {b.sample}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mono */}
              <div>
                <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-t4 mb-6">Mono — JetBrains Mono</div>
                <div className="space-y-5">
                  {monoStyles.map((m) => (
                    <div key={m.label} className="flex items-baseline gap-6 border-b border-b1 pb-4 max-md:flex-col max-md:gap-1">
                      <div className="w-[120px] shrink-0 text-[11px] font-mono text-t4 max-md:w-auto">
                        {m.label} · {m.size}
                      </div>
                      <div style={{ fontSize: m.size, fontWeight: m.weight }} className="font-mono text-t2 leading-relaxed">
                        {m.sample}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Font stack */}
              <div>
                <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-t4 mb-4">Font Stack</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="rounded-md bg-bg3 px-2.5 py-1 text-[11px] font-mono text-t2">--font-sans</span>
                    <span className="text-[12px] text-t3">Inter (300, 400, 500, 600, 700)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-md bg-bg3 px-2.5 py-1 text-[11px] font-mono text-t2">--font-mono</span>
                    <span className="text-[12px] text-t3">JetBrains Mono (400, 500)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Icons ── */}
          {activeSection === "icons" && (
            <div className="space-y-10">
              {iconGroups.map((group) => (
                <div key={group.label}>
                  <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-t4 mb-4">{group.label}</div>
                  <div className="grid grid-cols-4 gap-3 max-md:grid-cols-3 max-sm:grid-cols-2">
                    {group.icons.map((icon) => (
                      <div
                        key={icon.name}
                        className="group flex flex-col items-center gap-2 rounded-lg border border-b1 bg-bgcard px-3 py-4 transition-all hover:border-b2 hover:bg-bg3"
                      >
                        <div className="flex h-[40px] w-[40px] items-center justify-center text-t1">
                          {icon.svg}
                        </div>
                        <div className="text-center">
                          <div className="text-[11px] font-medium text-t2">{icon.name}</div>
                          <div className="text-[10px] text-t4 mt-0.5">{icon.usage}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="mt-4 pt-6 border-t border-b1">
                <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-t4 mb-4">Icon Conventions</div>
                <div className="space-y-2 text-[12px] text-t3">
                  <div className="flex gap-2"><span className="font-mono text-t4 w-[140px] shrink-0">ViewBox</span> <span>0 0 24 24 (all icons)</span></div>
                  <div className="flex gap-2"><span className="font-mono text-t4 w-[140px] shrink-0">Fill</span> <span>none (stroke-based, except brand logos)</span></div>
                  <div className="flex gap-2"><span className="font-mono text-t4 w-[140px] shrink-0">Stroke</span> <span>currentColor (inherits from text color)</span></div>
                  <div className="flex gap-2"><span className="font-mono text-t4 w-[140px] shrink-0">Stroke width</span> <span>2 (standard), 1.5 (light), 2.5 (emphasis)</span></div>
                  <div className="flex gap-2"><span className="font-mono text-t4 w-[140px] shrink-0">Caps / Joins</span> <span>round / round</span></div>
                  <div className="flex gap-2"><span className="font-mono text-t4 w-[140px] shrink-0">Sizes used</span> <span>h-3 w-3, h-3.5 w-3.5, h-4 w-4, h-5 w-5</span></div>
                  <div className="flex gap-2"><span className="font-mono text-t4 w-[140px] shrink-0">Source</span> <span>Lucide (Feather-derived), inline SVG</span></div>
                </div>
              </div>
            </div>
          )}

          {/* ── Spacing ── */}
          {activeSection === "spacing" && (
            <div>
              <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-t4 mb-6">Spacing Scale — Tailwind Units</div>
              <div className="space-y-3">
                {spacingScale.map((s) => (
                  <div key={s.label} className="flex items-center gap-4">
                    <div className="w-[60px] shrink-0 text-right text-[11px] font-mono text-t4">
                      {s.label}
                    </div>
                    <div
                      className="h-[28px] rounded-md bg-as/60"
                      style={{ width: `${Math.max(s.px * 3, 6)}px` }}
                    />
                    <div className="text-[11px] text-t3">{s.px}px</div>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-t4 mb-4">Common Patterns</div>
                <div className="space-y-2 text-[12px] text-t3">
                  <div className="flex gap-2"><span className="font-mono text-t4 w-[140px] shrink-0">Card padding</span> <span>px-4 py-3 (16px / 12px)</span></div>
                  <div className="flex gap-2"><span className="font-mono text-t4 w-[140px] shrink-0">Section gap</span> <span>gap-4 (16px)</span></div>
                  <div className="flex gap-2"><span className="font-mono text-t4 w-[140px] shrink-0">Inline gap</span> <span>gap-2 (8px)</span></div>
                  <div className="flex gap-2"><span className="font-mono text-t4 w-[140px] shrink-0">Tight gap</span> <span>gap-1 (4px)</span></div>
                  <div className="flex gap-2"><span className="font-mono text-t4 w-[140px] shrink-0">Page padding</span> <span>px-8 (32px), mobile px-4 (16px)</span></div>
                  <div className="flex gap-2"><span className="font-mono text-t4 w-[140px] shrink-0">Modal padding</span> <span>px-6 py-5 (24px / 20px)</span></div>
                </div>
              </div>
            </div>
          )}

          {/* ── Radius ── */}
          {activeSection === "radius" && (
            <div>
              <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-t4 mb-6">Border Radius Scale</div>
              <div className="flex flex-wrap gap-8 max-md:gap-5">
                {radiusScale.map((r) => (
                  <div key={r.label} className="flex flex-col items-center gap-3">
                    <div
                      className="h-[80px] w-[80px] border-2 border-as bg-as/10"
                      style={{ borderRadius: r.css }}
                    />
                    <div className="text-center">
                      <div className="text-[11px] font-medium text-t2">{r.label}</div>
                      <div className="text-[10px] font-mono text-t4">{r.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-t4 mb-4">Usage</div>
                <div className="space-y-2 text-[12px] text-t3">
                  <div className="flex gap-2"><span className="font-mono text-t4 w-[140px] shrink-0">Buttons, inputs</span> <span>rounded-md (6px)</span></div>
                  <div className="flex gap-2"><span className="font-mono text-t4 w-[140px] shrink-0">Cards</span> <span>rounded-lg (8px)</span></div>
                  <div className="flex gap-2"><span className="font-mono text-t4 w-[140px] shrink-0">Modals</span> <span>rounded-xl to rounded-2xl (12–16px)</span></div>
                  <div className="flex gap-2"><span className="font-mono text-t4 w-[140px] shrink-0">Badges, pills</span> <span>rounded-full (9999px)</span></div>
                </div>
              </div>
            </div>
          )}

          {/* ── Shadows ── */}
          {activeSection === "shadows" && (
            <div>
              <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-t4 mb-6">Shadow Tokens</div>
              <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1">
                {shadowDefs.map((s) => {
                  const resolved = resolveVar(s.var);
                  return (
                    <div key={s.var} className="flex flex-col gap-3">
                      <div
                        className="h-[100px] rounded-xl bg-bgcard border border-b1"
                        style={{ boxShadow: resolved || "none" }}
                      />
                      <div>
                        <div className="text-[11px] font-medium text-t2">{s.label}</div>
                        <div className="text-[10px] font-mono text-t4 mt-0.5">{s.var}</div>
                        <div className="text-[10px] text-t4 mt-1">{s.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-10">
                <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-t4 mb-4">Backdrop</div>
                <div className="flex items-center gap-4">
                  <div className="relative h-[80px] w-[160px] rounded-xl border border-b1 overflow-hidden">
                    <div className="absolute inset-0 bg-bg3" />
                    <div className="absolute inset-0 bg-black/65 backdrop-blur-[5px] flex items-center justify-center">
                      <span className="text-[11px] text-t2">Overlay blur</span>
                    </div>
                  </div>
                  <div className="text-[12px] text-t3">
                    <div className="font-mono text-t4 text-[11px]">bg-black/65 backdrop-blur-[5px]</div>
                    <div className="mt-1">Used for modal backdrops</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Animations ── */}
          {activeSection === "animations" && (
            <div>
              <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-t4 mb-6">Animations</div>
              <div className="space-y-6">
                {/* pulse-dot */}
                <div className="flex items-center gap-6 rounded-lg border border-b1 bg-bgcard px-5 py-4">
                  <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-g" style={{ animation: "pulse-dot 2s ease-in-out infinite" }} />
                  </div>
                  <div>
                    <div className="text-[12px] font-medium text-t1">pulse-dot</div>
                    <div className="text-[11px] text-t3 mt-0.5">Status indicator glow. Used on live badges, active task dots.</div>
                    <div className="text-[10px] font-mono text-t4 mt-1">2s ease-in-out infinite</div>
                  </div>
                </div>

                {/* working-dots */}
                <div className="flex items-center gap-6 rounded-lg border border-b1 bg-bgcard px-5 py-4">
                  <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center gap-1">
                    <div className="h-1 w-1 rounded-full bg-t3" style={{ animation: "working-dots 1.4s ease-in-out infinite", animationDelay: "0s" }} />
                    <div className="h-1 w-1 rounded-full bg-t3" style={{ animation: "working-dots 1.4s ease-in-out infinite", animationDelay: "0.2s" }} />
                    <div className="h-1 w-1 rounded-full bg-t3" style={{ animation: "working-dots 1.4s ease-in-out infinite", animationDelay: "0.4s" }} />
                  </div>
                  <div>
                    <div className="text-[12px] font-medium text-t1">working-dots</div>
                    <div className="text-[11px] text-t3 mt-0.5">Loading indicator. Three bouncing dots for connecting/thinking states.</div>
                    <div className="text-[10px] font-mono text-t4 mt-1">1.4s ease-in-out infinite, staggered 0.2s</div>
                  </div>
                </div>

                {/* running-ping */}
                <div className="flex items-center gap-6 rounded-lg border border-b1 bg-bgcard px-5 py-4">
                  <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center">
                    <div className="relative">
                      <div className="h-2.5 w-2.5 rounded-full bg-g" />
                      <div className="absolute inset-0 rounded-full bg-g/40" style={{ animation: "running-ping 2s ease-in-out infinite" }} />
                    </div>
                  </div>
                  <div>
                    <div className="text-[12px] font-medium text-t1">running-ping</div>
                    <div className="text-[11px] text-t3 mt-0.5">Expanding ring for active tasks. Green glow radiating outward.</div>
                    <div className="text-[10px] font-mono text-t4 mt-1">2s ease-in-out infinite</div>
                  </div>
                </div>

                {/* shimmer-text */}
                <div className="flex items-center gap-6 rounded-lg border border-b1 bg-bgcard px-5 py-4">
                  <div className="flex h-[40px] w-[80px] shrink-0 items-center justify-center">
                    <span className="text-[13px] font-medium" style={{
                      background: "linear-gradient(90deg, var(--t3), var(--t1), var(--t3))",
                      backgroundSize: "200% 100%",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      animation: "shimmer-text 2.5s ease-in-out infinite",
                    }}>
                      Thinking...
                    </span>
                  </div>
                  <div>
                    <div className="text-[12px] font-medium text-t1">shimmer-text</div>
                    <div className="text-[11px] text-t3 mt-0.5">Text gradient sweep for processing states. Gentle left-to-right shimmer.</div>
                    <div className="text-[10px] font-mono text-t4 mt-1">2.5s ease-in-out infinite</div>
                  </div>
                </div>

                {/* fade-in */}
                <div className="flex items-center gap-6 rounded-lg border border-b1 bg-bgcard px-5 py-4">
                  <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center">
                    <div className="h-6 w-6 rounded-md bg-as" style={{ animation: "fade-in 0.4s ease-out" }} />
                  </div>
                  <div>
                    <div className="text-[12px] font-medium text-t1">fade-in</div>
                    <div className="text-[11px] text-t3 mt-0.5">Standard element entrance. Opacity 0→1 with slight upward translate.</div>
                    <div className="text-[10px] font-mono text-t4 mt-1">0.4s ease-out</div>
                  </div>
                </div>

                {/* blink-cursor */}
                <div className="flex items-center gap-6 rounded-lg border border-b1 bg-bgcard px-5 py-4">
                  <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center">
                    <div className="flex items-center">
                      <span className="text-[13px] text-t2">Hello</span>
                      <div className="ml-px h-[16px] w-[1.5px] bg-t1" style={{ animation: "blink-cursor 0.8s steps(2) infinite" }} />
                    </div>
                  </div>
                  <div>
                    <div className="text-[12px] font-medium text-t1">blink-cursor</div>
                    <div className="text-[11px] text-t3 mt-0.5">Typing cursor blink for streaming text responses.</div>
                    <div className="text-[10px] font-mono text-t4 mt-1">0.8s steps(2) infinite</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
