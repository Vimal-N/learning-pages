---
layout: reference.njk
title: "Session 19 Reference — Agents, Subagents & Building AI Workflows"
sessionNumber: "19"
sessionTitle: "Agents, Subagents & Building AI Workflows"
phase: "Phase 5: MCP, Agents & AI-Powered Workflows"
topicName: "AI in Practice"
topicUrl: "/topics/ai-in-practice/"
---

## Quick Reference

### What makes something an agent

An agent is not just a chatbot. It has four components working together:

| Component | What it is | Example |
| --- | --- | --- |
| **Model** | The intelligence — reasons, plans, generates | Claude Sonnet, GPT-4o, Gemini |
| **Tools** | The capabilities to act | read_file, run_test, create_issue, browser_click |
| **Memory** | Context about the task and what has happened | Conversation history, files read, prior results |
| **Goal** | A task that requires multiple steps and decisions | "Investigate CI failures and create tickets" |

> Claude Code with MCP tools enabled is an agent. Copilot Chat by itself is not — it lacks tools that take real actions.

### The agent loop — five stages

| Stage | What happens |
| --- | --- |
| **Perceive** | Read task, available tools, and current state |
| **Think** | Reason about the best next action |
| **Act** | Call a tool or return output |
| **Observe** | Receive the tool result, update context |
| **Decide** | Goal met? Stop. More to do? Loop back. |

Most tasks complete in 5–20 cycles. The model, not your code, decides when to stop.

### How to build an agent — three ingredients

| Ingredient | What it does | Where to set it |
| --- | --- | --- |
| **Model** | The brain — multi-step reasoning | API call: `model="claude-opus-4-7"` |
| **Tools** | Functions the agent can call | `tools=[{name, description, input_schema}]` |
| **System prompt** | Role, goal, and constraints | `system="You are a QA agent. Read from /reports/ only."` |

### Orchestrator and worker pattern

```text
Orchestrator Agent
    "CI tests failed. Coordinate the failure response."
         |                    |                    |
    Analyser Agent    Ticket Creator Agent    Notifier Agent
    Reads report      Creates GitHub issue    Posts to Slack
    Identifies        with full context       with summary
    root cause
         |                    |                    |
  Filesystem MCP          GitHub API           Slack API
```

Each worker specialises in one job. The orchestrator decides sequence and routing. You define the goal once.

### Multi-agent coordination patterns

| Pattern | When to use | How it works |
| --- | --- | --- |
| **Sequential chain** | Steps must happen in order | A → B → C, each output feeds the next |
| **Parallel fan-out** | Tasks are independent | Orchestrator → [A, B, C] simultaneously → merge |
| **Hierarchical** | Large complex tasks | Orchestrator → sub-orchestrators → workers |

### A fully automated CI triage workflow

| Step | Action | Tool used |
| --- | --- | --- |
| 1 | CI completes — webhook fires a Claude Code session | (trigger) |
| 2 | Read test results from CI artifacts | Filesystem MCP |
| 3 | Identify root cause from error messages | Model reasoning |
| 4 | Read failing test + relevant source files | Filesystem MCP |
| 5 | Create bug ticket with full context | GitHub MCP |
| 6 | Post summary to #qa-alerts channel | Slack MCP |
| **Result** | Total time: ~2 minutes | All automated |

### What agents handle well vs what stays human

| Agents handle well | Humans still essential |
| --- | --- |
| Reading and summarising test reports | Deciding what to test and why |
| Creating tickets with standard information | Evaluating product quality and risk |
| Generating test code from specifications | Investigating truly novel failures |
| Updating tests after selector changes | Working with teams on priorities |
| Posting routine status updates | Catching what tests cannot catch |

### Before you deploy — four safeguards

- **Scope constraints** — write explicit limits in the system prompt: allowed paths, forbidden actions
- **Approval gates** — pause before irreversible actions (posting, creating tickets) for human review
- **Stopping conditions** — max tool calls, time budget, halt on repeated errors
- **Audit trail** — log every tool call: name, arguments, result, timestamp

