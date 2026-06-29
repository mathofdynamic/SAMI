import { useState, useCallback, useEffect } from 'react';
import { PageSpec } from './pageSpec';

const STORAGE_KEY = 'sami_user_pages_v1';

export interface UserPage {
  id: string;
  name: string;
  spec: PageSpec;
}

// Persisted store of AI-generated pages that appear as extra canvas frames.
export function useUserPages() {
  const [userPages, setUserPages] = useState<UserPage[]>(() => {
    try {
      const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch { /* ignore */ }
    return [];
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(userPages)); } catch { /* ignore */ }
  }, [userPages]);

  const addUserPage = useCallback((spec: PageSpec): string => {
    const id = Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);
    setUserPages((prev) => [...prev, { id, name: spec.name, spec }]);
    return id;
  }, []);

  const removeUserPage = useCallback((id: string) => {
    setUserPages((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return { userPages, addUserPage, removeUserPage };
}
