# andersonbegossi.dev

Source of Anderson Begossi's personal site and blog: [andersonbegossi.dev](https://andersonbegossi.dev).

## Stack

Next.js 16 (App Router, static export), React 19, TypeScript, CSS Modules, MDX, Vercel.

## Getting started

CI uses Node 24. This repo has no `.nvmrc` and no `engines` field. Yarn 4.18.0 is pinned in `package.json` and selected with Corepack.

```bash
corepack enable
yarn install
cp .env.example .env.local
yarn dev
```

`.env.local` sets `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`, the Web3Forms access key for the Contact form. When the variable is unset or blank, the form is not rendered. Next inlines it into the static export at build time.

## Scripts

| Script | Runs |
| --- | --- |
| `dev` | `next dev` |
| `build` | `next build` (static export in `out/`) |
| `typecheck` | `tsc --noEmit` |
| `test` | `vitest run` |
| `test:watch` | `vitest` |
| `lint` | `biome lint .` |
| `lint:fix` | `biome lint --write .` |
| `format` | `biome format --write .` |
| `format:check` | `biome format .` |
| `check` | `biome check .` |
| `check:fix` | `biome check --write .` |
| `prepare` | `husky` |

## Structure

English pages are the `(en)` route group at the site root. Portuguese pages are the `(pt)` route group under `/pt/`. UI strings live in `src/lib/i18n`. Posts are `content/blog/<slug>/{en,pt}.mdx`. Post images are in `public/images/blog`. Decisions are in `docs/adr`.

## License

MIT for the source code. Blog posts, written content, photos, images, résumé PDFs, and personal branding are all rights reserved. See `LICENSE`.
