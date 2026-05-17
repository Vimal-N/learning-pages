---
layout: reference.njk
title: "Session 02 Reference — The Evolution: From Chatbot to Coding Partner to Agent"
sessionNumber: "02"
sessionTitle: "The Evolution — From Chatbot to Coding Partner to Agent"
phase: "Phase 1: AI Foundations"
topicName: "AI in Practice"
topicUrl: "/topics/ai-in-practice/"
---

## Quick Reference

### The five eras at a glance

| Era | Example tools | How it worked | Why it fell short |
|---|---|---|---|
| **Rule-based chatbots** | Early customer service bots | Matched keywords to scripted responses | Broke on anything outside the script |
| **Voice assistants** | Siri, Alexa, Google Assistant | Speech recognition + intent matching + API calls | Narrow, brittle — "I don't understand that" |
| **Generative AI** | ChatGPT, Claude web | Transformer LLMs — predict and generate fluent text | General purpose but no access to your files or tools |
| **Coding assistants** | GitHub Copilot, Cursor | LLM with IDE integration — sees your open file | Reactive only — responds when you ask |
| **Agents** | Copilot Agent Mode, Claude Code | LLM with tools — reads files, runs commands, self-corrects | Still needs good goals and human review |

### What changed with generative AI (the key shift)

- Previous systems matched inputs to pre-defined outputs
- Transformers learn relationships between tokens across enormous datasets
- The output is generated, not retrieved — the model assembles a response from learned patterns
- This means fluency, reasoning across topics, and code generation — all from one model
- The cost: plausibility can outrun accuracy (hallucinations)

### What makes something an "agent"

- Has access to **tools** (read files, write files, run commands, call APIs)
- Can **plan** a multi-step task and work through it
- Can **self-correct** — reads error output and adjusts without you prompting each step
- You give it a **goal**, not a series of instructions

---

## Full Reference

## Why the earlier approaches kept failing

Understanding why each era disappointed helps explain why the current generation feels different — and what its actual limits are.

**Era 1 — Rule-based chatbots** responded by matching keywords to pre-written responses. They were deterministic and reliable within their narrow script, but any input outside that script produced a graceless failure. The system had no understanding of language — it was pattern matching, not comprehension.

**Era 2 — Voice assistants** added speech recognition and intent classification, plus the ability to call external APIs (set a timer, play music, check the weather). They were genuinely useful for a narrow set of tasks. But they couldn't hold a real conversation, couldn't work with your specific files or context, and were brittle the moment you asked for something that didn't fit a pre-built intent category.

Both eras shared the same fundamental limitation: the intelligence was fully encoded by humans writing rules and scripts. Every capability had to be explicitly programmed.

## The transformer model — what actually changed

In 2017, a research paper introduced the transformer architecture. By 2020, GPT-3 had demonstrated that scaling transformers with enough data and compute produced something qualitatively different from all prior approaches.

The key insight: train a model to predict the next token in a sequence across billions of examples of human text, and you get a system that generalises far beyond any scripted approach. It doesn't retrieve stored answers — it generates responses by assembling tokens based on learned patterns about language, facts, and reasoning.

The practical result: one model that can answer questions, write code, explain concepts, summarise documents, translate between languages, and carry on a coherent multi-turn conversation. Not because these capabilities were programmed separately — they emerged from the training objective.

**Why this matters for how you work with it:** Because the model generates rather than retrieves, the quality of your input shapes the quality of the output far more than with previous tools. A detailed, contextual prompt produces a qualitatively better response than a vague one. The model is working with what you give it.

## Coding assistants — why they're different from general chatbots

GitHub Copilot and similar tools added something important on top of raw LLM capability: integration with your working environment. Copilot can see your open file, your project structure, your existing function names and patterns. This context is included in the prompt automatically.

This changes what's possible. When Copilot suggests a test, it's not generating a generic test — it's generating one that matches the framework, naming conventions, and import patterns it can see in your code. The more context it has, the better the fit.

The limitation that remained: coding assistants are still reactive. They respond to what you ask. They can't look at your whole project, form a plan, execute multiple steps, check the results, and correct course on their own.

## What "agent" means — and why it matters now

The word "agent" is used loosely in the industry, but it has a meaningful technical definition: an AI system that has access to tools and can use them autonomously to complete a goal.

**Tools** are functions the model can call — read a file, write a file, run a terminal command, search the web, call an API. When a model has these capabilities, it can take actions in the world, not just generate text.

**Autonomy** means the model can plan a sequence of tool calls, execute them, observe the results, and adjust — without you prompting each individual step. You give it a goal like "add Playwright tests for the login flow" and it reads your code, creates files, runs the tests, sees if they pass, and fixes issues — all as a single task.

**Why this is a significant jump:** The previous tools required you to orchestrate every step. You asked Copilot to write a test, it gave you code, you pasted it in, you ran it, you went back to Copilot with the error message, it gave you a fix, you applied it. Agents compress this loop. You describe the outcome and supervise; the agent handles the steps.

**What hasn't changed:** You still need to review what the agent does. Agents can be confidently wrong. They can touch files you didn't intend. They can generate tests that look correct but don't test the right thing. The approval workflow (reviewing diffs before accepting changes) is not optional — it's the control mechanism that makes agent mode usable.

## The current state: where Copilot Agent Mode and Claude Code sit

**Copilot Agent Mode** lives inside VS Code. It's a good first agent experience because it's integrated into the editor you already use, the approval workflow is visual (you see diffs), and the scope is bounded to your current project. The cognitive overhead is relatively low.

**Claude Code** and similar terminal agents are more powerful and more open-ended. They can operate across any directory on your machine, manage git, read documentation from URLs, and work on complex multi-step tasks that span your whole project. They require more deliberate goal-setting and more careful review.

**For now, the right progression is:** get comfortable with Copilot Agent Mode first (Phase 2 of this series), then move to terminal agents (Phase 4) once you understand the agent pattern.

## FAQ

**Q: Is "agent" just a buzzword for Copilot?**
No. Standard Copilot chat is reactive — you send a message, it responds. Agent Mode is genuinely different: it has tools (read/write files, run commands), plans a sequence of actions, and self-corrects. The underlying model may be the same, but the operational mode is substantially different.

**Q: How is this different from just writing a script?**
A script does exactly what the programmer wrote — deterministic, predictable, narrow. An agent uses language understanding to interpret a goal and figure out the steps. It can handle inputs it has never seen before, adapt to the specific context of your project, and recover from unexpected errors. The cost is that it's less predictable than a script and requires human review.

**Q: Should I be worried about agents running code on my machine?**
Copilot Agent Mode requires your explicit approval for each file change. Terminal agents like Claude Code ask for permission before running commands (depending on configuration). Neither acts without your involvement. Treat the approval step the same way you treat reviewing a pull request — your responsibility is to understand what you're accepting, not to blindly click through.

**Q: Will agents replace developers and testers?**
Current agents are powerful tools for specific, well-scoped tasks. They make experienced engineers more productive. They don't replace the judgment, domain knowledge, and requirement understanding that a human brings. A QA engineer who understands what needs to be tested and can direct an agent to write that test is significantly more productive than either working alone.
