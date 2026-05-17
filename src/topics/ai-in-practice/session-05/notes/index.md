---
layout: reference.njk
title: "Session 05 Reference — Copilot in Your Daily Workflow"
sessionNumber: "05"
sessionTitle: "Copilot in Your Daily Workflow"
phase: "Phase 2: GitHub Copilot Mastery"
topicName: "AI in Practice"
topicUrl: "/topics/ai-in-practice/"
---

## Quick Reference

### 8 daily workflow patterns

| Pattern | Use completions or chat? | Key prompt ingredient |
|---|---|---|
| Write a test from scratch | Chat | Acceptance criteria + framework + output path |
| Extend an existing test suite | Chat + completions | Reference the existing file with `#file:` |
| Generate test data / fixtures | Chat | Data shape, variation types, output format |
| Understand unfamiliar code | Chat | Paste the code, ask for plain-English explanation |
| Debug a failing test | Chat | Full error + test code + conditions when it fails |
| Refactor duplicated test code | Chat | Paste the duplication, ask for a Page Object or helper |
| Write inline with completions | Completions | Clear function/test name + comment above the function |
| Ask a quick question | Chat | Just ask — no special structure needed |

### Completions vs Chat — when to use which

| Use completions when | Use Chat when |
|---|---|
| You're mid-flow and want a suggestion | You want to describe a task and get a full result |
| The code pattern is repetitive and predictable | You need to explain context before asking |
| You want short snippets or boilerplate | You want explanation, not just code |
| The file context is enough to guide the output | You need to reference other files (`#file:`) |

### Getting completions to match your style

- Open the file whose pattern you want Copilot to match — it learns from your open files
- Write a descriptive function or test name before the body
- Write a comment above the function describing the test scenario
- Accept word-by-word (`Ctrl+Right` / `⌘Right`) when a suggestion is mostly right

---

## Full Reference

## Pattern 1 — Writing a test from scratch

This is the highest-value daily use case. You have a feature to test and a blank file. Instead of writing the entire test manually, you describe what you need and Copilot writes the implementation.

**What makes this work:**
The quality gap between a good and a poor prompt here is significant. The model needs to know the framework, the location of relevant files, and what scenarios to cover. Without this, it generates generic boilerplate that doesn't fit your project.

**Prompt structure:**

> I need Playwright TypeScript tests for the user registration feature.
> Acceptance criteria:
> - Email must be unique — duplicate email shows error: "An account with this email already exists"
> - Password must be at least 8 characters with one uppercase and one number
> - On success, redirect to /dashboard and show welcome banner
> - Form submit button is disabled during API call
>
> Page Object pattern is in `tests/pages/`. Use `#file:tests/pages/homePage.ts` as the style reference.
> Output to `tests/registration/registration.spec.ts`.
> Don't create additional files.

**What to check in the output:**
- Selectors: does the generated code use selectors that actually exist in your DOM? Copilot invents plausible-sounding selectors based on what it can see — they may not match your real elements. Always verify against the browser.
- Assertions: are they checking the right thing? "expect a toast to be visible" is weaker than "expect the specific error message text to match."
- Imports: are the imports correct for your framework version?

## Pattern 2 — Extending an existing test suite

You already have a test file and want to add new scenarios without disrupting what's there.

**The key technique:** Use `#file:` in Chat to reference your existing test file. This gives Copilot the context it needs to match your exact style — the describe block structure, fixture usage, assertion style, variable naming.

> I want to add 3 more test cases to `#file:tests/checkout/checkout.spec.ts`.
> New scenarios to cover:
> 1. Guest checkout without an account
> 2. Checkout with an expired promo code — should show "Code has expired" error
> 3. Checkout when one item goes out of stock mid-session
>
> Match the existing test structure exactly — same describe blocks, same fixture pattern.

**What to watch for:** When extending an existing file, Copilot may regenerate the entire file with additions rather than giving you only the new tests. Specify "output only the new `test()` blocks — I will add them manually" if you want to avoid a full-file regeneration.

## Pattern 3 — Generating test data and fixtures

Realistic test data is tedious to write but important for meaningful tests. Copilot is efficient at generating varied, realistic datasets.

