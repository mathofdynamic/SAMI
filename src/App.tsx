import { useState, useEffect } from 'react';
import { useTokenStore } from './useTokenStore';
import { useUserPages } from './useUserPages';
import { TokenEditor } from './components/TokenEditor';
import { Canvas } from './components/Canvas';
import { ExportDrawer } from './components/ExportDrawer';
import { AgentsDrawer } from './components/AgentsDrawer';
import { FontPreloader } from './components/FontPreloader';
import { FarsiFontLoader } from './components/FarsiFontLoader';
import { useLang, t, tr, VAZIR } from './i18n';
import {
  Palette,
  Download,
  Question,
  Info,
  Sun,
  Moon,
  CornersOut,
  CornersIn,
  Robot
} from '@phosphor-icons/react';

export default function App() {
  const {
    tokens,
    setTokens,
    undo,
    redo,
    canUndo,
    canRedo,
    resetToPreset,
    setActivePresetId,
    activePresetId,
  } = useTokenStore();

  const { userPages, addUserPage, removeUserPage } = useUserPages();

  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isAgentsOpen, setIsAgentsOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  // Unified app theme: drives the studio chrome AND the default preview mode.
  const [appMode, setAppMode] = useState<'light' | 'dark'>('dark');
  // Canvas-only (zen) view: hides the header + editor, leaving just the canvas.
  const [zenMode, setZenMode] = useState(false);
  // UI language (en / fa). fa flips the studio to RTL + Vazirmatn.
  const { lang, setLang } = useLang();
  const isRtl = lang === 'fa';

  // Keep the browser tab title in sync with the design being crafted.
  useEffect(() => {
    const name = tokens?.appName?.trim();
    document.title = name ? `${name} - SAMI Design Studio` : 'SAMI - Visual Design Studio';
  }, [tokens?.appName]);

  // Esc exits canvas-only view.
  useEffect(() => {
    if (!zenMode) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setZenMode(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [zenMode]);

  // Select a preset: persist its id (so Reset works) then apply its tokens.
  const selectPreset = (preset: { id: string; tokens: typeof tokens }) => {
    setActivePresetId(preset.id);
    setTokens({ ...preset.tokens, appName: tokens.appName });
  };

  return (
    <main
      data-theme={appMode}
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{ fontFamily: isRtl ? `'${VAZIR}', 'Inter', sans-serif` : undefined }}
      className="w-full h-[100dvh] overflow-hidden flex flex-col bg-[var(--ui-bg)] font-sans text-[var(--ui-fg)]"
    >
      <FontPreloader />
      <FarsiFontLoader />

      {/* Global Desktop Workspace Header */}
      {!zenMode && (
      <header className="h-14 bg-[var(--ui-bg)] border-b border-[var(--ui-border)] flex items-center justify-between px-6 shrink-0 z-30 shadow-md">
        
        {/* Brand logo & title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--ui-fg)] flex items-center justify-center text-[var(--ui-bg)]">
            <Palette size={18} weight="bold" />
          </div>
          <div>
            <span className="font-extrabold tracking-tight text-base font-sans uppercase block leading-none">SAMI</span>
            <span className="text-[9px] text-[var(--ui-muted)] block leading-tight mt-1 font-mono tracking-wide">{t('brand.slogan', lang)}</span>
          </div>
        </div>

        {/* Informative tutorial tooltip guide */}
        <div className="hidden lg:flex items-center gap-2.5 max-w-xl bg-[var(--ui-surface)]/50 border border-[var(--ui-border)]/80 rounded-full px-4 py-1.5 text-xs text-[var(--ui-muted)]">
          <Info size={14} className="text-[var(--ui-fg)]" />
          <span className="truncate">{t('header.hint', lang)}</span>
        </div>

        {/* Global Toolbar Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Language toggle (EN / FA) */}
          <div className="inline-flex rounded-lg p-0.5 bg-[var(--ui-surface)] border border-[var(--ui-border)] font-mono text-[10px] font-bold">
            <button
              onClick={() => setLang('en')}
              title="English"
              className={`px-2 py-1.5 rounded-md cursor-pointer transition-colors ${lang === 'en' ? 'bg-[var(--ui-fg)] text-[var(--ui-bg)]' : 'text-[var(--ui-muted)] hover:text-[var(--ui-fg)]'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('fa')}
              title="فارسی"
              className={`px-2 py-1.5 rounded-md cursor-pointer transition-colors ${lang === 'fa' ? 'bg-[var(--ui-fg)] text-[var(--ui-bg)]' : 'text-[var(--ui-muted)] hover:text-[var(--ui-fg)]'}`}
            >
              فا
            </button>
          </div>

          {/* Unified light/dark toggle (studio chrome + preview default) */}
          <div className="inline-flex rounded-lg p-0.5 bg-[var(--ui-surface)] border border-[var(--ui-border)]">
            <button
              onClick={() => setAppMode('light')}
              title={t('theme.light', lang)}
              className={`p-1.5 rounded-md cursor-pointer flex items-center gap-1 transition-colors ${appMode === 'light' ? 'bg-[var(--ui-fg)] text-[var(--ui-bg)]' : 'text-[var(--ui-muted)] hover:text-[var(--ui-fg)]'}`}
            >
              <Sun size={13} weight="fill" />
            </button>
            <button
              onClick={() => setAppMode('dark')}
              title={t('theme.dark', lang)}
              className={`p-1.5 rounded-md cursor-pointer flex items-center gap-1 transition-colors ${appMode === 'dark' ? 'bg-[var(--ui-fg)] text-[var(--ui-bg)]' : 'text-[var(--ui-muted)] hover:text-[var(--ui-fg)]'}`}
            >
              <Moon size={13} weight="fill" />
            </button>
          </div>

          <button
            onClick={() => setZenMode(true)}
            className="p-2 rounded-lg bg-[var(--ui-surface)] hover:bg-[var(--ui-surface2)] border border-[var(--ui-border)] text-[var(--ui-muted)] hover:text-[var(--ui-fg)] cursor-pointer text-xs flex items-center gap-1.5 font-mono"
            title={t('btn.canvasOnly', lang)}
          >
            <CornersOut size={14} />
          </button>

          <button
            onClick={() => setIsAgentsOpen(true)}
            className="p-2 rounded-lg bg-[var(--ui-surface)] hover:bg-[var(--ui-surface2)] border border-[var(--ui-border)] text-[var(--ui-muted)] hover:text-[var(--ui-fg)] cursor-pointer text-xs flex items-center gap-1.5 font-mono"
            title={t('btn.agents', lang)}
          >
            <Robot size={14} />
            <span className="hidden sm:inline">{t('btn.agents', lang)}</span>
          </button>

          <button
            onClick={() => setShowGuide(!showGuide)}
            className="p-2 rounded-lg bg-[var(--ui-surface)] hover:bg-[var(--ui-surface2)] border border-[var(--ui-border)] text-[var(--ui-muted)] hover:text-[var(--ui-fg)] cursor-pointer text-xs flex items-center gap-1.5 font-mono"
            title="Read Workspace Manifesto"
          >
            <Question size={14} />
            <span className="hidden sm:inline">{t('btn.manifesto', lang)}</span>
          </button>

          <button
            onClick={() => setIsExportOpen(true)}
            className="px-4 py-2 bg-[var(--ui-fg)] hover:opacity-90 text-[var(--ui-bg)] font-extrabold text-xs rounded-lg flex items-center gap-2 cursor-pointer transition-all"
          >
            <Download size={14} weight="bold" />
            <span>{t('btn.export', lang)}</span>
          </button>
        </div>
      </header>
      )}

      {/* Workspace split screens body */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Workspace interactive Manifesto overlay */}
        {showGuide && (
          <div className="absolute inset-0 bg-[var(--ui-bg)]/95 backdrop-blur-md z-40 p-6 md:p-12 overflow-y-auto flex flex-col justify-center animate-fadeIn text-left">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--ui-surface2)] border border-[var(--ui-border)] flex items-center justify-center text-[var(--ui-fg)]">
                  <Palette size={20} weight="bold" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">{tr(lang, 'SAMI Visual Design Manifesto', 'بیانیه طراحی بصری سامی')}</h2>
                  <p className="text-xs text-[var(--ui-muted)] font-mono">{tr(lang, 'COHERENT DOWNSTREAM TRANSLATION', 'ترجمه منسجم به کد')}</p>
                </div>
              </div>

              <div className="space-y-4 text-xs md:text-sm text-[var(--ui-fg)] leading-relaxed">
                <p>{tr(lang,
                  'Named after Sami - a brilliant designer - SAMI does for a developer what an experienced design engineer does for an agile product team: it defines the visual grammar so everything built afterward remains uniform and beautiful.',
                  'سامی که به نام یک طراح درخشان نام‌گذاری شده، برای یک توسعه‌دهنده همان کاری را می‌کند که یک مهندس طراحی باتجربه برای تیم محصول انجام می‌دهد: گرامر بصری را تعریف می‌کند تا هر چیزی که بعداً ساخته می‌شود یکدست و زیبا بماند.')}</p>
                <p>{tr(lang,
                  'When you prompt an AI tool to "build me a website," the model typically invents generic, inconsistent layouts. SAMI solves this by front-loading design specs into a single source of truth:',
                  'وقتی از یک ابزار هوش مصنوعی می‌خواهید «یک وب‌سایت بساز»، مدل معمولاً چیدمان‌های کلیشه‌ای و ناهماهنگ می‌سازد. سامی این مشکل را با تعریف مشخصات طراحی در یک منبع واحد حقیقت حل می‌کند:')}</p>
                <ul className="list-disc ps-5 space-y-2 text-[var(--ui-muted)]">
                  <li>{tr(lang,
                    'The Token Cascade: adjust colors, typography, radius, and motion; watch them propagate instantly across representative app screens.',
                    'آبشار توکن: رنگ‌ها، تایپوگرافی، گردی گوشه و حرکت را تنظیم کنید و انتشار آنی آنها را روی صفحات نمونه ببینید.')}</li>
                  <li>{tr(lang,
                    'The Two-Surface Model: the editor (left) controls the parameters; the infinite-canvas preview (right) verifies them across every screen.',
                    'مدل دو سطحی: ویرایشگر (سمت راست) پارامترها را کنترل می‌کند؛ پیش‌نمایش بوم بی‌نهایت آنها را در هر صفحه تأیید می‌کند.')}</li>
                  <li>{tr(lang,
                    'The Human-AI Hand-Off: export a structured DESIGN.md to instruct tools like Claude Code or Cursor to build your design without drift.',
                    'تحویل انسان به هوش مصنوعی: یک فایل DESIGN.md ساختاریافته بگیرید تا ابزارهایی مانند Claude Code یا Cursor طراحی شما را بدون انحراف بسازند.')}</li>
                </ul>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => setShowGuide(false)}
                  className="px-5 py-2.5 bg-[var(--ui-fg)] hover:opacity-90 text-[var(--ui-bg)] font-bold rounded-lg text-xs cursor-pointer transition-all"
                >
                  {tr(lang, 'Enter Visual Space', 'ورود به فضای بصری')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Left/Top Side: Structured Visual Token Editor */}
        {!zenMode && (
        <div className="w-full md:w-[380px] lg:w-[410px] shrink-0 h-[45vh] md:h-full relative z-20 border-b md:border-b-0 border-[var(--ui-border)]">
          <TokenEditor
            tokens={tokens}
            setTokens={setTokens}
            selectPreset={selectPreset}
            activePresetId={activePresetId}
            previewMode={appMode}
            lang={lang}
            undo={undo}
            redo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
            onReset={resetToPreset}
          />
        </div>
        )}

        {/* Right/Bottom Side: Pannable Canvas with Showcase Page grid view */}
        <div className={`flex-1 relative z-10 ${zenMode ? 'h-full' : 'h-[55vh] md:h-full'}`}>
          <Canvas tokens={tokens} globalMode={appMode} setGlobalMode={setAppMode} activePresetId={activePresetId} lang={lang} userPages={userPages} addUserPage={addUserPage} removeUserPage={removeUserPage} />

          {/* Floating exit affordance for canvas-only view */}
          {zenMode && (
            <button
              onClick={() => setZenMode(false)}
              className="absolute top-3 right-3 z-40 px-3 py-2 rounded-lg bg-[var(--ui-surface)] border border-[var(--ui-border)] text-[var(--ui-fg)] hover:bg-[var(--ui-surface2)] cursor-pointer text-xs font-mono flex items-center gap-1.5 shadow-md"
              title={`${t('btn.exitCanvas', lang)} (Esc)`}
            >
              <CornersIn size={14} />
              <span>{t('btn.exitCanvas', lang)}</span>
            </button>
          )}
        </div>
      </div>

      {/* Export Bundle Modal Drawer */}
      <ExportDrawer
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        tokens={tokens}
        lang={lang}
      />

      <AgentsDrawer
        isOpen={isAgentsOpen}
        onClose={() => setIsAgentsOpen(false)}
        tokens={tokens}
        activePresetId={activePresetId}
        lang={lang}
      />
    </main>
  );
}
