# Simular Prototype — Loom Walkthrough Script

**Duration:** ~12–15 minutes
**Setup:** Browser at `localhost:3000`, dark mode, window ~1440×900

---

## Before You Hit Record

- Make sure dev server is running (`npm run dev`)
- Open `localhost:3000` — you should see the landing page
- Clear any URL params (no `?demo=` or `?ref=`)
- Confirm dark mode is active (default)
- Have this script on a second screen or printed out
- Resize browser to ~1440×900 for a clean recording frame

---

## PART 1: The Gate (Landing Page)
**~45 seconds**

> **[Start recording]**

**WHAT TO SAY:**
"This is the Simular prototype — the full end-to-end experience from first touch to daily use. Let's start at the front door."

**WHAT TO DO:**
1. You're on the landing page. Pause for a beat so the team can see the layout: hero copy ("Your AI coworker. Always working."), the invite code field, the seat counter, and the trust signals at the bottom.
2. Point out the seat counter — "We're gating access with invite codes and a visible seat cap. Creates urgency."
3. Point out the trust signals at the bottom — "Private workspace, all activity logged — this is about trust from the first interaction."
4. Type a wrong code like `HELLO` and press Enter. Let the shake animation + error state play. "Invalid codes get a clear rejection — nice shake animation, red error text."
5. Now type `SIMULAR2026` and press Enter. Pause as the validation succeeds — green checkmark replaces the arrow.
6. Note the bottom-left pill that says "Try: SIMULAR2026" — "This is a helper for demos so investors always have a working code. Clicking it copies to clipboard."

**TRANSITION:**
"Once you're in, you hit SSO."

---

## PART 2: Signup Flow (SSO → Payment → Onboarding)
**~75 seconds**

**WHAT TO DO:**
1. Click through the SSO screen — point out the branded sign-in. "Standard SSO — Google or Microsoft. We keep it simple. Back button here if someone wants to bail."
2. Click through to the payment screen. "Stripe-powered payment. This is where the trial starts. Notice the same visual language — clean, centered, minimal."
3. Click through to the onboarding screen.

**WHAT TO SAY (on onboarding):**
"Onboarding is where it gets interesting. We run setup and profile questions in parallel — the workspace is literally spinning up in the background while you're answering these."

**WHAT TO DO:**
4. Point to the left column — watch the setup steps auto-progress with green checkmarks (Setting up workspace → Installing Chrome → Configuring environment → Preparing coworker). "These run on timers — each takes about 2-3 seconds. Real product would be actual setup."
5. Point to the right column — the questions. Select a role — pick **VC**. "This determines which starter tasks they see next. We have VC, Sales, Marketing, Founder, and more."
6. Select a few apps — click **Gmail**, **LinkedIn**, **Salesforce**. "These feed the zero state — the agent knows what tools are available."
7. Pick a couple handoff types — **Research**, **Email triage**.
8. Click continue. Watch the connecting state (bouncing dots + "Your coworker is getting set up"). "Three-second transition, then you're in."

**TRANSITION:**
"And now you're in the product."

---

## PART 3: Zero State — Your First Task
**~45 seconds**

**WHAT TO SAY:**
"This is the zero state. The agent greets you by name — 'Good morning, Katie' — and surfaces starter tasks based on your role. Since we picked VC, these are all investor workflows."

**WHAT TO DO:**
1. Hover over each task card slowly. Point out the trust badges on the right side of each card:
   - "Green badge says 'No sign in required' — the agent can do this with zero friction."
   - "Blue badge says 'Salesforce sign in' or 'Gmail sign in' — tells the user upfront that auth will be needed."
2. Point out the bottom options — "'View more sample tasks' on the left, and 'or describe your own' on the right — that opens the chat input."
3. Click the first task — **"Research a founder and build a one-pager"**.

**TRANSITION:**
"Watch what happens next — the agent takes over."

---

## PART 4: First-Run Experience — Agent Does Work
**~75 seconds**

**WHAT TO SAY:**
"The agent confirms the task and fires up a workspace. Watch both the chat and the right panel."

