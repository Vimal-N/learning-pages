# V2 Style Guide — AI in Practice Session Pages

This guide defines every component used in V2 session pages. Use it as the single source of truth when adding or editing content. Always use the semantic class + `custom-style` attribute so future edits can be targeted precisely.

**Style reference page:** `/style-pattern/` — live demo of every component.  
**CSS source:** `src/_layouts/guide.njk` (lines ~422–650).

---

## Custom-Style Attribute Convention

Every identifiable component must carry a `custom-style` attribute matching its component name. This makes grep-based targeting unambiguous:

```bash
# Find all row cards across all sessions
grep -r 'custom-style="row-card"' src/topics/ai-in-practice-v2/
```

**Rule:** Never add a V2 component without its `custom-style` attribute.

---

## Component Inventory

### 1. Page Structure

#### Version Stamp
```html
<div class="v2-version-stamp" custom-style="version-stamp">
  Session 02 &nbsp;·&nbsp; Phase 1: AI Foundations &nbsp;·&nbsp; Beginner
</div>
```

#### Quick Start Block
```html
<div class="v2-quickstart" custom-style="quick-start">
  <div class="v2-qs-icon">⚡</div>
  <div>
    <div class="v2-qs-label">What you'll get from this session</div>
    <div class="v2-qs-text">…</div>
  </div>
</div>
```

---

### 2. Callout Cards

All callouts share the base class `.v2-callout` plus a variant modifier.

| `custom-style` value | Class | Use |
|---|---|---|
| `callout-info` | `.v2-callout.info` | Welcome / informational (blue) |
| `callout-warning` | `.v2-callout.warning` | Critical point, mindset shift (amber) |
| `callout-danger` | `.v2-callout.danger` | Common mistake, don't do this (red) |
| `callout-success` | `.v2-callout.success` | End of chapter / positive reinforcement (green) |

```html
<div class="v2-callout info" custom-style="callout-info">
  <p>…</p>
</div>
```

---

### 3. Content Cards

#### Row Card — compact ERA / timeline entry
Two-column grid: 100px left (badge + name + date), 1fr right (body). Option G frosted glass + amber title.

```html
<div class="v2-card-list" custom-style="row-card-list">
  <div class="v2-row-card" custom-style="row-card">
    <div>
      <div class="v2-era-badge">ERA 1</div>
      <div class="v2-era-name">Rule-Based Bots</div>
      <div class="v2-era-date">~2010–2017</div>
    </div>
    <div class="v2-card-body">Body text here.</div>
  </div>
</div>
```

**Alignment rule:** `.v2-row-card` uses `align-items: center` — both columns are vertically centered against each other.

#### Info Card — tool / mode entry
Two-column grid: 160px left (tool name + mode), 1fr right (body). Option G frosted glass + amber tool name.

```html
<div class="v2-card-list" custom-style="info-card-list">
  <div class="v2-info-card" custom-style="info-card">
    <div>
      <div class="v2-tool-name">Copilot Agent Mode</div>
      <div class="v2-tool-mode">Semi-autonomous</div>
    </div>
    <div class="v2-card-body">Body text here.</div>
  </div>
</div>
```

#### Era Card — expanded ERA detail with example
Full-width card. Header row: badge + name + date. Body paragraph. Example sub-block.

```html
<div class="v2-era-card" custom-style="era-card">
  <div class="v2-era-card-header">
    <span class="v2-era-badge">ERA 1</span>
    <span class="v2-era-name">Rule-Based Bots</span>
    <span class="v2-era-date">~2010–2017</span>
  </div>
  <div class="v2-card-body">Description here.</div>
  <div class="v2-example-box">
    <div class="v2-example-label">Example</div>
    <div class="v2-example-text">Narrative example here.</div>
  </div>
</div>
```

#### Comparison Card
Side-by-side two columns. Use `.v2-col` variant: `neutral`, `good`, `bad`, `info`.

```html
<div class="v2-two-col" custom-style="comparison-card">
  <div class="v2-col neutral">
    <div class="v2-col-label">Before</div>
    <ul>…</ul>
  </div>
  <div class="v2-col good">
    <div class="v2-col-label">After</div>
    <ul>…</ul>
  </div>
</div>
```

#### Context Reference Card
Used for showing context window items, file references, prior session content.

```html
<div class="v2-context-grid" custom-style="context-ref-card-list">
  <div class="v2-context-card" custom-style="context-ref-card">
    <div class="v2-context-header">
      <span class="v2-context-tag">FILE</span>
      <span class="v2-context-title">playwright.config.ts</span>
    </div>
    <div class="v2-context-desc">…</div>
    <div class="v2-context-meta">
      <span class="v2-context-key">Why it matters</span>
      <span class="v2-context-val">…</span>
    </div>
  </div>
</div>
```

#### Pattern Card
Used for named prompt/workflow patterns with code examples.

