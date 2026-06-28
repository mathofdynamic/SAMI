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
}

// 1. LANDING PAGE
export const LandingShowcase: React.FC<ShowcaseProps> = ({ tokens, mode }) => {
  return (
    <div className="w-full text-[var(--text-primary)] font-[family-name:var(--font-body)] overflow-y-auto max-h-[600px] h-full bg-[var(--color-bg)] transition-colors">
      {/* Mini-Navigation */}
      <nav className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[var(--color-bg)]/80 backdrop-blur-[var(--backdrop-blur)] border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[var(--color-accent)] flex items-center justify-center">
            <span className="text-[10px] font-bold text-[var(--color-bg)] font-[family-name:var(--font-heading)]">
              {tokens.appName.charAt(0)}
            </span>
          </div>
          <span className="font-bold font-[family-name:var(--font-heading)] tracking-tight">
            {tokens.appName}
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          <span className="hover:text-[var(--text-primary)] cursor-pointer">Manifesto</span>
          <span className="hover:text-[var(--text-primary)] cursor-pointer">Features</span>
          <span className="hover:text-[var(--text-primary)] cursor-pointer">Pricing</span>
        </div>
        <Button variant="primary" size="sm" buttonStyle={tokens.components.buttonStyle}>
          Launch App
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-16 md:py-24 text-center max-w-4xl mx-auto flex flex-col items-center gap-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-[10px] font-bold uppercase tracking-[0.15em] font-[family-name:var(--font-mono)] border border-[var(--color-accent)]/20 animate-pulse">
          <Sparkle size={12} weight="bold" /> Introducing SAMI Design Token Engine
        </div>
        <h1 
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[var(--letter-spacing-heading)] leading-[var(--line-height-heading)] font-[family-name:var(--font-heading)] text-[var(--text-primary)]"
        >
          Shape beautiful, structured interfaces in minutes.
        </h1>
        <p className="text-sm md:text-base text-[var(--text-secondary)] max-w-[60ch] leading-[var(--line-height-body)]">
          Stop writing custom styles for every component. Build on a single cascading source of truth that translates your visual guidelines directly to code.
        </p>
        <div className="flex flex-col sm:flex-row gap-3.5 mt-4">
          <Button variant="accent" size="lg" buttonStyle={tokens.components.buttonStyle} className="group">
            Get Started Now
            <ArrowRight size={16} weight="bold" className="ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button variant="secondary" size="lg" buttonStyle={tokens.components.buttonStyle}>
            View Docs
          </Button>
        </div>
      </section>

      {/* Features Asymmetric Section */}
      <section className="px-6 py-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main big feature */}
          <div className="md:col-span-7">
            <Card 
              cardStyle={tokens.components.cardStyle} 
              className="p-8 h-full flex flex-col justify-between bg-[var(--color-surface)] border border-[var(--color-border)]"
            >
              <div>
                <Badge variant="accent" className="mb-4">Core Engine</Badge>
                <h3 className="text-xl md:text-2xl font-bold font-[family-name:var(--font-heading)] mb-2">
                  Unified tokenized variables cascade automatically.
                </h3>
                <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed">
                  Every button color, corner radius, and font-weight is dynamically wired. Swap presets instantly and watch the entire digital layout re-render.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/15 flex items-center justify-center text-[var(--color-accent)]">
                  <Sliders size={20} weight="bold" />
                </div>
                <div>
                  <div className="text-xs font-bold">16ms Live Rebuilds</div>
                  <div className="text-[10px] text-[var(--text-secondary)]">Zero compile latency in style scopes.</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Secondary feature */}
          <div className="md:col-span-5">
            <Card 
              cardStyle={tokens.components.cardStyle} 
              className="p-8 h-full flex flex-col justify-between bg-[var(--color-surface)] border border-[var(--color-border)]"
            >
              <div>
                <Badge variant="success" className="mb-4">Downstream</Badge>
                <h3 className="text-lg md:text-xl font-bold font-[family-name:var(--font-heading)] mb-2">
                  Ready for Coding Agents
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Export robust markdown briefs configured explicitly to teach AI tools how to program your exact visual specifications.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-1.5">
                <Badge variant="secondary">Claude Code</Badge>
                <Badge variant="secondary">Cursor</Badge>
                <Badge variant="secondary">Tailwind</Badge>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="px-6 py-12 text-center max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] tracking-tight mb-3">
          Join the visual engineering movement.
        </h2>
        <p className="text-xs text-[var(--text-secondary)] mb-6 max-w-[50ch] mx-auto">
          Over 4,128 indie developers build cohesive products using SAMI-exported design tokens.
        </p>
        <div className="flex justify-center gap-2">
          <div className="flex -space-x-2">
            <div className="w-7 h-7 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-[8px] font-bold text-[var(--color-bg)]">A</div>
            <div className="w-7 h-7 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-[8px] font-bold text-[var(--color-bg)]">M</div>
            <div className="w-7 h-7 rounded-full bg-slate-500 flex items-center justify-center text-[8px] font-bold text-[var(--color-bg)]">Y</div>
          </div>
          <span className="text-xs font-semibold text-[var(--text-secondary)] flex items-center ml-2">
            Loved by creative directors worldwide.
          </span>
        </div>
      </section>
    </div>
  );
};