**WHAT TO DO:**
1. Point to the **right panel** first — show the workspace connecting state. "Bouncing dots, 'Connecting to workspace' — and these trust signals: Private, Encrypted. Even in a loading state we're reinforcing trust."
2. In the chat, the agent posts its intro message: "On it — I'll research this now. Let me fire up a browser and start pulling sources."
3. Watch the **progress card** appear and animate through steps:
   - "Opening browser and searching for Daniel Park" (step 1 starts running)
   - "Pulling LinkedIn profile and recent posts" (step 2)
   - "Cross-referencing with Crunchbase" (step 3)
   - "Compiling one-pager" (final step)
   - Each step gets a green checkmark as it completes. "Real-time feedback — the user always knows what the agent is doing."
4. When the progress card finishes, there's a brief pause, then a "task complete" divider line.
5. The **result card** appears — green accent, checkmark icon, title and subtitle.
   - "Here's the output — a structured result card. Title, subtitle, body content, and action buttons."
   - Point out "View full results" and "Open in workspace" buttons.
6. Below that, the agent posts a follow-up: "Want me to set this up as a recurring task?"
   - Point to the two buttons: "Make it recurring" and "Try something else"
   - "This pattern is everywhere — the agent doesn't just finish and go silent. It suggests what to do next."

7. Glance at the **right panel** — the workspace thumbnail now shows "LIVE" badge and the task appears in the Active section of the task list. "The right panel mirrors what's happening — live workspace preview on top, task list below."

**TRANSITION:**
"That's the first-run. Now let me jump to a fuller session where multiple things are happening at once."

---

## PART 5: Active Session — The Daily Workflow
**~2 minutes**

**WHAT TO DO:**
1. Open the demo picker: press **Cmd+Shift+D**.

**WHAT TO SAY:**
"Quick aside — this is the demo picker. Cmd+Shift+D on any screen. It lets us jump to any state in the prototype — five options here. It's a dev tool for walkthroughs like this."

**WHAT TO DO:**
2. Click **"Active session"**. The picker closes and the full chat loads.

**WHAT TO SAY:**
"This is a mid-session view. Katie's been working with the agent all morning. Let's walk through what happened."

**WHAT TO DO:**
3. Start at the top of the chat. Point to the **morning briefing**:
   - "The agent proactively opens with a greeting and a morning scan. Here's the deal sourcing digest — a result card with green accent showing it was a successful batch job."
   - Point to the body of the result card — highlights with green and amber dots. "Color-coded highlights — green for positive signals, amber for things that need attention."
   - Click **"View report"** button. "This opens the full result in the right panel."

4. The right panel transitions to **briefing detail view**:
   - "Full document-style view. We have the LP name, fund size, focus areas — all structured data."
   - Scroll down. Point to **People involved** (avatars), **Sources** (with site icons), **Talking points** (expandable sections).
   - "This is how the agent surfaces deep context — not just raw data but organized, actionable intel."
   - Click the **back arrow** to return to the task list.

5. Back in chat, scroll down to the **mobile app promo card**:
   - "Inline promotion card. Not a dialog or modal — it lives in the chat naturally."

6. Scroll to the **LP meeting prompt**:
   - "The agent noticed an LP meeting on Thursday and offers to prep for it. This is the prompt card — agent suggests an action, user decides."

7. Scroll to the **parallel running tasks**:
   - "Now the user asked for two things at once — an LP briefing and a touchpoint check. The agent runs both in parallel."
   - Point to the two **RunningTaskDetail** cards. "Live step logs — timestamps, actions, which sites the agent is visiting. Full transparency."

8. Scroll to the **LP Touchpoint Report** result card:
   - "Touchpoint report — highlights layout. Amber dots for overdue touchpoints, green for recent ones."
   - Point to the **compact prompt card** below: "Want me to run this every Monday?"
   - Click **"Yes, weekly"**. The **schedule modal** opens.
   - "Schedule modal — frequency picker. Daily, weekdays, weekly, monthly, or custom. Time picker here. Live preview text at the bottom — 'Runs every Monday at 7:00 AM.'"
   - Click **Save** or close. The prompt resolves with a green checkmark.

9. Scroll to the **LinkedIn section**:
   - "Now the user asks the agent to check LinkedIn profile viewers. But the agent isn't connected to LinkedIn yet."
   - Point to the **Login Request Card**: "Branded sign-in card. LinkedIn blue, the LinkedIn logo, a clear explanation of why access is needed, and a 'Sign in with LinkedIn' button."
   - Click **"Sign in with LinkedIn"**. The **workspace opens in login mode**.
   - "The workspace opens full-screen with a coaching bar — 'Sign in to LinkedIn so your coworker can continue the task.' The agent can't do this for you — you sign in, it watches."
   - Click the **Sign In** button in the workspace. Show the success state — green checkmark, "Connected" — and the 5-second countdown. "Auto-closes after success."

