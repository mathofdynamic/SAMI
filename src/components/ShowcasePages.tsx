import React, { useState } from 'react';
import { 
  Button, 
  Input, 
  Card, 
  Badge, 
  Switch, 
  Avatar 
} from './Primitives';
import { 
  Sparkle, 
  ChartLineUp, 
  Sliders, 
  User, 
  CreditCard, 
  ShieldCheck, 
  Bell, 
  Receipt,
  Eye,
  EyeSlash,
  MagnifyingGlass,
  Plus,
  ArrowRight,
  ArrowLeft,
  Check,
  House,
  Users,
  Gear,
  SignOut,
  SlidersHorizontal,
  CloudArrowUp,
  Fingerprint
} from '@phosphor-icons/react';
import { DesignTokens } from '../types';

interface ShowcaseProps {
  tokens: DesignTokens;
  mode: 'light' | 'dark';
  breakpoint?: 'desktop' | 'tablet' | 'mobile';
}

// 1. LANDING PAGE
export const LandingShowcase: React.FC<ShowcaseProps> = ({ tokens, mode, breakpoint }) => {
  const isMobile = breakpoint === 'mobile';
  const isTablet = breakpoint === 'tablet';

  return (
    <div className="w-full text-[var(--text-primary)] font-[family-name:var(--font-body)] overflow-y-auto max-h-[600px] h-full bg-[var(--color-bg)] transition-colors text-left">
      {/* Mini-Navigation */}
      <nav className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 py-3 bg-[var(--color-bg)]/80 backdrop-blur-[var(--backdrop-blur)] border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[var(--color-accent)] flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-[var(--color-bg)] font-[family-name:var(--font-heading)]">
              {tokens.appName.charAt(0)}
            </span>
          </div>
          <span className="font-bold font-[family-name:var(--font-heading)] tracking-tight text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">
            {tokens.appName}
          </span>
        </div>
        {!isMobile && (
          <div className="flex items-center gap-4 sm:gap-6 text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] font-mono">
            <span className="hover:text-[var(--text-primary)] cursor-pointer">Manifesto</span>
            <span className="hover:text-[var(--text-primary)] cursor-pointer">Features</span>
            {!isTablet && <span className="hover:text-[var(--text-primary)] cursor-pointer">Pricing</span>}
          </div>
        )}
        <Button variant="primary" size="xs" buttonStyle={tokens.components.buttonStyle}>
          Launch App
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="px-4 sm:px-6 py-12 sm:py-16 text-center max-w-4xl mx-auto flex flex-col items-center gap-4 sm:gap-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] font-[family-name:var(--font-mono)] border border-[var(--color-accent)]/20">
          <Sparkle size={10} weight="bold" /> Introducing SAMI Design Token Engine
        </div>
        <h1 
          className={`font-bold tracking-[var(--letter-spacing-heading)] leading-[var(--line-height-heading)] font-[family-name:var(--font-heading)] text-[var(--text-primary)] ${isMobile ? 'text-2xl max-w-[280px]' : isTablet ? 'text-3xl' : 'text-4xl md:text-5xl lg:text-6xl'}`}
        >
          Shape beautiful, structured interfaces in minutes.
        </h1>
        <p className={`text-[var(--text-secondary)] max-w-[60ch] leading-[var(--line-height-body)] mx-auto ${isMobile ? 'text-xs' : 'text-sm sm:text-base'}`}>
          Build on a single cascading source of truth that translates visual guidelines directly to code.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full sm:w-auto items-center justify-center px-4 sm:px-0">
          <Button variant="accent" size={isMobile ? "xs" : "sm"} buttonStyle={tokens.components.buttonStyle} className="group w-full sm:w-auto justify-center">
            Get Started Now
            <ArrowRight size={14} weight="bold" className="ml-1.5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </section>

      {/* Features Asymmetric Section */}
      <section className="px-4 sm:px-6 py-6 sm:py-12 max-w-5xl mx-auto">
        <div className={`grid gap-4 sm:gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-12'}`}>
          {/* Main big feature */}
          <div className={isMobile ? 'col-span-1' : 'md:col-span-7'}>
            <Card 
              cardStyle={tokens.components.cardStyle} 
              className="p-5 sm:p-8 h-full flex flex-col justify-between bg-[var(--color-surface)] border border-[var(--color-border)]"
            >
              <div>
                <Badge variant="accent" className="mb-3">Core Engine</Badge>
                <h3 className="text-sm sm:text-lg md:text-xl font-bold font-[family-name:var(--font-heading)] mb-2">
                  Unified variables cascade automatically.
                </h3>
                <p className="text-[11px] sm:text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed">
                  Every button color, corner radius, and font-weight is dynamically wired. Swap presets instantly and watch the entire digital layout re-render.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[var(--color-accent)]/15 flex items-center justify-center text-[var(--color-accent)] shrink-0">
                  <Sliders size={16} weight="bold" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs font-bold">16ms Live Rebuilds</div>
                  <div className="text-[9px] sm:text-[10px] text-[var(--text-secondary)]">Zero compile latency in style scopes.</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Secondary feature */}
          <div className={isMobile ? 'col-span-1' : 'md:col-span-5'}>
            <Card 
              cardStyle={tokens.components.cardStyle} 
              className="p-5 sm:p-8 h-full flex flex-col justify-between bg-[var(--color-surface)] border border-[var(--color-border)]"
            >
              <div>
                <Badge variant="success" className="mb-3">Downstream</Badge>
                <h3 className="text-sm sm:text-base md:text-lg font-bold font-[family-name:var(--font-heading)] mb-2">
                  Ready for Coding Agents
                </h3>
                <p className="text-[11px] sm:text-xs text-[var(--text-secondary)] leading-relaxed">
                  Export robust markdown briefs configured explicitly to teach AI tools how to program your exact visual specifications.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-1.5">
                <Badge variant="secondary" className="text-[9px] py-0.5">Claude Code</Badge>
                <Badge variant="secondary" className="text-[9px] py-0.5">Cursor</Badge>
                <Badge variant="secondary" className="text-[9px] py-0.5">Tailwind</Badge>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="px-4 sm:px-6 py-6 sm:py-12 text-center max-w-3xl mx-auto">
        <h2 className="text-xs sm:text-base md:text-lg font-bold font-[family-name:var(--font-heading)] tracking-tight mb-2">
          Join the visual engineering movement.
        </h2>
        <p className="text-[10px] sm:text-xs text-[var(--text-secondary)] mb-4 sm:mb-6 max-w-[50ch] mx-auto leading-relaxed">
          Over 4,128 indie developers build cohesive products using SAMI-exported design tokens.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
          <div className="flex -space-x-1.5">
            <div className="w-5 h-5 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-[7px] font-bold text-[var(--color-bg)]">A</div>
            <div className="w-5 h-5 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-[7px] font-bold text-[var(--color-bg)]">M</div>
            <div className="w-5 h-5 rounded-full bg-slate-500 flex items-center justify-center text-[7px] font-bold text-[var(--color-bg)]">Y</div>
          </div>
          <span className="text-[10px] sm:text-xs font-semibold text-[var(--text-secondary)]">
            Loved by creative directors worldwide.
          </span>
        </div>
      </section>
    </div>
  );
};

