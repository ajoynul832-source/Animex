'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Generic data-fetching hook.
 * Usage: const { data, loading, error, refetch } = useApi(() => animeApi.getHome(), []);
 */
export function useApi(fetchFn, deps = [], options = {}) {
  const { initialData = null, skip = false } = options;
  const [data,    setData]    = useState(initialData);
  const [loading, setLoading] = useState(!skip);
  const [error,   setError]   = useState(null);
  const mountedRef = useRef(true);

  const run = useCallback(async () => {
    if (skip) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      if (mountedRef.current) setData(result);
    } catch (err) {
      if (mountedRef.current) setError(err.message || 'Request failed');
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, deps); // eslint-disable-line

  useEffect(() => {
    mountedRef.current = true;
    run();
    return () => { mountedRef.current = false; };
  }, [run]);

  return { data, loading, error, refetch: run };
}
