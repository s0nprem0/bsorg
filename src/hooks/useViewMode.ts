import { useCallback, useState } from 'react';

const STORAGE_KEY = 'betterosas-org-view';

export type ViewMode = 'grid' | 'list';

function getInitialViewMode(): ViewMode {
  if (typeof window === 'undefined') return 'grid';
  return localStorage.getItem(STORAGE_KEY) === 'list' ? 'list' : 'grid';
}

/** Grid or list for the org browser. Held in localStorage rather than the URL
 *  because it is a device preference, not a filter — it belongs beside the
 *  theme toggle, and keeping it out of the query string stops it cluttering
 *  every shared link. */
export function useViewMode() {
  const [view, setViewState] = useState<ViewMode>(getInitialViewMode);

  const setView = useCallback((next: ViewMode) => {
    setViewState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  return { view, setView };
}