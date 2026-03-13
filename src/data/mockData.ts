export type ViewState = "zero-state" | "task-hover" | "result-detail";

export interface TaskStep {
  label: string;
  done: boolean;
}

export interface RunHistoryEntry {
  date: string;
  duration: string;
  summary: string;
  fullResult?: string;
  hasActionItems?: boolean;
}

export type ResultFormat = "text" | "briefing" | "document" | "spreadsheet" | "code" | "link" | "email" | "calendar";

export interface ResultArtifact {
  format: ResultFormat;
  title: string;
  subtitle?: string;
  icon?: string;
  url?: string;
  language?: string;
  preview?: string;
  fullContent?: string;
}

export interface TaskDetail {
  description: string;
  steps?: TaskStep[];
  result?: string;
  fullResult?: string;
  resultType?: "briefing" | "text";
  artifact?: ResultArtifact;
  duration?: string;
  schedule?: string;
  lastRun?: string;
  nextRun?: string;
  queuePosition?: number;
  runHistory?: RunHistoryEntry[];
  maxDuration?: string;
  autonomousActions?: string;
}

export const AVAILABLE_SKILLS = [
  "Research",
  "Writing",
  "Data Analysis",
  "Scheduling",
  "Code",
  "Image Analysis",
];

export const DURATION_OPTIONS = ["5 min", "15 min", "30 min", "1 hr", "No limit"];

export const AUTONOMY_LEVELS = ["Off", "Low", "Medium", "High"] as const;

export interface Task {
  id: string;
  name: string;
  status: "running" | "queued" | "recurring" | "completed";
  subtitle: string;
  time: string;
  thumbEmoji?: string;
  thumbLabel?: string;
  thumbSite?: string;
  thumbStatus?: string;
  detail?: TaskDetail;
  integrations?: string[];
  skills?: string[];
}

export interface Person {
  initials: string;
  name: string;
  role: string;
}

export interface Source {
  title: string;
  url: string;
}

export const activeTasks: Task[] = [
  {
    id: "1",
    name: "Research inbound founder on LinkedIn",
    status: "running",
    subtitle: "Running now",
    time: "2:18",
    thumbEmoji: "\uD83D\uDD0D",
    thumbLabel: "Active - using screen now",
    thumbSite: "linkedin.com/in/daniel-park",
    thumbStatus: "LinkedIn\nFounder profile",
    integrations: ["LinkedIn", "X", "Salesforce"],
    skills: ["Research"],
    detail: {
      description: "Reviewing inbound deal from Daniel Park. Checking LinkedIn, X, and company website to build a founder profile and map to existing Salesforce records.",
      duration: "2:18 elapsed",
      maxDuration: "15 min",
      autonomousActions: "Medium",
      steps: [
        { label: "Opened founder's LinkedIn profile", done: true },
        { label: "Pulled background, experience, and notable followers", done: true },
        { label: "Cross-referenced X profile for recent posts", done: true },
        { label: "Checking company website and product", done: false },
        { label: "Mapping to Salesforce deal record", done: false },
      ],
    },
  },
  {
    id: "2",
    name: "Compile meeting debrief from today's calendar",
    status: "queued",
    subtitle: "Queued",
    time: "queue",
    thumbEmoji: "\u23F3",
    thumbLabel: "Queued - will start next",
    thumbSite: "waiting for current task",
    thumbStatus: "Waiting\nfor screen",
    integrations: ["Gmail", "Granola"],
    skills: ["Writing"],
    detail: {
      description: "After today's LP meetings, pull Granola notes, draft personalized thank-you emails including attendee emails and colleague CCs.",
      queuePosition: 1,
      maxDuration: "15 min",
      autonomousActions: "Low",
    },
  },
];