10. After workspace closes, scroll to the **choice card** (profile disambiguation):
    - "The agent found multiple profiles matching 'Daniel Park' — three options in a card layout. Name, title, company, mutual connections."
    - Click one of the profiles. It highlights with a blue border.

11. Scroll to the **draft card**:
    - "Now the agent drafted a LinkedIn comment about an article the selected Daniel Park posted."
    - "Amber accent means 'review before acting.' The user can edit inline — click the text and type. Then 'Post it' or 'Don't post.'"
    - "This is the human-in-the-loop pattern. The agent does the work, but anything public-facing gets human approval first."

**TRANSITION:**
"Next — what happens when the agent encounters something brand new."

---

## PART 6: Teach Mode — The Agent Learns a Custom Task
**~2 minutes**

**WHAT TO DO:**
1. Open the demo picker: **Cmd+Shift+D** → click **"Teach flow"**.

**WHAT TO SAY:**
"Teach mode is how users extend the agent's capabilities. The key design decision: the agent initiates this, not the user. You describe what you want, and if the agent hasn't seen it before, it asks you to show it how."

**WHAT TO DO:**
2. Point to the **user message**: "Forward my Asana weekly digest to the #updates Slack channel every Monday morning."

3. Point to the **agent response**: "I haven't done this specific task before. Asana's digest layout varies and you'll want to choose which sections to forward."
   - "The agent is honest — it doesn't hallucinate a workflow. It explains why it needs help."

4. Point to the **prompt card**: "Want to show me how you do it? I'll watch and learn the steps, then I can repeat it on my own going forward."
   - "Two options — 'Show me how' starts a recording session. 'Just describe it' is the alternative path."

5. Click **"Show me how"**.

**WHAT TO SAY:**
"The workspace opens and the agent starts recording. Watch the chat — a live step log builds as you demonstrate."

**WHAT TO DO:**
6. Point to the transition message: "Opening your workspace. Just do the task as you normally would — I'll record each step."

7. Watch the **live step log card** appear — violet-themed border and background:
   - Header: pulsing violet dot + "Forward Asana weekly digest to Slack" + step counter.
   - "Steps appear one at a time as the user performs them in the workspace."
   - Watch steps build: "Open Asana and navigate to Weekly Digest page" → "Select Engineering and Design sections" → "Copy formatted digest content" → etc.
   - Point to the **"Watching for next action..."** indicator between steps. "The agent is waiting, not rushing."

8. Point to the **right panel**: "The teach task also appears in the Active section of the task list — 'Learning mode' subtitle, violet accent. The agent is treating this as a real active task."

9. Point to the footer: "Two buttons — 'Open workspace' if it's minimized, and 'Done' when you're finished."

10. Click **"Done"**.

**WHAT TO SAY:**
"The agent summarizes what it learned."

**WHAT TO DO:**
11. Show the **post-teach result card** — green accent, checkmark icon:
    - "6 steps recorded, each listed with a green dot. 'Edit steps' button if you want to refine."

12. Below that, the **scheduling prompt card** with the repeat icon:
    - "Want me to do this every Monday at 9am?"
    - Click **"Yes, every Monday"**. The prompt resolves with a green checkmark and confirmation text.

13. Show the **final confirmation message**: "All set. I'll forward your Asana digest to #updates every Monday at 9am. You'll find it in your task list."

14. The **"teach session complete"** divider appears below everything — violet line.

15. Point to the **right panel** one more time: "And now the task has moved to the Recurring section in the task list. 'Every Monday 9am' — it's a first-class recurring task, not a separate concept."

**WHAT TO SAY:**
"Important product decision: a taught task is just a task. No special 'workflow' badge, no separate UI. It shows up alongside everything else. The agent learned it, now it owns it."

**TRANSITION:**
"Let me show you the avatar menu, settings, and trial management."

---

## PART 7: Avatar Menu + Settings + Trial
**~75 seconds**

**WHAT TO DO:**
1. Click the **avatar** in the top-right corner. The dropdown menu appears.

**WHAT TO SAY:**
"Avatar menu — quick access to Subscription, Credits, Settings, and Logout."

