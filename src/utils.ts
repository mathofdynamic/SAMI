import { DesignTokens, ColorTheme } from './types';

// Convert Hex to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Calculate Relative Luminance
export function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const a = [rgb.r, rgb.g, rgb.b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Calculate Contrast Ratio between two Hex colors
export function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// Get WCAG Score
export function getWcagScore(ratio: number): { aa: boolean; aaa: boolean; text: string } {
  const aa = ratio >= 4.5;
  const aaa = ratio >= 7;
  let text = 'FAIL';
  if (aaa) {
    text = 'AAA PASS';
  } else if (aa) {
    text = 'AA PASS';
  } else if (ratio >= 3) {
    text = 'AA Large Only';
  }
  return { aa, aaa, text };
}

// Convert Hex to Saturation (HSL)
export function getHexSaturation(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  
  const d = max - min;
  let s = 0;
  
  if (d > 0) {
    const l = (max + min) / 2;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  }
  
  return Math.round(s * 100);
}

// Convert Hex to Hue (HSL)
export function getHexHue(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  
  if (d === 0) return 0;
  
  let h = 0;
  switch (max) {
    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
    case g: h = (b - r) / d + 2; break;
    case b: h = (r - g) / d + 4; break;
  }
  return Math.round(h * 60);
}

// Generate simple color tints/shades ramp
export function generateColorRamp(hex: string): string[] {
  const rgb = hexToRgb(hex);
  if (!rgb) return Array(9).fill(hex);

  // Simple tint/shade ramp calculation
  // 50 (lightest) -> 950 (darkest)
  const factors = [0.95, 0.8, 0.6, 0.4, 0.2, 0, -0.2, -0.4, -0.6, -0.8];
  return factors.map((factor) => {
    if (factor > 0) {
      // Tint (mix with white)
      const r = Math.round(rgb.r + (255 - rgb.r) * factor);
      const g = Math.round(rgb.g + (255 - rgb.g) * factor);
      const b = Math.round(rgb.b + (255 - rgb.b) * factor);
      return rgbToHex(r, g, b);
    } else {
      // Shade (mix with black)
      const r = Math.round(rgb.r * (1 + factor));
      const g = Math.round(rgb.g * (1 + factor));
      const b = Math.round(rgb.b * (1 + factor));
      return rgbToHex(r, g, b);
    }
  });
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, val));
  return '#' + [clamp(r), clamp(g), clamp(b)].map((x) => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// ---------------------------------------------------------------------------
// Slop Audit — pure, shared by the studio UI and the agent API. Names/tips are
// English (canonical for the API export); the UI translates them by `id`.
// ---------------------------------------------------------------------------
export interface SlopAuditItem {
  id: string;
  name: string;
  passed: boolean;
  value: string;
  tip: string;
}
export interface SlopAudit {
  passed: number;
  total: number;
  items: SlopAuditItem[];
}

export function generateSlopAudit(tokens: DesignTokens): SlopAudit {
  const satLight = getHexSaturation(tokens.colors.light.accent);
  const satDark = getHexSaturation(tokens.colors.dark.accent);
  const accentSatPassed = satLight < 80 && satDark < 80;

  const headingFontLower = tokens.typography.fontHeading.toLowerCase();
  const bannedFonts = ['inter', 'roboto', 'arial', 'open sans', 'helvetica'];
  const headingFontPassed = !bannedFonts.some(f => headingFontLower.includes(f));

  const lightBgPure = tokens.colors.light.neutralBg.toLowerCase() === '#ffffff';
  const lightTextPure = tokens.colors.light.textPrimary.toLowerCase() === '#000000';
  const darkBgPure = tokens.colors.dark.neutralBg.toLowerCase() === '#000000';
  const darkTextPure = tokens.colors.dark.textPrimary.toLowerCase() === '#ffffff';
  const pureColorPassed = !lightBgPure && !lightTextPure && !darkBgPure && !darkTextPure;

  const lightContrast = getContrastRatio(tokens.colors.light.textPrimary, tokens.colors.light.neutralBg);
  const darkContrast = getContrastRatio(tokens.colors.dark.textPrimary, tokens.colors.dark.neutralBg);

  const buttonContrastLight = getContrastRatio(tokens.colors.light.accent, tokens.colors.light.neutralBg);
  const buttonContrastDark = getContrastRatio(tokens.colors.dark.accent, tokens.colors.dark.neutralBg);
  const buttonContrastPassed = buttonContrastLight >= 4.5 && buttonContrastDark >= 4.5;

  const hueLight = getHexHue(tokens.colors.light.accent);
  const hueDark = getHexHue(tokens.colors.dark.accent);
  const hueDiff = Math.abs(hueLight - hueDark);
  const hueDiffNormalized = hueDiff > 180 ? 360 - hueDiff : hueDiff;
  const singleAccentPassed = hueDiffNormalized <= 30;

  const items: SlopAuditItem[] = [
    { id: 'accent-saturation', name: 'Accent saturation < 80%', passed: accentSatPassed, value: `Light: ${satLight}%, Dark: ${satDark}%`, tip: 'Reduce accent saturation below 80% to blend beautifully with neutrals.' },
    { id: 'heading-font', name: 'Premium Heading Font', passed: headingFontPassed, value: tokens.typography.fontHeading, tip: 'Avoid generic fonts like Inter, Roboto, Arial, Open Sans, or Helvetica.' },
    { id: 'pure-colors', name: 'No pure #000000 or #ffffff', passed: pureColorPassed, value: `Bg: ${tokens.colors.light.neutralBg}/${tokens.colors.dark.neutralBg}`, tip: 'Avoid pure black/white; use soft off-whites and rich charcoals.' },
    { id: 'light-text-contrast', name: 'Light Text Contrast >= 4.5:1', passed: lightContrast >= 4.5, value: `${lightContrast.toFixed(2)}:1`, tip: 'Increase contrast between text and light background for WCAG AA compliance.' },
    { id: 'dark-text-contrast', name: 'Dark Text Contrast >= 4.5:1', passed: darkContrast >= 4.5, value: `${darkContrast.toFixed(2)}:1`, tip: 'Increase contrast between text and dark background for WCAG AA compliance.' },
    { id: 'button-contrast', name: 'Button Text vs Fill Contrast >= 4.5:1', passed: buttonContrastPassed, value: `Light: ${buttonContrastLight.toFixed(2)}:1, Dark: ${buttonContrastDark.toFixed(2)}:1`, tip: 'Ensure the accent button fill and label have high contrast ratio.' },
    { id: 'single-accent', name: 'Unified Brand Accent Hue', passed: singleAccentPassed, value: `Hue Diff: ${hueDiffNormalized.toFixed(0)}°`, tip: 'Light and Dark accents should share a single cohesive brand hue (diff <= 30°).' },
  ];

  return { passed: items.filter(i => i.passed).length, total: items.length, items };
}

// Validate an untrusted (AI-produced) partial token object: keep only
// well-typed, in-range, valid-hex/enum fields; drop everything else so the
// generators never receive garbage. Returns a partial safe for buildTokens.
const COLOR_KEYS = ['primary', 'secondary', 'accent', 'neutralBg', 'neutralSurface', 'neutralBorder', 'textPrimary', 'textSecondary', 'success', 'warning', 'error', 'info'];
const isHex = (s: any) => typeof s === 'string' && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(s.trim());
const inRange = (v: any, lo: number, hi: number): number | undefined =>
  typeof v === 'number' && isFinite(v) ? Math.min(hi, Math.max(lo, v)) : undefined;
const cleanColors = (c: any) => {
  if (!c || typeof c !== 'object') return undefined;
  const out: any = {};
  for (const k of COLOR_KEYS) if (isHex(c[k])) out[k] = c[k].trim();
  return Object.keys(out).length ? out : undefined;
};

export function sanitizePartialTokens(p: any): any {
  if (!p || typeof p !== 'object') return {};
  const out: any = {};
  if (typeof p.appName === 'string') out.appName = p.appName.replace(/[<>]/g, '').slice(0, 40);

  if (p.colors && typeof p.colors === 'object') {
    const colors: any = {};
    const l = cleanColors(p.colors.light); const d = cleanColors(p.colors.dark);
    if (l) colors.light = l; if (d) colors.dark = d;
    if (Object.keys(colors).length) out.colors = colors;
  }
  if (p.typography && typeof p.typography === 'object') {
    const t: any = {}; const ty = p.typography;
    for (const f of ['fontHeading', 'fontBody', 'fontMono']) if (typeof ty[f] === 'string') t[f] = ty[f].replace(/[<>]/g, '').slice(0, 40);
    const sr = inRange(ty.scaleRatio, 1.05, 1.9); if (sr !== undefined) t.scaleRatio = sr;
    const sb = inRange(ty.sizeBase, 10, 28); if (sb !== undefined) t.sizeBase = Math.round(sb);
    if (['400', '500', '600', '700', '800'].includes(String(ty.weightHeading))) t.weightHeading = String(ty.weightHeading);
    if (['300', '400', '500', '600'].includes(String(ty.weightBody))) t.weightBody = String(ty.weightBody);
    if (typeof ty.letterSpacingHeading === 'string') t.letterSpacingHeading = ty.letterSpacingHeading.slice(0, 12);
    if (typeof ty.letterSpacingBody === 'string') t.letterSpacingBody = ty.letterSpacingBody.slice(0, 12);
    const lh = inRange(ty.lineHeightHeading, 0.9, 2); if (lh !== undefined) t.lineHeightHeading = lh;
    const lb = inRange(ty.lineHeightBody, 1, 2.2); if (lb !== undefined) t.lineHeightBody = lb;
    if (Object.keys(t).length) out.typography = t;
  }
  if (p.shape && typeof p.shape === 'object') {
    const s: any = {}; const sh = p.shape;
    const rb = inRange(sh.radiusBase, 0, 40); if (rb !== undefined) s.radiusBase = Math.round(rb);
    const bw = inRange(sh.borderWidth, 0, 6); if (bw !== undefined) s.borderWidth = Math.round(bw);
    const si = inRange(sh.shadowIntensity, 0, 100); if (si !== undefined) s.shadowIntensity = Math.round(si);
    if (isHex(sh.shadowColor)) s.shadowColor = sh.shadowColor.trim();
    const bb = inRange(sh.backdropBlur, 0, 40); if (bb !== undefined) s.backdropBlur = Math.round(bb);
    if (Object.keys(s).length) out.shape = s;
  }
  if (p.motion && typeof p.motion === 'object') {
    const m: any = {}; const mo = p.motion;
    const df = inRange(mo.durationFast, 40, 400); if (df !== undefined) m.durationFast = Math.round(df);
    const dn = inRange(mo.durationNormal, 80, 800); if (dn !== undefined) m.durationNormal = Math.round(dn);
    const ds = inRange(mo.durationSlow, 150, 1500); if (ds !== undefined) m.durationSlow = Math.round(ds);
    if (typeof mo.easing === 'string' && mo.easing.length < 60) m.easing = mo.easing;
    if (Object.keys(m).length) out.motion = m;
  }
  if (p.components && typeof p.components === 'object') {
    const c: any = {}; const co = p.components;
    if (['flat', 'double-bezel', 'pill', 'tactile', 'gradient', 'glow', 'glass', 'neumorphic'].includes(co.buttonStyle)) c.buttonStyle = co.buttonStyle;
    if (['flat', 'bordered', 'elevated', 'double-bezel'].includes(co.cardStyle)) c.cardStyle = co.cardStyle;
    if (['underlined', 'filled', 'bordered'].includes(co.inputStyle)) c.inputStyle = co.inputStyle;
    if (Object.keys(c).length) out.components = c;
  }
  if (p.dials && typeof p.dials === 'object') {
    const d: any = {};
    for (const k of ['variance', 'motion', 'density']) { const v = inRange(p.dials[k], 1, 10); if (v !== undefined) d[k] = Math.round(v); }
    if (Object.keys(d).length) out.dials = d;
  }
  return out;
}

// Deep-merge a partial token object over a complete base so every field the
// generators read is present. Mirrors the studio's localStorage merge.
export function buildTokens(partial: any, base: DesignTokens): DesignTokens {
  const p = partial || {};
  return {
    ...base,
    ...p,
    appName: p.appName || base.appName,
    colors: {
      light: { ...base.colors.light, ...(p.colors?.light) },
      dark: { ...base.colors.dark, ...(p.colors?.dark) },
    },
    typography: { ...base.typography, ...(p.typography) },
    shape: { ...base.shape, ...(p.shape) },
    motion: { ...base.motion, ...(p.motion) },
    components: { ...base.components, ...(p.components) },
    dials: { ...base.dials, ...(p.dials) },
  };
}

// Convert design tokens object into a CSS custom properties record for inline styles.
// `rtl` injects a Vazirmatn fallback into every font stack so Farsi text always has
// a Persian-capable face even when the chosen family is a Latin-only Google font.
export function tokensToCssVars(tokens: DesignTokens, mode: 'light' | 'dark', rtl = false): Record<string, string | number> {
  if (!tokens) {
    return {};
  }
  const colors: ColorTheme = tokens.colors?.[mode] || {
    primary: '#18181b',
    secondary: '#71717a',
    accent: '#14b8a6',
    neutralBg: '#fbfbfa',
    neutralSurface: '#ffffff',
    neutralBorder: '#e4e4e7',
    textPrimary: '#09090b',
    textSecondary: '#52525b',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  };
  const typography = tokens.typography || {
    fontHeading: 'Outfit',
    fontBody: 'Plus Jakarta Sans',
    fontMono: 'JetBrains Mono',
    sizeBase: 15,
    weightHeading: '600',
    weightBody: '400',
    letterSpacingHeading: '-0.03em',
    letterSpacingBody: '-0.01em',
    lineHeightHeading: 1.1,
    lineHeightBody: 1.6,
  };
  const shape = tokens.shape || {
    radiusBase: 10,
    borderWidth: 1,
    shadowIntensity: 15,
    backdropBlur: 8,
  };
  const motion = tokens.motion || {
    durationFast: 120,
    durationNormal: 250,
    durationSlow: 500,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
  };

  // Compute radii relative steps (multipliers)
  const radiusBase = shape.radiusBase !== undefined ? shape.radiusBase : 10;
  const borderWidth = shape.borderWidth !== undefined ? shape.borderWidth : 1;
  const shadowIntensity = shape.shadowIntensity !== undefined ? shape.shadowIntensity : 15;
  const shadowOpacity = shadowIntensity / 100;
  
  // Custom shadow calculation based on intensity
  const ambientShadow = mode === 'light' 
    ? `0 2px 4px -1px rgba(0,0,0,${shadowOpacity * 0.04}), 0 10px 25px -5px rgba(0,0,0,${shadowOpacity * 0.12}), 0 20px 40px -15px rgba(0,0,0,${shadowOpacity * 0.15})`
    : `0 2px 4px -1px rgba(0,0,0,0.5), 0 10px 25px -5px rgba(0,0,0,${shadowOpacity * 0.3}), 0 20px 40px -15px rgba(0,0,0,${shadowOpacity * 0.45})`;

  return {
    '--color-primary': colors.primary || '#18181b',
    '--color-secondary': colors.secondary || '#71717a',
    '--color-accent': colors.accent || '#14b8a6',
    '--color-bg': colors.neutralBg || '#fbfbfa',
    '--color-surface': colors.neutralSurface || '#ffffff',
    '--color-border': colors.neutralBorder || '#e4e4e7',
    '--text-primary': colors.textPrimary || '#09090b',
    '--text-secondary': colors.textSecondary || '#52525b',
    
    '--color-success': colors.success || '#10b981',
    '--color-warning': colors.warning || '#f59e0b',
    '--color-error': colors.error || '#ef4444',
    '--color-info': colors.info || '#3b82f6',

    '--font-heading': `"${typography.fontHeading || 'Outfit'}"${rtl ? ', "Vazirmatn"' : ''}, system-ui, sans-serif`,
    '--font-body': `"${typography.fontBody || 'Plus Jakarta Sans'}"${rtl ? ', "Vazirmatn"' : ''}, system-ui, sans-serif`,
    '--font-mono': `"${typography.fontMono || 'JetBrains Mono'}"${rtl ? ', "Vazirmatn"' : ''}, monospace`,
    
    '--font-size-base': `${typography.sizeBase || 15}px`,
    '--font-weight-heading': typography.weightHeading || '600',
    '--font-weight-body': typography.weightBody || '400',
    '--letter-spacing-heading': typography.letterSpacingHeading || '-0.03em',
    '--letter-spacing-body': typography.letterSpacingBody || '-0.01em',
    '--line-height-heading': `${typography.lineHeightHeading || 1.1}`,
    '--line-height-body': `${typography.lineHeightBody || 1.6}`,

    '--radius-xs': `${Math.max(0, radiusBase * 0.25)}px`,
    '--radius-sm': `${Math.max(0, radiusBase * 0.5)}px`,
    '--radius-md': `${radiusBase}px`,
    '--radius-lg': `${radiusBase * 1.5}px`,
    '--radius-xl': `${radiusBase * 2.5}px`,
    
    '--border-width': `${borderWidth}px`,
    '--shadow-ambient': ambientShadow,
    '--backdrop-blur': `${shape.backdropBlur !== undefined ? shape.backdropBlur : 8}px`,
    
    '--motion-fast': `${motion.durationFast || 120}ms`,
    '--motion-normal': `${motion.durationNormal || 250}ms`,
    '--motion-slow': `${motion.durationSlow || 500}ms`,
    '--motion-easing': motion.easing || 'cubic-bezier(0.16, 1, 0.3, 1)',
  } as Record<string, string | number>;
}

// Single source of truth for what each Taste Dial value means, reused by the
// DESIGN.md export, the agent prompt, and the in-studio Dials explainer so the
// wording can never drift between them.
export function describeDial(kind: 'variance' | 'motion' | 'density', value: number): string {
  if (kind === 'variance') {
    const d = value === 1 ? 'completely symmetric/predictable'
      : value <= 4 ? 'mostly symmetric/predictable'
      : value <= 7 ? 'partially artsy/asymmetric'
      : 'highly artsy/asymmetric';
    return `${d} visual composition`;
  }
  if (kind === 'motion') {
    const d = value === 1 ? 'completely static'
      : value <= 4 ? 'minimal visual motion'
      : value <= 7 ? 'cinematic transitions'
      : 'highly cinematic/physics-driven';
    return `${d} animations`;
  }
  const d = value === 1 ? 'extremely airy/art-gallery'
    : value <= 4 ? 'airy/minimal layout spacing'
    : value <= 7 ? 'dense/compact layout spacing'
    : 'highly dense cockpit-style';
  return `${d} layout`;
}

// Generate human-readable DESIGN.md
export function generateDesignMd(tokens: DesignTokens): string {
  const { colors, typography, shape, motion, components } = tokens;
  
  const lightContrast = getContrastRatio(colors.light.textPrimary, colors.light.neutralBg).toFixed(2);
  const darkContrast = getContrastRatio(colors.dark.textPrimary, colors.dark.neutralBg).toFixed(2);

  const varianceVal = tokens.dials?.variance ?? 8;
  const motionVal = tokens.dials?.motion ?? 6;
  const densityVal = tokens.dials?.density ?? 4;

  const varianceExp = `Variance: ${varianceVal}/10 (Chosen setting indicates ${describeDial('variance', varianceVal)})`;
  const motionExp = `Motion: ${motionVal}/10 (Chosen setting indicates ${describeDial('motion', motionVal)})`;
  const densityExp = `Density: ${densityVal}/10 (Chosen setting indicates ${describeDial('density', densityVal)})`;

  const evocativeParagraph = `This design system establishes a ${colors.light.neutralBg.toLowerCase() === '#f4f4f0' || colors.dark.neutralBg.toLowerCase() === '#0a0a0a' ? 'striking industrial/brutalist' : 'highly polished agency-tier'} atmosphere for **${tokens.appName}**. Driven by a design variance of ${varianceVal}/10, it rejects boring symmetric templates in favor of rich layout rhythm, asymmetric grids, and tactile micro-interactions. The typography layers the geometric tracking of \`${typography.fontHeading}\` over the highly legible \`${typography.fontBody}\`, framed by precise \`${components.buttonStyle}\` interaction targets and \`${components.cardStyle}\` elevation cells. It moves with a cinematic tempo of ${motionVal}/10, balancing responsive spring physics against a structured layout density of ${densityVal}/10 to maintain spacious, breathtaking negative space or dense functional cockpit utility as needed.`;

  return `# ${tokens.appName} - Design Language Spec

> Generated with SAMI Visual Design System Studio. This document serves as the absolute single source of truth for the visual style of **${tokens.appName}**. Use this to prime and guide downstream agentic coding tools (e.g. Claude Code, Cursor, v0).

---

## 1. Configuration & Dials
- **Brand / App Name:** ${tokens.appName}
- **DESIGN_VARIANCE:** ${varianceVal}/10
  - *Setting interpretation:* ${varianceExp}
- **MOTION_INTENSITY:** ${motionVal}/10
  - *Setting interpretation:* ${motionExp}
- **VISUAL_DENSITY:** ${densityVal}/10
  - *Setting interpretation:* ${densityExp}

---

## 2. Visual Theme & Atmosphere
${evocativeParagraph}

---

## 3. Color Palette & Roles

### 3.1 Color Roles Mapping
| Color Role | Light Value | Dark Value | Functional Application & Guidelines |
| :--- | :--- | :--- | :--- |
| **Primary** | ${"`"}\${colors.light.primary}${"`"} | ${"`"}\${colors.dark.primary}${"`"} | Main brand canvas anchor, high-emphasis typography elements, heavy banners. |
| **Secondary** | ${"`"}\${colors.light.secondary}${"`"} | ${"`"}\${colors.dark.secondary}${"`"} | Medium-emphasis textual annotations, descriptions, secondary actionable bounds. |
| **Accent** | ${"`"}\${colors.light.accent}${"`"} | ${"`"}\${colors.dark.accent}${"`"} | Focal interaction points, key CTAs, highlights, active selections. |
| **Neutral Bg** | ${"`"}\${colors.light.neutralBg}${"`"} | ${"`"}\${colors.dark.neutralBg}${"`"} | General canvas base substrate. Avoid pure ${"`"}#ffffff${"`"} or pure ${"`"}#000000${"`"}. |
| **Neutral Surface** | ${"`"}\${colors.light.neutralSurface}${"`"} | ${"`"}\${colors.dark.neutralSurface}${"`"} | Raised layout cards, dialog containers, bento cell boards. |
| **Neutral Border** | ${"`"}\${colors.light.neutralBorder}${"`"} | ${"`"}\${colors.dark.neutralBorder}${"`"} | Thin hairline divisions, border frames, subtle cell bounding strokes. |
| **Text Primary** | ${"`"}\${colors.light.textPrimary}${"`"} | ${"`"}\${colors.dark.textPrimary}${"`"} | Dominant text hierarchy, display lines, labels. |
| **Text Secondary** | ${"`"}\${colors.light.textSecondary}${"`"} | ${"`"}\${colors.dark.textSecondary}${"`"} | Low-priority metadata, captions, timestamp text. |

### 3.2 Semantic Palette
| Semantic Role | Light Value | Dark Value | Core Contextual Application |
| :--- | :--- | :--- | :--- |
| **Success** | ${"`"}\${colors.light.success}${"`"} | ${"`"}\${colors.dark.success}${"`"} | Validations, positive indicators, completions, successful updates. |
| **Warning** | ${"`"}\${colors.light.warning}${"`"} | ${"`"}\${colors.dark.warning}${"`"} | Safe warnings, pending steps, non-blocking sync indicators. |
| **Error** | ${"`"}\${colors.light.error}${"`"} | ${"`"}\${colors.dark.error}${"`"} | Invalid values, blocking errors, deletion warnings. |
| **Info** | ${"`"}\${colors.light.info}${"`"} | ${"`"}\${colors.dark.info}${"`"} | Auxiliary help, helper tooltips, system notices. |

### 3.3 WCAG AA Contrast Checks
- **Light Mode Text Contrast:** ${"`"}${lightContrast}:1${"`"} (WCAG ${getWcagScore(parseFloat(lightContrast)).text})
- **Dark Mode Text Contrast:** ${"`"}${darkContrast}:1${"`"} (WCAG ${getWcagScore(parseFloat(darkContrast)).text})

### 3.4 Banned Colors
- **No pure #000000 black.** Use soft charcoal values (e.g. ${"`"}#050505${"`"} or ${"`"}#0a0a0a${"`"}).
- **No pure #ffffff white.** Use elegant soft bone or warm paper whites (e.g. ${"`"}#fafafa${"`"} or ${"`"}#fbfbfa${"`"}).
- **No "AI Lila" palette.** Reject neon purple/blue gradient glows. Keep saturation < 80%.

---

## 4. Typography Rules

### 4.1 Family Stack Assignments
- **Display & Heading Font:** ${"`"}${typography.fontHeading}${"`"} (geometric display font)
- **General Body Font:** ${"`"}${typography.fontBody}${"`"} (system-safe body legibility font)
- **Data & Monospace Font:** ${"`"}${typography.fontMono}${"`"} (numbers, metrics, code widgets)

### 4.2 Typographic Metrics & Scale
- **Base Font Size:** ${"`"}${typography.sizeBase}px${"`"} (maps to root ${"`"}1rem${"`"})
- **Scale Factor Ratio:** ${"`"}${typography.scaleRatio}${"`"}
- **Line Heights:** Headings: ${"`"}${typography.lineHeightHeading}${"`"} | Body: ${"`"}${typography.lineHeightBody}${"`"}
- **Letter Spacing:** Headings: ${"`"}${typography.letterSpacingHeading}${"`"} | Body: ${"`"}${typography.letterSpacingBody}${"`"}
- **Font Weights:** Headings: ${"`"}${typography.weightHeading}${"`"} | Body: ${"`"}${typography.weightBody}${"`"}

### 4.3 Banned Fonts
- **Never use Inter, Roboto, Arial, Open Sans, or Helvetica as display fonts.**

---

## 5. Component Stylings

### 5.1 Interactive Buttons
- **Active System Style:** ${"`"}${components.buttonStyle}${"`"}
- **Interaction Hover Specs:** Interpolates smoothly to 95% scaling or slight translation offsets over ${"`"}${motion.durationFast}ms${"`"} with curve ${"`"}${motion.easing}${"`"}.
- **States Checklist:** Fully implement and style states for: ${"`"}Default${"`"}, ${"`"}Hover${"`"}, ${"`"}Active${"`"}, ${"`"}Focus${"`"}, ${"`"}Disabled${"`"}.

### 5.2 Layout Cards & Dividers
- **Card Blueprint Style:** ${"`"}${components.cardStyle}${"`"}
- **Dividers:** Strictly Hairline (${"`"}${shape.borderWidth}px${"`"}) borders using ${"`"}neutralBorder${"`"} token.

### 5.3 Inputs
- Form labels must reside **ABOVE** the input. Always provide detailed active focus rings using the accent token.

### 5.4 Navbars
- Use detached, floating glass pills with backdrop blur. Avoid top-glued edge-to-edge navbar blocks.

### 5.5 Loaders & State Cells
- Provide custom layout skeletons for loading, empty, and error feedback states.

---

## 6. Layout Principles
- **Grid-First Core Layouts:** Construct flexible layouts using CSS Grid. Use ${"`"}grid-flow-dense${"`"} to avoid voids.
- **Asymmetric Structure:** Prefer asymmetric bento grids or staggered zig-zag layouts.
- **Anti-Pattern Constraint:** No "3 equal cards in a row" feature section.
- **Maximum Container Width:** Clamp main panels to ${"`"}max-w-[1400px] mx-auto${"`"}.

---

## 7. Responsive Rules
- **Mobile-First Collapse:** Force all grids/columns to collapse to a single column (${"`"}grid-cols-1${"`"}, ${"`"}px-4${"`"}, ${"`"}gap-6${"`"}) below ${"`"}768px${"`"}.
- **Haptic Touch Targets:** All mobile action buttons must conform to a minimum size of ${"`"}44px${"`"} to guarantee touch accuracy.
- **Test Resolutions:** Implement layouts that test beautifully at ${"`"}375px${"`"} (mobile), ${"`"}768px${"`"} (tablet), and ${"`"}1440px${"`"} (desktop).

---

## 8. Motion & Interaction
- **Physics Defaults:** Avoid linear paths; configure transitions using cubic-beziers.
- **GPU-Accelerated Tweens:** Only animate ${"`"}transform${"`"} and ${"`"}opacity${"`"} to preserve 60fps on mobile displays.
- **User Preference Honor:** Automatically disable heavy visual motion when ${"`"}prefers-reduced-motion${"`"} is detected.

---

## 9. Anti-Patterns (Anti-Slop Rules)
- **No Em-Dashes or En-Dashes:** ZERO em-dashes (—) or en-dashes (–) anywhere. Use standard hyphens "-".
- **Hero Constraints:** Keep H1 <= 2 lines, subtext <= 20 words, max top padding ${"`"}pt-24${"`"}. Avoid scroll cues or beta labels.
- **No Emojis:** Build clean, professional icons; do not inject casual emojis.
- **No John Doe or Acme Corp:** Populate copy with realistic, professional names and specific data.

---

## 10. Instructions for the AI Coding Agent
These tokens are the single source of truth. Implement them as CSS variables / Tailwind config, never hard-code values, and the rules above are hard requirements.

*Begin coding by importing Google Fonts:*
\`\`\`css
@import url('https://fonts.googleapis.com/css2?family=${typography.fontHeading.replace(/ /g, '+')}:wght@400;500;600;700;800&family=${typography.fontBody.replace(/ /g, '+')}:wght@300;400;500;600&family=${typography.fontMono.replace(/ /g, '+')}:wght@400;500&display=swap');
\`\`\`
`;
}

// Generate machine-readable design-tokens.json
export function generateTokensJson(tokens: DesignTokens): string {
  // W3C Design Token format
  const formatToken = (val: string | number, type: string) => ({
    $value: val,
    $type: type,
  });

  const { colors, typography, shape, motion } = tokens;

  const tokenStructure = {
    appName: { $value: tokens.appName, $type: 'string' },
    color: {
      light: Object.keys(colors.light).reduce((acc: any, key) => {
        acc[key] = formatToken(colors.light[key as keyof ColorTheme], 'color');
        return acc;
      }, {}),
      dark: Object.keys(colors.dark).reduce((acc: any, key) => {
        acc[key] = formatToken(colors.dark[key as keyof ColorTheme], 'color');
        return acc;
      }, {}),
    },
    typography: {
      font: {
        heading: formatToken(typography.fontHeading, 'fontFamily'),
        body: formatToken(typography.fontBody, 'fontFamily'),
        mono: formatToken(typography.fontMono, 'fontFamily'),
      },
      size: {
        base: formatToken(`${typography.sizeBase}px`, 'dimension'),
        ratio: formatToken(typography.scaleRatio, 'number'),
      },
      weight: {
        heading: formatToken(typography.weightHeading, 'fontWeight'),
        body: formatToken(typography.weightBody, 'fontWeight'),
      },
      letterSpacing: {
        heading: formatToken(typography.letterSpacingHeading, 'dimension'),
        body: formatToken(typography.letterSpacingBody, 'dimension'),
      },
      lineHeight: {
        heading: formatToken(typography.lineHeightHeading, 'number'),
        body: formatToken(typography.lineHeightBody, 'number'),
      },
    },
    shape: {
      radius: {
        base: formatToken(`${shape.radiusBase}px`, 'dimension'),
      },
      border: {
        width: formatToken(`${shape.borderWidth}px`, 'dimension'),
      },
      shadow: {
        intensity: formatToken(shape.shadowIntensity, 'number'),
        color: formatToken(shape.shadowColor, 'color'),
      },
      blur: {
        backdrop: formatToken(`${shape.backdropBlur}px`, 'dimension'),
      },
    },
    motion: {
      duration: {
        fast: formatToken(`${motion.durationFast}ms`, 'duration'),
        normal: formatToken(`${motion.durationNormal}ms`, 'duration'),
        slow: formatToken(`${motion.durationSlow}ms`, 'duration'),
      },
      easing: formatToken(motion.easing, 'cubic-bezier'),
    },
  };

  return JSON.stringify(tokenStructure, null, 2);
}

// Generate theme.css (raw CSS variables)
export function generateThemeCss(tokens: DesignTokens): string {
  const { colors, typography, shape, motion, components } = tokens;

  const varsForMode = (mode: 'light' | 'dark') => {
    const c = colors[mode];
    const shadowOpacity = shape.shadowIntensity / 100;
    const shadow = mode === 'light'
      ? `0 2px 4px -1px rgba(0,0,0,${shadowOpacity * 0.04}), 0 10px 25px -5px rgba(0,0,0,${shadowOpacity * 0.12}), 0 20px 40px -15px rgba(0,0,0,${shadowOpacity * 0.15})`
      : `0 2px 4px -1px rgba(0,0,0,0.5), 0 10px 25px -5px rgba(0,0,0,${shadowOpacity * 0.3}), 0 20px 40px -15px rgba(0,0,0,${shadowOpacity * 0.45})`;

    return `  --color-primary: ${c.primary};
  --color-secondary: ${c.secondary};
  --color-accent: ${c.accent};
  --color-bg: ${c.neutralBg};
  --color-surface: ${c.neutralSurface};
  --color-border: ${c.neutralBorder};
  --text-primary: ${c.textPrimary};
  --text-secondary: ${c.textSecondary};
  --color-success: ${c.success};
  --color-warning: ${c.warning};
  --color-error: ${c.error};
  --color-info: ${c.info};
  --shadow-ambient: ${shadow};`;
  };

  return `/* SAMI Theme Style Sheet - runtime-injectable CSS custom properties */

@import url('https://fonts.googleapis.com/css2?family=${typography.fontHeading.replace(/ /g, '+')}:wght@400;500;600;700;800&family=${typography.fontBody.replace(/ /g, '+')}:wght@300;400;500;600&family=${typography.fontMono.replace(/ /g, '+')}:wght@400;500&display=swap');

:root {
  /* Colors - Light Theme */
${varsForMode('light')}

  /* Typography */
  --font-heading: "${typography.fontHeading}", system-ui, -apple-system, sans-serif;
  --font-body: "${typography.fontBody}", system-ui, -apple-system, sans-serif;
  --font-mono: "${typography.fontMono}", monospace;

  --font-size-base: ${typography.sizeBase}px;
  --font-weight-heading: ${typography.weightHeading};
  --font-weight-body: ${typography.weightBody};
  --letter-spacing-heading: ${typography.letterSpacingHeading};
  --letter-spacing-body: ${typography.letterSpacingBody};
  --line-height-heading: ${typography.lineHeightHeading};
  --line-height-body: ${typography.lineHeightBody};

  /* Shape & Borders */
  --radius-xs: ${Math.max(0, shape.radiusBase * 0.25)}px;
  --radius-sm: ${Math.max(0, shape.radiusBase * 0.5)}px;
  --radius-md: ${shape.radiusBase}px;
  --radius-lg: ${shape.radiusBase * 1.5}px;
  --radius-xl: ${shape.radiusBase * 2.5}px;
  --border-width: ${shape.borderWidth}px;
  --backdrop-blur: ${shape.backdropBlur}px;

  /* Motion */
  --motion-fast: ${motion.durationFast}ms;
  --motion-normal: ${motion.durationNormal}ms;
  --motion-slow: ${motion.durationSlow}ms;
  --motion-easing: ${motion.easing};

  /* Archetypes metadata */
  --component-button-style: "${components.buttonStyle}";
  --component-card-style: "${components.cardStyle}";
  --component-input-style: "${components.inputStyle}";
}

/* Dark Theme Support via Selector scoping */
[data-theme="dark"], .theme-dark {
${varsForMode('dark')}
}
`;
}

// Generate highly detailed prompt for Claude Code / Cursor / coding agents
export function generateAgentPrompt(tokens: DesignTokens): string {
  const varianceVal = tokens.dials?.variance ?? 8;
  const motionVal = tokens.dials?.motion ?? 6;
  const densityVal = tokens.dials?.density ?? 4;

  const varianceExp = `Variance: ${varianceVal}/10 (Chosen setting indicates ${describeDial('variance', varianceVal)})`;
  const motionExp = `Motion: ${motionVal}/10 (Chosen setting indicates ${describeDial('motion', motionVal)})`;
  const densityExp = `Density: ${densityVal}/10 (Chosen setting indicates ${describeDial('density', densityVal)})`;

  return `You are tasked with building a web application named "${tokens.appName}".
Please follow the strict visual design tokens specified below as your single source of truth.

1. ARCHITECTURAL TOKENS:
- Brand Name: ${tokens.appName}
- Grid Radius Base: ${tokens.shape.radiusBase}px
- Border Hairlines: ${tokens.shape.borderWidth}px
- Font Stack (Heading): "${tokens.typography.fontHeading}"
- Font Stack (Body): "${tokens.typography.fontBody}"
- Font Stack (Mono): "${tokens.typography.fontMono}"
- Component Vibe: Card: ${tokens.components.cardStyle}, Button: ${tokens.components.buttonStyle}, Input: ${tokens.components.inputStyle}

2. LIGHT THEME CORE PALETTE:
- Primary Text / High-Emphasis: ${tokens.colors.light.textPrimary}
- Primary Accent CTA: ${tokens.colors.light.accent}
- Neutral Background: ${tokens.colors.light.neutralBg}
- Neutral Card Surface: ${tokens.colors.light.neutralSurface}
- Neutral Separators: ${tokens.colors.light.neutralBorder}

3. DARK THEME CORE PALETTE:
- Primary Text / High-Emphasis: ${tokens.colors.dark.textPrimary}
- Primary Accent CTA: ${tokens.colors.dark.accent}
- Neutral Background: ${tokens.colors.dark.neutralBg}
- Neutral Card Surface: ${tokens.colors.dark.neutralSurface}
- Neutral Separators: ${tokens.colors.dark.neutralBorder}

## Design Dials
DESIGN_VARIANCE: ${varianceVal}  MOTION_INTENSITY: ${motionVal}  VISUAL_DENSITY: ${densityVal}
- ${varianceExp}
- ${motionExp}
- ${densityExp}

## Anti-Slop Rules (non-negotiable, enforce on every page)
- ZERO em-dashes (—) and en-dashes (–) anywhere: headlines, body, captions,
  buttons, alt text. Use a normal hyphen "-". This is the #1 AI tell.
- Never use Inter, Roboto, Arial, Open Sans, or Helvetica as the display font.
- No "AI purple/violet" gradient glows. One accent color, saturation < 80%,
  used identically across the whole page. Neutral base (zinc/slate/stone).
- No pure #000000 or pure #ffffff. Use off-black and off-white.
- No "3 equal feature cards in a row." Use zig-zag, asymmetric bento, or
  horizontal scroll. Max 2 consecutive image+text-split sections.
- Hero fits in one viewport: headline <= 2 lines, subtext <= 20 words,
  CTA visible without scrolling, max top padding pt-24. Max 4 text elements
  in the hero. One primary CTA (+ at most one secondary).
- Eyebrows (small uppercase tracking labels above headers) rationed to at most
  1 per 3 sections. No section-number eyebrows ("01 / INDEX", "002 · Features").
- No scroll cues ("Scroll", down arrows), no version labels in hero (V0.6, BETA),
  no decorative status dots, no locale/time/weather strips, no fake div-based
  product screenshots, no em-dash separators.
- One corner-radius system, one accent, one theme (light OR dark) per page.
- Every button: text contrast WCAG AA (4.5:1), label fits one line, no duplicate
  CTA intent ("Get in touch" + "Let's talk" on the same page = fail).
- Real images only (or labeled placeholder slots). No hand-rolled SVG icons;
  use Phosphor/HugeIcons/Radix/Tabler. No emojis.
- Animate only transform/opacity; honor prefers-reduced-motion for any motion > 3.
- No generic content: no "John Doe", "Acme", "Lorem", "Elevate/Seamless/Unleash",
  no fake-round numbers (99.99%, 50%). Use realistic, specific content.

4. SPECIAL INSTRUCTIONS:
- Implement these tokens as runtime CSS Variables inside ":root" and "[data-theme='dark']".
- Bind buttons to use the "${tokens.components.buttonStyle}" styling. For flat/underlined, keep highlights minimal; for tactile, use active:translate-y-[2px] active:shadow-none; for double-bezel, wrap button in a thin-bezel track.
- For cards, implement the "${tokens.components.cardStyle}" blueprint.
- Ensure that you use a custom cubic-bezier ease for all transitions: transition-all duration-[${tokens.motion.durationNormal}ms] ease-[${tokens.motion.easing}].
- Leverage strict semantic palettes for status: success: ${tokens.colors.light.success}, warning: ${tokens.colors.light.warning}, error: ${tokens.colors.light.error}.
- Write clean, modular React components without hardcoded styling parameters.`;
}
