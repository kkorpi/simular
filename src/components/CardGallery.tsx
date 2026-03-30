"use client";

import { useState } from "react";
import {
  ResultCard,
  PromptCard,
  ChoiceCard,
  DraftCard,
  BatchReviewCard,
  FormCard,
  ErrorCard,
  DigestCard,
  type ResultBody,
  type ChoiceOption,
  type DraftField,
  type BatchItem,
  type CardAccent,
  type FormField,
  type ComparisonAttribute,
} from "./cards";

import { RunningTaskDetail } from "./RunningTaskDetail";
import { ApprovalCard, type Approver } from "./cards/ApprovalCard";
import { FileUploadCard, type FileUploadStatus } from "./cards/FileUploadCard";
import { AlertCard, type AlertSeverity } from "./cards/AlertCard";
import { HandoffCard } from "./cards/HandoffCard";
import { CostCard } from "./cards/CostCard";
import { StatusCard, type ConnectionStatus } from "./cards/StatusCard";
import type { RunningStep } from "@/data/mockData";

/* ── Card type definitions ── */

type CardType = "result" | "digest" | "draft" | "choice" | "prompt" | "batch" | "form" | "progress" | "error" | "notification" | "destructive" | "comparison" | "approval" | "file-upload" | "alert" | "handoff" | "cost" | "status";

type GalleryEntry = { id: CardType; label: string; description: string; scenario: string };

const cardTypes: GalleryEntry[] = [
  { id: "result", label: "Result Card", description: "Agent delivers output", scenario: "Task completes and agent presents findings — research summaries, reports, compiled data. Supports prose, highlights, key-value, table, and section layouts." },
  { id: "digest", label: "Digest Card", description: "Recurring task roll-up", scenario: "User returns and multiple runs of a recurring task have completed — email monitoring, deal sourcing, price tracking. Rolls up runs into one card with stats, action items, and expandable run history." },
  { id: "notification", label: "Notification", description: "Async status update", scenario: "A recurring or background task fires while the user is away — price drops, overdue reminders, daily digests. Urgency levels drive visual weight." },
  { id: "draft", label: "Draft Card", description: "Review before sending", scenario: "Agent drafts something that needs human approval before sending — emails, social comments, bookings, calendar invites. User can edit inline." },
  { id: "choice", label: "Choice Card", description: "Pick from options", scenario: "Agent needs the user to disambiguate — multiple matching profiles, email triage priority, calendar selection. Cards, list, and pills layouts." },
  { id: "comparison", label: "Comparison", description: "Side-by-side options", scenario: "Agent presents structured alternatives for the user to compare — flight options, vendor quotes, pricing tiers. Highlights best/worst attributes." },
  { id: "prompt", label: "Prompt Card", description: "Agent suggests action", scenario: "Agent proactively offers to do something — pull a briefing, set up a recurring task, enable a feature. Standard and compact variants." },
  { id: "destructive", label: "Destructive", description: "Confirm risky action", scenario: "Agent needs explicit confirmation for an irreversible action — mass unsubscribe, bulk delete, account changes. Requires typing confirmation text." },
  { id: "form", label: "Form Card", description: "Structured input", scenario: "Agent needs structured parameters to proceed — flight search criteria, file renaming rules, monitoring thresholds. Validates before submission." },
  { id: "progress", label: "Task Progress", description: "Live step-by-step tracking", scenario: "Agent is working through a task — researching people, pulling data, checking records. Shows timestamped steps, subtask indicators, and expandable detail log." },
  { id: "error", label: "Error Card", description: "Failure + recovery", scenario: "Something went wrong and agent needs help — expired login, CAPTCHA block, scope too large. Always offers recovery actions, never a dead end." },

  { id: "batch", label: "Batch Review", description: "Review multiple items", scenario: "Agent has several items that each need a quick decision — email triage, pending approvals, task review queue. Expandable rows with per-item actions." },
  { id: "approval", label: "Approval Card", description: "Multi-approver workflow", scenario: "Agent needs sign-off from one or more approvers before proceeding. Shows approval status for each reviewer." },
  { id: "file-upload", label: "File Upload", description: "Transfer progress", scenario: "Agent is uploading or downloading a file. Shows progress bar with filename, size, and cancel option." },
  { id: "alert", label: "Alert Card", description: "Warnings & notices", scenario: "Non-error alerts for approaching limits, permission needs, or important notices. Three severity levels." },
  { id: "handoff", label: "Handoff Card", description: "Agent → user transition", scenario: "Agent hands a task back to the user with context and reason. Used when human action is required." },
  { id: "cost", label: "Cost Card", description: "Credit usage", scenario: "Notifies user of credit consumption for an action. Shows cost and remaining balance." },
  { id: "status", label: "Status Card", description: "Integration health", scenario: "Shows connection status for a third-party service. Indicates connected, expired, or disconnected state." },
];

/* ── Mock data ── */

const resultBodyPresets: { label: string; body: ResultBody }[] = [
  {
    label: "Prose",
    body: {
      type: "prose",
      text: (
        <>
          I&apos;ve compiled a comprehensive summary with background, key data points, and relevant sources. You can review the full document or open it in your workspace.
          {/* Artifact link */}
          <button className="mt-3 flex w-full items-center gap-2.5 rounded-md border border-b1 bg-bg3h/50 px-3 py-2.5 text-left transition-all hover:bg-bg3h hover:border-b2">
            <div className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-md bg-bg3h">
              <svg className="h-4 w-4 text-t3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-[12.5px] font-medium text-t1">Founder Research — Daniel Park</span>
                <span className="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider bg-[rgba(59,130,246,0.15)] text-[#60a5fa]">DOC</span>
              </div>
              <div className="mt-0.5 text-[11px] text-t3">Google Docs · 6 sources</div>
            </div>
            <svg className="h-3.5 w-3.5 shrink-0 text-t4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
          </button>
        </>
      ),
    },
  },
  {
    label: "Highlights",
    body: {
      type: "highlights",
      items: [
        { text: <><strong className="font-medium text-t1">Wellington</strong> 72 days since last touchpoint. Suggest: share portfolio update.</>, dot: "amber" },
        { text: <><strong className="font-medium text-t1">GIC Singapore</strong> 68 days overdue. Suggest: invite to webinar.</>, dot: "amber" },
        { text: <><strong className="font-medium text-t1">12 other P1 LPs</strong> are within your 60-day cadence</>, dot: "green" },
      ],
    },
  },
  {
    label: "Key-Value",
    body: {
      type: "key-value",
      rows: [
        { label: "Company", value: "Abridge" },
        { label: "Stage", value: "Series C ($150M)" },
        { label: "Lead", value: "Lightspeed Venture Partners" },
        { label: "Sector", value: "Clinical AI documentation" },
        { label: "Founded", value: "2018, Pittsburgh PA" },
      ],
    },
  },
  {
    label: "Table",
    body: {
      type: "table",
      columns: ["Name", "Company", "Role", "LinkedIn"],
      rows: [
        ["Daniel Park", "Sequoia Capital", "Partner", "linkedin.com/in/dpark"],
        ["Sarah Chen", "a16z", "Principal", "linkedin.com/in/schen"],
        ["Mike Torres", "Greylock", "EIR", "linkedin.com/in/mtorres"],
      ],
    },
  },
  {
    label: "Sections",
    body: {
      type: "sections",
      sections: [
        { heading: "Key Contacts", content: "Ravi Gupta (MD), Sarah Lin (Partner), Tom Wu (Associate)" },
        { heading: "Recent Activity", content: "Co-invested in Abridge Series C. Evaluating Fund IV commitment." },
        { heading: "Talking Points", content: "Portfolio performance +32% YTD. New healthcare AI thesis. Fund IV timeline." },
      ],
    },
  },
];

