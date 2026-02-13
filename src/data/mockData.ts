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
  subtitle?: string;        // e.g. "Google Docs", "47 rows x 6 cols", "Python"
  icon?: string;             // emoji or identifier
  url?: string;              // external link if applicable
  language?: string;         // for code results
  preview?: string;          // short inline preview text
  fullContent?: string;      // expandable full content
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
    name: "Check Salesforce pipeline",
    status: "running",
    subtitle: "Running now",
    time: "1:42",
    thumbEmoji: "\uD83D\uDCCA",
    thumbLabel: "Active - using screen now",
    thumbSite: "salesforce.com/pipeline",
    thumbStatus: "Salesforce\nPipeline view",
    detail: {
      description: "Reviewing Q1 pipeline data and extracting updates from yesterday's calls.",
      duration: "1:42 elapsed",
      steps: [
        { label: "Logged into Salesforce", done: true },
        { label: "Navigated to pipeline view", done: true },
        { label: "Filtering by last 24 hours", done: true },
        { label: "Extracting deal updates", done: false },
        { label: "Compiling summary", done: false },
      ],
    },
  },
  {
    id: "2",
    name: "Update CRM contacts from CSV",
    status: "queued",
    subtitle: "Queued",
    time: "queue",
    thumbEmoji: "\u23F3",
    thumbLabel: "Queued - will start next",
    thumbSite: "waiting for current task",
    thumbStatus: "Waiting\nfor screen",
    detail: {
      description: "Import 47 new contacts from the uploaded CSV into Salesforce. Will match against existing records and flag duplicates.",
      queuePosition: 1,
    },
  },
];

export const recurringTasks: Task[] = [
  {
    id: "3",
    name: "Daily competitor scan",
    status: "recurring",
    subtitle: "Every day - 7am",
    time: "7:00a",
    thumbEmoji: "\uD83D\uDD0D",
    thumbLabel: "Last run - today 7:02am",
    thumbSite: "crunchbase.com/search",
    thumbStatus: "Crunchbase\nCompetitor search",
    detail: {
      description: "Scans Crunchbase, TechCrunch, and LinkedIn for new funding rounds, product launches, and key hires at competitors.",
      schedule: "Every day at 7:00am",
      lastRun: "Today 7:02am",
      nextRun: "Tomorrow 7:00am",
      result: "Found 2 new funded competitors. Vanta raised $40M Series C. Drata acquired a SOC2 automation startup.",
      fullResult: "Vanta raised $40M Series C led by Sequoia. They\u2019re expanding into AI-powered compliance automation, which overlaps with your GRC module. Headcount grew 30% in 6 months.\n\nDrata acquired ComplianceBot, a SOC2 automation startup (terms undisclosed). This gives them automated evidence collection, which you\u2019ve been building internally.\n\nNo other significant competitor moves detected across 14 tracked companies.",
      artifact: {
        format: "document",
        title: "Competitor Intel - Feb 13",
        subtitle: "Google Docs",
        icon: "\uD83D\uDCC4",
        url: "docs.google.com/competitor-intel-feb13",
      },
      runHistory: [
        { date: "Today 7:02am", duration: "2m 34s", summary: "2 new funded competitors found (Vanta Series C, Drata acquisition)" },
        { date: "Yesterday 7:01am", duration: "2m 18s", summary: "No new funding. 1 key hire: Competitor X hired ex-Google PM." },
        { date: "Feb 11 7:00am", duration: "2m 45s", summary: "1 new funded competitor. Lattice raised $25M Series D." },
        { date: "Feb 10 7:01am", duration: "2m 12s", summary: "No significant changes detected." },
        { date: "Feb 9 7:00am", duration: "2m 28s", summary: "2 product launches detected from competitors." },
      ],
    },
  },
  {
    id: "4",
    name: "Meeting briefing prep",
    status: "recurring",
    subtitle: "Before each meeting",
    time: "auto",
    thumbEmoji: "\uD83D\uDCCB",
    thumbLabel: "Last run - Acme Corp briefing",
    thumbSite: "docs.google.com/briefing",
    thumbStatus: "Google Docs\nMeeting prep",
    detail: {
      description: "Automatically researches attendees and companies before each calendar meeting. Compiles a briefing doc with company info, key people, and talking points.",
      schedule: "30 min before each meeting",
      lastRun: "Today 9:14am (Acme Corp)",
      nextRun: "Today 1:30pm (Board sync)",
      result: "Acme Corp briefing created with 8 sources. Company overview, 3 key people, and 3 talking points.",
      resultType: "briefing",
      artifact: {
        format: "briefing",
        title: "Acme Corp Meeting Briefing",
        subtitle: "8 sources, 3 key people",
        icon: "\uD83D\uDCCB",
      },
      runHistory: [
        { date: "Today 9:14am", duration: "3m 12s", summary: "Acme Corp briefing - 8 sources, 3 key people, 3 talking points" },
        { date: "Yesterday 1:28pm", duration: "2m 48s", summary: "Investor sync briefing - portfolio update, 4 sources" },
        { date: "Yesterday 9:44am", duration: "3m 05s", summary: "CloudTech demo briefing - 6 sources, 2 key people" },
        { date: "Feb 11 2:28pm", duration: "2m 33s", summary: "Team standup - no external attendees, skipped" },
      ],
    },
  },
  {
    id: "5",
    name: "LinkedIn new followers",
    status: "recurring",
    subtitle: "Every day - 9am",
    time: "9:00a",
    thumbEmoji: "\uD83D\uDC64",
    thumbLabel: "Last run - yesterday 9:00am",
    thumbSite: "linkedin.com/notifications",
    thumbStatus: "LinkedIn\nNew followers",
    detail: {
      description: "Checks LinkedIn for new followers and connection requests. Identifies relevant ones based on your ICP and flags high-value connections.",
      schedule: "Every day at 9:00am",
      lastRun: "Yesterday 9:00am",
      nextRun: "Today 9:00am",
      result: "3 new followers yesterday. 1 matched your ICP: VP Engineering at Stripe.",
      fullResult: "ICP Match: Alex Rivera, VP Engineering at Stripe. 12 years in infrastructure, previously at AWS. Connected to 3 people in your network. Recommendation: send a connection request with a note about your API platform.\n\nOther followers: Marketing Manager at a SaaS startup (no ICP match), Recruiter at a staffing agency (no ICP match).",
      artifact: {
        format: "spreadsheet",
        title: "LinkedIn Followers Log",
        subtitle: "12 rows \u00D7 5 cols",
        icon: "\uD83D\uDCCA",
        url: "docs.google.com/spreadsheets/linkedin-followers",
      },
      runHistory: [
        { date: "Yesterday 9:00am", duration: "1m 45s", summary: "3 new followers. 1 ICP match: VP Engineering at Stripe." },
        { date: "Feb 11 9:01am", duration: "1m 32s", summary: "5 new followers. No ICP matches." },
        { date: "Feb 10 9:00am", duration: "1m 48s", summary: "2 new followers. 1 ICP match: Head of Product at Datadog." },
        { date: "Feb 9 9:01am", duration: "1m 38s", summary: "1 new follower. No ICP matches." },
      ],
    },
  },
];

