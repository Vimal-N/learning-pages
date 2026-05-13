# CLAUDE.md — Learning Hub Project Context

## Project Overview

This is **Learning Hub**, a static site serving as an engineering team training portal. It hosts multiple training topics, each containing structured session-based content delivered as HTML slide decks.

The site is designed to be presented live via screen share during team meetings AND browsed individually by team members on their own time.

## Tech Stack

- **Eleventy (11ty) v3.x** — static site generator, `npm run build` → `_site/`
- **Source directory**: `src/` — Nunjucks templates (`.njk`), HTML content files with YAML front matter
- **Layouts**: `src/_layouts/base.njk`, `src/_layouts/topic.njk`, `src/_layouts/session.njk`
- **Hosted on GitHub Pages** — build output from `_site/` goes live
- **Single shared CSS design system** (`src/styles.css`) — passthrough copied to `_site/`
- **Images**: `src/images/ai-in-practice/` — passthrough copied, named `sessionX-slideY.svg` or `sessionX-slideY.png`
- **Google Fonts loaded via CDN**: IBM Plex Mono, Source Serif 4, Outfit
- **No client-side framework** — plain HTML/CSS/JS in the browser

## Design System

The visual identity is **"terminal-meets-editorial"**:
- **Theme**: Light theme is the default on first visit; users can toggle to dark. Preference stored in `localStorage` as `lh-theme`.
- Charcoal dark base (`#121016`), NOT pure black — used in dark mode
- Warm amber/gold accent (`#e8a848`) — approachable, not cold
- Noise texture SVG overlay on body for depth
- Typography: IBM Plex Mono (code/labels/badges), Source Serif 4 (headings), Outfit (body text)
- Semantic colors: green (`#5ec269`), red (`#e85c5c`), blue (`#6fa3f7`), purple (`#b08cf5`), cyan (`#4ecdc4`)
- Component library in `styles.css` includes: cards, card grids, comparison columns, myth cards, timeline, prediction steps, chat mock, error output, stat callouts, adoption bars, quadrant grids, glossary items, takeaway lists, mistake rows, scenario badges, agenda lists, code blocks with syntax highlighting classes

### CSS Class Reference (key ones)

- `.session-badge` — pill-shaped label for session/topic identifiers
- `.card-grid.c2` / `.c3` — 2 or 3 column card layouts
- `.comparison` — side-by-side comparison columns (`.comp-col.negative` / `.positive` / `.neutral`)
- `.myth-card` — myth/reality paired content (uses `.myth-tag` / `.reality-tag`)
- `.timeline` / `.tl-node` / `.tl-dot` — horizontal timeline with nodes
- `.code-block` — styled code display with syntax classes: `.kw`, `.fn`, `.str`, `.cm`, `.num`, `.prop`
- `.chat-mock` / `.chat-msg.user` / `.chat-msg.ai` — simulated AI chat conversation
- `.error-output` — terminal error display (red tinted)
- `.stat-callout` — large number + description side by side
- `.glossary-item` / `.g-term` / `.g-def` / `.g-example` — glossary entries
- `.takeaway-list` — numbered takeaway items with counter badges
- `.mistake-row` — mistake/better-approach paired rows

### Slide Deck Engine (in styles.css)

Session pages use a built-in slide engine:
- `.deck` — full viewport container
- `.slide` / `.slide.active` — individual slides with fade transition
- `.progress-bar` — fixed top progress indicator
- `.nav-bar` — fixed bottom navigation with prev/next/notes buttons
- `.notes-panel` / `.notes-panel.open` — toggleable presenter notes drawer
- Keyboard: ← → arrows navigate, Spacebar advances, N toggles notes
- Touch: swipe left/right on mobile
- Each slide stores presenter notes in `data-notes` attribute (supports HTML)
- Notes support `.analogy-note` and `.warning-note` styled callout divs

## Directory Structure

```
learning-pages/
├── .eleventy.js                                  # Eleventy config (passthrough copy, layouts)
├── package.json                                  # npm scripts: "build" → npx @11ty/eleventy
├── _site/                                        # Build output (not committed)
└── src/
    ├── styles.css                                # Shared design system (passthrough copied)
    ├── images/
    │   └── ai-in-practice/                       # SVG/PNG diagrams, named sessionX-slideY.*
    ├── _layouts/
    │   ├── base.njk                              # HTML shell, theme toggle, fonts
    │   ├── topic.njk                             # Topic index layout (extends base)
    │   └── session.njk                           # Slide deck layout (extends base)
    ├── index.html                                # Portal landing page (layout: base.njk)
    └── topics/
        └── ai-in-practice/
            ├── index.html                        # AI series overview (19 sessions, 5 phases)
            └── sessions/
                ├── session-01.html  through session-19.html   # All 19 sessions ✅ COMPLETE
```

## Images Convention

Diagram images (SVG or PNG) live in `src/images/ai-in-practice/` and are referenced using
root-relative paths so they work at any host depth:

```html
<img src="/images/ai-in-practice/session4-slide3.svg" alt="..." style="width:100%;..."/>
```

Naming format: `sessionX-slideY.svg` (or `.png`). The Eleventy build passthrough-copies
`src/images/` → `_site/images/` unchanged.

## Navigation Pattern

- Portal home (`/`) links to each topic's index
- Topic index has breadcrumb back to portal: `← Learning Hub`
- Session slides have back link to topic page: `← AI in Practice`
- Theme toggle button is fixed top-right on every page

## Content Patterns

### Session Slide Deck (e.g., `sessions/session-01.html`)

