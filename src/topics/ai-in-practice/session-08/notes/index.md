---
layout: reference.njk
title: "Session 08 Reference — Debugging Tests with AI: Stop Guessing, Start Asking"
sessionNumber: "08"
sessionTitle: "Debugging Tests with AI — Stop Guessing, Start Asking"
phase: "Phase 3: AI for Test Automation & Debugging"
topicName: "AI in Practice"
topicUrl: "/topics/ai-in-practice/"
---

## Quick Reference

### The debugging brief — what to always include

> **Framework + version:** e.g. Playwright v1.44, TypeScript, headless Chrome
> **What the test is supposed to do:** one sentence
> **Full error output:** the complete message and stack trace — not just the first line
> **The test code:** the relevant test block (not the entire file unless needed)
> **When it fails vs when it passes:** local only? CI only? Every time? Intermittently?
> **What you've already tried:** so the AI doesn't suggest something you've ruled out

### Error type patterns — what context matters most

| Error type | Most important context to include |
|---|---|
| `TimeoutError: locator not found` | The selector, a screenshot if available, whether it fails in headless vs headed |
| `Error: strict mode violation — multiple elements match` | The selector, the number of matching elements, the page HTML around them |
| Assertion failure (`Expected X, received Y`) | The assertion, the actual value, whether the value is dynamic or static |
| Test passes locally, fails in CI | Environment differences: headless vs headed, base URL, timing, env vars |
| Flaky test (fails 1 in N runs) | Whether it's timing-related, whether there's shared state between tests, the CI run logs |
| Import / type error | The full error with file path and line number, the relevant import statement |

### Quick checklist before asking AI

- Do I have the **full** error message (not just the summary line)?
- Do I know **when** it fails — every time, intermittently, only in CI?
- Have I included the **test code** in the prompt, not just the error?
- Have I tried running the test in **headed mode** locally to see what's happening on screen?

---

## Full Reference

## Why "my test is failing, fix it" doesn't work

The most common pattern when developers ask AI for debugging help: paste the error message, get back a generic list of possible causes, feel no closer to a solution.

The reason is missing context. An LLM generating debugging suggestions is pattern-matching: "given this error and this context, the most likely cause is X." The error message alone is often ambiguous — `TimeoutError: locator not found` has dozens of possible causes. Without knowing your framework version, whether it fails headlessly, what the test is trying to do, and what you've already tried, the AI is guessing from a very broad probability distribution.

The debugging brief structure exists to give the AI what it needs to narrow the distribution to the actual cause.

## Building the full debugging brief

**Framework and version:**
Playwright 1.40 and 1.44 have different default timeout behaviours. Cypress has different async patterns than Playwright. The version matters for the specific API suggestions the AI will give. Always include it.

**What the test is supposed to do:**
One sentence. Not the entire feature spec — just enough to understand the intent. "This test logs in as a standard user and verifies the dashboard header shows the user's name." This helps the AI understand whether a suggested fix makes semantic sense, not just technical sense.

**The full error output:**
Copy the entire error message and stack trace, not just the first line. The stack trace often contains file names, line numbers, and selector strings that are essential for diagnosis. The first line alone ("TimeoutError") is almost useless without the details that follow.

**The test code:**
Paste the specific `test()` block or the surrounding `describe()` block. If the test uses a Page Object method, paste that method too — the AI can't see your files unless you paste them.

**When it fails:**
- Only in CI, not locally → likely environment difference (headless, base URL, env vars, timing)
- Only locally, passes in CI → unusual — often a local env or state issue
- Every time → deterministic failure — likely selector, assertion, or async issue
- Intermittently → flaky — likely timing, shared state, or race condition

**What you've already tried:**
This is often skipped and it's expensive to skip. If you've already tried adding `waitForSelector`, the AI will often suggest that first. Telling it "I've tried adding explicit waits — didn't help" eliminates that branch and focuses the response on what you haven't tried.

## Diagnosing common error types

### TimeoutError: locator not found

This means Playwright waited the full timeout for a locator to appear in the DOM and it never did.

