---
layout: reference.njk
title: "Session 17 Reference — Using MCP Servers in Your Workflow"
sessionNumber: "17"
sessionTitle: "Using MCP Servers in Your Workflow"
phase: "Phase 5: MCP, Agents & AI-Powered Workflows"
topicName: "AI in Practice"
topicUrl: "/topics/ai-in-practice/"
---

## Quick Reference

<div class="ref-cheatsheet-block">

### Two ways to add an MCP server

**Option 1 — CLI (quickest):**
```bash
claude mcp add <name> <command> [args...]

# Example: filesystem server scoped to your tests folder
claude mcp add filesystem npx -y @modelcontextprotocol/server-filesystem ./tests
```

**Option 2 — Edit `~/.claude.json` directly:**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "./tests"]
    }
  }
}
```

Both do the same thing. Use the CLI for quick setups; use the JSON file when sharing with a team.

### Three essential MCP servers for QA

| Server | Install command | What it gives you |
|---|---|---|
| **Filesystem** | `claude mcp add filesystem npx -y @modelcontextprotocol/server-filesystem ./tests` | Read/write files directly — no copy-paste |
| **GitHub** | `claude mcp add github npx -y @modelcontextprotocol/server-github` + `GITHUB_TOKEN` | Issues, PRs, commits, repos |
| **Playwright** | `claude mcp add playwright npx -y @playwright/mcp` | Browser control — AI-powered exploratory testing |

### After adding any server: restart Claude Code

```bash
# Verify registration
claude mcp list

# Check what tools are available
# Inside Claude: "What tools do you have?"
```

### Prompt templates for QA workflows

**Read and summarise test results:**
> Read the latest Playwright test report from `tests/results/` and give me a summary of which tests failed, what the error messages were, and which files they're in.

**Investigate recent changes:**
> What's changed in the main branch in the last 7 days that might affect our checkout tests? Look at commits and merged PRs touching checkout-related files.

**Exploratory testing:**
> Navigate to `staging.example.com` and test the checkout flow: add any product to cart, proceed to checkout, use test card 4242 4242 4242 4242, and complete the order. Report any visual or functional issues you find.

**Post-CI triage:**
> Our CI just failed. Read the test results, check what changed in the last 24 hours on GitHub that might have caused it, and give me a summary.

</div>

<div class="ref-cheatsheet-block">

### Multi-server config (copy and adapt)

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "./tests"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "ghp_your_token_here" }
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp"]
    }
  }
}
```

### Troubleshooting MCP connections

| Problem | First check | Fix |
|---|---|---|
| Server not appearing | Did you restart Claude Code? | Exit and reopen; `claude mcp list` to verify |
| Authentication error | Is the env variable set? | `echo $GITHUB_TOKEN` — regenerate if expired |
| `npx can't find package` | Is the `-y` flag present? | Add `-y` or pre-install: `npm install -g @modelcontextprotocol/server-filesystem` |
| JSON syntax error | Brackets or commas? | Open `~/.claude.json` in VS Code — it highlights JSON errors |
| Permission denied | Does the path exist? | `ls -la ./tests` — check path and permissions |

</div>

---

## Full Reference

## What changes when Claude has MCP servers

Without MCP servers, Claude works only with what you provide: the conversation text, files you paste in, or context files the agent reads in the current directory. With MCP servers connected, Claude has access to live data and can take real actions in your systems — without you manually copying anything.

The difference is not subtle. Asking "which tests failed today?" without MCP requires you to open the test results file, copy the content, and paste it into the conversation. With a filesystem MCP server connected, Claude reads the file directly. The same question gets answered in seconds without any manual steps.

## The startup handshake — how Claude learns what tools exist

When you run `claude` with MCP servers registered, a discovery handshake happens invisibly at startup:

1. Claude reads `~/.claude.json` and finds your registered server definitions
2. Claude starts each server as a background process using the `command` and `args` from the config
3. Claude sends a `tools/list` request to each running server
4. Each server responds: "Here are the tools I provide, here are their parameter schemas"
5. Claude now knows its available tools and can use them in any conversation

