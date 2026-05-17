---
layout: reference.njk
title: "Session 04 Reference — Setting Up GitHub Copilot & Understanding What It Can Do"
sessionNumber: "04"
sessionTitle: "Setting Up GitHub Copilot & Understanding What It Can Do"
phase: "Phase 2: GitHub Copilot Mastery"
topicName: "AI in Practice"
topicUrl: "/topics/ai-in-practice/"
---

## Quick Reference

### Setup steps

- Install the **GitHub Copilot** extension in VS Code (search "GitHub Copilot" in the Extensions panel)
- Sign in with your GitHub account — use the work account that has Copilot licence access
- Install **GitHub Copilot Chat** extension alongside it (separate extension)
- Confirm inline suggestions are working: open any `.ts` file, start typing a function, and watch for the grey suggestion text
- If no suggestions appear: check VS Code status bar bottom-right for the Copilot icon — it should be active, not crossed out

### The two modes

| Mode | How to access | Best for |
|---|---|---|
| **Inline completions** | Just type — suggestions appear automatically | Completing code mid-flow, generating boilerplate, small snippets |
| **Copilot Chat** | `Ctrl+Alt+I` / `⌃⌥I` or click the chat icon in sidebar | Asking questions, generating longer blocks, explaining code, debugging |

### Keyboard shortcuts

| Action | Windows/Linux | Mac |
|---|---|---|
| Accept inline suggestion | `Tab` | `Tab` |
| Dismiss inline suggestion | `Escape` | `Escape` |
| See next suggestion | `Alt+]` | `⌥]` |
| See previous suggestion | `Alt+[` | `⌥[` |
| Accept next word only | `Ctrl+Right` | `⌘Right` |
| Open Copilot Chat | `Ctrl+Alt+I` | `⌃⌥I` |
| Inline chat (in-file) | `Ctrl+I` | `⌘I` |

### Copilot can / cannot

| Copilot can | Copilot cannot |
|---|---|
| See your open file and recent edits | Access the internet or check documentation in real time |
| See files you reference with `#file:` in chat | Remember previous conversations or sessions |
| Suggest code that matches your visible patterns | Know your business rules or requirements |
| Explain and document code | Guarantee correct logic — it generates plausible code |
| Help debug with context you provide | Run your tests or verify its own output |

---

## Full Reference

## Getting the setup right

The most common reason Copilot doesn't work as expected is a setup issue rather than a capability gap. Going through setup methodically saves frustration later.

**Account access:** Your organisation's Copilot licence is tied to your work GitHub account. Make sure VS Code is signed in to that account, not a personal one. Check via the Accounts menu in the bottom-left of VS Code.

**Extension versions:** Both GitHub Copilot and GitHub Copilot Chat need to be installed and up to date. They're separate extensions. Some features (including Agent Mode in Phase 2) require recent versions — VS Code usually prompts for updates, but it's worth checking in the Extensions panel.

**Licence tiers:** Copilot Individual, Business, and Enterprise all give access to inline completions and chat. Agent Mode requires a paid plan — it's not available on the free tier. If you can't find Agent Mode, your licence may not include it.

**Confirming it's working:** The Copilot icon in the VS Code status bar (bottom right) should show as active. A crossed-out or spinning icon indicates an auth or connection issue. Clicking it gives options to sign in or troubleshoot.

## How inline completions work

Copilot's inline completions are triggered automatically as you type. The model sees your entire open file as context, plus any files VS Code has recently opened. It predicts what you're about to write based on:

- The code above and around your cursor
- Your function and variable names
- Import statements (which tell it what frameworks you're using)
- Comment you just wrote above the function

The suggestion appears as grey "ghost text." You accept it with `Tab`, see an alternative with `Alt+]`, or ignore it and keep typing.

**Getting better suggestions from completions:**
- Write a descriptive function name before the body — `loginWithInvalidCredentials` tells Copilot what to generate far better than `test1`
- Write a comment above the function describing its purpose
- Leave the cursor inside an incomplete structure — inside `describe(` or after `async (` — and let Copilot complete it
- Accept suggestions word by word (`Ctrl+Right` / `⌘Right`) when the full suggestion is mostly right but needs minor adjustments

## How Copilot Chat works

Chat is a conversation interface built into VS Code. You type a message, Copilot responds with text and/or code. Unlike inline completions, Chat is explicit — you control what gets generated.

**Opening Chat:**
- Sidebar icon: the chat bubble icon in the activity bar on the left
- Keyboard: `Ctrl+Alt+I` / `⌃⌥I`
- Inline chat (appears directly in your editor at cursor position): `Ctrl+I` / `⌘I`

**Chat slash commands** — type `/` in the chat box to see available commands:

| Command | What it does |
|---|---|
| `/explain` | Explains the selected code in plain English |
| `/fix` | Suggests a fix for selected broken code |
| `/tests` | Generates tests for selected code |
| `/doc` | Writes documentation for selected code |
| `/new` | Scaffolds a new file or component |

**Referencing files in Chat:** Type `#` to reference a specific file. `#file:tests/pages/loginPage.ts` includes that file's content in your message as context. This is crucial for getting output that matches your code style.

## What Copilot does and doesn't know

Copilot sees what's in your editor. It does not have access to:

- Your entire repository (only open/recently-opened files unless you reference them with `#file:`)
- Your requirements documents, Jira tickets, or user stories (unless you paste them)
- Your organisation's internal APIs or documentation
- The internet or any live data source

This is why giving context in your prompts matters — Copilot's "knowledge" of your project is limited to what VS Code has shown it.

**The training cutoff:** Like all LLMs, Copilot's underlying model has a training cutoff. It knows Playwright, Jest, TypeScript, and most common frameworks well because it trained on millions of examples. For very new library versions or recently changed APIs, it may use older patterns. Always check generated code against current documentation when in doubt.

## Privacy considerations

When you use Copilot, your code is sent to GitHub's servers to generate a response. For enterprise licences, GitHub provides controls over data handling and commitments not to use your code for model training. For individual or business licences, terms differ — your organisation's IT or security team should have guidance on what's acceptable to share.

**A practical rule:** Don't paste anything into Copilot Chat that you wouldn't put in a public GitHub repository. Production secrets, customer data, internal system credentials — none of these should go into a Copilot prompt.

## FAQ

**Q: Why does Copilot sometimes suggest code from a completely different language or framework?**
Context. If your file doesn't have imports that clearly identify the framework, or if the code at the top of the file is ambiguous, Copilot may make a wrong assumption. Add an import or a comment at the top — "Playwright TypeScript test using Page Object pattern" — to orient it.

**Q: Can I use Copilot offline?**
No. Copilot requires an internet connection to generate suggestions — all the processing happens on GitHub's servers.

**Q: My suggestions are often wrong or irrelevant. What am I doing wrong?**
Usually it's context. The more your open file reflects what you want to generate, the better the suggestions. Open the file you want the generated code to follow as a reference, or use `#file:` in Chat to reference it explicitly.

**Q: Does accepting a suggestion mean I own the copyright?**
GitHub's terms state that you own the output. Copilot is trained on publicly available code — it may occasionally reproduce small snippets from training data. For most generation tasks (test cases, boilerplate, helper functions), this isn't a concern. For anything unusual, run it through your normal code review process.
