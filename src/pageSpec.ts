// Declarative page schema for AI-generated showcase pages. The AI returns JSON
// matching (loosely) this shape; `validatePageSpec` hardens it into a safe,
// text-only PageSpec before the renderer ever sees it. Framework-free so the
// Cloudflare Worker (functions/api/ai/page.ts) can import the validator too.

export type BlockType =
  | 'navbar' | 'hero' | 'features' | 'stats' | 'logos' | 'testimonial'
  | 'pricing' | 'form' | 'gallery' | 'cta' | 'footer' | 'text';

export const BLOCK_TYPES: BlockType[] = [
  'navbar', 'hero', 'features', 'stats', 'logos', 'testimonial',
  'pricing', 'form', 'gallery', 'cta', 'footer', 'text',
];

export interface Block {
  type: BlockType;
  // shared / per-type fields (all optional except where the renderer needs them)
  eyebrow?: string;
  headline?: string;
  subhead?: string;
  title?: string;
  body?: string;
  brand?: string;
  cta?: string;
  primaryCta?: string;
  secondaryCta?: string;
  button?: string;
  submit?: string;
  quote?: string;
  author?: string;
  role?: string;
  copyright?: string;
  align?: 'left' | 'center';
  links?: string[];
  items?: Array<{ title?: string; body?: string; value?: string; label?: string; caption?: string }>;
  tiers?: Array<{ name?: string; price?: string; period?: string; features?: string[]; cta?: string; highlighted?: boolean }>;
  fields?: Array<{ label?: string; type?: string; placeholder?: string }>;
  columns?: Array<{ title?: string; links?: string[] }>;
}

export interface PageSpec {
  name: string;
  mode?: 'light' | 'dark';
  blocks: Block[];
}

// Permissive JSON schema handed to Workers AI (JSON mode). The validator below
// is the real guarantee; this just nudges the model toward the right shape.
export const PAGE_JSON_SCHEMA = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    blocks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          eyebrow: { type: 'string' }, headline: { type: 'string' }, subhead: { type: 'string' },
          title: { type: 'string' }, body: { type: 'string' }, brand: { type: 'string' },
          cta: { type: 'string' }, primaryCta: { type: 'string' }, secondaryCta: { type: 'string' },
          button: { type: 'string' }, submit: { type: 'string' },
          quote: { type: 'string' }, author: { type: 'string' }, role: { type: 'string' }, copyright: { type: 'string' },
          links: { type: 'array', items: { type: 'string' } },
          items: { type: 'array', items: { type: 'object' } },
          tiers: { type: 'array', items: { type: 'object' } },
          fields: { type: 'array', items: { type: 'object' } },
          columns: { type: 'array', items: { type: 'object' } },
        },
        required: ['type'],
      },
    },
  },
  required: ['name', 'blocks'],
};

// ---- sanitizers ----
const str = (v: any, max = 240): string =>
  typeof v === 'string' ? v.replace(/[<>]/g, '').trim().slice(0, max) : '';
const arr = (v: any, max: number): any[] => (Array.isArray(v) ? v.slice(0, max) : []);
const bool = (v: any): boolean => v === true || v === 'true';

/**
 * Turn arbitrary (model) input into a safe PageSpec. Unknown block types and
 * blocks missing their essential content are dropped; every string is trimmed,
 * length-capped, and HTML-stripped. Always returns a valid object.
 */
export function validatePageSpec(raw: any): PageSpec {
  const name = str(raw?.name, 60) || 'AI Page';
  const mode = raw?.mode === 'light' || raw?.mode === 'dark' ? raw.mode : undefined;
  const rawBlocks = arr(raw?.blocks, 14);
  const blocks: Block[] = [];

  for (const b of rawBlocks) {
    const type = b?.type;
    if (!BLOCK_TYPES.includes(type)) continue;
    const out: Block = { type };

    switch (type) {
      case 'navbar':
        out.brand = str(b.brand, 40);
        out.links = arr(b.links, 6).map((l: any) => str(l, 24)).filter(Boolean);
        out.cta = str(b.cta, 24);
        break;
      case 'hero':
        out.eyebrow = str(b.eyebrow, 40);
        out.headline = str(b.headline, 90);
        out.subhead = str(b.subhead, 200);
        out.primaryCta = str(b.primaryCta, 28);
        out.secondaryCta = str(b.secondaryCta, 28);
        out.align = b.align === 'left' ? 'left' : 'center';
        if (!out.headline) continue;
        break;
      case 'features':
        out.title = str(b.title, 80);
        out.items = arr(b.items, 6).map((it: any) => ({ title: str(it?.title, 60), body: str(it?.body, 160) })).filter((it) => it.title);
        if (!out.items.length) continue;
        break;
      case 'stats':
        out.items = arr(b.items, 4).map((it: any) => ({ value: str(it?.value, 16), label: str(it?.label, 40) })).filter((it) => it.value);
        if (!out.items.length) continue;
        break;
      case 'logos':
        out.title = str(b.title, 60);
        out.items = arr(b.links || b.items, 8).map((l: any) => ({ label: str(typeof l === 'string' ? l : l?.label, 24) })).filter((it) => it.label);
        if (!out.items.length) continue;
        break;
      case 'testimonial':
        out.quote = str(b.quote, 240);
        out.author = str(b.author, 40);
        out.role = str(b.role, 50);
        if (!out.quote) continue;
        break;
      case 'pricing':
        out.title = str(b.title, 80);
        out.tiers = arr(b.tiers, 4).map((t: any) => ({
          name: str(t?.name, 30), price: str(t?.price, 16), period: str(t?.period, 12),
          features: arr(t?.features, 7).map((f: any) => str(f, 60)).filter(Boolean),
          cta: str(t?.cta, 24), highlighted: bool(t?.highlighted),
        })).filter((t) => t.name);
        if (!out.tiers.length) continue;
        break;
      case 'form':
        out.title = str(b.title, 80);
        out.fields = arr(b.fields, 6).map((f: any) => ({ label: str(f?.label, 40), type: str(f?.type, 16) || 'text', placeholder: str(f?.placeholder, 60) })).filter((f) => f.label);
        out.submit = str(b.submit, 28) || 'Submit';
        if (!out.fields.length) continue;
        break;
      case 'gallery':
        out.title = str(b.title, 80);
        out.items = arr(b.items, 6).map((it: any) => ({ title: str(it?.title, 50), caption: str(it?.caption, 80) })).filter((it) => it.title);
        if (!out.items.length) continue;
        break;
      case 'cta':
        out.headline = str(b.headline, 90);
        out.subhead = str(b.subhead, 160);
        out.button = str(b.button || b.cta, 28);
        if (!out.headline) continue;
        break;
      case 'footer':
        out.columns = arr(b.columns, 4).map((c: any) => ({ title: str(c?.title, 30), links: arr(c?.links, 6).map((l: any) => str(l, 28)).filter(Boolean) })).filter((c) => c.title);
        out.copyright = str(b.copyright, 80);
        break;
      case 'text':
        out.title = str(b.title || b.heading, 80);
        out.body = str(b.body, 600);
        if (!out.body) continue;
        break;
    }
    blocks.push(out);
  }

  // Guarantee a non-empty page.
  if (!blocks.length) {
    blocks.push({ type: 'hero', headline: name, subhead: 'Generated page', align: 'center' });
  }
  return { name, mode, blocks };
}