// 2. DASHBOARD
export const DashboardShowcase: React.FC<ShowcaseProps> = ({ tokens, mode }) => {
  return (
    <div className="w-full text-[var(--text-primary)] font-[family-name:var(--font-body)] flex flex-row overflow-hidden h-[500px] bg-[var(--color-bg)] transition-colors">
      {/* Sidebar Nav */}
      <aside className="w-14 sm:w-48 border-r border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col justify-between p-3">
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="w-6 h-6 rounded bg-[var(--color-primary)] flex items-center justify-center text-[10px] font-bold text-[var(--color-bg)]">
              {tokens.appName.charAt(0)}
            </div>
            <span className="hidden sm:inline font-bold text-xs tracking-wider uppercase font-[family-name:var(--font-heading)]">
              {tokens.appName}
            </span>
          </div>

          {/* Nav links */}
          <div className="flex flex-col gap-1">
            <span className="px-2 text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)] hidden sm:block">Menu</span>
            <div className="flex items-center gap-2.5 px-2 py-2 rounded bg-[var(--color-accent)]/10 text-[var(--color-accent)] cursor-pointer">
              <House size={16} weight="fill" />
              <span className="hidden sm:inline text-xs font-medium">Console</span>
            </div>
            <div className="flex items-center gap-2.5 px-2 py-2 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--color-border)]/20 cursor-pointer">
              <Users size={16} />
              <span className="hidden sm:inline text-xs font-medium">Team Logs</span>
            </div>
            <div className="flex items-center gap-2.5 px-2 py-2 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--color-border)]/20 cursor-pointer">
              <SlidersHorizontal size={16} />
              <span className="hidden sm:inline text-xs font-medium">Assets</span>
            </div>
          </div>
        </div>

        {/* User profile info */}
        <div className="flex items-center gap-2 border-t border-[var(--color-border)] pt-3">
          <Avatar name="Sami V" size="sm" online />
          <div className="hidden sm:flex flex-col overflow-hidden">
            <span className="text-xs font-bold truncate">Sami V.</span>
            <span className="text-[9px] text-[var(--text-secondary)] truncate">SAMI Designer</span>
          </div>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-5">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[var(--color-border)]/60">
          <div>
            <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] tracking-tight">Telemetry Dashboard</h2>
            <p className="text-[10px] text-[var(--text-secondary)] font-[family-name:var(--font-mono)]">STATION ID // SAMI_CONSOLE_SEC_01</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" buttonStyle={tokens.components.buttonStyle}>Export Log</Button>
            <Button variant="primary" size="sm" buttonStyle={tokens.components.buttonStyle} className="gap-1.5">
              <Plus size={14} weight="bold" /> Deploy Hub
            </Button>
          </div>
        </header>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card cardStyle={tokens.components.cardStyle} className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Total Volume</span>
              <Badge variant="accent">+4.2%</Badge>
            </div>
            <div className="text-2xl font-bold font-[family-name:var(--font-mono)] mt-2">$24,192</div>
            <div className="text-[9px] text-[var(--text-secondary)] mt-1">Refreshed 2m ago</div>
          </Card>

          <Card cardStyle={tokens.components.cardStyle} className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">API Latency</span>
              <Badge variant="success">99.8%</Badge>
            </div>
            <div className="text-2xl font-bold font-[family-name:var(--font-mono)] mt-2">14.2ms</div>
            <div className="text-[9px] text-[var(--text-secondary)] mt-1">Status: Operational</div>
          </Card>

          <Card cardStyle={tokens.components.cardStyle} className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Task Backlog</span>
              <Badge variant="warning">3 Active</Badge>
            </div>
            <div className="text-2xl font-bold font-[family-name:var(--font-mono)] mt-2">18 files</div>
            <div className="text-[9px] text-[var(--text-secondary)] mt-1">Queued for build</div>
          </Card>
        </div>

        {/* Sparkline chart (Pure Vector SVG to respect CSS variables) */}
        <Card cardStyle={tokens.components.cardStyle} className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Render Flow Throughput</h3>
            <span className="text-xs font-semibold text-[var(--color-accent)] font-[family-name:var(--font-mono)]">Peak: 450 req/s</span>
          </div>
          <div className="h-28 w-full mt-2">
            <svg viewBox="0 0 500 100" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="20" x2="500" y2="20" stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="3" />
              <line x1="0" y1="50" x2="500" y2="50" stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="3" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="3" />
              
              {/* Path and Area */}
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
          <div className="px-4 py-3 border-b border-[var(--color-border)]/60 bg-[var(--color-bg)]/20 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Operational Activity Feed</span>
            <Badge variant="secondary">Live Sync</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--color-bg)]/30 text-[var(--text-secondary)] font-bold font-[family-name:var(--font-heading)] border-b border-[var(--color-border)]">
                <tr>
                  <th className="px-4 py-2">Action / Target</th>
                  <th className="px-4 py-2">Operator</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2 text-right">Commit Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]/40">
                <tr>
                  <td className="px-4 py-3 font-semibold">token_config_v2.json</td>
                  <td className="px-4 py-3">Sami V.</td>
                  <td className="px-4 py-3"><Badge variant="success">Parsed</Badge></td>
                  <td className="px-4 py-3 text-right font-[family-name:var(--font-mono)] text-[10px]">14:32:01</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold">build_production_bundle</td>
                  <td className="px-4 py-3">Automation</td>
                  <td className="px-4 py-3"><Badge variant="info">Building</Badge></td>
                  <td className="px-4 py-3 text-right font-[family-name:var(--font-mono)] text-[10px]">14:31:45</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold">revert_color_accent_override</td>
                  <td className="px-4 py-3">System Hub</td>
                  <td className="px-4 py-3"><Badge variant="warning">Reverted</Badge></td>
                  <td className="px-4 py-3 text-right font-[family-name:var(--font-mono)] text-[10px]">14:28:12</td>
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
export const AuthShowcase: React.FC<ShowcaseProps> = ({ tokens, mode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  return (
    <div className="w-full text-[var(--text-primary)] font-[family-name:var(--font-body)] grid grid-cols-1 md:grid-cols-12 h-[500px] bg-[var(--color-bg)] transition-colors overflow-hidden">
      {/* Editorial/Graphic Left Side */}
      <div className="hidden md:flex md:col-span-5 bg-[var(--color-primary)] text-[var(--color-bg)] p-8 flex-col justify-between relative overflow-hidden">
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
          <div className="w-7 h-7 rounded-lg bg-[var(--color-accent)] flex items-center justify-center font-bold text-[var(--color-primary)] text-sm">
            {tokens.appName.charAt(0)}
          </div>
          <span className="font-bold tracking-tight uppercase text-sm font-[family-name:var(--font-heading)]">
            {tokens.appName} Core
          </span>
        </div>

        <div className="flex flex-col gap-3 relative z-10 my-auto">
          <h2 className="text-3xl font-extrabold tracking-tight leading-tight font-[family-name:var(--font-heading)] text-[var(--color-bg)]">
            The Design-Token Terminal.
          </h2>
          <p className="text-xs text-[var(--color-bg)]/85 max-w-[30ch]">
            Experience a highly organized spatial console that maps visual decisions to mechanical configurations.
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10 pt-4 border-t border-[var(--color-bg)]/20">
          <Fingerprint size={18} weight="bold" />
          <span className="text-[10px] font-bold uppercase tracking-wider font-[family-name:var(--font-mono)]">
            SECURE DECRYPTION LAYER
          </span>
        </div>
      </div>

      {/* Input Credentials Form Right Side */}
      <div className="col-span-1 md:col-span-7 p-6 sm:p-10 flex flex-col justify-center overflow-y-auto h-full">
        <div className="max-w-[350px] w-full mx-auto flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] tracking-tight">Access Token Console</h3>
            <p className="text-xs text-[var(--text-secondary)]">Configure and deploy credentials below.</p>
          </div>

          <form className="flex flex-col gap-3.5" onSubmit={(e) => e.preventDefault()}>
            <Input 
              label="Secure Identity Mail" 
              type="email" 
              placeholder="operator@system.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              inputStyle={tokens.components.inputStyle}
            />

            <div className="relative">
              <Input 
                label="System Password" 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                inputStyle={tokens.components.inputStyle}
              />
              <button
                type="button"
                className="absolute right-3.5 top-8.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <span className="text-[10px] text-[var(--text-secondary)]">Accept System Protocol</span>
              </label>
              <span className="text-[10px] font-bold text-[var(--color-accent)] hover:underline cursor-pointer">
                Forgot Token?
              </span>
            </div>

            <Button 
              variant="primary" 
              buttonStyle={tokens.components.buttonStyle} 
              className="w-full mt-2"
              disabled={!email || !password}
            >
              Unlock Console
            </Button>
          </form>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[var(--color-border)]"></span></div>
            <div className="relative flex justify-center text-[9px] uppercase"><span className="bg-[var(--color-bg)] px-2 text-[var(--text-secondary)] font-bold font-[family-name:var(--font-mono)]">OR FEDERATED CREDENTIAL</span></div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" size="sm" buttonStyle={tokens.components.buttonStyle} className="text-xs">
              Google Auth
            </Button>
            <Button variant="secondary" size="sm" buttonStyle={tokens.components.buttonStyle} className="text-xs">
              GitHub Auth
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. SETTINGS / PROFILE
export const SettingsShowcase: React.FC<ShowcaseProps> = ({ tokens, mode }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications'>('general');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [aiSync, setAiSync] = useState(true);

  return (
    <div className="w-full text-[var(--text-primary)] font-[family-name:var(--font-body)] flex flex-col sm:flex-row overflow-hidden h-[500px] bg-[var(--color-bg)] transition-colors">
      {/* Settings Navigation */}
      <div className="w-full sm:w-48 border-b sm:border-b-0 sm:border-r border-[var(--color-border)] bg-[var(--color-surface)] flex flex-row sm:flex-col p-3 gap-1 overflow-x-auto sm:overflow-x-visible">
        <span className="hidden sm:block px-2 text-[9px] font-bold uppercase tracking-wider text-[var(--text-secondary)] font-[family-name:var(--font-mono)] mb-2">
          OPERATIONAL PROFILE
        </span>
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded w-full whitespace-nowrap cursor-pointer ${activeTab === 'general' ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'text-[var(--text-secondary)] hover:bg-[var(--color-border)]/20'}`}
        >
          <User size={15} /> General Console
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded w-full whitespace-nowrap cursor-pointer ${activeTab === 'security' ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'text-[var(--text-secondary)] hover:bg-[var(--color-border)]/20'}`}
        >
          <ShieldCheck size={15} /> Security Layer
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded w-full whitespace-nowrap cursor-pointer ${activeTab === 'notifications' ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'text-[var(--text-secondary)] hover:bg-[var(--color-border)]/20'}`}
        >
          <Bell size={15} /> Alert System
        </button>
      </div>

      {/* Settings Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-6">
        <div>
          <h3 className="text-base font-bold font-[family-name:var(--font-heading)]">
            {activeTab === 'general' ? 'General Space Settings' : activeTab === 'security' ? 'Security & Identity Shield' : 'Notification Matrix'}
          </h3>
          <p className="text-[10px] text-[var(--text-secondary)]">Manage your interactive design space credentials below.</p>
        </div>

        {activeTab === 'general' && (
          <div className="flex flex-col gap-5">
            <Card cardStyle={tokens.components.cardStyle} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="flex items-center gap-3">
                <Avatar name="Sami Visuals" size="md" />
                <div>
                  <div className="text-xs font-bold">Operator Profile Vector</div>
                  <div className="text-[10px] text-[var(--text-secondary)]">sami@visualstudio.io · Owner</div>
                </div>
              </div>
              <Button variant="outline" size="sm" buttonStyle={tokens.components.buttonStyle}>Upload Photo</Button>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Console Display Name" value="Sami Visuals" readOnly inputStyle={tokens.components.inputStyle} />
              <Input label="Spatial Region" value="eu-west-2 (London Hub)" readOnly inputStyle={tokens.components.inputStyle} />
            </div>

            <Card cardStyle={tokens.components.cardStyle} className="p-4 flex flex-col gap-3 bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold">Automatic Downstream Synchronization</div>
                  <div className="text-[10px] text-[var(--text-secondary)]">Pushes dynamic JSON packages into Git Repositories.</div>
                </div>
                <Switch checked={aiSync} onChange={setAiSync} />
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="flex flex-col gap-4">
            <Card cardStyle={tokens.components.cardStyle} className="p-4 flex flex-col gap-4 bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]/60">
                <div>
                  <div className="text-xs font-bold">Multi-Factor Hardware Key</div>
                  <div className="text-[10px] text-[var(--text-secondary)]">Request physical hardware key signature on credential load.</div>
                </div>
                <Switch checked={mfaEnabled} onChange={setMfaEnabled} />
              </div>
              
              <div className="flex flex-col gap-1.5 pt-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Security Keys</span>
                <div className="flex items-center justify-between text-[11px] p-2 rounded bg-[var(--color-bg)] border border-[var(--color-border)]">
                  <span className="font-[family-name:var(--font-mono)]">sami_key_live_ecc_256_pub_9aef80</span>
                  <Badge variant="success">Active</Badge>
                </div>
              </div>
            </Card>

            <Button variant="outline" size="sm" buttonStyle={tokens.components.buttonStyle} className="w-fit">
              Rotate Security Vectors
            </Button>
          </div>
        )}

        {activeTab === 'notifications' && (
          <Card cardStyle={tokens.components.cardStyle} className="p-4 flex flex-col gap-4 bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]/60">
              <div>
                <div className="text-xs font-bold">System Email Dispatch</div>
                <div className="text-[10px] text-[var(--text-secondary)]">Dispatches daily metric compilations.</div>
              </div>
              <Switch checked={emailNotifications} onChange={setEmailNotifications} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold">Slack Webhook Broadcast</div>
                <div className="text-[10px] text-[var(--text-secondary)]">Broadcasts deploy warnings instantly to slack channels.</div>
              </div>
              <Badge variant="secondary">Not Configured</Badge>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

// 5. LIST + DETAIL
export const ListDetailShowcase: React.FC<ShowcaseProps> = ({ tokens, mode }) => {
  const [selectedItem, setSelectedItem] = useState(0);

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

  return (
    <div className="w-full text-[var(--text-primary)] font-[family-name:var(--font-body)] flex flex-col md:flex-row overflow-hidden h-[500px] bg-[var(--color-bg)] transition-colors">
      {/* Search and List Column (Left) */}
      <div className="w-full md:w-5/12 border-b md:border-b-0 md:border-r border-[var(--color-border)] flex flex-col overflow-y-auto h-full">
        <div className="p-3 border-b border-[var(--color-border)] bg-[var(--color-surface)] sticky top-0 z-10 flex gap-2">
          <div className="relative flex-1">
            <Input placeholder="Search Assets..." className="pl-8 text-xs py-1.5" inputStyle={tokens.components.inputStyle} />
            <MagnifyingGlass size={13} className="absolute left-3 top-2.5 text-[var(--text-secondary)]" />
          </div>
          <Button variant="outline" size="sm" buttonStyle={tokens.components.buttonStyle} className="p-2">
            <Sliders size={14} />
          </Button>
        </div>

        {/* List scroll elements */}
        <div className="flex-1 divide-y divide-[var(--color-border)]/40">
          {mockItems.map((item) => (
            <div 
              key={item.id}
              onClick={() => setSelectedItem(item.id)}
              className={`p-4 transition-colors cursor-pointer text-left ${selectedItem === item.id ? 'bg-[var(--color-accent)]/10 border-l-2 border-[var(--color-accent)]' : 'hover:bg-[var(--color-surface)]/40 bg-transparent'}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <Badge variant={item.status as any}>{item.tag}</Badge>
                <span className="text-[10px] font-semibold font-[family-name:var(--font-mono)] text-[var(--text-secondary)]">{item.size}</span>
              </div>
              <h4 className="text-xs font-bold leading-tight line-clamp-1 mb-1 font-[family-name:var(--font-heading)]">{item.title}</h4>
              <div className="text-[10px] text-[var(--text-secondary)]">by {item.author}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Detail Page (Right) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-5 justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Badge variant={current.status as any} className="w-fit">{current.tag}</Badge>
            <h3 className="text-base md:text-lg font-bold tracking-tight font-[family-name:var(--font-heading)]">{current.title}</h3>
            <div className="text-xs text-[var(--text-secondary)]">Sourced & Managed by {current.author}</div>
          </div>

          <p className="text-xs leading-relaxed text-[var(--text-secondary)]">{current.description}</p>

          {/* Technical Spec List */}
          <div className="flex flex-col gap-1.5 mt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] font-[family-name:var(--font-mono)]">
              METADATA PROPERTIES
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {current.details.map((det, i) => (
                <div key={i} className="flex justify-between items-center text-[11px] p-2 rounded bg-[var(--color-surface)] border border-[var(--color-border)]">
                  <span className="text-[var(--text-secondary)] font-medium">{det.label}</span>
                  <span className="font-bold">{det.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Bottom Section */}
        <div className="pt-4 border-t border-[var(--color-border)]/60 flex items-center justify-between mt-4">
          <div className="text-xs font-bold">
            <span className="text-[var(--text-secondary)] font-normal text-[10px] block">License Term</span>
            System Open Source
          </div>
          <Button variant="accent" size="sm" buttonStyle={tokens.components.buttonStyle}>
            Inject Asset
          </Button>
        </div>
      </div>
    </div>
  );
};

// 6. PRICING / CHECKOUT
export const PricingShowcase: React.FC<ShowcaseProps> = ({ tokens, mode }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Pro Studio');

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

  return (
    <div className="w-full text-[var(--text-primary)] font-[family-name:var(--font-body)] overflow-y-auto max-h-[600px] h-full bg-[var(--color-bg)] transition-colors p-6 flex flex-col gap-8">
      
      {/* Checkout modal view overlay in container */}
      {showCheckout ? (
        <div className="flex flex-col gap-5 max-w-[420px] mx-auto w-full py-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]/60">
            <div>
              <h3 className="text-sm font-bold font-[family-name:var(--font-heading)]">Secure Gateway Checkout</h3>
              <p className="text-[10px] text-[var(--text-secondary)]">Plan selected: {selectedPlan}</p>
            </div>
            <Button variant="outline" size="sm" buttonStyle={tokens.components.buttonStyle} className="text-[10px] py-1 px-2.5" onClick={() => setShowCheckout(false)}>
              Cancel
            </Button>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-3.5">
            <Input label="Name on Hardware Card" placeholder="Sami Visualist" inputStyle={tokens.components.inputStyle} />
            <Input label="Secure Card Number" placeholder="4242 •••• •••• 4242" inputStyle={tokens.components.inputStyle} />
            
            <div className="grid grid-cols-2 gap-3">
              <Input label="Expiration Vector" placeholder="12 / 28" inputStyle={tokens.components.inputStyle} />
              <Input label="CVV Token" placeholder="•••" inputStyle={tokens.components.inputStyle} />
            </div>

            {/* Total Summaries */}
            <Card cardStyle={tokens.components.cardStyle} className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col gap-1.5 mt-2">
              <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                <span>{selectedPlan} ({billingCycle})</span>
                <span>${selectedPlan === 'Pro Studio' ? (billingCycle === 'monthly' ? 49 : 39) : (billingCycle === 'monthly' ? 19 : 14)}/mo</span>
              </div>
              <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                <span>Design System Surcharges</span>
                <span>$0.00</span>
              </div>
              <div className="border-t border-[var(--color-border)]/60 pt-1.5 flex justify-between text-xs font-bold">
                <span>Consolidated Amount</span>
                <span>${selectedPlan === 'Pro Studio' ? (billingCycle === 'monthly' ? 49 : 39) : (billingCycle === 'monthly' ? 19 : 14)}</span>
              </div>
            </Card>

            <Button variant="accent" buttonStyle={tokens.components.buttonStyle} className="w-full mt-2" onClick={() => alert('Secure mock checkout processed successfully!')}>
              <CreditCard size={16} weight="bold" className="mr-2" /> Authorized Sign-off
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Billing Cycle Toggle */}
          <div className="flex flex-col items-center gap-3">
            <div className="text-center">
              <h3 className="text-base font-bold font-[family-name:var(--font-heading)]">Predictable, Human Pricing</h3>
              <p className="text-[10px] text-[var(--text-secondary)]">Select the design track that fits your operational bounds.</p>
            </div>
            
            <div className="inline-flex p-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-sm)]">
              <button 
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-[calc(var(--radius-sm)-2px)] cursor-pointer ${billingCycle === 'monthly' ? 'bg-[var(--color-primary)] text-[var(--color-bg)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              >
                Monthly Track
              </button>
              <button 
                onClick={() => setBillingCycle('annual')}
                className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-[calc(var(--radius-sm)-2px)] cursor-pointer ${billingCycle === 'annual' ? 'bg-[var(--color-primary)] text-[var(--color-bg)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              >
                Annual Save (20%)
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-[600px] mx-auto w-full">
            {plans.map((plan) => (
              <Card 
                key={plan.name}
                cardStyle={tokens.components.cardStyle}
                className={`p-6 flex flex-col justify-between bg-[var(--color-surface)] border ${plan.isPopular ? 'border-2 border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/20' : 'border-[var(--color-border)]'}`}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold font-[family-name:var(--font-heading)]">{plan.name}</h4>
                      <div className="text-2xl font-bold font-[family-name:var(--font-mono)] mt-1.5">
                        ${plan.price}
                        <span className="text-[10px] text-[var(--text-secondary)] font-normal">/mo</span>
                      </div>
                    </div>
                    {plan.isPopular && <Badge variant="accent">Popular</Badge>}
                  </div>

                  <ul className="flex flex-col gap-2 text-[11px] text-[var(--text-secondary)] border-t border-[var(--color-border)]/60 pt-4">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check size={12} weight="bold" className="text-[var(--color-success)] shrink-0" />
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  variant={plan.isPopular ? 'accent' : 'outline'} 
                  size="sm" 
                  buttonStyle={tokens.components.buttonStyle} 
                  className="w-full mt-6"
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
