"use client";

import { useState } from "react";
import {
  ResultCard,
  PromptCard,
  ChoiceCard,
  DraftCard,
  BatchReviewCard,
  FormCard,
  ProgressCard,
  ErrorCard,
  type ResultBody,
  type ChoiceOption,
  type DraftField,
  type BatchItem,
  type CardAccent,
  type FormField,
  type ProgressStep,
  type PromptSeverity,
  type ComparisonAttribute,
} from "./cards";
import { LoginRequestCard } from "./LoginRequestCard";

/* ── Card type definitions ── */

type CardType = "result" | "draft" | "choice" | "prompt" | "batch" | "form" | "progress" | "error" | "notification" | "destructive" | "comparison" | "login";

const cardTypes: { id: CardType; label: string; description: string; scenario: string }[] = [
  { id: "result", label: "Result Card", description: "Agent delivers output", scenario: "Task completes and agent presents findings — research summaries, reports, compiled data. Supports prose, highlights, key-value, table, and section layouts." },
  { id: "notification", label: "Notification", description: "Async status update", scenario: "A recurring or background task fires while the user is away — price drops, overdue reminders, daily digests. Urgency levels drive visual weight." },
  { id: "draft", label: "Draft Card", description: "Review before sending", scenario: "Agent drafts something that needs human approval before sending — emails, social comments, bookings, calendar invites. User can edit inline." },
  { id: "choice", label: "Choice Card", description: "Pick from options", scenario: "Agent needs the user to disambiguate — multiple matching profiles, email triage priority, calendar selection. Cards, list, and pills layouts." },
  { id: "comparison", label: "Comparison", description: "Side-by-side options", scenario: "Agent presents structured alternatives for the user to compare — flight options, vendor quotes, pricing tiers. Highlights best/worst attributes." },
  { id: "prompt", label: "Prompt Card", description: "Agent suggests action", scenario: "Agent proactively offers to do something — pull a briefing, set up a recurring task, enable a feature. Standard and compact variants." },
  { id: "destructive", label: "Destructive", description: "Confirm risky action", scenario: "Agent needs explicit confirmation for an irreversible action — mass unsubscribe, bulk delete, account changes. Requires typing confirmation text." },
  { id: "form", label: "Form Card", description: "Structured input", scenario: "Agent needs structured parameters to proceed — flight search criteria, file renaming rules, monitoring thresholds. Validates before submission." },
  { id: "progress", label: "Progress Card", description: "Multi-step status", scenario: "Agent is working through a multi-step task — email classification, lead list building, daily digest compilation. Shows live step-by-step progress." },
  { id: "error", label: "Error Card", description: "Failure + recovery", scenario: "Something went wrong and agent needs help — expired login, CAPTCHA block, scope too large. Always offers recovery actions, never a dead end." },
  { id: "login", label: "Login Request", description: "Branded sign-in", scenario: "Agent needs access to a third-party service — LinkedIn, Gmail, Salesforce. Shows branded service card with trust signals. User signs in via workspace." },
  { id: "batch", label: "Batch Review", description: "Review multiple items", scenario: "Agent has several items that each need a quick decision — email triage, pending approvals, task review queue. Expandable rows with per-item actions." },
];

/* ── Mock data ── */

