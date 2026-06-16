# Module 1 — Product Knowledge Handbook (TestMu AI, formerly LambdaTest)

An internal onboarding handbook for **BDRs, SDRs, AEs & AMs**, reorganised into a single
chronological learning journey and published as a website.

**Live site:** _(GitHub Pages URL — see repo Settings → Pages)_

## What this is

The original Module 1 material (flashcards, reference PDFs, demo videos) was a flat folder of
assets with no obvious order. This rebuilds it as a guided path that mirrors the real life of a
piece of software — and therefore the product story:

1. **Software foundations** — front/back end, APIs, architecture, cloud
2. **How software is built** — SDLC, Agile/Waterfall/DevOps, CI/CD
3. **How software is tested** — STLC, frontend testing, testing types, jargon *(the section that was missing)*
4. **Where TestMu AI fits** — the Agentic Testing Life Cycle + all 14 product demos
5. **Go to market** — ICP, competition, messaging, objection handling
6. **Study** — 500+ interactive flashcards grouped by topic

## Structure

```
index.html              # the full handbook (single page, sticky nav)
assets/
  style.css             # styling
  app.js                # nav scroll-spy, flashcard engine, copy deterrents
  flashcards.js         # 508 flashcards (auto-generated from source CSVs)
  monolith-microservices.png
```

## Content protection

This is published on a public URL, so hard download-prevention isn't possible. The site applies
**deterrents** (disabled right-click, text selection, save/print shortcuts) and keeps all video
content as YouTube embeds (not downloadable files). For hard restriction, host behind a login.

## Editing

Content lives directly in `index.html`. Flashcards are regenerated from the source CSVs — see the
generation note at the top of `assets/flashcards.js`.