**Most common causes:**
- Selector is wrong (the element exists but the selector doesn't match it)
- Element exists but isn't visible (in the DOM but hidden with CSS)
- Page hasn't finished loading when the locator is attempted
- Element is inside an iframe that hasn't been accessed
- Element only exists in headed mode, not headless (some browser/page configurations differ)

**What to include in your debugging brief:**
- The exact selector string
- Whether you can see the element when you run the test in headed mode (`npx playwright test --headed`)
- Whether the test uses `page.goto()` before the locator call, and whether that navigation completes
- A screenshot from the test failure if available (Playwright can be configured to capture these)

**Diagnostic prompt:**
> Playwright v1.44, TypeScript. Test fails on `page.locator('[data-testid="submit-btn"]').click()` with `TimeoutError: locator not found`. Test runs locally with `--headed` and passes. Fails in CI (GitHub Actions, headless Chrome). The page is at `/checkout/payment`. Full error: [paste]. Test code: [paste]. What are the most likely causes specific to the local vs CI difference?

### Strict mode violation — multiple elements matched

Playwright's strict mode (default in most locator calls) throws an error if more than one element matches your locator.

**Your prompt should include:**
- The selector that matched multiple elements
- How many elements it matched (Playwright's error message usually says)
- The context — is this a list page? Is the selector inside a loop?

**AI is good at suggesting more specific selectors:** Given your selector and the element's purpose, it can suggest alternatives using `nth()`, `filter()`, or `within()` to narrow to the specific element you want.

### Test passes locally, fails in CI

This is the category where context is most valuable because the failure is environment-dependent.

**Common causes and diagnostic questions:**

| Possible cause | Ask the AI about |
|---|---|
| Headless vs headed rendering | "Does this element behave differently in headless Chrome? Here's what it does: [description]" |
| Timing / slower CI machines | "Could these timeouts be too tight for a CI environment? What's a safe multiplier for CI?" |
| Base URL difference | "Our CI uses `https://staging.app` but localhost tests use `http://localhost:3000`. Could this affect [specific behaviour]?" |
| Environment variables missing | "The test uses `process.env.TEST_USER_EMAIL` — what happens if that's undefined in CI?" |
| Test isolation failure | "Tests pass individually in CI but fail when run as a suite. What shared state issues should I check for?" |

### Flaky tests

Flakiness is the hardest category to debug because the failure is non-deterministic. AI is most useful for identifying categories of cause rather than pinpointing the exact issue.

**The most productive framing:**

> This test passes 9 in 10 CI runs but fails intermittently. When it fails, the error is always [error type]. The test does [describe what it does]. Here's the test code: [paste]. What are the most likely categories of cause for this type of intermittent failure, and what would I check first?

**Common causes AI reliably identifies:**
- Network request timing (the test doesn't wait for an in-flight API call before asserting)
- Animation timing (the test clicks an element that's mid-transition)
- Shared state between tests (a previous test leaves data that affects this one)
- Race condition between two async operations
- Retry logic in the app interfering with test assertions

## Verifying AI debugging suggestions

AI debugging suggestions are hypotheses, not diagnoses. The model doesn't have access to your actual application — it's pattern-matching from training data. A suggested fix should be tested, not just applied.

**When the AI suggests a fix:**
1. Understand the suggestion before applying it — why would this fix the issue?
2. Apply the fix in isolation (don't make multiple changes at once)
3. Run the test multiple times, not just once, especially for flaky failures
4. If the fix works, understand why so you can apply the principle elsewhere

**Warning signs in an AI debugging suggestion:**
- It suggests adding `await page.waitForTimeout(2000)` — this is almost always masking a timing issue rather than fixing it. Ask: "what should I wait for specifically, instead of a fixed delay?"
- It gives you a list of 7 possible causes without prioritising them — ask: "given the local-vs-CI pattern specifically, which of these is most likely?"
- It suggests a fix that changes behaviour outside the failing test — narrow the scope

## FAQ

**Q: Copilot keeps suggesting I add a fixed `waitForTimeout`. Is that good practice?**
No. `waitForTimeout(2000)` adds a 2-second unconditional pause — it makes the test slower and doesn't fix the root cause. What you want is `waitForResponse`, `waitForSelector`, `waitForLoadState`, or a specific assertion with a retry pattern. Ask the AI: "Instead of a fixed timeout, what condition should I actually wait for here?"

**Q: My test fails with a completely different error each time it's flaky. What does that tell me?**
Multiple different errors usually means shared state — something from a previous test is affecting this one, and the effect varies depending on run order. Ask the AI: "These are the different errors I see on different runs: [list]. They all involve [describe the test]. What shared state issues might cause non-deterministic errors in a test like this?"

**Q: AI gave me a fix that worked for a week and then the test became flaky again. What happened?**
The fix probably masked the root cause rather than resolving it. A timing-related fix that works in normal conditions may break again when the CI machine is slower, or when the test data grows, or when a new test is added before this one. Masking-type fixes (adding waits, retry wrappers) buy time but don't solve the problem.

**Q: Should I paste my full test file or just the failing test?**
Usually just the failing `test()` block plus the Page Object methods it calls. If the test depends on setup in a `beforeEach`, include that too. Only paste the full file if the failure might be caused by test ordering or shared state across tests in the same file.
