import { THEME_PRESETS } from '../../src/presets';

// Describe the DesignTokens shape an agent can POST to /api/generate, plus a
// complete working example (the first preset) it can copy and tweak.
export const onRequestGet: PagesFunction = async () =>
  Response.json({
    description:
      'POST a { presetId?, tokens? } body to /api/generate. `tokens` is a partial DesignTokens object deep-merged over the base (a preset if presetId is given, else the default). Any omitted field falls back to the base.',
    fields: {
      appName: 'string — product/brand name',
      colors: 'object { light: ColorTheme, dark: ColorTheme } — each with primary, secondary, accent, neutralBg, neutralSurface, neutralBorder, textPrimary, textSecondary, success, warning, error, info (hex)',
      typography: '{ fontHeading, fontBody, fontMono (Google font names), scaleRatio (1.1-1.618), sizeBase (px), weightHeading, weightBody, letterSpacingHeading, letterSpacingBody, lineHeightHeading, lineHeightBody }',
      shape: '{ radiusBase (px), borderWidth (px), shadowIntensity (0-100), shadowColor (hex), backdropBlur (px) }',
      motion: '{ durationFast, durationNormal, durationSlow (ms), easing (cubic-bezier) }',
      components: '{ buttonStyle: flat|double-bezel|pill|tactile|gradient|glow|glass|neumorphic, cardStyle: flat|bordered|elevated|double-bezel, inputStyle: underlined|filled|bordered }',
      dials: '{ variance, motion, density } each 1-10 — design intent exported as guidance text',
    },
    example: THEME_PRESETS[0].tokens,
  });
