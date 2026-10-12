# ADR 0001 — Next.js with full static generation

**Status:** accepted (2026-07-11)

## Context

The site is a real public portfolio: article URLs must be shareable and indexable
(ADR-less requirement from the grilling session — SEO matters). The imported design is
a client-side SPA whose routing and content live in memory, which would leave the
Portuguese content and every article invisible to search. Anderson's professional
stack is React/Next.js, and the design itself describes the site as "Next.js, MDX, i18n".

## Decision

Build with Next.js (App Router). Every route is statically generated at build time —
no runtime server rendering, no data fetching in production. The site must remain
deployable as plain static output.

## Consequences

- Per-page/per-article URLs, full pre-rendered HTML, best-possible SEO and TTFB.
- The site doubles as a work sample of Anderson's professional stack.
- No server features (API routes, middleware-based locale detection) may be relied on;
  anything dynamic must work client-side or via third parties (see ADR 0009).
