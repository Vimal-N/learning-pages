---
layout: reference.njk
title: "Session 03 Reference — How to Talk to AI: Prompting That Actually Works"
sessionNumber: "03"
sessionTitle: "How to Talk to AI — Prompting That Actually Works"
phase: "Phase 1: AI Foundations"
topicName: "AI in Practice"
topicUrl: "/topics/ai-in-practice/"
---

## Quick Reference

### The four-element prompt framework

| Element | What it provides | Example |
|---|---|---|
| **Context** | Who you are, what you're working with, relevant background | "I'm a QA engineer working on a Playwright test suite for a React app" |
| **Task** | What you specifically want done | "Write tests for the password reset flow" |
| **Format** | How you want the output structured | "Output as a TypeScript .spec.ts file using our Page Object pattern" |
| **Constraints** | Boundaries, limitations, style rules | "Only create new files in tests/auth/. Don't modify existing files." |

### QA-specific prompt patterns

| Situation | Prompt pattern |
|---|---|
| Write tests from a feature spec | "Here are the acceptance criteria for [feature]. Write [framework] tests covering each scenario. Use our existing Page Object pattern from [path]." |
| Understand unfamiliar code | "Explain what this function does and what edge cases it handles. Use plain English, no code in the response." |
| Find edge cases in existing tests | "Here are my tests for [feature]. What test scenarios am I missing? List as plain descriptions first, no code yet." |
| Debug a failing test | "This [framework] test is failing with the error below. Here's the test code and the full error output. What's causing it?" |
| Improve a vague test name | "Rename these test descriptions to follow the 'should [behaviour] when [condition]' pattern." |

### Prompt iteration checklist

- Result too generic? Add more context about your specific setup
- Result doesn't match your codebase style? Paste a short example of existing code as a reference
- Result misunderstood the task? Rephrase the task element more specifically
- Result too long or includes things you don't need? Add format or constraint elements
- Result is close but not right? Say "keep the structure but change X" — don't start over

---

## Full Reference

## Why vague prompts fail

The model doesn't know anything about your project beyond what you tell it in the prompt. It can't see your codebase (unless you paste it), doesn't know your framework version, doesn't know your naming conventions, and doesn't know what you actually mean when you say "write some tests for the login page."

When you give a vague prompt, the model fills in the blanks with the most common patterns from its training data. You get a generic result — often syntactically correct, often using a different framework version than you expect, often not matching your code style, often covering only the obvious happy path.

**The prompt is the specification.** The quality of the output is directly proportional to the quality of the specification you provide. This is the same relationship QA engineers understand with requirements: poor requirements produce poor tests.

## Element 1 — Context

Context tells the model what it needs to know before it can answer usefully. For QA engineers, useful context typically includes:

- **Framework and version:** "Playwright v1.44, TypeScript" is specific enough for the model to use current API syntax.
- **Project structure:** "Our Page Objects live in `tests/pages/`, fixtures in `tests/fixtures/`" saves the model from guessing.
- **Existing patterns:** "We use the fixture-per-test pattern with `test.beforeEach` — not `test.describe` with `beforeAll`" prevents the model from using a pattern that doesn't fit your suite.
- **Your role:** "I'm a QA engineer, not a developer — keep code explanations jargon-light" produces a different level of explanation.

Context is especially important when you paste code. Don't just paste the function — paste a brief sentence explaining what it does and where it sits in your application.

## Element 2 — Task

The task element is where most vague prompts fail. "Write tests" is not a task — it's a category. A useful task specifies:

- **What** you want produced (a test file, a list of scenarios, a refactored version, an explanation)
- **What exactly** it should cover (specific scenarios, functions, user flows)
- **The starting point** (what the AI should use as its input)

Compare:

> "Write tests for the login page"

vs.

> "Write Playwright tests for the user login flow. Cover: successful login, wrong password error message, empty email validation, and rate limiting after 5 failed attempts. The login endpoint is `/api/auth/login`. Error messages come from the API response body `message` field."

The second version is a specification. The first is a hope.

## Element 3 — Format

Format tells the model how to structure the output. Without it, the model makes a judgment call — which may not match what you need.

Useful format directives for QA engineers:
- `"Output as a complete TypeScript file, no explanation"` — for when you want code to paste directly
- `"List the test scenarios first without code, then I'll tell you which ones to implement"` — separates planning from coding
- `"Explain in plain English, no code"` — for understanding unfamiliar logic
- `"Output as a markdown table"` — for comparison or reference material
- `"Show me the before and after versions side by side"` — for refactoring tasks

## Element 4 — Constraints

Constraints prevent the model from doing things you don't want. Without them, helpful AI behaviour can become unhelpful: it might refactor code you didn't ask it to touch, use a pattern you're trying to move away from, or generate imports for libraries you don't have.

Useful constraints for QA work:
- `"Only create new files — do not modify existing ones"`
- `"Use only imports from packages already in our package.json"`
- `"Don't add comments to the code"`
- `"Keep tests under 50 lines each — split into separate test files if needed"`
- `"Follow the same naming pattern as the existing tests in this file"`

## How to iterate effectively

The first response is rarely the final one. Iteration is part of the workflow, not a sign the prompt failed. But how you iterate matters.

**Good iteration:** Identify the specific thing that's wrong and address it precisely.

> "The structure is right but the selectors use class names — our convention is to use `data-testid` attributes instead. Here are examples from our existing tests: [paste 2–3 examples]."

**Bad iteration:** Start from scratch with a slightly different vague prompt and hope for a better result. This wastes time and doesn't give the model the information it needs to improve.

**The pattern that works:**
1. Write a full prompt with all four elements
2. Review the output — identify the most important thing that's wrong
3. Send a targeted correction that explains the issue and gives a reference if possible
4. Repeat until the output meets your standard, then review it as you would any code

You rarely need more than two or three iterations if the first prompt is complete.

## Building QA-specific prompt patterns you can reuse

Once you find a prompt structure that works well for a recurring task, save it as a template. The elements that need to change are usually just the specifics (feature name, file path, scenario list) — the scaffolding stays the same.

A reusable template for test generation from acceptance criteria:

```
Context: I'm working on a [framework + version] test suite. Page Objects are in [path]. Fixtures are in [path].

Task: Write tests for [feature name]. The acceptance criteria are:
- [AC 1]
- [AC 2]
- [AC 3]

Output: A TypeScript .spec.ts file in [path], following the same structure as [reference file].

Constraints: Don't modify any existing files. Use only selectors from the Page Object — don't add raw selectors to the spec file.
```

Fill in the brackets for each new feature and you have a consistently high-quality prompt every time.

## FAQ

**Q: Do I need to use all four elements every time?**
No. Quick, conversational tasks ("explain what this function does") don't need all four. The framework is most useful for complex generation tasks — writing a test file, doing a refactor, generating test data. For short questions, just ask clearly.

**Q: What if I don't know all the context to provide?**
Provide what you know. The model will work with partial context, and you can add more when you see what it produces. Starting with "I have a Playwright project but I'm not sure about the exact structure — here's the test file I have so far" is far better than not starting.

**Q: Should I explain my intent or just give instructions?**
For complex tasks, explaining your intent helps. "I want to test error handling" plus "write these three tests" gives the model enough understanding to fill gaps intelligently. For simple, well-specified tasks, instructions alone are fine.

**Q: How long should a prompt be?**
As long as it needs to be to be unambiguous. Two well-written paragraphs with concrete specifics produce better output than two sentences that leave everything to interpretation. There's no penalty for a thorough prompt.
