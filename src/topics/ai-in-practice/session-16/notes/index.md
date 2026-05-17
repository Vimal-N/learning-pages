---
layout: reference.njk
title: "Session 16 Reference — What Is MCP? Understanding the Model Context Protocol"
sessionNumber: "16"
sessionTitle: "What Is MCP? Understanding the Model Context Protocol"
phase: "Phase 5: MCP, Agents & AI-Powered Workflows"
topicName: "AI in Practice"
topicUrl: "/topics/ai-in-practice/"
---

## Quick Reference

<div class="ref-cheatsheet-block">

### MCP in one sentence

MCP (Model Context Protocol) is a standard that lets any AI tool connect to external systems, data sources, and actions — the same way USB lets any device connect to any computer.

### The three MCP pieces

| Piece | What it is | Examples |
|---|---|---|
| **Host** | The AI app the user talks to | Claude Code, Claude Desktop, Cursor, Zed |
| **MCP Protocol** | The standardised message format both sides speak | JSON-RPC 2.0 over stdio or HTTP |
| **MCP Server** | The bridge to real-world systems | Filesystem, GitHub, Playwright, your custom server |

### Three things servers can provide

| Type | What it does | Permission level | Example |
|---|---|---|---|
| **Tools** | Actions the AI can take | Read + Write | `create_issue()`, `run_test()`, `write_file()` |
| **Resources** | Data the AI can read | Read only | `test-results.xml`, `playwright.config.ts`, `README.md` |
| **Prompts** | Reusable task templates | — | "daily standup summary", "test failure report" |

### What happens when Claude uses a tool (6-step flow)

1. **You ask** — "What tests failed in today's run?"
2. **Claude decides** — "I have a filesystem tool. I'll use it to read test results."
3. **Protocol sends** — Structured JSON to the filesystem MCP server: `read_file: tests/results/latest.json`
4. **MCP server acts** — Opens the file from your actual filesystem
5. **Server responds** — Returns file content as structured data through the protocol
6. **Claude answers you** — "3 tests failed today. Here's what happened..."

### Resources vs Tools — the key difference

> Start with read-only resources. Add tools only when the AI needs to take action. The scope you grant is the scope the AI can use — keep it minimal until you need more.

</div>

<div class="ref-cheatsheet-block">

### Before and after MCP

| | Before MCP | With MCP |
|---|---|---|
| Integration format | Custom for every AI + data source combination | One standard protocol |
| Reusability | Each integration is one-off | Build once, use with Claude, Copilot, Cursor, etc. |
| Data access | Only training data or what you paste in | Live data from your actual systems |
| Actions | AI can only advise, not act | AI can create tickets, run queries, send messages |
| Building integrations | Requires deep AI platform knowledge | Follows one documented pattern |

### The analogy

**USB:** Before USB — every device had its own proprietary port. After USB — one standard, any device on any computer.

**MCP:** Before MCP — custom integration for every AI + data source. After MCP — one MCP server works with any MCP-compatible tool.

</div>

---

## Full Reference

## The problem MCP solves

Before MCP, getting an AI tool to access your data required custom work for every combination. If you wanted Claude to read your database, someone wrote a custom integration. If you wanted it to query GitHub issues, another custom integration. If you then switched from Claude to Copilot, neither integration worked for the other tool.

This fragmented approach was expensive and non-composable. It also meant that the community could not share integrations — a GitHub integration built for one team's Claude setup could not be used by someone using a different AI tool.

MCP standardises the connection. An MCP server built for GitHub works with Claude Code, Claude Desktop, Cursor, Zed, or any other host that implements the protocol. Write once, use everywhere.

## How MCP is structured

MCP has three layers:

**The host** is the AI application — Claude Code, Claude Desktop, Cursor, or a custom application you build. The host contains an MCP client that knows how to speak the protocol. When you install Claude Code, MCP client support comes built in.

**The MCP protocol** is the standardised message format. Technically, it uses JSON-RPC 2.0 — a simple, well-documented standard for sending structured messages and getting structured responses. You never write these messages yourself; the SDK handles them. But understanding that they are plain JSON is useful — MCP is not opaque or magical at the transport level.

**MCP servers** are separate processes that expose capabilities to the AI. Each server connects to something — the filesystem, GitHub, a database, a browser — and announces to the host what it can do. The host (Claude) can then use those capabilities in any conversation.

## What MCP servers provide

Servers expose up to three kinds of capabilities:

**Tools** are the most important for QA workflows. A tool is an action the AI can take — run a test, create a Jira ticket, send a Slack message, query a database, click a browser element. Tools can read and write. Because tools can change things, the access scope you grant matters: limit a filesystem tool to your `tests/` directory, not your entire home folder.

**Resources** are data sources the AI can read but not modify. Think of them like books on a shelf — the AI opens them and reads them but cannot write back. Test result files, configuration files, database records, GitHub issue details. Resources are lower risk than tools and are a good starting point when you first set up a server.

