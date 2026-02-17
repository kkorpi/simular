# Simular — Product Requirements Document

## What Simular Is

Simular is an always-working AI coworker for professionals. It runs on a persistent cloud machine, uses real applications (browser, Slack, LinkedIn, email), and does actual work — not just answers questions. It is the enterprise-ready, secure version of what OpenAI's Operator and Anthropic's Claude Computer Use demonstrated was possible.

The core value proposition: **You give it tasks. It does them. It keeps doing them.**

It is not a chatbot. It is not a copilot. It is a coworker that happens to live on a computer in the cloud.

---

## Positioning

**"Always-working coworker"** — not "always-on agent" or "virtual machine."

- "Always on" sounds passive, like it's waiting. "Always working" implies it's actively doing things for you right now.
- "Coworker" sets the right expectation: it does real work, it uses real tools, it needs access to your accounts, and you can check on what it's doing.
- "Agent" is too technical for the target audience. "Assistant" undersells it. "Coworker" is the right frame.

**Who it's for:** Professionals who do repetitive knowledge work — research, monitoring, email triage, CRM updates, meeting prep, content repurposing. The initial audience skews toward business roles (VC, sales, ops, marketing) rather than developers.

**Why now:** Anthropic's Claude Computer Use / OpenAI's Operator educated the market that AI can control a computer. People are primed. They want it. But those products had security issues and felt like demos. Simular is the one that's actually ready for real work — secure, auditable, persistent.

---

## Taxonomy

These are the core concepts in Simular. Every piece of UI copy, every API name, every marketing message should use these terms consistently.

### Task

The fundamental unit. Everything the user asks Simular to do is a **task**.

A task can be:
- **One-time**: "Research this founder and give me a one-pager"
- **Recurring**: "Every morning, check my email for LP responses and update Salesforce"
- **Ongoing/monitoring**: "Watch TechCrunch for Series A announcements in fintech"

There is no distinction between "workflows" and "tasks" from the user's perspective. Whether a task was created by the user, suggested by Simular, or based on a pre-trained template with high confidence — it's all just a task.

**Internal note:** Pre-trained task templates (what was previously called "workflows") can exist as an internal concept for confidence scoring and optimization. But the user never sees the word "workflow." They just see that some tasks work great on the first try (because they match a template) and others might need guidance.

### Steps

Every task has **steps** — the sequence of actions Simular takes to accomplish the task's goal. Steps are the activity log: "Opened LinkedIn," "Searched for founder," "Pulled background info," "Created Google Doc."

Steps are visible when the user wants to see what's happening (progressive disclosure). They are not the primary interface — the result is.

### Workspace

The user's coworker's machine. This is where the work happens. It's a persistent cloud environment with a real browser, real apps, and the user's logged-in sessions.

**Never call it a "virtual machine" or "VM" in any user-facing context.** The word "workspace" is clean, professional, and doesn't require technical knowledge to understand.

- "Your workspace is online" (not "VM is running")
- "Open workspace" (not "view VM")
- "Workspace settings" (not "machine configuration")

The workspace is conceptually like your coworker's desk — you can look over their shoulder (the live view), but most of the time you just get the results.

**Naming:** Do not expose machine identifiers like "simular-0716" to users. The workspace is simply "your workspace." If the product eventually supports multiple workspaces, they can be user-named (like Slack workspaces).

### Skills

The underlying capabilities the agent can use to accomplish tasks. Research, writing, data analysis, scheduling, code execution, image analysis.

Skills are **invisible plumbing** for most users. They exist in settings for power users who want fine-grained control. They should not be surfaced in the primary task creation flow or in the sidebar.

The agent decides which skills to use based on the task. The user doesn't need to specify "use the research skill" — they just say "research this founder."

### Integrations

Connected services — Gmail, Salesforce, LinkedIn, Slack, Calendar, etc.

Integrations are acquired **progressively through actual tasks**, not through an upfront setup flow. When the user asks Simular to do something that requires LinkedIn, Simular says "To do this, I'll need you to log in to LinkedIn" and shows the login screen.

This is a critical UX principle: **never ask for credentials before the user understands why they're needed.**

---

## Information Architecture

### The Chat (primary interface)

One continuous conversation with your coworker. Non-blocking — you can keep talking while tasks run.

The chat serves multiple purposes:
- **Task creation**: Natural language. "Pull my briefing." "Check who followed me on Twitter and pull their LinkedIn."
- **Results delivery**: Artifacts drop into the chat when tasks complete. Briefings, documents, summaries, alerts.
- **Status updates**: "Working on it." "Done — here's what I found." "I need you to log in to LinkedIn to continue."
- **Proactive suggestions**: The agent can initiate. "Good morning. I checked your calendar — you have 3 meetings today. Want me to prep?"

**The chat is NOT a list of separate conversations.** It's one thread with one coworker, like iMessage or a Slack DM. Messages flow chronologically. Old context scrolls up. The agent maintains memory across the entire conversation history.

