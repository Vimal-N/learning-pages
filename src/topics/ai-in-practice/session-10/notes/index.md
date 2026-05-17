---
layout: reference.njk
title: "Session 10 Reference — Introduction to Claude Code & Opencode"
sessionNumber: "10"
sessionTitle: "Introduction to Claude Code & Opencode"
phase: "Phase 4: Terminal Agents & Agentic Tools"
topicName: "AI in Practice"
topicUrl: "/topics/ai-in-practice/"
---

## Quick Reference

<div class="ref-cheatsheet-block">

### Claude Code setup commands

| Step | Command | Notes |
|---|---|---|
| Check Node.js | `node --version` | Requires v18 or higher |
| Install globally | `npm install -g @anthropic-ai/claude-code` | One-time per machine |
| Log in | `claude login` | Opens browser; links to your account |
| Start a session | `cd your-project && claude` | Always start from the project folder |
| Trust mode (in-session) | `/trust` | Skips file-edit confirmations; still prompts for shell commands |
| Skip all confirmations | `claude --dangerously-skip-permissions` | Advanced only — not for everyday use |

</div>

<div class="ref-cheatsheet-block">

### Opencode setup commands

| Step | Command |
|---|---|
| Install globally | `npm install -g opencode-ai` |
| Start a session | `cd your-project && opencode` |

</div>

<div class="ref-cheatsheet-block">

### Claude Code vs Opencode — at a glance

| Dimension | Claude Code | Opencode |
|---|---|---|
| Interface | Conversational (chat-like) | TUI panels (chat, files, shell output) |
| Models | Claude only | Any — Anthropic, OpenAI, Google, local Ollama |
| Open source? | No (Anthropic-owned) | Yes |
| Access required | Claude.ai Pro/Max or Anthropic API key | API keys for your chosen model |
| Best choice when | You want the best Claude experience | Your org restricts which AI services you can use |

</div>

<div class="ref-cheatsheet-block">

### Approval workflow — what to expect

> Before every file edit: Claude shows you the **diff** and asks `Allow this edit? [y/n/always]`
>
> Before every shell command: Claude shows you the **exact command** and asks `Run this command? [y/n]`
>
> You are always in control — nothing happens without your approval.

</div>

<div class="ref-cheatsheet-block">

### Safety checklist — before every agent session

- [ ] `git commit -am "pre-agent checkpoint"` — create a rollback point
- [ ] Verify you're in the correct project folder before typing `claude`
- [ ] Read every diff before approving — don't mass-approve without understanding
- [ ] Scope your task clearly — include which folders are in bounds
- [ ] Never paste API keys or credentials into the chat prompt

</div>

<div class="ref-cheatsheet-block">

### Where terminal agents excel (QA use cases)

| Task type | Example prompt |
|---|---|
| Codebase exploration | "Where is the cart total calculated? Show me all the places it's referenced." |
| Multi-file updates | "Update all API endpoint URLs from v1 to v2 across the test suite." |
| Test-and-fix loops | "Run the suite, identify failing tests, and fix the failures one by one." |
| Scaffolding | "Set up the folder structure and base files for testing our new Payments module." |
| Documentation | "Read all our Playwright tests and generate a test coverage summary document." |
| Git-aware review | "Show what changed in this branch and check if any test selectors need updating." |

</div>

---

## Full Reference

## What makes terminal agents different

IDE-based AI tools like Copilot see the file you have open and a narrow window of surrounding code. They suggest — you apply. Terminal agents work at a completely different level.

When you run `claude` in your project folder, the agent can:

- **Read any file in your project** — it explores the directory structure, reads relevant source files, understands your architecture
- **Execute shell commands** — run your test suite, invoke git, call any CLI tool
- **Read the results of commands** — if tests fail, it reads the failure output and iterates
- **Make coordinated changes across many files** — not one file at a time, but as many as the task requires

The key shift: **instead of answering your questions, terminal agents take actions on your behalf**. You describe what you want to achieve; they explore, plan, act, verify, and report. Your job becomes reviewing what they did — not doing it yourself.

## How Claude Code understands your project

Claude Code does not have magical knowledge of your codebase. It builds understanding the same way a new developer would — by reading files. The difference is it reads dozens of files in seconds and holds them in context simultaneously.

The sequence when you start a session:

1. **Reads the directory structure** — runs the equivalent of `ls -la` to understand what kind of project this is, how it's organised
2. **Reads CLAUDE.md if it exists** — the project brief you've written for it; conventions, tech stack, forbidden patterns, run commands (more on this in Session 12)
3. **Reads relevant files for each task** — when you give it a task, it reads the files it needs to understand before it starts writing anything
4. **Everything fits in its context window** — the context window is the hard limit; a task on 5–10 files works well; "refactor my entire 500-file codebase" is too large and needs to be scoped into stages

This is why Claude Code writes tests that use your actual class names, your actual file paths, your actual patterns — because it read them first.

## Installing and running Claude Code — step by step

**Prerequisites:** Node.js v18 or higher. Check with `node --version`. If not installed, download the LTS version from nodejs.org.

**Install:**
```
npm install -g @anthropic-ai/claude-code
```

The `-g` flag installs it globally — available in any folder, not just one project.

**Log in:**
```
claude login
```

This opens a browser window to sign into your Anthropic or Claude.ai account. Required once. Your credentials are stored securely on the machine.

