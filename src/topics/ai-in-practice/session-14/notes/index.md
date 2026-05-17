---
layout: reference.njk
title: "Session 14 Reference — Comparing Your AI Toolkit"
sessionNumber: "14"
sessionTitle: "Comparing Your AI Toolkit"
phase: "Phase 4: Terminal Agents & Agentic Tools"
topicName: "AI in Practice"
topicUrl: "/topics/ai-in-practice/"
---

## Quick Reference

<div class="ref-cheatsheet-block">

### Full toolkit comparison — five tools at a glance

| Tool | Home | Scope | Activation | Best for |
|---|---|---|---|---|
| Copilot Completions | IDE (in-file) | Current file | Automatic while typing | Inline completion as you write |
| Copilot Chat | IDE sidebar | Open files + context | Type in sidebar | Questions, explanations, quick code gen |
| Copilot Agent Mode | IDE (VS Code) | Project + shell | Ctrl+I, describe goal | Multi-file tasks, staying in VS Code |
| Claude Code | Terminal | Full system | `claude` in terminal | Complex, exploratory, long-running tasks |
| Opencode | Terminal | Full system | `opencode` in terminal | Same as Claude Code; model flexibility |

</div>

<div class="ref-cheatsheet-block">

### Quick decision tree — which tool?

```
New task
│
├─ Is it a question or explanation?
│   YES → Copilot Chat
│   NO  ↓
│
├─ Is it a single-file change?
│   YES → Completions or Chat
│   NO  ↓
│
├─ Does it need 3+ files AND/OR shell commands?
│   YES → Terminal Agent (Claude Code / Opencode)
│   NO  ↓
│
└─ Multi-file, staying in VS Code?
    → Copilot Agent Mode
```

> **Rule of thumb:** 3+ files or "run something after" = terminal agent territory.

</div>

<div class="ref-cheatsheet-block">

### Real scenarios — which tool?

| Scenario | Tool | Why |
|---|---|---|
| "Explain what this 80-line test does" | Copilot Chat | Quick question, no file edits needed |
| "Add API response mocking to 40 test files" | Claude Code | Needs to explore all files, make consistent changes |
| "I'm getting a TypeScript error on this assertion" | Copilot Chat | Single-file, quick fix — agent is overkill |
| "Scaffold folder structure and base Page Objects for a new module" | Claude Code or Agent Mode | Multi-file creation, benefits from full codebase read |
| "What's the Playwright way to intercept a network request?" | Copilot Chat | Documentation question — no project context needed |
| "Migrate 40 Cypress tests to Playwright" | Claude Code | Multi-file, pattern-heavy — agents excel at this |
| "I want to understand how our auth fixture works" | Copilot Chat | Read + explain, no changes |
| "Fix all flaky tests in the payment suite" | Claude Code | Exploration + fixes + verification loop |

</div>

<div class="ref-cheatsheet-block">

### When NOT to use agents

> **Skip the agent — just do it yourself when:**
> - Single-line change (rename variable, fix typo, update URL)
> - Quick question you can get from Chat in 30 seconds
> - Familiar pattern you can type in under 5 minutes
> - Copying a known pattern from one file to another
> - Writing a single test case for a scenario you already understand

**The check:** Can you read, understand, and make this change yourself in under 5 minutes? If yes, save the agent session overhead and just do it.

</div>

<div class="ref-cheatsheet-block">

### When agents are the obvious choice

- Setting up a new test framework from scratch (folder structure, config, base classes, CI)
- Migrating tests between frameworks (Cypress → Playwright across 40+ files)
- Applying a consistent pattern change across many files (selector convention update, error logging addition)
- Debugging a flaky test with complex async behaviour (add logging, run many times, trace failure)
- Writing tests for an unfamiliar part of the codebase (agent explores, understands, then writes)

</div>

<div class="ref-cheatsheet-block">

### Daily habit loop — every task

1. Classify by scope → pick the right tool
2. For agents: commit first, write GCSV prompt
3. Review output: read the diff, check for red flags
4. Verify: run tests, confirm they pass meaningfully
5. Commit the result with a meaningful message

**Weekly maintenance:** Update CLAUDE.md with new conventions. Note which tasks were good agent candidates. Share useful GCSV prompts with the team.

</div>

---

## Full Reference

## Why you need a decision framework

By the time you reach Session 14, you have five tools with overlapping capabilities. All of them can generate code. Several of them can read your files. More than one can run commands and modify multiple files. Without a framework for deciding which to use, you end up either defaulting to one tool for everything (underusing the others) or spending time deliberating each time.