const draftPresets: { label: string; fields: DraftField[]; intent: string; approveLabel: string }[] = [
  {
    label: "LinkedIn Comment",
    intent: "Before I post this, want to review it?",
    approveLabel: "Post it",
    fields: [
      { type: "text", value: "Great insights on the Series A landscape, Daniel. The point about founder-market fit being more predictive than TAM resonates with our portfolio data. Would love to compare notes sometime.", editable: true },
    ],
  },
  {
    label: "Email Draft",
    intent: "Ready to send this follow-up?",
    approveLabel: "Send",
    fields: [
      { type: "header", label: "To", value: "ravi@sequoia.com", editable: true },
      { type: "header", label: "Subject", value: "Great meeting today - follow up notes", editable: true },
      { type: "text", value: "Hi Ravi,\n\nGreat catching up today. As discussed, here are the key takeaways from our Fund IV conversation:\n\n1. Target close: Q3 2026\n2. Fund size: $500M\n3. Focus areas: AI infrastructure, vertical SaaS\n\nI'll send the detailed deck by end of week.\n\nBest,\nKatie", editable: true },
    ],
  },
  {
    label: "Flight Booking",
    intent: "Book this flight?",
    approveLabel: "Book",
    fields: [
      { type: "readonly", label: "Flight", value: "VS 019 - Virgin Atlantic" },
      { type: "readonly", label: "Route", value: "SFO \u2192 LHR" },
      { type: "readonly", label: "Date", value: "Thu, Apr 28 2026" },
      { type: "readonly", label: "Price", value: "$487 (economy)" },
      { type: "header", label: "Seat", value: "14A (window)", editable: true },
    ],
  },
  {
    label: "Calendar Invite",
    intent: "Send this meeting invite?",
    approveLabel: "Send invite",
    fields: [
      { type: "header", label: "Title", value: "LP Quarterly Sync - Sequoia Scouts", editable: true },
      { type: "readonly", label: "When", value: "Thu, Mar 5 at 2:00 PM PST" },
      { type: "chips", label: "Guests", values: ["ravi@sequoia.com", "sarah@sequoia.com", "katie@felicis.com"] },
      { type: "text", label: "Notes", value: "Quarterly check-in to review Fund III performance and discuss Fund IV commitment timeline.", editable: true },
    ],
  },
];

const choicePresets: {
  label: string;
  question: string;
  layout: "cards" | "list" | "pills";
  options: ChoiceOption[];
  multi?: boolean;
}[] = [
  {
    label: "Profile Cards",
    question: "Which Daniel Park are you looking for?",
    layout: "cards",
    options: [
      { id: "1", title: "Daniel Park", subtitle: "Partner, Sequoia Capital", detail: "San Francisco, CA" },
      { id: "2", title: "Daniel Park", subtitle: "VP Engineering, Stripe", detail: "San Francisco, CA" },
      { id: "3", title: "Daniel Park", subtitle: "Founder & CEO, NovaTech", detail: "New York, NY" },
    ],
  },
  {
    label: "Email Triage",
    question: "Which emails should I prioritize?",
    layout: "list",
    multi: true,
    options: [
      { id: "1", title: "Sequoia Scouts - Fund IV Update", subtitle: "ravi@sequoia.com", badge: { label: "Urgent", color: "amber" } },
      { id: "2", title: "Monthly LP Report Draft", subtitle: "finance@felicis.com", badge: { label: "Review", color: "blue" } },
      { id: "3", title: "Intro: Founder of Abridge", subtitle: "sarah@a16z.com" },
      { id: "4", title: "Team offsite planning", subtitle: "vanessa@felicis.com" },
      { id: "5", title: "Newsletter: AI Weekly", subtitle: "newsletter@bensbites.com", badge: { label: "Low", color: "neutral" } },
    ],
  },
  {
    label: "Quick Choice",
    question: "Which calendar should I use?",
    layout: "pills",
    options: [
      { id: "work", title: "Work" },
      { id: "personal", title: "Personal" },
      { id: "shared", title: "Shared team" },
    ],
  },
];

const comparisonOptions: ChoiceOption[] = [
  {
    id: "vs019",
    title: "VS 019",
    subtitle: "Virgin Atlantic",
    attributes: [
      { label: "Price", value: "$487", highlight: "best" },
      { label: "Duration", value: "10h 45m" },
      { label: "Stops", value: "Nonstop", highlight: "best" },
      { label: "Depart", value: "2:30 PM" },
      { label: "Class", value: "Economy" },
    ],
  },
  {
    id: "ba287",
    title: "BA 287",
    subtitle: "British Airways",
    attributes: [
      { label: "Price", value: "$512" },
      { label: "Duration", value: "10h 20m", highlight: "best" },
      { label: "Stops", value: "Nonstop", highlight: "best" },
      { label: "Depart", value: "8:15 PM" },
      { label: "Class", value: "Economy" },
    ],
  },
  {
    id: "ua901",
    title: "UA 901",
    subtitle: "United Airlines",
    attributes: [
      { label: "Price", value: "$623", highlight: "worst" },
      { label: "Duration", value: "14h 10m", highlight: "worst" },
      { label: "Stops", value: "1 stop (ORD)" },
      { label: "Depart", value: "6:00 AM" },
      { label: "Class", value: "Economy Plus" },
    ],
  },
];