export const recurringTasks: Task[] = [
  {
    id: "3",
    name: "Daily deal sourcing digest",
    status: "recurring",
    subtitle: "Every day - 7am",
    time: "7:00a",
    integrations: ["Crunchbase", "X", "TechCrunch"],
    skills: ["Research"],
    thumbEmoji: "\uD83D\uDD0D",
    thumbLabel: "Last run - today 7:04am",
    thumbSite: "crunchbase.com/search",
    thumbStatus: "Crunchbase\nDeal search",
    detail: {
      description: "Scans Crunchbase, TechCrunch, and X for new funding rounds, product launches, and key hires in healthcare AI and vertical AI. Tags by investment criteria relevance.",
      maxDuration: "15 min",
      autonomousActions: "High",
      schedule: "Every day at 7:00am",
      lastRun: "Today 7:04am",
      nextRun: "Tomorrow 7:00am",
      result: "Found 3 new deals worth reviewing. Abridge raised $150M Series C. Two seed-stage vertical AI startups flagged.",
      fullResult: "Abridge raised $150M Series C led by Lightspeed. Clinical AI documentation platform, $500M+ valuation. Strong overlap with our healthcare AI thesis.\n\nNovaTech AI (Seed, $4.2M) from YC W25 batch. Vertical AI for supply chain compliance. Founder ex-Google, strong technical background.\n\nClearStack (Seed, $3.1M). AI-native procurement for mid-market. Second-time founder, previously sold to Coupa.\n\nNo other significant moves detected across 22 tracked themes.",
      artifact: {
        format: "document",
        title: "Deal Sourcing Digest - Feb 13",
        subtitle: "Google Docs",
        icon: "\uD83D\uDCC4",
        url: "docs.google.com/deal-digest-feb13",
      },
      runHistory: [
        { date: "Today 7:04am", duration: "3m 12s", summary: "3 new deals: Abridge $150M Series C, 2 seed-stage vertical AI" },
        { date: "Yesterday 7:02am", duration: "2m 45s", summary: "1 new deal: Osso Health $100M growth round. 2 key hires at tracked cos." },
        { date: "Feb 11 7:01am", duration: "2m 58s", summary: "2 new YC companies flagged in healthcare AI batch" },
        { date: "Feb 10 7:00am", duration: "2m 18s", summary: "No significant new deals. 1 portfolio company featured in TechCrunch." },
        { date: "Feb 9 7:01am", duration: "2m 42s", summary: "1 new deal: Anterior $95M Series B, clinical AI." },
      ],
    },
  },
  {
    id: "4",
    name: "LP meeting prep briefing",
    status: "recurring",
    subtitle: "48 hrs before LP meeting",
    time: "auto",
    integrations: ["Salesforce", "Google Docs", "Calendar"],
    skills: ["Research", "Writing"],
    thumbEmoji: "\uD83D\uDCCB",
    thumbLabel: "Last run - Sequoia Scouts briefing",
    thumbSite: "salesforce.com/lp-profile",
    thumbStatus: "Salesforce\nLP profile",
    detail: {
      description: "48 hours before any LP meeting on your calendar, pulls the Salesforce LP profile and recent notes, then drafts a prep email using your standard template.",
      maxDuration: "15 min",
      autonomousActions: "Medium",
      schedule: "48 hours before each LP meeting",
      lastRun: "Today 9:30am (Sequoia Scouts)",
      nextRun: "Tomorrow 2:00pm (Accel Partners)",
      result: "Sequoia Scouts briefing created. LP profile pulled, 4 recent touchpoints summarized, prep email drafted.",
      resultType: "briefing",
      artifact: {
        format: "briefing",
        title: "Sequoia Scouts - LP Meeting Prep",
        subtitle: "Salesforce profile, 4 touchpoints",
        icon: "\uD83D\uDCCB",
      },
      runHistory: [
        { date: "Today 9:30am", duration: "2m 48s", summary: "Sequoia Scouts briefing, 4 recent touchpoints, prep email drafted" },
        { date: "Yesterday 10:15am", duration: "3m 02s", summary: "CalPERS meeting prep, commitment history pulled, 6 touchpoints" },
        { date: "Feb 11 2:00pm", duration: "2m 33s", summary: "Tiger Global briefing, recent fund performance included" },
        { date: "Feb 10 9:45am", duration: "2m 18s", summary: "Family office meeting, 2 touchpoints, shorter prep" },
      ],
    },
  },
  {
    id: "5",
    name: "LP touchpoint tracker",
    status: "recurring",
    subtitle: "Every Monday - 8am",
    time: "8:00a",
    integrations: ["Salesforce", "Calendar", "Gmail"],
    skills: ["Data Analysis"],
    thumbEmoji: "\uD83D\uDCCA",
    thumbLabel: "Last run - Monday 8:02am",
    thumbSite: "salesforce.com/lp-tracker",
    thumbStatus: "Salesforce\nLP touchpoints",
    detail: {
      description: "Checks Salesforce, your calendar, and email to verify you're hitting your P1 LP touchpoint goals (once every 60 days). Suggests content shares and event invites to maintain cadence.",
      maxDuration: "15 min",
      autonomousActions: "Medium",
      schedule: "Every Monday at 8:00am",
      lastRun: "Monday 8:02am",
      nextRun: "Next Monday 8:00am",
      result: "4 P1 LPs are overdue for a touchpoint. Suggested 3 content shares and 2 event invites to close gaps.",
      fullResult: "P1 LPs overdue (60+ days since last touchpoint):\n\n1. Wellington Management - 72 days. Suggest: share your recent portfolio update deck.\n2. GIC Singapore - 68 days. Suggest: invite to your AI in Healthcare webinar (Mar 5).\n3. Norges Bank IM - 65 days. Suggest: share the Abridge case study.\n4. Ontario Teachers' - 61 days. Suggest: invite to LP dinner (Mar 12).\n\nAll other P1 LPs are within cadence. 3 P2 LPs also approaching 60-day mark.",
      artifact: {
        format: "spreadsheet",
        title: "LP Touchpoint Report",
        subtitle: "18 rows \u00D7 6 cols",
        icon: "\uD83D\uDCCA",
        url: "docs.google.com/spreadsheets/lp-touchpoints",
      },
      runHistory: [
        { date: "Monday 8:02am", duration: "2m 15s", summary: "4 P1 LPs overdue. 3 content shares, 2 event invites suggested." },
        { date: "Feb 3 8:01am", duration: "2m 08s", summary: "2 P1 LPs overdue. 1 event invite, 1 content share suggested." },
        { date: "Jan 27 8:00am", duration: "1m 58s", summary: "All P1 LPs within cadence. 1 P2 approaching 60 days." },
        { date: "Jan 20 8:01am", duration: "2m 22s", summary: "3 P1 LPs overdue. Suggested dinner invitation to close gaps." },
      ],
    },
  },
  {
    id: "10",
    name: "Important email reminder",
    status: "recurring",
    subtitle: "Twice daily - 8am & 3pm",
    time: "8:00a",
    integrations: ["Gmail"],
    skills: ["Research"],
    thumbEmoji: "📬",
    thumbLabel: "Last run - today 3:01pm",
    thumbSite: "gmail.com",
    thumbStatus: "Gmail\nEmail scan",
    detail: {
      description: "Scans your 30 most recent unread Gmail messages, filters out promotions, marketing, and newsletters, and surfaces important emails that need your attention or a reply.",
      maxDuration: "5 min",
      autonomousActions: "High",
      schedule: "Every day at 8:00am and 3:00pm",
      lastRun: "Today 3:01pm",
      nextRun: "Tomorrow 8:00am",
      result: "Scanned 30 unread emails, found 3 important: a USSD Belmont Dojo message requiring a reply about Spring Break plans, a Mercury notification, and a university follow-up.",
      runHistory: [
        { date: "Mar 3, 3:01 PM", duration: "1m 42s", summary: "Scanned 30 of 201 unread. 3 important: USSD Belmont Dojo reply, Mercury notification, university follow-up.", hasActionItems: true, fullResult: "Scanned 30 of 201 unread Gmail messages from the past 24 hours and identified 3 important emails:\n\n1. USSD Belmont Dojo — reply needed about Spring Break plans\n2. Mercury — account notification, review recommended\n3. Stanford AI Lab — follow-up on collaboration discussion\n\n27 messages filtered as promotional, marketing, or newsletters." },
        { date: "Mar 3, 8:01 AM", duration: "1m 38s", summary: "Scanned 30 of 201 unread. No emails requiring action — 28 marketing/promos, 1 university newsletter, 1 FYI notification.", fullResult: "Scanned 30 of your 201 unread Gmail messages for the afternoon run (past 8 hours) and found no emails requiring action or a response — 28 were marketing/promotions/newsletters, 1 was university newsletter, 1 was FYI-level notification." },
        { date: "Mar 2, 3:02 PM", duration: "1m 45s", summary: "Scanned 30 of 201 unread. 6 important, 2 requiring action: Lia Ng (ByteDance) AI research follow-up, invoice from contractor.", hasActionItems: true, fullResult: "Scanned 30 unread emails from the past 24 hours and identified 6 important ones worth your attention: 2 require action (Lia Ng from ByteDance following up on an AI research collab, and an overdue invoice from a contractor), 4 are FYI-level." },
        { date: "Mar 2, 8:01 AM", duration: "1m 33s", summary: "Scanned 30 of 201 unread. 4 potentially important, none requiring immediate action.", fullResult: "Scanned 30 unread Gmail messages from the past 24 hours and identified 4 potentially important emails while filtering out 26 promotional, marketing, and newsletter messages. None required immediate action." },
        { date: "Mar 1, 3:00 PM", duration: "1m 40s", summary: "Scanned 30 of 201 unread. 3 noteworthy: Xfinity bill, AppleCare renewal, team standup notes.", fullResult: "Scanned 30 of 201 unread emails from the past 24 hours in your Gmail and identified 3 noteworthy ones: an Xfinity bill of $89.99 due Mar 10, an AppleCare renewal reminder, and team standup notes from yesterday." },
        { date: "Mar 1, 8:02 AM", duration: "1m 36s", summary: "Scanned 30 of 201 unread. 3 important: Xfinity bill past-due, AppleCare, and a meeting reschedule.", hasActionItems: true, fullResult: "Scanned 30 of 201 unread emails from the past 24 hours, filtered out 27 promotional/marketing/newsletter messages, and identified 3 noteworthy emails: an Xfinity bill, an AppleCare+ renewal, and a meeting reschedule request from a portfolio company founder." },
        { date: "Feb 28, 3:01 PM", duration: "1m 44s", summary: "Scanned 30 of 201 unread. 7 important, 2 requiring action: AT&T past-due bill $255.30, AppleCare+ renewal.", hasActionItems: true, fullResult: "Scanned 30 of 201 unread emails and identified 7 important ones: 2 requiring action (AT&T past-due bill of $255.30 and AppleCare+ renewal decision needed), 5 FYI-level items." },
        { date: "Feb 28, 8:01 AM", duration: "1m 31s", summary: "Scanned 30 unread. 2 FYI-level: Robinhood interest statement, LinkedIn weekly digest.", fullResult: "Scanned 30 unread Gmail messages and found that none required immediate action or a response. Only 2 were flagged as FYI-level notices (a Robinhood interest statement and LinkedIn weekly digest)." },
        { date: "Feb 27, 3:01 PM", duration: "1m 39s", summary: "Scanned 30 of 201 unread. 5 important, 1 requiring action: paper accepted to Agentic AI in the Wild workshop.", hasActionItems: true, fullResult: "Scanned 30 of 201 unread emails and identified 5 important ones: 1 requiring action (your paper was accepted to the Agentic AI in the Wild workshop — registration deadline Mar 5), 4 FYI." },
        { date: "Feb 27, 8:01 AM", duration: "1m 35s", summary: "Scanned 30 of 201 unread. 4 important, 1 requiring action: Third Bridge consultation request via LinkedIn.", hasActionItems: true, fullResult: "Scanned 30 of 201 unread emails and identified 4 important ones: 1 requiring action (a paid consultation request from Third Bridge about CUA expertise via LinkedIn), 1 time-sensitive newsletter, 2 FYI." },
      ],
    },
  },
];

