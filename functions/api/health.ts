export const onRequestGet: PagesFunction = async () =>
  Response.json({ ok: true, service: 'SAMI Design Token API', version: '1.0.0' });