Front matter:
```yaml
---
layout: session.njk
title: Session 01 — What Is AI...
---
```

- All slides are `<div class="slide">` inside `<div class="deck">`
- First slide gets `class="slide active"`
- Presenter notes in `data-notes="..."` attribute (HTML content, escaped)
- Session-specific styles go in an inline `<style>` block inside the content
- Navigation JS is provided by the `session.njk` layout — do not duplicate it in session files
- Slide counter format: `1 / 19` (varies by session)

### Inline SVG vs Image Tag

Diagrams can be either inline `<svg>` or an `<img>` pointing to `src/images/`:
- Prefer `<img>` when the SVG was edited externally (keeps source files clean)
- Use inline `<svg>` only for simple diagrams unlikely to be edited again

## About the AI Training Series

### Audience
QA engineers and test automation engineers. Mixed experience — some total beginners to AI, some have tried ChatGPT casually. They write Playwright/Cypress/Jest tests, use VS Code, and work with Git daily. Some feel intimidated by AI terminology.

### Instructor
A QA/test automation engineer who uses GitHub Copilot, Claude Code, and Opencode daily. Confident on Sessions 1–15 content. Still learning Sessions 16–19 (MCP, multi-agent) and is transparent about that with the team.

### Tone Rules
- Warm, zero-judgment, no jargon without explanation
- QA-specific examples preferred over generic tech examples
- Analogies from: everyday life, cooking, testing work itself
- Never condescending, never assumes they "should" already know something
- Presenter notes written in natural spoken voice, not corporate/formal
- Normalize not knowing things — explicitly

### Series Structure (19 sessions, 5 phases)

**Phase 1 — AI Foundations (Sessions 1–3)**
1. What Is AI and Why Is Everyone Talking About It? ✅ COMPLETE
2. The Evolution — From Chatbot to Coding Partner to Agent ✅ COMPLETE
3. How to Talk to AI — Prompting That Actually Works ✅ COMPLETE

**Phase 2 — GitHub Copilot Mastery (Sessions 4–6)**
4. Setting Up GitHub Copilot & Understanding What It Can Do ✅ COMPLETE
5. Copilot in Your Daily Workflow ✅ COMPLETE
6. Copilot Agent Mode — Your First Taste of Autonomous AI ✅ COMPLETE

**Phase 3 — AI for Test Automation & Debugging (Sessions 7–9)**
7. Writing Test Cases with AI — From Scratch to Suite ✅ COMPLETE
8. Debugging Tests with AI — Stop Guessing, Start Asking ✅ COMPLETE
9. Refactoring & Reviewing Your Test Suite with AI ✅ COMPLETE

**Phase 4 — Terminal Agents & Agentic Tools (Sessions 10–15)**
10. Introduction to Claude Code & Opencode ✅ COMPLETE
11. The Agent Evolution — From Inline Suggestion to Autonomous Agent ✅ COMPLETE
12. Context Files — CLAUDE.md, copilot_instructions.md & Agent.md ✅ COMPLETE
13. Working Effectively with Terminal Agents ✅ COMPLETE
14. Comparing Your AI Toolkit ✅ COMPLETE
15. Opencode with GitHub Copilot — Terminal Agent, Copilot-Powered ✅ COMPLETE

**Phase 5 — MCP, Agents & AI-Powered Workflows (Sessions 16–19)**
16. What Is MCP? Understanding the Model Context Protocol ✅ COMPLETE
17. Using MCP Servers in Your Workflow ✅ COMPLETE
18. Building Your First MCP Server ✅ COMPLETE
19. Agents, Subagents & Building AI Workflows ✅ COMPLETE

## What's Been Completed

- [x] Shared design system (`src/styles.css`) — full component library
- [x] Portal landing page (`src/index.html`)
- [x] AI in Practice topic page (`src/topics/ai-in-practice/index.html`)
- [x] All 19 session slide decks — fully written with SVG diagrams and presenter notes
- [x] External SVG/PNG diagrams in `src/images/ai-in-practice/` for edited slides
- [x] Light theme as default with dark toggle
- [x] Eleventy build config (`.eleventy.js`) with passthrough for `src/assets` and `src/images`

## Rules for Creating New Sessions

1. **Front matter must specify layout**: `layout: session.njk`
2. **Session-specific styles go in an inline `<style>` block** inside the session HTML content
3. **CSS and navigation JS are provided by `session.njk`** — do not add them to individual session files
4. **Back link points to topic index** (`/topics/ai-in-practice/`)
5. **Presenter notes go in `data-notes` attribute** — supports HTML including styled callouts
6. **Slide structure**: `<div class="slide" data-notes="..."><div class="slide-inner">` content `</div></div>`
7. **First slide** gets `class="slide active"`, all others just `class="slide"`
8. **Update the topic index** to change the session from `.upcoming` `<div>` to `.available` `<a>` link
9. **Maximum 5 bullet points per slide**, each a complete scannable thought
10. **Images**: place in `src/images/ai-in-practice/session[N]-slide[M].svg` and reference with `/images/ai-in-practice/...`

## Rules for Creating New Topics

1. Create folder: `src/topics/[topic-slug]/`
2. Create `src/topics/[topic-slug]/index.html` with YAML front matter `layout: topic.njk`
3. Create `src/topics/[topic-slug]/sessions/` folder for slide decks
4. Update portal `src/index.html` — change the topic card from `.coming-soon` `<div>` to `.active` `<a>`
5. Use a unique `--topic-accent` color for each topic card
