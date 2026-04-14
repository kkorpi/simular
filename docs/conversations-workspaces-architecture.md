# Conversations & Workspaces: Architecture Decision

## The Question

How should conversations relate to workspaces (machines/VMs)?

- Should each workspace have its own isolated conversations?
- Should conversations be global with a workspace assignment?
- Can one conversation orchestrate multiple machines?

## Background

Sai conversations are fundamentally different from ChatGPT/Claude conversations. A Sai conversation is not just a chat thread — it's a dialogue connected to a real machine where tasks execute, browsers open, files are created, and services are logged into. The conversation's context is tied to the state of that machine.

## Three Options

### Option 1: Workspace-Scoped Conversations

Each workspace has its own conversation list. Switching workspaces shows different conversations.

```
Workspace A (Cloud VM)
  ├── Conversation 1
  ├── Conversation 2
  └── Conversation 3

Workspace B (Kevin's MacBook)
  ├── Conversation 4
  └── Conversation 5
```

**Pros:**
- Clean isolation — conversations see only what their workspace has access to
- No ambiguity about where tasks run
- Simple implementation — task context is always local to one machine
- Matches current production architecture

**Cons:**
- "Where was that conversation?" — users forget which machine a chat was on
- Switching workspaces feels like switching apps
- Users with 3+ workspaces spend time hunting for context

### Option 2: Global Conversations with Workspace Binding (Recommended)

All conversations live in one list. Each conversation is bound to one workspace when created.

```
All Conversations (single list)
  ├── Conversation 1  →  runs on Workspace A
  ├── Conversation 2  →  runs on Workspace A
  ├── Conversation 3  →  runs on Workspace B
  ├── Conversation 4  →  runs on Workspace A
  └── Conversation 5  →  runs on Workspace B
```

**Pros:**
- One conversation list — no "which machine was that on?"
- Clear workspace binding per conversation — no multi-machine chaos
- Workspace selector sets the default for new conversations
- Can show a small workspace badge on each conversation if needed
- Path to Option 3 later if demand warrants it

**Cons:**
- Still only one machine per conversation
- Need UI to show/filter which workspace each conversation uses
- Slightly more complex data model (conversation has workspaceId reference)

### Option 3: Global Conversations with Multi-Machine Orchestration

Each task within a conversation can target different machines.

```
Conversation 1
  ├── Task A  →  runs on Workspace A
  ├── Task B  →  runs on Workspace B  (different machine!)
  └── Task C  →  runs on Workspace A
```

**Pros:**
- Maximum flexibility — "run tests on dev, deploy on prod" in one thread
- Power users can coordinate across machines

**Cons:**
- Massive implementation complexity
  - Which machine's context does the conversation "see"?
  - How to show workspace state when multiple are involved?
  - What if one machine is offline? Does the conversation stall?
  - How to merge results/artifacts from different machines?
- Right panel can only show one workspace at a time
- Error handling becomes exponentially harder
- Debugging cross-machine issues is painful for users and support
- Edge cases multiply: different integrations, different auth sessions, different file systems

## Recommendation

**Option 2: Global conversations with workspace binding.**

This gives users the simplicity of one conversation list (the thing they interact with most) while maintaining clear isolation per conversation. The workspace is infrastructure — users think about their conversations, not their machines.

Multi-machine orchestration (Option 3) should be deferred. It adds enormous complexity for a niche use case. Users who need cross-machine coordination can create separate conversations and reference results between them.

## What This Means for the Product

1. **Sidebar shows all conversations** regardless of workspace
2. **Workspace selector** sets the default workspace for new conversations
3. **Each conversation is bound** to one workspace at creation time
4. **Switching workspaces** does NOT hide conversations — it just changes where new tasks run
5. **Conversation could show a workspace badge** (small icon) so users know which machine it's on
6. **Cross-workspace referencing** (mentioning results from another conversation) is a future enhancement

## Response to "Can I orchestrate multiple machines in one conversation?"

Not in the current model. Each conversation runs on one workspace. To coordinate across machines:

1. Create a conversation per machine for the machine-specific work
2. Reference results across conversations (future feature)

This keeps the model predictable and debuggable. Multi-machine orchestration is something to revisit once the single-machine experience is polished and user demand is validated.
