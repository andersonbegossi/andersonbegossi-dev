# ADR 0004 — Contact form delivers via Formspree

**Status:** superseded by ADR 0009 (2026-10-12) — accepted 2026-07-11

## Context

The design's contact form fakes success (`submitForm` only flips a `sent` flag).
The site is fully static (ADR 0001), so there is no server of our own to receive
submissions.

## Decision

The form POSTs to Formspree (free tier, ~50 submissions/month, spam filtering,
delivery to andersonbegossi@gmail.com). Anderson creates the Formspree account; the
form ID lives in site config (placeholder until provided). The `mailto:` link remains
the always-works fallback. The designed success state renders on successful submission.

## Consequences

- Zero infrastructure to run; a third-party dependency and monthly cap accepted as
  fine for portfolio volume.
- If the form ID is still a placeholder at launch, the form must degrade gracefully
  (hidden or clearly non-functional is unacceptable — hide it until configured).
- Swappable later for a Vercel function + Resend without touching the form UI.
