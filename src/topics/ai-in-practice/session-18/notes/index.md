---
layout: reference.njk
title: "Session 18 Reference — Building Your First MCP Server"
sessionNumber: "18"
sessionTitle: "Building Your First MCP Server"
phase: "Phase 5: MCP, Agents & AI-Powered Workflows"
topicName: "AI in Practice"
topicUrl: "/topics/ai-in-practice/"
---

## Quick Reference

<div class="ref-cheatsheet-block">

### Project setup (3 commands)

```bash
mkdir my-qa-mcp-server && cd my-qa-mcp-server
npm init -y
npm install @modelcontextprotocol/sdk
npm install -D typescript tsx @types/node
mkdir src && touch src/server.ts
```

Add to `package.json`:
```json
"type": "module",
"scripts": { "start": "tsx src/server.ts" }
```

### What each package does

| Package | Role | Why needed |
|---|---|---|
| `@modelcontextprotocol/sdk` | The MCP library (production dep) | Handles all protocol-level communication — the one that matters |
| `typescript` | TypeScript compiler (dev) | Type-safe code — warns about wrong types before anything runs |
| `tsx` | TS runner (dev) | Runs `.ts` files directly — no compile step needed during development |
| `@types/node` | Node type definitions (dev) | Lets TypeScript understand `fs`, `path`, and other Node built-ins |

### Complete server file — copy and adapt

```typescript
// src/server.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import * as fs from 'fs';

const server = new Server({ name: 'qa-tools', version: '1.0.0' });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: 'get-test-summary',
    description: 'Summarise the latest Playwright test run results',
    inputSchema: {
      type: 'object',
      properties: {
        reportPath: { type: 'string', description: 'Path to the JSON report file' }
      }
    }
  }]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'get-test-summary') {
    const { reportPath } = request.params.arguments as { reportPath: string };
    const data = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    const failed = data.suites.flatMap((s: any) => s.specs).filter((s: any) => s.ok === false);
    return { content: [{ type: 'text', text: JSON.stringify({ failed, total: data.stats }, null, 2) }] };
  }
  throw new Error(`Unknown tool: ${request.params.name}`);
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

### Connect to Claude Code

```bash
# Register via CLI (use absolute path)
claude mcp add qa-tools node /absolute/path/to/my-qa-mcp-server/src/server.ts

# Or add to ~/.claude.json directly:
# "qa-tools": { "command": "node", "args": ["/absolute/path/to/server/src/server.ts"] }

# Restart Claude Code, then verify:
# Inside Claude: "What tools do you have?"
```

</div>

<div class="ref-cheatsheet-block">

### Tool definition anatomy

| Field | What it does | Write it like... |
|---|---|---|
| `name` | The identifier Claude uses to call this tool | kebab-case: `get-test-summary`, `create-ticket`, `check-coverage` |
| `description` | What Claude reads to decide WHEN to call the tool | "Use this when you need to see which tests failed in the most recent test run" |
| `inputSchema` | What parameters the tool accepts (JSON Schema format) | `{ type: 'object', properties: { reportPath: { type: 'string' } } }` |

### Five-part structure of every MCP server

1. **Imports** — `Server`, `StdioServerTransport`, request schemas, `fs`
2. **Server instance** — `new Server({ name, version })`
3. **ListTools handler** — Answers "what tools do you have?"
4. **CallTool handler** — Executes tool calls and returns results
5. **Transport + connect** — `new StdioServerTransport()` + `await server.connect(transport)`

### More QA tools worth building

| Tool idea | Input | Output |
|---|---|---|
| Flakiness tracker | None (reads history files) | Ranked list: worst offenders by pass rate |
| Ticket creator | Failure details (name, error, file, line) | Created Jira/GitHub ticket URL |
| Coverage reporter | Coverage threshold (e.g. 80%) | Files below threshold |
| Environment health checker | None (hardcoded URL list) | Which staging/UAT/dev environments are up |

</div>

---

## Full Reference

## Why build your own MCP server

Community MCP servers cover common cases — filesystems, GitHub, Slack, Playwright. But every team has specific needs that no community server addresses.

Your custom CI system does not have a community server. Your internal test management tool does not have a community server. Your company's deployment pipeline, your team's specific test result format, your QA database schema — none of these have ready-made servers.

A custom MCP server bridges this gap: it gives Claude access to your team's specific data and tools, in the format your team uses, with exactly the access boundaries you define.

The second reason to build your own: once you understand how, you see candidates everywhere. Any time you copy data from one system into a Claude conversation, that is a candidate for a custom MCP tool. Identify the friction, build the bridge.

## Project setup

Create a new directory and initialise a Node.js project:

```bash
mkdir my-qa-mcp-server && cd my-qa-mcp-server
npm init -y
npm install @modelcontextprotocol/sdk
npm install -D typescript tsx @types/node
```

Update `package.json` with two additions:

```json
{
  "type": "module",
  "scripts": {
    "start": "tsx src/server.ts"
  }
}
```

`"type": "module"` is required by the MCP SDK — it tells Node.js to treat `.js` files as ES modules. `tsx src/server.ts` runs TypeScript directly without a build step, which speeds up development.

Create the server file:

```bash
mkdir src && touch src/server.ts
```

## What each dependency does

**`@modelcontextprotocol/sdk`** (production dependency) — this is the only package you need to ship. It handles the entire MCP protocol: request parsing, response formatting, error handling, and transport management. Without it, you would need to implement MCP from scratch. With it, your server file is ~50 lines.

**`typescript`** (dev only) — the TypeScript compiler. Lets you write type-safe code. It will warn you if you pass the wrong type to a function before anything runs. You never run TypeScript code directly — `tsx` handles that.

**`tsx`** (dev only) — runs TypeScript files directly without a compile step. The `npm start` command uses `tsx src/server.ts` instead of compiling to JavaScript first and then running it. This makes the development loop much faster.

**`@types/node`** (dev only) — type definitions for Node.js built-ins like `fs` (filesystem) and `path`. Without this, TypeScript does not know what `fs.readFileSync` is and will show errors.

## The complete server file, explained

This is the finished file. Read it all the way through first, then we will break it down section by section.

```typescript
// src/server.ts — our complete MCP server
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import * as fs from 'fs';

