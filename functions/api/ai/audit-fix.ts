import { Env, readJson } from './_ai';
import { THEME_PRESETS } from '../../../src/presets';
import { buildTokens, generateSlopAudit, sanitizePartialTokens } from '../../../src/utils';
import { autoFixTokens } from '../../../src/colorSync';

// Deterministic Slop Audit fix (pure color math, no AI) so it resolves every
// failing check in a single guaranteed pass.
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const body = await readJson(context.request);
  const base = buildTokens(sanitizePartialTokens(body.tokens), THEME_PRESETS[0].tokens);
  const before = generateSlopAudit(base);
  const fixed = autoFixTokens(base);
  const after = generateSlopAudit(fixed);
  return Response.json({ tokens: fixed, before, after });
};
