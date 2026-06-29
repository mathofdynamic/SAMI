import React, { useState, useRef, useEffect, useCallback, Component } from 'react';
import { DesignTokens } from '../types';
import { tokensToCssVars } from '../utils';
import { t, tr, Lang } from '../i18n';
import {
  LandingShowcase,
  DashboardShowcase,
  AuthShowcase,
  SettingsShowcase,
  ListDetailShowcase,
  PricingShowcase,
  TypographySpecimen
} from './ShowcasePages';
import { 
  MagnifyingGlassPlus, 
  MagnifyingGlassMinus, 
  ArrowsOut, 
  Monitor, 
  DeviceTablet, 
  Phone, 
  Sun, 
  Moon, 
  FrameCorners, 
  HandGrabbing,
  CursorClick,
  Eye,
  ArrowClockwise,
  Trash,
  Sparkle
} from '@phosphor-icons/react';
import { DynamicPage } from './DynamicPage';
import { AiWorking } from './AiWorking';
import { useAi } from '../useAi';
import { UserPage } from '../useUserPages';
import { PageSpec } from '../pageSpec';

interface CanvasProps {
  tokens: DesignTokens;
  globalMode: 'light' | 'dark';
  setGlobalMode: (mode: 'light' | 'dark') => void;
  activePresetId?: string | null;
  lang: Lang;
  userPages: UserPage[];
  addUserPage: (spec: PageSpec) => string;
  removeUserPage: (id: string) => void;
}

interface PageConfig {
  id: string;
  name: string;
  userId?: string;
  component: React.FC<{ tokens: DesignTokens; mode: 'light' | 'dark'; breakpoint?: 'desktop' | 'tablet' | 'mobile'; lang?: Lang }>;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  pageName: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Simple Error Boundary to isolate crashes in specific showcase page frames
class CanvasErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Error rendering page ${this.props.pageName}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-rose-950/80 text-rose-200 border border-rose-800 rounded-xl h-full flex flex-col items-center justify-center text-center gap-2 overflow-auto font-sans">
          <span className="font-bold text-xs uppercase font-mono tracking-wider text-rose-300">Render Crash in Frame</span>
          <span className="text-sm font-bold">{this.props.pageName}</span>
          <p className="text-[10px] max-w-md font-mono bg-black/40 p-2.5 rounded border border-rose-900/40 text-rose-300 select-all whitespace-pre-wrap">{this.state.error?.message}</p>
          <p className="text-[9px] text-rose-400 mt-1 font-mono">Check if any expected design token fields are missing or corrupted.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export const Canvas: React.FC<CanvasProps> = ({ tokens, globalMode, setGlobalMode, activePresetId, lang, userPages, addUserPage, removeUserPage }) => {
  const isRtl = lang === 'fa';
  // Canvas View State
  const [zoom, setZoom] = useState(0.6);
  const [pan, setPan] = useState({ x: 30, y: 50 });
  const [breakpoint, setBreakpoint] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [interactionMode, setInteractionMode] = useState<'pan' | 'inspect'>('pan');
  const [focusedPageId, setFocusedPageId] = useState<string | null>(null);
  // A page must be selected (clicked) before its content scrolls; otherwise the
  // wheel zooms the canvas. This stops the "scroll zooms AND scrolls page" conflict.
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);

  // Individual page mode overrides (defaults to globalMode if not overridden)
  const [pageModes, setPageModes] = useState<Record<string, 'light' | 'dark'>>({});

  // AI page generation
  const ai = useAi();
  const [aiPageOpen, setAiPageOpen] = useState(false);
  const [aiPageText, setAiPageText] = useState('');
  const createAiPage = async () => {
    if (!aiPageText.trim()) return;
    const r = await ai.run('page', { description: aiPageText, presetId: activePresetId });
    if (r?.spec) {
      addUserPage(r.spec);
      setAiPageText('');
      setAiPageOpen(false);
    }
  };

  const canvasRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Live mirrors of zoom/pan/selection for the native (non-passive) wheel
  // listener, which is attached once and would otherwise capture stale values.
  const zoomRef = useRef(zoom);
  const panRef = useRef(pan);
  const selectedRef = useRef(selectedPageId);
  zoomRef.current = zoom;
  panRef.current = pan;
  selectedRef.current = selectedPageId;

