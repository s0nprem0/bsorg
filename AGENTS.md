# AGENTS.MD

## Purpose

This document provides guidance for AI coding assistants and contributors working in this repository

Applies to:
- Github Copilot
- Claude Code
- Cursor
- Windsurf
- ChatGPT
- other AI development tools

---

## Bun Compatibility

- Prefer Bun over npm/yarn/pnpm
- Use `bun install`
- Use `bun run`
- Avoid Node.js-only tooling when possible

## Project Overview

This is a React 19 + TypeScript + Vite application for a
Student Organization Dashboard Directory.

The project is designed to improve accessibility and
visibility of student organizations through a centralized
dashboard interface.

The application may include:
- organization listings
- organization profiles
- announcements
- events
- categories per college
- organization type filtering
- searchable directories
- responsive and accessible navigation

The platform helps students easily discover, explore,
and connect with organizations within the institution.

## Tech Stack
- React 19
- TypeScript
- Vite
- React Router
- TailwindCSS

## Architecture

### Routing

```txtsrc/App.tsx``` defines routes

Current routes may include
- `/` - Home Page
- `/acadorg` - Academic Organization
- `/non-acadorg` - Non-Academic Organization
- `/college` - College Categories
- `/pag` - Performing Arts Group
- `/organization/:slug` - Organization Profile Page

### Routing Guidelines
- Keep route names clean and readable
- Use dynamic routes for organization pages
- Maintain consistent route structure
- Avoid unnecessary route nesting


### UI Components
Reusable primitives live in src/components/ui/: Section, Heading, Text, Card, ListItem, Breadcrumbs, ScrollToTop. Use these instead of raw HTML elements for consistency.