export const completedTasks: Task[] = [
  {
    id: "6",
    name: "Sequoia Scouts LP meeting prep",
    status: "completed",
    subtitle: "Completed",
    time: "9:30a",
    integrations: ["Salesforce", "Google Docs"],
    skills: ["Research", "Writing"],
    thumbEmoji: "\uD83D\uDCCB",
    thumbLabel: "Completed - final state",
    thumbSite: "salesforce.com/sequoia-scouts",
    thumbStatus: "Salesforce\nLP prep done",
    detail: {
      description: "Pulled Salesforce profile for Sequoia Scouts, reviewed recent notes and touchpoints, and drafted a prep email for Thursday's meeting.",
      duration: "2m 48s",
      maxDuration: "15 min",
      autonomousActions: "Medium",
      result: "LP meeting prep complete. Sequoia Scouts: $2.5B AUM, last touchpoint 45 days ago. Key contact: Ravi Gupta. Prep email drafted with 4 talking points.",
      resultType: "briefing",
      artifact: {
        format: "briefing",
        title: "Sequoia Scouts - LP Meeting Prep",
        subtitle: "Salesforce profile, 4 touchpoints",
        icon: "\uD83D\uDCCB",
      },
      steps: [
        { label: "Opened Salesforce LP profile", done: true },
        { label: "Pulled recent notes and touchpoint history", done: true },
        { label: "Reviewed recent fund content for sharing", done: true },
        { label: "Drafted prep email with talking points", done: true },
        { label: "Saved to drafts for review", done: true },
      ],
    },
  },
  {
    id: "7",
    name: "Post-meeting notes to Salesforce",
    status: "completed",
    subtitle: "Completed",
    time: "8:45a",
    integrations: ["Granola", "Salesforce", "Gmail"],
    skills: ["Writing"],
    thumbEmoji: "\uD83D\uDCDD",
    thumbLabel: "Completed - final state",
    thumbSite: "salesforce.com/notes",
    thumbStatus: "Salesforce\nNotes saved",
    detail: {
      description: "Pulled Granola notes from yesterday's CalPERS meeting, extracted key discussion points and action items, saved to Salesforce, and drafted a team summary email.",
      duration: "3m 22s",
      maxDuration: "15 min",
      autonomousActions: "Low",
      result: "Notes processed. 5 action items extracted, saved to Salesforce CalPERS record. Team email drafted with meeting summary and next steps.",
      artifact: {
        format: "document",
        title: "CalPERS Meeting Notes - Feb 12",
        subtitle: "Google Docs, 5 action items",
        icon: "\uD83D\uDCC4",
        url: "docs.google.com/calpers-notes-feb12",
        preview: "Meeting: CalPERS LP Review\nDate: Feb 12, 2:00pm\n\nKey Discussion:\n\u2022 Reviewing Fund IV performance\n\u2022 Interest in healthcare AI thesis\n\u2022 Follow-up on co-invest opportunity\n\nAction Items:\n\u2022 Send updated portfolio deck by Friday\n\u2022 Schedule follow-up with investment committee",
      },
      steps: [
        { label: "Pulled Granola notes from CalPERS meeting", done: true },
        { label: "Extracted 5 action items and key decisions", done: true },
        { label: "Saved notes to Salesforce CalPERS record", done: true },
        { label: "Drafted team summary email", done: true },
        { label: "Saved email to drafts for review", done: true },
      ],
    },
  },
  {
    id: "8",
    name: "Founder research: Abridge",
    status: "completed",
    subtitle: "Completed",
    time: "Yesterday",
    integrations: ["LinkedIn", "X", "Crunchbase", "Salesforce"],
    skills: ["Research"],
    thumbEmoji: "\uD83D\uDD0D",
    thumbLabel: "Completed - final state",
    thumbSite: "linkedin.com/company/abridge",
    thumbStatus: "LinkedIn\nFounder research",
    detail: {
      description: "Deep research on Abridge and founder Shiv Rao. Pulled LinkedIn profiles, X posts, Crunchbase data, press coverage, and customer reviews. Checked Salesforce for existing deal history.",
      duration: "4m 15s",
      maxDuration: "15 min",
      autonomousActions: "Medium",
      result: "Founder one-pager complete. Shiv Rao (MD, ex-cardiologist). Abridge at $500M+ valuation, 150+ health system customers. Strong product-market fit in clinical AI. Previously in Salesforce as Stage 2.",
      artifact: {
        format: "document",
        title: "Abridge - Founder One-Pager",
        subtitle: "Google Docs, 6 sources",
        icon: "\uD83D\uDCC4",
        url: "docs.google.com/abridge-one-pager",
        preview: "Abridge (Clinical AI Documentation)\nFounder: Shiv Rao, MD\nStage: Series C ($150M, Lightspeed)\nCustomers: 150+ health systems\n\nThesis Fit: Strong alignment with healthcare AI vertical\nSalesforce Status: Stage 2, previously reviewed Q3 2025",
      },
      steps: [
        { label: "Searched Crunchbase for funding history", done: true },
        { label: "Pulled LinkedIn profiles for founding team", done: true },
        { label: "Reviewed founder's recent X posts and insights", done: true },
        { label: "Checked customer reviews and press coverage", done: true },
        { label: "Cross-referenced Salesforce deal record", done: true },
        { label: "Compiled one-pager document", done: true },
      ],
    },
  },
  {
    id: "9",
    name: "Draft LP thank-you emails",
    status: "completed",
    subtitle: "Completed",
    time: "Yesterday",
    integrations: ["Granola", "Gmail"],
    skills: ["Writing"],
    thumbEmoji: "\uD83D\uDCE7",
    thumbLabel: "Completed - final state",
    thumbSite: "gmail.com/drafts",
    thumbStatus: "Gmail\nDraft emails",
    detail: {
      description: "Reviewed all Granola notes from yesterday's LP meetings. Drafted personalized thank-you emails for each LP, including attendee emails and colleague CCs.",
      duration: "5m 30s",
      maxDuration: "15 min",
      autonomousActions: "Low",
      result: "3 thank-you emails drafted. Personalized for GIC, Tiger Global, and Wellington. Each includes meeting highlights and next steps. Ready for review in Gmail drafts.",
      artifact: {
        format: "email",
        title: "LP Thank-You Emails - Feb 12",
        subtitle: "3 drafts in Gmail",
        icon: "\uD83D\uDCE7",
        url: "gmail.com/drafts",
      },
      steps: [
        { label: "Pulled Granola notes from 3 LP meetings", done: true },
        { label: "Extracted key discussion points per meeting", done: true },
        { label: "Drafted personalized thank-you for GIC", done: true },
        { label: "Drafted personalized thank-you for Tiger Global", done: true },
        { label: "Drafted personalized thank-you for Wellington", done: true },
        { label: "Saved all to Gmail drafts for review", done: true },
      ],
    },
  },
  {
    id: "10",
    name: "School emails summary",
    status: "completed",
    subtitle: "Completed",
    time: "Yesterday",
    integrations: ["Gmail", "Calendar"],
    skills: ["Data Analysis"],
    thumbEmoji: "\uD83D\uDCE7",
    thumbLabel: "Completed - final state",
    thumbSite: "gmail.com/school",
    thumbStatus: "Gmail\nSchool digest",
    detail: {
      description: "Reviewed weekly emails from your kids' school. Summarized key dates, added events to calendar, and created a task list of items needing action.",
      duration: "1m 45s",
      result: "3 events added to calendar (science fair Mar 7, parent-teacher Mar 14, spring break Mar 21-28). 2 action items: sign permission slip by Friday, volunteer form due Mar 1.",
      artifact: {
        format: "text",
        title: "School Week Summary",
        subtitle: "3 events, 2 action items",
        icon: "\uD83D\uDCC5",
      },
      steps: [
        { label: "Scanned inbox for school emails", done: true },
        { label: "Extracted dates and events", done: true },
        { label: "Added 3 events to calendar", done: true },
        { label: "Created action item list", done: true },
      ],
    },
  },
];

