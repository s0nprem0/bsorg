# AGENTS.MD

## Purpose

This document provides guidance for AI coding assistants and contributors working in this repository

Applies to:
- GitHub Copilot
- Claude Code
- Cursor
- Windsurf
- ChatGPT
- other AI development tools

---

## Project Overview

BetterOSAS — a student-led directory for exploring academic, cultural, and special interest
organizations across the Cavite State University (CvSU) network.

The platform helps students easily discover, explore, and connect with organizations
within the institution.

## Tech Stack

- React 19 + TypeScript
- Vite 8
- React Router 7
- TailwindCSS v4
- shadcn/ui (with @radix-ui primitives + @base-ui/react)
- Zod (schema validation)
- Lucide React (icons)
- react-helmet-async (SEO)

## Commands

```sh
bun dev           # Start dev server
bun run build     # Production build
bun run preview   # Preview production build
npx tsc --noEmit  # TypeScript check
npx eslint src/   # Lint
```

## Conventions

- **Commits**: conventional commits (`feat:`, `fix:`, `refactor:`, `chore:`, etc.)
- **Imports**: react → react-router → lucide → local components → shadcn → data/lib
- **Components**: default exports for pages, named exports for everything else
- **CSS**: Tailwind v4 syntax only — no custom CSS files, no `@apply` for component styles
- **State**: URL search params as source of truth for filters; local state for immediate UI feedback

## Architecture

### Routes

```txt
/              Home
/org           OrgBrowser (search, filter, sort, infinite scroll)
/org/:slug     OrganizationProfile (bento grid, banner, gallery, related orgs)
/directory     Directory (category-grouped with quick-nav)
*              NotFound
```

### Data

- All org data stored as JSON files in `contents/colleges/`, `contents/nonacadorgs/`, `contents/campuses/`
- Loaded eagerly via `import.meta.glob` + validated with Zod in `src/lib/orgIndex.ts`
- `orgRegistry` singleton provides `getAll()`, `getBySlug()`, `getAcademicOrgs()`, `getNonAcademicOrgs()`
- Constants split by domain in `src/data/` (campuses, colleges, programs, etc.)

### Key Patterns

- **Filters**: URL-driven via `useSearchParams`; debounced search (300ms); filter chips with remove
- **Theme**: dark-first; `.light` class override; persisted to localStorage via `useTheme` hook
- **Errors**: `ErrorBoundary` + `errorReporter` singleton (console in dev, ready for Sentry)
- **SEO**: `react-helmet-async` with `<SEO>` wrapper component

## Dark/Light Mode

- Defaults to dark; respects `prefers-color-scheme`
- Toggle in navbar; persisted to `localStorage` key `betterosas-theme`
- CSS variables in `:root` (dark) and `.light` class override

## Important Notes

- ESLint plugin v10.4 has strict `react-hooks/set-state-in-effect` rule — functional setState with identity check requires `eslint-disable`
- `react-hooks/refs` rule prohibits reading/writing refs during render
- `text-foreground-secondary` token does NOT exist in theme CSS (silent no-op)
- `bg-surface-1/2`, `text-surface-2` ARE defined via `--color-surface-*` custom properties
