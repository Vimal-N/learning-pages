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

### @ Chat Participants

| Participant | Scope | VS Code? | Best for |
|---|---|---|---|
| `@workspace` | All files in the open project | ✓ Yes | Finding patterns, cross-file questions, understanding project structure |
| `@vscode` | VS Code editor settings and config | ✓ Yes | Settings, keybindings, extension behaviour, launch config |
| `@terminal` | Integrated terminal output | ✓ Yes | Diagnosing shell errors and test runner failures |
| `@github` | GitHub repos, issues, PRs | ✗ github.com only | Searching issues and PRs — from the GitHub website panel only |

**Mental model:** When you type `@participant`, you switch Copilot into a specialised mode. Without `@`, Copilot only looks at your open file.

### # Context Variables

| Variable | Attaches | Best for |
|---|---|---|
| `#file` | Specific file (picker opens) | Pattern matching, generating code consistent with an existing file |
| `#selection` | Your currently highlighted code | Questions scoped to exactly the lines you selected |
| `#editor` | Full active editor tab | Whole-file questions without going to workspace scope |
| `#codebase` | Semantic search across all files | Finding patterns or anti-patterns across the whole suite |
| `#terminalLastCommand` | Last command's output | Diagnosing a test failure immediately after running — no copy-paste |
| `#terminal` | Full terminal buffer | When failure context spans multiple commands |
| `#git` | Recent git history | Writing commit messages, understanding recent changes |
| `#fetch` | Content from a URL *(evolving)* | Referencing live documentation or API specs in Chat |
| `#problems` | VS Code Problems panel *(evolving)* | Addressing all lint/type errors at once |

**Mental model:** Without `#`, Copilot sees your open file and guesses the rest. With `#`, you hand it exactly the right material — like giving a colleague the error, the code, and the file rather than just describing the problem.

**Always type `#` in Chat** to see the full current list — the autocomplete picker is the authoritative source.

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

Slash commands are unambiguous shortcuts. Instead of "can you write some tests for this?", type `/tests` — Copilot knows exactly what output type to produce. Combine with `#` to scope what it acts on.

| Command | What it does | QA example |
| --- | --- | --- |
| `/explain` | Explains selected code in plain English | `/explain #selection — why might this selector break after a DOM update?` |
| `/fix` | Suggests a fix for broken or failing code | `/fix #terminalLastCommand — suggest what changed and why this broke` |
| `/tests` | Generates tests for selected code or a referenced file | `/tests #file checkoutFlow.ts — cover async state changes and network errors` |
| `/doc` | Writes JSDoc / TSDoc for selected code | `/doc #editor — add JSDoc to every exported function` |
| `/new` | Scaffolds a new file or project structure | `/new Playwright project with Page Object Model structure and global auth setup` |

**Referencing files in Chat:** Type `#` to reference a specific file. `#file:tests/pages/loginPage.ts` includes that file's content in your message as context. This is crucial for getting output that matches your code style.

## @ Chat Participants — full reference

When you prefix a participant name with `@`, Copilot switches into a specialised mode with access to a broader domain. Without `@`, it only sees your open file.

| Participant | What it accesses | When to use |
| --- | --- | --- |
| `@workspace` | All files in the open VS Code project | Finding where things are defined, cross-file pattern questions, coverage gap analysis |
| `@vscode` | VS Code settings, keybindings, extensions, launch config | Questions about the editor itself — not your code |
| `@terminal` | Integrated terminal shell and output buffer | Diagnosing terminal errors and test runner failures |
| `@github` | GitHub repos, issues, and PRs on github.com | Searching issues and PRs — **github.com only, not available in VS Code** |

**Combining `@` with `#`:** You can use both in the same message. `@workspace` which tests cover the changes in `#file` — Copilot searches the whole project but focuses its answer on the file you attached.

## # Chat Variables — full reference

`#` variables attach specific content to your message. Without them, Copilot guesses what's relevant. With them, you hand it exactly the right material.

