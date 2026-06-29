import { useState, useCallback } from 'react';

export type Lang = 'en' | 'fa';
export const VAZIR = 'Vazirmatn';
const STORAGE_KEY = 'sami_lang';

// Studio-chrome strings. Technical token field names (hex labels, etc.) stay
// English by design; everything a user reads/navigates is translated.
type Dict = Record<string, string>;
const en: Dict = {
  'brand.tagline': 'Visual Design Studio',
  'brand.layer': 'APP ARCHETYPE COMPLIANCE LAYER',
  'brand.slogan': 'Smart Aesthetic Management Interface',
  'header.hint': 'Adjust visual tokens on the left. Changes instantly cascade to the showcase frames on the right.',
  'btn.manifesto': 'Manifesto',
  'btn.export': 'Export DESIGN.md',
  'btn.canvasOnly': 'Canvas only view',
  'btn.exitCanvas': 'Exit canvas view',
  'btn.agents': 'AI Agents',
  'theme.light': 'Light',
  'theme.dark': 'Dark',
  'lang.label': 'EN',

  'editor.title': 'SAMI Studio Panel',
  'editor.sub': 'DETERMINISTIC TOKEN STREAM',
  'editor.reset': 'Reset',
  'editor.appName': 'APP NAME',
  'editor.active': 'Active:',
  'preview.live': 'Live Preview',

  'nav.presets': 'Theme Presets',
  'nav.color': 'Color Palette',
  'nav.typography': 'Typography Spec',
  'nav.shape': 'Shape & Elevation',
  'nav.components': 'Component Blueprints',
  'nav.motion': 'Motion & Easings',
  'nav.dials': 'Taste Engine Dials',
  'nav.audit': 'SAMI Slop Audit',
  'nav.ai': 'AI Assist',

  'ai.title': 'AI Assist',
  'ai.desc': 'Describe a design and let AI compose your tokens, or use the quick helpers.',
  'ai.describe.label': 'Describe your design',
  'ai.describe.placeholder': 'e.g. a calm fintech app, deep green, editorial serif headings',
  'ai.generate': 'Generate design',
  'ai.quick': 'Quick helpers',
  'ai.suggestName': 'Suggest name',
  'ai.fontPairing': 'Font pairing',
  'ai.palette': 'Palette from vibe',
  'ai.autofix': 'Auto-fix audit',
  'ai.newPage': 'AI Page',
  'ai.pagePlaceholder': 'Describe a page (e.g. a pricing page for a B2B SaaS)',
  'ai.create': 'Create page',
  'ai.cancel': 'Cancel',
  'ai.stubNote': 'Offline preview - connect Workers AI for live results.',
  'ai.error': 'AI request failed. Please try again.',

  'sec.presets.title': 'Visual Presets',
  'sec.presets.desc': 'Fork an award-winning design system base. Customize parameters inside other sections.',
  'sec.color.title': 'Color Tokens System',
  'sec.color.desc': 'Formulate contrast-safe light/dark values for visual elements.',
  'sec.typography.title': 'Typography Scales',
  'sec.typography.desc': 'Configure pairing weights, scale ratios, and layout letter tracking.',
  'sec.shape.title': 'Shape & Elevation',
  'sec.shape.desc': 'Regulate layout corner curvatures, border outlines, and ambient shadow structures.',
  'sec.components.title': 'Component Blueprints',
  'sec.components.desc': 'Configure layout behavior on the primitive level to direct consistent design blocks.',
  'sec.motion.title': 'Motion & Easings',
  'sec.motion.desc': 'Inject smooth physical animation states with cubic timing configurations.',
  'sec.dials.title': 'Taste Engine Dials',
  'sec.dials.desc': 'Tune the active generative thresholds to dial in specific layout styles.',

  'canvas.pan': 'Pan Canvas',
  'canvas.inspect': 'Inspect UI',
  'canvas.desktop': 'Desktop',
  'canvas.tablet': 'Tablet',
  'canvas.mobile': 'Mobile',
  'canvas.cascade': 'GLOBAL CASCADE',
  'canvas.zoomHint': 'Scroll to zoom · click a frame to scroll it',
  'canvas.scrollHint': 'Frame selected · scroll it, or click empty space to zoom',
};

