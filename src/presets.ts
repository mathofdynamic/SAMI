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
      },
      dials: {
        variance: 5,
        motion: 3,
        density: 3,
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
      },
      dials: {
        variance: 9,
        motion: 8,
        density: 4,
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
      },
      dials: {
        variance: 6,
        motion: 5,
        density: 4,
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
      },
      dials: {
        variance: 8,
        motion: 4,
        density: 3,
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
      },
      dials: {
        variance: 4,
        motion: 3,
        density: 8,
      }
    }
  },
  {
    id: 'ethereal-glass',
    name: 'Ethereal Glass',
    description: 'Dark, glassmorphic OLED theme with glowing emerald accents, fluid physics, and generous refraction rings.',
    tokens: {
      appName: 'Aura',
      colors: {
        light: {
          primary: '#050505',
          secondary: '#52525b',
          accent: '#10b981',
          neutralBg: '#f4f4f5',
          neutralSurface: '#ffffff',
          neutralBorder: 'rgba(0,0,0,0.08)',
          textPrimary: '#0f172a',
          textSecondary: '#52525b',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
        },
        dark: {
          primary: '#fafafa',
          secondary: '#a1a1aa',
          accent: '#34d399',
          neutralBg: '#050505',
          neutralSurface: '#0d0d0f',
          neutralBorder: 'rgba(255,255,255,0.08)',
          textPrimary: '#fafafa',
          textSecondary: '#a1a1aa',
          success: '#34d399',
          warning: '#fbbf24',
          error: '#f87171',
          info: '#60a5fa',
        }
      },
      typography: {
        fontHeading: 'Space Grotesk',
        fontBody: 'Manrope',
        fontMono: 'JetBrains Mono',
        scaleRatio: 1.25,
        sizeBase: 15,
        weightHeading: '700',
        weightBody: '400',
        letterSpacingHeading: '-0.03em',
        letterSpacingBody: '-0.01em',
        lineHeightHeading: 1.1,
        lineHeightBody: 1.6,
      },
      shape: {
        radiusBase: 20,
        borderWidth: 1,
        shadowIntensity: 10,
        shadowColor: '#000000',
        backdropBlur: 24,
      },
      motion: {
        durationFast: 120,
        durationNormal: 250,
        durationSlow: 500,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      components: {
        buttonStyle: 'tactile',
        cardStyle: 'elevated',
        inputStyle: 'bordered',
      },
      dials: {
        variance: 8,
        motion: 8,
        density: 4,
      }
    }
  },
  {
    id: 'soft-structuralism',
    name: 'Soft Structuralism',
    description: 'Modern silver-grey aesthetic. Highly readable, spacious layout spacing, and electric blue micro-accenting.',
    tokens: {
      appName: 'Struct',
      colors: {
        light: {
          primary: '#18181b',
          secondary: '#71717a',
          accent: '#3b82f6',
          neutralBg: '#f4f4f5',
          neutralSurface: '#ffffff',
          neutralBorder: 'rgba(0,0,0,0.05)',
          textPrimary: '#18181b',
          textSecondary: '#71717a',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
        },
        dark: {
          primary: '#fafafa',
          secondary: '#a1a1aa',
          accent: '#60a5fa',
          neutralBg: '#18181b',
          neutralSurface: '#27272a',
          neutralBorder: 'rgba(255,255,255,0.05)',
          textPrimary: '#fafafa',
          textSecondary: '#a1a1aa',
          success: '#34d399',
          warning: '#fbbf24',
          error: '#f87171',
          info: '#60a5fa',
        }
      },
      typography: {
        fontHeading: 'Bricolage Grotesque',
        fontBody: 'Inter Tight',
        fontMono: 'JetBrains Mono',
        scaleRatio: 1.2,
        sizeBase: 15,
        weightHeading: '700',
        weightBody: '400',
        letterSpacingHeading: '-0.03em',
        letterSpacingBody: '0em',
        lineHeightHeading: 1.15,
        lineHeightBody: 1.55,
      },
      shape: {
        radiusBase: 16,
        borderWidth: 1,
        shadowIntensity: 35,
        shadowColor: '#18181b',
        backdropBlur: 8,
      },
      motion: {
        durationFast: 120,
        durationNormal: 220,
        durationSlow: 450,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
      components: {
        buttonStyle: 'flat',
        cardStyle: 'elevated',
        inputStyle: 'bordered',
      },
      dials: {
        variance: 7,
        motion: 5,
        density: 3,
      }
    }
  },
  {
    id: 'forest-premium',
    name: 'Forest Premium',
    description: 'Sophisticated warm bone papers, organic deep forest greens, and bright amber accents.',
    tokens: {
      appName: 'Silvan',
      colors: {
        light: {
          primary: '#14352a',
          secondary: '#4a5d4e',
          accent: '#d97706',
          neutralBg: '#f5f4ee',
          neutralSurface: '#fffefb',
          neutralBorder: '#e3e1d5',
          textPrimary: '#1a2e22',
          textSecondary: '#4a5d4e',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
        },
        dark: {
          primary: '#f3f4f1',
          secondary: '#a3b899',
          accent: '#f59e0b',
          neutralBg: '#0e1a14',
          neutralSurface: '#14251d',
          neutralBorder: '#1f352a',
          textPrimary: '#f3f4f1',
          textSecondary: '#a3b899',
          success: '#34d399',
          warning: '#fbbf24',
          error: '#f87171',
          info: '#60a5fa',
        }
      },
      typography: {
        fontHeading: 'Outfit',
        fontBody: 'Plus Jakarta Sans',
        fontMono: 'IBM Plex Mono',
        scaleRatio: 1.25,
        sizeBase: 15,
        weightHeading: '600',
        weightBody: '400',
        letterSpacingHeading: '-0.02em',
        letterSpacingBody: '0em',
        lineHeightHeading: 1.1,
        lineHeightBody: 1.6,
      },
      shape: {
        radiusBase: 8,
        borderWidth: 1,
        shadowIntensity: 12,
        shadowColor: '#14352a',
        backdropBlur: 6,
      },
      motion: {
        durationFast: 150,
        durationNormal: 280,
        durationSlow: 600,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      components: {
        buttonStyle: 'flat',
        cardStyle: 'bordered',
        inputStyle: 'bordered',
      },
      dials: {
        variance: 7,
        motion: 5,
        density: 4,
      }
    }
  },
  {
    id: 'cobalt-cream',
    name: 'Cobalt & Cream',
    description: 'Striking, architectural layout combining deep warm cream paper substrate with highly saturated cobalt blue.',
    tokens: {
      appName: 'Sora',
      colors: {
        light: {
          primary: '#1d4ed8',
          secondary: '#52525b',
          accent: '#1d4ed8',
          neutralBg: '#f7f5f0',
          neutralSurface: '#ffffff',
          neutralBorder: '#e7e4dc',
          textPrimary: '#15151a',
          textSecondary: '#52525b',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#1d4ed8',
        },
        dark: {
          primary: '#f7f5f0',
          secondary: '#a1a1aa',
          accent: '#60a5fa',
          neutralBg: '#090d16',
          neutralSurface: '#111625',
          neutralBorder: '#1e263b',
          textPrimary: '#fafafc',
          textSecondary: '#a1a1aa',
          success: '#34d399',
          warning: '#fbbf24',
          error: '#f87171',
          info: '#60a5fa',
        }
      },
      typography: {
        fontHeading: 'Sora',
        fontBody: 'Hanken Grotesk',
        fontMono: 'Space Mono',
        scaleRatio: 1.25,
        sizeBase: 15,
        weightHeading: '700',
        weightBody: '400',
        letterSpacingHeading: '-0.03em',
        letterSpacingBody: '0em',
        lineHeightHeading: 1.1,
        lineHeightBody: 1.6,
      },
      shape: {
        radiusBase: 6,
        borderWidth: 1,
        shadowIntensity: 15,
        shadowColor: '#15151a',
        backdropBlur: 8,
      },
      motion: {
        durationFast: 100,
        durationNormal: 200,
        durationSlow: 450,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      components: {
        buttonStyle: 'flat',
        cardStyle: 'bordered',
        inputStyle: 'bordered',
      },
      dials: {
        variance: 7,
        motion: 5,
        density: 3,
      }
    }
  },
  {
    id: 'terracotta-slate',
    name: 'Terracotta & Slate',
    description: 'Earthy, warm terracotta highlights resting on top of structured cool-slate layout patterns.',
    tokens: {
      appName: 'Ochre',
      colors: {
        light: {
          primary: '#1e293b',
          secondary: '#64748b',
          accent: '#c2613a',
          neutralBg: '#f2f1ef',
          neutralSurface: '#ffffff',
          neutralBorder: '#e2e0db',
          textPrimary: '#1e293b',
          textSecondary: '#64748b',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
        },
        dark: {
          primary: '#f8fafc',
          secondary: '#94a3b8',
          accent: '#f97316',
          neutralBg: '#131416',
          neutralSurface: '#1c1d21',
          neutralBorder: '#2d2e33',
          textPrimary: '#f8fafc',
          textSecondary: '#94a3b8',
          success: '#34d399',
          warning: '#fbbf24',
          error: '#f87171',
          info: '#60a5fa',
        }
      },
      typography: {
        fontHeading: 'Schibsted Grotesk',
        fontBody: 'Inter Tight',
        fontMono: 'IBM Plex Mono',
        scaleRatio: 1.2,
        sizeBase: 15,
        weightHeading: '700',
        weightBody: '400',
        letterSpacingHeading: '-0.02em',
        letterSpacingBody: '0em',
        lineHeightHeading: 1.15,
        lineHeightBody: 1.55,
      },
      shape: {
        radiusBase: 10,
        borderWidth: 1,
        shadowIntensity: 18,
        shadowColor: '#1e293b',
        backdropBlur: 8,
      },
      motion: {
        durationFast: 120,
        durationNormal: 240,
        durationSlow: 500,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      components: {
        buttonStyle: 'flat',
        cardStyle: 'bordered',
        inputStyle: 'bordered',
      },
      dials: {
        variance: 7,
        motion: 6,
        density: 4,
      }
    }
  },
  {
    id: 'cold-luxury',
    name: 'Cold Luxury',
    description: 'Monochromatic silver, smoke, and chrome layers. Sharp architectural angles, light-refracting outlines, and premium cool accents.',
    tokens: {
      appName: 'Chrome',
      colors: {
        light: {
          primary: '#0b0c0e',
          secondary: '#4b5563',
          accent: '#64748b',
          neutralBg: '#f1f3f5',
          neutralSurface: '#ffffff',
          neutralBorder: '#e1e4e6',
          textPrimary: '#0b0c0e',
          textSecondary: '#4b5563',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
        },
        dark: {
          primary: '#e6e8ea',
          secondary: '#8a9096',
          accent: '#9fb3c8',
          neutralBg: '#0b0c0e',
          neutralSurface: '#14161a',
          neutralBorder: '#23262b',
          textPrimary: '#e6e8ea',
          textSecondary: '#8a9096',
          success: '#34d399',
          warning: '#fbbf24',
          error: '#f87171',
          info: '#60a5fa',
        }
      },
      typography: {
        fontHeading: 'Onest',
        fontBody: 'Onest',
        fontMono: 'JetBrains Mono',
        scaleRatio: 1.25,
        sizeBase: 15,
        weightHeading: '600',
        weightBody: '400',
        letterSpacingHeading: '-0.03em',
        letterSpacingBody: '0em',
        lineHeightHeading: 1.1,
        lineHeightBody: 1.55,
      },
      shape: {
        radiusBase: 4,
        borderWidth: 1,
        shadowIntensity: 10,
        shadowColor: '#0b0c0e',
        backdropBlur: 8,
      },
      motion: {
        durationFast: 140,
        durationNormal: 260,
        durationSlow: 550,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      components: {
        buttonStyle: 'flat',
        cardStyle: 'bordered',
        inputStyle: 'bordered',
      },
      dials: {
        variance: 6,
        motion: 4,
        density: 4,
      }
    }
  },
  {
    id: 'black-tan',
    name: 'Black & Tan',
    description: 'High-contrast organic warm tan sand paired with ultra-crisp off-black structured lines.',
    tokens: {
      appName: 'Sable',
      colors: {
        light: {
          primary: '#161412',
          secondary: '#5c5650',
          accent: '#161412',
          neutralBg: '#e8e0d2',
          neutralSurface: '#faf8f4',
          neutralBorder: '#d3c9b7',
          textPrimary: '#161412',
          textSecondary: '#5c5650',
          success: '#2e5b3f',
          warning: '#c27d38',
          error: '#a83232',
          info: '#2d6896',
        },
        dark: {
          primary: '#faf8f4',
          secondary: '#a39b92',
          accent: '#e8e0d2',
          neutralBg: '#1c1917',
          neutralSurface: '#262321',
          neutralBorder: '#3a3531',
          textPrimary: '#fcfbfa',
          textSecondary: '#a39b92',
          success: '#4ade80',
          warning: '#fbbf24',
          error: '#f87171',
          info: '#60a5fa',
        }
      },
      typography: {
        fontHeading: 'Gabarito',
        fontBody: 'Figtree',
        fontMono: 'Space Mono',
        scaleRatio: 1.25,
        sizeBase: 15,
        weightHeading: '700',
        weightBody: '400',
        letterSpacingHeading: '-0.02em',
        letterSpacingBody: '0em',
        lineHeightHeading: 1.1,
        lineHeightBody: 1.6,
      },
      shape: {
        radiusBase: 2,
        borderWidth: 1,
        shadowIntensity: 15,
        shadowColor: '#161412',
        backdropBlur: 4,
      },
      motion: {
        durationFast: 120,
        durationNormal: 250,
        durationSlow: 500,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      components: {
        buttonStyle: 'flat',
        cardStyle: 'bordered',
        inputStyle: 'bordered',
      },
      dials: {
        variance: 6,
        motion: 4,
        density: 3,
      }
    }
  },
  {
    id: 'mono-pop',
    name: 'Mono Pop',
    description: 'Modern high-contrast monochrome layout injected with a single high-intensity, glowing hot pink accent element.',
    tokens: {
      appName: 'Pop',
      colors: {
        light: {
          primary: '#0a0a0a',
          secondary: '#52525b',
          accent: '#ec4899',
          neutralBg: '#fafafa',
          neutralSurface: '#ffffff',
          neutralBorder: '#e4e4e7',
          textPrimary: '#0a0a0a',
          textSecondary: '#52525b',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ec4899',
          info: '#3b82f6',
        },
        dark: {
          primary: '#fafafa',
          secondary: '#a1a1aa',
          accent: '#f472b6',
          neutralBg: '#0a0a0c',
          neutralSurface: '#16161a',
          neutralBorder: '#27272a',
          textPrimary: '#f4f4f5',
          textSecondary: '#a1a1aa',
          success: '#34d399',
          warning: '#fbbf24',
          error: '#f472b6',
          info: '#60a5fa',
        }
      },
      typography: {
        fontHeading: 'Space Grotesk',
        fontBody: 'Space Grotesk',
        fontMono: 'Space Mono',
        scaleRatio: 1.3,
        sizeBase: 15,
        weightHeading: '700',
        weightBody: '400',
        letterSpacingHeading: '-0.03em',
        letterSpacingBody: '-0.01em',
        lineHeightHeading: 1.1,
        lineHeightBody: 1.5,
      },
      shape: {
        radiusBase: 9999,
        borderWidth: 1,
        shadowIntensity: 25,
        shadowColor: '#0a0a0a',
        backdropBlur: 8,
      },
      motion: {
        durationFast: 100,
        durationNormal: 200,
        durationSlow: 450,
        easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      components: {
        buttonStyle: 'tactile',
        cardStyle: 'bordered',
        inputStyle: 'bordered',
      },
      dials: {
        variance: 8,
        motion: 7,
        density: 4,
      }
    }
  },
  {
    id: 'dark-terminal',
    name: 'Dark Terminal',
    description: 'Immersive command-line terminal interface. Dense layout structure, glowing neon green phosphor elements, and monospace-forward architecture.',
    tokens: {
      appName: 'TTY-0',
      colors: {
        light: {
          primary: '#0c2511',
          secondary: '#2a5c31',
          accent: '#15803d',
          neutralBg: '#f0f7f0',
          neutralSurface: '#ffffff',
          neutralBorder: '#c2e0c2',
          textPrimary: '#0c2511',
          textSecondary: '#2a5c31',
          success: '#16a34a',
          warning: '#ca8a04',
          error: '#dc2626',
          info: '#2563eb',
        },
        dark: {
          primary: '#e5e5e5',
          secondary: '#88b388',
          accent: '#22c55e',
          neutralBg: '#0a0e0a',
          neutralSurface: '#0f140f',
          neutralBorder: '#1c2a1c',
          textPrimary: '#d1f0d1',
          textSecondary: '#88b388',
          success: '#22c55e',
          warning: '#eab308',
          error: '#f87171',
          info: '#60a5fa',
        }
      },
      typography: {
        fontHeading: 'Space Grotesk',
        fontBody: 'IBM Plex Mono',
        fontMono: 'IBM Plex Mono',
        scaleRatio: 1.15,
        sizeBase: 13,
        weightHeading: '700',
        weightBody: '400',
        letterSpacingHeading: '-0.01em',
        letterSpacingBody: '0.02em',
        lineHeightHeading: 1.0,
        lineHeightBody: 1.55,
      },
      shape: {
        radiusBase: 2,
        borderWidth: 1,
        shadowIntensity: 0,
        shadowColor: '#22c55e',
        backdropBlur: 0,
      },
      motion: {
        durationFast: 80,
        durationNormal: 150,
        durationSlow: 300,
        easing: 'steps(4, end)',
      },
      components: {
        buttonStyle: 'flat',
        cardStyle: 'bordered',
        inputStyle: 'bordered',
      },
      dials: {
        variance: 5,
        motion: 6,
        density: 8,
      }
    }
  },
  {
    id: 'swiss-industrial',
    name: 'Swiss Industrial',
    description: 'Raw light brutalist print aesthetic. Hardwood paper substrates, heavy structural outlines, and pure primary red highlights.',
    tokens: {
      appName: 'HELV',
      colors: {
        light: {
          primary: '#0a0a0a',
          secondary: '#4b5563',
          accent: '#e11d2a',
          neutralBg: '#f4f2ec',
          neutralSurface: '#ffffff',
          neutralBorder: '#0a0a0a',
          textPrimary: '#0a0a0a',
          textSecondary: '#4b5563',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#e11d2a',
          info: '#2563eb',
        },
        dark: {
          primary: '#fafafa',
          secondary: '#a1a1aa',
          accent: '#ef4444',
          neutralBg: '#121212',
          neutralSurface: '#1a1a1a',
          neutralBorder: '#fafafa',
          textPrimary: '#fafafa',
          textSecondary: '#a1a1aa',
          success: '#34d399',
          warning: '#fbbf24',
          error: '#ef4444',
          info: '#60a5fa',
        }
      },
      typography: {
        fontHeading: 'Archivo',
        fontBody: 'Archivo',
        fontMono: 'JetBrains Mono',
        scaleRatio: 1.33,
        sizeBase: 15,
        weightHeading: '800',
        weightBody: '400',
        letterSpacingHeading: '-0.04em',
        letterSpacingBody: '-0.01em',
        lineHeightHeading: 0.95,
        lineHeightBody: 1.5,
      },
      shape: {
        radiusBase: 0,
        borderWidth: 2,
        shadowIntensity: 40,
        shadowColor: '#0a0a0a',
        backdropBlur: 0,
      },
      motion: {
        durationFast: 90,
        durationNormal: 180,
        durationSlow: 350,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
      components: {
        buttonStyle: 'flat',
        cardStyle: 'bordered',
        inputStyle: 'bordered',
      },
      dials: {
        variance: 7,
        motion: 4,
        density: 7,
      }
    }
  }
];
