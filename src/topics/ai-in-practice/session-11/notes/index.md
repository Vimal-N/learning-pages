---
layout: reference.njk
title: "Session 11 Reference — The Agent Evolution"
sessionNumber: "11"
sessionTitle: "The Agent Evolution"
phase: "Phase 4: Terminal Agents & Agentic Tools"
topicName: "AI in Practice"
topicUrl: "/topics/ai-in-practice/"
---

## Quick Reference

<div class="ref-cheatsheet-block">

### The four stages at a glance

| Stage | Era | What AI does | Your role | Example tool |
|---|---|---|---|---|
| 1 — Inline Suggestion | 2021– | Predicts next tokens as you type | Accept or reject | Copilot Completions |
| 2 — Conversation | 2022– | Answers questions, generates code on request | Ask, copy, apply manually | ChatGPT, Copilot Chat |
| 3 — Workspace Assistance | 2023– | Reads your actual files, gives project-specific answers | Ask, review, apply manually | Copilot @workspace, Claude with files |
| 4 — Autonomous Agent | 2024– | Explores, edits, runs, verifies, iterates | Describe the task, review results | Claude Code, Opencode, Copilot Agent Mode |

</div>

<div class="ref-cheatsheet-block">

### The five properties of a true AI agent

| Property | What it means | Without it |
|---|---|---|
| Autonomy | Can decide WHAT to do next, not just HOW | Needs micromanagement at every step |
| Tool use | Can read files, write files, run commands | Gives advice only — can't act |
| Memory / context | Holds full task and prior results in context | Forgets earlier steps mid-task |
| Planning | Breaks a large task into steps and executes in order | Does one thing without seeing the whole picture |
| Verification | Checks its own work — runs tests, reads outputs, fixes failures | Declares success without checking |

**How tools score:** Copilot Chat = tool use only. Copilot Agent Mode = tool use + memory + planning. Claude Code / Opencode = all five.

</div>

<div class="ref-cheatsheet-block">

### The trust spectrum — how much autonomy to give

| Zone | Colour | Examples | Approach |
|---|---|---|---|
| Low risk | Green | New test files, formatting, renaming variables, adding imports | Run without review |
| Medium risk | Amber | Changing test logic, modifying shared page objects, any multi-file refactor | Review before applying |
| High risk | Red | Auth logic, CI/CD config, database migrations, production configs | Human-led, agent-assisted |

</div>

<div class="ref-cheatsheet-block">

### The tool-selection rule of thumb

> **Does completing this task require touching more than 3 files, or running a command after?**
>
> **Yes** → Use a terminal agent (Claude Code or Opencode)
>
> **No** → Chat or inline completions are faster and sufficient

</div>

<div class="ref-cheatsheet-block">

### Three mental shifts for effective agent use

| Old mindset | New mindset |
|---|---|
| "Do this specific thing on line 42" | "Here's the task — here's the goal" |
| Accepting completions | Reviewing diffs |
| Trust the output | Trust, then verify |

</div>

---

## Full Reference

## Why the evolution story matters

Most people's mental model of AI assistance is stuck at Stage 1 or 2 — autocomplete and chatbot. That mental model leads to underusing the tools available to them, and using the wrong tool for the job.

Understanding how each stage evolved — and what problem it solved — gives you the conceptual foundation to use Stage 4 tools effectively. Each stage required a different way of working. The shift from Stage 3 to Stage 4 is the biggest shift of all: **you stop being the person who applies every change, and you become the person who reviews them.**

## Stage 1 — The Autocomplete Era (2021–present)

**What it is:** Copilot Completions. The AI sees your current file and cursor position. It predicts the next tokens — characters, words, entire functions.

**How you interact with it:** Passively. You type, it suggests. You press Tab to accept, Esc to reject. The AI never asks you anything, never runs anything, never touches any file you didn't open.

**What it solved:** Reduced the cost of writing repetitive, boilerplate code. If you know what you want to write, AI can write it faster.