export const completedTasks: Task[] = [
  {
    id: "6",
    name: "Acme Corp briefing",
    status: "completed",
    subtitle: "Completed",
    time: "9:14a",
    thumbEmoji: "\uD83D\uDCCB",
    thumbLabel: "Completed - final state",
    thumbSite: "docs.google.com/acme-briefing",
    thumbStatus: "Google Docs\nFinal briefing",
    detail: {
      description: "Researched Acme Corp across 8 sources and compiled a meeting briefing with company overview, key people, and talking points.",
      duration: "3m 12s",
      result: "Briefing complete. Acme Corp: Series B ($42M), supply chain optimization for mid-market retailers. CEO Sarah Chen (ex-Shopify). Key opportunity: integration partnership via Mike Torres.",
      resultType: "briefing",
      artifact: {
        format: "briefing",
        title: "Acme Corp Meeting Briefing",
        subtitle: "8 sources, 3 key people",
        icon: "\uD83D\uDCCB",
      },
      steps: [
        { label: "Searched Crunchbase for company info", done: true },
        { label: "Pulled LinkedIn profiles for attendees", done: true },
        { label: "Checked recent news coverage", done: true },
        { label: "Compiled briefing document", done: true },
        { label: "Saved to Google Docs", done: true },
      ],
    },
  },
  {
    id: "7",
    name: "Export Q1 pipeline to spreadsheet",
    status: "completed",
    subtitle: "Completed",
    time: "8:32a",
    thumbEmoji: "\uD83D\uDCCA",
    thumbLabel: "Completed - final state",
    thumbSite: "docs.google.com/spreadsheets/q1-pipeline",
    thumbStatus: "Google Sheets\nPipeline export",
    detail: {
      description: "Extracted all Q1 pipeline data from Salesforce, cleaned duplicates, and organized into a spreadsheet with deal stages, values, and close dates.",
      duration: "4m 48s",
      result: "Exported 83 deals totaling $2.4M. 12 in negotiation, 28 in discovery, 43 in qualification. Flagged 5 stale deals with no activity in 30+ days.",
      artifact: {
        format: "spreadsheet",
        title: "Q1 Pipeline Export",
        subtitle: "83 rows \u00D7 12 cols \u2022 Google Sheets",
        icon: "\uD83D\uDCCA",
        url: "docs.google.com/spreadsheets/q1-pipeline",
        preview: "Deal Name | Stage | Value | Close Date | Owner\nAcme Corp | Negotiation | $180K | Mar 15 | Sarah\nBetaCo | Discovery | $95K | Apr 1 | Mike\nGamma Inc | Qualification | $42K | Mar 28 | James\n... 80 more rows",
      },
      steps: [
        { label: "Connected to Salesforce API", done: true },
        { label: "Queried Q1 opportunity data", done: true },
        { label: "Cleaned and deduplicated records", done: true },
        { label: "Created spreadsheet with formatting", done: true },
        { label: "Shared with team", done: true },
      ],
    },
  },
  {
    id: "8",
    name: "Write API integration script",
    status: "completed",
    subtitle: "Completed",
    time: "Yesterday",
    thumbEmoji: "\uD83D\uDCBB",
    thumbLabel: "Completed - final state",
    thumbSite: "github.com/repo/pull/142",
    thumbStatus: "GitHub\nPR #142",
    detail: {
      description: "Wrote a Python script to sync contacts between Salesforce and HubSpot via their REST APIs. Handles rate limiting, pagination, and field mapping.",
      duration: "12m 33s",
      result: "Created sync_contacts.py (142 lines). Handles bidirectional sync with conflict resolution. PR #142 opened with tests passing.",
      artifact: {
        format: "code",
        title: "sync_contacts.py",
        subtitle: "Python \u2022 142 lines",
        icon: "\uD83D\uDCBB",
        language: "python",
        url: "github.com/repo/pull/142",
        preview: "import requests\nfrom datetime import datetime\n\nclass ContactSync:\n    def __init__(self, sf_token, hs_token):\n        self.sf = SalesforceClient(sf_token)\n        self.hs = HubSpotClient(hs_token)\n    \n    def sync(self, direction='bidirectional'):\n        sf_contacts = self.sf.get_contacts(modified_since=self.last_sync)\n        hs_contacts = self.hs.get_contacts(modified_since=self.last_sync)\n        ...",
      },
      steps: [
        { label: "Analyzed Salesforce and HubSpot API docs", done: true },
        { label: "Designed field mapping schema", done: true },
        { label: "Wrote sync logic with conflict resolution", done: true },
        { label: "Added rate limiting and retry logic", done: true },
        { label: "Created unit tests", done: true },
        { label: "Opened pull request", done: true },
      ],
    },
  },
  {
    id: "9",
    name: "Draft partnership proposal",
    status: "completed",
    subtitle: "Completed",
    time: "Yesterday",
    thumbEmoji: "\uD83D\uDCC4",
    thumbLabel: "Completed - final state",
    thumbSite: "docs.google.com/partnership-proposal",
    thumbStatus: "Google Docs\nProposal draft",
    detail: {
      description: "Drafted a partnership proposal document for Acme Corp based on meeting notes, company research, and your product capabilities.",
      duration: "8m 15s",
      result: "3-page proposal covering integration scope, timeline, revenue share model, and next steps. Ready for review.",
      artifact: {
        format: "document",
        title: "Acme Corp Partnership Proposal",
        subtitle: "Google Docs \u2022 3 pages",
        icon: "\uD83D\uDCC4",
        url: "docs.google.com/partnership-proposal",
        preview: "Partnership Proposal: Acme Corp x [Your Company]\n\n1. Executive Summary\nFollowing our productive meeting with Acme Corp, we propose a technical integration partnership focused on supply chain data connectivity...\n\n2. Integration Scope\n\u2022 Real-time inventory sync via REST API\n\u2022 Shared analytics dashboard\n\u2022 Joint customer onboarding flow",
      },
      steps: [
        { label: "Reviewed meeting notes and recording", done: true },
        { label: "Researched Acme Corp's tech stack", done: true },
        { label: "Drafted proposal sections", done: true },
        { label: "Added pricing and timeline", done: true },
        { label: "Saved to Google Docs", done: true },
      ],
    },
  },
  {
    id: "10",
    name: "Find pricing page examples",
    status: "completed",
    subtitle: "Completed",
    time: "Yesterday",
    thumbEmoji: "\uD83D\uDD17",
    thumbLabel: "Completed - final state",
    thumbSite: "notion.so/pricing-research",
    thumbStatus: "Notion\nPricing research",
    detail: {
      description: "Researched pricing pages from 8 competitors and saved screenshots, notes, and links into a Notion page for the design team.",
      duration: "6m 42s",
      result: "Compiled 8 pricing page examples with screenshots and analysis. Key patterns: usage-based tiers, free trial emphasis, enterprise contact-us.",
      artifact: {
        format: "link",
        title: "Pricing Page Research",
        subtitle: "Notion \u2022 8 examples",
        icon: "\uD83D\uDD17",
        url: "notion.so/pricing-research",
      },
      steps: [
        { label: "Identified top 8 competitor pricing pages", done: true },
        { label: "Captured screenshots of each", done: true },
        { label: "Analyzed pricing models and patterns", done: true },
        { label: "Compiled into Notion page", done: true },
      ],
    },
  },
];

