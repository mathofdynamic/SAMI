// Single source of truth for the font pickers and the font preview loader.
// Every family here must be a valid Google Fonts family so it actually loads.

export const FONTS_HEADING = [
  'Outfit', 'Space Grotesk', 'Sora', 'Bricolage Grotesque', 'Schibsted Grotesk',
  'Gabarito', 'Onest', 'Archivo', 'Syne', 'Unbounded', 'Plus Jakarta Sans',
  'DM Sans', 'Manrope', 'Figtree', 'Hanken Grotesk', 'Instrument Sans',
  'Albert Sans', 'Familjen Grotesk', 'Fraunces', 'Playfair Display',
  'Newsreader', 'Instrument Serif', 'DM Serif Display',
];

export const FONTS_BODY = [
  'Plus Jakarta Sans', 'DM Sans', 'Inter Tight', 'Manrope', 'Hanken Grotesk',
  'Figtree', 'Onest', 'Albert Sans', 'Instrument Sans', 'Spline Sans',
  'Mulish', 'Outfit', 'Space Grotesk', 'Newsreader', 'Source Serif 4',
];

export const FONTS_MONO = [
  'JetBrains Mono', 'IBM Plex Mono', 'Fira Code', 'Space Mono', 'Roboto Mono',
  'DM Mono', 'Spline Sans Mono', 'Martian Mono',
];

// Deduplicated union of every pickable family, for preview loading.
export const ALL_PREVIEW_FONTS = Array.from(
  new Set([...FONTS_HEADING, ...FONTS_BODY, ...FONTS_MONO])
);

// One combined css2 URL loading every picker family at a single weight (cheap
// previews). The 3 active fonts still load their full weight range via Canvas.
export function buildPreviewFontHref(families: string[] = ALL_PREVIEW_FONTS): string {
  const params = families
    .map(f => `family=${f.replace(/ /g, '+')}:wght@400`)
    .join('&');
  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}
