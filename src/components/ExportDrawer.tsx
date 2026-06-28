import React, { useState } from 'react';
import { DesignTokens } from '../types';
import { 
  generateDesignMd, 
  generateTokensJson, 
  generateThemeCss, 
  generateAgentPrompt,
  getContrastRatio,
  getHexSaturation,
  getHexHue
} from '../utils';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  FileCode, 
  FileHtml, 
  FileText, 
  ClipboardText,
  ShieldCheck
} from '@phosphor-icons/react';

interface ExportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: DesignTokens;
}

export const ExportDrawer: React.FC<ExportDrawerProps> = ({ isOpen, onClose, tokens }) => {
  const [activeTab, setActiveTab] = useState<'design_md' | 'tokens_json' | 'theme_css' | 'agent_prompt' | 'slop_audit'>('design_md');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Slop Audit live calculations
  const satLight = getHexSaturation(tokens.colors.light.accent);
  const satDark = getHexSaturation(tokens.colors.dark.accent);
  const accentSatPassed = satLight < 80 && satDark < 80;

  const headingFontLower = tokens.typography.fontHeading.toLowerCase();
  const bannedFonts = ['inter', 'roboto', 'arial', 'open sans', 'helvetica'];
  const headingFontPassed = !bannedFonts.some(f => headingFontLower.includes(f));

  const lightBgPure = tokens.colors.light.neutralBg.toLowerCase() === '#ffffff';
  const lightTextPure = tokens.colors.light.textPrimary.toLowerCase() === '#000000';
  const darkBgPure = tokens.colors.dark.neutralBg.toLowerCase() === '#000000';
  const darkTextPure = tokens.colors.dark.textPrimary.toLowerCase() === '#ffffff';
  const pureColorPassed = !lightBgPure && !lightTextPure && !darkBgPure && !darkTextPure;

  const lightContrast = getContrastRatio(tokens.colors.light.textPrimary, tokens.colors.light.neutralBg);
  const lightTextContrastPassed = lightContrast >= 4.5;

  const darkContrast = getContrastRatio(tokens.colors.dark.textPrimary, tokens.colors.dark.neutralBg);
  const darkTextContrastPassed = darkContrast >= 4.5;

  const buttonContrastLight = getContrastRatio(tokens.colors.light.accent, tokens.colors.light.neutralBg);
  const buttonContrastDark = getContrastRatio(tokens.colors.dark.accent, tokens.colors.dark.neutralBg);
  const buttonContrastPassed = buttonContrastLight >= 4.5 && buttonContrastDark >= 4.5;

  const hueLight = getHexHue(tokens.colors.light.accent);
  const hueDark = getHexHue(tokens.colors.dark.accent);
  const hueDiff = Math.abs(hueLight - hueDark);
  const hueDiffNormalized = hueDiff > 180 ? 360 - hueDiff : hueDiff;
  const singleAccentPassed = hueDiffNormalized <= 30;

  const auditItems = [
    {
      id: 'accent-saturation',
      name: 'Accent saturation < 80%',
      passed: accentSatPassed,
      value: `Light: ${satLight}%, Dark: ${satDark}%`,
      tip: 'Reduce accent saturation below 80% to blend beautifully with neutrals.',
    },
    {
      id: 'heading-font',
      name: 'Premium Heading Font',
      passed: headingFontPassed,
      value: tokens.typography.fontHeading,
      tip: 'Avoid generic fonts like Inter, Roboto, Arial, Open Sans, or Helvetica.',
    },
    {
      id: 'pure-colors',
      name: 'No pure #000000 or #ffffff',
      passed: pureColorPassed,
      value: `Bg: ${tokens.colors.light.neutralBg}/${tokens.colors.dark.neutralBg}`,
      tip: 'Avoid pure black/white; use soft off-whites and rich charcoals.',
    },
    {
      id: 'light-text-contrast',
      name: 'Light Text Contrast >= 4.5:1',
      passed: lightTextContrastPassed,
      value: `${lightContrast.toFixed(2)}:1`,
      tip: 'Increase contrast between text and light background for WCAG AA compliance.',
    },
    {
      id: 'dark-text-contrast',
      name: 'Dark Text Contrast >= 4.5:1',
      passed: darkTextContrastPassed,
      value: `${darkContrast.toFixed(2)}:1`,
      tip: 'Increase contrast between text and dark background for WCAG AA compliance.',
    },
    {
      id: 'button-contrast',
      name: 'Button Text vs Fill Contrast >= 4.5:1',
      passed: buttonContrastPassed,
      value: `Light: ${buttonContrastLight.toFixed(2)}:1, Dark: ${buttonContrastDark.toFixed(2)}:1`,
      tip: 'Ensure the accent button fill and label have high contrast ratio.',
    },
    {
      id: 'single-accent',
      name: 'Unified Brand Accent Hue',
      passed: singleAccentPassed,
      value: `Hue Diff: ${hueDiffNormalized.toFixed(0)}°`,
      tip: 'Light and Dark accents should share a single cohesive brand hue (diff <= 30°).',
    }
  ];

  const warnCount = auditItems.filter(item => !item.passed).length;

  // Generate contents
  const designMd = generateDesignMd(tokens);
  const tokensJson = generateTokensJson(tokens);
  const themeCss = generateThemeCss(tokens);
  const agentPrompt = generateAgentPrompt(tokens);

  const getActiveContent = () => {
    switch (activeTab) {
      case 'tokens_json': return tokensJson;
      case 'theme_css': return themeCss;
      case 'agent_prompt': return agentPrompt;
      case 'slop_audit': return `SAMI SLOP AUDIT REPORT // ${7 - warnCount} / 7 PASSED\n\n` + auditItems.map(item => `${item.passed ? '[PASS]' : '[WARN]'} ${item.name} (${item.value})\n${!item.passed ? `Fix Brief: ${item.tip}\n` : ''}`).join('\n');
      default: return designMd;
    }
  };

  const getFileName = () => {
    const safeName = tokens.appName.toLowerCase().replace(/ /g, '-');
    switch (activeTab) {
      case 'tokens_json': return `${safeName}-tokens.json`;
      case 'theme_css': return `${safeName}-theme.css`;
      case 'agent_prompt': return `${safeName}-agent-prompt.txt`;
      case 'slop_audit': return `${safeName}-audit-report.txt`;
      default: return `${safeName}-design.md`;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([getActiveContent()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = getFileName();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-zinc-950 border border-zinc-900 rounded-2xl w-full max-w-3xl flex flex-col h-[600px] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-zinc-900 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Download size={16} weight="bold" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">Export Design Spec Bundle</h2>
              <p className="text-[10px] text-zinc-500 font-mono">APP ARCHETYPE // {tokens.appName.toUpperCase()}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <X size={16} weight="bold" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex px-4 py-2 border-b border-zinc-900 gap-1 bg-zinc-950/40">
          <button
            onClick={() => setActiveTab('design_md')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${activeTab === 'design_md' ? 'bg-zinc-900 text-teal-400 border border-zinc-800' : 'text-zinc-400 hover:text-zinc-200 border border-transparent'}`}
          >
            <FileText size={14} />
            <span>DESIGN.md Spec</span>
          </button>
          <button
            onClick={() => setActiveTab('tokens_json')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${activeTab === 'tokens_json' ? 'bg-zinc-900 text-teal-400 border border-zinc-800' : 'text-zinc-400 hover:text-zinc-200 border border-transparent'}`}
          >
            <FileCode size={14} />
            <span>design-tokens.json</span>
          </button>
          <button
            onClick={() => setActiveTab('theme_css')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${activeTab === 'theme_css' ? 'bg-zinc-900 text-teal-400 border border-zinc-800' : 'text-zinc-400 hover:text-zinc-200 border border-transparent'}`}
          >
            <FileHtml size={14} />
            <span>theme.css</span>
          </button>
          <button
            onClick={() => setActiveTab('agent_prompt')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${activeTab === 'agent_prompt' ? 'bg-zinc-900 text-teal-400 border border-zinc-800' : 'text-zinc-400 hover:text-zinc-200 border border-transparent'}`}
          >
            <ClipboardText size={14} />
            <span>Agent Prompt</span>
          </button>
          <button
            onClick={() => setActiveTab('slop_audit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors relative ${activeTab === 'slop_audit' ? 'bg-zinc-900 text-teal-400 border border-zinc-800' : 'text-zinc-400 hover:text-zinc-200 border border-transparent'}`}
          >
            <ShieldCheck size={14} />
            <span>Slop Audit</span>
            {warnCount > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse ml-0.5" />
            )}
          </button>
        </div>

        {/* Code Content Scroll View */}
        <div className="flex-1 p-5 overflow-hidden flex flex-col gap-4 bg-zinc-900/40">
          {activeTab === 'slop_audit' ? (
            <div className="flex-1 overflow-y-auto space-y-4">
              <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                    <ShieldCheck size={20} weight="bold" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">Taste Audit Engine Report</h3>
                    <p className="text-[11px] text-zinc-500 font-mono">COMPLIANCE // {7 - warnCount} OF 7 CHECKS PASSED</p>
                  </div>
                </div>
                <div className="w-32 bg-zinc-900 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-teal-500 transition-all duration-500" 
                    style={{ width: `${((7 - warnCount) / 7) * 100}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {auditItems.map((item) => (
                  <div 
                    key={item.id}
                    className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 flex flex-col gap-2.5"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <h4 className="text-xs font-bold text-zinc-200">{item.name}</h4>
                        <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Value: {item.value}</p>
                      </div>
                      {item.passed ? (
                        <span className="shrink-0 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-bold uppercase tracking-wider border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Pass
                        </span>
                      ) : (
                        <span className="shrink-0 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[9px] font-bold uppercase tracking-wider border border-amber-500/20 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          Warn
                        </span>
                      )}
                    </div>
                    {!item.passed && (
                      <div className="text-[10px] text-zinc-400 bg-zinc-900/40 p-2.5 rounded-lg border border-zinc-800/50 leading-relaxed">
                        <span className="text-amber-400 font-bold font-mono">FIX BRIEF // </span>
                        {item.tip}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 rounded-xl bg-zinc-950 border border-zinc-900 p-4 overflow-y-auto font-mono text-[11px] leading-relaxed text-zinc-300 relative">
              <pre className="whitespace-pre-wrap select-text">{getActiveContent()}</pre>
            </div>
          )}
        </div>

        {/* Action Tray */}
        <div className="px-6 py-4.5 border-t border-zinc-900 flex items-center justify-between bg-zinc-950">
          <div className="text-xs text-zinc-500 font-mono">
            FILE SIZE: {new Blob([getActiveContent()]).size} BYTES
          </div>
          <div className="flex gap-2.5">
            {/* Copy to Clipboard */}
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              {copied ? (
                <>
                  <Check size={14} weight="bold" className="text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Clipboard</span>
                </>
              )}
            </button>

            {/* Download File */}
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-400 active:bg-teal-600 text-zinc-950 text-xs font-bold rounded-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Download size={14} weight="bold" />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
