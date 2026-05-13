---
layout: reference.njk
title: "Session 12 Reference — Context Files"
sessionNumber: "12"
sessionTitle: "Context Files"
phase: "Phase 4: Terminal Agents & Agentic Tools"
topicName: "AI in Practice"
topicUrl: "/topics/ai-in-practice/"
---

## Quick Reference

<div class="ref-cheatsheet-block">

### The three context files — where each one lives

| File | Tool | Location | Effect scope |
|---|---|---|---|
| `CLAUDE.md` | Claude Code | Project root, or `~/.claude/CLAUDE.md` for user-level | Claude Code sessions only |
| `.github/copilot-instructions.md` | GitHub Copilot | `.github/` folder in project root (exact path) | All Copilot features — completions, chat, agent mode |
| `AGENTS.md` | Multi-agent / Opencode | Project root | Any agent that supports the convention |

</div>

<div class="ref-cheatsheet-block">

### Context file placement — scope by location

| Location | Scope |
|---|---|
| `~/.claude/CLAUDE.md` | All Claude Code sessions on your machine — personal preferences |
| `<project-root>/CLAUDE.md` | This project only — commit to git so the whole team benefits |
| `<project-root>/AGENTS.md` | This project — for multi-agent portability |
| `<project-root>/.github/copilot-instructions.md` | This project — affects all Copilot features for the whole team |
| `<project-root>/tests/CLAUDE.md` | Only when Claude is working inside `/tests/` — sub-directory scope |

</div>

<div class="ref-cheatsheet-block">

### The nine sections of a context file — priority guide

| Section | Priority | What it does |
|---|---|---|
| `## Tech Stack` | High | Exact framework versions — prevents deprecated API usage |
| `## Directory Structure` | High | Where tests, page objects, fixtures live — agent creates files in the right place |
| `## Run Commands` | High | Exact commands to run tests — agent can self-verify |
| `## Coding Conventions` | High | Selector patterns, wait strategies, naming — shapes every generated line |
| `## Do Not` | High | Explicit prohibitions — most impactful section for preventing mistakes |
| `## CI / Environment` | Medium | Headless flags, env vars, retry settings — prevents "works locally, breaks CI" |
| `## Security Notes` | Medium | Sensitive files, secrets, what must never be committed |
| `## Project Context` | Situational | Non-obvious decisions, known constraints, why patterns exist |
| `## Common Tasks` | Situational | Shortcuts for tasks you ask the agent to do repeatedly |

</div>

<div class="ref-cheatsheet-block">

### A complete CLAUDE.md — copy-ready template

```markdown
# CLAUDE.md — [Project Name]

## Tech Stack
- Playwright 1.48, TypeScript 5.4, Node 20
- Test runner: npm run test:e2e
- Lint: npm run lint

## Directory Structure
- E2E specs: /tests/e2e/**/*.spec.ts
- Page Objects: /tests/pages/[Name]Page.ts
- Utilities: /tests/utils/
- Fixtures: /tests/fixtures/

## Coding Conventions
- NEVER use waitForTimeout() — use waitForLoadState('networkidle')
- Selectors: data-testid first, getByRole() second, CSS selectors never
- Tests must be independent — no shared state between tests
- Always await locators before asserting

## Do Not
- Never edit /src or /app directories — that is application code
- Never install npm packages without confirming with the user
- Never hardcode URLs — use the BASE_URL environment variable

## CI Notes
- CI sets HEADLESS=true automatically
- Max retries: 2 (configured in playwright.config.ts)
- Never commit .env files or credential files
```

</div>

<div class="ref-cheatsheet-block">

### The three instruction types — what makes each work

| Type | Example | How the model treats it |
|---|---|---|
| Factual context | "We use Playwright 1.48" | Ground truth — used as fact, no guessing |
| Behavioural rule | "Always use waitForLoadState" | Applied as a constraint on every suggestion |
| Prohibition | "Never use waitForTimeout()" | Hard limit — model actively avoids it |

> **Key insight:** Specificity = control. "Write clean code" is unactionable. "Never use waitForTimeout()" is a constraint the model can enforce on every line it generates.

</div>

---

## Full Reference

## The problem context files solve

