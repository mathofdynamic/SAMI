import { useState } from 'react';
import { useTokenStore } from './useTokenStore';
import { TokenEditor } from './components/TokenEditor';
import { Canvas } from './components/Canvas';
import { ExportDrawer } from './components/ExportDrawer';
import { 
  Palette, 
  Download, 
  Laptop, 
  Question, 
  Info,
  Sliders
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
  } = useTokenStore();

  const [isExportOpen, setIsExportOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  // High level preset-wrapper with tracking
  const handleSetTokens = (newTokens: any) => {
    // Attempt to track preset_id if we match exactly
    setTokens(newTokens);
  };

  return (
    <main className="w-full min-h-[100dvh] max-h-[100dvh] overflow-hidden flex flex-col bg-zinc-950 font-sans text-zinc-200">
      
      {/* Global Desktop Workspace Header */}
      <header className="h-14 bg-zinc-950 border-b border-zinc-900 flex items-center justify-between px-6 shrink-0 z-30 shadow-md">
        
        {/* Brand logo & title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-zinc-950 shadow-[0_0_15px_rgba(20,184,166,0.35)]">
            <Palette size={18} weight="bold" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold tracking-tight text-sm font-sans uppercase">SAMI</span>
              <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">Visual Design Studio</span>
            </div>
            <span className="text-[9px] text-zinc-500 block leading-none font-mono">APP ARCHETYPE COMPLIANCE LAYER</span>
          </div>
        </div>

        {/* Informative tutorial tooltip guide */}
        <div className="hidden lg:flex items-center gap-2.5 max-w-xl bg-zinc-900/50 border border-zinc-800/80 rounded-full px-4 py-1.5 text-xs text-zinc-400">
          <Info size={14} className="text-teal-400" />
          <span className="truncate">
            Adjust visual tokens on the left. Changes instantly cascade to the 6 showcase frames on the right.
          </span>
        </div>

        {/* Global Toolbar Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer text-xs flex items-center gap-1.5 font-mono"
            title="Read Workspace Manifesto"
          >
            <Question size={14} />
            <span className="hidden sm:inline">Manifesto</span>
          </button>

          <button
            onClick={() => setIsExportOpen(true)}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-400 active:bg-teal-600 text-zinc-950 font-extrabold text-xs rounded-lg flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(20,184,166,0.25)] transition-all"
          >
            <Download size={14} weight="bold" />
            <span>Export DESIGN.md</span>
          </button>
        </div>
      </header>

      {/* Workspace split screens body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Workspace interactive Manifesto overlay */}
        {showGuide && (
          <div className="absolute inset-0 bg-zinc-950/95 backdrop-blur-md z-40 p-6 md:p-12 overflow-y-auto flex flex-col justify-center animate-fadeIn text-left">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                  <Palette size={20} weight="bold" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">SAMI Visual Design Manifesto</h2>
                  <p className="text-xs text-zinc-500 font-mono">COHERENT DOWNSTREAM TRANSLATION</p>
                </div>
              </div>

              <div className="space-y-4 text-xs md:text-sm text-zinc-300 leading-relaxed">
                <p>
                  Named after Sami - a brilliant designer - SAMI does for a developer what an experienced design engineer does for an agile product team: **it defines the visual grammar so everything built afterward remains uniform and beautiful.**
                </p>
                <p>
                  When individuals prompt an AI tool to "build me a website," the model typically invents generic, unsymmetrical, and highly inconsistent layouts. SAMI solves this by front-loading design specs into an unified source of truth:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-zinc-400">
                  <li><strong>The Token Cascade:</strong> Adjust colors, typography weights, letter spacing, corner radius sizes, and button types. Watch these changes propagate instantly across six representative app screens.</li>
                  <li><strong>The Two-Surface Model:</strong> The Design Language Editor (Left Surface) controls the parameters. The infinite-canvas preview (Right Surface) verifies those changes across Landing Page, Telemetry Console, Credentials, Settings, Asset List, and Checkout flows.</li>
                  <li><strong>The Human-AI Hand-Off:</strong> Export a structured <code className="bg-zinc-900 px-1.5 py-0.5 rounded text-teal-400 font-mono">DESIGN.md</code> specification and copy specialized AI guidelines to directly instruct tools (Claude Code, Cursor) to code your visual sign-off without design-drift.</li>
                </ul>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  onClick={() => setShowGuide(false)}
                  className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-bold rounded-lg text-xs cursor-pointer transition-all"
                >
                  Enter Visual Space
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Left/Top Side: Structured Visual Token Editor */}
        <div className="w-full md:w-[380px] lg:w-[410px] shrink-0 h-[45vh] md:h-full relative z-20 border-b md:border-b-0 border-zinc-800">
          <TokenEditor
            tokens={tokens}
            setTokens={handleSetTokens}
            undo={undo}
            redo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
            onReset={resetToPreset}
          />
        </div>

        {/* Right/Bottom Side: Pannable Canvas with Showcase Page grid view */}
        <div className="flex-1 h-[55vh] md:h-full relative z-10">
          <Canvas tokens={tokens} />
        </div>
      </div>

      {/* Export Bundle Modal Drawer */}
      <ExportDrawer
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        tokens={tokens}
      />
    </main>
  );
}
