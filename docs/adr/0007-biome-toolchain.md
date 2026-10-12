# ADR 0007 — Biome for linting and formatting

**Status:** accepted (2026-08-01)

## Context

The repo needs a linter, a formatter, and a commit-time gate. The default choice
for a Next.js project is ESLint (`eslint-config-next`) plus Prettier, because
`@next/eslint-plugin-next` carries framework rules no generic linter knows.

That reasoning is weaker than it looks here. Biome 2.x ships a `next` rule domain
that activates automatically when `next` >= 14 is a dependency. Diffing the two
rule sets against *this* codebase: of the 21 `@next/eslint-plugin-next` rules,
Biome covers 12, and 8 of the 9 it misses are Pages Router rules (`_document`,
`_app`, `getStaticProps` typos) that cannot fire in an App Router export, or
Google-Font rules that `next/font` already handles. The single real loss is
`no-html-link-for-pages`.

Meanwhile the codebase is CSS-Modules-heavy — every screen and component carries
its own stylesheet — and Biome lints CSS, which `eslint-config-next` does not.

## Decision

Biome (`biome.json`) is the only linter and formatter. It covers TS, TSX, CSS and
JSON in one binary. Commits are gated by Husky:

- `pre-commit` — `lint-staged` runs `biome check --write` over staged files, then
  a whole-project `tsc --noEmit`.
- `commit-msg` — `commitlint` enforces Conventional Commits.

Formatter settings match the code already written by hand: single quotes in JS/TS,
100-column width, trailing commas, semicolons.

## Consequences

- One config file and one dependency instead of ESLint + Prettier +
  `eslint-config-prettier` and the conflict surface between them.
- CSS is linted, not merely formatted.
- No type-aware lint rules. Biome does not read the type graph, so
  `no-floating-promises` and `no-misused-promises` are unavailable. Nothing in the
  app is async today; if the contact form (ADR 0009) or the MDX pipeline
  (ADR 0003) introduce real async code, revisit by adding `typescript-eslint`
  type-checked rules as a CI-only step rather than replacing Biome.
- `no-html-link-for-pages` is not enforced. Internal links are instead covered by
  the route-render tests, which assert `href` values directly.
- Two deliberate suppressions carry inline justifications: the pre-hydration theme
  script (`noDangerouslySetInnerHtml`, `src/app/layout.tsx`) and the
  reduced-motion reset (`noImportantStyles`, `src/app/globals.css`) — where
  Biome's suggested fix would have removed the accessibility guarantee.
- Commit subjects must now be Conventional Commits. History before this ADR is not.
