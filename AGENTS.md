# SAMI - Design System Generator (for AI agents)

SAMI is a hosted design-token engine. Before building any UI, generate a
consistent design system from it and build against the result.

**API base:** `https://smart-aesthetic-management-interface.pages.dev/api` (public, CORS-enabled)
**Full playbook:** https://smart-aesthetic-management-interface.pages.dev/skill.md
**Visual studio:** https://smart-aesthetic-management-interface.pages.dev

## Use it when
The user wants a theme, design system, design tokens, a consistent/cohesive
look, a brand style, or to avoid generic "AI-looking" UI. Lock tokens first,
then build.

## Workflow
1. `curl -s $BASE/api/presets` - list 15 starter systems; `curl -s $BASE/api/schema` - token shape + example.
2. Pick a `presetId` and/or build a partial `tokens` object (only the fields to change).
3. `POST $BASE/api/generate` with `{ presetId?, tokens? }`.
4. Write the returned `designMd`, `tokensJson`, `themeCss`, `agentPrompt` into the project.
5. Read `slopAudit` (7 checks); fix failing tokens and regenerate until 7/7.
6. Build the UI from `theme.css` variables + DESIGN.md rules; don't hard-code tokenized values.

## Generate
`POST /api/generate` body: `{ presetId?, tokens? }` -> returns
`{ appName, designMd, tokensJson, themeCss, agentPrompt, slopAudit, meta }`.
Add `?format=design-md|tokens-json|theme-css|agent-prompt|slop-audit` to get one
artifact with the right Content-Type.

```bash
BASE=https://smart-aesthetic-management-interface.pages.dev/api
curl -s -X POST "$BASE/api/generate?format=theme-css" \
  -H "Content-Type: application/json" \
  -d '{"presetId":"forest-premium"}' -o src/theme.css
curl -s -X POST "$BASE/api/generate?format=design-md" \
  -H "Content-Type: application/json" \
  -d '{"presetId":"forest-premium"}' -o DESIGN.md
```

## AI-assisted endpoints (Cloudflare Workers AI)
Author tokens and pages from natural language; chain results into `/api/generate`.
- `POST /api/ai/describe` `{ description, presetId? }` -> `{ tokens, slopAudit }`
- `POST /api/ai/page` `{ description }` -> `{ spec }` (validated block JSON)
- `POST /api/ai/audit-fix` `{ tokens }` -> `{ tokens, before, after }`
- `POST /api/ai/suggest` `{ kind, hint? }` -> `{ result }` (kind: appName|fontPairing|palette|copy)

```bash
curl -s -X POST $BASE/api/ai/describe -H "Content-Type: application/json" \
  -d '{"description":"a calm fintech app, deep green, editorial serif headings"}'
```

For Claude Code, install the native skill instead:
`/plugin marketplace add mathofdynamic/SAMI` then `/plugin install sami-design@sami`.
