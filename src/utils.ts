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

// Convert design tokens object into a CSS custom properties record for inline styles
export function tokensToCssVars(tokens: DesignTokens, mode: 'light' | 'dark'): Record<string, string | number> {
  const colors: ColorTheme = tokens.colors[mode];
  const { typography, shape, motion } = tokens;

  // Compute radii relative steps (multipliers)
  const radiusBase = shape.radiusBase;
  const borderWidth = shape.borderWidth;
  const shadowOpacity = shape.shadowIntensity / 100;
  
  // Custom shadow calculation based on intensity
  const ambientShadow = mode === 'light' 
    ? `0 2px 4px -1px rgba(0,0,0,${shadowOpacity * 0.04}), 0 10px 25px -5px rgba(0,0,0,${shadowOpacity * 0.12}), 0 20px 40px -15px rgba(0,0,0,${shadowOpacity * 0.15})`
    : `0 2px 4px -1px rgba(0,0,0,0.5), 0 10px 25px -5px rgba(0,0,0,${shadowOpacity * 0.3}), 0 20px 40px -15px rgba(0,0,0,${shadowOpacity * 0.45})`;

  return {
    '--color-primary': colors.primary,
    '--color-secondary': colors.secondary,
    '--color-accent': colors.accent,
    '--color-bg': colors.neutralBg,
    '--color-surface': colors.neutralSurface,
    '--color-border': colors.neutralBorder,
    '--text-primary': colors.textPrimary,
    '--text-secondary': colors.textSecondary,
    
    '--color-success': colors.success,
    '--color-warning': colors.warning,
    '--color-error': colors.error,
    '--color-info': colors.info,

    '--font-heading': `"${typography.fontHeading}", system-ui, sans-serif`,
    '--font-body': `"${typography.fontBody}", system-ui, sans-serif`,
    '--font-mono': `"${typography.fontMono}", monospace`,
    
    '--font-size-base': `${typography.sizeBase}px`,
    '--font-weight-heading': typography.weightHeading,
    '--font-weight-body': typography.weightBody,
    '--letter-spacing-heading': typography.letterSpacingHeading,
    '--letter-spacing-body': typography.letterSpacingBody,
    '--line-height-heading': `${typography.lineHeightHeading}`,
    '--line-height-body': `${typography.lineHeightBody}`,

    '--radius-xs': `${Math.max(0, radiusBase * 0.25)}px`,
    '--radius-sm': `${Math.max(0, radiusBase * 0.5)}px`,
    '--radius-md': `${radiusBase}px`,
    '--radius-lg': `${radiusBase * 1.5}px`,
    '--radius-xl': `${radiusBase * 2.5}px`,
    
    '--border-width': `${borderWidth}px`,
    '--shadow-ambient': ambientShadow,
    '--backdrop-blur': `${shape.backdropBlur}px`,
    
    '--motion-fast': `${motion.durationFast}ms`,
    '--motion-normal': `${motion.durationNormal}ms`,
    '--motion-slow': `${motion.durationSlow}ms`,
    '--motion-easing': motion.easing,
  } as Record<string, string | number>;
}

