# ADR 0005 — Hosting on Vercel

**Status:** accepted (2026-07-11)

## Context

Static Next.js output (ADR 0001) can be hosted anywhere; the trade-off is workflow.
The site's domain is `andersonbegossi.dev` (amended 2026-10-12; originally planned as
begossi.dev).

## Decision

Deploy on Vercel's free tier, connected to `github.com/andersonbegossi/andersonbegossi.dev`.
Pushes to `main` deploy production; PRs get preview URLs. The canonical base URL is a
single site-config constant, set to `https://andersonbegossi.dev`; attaching the domain
is a Vercel dashboard step.

## Consequences

- Zero-config deploys and per-PR previews.
- Canonical URLs, `hreflang`, sitemap and robots all read the base-URL constant —
  nothing else may hardcode the host.
- Until the domain is attached in Vercel, the site is reachable only at
  `<project>.vercel.app`, while canonical URLs already point at `andersonbegossi.dev`.
