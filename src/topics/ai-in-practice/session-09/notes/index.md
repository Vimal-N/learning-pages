---
layout: reference.njk
title: "Session 09 Reference — Refactoring & Reviewing Your Test Suite with AI"
sessionNumber: "09"
sessionTitle: "Refactoring & Reviewing Your Test Suite with AI"
phase: "Phase 3: AI for Test Automation & Debugging"
topicName: "AI in Practice"
topicUrl: "/topics/ai-in-practice/"
---

## Quick Reference

### Common test code smells

| Smell | Problem | Fix |
|---|---|---|
| Duplicated selectors across files | One UI change breaks dozens of tests | Extract to a Page Object |
| Raw `page.click('[data-testid="submit"]')` in spec files | Spec files are brittle and hard to read | Move selectors to Page Object methods |
| `test_1`, `test_2` test names | Impossible to know what failed from a CI report | Rename to `should [behaviour] when [condition]` |
| Shared state between tests (data created in one test, used in another) | Test order dependency — random failures | Make each test self-contained |
| 3000-line spec files | Slow to navigate, hard to maintain | Split by feature or user journey |
| `page.waitForTimeout(2000)` throughout | Slow tests that hide real timing issues | Replace with specific wait conditions |
| Always-passing assertions (`expect(true).toBe(true)`) | False confidence — the test never fails | Delete or rewrite with meaningful assertions |

### Refactoring prompt templates

**Audit for duplication:**
> These three test files share duplicated patterns: `#file:tests/a.spec.ts`, `#file:tests/b.spec.ts`, `#file:tests/c.spec.ts`. Identify the duplication. List what should be extracted and where — don't generate code yet.

**Extract a Page Object:**
> Extract the repeated selector and interaction logic in `#file:tests/login.spec.ts` into a `LoginPage` class following the pattern in `#file:tests/pages/homePage.ts`. Output the Page Object to `tests/pages/loginPage.ts` and update the spec to use it.

**Improve test names:**
> Rename the test descriptions in `#file:tests/checkout.spec.ts` to follow the format: "should [expected behaviour] when [condition]". Output only the renamed test descriptions as a list — don't regenerate the test code.

**Review test coverage:**
> Review `#file:tests/auth/login.spec.ts` and list: (1) which scenarios are well covered, (2) which important scenarios are missing, (3) which tests might produce false positives (pass even if the feature breaks). Don't write code — just the analysis.

---

## Full Reference

## Why test code quality matters

There is a persistent belief in some teams that test code is second-class code — it doesn't ship to production, so it doesn't need the same care as application code. This belief is expensive.

Test code is read far more often than it's written. When a test fails at 11pm during a release, you're reading it under pressure. When an API changes and 40 tests need updating, you're paying the cost of every piece of duplication that was accumulated. When you onboard a new team member, they learn what the system does by reading the tests.

The metrics that matter for test code quality:
- **Readability:** can you understand what a test covers from its name alone?
- **Isolation:** does each test set up its own state and clean up after itself?
- **Maintainability:** when a UI element changes, how many files need updating?
- **Trustworthiness:** does a failing test always indicate a real problem?

AI is a useful partner for improving all four — but you need to drive the process with specific, scoped requests.

## Extracting Page Objects from duplicated test code

The Page Object pattern is the most common and highest-value refactoring in Playwright and Selenium test suites. Instead of scattering `page.locator('[data-testid="email-input"]')` across 15 files, you create a `LoginPage` class with a `fillEmail(email: string)` method. One UI change → one file update.

**Getting AI to identify the extraction:**

Don't ask AI to write the Page Object cold. Ask it to find the duplication first:

> Look at these spec files: `#file:tests/auth/login.spec.ts`, `#file:tests/auth/register.spec.ts`, `#file:tests/profile/update.spec.ts`. Identify all the duplicated selectors, repeated interaction sequences, and shared setup code. List what a shared Page Object should contain.

Review the list. Then ask for the implementation:

> Based on the duplication you identified, create a `LoginPage` class in `tests/pages/loginPage.ts`. Use the same class structure as `#file:tests/pages/homePage.ts`. Then update `tests/auth/login.spec.ts` to use the new Page Object. Output both files.

**What to verify after extraction:**
- Run the full test suite — not just the refactored tests — to confirm nothing broke
- Check that every method in the Page Object is actually called from at least one test
- Check that the spec file no longer contains any raw selectors or direct Playwright calls

## Fixing unreadable test names

A test named `test_1` or `should work` provides no information when it fails. When CI reports `test_1 FAILED` at midnight, you have no idea what broke without reading the entire test.