**Prompt for a fixture file:**

> Generate a JSON fixture file at `tests/fixtures/users.json`.
> I need 12 users covering these scenarios:
> - Standard user (active)
> - Admin user
> - Read-only user
> - User with MFA enabled
> - User with expired password
> - Locked account (too many failed logins)
> - New user (no profile completed)
> - User with no profile photo
>
> Use realistic UK first names, surnames, and email formats.
> Each user should have: id, email, password (plain text for test use), role, status, mfaEnabled, profileComplete.

**For boundary value data:**

> Create an array of test inputs for the date-of-birth validation field. Cover:
> - Valid adult (18+)
> - Exactly 18 today (boundary)
> - One day under 18 (boundary)
> - Very old date (100+ years)
> - Future date
> - Invalid format variations: "13/32/1990", "1990-13-01", "not-a-date"
> - Empty string
> Output as a TypeScript array of `{ input: string; expectedError: string | null }`.

## Pattern 4 — Understanding unfamiliar code

When you're asked to test a function or component you've never seen before, asking Copilot to explain it first saves significant time.

**What works:** Be specific about what you want explained.

> Explain what this function does in plain English. Focus on:
> 1. What input it expects and what it returns
> 2. What the main logic paths are
> 3. What could make it fail or produce unexpected output
> Don't include code in the response.

Asking for "the main logic paths" and "what could make it fail" is far more useful for test planning than a generic "explain this function" — those two points directly map to test scenarios.

## Pattern 5 — Debugging failing tests

Debugging is where context makes the biggest difference. The more specific you are about the failure, the better the diagnosis.

**The debugging brief:**

> Framework: Playwright v1.44, TypeScript, headless Chrome
> Test: `tests/checkout/checkout.spec.ts` — "should complete purchase with saved card"
> Error:
> ```
> [paste the full error message and stack trace here]
> ```
> Test code:
> ```typescript
> [paste the relevant test code here]
> ```
> When it fails: only in CI (GitHub Actions), passes locally every time
> What I've tried: adding explicit `waitForSelector` before the click — didn't help

The "when it fails" element is especially valuable. Local-only or CI-only failures usually have specific causes (headless vs headed, network timing, environment variables) and that context points the diagnosis in the right direction.

## Pattern 6 — Refactoring duplicated test code

Test suites accumulate duplication over time. Page selectors repeated across 15 files, the same login setup in every test, fixture data hardcoded instead of referenced.

**Asking Copilot to find duplication:**

> Here are three test files from our suite: `#file:tests/auth/login.spec.ts`, `#file:tests/auth/reset.spec.ts`, `#file:tests/profile/update.spec.ts`.
> Identify the duplicated code patterns (selectors, setup logic, assertions).
> Suggest what should be extracted into a shared Page Object or helper.
> Don't generate the refactored code yet — just describe the extraction plan.

Getting the plan before the code lets you validate the approach before Copilot makes changes you then have to unpick.

## FAQ

**Q: Copilot keeps using `.click()` instead of `page.click()` — how do I fix this?**
Your open file context is probably not strongly signalling Playwright. Add `import { Page } from '@playwright/test';` at the top if it's missing, and reference an existing Playwright file with `#file:`. Copilot adapts quickly once it has a clear signal.

**Q: The generated tests use selectors that don't exist in our app. What should I do?**
This is the most common issue. Copilot invents plausible selectors based on the context it has. If you don't provide the actual selectors (from the app's HTML or your existing Page Object), it guesses. The solution: reference your Page Object file with `#file:` so Copilot uses the real selectors, or paste the relevant part of the Page Object into the prompt.

**Q: Chat gives me different results each time for the same prompt. Is that normal?**
Yes. LLMs have inherent variability — the same prompt can produce different but equally valid responses on different runs. If you're not happy with a response, try regenerating (the circular arrow icon) rather than rewording the entire prompt.

**Q: How much context is too much to paste?**
Copilot Chat has a context limit (measured in tokens). A few hundred lines of code is fine. Pasting an entire large repository is not. For large projects, be selective — paste the specific file or function that's relevant, not the whole project.
