import React from 'react';
import OrganizationCard from '@/components/OrganizationCard';

interface OrgGridProps {
  organizations: Array<{
    slug: string;
    org: string;
    description?: string;
    logo?: string;
    contact: {
      email?: string;
      facebook?: string;
      instagram?: string;
      tiktok?: string;
      x?: string;
    };
  }>;
  columns?: number; // Number of columns for the grid
  className?: string; // Additional class names for customization
}

const OrgGrid: React.FC<OrgGridProps> = ({ organizations, columns = 3, className = '' }) => {
  if (organizations.length === 0) {
    return <p className="text-neutral-500">No organizations found.</p>;
  }

  return (
    <div
      className={`grid gap-6 ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {organizations.map((org) => (
        <OrganizationCard key={org.slug} {...org} />
      ))}
    </div>
  );
};

export default OrgGrid;