Good test names follow the pattern: **"should [expected behaviour] when [condition]"**

Examples:
- `should show an error when the email field is left empty`
- `should redirect to the dashboard when login succeeds`
- `should disable the submit button while the API call is in progress`
- `should display "Too many attempts" after 5 consecutive failed logins`

**Ask AI to rename in bulk:**

> Rename the test descriptions in `#file:tests/checkout/payment.spec.ts` to follow the format "should [behaviour] when [condition]". Output only the renamed strings — not the full test code — as a list I can apply manually.

Getting the names as a list first (rather than a full file regeneration) lets you review and adjust before making any code changes.

## Resolving shared state between tests

Tests that depend on each other are one of the most insidious quality problems in a test suite. They often pass perfectly in isolation and fail randomly when run as a full suite. The failure pattern is confusing because the problem isn't in the failing test — it's in a test that ran before it.

**Signs of shared state:**
- Tests pass when run individually but fail when run in the full suite
- Tests pass in a different order than they fail
- Tests started failing after you added new tests elsewhere in the file
- A test always fails after one specific other test

**AI is good at spotting shared state patterns:**

> The tests in `#file:tests/users/userManagement.spec.ts` sometimes fail when run as a suite but always pass individually. I suspect shared state. Review the test setup and teardown. Are any tests leaving data that could affect subsequent tests? What cleanup is missing?

**Common causes AI identifies:**
- Tests that create database records in `beforeAll` but don't clean up in `afterAll`
- Tests that modify application state (logged-in session, localStorage) that persists to the next test
- Tests that share a single `page` object across all tests in a `describe` block (use `test.beforeEach` with a fresh page instead)

## Using AI for test code review

Beyond specific refactoring tasks, AI can provide a general code review of a test file. This is useful before committing a newly written test suite, or periodically for suites that have grown organically.

**A structured review prompt:**

> Review `#file:tests/checkout/checkout.spec.ts` and provide a structured analysis:
> 1. Tests that may produce false positives — will pass even if the feature breaks
> 2. Missing edge case coverage for the scenarios that are tested
> 3. Code quality issues (duplication, naming, structure)
> 4. Performance concerns (unnecessary waits, inefficient selectors)
>
> Format as a numbered list under each heading. Don't rewrite the tests — just the analysis.

**What to do with the review:**
- Address "false positives" first — these are tests actively providing false confidence
- Prioritise missing edge cases by risk — which missing scenarios represent real failure modes?
- Fix code quality issues in a separate commit to keep history clean

## Analysing coverage gaps across a feature

When you want to understand the overall coverage state of a feature area (not just a single file), AI can help map what's tested against what exists.

> I'm trying to understand the test coverage for our authentication feature. Here are the test files: `#file:tests/auth/login.spec.ts`, `#file:tests/auth/register.spec.ts`, `#file:tests/auth/reset.spec.ts`.
>
> Here are the endpoints this feature touches: [list the API endpoints or user flows].
>
> For each endpoint/flow, identify: (1) whether it has test coverage, (2) what scenarios are covered, (3) what important scenarios aren't covered.

This produces a coverage map you can use to prioritise where to write tests next.

## FAQ

**Q: Our test suite has 2000 tests and serious duplication. Where do I start?**
Start with the highest-traffic selectors — the ones that appear in the most test files. When those change (which they will), the maintenance cost is highest. Ask AI: "Here's our package.json and a sample of 5 test files. What are the most likely candidates for Page Object extraction based on what you can see?" The goal is the first Page Object, not a complete refactor.

**Q: I refactored to use Page Objects and now several tests are failing. What happened?**
Most likely: the Page Object method is doing something slightly different from the inline code it replaced — a different wait strategy, different error handling, different selector. Compare the original test code with the new Page Object method line by line. A diff is helpful here: "Here's the original inline code [paste] and here's the Page Object method that replaced it [paste]. What's different and could that explain this failure: [error]?"

**Q: AI keeps suggesting I add more test cases but we don't have time. How do I prioritise?**
Risk. Ask AI to re-frame the missing scenarios by impact: "Of the missing test scenarios you identified, which represent the highest risk of a real production issue? Rank by likelihood of occurring and severity of impact if they do." This gives you a risk-based prioritisation rather than a completeness-based one.

**Q: Should I refactor test code and application code in the same PR?**
Almost never. Mixing test refactoring with feature changes makes it very hard to understand what the PR actually does, complicates code review, and makes debugging a failure harder. Test refactoring should be its own commit or PR, ideally with a full test run confirming nothing broke before the feature work begins.
