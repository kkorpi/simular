# Workspace Interaction Strategy

Kevin Korpi, February 2025

## Context

The VM is the engine, not the product. Users should experience a capable coworker doing tasks and reporting back. Exposing the raw VM — Windows desktop, system dialogs, low-res thumbnails — undermines trust and distracts from value.

This problem was first identified on mobile, where showing a 1280x900 Windows desktop on a 390px phone screen is literally unusable. But the mobile constraint revealed something bigger: **the patterns we designed to avoid the VM on mobile produce a better experience than showing the VM on desktop too.**

The current desktop experience defaults to "watch the agent work in a Windows VM." That's the wrong default. The right default — on every platform — is chat + status + native approval cards. The VM view should exist as opt-in "watch mode" for users who want transparency, not as the primary interface for anything.

**Simular is a native app** (iOS/Android, desktop via Electron or native), which meaningfully expands what's possible — native WebViews, system OAuth flows, hardware keyboard control, and push notifications are all available on every platform.

---

## When Does the User Need to Touch the VM?

Most agent tasks don't need human intervention at all. The agent works, reports back, done. But when human input *is* needed, these are the scenarios:

| Scenario | Example | Can we avoid the VM? |
|----------|---------|---------------------|
| **Login/Auth** | Agent needs user to sign into LinkedIn | Yes — OAuth or native login modal |
| **Content review/approval** | Agent drafted a LinkedIn post, email, or message | Yes — show content natively in chat |
| **Simple input** | "Which calendar?" "Pick a project." "Edit this subject line." | Yes — native form cards in chat |
| **CAPTCHA/Verification** | Bot detection triggered | Mostly — extract image into chat card |
| **Installed desktop apps** | Agent working in QuickBooks Desktop, Excel, Photoshop | **No** — must see/interact with the app |
| **Complex visual review** | Agent built a slide deck or formatted a spreadsheet | **No** — need to see the actual output |
| **Multi-app workflows** | Task spans browser + Excel + file system | **No** — can't represent this natively |
| **Teach mode** | User demonstrates a multi-step workflow | **No** — user drives the VM directly |
| **Message composition in context** | Sending in an app where surrounding context matters | Maybe — depends on how much context is needed |

The pattern: **web-based interactions can almost always be handled natively. Installed apps and complex visual output cannot.** This tells us where to invest.

---

## Options Evaluated

### A. OAuth → pass tokens to VM ✅ Best for auth
- User connects accounts in Simular settings → native OAuth flow → tokens stored → agent uses them in VM.
- **On desktop:** Same flow. "Connect your Google account" in settings. No login ceremony in the VM at all.
- **On mobile (native app):** `ASWebAuthenticationSession` (iOS) and Chrome Custom Tabs (Android) — the OS-provided auth flows. Native password manager, 2FA, everything.
- **Pros:** Perfect UX on every platform. Secure. Familiar pattern (Zapier, IFTTT). User connects once, agent uses forever.
- **Cons:** Only works for services with OAuth APIs. LinkedIn's OAuth is extremely restricted. Token-to-browser-session translation is non-trivial for some services.
- **Coverage:** Google, Microsoft, Salesforce, Slack, GitHub, Notion, HubSpot, Jira = great. LinkedIn, arbitrary websites = no.

