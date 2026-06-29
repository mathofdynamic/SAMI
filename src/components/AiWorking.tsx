import React, { useEffect, useState } from 'react';
import { tr, Lang } from '../i18n';

interface AiWorkingProps {
  active: boolean;
  lang: Lang;
  label?: string;
}

// Professional "AI is working" overlay: backdrop blur + scanning line + pulsing
// glow border + rotating status text. Themed with the studio --ui-* vars; mount
// inside a position:relative container so it covers just that region.
export const AiWorking: React.FC<AiWorkingProps> = ({ active, lang, label }) => {
  const steps = [
    tr(lang, 'Analyzing intent...', 'در حال تحلیل خواسته...'),
    tr(lang, 'Composing palette...', 'در حال ساخت پالت...'),
    tr(lang, 'Tuning typography...', 'در حال تنظیم تایپوگرافی...'),
    tr(lang, 'Assembling layout...', 'در حال چیدمان...'),
    tr(lang, 'Rendering...', 'در حال رندر...'),
  ];
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!active) { setI(0); return; }
    const id = setInterval(() => setI((p) => (p + 1) % steps.length), 1100);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  if (!active) return null;

  return (
    <div
      className="absolute inset-0 z-40 flex flex-col items-center justify-center ai-glow animate-fadeIn overflow-hidden"
      style={{ background: 'color-mix(in srgb, var(--ui-bg) 76%, transparent)', backdropFilter: 'blur(3px)' }}
    >
      <div className="ai-scan absolute inset-0 pointer-events-none" />
      <div className="relative flex flex-col items-center gap-3 px-6 text-center">
        <div className="w-11 h-11 rounded-full border-2 border-[var(--ui-border)] border-t-[var(--ui-fg)] animate-spin" />
        <div className="text-xs font-mono font-bold text-[var(--ui-fg)]">
          {label || tr(lang, 'AI is working', 'هوش مصنوعی در حال کار است')}
        </div>
        <div className="text-[10px] font-mono text-[var(--ui-muted)] ai-shimmer">{steps[i]}</div>
      </div>
    </div>
  );
};
