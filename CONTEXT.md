# Context — begossi.dev portfolio

Anderson Begossi's public portfolio and technical blog. Implements, faithfully, the
"Anderson Begossi — Portfolio" design imported from claude.ai/design (source snapshot:
`docs/design/portfolio.dc.html`). The site is a professional front door for recruiters
and clients: SEO and shareable URLs are requirements, not nice-to-haves.

## Glossary

- **Screen** — one of the seven designed views: Home, About, Projects, Blog, Article,
  Resume, Contact. Each screen is a routed page (no in-memory-only screens).
- **Locale** — `en` (default, served at the URL root) or `pt` (Brazilian Portuguese,
  served under the `/pt/` prefix). Every page exists in both locales with `hreflang`
  links between the pair.
- **Post** — a blog article authored as MDX, one file per locale:
  `content/blog/<slug>/{en,pt}.mdx`. Frontmatter: `title`, `excerpt`, `date`,
  `category`, `tags`, `minutes`, `featured`.
- **Project card** — an entry on the Projects screen. Cards render a styled image
  placeholder until a real screenshot exists, and omit GitHub/Live buttons for
  repositories that are not public (see Link policy).
- **Accent** — the single brand color, red `#B91C1C` (`--accent-base`), used via the
  design's light/dark token set (`--bg`, `--fg`, `--muted`, `--faint`, `--border`,
  `--card`, `--code`).

## Fixed facts

- GitHub account for all public links: **`andersonbegossi`** (not `ambegossi`).
- LinkedIn: `linkedin.com/in/andersonbegossi-b5065a130` · Email: `andersonbegossi@gmail.com`.
- Custom domain: to be purchased (begossi.dev has no DNS today). Until then the site
  lives on its Vercel URL; the canonical base URL is a single site-config constant.
- Assets pulled from the design project are served from `public/`:
  `hero-photo.webp`, `Anderson-Begossi-Resume.pdf`.

## Link policy

A visible link must resolve. Project GitHub/Live buttons are omitted while the target
repo is private/nonexistent. The design's other project cards (`stewart-acid-base`,
`voce-mais-saude`, `rn-monorepo-starter`, all 404 publicly today) are not shown at all;
the only card, `begossi.dev`, links to this repository
(`github.com/andersonbegossi/abegossi`), which is public. The design's placeholder
`apps.apple.com` "Live" link is dropped.

Two design controls needed correcting under this rule:

- **Employer link.** The design points "Bamse" at `bamse.com.br`, which is NXDOMAIN.
  The real site is `https://www.bamse.co/`, and that is what the Home hero links to.
- **Language toggle.** The design swaps strings on a single URL; the header control is a
  link to the same screen in the other locale instead (ADR 0002), so what it points at
  always resolves.

## Decisions

See `docs/adr/`:

- 0001 — Next.js with full static generation
- 0002 — i18n URL structure: EN at root, `/pt/` prefix
- 0003 — Blog content as MDX, one file per post per locale
- 0004 — Contact form delivers via Formspree
- 0005 — Hosting on Vercel
- 0006 — Directory-style URLs with a trailing slash
- 0007 — Biome for linting and formatting
- 0008 — CSS Modules and no component library