**Chat input**: The text input at the bottom should NOT dominate the zero state. When the agent has things to report, it talks first. The input is there when you need it, but the coworker isn't waiting for orders.

### The Task List (secondary, collapsible)

A view of all tasks — active, recurring, completed. Lives in a right panel or is otherwise accessible but not primary.

This serves two purposes:
1. **Accountability**: "What have I asked my coworker to do?" Confirms recurring tasks are still running.
2. **Dopamine**: Seeing a growing list of tasks your coworker handles is satisfying. "Look how much this thing does for me."

Each task in the list shows: name, status (running/recurring/completed), last run time, and can be expanded for details (steps, schedule, results history).

**This is NOT a conversation list.** There is one conversation. The task list is a separate organizational view of the work being done.

### The Workspace View (tertiary, on-demand)

The live view of the agent's screen. Shows what the browser looks like, what sites are open, what the agent is doing in real time.

This is the "look over your coworker's shoulder" experience. It's magical when you see it — but most users will rarely use it after the initial wow factor. It's there for:
- **Trust building**: "I can see exactly what it's doing"
- **Debugging**: When something goes wrong, you can watch
- **Credentials**: When the agent needs you to log in, it shows the login screen

The workspace is accessed by clicking the live preview thumbnail or an expand button. It should feel seamless to enter and exit.

---

## Zero State (First Run)

The blank page problem is real. The solution is: **don't show a blank page.**

### What the user sees on first visit:

1. A brief welcome that establishes the mental model: "I'm your coworker. I work on this machine. Tell me what to do, or pick one of these to start."
2. **3-5 starter tasks** as cards/tiles. Categorized by trust level:
   - **No login needed**: "Scan TechCrunch for today's funding announcements" / "Research [company name] and give me a one-pager"
   - **Requires login**: "Check my Gmail for unread messages from VCs" / "Look at my LinkedIn and find new followers, pull their backgrounds"
3. NO visible chat input initially (or collapsed/minimal). The agent talks first with these suggestions.

### Starter task principles:
- Each one is from the pre-tested "golden 100" list of high-confidence tasks
- At least one should complete in under 60 seconds (immediate value)
- At least one should naturally become recurring (ongoing value)
- The first task someone runs should just work. No errors. No hallucinations.

### After the first task completes:
The agent proactively suggests: "Want me to do this every day?" Default is yes — recurring by default. The user has to opt out, not opt in.

---

## Recurring Tasks — The Core Value Loop

The key insight from the VC conversation: **immediate value converts to ongoing value.**

The flow:
1. User runs a task (or picks a starter task)
2. Task completes successfully → user sees the result and is impressed
3. Agent suggests making it recurring: "I can do this every [morning/hour/week]. I'll ping you when it's done."
4. Default is recurring. User would have to explicitly say no.
5. Next day, user opens app → agent has already done the work and is reporting results

**The golden metric: 3 recurring tasks.** If a user has 3 recurring tasks, they're retained. This is our "7 friends in 10 days" equivalent.

---

## Trust & Safety

### The Trust Spectrum

Every action the agent takes falls on a spectrum:

1. **Safe** (no confirmation needed): Reading web pages, searching, generating documents, creating summaries
2. **Sensitive** (confirm before acting): Sending emails, posting on social media, modifying CRM records, making purchases
3. **Dangerous** (always block): Deleting data, transferring money, changing passwords, actions outside the user's explicit scope

### Trust Signals in the UI

Throughout the interface, reinforce trust:
- **Lock icon + "Credentials stay in your workspace"** — shown during login flows
- **"Private instance"** — your workspace is yours alone
- **"All activity logged"** — everything the agent does is recorded
- **Step-by-step visibility** — you can always see exactly what happened
- **"Securely accessing [website]"** — shown in the activity log when the agent uses credentials

These aren't just legal requirements — they're marketing. Every trust signal is also a selling point vs. competitors that don't have them.

### Confirmation Flow

When the agent encounters a sensitive action:
1. It pauses and shows what it wants to do
2. On mobile: render the relevant UI component (the actual send button, the email draft, the LinkedIn message) — not a generic "approve/deny" dialog
3. User approves or edits
4. Agent proceeds

Over time, the agent can learn what the user is comfortable with and reduce confirmations for trusted patterns.

---

## V1 Architecture Constraints

Based on engineering input:

- **One workspace per user** for initial release. Multiple workspaces = paid tier later.
- **One conversation per workspace.** The meta-agent (chat) and the workspace are 1:1. This simplifies the technical architecture without impacting UX since we're designing for one coworker anyway.
- **Tasks are sequential by default.** The workspace handles one active task at a time. Queued tasks run in order. This aligns with the mental model ("your coworker can only do one thing at a time").
- **The workspace is Windows-based** but all user-facing interactions should be through the browser in full-screen/chromeless mode. Never expose the OS. If the agent opens Chrome, the user just sees a website, not Windows Chrome.
- **Mac workspace** is technically possible (Mac Mini data centers) but limited supply. Position as "Mac — limited availability" for early demand capture. Premium pricing ($200+/mo vs $20/mo for Windows).

