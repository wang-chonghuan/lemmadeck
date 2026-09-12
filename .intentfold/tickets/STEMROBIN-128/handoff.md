# Handoff

## What Changed

- Removed the English lesson query and catalog branch from the shared app shell.
- Replaced the English reading and recitation pages with pre-render redirects to the public landing page.
- Removed English-learning UI strings and component styles.
- Updated the Product and Engineering Charters to state that English learning is no longer an application surface.
- Preserved `app/src/lib/english.ts`, its tests, the audio backend route, database rows, resources, and `sr-voa1500`.

## AC Results

1. **English navigation is absent** — passed in headed Chromium at 1440x960 and 390x844. The authenticated catalog contained neither `技术英语` nor `A1A2` and had no `/english/` links.
2. **Old English URLs do not expose English content** — passed. `/english/english-u01-01` and `/english/english-u01-01/recite` both resolved to `/` without rendering English lesson UI.
3. **Mathematics remains usable** — passed at both viewports on `/card/alg6-c1-s2-n3`; the catalog and lesson prose rendered with no browser console or page errors.
4. **Charter reflects the product decision** — passed. Product intent now excludes English learning, and Engineering records the legacy redirect behavior plus retained dormant backend capability.
5. **English data and deployment readiness** — local/data portion passed. The live schema contained 14 English lesson rows before and after implementation. Production deployment and HTTP health are performed by cap4.

Mechanical defence passed: 12 test files, 77 tests, and the production build.

## Deviations

None. The legacy paths were retained as redirect stubs exactly as planned so saved links produce a usable public page rather than a 404.

## Environment

- Local web port: `52128`
- Environment keys added, changed, or removed: none

## Residual

The retained English data, generation skill, server module, and audio endpoint are intentionally dormant. Deleting those assets would require a separate destructive-removal decision and ticket.

