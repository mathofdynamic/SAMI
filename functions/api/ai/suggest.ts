import { Env, runJson, readJson, COLOR_SCHEMA } from './_ai';

// Small, kind-switched AI helpers for the studio's inline "sparkle" buttons.
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const body = await readJson(context.request);
  const kind = String(body.kind || '');
  const hint = String(body.hint || '').slice(0, 200).trim();
  const appName = (body.tokens && typeof body.tokens.appName === 'string' && body.tokens.appName) || 'the app';

  let schema: any, system: string, user: string, stub: any;

  if (kind === 'appName') {
    schema = { type: 'object', properties: { value: { type: 'string' } }, required: ['value'] };
    system = 'You name software products. Return ONE short, distinctive, brandable product name (1-2 words). Avoid generic words like App, Hub, Suite, Studio.';
    user = hint || 'A modern, well-crafted software product.';
    stub = { value: 'Aether' };
  } else if (kind === 'fontPairing') {
    schema = { type: 'object', properties: { fontHeading: { type: 'string' }, fontBody: { type: 'string' }, fontMono: { type: 'string' } }, required: ['fontHeading', 'fontBody'] };
    system = 'You pick Google Font pairings. Return distinctive heading + body + mono Google font names. Never use Inter, Roboto, Arial, Open Sans, or Helvetica for the heading.';
    user = hint || `A tasteful font pairing for ${appName}.`;
    stub = { fontHeading: 'Bricolage Grotesque', fontBody: 'Hanken Grotesk', fontMono: 'JetBrains Mono' };
  } else if (kind === 'palette') {
    schema = { type: 'object', properties: { light: COLOR_SCHEMA, dark: COLOR_SCHEMA } };
    system = 'You craft accessible color palettes for a SAMI design system. Return light and dark themes (hex) for the 12 roles. Off-white/off-black neutrals (never pure), accent saturation < 80%, AA text contrast.';
    user = hint || `A color palette for ${appName}.`;
    stub = { light: { accent: '#0d9488' }, dark: { accent: '#2dd4bf' } };
  } else if (kind === 'copy') {
    schema = { type: 'object', properties: { value: { type: 'string' } }, required: ['value'] };
    system = 'You write concise UI marketing copy. Return ONE headline or tagline under 12 words. No clichés, no em-dashes.';
    user = hint || `A tagline for ${appName}.`;
    stub = { value: 'Design once. Ship everywhere.' };
  } else {
    return Response.json({ error: 'unknown kind', kinds: ['appName', 'fontPairing', 'palette', 'copy'] }, { status: 400 });
  }

  const { data, stubbed } = await runJson(context.env, { system, user, schema, maxTokens: 300, stub });
  return Response.json({ result: data, stubbed });
};