The goal of this session is not to tell you which tool is "best" — it's to build the decision instinct. Once internalised, the choice becomes automatic: scope of task, where you're working, how complex is it. Three seconds of classification, then you're moving.

## Understanding each tool deeply

**Copilot Completions** is the most passive tool in the set. It activates automatically as you type and predicts what comes next — the next line, the next function body, the next argument. No conversation required. The interaction is: you type the start, it suggests the continuation, you press Tab or Esc. It sees the current file and a window of surrounding context.

Best for: times when you know roughly what to write and want to write it faster. Boilerplate, repetitive patterns, well-understood functions. The fastest tool for inline writing.

**Copilot Chat** is a conversational tool living in your IDE sidebar. You ask questions in natural language and get answers that can reference your open files with `@`. It's the right tool for any time you have a question — about a Playwright API, about what a specific piece of code does, about the right pattern for a scenario you haven't implemented before. Quick, low-overhead, conversational.

Best for: questions and explanations, quick single-file code generation, understanding unfamiliar code, researching the right approach before implementing it.

**Copilot Agent Mode** is Chat upgraded with autonomy. Activated with Ctrl+I in VS Code. You give it a goal rather than a question, and it plans, edits files, runs commands, and self-corrects — all within VS Code. The diff appears inline in your editor for approval. It can run your test suite and react to failures.

Best for: multi-file tasks where you want to stay in VS Code. Generating a new Page Object and updating the spec that uses it. Adding a new test suite for a feature. Refactoring across several files in your current workspace.

**Claude Code** is a terminal agent — you start it with `claude` in your project folder. It has full access to your filesystem and any shell command, and it reads your entire codebase before it starts writing anything. It tends to produce more contextually-aware output on large, complex codebases because it reads more broadly before acting. It runs on the most capable version of Claude.

Best for: complex, exploratory, long-running tasks. Tasks that span many files and require understanding the architecture before making changes. Multi-stage work where each stage needs to be verified before proceeding.

**Opencode** is functionally equivalent to Claude Code but model-agnostic and open source. Its TUI (terminal user interface) shows separate panels for chat, file changes, and shell output — more visual than Claude Code's conversational interface. You configure which model it uses: Claude, GPT-4o, Gemini, or a local model via Ollama.

Best for: situations where Claude isn't available (organisation restrictions, network constraints, budget), or where you want to compare model outputs. Same conceptual workflow as Claude Code — GCSV prompts, AGENTS.md context files, git safety habits all apply.

## The decision logic

The decision isn't about which tool is most powerful — it's about which tool is appropriate for the scale of the task.

**Start with scope.** A single-file change doesn't need an agent session. A 40-file migration does. Matching the tool to the scope saves overhead and produces better results: agents are genuinely better on large-scale tasks, and Chat is genuinely faster on small ones.

**Ask where you're working.** If you're deep in VS Code editing a single component and want to write the test alongside it, Agent Mode is natural. If you're in the terminal running a CI failure investigation, Claude Code is natural. Don't switch contexts unnecessarily.

**Ask what needs to happen after.** If the task requires running a command and reacting to the result — tests, lint, build — use an agent. If the task is writing code that you'll manually test, Chat may be sufficient.

## Same task, two tools — comparing the experience

**Task:** "Create Playwright E2E tests for the checkout flow. Read existing auth tests as reference."

**With Copilot Agent Mode:**
1. Press Ctrl+I to open Agent Mode in VS Code
2. Type the task description
3. Agent reads files visible in your workspace and forms a plan
4. Inline diffs appear in your editor — click Accept for each one
5. Agent runs the tests, shows results in the VS Code panel

Best when you're already in VS Code and your codebase is well-structured. The diff appears inline, approval is a click, the workflow stays entirely in your IDE.

**With Claude Code:**
1. `cd your-project && claude`
2. Type the task — Claude reads the full repo structure first
3. Claude reads all related files and forms a plan
4. Approve each file edit or command as prompted in the terminal
5. Claude runs tests, fixes failures, reports done

Best when the codebase is large or complex, or when you want the deepest possible pre-read before code is written. Claude Code's broader pre-exploration tends to produce more contextually-aware output on complex codebases.

Both tools can do this job well. The choice often comes down to personal preference and context — where you're working, how complex the codebase is, which model you want. Try both and develop your own defaults.

## Using tools together — the full workflow

The most effective approach treats these tools as complements, not alternatives. Different granularities of work call for different tools, and a single feature's test suite might use all of them in sequence.