This entire sequence takes milliseconds. By the time you see the Claude prompt, tool discovery is already complete. When you ask Claude "what tools do you have?", it lists them because it just learned them from the servers — not from hardcoded knowledge.

## The Filesystem MCP server

The filesystem server is the right starting point — everyone understands files, and the use cases are immediately relevant to QA work.

**Setup:**
```bash
claude mcp add filesystem npx -y @modelcontextprotocol/server-filesystem ./tests
```

The path at the end (`./tests`) is the access boundary. The AI can only read and write inside that folder. To give access to the whole project: use `.` (current directory). To restrict to a specific subdirectory: use `./tests` or `./src`.

After running the command, restart Claude Code. Then verify:
```bash
claude mcp list
```

You should see `filesystem` listed. Inside Claude, ask "What tools do you have?" — it should list `read_file`, `write_file`, `list_directory`, and related tools.

**What it enables:**

The AI can now read any file within your access boundary without you pasting it. This changes how you work with test reports, config files, and any project data. Instead of:

> "Here is the content of my test report: [paste 500 lines]..."

You simply ask:

> "Read the latest Playwright test report from tests/results/ and tell me which tests failed."

The AI uses the `read_file` tool, reads the file directly, and responds with an analysis. Nothing was pasted. The connection to your filesystem is live.

**Example interaction:**
> Prompt: "Read the latest Playwright test report from tests/results/ and give me a summary of which tests failed, what the error messages were, and which files they're in."
>
> Response: "I'll read the test results directory using the filesystem tool... Found `tests/results/test-results-2025-05-12.json`. Here's the summary: 3 failures out of 21 tests — [full failure list with error messages and file locations]. Want me to investigate the root cause for any of these, or check what changed recently in those files?"

Nothing was pasted into this conversation. Claude read the file directly using the MCP server.

<div class="ref-page-break"></div>

## The GitHub MCP server

The GitHub server connects Claude to your repositories: commits, pull requests, issues, file history. For QA work, this transforms incident investigation — instead of manually looking through git logs and PR descriptions, you ask Claude and it looks for you.

**Setup:**

First, get a GitHub token (Settings → Developer Settings → Personal Access Tokens → Tokens (classic) → Generate new, select `repo` scope).

```bash
# Option 1 — pass token at registration time
GITHUB_TOKEN=ghp_yourtoken claude mcp add github npx -y @modelcontextprotocol/server-github

# Option 2 — add token to JSON config (better for teams)
# Add to ~/.claude.json under the github server entry:
# "env": { "GITHUB_TOKEN": "ghp_yourtoken" }
```

**What it enables:**

Ask Claude about what changed in your codebase without manually reading git logs. The AI understands your question contextually — "what might affect checkout tests" means it looks at files related to checkout, payment, cart, and related areas — not just a keyword search.

**Example interaction:**
> Prompt: "What's changed in the main branch in the last 7 days that might affect our checkout tests? Look at commits and merged PRs touching checkout-related files."
>
> Response: "Looking at recent commits and merged PRs touching checkout, payment, and cart files... Found 3 changes that could affect your tests: PR #847 (merged 2 days ago) renamed the order button from 'Place Order' to 'Confirm Order' — your tests may use the old text as a selector. PR #851 made payment validation async — tests may need explicit waits. Commit a3f8c2 removed the avatar upload button, which explains the failure in profile.spec.ts:45."

This investigation would have taken 15-20 minutes manually. With the GitHub MCP server, it takes seconds.

## The Playwright MCP server

The Playwright server gives Claude control of an actual browser. This is the most visually striking MCP server — you can watch a browser window open, navigate, click, and interact in real time as Claude runs.

**Setup:**
```bash
claude mcp add playwright npx -y @playwright/mcp
```

No token needed. Restart Claude Code. A Chromium browser window will open visibly when Claude uses this tool.

**What Claude can do with browser control:**
- Navigate to URLs
- Click elements
- Fill in forms
- Take screenshots
- Read page content
- Execute JavaScript