  // Keep at least this many pixels of the artboard inside the viewport so the
  // frames can never be panned/flicked completely off-screen (the "empty canvas" bug).
  const PAN_MARGIN = 180;

  // Clamp a pan offset so the (scaled) content always stays partially visible.
  const clampPan = useCallback((p: { x: number; y: number }, z: number) => {
    const vp = canvasRef.current;
    const content = contentRef.current;
    if (!vp || !content) return p;
    const vw = vp.clientWidth;
    const vh = vp.clientHeight;
    const cw = content.offsetWidth * z;
    const ch = content.offsetHeight * z;
    // If layout hasn't settled (zero-sized viewport/content), don't move anything.
    if (vw <= 0 || vh <= 0 || cw <= 0 || ch <= 0) return p;
    const clamp = (v: number, lo: number, hi: number) =>
      lo > hi ? lo : Math.max(lo, Math.min(hi, v));
    return {
      x: clamp(p.x, PAN_MARGIN - cw, vw - PAN_MARGIN),
      y: clamp(p.y, PAN_MARGIN - ch, vh - PAN_MARGIN),
    };
  }, []);

  const builtinPages: PageConfig[] = [
    { id: 'landing', name: tr(lang, '1. Landing / Marketing Hub', '۱. فرود / بازاریابی'), component: LandingShowcase },
    { id: 'dashboard', name: tr(lang, '2. Telemetry Dashboard', '۲. داشبورد تله‌متری'), component: DashboardShowcase },
    { id: 'auth', name: tr(lang, '3. Authentication Screen', '۳. صفحه احراز هویت'), component: AuthShowcase },
    { id: 'settings', name: tr(lang, '4. Profiles & Settings Matrix', '۴. پروفایل و تنظیمات'), component: SettingsShowcase },
    { id: 'listdetail', name: tr(lang, '5. Asset Feed (List + Detail)', '۵. فهرست دارایی‌ها'), component: ListDetailShowcase },
    { id: 'pricing', name: tr(lang, '6. Pricing & Secure Checkout', '۶. قیمت‌گذاری و پرداخت'), component: PricingShowcase },
    { id: 'typography', name: tr(lang, '7. Typography Specimen', '۷. نمونه تایپوگرافی'), component: TypographySpecimen },
  ];
  // AI-generated pages render via the data-driven DynamicPage renderer.
  const dynamicPages: PageConfig[] = userPages.map((up, idx) => ({
    id: 'user-' + up.id,
    name: `${builtinPages.length + idx + 1}. ${up.name}`,
    userId: up.id,
    component: (props) => <DynamicPage spec={up.spec} {...props} />,
  }));
  const pages: PageConfig[] = [...builtinPages, ...dynamicPages];

  // Map breakpoint to pixel widths
  const getBreakpointWidth = () => {
    switch (breakpoint) {
      case 'tablet': return '720px';
      case 'mobile': return '390px';
      default: return '1024px';
    }
  };

  // Dragging event handlers for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (interactionMode !== 'pan') return;
    // Don't drag if clicking inside page containers or buttons
    const target = e.target as HTMLElement;
    if (target.closest('.showcase-page-frame') || target.closest('button') || target.closest('input')) return;