**WHAT TO DO:**
2. Point to each menu item:
   - **Subscription** — links to subscription settings
   - **Credits** with the dollar amount — "$8.88" — "Quick glance at credit balance."
   - **Settings** — opens the full settings overlay
   - **Log out** — self-explanatory
3. Click **Subscription** (or close the menu and click the **trial badge** in the center of the top bar — "Free trial — 6d left").

**WHAT TO SAY:**
"The trial badge is always visible in the top bar. One click opens subscription management."

**WHAT TO DO:**
4. Show the **Subscription settings**:
   - Plan card: "Pro Trial — Day 8 of 14" with a progress bar at 57%.
   - Feature list with checkmarks — "Unlimited tasks, workspace access, all integrations, priority support."
   - Payment method: "Visa ending in 4242."
   - Billing section with monthly total.

5. Show the **cancel flow**: Click **"Cancel trial"** → the destructive confirmation appears in red:
   - "Red zone. Clear language. 'This action cannot be undone.' Two buttons — 'Cancel my trial' in red, 'Keep my trial' to back out."
   - Click **"Keep my trial"** to dismiss.

6. Switch to **Credits** tab in the left nav:
   - Usage bar: "847 of 1,000 credits — 85% used."
   - Category breakdown: "Research 72, Writing 45, Workspace 28, Recurring 8. Users can see exactly where their credits go."
   - "Buy more credits" CTA at the bottom.

7. Switch to **Appearance** tab:
   - Toggle to **Light mode**. "Full theme support. The entire UI adapts — backgrounds, cards, text, borders."
   - Let it sit for a second so the team can see the light mode treatment. "Cards are white on a subtle gray background with soft shadows. Every element has a light variant."
   - Toggle back to **Dark mode**.

8. Briefly show **Workspace** tab — "Dev mode toggle, connected integrations."
9. Briefly show **Skills** tab — "Available agent skills — Research, Writing, Data Analysis."
10. Close settings.

**TRANSITION:**
"Last thing — the design system."

---

## PART 8: Card Gallery — The Component Library
**~90 seconds**

**WHAT TO DO:**
1. Open the demo picker: **Cmd+Shift+D** → click **"Card gallery"**.

**WHAT TO SAY:**
"This is the card gallery — our component library. Every card type in the product, live and interactive. This is how we maintain design consistency."

**WHAT TO DO:**
2. Point to the layout: "Left sidebar is the catalog — twelve card types. Center is the live preview. Below is the control panel for configuration."

3. Walk through the key card types — click each in the sidebar, show the preview:

   **Result Card** (default):
   - "The workhorse. This is what the agent delivers when a task completes. Research output, reports, digests."
   - Toggle the **body type** in the controls: Prose → Highlights → Key-Value → Table → Sections. "Five body layouts. Same card shell, different content structures."
   - Toggle the **accent color**: Default → Green → Amber → Blue → Violet. "Accent colors signal meaning — green for success, amber for review, blue for informational."
   - "You can also toggle on the schedule footer and notification bar from here."

   **Draft Card**:
   - "Review-before-sending. The user sees exactly what the agent is about to publish and can edit inline."
   - Toggle preset: LinkedIn comment → Email → Flight booking. "Same component handles social posts, emails, and bookings."

   **Choice Card**:
   - "When the agent needs the user to pick from options."
   - Toggle layout: Cards → List → Pills. "Three layouts for different contexts. Cards for rich options, pills for quick picks, list for triage."
   - Toggle multi-select on. "Multi-select mode for things like email triage."

   **Prompt Card**:
   - "Agent suggests an action. Standard and compact variants."
   - Toggle severity: None → Info → Warning. "Severity badges for context."

   **Destructive Card**:
   - "The agent is about to do something irreversible — mass unsubscribe, bulk delete. Red accent, confirmation input required."
   - Point to the text input: "You have to type 'CONFIRM' to proceed. No accidental destructive actions."

   **Form Card**:
   - "Structured data collection — flight search, file renaming, threshold settings."
   - "Multiple field types: text, number, date range, select, toggle, chips input."

   **Progress Card**:
   - Show the "In progress" preset: "Multi-step task tracking — done, running, error, pending states."
   - Switch to "With error" preset: "Error handling built in — this step hit a rate limit. Retry button right there."

   **Error Card**:
   - Show "Auth required" preset: "Login expired on Notion. Agent explains the problem and offers recovery — 'Reconnect Notion' button."
   - Switch to "Blocked" preset: "CAPTCHA on Expedia. Agent can't solve it, asks user to help."

   **Login Card**:
   - "Branded service authentication. Switch between LinkedIn, Gmail, Salesforce."
   - Toggle the connected state. "Before and after — sign-in CTA vs connected confirmation."

