# Contributing

Thanks for your interest in Math Hero.

## Getting started

```bash
npm install
npm run dev
```

The dev server runs on port 3034.

## Before you open a PR

- `npm run typecheck` must pass
- `npm run lint` must pass
- `npm test` (unit) must pass
- `npm run e2e` (Playwright) must pass
- PRs target `main`; CI must be green

## Project layout

- `app/` - Next.js App Router entry, styles, layout
- `components/` - UI (Game orchestrator + screens)
- `lib/` - pure logic: `math.ts` (question generator), `gameEngine.ts` (reducer), `settings.ts`, `heroes.ts`
- `tests/` - `node:test` unit tests
- `e2e/` - Playwright end-to-end tests