const batchPreset: BatchItem[] = [
  {
    id: "1",
    summary: "Reply to Sequoia re: Fund IV timeline",
    expandedContent: "Ravi asked about our Q3 close target and wants to schedule a follow-up for next week.",
    actions: [
      { label: "Draft reply", style: "primary", onClick: () => {} },
      { label: "Star for later", style: "outline", onClick: () => {} },
      { label: "Skip", style: "text", onClick: () => {} },
    ],
  },
  {
    id: "2",
    summary: "Review LP report from finance",
    expandedContent: "Monthly performance report attached. Needs your sign-off before distribution.",
    actions: [
      { label: "Approve & send", style: "primary", onClick: () => {} },
      { label: "Edit first", style: "outline", onClick: () => {} },
      { label: "Skip", style: "text", onClick: () => {} },
    ],
  },
  {
    id: "3",
    summary: "Respond to founder intro from Sarah",
    expandedContent: "Intro to CEO of Abridge. Sarah says strong fit for our healthcare thesis.",
    actions: [
      { label: "Draft reply", style: "primary", onClick: () => {} },
      { label: "Decline intro", style: "outline", onClick: () => {} },
      { label: "Skip", style: "text", onClick: () => {} },
    ],
  },
  {
    id: "4",
    summary: "Confirm team offsite venue",
    expandedContent: "Vanessa needs venue confirmation by Friday for the March offsite.",
    actions: [
      { label: "Reply", style: "primary", onClick: () => {} },
      { label: "Skip", style: "text", onClick: () => {} },
    ],
  },
];

const formPresets: { label: string; fields: FormField[]; title: string; submitLabel: string }[] = [
  {
    label: "Flight Monitor",
    title: "Set up flight price monitor",
    submitLabel: "Start monitoring",
    fields: [
      { key: "from", type: "text", label: "From", placeholder: "SFO", required: true },
      { key: "to", type: "text", label: "To", placeholder: "LHR", required: true },
      { key: "dates", type: "date-range", label: "Travel dates", required: true },
      { key: "threshold", type: "number", label: "Price threshold", defaultValue: 500, unit: "USD", min: 100, max: 5000 },
      { key: "class", type: "select", label: "Class", options: [{ value: "economy", label: "Economy" }, { value: "premium", label: "Premium Economy" }, { value: "business", label: "Business" }] },
      { key: "direct", type: "toggle", label: "Direct flights only", defaultValue: false },
    ],
  },
  {
    label: "Restaurant Search",
    title: "Restaurant search criteria",
    submitLabel: "Search",
    fields: [
      { key: "cuisine", type: "select", label: "Cuisine", options: [{ value: "italian", label: "Italian" }, { value: "japanese", label: "Japanese" }, { value: "mexican", label: "Mexican" }, { value: "french", label: "French" }] },
      { key: "location", type: "text", label: "Location", placeholder: "Palo Alto, CA", required: true },
      { key: "price", type: "select", label: "Price range", options: [{ value: "1", label: "$" }, { value: "2", label: "$$" }, { value: "3", label: "$$$" }, { value: "4", label: "$$$$" }] },
      { key: "guests", type: "number", label: "Party size", defaultValue: 2, min: 1, max: 20 },
      { key: "requirements", type: "chips-input", label: "Requirements", placeholder: "outdoor seating, vegan options..." },
    ],
  },
  {
    label: "File Rename",
    title: "Configure file renaming",
    submitLabel: "Rename files",
    fields: [
      { key: "directory", type: "text", label: "Directory", placeholder: "~/Downloads", required: true },
      { key: "pattern", type: "text", label: "Naming template", placeholder: "ClientName_Date_Type", required: true, helpText: "Use placeholders: ClientName, Date, Type, Index" },
      { key: "fileTypes", type: "chips-input", label: "File types to include", defaultValues: [".pdf", ".docx"], placeholder: ".pdf, .xlsx..." },
      { key: "dryRun", type: "toggle", label: "Preview only (dry run)", defaultValue: true },
    ],
  },
];

const progressPresets: { label: string; steps: RunningStep[]; subtasks: string[]; done: boolean }[] = [
  {
    label: "In Progress",
    subtasks: ["Researching Sequoia Scouts"],
    done: false,
    steps: [
      { timestamp: "0:02", label: "Opened Chrome and navigated to LinkedIn", done: true },
      { timestamp: "0:04", label: "Opened LinkedIn founder profile", done: true },
      { timestamp: "0:10", label: "Pulled background, education, and work history", done: true },
      { timestamp: "0:12", label: "Strong product background — ex-Google, ex-Stripe. Checking Salesforce.", type: "thinking", done: true },
      { timestamp: "0:16", label: "Extracted mutual connections and endorsements", done: true },
      { timestamp: "0:24", label: "Reviewed recent posts on X", done: true },
      { timestamp: "0:26", label: "Series B at $1.5B valuation — solid signal. Pulling more data.", type: "thinking", done: true },
      { timestamp: "0:30", label: "Pulling Crunchbase company profile...", done: false },
    ],
  },
  {
    label: "With User Action",
    subtasks: ["Checking LinkedIn profile viewers"],
    done: false,
    steps: [
      { timestamp: "0:01", label: "Opened Chrome", done: true },
      { timestamp: "0:03", label: "Navigated to linkedin.com/login", done: true },
      { timestamp: "0:05", label: "Detected login required — waiting for credentials", done: true },
      { timestamp: "0:09", label: "Signed in to LinkedIn", done: true, userAction: true },
      { timestamp: "0:11", label: "Navigated to profile viewers page", done: true },
      { timestamp: "0:14", label: "Parsing viewer list and extracting profiles...", done: false },
    ],
  },
  {
    label: "Complete",
    subtasks: ["Compiling LP touchpoint report"],
    done: true,
    steps: [
      { timestamp: "0:02", label: "Opened Salesforce and queried LP records", done: true },
      { timestamp: "0:08", label: "Filtered for P1 relationships with last touch > 30 days", done: true },
      { timestamp: "0:14", label: "Cross-referenced calendar for upcoming meetings", done: true },
      { timestamp: "0:20", label: "Compiled touchpoint summary with recommendations", done: true },
    ],
  },
];