4. Show the **"When to use"** panel at the bottom of the sidebar:
   - Click on different cards and show the scenario text updating. "Each card type has a scenario description — 'When to use' — so the team always knows which component to reach for."

**WHAT TO SAY:**
"Every interaction in the prototype uses one of these twelve card types. New features should reuse existing components or propose a new one here first. This is the source of truth."

**TRANSITION:**
"Let me show you a couple more hidden features, then we'll wrap."

---

## PART 9: Slash Commands + Keyboard Shortcuts
**~30 seconds**

**WHAT TO DO:**
1. Close the gallery (**Escape** or the X button). You're back at the main app.
2. Click in the **task input** at the bottom of the chat.
3. Type **`/`** — the slash command menu appears.

**WHAT TO SAY:**
"Slash commands. Power-user shortcuts right in the chat input."

**WHAT TO DO:**
4. Show the menu items:
   - `/teach` — "Start teach mode directly"
   - `/schedule` — "Create a new scheduled task"
   - `/skills` — "Jump to skills settings"
   - `/integrations` — "Jump to workspace integrations"
   - `/settings` — "Jump to appearance settings"
5. Press **Escape** to dismiss.

**WHAT TO SAY:**
"And the demo picker — Cmd+Shift+D — works on any screen. Five jump points to different states. This is how we move fast in demos."

---

## PART 10: Wrap-Up
**~30 seconds**

**WHAT TO SAY:**
"Quick recap of what you've seen:

1. **Gated signup** — invite codes, seat cap, trust signals from the first screen.
2. **Onboarding** — parallel setup and profiling, zero dead time.
3. **Zero state** — role-filtered starter tasks with trust badges.
4. **First-run** — real-time progress, structured results, proactive follow-ups.
5. **Active session** — multiple parallel tasks, workspace preview, full task list.
6. **Authentication handoff** — branded login cards, workspace coaching, auto-close.
7. **Disambiguation** — choice cards when the agent needs human input.
8. **Draft review** — human-in-the-loop for anything public-facing.
9. **Teach mode** — agent-initiated, live step recording, instant scheduling.
10. **Trial management** — always-visible badge, subscription settings, credit tracking.
11. **Theme support** — full dark and light mode.
12. **Card gallery** — twelve components, all configurable, all documented.

Everything here is a functional prototype, not static mocks. Every state is reachable via the demo picker, every card is in the gallery, and every interaction is wired.

Questions or feedback — drop them in the thread. Thanks for watching."

> **[Stop recording]**

---

## Quick Reference: Demo Picker Shortcuts

| Cmd+Shift+D → | What it shows |
|----------------|---------------|
| Fresh | Zero state → first task experience |
| Active session | Mid-session with multiple tasks, results, login flow |
| Card gallery | Full component library (12 card types) |
| Teach flow | Agent-initiated teach mode arc |
| Landing | Back to gated signup |

## URL Parameters

| Param | Effect |
|-------|--------|
| `?demo=fresh` | Skip landing → zero state |
| `?demo=active` | Skip landing → active session |
| `?demo=gallery` | Skip landing → card gallery |
| `?demo=teach` | Skip landing → teach flow |
| `?ref=CODE` | Pre-fill invite code on landing |

## Slash Commands (type `/` in chat input)

| Command | Opens |
|---------|-------|
| `/teach` | Teach mode |
| `/schedule` | New task card |
| `/skills` | Settings → Skills |
| `/integrations` | Settings → Workspace |
| `/settings` | Settings → Appearance |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Cmd+Shift+D | Demo picker |
| Escape | Close workspace / modal / picker |
| Enter | Send message / validate code |

## Tips for Recording

- **Pace yourself.** Pause after each transition so viewers can absorb the UI.
- **Mouse slowly.** Hover over elements deliberately — tooltips and hover states are part of the design.
- **Narrate the why.** Don't just describe what's on screen — explain the product decision behind it.
- **Stay in dark mode** for most of the video. Switch to light only briefly in the settings section.
- **If you make a mistake**, use Cmd+Shift+D to jump back to the right state. The demo picker is your safety net.
