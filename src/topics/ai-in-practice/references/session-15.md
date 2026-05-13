---
layout: reference.njk
title: "Session 15 Reference — Opencode with GitHub Copilot"
sessionNumber: "15"
sessionTitle: "Opencode with GitHub Copilot — Terminal Agent, Copilot-Powered"
phase: "Phase 4: Terminal Agents & Agentic Tools"
topicName: "AI in Practice"
topicUrl: "/topics/ai-in-practice/"
---

## Quick Reference

<div class="ref-cheatsheet-block">

### Setup checklist

| Step | What to do | Command |
|---|---|---|
| 1. Verify subscription | Check github.com/settings/copilot — plan must be active | — |
| 2. Install GitHub CLI | macOS: `brew install gh` · Windows: `winget install GitHub.cli` | `gh auth login` |
| 3. Install Node.js 18+ | Required by Opencode | `node --version` |
| 4. Install Opencode | Via npm (all platforms) | `npm install -g opencode-ai` |
| 5. Get token | Preferred: export from GitHub CLI | `export GITHUB_TOKEN=$(gh auth token)` |
| 6. Write config | `~/.config/opencode/config.json` — see template below | — |
| 7. Launch | From your project directory | `opencode` |

### Config file (copy and adapt)

```json
{
  "provider": {
    "github": {
      "apiKey": "${GITHUB_TOKEN}"
    }
  },
  "model": "github/claude-sonnet-4"
}
```

`${GITHUB_TOKEN}` reads from your environment variable — the token never appears as plain text in the file.

### Model selection guide

| Model | Best for | When to use |
|---|---|---|
| `github/claude-sonnet-4` | Multi-file tasks, deep reasoning, new test suites | Default — use for everything unless speed is the constraint |
| `github/gpt-4o` | Quick follow-ups, small changes, boilerplate | Fast iteration; questions that don't need deep reasoning |
| `github/o1` or `github/o3-mini` | Hard debugging, complex async failures, architecture decisions | Slow — justify the wait with a genuinely hard problem |
| `github/gemini-1.5-pro` | Very large codebases that overflow other models' context | When context overflow is the problem |

### Opencode commands inside a session

| Command | What it does |
|---|---|
| `/model` | Open the model picker — switch provider or model mid-session |
| `/new` | Start a fresh session (resets context, keeps config) |
| `/compact` | Summarise and compress conversation to free up context |
| `Ctrl+C` | Stop the current agent action before it finishes |
| `/help` | List all available slash commands |

### Prompt template — first QA task

> **Goal:** Find every `waitForTimeout()` call in our test suite and replace with the appropriate Playwright wait (`waitForLoadState`, `waitForSelector`, `waitForResponse` — depending on context).
> **Context:** We use Playwright 1.44. Read our `playwright.config.ts` for project structure. Check `tests/` directory.
> **Scope:** Modify only files in `tests/`. Do not touch `playwright.config.ts`.
> **Verify:** Run `npx playwright test` after replacing and confirm all tests pass.

</div>

<div class="ref-cheatsheet-block">

### Troubleshooting quick reference

| Error | Cause | Fix |
|---|---|---|
| Unauthorized / 401 | `GITHUB_TOKEN` missing, expired, or lacks Copilot access | Re-run `export GITHUB_TOKEN=$(gh auth token)` |
| Model not found | Typo in model ID, or model not on your plan | Run `opencode models list` to see exact IDs |
| No Copilot access / Forbidden | Plan inactive or doesn't include API access | Check github.com/settings/copilot |
| `opencode: command not found` | Not installed, or npm global bin not in PATH | `npm install -g opencode-ai` then restart terminal |

### Three-way tool comparison

