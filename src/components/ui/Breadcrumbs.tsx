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

const BreadCrumbs: React.FC<BreadCrumbsProps> = ({ items, className = '' }) => {
  const location = useLocation();

  // Generate BreadCrumbs from current path if no items provided
  const generateBreadCrumbs = (): BreadCrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const BreadCrumbs: BreadCrumbItem[] = [{ label: 'Home', href: '/' }];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;

      // Convert segment to readable label
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      BreadCrumbs.push({
        label,
        href: isLast ? undefined : currentPath,
      });
    });

    return BreadCrumbs;
  };

  const BreadCrumbItems = items || generateBreadCrumbs();

  return (
    <nav
      className={`flex items-center space-x-1 text-sm text-gray-600 ${className}`}
      aria-label="BreadCrumb"
    >
      {BreadCrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {index === 0 && <Home className="h-4 w-4" />}
          {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400" />}
          {item.href ? (
            <Link
              to={item.href}
              className="hover:text-primary-600 transition-colors duration-200"
            >
              {item.label.charAt(0).toUpperCase() + item.label.slice(1)}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium" aria-current="page">
              {item.label.charAt(0).toUpperCase() + item.label.slice(1)}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default BreadCrumbs;