import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

/** The landing header is a title and a search box, nothing more.
 *
 *  This replaces a centred marketing hero with gradient display type, a blurred
 *  glow and a grid pattern. For a directory of 89 orgs, typing a name is the
 *  action people actually came to take, and it is now the first control on the
 *  page rather than a button that routes somewhere else to type into a box.
 */
export default function DirectoryHeader({
  total,
  campuses,
}: {
  total: number;
  campuses: number;
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/org?q=${encodeURIComponent(q)}` : '/org');
  }

  return (
    <div className="border-b border-border/60 py-6 sm:py-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Student organizations
        </h1>
        <p className="text-sm text-muted-foreground">
          {total} across {campuses} campuses
        </p>
      </div>

      {/* Capped at 34rem: a search field stretched across 1080px is harder to
          read and to aim at than one sized to the text people type into it. */}
      <form onSubmit={onSubmit} role="search" className="mt-4 flex max-w-[34rem] gap-2">
        <div className="relative flex-1">
          <Search
            size={16}
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name, acronym, or tag"
            aria-label="Search organizations"
            className="h-11 w-full rounded-panel border border-input bg-card pr-3 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          />
        </div>
        <button
          type="submit"
          className="h-11 shrink-0 rounded-panel bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
        >
          Search
        </button>
      </form>
    </div>
  );
}