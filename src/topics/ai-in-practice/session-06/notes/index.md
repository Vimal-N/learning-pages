---
layout: reference.njk
title: "Session 06 Reference — Copilot Agent Mode: Your First Taste of Autonomous AI"
sessionNumber: "06"
sessionTitle: "Copilot Agent Mode — Your First Taste of Autonomous AI"
phase: "Phase 2: GitHub Copilot Mastery"
topicName: "AI in Practice"
topicUrl: "/topics/ai-in-practice/"
---

## Quick Reference

### Enabling Agent Mode

- Open Copilot Chat (`Ctrl+Alt+I` / `⌃⌥I`)
- Click the mode dropdown at the top of the chat panel
- Select **Agent**
- Requires a paid Copilot plan (Individual, Business, or Enterprise) — not available on the free tier

### The good agent prompt formula

> **Goal:** What you want the end result to be (in terms of the project, not steps to take)
> **Context:** What the agent needs to know — relevant files, patterns, frameworks
> **Constraints:** What it must not do — files to leave alone, patterns to follow, scope limits
> **Verification:** How to confirm the task is done — run this command, check this output

### When to use vs avoid Agent Mode

| Use Agent Mode for | Use Chat or completions instead |
|---|---|
| Building a complete test file from scratch | Adding a single test case to an existing file |
| Refactoring an entire test suite to use Page Objects | Fixing a single failing assertion |
| Setting up a new testing framework or configuration | Asking a question or getting an explanation |
| Fixing multiple failing tests after an API change | Generating a short snippet you'll paste manually |
| Creating Page Objects for all pages in a feature area | Understanding what a piece of code does |

### Review checklist before approving each change

- Do I understand what this change does?
- Is it only touching the files I expected?
- Are the selectors real — do they exist in the actual DOM?
- Are the assertions testing behaviour, not just element presence?
- Would I write this the same way if I wrote it manually?

---

## Full Reference

## What makes Agent Mode different from Chat

Copilot Chat (standard mode) is reactive: you send a message, it generates a response, you copy code and apply it manually. You're in the loop for every step.

Agent Mode changes the operational model. You give it a goal — a description of the desired end state — and the agent works through the steps to achieve it. It can:

- Read your project files to understand your patterns before generating anything
- Create new files and edit existing ones
- Run terminal commands (like `npx playwright test`) and read the output
- See if a test fails, diagnose the failure, and make corrections — without you prompting each step

The key distinction: in Chat, you orchestrate every step. In Agent Mode, you describe the destination and supervise the journey.

## Writing goals that work

The most common reason Agent Mode produces disappointing results is an unclear goal. The agent needs to understand the desired outcome, the relevant context, the boundaries of the task, and how to verify success.

**Poor goal:**
> "Add some tests for the checkout flow"

This tells the agent the domain (checkout) but nothing about scope, framework, patterns, files to touch, scenarios to cover, or how to verify. The agent will make all those decisions itself — and they may not match what you wanted.

**Well-formed goal:**

> **Goal:** Add Playwright TypeScript E2E tests for the payment step of the checkout flow.
>
> **Context:** Checkout flow starts at `/cart`. Payment page is at `/checkout/payment`. We use Stripe test cards (details in `tests/fixtures/stripe.ts`). Existing checkout tests are in `tests/checkout/cart.spec.ts` — use the same Page Object and fixture pattern.
>
> **Constraints:**
> - Create new files only in `tests/checkout/`
> - Do not modify any existing test files or Page Objects
> - Use only selectors from `tests/pages/checkoutPage.ts` — do not add raw selectors to the spec file
>
> **Verification:** Run `npx playwright test tests/checkout/payment.spec.ts` and confirm all tests pass

This version is unambiguous. The agent has everything it needs to act without guessing.

## The approval workflow — why it matters

Agent Mode shows you every file change before it applies it. This is not a formality — it's the control mechanism that makes agent use safe.

**The sequence:**
1. Agent describes its plan before doing anything — you can stop here if the plan is wrong
2. Each file change appears as a diff (green = added, red = removed)
3. You review the diff and either accept, reject, or redirect with a correction
4. After file changes, the agent may run a verification command and show you the output
5. If tests fail, it reads the error and attempts a fix — showing you the new diff before applying

**What to actually look at in each diff:**
- **Scope:** Is it only touching the files you expected? If it's touching files outside the scope you gave, reject and add a tighter constraint.
- **Selectors:** Are they from your Page Object, or did it invent new raw selectors? Invented selectors look plausible but often don't exist.
- **Assertions:** Does the test actually verify the behaviour, or just that an element is visible?
- **Imports:** Are all imports valid for your project's dependencies?

Clicking through diffs without reading them defeats the purpose. A quick 30-second review of each diff is the difference between a high-value workflow and a debugging session tomorrow.

## Common mistakes and how to avoid them

**Mistake 1 — Vague goal, unpredictable output**
A goal like "improve our test coverage" gives the agent no boundary. It may start modifying files across your entire project. Always specify scope: which feature, which directory, which files.

**Mistake 2 — Approving changes without reading the diffs**
The agent is confident and fast. It's easy to click through diffs assuming they're correct. The agent can be confidently wrong — especially about selectors and assertion logic. Read every diff.

**Mistake 3 — Trusting passing tests as proof of correctness**
Agent Mode can run `npx playwright test` and confirm tests pass. But a test that always passes regardless of application state is a false positive. After the agent finishes, review the assertions in the generated tests separately from whether they ran without error.

**Mistake 4 — No scope constraints on the goal**
Without explicit constraints, the agent may helpfully "fix" files you didn't ask it to touch. It sees your whole project and may decide something else needs attention. `"Do not modify any existing files"` or `"Only create files in tests/checkout/"` prevents this.

**Mistake 5 — Using Agent Mode for small tasks**
Agent Mode has overhead — it reads files, plans steps, waits for approvals. For a one-line fix or a quick question, it's slower than just using Chat. Reserve it for tasks that genuinely span multiple files or require multiple sequential steps.

## Redirecting mid-task

If the agent's approach is going in the wrong direction, you don't have to reject everything and start over. You can redirect in the approval step:

> "Don't use `page.goto()` here — use the `navigateToLogin()` method from the loginPage Page Object instead"

The agent adjusts its approach and regenerates the diff. This is more efficient than starting from scratch with a new prompt.

## FAQ

**Q: Can Agent Mode break my codebase?**
It can make changes you'll need to revert — but only if you approve them. If you reject every diff, nothing changes. The practical risk is approving something that looks right but has a subtle issue (wrong assertion logic, invented selector). This is why the review step is essential, not optional.

**Q: What's the difference between Agent Mode and what we'll learn about Claude Code in Phase 4?**
Agent Mode runs inside VS Code and is bounded to your current project. Claude Code and Opencode run in your terminal and have broader capabilities — they can manage git history, work across multiple directories, browse URLs, and run more complex multi-step workflows. The agent pattern is the same; the scope and power are different. Phase 4 builds on everything you learn here.

**Q: My agent ran the tests and they passed, but I think the tests aren't actually testing the right thing. What do I do?**
This is exactly the right instinct to have. "Tests pass" and "tests are correct" are different things. After any agent-generated test session, go through the assertions manually and ask: if the feature broke in this specific way, would this test catch it? If the answer is no, the test needs fixing regardless of its pass status.

**Q: How do I stop an agent run partway through?**
Click **Stop** in the Copilot Chat panel. The agent stops. Any changes that were already applied (approved diffs) remain — you'll need to undo them manually in VS Code or via `git checkout` if you want to revert.
