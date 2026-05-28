import { useState, useEffect, useMemo, useSyncExternalStore } from 'react';
import { StaticOrgService } from '@/lib/services/static';
import { ApiOrgService } from '@/lib/services/api';
import { orgRegistry } from '@/lib/orgIndex';
import type { OrgService } from '@/lib/services/types';
import type { Organization } from '@/lib/orgIndex';

export const service: OrgService = import.meta.env.VITE_ORG_API_URL
  ? ApiOrgService
  : StaticOrgService;

// --- Data store for sync-compatible access ---

let storeData: Organization[] = [];
const storeListeners: Set<() => void> = new Set();
let storeLoaded = false;
let storeInitError: Error | null = null;

function storeNotify() {
  storeListeners.forEach(fn => fn());
}

function storeSubscribe(fn: () => void): () => void {
  storeListeners.add(fn);
  return () => {
    storeListeners.delete(fn);
  };
}

function storeGetSnapshot(): Organization[] {
  return storeData;
}

// Populate store synchronously for static service, async for API
if (service === StaticOrgService) {
  storeData = orgRegistry.getAll();
  storeLoaded = true;
} else {
  service.getAll().then(orgs => {
    storeData = orgs;
    storeLoaded = true;
    storeNotify();
  }).catch(err => {
    storeInitError = err as Error;
    storeLoaded = true;
    storeNotify();
  });
}

export function useOrgs(): {
  orgs: Organization[];
  loading: boolean;
  error: Error | null;
} {
  const syncedOrgs = useSyncExternalStore(storeSubscribe, storeGetSnapshot);

  const [loading, setLoading] = useState(!storeLoaded);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (storeLoaded) {
      setLoading(false);
      if (storeInitError) setError(storeInitError);
      return;
    }
    let cancelled = false;
    const unsub = storeSubscribe(() => {
      if (!cancelled) {
        setLoading(false);
        if (storeInitError) setError(storeInitError);
      }
    });
    return () => { cancelled = true; unsub(); };
  }, []);

  return { orgs: syncedOrgs, loading, error };
}

export function useOrg(
  slug: string | undefined
): {
  org: Organization | null;
  loading: boolean;
  error: Error | null;
} {
  const { orgs, loading, error } = useOrgs();

  const org = useMemo(() => {
    if (!slug) return null;
    const lower = slug.toLowerCase();
    return orgs.find(o => o.slug.toLowerCase() === lower) ?? null;
  }, [orgs, slug]);

  return { org, loading, error };
}
