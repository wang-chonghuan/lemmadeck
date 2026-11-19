# n5 Offline Display Review

Date: 2026-11-19. Result: **ISSUES**, one typography issue on two surfaces.

## Real Issue

At both **1440x960** and **390x844**, the visible `li.ex .no` number labels are **16px**, while adjacent `li.ex .body` prose is **16.64px**. This violates the requested numbers-not-smaller-than-prose criterion.

- Written exercise numbers 43..48: `/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck/.tmp/stemrobin-184-resume/offline/render/9c/modern-us-neutral/ana9-c2-s1-n5/exercises.html`
- Choice numbers 1..6: `/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck/.tmp/stemrobin-184-resume/offline/render/9c/modern-us-neutral/ana9-c2-s1-n5/choices.html`

No defects were repaired; generated HTML and canonical resources were untouched.

## Passed

- `text.html` passes both viewports. All 21 prose blocks flow visibly; no body horizontal overflow, observed glyph failure, overlap or clipping.
- The projected SVG table has 35 nonblank, unclipped, nonoverlapping labels. Actual transformed screen text is at least **24px desktop** and **17.9px mobile**, above the supplied FigureSpec minimum of 16px. Final table row is reachable and visible.
- All six written exercises 43..48 and all six choices 1..6 with 24 options are visible and numbered.
- Six native radio groups `q43`..`q48`, four options each. All 24 option selections at each viewport preserve every other group's state and leave DOM markup unchanged. No scripts, handlers, forms, submit controls, hidden inputs, answer/key attribute names or key literals were detected in the choices projection.
- Every detected math scroller reaches its right end; final content is reachable on all pages. Mainline math/Latin roots are not smaller than prose.
- Zero KaTeX errors, replacement/missing-box markers, failed font faces, console errors or page errors. One visual inspection of each screenshot found no missing glyphs, overlap or clipping.

## Evidence And Limits

One run, six isolated `headless:true` contexts, six `file://` page opens, six whole-page screenshots, six image opens, zero extra images. Existing app Playwright was used. Offline contexts, a deny-all non-page request route and disabled DNS resolution blocked external networking. The owned browser closed in `finally`.

The first script version incorrectly expected written-exercise numbers on the choices display. Recorded choice labels 1..6 and radio groups q43..q48 satisfy the actual request. Only that review-script assertion was corrected afterward; no browser rerun was made, and the false positive is excluded from real issues.

This is **offline display evidence, not product acceptance**. No application/server/authentication/DB/production checks, installs, network, models, publishing, Git, desktop/profile/CDP/PWDEBUG or new workers. Canonical lesson/exercise/retained-choice files were opaque hash bindings only, not parsed. Answer keys, original scans and separate figures were not opened. No approved source, mathematics, table, choice or concept-whitespace review was repeated.

Evidence directory: `/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck/.tmp/stemrobin-184-resume/n5-offline-review/`

- `review.mjs`: local check script
- `checks.json`: observed checks and limits
- `hashbindings.json`: unchanged projection and opaque canonical bindings
- `images-ledger.json`: all six screenshot paths, hashes and single-open counts
- `{text,exercises,choices}-{1440x960,390x844}.png`: six full-page screenshots