const fa: Dict = {
  'brand.tagline': 'استودیوی طراحی بصری',
  'brand.layer': 'لایه انطباق الگوی برنامه',
  'brand.slogan': 'Smart Aesthetic Management Interface',
  'header.hint': 'توکن‌های بصری را در سمت راست تنظیم کنید. تغییرات بی‌درنگ روی قاب‌های نمونه اعمال می‌شوند.',
  'btn.manifesto': 'بیانیه',
  'btn.export': 'خروجی DESIGN.md',
  'btn.canvasOnly': 'فقط نمایش بوم',
  'btn.exitCanvas': 'خروج از نمای بوم',
  'btn.agents': 'عامل‌های هوش مصنوعی',
  'theme.light': 'روشن',
  'theme.dark': 'تیره',
  'lang.label': 'فا',

  'editor.title': 'پنل استودیو سامی',
  'editor.sub': 'جریان توکن قطعی',
  'editor.reset': 'بازنشانی',
  'editor.appName': 'نام برنامه',
  'editor.active': 'فعال:',
  'preview.live': 'پیش‌نمایش زنده',

  'nav.presets': 'قالب‌های آماده',
  'nav.color': 'پالت رنگ',
  'nav.typography': 'مشخصات تایپوگرافی',
  'nav.shape': 'شکل و برجستگی',
  'nav.components': 'نقشه اجزا',
  'nav.motion': 'حرکت و شتاب',
  'nav.dials': 'دکمه‌های موتور سلیقه',
  'nav.audit': 'بازرسی سامی',
  'nav.ai': 'دستیار هوش مصنوعی',

  'ai.title': 'دستیار هوش مصنوعی',
  'ai.desc': 'یک طراحی را توصیف کنید تا هوش مصنوعی توکن‌ها را بسازد، یا از کمک‌های سریع استفاده کنید.',
  'ai.describe.label': 'طراحی خود را توصیف کنید',
  'ai.describe.placeholder': 'مثلاً یک اپ فین‌تک آرام، سبز تیره، عنوان‌های سریف',
  'ai.generate': 'ساخت طراحی',
  'ai.quick': 'کمک‌های سریع',
  'ai.suggestName': 'پیشنهاد نام',
  'ai.fontPairing': 'جفت فونت',
  'ai.palette': 'پالت از حال‌وهوا',
  'ai.autofix': 'اصلاح خودکار بازرسی',
  'ai.newPage': 'صفحه هوش مصنوعی',
  'ai.pagePlaceholder': 'یک صفحه را توصیف کنید (مثلاً صفحه قیمت‌گذاری برای SaaS)',
  'ai.create': 'ساخت صفحه',
  'ai.cancel': 'لغو',
  'ai.stubNote': 'پیش‌نمایش آفلاین - برای نتایج زنده Workers AI را متصل کنید.',
  'ai.error': 'درخواست هوش مصنوعی ناموفق بود. دوباره تلاش کنید.',

  'sec.presets.title': 'قالب‌های بصری',
  'sec.presets.desc': 'یک سیستم طراحی برنده جایزه را انتخاب و در بخش‌های دیگر سفارشی کنید.',
  'sec.color.title': 'سیستم توکن‌های رنگ',
  'sec.color.desc': 'مقادیر روشن/تیره ایمن از نظر کنتراست را برای عناصر بصری تعیین کنید.',
  'sec.typography.title': 'مقیاس‌های تایپوگرافی',
  'sec.typography.desc': 'وزن‌های جفت‌شده، نسبت مقیاس و فاصله حروف را پیکربندی کنید.',
  'sec.shape.title': 'شکل و برجستگی',
  'sec.shape.desc': 'انحنای گوشه‌ها، خطوط حاشیه و ساختار سایه را تنظیم کنید.',
  'sec.components.title': 'نقشه اجزا',
  'sec.components.desc': 'رفتار چیدمان را در سطح اجزای پایه برای بلوک‌های طراحی منسجم تنظیم کنید.',
  'sec.motion.title': 'حرکت و شتاب',
  'sec.motion.desc': 'حالت‌های انیمیشن نرم را با تنظیمات زمان‌بندی مکعبی تزریق کنید.',
  'sec.dials.title': 'دکمه‌های موتور سلیقه',
  'sec.dials.desc': 'آستانه‌های تولید فعال را برای رسیدن به سبک چیدمان دلخواه تنظیم کنید.',

  'canvas.pan': 'جابجایی بوم',
  'canvas.inspect': 'بازرسی رابط',
  'canvas.desktop': 'دسکتاپ',
  'canvas.tablet': 'تبلت',
  'canvas.mobile': 'موبایل',
  'canvas.cascade': 'آبشار سراسری',
  'canvas.zoomHint': 'برای بزرگ‌نمایی اسکرول کنید · برای اسکرول یک قاب روی آن کلیک کنید',
  'canvas.scrollHint': 'قاب انتخاب شد · اسکرول کنید، یا روی فضای خالی کلیک کنید تا بزرگ‌نمایی شود',
};