### Your next steps — this week

1. Pick one real test you need to write — use Copilot Chat or Claude Code to write it, review it carefully, commit it
2. Ask AI to review one existing test file for quality issues — fix at least one problem it identifies
3. Install and try Claude Code or Opencode — give it one multi-file task, see how it approaches the project
4. Add the filesystem MCP server to Claude Code — ask it to read and summarise a file you care about

---

## Full Reference

## What an agent actually is

The word "agent" has been used throughout this series. This final session gives it a precise definition now that there is enough context to appreciate it.

An agent is an AI system that can take actions in the world — not just produce text. Four components are required:

**A model** provides the intelligence. The model reasons about the current state, plans the next step, and decides which action to take. Without a model, there is no decision-making. Models include Claude, GPT-4o, Gemini, and others.

**Tools** provide the capabilities to act. A model alone can only produce text — it cannot read your files, run your tests, or create a ticket. Tools are the bridge from reasoning to action. In Claude Code, MCP servers provide these tools.

**Memory (context)** provides continuity. An agent needs to know what it has already done, what worked, what failed, and what the current state is. In Claude Code, this is the conversation history plus the context files the agent has read during the session.

**A goal** provides direction. Not just a question to answer — a task that requires multiple steps, decisions, and tool calls to complete. "Investigate the CI failures from tonight's run and create tickets for any new failures" is an agent goal. "What does `waitForLoadState` do?" is a question, not an agent goal.

When all four components are present, you have an agent. Claude Code with MCP tools enabled is an agent. Copilot Chat with no tool access is not — it can reason and produce text, but it cannot act.

## Orchestrators and workers — the subagent pattern

A single agent handles one task at a time. The next level of complexity is multiple agents working together: one orchestrator agent that receives a high-level goal and coordinates worker agents that each specialise in a specific job.

**The orchestrator** does not do the work directly. It receives the goal ("CI tests just ran. Coordinate the failure response"), decides which worker to call, passes the right inputs, and assembles the outputs into a coherent result.

**Worker agents** each specialise in one domain. A test reader agent knows how to parse test results and identify failures. A ticket creator agent knows how to format and submit bug reports. A notifier agent knows how to compose and send Slack messages. Each worker has its own set of tools appropriate to its job.

The analogy from the session: a project manager (orchestrator) coordinating a team of specialists (workers). The PM does not write the code, design the UI, and configure the database — they direct the right person to do each thing at the right time.

**Why does this pattern matter for QA?**

A single-agent workflow handles linear tasks well: investigate this failure, write this test, review this file. But real QA workflows are parallel and multi-system: after CI fails, simultaneously check what changed in GitHub, create tickets in Jira, and notify Slack — then wait for developer responses and rerun affected tests. This complexity naturally decomposes into specialised workers.

## A real agentic QA workflow, step by step

This workflow is achievable today with Claude Code, MCP servers, and a webhook trigger. Some teams are already running versions of it.

**Trigger:** CI pipeline completes — tests failed. A webhook fires and starts a Claude Code session with a pre-written prompt.

**Step 1 — Read test results (Filesystem MCP):** The agent reads the test report file from CI artifacts. It identifies 3 failures with error messages and file locations.

**Step 2 — Reason about root cause (Model):** The agent analyses the error messages against its knowledge of the codebase. It forms hypotheses: "This looks like a selector change", "This looks like an async timing issue".

**Step 3 — Read failing test files (Filesystem MCP):** The agent reads the specific test files that are failing, plus any source files they reference. It refines its root cause hypotheses with concrete evidence.

**Step 4 — Check recent changes (GitHub MCP):** The agent queries recent commits and merged PRs for files related to the failing tests. It correlates the failures with specific code changes.

**Step 5 — Create tickets (GitHub MCP):** For each confirmed failure, the agent creates a GitHub issue containing: the failing test name, the error message, the root cause hypothesis, the relevant PR or commit, and suggested investigation steps.

