# Plan

## Observed

- The only learner-facing English catalog is composed by `CatalogSidebar`, while `_app.tsx` loads its data on every app route.
- The reading and recitation route files own all English lesson UI. The audio route and `lib/english.ts` are backend capabilities that can remain without a visible entry point.
- The public landing page already presents only mathematics and physics, and `/` is reachable without authentication.
- The live database currently contains 14 `sr_lessons` rows whose subject is `english`.

## Route

1. Update the Product and Engineering Charter contracts to record that English learning is no longer an application surface while retained English data and tooling remain dormant.
2. Remove English lesson loading and rendering from the app shell and catalog.
3. Replace the old reading and recitation pages with pre-render redirects to the public landing page.
4. Remove English-only UI strings and styles, leaving server/data modules, the audio backend route, resources, and skills untouched.
5. Verify the two viewports, old URL redirects, a mathematics lesson, console health, the retained database row count, tests, and build.

