const INFO = {
  ok: true,
  service: 'SAMI Design Token API',
  version: '1.0.0',
  docs: 'https://smart-aesthetic-management-interface.pages.dev/skill.md',
  endpoints: [
    'GET  /api/health',
    'GET  /api/schema',
    'GET  /api/presets',
    'GET  /api/presets/:id',
    'POST /api/generate           (body: { presetId?, tokens? })',
    'POST /api/generate?format=design-md|tokens-json|theme-css|agent-prompt|slop-audit',
  ],
};

export const onRequestGet: PagesFunction = async () => Response.json(INFO);