// Generate human-readable DESIGN.md
export function generateDesignMd(tokens: DesignTokens): string {
  const { colors, typography, shape, motion, components } = tokens;
  
  const lightContrast = getContrastRatio(colors.light.textPrimary, colors.light.neutralBg).toFixed(2);
  const darkContrast = getContrastRatio(colors.dark.textPrimary, colors.dark.neutralBg).toFixed(2);

  return `# ${tokens.appName} — Design Language Spec

> Generated with SAMI Visual Design System Studio. This document serves as the absolute single source of truth for the visual style of **${tokens.appName}**. Use this to prime and guide downstream agentic coding tools (e.g. Claude Code, Cursor, v0).

---

## 1. Design Principles & Meta
- **Brand / App Name:** ${tokens.appName}
- **Typography Concept:** Heading: \`${typography.fontHeading}\` (Weight: \`${typography.weightHeading}\`), Body: \`${typography.fontBody}\`
- **Button Archetype:** \`${components.buttonStyle}\` style inputs
- **Card/Container Archetype:** \`${components.cardStyle}\` styling

---

## 2. Color System

### 2.1 Core Palette Mapping
| Token Name | Light Value | Dark Value | Core Application / Usage Guidelines |
| :--- | :--- | :--- | :--- |
| **Primary** | \`${colors.light.primary}\` | \`${colors.dark.primary}\` | Main Brand Color, high-emphasis text, primary solid layouts. |
| **Secondary** | \`${colors.light.secondary}\` | \`${colors.dark.secondary}\` | Medium-emphasis text, description elements, secondary buttons. |
| **Accent** | \`${colors.light.accent}\` | \`${colors.dark.accent}\` | Focal interaction indicators, CTAs, highlight pills, active tracks. |
| **Neutral Bg** | \`${colors.light.neutralBg}\` | \`${colors.dark.neutralBg}\` | Core substrate page background. Light modes use bone/soft papers. |
| **Neutral Surface** | \`${colors.light.neutralSurface}\` | \`${colors.dark.neutralSurface}\` | Floating containers, cards, dialog drawers, panel surfaces. |
| **Neutral Border** | \`${colors.light.neutralBorder}\` | \`${colors.dark.neutralBorder}\` | Structured hairline separators, input frames, subtle card outlines. |
| **Text Primary** | \`${colors.light.textPrimary}\` | \`${colors.dark.textPrimary}\` | Body-text, headings, titles, labels. Contrast locked. |
| **Text Secondary** | \`${colors.light.textSecondary}\` | \`${colors.dark.textSecondary}\` | Auxiliary captions, meta tags, timestamps, instructions. |

### 2.2 Semantic Status System
| Semantic Token | Light Mode Value | Dark Mode Value | Operational Context |
| :--- | :--- | :--- | :--- |
| **Success** | \`${colors.light.success}\` | \`${colors.dark.success}\` | Success states, checked items, positive trends, completed flows. |
| **Warning** | \`${colors.light.warning}\` | \`${colors.dark.warning}\` | Warnings, low-priority issues, system sync status, alert warnings. |
| **Error** | \`${colors.light.error}\` | \`${colors.dark.error}\` | Error notices, invalid form fields, destructive actions, deleted objects. |
| **Info** | \`${colors.light.info}\` | \`${colors.dark.info}\` | Tips, systemic logs, contextual callouts, help info bubbles. |

*Contrast Ratio Checklist:*
- **Light Mode Text-to-Bg Contrast:** \`${lightContrast}:1\` (WCAG ${getWcagScore(parseFloat(lightContrast)).text})
- **Dark Mode Text-to-Bg Contrast:** \`${darkContrast}:1\` (WCAG ${getWcagScore(parseFloat(darkContrast)).text})

---

## 3. Typography & Typescale

### 3.1 Families
- **Display & Headings:** \`${typography.fontHeading}\` (sans-serif display)
- **Body & Controls:** \`${typography.fontBody}\` (system-safe body)
- **Monospace Telemetry:** \`${typography.fontMono}\` (data grids, metrics, numbers)

### 3.2 Scales & Metrics
- **Base Size:** \`${typography.sizeBase}px\` (corresponds to \`1rem\`)
- **Modular Scale Factor:** \`${typography.scaleRatio}\`
- **Heading Line Height:** \`${typography.lineHeightHeading}\` | **Body Line Height:** \`${typography.lineHeightBody}\`
- **Heading Letter Spacing:** \`${typography.letterSpacingHeading}\` | **Body Letter Spacing:** \`${typography.letterSpacingBody}\`

---

## 4. Spacing & Spatial Structure
- **Base Unit:** \`4px\` / \`0.25rem\` (\`1 grid unit\`)
- **Scale Steps:**
  - XS (2xs): \`4px\` (\`0.25rem\`)
  - Small (sm): \`8px\` (\`0.5rem\`)
  - Medium (md): \`16px\` (\`1rem\`)
  - Large (lg): \`24px\` (\`1.5rem\`)
  - XL (xl): \`32px\` (\`2rem\`)
  - 2XL (2xl): \`48px\` (\`3rem\`)
  - 3XL (3xl): \`64px\` (\`4rem\`)

---

## 5. Shape & Elevation

### 5.1 Corner Radii Scale
- **Radius Base (Medium):** \`${shape.radiusBase}px\`
- **Concentric Scale:**
  - Extra-Small (xs): \`${(shape.radiusBase * 0.25).toFixed(0)}px\`
  - Small (sm): \`${(shape.radiusBase * 0.5).toFixed(0)}px\`
  - Medium (md): \`${shape.radiusBase}px\`
  - Large (lg): \`${(shape.radiusBase * 1.5).toFixed(0)}px\`
  - Extra-Large (xl): \`${(shape.radiusBase * 2.5).toFixed(0)}px\`

### 5.2 Outlines & Boundaries
- **Hairline Border Width:** \`${shape.borderWidth}px\`
- **Backdrop Glass Blur:** \`${shape.backdropBlur}px\`

### 5.3 Shadows & Elevation
- **Ambient Shadow Intensity:** \`${shape.shadowIntensity}%\`
- **Shadow Hue Reference:** \`${shape.shadowColor}\`

---

## 6. Component Archetypes & Guidelines

### 6.1 Interactive Buttons
- **Active System Style:** \`${components.buttonStyle}\`
- **Interaction Hover Specs:** Interpolates to 95% scaling or 3D translations over \`${motion.durationFast}ms\` with easing \`${motion.easing}\`.
- **States Checklist:** Fully implement and style states for: \`Default\`, \`Hover\`, \`Active\`, \`Focus\`, \`Disabled\`.

### 6.2 Layout Cards & Dividers
- **Card Blueprint Style:** \`${components.cardStyle}\`
- **Dividers:** Strictly Hairline (\`${shape.borderWidth}px\`) borders colored with \`neutralBorder\`.

---

## 7. Motion Choreography
- **Interaction Feedback (Fast):** \`${motion.durationFast}ms\`
- **Structural Transition (Normal):** \`${motion.durationNormal}ms\`
- **Cinematic Entry (Slow):** \`${motion.durationSlow}ms\`
- **Global Easing Curve:** \`${motion.easing}\`

---

## 8. Instructions for the AI Coding Agent

This visual design language is non-negotiable. Follow these strict engineering mandates when building:

1. **Tokens-First CSS Variables:** Define the variables listed under \`theme.css\` at the root of the applet. Every single component must consume these custom properties. **Never** use hardcoded hexadecimal colors or absolute pixel sizing for layouts.
2. **Typography Pairing:** Ensure the display font \`${typography.fontHeading}\` is imported in \`index.css\` from Google Fonts and assigned to \`h1, h2, h3, h4\`. Bind body text to \`${typography.fontBody}\`. Monospace blocks must strictly use \`${typography.fontMono}\`.
3. **Double-Bezel Card Pattern:** (If \`${components.cardStyle} === 'double-bezel'\`) Wrap elevated cards in a secondary bounding container with slight background tint \`bg-black/5\` and padding \`p-1.5\` to create physical double-layered bevel hardware.
4. **Interactive Tactility:** Implement hover and active transformations using spring physics or the easing curve \`cubic-bezier(0.16, 1, 0.3, 1)\`. On \`:active\`, reduce scale slightly (\`scale-95\` or \`scale-98\`) to mimic physical compression.
5. **Layout Responsiveness:** Build layouts using mobile-first collapsible columns (\`grid-cols-1 md:grid-cols-2 lg:grid-cols-3\`). Section margins should remain spacious (\`py-24\` or \`py-32\`) to respect negative space.

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

  return `/* SAMI Theme Style Sheet — runtime-injectable CSS custom properties */

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

4. SPECIAL INSTRUCTIONS:
- Implement these tokens as runtime CSS Variables inside ":root" and "[data-theme='dark']".
- Bind buttons to use the "${tokens.components.buttonStyle}" styling. For flat/underlined, keep highlights minimal; for tactile, use active:translate-y-[2px] active:shadow-none; for double-bezel, wrap button in a thin-bezel track.
- For cards, implement the "${tokens.components.cardStyle}" blueprint.
- Ensure that you use a custom cubic-bezier ease for all transitions: transition-all duration-[${tokens.motion.durationNormal}ms] ease-[${tokens.motion.easing}].
- Leverage strict semantic palettes for status: success: ${tokens.colors.light.success}, warning: ${tokens.colors.light.warning}, error: ${tokens.colors.light.error}.
- Write clean, modular React components without hardcoded styling parameters.`;
}
