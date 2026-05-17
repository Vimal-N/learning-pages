---
layout: reference.njk
title: "Session 13 Reference — Working Effectively with Terminal Agents"
sessionNumber: "13"
sessionTitle: "Working Effectively with Terminal Agents"
phase: "Phase 4: Terminal Agents & Agentic Tools"
topicName: "AI in Practice"
topicUrl: "/topics/ai-in-practice/"
---

## Quick Reference

<div class="ref-cheatsheet-block">

### The GCSV formula

| Letter | Element | What it provides | Example |
|---|---|---|---|
| **G** | Goal | The end state — what you want achieved | "Add Playwright E2E tests for the password reset flow" |
| **C** | Context | What the agent needs to know | "Playwright + TypeScript. Read tests/pages/loginPage.ts for the pattern." |
| **S** | Scope | What is and is NOT in bounds | "Create new files in tests/auth/ only. Do not modify existing files." |
| **V** | Verification | How to confirm it worked | "Run npx playwright test tests/auth/ and confirm all tests pass." |

> **G + C + S + V = a prompt the agent can complete without asking clarifying questions**

</div>

<div class="ref-cheatsheet-block">

### GCSV in practice — a complete worked example

**Starting idea:** "I need tests for the login page"

**Built into GCSV:**

> **Goal:** Add Playwright E2E tests covering the login page (/login) — valid login, invalid credentials, forgot password link.
>
> **Context:** App uses React + TypeScript. Auth API is at /api/auth/login. Read tests/pages/loginPage.ts — follow its Page Object pattern. Selectors use getByTestId() convention.
>
> **Scope:** Create tests/pages/loginPage.ts and tests/e2e/login.spec.ts only. Do not modify any existing files.
>
> **Verification:** Run npx playwright test tests/e2e/login.spec.ts and confirm all 3 tests pass before finishing.

</div>

<div class="ref-cheatsheet-block">

### Vague vs structured — the difference at a glance

| | Vague | Structured |
|---|---|---|
| Prompt | "Write tests for the user profile page" | Full GCSV with framework, patterns, scope, and verification command |
| Time to write | 15 seconds | 2 minutes |
| Result | Generic, doesn't match your codebase | Project-specific, follows your conventions |
| Iterations needed | 3–5 | 0–1 |

</div>

<div class="ref-cheatsheet-block">

### The git safety workflow — every session

```bash
# BEFORE the session
git add -A && git commit -m "pre-agent checkpoint"

# DURING — review every diff before approving

# AFTER (if the result is good)
git diff           # review all changes
npm run test:e2e   # verify nothing broke
git commit -am "agent: [describe what was done]"

# AFTER (if the result is wrong)
git restore .      # undo everything instantly
```

</div>

<div class="ref-cheatsheet-block">

### Reading agent output — green flags and red flags

| Green flags (agent working well) | Red flags (review carefully) |
|---|---|
| Asked a clarifying question before starting | Modified files you didn't mention |
| Described its plan before writing any files | Skipped the verification step entirely |
| Created/modified only files in scope | Code has `// TODO: implement` placeholders |
| Ran the verification command | Changed assertions in existing tests to make them pass |
| Code matches your existing patterns | Selector patterns don't match your conventions |
| Tests pass without modifying existing tests | Tests pass by marking as `.skip` or `.todo` |

</div>

<div class="ref-cheatsheet-block">

### Iteration patterns — how to follow up

| Pattern | When to use | Example |
|---|---|---|
| **Redirect** | Wrong approach entirely | "Stop using class selectors. Use getByRole() and getByTestId() instead. Redo the selectors." |
| **Refine** | Right direction, needs adjusting | "Good start. Add a test for the forgot password link and rename all tests to present tense." |
| **Explain first** | Unsure whether to change | "Why did you use networkidle here? Is there a better alternative?" |

</div>

<div class="ref-cheatsheet-block">

### When things go wrong — recovery patterns

| Problem | Recovery |
|---|---|
| Agent is looping without progress | Stop session, start fresh with smaller, more constrained task |
| Generated code has errors | Paste the exact error output back: "Running the code produced this error: [paste]. Fix it." |
| Went completely wrong direction | `git restore .` to reset, restart with clearer description |
| Agent ignores your constraints | Restate them at the top of next message: "IMPORTANT: Only create new files. Do not modify existing files." |

</div>

---

## Full Reference

## Why task description quality determines outcome quality

