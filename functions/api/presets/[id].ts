import { THEME_PRESETS } from '../../../src/presets';

// Return one preset's full token set.
export const onRequestGet: PagesFunction = async (context) => {
  const id = String(context.params.id);
  const preset = THEME_PRESETS.find((p) => p.id === id);
  if (!preset) {
    return Response.json(
      { error: `Unknown preset: ${id}`, available: THEME_PRESETS.map((p) => p.id) },
      { status: 404 }
    );
  }
  return Response.json({
    id: preset.id,
    name: preset.name,
    description: preset.description,
    tokens: preset.tokens,
  });
};