export const briefingPeople: Person[] = [
  {
    initials: "RG",
    name: "Ravi Gupta",
    role: "Managing Director - Led their last 3 fund investments in AI",
  },
  {
    initials: "AM",
    name: "Amy Mitchell",
    role: "Partner - Your primary contact. Met at LP summit last quarter.",
  },
  {
    initials: "TK",
    name: "Thomas Kim",
    role: "Associate - Joined from Goldman Sachs 6 months ago",
  },
];

export const briefingSources: Source[] = [
  { title: "Salesforce - Sequoia Scouts LP profile", url: "salesforce.com/lp/sequoia-scouts" },
  { title: "Calendar - Last 4 meeting touchpoints", url: "calendar.google.com" },
  { title: "Granola - Recent meeting notes", url: "granola.ai/notes" },
  { title: "Email - Recent correspondence thread", url: "gmail.com/threads/sequoia" },
  { title: "Sequoia Scouts - Recent portfolio announcements", url: "sequoiacap.com/scouts" },
];

export const briefingOverview = {
  lp: "Sequoia Scouts",
  aum: "$2.5B across 3 vehicles",
  focus: "Early-stage technology, AI/ML, healthcare",
  relationship: "P1 LP since Fund II",
  lastTouchpoint: "45 days ago (dinner, Jan 2)",
  commitment: "$25M in Fund III, considering Fund IV",
};

export const talkingPoints = [
  {
    title: "Fund IV timeline.",
    body: "They've expressed interest in Fund IV. Ravi mentioned at dinner wanting to see Q4 portfolio performance before committing. Share the updated deck.",
  },
  {
    title: "Healthcare AI thesis.",
    body: "Amy flagged strong interest in your healthcare AI investments. The Abridge case study would resonate. She also asked about your Osso Health position.",
  },
  {
    title: "Co-invest appetite.",
    body: "Thomas mentioned their fund is actively looking for co-invest opportunities in Series A/B rounds. Your upcoming NovaTech deal could be a fit.",
  },
];

// ===== Running Task Step Log =====

export type StepType = "action" | "error" | "thinking" | "user";
export type StepStatus = "done" | "active" | "failed";

export interface RunningStep {
  timestamp: string;
  label: string;
  site?: string;
  trustSignal?: string;
  done: boolean;
  userAction?: boolean;
  /** Step classification for visual rendering (default: "action") */
  type?: StepType;
  /** Explicit status for error/retry states */
  status?: StepStatus;
  /** Error detail text shown below the label in muted red */
  errorDetail?: string;
  /** Steps with the same groupId are collapsed together in summary view */
  groupId?: string;
  /** Human-readable summary for collapsed group */
  groupSummary?: string;
  /** Whether this step is the final successful outcome of a retry group */
  groupResolved?: boolean;
  /** Number of attempts in this group (set on the summary step) */
  attemptCount?: number;
}

export const runningTaskSteps: RunningStep[] = [
  { timestamp: "0:02", label: "Opened Chrome and navigated to LinkedIn", done: true },
  { timestamp: "0:04", label: "Opened LinkedIn founder profile", site: "linkedin.com", done: true },
  { timestamp: "0:10", label: "Pulled background, education, and work history", done: true },
  { timestamp: "0:16", label: "Extracted mutual connections and endorsements", done: true },
  { timestamp: "0:24", label: "Reviewed recent posts on X", site: "x.com", done: true },
  { timestamp: "0:30", label: "Pulled Crunchbase company profile and funding rounds", done: true },
  { timestamp: "0:38", label: "Cross-referenced Salesforce for existing deal record", done: true },
  { timestamp: "0:40", label: "Checking company website and product...", done: false },
];

// ===== Workspace Steps (simplified progress) =====

export interface WorkspaceStep {
  label: string;
  status: "done" | "active" | "pending";
}

export const workspaceSteps: WorkspaceStep[] = [
  { label: "Opened founder's LinkedIn profile", status: "done" },
  { label: "Pulled background, experience, and notable followers", status: "done" },
  { label: "Cross-referenced X profile for recent posts", status: "done" },
  { label: "Checked company website and product page", status: "done" },
  { label: "Reviewed recent funding rounds and investors", status: "done" },
  { label: "Matched to Salesforce deal record", status: "done" },
  { label: "Drafting research brief for CRM", status: "active" },
  { label: "Send summary to Slack channel", status: "pending" },
];

export const linkedinPreLoginSteps: RunningStep[] = [
  { timestamp: "0:01", label: "Opened Chrome", done: true },
  { timestamp: "0:03", label: "Navigated to linkedin.com/login", site: "linkedin.com", done: true },
  { timestamp: "0:05", label: "Signing in to LinkedIn...", done: false },
];

export const linkedinLoginSteps: RunningStep[] = [
  { timestamp: "0:01", label: "Opened Chrome", done: true },
  { timestamp: "0:03", label: "Navigated to linkedin.com/login", site: "linkedin.com", done: true },
  { timestamp: "0:05", label: "Detected login required — waiting for credentials", done: true },
  { timestamp: "0:09", label: "Signed in to LinkedIn", done: true, userAction: true },
  { timestamp: "0:11", label: "Navigated to profile viewers page", done: true },
  { timestamp: "0:14", label: "Parsing viewer list and extracting profiles", done: true },
  { timestamp: "0:18", label: "Pulling profile viewer list...", done: false },
];

export const loginSteps: WorkspaceStep[] = [
  { label: "Received task: check LinkedIn profile viewers", status: "done" },
  { label: "LinkedIn access required", status: "done" },
  { label: "Waiting for sign in", status: "active" },
  { label: "Pull profile viewer list", status: "pending" },
  { label: "Research viewer backgrounds", status: "pending" },
];