const server = new Server({ name: 'qa-tools', version: '1.0.0' });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: 'get-test-summary',
    description: 'Summarise the latest Playwright test run results',
    inputSchema: {
      type: 'object',
      properties: {
        reportPath: { type: 'string', description: 'Path to the JSON report file' }
      }
    }
  }]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'get-test-summary') {
    const { reportPath } = request.params.arguments as { reportPath: string };
    const data = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    const failed = data.suites.flatMap((s: any) => s.specs).filter((s: any) => s.ok === false);
    return { content: [{ type: 'text', text: JSON.stringify({ failed, total: data.stats }, null, 2) }] };
  }
  throw new Error(`Unknown tool: ${request.params.name}`);
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

That is the whole file — approximately 30 lines of meaningful code for a fully working MCP server.

<div class="ref-page-break"></div>

## Part 1 — The imports

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import * as fs from 'fs';
```

**`Server`** — the main MCP server class. You create one instance of this. It is the container for your tools and the object that manages all protocol communication.

**`StdioServerTransport`** — the connection method. "Stdio" means the server communicates via standard input/output (stdin/stdout). This is the correct transport for local MCP servers that Claude Code starts as a background process.

**`ListToolsRequestSchema`** — identifies the "list my tools" request type. When Claude sends a `tools/list` request at startup, this schema matches it and routes it to the right handler.

**`CallToolRequestSchema`** — identifies the "run this tool" request type. When Claude calls one of your tools during a conversation, this schema matches the request and routes it to your execution handler.

**`fs`** — Node.js built-in filesystem module. No install needed — always available. We use `fs.readFileSync()` to read the test report file from disk.

## Part 2 — Creating the server

```typescript
const server = new Server({ name: 'qa-tools', version: '1.0.0' });
```

Creates the server object. Nothing happens yet — no tools, no connections. This is just the container.

**`name`** — a human-readable label for this server. It appears in Claude's "what tools do you have?" output and in your `~/.claude.json` config. Name it after what it does: `qa-tools`, `test-results`, `ci-helper`.

**`version`** — semantic version string. MCP clients use this to detect when the server has been updated. Start at `'1.0.0'` and increment when you add or change tools.

## Part 3 — The ListTools handler

```typescript
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: 'get-test-summary',
    description: 'Summarise the latest Playwright test run results',
    inputSchema: {
      type: 'object',
      properties: {
        reportPath: { type: 'string', description: 'Path to the JSON report file' }
      }
    }
  }]
}));
```

This handler runs once at startup when Claude sends the `tools/list` discovery request. It returns the complete list of tools this server provides.

**`name`** — the tool identifier Claude uses to call it. Must be unique within this server. Use kebab-case.

**`description`** — this is the most important field. Claude reads this to decide when to call your tool. Write it clearly and specifically: "Use this when you need to see which tests failed in the most recent Playwright run." A vague description leads to the AI missing the tool or calling it at the wrong time.

**`inputSchema`** — describes what parameters the tool accepts, following JSON Schema format. Claude uses this to know what values to send when calling the tool.

## Part 4 — The CallTool handler

```typescript
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'get-test-summary') {
    const { reportPath } = request.params.arguments as { reportPath: string };
    const data = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    const failed = data.suites.flatMap((s: any) => s.specs).filter((s: any) => s.ok === false);
    return { content: [{ type: 'text', text: JSON.stringify({ failed, total: data.stats }, null, 2) }] };
  }
  throw new Error(`Unknown tool: ${request.params.name}`);
});
```

This handler runs every time Claude actually calls one of your tools. It receives the tool name and arguments, executes your logic, and returns the result.

**The if-check** routes to the correct tool by name. When you add a second tool to the server, add another `if` block. The `throw` at the end is a safety net — if Claude somehow calls a tool name that does not exist, it gets a clear error rather than silent failure.

**`request.params.arguments`** — the parameters Claude sent. We destructure `reportPath` from it. The `as { reportPath: string }` cast tells TypeScript the shape of this object.

**`fs.readFileSync(reportPath, 'utf8')`** — reads the JSON file from disk. Returns the raw string, which we parse with `JSON.parse`.

**`flatMap + filter`** — Playwright's JSON report structure: each suite has `specs`, each spec has an `ok` boolean. We collect all specs where `ok === false` — those are the failed tests.

**`return { content: [{ type: 'text', text: ... }] }`** — the required return format for all tool responses. The `content` array must contain at least one item with `type: 'text'`. The `text` value is what Claude reads and incorporates into its response.

## Part 5 — Transport and connect

```typescript
const transport = new StdioServerTransport();
await server.connect(transport);
```

These two lines start the server. Without them, the process would exit immediately.

**`StdioServerTransport()`** — creates the transport object. Claude Code starts your server as a child process and communicates with it through stdin and stdout. The SDK manages this channel.

**`await server.connect(transport)`** — starts the server's event loop. This call never resolves — it keeps the process alive indefinitely, reading incoming MCP messages and dispatching them to your handlers. The `await` is critical: without it, the function would start the loop and immediately return, causing the process to exit.

## Connecting your server to Claude Code

Register with the CLI using an absolute path:

```bash
claude mcp add qa-tools node /absolute/path/to/my-qa-mcp-server/src/server.ts
```

Use `pwd` in your project directory to get the absolute path. Relative paths can fail depending on where Claude Code is started from.

Restart Claude Code. Inside Claude, ask "What tools do you have?" — it should list `get-test-summary` from your `qa-tools` server. Then test it:

> "Use the `get-test-summary` tool to summarise the results in `tests/results/test-results.json`"

Claude will call your tool, your server code runs on your machine, and Claude incorporates the result into its response.

## When things go wrong

**Server not appearing in tool list:** Restart Claude Code — the most common fix. Claude only discovers tools at startup.

**Path errors:** Use absolute paths everywhere. `pwd` in your project folder gives you the correct path to use in the `claude mcp add` command.

**TypeScript errors:** Run `node src/server.ts` directly to see TypeScript compilation errors in the output. Fix these before testing in Claude Code.

**Tool not being called when you expect:** Check your tool description. Claude reads descriptions to decide when to use a tool. Rewrite it to be more specific about when and why to call it.

**Changes not taking effect:** After modifying `src/server.ts`, restart Claude Code. The server process is launched once at startup — live code changes need a restart.

## FAQ

**Q: Does this require deep TypeScript knowledge?**
No. The MCP SDK handles all the protocol complexity. Your server file describes what tools it has and what the handler logic does. The TypeScript involved — imports, basic types, async functions — is introductory level. If you are comfortable reading JavaScript, you can follow this code.

**Q: Can I write the server in Python instead of TypeScript?**
Yes. The MCP SDK has official Python, Go, and other language implementations. The conceptual structure is the same — imports, server instance, list-tools handler, call-tool handler, transport connect. For QA teams already working in Python, the Python SDK may be more natural.

**Q: How do I add a second tool to the server?**
In the ListTools handler, add another object to the `tools` array. In the CallTool handler, add another `if` block. The rest of the file stays the same. Each tool gets its own `name`, `description`, `inputSchema`, and handler logic.

**Q: Should I commit this server to our team repository?**
Yes — a useful MCP server is shared infrastructure. Commit `src/server.ts`, `package.json`, and a short README explaining what the server does and how to register it. Each team member runs `npm install` and registers it with their own Claude Code using the absolute path on their machine. The server code runs locally on each developer's machine.

**Q: The AI is calling the wrong tool or not calling mine at all. What's wrong?**
The most likely cause is an unclear tool description. Claude reads descriptions to decide when to call a tool. Rewrite yours to be explicit: "Use this tool when the user asks about which tests failed, which tests are failing, or what the test results show. Do not use this for coverage analysis — that requires a different tool." More specific language leads to more reliable tool selection.
