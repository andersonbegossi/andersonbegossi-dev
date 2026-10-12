# ADR 0003 — Blog content as MDX, one file per post per locale

**Status:** accepted (2026-07-11)

## Context

The design carries its four seed posts as JS objects (arrays of heading/paragraph/code
blocks) duplicated per language inside one script. Every post edit would be a code
edit, and long-form writing in string literals is hostile.

## Decision

Posts are MDX files: `content/blog/<slug>/en.mdx` and `content/blog/<slug>/pt.mdx`,
with frontmatter `title`, `excerpt`, `date`, `category`, `tags`, `minutes`,
`featured`. ~~The four designed posts are converted to MDX as seed content.~~ (Amended
2026-10-12: the site launches with no posts — the designed posts are not published — and
the Blog screen shows an empty-state note until the first post lands.) A post is
published in a locale by the existence of its file.

## Consequences

- New post = new files; no code changes. Category filters and search derive from
  frontmatter at build time.
- Requires an MDX pipeline in the build; article body styling moves from inline
  design markup to shared MDX components (headings, paragraphs, code blocks styled
  per the design).
- UI chrome strings (nav, buttons, section titles) are NOT MDX — they stay in typed
  per-locale dictionaries.