### B. Native login modal ✅ Best for non-OAuth auth
- When the agent needs credentials for a service without OAuth, Simular opens the service's real login page in a native modal (WebView on mobile, embedded browser on desktop). User logs in with their own browser context — password manager, 2FA, everything. Cookies extracted and injected into VM. Agent resumes.
- **On desktop:** Clean modal overlaying the Simular window. Not the VM. The user never sees Windows.
- **On mobile:** `WKWebView` (iOS) / Android `WebView` at native resolution. Full mobile site.
- **Pros:** User interacts with the real site at native resolution. Password manager works. No streaming latency.
- **Cons:** Session-binding risk (cookies from user's IP may not work in VM at different IP). Google blocks OAuth in WebViews (use Option A). Some services detect WebView UA.
- **Verdict:** Use for non-OAuth services (LinkedIn, arbitrary sites). Test session-binding per service.

### C. Native content cards in chat ✅ Best for review/approval
- Agent extracts content from the VM and presents it natively in the chat. User reviews, edits, and approves without ever seeing the VM.
- **Examples:** Draft email card (shows subject, body, recipients — user edits inline and hits "Send it"). LinkedIn post preview card. Slack message card with channel context. Form summary card.
- **On desktop and mobile:** Identical. Chat cards are responsive by nature.
- **Pros:** Fastest interaction. No context switch. User focuses on content, not on navigating a remote desktop. Approval language matches the coworker model ("Post it" / "Edit first" / "Don't send") rather than security model ("Allow" / "Deny").
- **Cons:** Requires the agent to extract and structure content from whatever app it's in. Complex formatting (tables, images, rich text) is hard to represent perfectly. Doesn't work for visual outputs (slide decks, spreadsheets).
- **Verdict:** Default pattern for all content review and approval. Invest heavily here — this is what makes the product feel like a coworker, not a remote desktop client.

### D. VM streaming (watch mode) ✅ Necessary fallback
- Stream the VM view to the user. User can see and optionally interact with the remote desktop.
- **On desktop:** Full-resolution, responsive to window size. Opt-in — not shown by default. Accessed via "Watch" button or automatic when the agent needs direct VM interaction.
- **On mobile:** VM resizes to phone dimensions + mobile UA. Streamed 1:1 via WebRTC. Native keyboard overlay for text input. Native password autofill prompts when VM signals focus.
- **Pros:** Works for ANY scenario. Universal fallback. Required for installed apps, visual review, teach mode.
- **Cons:** On mobile: bot detection risk, touch-to-click latency, bandwidth. On desktop: reinforces "remote desktop" mental model. On all platforms: user is now driving/watching a remote machine instead of talking to a coworker.
- **When it's unavoidable:** Installed desktop apps (QuickBooks, Excel, Photoshop). Complex visual output review. Multi-app workflows. Teach mode. Anything where the content can't be extracted into a native card.

### E. Proxy/redirect → capture cookies ❌ Rejected
- Fatal flaw: session binding breaks for major services. Proxy requires MITM-ing HTTPS.

### F. Smart extraction for credentials ❌ Rejected
- Looks like phishing. Credential liability. Trust destroyer. Non-starter for passwords.
- For non-credential inputs (project picker, date selector): this is Option C above.

---

## Recommended Strategy: Layered Decision Tree

This tree applies to **both desktop and mobile**. The only difference is Layer 5 rendering (full-res on desktop, mobile-viewport on phone) and Layer 4 (defer to desktop is mobile-only).

```
Agent needs human input
        │
        ▼
Is this a login for an OAuth-supported service?
  YES → Layer 1: Native OAuth
        Connect accounts in settings. Agent uses tokens.
        Desktop: OAuth popup. Mobile: ASWebAuthenticationSession / Custom Tabs.
        User connects once. Agent uses forever.
  NO ↓
        │
        ▼
Is this a login for a non-OAuth service?
  YES → Layer 2: Native login modal
        Open service's real login page in a native modal/WebView.
        User logs in with password manager, 2FA, everything.
        Cookies extracted → injected into VM. Agent resumes.
        (If session-binding fails, fall through to Layer 5.)
  NO ↓
        │
        ▼
Can the content be extracted and shown natively?
  YES → Layer 3: Native content cards in chat
        Draft emails, post previews, message approvals, form summaries,
        simple inputs (dropdowns, text fields, date pickers).
        User reviews/edits/approves in the chat. Never sees the VM.
  NO ↓
        │
        ▼
Is this mobile + complex interaction (teach mode, multi-app)?
  YES → Layer 4: Defer to desktop (mobile only)
        "This works best on your computer."
        Push notification → desktop. Mobile shows status + chat only.
  NO ↓
        │
        ▼
Layer 5: VM streaming (watch mode)
  Desktop: Full-res VM view, responsive to window size.
  Mobile: VM resizes to phone dimensions + mobile UA, streamed via WebRTC.
  Used for: installed apps, visual output review, teach mode,
  multi-app workflows, anything that can't be extracted into a card.
```

---

## What This Changes on Desktop

The current desktop experience: VM thumbnail always visible, agent works in a Windows VM the user watches, confirmations are security-style "Allow/Deny" dialogs.

The new desktop experience: **chat + status + native cards by default.** VM hidden unless needed.

| Current Desktop Issue | How This Strategy Fixes It |
|---|---|
| Setup ceremony (UAC dialogs, installer visible) | VM provisions silently in background. Auth via OAuth/login modal. User never sees provisioning. |
| Thumbnail lag (new tab page while agent is working) | No thumbnail by default. Status line: "Working in Salesforce..." with activity indicator. |
| Low resolution VM view | Moot when VM isn't shown by default. When opened via watch mode, render at full resolution. |
| OS chrome visible (taskbar, desktop icons, VM ID) | Never shown by default. Clean up for watch mode (remove icons, hide VM ID, solid background). |
| No mouse movement | Moot. Chat narration + content cards are the primary interface. Watch mode is supplementary. |
| "Risky Click Detected" confirmations | Native approval cards: "Before I post this, want to review it?" with content preview and "Post it" / "Edit first" / "Don't post" buttons. |

### The default view on desktop

- **While agent is working autonomously:** Chat feed with step narration + status bar ("Navigating to Salesforce... Pulling Q4 pipeline data..."). No VM visible. Optional "Watch" button to open VM stream.
- **When agent needs approval:** Native content card appears in chat. User reviews and acts. No VM.
- **When agent needs auth:** OAuth popup or native login modal. No VM.
- **When agent hits an installed app or visual output:** VM view opens automatically, full-resolution. User interacts or reviews. VM closes when done.

### When watch mode opens automatically

Watch mode shouldn't require the user to know when to open it. The agent should signal when direct VM interaction is needed:

- Agent is working in an installed desktop app and needs user input → VM opens
- Agent completed a visual deliverable (slide deck, formatted report) → VM opens for review
- Agent is in teach mode → VM opens
- CAPTCHA that can't be extracted into a card → VM opens

For everything else, the VM stays hidden.

---

## The Irreducible VM Scenarios

These are the cases where no native surface can replace the VM. They require investment in making watch mode excellent rather than avoiding it:

**Installed desktop applications.** QuickBooks Desktop, Excel with complex macros, Photoshop, legacy enterprise software. These apps don't run in a browser, have no OAuth, and their output can't be fully represented in a chat card. The user may need to interact with them directly (approve a transaction in QuickBooks, review a formula in Excel). Watch mode must be high-quality for these: full resolution, low latency, good keyboard/mouse handling.

**Complex visual output.** The agent formatted a 20-slide deck, built a dashboard layout, or designed something visual. A chat card can show "Done — created 20 slides for Q4 review" but the user needs to *see* the actual output. This is a view-only scenario most of the time — the user reviews, says "change slide 3," agent makes the change.

**Multi-application workflows.** Task involves browser + Excel + file system + email client. The agent is orchestrating across apps. If the user needs to intervene mid-workflow, they need to see the full desktop context. Rare, but real.

**Teach mode.** User demonstrates a workflow by driving the VM directly. This is fundamentally a remote desktop interaction. Must be as close to native as possible — low latency, full resolution, reliable keyboard/mouse.

**The investment:** For these scenarios, watch mode needs to be good enough that users don't dread it. That means: full resolution, low-latency streaming (WebRTC), reliable keyboard and mouse input, and the agent intelligently framing the context ("I'm in QuickBooks Desktop. I need you to approve this vendor payment on screen.").

---

## Key Engineering Challenges

- **Content extraction for Layer 3.** The agent needs to reliably extract structured content from web pages and apps — email bodies, post text, form fields, message drafts — and present them as native cards. This is the highest-leverage investment. The more scenarios that can be handled by Layer 3 cards, the less users ever need to see the VM.
- **Session binding for Layer 2 (native login modal).** Many services tie sessions to IP/fingerprint. Cookies extracted from the user's browser context may not work in a VM at a different IP. This needs per-service testing. LinkedIn may be fine (less strict than Google). Google should always use OAuth (Layer 1) instead.
- **Keyboard input for VM streaming.** When the user interacts with the VM, the client app doesn't know a DOM input was focused — it's just pixels. The VM must detect focus events and signal the app to handle keyboard input. On native mobile: overlay a transparent `UITextField`/`EditText`. On desktop: less of an issue (keyboard events can be forwarded directly).
- **Password manager integration for VM streaming.** Form fields in the stream are pixels, not DOM elements — iCloud Keychain / Google Password Manager won't auto-trigger. Work around: when VM signals "password field focused," present a native autofill prompt and relay the credential.
- **Bot detection + mobile UA on VM.** Sites fingerprint beyond UA string — touch event APIs, accelerometer, geolocation. Chromium on Linux with a mobile UA but missing mobile APIs may get flagged. Mitigate with Playwright stealth plugins.
- **Watch mode quality.** For the irreducible VM scenarios, streaming quality matters. WebRTC for low latency, adaptive bitrate for varying connections, hardware video decoding on native clients. The bar is "good enough that installed-app workflows feel natural," not "pixel-perfect remote desktop."
- **Agent intelligence for handoff.** The agent needs to know when to surface the VM and when to extract content into a card. This is an AI classification problem: "Is this something I can represent natively, or does the user need to see the actual screen?" Getting this wrong in either direction is bad — opening the VM unnecessarily is jarring, not opening it when needed is blocking.

---

Prepared for team discussion. To be read alongside the VM integration critique doc.
