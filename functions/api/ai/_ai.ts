// Shared Workers AI helper for the /api/ai/* endpoints.
// We prompt for raw JSON and parse it ourselves (rather than response_format
// json_schema, whose binding path delegated to a now-deprecated model). The
// callers' sanitizers harden the parsed output, so malformed JSON is safe.
// When the AI binding is absent or a call fails, a caller-supplied deterministic
// stub is returned so the UI stays testable offline.

export interface Env {
  AI?: { run: (model: string, inputs: any) => Promise<any> };
}

// Capable fp8 model that follows JSON instructions reliably and is fast in
// practice (~2-7s). The 3 retries below absorb the occasional transient
// capacity/timeout error that previously surfaced as a hard failure.
// Configurable here. (Scout-17B was quicker but unreliable on some prompts.)
export const MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
const ATTEMPTS = 3;

export interface RunOpts {
  system: string;
  user: string;
  schema: any;
  stub: any;
  maxTokens?: number;
  model?: string;
}

// Extract a JSON object from a model's free-text reply (strips code fences and
// any surrounding prose).
function extractJson(text: string): any | null {
  let t = String(text).trim();
  t = t.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
  try { return JSON.parse(t); } catch { /* fall through */ }
  const s = t.indexOf('{');
  const e = t.lastIndexOf('}');
  if (s >= 0 && e > s) {
    try { return JSON.parse(t.slice(s, e + 1)); } catch { /* fall through */ }
  }
  return null;
}

export async function runJson(env: Env, opts: RunOpts): Promise<{ data: any; stubbed: boolean; error?: string }> {
  if (!env || !env.AI) return { data: opts.stub, stubbed: true, error: 'no-binding' };

  const system = `${opts.system}

Output ONLY a single JSON object filled with REAL values (an instance, not the schema definition). No markdown, no code fences, no commentary. The object must follow this shape:
${JSON.stringify(opts.schema)}`;

  let lastError = 'unknown';
  // Retry transient failures (capacity/timeout) and the occasional bad-JSON reply.
  for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
    try {
      const res: any = await env.AI.run(opts.model || MODEL, {
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: opts.user },
        ],
        max_tokens: opts.maxTokens ?? 1024,
      });
      let text = '';
      if (typeof res?.response === 'string') text = res.response;
      else if (typeof res?.choices?.[0]?.message?.content === 'string') text = res.choices[0].message.content;
      else if (typeof res === 'string') text = res;
      if (!text) { lastError = 'no-text'; continue; }
      const parsed = extractJson(text);
      if (!parsed || typeof parsed !== 'object') { lastError = 'parse-failed'; continue; }
      return { data: parsed, stubbed: false };
    } catch (e: any) {
      lastError = String((e && e.message) || e).slice(0, 200);
    }
  }
  return { data: opts.stub, stubbed: true, error: lastError };
}

export function readJson(request: Request): Promise<any> {
  return request.json().catch(() => ({}));
}

// JSON-schema fragment for a single-mode color theme (all 12 roles, hex strings).
export const COLOR_SCHEMA = {
  type: 'object',
  properties: Object.fromEntries(
    ['primary', 'secondary', 'accent', 'neutralBg', 'neutralSurface', 'neutralBorder', 'textPrimary', 'textSecondary', 'success', 'warning', 'error', 'info']
      .map((k) => [k, { type: 'string' }])
  ),
};
