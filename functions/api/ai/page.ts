import { Env, runJson, readJson } from './_ai';
import { PAGE_JSON_SCHEMA, validatePageSpec } from '../../../src/pageSpec';

const SYSTEM = `You are SAMI's page generator. Output a JSON page composed of blocks that MATCHES the requested page type. Use only as many blocks as the page genuinely needs - do not pad with marketing sections.

Allowed block "type": navbar, hero, features, stats, logos, testimonial, pricing, form, gallery, cta, footer, text.

Choose the layout from the request:
- A login / signup / sign in / register / auth / contact / subscribe / waitlist page is PRIMARILY one centered "form" block. At most add a single short "text" block (a heading + one line) above it. Do NOT add navbar, hero, features, stats, pricing, gallery, or footer to a simple auth/contact page.
- A landing / marketing / home page: navbar, hero, then a few features or stats, optionally testimonial or pricing, ending with cta or footer.
- A pricing page: a short hero or text, then a "pricing" block, optionally an FAQ as "text".
- A dashboard / app screen: prefer "stats" and "features"; skip marketing blocks.

Block fields (include only what's needed): hero{eyebrow,headline,subhead,primaryCta,secondaryCta}; features{title,items:[{title,body}]}; stats{items:[{value,label}]}; pricing{title,tiers:[{name,price,period,features:[string],cta,highlighted}]}; form{title,fields:[{label,type,placeholder}],submit}; testimonial{quote,author,role}; cta{headline,subhead,button}; footer{columns:[{title,links:[string]}],copyright}; text{title,body}; navbar{brand,links:[string],cta}.

Rules:
- For a "form": use real, task-appropriate field labels (signup: Full name, Email, Password, Confirm password) with field "type" set to text/email/password, realistic placeholders (NOT values like "password123"), and a real "submit" label (e.g. "Create account", "Sign in", "Send message").
- Concise, realistic copy. No lorem ipsum, no "Acme"/"John Doe". Headlines under 10 words.
- Provide a short, specific page "name" (e.g. "Sign up", "Pricing", "Contact").`;

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const body = await readJson(context.request);
  const description = String(body.description || '').slice(0, 600).trim();
  if (!description) return Response.json({ error: 'description is required' }, { status: 400 });

  const stub = {
    name: description.slice(0, 40) || 'New Page',
    blocks: [
      { type: 'navbar', brand: 'Acme', links: ['Product', 'Pricing', 'Docs'], cta: 'Sign up' },
      { type: 'hero', eyebrow: 'New', headline: description.slice(0, 60) || 'A better way to build', subhead: 'Offline preview (no AI binding). Connect Workers AI for real generation.', primaryCta: 'Get started', secondaryCta: 'Learn more' },
      { type: 'features', title: 'Highlights', items: [{ title: 'Fast', body: 'Ship in minutes, not weeks.' }, { title: 'Cohesive', body: 'Every screen stays on-brand.' }, { title: 'Token-driven', body: 'One source of visual truth.' }] },
      { type: 'cta', headline: 'Ready to start?', subhead: 'Join today.', button: 'Create account' },
    ],
  };

  const { data, stubbed } = await runJson(context.env, { system: SYSTEM, user: description, schema: PAGE_JSON_SCHEMA, maxTokens: 1800, stub });
  const spec = validatePageSpec(data);
  return Response.json({ spec, stubbed });
};
