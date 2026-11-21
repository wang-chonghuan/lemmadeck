# n46 offline display batch

This dispatch is valid only after the sole staged choice reviewer has actually
closed and the first approved choice retention has succeeded. It is not a new
production authorization, source review, product acceptance, or publication.

ROOT=/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck
BASE=ROOT/.tmp/stemrobin-184-six
OUT=BASE/n46-offline
LESSON=ana9-c4-s2-n46

## Boundary

- Use a fresh independent context, fork_context=false, and return TEXT only.
- Every shell execution has actual cwd ROOT.
- At most 6 screenshot views in this batch, 8/batch and 24/context maximum.
- The parent is permanently 24/24 and must receive no images or image payloads.
- No raw scans, source168+, prior source reviews, prior answers, or other lessons.
- No Git operations, installs, paid calls, credentials, environment-file reads,
  database connections, network publication, app edits, or peer messages.
- Do not replay any passed production stage or the n45 checker.
- Manual checker and report edits use apply_patch; machine output may be emitted
  by the checker. Keep first failures and obtain affected-only recovery.
- Use the existing installed Playwright and rendering helpers. Isolated headless
  Chromium is explicitly authorized for this offline batch only.
- Close all browser contexts, browser and temporary local servers in finally.
- Remain OPEN after returning the completed batch for parent FULL text intake.

## Inputs

Current n46 modern lesson/exercises/figures/choice-set under:

ssot-resources/soviet10year-textbooks/artifacts/9c/editions/modern-us-neutral/lessons/ana9-c4-s2-n46/

Current existing offline text and written renders under:

.tmp/ld-s10y-lesson/render/9c/modern-us-neutral/ana9-c4-s2-n46/

BASE/n45-offline/check.mjs may be read only as an implementation reference.
Do not execute it or inspect its reports or images. Build a fresh n46 checker.
Read the actual n46 source/counts/section breaks rather than importing n45 data.

## Required first observations

- Desktop 1440x960 and mobile 390x844, each with text, written, choice surfaces.
- Exactly six new full-page screenshots, each actually opened once by the
  reviewer. No crops or reopens. Bind path, bytes, sha256 and concrete observation.
- Verify 7 source prose blocks / 8 displayed paragraphs and the actual approved
  section breaks. No n47 prose is included. End of text and exercise navigation
  are reachable.
- Verify written exercises 375, 376, 377 in that order and all 7 written
  subparts. The shared written request applies only to 375 and 376; 377 keeps
  its own drawing request. Do not copy n45's body-number equality assertion.
- Verify exactly 5 choice questions: 3 native single and 2 native multiple,
  26 options, no figures. Derive identifiers and option counts from the actual
  retained learner view, not an answer key.
- Choice render uses only the public view projection. Check absence of internal
  intent, key, rationale, source mapping, review and correct-set fields in the
  rendered document. This is not a live answer-reveal flow.
- Actually click native radios to establish exclusivity and native checkboxes
  to establish independent selection, deselection, and cross-question isolation.
- At both widths, verify no page horizontal overflow, paragraph/control overlap,
  clipped formulas, clipped rightmost/bottommost options, visible broken assets,
  raw dollar math, KaTeX error state, first-line indentation, console/page errors,
  or undersized/mismatched numeric and Latin prose relative to Chinese text.
- For intentionally scrollable wide formulas/tables, prove their right edge can
  be reached and explicitly report any local scrolling; it must not produce
  page-level overflow.
- Prove fonts complete, expected formulas actually render, and the final
  paragraph / last written task / last choice option can be reached.
- Block remote requests and report remoteDependencies=0. Existing inline fonts
  and local rendering assets may be used; no app dev server or DB is required.

## Output

Write OUT/check.mjs and machine evidence under a unique first stage using
BASE/run-stage.mjs. Preserve exact stdout, stderr, exit and command receipt.
Write OUT/report.json and OUT/report.md after all six actual screenshot views,
with concrete visual findings, not generic PASS claims.

report.json must expose at least:

- stageExit, assertionVerdict, visualVerdict, failures.
- network.remoteDependencies and concrete blocked/allowed request accounting.
- accounting.actualImageToolViews, screenshot creation count, task/context totals,
  and hidden browser/renderer internal loads explicitly UNKNOWN.
- screenshots: six path/bytes/sha256/actualToolViews=1/observation records.
- bindings.inputs: path/bytes/sha256 for every actual retained or scratch input.
- Remaining bindings entries: individual path/bytes/sha256 objects for checker,
  stdout, stderr, stage receipt and any additional generated HTML/evidence.
- Counts, geometry/typography/formula/end-reach assertions and actual radio /
  checkbox results at each viewport.
- The explicitly scoped headless offline limitation and parentImagesOrDecodes=0.

Seal completed files 0444, leave OUT writable until parent FULL intake, then
return concise TEXT paths/hashes/verdict/accounting and stop OPEN.
