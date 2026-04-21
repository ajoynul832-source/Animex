'use client';
import { useEffect } from 'react';

/**
 * Register keyboard shortcuts.
 * Pass a map of { key: handler } where key is e.key or 'Space'.
 * Respects input focus — shortcuts are disabled when typing.
 */
export function useKeyboard(shortcuts = {}, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      const fn = shortcuts[e.key] || shortcuts[e.code];
      if (fn) { e.preventDefault(); fn(e); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [shortcuts, enabled]);
}
