import { StaticOrgService } from '@/lib/services/static';
import type { OrgService } from '@/lib/services/types';

let activeService: OrgService | null = null;

export function getOrgService(): OrgService {
  if (!activeService) {
    // Swap implementation here when API is ready:
    // activeService = ApiOrgService;
    activeService = StaticOrgService;
  }
  return activeService;
}

export function useOrgService(): OrgService {
  return getOrgService();
}