```html
<div class="v2-pattern-card" custom-style="pattern-card">
  <div class="v2-pattern-num">Pattern 01</div>
  <div class="v2-pattern-title">Pattern title</div>
  <div class="v2-pattern-section">
    <div class="v2-pattern-section-label">Prompt</div>
    <div class="v2-code-wrap" custom-style="code-block">
      <button class="v2-copy-btn">copy</button>
      <div class="code-block"><pre>…</pre></div>
    </div>
  </div>
</div>
```

#### Transcript Card
Used for agent mode conversation transcripts.

```html
<div class="v2-transcript" custom-style="transcript-card">
  <div class="v2-transcript-header">Agent Mode Transcript — N steps</div>
  <div class="v2-turn" custom-style="transcript-turn">
    <div class="v2-turn-role user">You</div>
    <div class="v2-turn-text">…</div>
  </div>
  <div class="v2-turn" custom-style="transcript-turn">
    <div class="v2-turn-role agent">Agent</div>
    <div class="v2-turn-text">…</div>
  </div>
</div>
```

---

### 4. Lists, Steps & Decisions

#### Step List
Numbered or arrow-marked sequence. Uses `var(--bg-elevated)` — NOT frosted glass.

```html
<div class="v2-step-list" custom-style="step-list">
  <div class="v2-step" custom-style="step">
    <div class="v2-step-num">1</div>
    <div>
      <div class="v2-step-title">Step title</div>
      <div class="v2-step-body">Step description.</div>
    </div>
  </div>
</div>
```
For arrow steps, use `→` as the `v2-step-num` value and write the title inline as `<strong class="v2-step-title">`.

#### Decision Grid
When to use which tool.

```html
<div class="v2-decision-grid" custom-style="decision-grid">
  <div class="v2-decision-row" custom-style="decision-row">
    <div class="v2-decision-when">Condition or scenario</div>
    <div class="v2-decision-use">Tool name</div>
  </div>
</div>
```

#### Progress Marker
Inline tag marking cumulative skill.

```html
<span class="v2-progressive-marker" custom-style="progress-marker">▲ Builds on Session 02</span>
```

---

### 5. Text Structure

#### Section Header (h3 — subsection within a slide)
```html
<h3>Subsection title</h3>
```

#### Scenario Block (h4 + paragraphs)
```html
<h4>Scenario: brief scenario name</h4>
<p>…</p>
```

---

### 6. Code & Reference

#### Code Block
```html
<div class="v2-code-wrap" custom-style="code-block">
  <button class="v2-copy-btn">copy</button>
  <div class="code-block"><pre>…code here…</pre></div>
</div>
```

#### Reference Table
```html
<table class="v2-ref-table" custom-style="ref-table">
  <thead>
    <tr><th>Command</th><th>What it does</th></tr>
  </thead>
  <tbody>
    <tr><td><code>/clear</code></td><td>…</td></tr>
  </tbody>
</table>
```

---

### 7. Interactive Blocks

#### Self-Assessment Block
```html
<div class="v2-self-check" custom-style="self-assessment">
  <div class="v2-self-check-title">Session N — Knowledge Check</div>
  <div class="v2-self-check-sub">Tick each one when you can genuinely say "yes, I understand this"</div>
  <ul class="v2-check-list">
    <li class="v2-check-item"><div class="v2-checkbox"></div>Checkpoint text</li>
  </ul>
</div>
```

#### Try This Block
```html
<div class="v2-try-this" custom-style="try-this">
  <div class="v2-try-label">Try This — N minutes</div>
  <p>Task description here.</p>
</div>
```

---

## Colour & Token Reference

| Token | Value | Used for |
|---|---|---|
| `--accent` | amber | Primary accent, step numbers, badges |
| `--blue` | blue | Info callout border |
| `--green` | green | Success callout, good col |
| `--red` | red | Danger callout border |
| `--purple` | purple | Context tag, progress marker |
| `--cyan` | teal | Quickstart, Try This border |
| `#b07020` | warm amber | `.v2-era-name`, `.v2-tool-name` title colour (Option G) |
| `rgba(255,255,255,0.06)` | near-black frosted | Row Card background |
| `rgba(255,255,255,0.18)` | slightly lighter frosted | Info Card background |

---

## Rules for Agents

1. **Never use inline styles** for any component that has a named class. If content doesn't fit an existing component, propose a new one first.
2. **Always include `custom-style` attribute** on every identifiable component.
3. **Row cards use `align-items: center`** — both columns center vertically. Don't override this.
4. **Frosted glass only on Row Card, Info Card, Era Card.** Step List, Decision Grid, and Context Card use `var(--bg-elevated)`.
5. **ERA badges and tool names always use amber** (`#b07020`). Never change to a position-specific colour.
6. **Section headers use the existing `v2-section-hd` pattern**, not bare `<h2>` tags outside the slide wrapper.
7. **`v2-callout warning`** = mindset shift / critical point. **`v2-callout danger`** = common mistake / don't do this. These are not interchangeable.
8. **Check `/style-pattern/`** when uncertain about how a component should look before adding new content.