export const briefingPeople: Person[] = [
  {
    initials: "SC",
    name: "Sarah Chen",
    role: "CEO - Previously led ops at Shopify",
  },
  {
    initials: "MT",
    name: "Mike Torres",
    role: "Partnerships - Your contact. Posted about integrations this week.",
  },
  {
    initials: "JL",
    name: "James Liu",
    role: "VP Sales - Joined from Salesforce 3 months ago",
  },
];

export const briefingSources: Source[] = [
  { icon: "\uD83C\uDF10", title: "Crunchbase - Acme Corp profile", url: "crunchbase.com/acme-corp" },
  { icon: "\uD83D\uDC65", title: "LinkedIn - Acme Corp page", url: "linkedin.com/company/acme-corp" },
  { icon: "\uD83D\uDC65", title: "LinkedIn - Mike Torres recent posts", url: "linkedin.com/in/mike-torres" },
  { icon: "\uD83D\uDCF0", title: 'TechCrunch - "Acme Corp raises $42M"', url: "techcrunch.com/acme-series-b" },
  { icon: "\uD83D\uDCF0", title: "Business Insider - EMEA expansion", url: "businessinsider.com/acme-emea" },
];

export const briefingOverview = {
  company: "Acme Corp",
  stage: "Series B ($42M raised)",
  focus: "Supply chain optimization for mid-market retailers",
  hq: "San Francisco, CA",
  employees: "~120",
  recent: "Expanded into EMEA, hired VP Sales from Salesforce",
};

