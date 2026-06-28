import { ThemePreset } from './types';

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'minimalist',
    name: 'Minimal Bone',
    description: 'Clean monochrome elegance. Warm bone white backgrounds, sleek micro-spacing, and subtle hairline dividers.',
    tokens: {
      appName: 'Aether',
      colors: {
        light: {
          primary: '#18181b', // Zinc 900
          secondary: '#71717a', // Zinc 500
          accent: '#14b8a6', // Teal 500
          neutralBg: '#fbfbfa', // Warm bone white
          neutralSurface: '#ffffff', // Pure white cards
          neutralBorder: '#e4e4e7', // Zinc 200
          textPrimary: '#09090b', // Zinc 950
          textSecondary: '#52525b', // Zinc 600
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
        },
        dark: {
          primary: '#fafafa', // Zinc 50
          secondary: '#a1a1aa', // Zinc 400
          accent: '#2dd4bf', // Teal 400
          neutralBg: '#09090b', // Zinc 950
          neutralSurface: '#18181b', // Zinc 900
          neutralBorder: '#27272a', // Zinc 800
          textPrimary: '#f4f4f5', // Zinc 100
          textSecondary: '#a1a1aa', // Zinc 400
          success: '#34d399',
          warning: '#fbbf24',
          error: '#f87171',
          info: '#60a5fa',
        }
      },
      typography: {
        fontHeading: 'Outfit',
        fontBody: 'Plus Jakarta Sans',
        fontMono: 'JetBrains Mono',
        scaleRatio: 1.2, // Minor Third
        sizeBase: 15,
        weightHeading: '600',
        weightBody: '400',
        letterSpacingHeading: '-0.03em',
        letterSpacingBody: '-0.01em',
        lineHeightHeading: 1.1,
        lineHeightBody: 1.6,
      },
      shape: {
        radiusBase: 10,
        borderWidth: 1,
        shadowIntensity: 15,
        shadowColor: '#18181b',
        backdropBlur: 8,
      },
      motion: {
        durationFast: 120,
        durationNormal: 250,
        durationSlow: 500,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)', // easeOutExpo
      },
      components: {
        buttonStyle: 'flat',
        cardStyle: 'bordered',
        inputStyle: 'bordered',
      }
    }
  },
  {
    id: 'bold-creative',
    name: 'Bold Neon',
    description: 'High-contrast creative playground. Electric emerald accents, generous bubble corners, dynamic feedback, and tactile depth.',
    tokens: {
      appName: 'Verve',
      colors: {
        light: {
          primary: '#111827',
          secondary: '#4b5563',
          accent: '#10b981', // Electric Emerald
          neutralBg: '#f3f4f6',
          neutralSurface: '#ffffff',
          neutralBorder: '#e5e7eb',
          textPrimary: '#111827',
          textSecondary: '#4b5563',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#f43f5e',
          info: '#2563eb',
        },
        dark: {
          primary: '#f9fafb',
          secondary: '#9ca3af',
          accent: '#34d399',
          neutralBg: '#0b0f19', // Deep dark blue-grey
          neutralSurface: '#111827',
          neutralBorder: '#1f2937',
          textPrimary: '#f9fafb',
          textSecondary: '#9ca3af',
          success: '#34d399',
          warning: '#fbbf24',
          error: '#fb7185',
          info: '#60a5fa',
        }
      },
      typography: {
        fontHeading: 'Syne',
        fontBody: 'Plus Jakarta Sans',
        fontMono: 'Space Mono',
        scaleRatio: 1.33, // Perfect Fourth
        sizeBase: 16,
        weightHeading: '800',
        weightBody: '500',
        letterSpacingHeading: '-0.04em',
        letterSpacingBody: '0em',
        lineHeightHeading: 0.95,
        lineHeightBody: 1.5,
      },
      shape: {
        radiusBase: 24, // Playful roundness
        borderWidth: 2, // Thick accents
        shadowIntensity: 45,
        shadowColor: '#111827',
        backdropBlur: 12,
      },
      motion: {
        durationFast: 100,
        durationNormal: 200,
        durationSlow: 450,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // backOut (bouncy)
      },
      components: {
        buttonStyle: 'tactile',
        cardStyle: 'double-bezel',
        inputStyle: 'filled',
      }
    }
  },
  {
    id: 'corporate',
    name: 'Tech Blue',
    description: 'Corporate high-fidelity. Deep marine blue, razor-thin borders, structured spacing, and highly legible grid components.',
    tokens: {
      appName: 'Apex',
      colors: {
        light: {
          primary: '#0f172a', // Slate 900
          secondary: '#64748b', // Slate 500
          accent: '#2563eb', // Royal Blue
          neutralBg: '#f8fafc', // Slate 50
          neutralSurface: '#ffffff',
          neutralBorder: '#e2e8f0', // Slate 200
          textPrimary: '#0f172a',
          textSecondary: '#475569',
          success: '#15803d',
          warning: '#b45309',
          error: '#b91c1c',
          info: '#1d4ed8',
        },
        dark: {
          primary: '#f1f5f9',
          secondary: '#94a3b8',
          accent: '#3b82f6',
          neutralBg: '#0f172a',
          neutralSurface: '#1e293b',
          neutralBorder: '#334155',
          textPrimary: '#f8fafc',
          textSecondary: '#94a3b8',
          success: '#22c55e',
          warning: '#eab308',
          error: '#ef4444',
          info: '#3b82f6',
        }
      },
      typography: {
        fontHeading: 'Plus Jakarta Sans',
        fontBody: 'DM Sans',
        fontMono: 'Fira Code',
        scaleRatio: 1.15, // Golden semi-ratio
        sizeBase: 14,
        weightHeading: '700',
        weightBody: '400',
        letterSpacingHeading: '-0.02em',
        letterSpacingBody: '0em',
        lineHeightHeading: 1.15,
        lineHeightBody: 1.55,
      },
      shape: {
        radiusBase: 6, // Crisp corporate edges
        borderWidth: 1,
        shadowIntensity: 8,
        shadowColor: '#0f172a',
        backdropBlur: 6,
      },
      motion: {
        durationFast: 100,
        durationNormal: 180,
        durationSlow: 400,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)', // easeOutQuad
      },
      components: {
        buttonStyle: 'flat',
        cardStyle: 'bordered',
        inputStyle: 'bordered',
      }
    }
  },
  {
    id: 'editorial',
    name: 'Editorial Luxe',
    description: 'High-end agency feel. Classic serif headings, warm oatmeal papers, sophisticated ivory scales, and deep espresso tones.',
    tokens: {
      appName: 'Vogue',
      colors: {
        light: {
          primary: '#2d241e', // Deep Espresso
          secondary: '#7c7267', // Muted Clay
          accent: '#c2410c', // Burnt Terracotta
          neutralBg: '#fcfaf7', // Warm Oatmeal paper
          neutralSurface: '#fdfdfc',
          neutralBorder: '#e7e1d8', // Clay border
          textPrimary: '#1c1511',
          textSecondary: '#5c524a',
          success: '#2e5b3f',
          warning: '#c27d38',
          error: '#a83232',
          info: '#2d6896',
        },
        dark: {
          primary: '#fbf8f5',
          secondary: '#b3a99e',
          accent: '#ea580c',
          neutralBg: '#1c1511', // Deep dark clay-earth
          neutralSurface: '#241c16',
          neutralBorder: '#382f28',
          textPrimary: '#fbf8f5',
          textSecondary: '#b3a99e',
          success: '#4ade80',
          warning: '#fbbf24',
          error: '#f87171',
          info: '#60a5fa',
        }
      },
      typography: {
        fontHeading: 'Playfair Display',
        fontBody: 'Newsreader',
        fontMono: 'IBM Plex Mono',
        scaleRatio: 1.414, // Augmented Fourth (classic editorial hierarchy)
        sizeBase: 16,
        weightHeading: '500', // Editorial light-to-medium
        weightBody: '400',
        letterSpacingHeading: '-0.01em',
        letterSpacingBody: '0.01em',
        lineHeightHeading: 1.05,
        lineHeightBody: 1.65,
      },
      shape: {
        radiusBase: 0, // Fully architectural, squared corners
        borderWidth: 1,
        shadowIntensity: 0, // No shadows in classic editorial layout
        shadowColor: '#2d241e',
        backdropBlur: 4,
      },
      motion: {
        durationFast: 200,
        durationNormal: 350,
        durationSlow: 700,
        easing: 'cubic-bezier(0.32, 0.72, 0, 1)', // Heavy cinematic easeOut
      },
      components: {
        buttonStyle: 'flat',
        cardStyle: 'bordered',
        inputStyle: 'underlined',
      }
    }
  },
  {
    id: 'brutalist',
    name: 'Tactical Telemetry',
    description: 'Aviation cockpit style. Bold monospace elements, glowing neon safety dots, absolute 90° corners, and tactical status feeds.',
    tokens: {
      appName: 'SAMI-01',
      colors: {
        light: {
          primary: '#000000',
          secondary: '#4b5563',
          accent: '#e61919', // Aviation safety Red
          neutralBg: '#f4f4f0', // Warm industrial cement
          neutralSurface: '#ffffff',
          neutralBorder: '#000000', // Thick solid black lines
          textPrimary: '#000000',
          textSecondary: '#4b5563',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#e61919',
          info: '#000000',
        },
        dark: {
          primary: '#ffffff',
          secondary: '#9ca3af',
          accent: '#ff3333', // Glowing safety red
          neutralBg: '#0a0a0a', // Deep radar black
          neutralSurface: '#121212', // CRT mask
          neutralBorder: '#333333',
          textPrimary: '#ffffff',
          textSecondary: '#9ca3af',
          success: '#4af626', // Phosphor status green
          warning: '#ffb300',
          error: '#ff3333',
          info: '#ffffff',
        }
      },
      typography: {
        fontHeading: 'Space Grotesk',
        fontBody: 'Space Grotesk',
        fontMono: 'JetBrains Mono',
        scaleRatio: 1.25, // Major Third
        sizeBase: 14,
        weightHeading: '700',
        weightBody: '500',
        letterSpacingHeading: '-0.02em',
        letterSpacingBody: '-0.01em',
        lineHeightHeading: 1.0,
        lineHeightBody: 1.45,
      },
      shape: {
        radiusBase: 0, // Hard angular corners
        borderWidth: 2, // Thick physical borders
        shadowIntensity: 60, // Heavy solid shadow
        shadowColor: '#000000',
        backdropBlur: 0,
      },
      motion: {
        durationFast: 80,
        durationNormal: 150,
        durationSlow: 300,
        easing: 'steps(4, end)', // Analog clock-like stepping transition
      },
      components: {
        buttonStyle: 'tactile',
        cardStyle: 'bordered',
        inputStyle: 'bordered',
      }
    }
  }
];
