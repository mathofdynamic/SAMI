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
import { tr, Lang } from '../i18n';

interface ShowcaseProps {
  tokens: DesignTokens;
  mode: 'light' | 'dark';
  breakpoint?: 'desktop' | 'tablet' | 'mobile';
  lang?: Lang;
}

// 1. LANDING PAGE
export const LandingShowcase: React.FC<ShowcaseProps> = ({ tokens, mode, breakpoint, lang = 'en' }) => {
  const isMobile = breakpoint === 'mobile';
  const isTablet = breakpoint === 'tablet';

  return (
    <div className="w-full text-[var(--text-primary)] font-[family-name:var(--font-body)] overflow-y-auto h-full bg-[var(--color-bg)] transition-colors text-start">
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
            <span className="hover:text-[var(--text-primary)] cursor-pointer">{tr(lang, "Manifesto", "بیانیه")}</span>
            <span className="hover:text-[var(--text-primary)] cursor-pointer">{tr(lang, "Features", "ویژگی‌ها")}</span>
            {!isTablet && <span className="hover:text-[var(--text-primary)] cursor-pointer">{tr(lang, "Pricing", "قیمت‌گذاری")}</span>}
          </div>
        )}
        <Button variant="primary" size="xs" buttonStyle={tokens.components.buttonStyle}>
          {tr(lang, "Launch App", "اجرای برنامه")}
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="px-4 sm:px-6 py-12 sm:py-16 text-center max-w-4xl mx-auto flex flex-col items-center gap-4 sm:gap-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] font-[family-name:var(--font-mono)] border border-[var(--color-accent)]/20">
          <Sparkle size={10} weight="bold" /> {tr(lang, "Introducing SAMI Design Token Engine", "معرفی موتور توکن طراحی سامی")}
        </div>
        <h1 
          className={`font-bold tracking-[var(--letter-spacing-heading)] leading-[var(--line-height-heading)] font-[family-name:var(--font-heading)] text-[var(--text-primary)] ${isMobile ? 'text-2xl max-w-[280px]' : isTablet ? 'text-3xl' : 'text-4xl md:text-5xl lg:text-6xl'}`}
        >
          {tr(lang, "Shape beautiful, structured interfaces in minutes.", "رابط‌های زیبا و ساختارمند را در چند دقیقه بسازید.")}
        </h1>
        <p className={`text-[var(--text-secondary)] max-w-[60ch] leading-[var(--line-height-body)] mx-auto ${isMobile ? 'text-xs' : 'text-sm sm:text-base'}`}>
          {tr(lang, "Build on a single cascading source of truth that translates visual guidelines directly to code.", "بر پایه یک منبع واحد حقیقت بسازید که دستورالعمل‌های بصری را مستقیماً به کد تبدیل می‌کند.")}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full sm:w-auto items-center justify-center px-4 sm:px-0">
          <Button variant="accent" size={isMobile ? "xs" : "sm"} buttonStyle={tokens.components.buttonStyle} className="group w-full sm:w-auto justify-center">
            {tr(lang, "Get Started Now", "همین حالا شروع کنید")}
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
                <Badge variant="accent" className="mb-3">{tr(lang, "Core Engine", "موتور اصلی")}</Badge>
                <h3 className="text-sm sm:text-lg md:text-xl font-bold font-[family-name:var(--font-heading)] mb-2">
                  {tr(lang, "Unified variables cascade automatically.", "متغیرهای یکپارچه به‌صورت خودکار آبشار می‌شوند.")}
                </h3>
                <p className="text-[11px] sm:text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {tr(lang, "Every button color, corner radius, and font-weight is dynamically wired. Swap presets instantly and watch the entire digital layout re-render.", "هر رنگ دکمه، گردی گوشه و وزن فونت به‌صورت پویا متصل است. قالب‌ها را فوری عوض کنید و بازسازی کل چیدمان را ببینید.")}
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[var(--color-accent)]/15 flex items-center justify-center text-[var(--color-accent)] shrink-0">
                  <Sliders size={16} weight="bold" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs font-bold">{tr(lang, "16ms Live Rebuilds", "بازسازی زنده ۱۶ms")}</div>
                  <div className="text-[9px] sm:text-[10px] text-[var(--text-secondary)]">{tr(lang, "Zero compile latency in style scopes.", "بدون تأخیر کامپایل در محدوده‌های استایل.")}</div>
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
                <Badge variant="success" className="mb-3">{tr(lang, "Downstream", "پایین‌دستی")}</Badge>
                <h3 className="text-sm sm:text-base md:text-lg font-bold font-[family-name:var(--font-heading)] mb-2">
                  {tr(lang, "Ready for Coding Agents", "آماده برای عامل‌های کدنویسی")}
                </h3>
                <p className="text-[11px] sm:text-xs text-[var(--text-secondary)] leading-relaxed">
                  {tr(lang, "Export robust markdown briefs configured explicitly to teach AI tools how to program your exact visual specifications.", "خروجی‌های مارک‌داون دقیق بگیرید تا به ابزارهای هوش مصنوعی بیاموزند چگونه مشخصات بصری شما را پیاده‌سازی کنند.")}
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
          {tr(lang, "Join the visual engineering movement.", "به جنبش مهندسی بصری بپیوندید.")}
        </h2>
        <p className="text-[10px] sm:text-xs text-[var(--text-secondary)] mb-4 sm:mb-6 max-w-[50ch] mx-auto leading-relaxed">
          {tr(lang, "Over 4,128 indie developers build cohesive products using SAMI-exported design tokens.", "بیش از ۴٬۱۲۸ توسعه‌دهنده مستقل با توکن‌های طراحی سامی محصولات منسجم می‌سازند.")}
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
          <div className="flex -space-x-1.5">
            <div className="w-5 h-5 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-[7px] font-bold text-[var(--color-bg)]">A</div>
            <div className="w-5 h-5 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-[7px] font-bold text-[var(--color-bg)]">M</div>
            <div className="w-5 h-5 rounded-full bg-slate-500 flex items-center justify-center text-[7px] font-bold text-[var(--color-bg)]">Y</div>
          </div>
          <span className="text-[10px] sm:text-xs font-semibold text-[var(--text-secondary)]">
            {tr(lang, "Loved by creative directors worldwide.", "محبوب مدیران خلاق در سراسر جهان.")}
          </span>
        </div>
      </section>
    </div>
  );
};