A terminal agent can generate excellent results or disappointing results from the same underlying model, depending entirely on how you describe the task. This is not a metaphor — the same agent on the same codebase produces dramatically different output based on what it's told.

A vague prompt ("write tests for the user profile page") leaves the agent guessing on every decision it makes: which framework, where to create files, what patterns to follow, which scenarios to cover, whether to run the tests. Each guess introduces variance. The result is code that may be technically valid but doesn't fit your codebase.

A structured prompt (GCSV) eliminates the guesswork. The agent knows what it's building, what context to read, what it can and can't touch, and how to verify success. The result fits your codebase because you gave it the information it needed.

Two minutes of upfront clarity saves 30 minutes of back-and-forth correction.

## The GCSV formula in depth

**G — Goal**

The end state, not the steps. Describe what you want to exist when the task is complete.

- Wrong: "Find the login tests and update them"
- Right: "Add three new Playwright E2E tests for the password reset flow: successful reset, expired link, and invalid email"

The goal tells the agent what "done" looks like. Without it, the agent might execute a series of actions without understanding the intended endpoint.

**C — Context**

Everything the agent needs to know that it can't figure out from reading your code alone. This includes: which framework and version you're using, which existing files to read as pattern reference, relevant business rules that shape the test scenarios, any non-obvious constraints on the environment.

The most important part of Context is often **which existing file to read as a reference**. "Read tests/pages/loginPage.ts and follow the same pattern" is more valuable than a paragraph of explanation, because the agent reads the actual implementation and infers the convention from it.

**S — Scope**

Both what is in bounds and what is not. Explicit negative scope ("do not modify any existing files") is just as important as positive scope ("create files in tests/auth/").

Without scope, the agent makes judgment calls about what it's allowed to touch. Those judgment calls are sometimes wrong — it might helpfully update a shared utility that changes the behaviour of other tests, or add a dependency to package.json you didn't want.

"Only create new files in tests/auth/. Do not modify any existing files." is two sentences that prevent an entire category of mistakes.

**V — Verification**

The exact command the agent should run to confirm the task is complete. This connects directly to the "verification" property that makes agents genuinely autonomous — they can check their own work if you tell them how.

"Run npx playwright test tests/e2e/login.spec.ts and confirm all 3 tests pass before finishing" gives the agent a concrete success criterion. It will run this command, read the output, fix any failures, and only report success when the tests actually pass.

If you omit this, the agent has no way to know if it succeeded. It may report that files were created without knowing whether the tests work.

## What happens after you press Enter

Understanding the agent's internal loop turns anxiety ("what is it doing?") into informed observation.

**Exploration phase (Steps 1–3):** The agent builds its mental model of your project. This is where the quality of your CLAUDE.md and the quality of your GCSV prompt make the biggest difference. With good context, the agent reads the right files and understands your project's structure before writing anything. Without context, it guesses.

**Step 1 — Exploration:** Lists directories, reads CLAUDE.md if present, identifies relevant files from your task description.

**Step 2 — Context building:** Reads the files you mentioned and related ones. The Page Object you referenced, the test file it's similar to, the config file — building understanding before writing.

**Step 3 — Planning:** Often announces its plan before executing. "I'll create X, Y, Z files with the following structure..." If the plan is wrong, this is the right moment to correct it — before any files are written.

**Step 4 — Permission prompts:** Shows you each change or command before executing. `y` = approve this once, `n` = reject, `a` = yes to all of this type. Read these; don't click through them.

**Step 5 — Verification:** Runs the command you specified, reads the output, fixes failures, reports the final result — or asks you for help if it can't fix something.

## Context management in long sessions

Agent sessions have a context limit — like working memory. CLAUDE.md content, your task prompt, the files the agent read, the agent's reasoning, and the command outputs all consume context. In very long sessions, the agent may lose track of instructions from early in the conversation.

**Symptoms of context exhaustion:**
- The agent ignores constraints it respected earlier in the session
- It generates code that contradicts decisions made in earlier steps
- It starts asking questions about things it already read

**Prevention strategies:**
- Keep sessions focused on one task — don't chain unrelated tasks in the same session
- For multi-stage tasks, start a fresh session with a new GCSV prompt for each stage
- Restate key constraints at the start of each new session
- Use CLAUDE.md to give the agent persistent context rather than relying on in-conversation instructions
- At the end of a long session: "Summarise what was done so I can paste it into a new session"

## Decomposing large tasks into stages

