import React from 'react';
import { DesignTokens } from '../types';
import { tokensToCssVars } from '../utils';
import { Button, Input, Card, Badge } from './Primitives';
import { t, tr, Lang } from '../i18n';

type Section = 'presets' | 'color' | 'typography' | 'shape' | 'components' | 'motion' | 'dials' | 'audit' | 'ai';

interface PanelPreviewProps {
  tokens: DesignTokens;
  mode: 'light' | 'dark';
  section: Section;
  lang: Lang;
}

// Compact, always-visible preview pinned at the bottom of the editor. It renders
// real samples using the live design tokens (scoped via tokensToCssVars) so users
// see the effect of their changes right under the controls.
export const PanelPreview: React.FC<PanelPreviewProps> = ({ tokens, mode, section, lang }) => {
  const cssVars = tokensToCssVars(tokens, mode, lang === 'fa') as React.CSSProperties;
  const swatches: Array<[string, string]> = [
    ['Primary', 'var(--color-primary)'],
    ['Accent', 'var(--color-accent)'],
    ['BG', 'var(--color-bg)'],
    ['Surface', 'var(--color-surface)'],
    ['Text', 'var(--text-primary)'],
  ];

  const renderBody = () => {
    switch (section) {
      case 'color':
        return (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              {swatches.map(([label, v]) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <span className="w-7 h-7 rounded-md border border-[var(--color-border)]" style={{ backgroundColor: v }} />
                  <span className="text-[8px] text-[var(--text-secondary)] font-[family-name:var(--font-mono)]">{tr(lang, label, ({ Primary: 'اصلی', Accent: 'تأکید', BG: 'پس‌زمینه', Surface: 'سطح', Text: 'متن' } as Record<string, string>)[label] || label)}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="accent" size="xs" buttonStyle={tokens.components.buttonStyle}>{tr(lang, 'Accent', 'تأکید')}</Button>
              <Badge variant="success">{tr(lang, 'Success', 'موفق')}</Badge>
              <Badge variant="error">{tr(lang, 'Error', 'خطا')}</Badge>
            </div>
          </div>
        );
      case 'typography':
      case 'presets':
        return (
          <div className="flex flex-col gap-1.5">
            <span className="font-[family-name:var(--font-heading)] text-xl tracking-[var(--letter-spacing-heading)] leading-tight" style={{ fontWeight: tokens.typography.weightHeading as any }}>
              {tokens.appName} {tr(lang, 'heading', 'عنوان')}
            </span>
            <span className="font-[family-name:var(--font-body)] text-xs text-[var(--text-secondary)]">
              {tr(lang, 'Body copy renders in', 'متن بدنه با فونت')} {tokens.typography.fontBody}.
            </span>
            <span className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-secondary)]">mono 0123456789</span>
          </div>
        );
      case 'shape':
        return (
          <div className="flex items-center gap-3">
            <Card cardStyle={tokens.components.cardStyle} className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] flex-1">
              <span className="text-[10px] text-[var(--text-secondary)] font-[family-name:var(--font-mono)]">radius {tokens.shape.radiusBase}px</span>
            </Card>
            <Button variant="primary" size="sm" buttonStyle={tokens.components.buttonStyle}>{tr(lang, 'Button', 'دکمه')}</Button>
          </div>
        );
      case 'motion':
        return (
          <div className="flex items-center gap-3">
            <span
              className="inline-block w-3 h-3 rounded-full bg-[var(--color-accent)]"
              style={{ animation: `pulsePreview ${tokens.motion.durationSlow}ms ${tokens.motion.easing} infinite` }}
            />
            <Button variant="accent" size="sm" buttonStyle={tokens.components.buttonStyle}
              style={{ transitionDuration: `${tokens.motion.durationNormal}ms`, transitionTimingFunction: tokens.motion.easing }}>
              {tr(lang, 'Hover me', 'نشانگر را بیاور')}
            </Button>
            <span className="text-[10px] text-[var(--text-secondary)] font-[family-name:var(--font-mono)]">{tokens.motion.durationNormal}ms</span>
          </div>
        );
      case 'dials':
        return (
          <div className="flex items-center gap-2">
            {[['VAR', tokens.dials?.variance], ['MOT', tokens.dials?.motion], ['DEN', tokens.dials?.density]].map(([k, v]) => (
              <div key={k as string} className="flex-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-center">
                <div className="text-[8px] text-[var(--text-secondary)] font-[family-name:var(--font-mono)]">{k}</div>
                <div className="text-sm font-bold font-[family-name:var(--font-heading)]">{v ?? '-'}</div>
              </div>
            ))}
          </div>
        );
      default:
        // components / audit -> show the primitive set
        return (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <Button variant="accent" size="xs" buttonStyle={tokens.components.buttonStyle}>{tr(lang, 'Primary', 'اصلی')}</Button>
              <Button variant="outline" size="xs" buttonStyle={tokens.components.buttonStyle}>{tr(lang, 'Outline', 'خط‌دار')}</Button>
              <Badge variant="accent">{tr(lang, 'Badge', 'نشان')}</Badge>
            </div>
            <Input inputStyle={tokens.components.inputStyle} placeholder={tr(lang, 'Input field', 'فیلد ورودی')} />
          </div>
        );
    }
  };

  return (
    <div className="shrink-0 border-t border-[var(--ui-border)] bg-[var(--ui-bg)]">
      <div className="px-4 pt-2 flex items-center justify-between">
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--ui-muted)] font-mono">{t('preview.live', lang)}</span>
        <span className="text-[9px] text-[var(--ui-muted)] font-mono uppercase">{mode}</span>
      </div>
      <div
        className="m-3 mt-2 rounded-lg border border-[var(--color-border)] p-3 overflow-hidden"
        style={{ ...cssVars, backgroundColor: 'var(--color-bg)', color: 'var(--text-primary)' }}
      >
        {renderBody()}
      </div>
    </div>
  );
};
