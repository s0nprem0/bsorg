import React from 'react';
import OrganizationCard from '@/components/OrganizationCard';
import { CAMPUSES } from '@/data/constants';

interface OrgGridProps {
  organizations: Array<{
    slug: string;
    org: string;
    description?: string;
    program?: string;
    logo?: string;
    campusId?: number;
    contact?: {
      email?: string;
      facebook?: string;
      instagram?: string;
      tiktok?: string;
      x?: string;
    };
  }>;
  columns?: number;
  className?: string;
}

const OrgGrid: React.FC<OrgGridProps> = ({ organizations, columns = 3, className = '' }) => {
  if (!organizations?.length) return null;

  const getCampusName = (campusId?: number) => {
    if (campusId === undefined) return undefined;
    return CAMPUSES.find((campus) => campus.id === campusId)?.name;
  };

  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4',
  }[columns] ?? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <div
      className={`grid gap-6 ${columnClasses} ${className}`}
    >
      {organizations.map((org) => (
        <OrganizationCard key={org.slug} {...org} campus={getCampusName(org.campusId)} />
      ))}
    </div>
  );
};

export default OrgGrid;