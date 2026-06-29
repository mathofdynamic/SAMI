import React, { useState } from 'react';
import { DesignTokens } from '../types';
import {
  generateDesignMd,
  generateTokensJson,
  generateThemeCss,
  generateAgentPrompt,
  generateSlopAudit
} from '../utils';
import { tr, auditText, Lang } from '../i18n';
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
  lang: Lang;
}

export const ExportDrawer: React.FC<ExportDrawerProps> = ({ isOpen, onClose, tokens, lang }) => {
  const [activeTab, setActiveTab] = useState<'design_md' | 'tokens_json' | 'theme_css' | 'agent_prompt' | 'slop_audit'>('design_md');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Slop Audit — shared pure logic (UI translates name/tip by id).
  const audit = generateSlopAudit(tokens);
  const auditItems = audit.items;
  const warnCount = audit.total - audit.passed;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-[var(--ui-bg)] border border-[var(--ui-border)] rounded-2xl w-full max-w-3xl flex flex-col h-[600px] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-[var(--ui-border)] flex items-center justify-between bg-[var(--ui-bg)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--ui-surface2)] border border-[var(--ui-border)] flex items-center justify-center text-[var(--ui-fg)]">
              <Download size={16} weight="bold" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">{tr(lang, 'Export Design Spec Bundle', 'بسته مشخصات طراحی')}</h2>
              <p className="text-[10px] text-[var(--ui-muted)] font-mono">{tr(lang, 'APP ARCHETYPE', 'الگوی برنامه')} // {tokens.appName.toUpperCase()}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-[var(--ui-hover)] text-[var(--ui-muted)] hover:text-[var(--ui-fg)] transition-colors cursor-pointer"
          >
            <X size={16} weight="bold" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex px-4 py-2 border-b border-[var(--ui-border)] gap-1 bg-[var(--ui-bg)]/40">
          <button
            onClick={() => setActiveTab('design_md')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${activeTab === 'design_md' ? 'bg-[var(--ui-surface)] text-[var(--ui-fg)] border border-[var(--ui-border)]' : 'text-[var(--ui-muted)] hover:text-[var(--ui-fg)] border border-transparent'}`}
          >
            <FileText size={14} />
            <span>{tr(lang, 'DESIGN.md Spec', 'مشخصات DESIGN.md')}</span>
          </button>
          <button
            onClick={() => setActiveTab('tokens_json')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${activeTab === 'tokens_json' ? 'bg-[var(--ui-surface)] text-[var(--ui-fg)] border border-[var(--ui-border)]' : 'text-[var(--ui-muted)] hover:text-[var(--ui-fg)] border border-transparent'}`}
          >
            <FileCode size={14} />
            <span>design-tokens.json</span>
          </button>
          <button
            onClick={() => setActiveTab('theme_css')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${activeTab === 'theme_css' ? 'bg-[var(--ui-surface)] text-[var(--ui-fg)] border border-[var(--ui-border)]' : 'text-[var(--ui-muted)] hover:text-[var(--ui-fg)] border border-transparent'}`}
          >
            <FileHtml size={14} />
            <span>theme.css</span>
          </button>
          <button
            onClick={() => setActiveTab('agent_prompt')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${activeTab === 'agent_prompt' ? 'bg-[var(--ui-surface)] text-[var(--ui-fg)] border border-[var(--ui-border)]' : 'text-[var(--ui-muted)] hover:text-[var(--ui-fg)] border border-transparent'}`}
          >
            <ClipboardText size={14} />
            <span>{tr(lang, 'Agent Prompt', 'پرامپت عامل')}</span>
          </button>
          <button
            onClick={() => setActiveTab('slop_audit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors relative ${activeTab === 'slop_audit' ? 'bg-[var(--ui-surface)] text-[var(--ui-fg)] border border-[var(--ui-border)]' : 'text-[var(--ui-muted)] hover:text-[var(--ui-fg)] border border-transparent'}`}
          >
            <ShieldCheck size={14} />
            <span>{tr(lang, 'Slop Audit', 'بازرسی شلختگی')}</span>
            {warnCount > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse ml-0.5" />
            )}
          </button>
        </div>

        {/* Code Content Scroll View */}
        <div className="flex-1 p-5 overflow-hidden flex flex-col gap-4 bg-[var(--ui-surface)]/40">
          {activeTab === 'slop_audit' ? (
            <div className="flex-1 overflow-y-auto space-y-4">
              <div className="p-4 bg-[var(--ui-bg)] border border-[var(--ui-border)] rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--ui-surface2)] border border-[var(--ui-border)] flex items-center justify-center text-[var(--ui-fg)]">
                    <ShieldCheck size={20} weight="bold" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">{tr(lang, 'Taste Audit Engine Report', 'گزارش موتور بازرسی سلیقه')}</h3>
                    <p className="text-[11px] text-[var(--ui-muted)] font-mono">{tr(lang, 'COMPLIANCE', 'انطباق')} // {7 - warnCount} {tr(lang, 'OF 7 CHECKS PASSED', 'از ۷ بررسی قبول')}</p>
                  </div>
                </div>
                <div className="w-32 bg-[var(--ui-surface)] h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[var(--ui-fg)] transition-all duration-500" 
                    style={{ width: `${((7 - warnCount) / 7) * 100}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {auditItems.map((item) => (
                  <div 
                    key={item.id}
                    className="p-4 rounded-xl bg-[var(--ui-bg)] border border-[var(--ui-border)] flex flex-col gap-2.5"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <h4 className="text-xs font-bold text-[var(--ui-fg)]">{auditText(item.id, 'name', lang, item.name)}</h4>
                        <p className="text-[10px] text-[var(--ui-muted)] font-mono mt-0.5">{tr(lang, 'Value', 'مقدار')}: {item.value}</p>
                      </div>
                      {item.passed ? (
                        <span className="shrink-0 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-bold uppercase tracking-wider border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {tr(lang, 'Pass', 'قبول')}
                        </span>
                      ) : (
                        <span className="shrink-0 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[9px] font-bold uppercase tracking-wider border border-amber-500/20 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          {tr(lang, 'Warn', 'هشدار')}
                        </span>
                      )}
                    </div>
                    {!item.passed && (
                      <div className="text-[10px] text-[var(--ui-muted)] bg-[var(--ui-surface)]/40 p-2.5 rounded-lg border border-[var(--ui-border)]/50 leading-relaxed">
                        <span className="text-amber-400 font-bold font-mono">{tr(lang, 'FIX BRIEF // ', 'اصلاح // ')}</span>
                        {auditText(item.id, 'tip', lang, item.tip)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 rounded-xl bg-[var(--ui-bg)] border border-[var(--ui-border)] p-4 overflow-y-auto font-mono text-[11px] leading-relaxed text-[var(--ui-fg)] relative">
              <pre className="whitespace-pre-wrap select-text">{getActiveContent()}</pre>
            </div>
          )}
        </div>

        {/* Action Tray */}
        <div className="px-6 py-4.5 border-t border-[var(--ui-border)] flex items-center justify-between bg-[var(--ui-bg)]">
          <div className="text-xs text-[var(--ui-muted)] font-mono">
            {tr(lang, 'FILE SIZE', 'حجم فایل')}: {new Blob([getActiveContent()]).size} {tr(lang, 'BYTES', 'بایت')}
          </div>
          <div className="flex gap-2.5">
            {/* Copy to Clipboard */}
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-[var(--ui-surface)] hover:bg-[var(--ui-hover)] border border-[var(--ui-border)] text-[var(--ui-fg)] text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95"
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
              className="px-4 py-2 bg-[var(--ui-fg)] hover:opacity-90 text-[var(--ui-bg)] text-xs font-bold rounded-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95"
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
