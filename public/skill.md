# SAMI - Design System Generator (Agent Skill)

SAMI (Smart Aesthetic Management Interface) is a hosted design-token engine. Send
it a token set (or pick a preset) and it returns five ready-to-use artifacts that
lock visual consistency across whatever you build next.

**API base:** `https://smart-aesthetic-management-interface.pages.dev/api` (public, CORS-enabled)
**Visual studio:** https://smart-aesthetic-management-interface.pages.dev

## Install

- **Claude Code** (native plugin/skill):
  ```
  /plugin marketplace add mathofdynamic/SAMI
  /plugin install sami-design@sami
  ```
  Then it auto-activates, or invoke `/sami-design:design-system`.
- **Codex / other agents:** add this file's URL or the repo's `AGENTS.md` to your
  agent's context, or just point your agent at
  `https://smart-aesthetic-management-interface.pages.dev/skill.md`.

## When to use
At the START of any UI work, before writing components, when the user asks for: a
theme, a design system, a consistent look, design tokens, a brand style, "make it
not look AI-generated", or to match a specific aesthetic. Lock the tokens first,
then build against them.

## The five artifacts
1. **DESIGN.md** - human + agent readable spec and anti-slop rules (source of truth).
2. **design-tokens.json** - W3C-style tokens for programmatic use.
3. **theme.css** - runtime CSS variables for `:root` and `[data-theme="dark"]`.
4. **Agent Prompt** - a strict prompt to prime a coding agent with these tokens.
5. **Slop Audit** - 7 automated quality checks with pass/fail + fix tips.

## Workflow
1. **Discover:** `GET /api/presets` (15 starter systems) and `GET /api/schema`
   (token shape + a complete example to copy).
2. **Decide input:** a `presetId`, and/or a partial `tokens` object (only the
   fields to change - the rest merges from the base).
3. **Generate:** `POST /api/generate` with `{ presetId?, tokens? }`.
4. **Write files** into the project (DESIGN.md, design-tokens.json, src/theme.css, ...).
5. **Read `slopAudit`;** fix failing tokens and regenerate until 7/7.
6. **Build the UI** from `theme.css` variables + DESIGN.md; never hard-code tokenized values.

## Generate
`POST /api/generate` body `{ presetId?, tokens? }` returns
`{ appName, designMd, tokensJson, themeCss, agentPrompt, slopAudit, meta }`.
Add `?format=design-md|tokens-json|theme-css|agent-prompt|slop-audit` for a single
artifact with the correct `Content-Type`.

```bash
BASE=https://smart-aesthetic-management-interface.pages.dev/api

# Browse
curl -s $BASE/api/presets
curl -s $BASE/api/schema

# From a preset
curl -s -X POST $BASE/api/generate -H "Content-Type: application/json" \
  -d '{"presetId":"forest-premium"}'

# Customize (partial tokens merge over the preset)
curl -s -X POST $BASE/api/generate -H "Content-Type: application/json" \
  -d '{"presetId":"cobalt-cream","tokens":{"appName":"Acme","typography":{"fontHeading":"Sora"}}}'

# Pipe one artifact to a file
curl -s -X POST "$BASE/api/generate?format=theme-css" -H "Content-Type: application/json" \
  -d '{"presetId":"forest-premium"}' -o src/theme.css
```

## Slop Audit checks
`{ passed, total: 7, items: [{ id, name, passed, value, tip }] }`. Fix any failing
item by editing the matching token and regenerating:
`accent-saturation` (accent < 80% saturation), `heading-font` (no Inter/Roboto/
Arial/Open Sans/Helvetica), `pure-colors` (no pure #000/#fff), `light-text-contrast`
& `dark-text-contrast` (>= 4.5:1), `button-contrast` (>= 4.5:1), `single-accent`
(light & dark accent hue within 30 degrees).

## AI-assisted endpoints (Cloudflare Workers AI)
Author tokens and pages from natural language; chain results into `/api/generate`.
Responses include `stubbed: true` if the AI binding was momentarily unavailable.
- `POST /api/ai/describe` `{ description, presetId? }` -> `{ tokens, slopAudit }` -
  brief to full design-token set. Feed `tokens` to `/api/generate`.
- `POST /api/ai/page` `{ description }` -> `{ spec }` - a page as validated block JSON
  (navbar, hero, features, stats, logos, testimonial, pricing, form, gallery, cta, footer, text).
- `POST /api/ai/audit-fix` `{ tokens }` -> `{ tokens, before, after }` - fix Slop Audit failures.
- `POST /api/ai/suggest` `{ kind, hint? }` -> `{ result }` - kind: appName | fontPairing | palette | copy.

```bash
curl -s -X POST $BASE/api/ai/describe -H "Content-Type: application/json" \
  -d '{"description":"a bold music studio app, neon coral accent, geometric display font"}'
```