**Start a session:**
```
cd your-project-folder
claude
```

Always navigate to your project folder first. Claude Code reads files from wherever you start it.

## The approval workflow

Claude Code asks permission before every consequential action. This is a deliberate safety design — you are always in control.

**Before editing a file**, it shows you the diff:
```
# Claude wants to modify tests/checkout.spec.ts
-   getByText('Place Order')
+   getByText('Confirm Order')

Allow this edit? [y/n/always]
```

`y` = approve this change once | `always` = approve all future edits to this file | `n` = reject

**Before running a shell command**, it shows you the exact command:
```
# Claude wants to run:
npx playwright test tests/checkout.spec.ts

Run this command? [y/n]
```

You see what will run before it runs. Never a surprise.

Treating the approval prompts as genuine checkpoints — not as friction to click through — is what separates safe agent use from reckless agent use. Read the diffs the way you'd review a teammate's PR.

## Inside a terminal agent session

Understanding what the agent is doing at each stage turns the "watching the terminal scroll" anxiety into informed observation.

**Stage 1 — You give a task in plain English**
"Add Playwright tests for the checkout flow, covering happy path and card declined scenario."

**Stage 2 — Agent reads your project**
It explores the directory structure, reads relevant test files, notes your existing patterns and conventions.

**Stage 3 — Asks permission, then acts**
Shows diffs before editing files, exact commands before running them. Waits for your approval at each step.

**Stage 4 — Runs commands and verifies**
After making changes, runs tests, reads output, fixes errors iteratively until the task is verified complete.

**Stage 5 — Reports what it did**
Summarises changes, lists file paths, explains key decisions. You review, ask follow-up questions, or redirect.

## Claude Code permission modes

| Mode | How to activate | What it does |
|---|---|---|
| Default (recommended) | `claude` | Asks permission before every file edit and shell command |
| Trust mode | `/trust` inside a session | Auto-approves file edits; still asks before shell commands |
| No-confirm mode | `claude --dangerously-skip-permissions` | Skips all confirmations — sandboxed workflows only |

Start in default mode. Move to `/trust` only after you're comfortable with how the agent operates on a given project.

## Using terminal agents safely

**Commit before every session — without exception.** If something goes wrong, `git restore .` returns you to a clean state in seconds. Without a commit, a bad session can mean lost work with no recovery path. Treat this as a pre-flight check.

**Review all diffs before approving.** Read them the same way you'd review a teammate's PR. Don't click through approval prompts quickly — that's where mistakes happen.

**Give precise scope in your task description.** "Only modify files in tests/checkout/" is more reliable than "update the checkout tests." Explicit scope constraints prevent the agent from touching unrelated areas.

**Never paste API keys or credentials into chat.** Use environment variables instead. Treat the chat log as potentially readable by others.

## Worked example — first session

```
You: We have a Playwright test suite in tests/. Three tests are failing because we renamed
a button from "Place Order" to "Confirm Order" in the UI. Find and fix all the affected tests.

Agent: Let me search the test files for references to "Place Order"...

[Reads directory structure → searches for "Place Order" text across all test files]

Found 3 occurrences across 2 files:
- tests/checkout.spec.ts — lines 34, 67
- tests/pages/checkoutPage.ts — line 12

I'll update all three. Showing you each change for approval...

[Shows diff for each file, waits for approval, makes changes]

Running npx playwright test tests/checkout.spec.ts...

✅ 3/3 tests passing. All fixes applied.
```

The most memorable moment for first-time users is usually when the agent runs the tests itself and reports back. That "wait — it ran the tests?" moment is the shift from thinking of AI as a text generator to recognising it as an active agent.

<div class="ref-page-break"></div>

## FAQ

**Q: Do I need a special plan or account to use Claude Code?**
Claude Code is included with a Claude.ai Pro or Max subscription. It can also be accessed via an Anthropic API key on a pay-per-token basis. Check with your team lead about which your organisation uses. Opencode is a free tool — you bring your own API keys.

**Q: What's the difference between Claude Code and Copilot Agent Mode?**
Both can read files, edit code, and run commands. The key differences: Claude Code is a terminal agent (you run it in a command line), while Copilot Agent Mode lives inside VS Code. Claude Code can access your entire machine's filesystem and any shell command; Copilot Agent Mode operates within the VS Code workspace. Claude Code tends to be better at longer, more complex, exploratory tasks; Agent Mode is more convenient if you prefer staying in the IDE.

**Q: Is it safe to let it run commands? What if it runs something destructive?**
Claude Code always shows you the exact command before running it and waits for your approval. It cannot run a command you haven't approved. The additional safety layer is committing your work before every session — if the agent does something unexpected, `git restore .` undoes all changes instantly.

**Q: What if the agent goes off in completely the wrong direction?**
Stop the session, run `git restore .` to return to your pre-session state, then start fresh with a more specific task description. This is the entire reason for committing before every session. A clear git checkpoint makes any mistake a 10-second recovery.

**Q: Should I use Claude Code or Opencode?**
Start with Claude Code if you have a Claude.ai subscription — it provides the best Claude experience and is actively developed by Anthropic. Use Opencode if your organisation restricts which AI services you can use, or if you want to experiment with different models (GPT-4o, local models via Ollama). The concepts you learn for one apply directly to the other.