// 2. DASHBOARD
export const DashboardShowcase: React.FC<ShowcaseProps> = ({ tokens, mode, breakpoint, lang = 'en' }) => {
  const isMobile = breakpoint === 'mobile';
  const isTablet = breakpoint === 'tablet';

  return (
    <div className={`w-full text-[var(--text-primary)] font-[family-name:var(--font-body)] flex ${isMobile ? 'flex-col' : 'flex-row'} overflow-hidden h-full bg-[var(--color-bg)] transition-colors text-start`}>
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
                <span className="px-1 text-[8px] font-bold uppercase tracking-widest text-[var(--text-secondary)] hidden sm:block font-mono">{tr(lang, "Menu", "منو")}</span>
                <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-[var(--color-accent)]/10 text-[var(--color-accent)] cursor-pointer">
                  <House size={15} weight="fill" className="shrink-0" />
                  <span className="hidden sm:inline text-xs font-semibold">{tr(lang, "Console", "کنسول")}</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--color-border)]/20 cursor-pointer">
                  <Users size={15} className="shrink-0" />
                  <span className="hidden sm:inline text-xs font-semibold">{tr(lang, "Logs", "گزارش‌ها")}</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--color-border)]/20 cursor-pointer">
                  <SlidersHorizontal size={15} className="shrink-0" />
                  <span className="hidden sm:inline text-xs font-semibold">{tr(lang, "Assets", "دارایی‌ها")}</span>
                </div>
              </div>
            </div>

            {/* User profile info */}
            <div className="flex items-center gap-2 border-t border-[var(--color-border)] pt-3 w-full overflow-hidden">
              <Avatar name="Sami V" size="sm" online />
              <div className="hidden sm:flex flex-col overflow-hidden">
                <span className="text-[11px] font-bold truncate leading-none">Sami V.</span>
                <span className="text-[8px] text-[var(--text-secondary)] truncate font-mono mt-0.5">{tr(lang, "DESIGNER", "طراح")}</span>
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
            <h2 className="text-sm sm:text-base font-bold font-[family-name:var(--font-heading)] tracking-tight">{tr(lang, "Telemetry Dashboard", "داشبورد تله‌متری")}</h2>
            <p className="text-[8px] sm:text-[9px] text-[var(--text-secondary)] font-[family-name:var(--font-mono)]">STATION ID // SAMI_CONSOLE_SEC_01</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="xs" buttonStyle={tokens.components.buttonStyle}>{tr(lang, "Export Log", "خروجی گزارش")}</Button>
            <Button variant="primary" size="xs" buttonStyle={tokens.components.buttonStyle} className="gap-1">
              <Plus size={12} weight="bold" /> {tr(lang, "Deploy", "استقرار")}
            </Button>
          </div>
        </header>

        {/* Metric Cards Grid */}
        <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-12'}`}>
          <div className={isMobile ? 'col-span-1' : 'col-span-6'}>
            <Card cardStyle={tokens.components.cardStyle} className="p-3 h-full bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-bold uppercase tracking-wider text-[var(--text-secondary)] font-mono">{tr(lang, "Total Volume", "حجم کل")}</span>
                <Badge variant="accent" className="text-[8px] px-1 py-0">+4.2%</Badge>
              </div>
              <div className="text-lg font-bold font-[family-name:var(--font-mono)] mt-1.5">$24,192</div>
              <div className="text-[8px] text-[var(--text-secondary)] mt-0.5">{tr(lang, "Refreshed 2m ago", "۲ دقیقه پیش به‌روزرسانی شد")}</div>
            </Card>
          </div>

          <div className={isMobile ? 'col-span-1' : 'col-span-3'}>
            <Card cardStyle={tokens.components.cardStyle} className="p-3 h-full bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-bold uppercase tracking-wider text-[var(--text-secondary)] font-mono">{tr(lang, "API Latency", "تأخیر API")}</span>
                <Badge variant="success" className="text-[8px] px-1 py-0">99.8%</Badge>
              </div>
              <div className="text-lg font-bold font-[family-name:var(--font-mono)] mt-1.5">14.2ms</div>
              <div className="text-[8px] text-[var(--text-secondary)] mt-0.5">{tr(lang, "Status: Stable", "وضعیت: پایدار")}</div>
            </Card>
          </div>

          <div className={isMobile ? 'col-span-1' : 'col-span-3'}>
            <Card cardStyle={tokens.components.cardStyle} className="p-3 h-full bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-bold uppercase tracking-wider text-[var(--text-secondary)] font-mono">{tr(lang, "Task Backlog", "صف کارها")}</span>
                <Badge variant="warning" className="text-[8px] px-1 py-0">{tr(lang, "3 Active", "۳ فعال")}</Badge>
              </div>
              <div className="text-lg font-bold font-[family-name:var(--font-mono)] mt-1.5">{tr(lang, "18 files", "۱۸ فایل")}</div>
              <div className="text-[8px] text-[var(--text-secondary)] mt-0.5">{tr(lang, "Queued for build", "در صف ساخت")}</div>
            </Card>
          </div>
        </div>

        {/* Sparkline chart */}
        <Card cardStyle={tokens.components.cardStyle} className="p-3.5 bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[8px] font-bold uppercase tracking-wider text-[var(--text-secondary)] font-mono">{tr(lang, "Render Flow Throughput", "توان عبور جریان رندر")}</h3>
            <span className="text-[9px] font-semibold text-[var(--color-accent)] font-[family-name:var(--font-mono)]">{tr(lang, "Peak: 450 req/s", "اوج: ۴۵۰ درخواست بر ثانیه")}</span>
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
            <span className="text-[9px] font-bold uppercase tracking-wider">{tr(lang, "Operational Activity Feed", "خوراک فعالیت عملیاتی")}</span>
            <Badge variant="secondary" className="text-[8px] px-1 py-0">{tr(lang, "Live Sync", "همگام‌سازی زنده")}</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-start text-[11px]">
              <tbody className="divide-y divide-[var(--color-border)]/40">
                <tr className="bg-[var(--color-bg)]/20">
                  <td className="px-3 py-1.5 font-bold text-[9px] text-[var(--text-secondary)] font-mono">{tr(lang, "Action / Target", "عمل / هدف")}</td>
                  {!isMobile && <td className="px-3 py-1.5 font-bold text-[9px] text-[var(--text-secondary)] font-mono">{tr(lang, "Operator", "اپراتور")}</td>}
                  <td className="px-3 py-1.5 font-bold text-[9px] text-[var(--text-secondary)] font-mono">{tr(lang, "Status", "وضعیت")}</td>
                  <td className="px-3 py-1.5 font-bold text-[9px] text-[var(--text-secondary)] font-mono text-right">{tr(lang, "Commit Time", "زمان کامیت")}</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-semibold truncate max-w-[120px] sm:max-w-none">token_config_v2.json</td>
                  {!isMobile && <td className="px-3 py-2">Sami V.</td>}
                  <td className="px-3 py-2"><Badge variant="success" className="text-[8px] py-0 px-1">{tr(lang, "Parsed", "تجزیه‌شده")}</Badge></td>
                  <td className="px-3 py-2 text-right font-[family-name:var(--font-mono)] text-[9px]">14:32:01</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-semibold truncate max-w-[120px] sm:max-w-none">build_prod_bundle</td>
                  {!isMobile && <td className="px-3 py-2">{tr(lang, "Automation", "خودکارسازی")}</td>}
                  <td className="px-3 py-2"><Badge variant="info" className="text-[8px] py-0 px-1">{tr(lang, "Building", "در حال ساخت")}</Badge></td>
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
export const AuthShowcase: React.FC<ShowcaseProps> = ({ tokens, mode, breakpoint, lang = 'en' }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const isMobile = breakpoint === 'mobile';
  const isTablet = breakpoint === 'tablet';
  const showGraphicSide = !isMobile && !isTablet;

  return (
    <div className="w-full text-[var(--text-primary)] font-[family-name:var(--font-body)] grid grid-cols-1 md:grid-cols-12 h-full bg-[var(--color-bg)] transition-colors overflow-hidden text-start">
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
              {tokens.appName} {tr(lang, "Core", "هسته")}
            </span>
          </div>

          <div className="flex flex-col gap-3 relative z-10 my-auto">
            <h2 className="text-2xl font-extrabold tracking-tight leading-tight font-[family-name:var(--font-heading)] text-[var(--color-bg)]">
              {tr(lang, "The Design-Token Terminal.", "ترمینال توکن طراحی.")}
            </h2>
            <p className="text-[11px] text-[var(--color-bg)]/85 max-w-[30ch]">
              {tr(lang, "Experience a highly organized spatial console that maps visual decisions to mechanical configurations.", "یک کنسول فضایی بسیار منظم را تجربه کنید که تصمیمات بصری را به پیکربندی‌های مکانیکی نگاشت می‌کند.")}
            </p>
          </div>

          <div className="flex items-center gap-2 relative z-10 pt-4 border-t border-[var(--color-bg)]/20">
            <Fingerprint size={18} weight="bold" />
            <span className="text-[9px] font-bold uppercase tracking-wider font-[family-name:var(--font-mono)]">
              {tr(lang, "SECURE DECRYPTION LAYER", "لایه رمزگشایی امن")}
            </span>
          </div>
        </div>
      )}

      {/* Input Credentials Form Right Side */}
      <div className={`${showGraphicSide ? 'col-span-7' : 'col-span-12'} p-5 sm:p-10 flex flex-col justify-center overflow-y-auto h-full`}>
        <div className="max-w-[320px] sm:max-w-[350px] w-full mx-auto flex flex-col gap-4 sm:gap-5">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg sm:text-xl font-bold font-[family-name:var(--font-heading)] tracking-tight">{tr(lang, "Access Token Console", "کنسول توکن دسترسی")}</h3>
            <p className="text-[11px] sm:text-xs text-[var(--text-secondary)]">{tr(lang, "Configure and deploy credentials below.", "اعتبارنامه‌ها را در زیر پیکربندی و مستقر کنید.")}</p>
          </div>

          <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
            <Input 
              label={tr(lang, "Secure Identity Mail", "ایمیل هویت امن")} 
              type="email" 
              placeholder="operator@system.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              inputStyle={tokens.components.inputStyle}
              className="text-xs"
            />

            <div className="relative">
              <Input 
                label={tr(lang, "System Password", "گذرواژه سیستم")} 
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
                <span className="text-[9px] sm:text-[10px] text-[var(--text-secondary)] select-none">{tr(lang, "Accept System Protocol", "پذیرش پروتکل سیستم")}</span>
              </label>
              <span className="text-[9px] sm:text-[10px] font-bold text-[var(--color-accent)] hover:underline cursor-pointer">
                {tr(lang, "Forgot Token?", "توکن را فراموش کردید؟")}
              </span>
            </div>

            <Button 
              variant="primary" 
              buttonStyle={tokens.components.buttonStyle} 
              className="w-full mt-2.5 py-2 text-xs justify-center"
              disabled={!email || !password}
            >
              {tr(lang, "Unlock Console", "باز کردن کنسول")}
            </Button>
          </form>

          <div className="relative my-1">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[var(--color-border)]"></span></div>
            <div className="relative flex justify-center text-[8px] uppercase"><span className="bg-[var(--color-bg)] px-2 text-[var(--text-secondary)] font-bold font-[family-name:var(--font-mono)]">{tr(lang, "OR FEDERATED CREDENTIAL", "یا اعتبارنامه فدرال")}</span></div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" size="xs" buttonStyle={tokens.components.buttonStyle} className="text-[10px] py-1.5 justify-center">
              {tr(lang, "Google Auth", "ورود با گوگل")}
            </Button>
            <Button variant="secondary" size="xs" buttonStyle={tokens.components.buttonStyle} className="text-[10px] py-1.5 justify-center">
              {tr(lang, "GitHub Auth", "ورود با گیت‌هاب")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. SETTINGS / PROFILE
export const SettingsShowcase: React.FC<ShowcaseProps> = ({ tokens, mode, breakpoint, lang = 'en' }) => {
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
    <div className={`w-full text-[var(--text-primary)] font-[family-name:var(--font-body)] flex ${isMobile ? 'flex-col' : 'flex-row'} overflow-hidden h-full bg-[var(--color-bg)] transition-colors text-start`}>
      {/* Settings Navigation */}
      <div className={sidebarClass}>
        {!isMobile && (
          <span className="hidden sm:block px-2 text-[9px] font-bold uppercase tracking-wider text-[var(--text-secondary)] font-[family-name:var(--font-mono)] mb-2">
            {tr(lang, "OPERATIONAL PROFILE", "پروفایل عملیاتی")}
          </span>
        )}
        <button
          onClick={() => setActiveTab('general')}
          className={isMobile
            ? `flex items-center justify-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-full whitespace-nowrap cursor-pointer transition-colors ${activeTab === 'general' ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)]' : 'text-[var(--text-secondary)] hover:bg-[var(--color-border)]/20'}`
            : `flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded w-full whitespace-nowrap cursor-pointer ${activeTab === 'general' ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'text-[var(--text-secondary)] hover:bg-[var(--color-border)]/20'}`}
        >
          <User size={14} /> {!isMobile && tr(lang, 'General Console', 'کنسول عمومی')}{isMobile && tr(lang, 'General', 'عمومی')}
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={isMobile
            ? `flex items-center justify-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-full whitespace-nowrap cursor-pointer transition-colors ${activeTab === 'security' ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)]' : 'text-[var(--text-secondary)] hover:bg-[var(--color-border)]/20'}`
            : `flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded w-full whitespace-nowrap cursor-pointer ${activeTab === 'security' ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'text-[var(--text-secondary)] hover:bg-[var(--color-border)]/20'}`}
        >
          <ShieldCheck size={14} /> {!isMobile && tr(lang, 'Security Layer', 'لایه امنیت')}{isMobile && tr(lang, 'Security', 'امنیت')}
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={isMobile
            ? `flex items-center justify-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-full whitespace-nowrap cursor-pointer transition-colors ${activeTab === 'notifications' ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)]' : 'text-[var(--text-secondary)] hover:bg-[var(--color-border)]/20'}`
            : `flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded w-full whitespace-nowrap cursor-pointer ${activeTab === 'notifications' ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'text-[var(--text-secondary)] hover:bg-[var(--color-border)]/20'}`}
        >
          <Bell size={14} /> {!isMobile && tr(lang, 'Alert System', 'سیستم هشدار')}{isMobile && tr(lang, 'Alerts', 'هشدارها')}
        </button>
      </div>

      {/* Settings Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-bold font-[family-name:var(--font-heading)]">
            {activeTab === 'general' ? tr(lang, 'General Space Settings', 'تنظیمات عمومی فضا') : activeTab === 'security' ? tr(lang, 'Security & Identity Shield', 'سپر امنیت و هویت') : tr(lang, 'Notification Matrix', 'ماتریس اعلان‌ها')}
          </h3>
          <p className="text-[9px] sm:text-[10px] text-[var(--text-secondary)]">{tr(lang, "Manage your interactive design space credentials below.", "اعتبارنامه‌های فضای طراحی تعاملی خود را در زیر مدیریت کنید.")}</p>
        </div>

        {activeTab === 'general' && (
          <div className="flex flex-col gap-4">
            <Card cardStyle={tokens.components.cardStyle} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="flex items-center gap-3">
                <Avatar name="Sami Visuals" size="sm" />
                <div>
                  <div className="text-[11px] font-bold">{tr(lang, "Operator Profile Vector", "بردار پروفایل اپراتور")}</div>
                  <div className="text-[9px] text-[var(--text-secondary)]">{tr(lang, "sami@visualstudio.io · Owner", "sami@visualstudio.io · مالک")}</div>
                </div>
              </div>
              <Button variant="outline" size="xs" buttonStyle={tokens.components.buttonStyle} className="w-fit">{tr(lang, "Upload Photo", "بارگذاری عکس")}</Button>
            </Card>

            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
              <Input label={tr(lang, "Console Display Name", "نام نمایشی کنسول")} value="Sami Visuals" readOnly inputStyle={tokens.components.inputStyle} className="text-xs" />
              <Input label={tr(lang, "Spatial Region", "منطقه فضایی")} value="eu-west-2 (London Hub)" readOnly inputStyle={tokens.components.inputStyle} className="text-xs" />
            </div>

            <Card cardStyle={tokens.components.cardStyle} className="p-3.5 flex flex-col gap-3 bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] font-bold">{tr(lang, "Automatic Downstream Synchronization", "همگام‌سازی خودکار پایین‌دستی")}</div>
                  <div className="text-[9px] text-[var(--text-secondary)] leading-tight">{tr(lang, "Pushes dynamic JSON packages into Git Repositories.", "بسته‌های پویای JSON را به مخازن Git ارسال می‌کند.")}</div>
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
                  <div className="text-[11px] sm:text-xs font-bold">{tr(lang, "Multi-Factor Hardware Key", "کلید سخت‌افزاری چندعاملی")}</div>
                  <div className="text-[9px] text-[var(--text-secondary)] leading-tight">{tr(lang, "Request physical hardware key signature on credential load.", "درخواست امضای کلید سخت‌افزاری هنگام بارگذاری اعتبارنامه.")}</div>
                </div>
                <div className="shrink-0">
                  <Switch checked={mfaEnabled} onChange={setMfaEnabled} />
                </div>
              </div>
              
              <div className="flex flex-col gap-1.5 pt-1">
                <span className="text-[9px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] font-mono">{tr(lang, "Security Keys", "کلیدهای امنیتی")}</span>
                <div className="flex items-center justify-between text-[10px] p-2 rounded bg-[var(--color-bg)] border border-[var(--color-border)] gap-2">
                  <span className="font-[family-name:var(--font-mono)] truncate">sami_key_live_ecc_256_pub_9aef80</span>
                  <Badge variant="success" className="text-[8px] py-0 px-1 shrink-0">{tr(lang, "Active", "فعال")}</Badge>
                </div>
              </div>
            </Card>

            <Button variant="outline" size="xs" buttonStyle={tokens.components.buttonStyle} className="w-fit">
              {tr(lang, "Rotate Security Vectors", "چرخش بردارهای امنیتی")}
            </Button>
          </div>
        )}

        {activeTab === 'notifications' && (
          <Card cardStyle={tokens.components.cardStyle} className="p-3.5 flex flex-col gap-4 bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-[var(--color-border)]/60">
              <div>
                <div className="text-[11px] sm:text-xs font-bold">{tr(lang, "System Email Dispatch", "ارسال ایمیل سیستم")}</div>
                <div className="text-[9px] text-[var(--text-secondary)] leading-tight">{tr(lang, "Dispatches daily metric compilations.", "گزارش‌های متریک روزانه را ارسال می‌کند.")}</div>
              </div>
              <div className="shrink-0">
                <Switch checked={emailNotifications} onChange={setEmailNotifications} />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] sm:text-xs font-bold">{tr(lang, "Slack Webhook Broadcast", "پخش وب‌هوک اسلک")}</div>
                <div className="text-[9px] text-[var(--text-secondary)] leading-tight">{tr(lang, "Broadcasts deploy warnings instantly to slack channels.", "هشدارهای استقرار را فوری به کانال‌های اسلک پخش می‌کند.")}</div>
              </div>
              <Badge variant="secondary" className="text-[8px] py-0 px-1 shrink-0">{tr(lang, "Not Configured", "پیکربندی‌نشده")}</Badge>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

// 5. LIST + DETAIL
export const ListDetailShowcase: React.FC<ShowcaseProps> = ({ tokens, mode, breakpoint, lang = 'en' }) => {
  const [selectedItem, setSelectedItem] = useState(0);
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');

  const isMobile = breakpoint === 'mobile';
  const isTablet = breakpoint === 'tablet';

  const mockItems = [
    {
      id: 0,
      title: tr(lang, 'Aesthetic Interface Asset', 'دارایی رابط زیبا'),
      author: 'SAMI Design Lab',
      tag: 'UI Template',
      status: 'success',
      size: '1.2 MB',
      description: tr(lang, 'A completely styled component matrix adhering to strict fluid guidelines. Supports nested layout frames.', 'یک ماتریس کامپوننت کاملاً استایل‌شده مطابق دستورالعمل‌های سیال دقیق. از قاب‌های چیدمان تو در تو پشتیبانی می‌کند.'),
      details: [
        { label: tr(lang, 'File Type', 'نوع فایل'), value: tr(lang, 'Figma Vector Package', 'بسته وکتور فیگما') },
        { label: tr(lang, 'Layers', 'لایه‌ها'), value: tr(lang, 'Vector Precision Smart-Objects', 'اشیاء هوشمند برداری دقیق') },
        { label: tr(lang, 'Auto-Layout', 'چیدمان خودکار'), value: tr(lang, 'Version 5.0 Compliant', 'سازگار با نسخه ۵.۰') }
      ]
    },
    {
      id: 1,
      title: tr(lang, 'Monochromatic Layout Spec', 'مشخصات چیدمان تک‌رنگ'),
      author: 'Aether Team',
      tag: 'MD Spec',
      status: 'info',
      size: '24 KB',
      description: tr(lang, 'A human-readable markdown schematic describing a structured editorial framework. Perfect for CSS-in-JS injection.', 'یک شمای مارک‌داون خوانا که چارچوب تحریریه ساختارمند را توصیف می‌کند. برای تزریق CSS-in-JS عالی است.'),
      details: [
        { label: tr(lang, 'File Type', 'نوع فایل'), value: tr(lang, 'Markdown File (.md)', 'فایل مارک‌داون (.md)') },
        { label: tr(lang, 'Sections', 'بخش‌ها'), value: tr(lang, '8 System Standard Divisions', '۸ بخش استاندارد سیستم') },
        { label: tr(lang, 'Target Agent', 'عامل هدف'), value: tr(lang, 'Claude Code Core', 'هسته Claude Code') }
      ]
    },
    {
      id: 2,
      title: tr(lang, 'Lava-Lamp Gradient Shader', 'شیدر گرادیان گدازه‌ای'),
      author: 'Verve Engine',
      tag: 'GLSL CSS',
      status: 'accent',
      size: '185 KB',
      description: tr(lang, 'An elegant CSS-variable liquid background. Animates seamlessly without dropping frame rates below 60fps.', 'یک پس‌زمینه مایع زیبا با متغیر CSS. بدون افت نرخ فریم زیر ۶۰ به‌صورت یکپارچه متحرک می‌شود.'),
      details: [
        { label: tr(lang, 'File Type', 'نوع فایل'), value: tr(lang, 'Tailwind Plugin Script', 'اسکریپت افزونه Tailwind') },
        { label: tr(lang, 'Rendering', 'رندرینگ'), value: tr(lang, 'GPU Accelerated Canvas', 'بوم شتاب‌یافته با GPU') },
        { label: tr(lang, 'FPS Target', 'هدف نرخ فریم'), value: tr(lang, 'V-Sync Locked (60hz)', 'قفل V-Sync (۶۰ هرتز)') }
      ]
    }
  ];

  const current = mockItems[selectedItem];

  const showList = !isMobile || mobileView === 'list';
  const showDetail = !isMobile || mobileView === 'detail';

  return (
    <div className={`w-full text-[var(--text-primary)] font-[family-name:var(--font-body)] flex ${isMobile ? 'flex-col' : 'flex-row'} overflow-hidden h-full bg-[var(--color-bg)] transition-colors text-start`}>
      {/* Search and List Column (Left) */}
      {showList && (
        <div className={`w-full ${isMobile ? 'h-full' : 'md:w-5/12 border-r'} border-[var(--color-border)] flex flex-col overflow-y-auto`}>
          <div className="p-3 border-b border-[var(--color-border)] bg-[var(--color-surface)] sticky top-0 z-10 flex gap-2">
            <div className="relative flex-1">
              <Input placeholder={tr(lang, "Search Assets...", "جستجوی دارایی‌ها...")} className="pl-8 text-xs py-1.5" inputStyle={tokens.components.inputStyle} />
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
                className={`p-3.5 transition-colors cursor-pointer text-start ${selectedItem === item.id ? 'bg-[var(--color-accent)]/10 border-l-2 border-[var(--color-accent)]' : 'hover:bg-[var(--color-surface)]/40 bg-transparent'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Badge variant={item.status as any} className="text-[8px] py-0 px-1">{item.tag}</Badge>
                  <span className="text-[9px] font-semibold font-[family-name:var(--font-mono)] text-[var(--text-secondary)]">{item.size}</span>
                </div>
                <h4 className="text-xs font-bold leading-tight line-clamp-1 mb-0.5 font-[family-name:var(--font-heading)]">{item.title}</h4>
                <div className="text-[9px] text-[var(--text-secondary)]">{tr(lang, "by", "توسط")} {item.author}</div>
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
                <ArrowLeft size={12} weight="bold" /> {tr(lang, "Back to Asset Feed", "بازگشت به فهرست دارایی‌ها")}
              </button>
            )}

            <div className="flex flex-col gap-1.5">
              <Badge variant={current.status as any} className="w-fit text-[8px] py-0 px-1">{current.tag}</Badge>
              <h3 className="text-sm sm:text-base md:text-lg font-bold tracking-tight font-[family-name:var(--font-heading)] leading-tight">{current.title}</h3>
              <div className="text-[10px] text-[var(--text-secondary)]">{tr(lang, "Sourced & Managed by", "تهیه و مدیریت توسط")} {current.author}</div>
            </div>

            <p className="text-[11px] leading-relaxed text-[var(--text-secondary)]">{current.description}</p>

            {/* Technical Spec List */}
            <div className="flex flex-col gap-1.5 mt-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-secondary)] font-mono">
                {tr(lang, "METADATA PROPERTIES", "ویژگی‌های فراداده")}
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
              <span className="text-[var(--text-secondary)] font-normal text-[9px] block">{tr(lang, "License Term", "مدت لایسنس")}</span>
              {tr(lang, "System Open Source", "متن‌باز سیستمی")}
            </div>
            <Button variant="accent" size="xs" buttonStyle={tokens.components.buttonStyle}>
              {tr(lang, "Inject Asset", "تزریق دارایی")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// 6. PRICING / CHECKOUT
export const PricingShowcase: React.FC<ShowcaseProps> = ({ tokens, mode, breakpoint, lang = 'en' }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Pro Studio');

  const isMobile = breakpoint === 'mobile';
  const isTablet = breakpoint === 'tablet';

  const plans = [
    {
      name: 'Indie Suite',
      price: billingCycle === 'monthly' ? 19 : 14,
      features: [tr(lang, '1 Visual App Prototype', '۱ نمونه اولیه برنامه بصری'), tr(lang, 'W3C Design Token JSON', 'توکن طراحی W3C به JSON'), tr(lang, 'SAMI Core AI Engine', 'موتور هوش مصنوعی هسته سامی'), tr(lang, 'Local Storage Persist', 'ماندگاری ذخیره محلی')],
      isPopular: false,
    },
    {
      name: 'Pro Studio',
      price: billingCycle === 'monthly' ? 49 : 39,
      features: [tr(lang, 'Unlimited Prototypes', 'نمونه‌های اولیه نامحدود'), tr(lang, 'Full DESIGN.md Bundle', 'بسته کامل DESIGN.md'), tr(lang, 'Dedicated Git Webhooks', 'وب‌هوک‌های اختصاصی Git'), tr(lang, 'High-Contrast WCAG Logs', 'گزارش‌های WCAG با کنتراست بالا'), tr(lang, '24/7 Priority Support', 'پشتیبانی اولویت‌دار ۲۴/۷')],
      isPopular: true,
    }
  ];

  const pricingGridClass = isMobile ? "grid grid-cols-1 gap-4 w-full" : "grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-[600px] mx-auto w-full";

  return (
    <div className="w-full text-[var(--text-primary)] font-[family-name:var(--font-body)] overflow-y-auto h-full bg-[var(--color-bg)] transition-colors p-5 sm:p-6 flex flex-col gap-6 text-start">
      
      {/* Checkout modal view overlay in container */}
      {showCheckout ? (
        <div className="flex flex-col gap-4 max-w-[420px] mx-auto w-full py-2 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]/60">
            <div>
              <h3 className="text-xs sm:text-sm font-bold font-[family-name:var(--font-heading)]">{tr(lang, "Secure Gateway Checkout", "پرداخت امن درگاه")}</h3>
              <p className="text-[9px] sm:text-[10px] text-[var(--text-secondary)]">{tr(lang, "Plan selected", "طرح انتخابی")}: {selectedPlan}</p>
            </div>
            <Button variant="outline" size="xs" buttonStyle={tokens.components.buttonStyle} className="text-[9px] py-1 px-2" onClick={() => setShowCheckout(false)}>
              {tr(lang, "Cancel", "لغو")}
            </Button>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-3">
            <Input label={tr(lang, "Name on Hardware Card", "نام روی کارت")} placeholder="Sami Visualist" inputStyle={tokens.components.inputStyle} className="text-xs" />
            <Input label={tr(lang, "Secure Card Number", "شماره کارت امن")} placeholder="4242 •••• •••• 4242" inputStyle={tokens.components.inputStyle} className="text-xs" />
            
            <div className="grid grid-cols-2 gap-3">
              <Input label={tr(lang, "Expiration Vector", "تاریخ انقضا")} placeholder="12 / 28" inputStyle={tokens.components.inputStyle} className="text-xs" />
              <Input label={tr(lang, "CVV Token", "توکن CVV")} placeholder="•••" inputStyle={tokens.components.inputStyle} className="text-xs" />
            </div>

            {/* Total Summaries */}
            <Card cardStyle={tokens.components.cardStyle} className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col gap-1 mt-1">
              <div className="flex justify-between text-[11px] text-[var(--text-secondary)]">
                <span>{selectedPlan} ({billingCycle})</span>
                <span>${selectedPlan === 'Pro Studio' ? (billingCycle === 'monthly' ? 49 : 39) : (billingCycle === 'monthly' ? 19 : 14)}/mo</span>
              </div>
              <div className="flex justify-between text-[11px] text-[var(--text-secondary)]">
                <span>{tr(lang, "Design System Surcharges", "هزینه‌های سیستم طراحی")}</span>
                <span>$0.00</span>
              </div>
              <div className="border-t border-[var(--color-border)]/60 pt-1.5 flex justify-between text-xs font-bold mt-1">
                <span>{tr(lang, "Consolidated Amount", "مبلغ تجمیع‌شده")}</span>
                <span>${selectedPlan === 'Pro Studio' ? (billingCycle === 'monthly' ? 49 : 39) : (billingCycle === 'monthly' ? 19 : 14)}</span>
              </div>
            </Card>

            <Button variant="accent" size="sm" buttonStyle={tokens.components.buttonStyle} className="w-full mt-2.5 py-2 justify-center" onClick={() => alert('Secure mock checkout processed successfully!')}>
              <CreditCard size={14} weight="bold" className="mr-1.5" /> {tr(lang, "Authorized Sign-off", "تأیید نهایی")}
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Billing Cycle Toggle */}
          <div className="flex flex-col items-center gap-3">
            <div className="text-center">
              <h3 className="text-xs sm:text-base font-bold font-[family-name:var(--font-heading)] leading-tight">{tr(lang, "Predictable, Human Pricing", "قیمت‌گذاری شفاف و انسانی")}</h3>
              <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">{tr(lang, "Select the design track that fits your operational bounds.", "مسیر طراحی متناسب با نیاز عملیاتی خود را انتخاب کنید.")}</p>
            </div>
            
            <div className="inline-flex p-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-sm)]">
              <button 
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1 text-[9px] font-bold uppercase tracking-wider rounded-[calc(var(--radius-sm)-2px)] cursor-pointer transition-colors ${billingCycle === 'monthly' ? 'bg-[var(--color-primary)] text-[var(--color-bg)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              >
                {tr(lang, "Monthly Track", "مسیر ماهانه")}
              </button>
              <button 
                onClick={() => setBillingCycle('annual')}
                className={`px-3 py-1 text-[9px] font-bold uppercase tracking-wider rounded-[calc(var(--radius-sm)-2px)] cursor-pointer transition-colors ${billingCycle === 'annual' ? 'bg-[var(--color-primary)] text-[var(--color-bg)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              >
                {tr(lang, "Annual (20% off)", "سالانه (۲۰٪ تخفیف)")}
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
                        <span className="text-[9px] text-[var(--text-secondary)] font-normal">{tr(lang, "/mo", "/ماه")}</span>
                      </div>
                    </div>
                    {plan.isPopular && <Badge variant="accent" className="text-[8px] py-0 px-1">{tr(lang, "Popular", "محبوب")}</Badge>}
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
                  {tr(lang, "Acquire License", "دریافت لایسنس")}
                </Button>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// 7. TYPOGRAPHY / FONT SPECIMEN
export const TypographySpecimen: React.FC<ShowcaseProps> = ({ tokens, lang = 'en' }) => {
  const t = tokens.typography;
  const base = t.sizeBase || 16;
  const ratio = t.scaleRatio || 1.2;
  const round = (n: number) => Math.round(n * 10) / 10;

  // Type scale derived from base * ratio^step
  const scale = [
    { label: tr(lang, 'Display', 'نمایش'), step: 5 },
    { label: 'H1', step: 4 },
    { label: 'H2', step: 3 },
    { label: 'H3', step: 2 },
    { label: 'H4', step: 1 },
    { label: tr(lang, 'Body', 'متن'), step: 0 },
    { label: tr(lang, 'Small', 'کوچک'), step: -1 },
  ].map(s => ({ ...s, size: round(base * Math.pow(ratio, s.step)) }));

  const headingWeights = ['400', '500', '600', '700', '800'];
  const bodyWeights = ['300', '400', '500', '600'];
  const pangram = tr(lang, 'The quick brown fox jumps over the lazy dog 0123456789', 'کشاورز با شتاب، ثروتمند ظفرمند جاودان شد ۰۱۲۳۴۵۶۷۸۹');

  const sectionLabel = 'text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-secondary)] font-[family-name:var(--font-mono)] mb-4';
  const card = 'rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5';

  return (
    <div className="w-full h-full overflow-y-auto bg-[var(--color-bg)] text-[var(--text-primary)] font-[family-name:var(--font-body)] transition-colors text-start p-6 sm:p-8 flex flex-col gap-10">
      {/* Header */}
      <header className="flex flex-col gap-1">
        <h1 className="font-bold font-[family-name:var(--font-heading)] tracking-[var(--letter-spacing-heading)] leading-[var(--line-height-heading)] text-3xl">
          {tr(lang, "Typography Specimen", "نمونه تایپوگرافی")}
        </h1>
        <p className="text-[var(--text-secondary)] text-sm max-w-[60ch]">
          {tr(lang, "Live type scale, families, and weights for", "مقیاس، خانواده‌ها و وزن‌های زنده برای")} {tokens.appName} - {tr(lang, "base", "پایه")} {base}px، {tr(lang, "ratio", "نسبت")} {ratio}.
        </p>
      </header>

      {/* Type scale */}
      <section>
        <div className={sectionLabel}>{tr(lang, "Type Scale", "مقیاس اندازه")}</div>
        <div className="flex flex-col divide-y divide-[var(--color-border)]">
          {scale.map(s => (
            <div key={s.label} className="flex items-baseline gap-4 py-3">
              <span className="w-16 shrink-0 text-[var(--text-secondary)] text-[11px] font-[family-name:var(--font-mono)] uppercase tracking-wider">{s.label}</span>
              <span className="w-14 shrink-0 text-[var(--text-secondary)] text-[11px] font-[family-name:var(--font-mono)]">{s.size}px</span>
              <span
                className="font-[family-name:var(--font-heading)] tracking-[var(--letter-spacing-heading)] leading-[var(--line-height-heading)] truncate"
                style={{ fontSize: `${s.size}px`, fontWeight: t.weightHeading as any }}
              >
                {tokens.appName} design
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Families */}
      <section>
        <div className={sectionLabel}>{tr(lang, "Font Families", "خانواده‌های فونت")}</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { role: tr(lang, 'Heading', 'عنوان'), name: t.fontHeading, varName: 'var(--font-heading)' },
            { role: tr(lang, 'Body', 'متن'), name: t.fontBody, varName: 'var(--font-body)' },
            { role: tr(lang, 'Mono', 'مونو'), name: t.fontMono, varName: 'var(--font-mono)' },
          ].map(fam => (
            <div key={fam.role} className={card}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] font-[family-name:var(--font-mono)]">{fam.role}</span>
                <span className="text-[11px] font-bold text-[var(--color-accent)]">{fam.name}</span>
              </div>
              <div style={{ fontFamily: fam.varName }}>
                <div className="text-3xl leading-tight mb-2">Ag</div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed break-words">{pangram}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Weights */}
      <section>
        <div className={sectionLabel}>{tr(lang, "Weights", "وزن‌ها")}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={card}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] font-[family-name:var(--font-mono)]">{tr(lang, "Heading", "عنوان")} - {t.fontHeading}</span>
            <div className="mt-3 flex flex-col gap-2">
              {headingWeights.map(w => (
                <div key={w} className="flex items-baseline gap-3">
                  <span className="w-8 shrink-0 text-[10px] text-[var(--text-secondary)] font-[family-name:var(--font-mono)]">{w}</span>
                  <span className="text-lg font-[family-name:var(--font-heading)] truncate" style={{ fontWeight: w as any }}>{tr(lang, "Beautiful interfaces", "رابط‌های زیبا")}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={card}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] font-[family-name:var(--font-mono)]">{tr(lang, "Body", "متن")} - {t.fontBody}</span>
            <div className="mt-3 flex flex-col gap-2">
              {bodyWeights.map(w => (
                <div key={w} className="flex items-baseline gap-3">
                  <span className="w-8 shrink-0 text-[10px] text-[var(--text-secondary)] font-[family-name:var(--font-mono)]">{w}</span>
                  <span className="text-lg font-[family-name:var(--font-body)] truncate" style={{ fontWeight: w as any }}>{tr(lang, "Beautiful interfaces", "رابط‌های زیبا")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Paragraph specimen */}
      <section>
        <div className={sectionLabel}>{tr(lang, "Paragraph", "پاراگراف")} - line-height {t.lineHeightBody}, tracking {t.letterSpacingBody}</div>
        <p
          className="max-w-[65ch] text-[var(--text-primary)]"
          style={{
            fontSize: `${base}px`,
            lineHeight: t.lineHeightBody as any,
            letterSpacing: t.letterSpacingBody,
          }}
        >
          {tr(lang, "A design system is a single cascading source of truth. Every color, type ramp, radius, and motion curve is defined once and reused everywhere, so the product stays coherent as it grows. This paragraph renders in", "یک سیستم طراحی، یک منبع واحد و آبشاری از حقیقت است. هر رنگ، مقیاس تایپ، گردی گوشه و منحنی حرکت یک‌بار تعریف و همه‌جا استفاده می‌شود تا محصول با رشد خود منسجم بماند. این پاراگراف با فونت")} {t.fontBody} {tr(lang, "at", "در اندازه")} {base}px {tr(lang, "to show real reading rhythm.", "برای نمایش ریتم واقعی خواندن رندر می‌شود.")}
        </p>
      </section>
    </div>
  );
};
