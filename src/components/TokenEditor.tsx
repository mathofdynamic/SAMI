import React, { useState } from 'react';
import { DesignTokens, ThemePreset } from '../types';
import { THEME_PRESETS } from '../presets';
import { FONTS_HEADING, FONTS_BODY, FONTS_MONO } from '../fonts';
import { FARSI_FONT_FAMILIES } from '../farsiFonts';
import { PanelPreview } from './PanelPreview';
import { AiWorking } from './AiWorking';
import { useAi } from '../useAi';
import { t, tr, auditText, Lang } from '../i18n';
import {
  getContrastRatio,
  getWcagScore,
  generateColorRamp,
  generateSlopAudit,
  buildTokens,
  sanitizePartialTokens,
  describeDial
} from '../utils';
import { harmonizePalette, scorePalette, autoFixTokens } from '../colorSync';
import {
  Palette,
  TextT,
  SquareHalf,
  ArrowsCounterClockwise,
  Clock,
  List,
  Sparkle,
  WarningCircle,
  CheckCircle,
  ArrowCounterClockwise,
  ArrowClockwise,
  CloudArrowDown,
  ArrowSquareOut,
  Sliders,
  ShieldCheck,
  MagicWand
} from '@phosphor-icons/react';

interface TokenEditorProps {
  tokens: DesignTokens;
  setTokens: (newTokens: DesignTokens) => void;
  selectPreset: (preset: ThemePreset) => void;
  activePresetId: string | null;
  previewMode: 'light' | 'dark';
  lang: Lang;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onReset: () => void;
}

