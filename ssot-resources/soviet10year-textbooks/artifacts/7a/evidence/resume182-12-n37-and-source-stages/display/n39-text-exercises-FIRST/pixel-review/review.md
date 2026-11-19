# STEMROBIN-182: n39 Offline Pixel Review

Verdict: **REVISE**, one blocking display finding. Scope is the pending offline text/exercises FIRST pixel gate only, not the complete lesson, answers or choices.

## Finding

**N39-PIXEL-R1: mobile formula tail is clipped.**

Exact object: `alg7-c4-s2-n39:lesson.json#/prose/26/text`, source reference `p0239#10`, the 27th `p.para` in `render-ready/alg7-c4-s2-n39/text.html`.

The supplied `alg7-c4-s2-n39-text-390.png` shows the final formula under the introductory "so" line continuing into the right edge after `= 0.`. The complete terminal result `0.4848` and closing punctuation are not visible, and there is no complete wrapped continuation. The desktop PNG shows the full tail. Repair only the affected display layout while preserving the current formula; this reviewer made no repair or recapture.

Inherited `rootOverflow=0` and local-scroll reachability PASS remain intact. They do not prove initial readability and do not satisfy the requested initially-visible-or-completely-wrapped tail criterion.

## Other Observations

- Four separators are visibly coherent at `/section_breaks/0..3`, before `/prose/7`, `/prose/10`, `/prose/12` and `/prose/27`. The fourth separator itself passes placement; the preceding formula has the separate finding above.
- All 14 exercises, 806 through 819, appear in order in both exercise PNGs: `/exercises/0..13`.
- Mobile 808's conditions, 809(b)'s terminal radical, 816's parameter tails/punctuation and 819's domain/sign conditions have visible wraps. No additional conspicuous formula/label collision is apparent. Exercise 818's fraction groups remain distinct.
- No systems-brace groups occur in this n39 display; that check is not applicable.
- Fig55 is immediately below only exercise 819: `/exercises/13/figure_refs/0`, `/exercises/13/figures/0`, `figures.json#/figures/0`, `exercises.html#fig-55`. Its right endpoint above tick 8 and right-side ticks/axis label are visible in the fifth PNG.
- There are no standalone caption elements in the current display; the existing fig55 reference remains in the adjacent 819 prompt. No detached caption is visible.
- No added visible key, input/jump control, blank/error-only state or incoherent overlap is apparent. The clipping finding remains an explicit exception to readability.

## Evidence And Methods

Sole working directory: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`. Read the image-batch instructions and production-resume contract before viewing any image.

**Actual image opens: 5**, starting at 0, one batch, `functions.view_image` with `detail=original`, each opened exactly once. No reopens, new crops, derived crop opens or new screenshots. Order: text 1440; exercises 1440; text 390; exercises 390; supplied fig55 mobile right-end PNG.

Current durable lesson/exercises/figures, raw source bindings, original and ready HTML, all five PNGs, figure-source/spec/render/SVG/review, instruction files and inherited receipts are SHA-256-bound in `review.json`. Hashes use raw file bytes via Node built-ins without normalization. Screenshot dimensions come from IHDR bytes; actual full-page PNG widths 1425/375 are recorded separately from inherited viewport widths 1440/390. The original fig55 PNG was hashed as opaque bytes only, not opened as an image.

Inherited headed Chromium PASS at 1440x960 and 390x844 was read, not rerun: zero root overflow, reachable local scrolls, no console errors; fig55 media width 640 and minimum text size 17.333333333333332 px. Its right-end receipt records scrollLeft 345, scrollWidth 640 and clientWidth 295. These are inherited measurements, not new ones.

Prior substantive text/math PASS and fig55 source/spec/render PASS remain inherited through the current promotion and review bindings. They were not repeated or re-solved. Local JSON/HTML reads identified display objects only. No author answer/key file was inspected.

The screenshot limit is explicit: these five recorded states do **not** certify every glyph, mathematical correctness or unobserved states. No answers, choices, whole-lesson, publication or closure approval is given.

Only this `pixel-review/` directory is written. No candidate edits, producer/test/browser runs, regeneration, environment/DB/network/model/app/dependency operations, publishing, Git writes, agent/chat operations, deployment or closure.

Report JSON and Markdown raw-byte SHA-256 hashes are recorded in `report-hashes.json`.