const resultBodyPresets: { label: string; body: ResultBody }[] = [
  {
    label: "Prose",
    body: {
      type: "prose",
      text: (
        <>
          <strong className="font-semibold text-t1">Sequoia Scouts</strong> ($2.5B AUM). P1 LP since Fund II, last touchpoint 45 days ago. Key contact: Ravi Gupta, Managing Director.
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

const progressPresets: { label: string; steps: ProgressStep[]; title: string; subtitle?: string }[] = [
  {
    label: "In Progress",
    title: "Classifying inbox emails",
    subtitle: "50 emails across 4 folders",
    steps: [
      { label: "Scanning inbox for last 50 emails", status: "done" },
      { label: "Analyzing email content and senders", status: "done" },
      { label: "Sorting into categories (FYI, Scheduling, Requests, Newsletters)", status: "running", detail: "32 of 50 processed" },
      { label: "Moving emails to folders", status: "pending" },
      { label: "Generating summary report", status: "pending" },
    ],
  },
  {
    label: "With Error",
    title: "Building lead list from LinkedIn",
    subtitle: "Finding Simular employees",
    steps: [
      { label: "Searching LinkedIn for Simular", status: "done" },
      { label: "Extracting employee profiles", status: "done", detail: "Found 11 people" },
      { label: "Collecting profile details", status: "error", detail: "Rate limited by LinkedIn after 6 profiles" },
      { label: "Writing to Google Sheet", status: "pending" },
    ],
  },
  {
    label: "Complete",
    title: "Daily email digest",
    subtitle: "Morning run at 7:04 AM",
    steps: [
      { label: "Fetching unread emails", status: "done", detail: "23 new emails" },
      { label: "Categorizing by priority", status: "done" },
      { label: "Generating digest summary", status: "done" },
      { label: "Checking calendar for conflicts", status: "done" },
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
  const [resultAccent, setResultAccent] = useState<CardAccent>("default");
  const [showSchedule, setShowSchedule] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Draft config
  const [draftPresetIndex, setDraftPresetIndex] = useState(0);
  const [draftAccent, setDraftAccent] = useState<CardAccent>("amber");

  // Choice config
  const [choicePresetIndex, setChoicePresetIndex] = useState(0);
  const [choiceKey, setChoiceKey] = useState(0);

  // Prompt config
  const [promptVariant, setPromptVariant] = useState<"standard" | "compact">("standard");
  const [promptSeverity, setPromptSeverity] = useState<PromptSeverity | "none">("none");
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
  const [loginConnected, setLoginConnected] = useState(false);
  const [loginService, setLoginService] = useState<"LinkedIn" | "Gmail" | "Salesforce">("LinkedIn");

  // Notification config
  const [notifUrgency, setNotifUrgency] = useState<"info" | "attention" | "urgent">("attention");

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
          {/* Scenario description for selected card (hidden on mobile) */}
          <div className="mt-auto border-t border-b1 px-5 py-4 max-md:hidden">
            <div className="text-[10px] font-medium uppercase tracking-wide text-t4 mb-1.5">When to use</div>
            <div className="text-[11.5px] leading-[1.55] text-t3">
              {cardTypes.find((ct) => ct.id === activeCard)?.scenario}
            </div>
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
                    <svg className="h-3.5 w-3.5 text-t1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  }
                  title="LP Meeting Prep - Sequoia Scouts"
                  subtitle="5 sources - just now"
                  body={resultBodyPresets[resultBodyIndex].body}
                  accent={resultAccent}
                  actions={[
                    { label: "View details", style: "primary", onClick: () => {} },
                    { label: "Copy", style: "outline", onClick: () => {} },
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
                    <svg className="h-3.5 w-3.5 text-t1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              {activeCard === "prompt" && (
                <PromptCard
                  key={`prompt-${promptKey}`}
                  variant={promptVariant}
                  severity={promptSeverity === "none" ? undefined : promptSeverity}
                  message={
                    <>
                      You have an <strong className="font-semibold text-t1">LP meeting with Sequoia Scouts on Thursday</strong>. Want me to pull your prep briefing now?
                    </>
                  }
                  actions={[
                    { label: "Pull briefing", style: "primary", onClick: () => {} },
                    { label: "Skip", style: "outline", onClick: () => {} },
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
                <ProgressCard
                  title={progressPresets[progressPresetIndex].title}
                  subtitle={progressPresets[progressPresetIndex].subtitle}
                  steps={progressPresets[progressPresetIndex].steps}
                  onCancel={progressPresets[progressPresetIndex].steps.some((s) => s.status === "running") ? () => {} : undefined}
                  onRetry={progressPresets[progressPresetIndex].steps.some((s) => s.status === "error") ? () => {} : undefined}
                  actions={
                    progressPresets[progressPresetIndex].steps.every((s) => s.status === "done")
                      ? [{ label: "View report", style: "primary", onClick: () => {} }]
                      : undefined
                  }
                />
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

              {/* Login Request */}
              {activeCard === "login" && (
                <LoginRequestCard
                  key={`login-${loginService}-${loginConnected}`}
                  service={loginService}
                  onLogin={() => setLoginConnected(true)}
                  connected={loginConnected}
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
                  <ControlRow label="Variant">
                    <div className="flex gap-1.5">
                      {(["standard", "compact"] as const).map((v) => (
                        <PillButton key={v} active={promptVariant === v} onClick={() => setPromptVariant(v)}>
                          {v}
                        </PillButton>
                      ))}
                    </div>
                  </ControlRow>
                  <ControlRow label="Severity">
                    <div className="flex gap-1.5">
                      {(["none", "info", "warning", "destructive"] as const).map((s) => (
                        <PillButton key={s} active={promptSeverity === s} onClick={() => { setPromptSeverity(s); setPromptKey((k) => k + 1); }}>
                          {s}
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

              {activeCard === "login" && (
                <div className="flex flex-col gap-4">
                  <ControlRow label="Service">
                    <div className="flex gap-1.5">
                      {(["LinkedIn", "Gmail", "Salesforce"] as const).map((s) => (
                        <PillButton key={s} active={loginService === s} onClick={() => { setLoginService(s); setLoginConnected(false); }}>
                          {s}
                        </PillButton>
                      ))}
                    </div>
                  </ControlRow>
                  <ControlRow label="Connected">
                    <ToggleSwitch value={loginConnected} onChange={setLoginConnected} />
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
