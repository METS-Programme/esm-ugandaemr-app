import { useState, useEffect } from 'react';
import { searchPrograms } from './programs.resource';
import type { ProgramReference } from '../sync-profiles.types';

export function useProgramSearch(query: string) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ProgramReference[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    const ctrl = new AbortController();

    const t = window.setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await searchPrograms(q, ctrl.signal);
        setResults(res);
      } catch (e: any) {
        if (e?.name !== 'AbortError') setError('Failed to search programs');
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      ctrl.abort();
      window.clearTimeout(t);
    };
  }, [query]);

  return { loading, results, error };
}
