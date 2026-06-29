---
name: design-system
description: Generate a consistent design system from the SAMI API - DESIGN.md, design-tokens.json, theme.css, an AI agent prompt, and a slop audit. Use this whenever the user wants a cohesive theme or visual style, design tokens, a design system, or wants their app/UI to look consistent and non-generic before any UI is built.
allowed-tools: Bash(curl *), Read, Write, WebFetch
---

# SAMI - Design System Generator

SAMI (Smart Aesthetic Management Interface) is a hosted design-token engine. You
send it a token set (or pick a preset) and it returns five ready-to-use
artifacts that lock visual consistency across whatever you build next.

**API base:** `https://smart-aesthetic-management-interface.pages.dev/api`
The API is public (no key) and CORS-enabled. All generation is one `POST`.

## When to use this skill
Use it at the START of any UI work, before writing components, when the user
asks for: a theme, a design system, a consistent look, design tokens, a brand
style, "make it not look AI-generated", or to match a specific aesthetic. Lock
the tokens first, then build against them.

## The five artifacts
1. **DESIGN.md** - human + agent readable spec and anti-slop rules (the source of truth).
2. **design-tokens.json** - W3C-style tokens for programmatic use.
3. **theme.css** - runtime CSS variables for `:root` and `[data-theme="dark"]`.
4. **Agent Prompt** - a strict prompt to prime a coding agent with these tokens.
5. **Slop Audit** - 7 automated quality checks (contrast, saturation, pure-color, single accent, premium fonts) with pass/fail + fix tips.

## Workflow
1. **Discover** a starting point:
   - `curl -s $BASE/api/presets` - list the 15 starter design systems (id, name, description).
   - `curl -s $BASE/api/schema` - the token shape + a complete example object to copy and tweak.
2. **Decide the input.** Either reference a preset by `id`, or build a partial
   `tokens` object (only the fields you want to change - everything else is
   merged from the base). Match it to the user's intent (brand colors, mood, fonts).
3. **Generate** with one POST (see below).
4. **Write the files** into the user's project (e.g. `DESIGN.md`,
   `design-tokens.json`, `src/theme.css`).
5. **Read `slopAudit`.** For each failing check, adjust the relevant token and
   regenerate. Aim for 7/7 before building.
6. **Build the UI** using `theme.css` variables and the DESIGN.md rules. Never
   hard-code values that exist as tokens.

## Generate - request shape
`POST /api/generate` with a JSON body:
- `presetId` (optional) - start from a named preset.
- `tokens` (optional) - a full or PARTIAL DesignTokens object, deep-merged over
  the base (the preset if `presetId` is given, else the default). Omitted fields
  fall back to the base.

Return: `{ appName, designMd, tokensJson, themeCss, agentPrompt, slopAudit, meta }`.

Add `?format=design-md|tokens-json|theme-css|agent-prompt|slop-audit` to get a
single artifact with the correct `Content-Type` (handy for piping straight to a file).

## Examples
```bash
BASE=https://smart-aesthetic-management-interface.pages.dev/api

# 1. Browse starter systems and the token schema
curl -s $BASE/api/presets
curl -s $BASE/api/schema

# 2a. Generate everything from a preset
curl -s -X POST $BASE/api/generate \
  -H "Content-Type: application/json" \
  -d '{"presetId":"forest-premium"}'

# 2b. Customize: keep a preset but override brand name + heading font
curl -s -X POST $BASE/api/generate \
  -H "Content-Type: application/json" \
  -d '{"presetId":"cobalt-cream","tokens":{"appName":"Acme","typography":{"fontHeading":"Sora"}}}'

# 3. Pipe one artifact straight to a file
curl -s -X POST "$BASE/api/generate?format=theme-css" \
  -H "Content-Type: application/json" \
  -d '{"presetId":"forest-premium"}' -o src/theme.css

curl -s -X POST "$BASE/api/generate?format=design-md" \
  -H "Content-Type: application/json" \
  -d '{"presetId":"forest-premium"}' -o DESIGN.md
```

## Interpreting the Slop Audit
`slopAudit` = `{ passed, total: 7, items: [{ id, name, passed, value, tip }] }`.
If an item fails, apply its `tip` by editing the matching token and regenerate:
- `accent-saturation` -> lower accent saturation below 80%.
- `heading-font` -> avoid Inter/Roboto/Arial/Open Sans/Helvetica for headings.
- `pure-colors` -> avoid pure #000000 / #ffffff; use off-black / off-white.
- `light-text-contrast` / `dark-text-contrast` -> raise text vs background contrast to >= 4.5:1.
- `button-contrast` -> raise accent fill vs label/background contrast.
- `single-accent` -> keep light & dark accents within 30 degrees of hue.

## AI-assisted endpoints (Cloudflare Workers AI)
Optional endpoints that author tokens and pages from natural language. They return
the same token/spec shapes used above, so you can chain them into `/api/generate`.
Each response includes `stubbed: true` if the AI binding was momentarily unavailable
(a deterministic fallback is returned so calls never hard-fail).
- `POST /api/ai/describe` `{ description, presetId? }` -> `{ tokens, slopAudit }` -
  turn a plain-English brief ("a calm fintech app, deep green, editorial serif") into
  a full design-token set. Feed `tokens` to `POST /api/generate` (as `{ tokens }`)
  to get DESIGN.md / theme.css / etc.
- `POST /api/ai/page` `{ description }` -> `{ spec }` - generate a page as validated
  block JSON (navbar, hero, features, stats, logos, testimonial, pricing, form,
  gallery, cta, footer, text). Render it or translate the blocks to your components.
- `POST /api/ai/audit-fix` `{ tokens }` -> `{ tokens, before, after }` - adjust tokens
  until the Slop Audit passes; `after` is the re-run audit.
- `POST /api/ai/suggest` `{ kind, hint? }` -> `{ result }` - `kind` is `appName`,
  `fontPairing`, `palette`, or `copy`.

```bash
# Describe a whole design system, then generate its artifacts
curl -s -X POST $BASE/api/ai/describe -H "Content-Type: application/json" \
  -d '{"description":"a bold music studio app, neon coral accent, geometric display font"}'

# Generate a page layout spec
curl -s -X POST $BASE/api/ai/page -H "Content-Type: application/json" \
  -d '{"description":"a landing page for an indie game studio"}'
```

## Rules for building afterward
- Treat DESIGN.md as the single source of truth; follow its anti-slop rules.
- Implement `theme.css` variables in `:root` + `[data-theme="dark"]`; reference
  `var(--color-*)`, `var(--font-*)`, `var(--radius-*)`, `var(--motion-*)` rather
  than literals.
- Re-run `/api/generate` whenever tokens change so all five artifacts stay in sync.

The live studio (to design tokens visually and copy an exact API call) is at
https://smart-aesthetic-management-interface.pages.dev