export const TokenEditor: React.FC<TokenEditorProps> = ({
  tokens,
  setTokens,
  selectPreset,
  activePresetId,
  previewMode,
  lang,
  undo,
  redo,
  canUndo,
  canRedo,
  onReset,
}) => {
  const [activeSection, setActiveSection] = useState<'presets' | 'color' | 'typography' | 'shape' | 'components' | 'motion' | 'dials' | 'audit' | 'ai'>('presets');
  const ai = useAi();
  const [aiPrompt, setAiPrompt] = useState('');
  // Color fields the user manually edited since the last sync. "Sync Palette"
  // keeps these as anchors and harmonizes every other color around them.
  const [colorAnchors, setColorAnchors] = useState<Set<string>>(new Set());

  const updateToken = (path: string, value: any) => {
    const keys = path.split('.');
    const newTokens = { ...tokens } as any;

    let current = newTokens;
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;

    // Record edited color fields (mode-agnostic) as harmonization anchors.
    if (keys[0] === 'colors' && keys.length === 3) {
      const field = keys[2];
      setColorAnchors(prev => {
        if (prev.has(field)) return prev;
        const next = new Set(prev);
        next.add(field);
        return next;
      });
    }

    setTokens(newTokens);
  };

  // Keep the user's edited colors, derive the rest with color theory (both modes).
  const handleSyncPalette = () => {
    setTokens({
      ...tokens,
      colors: {
        light: harmonizePalette(tokens.colors.light, colorAnchors, 'light'),
        dark: harmonizePalette(tokens.colors.dark, colorAnchors, 'dark'),
      },
    });
    setColorAnchors(new Set());
  };

  // ---- AI assist handlers (Cloudflare Workers AI via /api/ai/*) ----
  const runDescribe = async () => {
    if (!aiPrompt.trim()) return;
    const r = await ai.run('describe', { description: aiPrompt, presetId: activePresetId });
    if (r?.tokens) setTokens(r.tokens);
  };
  const runSuggest = async (kind: string) => {
    const r = await ai.run('suggest', { kind, tokens, hint: aiPrompt });
    if (!r?.result) return;
    if (kind === 'appName' && r.result.value) updateToken('appName', r.result.value);
    else if (kind === 'fontPairing') {
      setTokens({
        ...tokens,
        typography: {
          ...tokens.typography,
          ...(r.result.fontHeading ? { fontHeading: r.result.fontHeading } : {}),
          ...(r.result.fontBody ? { fontBody: r.result.fontBody } : {}),
          ...(r.result.fontMono ? { fontMono: r.result.fontMono } : {}),
        },
      });
    } else if (kind === 'palette') {
      setTokens(buildTokens(sanitizePartialTokens({ colors: r.result }), tokens));
    }
  };
  // Deterministic, instant: pure color math guarantees all 7 checks pass in one
  // pass (no AI round-trip, no retry loop).
  const runAutofix = () => {
    setTokens(autoFixTokens(tokens));
  };

  const handlePresetSelect = (preset: ThemePreset) => {
    selectPreset(preset);
  };

  const activePresetName = activePresetId
    ? THEME_PRESETS.find(p => p.id === activePresetId)?.name ?? 'Custom'
    : 'Custom';

  // Contrast calculation helpers
  const lightContrast = getContrastRatio(tokens.colors.light.textPrimary, tokens.colors.light.neutralBg);
  const lightWcag = getWcagScore(lightContrast);
  
  const darkContrast = getContrastRatio(tokens.colors.dark.textPrimary, tokens.colors.dark.neutralBg);
  const darkWcag = getWcagScore(darkContrast);

  // Live palette-health for the currently previewed mode.
  const paletteHealth = scorePalette(tokens.colors[previewMode], previewMode);
  const healthBadgeClass =
    paletteHealth.grade === 'Good' ? 'bg-emerald-500/15 text-emerald-400'
    : paletteHealth.grade === 'Fair' ? 'bg-amber-500/15 text-amber-400'
    : 'bg-rose-500/15 text-rose-400';

  // In FA mode the font pickers list only the bundled Persian families.
  const isFa = lang === 'fa';
  const headingFontOptions = isFa ? FARSI_FONT_FAMILIES : FONTS_HEADING;
  const bodyFontOptions = isFa ? FARSI_FONT_FAMILIES : FONTS_BODY;

  // Slop Audit — shared pure logic; the UI translates name/tip by id.
  const audit = generateSlopAudit(tokens);
  const auditItems = audit.items;
  const warnCount = audit.total - audit.passed;

  return (
    <div className="relative w-full h-full flex flex-col bg-[var(--ui-bg)] text-[var(--ui-fg)] border-r border-[var(--ui-border)] overflow-hidden">
      {/* Workspace Header */}
      <div className="px-5 py-4 border-b border-[var(--ui-border)] flex items-center justify-between bg-[var(--ui-bg)]">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-[var(--ui-surface2)] border border-[var(--ui-border)] flex items-center justify-center text-[var(--ui-fg)]">
            <Palette size={14} weight="bold" />
          </div>
          <div>
            <h1 className="text-sm font-bold font-sans tracking-tight">{t('editor.title', lang)}</h1>
            <p className="text-[10px] text-[var(--ui-muted)] font-mono">{t('editor.sub', lang)}</p>
          </div>
        </div>

        {/* Undo/Redo & Reset Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={undo}
            disabled={!canUndo}
            title={tr(lang, "Undo Token Modification", "واگرد تغییر توکن")}
            className="p-1.5 rounded bg-[var(--ui-surface)] hover:bg-[var(--ui-surface2)] border border-[var(--ui-border)] disabled:opacity-30 disabled:pointer-events-none text-[var(--ui-muted)] cursor-pointer"
          >
            <ArrowCounterClockwise size={14} />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            title={tr(lang, "Redo Token Modification", "ازنو تغییر توکن")}
            className="p-1.5 rounded bg-[var(--ui-surface)] hover:bg-[var(--ui-surface2)] border border-[var(--ui-border)] disabled:opacity-30 disabled:pointer-events-none text-[var(--ui-muted)] cursor-pointer"
          >
            <ArrowClockwise size={14} />
          </button>
          <button
            onClick={onReset}
            title={tr(lang, "Reset to Preset Defaults", "بازنشانی به پیش‌فرض قالب")}
            className="p-1.5 rounded bg-[var(--ui-surface)] hover:bg-[var(--ui-surface2)] border border-[var(--ui-border)] text-[var(--ui-muted)] cursor-pointer text-xs flex items-center gap-1 font-mono uppercase tracking-wider"
          >
            <ArrowsCounterClockwise size={13} />
            <span className="text-[9px]">{t('editor.reset', lang)}</span>
          </button>
        </div>
      </div>

      {/* Editor Inner Layout (Split Sidebar Options and parameters scroll) */}
      <div className="flex-1 flex flex-row overflow-hidden">
        {/* Nav rails */}
        <div className="w-14 border-r border-[var(--ui-border)] bg-[var(--ui-bg)] flex flex-col justify-between py-4 items-center">
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setActiveSection('presets')}
              className={`p-2 rounded-lg cursor-pointer transition-colors relative group ${activeSection === 'presets' ? 'text-[var(--ui-fg)] bg-[var(--ui-surface)] border border-[var(--ui-border)]' : 'text-[var(--ui-muted)] hover:text-[var(--ui-fg)]'}`}
              title={tr(lang, "Theme presets", "قالب‌های آماده")}
            >
              <Sparkle size={18} />
              <span className="absolute left-16 top-1.5 bg-[var(--ui-surface)] border border-[var(--ui-border)] text-[var(--ui-fg)] text-[10px] px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-50">{tr(lang, "Theme Presets", "قالب‌های آماده")}</span>
            </button>

            <button
              onClick={() => setActiveSection('color')}
              className={`p-2 rounded-lg cursor-pointer transition-colors relative group ${activeSection === 'color' ? 'text-[var(--ui-fg)] bg-[var(--ui-surface)] border border-[var(--ui-border)]' : 'text-[var(--ui-muted)] hover:text-[var(--ui-fg)]'}`}
              title={tr(lang, "Colors Token System", "سیستم توکن رنگ")}
            >
              <Palette size={18} />
              <span className="absolute left-16 top-1.5 bg-[var(--ui-surface)] border border-[var(--ui-border)] text-[var(--ui-fg)] text-[10px] px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-50">{tr(lang, "Color Palette", "پالت رنگ")}</span>
            </button>

            <button
              onClick={() => setActiveSection('typography')}
              className={`p-2 rounded-lg cursor-pointer transition-colors relative group ${activeSection === 'typography' ? 'text-[var(--ui-fg)] bg-[var(--ui-surface)] border border-[var(--ui-border)]' : 'text-[var(--ui-muted)] hover:text-[var(--ui-fg)]'}`}
              title={tr(lang, "Typography Scales", "مقیاس‌های تایپوگرافی")}
            >
              <TextT size={18} />
              <span className="absolute left-16 top-1.5 bg-[var(--ui-surface)] border border-[var(--ui-border)] text-[var(--ui-fg)] text-[10px] px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-50">{tr(lang, "Typography Spec", "مشخصات تایپوگرافی")}</span>
            </button>

            <button
              onClick={() => setActiveSection('shape')}
              className={`p-2 rounded-lg cursor-pointer transition-colors relative group ${activeSection === 'shape' ? 'text-[var(--ui-fg)] bg-[var(--ui-surface)] border border-[var(--ui-border)]' : 'text-[var(--ui-muted)] hover:text-[var(--ui-fg)]'}`}
              title={tr(lang, "Shape, Radius & Blur", "شکل، گردی و محو")}
            >
              <SquareHalf size={18} />
              <span className="absolute left-16 top-1.5 bg-[var(--ui-surface)] border border-[var(--ui-border)] text-[var(--ui-fg)] text-[10px] px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-50">{tr(lang, "Shape & Elevation", "شکل و برجستگی")}</span>
            </button>

            <button
              onClick={() => setActiveSection('components')}
              className={`p-2 rounded-lg cursor-pointer transition-colors relative group ${activeSection === 'components' ? 'text-[var(--ui-fg)] bg-[var(--ui-surface)] border border-[var(--ui-border)]' : 'text-[var(--ui-muted)] hover:text-[var(--ui-fg)]'}`}
              title={tr(lang, "Components Presets", "قالب‌های اجزا")}
            >
              <List size={18} />
              <span className="absolute left-16 top-1.5 bg-[var(--ui-surface)] border border-[var(--ui-border)] text-[var(--ui-fg)] text-[10px] px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-50">{tr(lang, "Component Blueprints", "نقشه اجزا")}</span>
            </button>

            <button
              onClick={() => setActiveSection('motion')}
              className={`p-2 rounded-lg cursor-pointer transition-colors relative group ${activeSection === 'motion' ? 'text-[var(--ui-fg)] bg-[var(--ui-surface)] border border-[var(--ui-border)]' : 'text-[var(--ui-muted)] hover:text-[var(--ui-fg)]'}`}
              title={tr(lang, "Motion & Easings", "حرکت و شتاب")}
            >
              <Clock size={18} />
              <span className="absolute left-16 top-1.5 bg-[var(--ui-surface)] border border-[var(--ui-border)] text-[var(--ui-fg)] text-[10px] px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-50">{tr(lang, "Motion & Easings", "حرکت و شتاب")}</span>
            </button>

            <button
              onClick={() => setActiveSection('dials')}
              className={`p-2 rounded-lg cursor-pointer transition-colors relative group ${activeSection === 'dials' ? 'text-[var(--ui-fg)] bg-[var(--ui-surface)] border border-[var(--ui-border)]' : 'text-[var(--ui-muted)] hover:text-[var(--ui-fg)]'}`}
              title={tr(lang, "Taste Engine Dials", "دکمه‌های موتور سلیقه")}
            >
              <Sliders size={18} />
              <span className="absolute left-16 top-1.5 bg-[var(--ui-surface)] border border-[var(--ui-border)] text-[var(--ui-fg)] text-[10px] px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-50">{tr(lang, "Taste Engine Dials", "دکمه‌های موتور سلیقه")}</span>
            </button>

            <button
              onClick={() => setActiveSection('audit')}
              className={`p-2 rounded-lg cursor-pointer transition-colors relative group ${activeSection === 'audit' ? 'text-[var(--ui-fg)] bg-[var(--ui-surface)] border border-[var(--ui-border)]' : 'text-[var(--ui-muted)] hover:text-[var(--ui-fg)]'}`}
              title={tr(lang, "Anti-Slop Audit", "بازرسی ضدشلختگی")}
            >
              <ShieldCheck size={18} />
              {warnCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-500 text-[8px] font-bold text-[var(--ui-bg)] flex items-center justify-center rounded-full border border-[var(--ui-border)] font-mono animate-pulse">
                  {warnCount}
                </span>
              )}
              <span className="absolute left-16 top-1.5 bg-[var(--ui-surface)] border border-[var(--ui-border)] text-[var(--ui-fg)] text-[10px] px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-50">{tr(lang, "SAMI Slop Audit", "بازرسی سامی")}</span>
            </button>

            <button
              onClick={() => setActiveSection('ai')}
              className={`p-2 rounded-lg cursor-pointer transition-colors relative group ${activeSection === 'ai' ? 'text-[var(--ui-fg)] bg-[var(--ui-surface)] border border-[var(--ui-border)]' : 'text-[var(--ui-muted)] hover:text-[var(--ui-fg)]'}`}
              title={t('nav.ai', lang)}
            >
              <MagicWand size={18} />
              <span className="absolute left-16 top-1.5 bg-[var(--ui-surface)] border border-[var(--ui-border)] text-[var(--ui-fg)] text-[10px] px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-50">{t('nav.ai', lang)}</span>
            </button>
          </div>

          <div className="text-[var(--ui-muted)] text-[9px] font-mono leading-none tracking-widest text-center select-none rotate-180 writing-mode-vertical">
            SAMI VER 1.0.1
          </div>
        </div>

        {/* Right column: scrollable parameters + pinned live preview */}
        <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* SECTION: PRESETS */}
          {activeSection === 'presets' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--ui-muted)] font-mono mb-1">{t('sec.presets.title', lang)}</h2>
                <p className="text-xs text-[var(--ui-muted)]">{t('sec.presets.desc', lang)}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-mono">
                  <span className="text-[var(--ui-muted)] uppercase tracking-wider">{t('editor.active', lang)}</span>
                  <span className="px-2 py-0.5 rounded bg-[var(--ui-fg)] text-[var(--ui-bg)] font-bold">{activePresetName}</span>
                </div>
              </div>

              {/* App Brand Name */}
              <div className="p-3 bg-[var(--ui-surface)] rounded-lg border border-[var(--ui-border)] flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--ui-muted)] font-mono">{t('editor.appName', lang)}</span>
                <input
                  type="text"
                  value={tokens.appName}
                  onChange={(e) => updateToken('appName', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[var(--ui-bg)] border border-[var(--ui-border)] rounded text-[var(--ui-fg)] outline-none focus:border-[var(--ui-fg)]"
                  placeholder={tr(lang, "App Brand Name", "نام برند برنامه")}
                />
              </div>

              <div className="space-y-2.5">
                {THEME_PRESETS.map((preset) => {
                  const isActive = preset.id === activePresetId;
                  return (
                  <div
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    className={`p-4 rounded-lg transition-all cursor-pointer flex flex-col gap-2 text-left border ${isActive ? 'bg-[var(--ui-surface)] border-[var(--ui-fg)] ring-1 ring-[var(--ui-fg)]' : 'bg-[var(--ui-surface)]/60 hover:bg-[var(--ui-surface)] border-[var(--ui-border)]'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[var(--ui-fg)] flex items-center gap-1.5">
                        {isActive && <CheckCircle size={13} weight="fill" />}
                        {preset.name}
                      </span>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-[var(--ui-surface2)] border border-[var(--ui-border)] font-mono text-[var(--ui-muted)] uppercase">{preset.tokens.components.buttonStyle} {tr(lang, "button", "دکمه")}</span>
                    </div>
                    <p className="text-[11px] text-[var(--ui-muted)] leading-normal">{preset.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-3 h-3 rounded-full border border-[var(--ui-border)]" style={{ backgroundColor: preset.tokens.colors.light.primary }} />
                      <span className="w-3 h-3 rounded-full border border-[var(--ui-border)]" style={{ backgroundColor: preset.tokens.colors.light.accent }} />
                      <span className="w-3 h-3 rounded-full border border-[var(--ui-border)]" style={{ backgroundColor: preset.tokens.colors.light.neutralBg }} />
                      <span className="text-[10px] text-[var(--ui-muted)] ml-1 font-mono">{preset.tokens.typography.fontHeading}</span>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION: AI ASSIST */}
          {activeSection === 'ai' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--ui-muted)] font-mono mb-1">{t('ai.title', lang)}</h2>
                <p className="text-xs text-[var(--ui-muted)]">{t('ai.desc', lang)}</p>
              </div>

              <div className="p-4 bg-[var(--ui-surface)] rounded-lg border border-[var(--ui-border)] space-y-3">
                <label className="text-[10px] font-semibold text-[var(--ui-muted)]">{t('ai.describe.label', lang)}</label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={3}
                  placeholder={t('ai.describe.placeholder', lang)}
                  className="w-full px-3 py-2 text-xs bg-[var(--ui-bg)] border border-[var(--ui-border)] rounded outline-none text-[var(--ui-fg)] resize-none focus:border-[var(--ui-fg)]"
                />
                <button
                  onClick={runDescribe}
                  disabled={ai.busy || !aiPrompt.trim()}
                  className="w-full px-3 py-2 rounded bg-[var(--ui-fg)] text-[var(--ui-bg)] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90 disabled:opacity-40 disabled:pointer-events-none transition-opacity"
                >
                  <MagicWand size={14} weight="bold" /> {t('ai.generate', lang)}
                </button>
              </div>

              <div className="p-4 bg-[var(--ui-surface)] rounded-lg border border-[var(--ui-border)] space-y-2.5">
                <span className="text-[9px] font-bold text-[var(--ui-fg)] uppercase tracking-widest font-mono block">{t('ai.quick', lang)}</span>
                <div className="grid grid-cols-1 gap-2">
                  {([['appName', t('ai.suggestName', lang)], ['fontPairing', t('ai.fontPairing', lang)], ['palette', t('ai.palette', lang)]] as const).map(([kind, label]) => (
                    <button
                      key={kind}
                      onClick={() => runSuggest(kind)}
                      disabled={ai.busy}
                      className="px-3 py-2 rounded text-start border bg-[var(--ui-bg)] border-[var(--ui-border)] text-[var(--ui-fg)] text-xs font-semibold cursor-pointer hover:bg-[var(--ui-surface2)] flex items-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                    >
                      <Sparkle size={13} /> {label}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-[10px] text-[var(--ui-muted)] leading-relaxed">{t('ai.stubNote', lang)}</p>
              {ai.error && <p className="text-[10px] text-rose-400">{t('ai.error', lang)}</p>}
            </div>
          )}

          {/* SECTION: COLOR */}
          {activeSection === 'color' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--ui-muted)] font-mono mb-1">{t('sec.color.title', lang)}</h2>
                <p className="text-xs text-[var(--ui-muted)]">{t('sec.color.desc', lang)}</p>
              </div>

              {/* Sync Palette + live combo-health score */}
              <div className="p-3 rounded-lg bg-[var(--ui-surface)] border border-[var(--ui-border)] space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider font-mono px-2 py-1 rounded ${healthBadgeClass}`}>
                      {tr(lang, 'Combo', 'ترکیب')}: {paletteHealth.grade}
                    </span>
                    <span className="text-[10px] text-[var(--ui-muted)] font-mono">{paletteHealth.score}/100</span>
                  </div>
                  <button
                    onClick={handleSyncPalette}
                    title={tr(lang, 'Harmonize the palette around the colors you changed', 'پالت را بر اساس رنگ‌هایی که تغییر داده‌اید هماهنگ کن')}
                    className="px-3 py-1.5 rounded bg-[var(--ui-fg)] text-[var(--ui-bg)] text-[11px] font-bold flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <ArrowsCounterClockwise size={13} weight="bold" />
                    {tr(lang, 'Sync Palette', 'هماهنگ‌سازی پالت')}
                  </button>
                </div>

                {colorAnchors.size > 0 && (
                  <p className="text-[10px] text-[var(--ui-muted)] leading-relaxed">
                    {tr(lang, 'Anchored (your edits)', 'ثابت (ویرایش‌های شما)')}:{' '}
                    <span className="text-[var(--ui-fg)] font-mono">{[...colorAnchors].join(', ')}</span>.{' '}
                    {tr(lang, 'Sync keeps these and derives the rest.', 'هماهنگ‌سازی این‌ها را نگه می‌دارد و بقیه را می‌سازد.')}
                  </p>
                )}

                {paletteHealth.issues.length > 0 ? (
                  <ul className="space-y-1">
                    {paletteHealth.issues.map((iss, i) => (
                      <li key={i} className="text-[10px] text-[var(--ui-muted)] flex gap-1.5">
                        <WarningCircle size={12} className="text-amber-500 shrink-0 mt-0.5" />
                        <span>{iss}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle size={12} /> {tr(lang, 'Balanced contrast and harmonious hues.', 'کنتراست متعادل و رنگ‌های هماهنگ.')}
                  </p>
                )}
              </div>

              {/* Contrast Diagnostics Cards */}
              <div className="grid grid-cols-2 gap-3">
                {/* Light Mode WCAG checker */}
                <div className={`p-3 rounded-lg bg-[var(--ui-surface)] border flex flex-col gap-2 ${lightWcag.aa ? 'border-[var(--ui-border)]' : 'border-rose-500/20'}`}>
                  <span className="text-[9px] font-bold text-[var(--ui-muted)] uppercase tracking-wider font-mono">{tr(lang, "LIGHT CONTRAST", "کنتراست روشن")}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold font-mono">{lightContrast.toFixed(2)}:1</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {lightWcag.aa ? (
                      <CheckCircle size={12} className="text-emerald-500" />
                    ) : (
                      <WarningCircle size={12} className="text-rose-500" />
                    )}
                    <span className={`text-[10px] font-bold uppercase ${lightWcag.aa ? 'text-emerald-400' : 'text-rose-400'}`}>{lightWcag.text}</span>
                  </div>
                </div>

                {/* Dark Mode WCAG checker */}
                <div className={`p-3 rounded-lg bg-[var(--ui-surface)] border flex flex-col gap-2 ${darkWcag.aa ? 'border-[var(--ui-border)]' : 'border-rose-500/20'}`}>
                  <span className="text-[9px] font-bold text-[var(--ui-muted)] uppercase tracking-wider font-mono">{tr(lang, "DARK CONTRAST", "کنتراست تیره")}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold font-mono">{darkContrast.toFixed(2)}:1</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {darkWcag.aa ? (
                      <CheckCircle size={12} className="text-emerald-500" />
                    ) : (
                      <WarningCircle size={12} className="text-rose-500" />
                    )}
                    <span className={`text-[10px] font-bold uppercase ${darkWcag.aa ? 'text-emerald-400' : 'text-rose-400'}`}>{darkWcag.text}</span>
                  </div>
                </div>
              </div>

              {/* Ramps & Custom inputs mapping */}
              {['light', 'dark'].map((mode) => (
                <div key={mode} className="space-y-3.5 pt-2 border-t border-[var(--ui-border)]">
                  <span className="text-[10px] font-bold text-[var(--ui-fg)] uppercase tracking-widest font-mono">
                    {mode.toUpperCase()} {tr(lang, "MODE VARIABLES", "متغیرهای حالت")}
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Primary */}
                    <div className="flex flex-col gap-1.5 p-2 bg-[var(--ui-surface)] rounded">
                      <label className="text-[10px] font-semibold text-[var(--ui-muted)]">{tr(lang, "Primary Core", "هسته اصلی")}</label>
                      <div className="flex gap-1.5">
                        <input
                          type="color"
                          value={tokens.colors[mode as 'light' | 'dark'].primary}
                          onChange={(e) => updateToken(`colors.${mode}.primary`, e.target.value)}
                          className="w-7 h-7 rounded border border-[var(--ui-border)] bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={tokens.colors[mode as 'light' | 'dark'].primary}
                          onChange={(e) => updateToken(`colors.${mode}.primary`, e.target.value)}
                          className="flex-1 min-w-0 px-2 text-xs font-mono bg-[var(--ui-bg)] border border-[var(--ui-border)] rounded outline-none"
                        />
                      </div>
                    </div>

                    {/* Accent */}
                    <div className="flex flex-col gap-1.5 p-2 bg-[var(--ui-surface)] rounded">
                      <label className="text-[10px] font-semibold text-[var(--ui-muted)]">{tr(lang, "Accent Brand", "تأکید برند")}</label>
                      <div className="flex gap-1.5">
                        <input
                          type="color"
                          value={tokens.colors[mode as 'light' | 'dark'].accent}
                          onChange={(e) => updateToken(`colors.${mode}.accent`, e.target.value)}
                          className="w-7 h-7 rounded border border-[var(--ui-border)] bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={tokens.colors[mode as 'light' | 'dark'].accent}
                          onChange={(e) => updateToken(`colors.${mode}.accent`, e.target.value)}
                          className="flex-1 min-w-0 px-2 text-xs font-mono bg-[var(--ui-bg)] border border-[var(--ui-border)] rounded outline-none"
                        />
                      </div>
                    </div>

                    {/* Neutrals Bg */}
                    <div className="flex flex-col gap-1.5 p-2 bg-[var(--ui-surface)] rounded">
                      <label className="text-[10px] font-semibold text-[var(--ui-muted)]">{tr(lang, "Neutral BG Substrate", "بستر پس‌زمینه خنثی")}</label>
                      <div className="flex gap-1.5">
                        <input
                          type="color"
                          value={tokens.colors[mode as 'light' | 'dark'].neutralBg}
                          onChange={(e) => updateToken(`colors.${mode}.neutralBg`, e.target.value)}
                          className="w-7 h-7 rounded border border-[var(--ui-border)] bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={tokens.colors[mode as 'light' | 'dark'].neutralBg}
                          onChange={(e) => updateToken(`colors.${mode}.neutralBg`, e.target.value)}
                          className="flex-1 min-w-0 px-2 text-xs font-mono bg-[var(--ui-bg)] border border-[var(--ui-border)] rounded outline-none"
                        />
                      </div>
                    </div>

                    {/* Neutrals Card Surface */}
                    <div className="flex flex-col gap-1.5 p-2 bg-[var(--ui-surface)] rounded">
                      <label className="text-[10px] font-semibold text-[var(--ui-muted)]">{tr(lang, "Neutral Surface Panel", "پنل سطح خنثی")}</label>
                      <div className="flex gap-1.5">
                        <input
                          type="color"
                          value={tokens.colors[mode as 'light' | 'dark'].neutralSurface}
                          onChange={(e) => updateToken(`colors.${mode}.neutralSurface`, e.target.value)}
                          className="w-7 h-7 rounded border border-[var(--ui-border)] bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={tokens.colors[mode as 'light' | 'dark'].neutralSurface}
                          onChange={(e) => updateToken(`colors.${mode}.neutralSurface`, e.target.value)}
                          className="flex-1 min-w-0 px-2 text-xs font-mono bg-[var(--ui-bg)] border border-[var(--ui-border)] rounded outline-none"
                        />
                      </div>
                    </div>

                    {/* Text Primary */}
                    <div className="flex flex-col gap-1.5 p-2 bg-[var(--ui-surface)] rounded">
                      <label className="text-[10px] font-semibold text-[var(--ui-muted)]">{tr(lang, "Text Primary Header", "متن اصلی")}</label>
                      <div className="flex gap-1.5">
                        <input
                          type="color"
                          value={tokens.colors[mode as 'light' | 'dark'].textPrimary}
                          onChange={(e) => updateToken(`colors.${mode}.textPrimary`, e.target.value)}
                          className="w-7 h-7 rounded border border-[var(--ui-border)] bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={tokens.colors[mode as 'light' | 'dark'].textPrimary}
                          onChange={(e) => updateToken(`colors.${mode}.textPrimary`, e.target.value)}
                          className="flex-1 min-w-0 px-2 text-xs font-mono bg-[var(--ui-bg)] border border-[var(--ui-border)] rounded outline-none"
                        />
                      </div>
                    </div>

                    {/* Neutral Border */}
                    <div className="flex flex-col gap-1.5 p-2 bg-[var(--ui-surface)] rounded">
                      <label className="text-[10px] font-semibold text-[var(--ui-muted)]">{tr(lang, "Neutral Separator Line", "خط جداکننده خنثی")}</label>
                      <div className="flex gap-1.5">
                        <input
                          type="color"
                          value={tokens.colors[mode as 'light' | 'dark'].neutralBorder}
                          onChange={(e) => updateToken(`colors.${mode}.neutralBorder`, e.target.value)}
                          className="w-7 h-7 rounded border border-[var(--ui-border)] bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={tokens.colors[mode as 'light' | 'dark'].neutralBorder}
                          onChange={(e) => updateToken(`colors.${mode}.neutralBorder`, e.target.value)}
                          className="flex-1 min-w-0 px-2 text-xs font-mono bg-[var(--ui-bg)] border border-[var(--ui-border)] rounded outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shading generated ramp visual display */}
                  <div className="p-3 bg-[var(--ui-bg)] rounded border border-[var(--ui-border)] flex flex-col gap-1.5">
                    <span className="text-[9px] font-bold text-[var(--ui-muted)] tracking-wider uppercase font-mono">{tr(lang, "Accent Tint/Shade Ramp", "طیف سایه/روشن تأکید")}</span>
                    <div className="grid grid-cols-10 gap-1 mt-1">
                      {generateColorRamp(tokens.colors[mode as 'light' | 'dark'].accent).map((col, idx) => (
                        <div 
                          key={idx}
                          className="h-6 rounded border border-[var(--ui-border)]/50 relative group cursor-help"
                          style={{ backgroundColor: col }}
                          title={tr(lang, `Color ramp hex: ${col}`, `کد رنگ طیف: ${col}`)}
                        >
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-[var(--ui-surface)] border border-[var(--ui-border)] text-[9px] font-mono p-1 rounded z-50 text-[var(--ui-fg)]">
                            {col}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SECTION: TYPOGRAPHY */}
          {activeSection === 'typography' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--ui-muted)] font-mono mb-1">{t('sec.typography.title', lang)}</h2>
                <p className="text-xs text-[var(--ui-muted)]">{t('sec.typography.desc', lang)}</p>
              </div>

              {/* Pre-paired font families dropdowns */}
              <div className="p-4 bg-[var(--ui-surface)] rounded-lg border border-[var(--ui-border)] space-y-3.5">
                <span className="text-[9px] font-bold text-[var(--ui-fg)] uppercase tracking-widest font-mono block">{tr(lang, "Font Pairing Stacks", "پشته‌های جفت فونت")}</span>
                
                {/* Heading family */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-[var(--ui-muted)]">{tr(lang, 'Heading Font (Google Font)', 'فونت عنوان (فارسی)')}</label>
                  <select
                    value={tokens.typography.fontHeading}
                    onChange={(e) => updateToken('typography.fontHeading', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-[var(--ui-bg)] border border-[var(--ui-border)] rounded outline-none text-[var(--ui-fg)]"
                  >
                    {headingFontOptions.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

                {/* Body family */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-[var(--ui-muted)]">{tr(lang, 'Body Font (Google Font)', 'فونت متن (فارسی)')}</label>
                  <select
                    value={tokens.typography.fontBody}
                    onChange={(e) => updateToken('typography.fontBody', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-[var(--ui-bg)] border border-[var(--ui-border)] rounded outline-none text-[var(--ui-fg)]"
                  >
                    {bodyFontOptions.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

                {/* Mono family */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-[var(--ui-muted)]">{tr(lang, "Mono Font (Google Font)", "فونت مونو (گوگل)")}</label>
                  <select
                    value={tokens.typography.fontMono}
                    onChange={(e) => updateToken('typography.fontMono', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-[var(--ui-bg)] border border-[var(--ui-border)] rounded outline-none text-[var(--ui-fg)]"
                  >
                    {FONTS_MONO.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sizing & Metrics Sliders */}
              <div className="p-4 bg-[var(--ui-surface)] rounded-lg border border-[var(--ui-border)] space-y-4">
                <span className="text-[9px] font-bold text-[var(--ui-fg)] uppercase tracking-widest font-mono block">{tr(lang, "Metrics Scales & Factor", "مقیاس‌ها و ضریب")}</span>

                {/* scale factor */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[10px] font-semibold text-[var(--ui-muted)]">{tr(lang, "Modular Scale Ratio", "نسبت مقیاس مدولار")}</label>
                    <span className="text-xs font-mono font-bold text-[var(--ui-fg)]">{tokens.typography.scaleRatio}</span>
                  </div>
                  <input
                    type="range"
                    min="1.1"
                    max="1.618"
                    step="0.05"
                    value={tokens.typography.scaleRatio}
                    onChange={(e) => updateToken('typography.scaleRatio', parseFloat(e.target.value))}
                    className="w-full accent-[var(--ui-fg)] bg-[var(--ui-bg)] rounded-lg appearance-none h-1.5"
                  />
                  <div className="flex justify-between text-[9px] text-[var(--ui-muted)] font-mono">
                    <span>{tr(lang, "1.1 (Compact)", "۱.۱ (فشرده)")}</span>
                    <span>{tr(lang, "1.618 (Golden)", "۱.۶۱۸ (طلایی)")}</span>
                  </div>
                </div>

                {/* Base font size */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[10px] font-semibold text-[var(--ui-muted)]">{tr(lang, "Base Font Size (px)", "اندازه پایه فونت (px)")}</label>
                    <span className="text-xs font-mono font-bold text-[var(--ui-fg)]">{tokens.typography.sizeBase}px</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="20"
                    step="1"
                    value={tokens.typography.sizeBase}
                    onChange={(e) => updateToken('typography.sizeBase', parseInt(e.target.value))}
                    className="w-full accent-[var(--ui-fg)] bg-[var(--ui-bg)] rounded-lg appearance-none h-1.5"
                  />
                </div>

                {/* Line Height and Letter spacing heading */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-semibold text-[var(--ui-muted)]">{tr(lang, "Letter Spacing H1", "فاصله حروف H1")}</label>
                    <input
                      type="text"
                      value={tokens.typography.letterSpacingHeading}
                      onChange={(e) => updateToken('typography.letterSpacingHeading', e.target.value)}
                      className="w-full px-2 py-1 text-xs font-mono bg-[var(--ui-bg)] border border-[var(--ui-border)] rounded outline-none"
                      placeholder="-0.02em"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-semibold text-[var(--ui-muted)]">{tr(lang, "Line Height H1", "ارتفاع خط H1")}</label>
                    <input
                      type="number"
                      step="0.05"
                      value={tokens.typography.lineHeightHeading}
                      onChange={(e) => updateToken('typography.lineHeightHeading', parseFloat(e.target.value))}
                      className="w-full px-2 py-1 text-xs font-mono bg-[var(--ui-bg)] border border-[var(--ui-border)] rounded outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: SHAPE & ELEVATION */}
          {activeSection === 'shape' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--ui-muted)] font-mono mb-1">{t('sec.shape.title', lang)}</h2>
                <p className="text-xs text-[var(--ui-muted)]">{t('sec.shape.desc', lang)}</p>
              </div>

              <div className="p-4 bg-[var(--ui-surface)] rounded-lg border border-[var(--ui-border)] space-y-4">
                {/* Border radius base */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[10px] font-semibold text-[var(--ui-muted)]">{tr(lang, "Base Corner Radius (px)", "گردی پایه گوشه (px)")}</label>
                    <span className="text-xs font-mono font-bold text-[var(--ui-fg)]">{tokens.shape.radiusBase}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="28"
                    step="2"
                    value={tokens.shape.radiusBase}
                    onChange={(e) => updateToken('shape.radiusBase', parseInt(e.target.value))}
                    className="w-full accent-[var(--ui-fg)] bg-[var(--ui-bg)] rounded-lg appearance-none h-1.5"
                  />
                  <div className="flex justify-between text-[8px] text-[var(--ui-muted)] font-mono">
                    <span>{tr(lang, "0px (Hard 90°)", "۰px (تیز ۹۰°)")}</span>
                    <span>{tr(lang, "28px (Fluid Bubble)", "۲۸px (حبابی)")}</span>
                  </div>
                </div>

                {/* Border width base */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[10px] font-semibold text-[var(--ui-muted)]">{tr(lang, "Hairline Border Width (px)", "ضخامت حاشیه مویی (px)")}</label>
                    <span className="text-xs font-mono font-bold text-[var(--ui-fg)]">{tokens.shape.borderWidth}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    step="1"
                    value={tokens.shape.borderWidth}
                    onChange={(e) => updateToken('shape.borderWidth', parseInt(e.target.value))}
                    className="w-full accent-[var(--ui-fg)] bg-[var(--ui-bg)] rounded-lg appearance-none h-1.5"
                  />
                </div>

                {/* Shadow Intensity */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[10px] font-semibold text-[var(--ui-muted)]">{tr(lang, "Ambient Shadow Intensity (%)", "شدت سایه محیطی (٪)")}</label>
                    <span className="text-xs font-mono font-bold text-[var(--ui-fg)]">{tokens.shape.shadowIntensity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    step="5"
                    value={tokens.shape.shadowIntensity}
                    onChange={(e) => updateToken('shape.shadowIntensity', parseInt(e.target.value))}
                    className="w-full accent-[var(--ui-fg)] bg-[var(--ui-bg)] rounded-lg appearance-none h-1.5"
                  />
                </div>

                {/* Backdrop glass blur */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[10px] font-semibold text-[var(--ui-muted)]">{tr(lang, "Backdrop Glass Blur (px)", "محو شیشه‌ای پس‌زمینه (px)")}</label>
                    <span className="text-xs font-mono font-bold text-[var(--ui-fg)]">{tokens.shape.backdropBlur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    step="2"
                    value={tokens.shape.backdropBlur}
                    onChange={(e) => updateToken('shape.backdropBlur', parseInt(e.target.value))}
                    className="w-full accent-[var(--ui-fg)] bg-[var(--ui-bg)] rounded-lg appearance-none h-1.5"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION: COMPONENTS BLUEPRINT */}
          {activeSection === 'components' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--ui-muted)] font-mono mb-1">{t('sec.components.title', lang)}</h2>
                <p className="text-xs text-[var(--ui-muted)]">{t('sec.components.desc', lang)}</p>
              </div>

              <div className="p-4 bg-[var(--ui-surface)] rounded-lg border border-[var(--ui-border)] space-y-4">
                {/* Button archetype */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-semibold text-[var(--ui-muted)] uppercase tracking-wider font-mono">{tr(lang, "Button Blueprint style", "سبک نقشه دکمه")}</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {(['flat', 'pill', 'double-bezel', 'tactile', 'gradient', 'glow', 'glass', 'neumorphic'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => updateToken('components.buttonStyle', style)}
                        className={`px-3 py-2 rounded text-left border cursor-pointer transition-all capitalize font-semibold ${tokens.components.buttonStyle === style ? 'bg-[var(--ui-surface2)] border-[var(--ui-fg)] text-[var(--ui-fg)]' : 'bg-[var(--ui-bg)] border-[var(--ui-border)] text-[var(--ui-muted)] hover:text-[var(--ui-fg)]'}`}
                      >
                        {style.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card blueprint */}
                <div className="flex flex-col gap-2 pt-2 border-t border-[var(--ui-border)]">
                  <label className="text-[10px] font-semibold text-[var(--ui-muted)] uppercase tracking-wider font-mono">{tr(lang, "Card Frame style", "سبک قاب کارت")}</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {(['flat', 'bordered', 'elevated', 'double-bezel'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => updateToken('components.cardStyle', style)}
                        className={`px-3 py-2 rounded text-left border cursor-pointer transition-all capitalize font-semibold ${tokens.components.cardStyle === style ? 'bg-[var(--ui-surface2)] border-[var(--ui-fg)] text-[var(--ui-fg)]' : 'bg-[var(--ui-bg)] border-[var(--ui-border)] text-[var(--ui-muted)] hover:text-[var(--ui-fg)]'}`}
                      >
                        {style.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input fields */}
                <div className="flex flex-col gap-2 pt-2 border-t border-[var(--ui-border)]">
                  <label className="text-[10px] font-semibold text-[var(--ui-muted)] uppercase tracking-wider font-mono">{tr(lang, "Input Form Field style", "سبک فیلد ورودی فرم")}</label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {(['underlined', 'filled', 'bordered'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => updateToken('components.inputStyle', style)}
                        className={`px-2 py-2 rounded text-center border cursor-pointer transition-all capitalize font-semibold ${tokens.components.inputStyle === style ? 'bg-[var(--ui-surface2)] border-[var(--ui-fg)] text-[var(--ui-fg)]' : 'bg-[var(--ui-bg)] border-[var(--ui-border)] text-[var(--ui-muted)] hover:text-[var(--ui-fg)]'}`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: MOTION */}
          {activeSection === 'motion' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--ui-muted)] font-mono mb-1">{t('sec.motion.title', lang)}</h2>
                <p className="text-xs text-[var(--ui-muted)]">{t('sec.motion.desc', lang)}</p>
              </div>

              <div className="p-4 bg-[var(--ui-surface)] rounded-lg border border-[var(--ui-border)] space-y-4">
                {/* Fast duration */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[10px] font-semibold text-[var(--ui-muted)]">{tr(lang, "Interaction Feedback (Fast, ms)", "بازخورد تعامل (سریع)")}</label>
                    <span className="text-xs font-mono font-bold text-[var(--ui-fg)]">{tokens.motion.durationFast}ms</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    step="10"
                    value={tokens.motion.durationFast}
                    onChange={(e) => updateToken('motion.durationFast', parseInt(e.target.value))}
                    className="w-full accent-[var(--ui-fg)] bg-[var(--ui-bg)] rounded-lg appearance-none h-1.5"
                  />
                </div>

                {/* Normal duration */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[10px] font-semibold text-[var(--ui-muted)]">{tr(lang, "Structural Transition (Normal, ms)", "گذار ساختاری (معمولی)")}</label>
                    <span className="text-xs font-mono font-bold text-[var(--ui-fg)]">{tokens.motion.durationNormal}ms</span>
                  </div>
                  <input
                    type="range"
                    min="150"
                    max="450"
                    step="10"
                    value={tokens.motion.durationNormal}
                    onChange={(e) => updateToken('motion.durationNormal', parseInt(e.target.value))}
                    className="w-full accent-[var(--ui-fg)] bg-[var(--ui-bg)] rounded-lg appearance-none h-1.5"
                  />
                </div>

                {/* Easing timing function */}
                <div className="flex flex-col gap-1.5 pt-2 border-t border-[var(--ui-border)]">
                  <label className="text-[10px] font-semibold text-[var(--ui-muted)]">{tr(lang, "Cubic Bezier Easing Function", "تابع شتاب بزیه مکعبی")}</label>
                  <input
                    type="text"
                    value={tokens.motion.easing}
                    onChange={(e) => updateToken('motion.easing', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs font-mono bg-[var(--ui-bg)] border border-[var(--ui-border)] rounded outline-none text-[var(--ui-fg)]"
                    placeholder="cubic-bezier(...)"
                  />
                  <div className="flex flex-wrap gap-1 mt-1">
                    <button
                      onClick={() => updateToken('motion.easing', 'cubic-bezier(0.16, 1, 0.3, 1)')}
                      className="text-[9px] font-mono px-2 py-0.5 rounded bg-[var(--ui-bg)] hover:bg-[var(--ui-surface2)] border border-[var(--ui-border)] cursor-pointer"
                    >
                      easeOutExpo
                    </button>
                    <button
                      onClick={() => updateToken('motion.easing', 'cubic-bezier(0.34, 1.56, 0.64, 1)')}
                      className="text-[9px] font-mono px-2 py-0.5 rounded bg-[var(--ui-bg)] hover:bg-[var(--ui-surface2)] border border-[var(--ui-border)] cursor-pointer"
                    >
                      backOut
                    </button>
                    <button
                      onClick={() => updateToken('motion.easing', 'cubic-bezier(0.25, 1, 0.5, 1)')}
                      className="text-[9px] font-mono px-2 py-0.5 rounded bg-[var(--ui-bg)] hover:bg-[var(--ui-surface2)] border border-[var(--ui-border)] cursor-pointer"
                    >
                      easeOutQuad
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: DIALS */}
          {activeSection === 'dials' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--ui-muted)] font-mono mb-1">{t('sec.dials.title', lang)}</h2>
                <p className="text-xs text-[var(--ui-muted)]">{t('sec.dials.desc', lang)}</p>
              </div>

              {/* What the dials actually do (they don't change the live preview). */}
              <div className="p-3 rounded-lg bg-[var(--ui-surface)] border border-[var(--ui-border)] flex gap-2.5">
                <Sliders size={15} className="text-[var(--ui-fg)] shrink-0 mt-0.5" />
                <p className="text-[11px] text-[var(--ui-muted)] leading-relaxed">
                  {tr(lang,
                    'These dials are design intent, not live controls. Their values are written into your exported DESIGN.md and the AI-agent prompt as guidance — telling the downstream coding tool how adventurous the layout, how lively the motion, and how tight the spacing should be. The canvas preview does not change when you move them.',
                    'این دکمه‌ها بیانگر «قصد طراحی» هستند، نه کنترل زنده. مقدار آنها در فایل DESIGN.md و پرامپت هوش مصنوعی به‌عنوان راهنما نوشته می‌شود تا به ابزار کدنویسی بگوید چیدمان چقدر جسورانه، حرکت چقدر زنده و فاصله‌گذاری چقدر فشرده باشد. پیش‌نمایش بوم با تغییر آنها عوض نمی‌شود.')}
                </p>
              </div>

              <div className="p-4 bg-[var(--ui-surface)] rounded-lg border border-[var(--ui-border)] space-y-5">
                {/* Variance Dial */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[10px] font-semibold text-[var(--ui-muted)]">{tr(lang, "Variance", "تنوع")}</label>
                    <span className="text-xs font-mono font-bold text-[var(--ui-fg)]">{tokens.dials?.variance ?? 8} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={tokens.dials?.variance ?? 8}
                    onChange={(e) => updateToken('dials.variance', parseInt(e.target.value))}
                    className="w-full accent-[var(--ui-fg)] bg-[var(--ui-bg)] rounded-lg appearance-none h-1.5 cursor-pointer"
                  />
                  <p className="text-[10px] text-[var(--ui-muted)] leading-normal">
                    {tr(lang, 'Exports as', 'خروجی')}: <span className="text-[var(--ui-fg)] font-medium">{describeDial('variance', tokens.dials?.variance ?? 8)}</span>
                  </p>
                </div>

                {/* Motion Dial */}
                <div className="space-y-1.5 pt-3 border-t border-[var(--ui-border)]">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[10px] font-semibold text-[var(--ui-muted)]">{tr(lang, "Motion", "حرکت")}</label>
                    <span className="text-xs font-mono font-bold text-[var(--ui-fg)]">{tokens.dials?.motion ?? 6} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={tokens.dials?.motion ?? 6}
                    onChange={(e) => updateToken('dials.motion', parseInt(e.target.value))}
                    className="w-full accent-[var(--ui-fg)] bg-[var(--ui-bg)] rounded-lg appearance-none h-1.5 cursor-pointer"
                  />
                  <p className="text-[10px] text-[var(--ui-muted)] leading-normal">
                    {tr(lang, 'Exports as', 'خروجی')}: <span className="text-[var(--ui-fg)] font-medium">{describeDial('motion', tokens.dials?.motion ?? 6)}</span>
                  </p>
                </div>

                {/* Density Dial */}
                <div className="space-y-1.5 pt-3 border-t border-[var(--ui-border)]">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[10px] font-semibold text-[var(--ui-muted)]">{tr(lang, "Density", "تراکم")}</label>
                    <span className="text-xs font-mono font-bold text-[var(--ui-fg)]">{tokens.dials?.density ?? 4} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={tokens.dials?.density ?? 4}
                    onChange={(e) => updateToken('dials.density', parseInt(e.target.value))}
                    className="w-full accent-[var(--ui-fg)] bg-[var(--ui-bg)] rounded-lg appearance-none h-1.5 cursor-pointer"
                  />
                  <p className="text-[10px] text-[var(--ui-muted)] leading-normal">
                    {tr(lang, 'Exports as', 'خروجی')}: <span className="text-[var(--ui-fg)] font-medium">{describeDial('density', tokens.dials?.density ?? 4)}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: ANTI-SLOP AUDIT */}
          {activeSection === 'audit' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-[var(--ui-surface)] rounded-lg border border-[var(--ui-border)] text-left">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[var(--ui-surface2)] border border-[var(--ui-border)] flex items-center justify-center text-[var(--ui-fg)]">
                    <ShieldCheck size={16} weight="bold" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--ui-muted)] font-mono">{tr(lang, "Taste Audit Engine", "موتور بازرسی سلیقه")}</h2>
                    <p className="text-[10px] text-[var(--ui-muted)] font-mono">{tr(lang, "COMPLIANCE STATUS", "وضعیت انطباق")} // {7 - warnCount} / 7 {tr(lang, "PASSED", "قبول")}</p>
                  </div>
                </div>

                {/* Live progress indicator bar */}
                <div className="w-full bg-[var(--ui-bg)] h-1.5 rounded-full overflow-hidden mt-3">
                  <div
                    className="h-full bg-[var(--ui-fg)] transition-all duration-500"
                    style={{ width: `${((7 - warnCount) / 7) * 100}%` }}
                  />
                </div>
              </div>

              {/* Auto-fix the failing checks with AI */}
              <button
                onClick={runAutofix}
                disabled={warnCount === 0}
                className="w-full px-3 py-2 rounded bg-[var(--ui-fg)] text-[var(--ui-bg)] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90 disabled:opacity-40 disabled:pointer-events-none transition-opacity"
              >
                <MagicWand size={14} weight="bold" /> {t('ai.autofix', lang)}
              </button>

              {/* Checklist items */}
              <div className="space-y-2.5">
                {auditItems.map((item) => (
                  <div 
                    key={item.id}
                    className="p-3.5 rounded-lg bg-[var(--ui-surface)]/60 border border-[var(--ui-border)] flex flex-col gap-2 text-left"
                  >
                    <div className="flex justify-between items-start gap-2.5">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-bold text-[var(--ui-fg)]">{auditText(item.id, 'name', lang, item.name)}</span>
                        <span className="text-[9px] text-[var(--ui-muted)] font-mono">{tr(lang, "Current value", "مقدار فعلی")}: {item.value}</span>
                      </div>
                      
                      {item.passed ? (
                        <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[8px] font-extrabold uppercase tracking-wider border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {tr(lang, 'Pass', 'قبول')}
                        </span>
                      ) : (
                        <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[8px] font-extrabold uppercase tracking-wider border border-amber-500/20 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          {tr(lang, 'Warn', 'هشدار')}
                        </span>
                      )}
                    </div>
                    
                    {!item.passed && (
                      <div className="text-[10px] text-[var(--ui-muted)] bg-[var(--ui-bg)]/60 p-2 rounded border border-[var(--ui-border)]/40 leading-relaxed">
                        <span className="text-amber-400 font-bold font-mono">{tr(lang, "FIX BRIEF // ", "اصلاح // ")}</span>
                        {auditText(item.id, 'tip', lang, item.tip)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

          {/* Pinned live preview reflecting current tokens */}
          <PanelPreview tokens={tokens} mode={previewMode} section={activeSection} lang={lang} />
        </div>
      </div>
      <AiWorking active={ai.busy} lang={lang} />
    </div>
  );
};
