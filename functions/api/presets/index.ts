import { THEME_PRESETS } from '../../../src/presets';

// List the available starter design systems (id + name + description).
export const onRequestGet: PagesFunction = async () =>
  Response.json(
    THEME_PRESETS.map((p) => ({ id: p.id, name: p.name, description: p.description }))
  );
