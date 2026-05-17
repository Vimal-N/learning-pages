---
layout: reference.njk
title: "Session 07 Reference — Writing Test Cases with AI: From Scratch to Suite"
sessionNumber: "07"
sessionTitle: "Writing Test Cases with AI — From Scratch to Suite"
phase: "Phase 3: AI for Test Automation & Debugging"
topicName: "AI in Practice"
topicUrl: "/topics/ai-in-practice/"
---

## Quick Reference

### 4 strategies at a glance

| Strategy | Start with | Best when |
|---|---|---|
| **From acceptance criteria** | User stories or ACs | Building tests for a feature before it exists, or alongside dev |
| **From existing code** | The function, component, or endpoint itself | Testing legacy code with no existing tests |
| **Edge case generation** | Your existing tests | You have happy-path coverage and want to find gaps |
| **Test data generation** | A description of data shape and variations needed | You need realistic, varied fixtures for meaningful tests |

### Prompt templates

**Strategy 1 — From acceptance criteria**

> I need [Playwright/Jest/Cypress] tests for [feature name].
> Acceptance criteria:
> - [AC 1]
> - [AC 2]
> - [AC 3]
> Use our Page Object pattern from [path]. Test file goes in [path].
> Don't modify any existing files.

**Strategy 2 — From existing code**

> Here is [function/component/endpoint]. Write [framework] [unit/integration/e2e] tests covering: [scenario list].
> Match the style of our existing tests in `#file:[reference file]`.
> Output to [path].

**Strategy 3 — Edge case generation**