Every time you start a fresh agent session, you start from scratch. The agent has no memory of your project. Without a context file, every session begins with something like:

> "Before we start: we use Playwright with TypeScript, page object pattern, tests in /tests/e2e/, utilities in /tests/utils/, we never use waitForTimeout, we use waitForLoadState instead, we prefer data-testid selectors..."

If you've used agents for more than a week, you've written this — or something very similar — dozens of times. Context files are how you eliminate that repetition completely. Write your project knowledge once, in a file, and every future session starts with the agent already knowing all of it.

## How context files work under the hood

Context files are not documentation that the model "reads" in a human sense. They are injected into the model's **system prompt** before your first message. The model treats them as authoritative configuration — not as background reading, but as instructions that apply to every response it generates.

The flow:

1. Session starts → agent reads the context file from disk
2. File content is merged into the system prompt before your message arrives
3. Model applies constraints from the file on every response it generates
4. Your output automatically follows your rules — without you needing to repeat them

This is why context files are far more reliable than repeating instructions in conversation. In-conversation instructions can drift as the context window fills. System prompt instructions — loaded from your context file — stay active for the entire session.

## CLAUDE.md — the pre-brief for Claude Code

CLAUDE.md is a Markdown file named exactly that, placed in your project root (or `~/.claude/` for user-level settings). Claude Code reads it automatically at the start of every session.

**Think of it as the onboarding document you'd write for a new contractor.** What do they need to know before their first day? What are the gotchas that would waste their time? What are the patterns you expect them to follow without being asked?

**Project-level CLAUDE.md** (in the project root) is committed to git. Every team member running Claude Code on the project gets the same agent behaviour. When one person discovers a useful rule — "never install packages without confirming" — they add it to CLAUDE.md and the whole team benefits.

**User-level CLAUDE.md** (at `~/.claude/CLAUDE.md`) applies across all your Claude Code sessions everywhere. Use it for your personal preferences: coding style, tools you always use, patterns you prefer regardless of the project.

**Subdirectory CLAUDE.md** is a power feature for large monorepos. A `tests/CLAUDE.md` only applies when Claude is working inside the `tests/` directory. Rules about test patterns don't need to bleed into rules about application architecture.

## copilot-instructions.md — persistent instructions for GitHub Copilot

Location: `.github/copilot-instructions.md` — this exact path.

This file affects **all Copilot features** for your project: completions, chat, and agent mode. When committed to the repo, it applies to every developer on the team. This is one of the most powerful aspects of the file — you can establish consistent AI behaviour across the entire team with a single commit.

**Effect on completions:** Copilot learns your naming conventions and patterns, suggests code that uses your existing helper functions, and avoids patterns you've explicitly banned.

**Effect on Copilot Chat:** @workspace answers are filtered through your instructions, and chat responses reference your actual tech stack and conventions.

**Effect on Agent Mode:** The agent follows your architectural decisions and coding standards when making multi-file changes.

The same rules about specificity apply: vague instructions have little effect, concrete rules produce consistent results.

## AGENTS.md — the portable option

AGENTS.md is an emerging vendor-neutral convention supported by Opencode and growing in Claude Code support. The idea: instead of maintaining three separate context files with overlapping content, write AGENTS.md as the single source of truth for project-wide agent context. Tool-specific files (CLAUDE.md, copilot-instructions.md) then contain only tool-specific overrides.

When to use AGENTS.md:
- Your team uses multiple agent tools and wants consistent behaviour across all of them
- You're building CI/CD workflows that invoke agents
- You want future-proofing as new tools emerge

AGENTS.md can coexist with CLAUDE.md and copilot-instructions.md. The convention is: cross-tool information goes in AGENTS.md, tool-specific information goes in the tool-specific file.

## What to write in each section

**Tech Stack:** Include exact version numbers. "Playwright 1.48" is actionable. "Playwright" is not — the agent might use an API from 1.38 that was changed in 1.44. Versions matter.

**Directory Structure:** Tell the agent where things live. Without this, it might create `login.test.ts` in the project root instead of `tests/e2e/auth/login.spec.ts`. Ground truth for navigation.

