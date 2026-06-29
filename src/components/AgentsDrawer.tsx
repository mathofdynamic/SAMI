import React, { useState } from 'react';
import { DesignTokens } from '../types';
import { tr, Lang } from '../i18n';
import { X, Copy, Check, Robot, Terminal, Plugs } from '@phosphor-icons/react';

const API = 'https://smart-aesthetic-management-interface.pages.dev/api';
const SITE = 'https://smart-aesthetic-management-interface.pages.dev';

interface AgentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: DesignTokens;
  activePresetId: string | null;
  lang: Lang;
}

// Small copy-to-clipboard control themed with the studio chrome vars.
const Copyable: React.FC<{ text: string; label: string }> = ({ text, label }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded bg-[var(--ui-surface2)] hover:opacity-90 text-[var(--ui-fg)] text-[10px] font-mono font-bold cursor-pointer transition-opacity"
    >
      {copied ? <Check size={12} weight="bold" /> : <Copy size={12} />}
      {copied ? 'OK' : label}
    </button>
  );
};

const Block: React.FC<{ children: React.ReactNode; copy: string; copyLabel: string }> = ({ children, copy, copyLabel }) => (
  <div className="relative rounded-lg bg-[var(--ui-bg)] border border-[var(--ui-border)] p-3 pe-14">
    <pre className="whitespace-pre-wrap break-all font-mono text-[11px] leading-relaxed text-[var(--ui-fg)] select-text" dir="ltr">{children}</pre>
    <div className="absolute top-2 end-2"><Copyable text={copy} label={copyLabel} /></div>
  </div>
);

export const AgentsDrawer: React.FC<AgentsDrawerProps> = ({ isOpen, onClose, tokens, activePresetId, lang }) => {
  if (!isOpen) return null;

  const usingPreset = !!activePresetId;
  const payload = usingPreset ? `{"presetId":"${activePresetId}"}` : JSON.stringify({ tokens });
  const curlCmd = `curl -s -X POST ${API}/generate \\\n  -H "Content-Type: application/json" \\\n  -d '${payload}'`;
  const agentMsg = `Use the SAMI design-system skill to generate my theme. POST ${API}/generate with body: ${payload} . Then write DESIGN.md, design-tokens.json and theme.css into the project and build the UI against them.`;
  const installClaude = `/plugin marketplace add mathofdynamic/SAMI\n/plugin install sami-design@sami`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div
        className="bg-[var(--ui-bg)] text-[var(--ui-fg)] border border-[var(--ui-border)] rounded-2xl w-full max-w-2xl flex flex-col max-h-[85vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--ui-border)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--ui-fg)] text-[var(--ui-bg)] flex items-center justify-center">
              <Robot size={18} weight="bold" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">{tr(lang, 'Use with AI Agents', 'استفاده با عامل‌های هوش مصنوعی')}</h2>
              <p className="text-[10px] text-[var(--ui-muted)] font-mono">{tr(lang, 'Generate your design system from any agent', 'سیستم طراحی خود را از هر عاملی بسازید')}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-[var(--ui-hover)] text-[var(--ui-muted)] hover:text-[var(--ui-fg)] cursor-pointer">
            <X size={16} weight="bold" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Flow */}
          <p className="text-xs text-[var(--ui-muted)] leading-relaxed">
            {tr(lang,
              'SAMI exposes a public API that turns design tokens into five build-ready files: DESIGN.md, design-tokens.json, theme.css, an agent prompt, and a slop audit. Install the skill in your agent, then have it call the API to lock a consistent theme before building any UI.',
              'سامی یک API عمومی دارد که توکن‌های طراحی را به پنج فایل آماده تبدیل می‌کند: DESIGN.md، design-tokens.json، theme.css، پرامپت عامل و بازرسی شلختگی. مهارت را در عامل خود نصب کنید تا پیش از ساخت رابط، یک تم منسجم را قفل کند.')}
          </p>

          {/* Install: Claude Code */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--ui-muted)] font-mono">
              <Plugs size={13} /> {tr(lang, 'Install in Claude Code', 'نصب در Claude Code')}
            </div>
            <Block copy={installClaude} copyLabel={tr(lang, 'Copy', 'کپی')}>{installClaude}</Block>
            <p className="text-[10px] text-[var(--ui-muted)]">{tr(lang, 'Then it auto-activates, or run /sami-design:design-system.', 'سپس خودکار فعال می‌شود، یا /sami-design:design-system را اجرا کنید.')}</p>
          </div>

          {/* Install: Codex / others */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--ui-muted)] font-mono">
              <Terminal size={13} /> {tr(lang, 'Codex / other agents', 'Codex / سایر عامل‌ها')}
            </div>
            <p className="text-[11px] text-[var(--ui-muted)]">{tr(lang, 'Point your agent at this skill file (or add it to AGENTS.md):', 'عامل خود را به این فایل مهارت اشاره دهید (یا به AGENTS.md اضافه کنید):')}</p>
            <Block copy={`${SITE}/skill.md`} copyLabel={tr(lang, 'Copy', 'کپی')}>{`${SITE}/skill.md`}</Block>
          </div>

          {/* Live call from current design */}
          <div className="space-y-2 pt-2 border-t border-[var(--ui-border)]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--ui-fg)] font-mono">{tr(lang, 'Your current design as an API call', 'طراحی فعلی شما به‌صورت فراخوان API')}</span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[var(--ui-surface2)] text-[var(--ui-muted)]">
                {usingPreset ? tr(lang, 'preset', 'قالب') + `: ${activePresetId}` : tr(lang, 'custom tokens', 'توکن سفارشی')}
              </span>
            </div>
            <Block copy={curlCmd} copyLabel={tr(lang, 'Copy curl', 'کپی curl')}>{curlCmd}</Block>
            <p className="text-[11px] text-[var(--ui-muted)]">{tr(lang, 'Or paste this instruction to your agent:', 'یا این دستور را به عامل خود بدهید:')}</p>
            <Block copy={agentMsg} copyLabel={tr(lang, 'Copy prompt', 'کپی پرامپت')}>{agentMsg}</Block>
          </div>

          {/* API reference */}
          <div className="space-y-2 pt-2 border-t border-[var(--ui-border)]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--ui-muted)] font-mono">{tr(lang, 'API reference', 'مرجع API')}</span>
            <ul className="space-y-1 font-mono text-[10px] text-[var(--ui-muted)]" dir="ltr">
              <li><span className="text-[var(--ui-fg)]">GET</span>  /api/presets - list starter design systems</li>
              <li><span className="text-[var(--ui-fg)]">GET</span>  /api/presets/:id - one preset's tokens</li>
              <li><span className="text-[var(--ui-fg)]">GET</span>  /api/schema - token shape + example</li>
              <li><span className="text-[var(--ui-fg)]">POST</span> /api/generate - body {`{ presetId?, tokens? }`}</li>
              <li className="ps-[3.2rem]">?format=design-md | tokens-json | theme-css | agent-prompt | slop-audit</li>
              <li className="pt-1.5"><span className="text-[var(--ui-fg)]">POST</span> /api/ai/describe - {`{ description }`} {tr(lang, 'to tokens', 'به توکن')}</li>
              <li><span className="text-[var(--ui-fg)]">POST</span> /api/ai/page - {`{ description }`} {tr(lang, 'to page spec', 'به صفحه')}</li>
              <li><span className="text-[var(--ui-fg)]">POST</span> /api/ai/audit-fix · /api/ai/suggest</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