// 2. DASHBOARD
export const DashboardShowcase: React.FC<ShowcaseProps> = ({ tokens, mode, breakpoint }) => {
  const isMobile = breakpoint === 'mobile';
  const isTablet = breakpoint === 'tablet';

  return (
    <div className={`w-full text-[var(--text-primary)] font-[family-name:var(--font-body)] flex ${isMobile ? 'flex-col' : 'flex-row'} overflow-hidden h-[500px] bg-[var(--color-bg)] transition-colors text-left`}>
      {/* Sidebar Nav */}
      <aside className={isMobile 
        ? "h-14 w-full border-b border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-between px-4 py-2 shrink-0"
        : "w-14 sm:w-44 border-r border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col justify-between p-3 shrink-0"
      }>
        {isMobile ? (
          /* Mobile Sleek Top Row */
          <>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[var(--color-primary)] flex items-center justify-center text-[10px] font-bold text-[var(--color-bg)]">
                {tokens.appName.charAt(0)}
              </div>
              <span className="font-bold text-xs tracking-wider uppercase font-[family-name:var(--font-heading)]">
                {tokens.appName}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex gap-2.5 text-[var(--text-secondary)]">
                <House size={16} className="text-[var(--color-accent)]" />
                <SlidersHorizontal size={16} />
              </div>
              <div className="h-4 w-px bg-[var(--color-border)]" />
              <Avatar name="Sami V" size="xs" online />
            </div>
          </>
        ) : (
          /* Desktop / Tablet Vertical Sidebar */
          <>
            <div className="flex flex-col gap-6 w-full">
              {/* Logo */}
              <div className="flex items-center gap-2 px-1 py-1 w-full">
                <div className="w-6 h-6 rounded bg-[var(--color-primary)] flex items-center justify-center text-[10px] font-bold text-[var(--color-bg)] shrink-0">
                  {tokens.appName.charAt(0)}
                </div>
                <span className="hidden sm:inline font-bold text-[11px] tracking-wider uppercase font-[family-name:var(--font-heading)] truncate">
                  {tokens.appName}
                </span>
              </div>

              {/* Nav links */}
              <div className="flex flex-col gap-1 w-full">
                <span className="px-1 text-[8px] font-bold uppercase tracking-widest text-[var(--text-secondary)] hidden sm:block font-mono">Menu</span>
                <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-[var(--color-accent)]/10 text-[var(--color-accent)] cursor-pointer">
                  <House size={15} weight="fill" className="shrink-0" />
                  <span className="hidden sm:inline text-xs font-semibold">Console</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--color-border)]/20 cursor-pointer">
                  <Users size={15} className="shrink-0" />
                  <span className="hidden sm:inline text-xs font-semibold">Logs</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--color-border)]/20 cursor-pointer">
                  <SlidersHorizontal size={15} className="shrink-0" />
                  <span className="hidden sm:inline text-xs font-semibold">Assets</span>
                </div>
              </div>
            </div>

            {/* User profile info */}
            <div className="flex items-center gap-2 border-t border-[var(--color-border)] pt-3 w-full overflow-hidden">
              <Avatar name="Sami V" size="sm" online />
              <div className="hidden sm:flex flex-col overflow-hidden">
                <span className="text-[11px] font-bold truncate leading-none">Sami V.</span>
                <span className="text-[8px] text-[var(--text-secondary)] truncate font-mono mt-0.5">DESIGNER</span>
              </div>
            </div>
          </>
        )}
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[var(--color-border)]/60">
          <div>
            <h2 className="text-sm sm:text-base font-bold font-[family-name:var(--font-heading)] tracking-tight">Telemetry Dashboard</h2>
            <p className="text-[8px] sm:text-[9px] text-[var(--text-secondary)] font-[family-name:var(--font-mono)]">STATION ID // SAMI_CONSOLE_SEC_01</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="xs" buttonStyle={tokens.components.buttonStyle}>Export Log</Button>
            <Button variant="primary" size="xs" buttonStyle={tokens.components.buttonStyle} className="gap-1">
              <Plus size={12} weight="bold" /> Deploy
            </Button>
          </div>
        </header>

        {/* Metric Cards Grid */}
        <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-12'}`}>
          <div className={isMobile ? 'col-span-1' : 'col-span-6'}>
            <Card cardStyle={tokens.components.cardStyle} className="p-3 h-full bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-bold uppercase tracking-wider text-[var(--text-secondary)] font-mono">Total Volume</span>
                <Badge variant="accent" className="text-[8px] px-1 py-0">+4.2%</Badge>
              </div>
              <div className="text-lg font-bold font-[family-name:var(--font-mono)] mt-1.5">$24,192</div>
              <div className="text-[8px] text-[var(--text-secondary)] mt-0.5">Refreshed 2m ago</div>
            </Card>
          </div>

          <div className={isMobile ? 'col-span-1' : 'col-span-3'}>
            <Card cardStyle={tokens.components.cardStyle} className="p-3 h-full bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-bold uppercase tracking-wider text-[var(--text-secondary)] font-mono">API Latency</span>
                <Badge variant="success" className="text-[8px] px-1 py-0">99.8%</Badge>
              </div>
              <div className="text-lg font-bold font-[family-name:var(--font-mono)] mt-1.5">14.2ms</div>
              <div className="text-[8px] text-[var(--text-secondary)] mt-0.5">Status: Stable</div>
            </Card>
          </div>

          <div className={isMobile ? 'col-span-1' : 'col-span-3'}>
            <Card cardStyle={tokens.components.cardStyle} className="p-3 h-full bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-bold uppercase tracking-wider text-[var(--text-secondary)] font-mono">Task Backlog</span>
                <Badge variant="warning" className="text-[8px] px-1 py-0">3 Active</Badge>
              </div>
              <div className="text-lg font-bold font-[family-name:var(--font-mono)] mt-1.5">18 files</div>
              <div className="text-[8px] text-[var(--text-secondary)] mt-0.5">Queued for build</div>
            </Card>
          </div>
        </div>

        {/* Sparkline chart */}
        <Card cardStyle={tokens.components.cardStyle} className="p-3.5 bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[8px] font-bold uppercase tracking-wider text-[var(--text-secondary)] font-mono">Render Flow Throughput</h3>
            <span className="text-[9px] font-semibold text-[var(--color-accent)] font-[family-name:var(--font-mono)]">Peak: 450 req/s</span>
          </div>
          <div className="h-20 w-full mt-1.5">
            <svg viewBox="0 0 500 100" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="20" x2="500" y2="20" stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="3" />
              <line x1="0" y1="50" x2="500" y2="50" stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="3" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="3" />
              <path 
                d="M 0,90 Q 50,40 100,70 T 200,30 T 300,80 T 400,20 T 500,60" 
                fill="none" 
                stroke="var(--color-accent)" 
                strokeWidth="2.5" 
              />
              <path 
                d="M 0,90 Q 50,40 100,70 T 200,30 T 300,80 T 400,20 T 500,60 L 500,100 L 0,100 Z" 
                fill="url(#chartGradient)" 
              />
            </svg>
          </div>
        </Card>

        {/* Transaction Table */}
        <Card cardStyle={tokens.components.cardStyle} className="bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden">
          <div className="px-3.5 py-2 border-b border-[var(--color-border)]/60 bg-[var(--color-bg)]/20 flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase tracking-wider">Operational Activity Feed</span>
            <Badge variant="secondary" className="text-[8px] px-1 py-0">Live Sync</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <tbody className="divide-y divide-[var(--color-border)]/40">
                <tr className="bg-[var(--color-bg)]/20">
                  <td className="px-3 py-1.5 font-bold text-[9px] text-[var(--text-secondary)] font-mono">Action / Target</td>
                  {!isMobile && <td className="px-3 py-1.5 font-bold text-[9px] text-[var(--text-secondary)] font-mono">Operator</td>}
                  <td className="px-3 py-1.5 font-bold text-[9px] text-[var(--text-secondary)] font-mono">Status</td>
                  <td className="px-3 py-1.5 font-bold text-[9px] text-[var(--text-secondary)] font-mono text-right">Commit Time</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-semibold truncate max-w-[120px] sm:max-w-none">token_config_v2.json</td>
                  {!isMobile && <td className="px-3 py-2">Sami V.</td>}
                  <td className="px-3 py-2"><Badge variant="success" className="text-[8px] py-0 px-1">Parsed</Badge></td>
                  <td className="px-3 py-2 text-right font-[family-name:var(--font-mono)] text-[9px]">14:32:01</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-semibold truncate max-w-[120px] sm:max-w-none">build_prod_bundle</td>
                  {!isMobile && <td className="px-3 py-2">Automation</td>}
                  <td className="px-3 py-2"><Badge variant="info" className="text-[8px] py-0 px-1">Building</Badge></td>
                  <td className="px-3 py-2 text-right font-[family-name:var(--font-mono)] text-[9px]">14:31:45</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
};