export const loginSuccessSteps: WorkspaceStep[] = [
  { label: "Received task: check LinkedIn profile viewers", status: "done" },
  { label: "LinkedIn access required", status: "done" },
  { label: "Signed in to LinkedIn", status: "done" },
  { label: "Pulling profile viewer list", status: "active" },
  { label: "Research viewer backgrounds", status: "pending" },
];

// ===== LinkedIn Profile Disambiguation =====

export interface LinkedInProfile {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  initials: string;
  mutualConnections: number;
  avatarUrl: string;
}

export const disambiguationProfiles: LinkedInProfile[] = [
  {
    id: "dp-1",
    name: "Daniel Park",
    title: "Co-founder & CEO",
    company: "Luma AI",
    location: "San Francisco, CA",
    initials: "DP",
    mutualConnections: 34,
    avatarUrl: "https://i.pravatar.cc/80?img=11",
  },
  {
    id: "dp-2",
    name: "Daniel Park",
    title: "Partner",
    company: "Sequoia Capital",
    location: "Menlo Park, CA",
    initials: "DP",
    mutualConnections: 12,
    avatarUrl: "https://i.pravatar.cc/80?img=33",
  },
  {
    id: "dp-3",
    name: "Danny Park",
    title: "Staff Engineer",
    company: "Stripe",
    location: "San Francisco, CA",
    initials: "DP",
    mutualConnections: 8,
    avatarUrl: "https://i.pravatar.cc/80?img=53",
  },
];

export const linkedinDisambiguatedSteps: RunningStep[] = [
  { timestamp: "0:01", label: "Opened Chrome", done: true },
  { timestamp: "0:03", label: "Navigated to linkedin.com/login", site: "linkedin.com", done: true },
  { timestamp: "0:05", label: "Detected login required — waiting for credentials", done: true },
  { timestamp: "0:09", label: "Signed in to LinkedIn", done: true, userAction: true },
  { timestamp: "0:12", label: "Searched for Daniel Park on LinkedIn", done: true },
  { timestamp: "0:14", label: "Found 3 matching profiles for Daniel Park", done: true },
  { timestamp: "0:16", label: "User selected Daniel Park, CEO at Luma AI", done: true, userAction: true },
  { timestamp: "0:19", label: "Navigated to profile viewers page", done: true },
  { timestamp: "0:22", label: "Parsing viewer list and extracting profiles", done: true },
  { timestamp: "0:25", label: "Pulling full profile details for each viewer...", done: false },
];

// ===== Teach Mode Steps =====

export const teachSteps: WorkspaceStep[] = [
  { label: "Open Chrome", status: "done" },
  { label: "Navigate to gmail.com", status: "done" },
  { label: "Sign in to Gmail", status: "active" },
  { label: "Compose a new email", status: "pending" },
  { label: "Fill in recipients, subject, and body", status: "pending" },
  { label: "Send the email", status: "pending" },
];

// ===== Zero State Starter Tasks =====

export type TrustLevel = "low" | "medium" | "needs-auth";

export interface StarterTask {
  id: string;
  title: string;
  description: string;
  trustLevel: TrustLevel;
  trustLabel: string;
  icon: string;
  category: string;
  /** Which roles this task is shown for. Undefined = shown for all roles. */
  roles?: string[];
  /** Real apps this task uses — shown as tags on the card */
  apps?: string[];
}

/** Role-aware starter tasks. Every task names 2+ real apps and describes
 *  a multi-step browser workflow only a screen-controlling agent can do. */
export const starterTasks: StarterTask[] = [
  // ── VC / Investor ──
  {
    id: "vc-1",
    title: "Build a founder dossier before your next meeting",
    description: "Pull their LinkedIn, Crunchbase, and recent X posts. Cross-reference with your Salesforce deal notes and compile a one-pager.",
    trustLevel: "needs-auth",
    trustLabel: "LinkedIn · Salesforce sign in",
    icon: "🔍",
    category: "research",
    roles: ["vc"],
    apps: ["LinkedIn", "Crunchbase", "X", "Salesforce"],
  },
  {
    id: "vc-2",
    title: "Compile a meeting debrief from today's calendar",
    description: "Check Google Calendar for today's meetings, pull notes from Granola, then compile key takeaways and action items into a single debrief doc.",
    trustLevel: "needs-auth",
    trustLabel: "Calendar · Granola sign in",
    icon: "📄",
    category: "email",
    roles: ["vc"],
    apps: ["Google Calendar", "Granola", "Google Docs"],
  },
  {
    id: "vc-3",
    title: "Surface warm intros from my network for a deal",
    description: "Look up the founders on LinkedIn, check mutual connections, then search Gmail and Salesforce for anyone I've spoken with who could intro.",
    trustLevel: "needs-auth",
    trustLabel: "LinkedIn · Gmail sign in",
    icon: "📊",
    category: "crm",
    roles: ["vc"],
    apps: ["LinkedIn", "Gmail", "Salesforce"],
  },
  // ── Sales ──
  {
    id: "sales-1",
    title: "Prep a prospect brief before my next call",
    description: "Pull the contact's LinkedIn, check their company on Crunchbase, scan recent news, then update talking points in my HubSpot deal notes.",
    trustLevel: "needs-auth",
    trustLabel: "LinkedIn · HubSpot sign in",
    icon: "🔍",
    category: "research",
    roles: ["sales"],
    apps: ["LinkedIn", "Crunchbase", "HubSpot"],
  },
  {
    id: "sales-2",
    title: "Update my pipeline from this week's emails",
    description: "Scan Gmail for replies from prospects, update deal stages and next steps in Salesforce, then flag stale deals that need follow-up.",
    trustLevel: "needs-auth",
    trustLabel: "Gmail · Salesforce sign in",
    icon: "📊",
    category: "crm",
    roles: ["sales"],
    apps: ["Gmail", "Salesforce"],
  },
  {
    id: "sales-3",
    title: "Find lookalike leads from my best customers",
    description: "Pull firmographics from my top accounts in Salesforce, then search LinkedIn for similar companies and save matches to a Google Sheet.",
    trustLevel: "needs-auth",
    trustLabel: "Salesforce · LinkedIn sign in",
    icon: "📋",
    category: "research",
    roles: ["sales"],
    apps: ["Salesforce", "LinkedIn", "Google Sheets"],
  },
  // ── Marketing ──
  {
    id: "mkt-1",
    title: "Turn this week's blog posts into social content",
    description: "Read published blog posts on your site, then draft LinkedIn and X posts for each — with different hooks per platform.",
    trustLevel: "needs-auth",
    trustLabel: "LinkedIn · X sign in",
    icon: "📧",
    category: "email",
    roles: ["marketing"],
    apps: ["LinkedIn", "X", "Company Blog"],
  },
  {
    id: "mkt-2",
    title: "Build a competitive intel report",
    description: "Scan competitor websites, Product Hunt, and G2 reviews. Pull their latest LinkedIn posts and compile changes in positioning or pricing into a Google Doc.",
    trustLevel: "low",
    trustLabel: "No sign in required",
    icon: "🔍",
    category: "research",
    roles: ["marketing"],
    apps: ["Product Hunt", "G2", "LinkedIn", "Google Docs"],
  },
  {
    id: "mkt-3",
    title: "Pull campaign metrics and build a weekly report",
    description: "Open Google Analytics, LinkedIn Campaign Manager, and Mailchimp. Collect engagement numbers and compile them into a performance summary in Google Sheets.",
    trustLevel: "needs-auth",
    trustLabel: "Google · LinkedIn sign in",
    icon: "📊",
    category: "crm",
    roles: ["marketing"],
    apps: ["Google Analytics", "LinkedIn", "Mailchimp", "Google Sheets"],
  },
  // ── Founder ──
  {
    id: "fnd-1",
    title: "Prep for today's meetings using my calendar",
    description: "Check Google Calendar, look up each attendee on LinkedIn, pull their company from Crunchbase, and create a brief with context and talking points.",
    trustLevel: "needs-auth",
    trustLabel: "Calendar · LinkedIn sign in",
    icon: "📊",
    category: "crm",
    roles: ["founder"],
    apps: ["Google Calendar", "LinkedIn", "Crunchbase"],
  },
  {
    id: "fnd-2",
    title: "Research investors for my next fundraise",
    description: "Search Crunchbase for active investors in my space, pull their LinkedIn profiles and recent X posts to gauge thesis fit, then rank by relevance.",
    trustLevel: "low",
    trustLabel: "No sign in required",
    icon: "🔍",
    category: "research",
    roles: ["founder"],
    apps: ["Crunchbase", "LinkedIn", "X"],
  },
  {
    id: "fnd-3",
    title: "Draft and send investor update from my metrics",
    description: "Pull key numbers from Google Sheets, check milestones in Linear, then draft a monthly investor update email in Gmail.",
    trustLevel: "needs-auth",
    trustLabel: "Gmail · Google Sheets sign in",
    icon: "📧",
    category: "email",
    roles: ["founder"],
    apps: ["Google Sheets", "Linear", "Gmail"],
  },
  // ── General / cross-role greatest hits ──
  {
    id: "gen-1",
    title: "Prep for today's meetings using my calendar",
    description: "Check Google Calendar, look up each attendee on LinkedIn, pull relevant context from the web, and create a brief with talking points for each meeting.",
    trustLevel: "needs-auth",
    trustLabel: "Calendar · LinkedIn sign in",
    icon: "📊",
    category: "crm",
    apps: ["Google Calendar", "LinkedIn"],
  },
  {
    id: "gen-2",
    title: "Research a person or company across the web",
    description: "Pull their LinkedIn, company website, Crunchbase, and recent X posts. Compile a dossier with background, news, and key facts.",
    trustLevel: "low",
    trustLabel: "No sign in required",
    icon: "🔍",
    category: "research",
    apps: ["LinkedIn", "Crunchbase", "X"],
  },
  {
    id: "gen-3",
    title: "Compile a meeting debrief from today's calendar",
    description: "Check my calendar for today's meetings, pull notes and context from Granola, then compile key takeaways and action items into a debrief doc.",
    trustLevel: "needs-auth",
    trustLabel: "Calendar · Granola sign in",
    icon: "📄",
    category: "email",
    apps: ["Google Calendar", "Granola", "Google Docs"],
  },
];

