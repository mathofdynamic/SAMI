import { DesignTokens } from '../../src/types';
import { THEME_PRESETS } from '../../src/presets';
import {
  buildTokens,
  generateDesignMd,
  generateTokensJson,
  generateThemeCss,
  generateAgentPrompt,
  generateSlopAudit,
} from '../../src/utils';

// Single-artifact responses (?format=...), each with the correct Content-Type.
const FORMATS: Record<string, { type: string; render: (t: DesignTokens) => string }> = {
  'design-md': { type: 'text/markdown; charset=utf-8', render: (t) => generateDesignMd(t) },
  'tokens-json': { type: 'application/json; charset=utf-8', render: (t) => generateTokensJson(t) },
  'theme-css': { type: 'text/css; charset=utf-8', render: (t) => generateThemeCss(t) },
  'agent-prompt': { type: 'text/plain; charset=utf-8', render: (t) => generateAgentPrompt(t) },
  'slop-audit': { type: 'application/json; charset=utf-8', render: (t) => JSON.stringify(generateSlopAudit(t), null, 2) },
};

export const onRequestPost: PagesFunction = async (context) => {
  let body: any = {};
  try { body = await context.request.json(); } catch { body = {}; }

  const DEFAULT = THEME_PRESETS[0].tokens;
  let base = DEFAULT;
  if (body.presetId) {
    const preset = THEME_PRESETS.find((p) => p.id === body.presetId);
    if (!preset) {
      return Response.json(
        { error: `Unknown preset: ${body.presetId}`, available: THEME_PRESETS.map((p) => p.id) },
        { status: 404 }
      );
    }
    base = preset.tokens;
  }

  const tokens = buildTokens(body.tokens, base);

  const format = new URL(context.request.url).searchParams.get('format');
  if (format) {
    const f = FORMATS[format];
    if (!f) {
      return Response.json(
        { error: `Unknown format: ${format}`, formats: Object.keys(FORMATS) },
        { status: 400 }
      );
    }
    return new Response(f.render(tokens), { headers: { 'Content-Type': f.type } });
  }

  return Response.json({
    appName: tokens.appName,
    designMd: generateDesignMd(tokens),
    tokensJson: generateTokensJson(tokens),
    themeCss: generateThemeCss(tokens),
    agentPrompt: generateAgentPrompt(tokens),
    slopAudit: generateSlopAudit(tokens),
    meta: { presetId: body.presetId || null, generatedBy: 'SAMI', version: '1.0.0' },
  });
};

// Friendly hint for accidental GETs.
export const onRequestGet: PagesFunction = async () =>
  Response.json(
    { error: 'Use POST with a JSON body { presetId?, tokens? }. Optional ?format=design-md|tokens-json|theme-css|agent-prompt|slop-audit.' },
    { status: 405 }
  );