| | Copilot Agent Mode | Opencode + Copilot | Claude Code |
|---|---|---|---|
| Lives in | VS Code (IDE) | Terminal (any) | Terminal (any) |
| Model | Copilot models | Same Copilot models | Claude direct (Anthropic API) |
| Billing | Copilot subscription | Copilot subscription | Anthropic API (separate) |
| Diff view | Inline in editor | In TUI pane | In terminal output |
| Codebase scope | Workspace files | Full system access | Full system access |
| Best for | Staying in VS Code | Terminal workflow, no extra API key | Maximum Claude capability |

</div>

---

## Full Reference

## Why use Opencode with your Copilot subscription

Most people think of GitHub Copilot as a VS Code plugin. It is also a model subscription — and as of 2024-2025, that subscription includes access to Claude Sonnet, GPT-4o, o1, and Gemini 1.5 Pro via an API.

Opencode is a terminal agent that is model-agnostic. It reads files, executes shell commands, and works across your entire codebase — but it doesn't care which AI provides the intelligence. When you configure Opencode to use GitHub as its provider, it routes requests through the Copilot API using your existing subscription. No Anthropic account, no separate billing.

The result: everything covered in Sessions 10 and 11 — GCSV prompts, staged tasks, git checkpoints, reading agent output — works identically. You are just changing one line in a config file.

**When to use this instead of Claude Code:**

If your team already has Copilot subscriptions approved and paid for, and you have not yet gone through the process of getting an Anthropic API key approved, Opencode+Copilot is the faster path to a working terminal agent. The models available through Copilot (particularly Claude Sonnet 4) are equivalent in capability to what Claude Code uses.

<div class="ref-page-break"></div>

## Setting up authentication

Opencode uses the `GITHUB_TOKEN` environment variable to authenticate with GitHub's Copilot API.

**Recommended method — GitHub CLI:**

The GitHub CLI approach is preferred because it uses your existing authenticated GitHub session, tokens have the right scopes automatically, and you can refresh without managing token expiry manually.

```bash
# Verify GitHub CLI is authenticated
gh auth status

# Export the token into your shell session
export GITHUB_TOKEN=$(gh auth token)

# Confirm it worked (shows first 10 characters)
echo $GITHUB_TOKEN | head -c 10
```

The token will start with `ghu_` — that is a GitHub user token with the right scopes.

**To make it permanent:** Add the export line to your `~/.zshrc` or `~/.bashrc` so you don't have to run it every time you open a terminal.

**Alternative — Personal Access Token:**

If you cannot install GitHub CLI, go to `github.com/settings/tokens`, create a Fine-grained personal access token, and under Permissions → set Copilot to Read & Write. The token starts with `github_pat_`. Export it the same way.

## The config file

Opencode reads `~/.config/opencode/config.json` on startup. This tells it which provider to use and which model to default to.

```json
{
  "provider": {
    "github": {
      "apiKey": "${GITHUB_TOKEN}"
    }
  },
  "model": "github/claude-sonnet-4"
}
```

**Fields explained:**

- `"github"` — the provider name. This routes all model requests through GitHub's Copilot API endpoint rather than Anthropic's directly.
- `"apiKey": "${GITHUB_TOKEN}"` — Opencode reads the `GITHUB_TOKEN` environment variable at runtime. The token is never stored as plain text in the config file.
- `"model": "github/claude-sonnet-4"` — the default model for new sessions. Format is always `provider/model-name`. Run `opencode models list` to see the exact model identifiers available to your account.

To switch provider entirely — for example to use the direct Anthropic API — you change `"github"` to `"anthropic"` and update the API key. The rest of your Opencode workflow stays identical.

## The Opencode TUI — four panels

When you run `opencode` from a project directory, you see a terminal UI with four zones:

- **Status bar (top)** — shows active model, token count, session name. The token counter turns red as you approach the model's context limit.
- **Context panel (left)** — lists every file Opencode has read into its working context. Watch this grow as the agent explores your project.
- **Conversation panel (right, large)** — where you type tasks and read agent output. AI responses appear in green with the model name; your messages appear in amber.
- **Input bar (bottom)** — type your next task here and press Enter to send.