---

## Pricing Structure

Structural decision that must be future-proof. Cannot anchor on per-seat then change later.

**Model: Platform fee + active work time**

- **$20/month** base — includes the always-on workspace and some amount of active work time
- **Active work time** measured in hours — abstracts away token costs into something people understand ("$3/hour of thinking time" maps to the mental model of hiring a contractor)
- **Free trial**: 7 days, no credit card required to start. Credit card required to continue after trial or when hitting the usage cap.

**Principles:**
- Lose money on the base fee. $20/mo for a workspace that costs $50/mo to run is fine. Optimize for adoption, not margin.
- Don't nickel-and-dime. If someone goes 10% over their work time limit, don't charge them. Send them a thank-you instead.
- The enterprise tier ($500+/mo) is where margin lives: audit logs, SSO, data loss prevention, multiple workspaces, higher work time limits.
- Never expose tokens, API calls, or technical metrics to users. "Hours of active work time" is the unit.

---

## Mobile App

The mobile app is a companion, not the primary interface. It serves:

1. **Notifications**: "I finished your task. Here are the results."
2. **Quick approvals**: Sensitive actions that need confirmation
3. **Monitoring**: See what your coworker is doing right now
4. **Chat**: Send quick follow-up instructions

The mobile app should render task results and confirmation UI as native-feeling components, not a tiny desktop screenshot. For web-based tasks, request the mobile viewport version of sites rather than showing the desktop VM.

**Key onboarding moment:** After the first task completes on web, prompt: "Download the mobile app so I can ping you when I'm done." This is the natural moment to capture mobile install.

---

## GTM / Launch Strategy

### Phase 1: Ship fast, capture the moment

The market is primed by Claude Computer Use / Operator. First mover wins.

1. **100 golden tasks** — pre-tested, high-confidence starter tasks covering the most common professional use cases
2. **Twitter-first distribution** — the team's videos consistently hit millions of views. Continue the content engine.
3. **Free trial, low friction** — 7 days free, no card upfront. Just start using it.
4. **Drip campaign** during trial — guide users toward 3 recurring tasks (the retention magic number)

### Phase 2: Waitlist + enterprise

When demand exceeds capacity (which should happen fast if it goes viral):
1. Put up a waitlist for new users
2. Offer enterprise tier: audit logs, SSO, compliance features, multiple workspaces
3. Use the waitlist as a sales pipeline — companies that need enterprise features get priority
4. IT-ready positioning: "The secure version of what everyone's been buzzing about"

### Content strategy:
- One new use case video per day on Twitter
- Each video showcases a specific task from the golden 100
- Measure: which tasks drive sign-ups, which drive retention
- Cohorted retention analysis — cut by first task type, number of recurring tasks, integrations connected

---

## Design Principles

1. **Simple first.** One coworker, one conversation, one workspace. Complexity comes later.
2. **The agent talks first.** Don't wait for the user to type. Show results, suggestions, status.
3. **Progressive disclosure.** The default view is clean. Details are one click away, never zero clicks.
4. **Non-blocking.** The user can keep chatting while tasks run. Nothing waits on anything.
5. **Trust is visible.** Lock icons, "private instance," activity logs — sprinkled throughout, not buried in settings.
6. **Results over process.** Show the artifact, not the steps. Steps are there if you want them.
7. **Recurring by default.** Every completed task should suggest becoming recurring. The default is yes.
8. **No jargon.** No VMs, no tokens, no agents, no workflows, no skills (in primary UI). Just tasks, steps, workspace.

---

## Appendix: Term Mapping

| Internal / Technical | User-Facing |
|---|---|
| Virtual machine / VM | Workspace |
| simular-0716 (machine ID) | (hidden — just "your workspace") |
| Workflow | Task |
| Workflow builder | (doesn't exist — tasks are created via chat) |
| Skills | (hidden — agent decides which to use) |
| Tokens / API calls | Active work time (hours) |
| Agent | Coworker / "Simular" |
| Session | (no concept — one continuous conversation) |
| Container / Instance | Workspace |
| Orchestration | Steps |

---

## Open Questions

1. **Personification**: How much personality does the coworker have? Vanilla for v1, but this is a brand decision that matters long-term. Claude's tone works because it mirrors the user. Should Simular do the same?

2. **Multi-workspace**: When we add support for multiple workspaces, is the mental model "hire another coworker" or "give your coworker a second computer"? Different implications for UX and pricing.

3. **Social/viral features**: The task list is inherently shareable ("look how many tasks I have running"). Is there a way to lean into this without compromising privacy? Screenshots of task counts? Public task templates?

4. **Mac availability**: How aggressively do we market Mac support? It's expensive and limited, but Twitter loves Mac. Consider: "Mac limited availability" as a demand signal even before wide rollout.

5. **Chat vs. feed**: The VC meeting surfaced tension between chat (conversational, back-and-forth) and feed (results-first, reverse-chronological). V1 is chat. But the steady state — when you have 20+ recurring tasks reporting results — might need a feed-like experience. When do we evolve?