Large, vague tasks ("set up our entire Playwright test framework with Page Objects, fixtures, CI config, and tests for all 12 features") are where terminal agents most often produce disappointing results. The task is too large, the context window fills, and the agent either produces something incomplete or starts making poor decisions without enough remaining context.

Break large work into stages, each with its own GCSV prompt:

**Instead of one huge task:**
"Set up our entire Playwright test framework with Page Objects, fixtures, CI config, and write tests for all 12 features"

**Use staged sessions:**

- Session 1: "Set up folder structure, install Playwright, configure playwright.config.ts. Verify: `npx playwright --version` runs cleanly."
- Session 2: "Create base Page Object classes and auth fixtures. Verify: fixtures load without error with `npx playwright test --list`."
- Sessions 3–N: One feature's tests per session, each with its own verification command.

Each stage produces a verifiable checkpoint. If Stage 2 fails, you know exactly where the problem is. If Stage 1 succeeds, you have a clean foundation to build from.

## Iterating on agent output

First results from a terminal agent are rarely the final result. The skill is in iterating effectively.

**Redirect — change approach entirely:**
The agent used CSS class selectors throughout when you use data-testid. Don't ask it to fix one at a time.

> "Stop using class selectors. Use getByRole() and getByTestId() instead. Redo the selectors in the Page Object you just created."

**Refine — keep the direction, adjust the output:**
The structure is right but some tests are missing and the names aren't following your convention.

> "Good start. Add a test for the forgot password link. Rename all test descriptions to follow 'should [behaviour] when [condition]' format."

**Explain before changing:**
The agent made a choice you're uncertain about — it might be right.

> "Why did you use page.waitForLoadState('networkidle') here? Is there a better alternative for this case?"

Sometimes the answer is: yes, that's the right choice, and here's why. Understanding before changing prevents you from accidentally making things worse.

## The git safety habit in detail

Commit before every agent session. Without exception. This is the single most important safety practice for agent use.

**Why it matters:** If the agent produces a bad result — wrong approach, wrong files, incorrect logic — `git restore .` returns you to a clean state in three seconds. Without a commit, recovering from a bad session means manually undoing every change the agent made.

**The secondary benefit:** A clean git state before the session means a clean diff after. You can run `git diff` and see exactly what the agent changed. This makes reviewing the output faster and reviewing it more thoroughly. You can also selectively keep some changes and discard others with `git checkout -- <file>`.

**After a successful session:**
```bash
git diff              # review what the agent did
npm run test:e2e      # verify tests pass
git commit -am "agent: add password reset tests"
```

**After a bad session:**
```bash
git restore .         # undo everything
# start fresh with a better task description
```

Treating every agent session as a speculative experiment — with a checkpoint that makes it safe to experiment — removes the anxiety from agent use and makes you more willing to try ambitious tasks.

<div class="ref-page-break"></div>

## FAQ

**Q: How long should a GCSV prompt take to write?**
About 2 minutes for a typical task. The goal of the formula is not to make you write long prompts — it's to make you pause and think through four specific things before you start. A focused 2-minute prep usually saves 30+ minutes of incorrect output and re-prompting. For complex tasks, it might take 5 minutes. That is always worth it.

**Q: What if I don't know the verification command?**
Look at your package.json scripts first. If the project has `npm run test:e2e`, use that. If you're unsure, ask the agent to find it: "Look at package.json and identify the correct command to run the E2E test suite." The agent is good at reading configuration and finding the right commands.

**Q: The agent modified files outside my scope. What should I do?**
Do not approve the changes. If you've already approved them, run `git restore <file>` on the affected files to revert just those changes while keeping the ones you want. Then start a new session with more explicit scope: "IMPORTANT: Do not modify any existing files. Only create new files in tests/auth/. If you believe you need to modify an existing file, ask me first."

**Q: How do I handle an agent that keeps getting stuck on the same error?**
Stop the session. Start fresh with the specific error included in your context: "I need to fix a Playwright error. Here is the error: [paste exact error text]. The failing test is in tests/checkout.spec.ts, line 45. Fix only the assertion that's failing." Smaller, more targeted tasks with concrete error information almost always produce better results than asking a stuck agent to try again.

**Q: My team doesn't all use terminal agents. Does GCSV still apply to Copilot Chat?**
Yes — the GCSV formula applies to every AI tool. The letters are the same, but the mechanics are different. In Copilot Chat, you provide Context manually by pasting relevant code. Scope means specifying which file to modify. Verification means telling it what to look for in the result. The formula is universal; terminal agents just automate more of the execution.
