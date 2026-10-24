# ADR 0009 — Contact form delivers via Web3Forms

**Status:** accepted (2026-10-12) — supersedes ADR 0004

## Context

ADR 0004 put the contact form on Formspree's free tier, reasoning that ~50
submissions/month was fine for portfolio volume. Formspree's own plans page labels
that tier "For testing and development"; the plan it sells for this kind of site is
Personal ("For personal or portfolio sites", $120/year). Its Terms of Service don't
forbid production use of Free, but building a live site on a tier the vendor positions
as a sandbox invites a later tightening we'd have to react to. The site must still pay
$0 for contact, and it is still a static export (ADR 0001) with no server of its own.

## Decision

The form POSTs from the browser to Web3Forms on its free tier (250 submissions/month,
unlimited forms, marketed for static sites, delivery to andersonbegossi@gmail.com).
Anderson creates the Web3Forms access key; it lives in
`NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`. Everything else ADR 0004 required stands: the
`mailto:` link is the always-works fallback, the designed success card renders on
success, and while the key is unset or blank the form is not rendered at all.

## Considered options

- **Formspree Free** — 50/month, positioned as a testing tier (above).
- **Formspree Personal** — fits, but costs $120/year.
- **Formspark** — 250 submissions per workspace in total, not per month; then a
  one-time $25 for 50,000. Cheap, but not $0 for the life of the site.
- **Basin** — 50/month, described as "Great for testing and lite use": the same
  problem as Formspree Free.
- **FormSubmit** — free with no account, but the endpoint is the email address itself,
  in plain HTML, and it states no limits or reliability terms.
- **Vercel function + Resend** — needs server code outside the static export.

## Consequences

- The access key ships in client HTML by design; anyone can read it and post to the
  inbox from elsewhere. Restrict-to-domain, Turnstile and reCAPTCHA are Pro features,
  so spam defence on Free is Web3Forms' built-in filtering plus hCaptcha if needed.
- Submissions over 250 in a month fail; the form's error state and the `mailto:` link
  cover that.
- Web3Forms keeps submissions for 30 days on Free. Email is the record, so that is
  irrelevant.
- Still swappable for another endpoint without touching the form UI.
