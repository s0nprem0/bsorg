import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

export function useUrlState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string | null) => {
      setSearchParams(
        prev => {
          const params = new URLSearchParams(prev);
          if (value) {
            params.set(key, value);
          } else {
            params.delete(key);
          }
          return params;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  return { searchParams, setParam };
}
