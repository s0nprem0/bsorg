import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/shadcn/breadcrumb';

interface BreadCrumbItem {
  label: string;
  href?: string;
}

interface BreadCrumbsProps {
  items: BreadCrumbItem[];
  className?: string;
}

export default function Breadcrumbs({
  items,
  className = '',
}: BreadCrumbsProps) {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const label =
            item.label.charAt(0).toUpperCase() + item.label.slice(1);

          return (
            <Fragment key={item.href || item.label}>
              <BreadcrumbItem>
                {isLast || !item.href ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={item.href}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
