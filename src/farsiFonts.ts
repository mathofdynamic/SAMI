// Persian (Farsi) webfonts, shown in the font pickers only when the studio
// language is FA. These are direct font-file URLs (no extension), so the
// @font-face rules omit a format() hint and let the browser sniff the type.
// Bold/Regular (and ExtraBold/Medium) variants are grouped under one family so
// font-weight selects the right face.

export interface FarsiFontFace {
  family: string;
  weight: number;
  url: string;
}

export const FARSI_FONTS: FarsiFontFace[] = [
  { family: 'Irancell', weight: 900, url: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCW9s2filpBbjpnwL8W2sqZM5VekAc1RuxdJgy3' },
  { family: 'Irancell', weight: 400, url: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWF46K4OzPl23czSEvYW7QLdtrKBM6seVwiomg' },
  { family: 'Kalameh', weight: 700, url: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWoeaCRdlncb9XRHgwNkCWj0etGzJUP6uIfAQS' },
  { family: 'Kalameh', weight: 400, url: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWvwsJOJhgMpamP0ofXLCZx1UeJ2gY9cjNA3yn' },
  { family: 'Aviny', weight: 400, url: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWegll9Od1bg6YJhydCKQtTLB5jAR4m2uX0zPG' },
  { family: 'Peyda', weight: 700, url: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCW2X2c5Qeny6Ogrl37EXKGYBT5h0IWMd2FZi8q' },
  { family: 'Peyda', weight: 400, url: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWREpm7gu0KVHt9v1lnkcWMSbC2EasfPypXwDh' },
  { family: 'Anjoman', weight: 800, url: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWMGofZ6yP1TFSZvyopzXDRIbfcB5tC9nrKWw7' },
  { family: 'Anjoman', weight: 400, url: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWvnf2l4gMpamP0ofXLCZx1UeJ2gY9cjNA3yn7' },
  { family: 'Morabba', weight: 700, url: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCW7c4iDfRPgN3mf4rIQL9pXBGJDSVaCM2E0oUs' },
  { family: 'Morabba', weight: 400, url: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWlZoc88ELwJUzf2FbD8KRWXCtsdEMiuAgH46h' },
  { family: 'Dana FaNum', weight: 700, url: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWHQQN4fi7kPCdSFo2aI63RL145OfYVgh8szNx' },
  { family: 'Dana FaNum', weight: 400, url: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCW0YkwuNP6G98l1RT3KZNu5nLdt7EDxAjzJcC2' },
  { family: 'Colak', weight: 400, url: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWq0DDjfxHM0jmGbPUrK32WLITJcAiOBEzatpF' },
  { family: 'Dibaj FaNum', weight: 700, url: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWwFbdKG1Wp1OnfEJYSdlCexMrIy2uBg9RLNX7' },
  { family: 'Dibaj FaNum', weight: 500, url: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWEtOmhrazSVHBoTu4mIt7C39he0vaFsW2UGPg' },
  { family: 'Pelak', weight: 700, url: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCW8g6U9PajS1JzmX8qAFskdHLN7DUR6votwfZG' },
  { family: 'Pelak', weight: 400, url: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWYbBMhFpKXQuyvsfGtN9qZ2mDph7Ujg8cMlAR' },
  { family: 'AzarMehr FD', weight: 400, url: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCW88xX3KjS1JzmX8qAFskdHLN7DUR6votwfZGY' },
  { family: 'Avisi', weight: 400, url: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWVegmMGeWM5zho2G1wWpDkVltmeUsidASavyZ' },
  { family: 'Farhang 2', weight: 700, url: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWVqHAQpWM5zho2G1wWpDkVltmeUsidASavyZb' },
  { family: 'Farhang 2', weight: 500, url: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWWpjryV2v5MsyNU89LpEYVJdKzchSQTm426DC' },
  { family: 'Yekan Bakh', weight: 700, url: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWTlY8IWxcCnVWhtKZdBrjUNJ8x7lsqo3kLYau' },
  { family: 'Yekan Bakh', weight: 400, url: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWvUppibgMpamP0ofXLCZx1UeJ2gY9cjNA3yn7' },
  { family: 'Alef', weight: 400, url: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWjLNFtNv6CiBJP01qH5eQ2bfsWrEmvoOgzyuU' },
  { family: 'IRANYekanX FaNum', weight: 700, url: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWebINREd1bg6YJhydCKQtTLB5jAR4m2uX0zPG' },
  { family: 'IRANYekanX FaNum', weight: 500, url: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWcEd4iK1oBVpdvf7Fh5uzkeqXcwij9AGrOJSN' },
  { family: 'Doran', weight: 800, url: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCW225KtVeny6Ogrl37EXKGYBT5h0IWMd2FZi8q' },
  { family: 'Doran', weight: 500, url: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWJkCZF6fqam3lisx10HfzQyVevtoFgcOWrZ6h' },
  { family: 'Bahman', weight: 400, url: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCW7n0B8cARPgN3mf4rIQL9pXBGJDSVaCM2E0oU' },
  { family: 'IRANSansX FaNum', weight: 700, url: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWD2AbuG9ixR3WIOJy8zYmjbfacr4XKVl9H1vk' },
  { family: 'IRANSansX FaNum', weight: 400, url: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWkO6kpXBlTIYdxai4rQEHcnsA2U9h6GjuS0OK' },
  { family: 'Nian', weight: 700, url: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWbA992Mk6SrQmVWuotE8sHOxYZJIcjiaR7hL9' },
  { family: 'Nian', weight: 400, url: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWJlPquBfqam3lisx10HfzQyVevtoFgcOWrZ6h' },
];

// Unique family names for the FA font pickers (insertion order preserved).
export const FARSI_FONT_FAMILIES: string[] = Array.from(new Set(FARSI_FONTS.map(f => f.family)));

// One <style> body with every @font-face. Declarations don't fetch until a
// family is actually used, so injecting all of them up-front is cheap.
export function buildFarsiFontFaceCss(): string {
  return FARSI_FONTS
    .map(f => `@font-face{font-family:"${f.family}";font-style:normal;font-weight:${f.weight};font-display:swap;src:url("${f.url}");}`)
    .join('\n');
}
