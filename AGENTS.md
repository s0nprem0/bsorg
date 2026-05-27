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
2. **Validation** — `src/lib/orgIndex.ts`: `import.meta.glob` loads all JSON eagerly; Zod schema validates each org; `orgRegistry` singleton exposes `getAll()`, `getBySlug()`, `getAcademicOrgs()`, `getNonAcademicOrgs()`
3. **Service abstraction** — `src/lib/services/*`:
   - `types.ts`: `OrgService` interface (async — returns `Promise`)
   - `static.ts`: `StaticOrgService` — wraps `orgRegistry` in `Promise.resolve()`
   - `api.ts`: `ApiOrgService` — fetches from `{VITE_ORG_API_URL}/orgs`, Zod-validates, caches
4. **Hook layer** — `src/hooks/useOrgService.ts`:
   - `service` singleton: auto-selects `ApiOrgService` if `VITE_ORG_API_URL` is set, else `StaticOrgService`
   - `useOrgs()`: returns `{ orgs, loading, error }` using `useSyncExternalStore` for sync-compatible static access
   - `useOrg(slug)`: convenience hook wrapping `useOrgs()` with `find()`
5. **Consumer hooks** — `useOrgBrowser.ts` uses `useOrgs()` and binds to URL search params

### Component Tree (simplified)

```
App (BrowserRouter)
├── AutoScrollToTop
├── NavBar (logo, nav links, theme toggle, mobile sheet)
├── ErrorBoundary
│   └── Suspense (PageLoader)
│       └── Routes
│           ├── Home (Hero, Featured bento grid, Stats card, Browse categories, CTA)
│           ├── OrgBrowser (SearchInput, Select filters, filter chips, OrgGrid, infinite scroll)
│           ├── OrganizationProfile (Breadcrumbs, Banner, Bento grid, Gallery Dialog, RelatedOrgs)
│           └── NotFound
├── ScrollToTopButton (FAB after 400px scroll)
└── Footer (brand, nav links, GitHub)
```

### Data Files

~86 organizations across 14 JSON files:

| File | Count | Category |
|------|-------|----------|
| `contents/colleges/cafenr.json` | 6 | Academic |
| `contents/colleges/cas.json` | 10 | Academic |
| `contents/colleges/ccj.json` | 3 | Academic |
| `contents/colleges/ceit.json` | 13 | Academic |
| `contents/colleges/cemds.json` | 10 | Academic |
| `contents/colleges/con.json` | 3 | Academic |
| `contents/colleges/cspear.json` | 3 | Academic |
| `contents/colleges/cthm.json` | 3 | Academic |
| `contents/nonacadorgs/orgs.json` | ~11 | Non-Academic |
| `contents/nonacadorgs/pag.json` | 3 | Performing Arts |
| `contents/nonacadorgs/spu.json` | 5 | Student Publications |
| `contents/campuses/imus.json` | 12 | Campus-specific |
| `contents/campuses/naic.json` | 1 | Campus-specific |
| `contents/campuses/tmc.json` | 3 | Campus-specific |

Static assets in `public/` (hero.png, org.svg, campus/college images).

### Directory Layout

```txt
src/
  components/
    ErrorBoundary.tsx, OrganizationCard.tsx, SEO.tsx
    layout/   (CategoryPageTemplate, Footer, Navbar, OrgGrid)
    sections/ (Hero, RelatedOrganizations)
    ui/       (Breadcrumbs, ContactIcon, ScrollToTop, SearchInput, Section)
    ui/shadcn/ (avatar, badge, breadcrumb, button, card, dialog, input, select, separator, sheet)
  data/       (campuses.ts, orgBrowser.ts)
  hooks/      (useDebounce, useOrgBrowser, useOrgService, useTheme)
  lib/        (errorReporter, orgIndex, utils)
  lib/services/ (api.ts, static.ts, types.ts)
  pages/      (Home, NotFound, OrganizationProfile, OrgBrowser)
```

## Key Patterns

### Filters (OrgBrowser)
- URL search params are source of truth via `useSearchParams`
- Local `useState` for immediate input feedback
- `useDebounce(localQuery, 300ms)` syncs to URL on keystroke pause
- Filter chips with remove buttons; "Clear all" visible when any filter active
- De-duplicated `setLocalQuery` with functional `prev !== state.query` check to avoid cascading

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
- All data-loading components have distinct `loading`, `error`, and `empty` states

## Important Notes

### ESLint
- Plugin v10.4 has strict `react-hooks/set-state-in-effect` — synchronously setting state in `useEffect` body triggers error, even with functional form. Use `eslint-disable` comments when provably safe.
- `react-hooks/refs` rule prohibits reading/writing refs during render (broke render-phase sync approach for search input; used `useEffect` + functional setState instead)

### CSS / Tokens
- `text-foreground-secondary` token does NOT exist in theme CSS (silent no-op if used in JSX)
- `bg-surface-1`, `bg-surface-2`, `text-surface-2` ARE defined via `--color-surface-*` custom properties
- `scrollbar-none` is a custom `@utility` in `index.css`, NOT a built-in Tailwind v4 utility
- No `bg-gradient-*` in v4 — use `bg-linear-*` instead
- No `bg-size-*` in v4 — use `bg-[size:*]` arbitrary values instead

### Service Layer
- `VITE_ORG_API_URL` env var controls backend: set it → live API; unset → static JSON
- `useOrgService()` returns the raw `OrgService` singleton (rarely needed directly)
- Prefer `useOrgs()` and `useOrg(slug)` hooks for component consumption
- `ApiOrgService` expects `GET {baseUrl}/orgs` returning a JSON array of validated orgs
- Static service loads all orgs eagerly via `import.meta.glob` at build time

### Zod Schema
- `src/lib/orgIndex.ts` contains the full `orgValidationSchema` which is the single source of truth
- Used for both static JSON validation and API response validation
- `content` field defaults to `{}` via `.optional().default({})` — access `org.content.shortDescription` safely
- `campusId` is `z.number().int().min(0)` — always present; main campus is `0`

### Content Data
- Inactive-status orgs are excluded from the registry at load time
- Orgs are sorted: main campus (`campusId === 0`) first, then alphabetical by name
- `slug` field is used for URL routing (`/org/:slug`), matched case-insensitively
- The `getCampusName()` utility in `src/data/campuses.ts` is the canonical campus name resolver (no inline duplicates)

