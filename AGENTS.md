# AGENTS.MD

## Purpose

This document provides guidance for AI coding assistants and contributors working in this repository.

Applies to: GitHub Copilot, Claude Code, Cursor, Windsurf, ChatGPT, and other AI development tools.

---

## Project Overview

BetterOSAS — a student-led directory for exploring academic, cultural, and special interest
organizations across the Cavite State University (CvSU) network.

The platform helps students easily discover, explore, and connect with organizations
within the institution.

## Tech Stack

- React 19 + TypeScript
- Vite 8
- React Router 7 (lazy routes with Suspense)
- TailwindCSS v4
- shadcn/ui (Radix primitives: Avatar, Dialog, Select, Sheet, etc.)
- Zod v4 (schema validation for organization data and API responses)
- Lucide React + react-icons (ICONS)
- react-helmet-async (SEO via `<SEO>` component)
- class-variance-authority (cva for button/badge variants)
- clsx + tailwind-merge (cn() utility)

## Commands

```sh
bun dev            # Start dev server
bun run build      # Production build (tsc -b && vite build)
bun run preview    # Preview production build
npx tsc --noEmit   # TypeScript check
npx eslint src/    # Lint
```

## Conventions

- **Commits**: conventional commits (`feat:`, `fix:`, `refactor:`, `chore:`, etc.)
- **Imports order**: react → react-router → lucide → local components → shadcn → data/lib/hooks
- **Exports**: default exports for pages, named exports for everything else (components, utilities, hooks)
- **CSS**: Tailwind v4 syntax only — no `@apply` for component styles, no custom CSS files beyond `index.css`
- **State paradigm**: URL search params as source of truth for filters; local `useState` for immediate UI feedback (search input), synced via `useDebounce` + `useEffect`
- **Error handling**: `ErrorBoundary` (wraps all routes once in `App.tsx`) + `errorReporter` singleton

## Routes

| Path         | Component (lazy)        | Purpose                                |
|--------------|-------------------------|----------------------------------------|
| `/`          | `Home`                  | Landing: hero, featured orgs, stats, categories, CTA |
| `/org`       | `OrgBrowser`            | Search, filter, sort, infinite scroll  |
| `/org/:slug` | `OrganizationProfile`   | Bento-grid profile, banner, gallery, related orgs |
| `*`          | `NotFound`              | 404 catch-all                          |

All routes are lazy-loaded via `React.lazy()` + `<Suspense fallback={<PageLoader />}>`.

## Architecture

### Data Flow

1. **Content layer** — 14 JSON files in `contents/` (8 college orgs, 3 non-academic, 3 campus-specific)
2. **Validation + access** — `src/lib/orgIndex.ts`, the single data seam:
   - `import.meta.glob` loads all JSON eagerly at build time
   - the Zod schema validates each file; a malformed file is reported to `errorReporter` and dropped whole
   - exports `organizations: Organization[]` — active orgs only, main campus first, then alphabetical by name
   - exports `getOrgBySlug(slug)` — case-insensitive, trims whitespace

Data is synchronous, so there is no `loading` or `error` state in consumers. If a backend ever
lands, `organizations` and `getOrgBySlug` are the only two things that need to change.
3. **Consumer hooks** — `useOrgBrowser.ts` binds URL search params to filters over `organizations`

### Component Tree (simplified)

```
App (BrowserRouter)
├── AutoScrollToTop
├── NavBar (logo, nav links, theme toggle, mobile sheet)
├── ErrorBoundary
│   └── Suspense (PageLoader)
│       └── Routes
│           ├── Home (Hero, Featured bento grid, Stats card, Browse by type, Browse by campus, CTA)
│           ├── OrgBrowser (SearchInput, Select filters, filter chips, OrgGrid, infinite scroll)
│           ├── OrganizationProfile (Breadcrumbs, Banner, Bento grid, Identity/Campus/Connect/About cards, SubOrgs, RelatedOrgs)
│           └── NotFound
├── ScrollToTopButton (FAB after 400px scroll)
└── Footer (brand, nav links, GitHub)
```

### Data Files

89 organizations across 14 JSON files:

| File | Count | Category |
|------|-------|----------|
| `contents/colleges/cafenr.json` | 6 | Academic |
| `contents/colleges/cas.json` | 10 | Academic |
| `contents/colleges/ccj.json` | 3 | Academic |
| `contents/colleges/ceit.json` | 13 | Academic |
| `contents/colleges/cemds.json` | 10 | Academic |
| `contents/colleges/con.json` | 3 | Academic |
| `contents/colleges/cspear.json` | 4 | Academic |
| `contents/colleges/cthm.json` | 3 | Academic |
| `contents/nonacadorgs/orgs.json` | 11 | Non-Academic |
| `contents/nonacadorgs/pag.json` | 3 | Performing Arts |
| `contents/nonacadorgs/spu.json` | 5 | Student Publications |
| `contents/campuses/imus.json` | 14 | Campus-specific |
| `contents/campuses/naic.json` | 1 | Campus-specific |
| `contents/campuses/tmc.json` | 3 | Campus-specific |