### Code and file references

| Variable | Attaches | Notes |
| --- | --- | --- |
| `#file` | Specific file (picker opens when you type it) | Most important for QA — attach your existing test file so Copilot matches your patterns |
| `#selection` | Whatever you have highlighted in the editor | Most precise — scopes to exactly the lines you selected, nothing more |
| `#editor` | Full content of the active editor tab | Broader than `#selection`, narrower than `@workspace` |
| `#codebase` | Semantic search across all files | Like `@workspace` but used inline in a message rather than switching participant mode |

### Terminal references

| Variable | Attaches | Notes |
| --- | --- | --- |
| `#terminalLastCommand` | Output of the last command in the integrated terminal | Fastest way to diagnose a test failure — no copy-paste needed |
| `#terminal` | Full terminal buffer (everything visible in the panel) | Use when the failure context spans multiple commands |

### Source control and other

| Variable | Attaches | Notes |
| --- | --- | --- |
| `#git` | Recent git history — diffs and commit messages | Great for writing commit messages grounded in actual changes |
| `#fetch` | Content fetched from a URL *(evolving)* | Reference live docs or API specs inline |
| `#problems` | VS Code Problems panel — lint/type errors *(evolving)* | Address all visible errors in one pass |

**Note on evolving variables:** Some `#` variables like `#fetch` and `#problems` are not fully documented yet. Always type `#` in Chat to see the full list available in your installed version — the autocomplete picker is the authoritative source.

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

## Power Combinations — @, #, and / together

Layering all three symbols gives you precision that no single symbol provides alone. These are the patterns that save the most time for QA engineers.

| Scenario | Prompt | Why it works |
| --- | --- | --- |
| Diagnose a failing test | `@terminal #terminalLastCommand — explain why this test failed and what the stack trace is pointing to` | `@terminal` sets terminal context; `#terminalLastCommand` attaches the actual output — no copy-pasting needed |
| Find coverage gaps project-wide | `@workspace — which Playwright tests are missing assertions on the error state or loading state?` | `@workspace` searches every test file in the indexed project, not just the open tab |
| Generate tests matching your patterns | `/tests #file checkoutFlow.ts — focus on async state changes and network error handling` | `/tests` sets the task; `#file` grounds output in your actual selectors, imports, and assertion style |
| Explain an inherited selector | `/explain #selection — tell me why this locator might fail after a DOM update` | `/explain` sets intent; `#selection` pins it to exactly the highlighted lines, not the whole file |
| Find mocking patterns without reading every file | `@workspace — where do we set up API mocks before tests? Show me the pattern we use` | Returns real file paths and real method calls from your codebase so the next prompt replicates your team's convention |

**The rule:** More precision = better output. An `@participant` alone is good. `@participant` + `#variable` + a specific question is much better. Adding `/command` removes all ambiguity about what output type you want.

## FAQ

**Q: Why does Copilot sometimes suggest code from a completely different language or framework?**
Context. If your file doesn't have imports that clearly identify the framework, or if the code at the top of the file is ambiguous, Copilot may make a wrong assumption. Add an import or a comment at the top — "Playwright TypeScript test using Page Object pattern" — to orient it.

**Q: Can I use Copilot offline?**
No. Copilot requires an internet connection to generate suggestions — all the processing happens on GitHub's servers.

**Q: My suggestions are often wrong or irrelevant. What am I doing wrong?**
Usually it's context. The more your open file reflects what you want to generate, the better the suggestions. Open the file you want the generated code to follow as a reference, or use `#file:` in Chat to reference it explicitly.

**Q: Does accepting a suggestion mean I own the copyright?**
GitHub's terms state that you own the output. Copilot is trained on publicly available code — it may occasionally reproduce small snippets from training data. For most generation tasks (test cases, boilerplate, helper functions), this isn't a concern. For anything unusual, run it through your normal code review process.