**The key QA use case: AI-powered exploratory testing**

Point the Playwright MCP server at a staging environment and ask Claude to explore a new feature with a test charter. The AI navigates, clicks, reports issues it finds — things that automated scripts miss because they only check what you told them to check.

**Example interaction:**
> Prompt: "Navigate to staging.example.com and test the checkout flow: add any product to cart, proceed to checkout, use test card 4242 4242 4242 4242, and complete the order. Report any visual or functional issues you find along the way."
>
> Response: "Opening Chromium and navigating to staging.example.com... Completed the full checkout flow. Found 2 issues: Issue 1 — Visual (mobile): On viewport 375×812, the 'Confirm Order' button overlaps the order total text. Issue 2 — Functional: After order confirmation, the success page shows 'Thank you, undefined!' instead of the user's name — the `user.displayName` field appears to be null in the confirmation response. Shall I write Playwright test cases for both issues?"

**Important:** Always use staging environments, never production. The AI is taking real actions in the browser.

## Using multiple servers together

The real power is combining servers. Claude can call multiple MCP servers in a single conversation — you do not switch between them.

**Config with three servers:**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "./tests"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "ghp_..." }
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp"]
    }
  }
}
```

With all three connected, a single prompt like "Our CI just failed. Read the test results, check what changed in the last 24 hours on GitHub that might have caused it, and give me a summary" causes Claude to: read the test report file (filesystem), query recent commits and PRs (GitHub), cross-reference the failures with the changes, and return an integrated analysis. Four systems, one prompt.

## QA workflows MCP transforms

**Post-CI triage:** After a CI run — AI reads results (filesystem MCP) → checks what changed (GitHub MCP) → creates tickets for new failures (GitHub MCP) → posts summary to Slack (Slack MCP). One prompt, four systems.

**Release readiness check:** AI reads all merged PRs for this release (GitHub), checks open bugs (GitHub issues or Jira), reads test coverage summary (filesystem) — returns a "ready to release?" report.

**Exploratory testing sessions:** Point Playwright MCP at a new feature and ask AI to explore it with a test charter. AI navigates, clicks, screenshots, and reports issues — faster first-pass than solo manual testing.

**Realistic test data generation:** A Database MCP server gives Claude access to production-like records. Generate tests using actual product IDs, real user edge cases, and valid data combinations from your system rather than synthetic fixtures.

## FAQ

**Q: Why do I have to restart Claude Code after adding a server?**
MCP servers are started as background processes at Claude Code startup — they are not spawned dynamically mid-session. The startup handshake (tools/list) only happens once. Restart is always the first debugging step when a new server is not appearing.

**Q: Can I use the Playwright MCP server on CI?**
It is possible but requires a headless-compatible environment. The `@playwright/mcp` server by default opens a visible browser. On headless servers, set the `DISPLAY` environment variable or configure headless mode in the server options. For most teams, using the Playwright MCP server locally for exploratory testing and standard Playwright scripts for CI automation is the most practical split.

**Q: The filesystem server has access to `./tests` — can the AI accidentally delete test files?**
The filesystem server exposes a `write_file` tool as well as `read_file`. To restrict to read-only access, you have two options: scope the path to a specific read-only location, or look for a read-only variant of the server. The community filesystem server exposes full read-write access within the path you specify. Build your custom server (Session 18) if you need a read-only variant.

**Q: How do I remove an MCP server I've added?**
Run `claude mcp remove <name>` where `<name>` is the identifier you used when adding it (e.g. `claude mcp remove filesystem`). Or edit `~/.claude.json` directly and remove the server's JSON block. Restart Claude Code for the removal to take effect.

**Q: Can I share a single MCP server config across an entire team?**
Yes — the `~/.claude.json` config can be committed to a shared team wiki or docs repo. Team members copy the relevant section into their own `~/.claude.json`. Tokens and API keys in the `env` block should be replaced with each person's own credentials. Never commit actual token values to version control.
