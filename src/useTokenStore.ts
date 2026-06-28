import { useState, useCallback, useEffect } from 'react';
import { DesignTokens, HistoryState } from './types';
import { THEME_PRESETS } from './presets';

const STORAGE_KEY = 'sami_studio_tokens_v1';
const HISTORY_LIMIT = 30;

export function useTokenStore() {
  const [history, setHistory] = useState<HistoryState>(() => {
    // Initializer
    const defaultTokens = THEME_PRESETS[0].tokens; // Minimal preset
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return {
          past: [],
          present: JSON.parse(saved),
          future: [],
        };
      }
    } catch (e) {
      console.error('Error loading tokens from localStorage:', e);
    }

    return {
      past: [],
      present: defaultTokens,
      future: [],
    };
  });

  // Save current present tokens to local storage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history.present));
    } catch (e) {
      console.error('Error saving tokens to localStorage:', e);
    }
  }, [history.present]);

  // Set tokens wrapper (Push to past, set present, clear future)
  const setTokens = useCallback((newTokens: DesignTokens) => {
    setHistory((prev) => {
      // Prevent push if new state is identical to present (deep compare check or simple serialize)
      const prevStr = JSON.stringify(prev.present);
      const nextStr = JSON.stringify(newTokens);
      if (prevStr === nextStr) return prev;

      const newPast = [...prev.past, prev.present];
      if (newPast.length > HISTORY_LIMIT) {
        newPast.shift(); // Remove oldest
      }

      return {
        past: newPast,
        present: newTokens,
        future: [],
      };
    });
  }, []);

  // Undo action
  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;

      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, prev.past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future],
      };
    });
  }, []);

  // Redo action
  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;

      const next = prev.future[0];
      const newFuture = prev.future.slice(1);

      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  // Reset to preset baseline defaults
  const resetToPreset = useCallback(() => {
    setHistory((prev) => {
      // Find preset by comparing color primary or just locating closest matching pre-defined set
      // By default, reset to the active preset base:
      const presetId = localStorage.getItem('sami_active_preset_id') || 'minimalist';
      const preset = THEME_PRESETS.find(p => p.id === presetId) || THEME_PRESETS[0];
      
      const newPast = [...prev.past, prev.present];
      if (newPast.length > HISTORY_LIMIT) {
        newPast.shift();
      }

      return {
        past: newPast,
        present: { ...preset.tokens, appName: prev.present.appName }, // Keep app name
        future: [],
      };
    });
  }, []);

  // Set active preset tracking id
  const setActivePresetId = useCallback((id: string) => {
    localStorage.setItem('sami_active_preset_id', id);
  }, []);

  return {
    tokens: history.present,
    setTokens,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    resetToPreset,
    setActivePresetId,
  };
}