// ===== First-Run Experience =====

export interface FirstRunSequence {
  intro: string;
  subtask: string;
  integrations: string[];
  steps: RunningStep[];
  resultTitle: string;
  resultSummary: string;
  artifact: ResultArtifact;
}

export const firstRunSequences: Record<string, FirstRunSequence> = {
  research: {
    intro: "On it — I'll research this now. Let me fire up a browser and start pulling sources.",
    subtask: "Researching founder background",
    integrations: ["LinkedIn", "Crunchbase", "X"],
    steps: [
      { timestamp: "0:02", label: "Opened Chrome and navigated to LinkedIn", done: true },
      { timestamp: "0:03", label: "Detected sign-in required", done: true },
      { timestamp: "0:04", label: "Searching background on LinkedIn and Crunchbase", done: true },
      { timestamp: "0:10", label: "Pulled founder work history and education", done: true },
      { timestamp: "0:15", label: "Extracted mutual connections and endorsements", done: true },
      { timestamp: "0:20", label: "Pulling company data and funding history", done: true },
      { timestamp: "0:24", label: "Reviewed recent posts and activity on X", done: true },
      { timestamp: "0:28", label: "Compiling findings into a summary...", done: false },
    ],
    resultTitle: "Research Summary",
    resultSummary: "I've compiled a comprehensive summary with background, key data points, and relevant sources. You can review the full document or open it in your workspace.",
    artifact: {
      format: "document",
      title: "Founder Research — Daniel Park",
      subtitle: "Google Docs · 6 sources",
      icon: "📄",
      url: "docs.google.com/founder-research-daniel-park",
    },
  },
  crm: {
    intro: "Sure — I'll check the data and put together an update for you.",
    subtask: "Checking CRM records",
    integrations: ["Salesforce", "Calendar"],
    steps: [
      { timestamp: "0:02", label: "Opened Salesforce and navigated to pipeline view", done: true },
      { timestamp: "0:06", label: "Pulling active deal records and stages", done: true },
      { timestamp: "0:12", label: "Cross-referencing calendar for recent LP touchpoints", done: true },
      { timestamp: "0:18", label: "Analyzing activity patterns and gaps", done: true },
      { timestamp: "0:22", label: "Flagging stale deals with no activity in 30+ days", done: true },
      { timestamp: "0:25", label: "Preparing actionable recommendations...", done: false },
    ],
    resultTitle: "CRM Analysis",
    resultSummary: "I've reviewed your CRM records and identified actionable items. Here's a summary of what needs attention along with suggested next steps.",
    artifact: {
      format: "spreadsheet",
      title: "CRM Pipeline Review",
      subtitle: "Google Sheets · 12 records",
      icon: "📊",
      url: "docs.google.com/spreadsheets/crm-pipeline-review",
    },
  },
  email: {
    intro: "On it — I'll pull notes from today's meetings and put together a debrief.",
    subtask: "Compiling meeting debrief",
    integrations: ["Granola", "Calendar", "Google Docs"],
    steps: [
      { timestamp: "0:02", label: "Opened Google Calendar to find today's meetings", done: true },
      { timestamp: "0:06", label: "Found 3 meetings with attached Granola links", done: true },
      { timestamp: "0:10", label: "Pulling notes and action items from Granola", done: true },
      { timestamp: "0:16", label: "Extracting key decisions and follow-ups per meeting", done: true },
      { timestamp: "0:22", label: "Matching attendees to Salesforce contacts", done: true },
      { timestamp: "0:26", label: "Writing debrief doc in Google Docs...", done: false },
    ],
    resultTitle: "Meeting Debrief Ready",
    resultSummary: "I've compiled today's meetings into a single debrief with key takeaways, decisions made, and follow-up action items for each conversation.",
    artifact: {
      format: "document",
      title: "Daily Meeting Debrief",
      subtitle: "Google Docs · 3 meetings",
      icon: "📄",
      url: "docs.google.com/daily-meeting-debrief",
    },
  },
};

// ===== Follow-up task data (triggered from first-run result) =====

export interface FollowUpSequence {
  agentMessage: string;
  subtask: string;
  integrations: string[];
  steps: { label: string; done: boolean }[];
  resultTitle: string;
  resultSummary: string;
  artifact: ResultArtifact;
}