**Its fundamental limitation:** You are still doing all the thinking. AI is saving keystrokes. The architecture decisions, the test strategy, the debugging approach — all of that is still entirely yours.

**Still useful? Yes.** Stage 1 never became obsolete. For inline code writing, Tab completion remains faster than any other interaction mode.

## Stage 2 — The Chat Era (2022–present)

**What it is:** ChatGPT (November 2022), Copilot Chat, Claude.ai. A conversational interface where you ask questions and get answers.

**How you interact with it:** You write a message. It responds. You can refine, ask follow-ups, provide more context. Back-and-forth is possible — but you're always the one initiating.

**What it solved:** Access to expert-level knowledge on demand. How does Playwright's `waitForResponse` work? What's the right pattern for mocking APIs? You no longer need to dig through documentation for 20 minutes.

**Its fundamental limitation:** The AI knows a lot about the world. It knows nothing about *your* project. Every answer is generic until you paste in your specific code — and that context has to fit in one message. It can't read your file structure, can't see your page object classes, can't understand that you use a specific selector convention.

## Stage 3 — The Workspace Era (2023–present)

**What it is:** Copilot @workspace, Claude with file uploads, GitHub Copilot Workspace. The AI can now read your actual files, imports, configuration, and dependencies.

**How you interact with it:** You ask, it reads your files, it gives answers that reference your actual code — your class names, your patterns, your tech stack.

**What it solved:** Relevance. Instead of generic Playwright advice, you get advice that uses your `CheckoutPage.ts` class, references your `tests/e2e/` folder structure, and follows the patterns it sees in your codebase.

**Its fundamental limitation:** YOU still have to apply every suggestion manually. The AI understands your project. You do all the mechanical execution. The bottleneck is still the human — every edit, every file save, every test run.

## Stage 4 — The Agent Era (2024–present)

**What it is:** Claude Code, Opencode, Copilot Agent Mode. The AI doesn't just advise — it acts.

**How it works:** You describe what you want achieved. The agent explores your codebase, understands the relevant files, forms a plan, executes it (with your approval at each step), runs commands, reads results, fixes failures, and reports back.

**What it solved:** The execution gap. In Stages 1–3, the bottleneck was always human execution. In Stage 4, the agent handles the mechanical execution — finding files, making consistent changes across them, running tests to verify the result. You shift from typist to reviewer.

**An honest comparison of Stage 3 vs Stage 4:**

| Stage 3 | Stage 4 |
|---|---|
| AI reads files you share | AI reads files it decides to read |
| AI advises, you apply | AI applies, you review |
| One response per request | Multi-step execution loop |
| You verify the result | Agent verifies the result |

**How much does the AI do vs you?**

- Stage 1: AI does ~10% (saves keystrokes). You do 90%.
- Stage 2: AI does ~30% (answers questions). You do 70%.
- Stage 3: AI does ~50% (advises and drafts). You do 50%.
- Stage 4: AI does ~80% (explores, edits, verifies). You do 20% (task description, review, approval).

That 80/20 split is the reason the industry is moving rapidly toward agents.

<div class="ref-page-break"></div>

## The five properties of a true AI agent

Not all tools marketed as "AI agents" are genuine agents. These five properties define a real agent:

**1. Autonomy** — Can decide WHAT to do next, not just HOW. A non-agentic AI waits for you to specify every step. An agent can determine what the next step should be based on the goal and the current state.

**2. Tool use** — Can read files, write files, run commands, call APIs. Without tool use, the AI can only generate text — it cannot interact with your actual project.

**3. Memory / context** — Holds the full task and all prior results in its context window while working. This is what allows it to maintain consistency across many file edits in a single session.

**4. Planning** — Can break a large, vague task ("set up our test framework") into concrete, ordered sub-tasks and execute them sequentially.

**5. Verification** — Can check its own work. After writing a test, it can run the test, read whether it passed or failed, and fix problems — without you needing to ask it to.