**Step 6 — Notify the team (Slack MCP):** The agent posts a summary to `#qa-alerts`: "CI failed at 11:47pm. 3 failures. Root causes identified. Tickets #234, #235, #236 created. Likely caused by PR #847 (checkout button rename) and PR #851 (async validation)."

Total elapsed time: approximately 2 minutes. You wake up in the morning with failures already investigated, triaged, and documented.

## What stays human

This is the part of the session the slides address directly, because the anxiety is real.

Agents do not replace QA engineers. They eliminate the mechanical parts of the job — reading reports, creating tickets with boilerplate information, sending status updates, updating tests after routine selector changes. These tasks are time-consuming but do not require human judgement.

What requires human judgement — and always will:

**Test strategy decisions.** What to test, how much to test it, what risk threshold is acceptable, how to prioritise coverage gaps. These involve product knowledge, business context, and risk tolerance that agents cannot evaluate.

**Product quality assessment.** Is this feature actually good enough to ship? Does the UX feel right? Are there edge cases that feel wrong even if they are not explicitly broken? This is qualitative judgement.

**Novel failure investigation.** When a bug does not fit the pattern of anything the agent has seen before, human expertise becomes essential. Agents are good at pattern-matching; truly novel failures require creative problem-solving.

**Team coordination and priorities.** Working with developers to explain failures, negotiating what gets fixed before release, escalating appropriately. Human relationships and communication are required.

**Catching what tests cannot catch.** A test suite checks what you told it to check. A human QA engineer catches the things no one thought to specify. Exploratory testing, user empathy, and recognising "this will confuse people" are human capabilities.

The teams that learn to use agentic AI tools effectively are not replaced — they become more effective. Mechanical work gets automated; their time shifts toward higher-value judgement work.

<div class="ref-page-break"></div>

## The series in five phases

This final session is a good moment to situate everything in context.

**Phase 1 — Foundations:** What AI is, how it works, what it is good at, how to write prompts that produce useful results. The mental models for everything that followed.

**Phase 2 — GitHub Copilot:** Setup, daily workflow patterns, Copilot Chat, Agent Mode for multi-file tasks in VS Code.

**Phase 3 — AI for QA Automation:** Writing tests from scratch, debugging failures, refactoring test suites, improving test quality.

**Phase 4 — Terminal Agents:** Agent evolution, context files, Claude Code and Opencode, GCSV prompts, git checkpoints, the tool comparison framework.

**Phase 5 — MCP and Agents:** The Model Context Protocol, using community servers, building custom servers, and the orchestrator/worker pattern.

The progression is deliberate: each phase builds on the last. The skills from Phases 1-3 make Phases 4-5 comprehensible. The ability to direct a multi-agent workflow effectively depends on understanding how to write a good prompt (Phase 1), how agents explore codebases (Phase 4), and how MCP tools extend agent capabilities (Phase 5).

## The direction of travel

This technology is moving fast. The session is honest about what is speculation versus established trajectory.

**Models are improving rapidly.** Tasks that require careful prompting today — precise tool selection, coherent multi-step planning, reliably staying within scope — will be more reliable and intuitive as models improve. The threshold for what agents can handle autonomously is rising.

**The MCP ecosystem is growing.** More services, tools, and integrations are becoming MCP-compatible each month. The standardisation network effect is real: once the protocol is widely adopted, the cost of building any new integration drops significantly.

**Multi-agent coordination is becoming mainstream.** What requires custom orchestration code today will become configurable workflow tooling. The conceptual patterns — orchestrators, workers, specialised agents — will remain relevant even as the tooling to implement them gets easier.

**The skills compound.** Every prompt you write, every agent session you run, every MCP integration you set up makes the next one easier and more effective. Starting now — with imperfect tools, on tasks that sometimes require correction — builds the intuition that makes you effective as the technology matures.

<div class="ref-page-break"></div>

## Build your first QA triage agent — a complete walkthrough