export const followUpSequences: Record<string, FollowUpSequence> = {
  research: {
    agentMessage: "On it — searching LinkedIn for these founders now.",
    subtask: "Looking up founders on LinkedIn",
    integrations: ["LinkedIn"],
    steps: [
      { label: "Searched LinkedIn for founder profiles", done: true },
      { label: "Pulled recent posts and engagement data", done: true },
      { label: "Extracted mutual connections", done: true },
      { label: "Compiled activity summary", done: true },
    ],
    resultTitle: "LinkedIn Activity Summary",
    resultSummary: "Found profiles for all 3 founders. Pulled recent posts, mutual connections, and engagement patterns. Two are actively posting about fundraising.",
    artifact: {
      format: "spreadsheet",
      title: "Founder LinkedIn Profiles",
      subtitle: "Google Sheets · 3 profiles, 24 data points",
      icon: "📊",
      url: "docs.google.com/spreadsheets/founder-linkedin",
    },
  },
  crm: {
    agentMessage: "Checking PitchBook for funding details now.",
    subtask: "Cross-referencing with PitchBook",
    integrations: ["PitchBook"],
    steps: [
      { label: "Opened PitchBook and searched deal records", done: true },
      { label: "Matched 8 of 12 records to profiles", done: true },
      { label: "Pulled recent funding rounds and valuations", done: true },
      { label: "Compiled funding analysis", done: true },
    ],
    resultTitle: "PitchBook Funding Analysis",
    resultSummary: "Matched 8 of 12 records to PitchBook profiles. Found 3 with recent funding rounds and 2 with valuation changes in the last quarter.",
    artifact: {
      format: "spreadsheet",
      title: "PitchBook Funding Cross-Reference",
      subtitle: "Google Sheets · 8 matches, funding data",
      icon: "📊",
      url: "docs.google.com/spreadsheets/pitchbook-analysis",
    },
  },
  email: {
    agentMessage: "Sharing the debrief with attendees now.",
    subtask: "Sending debrief via Google Docs",
    integrations: ["Google Docs", "Gmail"],
    steps: [
      { label: "Opened meeting debrief in Google Docs", done: true },
      { label: "Tagged action items for each attendee", done: true },
      { label: "Shared doc with 8 attendees via Gmail", done: true },
      { label: "Sent notification emails", done: true },
    ],
    resultTitle: "Debrief Shared",
    resultSummary: "Shared the meeting debrief doc with all 3 meeting attendee groups. Each received a comment tagging their specific action items.",
    artifact: {
      format: "document",
      title: "Shared Meeting Debrief",
      subtitle: "Google Docs · shared with 8 attendees",
      icon: "📄",
      url: "docs.google.com/daily-meeting-debrief",
    },
  },
};

// ===== Teach Mode Flow =====

export type TeachPhase = "idle" | "suggest" | "recording" | "complete";

export const TEACH_TASK_NAME = "Forward Asana weekly digest to Slack";

export const teachRecordedSteps = [
  "Open Asana and navigate to Weekly Digest page",
  "Select 'Engineering' and 'Design' sections",
  "Copy formatted digest content",
  "Open Slack and go to #updates channel",
  "Paste and format as a message",
  "Send the message",
];

// ===== Gated Trial =====

export const VALID_INVITE_CODES = ["SIMULAR2026", "EARLY100", "LAUNCH", "BETA", "VIP"];
export const SEATS_TOTAL = 1000;
export const SEATS_REMAINING_INIT = 214;

// ===== Messy Task Demo =====

/** The pause-point index where the cascade waits for user intervention */
export const MESSY_TASK_PAUSE_INDEX = 7;

// ── Rich Multi-Turn Scenario Types ──

export interface PillOption {
  label: string;
  value: string;
  /** Text shown in the user chat bubble (defaults to label) */
  resultText?: string;
  /** Ends the task early */
  isCancel?: boolean;
}

export type InterventionTiming = "pre" | "mid" | "post";

export interface Intervention {
  id: string;
  timing: InterventionTiming;
  agentMessage: string;
  pills: PillOption[];
  /** "mid" only — cascade pauses after this many steps have been added */
  pauseAfterStep?: number;
  /** Agent acknowledgment after user picks. String for universal, Record for per-pill. */
  agentAck?: string | Record<string, string>;
  /** Show amber struggling spinner during this pause */
  isStruggling?: boolean;
  /** Placeholder for the text input during this intervention */
  inputPlaceholder?: string;
}

export interface MessyScenario {
  taskLabel: string;
  userMessage: string;
  agentOpener: string;
  subtaskLabel: string;
  steps: RunningStep[];
  interventions: Intervention[];
  result: {
    title: string;
    summary: string;
    artifact: ResultArtifact;
  };
}

export const messyTaskSteps: RunningStep[] = [
  // Group A: First attempts at getting the post permalink
  { timestamp: "0:01", label: "Clicking Fireworks AI post timestamp to get permalink", type: "action", status: "failed", groupId: "get-link", errorDetail: "Could not resolve ref \"e685\" — element not interactive", done: true },
  { timestamp: "0:04", label: "Taking fresh snapshot to find the post link", type: "action", groupId: "get-link", done: true },
  { timestamp: "0:05", label: "I can see the comment is already posted on the Fireworks AI post. Let me try clicking the timestamp link again.", type: "thinking", groupId: "get-link", done: true },
  { timestamp: "0:23", label: "Clicking Fireworks AI post timestamp for direct link", type: "action", status: "failed", groupId: "get-link", errorDetail: "Could not resolve ref \"e685\" even after fresh snapshot", done: true },
  { timestamp: "0:28", label: "Using the three-dot menu to copy post link", type: "action", groupId: "get-link", done: true },
  { timestamp: "0:30", label: "I can see the comments section is expanded. Let me try clicking the post link from the expanded view.", type: "thinking", groupId: "get-link", done: true },
  { timestamp: "0:39", label: "Clicking Fireworks AI post link to get permalink", type: "action", status: "failed", groupId: "get-link", errorDetail: "Could not resolve ref \"e685\" even after fresh snapshot", done: true, groupSummary: "Tried to get post permalink (3 failed attempts)", attemptCount: 7 },
  // --- PAUSE POINT: user intervention ---
  { timestamp: "0:42", label: "Taking screenshot to visually locate the post", type: "action", groupId: "get-link-2", done: true },
  { timestamp: "0:43", label: "I can see the Fireworks AI post clearly now. Let me click on the \"9h\" timestamp to navigate to the direct post link.", type: "thinking", groupId: "get-link-2", done: true },
  { timestamp: "0:58", label: "Clicking on the 9h timestamp to get direct post link", type: "action", groupId: "get-link-2", done: true },
  { timestamp: "1:08", label: "Trying to copy link via three-dot menu on Fireworks post", type: "action", groupId: "get-link-2", done: true },
  { timestamp: "1:12", label: "I can see the Fireworks AI post clearly. Let me click on the \"9h\" timestamp to get the direct link.", type: "thinking", groupId: "get-link-2", done: true },
  { timestamp: "1:28", label: "Clicking on 9h timestamp to get direct post URL", type: "action", groupId: "get-link-2", done: true },
  { timestamp: "1:37", label: "Using three-dot menu to copy link to post", type: "action", groupId: "get-link-2", done: true },
  { timestamp: "1:43", label: "Getting the Fireworks AI post permalink via three-dot menu", type: "action", groupId: "get-link-2", done: true },
  { timestamp: "1:46", label: "I can see the three-dot menu is already open on the Fireworks AI post with the \"Copy link to post\" option visible.", type: "thinking", groupId: "get-link-2", done: true },
  { timestamp: "2:01", label: "Clicked \"Copy link to post\" for Fireworks AI post", type: "action", status: "done", groupId: "get-link-2", groupResolved: true, groupSummary: "Got post link via three-dot menu", attemptCount: 9, done: true },
];

