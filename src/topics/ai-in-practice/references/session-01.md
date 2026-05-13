---
layout: reference.njk
title: "Session 01 Reference — What Is AI and Why Is Everyone Talking About It?"
sessionNumber: "01"
sessionTitle: "What Is AI and Why Is Everyone Talking About It?"
phase: "Phase 1: AI Foundations"
topicName: "AI in Practice"
topicUrl: "/topics/ai-in-practice/"
---

## Quick Reference

### Key terminology

| Term | What it actually means |
|---|---|
| **AI** | A broad category — any system that does something that would require intelligence if a human did it |
| **Machine Learning** | AI that learns patterns from data rather than following explicit rules written by a programmer |
| **LLM** | A Large Language Model — a type of AI trained on enormous amounts of text to predict and generate language |
| **Training** | The process of exposing a model to data so it learns patterns — happens once, before you use the tool |
| **Inference** | When you use a trained model to generate a response — what happens every time you type a prompt |
| **Prompt** | The input you give to an AI — your question, instruction, or context |
| **Token** | A chunk of text (roughly a word or word-part) that the model processes — models have a limit on how many tokens they can handle at once |
| **Context window** | How much text the model can "see" at once — your entire conversation history counts toward this limit |
| **Hallucination** | When an AI generates something factually incorrect with complete confidence — it's a structural feature, not a bug |
| **Temperature** | A setting that controls how creative vs predictable the output is — higher = more varied, lower = more consistent |

### What AI is vs what it isn't

| AI is | AI is not |
|---|---|
| A very sophisticated pattern-matching and prediction system | A search engine that retrieves facts from a database |
| Trained on text that existed up to a cutoff date | Connected to the internet in real time (unless a tool explicitly says so) |
| Generating the most statistically likely next tokens | "Thinking" or "understanding" the way humans do |
| Consistently impressive at language tasks | Infallible — it can be confidently wrong |
| A tool that responds to how you frame the input | Able to read your mind — vague input produces vague output |

### Why QA engineers have an advantage

- You already think in scenarios, edge cases, and failure modes
- You're used to verifying outputs rather than trusting them
- You understand requirements and acceptance criteria — the key ingredient AI needs to write useful tests
- You're comfortable with iterative workflows (run, inspect, adjust)

---

## Full Reference

## How LLMs actually work

Understanding the basic mechanism behind LLMs changes how you use them. You don't need the mathematics — you need the mental model.

An LLM is trained by processing an enormous amount of text (books, web pages, code, documentation) and learning to predict what token should come next given the tokens before it. That's the entire training objective: predict the next word (roughly speaking). After enough training on enough data, this simple objective produces a system that can answer questions, write code, summarise documents, translate languages, and carry on a conversation.

When you send a prompt, the model doesn't look anything up. It generates a response one token at a time, each token chosen based on what's most likely given everything before it — your prompt and everything it has generated so far. This is why LLMs sometimes produce text that sounds authoritative but is factually wrong: they're optimising for plausibility, not truth.

**The practical consequence:** LLMs are very good at tasks where "what sounds right" overlaps strongly with "what is right." Writing code in a well-established framework is a great example — the model has seen thousands of correct examples. They're weaker at tasks that require precise factual accuracy, real-time information, or deep logical reasoning across many steps.

## Why hallucinations happen

Hallucination is not a bug that will be fixed in the next version. It's a consequence of how the model works. The model generates tokens based on probability — it doesn't have a verification step that checks whether what it's saying is true. When it doesn't have strong signal from training data, it generates something plausible rather than admitting uncertainty.

This is most likely to happen with:
- Very specific facts (exact version numbers, precise dates, obscure APIs)
- Things that changed after the model's training cutoff
- Niche topics where training data was sparse
- Logical chains that require many precise steps

**What to do about it:** Treat AI output the way you treat code from a developer you haven't worked with before — review it, run it, and verify assertions before you commit to it. This is exactly the mindset QA engineers already have.

## The context window and why it matters

Every conversation with an AI has a limit on how much text the model can process at once — the context window. Your entire conversation history counts: every message you sent, every response it gave, any code you pasted. When you approach the limit, older parts of the conversation start to disappear from the model's "view."

**Practical implications:**
- For long debugging sessions, start a fresh conversation periodically rather than one endless thread
- Paste only the relevant parts of your code, not an entire file, when asking for help
- If the model seems to "forget" context from earlier in the conversation, it may have scrolled out of the window
- Longer prompts with more context produce better results — but not infinitely so

## Why QA engineers are well-positioned for AI tools

Most people who struggle with AI tools are trying to use them as a search engine — type a question, expect a fact. QA engineers naturally approach AI differently, and this is an advantage.

**You already bring the hard part.** The value of AI-assisted test writing isn't that the AI knows what to test — it doesn't. It knows how to write the code for a test you've specified. The testing strategy, the acceptance criteria, the edge cases, the failure modes — that's what you bring. That's also exactly what most developers don't bring when they ask AI to "write some tests."

**You're built for verification.** When Copilot or Claude writes a test, the instinct to ask "would this actually catch a real bug?" is QA instinct. Most developers accept generated tests if they compile and pass. QA engineers know that a test that always passes regardless of application behaviour is worse than no test.

**You know requirements.** Acceptance criteria are the specification AI needs to write meaningful tests rather than generic placeholders. QA engineers work with ACs every day. This is a significant advantage.

## Common misconceptions

**"AI will replace QA engineers."**
The testing strategy, risk assessment, and requirement understanding that make QA valuable aren't things current AI tools do well. What AI does well is the mechanical coding part of test authoring. QA engineers who use AI tools effectively will write more tests in less time — making them more valuable, not less.

**"It's reading my code and learning from it."**
When you use Copilot or Claude, your code is processed to generate a response but is not used to retrain the model. The model you're using today is the same one millions of other developers are using. Your proprietary code doesn't become part of its training data (though reading your organisation's privacy policy for the specific tool is always worthwhile).

**"If it compiles and runs, it's probably correct."**
Running without errors is a very low bar. AI-generated code can be syntactically perfect, logically wrong, and pass basic tests. This is especially true for test code, where a test that always passes regardless of application state is exactly the kind of false confidence to avoid.

**"The more I ask it, the smarter it gets."**
Within a single conversation, the model does get better context as you add more information. But it doesn't learn or remember across conversations. Every new chat starts from scratch.

## FAQ

**Q: Does the AI remember our previous conversations?**
No. Each new conversation starts completely fresh. The model has no memory of previous sessions. If you need continuity, paste relevant context from a previous session into the new one.

**Q: Is it safe to paste our codebase into it?**
This depends on the tool and your organisation's policy. GitHub Copilot (used through VS Code with a work licence) has enterprise privacy controls. Public interfaces like Claude.ai or ChatGPT web treat input differently. When in doubt, don't paste anything you wouldn't put in a public code repository. Anonymise sensitive details (API keys, customer data, internal system names) before pasting.

**Q: Why does it give different answers to the same question?**
Temperature. LLMs have a degree of randomness in how they select tokens. The same prompt on two different occasions can produce different but equally valid responses. This is a feature for creative tasks and mildly annoying for tasks where you want a single consistent answer.

**Q: What's the training cutoff and does it matter for us?**
Most major models have a cutoff date beyond which they have no knowledge. For a QA engineer using AI to write Playwright tests, this rarely matters — Playwright's core API hasn't changed dramatically. But if you ask about a library released in the last six months, or a recently changed API, the model may not know about it or may give you outdated information.
