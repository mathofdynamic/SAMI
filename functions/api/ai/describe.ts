import { Env, runJson, readJson, COLOR_SCHEMA } from './_ai';
import { THEME_PRESETS } from '../../../src/presets';
import { buildTokens, generateSlopAudit, sanitizePartialTokens } from '../../../src/utils';

const SCHEMA = {
  type: 'object',
  properties: {
    appName: { type: 'string' },
    colors: { type: 'object', properties: { light: COLOR_SCHEMA, dark: COLOR_SCHEMA } },
    typography: { type: 'object', properties: { fontHeading: { type: 'string' }, fontBody: { type: 'string' }, fontMono: { type: 'string' }, scaleRatio: { type: 'number' }, sizeBase: { type: 'number' } } },
    shape: { type: 'object', properties: { radiusBase: { type: 'number' }, borderWidth: { type: 'number' }, shadowIntensity: { type: 'number' } } },
    components: { type: 'object', properties: { buttonStyle: { type: 'string' }, cardStyle: { type: 'string' }, inputStyle: { type: 'string' } } },
    dials: { type: 'object', properties: { variance: { type: 'number' }, motion: { type: 'number' }, density: { type: 'number' } } },
  },
  required: ['appName', 'colors'],
};

const SYSTEM = `You are SAMI, a design-token generator. Given a product description, output a JSON design system.
Rules:
- Provide BOTH light and dark color themes, each with hex values for: primary, secondary, accent, neutralBg, neutralSurface, neutralBorder, textPrimary, textSecondary, success, warning, error, info.
- Light neutralBg is an off-white (never #ffffff); dark neutralBg is an off-black (never #000000).
- textPrimary must contrast its neutralBg at >= 4.5:1.
- Keep accent saturation under 80%. Light and dark accents should share a hue.
- Choose distinctive Google fonts for fontHeading/fontBody/fontMono; NEVER use Inter, Roboto, Arial, Open Sans, or Helvetica for the heading.
- components.buttonStyle is one of: flat, double-bezel, pill, tactile, gradient, glow, glass, neumorphic. cardStyle: flat, bordered, elevated, double-bezel. inputStyle: underlined, filled, bordered.
- Match the mood and industry of the description.`;

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const body = await readJson(context.request);
  const description = String(body.description || '').slice(0, 600).trim();
  if (!description) return Response.json({ error: 'description is required' }, { status: 400 });

  const base = body.presetId
    ? (THEME_PRESETS.find((p) => p.id === body.presetId)?.tokens || THEME_PRESETS[0].tokens)
    : THEME_PRESETS[0].tokens;

  const stub = { appName: 'Aether', colors: { light: { accent: '#0d9488' }, dark: { accent: '#2dd4bf' } } };
  const { data, stubbed } = await runJson(context.env, { system: SYSTEM, user: description, schema: SCHEMA, maxTokens: 1400, stub });

  const clean = sanitizePartialTokens(data);
  const extra = body.tokens && typeof body.tokens === 'object' ? sanitizePartialTokens(body.tokens) : {};
  const tokens = buildTokens({ ...clean, ...extra }, base);

  return Response.json({ tokens, slopAudit: generateSlopAudit(tokens), stubbed });
};