This is a real, runnable example. It builds a minimal agent that reads a test results file, analyses failures, and writes a triage report. You can adapt this to your own test suite.

**Prerequisites:** Python 3.9+, the Anthropic SDK (`pip install anthropic`), and an API key set as `ANTHROPIC_API_KEY` in your environment.

### Step 1 — Define the tools

Tools are the actions the agent can take. Each tool needs a name, a description (the model reads this to decide when and how to call it), and an input schema.

```python
tools = [
    {
        "name": "read_file",
        "description": "Read the contents of a text file. Use this to read test reports.",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "Relative path to the file"}
            },
            "required": ["path"]
        }
    },
    {
        "name": "write_file",
        "description": "Write text content to a file. Use this to save the triage report.",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string"},
                "content": {"type": "string"}
            },
            "required": ["path", "content"]
        }
    }
]
```

**Why descriptions matter:** The model uses the description — not the name — to decide when to call a tool and what arguments to pass. Vague descriptions produce unreliable tool selection. Be specific.

### Step 2 — Write the system prompt

The system prompt sets the agent's role, goal, and constraints. This is your primary guardrail.

```python
system = """You are a QA triage agent. Your goal is to analyse test failures and produce a structured triage report.

You have two tools:
- read_file: to read the test report
- write_file: to save your triage output

Constraints:
- Only read files in the ./reports/ directory
- Write your output to ./reports/triage-output.md only
- Do not modify any source code or test files
- If a file does not exist, say so clearly — do not invent content

Your triage report must cover each failure with: test name, error message, most likely root cause, and recommended next action.
When done, confirm what you wrote and where."""
```

### Step 3 — Implement the tool executor and agent loop

The agent loop is what drives the perceive-think-act-observe cycle. You execute the tool calls the model requests and feed the results back.

```python
import anthropic
import os

client = anthropic.Anthropic()

def execute_tool(name, inputs):
    if name == "read_file":
        try:
            with open(inputs["path"], "r") as f:
                return f.read()
        except FileNotFoundError:
            return f"Error: file not found at {inputs['path']}"
    if name == "write_file":
        os.makedirs(os.path.dirname(inputs["path"]), exist_ok=True)
        with open(inputs["path"], "w") as f:
            f.write(inputs["content"])
        return f"Written to {inputs['path']} ({len(inputs['content'])} chars)"
    return f"Unknown tool: {name}"

def run_agent(task: str, max_cycles: int = 20) -> str:
    messages = [{"role": "user", "content": task}]

    for cycle in range(max_cycles):
        response = client.messages.create(
            model="claude-opus-4-7",
            max_tokens=4096,
            system=system,
            tools=tools,
            messages=messages
        )

        # Append model response to history
        messages.append({"role": "assistant", "content": response.content})

        # Done — return the final text
        if response.stop_reason == "end_turn":
            return next(
                (b.text for b in response.content if hasattr(b, "text")), ""
            )

        # Execute each tool call, collect results
        results = []
        for block in response.content:
            if block.type == "tool_use":
                result = execute_tool(block.name, block.input)
                results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result
                })

        messages.append({"role": "user", "content": results})

    return "Stopped: max_cycles reached without completion"
```

### Step 4 — Run it

Create a sample test report at `./reports/latest.txt`, then trigger the agent:

```python
# Create a sample test report
os.makedirs("./reports", exist_ok=True)
with open("./reports/latest.txt", "w") as f:
    f.write("""FAILED tests/checkout/payment_test.py::test_card_submission
AssertionError: Expected 'Payment successful' but got 'Payment failed'
Element: #submit-btn  Selector: [data-testid='submit-payment']

FAILED tests/auth/login_test.py::test_sso_redirect
TimeoutError: Waiting for element .sso-redirect-button (5000ms)
Element not found after navigation to /auth/sso

FAILED tests/cart/add_item_test.py::test_add_out_of_stock
Expected status 422 but received 200
Request: POST /api/cart/items  Body: {"sku": "WIDGET-007", "qty": 1}
""")

result = run_agent(
    "Read the test report at ./reports/latest.txt and write a triage summary to ./reports/triage-output.md"
)
print(result)
```

