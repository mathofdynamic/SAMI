import React, { useState } from 'react';
import { DesignTokens } from '../types';
import { 
  generateDesignMd, 
  generateTokensJson, 
  generateThemeCss, 
  generateAgentPrompt 
} from '../utils';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  FileCode, 
  FileHtml, 
  FileText, 
  ClipboardText 
} from '@phosphor-icons/react';

interface ExportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: DesignTokens;
}

export const ExportDrawer: React.FC<ExportDrawerProps> = ({ isOpen, onClose, tokens }) => {
  const [activeTab, setActiveTab] = useState<'design_md' | 'tokens_json' | 'theme_css' | 'agent_prompt'>('design_md');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

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
      default: return designMd;
    }
  };

  const getFileName = () => {
    const safeName = tokens.appName.toLowerCase().replace(/ /g, '-');
    switch (activeTab) {
      case 'tokens_json': return `${safeName}-tokens.json`;
      case 'theme_css': return `${safeName}-theme.css`;
      case 'agent_prompt': return `${safeName}-agent-prompt.txt`;
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
        </div>

        {/* Code Content Scroll View */}
        <div className="flex-1 p-5 overflow-hidden flex flex-col gap-4 bg-zinc-900/40">
          <div className="flex-1 rounded-xl bg-zinc-950 border border-zinc-900 p-4 overflow-y-auto font-mono text-[11px] leading-relaxed text-zinc-300 relative">
            <pre className="whitespace-pre-wrap select-text">{getActiveContent()}</pre>
          </div>
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
