export interface ColorTheme {
  primary: string;
  secondary: string;
  accent: string;
  neutralBg: string;
  neutralSurface: string;
  neutralBorder: string;
  textPrimary: string;
  textSecondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface DesignTokens {
  appName: string;
  // Colors
  colors: {
    light: ColorTheme;
    dark: ColorTheme;
  };
  // Typography
  typography: {
    fontHeading: string; // Google Font Name
    fontBody: string; // Google Font Name
    fontMono: string; // Google Font Name
    scaleRatio: number; // e.g., 1.25 (Major Third), 1.2 (Minor Third)
    sizeBase: number; // px, default 16
    weightHeading: '400' | '500' | '600' | '700' | '800';
    weightBody: '300' | '400' | '500' | '600';
    letterSpacingHeading: string; // e.g. -0.02em
    letterSpacingBody: string; // e.g. 0em
    lineHeightHeading: number; // e.g. 1.1
    lineHeightBody: number; // e.g. 1.5
  };
  // Shape & Elevation
  shape: {
    radiusBase: number; // px, e.g. 12
    borderWidth: number; // px, e.g. 1
    shadowIntensity: number; // 0 to 100
    shadowColor: string; // hex or rgb
    backdropBlur: number; // px
  };
  // Motion
  motion: {
    durationFast: number; // ms, e.g. 150
    durationNormal: number; // ms, e.g. 300
    durationSlow: number; // ms, e.g. 600
    easing: string; // e.g. cubic-bezier(0.16, 1, 0.3, 1)
  };
  // Components Configuration (token overrides / styling choices)
  components: {
    buttonStyle: 'flat' | 'double-bezel' | 'pill' | 'tactile' | 'gradient' | 'glow' | 'glass' | 'neumorphic';
    cardStyle: 'flat' | 'bordered' | 'elevated' | 'double-bezel';
    inputStyle: 'underlined' | 'filled' | 'bordered';
  };
  // Dials
  dials: {
    variance: number;   // 1-10  (1 = symmetric/predictable, 10 = artsy/asymmetric)
    motion: number;     // 1-10  (1 = static, 10 = cinematic/physics)
    density: number;    // 1-10  (1 = art-gallery airy, 10 = cockpit dense)
  };
}

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  tokens: DesignTokens;
}

export interface HistoryState {
  past: DesignTokens[];
  present: DesignTokens;
  future: DesignTokens[];
}
