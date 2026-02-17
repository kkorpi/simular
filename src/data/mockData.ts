export type ViewState = "zero-state" | "task-hover" | "result-detail";

export interface TaskStep {
  label: string;
  done: boolean;
}

export interface RunHistoryEntry {
  date: string;
  duration: string;
  summary: string;
}

export type ResultFormat = "text" | "briefing" | "document" | "spreadsheet" | "code" | "link";

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
}

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
  icon: string;
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
    name: "Draft LP follow-up emails from today's meetings",
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
      result: "3 thank-you emails drafted. Personalized for GIC, Tiger Global, and Wellington. Each includes meeting highlights and next steps. Ready for review in Gmail drafts.",
      artifact: {
        format: "document",
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
  { icon: "\uD83C\uDF10", title: "Salesforce - Sequoia Scouts LP profile", url: "salesforce.com/lp/sequoia-scouts" },
  { icon: "\uD83D\uDCC5", title: "Calendar - Last 4 meeting touchpoints", url: "calendar.google.com" },
  { icon: "\uD83D\uDCDD", title: "Granola - Recent meeting notes", url: "granola.ai/notes" },
  { icon: "\uD83D\uDCE7", title: "Email - Recent correspondence thread", url: "gmail.com/threads/sequoia" },
  { icon: "\uD83D\uDCF0", title: "Sequoia Scouts - Recent portfolio announcements", url: "sequoiacap.com/scouts" },
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

export interface RunningStep {
  timestamp: string;
  label: string;
  site?: string;
  trustSignal?: string;
  done: boolean;
  userAction?: boolean;
}

export const runningTaskSteps: RunningStep[] = [
  { timestamp: "0:01", label: "Opened Chrome", done: true },
  { timestamp: "0:04", label: "Navigated to linkedin.com/in/daniel-park", site: "linkedin.com", trustSignal: "Secure connection", done: true },
  { timestamp: "0:12", label: "Pulled founder background, education, and experience", done: true },
  { timestamp: "0:18", label: "Checked notable followers and mutual connections", done: true },
  { timestamp: "0:25", label: "Opened x.com/danielpark_ai for recent posts", site: "x.com", trustSignal: "Secure connection", done: true },
  { timestamp: "0:32", label: "Reviewed last 10 posts for product insights", done: true },
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
  { label: "Checking company website and product", status: "active" },
  { label: "Mapping to Salesforce deal record", status: "pending" },
];

export const linkedinLoginSteps: RunningStep[] = [
  { timestamp: "0:01", label: "Opened Chrome", done: true },
  { timestamp: "0:03", label: "Navigated to linkedin.com/login", site: "linkedin.com", trustSignal: "Secure connection", done: true },
  { timestamp: "0:09", label: "Signed in to LinkedIn", done: true, userAction: true },
  { timestamp: "0:12", label: "Pulling profile viewer list...", done: false },
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
  { timestamp: "0:03", label: "Navigated to linkedin.com/login", site: "linkedin.com", trustSignal: "Secure connection", done: true },
  { timestamp: "0:09", label: "Signed in to LinkedIn", done: true, userAction: true },
  { timestamp: "0:14", label: "Found 3 matching profiles for Daniel Park", done: true },
  { timestamp: "0:16", label: "User selected Daniel Park, CEO at Luma AI", done: true, userAction: true },
  { timestamp: "0:18", label: "Pulling profile viewer list...", done: false },
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
}

export const starterTasks: StarterTask[] = [
  {
    id: "starter-1",
    title: "Research a founder and build a one-pager",
    description: "Pull LinkedIn, X, Crunchbase, and press. Compile background, company overview, and thesis fit.",
    trustLevel: "low",
    trustLabel: "Ready to go",
    icon: "\uD83D\uDD0D",
    category: "research",
  },
  {
    id: "starter-2",
    title: "Compile today's deal sourcing digest",
    description: "Scan funding news, YC batches, and X for new deals matching your investment themes.",
    trustLevel: "low",
    trustLabel: "Ready to go",
    icon: "\uD83D\uDCCB",
    category: "research",
  },
  {
    id: "starter-3",
    title: "Check LP touchpoints and suggest outreach",
    description: "Review Salesforce, calendar, and email to find overdue LP relationships and suggest actions.",
    trustLevel: "needs-auth",
    trustLabel: "Salesforce login",
    icon: "\uD83D\uDCCA",
    category: "crm",
  },
  {
    id: "starter-4",
    title: "Draft follow-up emails from today's meetings",
    description: "Pull Granola notes, extract key points, draft personalized follow-ups for each meeting.",
    trustLevel: "needs-auth",
    trustLabel: "Gmail login",
    icon: "\uD83D\uDCE7",
    category: "email",
  },
];
