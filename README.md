# BetterOSAS

A modern, mobile-first directory for exploring student organizations across the Cavite State University (CvSU) network.

Built to replace the rigid [official org page](https://cvsu.edu.ph/student-organizations) with fast search, filtering, and rich organization profiles.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 8** (build tool)
- **React Router 7** (lazy routes)
- **TailwindCSS v4** (utility-first CSS)
- **shadcn/ui** (Radix primitives)
- **Zod v4** (schema validation)
- **Lucide React** + **react-icons** (icons)

## Getting Started

```sh
bun install
bun dev              # http://localhost:5173
```

### Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start dev server |
| `bun run build` | TypeScript check + production build |
| `bun run preview` | Preview production build |
| `npx tsc --noEmit` | TypeScript check only |
| `npx eslint src/` | Lint |

## Project Structure

```txt
src/
  components/
    layout/       Navbar, Footer, OrgGrid
    sections/     Hero, FeaturedGrid, BrowseCategories, BrowseByCampus, CTASection,
                  OrgFilterBar, OrgFilterChips, Profile*, RelatedOrganizations
    ui/           Breadcrumbs, ContactIcon, ScrollToTop, SearchInput, Section, Tooltip
    ui/shadcn/    avatar, badge, button, card, input, select, separator, sheet, ...
  data/           campuses.ts, orgBrowser.ts, programs.ts (constants)
  hooks/          useDebounce, useOrgBrowser, useTheme
  lib/            errorReporter, orgIndex (Zod schema + access), utils (cn, normalize)
  pages/          Home, OrgBrowser, OrganizationProfile, NotFound
contents/         JSON data files (colleges, nonacadorgs, campuses)
public/           Static assets (hero.png, org logos, campus images)
```

## Architecture

### Data Flow

1. **Content** — 14 JSON files in `contents/`, 89 organizations total
2. **Validation + access** — `src/lib/orgIndex.ts` is the single seam:
   - `import.meta.glob` loads all JSON eagerly at build time
   - the Zod schema validates each file; a malformed one is dropped whole
   - exports `organizations` (active orgs, main campus first, then alphabetical)
   - exports `getOrgBySlug(slug)` (case-insensitive)
3. **Consumers** — components import `organizations` directly, or go through
   `useOrgBrowser()` for URL-driven filtering

Data is synchronous, so there is no `loading` state anywhere. If a backend is ever needed,
`organizations` and `getOrgBySlug` are the only two things that have to change.

### Routing

| Path | Page |
|------|------|
| `/` | Home (hero, featured orgs, stats, browse by type and campus) |
| `/org` | OrgBrowser (search, filter, sort, infinite scroll) |
| `/org/:slug` | OrganizationProfile (banner, bento grid, related orgs) |
| `*` | 404 |

### Key Patterns

- **URL-driven filters**: search params as source of truth; debounced input (300ms)
- **Data-derived options**: campus and program filter lists come from the org data, so
  no option can ever lead to an empty page
- **Dark-first theme**: toggled via `useTheme` hook, persisted to localStorage
- **Error handling**: single `<ErrorBoundary>` wrapping all routes + `errorReporter` singleton
- **Lazy loading**: all pages via `React.lazy()` + `Suspense`

## Disclaimer

> **BetterOSAS is an independent personal project** and is **not affiliated with, endorsed by, or maintained by Cavite State University (CvSU)** or the Office of Student Affairs and Services (OSAS).
>
> All logos, names, and official information belong to their respective organizations and the University. This project is for educational and non-commercial purposes only.

## Contributing

Contributions are welcome. If you are a student leader and want your organization's information updated or corrected, open an issue.