const errorPresets: { label: string; errorType: "auth_required" | "blocked" | "rate_limited" | "scope_too_large" | "site_unavailable" | "generic"; title: string; detail: string; context?: string }[] = [
  {
    label: "Auth Required",
    errorType: "auth_required",
    title: "Login required for Notion",
    detail: "I need access to your Notion workspace to export the meeting notes, but the session has expired.",
    context: "Attempted to open app.notion.so/workspace and navigate to 'Meeting Notes' database. Redirected to login page. SSO login requires browser interaction.",
  },
  {
    label: "Blocked",
    errorType: "blocked",
    title: "Blocked by CAPTCHA on Expedia",
    detail: "Expedia detected automated browsing and presented a CAPTCHA challenge. I can't solve these verification checks.",
    context: "Searched for 'SFO to LHR flights' on expedia.com. Page loaded, but a reCAPTCHA v2 challenge appeared before showing results.",
  },
  {
    label: "Scope Too Large",
    errorType: "scope_too_large",
    title: "Search scope too large",
    detail: "Searching 4 marketplaces simultaneously exceeded the context limit. I need to narrow the search.",
    context: "Attempted to search eBay, Amazon, Facebook Marketplace, and Mercari for 'vintage Le Creuset dutch oven'. Combined page content reached 273,358 tokens (limit: 200,000).",
  },
];

/* ── Gallery component ── */

