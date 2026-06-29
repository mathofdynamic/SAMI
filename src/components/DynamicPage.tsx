import React from 'react';
import { DesignTokens } from '../types';
import { PageSpec, Block } from '../pageSpec';
import { Button, Card, Input, Badge } from './Primitives';
import { Lang } from '../i18n';

interface DynamicPageProps {
  spec: PageSpec;
  tokens: DesignTokens;
  mode?: 'light' | 'dark';
  breakpoint?: 'desktop' | 'tablet' | 'mobile';
  lang?: Lang;
}

// Renders an AI-generated PageSpec with the live design tokens. Text-only (no
// HTML injection); every block maps to a small, on-brand section using the
// shared Primitives so generated pages match the studio's aesthetic.
export const DynamicPage: React.FC<DynamicPageProps> = ({ spec, tokens }) => {
  const bs = tokens.components.buttonStyle;
  const cs = tokens.components.cardStyle;
  const is = tokens.components.inputStyle;
  const heading = 'font-[family-name:var(--font-heading)] tracking-[var(--letter-spacing-heading)]';

  const renderBlock = (b: Block, i: number) => {
    switch (b.type) {
      case 'navbar':
        return (
          <nav key={i} className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
            <span className={`text-sm font-extrabold ${heading}`}>{b.brand || tokens.appName}</span>
            <div className="hidden sm:flex items-center gap-4 text-[11px] text-[var(--text-secondary)]">
              {(b.links || []).map((l, j) => <span key={j} className="hover:text-[var(--text-primary)] cursor-pointer">{l}</span>)}
            </div>
            {b.cta && <Button variant="accent" size="xs" buttonStyle={bs}>{b.cta}</Button>}
          </nav>
        );
      case 'hero':
        return (
          <section key={i} className={`px-6 py-12 sm:py-16 flex flex-col gap-4 ${b.align === 'left' ? 'items-start text-start' : 'items-center text-center'} max-w-3xl mx-auto`}>
            {b.eyebrow && <Badge variant="accent">{b.eyebrow}</Badge>}
            <h1 className={`text-3xl sm:text-4xl font-extrabold leading-[1.05] ${heading}`} style={{ fontWeight: tokens.typography.weightHeading as any }}>{b.headline}</h1>
            {b.subhead && <p className="text-sm text-[var(--text-secondary)] max-w-[50ch] leading-relaxed">{b.subhead}</p>}
            <div className={`flex flex-wrap gap-2.5 mt-2 ${b.align === 'left' ? '' : 'justify-center'}`}>
              {b.primaryCta && <Button variant="accent" buttonStyle={bs}>{b.primaryCta}</Button>}
              {b.secondaryCta && <Button variant="outline" buttonStyle={bs}>{b.secondaryCta}</Button>}
            </div>
          </section>
        );
      case 'features':
        return (
          <section key={i} className="px-6 py-10 max-w-4xl mx-auto w-full">
            {b.title && <h2 className={`text-xl font-bold mb-6 ${heading}`}>{b.title}</h2>}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(b.items || []).map((it, j) => (
                <Card key={j} cardStyle={cs} className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col gap-1.5">
                  <span className={`text-sm font-bold ${heading}`}>{it.title}</span>
                  {it.body && <span className="text-xs text-[var(--text-secondary)] leading-relaxed">{it.body}</span>}
                </Card>
              ))}
            </div>
          </section>
        );
      case 'stats':
        return (
          <section key={i} className="px-6 py-10 max-w-4xl mx-auto w-full">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(b.items || []).map((it, j) => (
                <div key={j} className="flex flex-col items-center text-center gap-1">
                  <span className={`text-2xl sm:text-3xl font-extrabold text-[var(--color-accent)] font-[family-name:var(--font-mono)]`}>{it.value}</span>
                  <span className="text-[11px] text-[var(--text-secondary)]">{it.label}</span>
                </div>
              ))}
            </div>
          </section>
        );
      case 'logos':
        return (
          <section key={i} className="px-6 py-8 max-w-4xl mx-auto w-full flex flex-col items-center gap-3">
            {b.title && <span className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] font-mono">{b.title}</span>}
            <div className="flex flex-wrap justify-center gap-2.5">
              {(b.items || []).map((it, j) => <Badge key={j} variant="secondary">{it.label}</Badge>)}
            </div>
          </section>
        );
      case 'testimonial':
        return (
          <section key={i} className="px-6 py-12 max-w-2xl mx-auto w-full text-center flex flex-col gap-4">
            <p className={`text-lg sm:text-xl font-medium leading-snug ${heading}`}>“{b.quote}”</p>
            {(b.author || b.role) && (
              <div className="text-xs text-[var(--text-secondary)]">
                <span className="font-bold text-[var(--text-primary)]">{b.author}</span>{b.author && b.role ? ' · ' : ''}{b.role}
              </div>
            )}
          </section>
        );
      case 'pricing':
        return (
          <section key={i} className="px-6 py-10 max-w-3xl mx-auto w-full">
            {b.title && <h2 className={`text-xl font-bold mb-6 text-center ${heading}`}>{b.title}</h2>}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(b.tiers || []).map((t, j) => (
                <Card key={j} cardStyle={cs} className={`p-4 flex flex-col gap-3 bg-[var(--color-surface)] border ${t.highlighted ? 'border-2 border-[var(--color-accent)]' : 'border-[var(--color-border)]'}`}>
                  <div>
                    <div className={`text-sm font-bold ${heading}`}>{t.name}</div>
                    <div className="text-2xl font-extrabold font-[family-name:var(--font-mono)] mt-1">{t.price}<span className="text-[10px] text-[var(--text-secondary)] font-normal">{t.period}</span></div>
                  </div>
                  <ul className="flex flex-col gap-1 text-[11px] text-[var(--text-secondary)] border-t border-[var(--color-border)]/60 pt-2.5">
                    {(t.features || []).map((f, k) => <li key={k}>• {f}</li>)}
                  </ul>
                  {t.cta && <Button variant={t.highlighted ? 'accent' : 'outline'} size="sm" buttonStyle={bs} className="w-full justify-center mt-auto">{t.cta}</Button>}
                </Card>
              ))}
            </div>
          </section>
        );
      case 'form':
        return (
          <section key={i} className="px-6 py-10 max-w-md mx-auto w-full">
            <Card cardStyle={cs} className="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col gap-3">
              {b.title && <h3 className={`text-base font-bold ${heading}`}>{b.title}</h3>}
              {(b.fields || []).map((f, j) => <Input key={j} label={f.label} type={f.type} placeholder={f.placeholder} inputStyle={is} className="text-xs" />)}
              <Button variant="accent" buttonStyle={bs} className="w-full justify-center mt-1">{b.submit}</Button>
            </Card>
          </section>
        );
      case 'gallery':
        return (
          <section key={i} className="px-6 py-10 max-w-4xl mx-auto w-full">
            {b.title && <h2 className={`text-xl font-bold mb-6 ${heading}`}>{b.title}</h2>}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(b.items || []).map((it, j) => (
                <div key={j} className="rounded-[var(--radius-md)] border border-[var(--color-border)] overflow-hidden bg-[var(--color-surface)]">
                  <div className="aspect-video bg-[var(--color-border)]/40 flex items-center justify-center text-[var(--text-secondary)] text-2xl font-[family-name:var(--font-heading)]">{(it.title || '·').charAt(0)}</div>
                  <div className="p-2">
                    <div className="text-[11px] font-bold truncate">{it.title}</div>
                    {it.caption && <div className="text-[9px] text-[var(--text-secondary)] truncate">{it.caption}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'cta':
        return (
          <section key={i} className="px-6 py-12 m-6 rounded-[var(--radius-lg)] bg-[var(--color-primary)] text-[var(--color-bg)] flex flex-col items-center text-center gap-3">
            <h2 className={`text-xl sm:text-2xl font-extrabold ${heading}`}>{b.headline}</h2>
            {b.subhead && <p className="text-sm opacity-80 max-w-[45ch]">{b.subhead}</p>}
            {b.button && <Button variant="accent" buttonStyle={bs} className="mt-2">{b.button}</Button>}
          </section>
        );
      case 'footer':
        return (
          <footer key={i} className="px-6 py-8 border-t border-[var(--color-border)] bg-[var(--color-surface)] mt-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {(b.columns || []).map((c, j) => (
                <div key={j} className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold">{c.title}</span>
                  {(c.links || []).map((l, k) => <span key={k} className="text-[10px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer">{l}</span>)}
                </div>
              ))}
            </div>
            {b.copyright && <div className="text-[10px] text-[var(--text-secondary)] text-center mt-6">{b.copyright}</div>}
          </footer>
        );
      case 'text':
        return (
          <section key={i} className="px-6 py-8 max-w-2xl mx-auto w-full flex flex-col gap-2">
            {b.title && <h2 className={`text-lg font-bold ${heading}`}>{b.title}</h2>}
            {b.body && <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{b.body}</p>}
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-[var(--color-bg)] text-[var(--text-primary)] font-[family-name:var(--font-body)] transition-colors flex flex-col">
      {spec.blocks.map(renderBlock)}
    </div>
  );
};
