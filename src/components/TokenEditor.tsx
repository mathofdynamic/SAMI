import React, { useState } from 'react';
import { DesignTokens, ThemePreset } from '../types';
import { THEME_PRESETS } from '../presets';
import { 
  getContrastRatio, 
  getWcagScore, 
  generateColorRamp 
} from '../utils';
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
  ArrowSquareOut
} from '@phosphor-icons/react';

interface TokenEditorProps {
  tokens: DesignTokens;
  setTokens: (newTokens: DesignTokens) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onReset: () => void;
}

const FONTS_HEADING = ['Outfit', 'Space Grotesk', 'Syne', 'Playfair Display', 'Instrument Serif', 'Plus Jakarta Sans', 'DM Sans'];
const FONTS_BODY = ['Plus Jakarta Sans', 'DM Sans', 'Outfit', 'Space Grotesk', 'Newsreader'];
const FONTS_MONO = ['JetBrains Mono', 'IBM Plex Mono', 'Fira Code', 'Space Mono'];

export const TokenEditor: React.FC<TokenEditorProps> = ({
  tokens,
  setTokens,
  undo,
  redo,
  canUndo,
  canRedo,
  onReset,
}) => {
  const [activeSection, setActiveSection] = useState<'presets' | 'color' | 'typography' | 'shape' | 'components' | 'motion'>('presets');

  const updateToken = (path: string, value: any) => {
    const keys = path.split('.');
    const newTokens = { ...tokens } as any;
    
    let current = newTokens;
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    setTokens(newTokens);
  };

  const handlePresetSelect = (preset: ThemePreset) => {
    setTokens({ ...preset.tokens, appName: tokens.appName }); // Preserve current app name
  };

  // Contrast calculation helpers
  const lightContrast = getContrastRatio(tokens.colors.light.textPrimary, tokens.colors.light.neutralBg);
  const lightWcag = getWcagScore(lightContrast);
  
  const darkContrast = getContrastRatio(tokens.colors.dark.textPrimary, tokens.colors.dark.neutralBg);
  const darkWcag = getWcagScore(darkContrast);

  return (
    <div className="w-full h-full flex flex-col bg-zinc-950 text-zinc-100 border-r border-zinc-900 overflow-hidden">
      {/* Workspace Header */}
      <div className="px-5 py-4 border-b border-zinc-900 flex items-center justify-between bg-zinc-950">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Palette size={14} weight="bold" />
          </div>
          <div>
            <h1 className="text-sm font-bold font-sans tracking-tight">SAMI Studio Panel</h1>
            <p className="text-[10px] text-zinc-500 font-mono">DETERMINISTIC TOKEN STREAM</p>
          </div>
        </div>

        {/* Undo/Redo & Reset Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={undo}
            disabled={!canUndo}
            title="Undo Token Modification"
            className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 disabled:opacity-30 disabled:pointer-events-none text-zinc-400 cursor-pointer"
          >
            <ArrowCounterClockwise size={14} />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            title="Redo Token Modification"
            className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 disabled:opacity-30 disabled:pointer-events-none text-zinc-400 cursor-pointer"
          >
            <ArrowClockwise size={14} />
          </button>
          <button
            onClick={onReset}
            title="Reset to Preset Defaults"
            className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 cursor-pointer text-xs flex items-center gap-1 font-mono uppercase tracking-wider"
          >
            <ArrowsCounterClockwise size={13} />
            <span className="text-[9px]">Reset</span>
          </button>
        </div>
      </div>

      {/* Editor Inner Layout (Split Sidebar Options and parameters scroll) */}
      <div className="flex-1 flex flex-row overflow-hidden">
        {/* Nav rails */}
        <div className="w-14 border-r border-zinc-900 bg-zinc-950 flex flex-col justify-between py-4 items-center">
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setActiveSection('presets')}
              className={`p-2 rounded-lg cursor-pointer transition-colors relative group ${activeSection === 'presets' ? 'text-teal-400 bg-zinc-900 border border-zinc-800' : 'text-zinc-500 hover:text-zinc-300'}`}
              title="Theme presets"
            >
              <Sparkle size={18} />
              <span className="absolute left-16 top-1.5 bg-zinc-900 border border-zinc-800 text-zinc-200 text-[10px] px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-50">Theme Presets</span>
            </button>

            <button
              onClick={() => setActiveSection('color')}
              className={`p-2 rounded-lg cursor-pointer transition-colors relative group ${activeSection === 'color' ? 'text-teal-400 bg-zinc-900 border border-zinc-800' : 'text-zinc-500 hover:text-zinc-300'}`}
              title="Colors Token System"
            >
              <Palette size={18} />
              <span className="absolute left-16 top-1.5 bg-zinc-900 border border-zinc-800 text-zinc-200 text-[10px] px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-50">Color Palette</span>
            </button>

            <button
              onClick={() => setActiveSection('typography')}
              className={`p-2 rounded-lg cursor-pointer transition-colors relative group ${activeSection === 'typography' ? 'text-teal-400 bg-zinc-900 border border-zinc-800' : 'text-zinc-500 hover:text-zinc-300'}`}
              title="Typography Scales"
            >
              <TextT size={18} />
              <span className="absolute left-16 top-1.5 bg-zinc-900 border border-zinc-800 text-zinc-200 text-[10px] px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-50">Typography Spec</span>
            </button>

            <button
              onClick={() => setActiveSection('shape')}
              className={`p-2 rounded-lg cursor-pointer transition-colors relative group ${activeSection === 'shape' ? 'text-teal-400 bg-zinc-900 border border-zinc-800' : 'text-zinc-500 hover:text-zinc-300'}`}
              title="Shape, Radius & Blur"
            >
              <SquareHalf size={18} />
              <span className="absolute left-16 top-1.5 bg-zinc-900 border border-zinc-800 text-zinc-200 text-[10px] px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-50">Shape & Elevation</span>
            </button>

            <button
              onClick={() => setActiveSection('components')}
              className={`p-2 rounded-lg cursor-pointer transition-colors relative group ${activeSection === 'components' ? 'text-teal-400 bg-zinc-900 border border-zinc-800' : 'text-zinc-500 hover:text-zinc-300'}`}
              title="Components Presets"
            >
              <List size={18} />
              <span className="absolute left-16 top-1.5 bg-zinc-900 border border-zinc-800 text-zinc-200 text-[10px] px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-50">Component Blueprints</span>
            </button>

            <button
              onClick={() => setActiveSection('motion')}
              className={`p-2 rounded-lg cursor-pointer transition-colors relative group ${activeSection === 'motion' ? 'text-teal-400 bg-zinc-900 border border-zinc-800' : 'text-zinc-500 hover:text-zinc-300'}`}
              title="Motion & Easings"
            >
              <Clock size={18} />
              <span className="absolute left-16 top-1.5 bg-zinc-900 border border-zinc-800 text-zinc-200 text-[10px] px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-50">Motion & Easings</span>
            </button>
          </div>
          
          <div className="text-zinc-700 text-[9px] font-mono leading-none tracking-widest text-center select-none rotate-180 writing-mode-vertical">
            SAMI VER 1.0.1
          </div>
        </div>

        {/* Core parameters details scroll panel */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* SECTION: PRESETS */}
          {activeSection === 'presets' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono mb-1">Visual Presets</h2>
                <p className="text-xs text-zinc-500">Fork an award-winning design system base. Customize parameters inside other sections.</p>
              </div>

              {/* App Brand Name */}
              <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono">APP NAME</span>
                <input
                  type="text"
                  value={tokens.appName}
                  onChange={(e) => updateToken('appName', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded text-zinc-100 outline-none focus:border-teal-500"
                  placeholder="App Brand Name"
                />
              </div>

              <div className="space-y-2.5">
                {THEME_PRESETS.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    className="p-4 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-teal-500/30 transition-all cursor-pointer flex flex-col gap-2 text-left"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-zinc-200">{preset.name}</span>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-mono text-zinc-400 uppercase">{preset.tokens.components.buttonStyle} button</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-normal">{preset.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-3 h-3 rounded-full border border-zinc-800" style={{ backgroundColor: preset.tokens.colors.light.primary }} />
                      <span className="w-3 h-3 rounded-full border border-zinc-800" style={{ backgroundColor: preset.tokens.colors.light.accent }} />
                      <span className="w-3 h-3 rounded-full border border-zinc-800" style={{ backgroundColor: preset.tokens.colors.light.neutralBg }} />
                      <span className="text-[10px] text-zinc-500 ml-1 font-mono">{preset.tokens.typography.fontHeading}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: COLOR */}
          {activeSection === 'color' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono mb-1">Color Tokens System</h2>
                <p className="text-xs text-zinc-500">Formulate contrast-safe light/dark values for visual elements.</p>
              </div>

              {/* Contrast Diagnostics Cards */}
              <div className="grid grid-cols-2 gap-3">
                {/* Light Mode WCAG checker */}
                <div className={`p-3 rounded-lg bg-zinc-900 border flex flex-col gap-2 ${lightWcag.aa ? 'border-zinc-800' : 'border-rose-500/20'}`}>
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider font-mono">LIGHT CONTRAST</span>
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
                <div className={`p-3 rounded-lg bg-zinc-900 border flex flex-col gap-2 ${darkWcag.aa ? 'border-zinc-800' : 'border-rose-500/20'}`}>
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider font-mono">DARK CONTRAST</span>
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
                <div key={mode} className="space-y-3.5 pt-2 border-t border-zinc-900">
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest font-mono">
                    {mode.toUpperCase()} MODE VARIABLES
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Primary */}
                    <div className="flex flex-col gap-1.5 p-2 bg-zinc-900 rounded">
                      <label className="text-[10px] font-semibold text-zinc-400">Primary Core</label>
                      <div className="flex gap-1.5">
                        <input
                          type="color"
                          value={tokens.colors[mode as 'light' | 'dark'].primary}
                          onChange={(e) => updateToken(`colors.${mode}.primary`, e.target.value)}
                          className="w-7 h-7 rounded border border-zinc-800 bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={tokens.colors[mode as 'light' | 'dark'].primary}
                          onChange={(e) => updateToken(`colors.${mode}.primary`, e.target.value)}
                          className="flex-1 min-w-0 px-2 text-xs font-mono bg-zinc-950 border border-zinc-800 rounded outline-none"
                        />
                      </div>
                    </div>

                    {/* Accent */}
                    <div className="flex flex-col gap-1.5 p-2 bg-zinc-900 rounded">
                      <label className="text-[10px] font-semibold text-zinc-400">Accent Brand</label>
                      <div className="flex gap-1.5">
                        <input
                          type="color"
                          value={tokens.colors[mode as 'light' | 'dark'].accent}
                          onChange={(e) => updateToken(`colors.${mode}.accent`, e.target.value)}
                          className="w-7 h-7 rounded border border-zinc-800 bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={tokens.colors[mode as 'light' | 'dark'].accent}
                          onChange={(e) => updateToken(`colors.${mode}.accent`, e.target.value)}
                          className="flex-1 min-w-0 px-2 text-xs font-mono bg-zinc-950 border border-zinc-800 rounded outline-none"
                        />
                      </div>
                    </div>

                    {/* Neutrals Bg */}
                    <div className="flex flex-col gap-1.5 p-2 bg-zinc-900 rounded">
                      <label className="text-[10px] font-semibold text-zinc-400">Neutral BG Substrate</label>
                      <div className="flex gap-1.5">
                        <input
                          type="color"
                          value={tokens.colors[mode as 'light' | 'dark'].neutralBg}
                          onChange={(e) => updateToken(`colors.${mode}.neutralBg`, e.target.value)}
                          className="w-7 h-7 rounded border border-zinc-800 bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={tokens.colors[mode as 'light' | 'dark'].neutralBg}
                          onChange={(e) => updateToken(`colors.${mode}.neutralBg`, e.target.value)}
                          className="flex-1 min-w-0 px-2 text-xs font-mono bg-zinc-950 border border-zinc-800 rounded outline-none"
                        />
                      </div>
                    </div>

                    {/* Neutrals Card Surface */}
                    <div className="flex flex-col gap-1.5 p-2 bg-zinc-900 rounded">
                      <label className="text-[10px] font-semibold text-zinc-400">Neutral Surface Panel</label>
                      <div className="flex gap-1.5">
                        <input
                          type="color"
                          value={tokens.colors[mode as 'light' | 'dark'].neutralSurface}
                          onChange={(e) => updateToken(`colors.${mode}.neutralSurface`, e.target.value)}
                          className="w-7 h-7 rounded border border-zinc-800 bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={tokens.colors[mode as 'light' | 'dark'].neutralSurface}
                          onChange={(e) => updateToken(`colors.${mode}.neutralSurface`, e.target.value)}
                          className="flex-1 min-w-0 px-2 text-xs font-mono bg-zinc-950 border border-zinc-800 rounded outline-none"
                        />
                      </div>
                    </div>

                    {/* Text Primary */}
                    <div className="flex flex-col gap-1.5 p-2 bg-zinc-900 rounded">
                      <label className="text-[10px] font-semibold text-zinc-400">Text Primary Header</label>
                      <div className="flex gap-1.5">
                        <input
                          type="color"
                          value={tokens.colors[mode as 'light' | 'dark'].textPrimary}
                          onChange={(e) => updateToken(`colors.${mode}.textPrimary`, e.target.value)}
                          className="w-7 h-7 rounded border border-zinc-800 bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={tokens.colors[mode as 'light' | 'dark'].textPrimary}
                          onChange={(e) => updateToken(`colors.${mode}.textPrimary`, e.target.value)}
                          className="flex-1 min-w-0 px-2 text-xs font-mono bg-zinc-950 border border-zinc-800 rounded outline-none"
                        />
                      </div>
                    </div>

                    {/* Neutral Border */}
                    <div className="flex flex-col gap-1.5 p-2 bg-zinc-900 rounded">
                      <label className="text-[10px] font-semibold text-zinc-400">Neutral Separator Line</label>
                      <div className="flex gap-1.5">
                        <input
                          type="color"
                          value={tokens.colors[mode as 'light' | 'dark'].neutralBorder}
                          onChange={(e) => updateToken(`colors.${mode}.neutralBorder`, e.target.value)}
                          className="w-7 h-7 rounded border border-zinc-800 bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={tokens.colors[mode as 'light' | 'dark'].neutralBorder}
                          onChange={(e) => updateToken(`colors.${mode}.neutralBorder`, e.target.value)}
                          className="flex-1 min-w-0 px-2 text-xs font-mono bg-zinc-950 border border-zinc-800 rounded outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shading generated ramp visual display */}
                  <div className="p-3 bg-zinc-950 rounded border border-zinc-900 flex flex-col gap-1.5">
                    <span className="text-[9px] font-bold text-zinc-500 tracking-wider uppercase font-mono">Accent Tint/Shade Ramp</span>
                    <div className="grid grid-cols-10 gap-1 mt-1">
                      {generateColorRamp(tokens.colors[mode as 'light' | 'dark'].accent).map((col, idx) => (
                        <div 
                          key={idx}
                          className="h-6 rounded border border-zinc-900/50 relative group cursor-help"
                          style={{ backgroundColor: col }}
                          title={`Color ramp hex: ${col}`}
                        >
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-zinc-900 border border-zinc-800 text-[9px] font-mono p-1 rounded z-50 text-zinc-200">
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
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono mb-1">Typography Scales</h2>
                <p className="text-xs text-zinc-500">Configure pairing weights, scale ratios, and layout letter tracking.</p>
              </div>

              {/* Pre-paired font families dropdowns */}
              <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 space-y-3.5">
                <span className="text-[9px] font-bold text-teal-400 uppercase tracking-widest font-mono block">Font Pairing Stacks</span>
                
                {/* Heading family */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-zinc-400">Heading Font (Google Font)</label>
                  <select
                    value={tokens.typography.fontHeading}
                    onChange={(e) => updateToken('typography.fontHeading', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded outline-none text-zinc-200"
                  >
                    {FONTS_HEADING.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

                {/* Body family */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-zinc-400">Body Font (Google Font)</label>
                  <select
                    value={tokens.typography.fontBody}
                    onChange={(e) => updateToken('typography.fontBody', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded outline-none text-zinc-200"
                  >
                    {FONTS_BODY.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

                {/* Mono family */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-zinc-400">Mono Font (Google Font)</label>
                  <select
                    value={tokens.typography.fontMono}
                    onChange={(e) => updateToken('typography.fontMono', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded outline-none text-zinc-200"
                  >
                    {FONTS_MONO.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sizing & Metrics Sliders */}
              <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 space-y-4">
                <span className="text-[9px] font-bold text-teal-400 uppercase tracking-widest font-mono block">Metrics Scales & Factor</span>

                {/* scale factor */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[10px] font-semibold text-zinc-400">Modular Scale Ratio</label>
                    <span className="text-xs font-mono font-bold text-teal-400">{tokens.typography.scaleRatio}</span>
                  </div>
                  <input
                    type="range"
                    min="1.1"
                    max="1.618"
                    step="0.05"
                    value={tokens.typography.scaleRatio}
                    onChange={(e) => updateToken('typography.scaleRatio', parseFloat(e.target.value))}
                    className="w-full accent-teal-500 bg-zinc-950 rounded-lg appearance-none h-1.5"
                  />
                  <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
                    <span>1.1 (Compact)</span>
                    <span>1.618 (Golden)</span>
                  </div>
                </div>

                {/* Base font size */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[10px] font-semibold text-zinc-400">Base Font Size (px)</label>
                    <span className="text-xs font-mono font-bold text-teal-400">{tokens.typography.sizeBase}px</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="20"
                    step="1"
                    value={tokens.typography.sizeBase}
                    onChange={(e) => updateToken('typography.sizeBase', parseInt(e.target.value))}
                    className="w-full accent-teal-500 bg-zinc-950 rounded-lg appearance-none h-1.5"
                  />
                </div>

                {/* Line Height and Letter spacing heading */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-semibold text-zinc-400">Letter Spacing H1</label>
                    <input
                      type="text"
                      value={tokens.typography.letterSpacingHeading}
                      onChange={(e) => updateToken('typography.letterSpacingHeading', e.target.value)}
                      className="w-full px-2 py-1 text-xs font-mono bg-zinc-950 border border-zinc-800 rounded outline-none"
                      placeholder="-0.02em"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-semibold text-zinc-400">Line Height H1</label>
                    <input
                      type="number"
                      step="0.05"
                      value={tokens.typography.lineHeightHeading}
                      onChange={(e) => updateToken('typography.lineHeightHeading', parseFloat(e.target.value))}
                      className="w-full px-2 py-1 text-xs font-mono bg-zinc-950 border border-zinc-800 rounded outline-none"
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
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono mb-1">Shape & Elevation</h2>
                <p className="text-xs text-zinc-500">Regulate layout corner curvatures, border outlines, and ambient shadow structures.</p>
              </div>

              <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 space-y-4">
                {/* Border radius base */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[10px] font-semibold text-zinc-400">Base Corner Radius (px)</label>
                    <span className="text-xs font-mono font-bold text-teal-400">{tokens.shape.radiusBase}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="28"
                    step="2"
                    value={tokens.shape.radiusBase}
                    onChange={(e) => updateToken('shape.radiusBase', parseInt(e.target.value))}
                    className="w-full accent-teal-500 bg-zinc-950 rounded-lg appearance-none h-1.5"
                  />
                  <div className="flex justify-between text-[8px] text-zinc-500 font-mono">
                    <span>0px (Hard 90°)</span>
                    <span>28px (Fluid Bubble)</span>
                  </div>
                </div>

                {/* Border width base */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[10px] font-semibold text-zinc-400">Hairline Border Width (px)</label>
                    <span className="text-xs font-mono font-bold text-teal-400">{tokens.shape.borderWidth}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    step="1"
                    value={tokens.shape.borderWidth}
                    onChange={(e) => updateToken('shape.borderWidth', parseInt(e.target.value))}
                    className="w-full accent-teal-500 bg-zinc-950 rounded-lg appearance-none h-1.5"
                  />
                </div>

                {/* Shadow Intensity */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[10px] font-semibold text-zinc-400">Ambient Shadow Intensity (%)</label>
                    <span className="text-xs font-mono font-bold text-teal-400">{tokens.shape.shadowIntensity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    step="5"
                    value={tokens.shape.shadowIntensity}
                    onChange={(e) => updateToken('shape.shadowIntensity', parseInt(e.target.value))}
                    className="w-full accent-teal-500 bg-zinc-950 rounded-lg appearance-none h-1.5"
                  />
                </div>

                {/* Backdrop glass blur */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[10px] font-semibold text-zinc-400">Backdrop Glass Blur (px)</label>
                    <span className="text-xs font-mono font-bold text-teal-400">{tokens.shape.backdropBlur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    step="2"
                    value={tokens.shape.backdropBlur}
                    onChange={(e) => updateToken('shape.backdropBlur', parseInt(e.target.value))}
                    className="w-full accent-teal-500 bg-zinc-950 rounded-lg appearance-none h-1.5"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION: COMPONENTS BLUEPRINT */}
          {activeSection === 'components' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono mb-1">Component Blueprints</h2>
                <p className="text-xs text-zinc-500">Configure layout behavior on the primitive level to direct consistent design blocks.</p>
              </div>

              <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 space-y-4">
                {/* Button archetype */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">Button Blueprint style</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {(['flat', 'pill', 'double-bezel', 'tactile'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => updateToken('components.buttonStyle', style)}
                        className={`px-3 py-2 rounded text-left border cursor-pointer transition-all capitalize font-semibold ${tokens.components.buttonStyle === style ? 'bg-teal-500/10 border-teal-500 text-teal-400' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'}`}
                      >
                        {style.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card blueprint */}
                <div className="flex flex-col gap-2 pt-2 border-t border-zinc-950">
                  <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">Card Frame style</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {(['flat', 'bordered', 'elevated', 'double-bezel'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => updateToken('components.cardStyle', style)}
                        className={`px-3 py-2 rounded text-left border cursor-pointer transition-all capitalize font-semibold ${tokens.components.cardStyle === style ? 'bg-teal-500/10 border-teal-500 text-teal-400' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'}`}
                      >
                        {style.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input fields */}
                <div className="flex flex-col gap-2 pt-2 border-t border-zinc-950">
                  <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">Input Form Field style</label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {(['underlined', 'filled', 'bordered'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => updateToken('components.inputStyle', style)}
                        className={`px-2 py-2 rounded text-center border cursor-pointer transition-all capitalize font-semibold ${tokens.components.inputStyle === style ? 'bg-teal-500/10 border-teal-500 text-teal-400' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'}`}
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
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono mb-1">Motion & Easings</h2>
                <p className="text-xs text-zinc-500">Inject smooth physical animation states with cubic timing configurations.</p>
              </div>

              <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 space-y-4">
                {/* Fast duration */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[10px] font-semibold text-zinc-400">Interaction Feedback (Fast, ms)</label>
                    <span className="text-xs font-mono font-bold text-teal-400">{tokens.motion.durationFast}ms</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    step="10"
                    value={tokens.motion.durationFast}
                    onChange={(e) => updateToken('motion.durationFast', parseInt(e.target.value))}
                    className="w-full accent-teal-500 bg-zinc-950 rounded-lg appearance-none h-1.5"
                  />
                </div>

                {/* Normal duration */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[10px] font-semibold text-zinc-400">Structural Transition (Normal, ms)</label>
                    <span className="text-xs font-mono font-bold text-teal-400">{tokens.motion.durationNormal}ms</span>
                  </div>
                  <input
                    type="range"
                    min="150"
                    max="450"
                    step="10"
                    value={tokens.motion.durationNormal}
                    onChange={(e) => updateToken('motion.durationNormal', parseInt(e.target.value))}
                    className="w-full accent-teal-500 bg-zinc-950 rounded-lg appearance-none h-1.5"
                  />
                </div>

                {/* Easing timing function */}
                <div className="flex flex-col gap-1.5 pt-2 border-t border-zinc-950">
                  <label className="text-[10px] font-semibold text-zinc-400">Cubic Bezier Easing Function</label>
                  <input
                    type="text"
                    value={tokens.motion.easing}
                    onChange={(e) => updateToken('motion.easing', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs font-mono bg-zinc-950 border border-zinc-800 rounded outline-none text-teal-400"
                    placeholder="cubic-bezier(...)"
                  />
                  <div className="flex flex-wrap gap-1 mt-1">
                    <button
                      onClick={() => updateToken('motion.easing', 'cubic-bezier(0.16, 1, 0.3, 1)')}
                      className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 cursor-pointer"
                    >
                      easeOutExpo
                    </button>
                    <button
                      onClick={() => updateToken('motion.easing', 'cubic-bezier(0.34, 1.56, 0.64, 1)')}
                      className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 cursor-pointer"
                    >
                      backOut
                    </button>
                    <button
                      onClick={() => updateToken('motion.easing', 'cubic-bezier(0.25, 1, 0.5, 1)')}
                      className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 cursor-pointer"
                    >
                      easeOutQuad
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