export function CardGallery({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [activeCard, setActiveCard] = useState<CardType>("result");

  // Result config
  const [resultBodyIndex, setResultBodyIndex] = useState(0);
  const [resultAccent, setResultAccent] = useState<CardAccent>("green");
  const [showSchedule, setShowSchedule] = useState(true);
  const [showNotification, setShowNotification] = useState(false);

  // Draft config
  const [draftPresetIndex, setDraftPresetIndex] = useState(0);
  const [draftAccent, setDraftAccent] = useState<CardAccent>("amber");

  // Choice config
  const [choicePresetIndex, setChoicePresetIndex] = useState(0);
  const [choiceKey, setChoiceKey] = useState(0);

  // Prompt config
  const [promptPresetIndex, setPromptPresetIndex] = useState(0);
  const [promptKey, setPromptKey] = useState(0);

  // Batch config
  const [batchKey, setBatchKey] = useState(0);

  // Form config
  const [formPresetIndex, setFormPresetIndex] = useState(0);
  const [formKey, setFormKey] = useState(0);

  // Progress config
  const [progressPresetIndex, setProgressPresetIndex] = useState(0);

  // Error config
  const [errorPresetIndex, setErrorPresetIndex] = useState(0);
  const [errorKey, setErrorKey] = useState(0);

  // Comparison config
  const [comparisonKey, setComparisonKey] = useState(0);

  // Destructive config
  const [destructiveKey, setDestructiveKey] = useState(0);

  // Login config

  // Notification config
  const [notifUrgency, setNotifUrgency] = useState<"info" | "attention" | "urgent">("attention");

  // Approval config
  const [approvalKey, setApprovalKey] = useState(0);

  // File upload config
  const [uploadStatus, setUploadStatus] = useState<FileUploadStatus>("uploading");
  const [uploadProgress, setUploadProgress] = useState(67);

  // Alert config
  const [alertSeverity, setAlertSeverity] = useState<AlertSeverity>("warning");

  // Handoff config
  const [handoffKey, setHandoffKey] = useState(0);

  // Cost config (no controls needed, static display)

  // Status config
  const [statusConnection, setStatusConnection] = useState<ConnectionStatus>("connected");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-bg">
      {/* Top bar */}
      <div className="flex h-[52px] shrink-0 items-center justify-between border-b border-b1 px-5">
        <div className="flex items-center gap-3">
          <svg className="h-4 w-4 text-t3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
          <span className="text-[14px] font-semibold text-t1">Card Gallery</span>
          <span className="rounded-full bg-bg3h px-2 py-0.5 text-[10px] font-medium text-t3">{cardTypes.length} components</span>
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
        {/* Card type nav — sidebar on desktop, horizontal scroll strip on mobile */}
        <div className="flex w-[220px] shrink-0 flex-col border-r border-b1 bg-bg2 overflow-y-auto max-md:w-full max-md:flex-row max-md:border-r-0 max-md:border-b max-md:overflow-y-visible max-md:overflow-x-auto max-md:shrink-0">
          <div className="py-4 max-md:py-0 max-md:flex max-md:items-stretch max-md:px-2 max-md:gap-0">
            {cardTypes.map((ct) => (
              <button
                key={ct.id}
                onClick={() => setActiveCard(ct.id)}
                className={`w-full px-5 py-2.5 text-left transition-all max-md:w-auto max-md:shrink-0 max-md:px-3 max-md:py-2.5 max-md:text-center max-md:rounded-md max-md:my-1.5 ${
                  activeCard === ct.id ? "bg-bg3" : "hover:bg-bg3/50"
                }`}
              >
                <div className={`text-[13px] font-medium max-md:text-[12px] max-md:whitespace-nowrap ${activeCard === ct.id ? "text-t1" : "text-t3"}`}>
                  {ct.label}
                </div>
                <div className="text-[11px] text-t4 max-md:hidden">{ct.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Preview + controls */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          {/* Live preview */}
          <div className="flex-1 border-b border-b1 bg-bg px-8 py-8 max-md:px-4 max-md:py-4">
            <div className="text-[10px] font-medium uppercase tracking-wide text-t4 mb-4">Preview</div>
            <div className="mx-auto max-w-[620px]">

              {/* Result */}
              {activeCard === "result" && (
                <ResultCard
                  icon={
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  }
                  title="Research Summary"
                  subtitle="6 sources · just now"
                  body={resultBodyPresets[resultBodyIndex].body}
                  accent={resultAccent}
                  actions={[
                    { label: "View details", style: "primary", onClick: () => {} },
                    { label: "Open in Docs", style: "outline", icon: <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>, onClick: () => {} },
                  ]}
                  schedule={showSchedule ? { schedule: "Every morning at 7am", onEdit: () => {}, onTurnOff: () => {} } : undefined}
                  notification={showNotification ? { triggeredBy: "Daily LP digest", timestamp: "Today at 7:04 AM", urgency: "info" } : undefined}
                />
              )}

              {/* Notification */}
              {activeCard === "notification" && (
                <ResultCard
                  key={`notif-${notifUrgency}`}
                  icon={
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 01-3.46 0" />
                    </svg>
                  }
                  title={
                    notifUrgency === "urgent" ? "Flight price dropped to $412!"
                    : notifUrgency === "attention" ? "LP cadence overdue for Wellington"
                    : "Daily email digest ready"
                  }
                  subtitle={
                    notifUrgency === "urgent" ? "SFO \u2192 LHR on Apr 28 - below your $500 threshold"
                    : notifUrgency === "attention" ? "72 days since last touchpoint - suggest: share portfolio update"
                    : "23 new emails - 3 urgent, 8 FYI, 12 newsletters"
                  }
                  body={{
                    type: "key-value",
                    rows: notifUrgency === "urgent"
                      ? [{ label: "Airline", value: "Virgin Atlantic VS 019" }, { label: "Previous", value: "$487" }, { label: "Current", value: "$412" }, { label: "Savings", value: "$75 (15%)" }]
                      : notifUrgency === "attention"
                        ? [{ label: "LP", value: "Wellington Management" }, { label: "Tier", value: "P1" }, { label: "Last contact", value: "Dec 14, 2025" }, { label: "Suggested", value: "Share Q4 portfolio update" }]
                        : [{ label: "Urgent", value: "3 emails" }, { label: "FYI", value: "8 emails" }, { label: "Newsletters", value: "12 emails" }]
                  }}
                  actions={[
                    { label: notifUrgency === "urgent" ? "Book now" : "View details", style: "primary", onClick: () => {} },
                    { label: "Dismiss", style: "text", onClick: () => {} },
                  ]}
                  notification={{
                    triggeredBy: notifUrgency === "urgent" ? "Flight price monitor" : notifUrgency === "attention" ? "LP cadence tracker" : "Daily email digest",
                    timestamp: notifUrgency === "urgent" ? "12 min ago" : notifUrgency === "attention" ? "Today at 9:00 AM" : "Today at 7:04 AM",
                    urgency: notifUrgency,
                  }}
                  schedule={notifUrgency !== "urgent" ? { schedule: notifUrgency === "attention" ? "Every Monday at 9am" : "Every morning at 7am", onEdit: () => {}, onTurnOff: () => {} } : undefined}
                />
              )}

              {/* Draft */}
              {activeCard === "draft" && (
                <DraftCard
                  key={`draft-${draftPresetIndex}-${draftAccent}`}
                  intent={draftPresets[draftPresetIndex].intent}
                  fields={draftPresets[draftPresetIndex].fields}
                  approveLabel={draftPresets[draftPresetIndex].approveLabel}
                  accent={draftAccent}
                  onApprove={() => {}}
                  onDeny={() => {}}
                  onOpenWorkspace={() => {}}
                  resolvedMessage="Action completed"
                />
              )}

              {/* Choice */}
              {activeCard === "choice" && (
                <ChoiceCard
                  key={`choice-${choicePresetIndex}-${choiceKey}`}
                  question={choicePresets[choicePresetIndex].question}
                  options={choicePresets[choicePresetIndex].options}
                  layout={choicePresets[choicePresetIndex].layout}
                  multi={choicePresets[choicePresetIndex].multi}
                  onSelect={() => {}}
                />
              )}

              {/* Comparison */}
              {activeCard === "comparison" && (
                <ChoiceCard
                  key={`comparison-${comparisonKey}`}
                  question="Which flight do you want to book?"
                  options={comparisonOptions}
                  layout="comparison"
                  compareLabel="Compare flights: SFO \u2192 LHR"
                  onSelect={() => {}}
                />
              )}

              {/* Prompt */}
              {activeCard === "prompt" && promptPresetIndex === 0 && (
                <PromptCard
                  key={`prompt-${promptKey}-0`}
                  message={<>I can learn this by watching you do it once. I&apos;ll record each step so I can <strong className="font-semibold text-t1">repeat it autonomously</strong> next time.</>}
                  actions={[
                    { label: "Show me how", style: "primary", onClick: () => {} },
                    { label: "Just describe it", style: "outline", onClick: () => {} },
                  ]}
                  resolvedMessage="Starting teach mode..."
                />
              )}
              {activeCard === "prompt" && promptPresetIndex === 1 && (
                <PromptCard
                  key={`prompt-${promptKey}-1`}
                  variant="compact"
                  icon={
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="17 1 21 5 17 9" />
                      <path d="M3 11V9a4 4 0 014-4h14" />
                      <polyline points="7 23 3 19 7 15" />
                      <path d="M21 13v2a4 4 0 01-4 4H3" />
                    </svg>
                  }
                  message={<>Want me to do this <strong className="font-semibold text-t1">every Monday at 9am</strong>?</>}
                  actions={[
                    { label: "Yes, every Monday", style: "primary", onClick: () => {} },
                    { label: "Save without schedule", style: "outline", onClick: () => {} },
                  ]}
                  resolvedMessage="Scheduled: Asana digest → every Monday 9am"
                />
              )}
              {activeCard === "prompt" && promptPresetIndex === 2 && (
                <PromptCard
                  key={`prompt-${promptKey}-2`}
                  variant="compact"
                  icon={
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                      <line x1="12" y1="18" x2="12.01" y2="18" />
                    </svg>
                  }
                  message={<><strong className="font-semibold text-t1">Get updates on mobile.</strong> I&apos;ll ping you when this task is done.</>}
                  actions={[
                    { label: "Send me the link", style: "primary", onClick: () => {} },
                    { label: "Maybe later", style: "outline", onClick: () => {} },
                  ]}
                />
              )}

              {/* Destructive */}
              {activeCard === "destructive" && (
                <PromptCard
                  key={`destructive-${destructiveKey}`}
                  severity="destructive"
                  message={
                    <>
                      I found <strong className="font-semibold text-t1">27 mailing lists</strong> you haven&apos;t opened in 30+ days. Want me to unsubscribe from all of them?
                    </>
                  }
                  consequence="This will permanently unsubscribe you from 27 mailing lists. You may not be able to re-subscribe to some of them."
                  confirmText="UNSUBSCRIBE"
                  actions={[
                    { label: "Cancel", style: "outline", onClick: () => {} },
                    { label: "Unsubscribe all", style: "primary", onClick: () => {} },
                  ]}
                  resolvedMessage="Unsubscribed from 27 mailing lists"
                />
              )}

              {/* Form */}
              {activeCard === "form" && (
                <FormCard
                  key={`form-${formPresetIndex}-${formKey}`}
                  title={formPresets[formPresetIndex].title}
                  fields={formPresets[formPresetIndex].fields}
                  submitLabel={formPresets[formPresetIndex].submitLabel}
                  onSubmit={() => {}}
                  onCancel={() => {}}
                  resolvedMessage="Parameters submitted"
                />
              )}

              {/* Progress */}
              {activeCard === "progress" && (
                <div className="max-w-[620px]">
                  <RunningTaskDetail
                    key={progressPresetIndex}
                    steps={progressPresets[progressPresetIndex].steps}
                    subtasks={progressPresets[progressPresetIndex].subtasks}
                    onViewActivityLog={() => {}}
                    done={progressPresets[progressPresetIndex].done}
                    initialExpanded
                  />
                </div>
              )}

              {/* Error */}
              {activeCard === "error" && (
                <ErrorCard
                  key={`error-${errorPresetIndex}-${errorKey}`}
                  errorType={errorPresets[errorPresetIndex].errorType}
                  title={errorPresets[errorPresetIndex].title}
                  detail={errorPresets[errorPresetIndex].detail}
                  context={errorPresets[errorPresetIndex].context}
                  actions={
                    errorPresets[errorPresetIndex].errorType === "auth_required"
                      ? [
                          { label: "I've logged in, retry", style: "primary", onClick: () => {} },
                          { label: "Skip this step", style: "outline", onClick: () => {} },
                        ]
                      : errorPresets[errorPresetIndex].errorType === "blocked"
                        ? [
                            { label: "Try Google Flights instead", style: "primary", onClick: () => {} },
                            { label: "I'll solve the CAPTCHA", style: "outline", onClick: () => {} },
                          ]
                        : [
                            { label: "Search 2 sites at a time", style: "primary", onClick: () => {} },
                            { label: "Just search eBay", style: "outline", onClick: () => {} },
                          ]
                  }
                  resolvedMessage="Recovery action taken"
                />
              )}


              {/* Batch */}
              {activeCard === "batch" && (
                <BatchReviewCard
                  key={`batch-${batchKey}`}
                  title="4 emails need your attention"
                  items={batchPreset}
                  onComplete={() => {}}
                />
              )}

              {/* Digest */}
              {activeCard === "digest" && (
                <DigestCard
                  icon={
                    <svg className="h-3.5 w-3.5 text-t3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="17 1 21 5 17 9" />
                      <path d="M3 11V9a4 4 0 014-4h14" />
                      <polyline points="7 23 3 19 7 15" />
                      <path d="M21 13v2a4 4 0 01-4 4H3" />
                    </svg>
                  }
                  title="Important email reminder"
                  runCount={10}
                  statLine="Scanned 300 emails across 10 runs · 42 important · 8 requiring action"
                  actionItems={[
                    { text: "AT&T past-due bill — $255.30", runDate: "Feb 28, 3:01 PM", action: { label: "Pay bill", onClick: () => {} } },
                    { text: "Lia Ng (ByteDance) AI research follow-up", runDate: "Mar 2, 3:02 PM", action: { label: "Draft reply", onClick: () => {} } },
                    { text: "Paper accepted — Agentic AI in the Wild (register by Mar 5)", runDate: "Feb 27, 3:01 PM", action: { label: "Register", onClick: () => {} } },
                    { text: "Third Bridge paid consultation request", runDate: "Feb 27, 8:01 AM", action: { label: "Review", onClick: () => {} } },
                  ]}
                  runs={[
                    { date: "Mar 3, 3:01 PM", summary: "3 important: Belmont Dojo reply, Mercury, university follow-up", hasActionItems: true },
                    { date: "Mar 3, 8:01 AM", summary: "No emails requiring action — 28 marketing/promos filtered", hasActionItems: false },
                    { date: "Mar 2, 3:02 PM", summary: "6 important, 2 requiring action: Lia Ng follow-up, contractor invoice", hasActionItems: true },
                    { date: "Mar 2, 8:01 AM", summary: "4 potentially important, none requiring action", hasActionItems: false },
                    { date: "Mar 1, 3:00 PM", summary: "3 noteworthy: Xfinity bill, AppleCare, standup notes", hasActionItems: false },
                    { date: "Mar 1, 8:02 AM", summary: "3 important: Xfinity bill, AppleCare, meeting reschedule", hasActionItems: true },
                    { date: "Feb 28, 3:01 PM", summary: "7 important, 2 requiring action: AT&T $255.30, AppleCare renewal", hasActionItems: true },
                    { date: "Feb 28, 8:01 AM", summary: "2 FYI-level: Robinhood statement, LinkedIn digest", hasActionItems: false },
                    { date: "Feb 27, 3:01 PM", summary: "5 important, 1 action: paper accepted to workshop", hasActionItems: true },
                    { date: "Feb 27, 8:01 AM", summary: "4 important, 1 action: Third Bridge consultation request", hasActionItems: true },
                  ]}
                  schedule={{
                    schedule: "Runs twice daily at 8am and 3pm",
                    onEdit: () => {},
                    onTurnOff: () => {},
                  }}
                />
              )}

              {/* Approval */}
              {activeCard === "approval" && (
                <ApprovalCard
                  key={`approval-${approvalKey}`}
                  title="Expense Report #4821"
                  description="Travel expenses for LP meetings in NYC ($2,340). Requires two approvals before reimbursement is processed."
                  approvers={[
                    { name: "Katie Chen", status: "approved" },
                    { name: "Ravi Gupta", status: "pending" },
                    { name: "Sarah Lin", status: "pending" },
                  ]}
                  accent="amber"
                  onApprove={() => {}}
                  onReject={() => {}}
                />
              )}

              {/* File Upload */}
              {activeCard === "file-upload" && (
                <FileUploadCard
                  key={`upload-${uploadStatus}-${uploadProgress}`}
                  filename="Q4_Portfolio_Report_Final.pdf"
                  size="4.2 MB"
                  progress={uploadProgress}
                  status={uploadStatus}
                  onCancel={() => {}}
                />
              )}

              {/* Alert */}
              {activeCard === "alert" && (
                <AlertCard
                  key={`alert-${alertSeverity}`}
                  severity={alertSeverity}
                  title={
                    alertSeverity === "warning"
                      ? "Credit balance running low"
                      : alertSeverity === "caution"
                        ? "LinkedIn session expiring soon"
                        : "New permissions available"
                  }
                  message={
                    alertSeverity === "warning"
                      ? "You have 12 credits remaining. Actions requiring web browsing will be paused when credits reach zero."
                      : alertSeverity === "caution"
                        ? "Your LinkedIn session expires in 2 hours. Re-authenticate to avoid interrupting scheduled tasks."
                        : "Google Calendar access has been approved by your workspace admin. You can now create and edit calendar events."
                  }
                  actions={[
                    {
                      label: alertSeverity === "warning" ? "Add credits" : alertSeverity === "caution" ? "Re-authenticate" : "Enable now",
                      style: "primary",
                      onClick: () => {},
                    },
                    { label: "Dismiss", style: "text", onClick: () => {} },
                  ]}
                />
              )}

              {/* Handoff */}
              {activeCard === "handoff" && (
                <HandoffCard
                  key={`handoff-${handoffKey}`}
                  title="Manual verification needed"
                  reason="The bank website requires two-factor authentication with a hardware key. I can't complete this step automatically."
                  context="Attempted to log in to Chase business banking at chase.com/business. After entering credentials, the site prompted for a YubiKey tap. This is a physical interaction I cannot perform."
                  actions={[
                    { label: "I've completed it", style: "primary", onClick: () => {} },
                    { label: "Skip this step", style: "outline", onClick: () => {} },
                  ]}
                />
              )}

              {/* Cost */}
              {activeCard === "cost" && (
                <CostCard
                  action="Deep research: Abridge Series C analysis"
                  cost="3 credits"
                  balance="47 credits remaining"
                />
              )}

              {/* Status */}
              {activeCard === "status" && (
                <StatusCard
                  key={`status-${statusConnection}`}
                  service="Salesforce CRM"
                  status={statusConnection}
                  lastSync={
                    statusConnection === "connected"
                      ? "Last synced 5 min ago"
                      : statusConnection === "expired"
                        ? "Token expired 2 hours ago"
                        : "Never connected"
                  }
                  onReconnect={() => {}}
                />
              )}

            </div>
          </div>

          {/* When to use */}
          <div className="shrink-0 border-b border-b1 px-8 py-4">
            <div className="mx-auto max-w-[620px]">
              <div className="text-[10px] font-medium uppercase tracking-wide text-t4 mb-1.5">When to use</div>
              <div className="text-[12px] leading-[1.55] text-t3">
                {cardTypes.find((ct) => ct.id === activeCard)?.scenario}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="shrink-0 px-8 py-5">
            <div className="mx-auto max-w-[620px]">
              <div className="text-[10px] font-medium uppercase tracking-wide text-t4 mb-3">Configure</div>

              {activeCard === "result" && (
                <div className="flex flex-col gap-4">
                  <ControlRow label="Body type">
                    <div className="flex gap-1.5 flex-wrap">
                      {resultBodyPresets.map((preset, i) => (
                        <PillButton key={i} active={resultBodyIndex === i} onClick={() => setResultBodyIndex(i)}>
                          {preset.label}
                        </PillButton>
                      ))}
                    </div>
                  </ControlRow>
                  <ControlRow label="Accent">
                    <AccentPicker value={resultAccent} onChange={setResultAccent} />
                  </ControlRow>
                  <ControlRow label="Schedule footer">
                    <ToggleSwitch value={showSchedule} onChange={setShowSchedule} />
                  </ControlRow>
                  <ControlRow label="Notification bar">
                    <ToggleSwitch value={showNotification} onChange={setShowNotification} />
                  </ControlRow>
                </div>
              )}

              {activeCard === "notification" && (
                <div className="flex flex-col gap-4">
                  <ControlRow label="Urgency">
                    <div className="flex gap-1.5">
                      {(["info", "attention", "urgent"] as const).map((u) => (
                        <PillButton key={u} active={notifUrgency === u} onClick={() => setNotifUrgency(u)}>
                          {u}
                        </PillButton>
                      ))}
                    </div>
                  </ControlRow>
                </div>
              )}

              {activeCard === "draft" && (
                <div className="flex flex-col gap-4">
                  <ControlRow label="Preset">
                    <div className="flex gap-1.5 flex-wrap">
                      {draftPresets.map((preset, i) => (
                        <PillButton key={i} active={draftPresetIndex === i} onClick={() => setDraftPresetIndex(i)}>
                          {preset.label}
                        </PillButton>
                      ))}
                    </div>
                  </ControlRow>
                  <ControlRow label="Accent">
                    <AccentPicker value={draftAccent} onChange={setDraftAccent} />
                  </ControlRow>
                </div>
              )}

              {activeCard === "choice" && (
                <div className="flex flex-col gap-4">
                  <ControlRow label="Layout">
                    <div className="flex gap-1.5">
                      {choicePresets.map((preset, i) => (
                        <PillButton key={i} active={choicePresetIndex === i} onClick={() => { setChoicePresetIndex(i); setChoiceKey((k) => k + 1); }}>
                          {preset.label}
                        </PillButton>
                      ))}
                    </div>
                  </ControlRow>
                  <ControlRow label="Reset">
                    <ResetButton onClick={() => setChoiceKey((k) => k + 1)}>Reset selection</ResetButton>
                  </ControlRow>
                </div>
              )}

              {activeCard === "comparison" && (
                <div className="flex flex-col gap-4">
                  <ControlRow label="Reset">
                    <ResetButton onClick={() => setComparisonKey((k) => k + 1)}>Reset selection</ResetButton>
                  </ControlRow>
                </div>
              )}

              {activeCard === "prompt" && (
                <div className="flex flex-col gap-4">
                  <ControlRow label="Preset">
                    <div className="flex gap-1.5">
                      {(["Teach Mode", "Schedule", "Mobile Update"] as const).map((label, i) => (
                        <PillButton key={label} active={promptPresetIndex === i} onClick={() => { setPromptPresetIndex(i); setPromptKey((k) => k + 1); }}>
                          {label}
                        </PillButton>
                      ))}
                    </div>
                  </ControlRow>
                </div>
              )}

              {activeCard === "destructive" && (
                <div className="flex flex-col gap-4">
                  <ControlRow label="Reset">
                    <ResetButton onClick={() => setDestructiveKey((k) => k + 1)}>Reset</ResetButton>
                  </ControlRow>
                </div>
              )}

              {activeCard === "form" && (
                <div className="flex flex-col gap-4">
                  <ControlRow label="Preset">
                    <div className="flex gap-1.5 flex-wrap">
                      {formPresets.map((preset, i) => (
                        <PillButton key={i} active={formPresetIndex === i} onClick={() => { setFormPresetIndex(i); setFormKey((k) => k + 1); }}>
                          {preset.label}
                        </PillButton>
                      ))}
                    </div>
                  </ControlRow>
                  <ControlRow label="Reset">
                    <ResetButton onClick={() => setFormKey((k) => k + 1)}>Reset form</ResetButton>
                  </ControlRow>
                </div>
              )}

              {activeCard === "progress" && (
                <div className="flex flex-col gap-4">
                  <ControlRow label="State">
                    <div className="flex gap-1.5">
                      {progressPresets.map((preset, i) => (
                        <PillButton key={i} active={progressPresetIndex === i} onClick={() => setProgressPresetIndex(i)}>
                          {preset.label}
                        </PillButton>
                      ))}
                    </div>
                  </ControlRow>
                </div>
              )}

              {activeCard === "error" && (
                <div className="flex flex-col gap-4">
                  <ControlRow label="Error type">
                    <div className="flex gap-1.5 flex-wrap">
                      {errorPresets.map((preset, i) => (
                        <PillButton key={i} active={errorPresetIndex === i} onClick={() => { setErrorPresetIndex(i); setErrorKey((k) => k + 1); }}>
                          {preset.label}
                        </PillButton>
                      ))}
                    </div>
                  </ControlRow>
                  <ControlRow label="Reset">
                    <ResetButton onClick={() => setErrorKey((k) => k + 1)}>Reset</ResetButton>
                  </ControlRow>
                </div>
              )}


              {activeCard === "batch" && (
                <div className="flex flex-col gap-4">
                  <ControlRow label="Reset">
                    <ResetButton onClick={() => setBatchKey((k) => k + 1)}>Reset review</ResetButton>
                  </ControlRow>
                </div>
              )}

              {activeCard === "digest" && (
                <div className="flex flex-col gap-4">
                  <div className="text-[12px] text-t3">Expand the run list and action items to explore. No configurable options yet.</div>
                </div>
              )}

              {activeCard === "approval" && (
                <div className="flex flex-col gap-4">
                  <ControlRow label="Reset">
                    <ResetButton onClick={() => setApprovalKey((k) => k + 1)}>Reset</ResetButton>
                  </ControlRow>
                </div>
              )}

              {activeCard === "file-upload" && (
                <div className="flex flex-col gap-4">
                  <ControlRow label="Status">
                    <div className="flex gap-1.5 flex-wrap">
                      {(["uploading", "downloading", "complete", "error"] as const).map((s) => (
                        <PillButton key={s} active={uploadStatus === s} onClick={() => setUploadStatus(s)}>
                          {s}
                        </PillButton>
                      ))}
                    </div>
                  </ControlRow>
                  <ControlRow label="Progress">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={uploadProgress}
                      onChange={(e) => setUploadProgress(Number(e.target.value))}
                      className="w-32 accent-[var(--color-as)]"
                    />
                  </ControlRow>
                </div>
              )}

              {activeCard === "alert" && (
                <div className="flex flex-col gap-4">
                  <ControlRow label="Severity">
                    <div className="flex gap-1.5">
                      {(["info", "warning", "caution"] as const).map((s) => (
                        <PillButton key={s} active={alertSeverity === s} onClick={() => setAlertSeverity(s)}>
                          {s}
                        </PillButton>
                      ))}
                    </div>
                  </ControlRow>
                </div>
              )}

              {activeCard === "handoff" && (
                <div className="flex flex-col gap-4">
                  <ControlRow label="Reset">
                    <ResetButton onClick={() => setHandoffKey((k) => k + 1)}>Reset</ResetButton>
                  </ControlRow>
                </div>
              )}

              {activeCard === "cost" && (
                <div className="flex flex-col gap-4">
                  <div className="text-[12px] text-t3">Static credit usage display. No configurable options.</div>
                </div>
              )}

              {activeCard === "status" && (
                <div className="flex flex-col gap-4">
                  <ControlRow label="Status">
                    <div className="flex gap-1.5 flex-wrap">
                      {(["connected", "expired", "disconnected"] as const).map((s) => (
                        <PillButton key={s} active={statusConnection === s} onClick={() => setStatusConnection(s)}>
                          {s}
                        </PillButton>
                      ))}
                    </div>
                  </ControlRow>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Control sub-components ── */

function ControlRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-t3">{label}</span>
      {children}
    </div>
  );
}

function PillButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md border px-2.5 py-1 text-[11px] font-medium capitalize transition-all ${
        active ? "border-as bg-as/10 text-blt" : "border-b1 text-t3 hover:text-t2"
      }`}
    >
      {children}
    </button>
  );
}

function ResetButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="rounded-md border border-b1 px-2.5 py-1 text-[11px] font-medium text-t3 hover:text-t2"
    >
      {children}
    </button>
  );
}

function AccentPicker({ value, onChange }: { value: CardAccent; onChange: (v: CardAccent) => void }) {
  const accents: { id: CardAccent; label: string }[] = [
    { id: "default", label: "Default" },
    { id: "amber", label: "Amber" },
    { id: "green", label: "Green" },
    { id: "blue", label: "Blue" },
    { id: "violet", label: "Violet" },
  ];
  return (
    <div className="flex gap-1.5">
      {accents.map((a) => (
        <PillButton key={a.id} active={value === a.id} onClick={() => onChange(a.id)}>
          {a.label}
        </PillButton>
      ))}
    </div>
  );
}

function ToggleSwitch({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative h-[24px] w-[44px] rounded-full transition-all ${
        value ? "bg-t1" : "bg-b2"
      }`}
    >
      <div
        className={`absolute top-[2px] h-[20px] w-[20px] rounded-full bg-bg transition-all ${
          value ? "left-[22px]" : "left-[2px]"
        }`}
      />
    </button>
  );
}
