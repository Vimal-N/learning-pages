# META PROMPT — Learning Hub Session Builder
# ═══════════════════════════════════════════
# 
# HOW TO USE:
# 1. Open Claude Code in your learning-pages/ project directory
# 2. Claude Code will automatically read CLAUDE.md for project context
# 3. Copy the prompt below and paste it into Claude Code
# 4. Replace [SESSION_NUMBER] with the session you want to build (e.g., 2)
# 5. Claude Code will create the HTML file and update the topic index
#
# IMPORTANT: The full session definitions (content outlines, talking points,
# instructor notes) are in the master training prompt (PROJECT_INSTRUCTIONS.md).
# This meta prompt tells Claude Code HOW to build. PROJECT_INSTRUCTIONS.md
# tells it WHAT to build. Provide the session definition alongside this prompt.
#
# NOTE: The project now uses Eleventy (11ty) v3.x. Source is in src/.
# Sessions use YAML front matter (layout: session.njk). CSS and nav JS are
# provided by the layout — do not add them manually to session files.
# Build with: npm run build
# ═══════════════════════════════════════════


## PROMPT — Copy everything below this line into Claude Code:

---

I'm building Session [SESSION_NUMBER] for the AI in Practice training series in my Learning Hub project. Read CLAUDE.md first for full project context, design system reference, and file structure.

### What I need you to do:

1. **Create the session slide deck** at `src/topics/ai-in-practice/sessions/session-[XX].html` where [XX] is the zero-padded session number (e.g., session-02.html)

2. **Add YAML front matter** at the top of the session file:
   ```yaml
   ---
   layout: session.njk
   title: Session [XX] — [Session Title]
   ---
   ```

3. **Update the topic index** at `src/topics/ai-in-practice/index.html` — change Session [SESSION_NUMBER] from an upcoming `<div>` to an available `<a>` link pointing to the session URL

4. **Follow these structural rules exactly:**
   - CSS and navigation JS are provided by `session.njk` — do NOT add them manually
   - Session-specific styles go in an inline `<style>` block in the content (not in `<head>`)
   - Every slide: `<div class="slide" data-notes="..."><div class="slide-inner">` content `</div></div>`
   - First slide gets `class="slide active"`, all others just `class="slide"`
   - Presenter notes in `data-notes` attribute with HTML content
   - Use `.analogy-note` and `.warning-note` divs inside notes where appropriate
   - Maximum 5 bullet points per slide

5. **Use the design system components from styles.css** — don't recreate what already exists. Key components:
   - `.session-badge` for session identifier
   - `.card-grid.c2` / `.c3` for card layouts
   - `.comparison` with `.comp-col.negative` / `.positive` / `.neutral`
   - `.code-block` with syntax classes (`.kw`, `.fn`, `.str`, `.cm`, `.prop`)
   - `.chat-mock` / `.chat-msg.user` / `.chat-msg.ai` for AI conversation examples
   - `.myth-card` for myth/reality pairs
   - `.timeline` for chronological content
   - `.stat-callout` for key statistics
   - `.glossary-item` for terminology
   - `.takeaway-list` for closing takeaways
   - `.mistake-row` for common mistakes
   - Session-specific styles go in an inline `<style>` block in the content

6. **SVG diagrams:**
   - For simple inline diagrams: use `<svg>` directly in the slide content
   - For externally edited diagrams: use `<img src="/images/ai-in-practice/sessionX-slideY.svg" ...>`
   - Images must be placed in `src/images/ai-in-practice/` before building

7. **Tone and content rules:**
   - Audience: QA engineers, mixed experience, some intimidated by AI
   - Use QA/testing examples (Playwright, Cypress, Jest) wherever possible
   - Analogies from everyday life, cooking, testing work — not other technical domains
   - Presenter notes in natural spoken voice — not formal or corporate
   - Normalize not knowing things
   - Reference prior sessions: "Remember in Session X when we..."
   - Every new term gets a plain-English definition the first time it appears

8. **Slide structure for every session:**
   - Slide 0: Title slide (session badge, title, duration, difficulty, summary)
   - Slide 1: Opening hook (surprising stat, relatable scenario, or question)
   - Slide 2: Agenda
   - Slides 3-N: Core concept slides (one major concept per slide)
   - "Why This Matters" slide (motivational anchor for QA engineers)
   - Common Mistakes slide(s)
   - Terminology/Glossary slide(s)
   - Real-world scenario walkthrough (2-4 slides: setup → pain → AI approach → result)
   - Key Takeaways slide (3-5 capability statements)
   - Bridge to Next Session slide (teaser/cliffhanger)

### Session content to build:

[PASTE THE SESSION DEFINITION FROM PROJECT_INSTRUCTIONS.md HERE]

---

## END OF PROMPT


# ═══════════════════════════════════════════
# QUICK REFERENCE — Session status tracker
# ═══════════════════════════════════════════
#
# Session 01: ✅ Complete
# Session 02: ✅ Complete
# Session 03: ✅ Complete
# Session 04: ✅ Complete
# Session 05: ✅ Complete
# Session 06: ✅ Complete
# Session 07: ✅ Complete
# Session 08: ✅ Complete
# Session 09: ✅ Complete
# Session 10: ✅ Complete
# Session 11: ✅ Complete
# Session 12: ✅ Complete
# Session 13: ✅ Complete
# Session 14: ✅ Complete
# Session 15: ✅ Complete
# Session 16: ✅ Complete
# Session 17: ✅ Complete
# Session 18: ✅ Complete
# Session 19: ✅ Complete
#
# ALL 19 SESSIONS COMPLETE
#
# ═══════════════════════════════════════════
# WORKFLOW REMINDER
# ═══════════════════════════════════════════
#
# To build a new session:
# 1. Open Claude Code in learning-pages/ directory
# 2. Copy the meta prompt above
# 3. Replace [SESSION_NUMBER] with the session number
# 4. Paste the session definition from PROJECT_INSTRUCTIONS.md
#    (the big prompt with all 19 session definitions)
# 5. Claude Code reads CLAUDE.md automatically for project context
# 6. It creates the session HTML + updates the topic index
# 7. Run: npm run build — verify output in _site/
# 8. git add, commit, push — live on GitHub Pages
#
# To add a new topic (SQL, Azure, etc.):
# 1. Tell Claude Code: "I want to set up the [Topic Name] topic"
# 2. It reads CLAUDE.md for the pattern
# 3. It creates src/topics/[slug]/index.html + sessions folder, updates portal home
#
