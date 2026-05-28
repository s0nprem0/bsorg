import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, Users, LayoutGrid } from 'lucide-react';

const categories: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  count: number | null;
  accent: string;
}[] = [
  {
    title: 'Academic Organizations',
    description: 'College-based academic councils and departmental organizations.',
    icon: GraduationCap,
    href: '/org?type=Academic',
    count: null,
    accent: 'from-primary/20 to-primary/5 border-primary/20',
  },
  {
    title: 'Non-Academic Organizations',
    description: 'Cultural, sports, and special interest groups.',
    icon: Users,
    href: '/org?type=Non-Academic',
    count: null,
    accent: 'from-accent/20 to-accent/5 border-accent/20',
  },
  {
    title: 'All Organizations',
    description: 'Browse every recognized student organization in one place.',
    icon: LayoutGrid,
    href: '/org',
    count: null,
    accent: 'from-blue-500/10 to-purple-500/10 border-blue-500/20',
  },
];

export default function BrowseCategories({
  academic,
  nonAcademic,
  children,
}: {
  academic: number;
  nonAcademic: number;
  children?: React.ReactNode;
}) {
  const items = categories.map(cat => ({
    ...cat,
    count:
      cat.title === 'Academic Organizations'
        ? academic
        : cat.title === 'Non-Academic Organizations'
          ? nonAcademic
          : null,
  }));

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            Browse Organizations
          </h2>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
            Find your community by type or explore the full directory.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(cat => (
            <Link
              key={cat.title}
              to={cat.href}
              aria-label={`Browse ${cat.title}`}
              className="group relative rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div
                className={`absolute inset-0 rounded-xl bg-linear-to-br ${cat.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <cat.icon className="h-6 w-6" />
                  </div>
                  {cat.count !== null && (
                    <span className="font-mono text-2xl font-bold text-muted-foreground/30">
                      {cat.count}
                    </span>
                  )}
                </div>
                <h3 className="mt-4 font-bold text-foreground group-hover:text-primary transition-colors">
                  {cat.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{cat.description}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-accent opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1">
                  Explore <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {children}
      </div>
    </section>
  );
}