### What to watch in the output

The model's response stream shows the loop in action:

1. **Perceive + Think:** Model reads the task and forms a plan
2. **Act:** Calls `read_file` for `./reports/latest.txt`
3. **Observe:** Receives the file content — three failures with error messages
4. **Think:** Analyses each failure, forms root cause hypotheses
5. **Act:** Calls `write_file` with the completed triage report
6. **Observe:** Receives confirmation that the write succeeded
7. **Decide:** Confirms completion and summarises what it did

The output file at `./reports/triage-output.md` will contain structured analysis for each failure. Read it — check whether the root cause hypotheses are plausible given the error messages. This is the moment to apply your own QA judgment.

### Common adjustments

**Agent reads files outside the reports directory** — add validation inside `execute_tool`:

```python
if name == "read_file" and not inputs["path"].startswith("./reports/"):
    return "Access denied: can only read from ./reports/"
```

**Agent loops too long without finishing** — the `max_cycles=20` parameter in `run_agent` stops it. Lower it for simpler tasks.

**Output format is inconsistent** — tighten the format requirement in the system prompt:

```text
For each failure write exactly:
## [test name]
**Root cause:** [one sentence hypothesis]
**Evidence:** [specific text from the error that supports it]
**Next action:** [what to check or fix first]
```

**Adding more tools** — extend the `tools` list and `execute_tool` function. Common additions: `list_directory` (scan for all test reports), `append_file` (add to an existing report), `http_get` (query a CI API for run metadata).

## FAQ

**Q: Can I build a multi-agent workflow right now, or is this future technology?**
The patterns exist now, but the tooling is still evolving. Today, a multi-agent workflow typically requires either writing orchestration code (calling agents programmatically) or carefully structuring a single Claude Code session with multiple MCP servers. Dedicated multi-agent orchestration tools are emerging but not yet mainstream. The concepts are real and applicable now; the ease of implementation will improve significantly over the next 12-18 months.

**Q: How do agents handle mistakes? What happens when an agent does the wrong thing?**
This is why the git checkpoint before any agent session is non-negotiable. When an agent does something unexpected or wrong, you need a clean state to return to. In more complex workflows, design in human review points — moments where the agent surfaces its findings and waits for approval before taking irreversible actions like creating tickets or sending notifications. Start conservative; grant more autonomy as you understand the agent's behaviour in your specific context.

**Q: Will AI replace QA engineers?**
Not QA engineers who adapt. The mechanical parts of QA work — parsing test reports, creating boilerplate tickets, updating tests after routine UI changes — will increasingly be automated. The parts that require human judgement — test strategy, product quality assessment, novel failure investigation, team coordination — will remain human. The demand for people who can effectively direct AI tools in a QA context is likely to increase, not decrease. Learning these tools now puts you ahead of that curve.

**Q: What is the single most useful thing to do this week with what I've learned in this series?**
Pick one repetitive task in your current QA work — something you do manually and regularly — and try to automate it with a combination of what you have learned. Writing a test that keeps breaking from a selector change: ask Claude Code to investigate and fix it. Manually reading test reports after each CI run: set up the filesystem MCP server and ask Claude to summarise them. Creating the same type of ticket over and over: try the GitHub MCP server. One concrete automation, applied to a real problem you have right now, builds more lasting skill than any amount of study.

**Q: The technology is changing so fast. How do I keep up without spending all my time learning tools?**
Focus on concepts, not tools. The specific commands, config formats, and server names will change. The underlying concepts — how to write a good prompt, how agents plan and use tools, how MCP connects AI to systems, how to review agent output critically — will remain relevant even as the surface details shift. When a new tool appears, ask "which of these concepts does it implement?" If it is familiar conceptually, you will learn it quickly.