export const messyTaskResult = {
  title: "Fireworks AI Post Link Copied",
  summary: "Successfully copied the permalink for the Fireworks AI post. The link is now in your clipboard, ready to share.",
  artifact: {
    format: "link" as const,
    title: "Fireworks AI Post Link",
    subtitle: "linkedin.com · permalink copied",
    icon: "🔗",
    url: "linkedin.com/posts/fireworks-ai_launch",
  },
};

/** Collapse step groups into a smart summary — hides thinking, merges retries */
export function deriveSmartSummary(steps: RunningStep[]): RunningStep[] {
  const result: RunningStep[] = [];
  const seenGroups = new Set<string>();

  for (const step of steps) {
    // Always show user messages
    if (step.type === "user") {
      result.push(step);
      continue;
    }
    // Skip thinking steps in summary
    if (step.type === "thinking") continue;

    // Group handling
    if (step.groupId) {
      if (seenGroups.has(step.groupId)) continue; // already rendered this group
      seenGroups.add(step.groupId);

      // Find the resolved step for this group, or show current status
      const groupSteps = steps.filter((s) => s.groupId === step.groupId);
      const resolved = groupSteps.find((s) => s.groupResolved);
      const failedCount = groupSteps.filter((s) => s.status === "failed").length;

      if (resolved) {
        result.push({
          ...resolved,
          label: resolved.groupSummary || resolved.label,
        });
      } else {
        // Group still in progress — show first step with attempt count
        const summary = step.groupSummary || step.label;
        result.push({
          ...step,
          label: failedCount > 0 ? `${summary}` : step.label,
          status: failedCount > 0 ? "failed" : step.status,
        });
      }
      continue;
    }

    // Ungrouped action steps pass through
    result.push(step);
  }

  return result;
}

// ── Rich Multi-Turn Scenario: Fireworks AI Funding ──

export const fireworksScenarioSteps: RunningStep[] = [
  // === CHUNK 1: Research phase (before struggle intervention) ===
  { timestamp: "0:03", label: "Searching Google for Fireworks AI funding news", type: "action", groupId: "initial-research", done: true },
  { timestamp: "0:08", label: "Found 3 results — opening TechCrunch, VentureBeat, Crunchbase", type: "action", groupId: "initial-research", done: true },
  { timestamp: "0:14", label: "Opening TechCrunch article on Fireworks AI Series B", type: "action", groupId: "initial-research", done: true },
  { timestamp: "0:19", label: "Extracting details from TechCrunch article", type: "action", status: "failed", groupId: "initial-research", errorDetail: "Paywall detected — article content not accessible", done: true, groupSummary: "Searched for funding news (TechCrunch paywalled)", attemptCount: 4, groupResolved: true },

  // --- PAUSE: struggle intervention (pauseAfterStep = 4) ---

  // === CHUNK 2: After struggle resolved — alternate sources + drafting ===
  { timestamp: "0:25", label: "Trying VentureBeat coverage instead", type: "action", groupId: "alt-sources", done: true },
  { timestamp: "0:31", label: "Pulling funding details from VentureBeat article", type: "action", groupId: "alt-sources", done: true },
  { timestamp: "0:38", label: "Pulling round size and valuation from Crunchbase", type: "action", groupId: "alt-sources", done: true, groupSummary: "Gathered details from VentureBeat + Crunchbase", attemptCount: 3, groupResolved: true },
  { timestamp: "0:42", label: "Cross-referencing investor names with LinkedIn announcement", type: "action", done: true },
  { timestamp: "0:48", label: "I have enough data — $150M Series B led by Benchmark at $1.5B valuation. Drafting summary now.", type: "thinking", done: true },
  { timestamp: "0:55", label: "Drafting executive summary of Fireworks AI funding round", type: "action", groupId: "drafting", done: true },
  { timestamp: "1:08", label: "Adding competitive landscape and product context", type: "action", groupId: "drafting", done: true },
  { timestamp: "1:15", label: "Summary draft complete — reviewing for accuracy", type: "action", groupId: "drafting", done: true, groupSummary: "Drafted and reviewed funding summary", attemptCount: 3, groupResolved: true },
];

export const fireworksScenario: MessyScenario = {
  taskLabel: "Summarize Fireworks AI funding round",
  userMessage: "Summarize the latest Fireworks AI funding round and share with the team",
  agentOpener: "On it — I'll research the Fireworks AI funding round, draft a summary, and share it with the team.",
  subtaskLabel: "Researching Fireworks AI funding",

  steps: fireworksScenarioSteps,

  interventions: [
    // Beat 1: CLARIFICATION (pre-task)
    {
      id: "clarify-topic",
      timing: "pre",
      agentMessage: "I see a few recent Fireworks AI announcements. Which should I focus on?",
      pills: [
        { label: "The Series B funding", value: "series-b", resultText: "Focus on the Series B funding round" },
        { label: "The new model launch", value: "model-launch", resultText: "Focus on their new model launch" },
        { label: "Both — full update", value: "both", resultText: "Cover both — give me the full update" },
      ],
      agentAck: {
        "series-b": "Got it — I'll focus on the Series B details.",
        "model-launch": "Got it — I'll dig into the new model launch.",
        "both": "Got it — I'll cover both the funding round and model launch.",
      },
      inputPlaceholder: "Or tell me what to focus on...",
    },

    // Beat 2: STRUGGLE (mid-task, after 5 steps)
    {
      id: "paywall-struggle",
      timing: "mid",
      pauseAfterStep: 4,
      agentMessage: "The TechCrunch article has the most detail but it's behind a paywall. Want me to work with what I have from other sources?",
      pills: [
        { label: "Use what you have", value: "use-existing", resultText: "Use what you have from other sources" },
        { label: "Skip it, just summarize", value: "skip-summarize", resultText: "Skip TechCrunch — just summarize what you found" },
        { label: "Let me paste the key details", value: "paste-details", resultText: "Hold on, let me paste the key details" },
      ],
      agentAck: "Good call — let me pull what I can from VentureBeat and Crunchbase.",
      isStruggling: true,
      inputPlaceholder: "Or suggest another approach...",
    },

    // Beat 3: CONFIRMATION (post-task)
    {
      id: "share-confirmation",
      timing: "post",
      agentMessage: "Summary's ready. Where should I share it?",
      pills: [
        { label: "Post to #product-updates", value: "slack", resultText: "Post it to #product-updates" },
        { label: "Send via email", value: "email", resultText: "Send it via email to the team" },
        { label: "Just save as draft", value: "draft", resultText: "Just save it as a draft for now" },
      ],
      agentAck: {
        "slack": "Done — posted to #product-updates.",
        "email": "Done — sent to the team via email.",
        "draft": "Saved as a draft. You can share it whenever you're ready.",
      },
    },
  ],

  result: {
    title: "Fireworks AI Funding Summary",
    summary: "Fireworks AI raised $150M in Series B funding led by Benchmark, valuing the company at $1.5B. The round will fund expansion of their inference optimization platform.",
    artifact: {
      format: "document",
      title: "Fireworks AI — Series B Summary",
      subtitle: "Executive briefing · 4 paragraphs",
      icon: "📄",
    },
  },
};
