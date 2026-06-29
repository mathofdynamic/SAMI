import { useState, useCallback } from 'react';

// Thin client for the same-origin /api/ai/* endpoints.
export function useAi() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (path: string, body: any): Promise<any | null> => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/ai/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json) {
        setError((json && json.error) || 'AI request failed');
        return null;
      }
      return json;
    } catch (e: any) {
      setError(e?.message || 'Network error');
      return null;
    } finally {
      setBusy(false);
    }
  }, []);

  return { run, busy, error };
}
