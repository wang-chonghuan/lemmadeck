# STEMROBIN-175 Handoff

This ticket used an open development phase; this record describes the delivered
result and its verification.

## What Changed

- Authored and published the reviewed choice sets for algebra lessons 19, 20 and
  21: respectively 7, 14 and 11 questions, totaling 23 single and 9 multiple.
  The 30 written seeds, relevant definitions, independent solutions, response
  units, limitations and all 143 option checks remain internal.
- Retained each lesson's seed, draft, independent review and eleven new
  deterministic figures under its modern edition `choice-set/`. Original
  lesson, written exercise, answer and figure artifacts were not regenerated.
- Added the image skill's narrowly restricted `source.authoredBasis` route for
  new deterministic `fig-choice-` diagrams with no original image. Existing
  original-image hashing, inventory, geometry, label and review checks remain.
  The existing choices-only publisher now recognizes this bound provenance.
- Clarified measured-data approximation and numerical-set equivalence in the
  authoring guidance. No new authoring engine or automatic mathematics proof.
- Fixed one observed practice interaction defect: passive formula content no
  longer intercepts option-button clicks. Focus could replace KaTeX nodes
  between pointerdown and pointerup; the stable outer button now receives them.

## AC Results

1. **Complete mathematical tasks: pass.** Three seeds cover all 30 selected
   written exercises. Independent review approved 32 meaningful response units,
   native multiple selection, coverage, redundancy and hidden source mappings.
   Drawing recognition explicitly does not claim independent drawing ability.
2. **Independent mathematics and figures: pass.** The separate reviewer solved
   original prose and actual figures first, then blind learner views, and only
   afterward compared keys and every derivation. All 143 options and eleven new
   actual-image mathematical bases passed. All three retained `validate.py
   --review` commands passed; relocation changed paths, not SVG/spec bytes.
3. **Existing practice experience: pass.** Headed Chromium checked all three
   lessons at 1440x960 and 390x844. `tmp/ac-results.json` retains all six rendered
   lesson/viewport observations; `tmp/ac-desktop-clicks.json` rechecks the
   affected 19/20 desktop controls after the one-line click fix. Single clicks
   submit immediately; partial multiple sets fail and complete sets pass.
   Exact option IDs, learner 2, locale, correctness and single index were
   checked in the DB; refresh/mobile restoration and locks passed. Fifteen
   successful-run records were cleaned by the same script. No learner 1 writes.
   All figure instances were nonblank, with accessible scroll ends and final
   text at least 16.73 px; no page overflow or browser errors. Six screenshots
   were visually inspected. Pre-answer SSR excluded keys and author metadata.
4. **Preservation and minimal repairs: pass.** Choices-only publication updated
   just the three target sets. `tmp/content-preservation.json` confirms all 147
   lesson prose/written hashes and the other 144 complete exercise objects
   unchanged. Source artifact SHA-256s also matched. Resource audit, textbook
   validation, four content-DB tests, 130 application tests and build passed.
   After the click fix, the affected six component tests and build passed.
   Choice tooling's 39 tests and the image validator's 29 tests passed; six new
   authored-provenance cases passed. Existing image tests passed, with three
   scratch-directory prerequisite failures repaired and those checks rerun.

## Repairs And Evidence

The water-draining stem now explicitly includes the emptying instant. The
measured table keeps all observations and adds a visible inclusive 0.02-kg
approximation condition rather than asserting exact linearity. Numerical
fraction spellings are treated as equal set elements. Two point-membership
distractors now arise from dropping a negative sign and omitting the intercept;
the original complete solution and changed coverage remain internal.

Failed drafts, reviews and browser evidence stay in uncommitted ticket `tmp/`.
The definite click defect and its before/after event evidence are preserved.
A later preview feedback failure did not count as acceptance; after a clean
server restart, the retained failed criterion and remaining mobile checks
passed. No unrelated regression suite or content regeneration was added.

## Environment

Preview: `http://localhost:52175/card/alg6-c2-s4-n19?tab=choices`, with the same
route pattern for 20 and 21. The dev server stays running for review.

Checkout: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-175`.
Branch: `codex/STEMROBIN-175-choices-19-21`. Base: `1562fb7aac3b0c2be01ec552e99c4663f9222797`.

No environment keys, dependencies, schema, tokens or infrastructure changed.
The worktree uses a local copy of the existing app dependencies because its
initial sibling-directory symlink was outside the dev server's allowed paths.
No new package version was installed.

## Residual

Verified, awaiting human review. No merge, closure or Render deployment was
requested. Content is already in the existing shared database; the click fix
and skill changes remain on this branch until landing and application release.
The optional generic skill-frontmatter checker could not run without PyYAML;
no dependency was added for it. Required project and substantive skill checks
above passed.
