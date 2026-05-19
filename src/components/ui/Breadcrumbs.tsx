import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadCrumbItem {
  label: string;
  href?: string;
}

interface BreadCrumbsProps {
  items?: BreadCrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadCrumbsProps> = ({ items, className = '' }) => {
  const location = useLocation();

  const generateBreadcrumbs = (): BreadCrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const Breadcrumbs: BreadCrumbItem[] = [{ label: 'Home', href: '/' }];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;

      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      Breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath,
      });
    });

    return Breadcrumbs;
  };

  const BreadCrumbItems = items || generateBreadcrumbs();

  return (
    <nav
      className={`flex items-center space-x-1.5 text-sm text-foreground-muted ${className}`}
      aria-label="Breadcrumb"
    >
      {BreadCrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {index === 0 && <Home className="h-3.5 w-3.5" />}
          {index > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-50" />}
          {item.href ? (
            <Link
              to={item.href}
              className="hover:text-foreground transition-colors duration-200"
            >
              {item.label.charAt(0).toUpperCase() + item.label.slice(1)}
            </Link>
          ) : (
            <span className="text-foreground font-medium" aria-current="page">
              {item.label.charAt(0).toUpperCase() + item.label.slice(1)}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;