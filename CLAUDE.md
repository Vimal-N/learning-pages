# Learning Hub — Claude Code Instructions

## Project overview
Eleventy (11ty) v3.1.5 static site. Input dir: `src/`. Layouts: `src/_layouts/`. Output: `_site/`.

```
npm run build   # build
npm start       # dev server on :8080
```

## V2 AI in Practice sessions
Located at `src/topics/ai-in-practice-v2/guides/session-NN/index.html`. All use `layout: guide.njk`.

**Full component reference and rules → `docs/v2-style-guide.md`**. Read it before editing any V2 page.

**Style pattern demo page:** `/style-pattern/` (source: `src/card-demo/index.html`).

### Quick rules
- Never use inline styles for any component that has a named `v2-` class.
- Always add `custom-style="<component-name>"` to every identifiable V2 component.
- All V2 CSS lives in `src/_layouts/guide.njk`. Add new component styles there, not in individual session files.
- Row cards use `align-items: center`. ERA names and tool names are always `#b07020` (warm amber).

## Topic structure
- `src/topics/ai-in-practice-v2/` — 6-session V2 course for QA engineers
- `src/topics/ai-in-practice/` — original V1 course (do not use V2 components here)
- `src/topics/azure-devops-pipelines/` — 10-session ADO Pipelines course

## Don't add to home page unless asked
The home page (`src/index.html`) is manually curated. Never auto-add new topics or pages there.
