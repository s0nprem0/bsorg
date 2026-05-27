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
    layout/       Navbar, Footer, OrgGrid, CategoryPageTemplate
    sections/     Hero, RelatedOrganizations
    ui/           Breadcrumbs, ContactIcon, ScrollToTop, SearchInput, Section
    ui/shadcn/    avatar, badge, button, card, dialog, input, select, sheet, ...
  data/           campuses.ts, orgBrowser.ts (constants)
  hooks/          useDebounce, useOrgBrowser, useOrgService, useTheme
  lib/            errorReporter, orgIndex (Zod schema + registry), utils (cn, normalize)
  lib/services/   types.ts, static.ts, api.ts (swappable data layer)
  pages/          Home, OrgBrowser, OrganizationProfile, NotFound
contents/         JSON data files (colleges, nonacadorgs, campuses)
public/           Static assets (hero.png, org logos, campus images)
```

## Configuration

| Env Var | Default | Purpose |
|---------|---------|---------|
| `VITE_ORG_API_URL` | (unset) | When set, fetches org data from API instead of bundled JSON |

## Architecture

### Data Flow

1. **Content** — 14 JSON files in `contents/` (~86 organizations total)
2. **Schema** — Zod validation in `src/lib/orgIndex.ts` (single source of truth)
3. **Service** — Abstract `OrgService` interface with two implementations:
   - `StaticOrgService`: wraps bundled JSON (default)
   - `ApiOrgService`: fetches from `{VITE_ORG_API_URL}/orgs` with caching
4. **Hooks** — `useOrgs()` and `useOrg(slug)` return `{ orgs, loading, error }`
5. **Consumers** — Components use `useOrgs()` via `useOrgBrowser` or directly

### Routing

| Path | Page |
|------|------|
| `/` | Home (hero, featured orgs, stats, categories) |
| `/org` | OrgBrowser (search, filter, sort, infinite scroll) |
| `/org/:slug` | OrganizationProfile (banner, bento grid, gallery, related orgs) |
| `*` | 404 |

### Key Patterns

- **URL-driven filters**: search params as source of truth; debounced input (300ms)
- **Dark-first theme**: toggled via `useTheme` hook, persisted to localStorage
- **Error handling**: single `<ErrorBoundary>` wrapping all routes + `errorReporter` singleton
- **Lazy loading**: all pages via `React.lazy()` + `Suspense`

## Disclaimer

> **BetterOSAS is an independent personal project** and is **not affiliated with, endorsed by, or maintained by Cavite State University (CvSU)** or the Office of Student Affairs and Services (OSAS).
>
> All logos, names, and official information belong to their respective organizations and the University. This project is for educational and non-commercial purposes only.

## Contributing

Contributions are welcome. If you are a student leader and want your organization's information updated or corrected, open an issue.
