# n13 First Offline Visual Acceptance

STEMROBIN-184 B; 2026-11-19. Overall **FAIL**, limited to the six rendered views below. Not whole-lesson approval.

## Six Views

| View | Viewport | Full screenshot | Verdict | Concrete evidence |
|---|---|---|---|---|
| Text desktop | 1440x960 | 1440x3218 | FAIL | Two underbrace `k`-unit labels clip the bottom ink of the CJK character by 1.3311px. Other page regions and full figure remain orderly. |
| Exercises desktop | 1440x960 | 1440x960 | PASS | Exercise 115, all four subparts and return control visible; no clipping/overlap/global overflow; return navigation passed. |
| Choices desktop | 1440x960 | 1440x1735 | PASS | Four question groups, 13 options, separated radios/letters/prose; all native label selection/exclusivity/isolation and row/navigation checks passed. |
| Text mobile | 390x844 | 390x4103 | FAIL | Same two bottom-ink clipping defects; prose otherwise reflows, full 358px figure fits, no global horizontal overflow. |
| Exercises mobile | 390x844 | 390x844 | PASS | Prompt, a/b/c/d and return control wrap/fit correctly and remain reachable; no figure; navigation passed. |
| Choices mobile | 390x844 | 390x2810 | PASS | All four groups/13 options readable by page scrolling; labels, radios and content do not collide; native selection/exclusivity/navigation passed. |

## Defect And Unknowns

The two affected TeX fragments are `r>0.\underbrace{2399\cdots9}_{k\text{ 位}}` and `0.24-0.\underbrace{2399\cdots9}_{k\text{ 位}}=10^{-k}`. Their `.nb` scroll containers establish a vertical clipping boundary. Actual font-ink measurements agree with Range/font-box heights; the CJK glyph extends 1.3311014px below that boundary on both viewports. No HTML or canonical resource was edited.

Desktop host/glyph bottoms are 2787.9375/2789.2686 and 2919.5625/2920.8936 CSS px; mobile bottoms are 3556.5781/3557.9092 and 3721.2500/3722.5811. The earlier 4px line-box excursions are retained but are not presented as the actual ink loss.

Text-page nested-scroll-end, row-reachability and forward-navigation checks are **UNKNOWN**, stopped after the true clipping failure. Exercise/choice views had zero overflowing nested scrollers at these sizes; their content remains visible, and their executed navigation/reachability checks passed. No passed verification was replayed.

The first font predicate incorrectly required every declared, including unused, face to remain loaded. The targeted predicate then included KaTeX's intentional U+200B zero-width spacer in a positive-width assertion. Both native flags are retained. Saved evidence has `document.fonts.status=loaded`, all actually used fonts available, and positive widths for every visible sample; the only zero-width sample is U+200B. These are checker-only flags, not a visible font defect. Final adjudication uses saved data, without another browser run.

## Other Evidence

Both text views exactly match 23 derived paragraphs from the current lesson. Exercises exactly match one exercise 115 and its four subpart formulae. Choices exactly match the pure view-only input, with option counts 3/4/3/3. These are presence/rendering checks, not re-solving or semantic option adjudication.

KaTeX: text 61, exercises 4, choices 64 expressions per viewport, zero error/missing-markup nodes. Body is 16px. Prose literal symbols are uniformly 18.656px; exercise/choice literal letters uniformly 18.304px, all at least their body text size.

The shared figure occurs once in text, zero times in exercises and choices. Effective SVG sizes are 360x424 desktop and 358x421.6406 mobile. Minimum SVG text, measured through `getScreenCTM`, is 28px desktop and 27.8442px mobile, above declared 16px. All 25 labels and 36 visible components fit: quotient/divisor/rightmost digits, bottom remainder, three subtraction bars, track and both rightward arrowheads. The same page screenshots contain nonzero ink for every component; figure ink counts are 5774/6309. No source image or standalone figure render was opened.

Native choice interactions selected all 13 option labels per viewport, verified one selected radio per question and preserved other groups. The screenshots show initial unselected controls; selection order has no correctness meaning. Native reachable-row counts for choices were 111 desktop /169 mobile. No answer or author key was read.

## Commands And Streams

All commands used existing `app/node_modules/playwright`, from `/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck/app`; no install/setup/app/database/backend calls.

1. `node ../.tmp/stemrobin-184-resume/n13-offline-review/ac-check.mjs` -> exit **1**, stream `720c22`. Checker preflight `14 !== 13`: audit prose-block count includes the figure. Browser/server not started; zero screenshots. Original receipt/stdout/stderr/results retained under `initial-native-failure.*`; embedded log paths in its unchanged receipt refer to their original names.
2. Same command with `--checker-repair` -> exit **1**, streams `dc2d71`, `adf6de`. First six-view run; six screenshots. `native.stdout.log`: 23620 bytes, SHA-256 `3d53e27d6d976d4e7008cfae4eebf397edbddc31443a84127288989fd552d35d`; stderr 0 bytes. Browser/server closed in finally.
3. Same command with `--pending-repair` -> exit **1**, stream `3a9eed`. Failed/pending criteria only; zero screenshots. `pending-only.native.stdout.log`: 18452 bytes, SHA-256 `31c5dd97606cbaf056fdaa3867d18e74e5ba56f2b0d5dd03b056dfb64927b21a`; stderr 0 bytes. Actual ink failure confirmed; dependent checks stopped; browser/server closed in finally.
4. Same command with `--freeze` performs saved-data font adjudication and creates the final manifest only; it launches no browser/server and reruns no acceptance criterion.

The initial failed figure-path reads and unavailable package-path reads are retained in `preflight-read-receipts.json`. Correct modern figure paths resolve from the edition root. No original image was opened during preparation.

The in-memory server served only the three exact HTML byte streams on 127.0.0.1, with embedded fonts and deny-all CSP for scripts/connects. Browser routing allowed only those local GETs; outside requests were blocked, with zero attempted outside requests. No app, DB, desktop window or user browser was used.

## Freeze And Boundaries

`freeze.json` lists absolute paths, byte counts and SHA-256 for all owned artifacts, plus 12 immutable input receipts. Its own hash is excluded to avoid self-reference. It retains the native failures and the final visual verdict separately.

Image use is exactly **6/6**: one batch of six screenshots, each loaded once, zero crops/reopens/extra/source images. Parent permanent 24/24 receives **zero image payload**. Both owned browser/server pairs are closed. No Git, setup, backend, environment, paid call, publisher, merge, deploy, chat/descendant or canonical operation occurred.

Author review and independent key review remain **pending**. Semantic option correctness remains **UNKNOWN**. No whole-lesson approval is inferred.