Claude Code and Opencode have all five. Copilot Agent Mode has three. Copilot Chat has one (limited tool use through @workspace search). This is not a judgment about which tools are better — it's a framework for understanding what they can do.

## The three mental shifts for effective agent use

**From micromanaging to task delegation.** With Stages 1–3, you specified exactly what you wanted on each line. With agents, that micromanagement backfires. Give the agent the goal and let it determine the approach. "Fix the broken login test" is a better prompt than "on line 42, change waitForTimeout(2000) to waitForLoadState('networkidle')."

**From accepting completions to reviewing diffs.** Your interaction pattern changes completely. Before, you were the one making every change. Now you're reading what the agent changed and deciding if it's right. Speed-reading diffs is a skill worth building deliberately.

**From "trust the output" to "trust then verify."** Agent outputs are usually correct — but you are the final reviewer, not the AI. Run the tests. Check the git diff. Read the changes. This is professional practice, not distrust of the tool.

## The trust spectrum in practice

Not all tasks should be delegated with equal confidence. Develop judgment about where each type of task sits on the spectrum:

**Green zone — low scrutiny needed:** Tasks where agent errors are instantly caught by tests or obvious visual inspection. Adding new test files from scratch, renaming variables consistently, fixing formatting and linting. If the agent gets it wrong, tests fail and you see the problem immediately.

**Amber zone — review carefully:** Tasks where agent errors might be subtle or only appear in production. Changing test logic or assertions (an agent can "make tests pass" by weakening assertions), modifying shared page objects, any multi-file refactor. Read the diff with the same care you'd give a junior developer's PR.

**Red zone — human-led, agent-assisted:** Tasks where agent errors can have consequences outside of tests. Authentication logic, CI/CD configuration, database migrations, production configs. Use the agent to draft and explain, but you make every decision and apply every change yourself.

## Why agents are genuinely transformative for QA engineers

The tasks that consume the most QA time are often the most mechanical: finding all tests that use a deprecated pattern, updating selectors after a UI change, setting up the scaffolding for a new test module. These are pattern-heavy, repetitive, multi-file tasks — exactly what agents excel at.

The estimation from the session is instructive. A task that takes a human 40 minutes of find-read-edit-verify cycles can take an agent 20 minutes of running while you watch. Four times a day, that's 2.5 hours reclaimed per week. Per month, that's more than a full workday.

The compounding effect matters too: every time you delegate a task, you learn to delegate better. Agent users improve their prompting over time, gradually developing an intuition for what the agent needs to know upfront.

## FAQ

**Q: Is Stage 4 replacing earlier stages?**
No — each stage is still useful for specific situations. Inline completions are faster than an agent session for writing a single function. Chat is faster than a terminal agent for a one-off question. Terminal agents are worth the overhead only when the task genuinely spans multiple files or requires verification. Use the tool that matches the scope of the task.

**Q: "The agent did 80% of the work" — does that mean my skills matter less?**
The opposite. Your skills are applied to higher-value work: specifying what needs to be done, reviewing whether the implementation is correct, catching edge cases the agent missed, making architectural decisions. The 20% you do is the 20% that requires actual judgment.

**Q: What does it mean when the agent "verifies its own work"?**
It runs the test command you specified (or one it infers from your project), reads the output, determines whether the result is correct, and if not, makes another attempt at fixing the problem. It's a loop: edit → run → read output → fix → run again. This is the "verification" property in action.

**Q: How do I know if a tool is a true Stage 4 agent?**
Ask five questions: Can it decide what to do next without being told? Can it read and write files? Does it maintain context across many steps? Can it plan a multi-step execution? Can it run tests and fix failures it finds? If all five answers are yes, it's a Stage 4 agent.

**Q: The trust spectrum sounds like extra work — why not just review everything the same way?**
Because green-zone tasks have automatic verification built in: tests pass or fail. Spending 10 minutes reviewing an import statement addition is wasted time. Spending 10 minutes reviewing a change to your authentication test's assertion logic is essential. Calibrating your review effort to the risk level is a professional skill, not laziness.