const dict: Record<Lang, Dict> = { en, fa };

export function t(key: string, lang: Lang): string {
  return dict[lang][key] ?? dict.en[key] ?? key;
}

// Inline translation helper for showcase copy: tr(lang, 'English', 'فارسی').
export function tr(lang: Lang, enStr: string, faStr: string): string {
  return lang === 'fa' ? faStr : enStr;
}

// Farsi copy for the Slop Audit checks, keyed by the audit item id from
// generateSlopAudit(). The audit logic itself stays English (canonical for the
// exported DESIGN.md / API); this only localizes the studio display.
export const AUDIT_FA: Record<string, { name: string; tip: string }> = {
  'accent-saturation': { name: 'اشباع تأکید زیر ۸۰٪', tip: 'اشباع رنگ تأکید را زیر ۸۰٪ نگه دارید تا با خنثی‌ها زیبا ترکیب شود.' },
  'heading-font': { name: 'فونت عنوان حرفه‌ای', tip: 'از فونت‌های عمومی مانند Inter، Roboto، Arial، Open Sans یا Helvetica پرهیز کنید.' },
  'pure-colors': { name: 'بدون سیاه/سفید خالص', tip: 'از #000000 و #ffffff خالص پرهیز کنید؛ از سفید استخوانی و ذغالی نرم استفاده کنید.' },
  'light-text-contrast': { name: 'کنتراست متن روشن ≥ ۴.۵:۱', tip: 'کنتراست متن و پس‌زمینه روشن را برای انطباق WCAG AA افزایش دهید.' },
  'dark-text-contrast': { name: 'کنتراست متن تیره ≥ ۴.۵:۱', tip: 'کنتراست متن و پس‌زمینه تیره را برای انطباق WCAG AA افزایش دهید.' },
  'button-contrast': { name: 'کنتراست متن/پس‌زمینه دکمه ≥ ۴.۵:۱', tip: 'مطمئن شوید رنگ پر دکمه تأکید و برچسب آن کنتراست بالایی دارند.' },
  'single-accent': { name: 'رنگ تأکید برند یکپارچه', tip: 'تأکید روشن و تیره باید یک رنگ برند منسجم داشته باشند (اختلاف ≤ ۳۰°).' },
};

// Returns the FA audit name/tip when lang is fa, else the English fallback.
export function auditText(id: string, field: 'name' | 'tip', lang: Lang, fallback: string): string {
  if (lang === 'fa' && AUDIT_FA[id]) return AUDIT_FA[id][field];
  return fallback;
}

export function useLang() {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    return saved === 'fa' ? 'fa' : 'en';
  });
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch { /* ignore */ }
  }, []);
  return { lang, setLang };
}
