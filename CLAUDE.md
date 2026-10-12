# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# abegossi

begossi.dev — Anderson Begossi's portfolio and technical blog. Next.js App Router, fully
statically exported.

## Commands

```bash
yarn dev         # Next dev server
yarn build       # static export into out/
yarn typecheck   # tsc --noEmit (also runs in the pre-commit hook)
yarn test        # vitest run
yarn test:watch
yarn check       # biome lint + format check
yarn check:fix   # biome autofix (what lint-staged runs on commit)
```

Single test file / single case:

```bash
yarn vitest run 'src/app/(en)/page.test.tsx'
yarn vitest run -t 'introduces Anderson'
```

Commits must follow Conventional Commits with no scope — `feat: …`, not `feat(i18n): …`
(commitlint, 72-char header). `.husky/commit-msg` enforces it, and `.husky/pre-commit` runs
lint-staged plus `typecheck`.

## Read before working

- `CONTEXT.md` — glossary (Screen, Locale, Post, Project card, Accent), fixed facts, and the
  **link policy**. Read it before adding any user-visible link or naming a domain concept.
- `docs/adr/0001`–`0008` — the binding decisions (static export, i18n URL shape, MDX blog,
  Formspree contact, Vercel, trailing-slash URLs, Biome, CSS Modules). Surface a conflict
  explicitly instead of silently overriding an ADR.
- `docs/design/portfolio.dc.html` — the design snapshot this site implements faithfully.
  Tokens, copy and layout come from it verbatim; it is excluded from Biome.

## Architecture

**Static export is a hard constraint.** `next.config.ts` sets `output: 'export'`,
`trailingSlash: true`, `images.unoptimized`. No route handlers, no server actions, no runtime
server features — anything dynamic must be client-side or a third-party endpoint (hence
Formspree for contact, ADR 0004).

**Single source of truth per concern:**

- `src/lib/site-config.ts` — every host-dependent value and external URL. Nothing else may
  hardcode the host; attaching the real domain must stay a one-line change.
- `src/lib/i18n/{en,pt}.ts` — all UI chrome strings, copied verbatim from the design, both
  filling the `Dictionary` type so a missing translation is a compile error. Components never
  inline user-visible copy; they call `getDictionary(locale)`.
- `src/lib/i18n/locale.ts` — the only place that knows the `/pt` prefix. `localePath` builds a
  locale's URL for a *screen path* (`/`, `/about`), `screenFromPathname` reads one back.
- `src/lib/data/projects.ts` — project cards, with the link policy already applied.
- `src/app/globals.css` — the light/dark token set (`--bg`, `--fg`, `--muted`, `--faint`,
  `--border`, `--card`, `--code`, `--accent`). Component styles are CSS Modules that consume
  these tokens; no component library (ADR 0008).

**Locales are routes, not state (ADR 0002).** `src/app/` has no root layout of its own: the
`(en)` and `(pt)` route groups are two root layouts, which is what lets each locale declare
its own `<html lang>` in a static export. `(en)/about` is `/about`, `(pt)/pt/about` is
`/pt/about`. Every page exports `screenMetadata(locale, screen)` for its own canonical and
`hreflang` pair — a layout cannot, since it would claim one canonical URL for every page
under it. The chrome reads the locale off the pathname, so pages never thread it down. With
no root layout, the 404 has nothing to wrap it: `src/app/global-not-found.tsx` renders the
document itself (via the same `RootDocument`), which is why it is not `not-found.tsx`.

**Chrome and theming:** `SiteShell` (header + main + footer) is deliberately outside the root
layouts so tests can render a route in its real surroundings without an `<html>`
document. Theme is `data-theme` on `<html>`: `src/lib/theme.ts` exports both the runtime
helpers and `themeInitScript`, a blocking inline script in `<head>` that sets the attribute
before first paint. The two must stay in sync — changing resolution logic means changing both.

**Screens:** each of the seven designed screens is a routed page. Screens whose ticket hasn't
landed render `ScreenStub` so every link the header exposes already resolves. Replace the stub
wholesale when implementing that screen.

## Testing

Vitest + jsdom + Testing Library. Tests render through the `renderRoute` seam
(`src/test/render-route.tsx`), which wraps the page in `SiteShell` and sets the pathname for
the `next/navigation` mock installed in `vitest.setup.ts`. Assert on what a visitor sees
(roles, visible text, real hrefs); do not reach for component internals.

## Agent skills

### Issue tracker

Issues live in this repo's GitHub Issues (andersonbegossi/abegossi), via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