**Prompts** are reusable task templates stored on the server. A "write test failure report" prompt might know your team's exact format and automatically include the latest test run data. Less commonly used than tools and resources, but useful for standardising recurring tasks.

## The request flow in detail

Understanding what happens between you pressing Enter and getting a response demystifies MCP significantly.

You type: "What tests failed in today's run?"

Claude reads your question and decides it has a relevant tool available (the filesystem MCP server is connected). It decides to call `read_file` to get the test results.

The MCP client inside Claude Code constructs a JSON-RPC message: `{ "method": "tools/call", "params": { "name": "read_file", "arguments": { "path": "tests/results/latest.json" } } }`.

This message is sent over stdio (standard input/output) to the MCP server process running on your machine.

The MCP server reads the file from your filesystem and constructs a response: `{ "content": [{ "type": "text", "text": "{ tests: [...], failures: [...] }" }] }`.

Claude receives this data and uses it to form its answer to you.

The entire exchange happens in milliseconds. Claude's decision to use a tool, the tool call, and the response back are all invisible in normal use — you just see the answer.

## Resources vs Tools — the safety distinction

The distinction between resources and tools is not just technical — it matters for how much you trust the AI with access to your systems.

**Resources are passive.** The AI can observe but not change. Granting read access to your test results file carries essentially no risk — the AI cannot modify your tests.

**Tools are active.** The AI can take actions that change state. If you give the AI a tool to create GitHub issues, it will create GitHub issues. If you give it write access to your codebase, it can modify files.

Practical guidance: start with read-only resources. Understand what the AI does with them before granting tools. When you do grant tools, scope them narrowly — a filesystem tool that can only access `./tests` is much safer than one that can access your entire home directory.

## Who controls access

A critical point: the MCP server is code that runs on your machine (or your team's servers), under your control. You decide:

- What data the server can access
- What actions it exposes as tools
- Which paths on the filesystem the AI can read or write
- What authentication is required for API-backed servers

The AI model running in the cloud never directly accesses your systems. It calls tools through the protocol; the server that runs locally executes the actual access. This means your data does not leave your machine through the MCP connection.

## The growing MCP ecosystem

MCP was introduced by Anthropic in late 2024 and has been adopted rapidly by the tooling community. Community-built servers now exist for:

- Filesystems (Anthropic official)
- GitHub (Anthropic official)
- Playwright browser automation (Playwright team official)
- Slack, Linear, Jira, Notion, and dozens of other tools
- Database engines (PostgreSQL, SQLite)

The ecosystem is growing weekly. The practical implication: for most external systems your team already uses, a community MCP server probably exists. Check `github.com/modelcontextprotocol/servers` for the official registry.

For internal systems — your custom CI pipeline, your company's test management tool, your internal deployment API — you build your own. Session 18 covers this in full.

<div class="ref-page-break"></div>

## MCP-compatible hosts

MCP is a protocol, not a vendor lock-in. Any application can implement MCP client support. Currently MCP-compatible hosts include:

- Claude Code (Anthropic's CLI terminal agent)
- Claude Desktop (Anthropic's desktop application)
- Cursor (AI-first code editor)
- Zed (collaborative code editor)
- Codeium's Windsurf

This means an MCP server you build for Claude Code today will work without modification in any other MCP-compatible tool your team adopts in the future.

## FAQ

**Q: Is MCP only for Claude?**
No. MCP is an open standard. Anthropic published it, but any tool can implement it. Cursor, Zed, and others have already adopted it. An MCP server you build today will work with any MCP-compatible host — present and future.

**Q: What is JSON-RPC 2.0 and do I need to understand it?**
JSON-RPC 2.0 is the message format MCP uses under the hood. In practice, you do not need to understand it — the MCP SDK handles it entirely. What you need to understand is the conceptual model: tools, resources, and prompts. Session 18 walks through the SDK so you never touch raw JSON-RPC.

**Q: How does the AI know which tool to use?**
When Claude Code starts, it sends a `tools/list` request to every registered MCP server. Each server responds with its tools, including their names, descriptions, and parameter schemas. Claude reads these descriptions and uses them to decide which tool is relevant to your request. This is why tool descriptions matter — Claude reads them to decide when to call the tool.

**Q: Is MCP secure? Does my data go to Anthropic?**
The MCP server runs locally on your machine (or a server you control). When Claude calls a tool, the AI model sends a request to the MCP client (built into Claude Code), which sends it to your local server process. The server executes the action locally and returns the result. Your files, database contents, and API responses travel from your local server back to Claude Code — not directly to Anthropic's cloud. However, the result data does become part of the conversation context that is sent to the model for processing. Be thoughtful about what data you expose through MCP tools, particularly personally identifiable information.

**Q: Can I run the same MCP server on a shared team machine?**
Yes, but be careful with secrets. The server config (in `~/.claude.json`) contains the command to start the server and may include API keys in an `env` block. Share the config structure, but have each team member supply their own API key values. Do not commit tokens or API keys to version control.
