# ADR 0010 — Page views via Vercel Web Analytics

**Status:** accepted (2026-11-11)

## Context

The site is a static export (ADR 0001) hosted on Vercel (ADR 0005), so nothing
of our own can record a visit. Anderson is enabling Vercel Web Analytics on the
project. Every route in both locales should report a page view. The product is
cookieless, so there is no consent banner to add, and the repo has no
Content-Security-Policy and no custom response headers.

English and Portuguese are two root layouts (ADR 0002). Both render
`RootDocument`, and so does the static 404, which has no layout left to wrap
it. A script in only one layout would miss the other locale. Copying it into
both layout files is the drift that shared document exists to prevent.

## Decision

Depend on `@vercel/analytics` and render `<Analytics />` from
`@vercel/analytics/next` inside `RootDocument`. Each root layout therefore
mounts it once, and no page mounts it again. The component is a client
component and works with `output: 'export'`: it prerenders to nothing, then
after hydration appends the analytics script and reports the route from
`usePathname`. With no platform config that script is
`/_vercel/insights/script.js`. A Vercel build sets
`NEXT_PUBLIC_VERCEL_OBSERVABILITY_CLIENT_CONFIG`, and the component uses the
script and intake paths from that config instead. It needs no route handler,
rewrite, cookie, or server. Leave `mode` on `auto`, so a production build
sends views and local development only logs them.

## Consequences

- Page views for both locales, including client navigations and the 404, reach
  the Vercel project once Web Analytics is enabled there and a deployment is
  built on Vercel. A local `out/` does not serve `/_vercel/insights/*`; the
  script 404s until Vercel is the host.
- The script tag is not in the prerendered HTML. It appears in `document.head`
  after the client bundle runs. That is how `@vercel/analytics` 2.x injects
  it, and a static export still counts the view.
- The script and intake URLs are not hardcoded. On a Vercel build they come
  from the observability client config: a same-origin hashed script, plus its
  view, event, and session endpoints. A local production build keeps
  `/_vercel/insights/script.js`. A future Content-Security-Policy must allow
  whichever of those same-origin paths the build actually emits.
- One more runtime dependency, the host's own cookieless script. Not a
  component library (ADR 0008) and not a second analytics vendor.