**Example: building a new test suite for the payments module**

1. **Claude Code** — "Scaffold the folder structure and base Page Objects for payments tests. Read the existing auth tests as reference." → Handles the architectural decisions, creates the files in the right places, runs a quick verification.

2. **Copilot Chat** — "What's the Playwright way to intercept and mock a payment API response? Show me an example." → Quick API question while working on the implementation. No file changes needed, just the answer.

3. **Copilot Completions** — Writing individual test assertions inline, accepting suggestions as you type each case.

4. **Claude Code again** — "Run the payment tests, identify any failures, and fix them. Don't change the test assertions — only fix the test infrastructure." → Handles the debug-and-fix loop while you review the results.

This is how experienced agent users actually work. The tools are layered by task granularity, and switching between them is seamless.

<div class="ref-page-break"></div>

## Cost and access realities

Understanding the cost structure helps you make the right choice between tools.

**GitHub Copilot:** Flat monthly subscription. Completions, Chat, and Agent Mode are all included. Most organisations cover this as a standard developer tool cost. Predictable and unlimited within the subscription.

**Claude Code:** Included with a Claude.ai Max subscription, or billed per token via the Anthropic API. Long sessions on large codebases can accumulate meaningful costs — the agent reads many files before writing anything, and all that reading consumes tokens. The rule of thumb: use Claude Code for tasks where the time saved justifies the cost. A session that saves 45 minutes of work typically justifies the token cost easily.

**Opencode:** The tool itself is free and open source. You pay for whichever model you configure. Running a local model via Ollama means zero marginal cost per session, which makes it viable for high-volume experimentation. Running GPT-4o or Claude via API has costs similar to Claude Code.

## Building your AI workflow as a habit

The biggest barrier to effective AI tool use is not knowing the tools — it's building the habit of reaching for the right one automatically.

**Per-task habit loop:**
1. Pause for 3 seconds: scope of task → which tool?
2. For agents: commit first, write the GCSV prompt
3. Review all output: diffs, test results, red flags
4. Verify: run tests, check they pass meaningfully
5. Commit the result

**Weekly habit:**
- Spend 5 minutes updating CLAUDE.md with any new patterns or forbidden conventions you learned this week
- Note which tasks were good agent candidates (and which weren't — that knowledge is equally valuable)
- Share useful GCSV prompts with the team: good prompts are reusable assets

**The compounding effect:** Each session builds intuition for the next. Over time, task classification becomes instantaneous. The GCSV formula becomes automatic. The CLAUDE.md file grows more accurate. The gap between your productivity and someone still using only inline completions widens every week.

## FAQ

**Q: Is there one "best" tool I should use for everything?**
No — and trying to use one tool for everything will make you less effective, not more. Copilot Chat is faster than a terminal agent for a quick question. A terminal agent is dramatically better than Chat for a 40-file migration. The skill is matching tool to task, not picking a favourite.

**Q: I tried Agent Mode and Claude Code on the same task. Claude Code's output was better. Is it always better?**
Not always — it depends on the task. Claude Code tends to produce more contextually-aware output on large, complex codebases because it reads more broadly before acting. Agent Mode tends to work better on smaller, well-structured projects where the workspace context is sufficient. Both improve significantly with a good GCSV prompt and a project context file. Try both on tasks that matter to you and develop your own calibration.

**Q: Our organisation only allows GitHub Copilot — does the rest of Phase 4 still apply?**
Yes — Copilot Agent Mode is a genuine Stage 4 agent with the five properties described in Session 11. Everything you learned about GCSV prompts, task decomposition, git safety, and reviewing agent output applies equally to Agent Mode. The copilot-instructions.md context file serves the same purpose as CLAUDE.md. You are not missing the concepts — just the specific terminal tool.

**Q: How do I convince my team to start using these tools?**
Start with the time argument and a concrete demonstration. Pick a task that would normally take an afternoon — migrating a set of tests, scaffolding a new module, adding a consistent pattern across many files — and run a terminal agent session while your team watches. The "wait — it ran the tests?" moment is when it clicks. Once one person has seen a genuine 40-minute task done in 8 minutes, adoption follows naturally.

**Q: Should I always write a GCSV prompt even for Agent Mode?**
Yes. The formula applies to any agentic tool, not just Claude Code. The mechanics differ (in Agent Mode you type in the VS Code chat panel, not the terminal), but the structure is the same: what's the goal, what context does it need, what's in scope, how will we verify. A well-formed GCSV prompt in Agent Mode produces the same quality improvement as it does in a terminal agent.