> Here are my existing tests for [feature]: [paste or reference with #file:].
> What test scenarios am I missing? List as plain descriptions only — no code yet.

**Strategy 4 — Test data generation**

> Generate a [JSON/TypeScript] fixture file covering [number] [entity type] variations.
> Include: [variation type 1], [variation type 2], [variation type 3].
> Use realistic [UK/US] names and formats. Output to [path].

### Before-you-commit review checklist

- If this feature broke tomorrow, would this test catch it?
- Are assertions checking actual behaviour, not just element presence?
- Are all `async` operations properly awaited?
- Does the test data actually exercise the scenario (error data for error paths, valid data for success paths)?
- Do I understand every line? If not, ask Copilot to explain it before committing.
- Have I run the test locally and confirmed it passes (and fails when I break the feature)?

---

## Full Reference

## Why QA engineers write better AI-assisted tests

Most developers using AI to write tests ask for "some tests" and accept whatever comes back. The results are usually syntactically correct, loosely structured, and test only the obvious happy path. They look like tests but don't provide meaningful coverage.

QA engineers work differently — and this difference produces substantially better outcomes.

You bring the testing strategy. AI cannot invent your acceptance criteria, determine your risk areas, or understand what business behaviour needs protecting. You know what matters to test. AI knows how to write the code for a test you've specified. The combination is powerful: your domain knowledge applied through AI's implementation speed.

You bring the habit of verification. The instinct to ask "would this test actually catch a bug?" is a QA instinct. Many developers don't apply that scrutiny to generated tests. You will — and you should.

## Strategy 1 — Writing tests from acceptance criteria

This is the most reliable strategy because it grounds the AI in your actual requirements rather than having it guess what's worth testing.

**What to include in the prompt:**

- The acceptance criteria themselves — numbered list format works well
- The framework and version
- File path references for existing patterns the AI should match
- Where to put the output files
- Any constraints (don't modify existing files, use specific selectors from the Page Object)

**Full example:**

> I need Playwright TypeScript E2E tests for the password reset feature.
>
> Acceptance criteria:
> 1. User enters email on `/forgot-password` and submits
> 2. If email exists in system: success message "If this email is registered, you'll receive a link shortly" is shown, no redirect
> 3. If email not found: same success message is shown (don't reveal whether email exists)
> 4. Submit button is disabled during API call (no double-submit)
> 5. Rate limit: after 3 requests in 10 minutes, show "Too many attempts. Try again later."
>
> Use our Page Object pattern — reference `#file:tests/pages/loginPage.ts` for style.
> Output: `tests/pages/forgotPasswordPage.ts` (Page Object) and `tests/auth/passwordReset.spec.ts` (tests).
> Don't modify existing files.

**Why the "same message for both outcomes" AC matters:** Without it, the AI would likely generate one test for "email found" and one for "email not found" with different expected messages — which is wrong for the security reason you've specified. The ACs contain the business rule; the AI can't infer it.

**What to check in the output:**
- Does the generated Page Object's selectors match your actual application? Verify each one in the browser before running the test.
- Does the rate limiting test actually wait for the right number of attempts, or does it make three calls and immediately check the error?
- Is the "same message for both outcomes" assertion correctly asserting the same text for both test paths?

## Strategy 2 — Writing tests from existing code

When you're adding tests to existing code that has none, or testing a function you didn't write, this strategy starts from the implementation rather than requirements.

**The key insight:** AI generates tests that match the *current* behaviour of the code, including any bugs in that behaviour. If the function has a bug where it returns `null` instead of throwing an error, the AI will generate a test that asserts `null` — and that test will pass. This is not the test you want.

**Always pair this strategy with requirements review:** After generating tests from code, compare the assertions against your acceptance criteria (or ask someone who knows the requirements). Tests from code verify behaviour; tests from ACs verify correctness.

**Prompt structure:**

> Here is our `UserService.validateLogin()` function:
> ```typescript
> [paste the function]
> ```
>
> Write Jest unit tests covering:
> - Successful authentication (valid email + password)
> - Failed authentication (valid email, wrong password)
> - Account locked (too many failed attempts)
> - Expired session token
> - Null or undefined input guard
>
> Match the style of `#file:tests/unit/authService.test.ts`.
> Output to `tests/unit/userService.test.ts`.

## Strategy 3 — Edge case generation

This is the most underused strategy and one of the most valuable. You already have tests for the main scenarios — use AI to find what you missed.

**The crucial technique:** Ask for scenario descriptions first, not code. Reviewing a list of 8 proposed scenarios takes 30 seconds. Reviewing 8 generated test files takes significantly longer — and you may have to throw out tests for scenarios you don't actually want to cover.

**The "describe then code" workflow:**

Step 1 — Get the scenario list:
> Here are my existing tests for the product search feature: `#file:tests/search/productSearch.spec.ts`
> What important test scenarios am I missing? List them as plain English descriptions only — no code.

Step 2 — Review the list. Delete scenarios that aren't worth testing or are out of scope.

Step 3 — Ask for code for specific ones:
> Implement test cases 1, 3, and 5 from the list above. Match the existing style in the file.

**Common gaps AI reliably finds:**
- Special characters in input fields (`&`, `%`, `'`, SQL injection patterns, Unicode)
- Boundary values (0, 1, -1, maximum allowed value, maximum + 1)
- Concurrent or rapid-succession operations
- Race conditions between UI state and API response
- Empty arrays and empty strings as distinct from null/undefined
- Very long input strings that might affect layout or database limits
- Network error states (what happens when the API call fails)

## Strategy 4 — Test data generation

Test data is tedious to write but important. `test@test.com` with password `password` is not a meaningful test data set — it only exercises a single, trivially common input. Realistic, varied test data catches a much wider range of issues.

**What to ask for:**

> Generate a TypeScript fixture at `tests/fixtures/users.ts`.
> I need 10 user objects covering:
> - Standard active user
> - Admin user
> - User with MFA enabled
> - User with account locked after failed logins
> - User with expired password requiring reset
> - User with no profile photo set
> - New user who hasn't completed onboarding
>
> Type: `{ id: string; email: string; password: string; role: 'user' | 'admin'; status: 'active' | 'locked' | 'pending'; mfaEnabled: boolean; hasProfilePhoto: boolean }`
> Use realistic UK names and email formats. Export as a named array `TEST_USERS`.

**For boundary-value input testing:**

> Create an array of test inputs for the postcode validation field. Include:
> - Valid UK postcode formats (SW1A 1AA, M1 1AE, B1 1BB)
> - Invalid formats: missing space, too short, too long, letters in wrong position, all numbers
> - Empty string
> - Input with leading/trailing whitespace
>
> Export as `{ input: string; valid: boolean; expectedError: string | null }[]`

<div class="ref-page-break"></div>

## The full suite workflow — combining all four strategies

Real test coverage comes from using the strategies in combination, not in isolation. Here's how a systematic test session for a new feature would look:

**Step 1 — Cover the specified scenarios (Strategy 1)**
Start with the acceptance criteria. These represent the minimum acceptable coverage. Get these tests written and reviewed first.

**Step 2 — Find the gaps (Strategy 3)**
Show AI your coverage and ask what's missing. Review the suggested scenarios and add the ones that represent real risk.

**Step 3 — Generate realistic data (Strategy 4)**
If your tests use hardcoded test data, replace it with a fixture file that covers all the relevant variations.

**Step 4 — Review the whole suite (not just individual tests)**
Before committing, read the entire test file once from top to bottom. Look for: tests that always pass regardless of application state, assertions that check presence rather than content, test data that doesn't actually exercise the scenario it's named for.

## FAQ

**Q: What if I don't have formal acceptance criteria? My team works more informally.**
Use whatever specification you have. Jira ticket descriptions, Confluence pages, Slack messages, a conversation summary — paste it in and ask Copilot to extract the testable scenarios first. Getting AI to interpret informal requirements into a testable list is itself a useful step before writing a single line of test code.

**Q: The generated selectors don't exist in our app. How do I fix this?**
This is the most common issue. Copilot invents plausible-sounding selectors based on the context it can see. If your Page Object isn't referenced in the prompt, Copilot guesses. Fix: reference your Page Object with `#file:tests/pages/yourPage.ts` so Copilot uses real selectors, or paste the relevant Page Object methods directly into the prompt.

**Q: Should I use Copilot Chat or Agent Mode for test writing?**
For a single test file with known scope: Chat. For a whole feature's test suite spanning multiple files, or if you want the tests run and verified automatically as part of the task: Agent Mode. Agent Mode is particularly effective for Strategy 1 (from ACs) when you have a full feature to cover — you can give it the ACs, the Page Object reference, and the verification command in one goal.

**Q: How do I get Copilot to stop using `.click()` and use my Page Object methods instead?**
Explicitly constrain it: `"Use only methods from the Page Object in #file:tests/pages/loginPage.ts — don't add any raw selectors or Playwright API calls to the spec file."` This forces Copilot to generate tests that delegate to your Page Object, which is both cleaner and more maintainable.