// 3. AUTHENTICATION
export const AuthShowcase: React.FC<ShowcaseProps> = ({ tokens, mode, breakpoint }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const isMobile = breakpoint === 'mobile';
  const isTablet = breakpoint === 'tablet';
  const showGraphicSide = !isMobile && !isTablet;

  return (
    <div className="w-full text-[var(--text-primary)] font-[family-name:var(--font-body)] grid grid-cols-1 md:grid-cols-12 h-[500px] bg-[var(--color-bg)] transition-colors overflow-hidden text-left">
      {/* Editorial/Graphic Left Side */}
      {showGraphicSide && (
        <div className="md:col-span-5 bg-[var(--color-primary)] text-[var(--color-bg)] p-8 flex-col justify-between relative overflow-hidden flex">
          {/* Background Visual Grid */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--color-bg)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="flex items-center gap-2 relative z-10">
            <div className="w-7 h-7 rounded-lg bg-[var(--color-accent)] flex items-center justify-center font-bold text-[var(--color-primary)] text-sm shrink-0">
              {tokens.appName.charAt(0)}
            </div>
            <span className="font-bold tracking-tight uppercase text-xs font-[family-name:var(--font-heading)]">
              {tokens.appName} Core
            </span>
          </div>

          <div className="flex flex-col gap-3 relative z-10 my-auto">
            <h2 className="text-2xl font-extrabold tracking-tight leading-tight font-[family-name:var(--font-heading)] text-[var(--color-bg)]">
              The Design-Token Terminal.
            </h2>
            <p className="text-[11px] text-[var(--color-bg)]/85 max-w-[30ch]">
              Experience a highly organized spatial console that maps visual decisions to mechanical configurations.
            </p>
          </div>

          <div className="flex items-center gap-2 relative z-10 pt-4 border-t border-[var(--color-bg)]/20">
            <Fingerprint size={18} weight="bold" />
            <span className="text-[9px] font-bold uppercase tracking-wider font-[family-name:var(--font-mono)]">
              SECURE DECRYPTION LAYER
            </span>
          </div>
        </div>
      )}

      {/* Input Credentials Form Right Side */}
      <div className={`${showGraphicSide ? 'col-span-7' : 'col-span-12'} p-5 sm:p-10 flex flex-col justify-center overflow-y-auto h-full`}>
        <div className="max-w-[320px] sm:max-w-[350px] w-full mx-auto flex flex-col gap-4 sm:gap-5">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg sm:text-xl font-bold font-[family-name:var(--font-heading)] tracking-tight">Access Token Console</h3>
            <p className="text-[11px] sm:text-xs text-[var(--text-secondary)]">Configure and deploy credentials below.</p>
          </div>

          <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
            <Input 
              label="Secure Identity Mail" 
              type="email" 
              placeholder="operator@system.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              inputStyle={tokens.components.inputStyle}
              className="text-xs"
            />

            <div className="relative">
              <Input 
                label="System Password" 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                inputStyle={tokens.components.inputStyle}
                className="text-xs"
              />
              <button
                type="button"
                className="absolute right-3.5 top-[29px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeSlash size={14} /> : <Eye size={14} />}
              </button>
            </div>

            <div className="flex items-center justify-between mt-1">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)] w-3 h-3"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <span className="text-[9px] sm:text-[10px] text-[var(--text-secondary)] select-none">Accept System Protocol</span>
              </label>
              <span className="text-[9px] sm:text-[10px] font-bold text-[var(--color-accent)] hover:underline cursor-pointer">
                Forgot Token?
              </span>
            </div>

            <Button 
              variant="primary" 
              buttonStyle={tokens.components.buttonStyle} 
              className="w-full mt-2.5 py-2 text-xs justify-center"
              disabled={!email || !password}
            >
              Unlock Console
            </Button>
          </form>

          <div className="relative my-1">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[var(--color-border)]"></span></div>
            <div className="relative flex justify-center text-[8px] uppercase"><span className="bg-[var(--color-bg)] px-2 text-[var(--text-secondary)] font-bold font-[family-name:var(--font-mono)]">OR FEDERATED CREDENTIAL</span></div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" size="xs" buttonStyle={tokens.components.buttonStyle} className="text-[10px] py-1.5 justify-center">
              Google Auth
            </Button>
            <Button variant="secondary" size="xs" buttonStyle={tokens.components.buttonStyle} className="text-[10px] py-1.5 justify-center">
              GitHub Auth
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. SETTINGS / PROFILE
export const SettingsShowcase: React.FC<ShowcaseProps> = ({ tokens, mode, breakpoint }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications'>('general');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [aiSync, setAiSync] = useState(true);

  const isMobile = breakpoint === 'mobile';
  const isTablet = breakpoint === 'tablet';

  const sidebarClass = isMobile
    ? "w-full border-b border-[var(--color-border)] bg-[var(--color-surface)] flex flex-row p-2 gap-1 overflow-x-auto shrink-0 scrollbar-none"
    : "w-full sm:w-44 border-b sm:border-b-0 sm:border-r border-[var(--color-border)] bg-[var(--color-surface)] flex flex-row sm:flex-col p-3 gap-1 overflow-x-auto sm:overflow-x-visible shrink-0";

  return (
    <div className={`w-full text-[var(--text-primary)] font-[family-name:var(--font-body)] flex ${isMobile ? 'flex-col' : 'flex-row'} overflow-hidden h-[500px] bg-[var(--color-bg)] transition-colors text-left`}>
      {/* Settings Navigation */}
      <div className={sidebarClass}>
        {!isMobile && (
          <span className="hidden sm:block px-2 text-[9px] font-bold uppercase tracking-wider text-[var(--text-secondary)] font-[family-name:var(--font-mono)] mb-2">
            OPERATIONAL PROFILE
          </span>
        )}
        <button
          onClick={() => setActiveTab('general')}
          className={isMobile
            ? `flex items-center justify-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-full whitespace-nowrap cursor-pointer transition-colors ${activeTab === 'general' ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)]' : 'text-[var(--text-secondary)] hover:bg-[var(--color-border)]/20'}`
            : `flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded w-full whitespace-nowrap cursor-pointer ${activeTab === 'general' ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'text-[var(--text-secondary)] hover:bg-[var(--color-border)]/20'}`}
        >
          <User size={14} /> {!isMobile && 'General Console'}{isMobile && 'General'}
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={isMobile
            ? `flex items-center justify-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-full whitespace-nowrap cursor-pointer transition-colors ${activeTab === 'security' ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)]' : 'text-[var(--text-secondary)] hover:bg-[var(--color-border)]/20'}`
            : `flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded w-full whitespace-nowrap cursor-pointer ${activeTab === 'security' ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'text-[var(--text-secondary)] hover:bg-[var(--color-border)]/20'}`}
        >
          <ShieldCheck size={14} /> {!isMobile && 'Security Layer'}{isMobile && 'Security'}
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={isMobile
            ? `flex items-center justify-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-full whitespace-nowrap cursor-pointer transition-colors ${activeTab === 'notifications' ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)]' : 'text-[var(--text-secondary)] hover:bg-[var(--color-border)]/20'}`
            : `flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded w-full whitespace-nowrap cursor-pointer ${activeTab === 'notifications' ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'text-[var(--text-secondary)] hover:bg-[var(--color-border)]/20'}`}
        >
          <Bell size={14} /> {!isMobile && 'Alert System'}{isMobile && 'Alerts'}
        </button>
      </div>

      {/* Settings Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-bold font-[family-name:var(--font-heading)]">
            {activeTab === 'general' ? 'General Space Settings' : activeTab === 'security' ? 'Security & Identity Shield' : 'Notification Matrix'}
          </h3>
          <p className="text-[9px] sm:text-[10px] text-[var(--text-secondary)]">Manage your interactive design space credentials below.</p>
        </div>

        {activeTab === 'general' && (
          <div className="flex flex-col gap-4">
            <Card cardStyle={tokens.components.cardStyle} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="flex items-center gap-3">
                <Avatar name="Sami Visuals" size="sm" />
                <div>
                  <div className="text-[11px] font-bold">Operator Profile Vector</div>
                  <div className="text-[9px] text-[var(--text-secondary)]">sami@visualstudio.io · Owner</div>
                </div>
              </div>
              <Button variant="outline" size="xs" buttonStyle={tokens.components.buttonStyle} className="w-fit">Upload Photo</Button>
            </Card>

            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
              <Input label="Console Display Name" value="Sami Visuals" readOnly inputStyle={tokens.components.inputStyle} className="text-xs" />
              <Input label="Spatial Region" value="eu-west-2 (London Hub)" readOnly inputStyle={tokens.components.inputStyle} className="text-xs" />
            </div>

            <Card cardStyle={tokens.components.cardStyle} className="p-3.5 flex flex-col gap-3 bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] font-bold">Automatic Downstream Synchronization</div>
                  <div className="text-[9px] text-[var(--text-secondary)] leading-tight">Pushes dynamic JSON packages into Git Repositories.</div>
                </div>
                <div className="shrink-0">
                  <Switch checked={aiSync} onChange={setAiSync} />
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="flex flex-col gap-4">
            <Card cardStyle={tokens.components.cardStyle} className="p-3.5 flex flex-col gap-4 bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-[var(--color-border)]/60">
                <div>
                  <div className="text-[11px] sm:text-xs font-bold">Multi-Factor Hardware Key</div>
                  <div className="text-[9px] text-[var(--text-secondary)] leading-tight">Request physical hardware key signature on credential load.</div>
                </div>
                <div className="shrink-0">
                  <Switch checked={mfaEnabled} onChange={setMfaEnabled} />
                </div>
              </div>
              
              <div className="flex flex-col gap-1.5 pt-1">
                <span className="text-[9px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] font-mono">Security Keys</span>
                <div className="flex items-center justify-between text-[10px] p-2 rounded bg-[var(--color-bg)] border border-[var(--color-border)] gap-2">
                  <span className="font-[family-name:var(--font-mono)] truncate">sami_key_live_ecc_256_pub_9aef80</span>
                  <Badge variant="success" className="text-[8px] py-0 px-1 shrink-0">Active</Badge>
                </div>
              </div>
            </Card>

            <Button variant="outline" size="xs" buttonStyle={tokens.components.buttonStyle} className="w-fit">
              Rotate Security Vectors
            </Button>
          </div>
        )}

        {activeTab === 'notifications' && (
          <Card cardStyle={tokens.components.cardStyle} className="p-3.5 flex flex-col gap-4 bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-[var(--color-border)]/60">
              <div>
                <div className="text-[11px] sm:text-xs font-bold">System Email Dispatch</div>
                <div className="text-[9px] text-[var(--text-secondary)] leading-tight">Dispatches daily metric compilations.</div>
              </div>
              <div className="shrink-0">
                <Switch checked={emailNotifications} onChange={setEmailNotifications} />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] sm:text-xs font-bold">Slack Webhook Broadcast</div>
                <div className="text-[9px] text-[var(--text-secondary)] leading-tight">Broadcasts deploy warnings instantly to slack channels.</div>
              </div>
              <Badge variant="secondary" className="text-[8px] py-0 px-1 shrink-0">Not Configured</Badge>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

// 5. LIST + DETAIL
export const ListDetailShowcase: React.FC<ShowcaseProps> = ({ tokens, mode, breakpoint }) => {
  const [selectedItem, setSelectedItem] = useState(0);
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');

  const isMobile = breakpoint === 'mobile';
  const isTablet = breakpoint === 'tablet';

  const mockItems = [
    {
      id: 0,
      title: 'Aesthetic Interface Asset',
      author: 'SAMI Design Lab',
      tag: 'UI Template',
      status: 'success',
      size: '1.2 MB',
      description: 'A completely styled component matrix adhering to strict fluid guidelines. Supports nested layout frames.',
      details: [
        { label: 'File Type', value: 'Figma Vector Package' },
        { label: 'Layers', value: 'Vector Precision Smart-Objects' },
        { label: 'Auto-Layout', value: 'Version 5.0 Compliant' }
      ]
    },
    {
      id: 1,
      title: 'Monochromatic Layout Spec',
      author: 'Aether Team',
      tag: 'MD Spec',
      status: 'info',
      size: '24 KB',
      description: 'A human-readable markdown schematic describing a structured editorial framework. Perfect for CSS-in-JS injection.',
      details: [
        { label: 'File Type', value: 'Markdown File (.md)' },
        { label: 'Sections', value: '8 System Standard Divisions' },
        { label: 'Target Agent', value: 'Claude Code Core' }
      ]
    },
    {
      id: 2,
      title: 'Lava-Lamp Gradient Shader',
      author: 'Verve Engine',
      tag: 'GLSL CSS',
      status: 'accent',
      size: '185 KB',
      description: 'An elegant CSS-variable liquid background. Animates seamlessly without dropping frame rates below 60fps.',
      details: [
        { label: 'File Type', value: 'Tailwind Plugin Script' },
        { label: 'Rendering', value: 'GPU Accelerated Canvas' },
        { label: 'FPS Target', value: 'V-Sync Locked (60hz)' }
      ]
    }
  ];

  const current = mockItems[selectedItem];

  const showList = !isMobile || mobileView === 'list';
  const showDetail = !isMobile || mobileView === 'detail';

  return (
    <div className={`w-full text-[var(--text-primary)] font-[family-name:var(--font-body)] flex ${isMobile ? 'flex-col' : 'flex-row'} overflow-hidden h-[500px] bg-[var(--color-bg)] transition-colors text-left`}>
      {/* Search and List Column (Left) */}
      {showList && (
        <div className={`w-full ${isMobile ? 'h-full' : 'md:w-5/12 border-r'} border-[var(--color-border)] flex flex-col overflow-y-auto`}>
          <div className="p-3 border-b border-[var(--color-border)] bg-[var(--color-surface)] sticky top-0 z-10 flex gap-2">
            <div className="relative flex-1">
              <Input placeholder="Search Assets..." className="pl-8 text-xs py-1.5" inputStyle={tokens.components.inputStyle} />
              <MagnifyingGlass size={13} className="absolute left-3 top-2.5 text-[var(--text-secondary)]" />
            </div>
            <Button variant="outline" size="xs" buttonStyle={tokens.components.buttonStyle} className="p-2 shrink-0">
              <Sliders size={13} />
            </Button>
          </div>

          {/* List scroll elements */}
          <div className="flex-1 divide-y divide-[var(--color-border)]/40">
            {mockItems.map((item) => (
              <div 
                key={item.id}
                onClick={() => {
                  setSelectedItem(item.id);
                  if (isMobile) {
                    setMobileView('detail');
                  }
                }}
                className={`p-3.5 transition-colors cursor-pointer text-left ${selectedItem === item.id ? 'bg-[var(--color-accent)]/10 border-l-2 border-[var(--color-accent)]' : 'hover:bg-[var(--color-surface)]/40 bg-transparent'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Badge variant={item.status as any} className="text-[8px] py-0 px-1">{item.tag}</Badge>
                  <span className="text-[9px] font-semibold font-[family-name:var(--font-mono)] text-[var(--text-secondary)]">{item.size}</span>
                </div>
                <h4 className="text-xs font-bold leading-tight line-clamp-1 mb-0.5 font-[family-name:var(--font-heading)]">{item.title}</h4>
                <div className="text-[9px] text-[var(--text-secondary)]">by {item.author}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expanded Detail Page (Right) */}
      {showDetail && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4 justify-between h-full">
          <div className="flex flex-col gap-3.5">
            {/* Mobile Back Button */}
            {isMobile && (
              <button 
                onClick={() => setMobileView('list')}
                className="flex items-center gap-1 text-[10px] font-bold text-[var(--color-accent)] hover:underline cursor-pointer py-1 self-start"
              >
                <ArrowLeft size={12} weight="bold" /> Back to Asset Feed
              </button>
            )}

            <div className="flex flex-col gap-1.5">
              <Badge variant={current.status as any} className="w-fit text-[8px] py-0 px-1">{current.tag}</Badge>
              <h3 className="text-sm sm:text-base md:text-lg font-bold tracking-tight font-[family-name:var(--font-heading)] leading-tight">{current.title}</h3>
              <div className="text-[10px] text-[var(--text-secondary)]">Sourced & Managed by {current.author}</div>
            </div>

            <p className="text-[11px] leading-relaxed text-[var(--text-secondary)]">{current.description}</p>

            {/* Technical Spec List */}
            <div className="flex flex-col gap-1.5 mt-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-secondary)] font-mono">
                METADATA PROPERTIES
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {current.details.map((det, i) => (
                  <div key={i} className="flex justify-between items-center text-[10px] p-2 rounded bg-[var(--color-surface)] border border-[var(--color-border)] gap-2">
                    <span className="text-[var(--text-secondary)] font-medium truncate">{det.label}</span>
                    <span className="font-bold truncate text-right">{det.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Bottom Section */}
          <div className="pt-3 border-t border-[var(--color-border)]/60 flex items-center justify-between mt-3 gap-2">
            <div className="text-[11px] font-bold leading-tight">
              <span className="text-[var(--text-secondary)] font-normal text-[9px] block">License Term</span>
              System Open Source
            </div>
            <Button variant="accent" size="xs" buttonStyle={tokens.components.buttonStyle}>
              Inject Asset
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// 6. PRICING / CHECKOUT
export const PricingShowcase: React.FC<ShowcaseProps> = ({ tokens, mode, breakpoint }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Pro Studio');

  const isMobile = breakpoint === 'mobile';
  const isTablet = breakpoint === 'tablet';

  const plans = [
    {
      name: 'Indie Suite',
      price: billingCycle === 'monthly' ? 19 : 14,
      features: ['1 Visual App Prototype', 'W3C Design Token JSON', 'SAMI Core AI Engine', 'Local Storage Persist'],
      isPopular: false,
    },
    {
      name: 'Pro Studio',
      price: billingCycle === 'monthly' ? 49 : 39,
      features: ['Unlimited Prototypes', 'Full DESIGN.md Bundle', 'Dedicated Git Webhooks', 'High-Contrast WCAG Logs', '24/7 Priority Support'],
      isPopular: true,
    }
  ];

  const pricingGridClass = isMobile ? "grid grid-cols-1 gap-4 w-full" : "grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-[600px] mx-auto w-full";

  return (
    <div className="w-full text-[var(--text-primary)] font-[family-name:var(--font-body)] overflow-y-auto max-h-[600px] h-full bg-[var(--color-bg)] transition-colors p-5 sm:p-6 flex flex-col gap-6 text-left">
      
      {/* Checkout modal view overlay in container */}
      {showCheckout ? (
        <div className="flex flex-col gap-4 max-w-[420px] mx-auto w-full py-2 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]/60">
            <div>
              <h3 className="text-xs sm:text-sm font-bold font-[family-name:var(--font-heading)]">Secure Gateway Checkout</h3>
              <p className="text-[9px] sm:text-[10px] text-[var(--text-secondary)]">Plan selected: {selectedPlan}</p>
            </div>
            <Button variant="outline" size="xs" buttonStyle={tokens.components.buttonStyle} className="text-[9px] py-1 px-2" onClick={() => setShowCheckout(false)}>
              Cancel
            </Button>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-3">
            <Input label="Name on Hardware Card" placeholder="Sami Visualist" inputStyle={tokens.components.inputStyle} className="text-xs" />
            <Input label="Secure Card Number" placeholder="4242 •••• •••• 4242" inputStyle={tokens.components.inputStyle} className="text-xs" />
            
            <div className="grid grid-cols-2 gap-3">
              <Input label="Expiration Vector" placeholder="12 / 28" inputStyle={tokens.components.inputStyle} className="text-xs" />
              <Input label="CVV Token" placeholder="•••" inputStyle={tokens.components.inputStyle} className="text-xs" />
            </div>

            {/* Total Summaries */}
            <Card cardStyle={tokens.components.cardStyle} className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col gap-1 mt-1">
              <div className="flex justify-between text-[11px] text-[var(--text-secondary)]">
                <span>{selectedPlan} ({billingCycle})</span>
                <span>${selectedPlan === 'Pro Studio' ? (billingCycle === 'monthly' ? 49 : 39) : (billingCycle === 'monthly' ? 19 : 14)}/mo</span>
              </div>
              <div className="flex justify-between text-[11px] text-[var(--text-secondary)]">
                <span>Design System Surcharges</span>
                <span>$0.00</span>
              </div>
              <div className="border-t border-[var(--color-border)]/60 pt-1.5 flex justify-between text-xs font-bold mt-1">
                <span>Consolidated Amount</span>
                <span>${selectedPlan === 'Pro Studio' ? (billingCycle === 'monthly' ? 49 : 39) : (billingCycle === 'monthly' ? 19 : 14)}</span>
              </div>
            </Card>

            <Button variant="accent" size="sm" buttonStyle={tokens.components.buttonStyle} className="w-full mt-2.5 py-2 justify-center" onClick={() => alert('Secure mock checkout processed successfully!')}>
              <CreditCard size={14} weight="bold" className="mr-1.5" /> Authorized Sign-off
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Billing Cycle Toggle */}
          <div className="flex flex-col items-center gap-3">
            <div className="text-center">
              <h3 className="text-xs sm:text-base font-bold font-[family-name:var(--font-heading)] leading-tight">Predictable, Human Pricing</h3>
              <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">Select the design track that fits your operational bounds.</p>
            </div>
            
            <div className="inline-flex p-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-sm)]">
              <button 
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1 text-[9px] font-bold uppercase tracking-wider rounded-[calc(var(--radius-sm)-2px)] cursor-pointer transition-colors ${billingCycle === 'monthly' ? 'bg-[var(--color-primary)] text-[var(--color-bg)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              >
                Monthly Track
              </button>
              <button 
                onClick={() => setBillingCycle('annual')}
                className={`px-3 py-1 text-[9px] font-bold uppercase tracking-wider rounded-[calc(var(--radius-sm)-2px)] cursor-pointer transition-colors ${billingCycle === 'annual' ? 'bg-[var(--color-primary)] text-[var(--color-bg)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              >
                Annual (20% off)
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className={pricingGridClass}>
            {plans.map((plan) => (
              <Card 
                key={plan.name}
                cardStyle={tokens.components.cardStyle}
                className={`p-4 flex flex-col justify-between bg-[var(--color-surface)] border ${plan.isPopular ? 'border-2 border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/20 shadow-md' : 'border-[var(--color-border)]'}`}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold font-[family-name:var(--font-heading)]">{plan.name}</h4>
                      <div className="text-base font-bold font-[family-name:var(--font-mono)] mt-1">
                        ${plan.price}
                        <span className="text-[9px] text-[var(--text-secondary)] font-normal">/mo</span>
                      </div>
                    </div>
                    {plan.isPopular && <Badge variant="accent" className="text-[8px] py-0 px-1">Popular</Badge>}
                  </div>

                  <ul className="flex flex-col gap-1.5 text-[10px] text-[var(--text-secondary)] border-t border-[var(--color-border)]/60 pt-3">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <Check size={11} weight="bold" className="text-[var(--color-success)] shrink-0" />
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  variant={plan.isPopular ? 'accent' : 'outline'} 
                  size="xs" 
                  buttonStyle={tokens.components.buttonStyle} 
                  className="w-full mt-4 justify-center"
                  onClick={() => {
                    setSelectedPlan(plan.name);
                    setShowCheckout(true);
                  }}
                >
                  Acquire License
                </Button>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
