import React, { useState, useRef, useEffect, Component } from 'react';
import { DesignTokens } from '../types';
import { tokensToCssVars } from '../utils';
import { 
  LandingShowcase, 
  DashboardShowcase, 
  AuthShowcase, 
  SettingsShowcase, 
  ListDetailShowcase, 
  PricingShowcase 
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
  ArrowClockwise 
} from '@phosphor-icons/react';

interface CanvasProps {
  tokens: DesignTokens;
}

interface PageConfig {
  id: string;
  name: string;
  component: React.FC<{ tokens: DesignTokens; mode: 'light' | 'dark'; breakpoint?: 'desktop' | 'tablet' | 'mobile' }>;
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

export const Canvas: React.FC<CanvasProps> = ({ tokens }) => {
  // Canvas View State
  const [zoom, setZoom] = useState(0.6);
  const [pan, setPan] = useState({ x: 30, y: 50 });
  const [globalMode, setGlobalMode] = useState<'light' | 'dark'>('light');
  const [breakpoint, setBreakpoint] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [interactionMode, setInteractionMode] = useState<'pan' | 'inspect'>('pan');
  const [focusedPageId, setFocusedPageId] = useState<string | null>(null);

  // Individual page mode overrides (defaults to globalMode if not overridden)
  const [pageModes, setPageModes] = useState<Record<string, 'light' | 'dark'>>({});

  const canvasRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const pages: PageConfig[] = [
    { id: 'landing', name: '1. Landing / Marketing Hub', component: LandingShowcase },
    { id: 'dashboard', name: '2. Telemetry Dashboard', component: DashboardShowcase },
    { id: 'auth', name: '3. Authentication Screen', component: AuthShowcase },
    { id: 'settings', name: '4. Profiles & Settings Matrix', component: SettingsShowcase },
    { id: 'listdetail', name: '5. Asset Feed (List + Detail)', component: ListDetailShowcase },
    { id: 'pricing', name: '6. Pricing & Secure Checkout', component: PricingShowcase },
  ];

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
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

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
    <div className="w-full h-full flex flex-col bg-zinc-900 overflow-hidden relative select-none">
      
      {/* Canvas Controls Sub-Navbar */}
      <div className="px-4 py-2.5 bg-zinc-950 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-4 z-20">
        
        {/* Left Side: Drag Modes & View resets */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded p-0.5 bg-zinc-900 border border-zinc-800">
            <button
              onClick={() => setInteractionMode('pan')}
              className={`p-1.5 rounded text-xs font-semibold cursor-pointer flex items-center gap-1 ${interactionMode === 'pan' ? 'bg-zinc-800 text-teal-400' : 'text-zinc-400 hover:text-zinc-200'}`}
              title="Pan Space Mode"
            >
              <HandGrabbing size={13} />
              <span className="hidden sm:inline text-[10px]">Pan Canvas</span>
            </button>
            <button
              onClick={() => {
                setInteractionMode('inspect');
                setFocusedPageId(null);
              }}
              className={`p-1.5 rounded text-xs font-semibold cursor-pointer flex items-center gap-1 ${interactionMode === 'inspect' ? 'bg-zinc-800 text-teal-400' : 'text-zinc-400 hover:text-zinc-200'}`}
              title="Inspect Canvas Components"
            >
              <CursorClick size={13} />
              <span className="hidden sm:inline text-[10px]">Inspect UI</span>
            </button>
          </div>

          <div className="h-4 w-px bg-zinc-800" />

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-zinc-900 px-2 py-1 rounded border border-zinc-800 text-zinc-400 text-[10px] font-mono">
            <button onClick={handleZoomMinus} className="hover:text-zinc-200 p-0.5 cursor-pointer">
              <MagnifyingGlassMinus size={13} />
            </button>
            <span className="w-10 text-center font-bold text-zinc-300">{Math.round(zoom * 100)}%</span>
            <button onClick={handleZoomIn} className="hover:text-zinc-200 p-0.5 cursor-pointer">
              <MagnifyingGlassPlus size={13} />
            </button>
          </div>

          <button
            onClick={handleResetView}
            className="p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 cursor-pointer"
            title="Recenter and Fit View"
          >
            <ArrowsOut size={13} />
          </button>
        </div>

        {/* Center: Responsive Breakpoint selections */}
        <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded border border-zinc-800">
          <button
            onClick={() => setBreakpoint('desktop')}
            className={`p-1.5 rounded cursor-pointer flex items-center gap-1 ${breakpoint === 'desktop' ? 'bg-zinc-800 text-teal-400' : 'text-zinc-500 hover:text-zinc-300'}`}
            title="Desktop Breakpoint: 1024px"
          >
            <Monitor size={14} />
            <span className="text-[9px] uppercase font-bold hidden md:inline">Desktop</span>
          </button>
          <button
            onClick={() => setBreakpoint('tablet')}
            className={`p-1.5 rounded cursor-pointer flex items-center gap-1 ${breakpoint === 'tablet' ? 'bg-zinc-800 text-teal-400' : 'text-zinc-500 hover:text-zinc-300'}`}
            title="Tablet Breakpoint: 720px"
          >
            <DeviceTablet size={14} />
            <span className="text-[9px] uppercase font-bold hidden md:inline">Tablet</span>
          </button>
          <button
            onClick={() => setBreakpoint('mobile')}
            className={`p-1.5 rounded cursor-pointer flex items-center gap-1 ${breakpoint === 'mobile' ? 'bg-zinc-800 text-teal-400' : 'text-zinc-500 hover:text-zinc-300'}`}
            title="Mobile Breakpoint: 390px"
          >
            <Phone size={14} />
            <span className="text-[9px] uppercase font-bold hidden md:inline">Mobile</span>
          </button>
        </div>

        {/* Right Side: Global Mode Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-zinc-500 font-mono hidden lg:inline">GLOBAL CASCADE</span>
          <div className="inline-flex rounded p-0.5 bg-zinc-900 border border-zinc-800">
            <button
              onClick={() => setGlobalMode('light')}
              className={`p-1.5 rounded cursor-pointer flex items-center gap-1 ${globalMode === 'light' ? 'bg-zinc-800 text-teal-400' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Sun size={13} weight="fill" />
              <span className="text-[9px] uppercase font-bold hidden sm:inline">Light</span>
            </button>
            <button
              onClick={() => setGlobalMode('dark')}
              className={`p-1.5 rounded cursor-pointer flex items-center gap-1 ${globalMode === 'dark' ? 'bg-zinc-800 text-teal-400' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Moon size={13} weight="fill" />
              <span className="text-[9px] uppercase font-bold hidden sm:inline">Dark</span>
            </button>
          </div>
        </div>
      </div>

      {/* Infinite Canvas Window Space */}
      <div
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`flex-1 relative overflow-hidden bg-zinc-900 ${interactionMode === 'pan' ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
      >
        {/* Dynamic style tag for Google Fonts loading */}
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=${(tokens?.typography?.fontHeading || 'Outfit').replace(/ /g, '+')}:wght@400;500;600;700;800&family=${(tokens?.typography?.fontBody || 'Plus Jakarta Sans').replace(/ /g, '+')}:wght@300;400;500;600&family=${(tokens?.typography?.fontMono || 'JetBrains Mono').replace(/ /g, '+')}:wght@400;500&display=swap');
          `}
        </style>

        {/* Container that pans and zooms */}
        <div
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
                const cssVars = tokensToCssVars(tokens, activePageMode);
                const PageComponent = page.component;

                return (
                  <div
                    key={page.id}
                    className={`showcase-page-frame flex flex-col gap-2.5 transition-all duration-300 rounded-[var(--radius-lg)] p-1 ${interactionMode === 'inspect' ? 'hover:ring-2 hover:ring-teal-400 cursor-help' : ''}`}
                    style={{ 
                      width: getBreakpointWidth(),
                      // Local scope variables
                      ...cssVars,
                    }}
                    onClick={() => {
                      if (interactionMode === 'inspect') {
                        alert(`Inspecting ${page.name}.\nActive tokens:\n- Colors mode: ${activePageMode}\n- Heading: ${tokens.typography.fontHeading}\n- Radius: ${tokens.shape.radiusBase}px\n- Button archetype: ${tokens.components.buttonStyle}`);
                      }
                    }}
                  >
                    {/* Operating System Chrome Header */}
                    <div className="flex items-center justify-between px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-t-xl text-zinc-400 text-xs shadow-md">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-zinc-800 hover:bg-rose-500/80 cursor-pointer transition-colors" onClick={() => handleFocusPage(page.id)} title="Minimize/Recenter" />
                        <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                        <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                      </div>
                      
                      {/* Page Name */}
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-300">
                        {page.name}
                      </span>

                      {/* Frame actions: Focus & Light/dark switch */}
                      <div className="flex items-center gap-2">
                        {/* Breakpoint size indicator */}
                        <span className="text-[9px] font-mono bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-500 font-bold uppercase">
                          {getBreakpointWidth()}
                        </span>

                        {/* Local light/dark mode trigger */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePageMode(page.id);
                          }}
                          className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-teal-400 cursor-pointer transition-colors"
                          title="Override Frame Theme Mode"
                        >
                          {activePageMode === 'light' ? <Sun size={12} /> : <Moon size={12} />}
                        </button>

                        {/* Toggle single page view focus */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFocusPage(page.id);
                          }}
                          className={`p-1 rounded border cursor-pointer transition-colors ${focusedPageId === page.id ? 'bg-teal-500/10 border-teal-500 text-teal-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'}`}
                          title={focusedPageId === page.id ? 'Recenter Grid View' : 'Focus and Scale Window'}
                        >
                          <FrameCorners size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Rendered Showcase Page Content (using CSS Variables inline scope!) */}
                    <div 
                      className="border-x border-b border-[var(--color-border)] rounded-b-xl overflow-hidden shadow-[var(--shadow-ambient)] relative transition-all h-[500px]"
                      style={{ 
                        backgroundColor: 'var(--color-bg)',
                        // Enforce specific fonts inside
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--font-size-base)',
                      }}
                    >
                      <CanvasErrorBoundary pageName={page.name}>
                        <PageComponent tokens={tokens} mode={activePageMode} breakpoint={breakpoint} />
                      </CanvasErrorBoundary>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
