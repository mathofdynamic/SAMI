// Color harmonization + palette health scoring for the Color panel's
// "Sync Palette" feature. The user's manually-edited colors are treated as
// fixed anchors; everything else is derived from them with simple color theory.
import { ColorTheme, DesignTokens } from './types';
import { hexToRgb, getHexHue, getHexSaturation, getContrastRatio, getLuminance } from './utils';

type Mode = 'light' | 'dark';

// HSL -> hex.
function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  const to = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
}

// HSL lightness (0-100) of a hex.
function getHexLightness(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  return Math.round(((max + min) / 2) * 100);
}

// Shortest angular distance between two hues (0-180).
function hueDistance(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

const inRange = (v: number, lo: number, hi: number) => v >= lo && v <= hi;

// Pick a text color in the seed hue that clears WCAG AA (4.5:1) against `bg`.
function pickReadable(bg: string, hue: number, mode: Mode, primary: boolean): string {
  const sat = 12;
  let l = mode === 'light' ? (primary ? 12 : 34) : (primary ? 95 : 70);
  let hex = hslToHex(hue, sat, l);
  let guard = 0;
  while (getContrastRatio(hex, bg) < 4.5 && guard < 24) {
    l += mode === 'light' ? -3 : 3;
    l = Math.max(0, Math.min(100, l));
    hex = hslToHex(hue, sat, l);
    guard++;
  }
  return hex;
}

/**
 * Harmonize a single-mode palette, keeping anchored fields exactly and deriving
 * the rest from the anchor hues. `anchors` holds ColorTheme field names the user
 * edited (mode-agnostic; both modes are synced from the same set).
 */
export function harmonizePalette(theme: ColorTheme, anchors: Set<string>, mode: Mode): ColorTheme {
  const out: ColorTheme = { ...theme };
  const anchored = (k: keyof ColorTheme) => anchors.has(k);

  // Seed hue/sat: prefer primary, then accent, else the existing primary.
  const seedHex = anchored('primary') ? theme.primary : anchored('accent') ? theme.accent : theme.primary;
  const seedHue = getHexHue(seedHex);
  const seedSat = getHexSaturation(seedHex);

  if (!anchored('primary')) {
    out.primary = hslToHex(seedHue, Math.max(35, Math.min(70, seedSat || 55)), mode === 'light' ? 32 : 70);
  }
  if (!anchored('accent')) {
    // Split-complementary harmonic of the seed hue.
    out.accent = hslToHex((seedHue + 150) % 360, Math.max(45, Math.min(78, seedSat || 62)), mode === 'light' ? 47 : 60);
  }
  if (!anchored('secondary')) {
    out.secondary = hslToHex(seedHue, Math.min(22, seedSat), mode === 'light' ? 45 : 62);
  }

  // Neutrals: very low-saturation tints of the seed hue, spaced for separation.
  const nSat = 8;
  if (!anchored('neutralBg')) out.neutralBg = hslToHex(seedHue, nSat, mode === 'light' ? 98 : 7);
  if (!anchored('neutralSurface')) out.neutralSurface = hslToHex(seedHue, nSat, mode === 'light' ? 100 : 11);
  if (!anchored('neutralBorder')) out.neutralBorder = hslToHex(seedHue, nSat + 2, mode === 'light' ? 88 : 21);

  // Text colors must clear AA against the (possibly new) background.
  if (!anchored('textPrimary')) out.textPrimary = pickReadable(out.neutralBg, seedHue, mode, true);
  if (!anchored('textSecondary')) out.textSecondary = pickReadable(out.neutralBg, seedHue, mode, false);

  return out;
}

export interface PaletteScore {
  grade: 'Good' | 'Fair' | 'Poor';
  score: number; // 0-100
  issues: string[];
}

/** Score how usable/harmonious a single-mode palette is. */
export function scorePalette(theme: ColorTheme, _mode: Mode): PaletteScore {
  const issues: string[] = [];
  let score = 100;

  const textContrast = getContrastRatio(theme.textPrimary, theme.neutralBg);
  if (textContrast < 4.5) {
    score -= 35;
    issues.push(`Text/background contrast ${textContrast.toFixed(1)}:1 is below AA (4.5:1)`);
  } else if (textContrast < 7) {
    score -= 5;
  }

  const accentContrast = getContrastRatio(theme.accent, theme.neutralBg);
  if (accentContrast < 3) {
    score -= 20;
    issues.push(`Accent on background is faint (${accentContrast.toFixed(1)}:1, aim for 3:1+)`);
  }

  const surfContrast = getContrastRatio(theme.neutralSurface, theme.neutralBg);
  if (surfContrast < 1.05) {
    score -= 12;
    issues.push('Surface and background are nearly identical, so cards will not stand out');
  }

  const dh = hueDistance(getHexHue(theme.primary), getHexHue(theme.accent));
  const harmonic = inRange(dh, 0, 35) || inRange(dh, 100, 140) || inRange(dh, 150, 210);
  if (!harmonic) {
    score -= 12;
    issues.push('Primary and accent hues are not a classic harmony (analogous, triadic, or complementary)');
  }

  if (getHexSaturation(theme.accent) > 85) {
    score -= 8;
    issues.push('Accent saturation is very high (over 85%), risking an "AI neon" look');
  }

  // Avoid pure black/white extremes (anti-slop).
  if (getHexLightness(theme.neutralBg) === 100 || getHexLightness(theme.neutralBg) === 0) {
    score -= 6;
    issues.push('Background is pure white/black; prefer a soft off-white or charcoal');
  }

  score = Math.max(0, Math.min(100, score));
  const grade = score >= 80 ? 'Good' : score >= 55 ? 'Fair' : 'Poor';
  return { grade, score, issues };
}

// ---------------------------------------------------------------------------
// Deterministic Slop Audit auto-fix. Resolves every check with pure color math
// (no AI), guaranteed in a single pass:
//  - accent saturation < 80%  -> rebuild the accent at 72% saturation
//  - accent/background contrast >= 4.5  -> tune accent lightness against the bg
//  - unified accent hue  -> both modes share one hue (diff 0)
//  - no pure #000/#fff  -> de-pure neutral bg / text
//  - text contrast >= 4.5  -> swap text to off-black/off-white if needed
//  - premium heading font  -> replace a banned font
// ---------------------------------------------------------------------------
function depure(hex: string, offBlack: string, offWhite: string): string {
  const h = hex.toLowerCase();
  if (h === '#000000' || h === '#000') return offBlack;
  if (h === '#ffffff' || h === '#fff') return offWhite;
  return hex;
}

function tuneForContrast(hue: number, sat: number, startL: number, bg: string, goingDarker: boolean): string {
  let l = startL;
  let hex = hslToHex(hue, sat, l);
  let guard = 0;
  while (getContrastRatio(hex, bg) < 4.6 && guard < 48) {
    l = Math.max(2, Math.min(98, l + (goingDarker ? -2 : 2)));
    hex = hslToHex(hue, sat, l);
    guard++;
    if (l <= 2 || l >= 98) break;
  }
  return hex;
}

export function autoFixTokens(tokens: DesignTokens): DesignTokens {
  const SAT = 72;
  // One shared hue for both light and dark accents (keeps the brand feel).
  const accentHue = getHexHue(tokens.colors.light.accent) || getHexHue(tokens.colors.dark.accent) || 200;

  const fixMode = (theme: ColorTheme): ColorTheme => {
    const out: ColorTheme = { ...theme };
    out.neutralBg = depure(out.neutralBg, '#0a0a0a', '#fafafa');
    out.textPrimary = depure(out.textPrimary, '#0a0a0a', '#fafafa');

    const bgIsLight = getLuminance(out.neutralBg) > 0.4;
    // Accent: fixed hue + safe saturation, lightness tuned to clear contrast vs bg.
    out.accent = tuneForContrast(accentHue, SAT, bgIsLight ? 46 : 60, out.neutralBg, bgIsLight);
    // Text must remain readable against the (possibly adjusted) bg.
    if (getContrastRatio(out.textPrimary, out.neutralBg) < 4.6) {
      out.textPrimary = bgIsLight ? '#1a1a1a' : '#f5f5f5';
    }
    return out;
  };

  const light = fixMode(tokens.colors.light);
  const dark = fixMode(tokens.colors.dark);

  let typography = tokens.typography;
  const banned = ['inter', 'roboto', 'arial', 'open sans', 'helvetica'];
  if (banned.some((f) => typography.fontHeading.toLowerCase().includes(f))) {
    typography = { ...typography, fontHeading: 'Bricolage Grotesque' };
  }

  return { ...tokens, colors: { light, dark }, typography };
}