The slash commands bar at the very bottom shows the most common commands without needing to remember them.

## Choosing the right model mid-session

One distinctive advantage of Opencode+Copilot over Claude Code is multi-model flexibility in a single session. You start with claude-sonnet-4 for a deep analysis task, then switch to gpt-4o for fast iteration on follow-up questions.

**Use `claude-sonnet-4` for:** multi-file refactoring, writing test suites from scratch, understanding complex code flows, anything where accuracy matters more than speed.

**Use `gpt-4o` for:** quick follow-up questions, generating boilerplate, small targeted changes, situations where fast turnaround is more important than depth.

**Use `o1` or `o3-mini` for:** genuinely hard problems — complex flaky test root-cause analysis, debugging async race conditions, architectural decisions. Responses are significantly slower; justify the wait.

**Use `gemini-1.5-pro` for:** when your test suite or codebase is too large for other models to hold in context. Gemini's 1M token window means it can read an enormous codebase at once.

Switch models with `/model` inside any active session. The conversation history is preserved; only the model handling future responses changes.

## Your first task — step by step

Before sending any task, commit your current work:

```bash
git add -A && git commit -m "checkpoint before agent session"
```

Then write your prompt in GCSV format:

- **Goal** — what you want done
- **Context** — what the agent needs to understand about your project
- **Scope** — what it should and should not touch
- **Verify** — how to confirm the task is complete

The agent will explore your project, propose changes, and (depending on your approval settings) ask before applying each file modification. Read each diff before approving. Approve file-by-file on the first few sessions until you trust the agent's judgment on your codebase.

After a successful task, commit the result so you have a clean checkpoint before the next one.

## Failure modes to know

**401 Unauthorized on first run:** The most common failure. Your `GITHUB_TOKEN` is not set, or has expired. Fix: `export GITHUB_TOKEN=$(gh auth token)` and try again.

**"Model not found":** Either a typo in the model ID in `config.json`, or that model is not available on your Copilot plan tier. Run `opencode models list` to see the exact strings available to your account.

**"No Copilot access" / 403 Forbidden:** Your GitHub account either doesn't have an active Copilot subscription, or the subscription plan doesn't include API access to the model you selected. Check `github.com/settings/copilot`.

**Token near limit (red counter):** Use `/compact` to summarise the conversation and free up context space, or `/new` to start a fresh session. Complex tasks naturally grow the context over time.

## FAQ

**Q: Is the quality different from Claude Code?**
Both Copilot Agent Mode and Opencode+Copilot route through GitHub's Copilot API to reach Claude Sonnet. Claude Code uses Anthropic's API directly. In practice, the quality difference is negligible for most QA tasks. If you are doing extremely complex multi-repo analysis, the direct Anthropic API in Claude Code may have a slight edge — but for daily test-writing, debugging, and refactoring work, the Copilot-routed version is equivalent.

**Q: Will using Opencode with Copilot consume my Copilot quota faster?**
GitHub Copilot's billing model includes premium model usage which is measured in "premium requests." Using Claude Sonnet via the Copilot API does count toward this. Check your current usage at `github.com/settings/copilot`. For most individual users, daily terminal agent sessions stay well within plan limits. If you are doing very intensive, long-running sessions, monitor your usage.

**Q: Can I share the config file with my team?**
Yes — the `config.json` using `${GITHUB_TOKEN}` is safe to share because it does not contain anyone's actual token. Each team member exports their own token from their own GitHub CLI session. You can commit the config file to a shared repo or documentation wiki.

**Q: The agent made changes I don't want. How do I undo?**
This is why the git checkpoint at the start of every session is non-negotiable. If the agent's output is wrong, `git checkout .` or `git reset --hard HEAD` to return to your checkpoint state. Never approve agent changes to a file without reading the diff first.

**Q: Do I need to restart Opencode if I change `config.json`?**
Yes. Opencode reads the config file once at startup. Changes to provider, model, or API keys take effect only when you exit and reopen.