    isDragging.current = true;
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    setPan(clampPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    }, zoom));
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Wheel handling lives on a native, non-passive listener (see effect below) so
  // we can preventDefault() — required to (a) zoom toward the cursor and (b) stop
  // the browser from also scrolling a hovered frame when no page is selected.
  const handleCanvasClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.showcase-page-frame')) setSelectedPageId(null);
  };

  // Attach the wheel listener once; it reads live state via refs.
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      // When the pointer is over the SELECTED frame, let the browser scroll the
      // page natively (its inner overflow container) and never zoom. Scroll
      // containers can be nested (the frame body OR the page's own scroll area),
      // so we hand off entirely rather than trying to detect a single scroller.
      const target = e.target as HTMLElement;
      const frame = target.closest('[data-page-id]') as HTMLElement | null;
      if (frame && frame.dataset.pageId === selectedRef.current) {
        return;
      }

      // Otherwise: zoom the canvas, anchored at the cursor position.
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const z = zoomRef.current;
      const p = panRef.current;
      const next = Math.min(1.5, Math.max(0.25, +(z + (e.deltaY < 0 ? 0.08 : -0.08)).toFixed(2)));
      if (next === z) return;
      // World point under the cursor before zoom (content is origin-top-left,
      // screen = pan + world * zoom), kept fixed after zoom.
      const wx = (mx - p.x) / z;
      const wy = (my - p.y) / z;
      setZoom(next);
      setPan(clampPan({ x: mx - wx * next, y: my - wy * next }, next));
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [clampPan]);

  // Re-clamp the pan whenever the scale, focus, or breakpoint changes the content size.
  useEffect(() => {
    setPan(prev => clampPan(prev, zoom));
  }, [zoom, focusedPageId, breakpoint, clampPan]);

  // Zoom controls
  const handleZoomIn = () => setZoom(prev => Math.min(1.5, prev + 0.1));
  const handleZoomMinus = () => setZoom(prev => Math.max(0.25, prev - 0.1));
  const handleResetView = () => {
    setZoom(0.6);
    setPan({ x: 30, y: 50 });
    setFocusedPageId(null);
  };

  // Focus single page and zoom in
  const handleFocusPage = (pageId: string) => {
    if (focusedPageId === pageId) {
      setFocusedPageId(null);
      setZoom(0.6);
      setPan({ x: 30, y: 50 });
    } else {
      setFocusedPageId(pageId);
      setZoom(0.85);
      setPan({ x: 100, y: -20 });
    }
  };

  const togglePageMode = (pageId: string) => {
    const currentMode = pageModes[pageId] || globalMode;
    setPageModes(prev => ({
      ...prev,
      [pageId]: currentMode === 'light' ? 'dark' : 'light'
    }));
  };

  // Synchronize state when globalMode changes
  useEffect(() => {
    // Reset individual page modes to global when toggling global mode
    setPageModes({});
  }, [globalMode]);

  return (
    <div className="w-full h-full min-h-0 flex flex-col bg-[var(--ui-surface)] overflow-hidden relative select-none">
      
      {/* Canvas Controls Sub-Navbar */}
      <div className="px-4 py-2.5 bg-[var(--ui-bg)] border-b border-[var(--ui-border)] flex flex-wrap items-center justify-between gap-4 z-20">
        
        {/* Left Side: Drag Modes & View resets */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded p-0.5 bg-[var(--ui-surface)] border border-[var(--ui-border)]">
            <button
              onClick={() => setInteractionMode('pan')}
              className={`p-1.5 rounded text-xs font-semibold cursor-pointer flex items-center gap-1 ${interactionMode === 'pan' ? 'bg-[var(--ui-surface2)] text-[var(--ui-fg)]' : 'text-[var(--ui-muted)] hover:text-[var(--ui-fg)]'}`}
              title={tr(lang, "Pan Space Mode", "حالت جابجایی")}
            >
              <HandGrabbing size={13} />
              <span className="hidden sm:inline text-[10px]">{t('canvas.pan', lang)}</span>
            </button>
            <button
              onClick={() => {
                setInteractionMode('inspect');
                setFocusedPageId(null);
              }}
              className={`p-1.5 rounded text-xs font-semibold cursor-pointer flex items-center gap-1 ${interactionMode === 'inspect' ? 'bg-[var(--ui-surface2)] text-[var(--ui-fg)]' : 'text-[var(--ui-muted)] hover:text-[var(--ui-fg)]'}`}
              title={tr(lang, "Inspect Canvas Components", "بازرسی اجزای بوم")}
            >
              <CursorClick size={13} />
              <span className="hidden sm:inline text-[10px]">{t('canvas.inspect', lang)}</span>
            </button>
          </div>

          <div className="h-4 w-px bg-[var(--ui-surface2)]" />

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-[var(--ui-surface)] px-2 py-1 rounded border border-[var(--ui-border)] text-[var(--ui-muted)] text-[10px] font-mono">
            <button onClick={handleZoomMinus} className="hover:text-[var(--ui-fg)] p-0.5 cursor-pointer">
              <MagnifyingGlassMinus size={13} />
            </button>
            <span className="w-10 text-center font-bold text-[var(--ui-fg)]">{Math.round(zoom * 100)}%</span>
            <button onClick={handleZoomIn} className="hover:text-[var(--ui-fg)] p-0.5 cursor-pointer">
              <MagnifyingGlassPlus size={13} />
            </button>
          </div>

          <button
            onClick={handleResetView}
            className="p-1.5 rounded bg-[var(--ui-surface)] border border-[var(--ui-border)] hover:bg-[var(--ui-surface2)] text-[var(--ui-muted)] cursor-pointer"
            title={tr(lang, "Recenter and Fit View", "بازنشانی و تنظیم نما")}
          >
            <ArrowsOut size={13} />
          </button>

          {/* AI: generate a brand-new page */}
          <button
            onClick={() => setAiPageOpen(true)}
            className="p-1.5 rounded bg-[var(--ui-fg)] text-[var(--ui-bg)] hover:opacity-90 cursor-pointer flex items-center gap-1 text-[10px] font-bold"
            title={t('ai.newPage', lang)}
          >
            <Sparkle size={13} weight="fill" />
            <span className="hidden sm:inline">{t('ai.newPage', lang)}</span>
          </button>
        </div>

        {/* Center: Responsive Breakpoint selections */}
        <div className="flex items-center gap-1 bg-[var(--ui-surface)] p-0.5 rounded border border-[var(--ui-border)]">
          <button
            onClick={() => setBreakpoint('desktop')}
            className={`p-1.5 rounded cursor-pointer flex items-center gap-1 ${breakpoint === 'desktop' ? 'bg-[var(--ui-surface2)] text-[var(--ui-fg)]' : 'text-[var(--ui-muted)] hover:text-[var(--ui-fg)]'}`}
            title={tr(lang, "Desktop Breakpoint: 1024px", "نقطه شکست دسکتاپ: ۱۰۲۴px")}
          >
            <Monitor size={14} />
            <span className="text-[9px] uppercase font-bold hidden md:inline">{t('canvas.desktop', lang)}</span>
          </button>
          <button
            onClick={() => setBreakpoint('tablet')}
            className={`p-1.5 rounded cursor-pointer flex items-center gap-1 ${breakpoint === 'tablet' ? 'bg-[var(--ui-surface2)] text-[var(--ui-fg)]' : 'text-[var(--ui-muted)] hover:text-[var(--ui-fg)]'}`}
            title={tr(lang, "Tablet Breakpoint: 720px", "نقطه شکست تبلت: ۷۲۰px")}
          >
            <DeviceTablet size={14} />
            <span className="text-[9px] uppercase font-bold hidden md:inline">{t('canvas.tablet', lang)}</span>
          </button>
          <button
            onClick={() => setBreakpoint('mobile')}
            className={`p-1.5 rounded cursor-pointer flex items-center gap-1 ${breakpoint === 'mobile' ? 'bg-[var(--ui-surface2)] text-[var(--ui-fg)]' : 'text-[var(--ui-muted)] hover:text-[var(--ui-fg)]'}`}
            title={tr(lang, "Mobile Breakpoint: 390px", "نقطه شکست موبایل: ۳۹۰px")}
          >
            <Phone size={14} />
            <span className="text-[9px] uppercase font-bold hidden md:inline">{t('canvas.mobile', lang)}</span>
          </button>
        </div>

        {/* Hint: select a frame to scroll it; otherwise the wheel zooms. */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-[var(--ui-muted)] font-mono hidden lg:inline">
            {selectedPageId ? t('canvas.scrollHint', lang) : t('canvas.zoomHint', lang)}
          </span>
        </div>
      </div>

      {/* Infinite Canvas Window Space */}
      <div
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
        className={`flex-1 min-h-0 relative overflow-hidden canvas-dots ${interactionMode === 'pan' ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
      >
        {/* Dynamic style tag for Google Fonts loading */}
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=${(tokens?.typography?.fontHeading || 'Outfit').replace(/ /g, '+')}:wght@400;500;600;700;800&family=${(tokens?.typography?.fontBody || 'Plus Jakarta Sans').replace(/ /g, '+')}:wght@300;400;500;600&family=${(tokens?.typography?.fontMono || 'JetBrains Mono').replace(/ /g, '+')}:wght@400;500&display=swap');
          `}
        </style>

        {/* Container that pans and zooms */}
        <div
          ref={contentRef}
          className="absolute top-0 left-0 origin-top-left transition-transform duration-[40ms]"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
        >
          {/* Layout wrapping the 6 pages */}
          <div 
            className={`grid gap-16 p-10 w-max ${focusedPageId ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}
          >
            {pages
              .filter(p => !focusedPageId || p.id === focusedPageId)
              .map((page) => {
                const activePageMode = pageModes[page.id] || globalMode;
                const cssVars = tokensToCssVars(tokens, activePageMode, isRtl);
                const PageComponent = page.component;

                return (
                  <div
                    key={page.id}
                    data-page-id={page.id}
                    className={`showcase-page-frame flex flex-col gap-2.5 transition-all duration-300 rounded-xl p-1 ${selectedPageId === page.id ? 'ring-2 ring-[var(--ui-fg)]' : ''} ${interactionMode === 'inspect' ? 'hover:ring-2 hover:ring-[var(--ui-fg)] cursor-help' : ''}`}
                    style={{
                      width: getBreakpointWidth(),
                      // Local scope variables
                      ...cssVars,
                    }}
                    onClick={() => {
                      setSelectedPageId(page.id);
                      if (interactionMode === 'inspect') {
                        alert(`Inspecting ${page.name}.\nActive tokens:\n- Colors mode: ${activePageMode}\n- Heading: ${tokens.typography.fontHeading}\n- Radius: ${tokens.shape.radiusBase}px\n- Button archetype: ${tokens.components.buttonStyle}`);
                      }
                    }}
                  >
                    {/* Operating System Chrome Header */}
                    <div className="flex items-center justify-between px-3.5 py-2.5 bg-[var(--ui-bg)] border border-[var(--ui-border)] rounded-t-xl text-[var(--ui-muted)] text-xs shadow-md">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[var(--ui-surface2)] hover:bg-rose-500/80 cursor-pointer transition-colors" onClick={() => handleFocusPage(page.id)} title={tr(lang, "Minimize/Recenter", "کوچک‌نمایی/بازنشانی")} />
                        <span className="w-2.5 h-2.5 rounded-full bg-[var(--ui-surface2)]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[var(--ui-surface2)]" />
                      </div>
                      
                      {/* Page Name (+ AI tag for generated pages) */}
                      <div className="flex items-center gap-1.5 min-w-0">
                        {page.userId && (
                          <span
                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[var(--ui-fg)] text-[var(--ui-bg)] text-[8px] font-bold uppercase tracking-wider shrink-0"
                            title={tr(lang, 'AI generated', 'تولیدشده با هوش مصنوعی')}
                          >
                            <Sparkle size={9} weight="fill" /> {tr(lang, 'AI', 'هوش')}
                          </span>
                        )}
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--ui-fg)] truncate">
                          {page.name}
                        </span>
                      </div>

                      {/* Frame actions: Focus & Light/dark switch */}
                      <div className="flex items-center gap-2">
                        {/* Breakpoint size indicator */}
                        <span className="text-[9px] font-mono bg-[var(--ui-surface)] border border-[var(--ui-border)] px-1.5 py-0.5 rounded text-[var(--ui-muted)] font-bold uppercase">
                          {getBreakpointWidth()}
                        </span>

                        {/* Delete (AI-generated user pages only) */}
                        {page.userId && (
                          <button
                            onClick={(e) => { e.stopPropagation(); removeUserPage(page.userId!); }}
                            className="p-1 rounded bg-[var(--ui-surface)] border border-[var(--ui-border)] text-[var(--ui-muted)] hover:text-rose-400 cursor-pointer transition-colors"
                            title={tr(lang, "Delete page", "حذف صفحه")}
                          >
                            <Trash size={12} />
                          </button>
                        )}

                        {/* Local light/dark mode trigger */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePageMode(page.id);
                          }}
                          className="p-1 rounded bg-[var(--ui-surface)] border border-[var(--ui-border)] text-[var(--ui-muted)] hover:text-[var(--ui-fg)] cursor-pointer transition-colors"
                          title={tr(lang, "Override Frame Theme Mode", "تغییر حالت تم قاب")}
                        >
                          {activePageMode === 'light' ? <Sun size={12} /> : <Moon size={12} />}
                        </button>

                        {/* Toggle single page view focus */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFocusPage(page.id);
                          }}
                          className={`p-1 rounded border cursor-pointer transition-colors ${focusedPageId === page.id ? 'bg-[var(--ui-surface2)] border-[var(--ui-fg)] text-[var(--ui-fg)]' : 'bg-[var(--ui-surface)] border-[var(--ui-border)] text-[var(--ui-muted)] hover:text-[var(--ui-fg)]'}`}
                          title={focusedPageId === page.id ? tr(lang, 'Recenter Grid View', 'بازنشانی نمای شبکه') : tr(lang, 'Focus and Scale Window', 'تمرکز و بزرگ‌نمایی پنجره')}
                        >
                          <FrameCorners size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Rendered Showcase Page Content (using CSS Variables inline scope!) */}
                    {/* key changes only on theme/preset/mode swap -> replays themeSwap animation (not on slider drags) */}
                    <div
                      key={`${page.id}-${activePageMode}-${activePresetId ?? 'custom'}-${lang}`}
                      dir={isRtl ? 'rtl' : 'ltr'}
                      data-frame-scroll="true"
                      className={`border-x border-b border-[var(--color-border)] rounded-b-xl ${selectedPageId === page.id ? 'overflow-y-auto' : 'overflow-hidden'} shadow-[var(--shadow-ambient)] relative transition-all h-[720px]`}
                      style={{
                        backgroundColor: 'var(--color-bg)',
                        // --font-body already carries the Vazirmatn fallback in FA (see tokensToCssVars rtl).
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--font-size-base)',
                        animation: 'themeSwap var(--motion-normal, 280ms) var(--motion-easing, ease)',
                      }}
                    >
                      <CanvasErrorBoundary pageName={page.name}>
                        <PageComponent tokens={tokens} mode={activePageMode} breakpoint={breakpoint} lang={lang} />
                      </CanvasErrorBoundary>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* AI: generate a new page from a description */}
      {aiPageOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn" onClick={() => setAiPageOpen(false)}>
          <div className="bg-[var(--ui-bg)] text-[var(--ui-fg)] border border-[var(--ui-border)] rounded-xl w-full max-w-md p-5 flex flex-col gap-3 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <Sparkle size={16} weight="fill" className="text-[var(--ui-fg)]" />
              <span className="text-sm font-bold">{t('ai.newPage', lang)}</span>
            </div>
            <textarea
              value={aiPageText}
              onChange={(e) => setAiPageText(e.target.value)}
              rows={3}
              autoFocus
              placeholder={t('ai.pagePlaceholder', lang)}
              className="w-full px-3 py-2 text-xs bg-[var(--ui-surface)] border border-[var(--ui-border)] rounded outline-none text-[var(--ui-fg)] resize-none focus:border-[var(--ui-fg)]"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setAiPageOpen(false)} className="px-3 py-1.5 rounded border border-[var(--ui-border)] text-[var(--ui-muted)] hover:text-[var(--ui-fg)] text-xs cursor-pointer">{t('ai.cancel', lang)}</button>
              <button
                onClick={createAiPage}
                disabled={ai.busy || !aiPageText.trim()}
                className="px-3 py-1.5 rounded bg-[var(--ui-fg)] text-[var(--ui-bg)] text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:opacity-90 disabled:opacity-40 disabled:pointer-events-none"
              >
                <Sparkle size={13} weight="fill" /> {t('ai.create', lang)}
              </button>
            </div>
            {ai.error && <p className="text-[10px] text-rose-400">{t('ai.error', lang)}</p>}
          </div>
        </div>
      )}

      <AiWorking active={ai.busy} lang={lang} label={t('ai.newPage', lang)} />
    </div>
  );
};