91 static assets in `public/` (hero.png, org.svg, campus/college images). Every one is
referenced by an org's `assets.logoUrl`/`bannerUrl` or is a PWA manifest icon — check
before adding more, since the service worker precaches all of them.

### Directory Layout

```txt
src/
  components/
    ErrorBoundary.tsx, OrganizationCard.tsx, SEO.tsx
    layout/   (Footer, Navbar, OrgGrid)
    sections/ (BrowseByCampus, BrowseCategories, CTASection, FeaturedGrid, Hero, OrgFilterBar, OrgFilterChips, ProfileAboutCard, ProfileCampusCard, ProfileConnectCard, ProfileIdentityCard, ProfileStates, RelatedOrganizations)
    ui/       (Breadcrumbs, ContactIcon, ScrollToTop, SearchInput, Section, Tooltip)
    ui/shadcn/ (avatar, badge, badge-variants, breadcrumb, button, button-variants, card, input, select, separator, sheet)
  data/       (campuses.ts, orgBrowser.ts, programs.ts)
  hooks/      (useDebounce, useOrgBrowser, useTheme)
  lib/        (errorReporter, orgIndex, utils)
  pages/      (Home, NotFound, OrganizationProfile, OrgBrowser)
```

## Key Patterns

### Filters (OrgBrowser)
- URL search params are source of truth via `useSearchParams`
- Local `useState` for immediate input feedback
- `useDebounce(localQuery, 300ms)` syncs to URL on keystroke pause
- Filter chips with remove buttons; "Clear all" visible when any filter active
- De-duplicated `setLocalQuery` with functional `prev !== state.query` check to avoid cascading
- Selects are category, program, campus, sort. `type` is still a valid URL param (the home page's
  browse-by-type cards link to it) but has no select of its own

### Theme
- Dark-first: `:root` is dark, `:is(.dark *)` is identical, `:is(.light *)` overrides all tokens
- `useTheme` hook persists to `localStorage` key `betterosas-theme`
- Class toggled on `<html>` element

### Infinite Scroll
- `IntersectionObserver` in OrgBrowser on a sentinel `<div>`
- `loadMore()` increments page in URL params (replaces)
- `visibleOrgs = allFiltered.slice(0, currentPage * ITEMS_PER_PAGE)`

### SEO
- `react-helmet-async` provider in `main.tsx`
- `<SEO>` wrapper component with title, OG tags, Twitter card

### Error Handling
- `ErrorBoundary`: class component wrapping all routes in App.tsx, renders retry UI on error
- `errorReporter.capture(error, context)`: detailed dev console logging in dev, ships to monitoring in prod
- Data is synchronous, so components have `empty` and `error` states but no `loading` state

## Important Notes

### ESLint
- Plugin v10.4 has strict `react-hooks/set-state-in-effect` — synchronously setting state in `useEffect` body triggers error, even with functional form. Use `eslint-disable` comments when provably safe.
- `react-hooks/refs` rule prohibits reading/writing refs during render (broke render-phase sync approach for search input; used `useEffect` + functional setState instead)

### CSS / Tokens
- `text-foreground-secondary` token does NOT exist in theme CSS (silent no-op if used in JSX)
- `bg-surface-1`, `bg-surface-2`, `text-surface-2` ARE defined via `--color-surface-*` custom properties
- No `bg-gradient-*` in v4 — use `bg-linear-*` instead
- No `bg-size-*` in v4 — use `bg-[size:*]` arbitrary values instead
- Only the raw palette vars actually referenced by a token are kept in `index.css`; add new ones there rather than reaching for a default Tailwind palette

### Zod Schema
- `src/lib/orgIndex.ts` contains the full `orgValidationSchema`, the single source of truth
- `active` is `z.boolean().default(true)` — the default matters, since a missing key fails the whole file's parse
- `content`, `assets`, `contact` default to `{}` — access `org.content.shortDescription` safely
- `campusId` is `z.number().int().min(0)` — always present; main campus is `0`

### Content Data
- Orgs with `active: false` are excluded from `organizations` at load time
- Orgs are sorted: main campus (`campusId === 0`) first, then alphabetical by name
- `slug` is used for URL routing (`/org/:slug`), matched case-insensitively via `getOrgBySlug()`
- The `getCampusName()` utility in `src/data/campuses.ts` is the canonical campus name resolver (no inline duplicates)
- `campusesWithOrgs()` derives the campus filter options from the data — 4 of the 11 campuses hold no orgs
- `abbreviateProgram()` maps a full degree name to its acronym; the override map only holds what the initials rule cannot produce