export const talkingPoints = [
  {
    title: "Integration opportunity.",
    body: "Mike Torres posted about seeking integration partners this week. This aligns with your platform's API capabilities.",
  },
  {
    title: "EMEA expansion.",
    body: "They recently expanded into EMEA, which could open co-selling opportunities in your European markets.",
  },
  {
    title: "New VP Sales.",
    body: "James Liu joined from Salesforce and may be receptive to your CRM integration pitch given his background.",
  },
];

// ===== Running Task Step Log =====

export interface RunningStep {
  timestamp: string;
  label: string;
  site?: string;
  trustSignal?: string;
  done: boolean;
}

export const runningTaskSteps: RunningStep[] = [
  { timestamp: "0:01", label: "Opened Chrome", done: true },
  { timestamp: "0:03", label: "Navigated to crunchbase.com/acme-corp", site: "crunchbase.com", trustSignal: "Secure connection", done: true },
  { timestamp: "0:08", label: "Read funding history, team, and recent news", done: true },
  { timestamp: "0:12", label: "Opened linkedin.com/company/acme-corp", site: "linkedin.com", trustSignal: "Securely accessed LinkedIn", done: true },
  { timestamp: "0:18", label: "Pulled profiles for 3 meeting attendees", done: true },
  { timestamp: "0:24", label: "Searched techcrunch.com for recent coverage", site: "techcrunch.com", trustSignal: "Secure connection", done: true },
  { timestamp: "0:30", label: "Compiling briefing document...", done: false },
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
    title: "Research a company and give me a one-pager",
    description: "Web research, summarized into a briefing with key people, funding, and news.",
    trustLevel: "low",
    trustLabel: "Ready to go",
    icon: "\uD83D\uDD0D",
    category: "research",
  },
  {
    id: "starter-2",
    title: "Check today's AI news and summarize the highlights",
    description: "Scans multiple sources, compiles a 2-minute summary.",
    trustLevel: "low",
    trustLabel: "Ready to go",
    icon: "\uD83D\uDCCB",
    category: "research",
  },
  {
    id: "starter-3",
    title: "Find new LinkedIn followers and pull their profiles",
    description: "Identifies new connections, builds a contact summary.",
    trustLevel: "needs-auth",
    trustLabel: "LinkedIn login",
    icon: "\uD83D\uDCBC",
    category: "social",
  },
  {
    id: "starter-4",
    title: "Summarize unread emails and flag what needs a reply",
    description: "Reads your inbox, categorizes, drafts suggested responses.",
    trustLevel: "needs-auth",
    trustLabel: "Gmail login",
    icon: "\uD83D\uDCE7",
    category: "email",
  },
];