**Run Commands:** This is the most underrated section. An agent can't verify its own work unless it knows how to run your tests. `npm run test:e2e` runs all tests. `npx playwright test tests/auth/ --reporter=list` runs auth tests. Write the exact commands. The agent will use them to self-verify every session.

**Coding Conventions:** Write the rules you would leave in a PR review comment. "Prefer data-testid attributes over CSS selectors" is a behavioural rule the model applies to every selector it generates. "Tests must be independent — no shared state between tests" shapes how it structures each spec file.

**Do Not:** Explicit prohibitions are the most impactful section for preventing mistakes. "Never edit /src or /app directories" means the agent won't touch application code even if your task description could be interpreted as requiring it. "Never install packages without confirming" prevents an agent from pulling in a dependency you didn't know about.

**CI / Environment:** Prevents "works locally, breaks CI" surprises. If your CI runs in headless Chromium with `HEADLESS=true`, write that. If your test suite has a specific retry configuration, reference it. The agent will respect your CI constraints when generating or modifying config.

**Security Notes:** Which files contain sensitive data. Which environment variables hold secrets. What must never appear in committed files. This doesn't replace proper secrets management — but it prevents the agent from accidentally including credential values in code it generates.

<div class="ref-page-break"></div>

## Before vs after — same prompt, with and without CLAUDE.md

Without a context file, the agent produces valid but generic code:

```
✗ Uses page.waitForTimeout(2000) — your forbidden pattern
✗ Creates the file in the project root, not in /tests/e2e/
✗ Uses CSS class selectors instead of data-testid
✗ Doesn't run the tests after creating the file
```

With a well-written CLAUDE.md, the same prompt produces code that fits directly into your codebase:

```
✓ Uses waitForLoadState('networkidle') — your required pattern
✓ Creates the file in /tests/e2e/auth/ — your correct location
✓ Uses data-testid selectors throughout
✓ Runs npm run test:e2e and reports whether tests pass
```

Same model. Same prompt. Completely different result. The CLAUDE.md is the variable.

## The practical rule for what to add

> **If you've had to tell the agent the same thing twice, it belongs in CLAUDE.md.**

Every time you correct the agent with "no, we don't use waitForTimeout here" or "the test files go in tests/e2e/ not in the root", you're paying a tax on missing context. Add that instruction to your context file and you'll never pay it again.

A useful starting approach: run an agent session without any context file, note every decision it makes incorrectly, then write a context file specifically to fix those decisions. This produces a context file grounded in real mistakes, not hypothetical ones.

## FAQ

**Q: Does CLAUDE.md need any special formatting?**
No — it is plain Markdown. The agent reads it as text. There's no schema to follow and no required sections. Use clear headings, bullet points, and code blocks where helpful. The structure shown in this session is a recommended pattern, not a requirement.

**Q: Should I commit CLAUDE.md to git?**
Yes — for project-level CLAUDE.md. Commit it so every developer on the team benefits from the same agent behaviour. When you discover a new rule that improves the agent's output, commit the update and the whole team gets it immediately. The `~/.claude/CLAUDE.md` is user-level and should not be committed (it's on your machine, not in the repo).

**Q: Can the agent ignore instructions in CLAUDE.md?**
The agent strongly respects CLAUDE.md content because it's injected into the system prompt. Behavioural rules and prohibitions are treated as constraints on every response. However, if a task description seems to directly contradict a rule ("edit the /src directory"), the agent may ask for clarification. Make your prohibitions explicit and absolute: "Never edit /src or /app — these are application code areas, not in scope for this agent."

**Q: What's the difference between factual context and a behavioural rule?**
Factual context ("We use Playwright 1.48") is treated as ground truth about the project — facts the agent uses to inform its decisions. A behavioural rule ("Always use waitForLoadState") is a constraint applied to every output — the agent actively steers toward this pattern even when not explicitly asked. Both are valuable; behavioural rules have the most direct impact on code quality.

**Q: How long should a CLAUDE.md be?**
Long enough to cover everything the agent needs, short enough to read in two minutes. A well-focused CLAUDE.md is typically 30–80 lines. If it's getting very long, consider whether some content belongs in a subdirectory CLAUDE.md instead. Prioritise: Run Commands, Coding Conventions, and Do Not are the highest-value sections. Start there.
