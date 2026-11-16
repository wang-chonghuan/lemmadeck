# Edition Owner-Lesson Erratum Reconstruction Repair

Date: 2026-11-16. Status: **implemented; affected tests PASS**.
Role: bounded tool-fix author, not the independent approver of this change.
Repository: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.

## Owned Changes

Only these authored files changed:

- `.claude/skills/ld-s10y-lesson/tools/edition.py`
- `.claude/skills/ld-s10y-lesson/tests/test_edition_owner_errata.py`
- `.intentfold/tickets/STEMROBIN-180/tooling-edition-owner-errata-repair.md`

The source, TOC, profiles, schemas, charter, dependencies, app, figure outputs and author freezes were not edited. No Git, DB, network, browser, promotion, retention, prepare, finalize, `assemble.run` or figure gate was executed.

## Cause and Minimal Fix

The previous `_authoritative_source_targets` performed `cut_lessons`, `split_lesson`, then `claim_figures`. Candidates had no TOC `card_id` at claim time. `claim_figures` correctly rejects an explicit `owner_lesson` unless it matches exactly one bound candidate, so any registered erratum triggered the otherwise dormant failure even when the erratum belonged to another lesson.

The corrected reconstruction, at `edition.py:133`, binds candidates with the existing `assemble.check_toc` before claiming figures when the merged stream contains explicit lesson owners. The TOC path uses the existing publisher's textbook-root layout: `book.parent.parent / "toc" / book.name / "zh.json"`. The same extracted printed-page set used by assembly is passed to the helper. A missing TOC is an explicit error; there is no guessed ID, alternate TOC, page-specific branch or fallback.

`claim_figures` and its errors remain unchanged and fatal. Candidate selection still requires the existing unique number/title/printed-title/start-page identity match. Once a TOC card is bound, `edition.py:181` additionally rejects any populated raw lesson `id`, raw `card_id` or exercises `lesson` that disagrees with that card. Existing block/exercise identity checks, nonempty source-reference checks, page hashes and registered-original uniqueness checks remain intact.

No-owner legacy reconstruction keeps its existing behavior. The repair restores assembly's identity-before-ownership order; it does not introduce a new content capability or relax an existing gate.

## Independently Specified Tests

The new test fixture and expectations were written from the code and source contract before reading existing tests. The fixture has a standalone explicitly owned figure/caption, two TOC-bound lessons, and separately registered prose/task errata. Expected targets and source identities are written directly, not produced by `cut_lessons`, `claim_figures` or another reconstruction helper.

The ten new tests cover exact prose/task binding and page/PDF hashes, unrelated-lesson exclusion, missing owner rejection, ambiguous TOC identity rejection, duplicate source identity rejection, each conflicting populated stable ID, incorrect populated source reference, registered-original drift, missing TOC rejection and missing legacy reference recovery. The stable-ID test exercises three independent invalid subcases.

After implementation, the seven existing complete edition erratum/source tests, four lesson-snapshot tests, six owner-lesson tests and one page-erratum test were executed. No unrelated full edition suite or whole-project tests were added.

## Command and First-Failure Ledger

Three test commands were actually executed. All 28 unique affected test methods eventually executed and passed; this is not a claim that the second command exited successfully.

1. Shared runtime, repo-root cwd:

   ```text
   /Users/yong/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3
     -m unittest discover -s .claude/skills/ld-s10y-lesson/tests
     -p test_edition_owner_errata.py -v
   ```

   Exit **1**. Ran 10 tests; 11 errors including stable-ID subcases. The initial hand-written TOC container omitted `kind: chapter`, so `_toc_cards` treated that container as a card and the coverage inspection raised:

   ```text
   source_errata -> _authoritative_source_targets -> assemble.check_toc
   assemble.py:709: lo <= card["page"] <= hi
   KeyError: 'page'
   FAILED (errors=11)
   ```

   The initial test-file SHA256 was `13ac1686c7a40bc174bad6ffa5f549959e52bb374a20293cd136d9b9dee7d022`.
   The sole subsequent fixture change inserted exactly:

   ```python
   "kind": "chapter", "id": "fixture-chapter", "title": "Fixture", "page": 1,
   ```

   at the `contents[0]` container before `lessons`. The initial full test bytes are the current test with only this inserted line removed. No production-code change or expected verdict changed after this failure. This record preserves the rejected fixture, its hash, error and correction instead of reporting the first run as PASS.

2. Shared runtime, cwd `.claude/skills/ld-s10y-lesson/tests`:

   ```text
   python3 -m unittest -v
     test_edition_owner_errata
     test_edition.EditionTest.test_source_bound_erratum_allows_only_the_registered_correction
     test_edition.EditionTest.test_bound_erratum_rejects_raw_original_drift
     test_edition.EditionTest.test_legacy_lesson_reconstructs_erratum_source_refs
     test_edition.EditionTest.test_nonempty_wrong_source_ref_is_rejected_against_authoritative_assembly
     test_edition.EditionTest.test_authoritative_binding_ignores_other_lessons_errata
     test_edition.EditionTest.test_legacy_source_snapshot_allows_only_added_source_references
     test_edition.EditionTest.test_erratum_binding_rejects_missing_wrong_stale_and_unchanged_records
     test_assemble_lesson_snapshot
     test_plate_lesson_owner
     test_p2c.PageErrataTest
   ```

   Exit **1**. The ten new plus seventeen existing tests passed. The page-erratum module did not load:

   ```text
   test_p2c -> p2c -> layout
   layout.py:18: from scipy import ndimage
   ModuleNotFoundError: No module named 'scipy'
   Ran 28 tests
   FAILED (errors=1)
   ```

   This was a loader placeholder, not a failed execution of the page-erratum test. No dependency was installed, checker changed or test bypassed. The worktree's advertised local `.venv` was absent; the already-existing runtime path was taken from the source producer's recorded `finalize.call.json`.

3. Existing complete source runtime, same test-directory cwd:

   ```text
   /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python
     -B -m unittest -v test_p2c.PageErrataTest
   ```

   Exit **0**, one test PASS. Only the previously unexecuted page-erratum test was retried; the other 27 passed tests were not repeated. Test imports resolved this worktree's code, not the runtime checkout's tool files.

The main agent's first s15-t1 official `adapt-finalize` exit2 is the user-reported triggering failure and remains owned/preserved by main. This task did not re-execute it or overwrite its artifacts. Read-only discovery failures also occurred for a nonexistent `tools/paths.py`, an absent initially assumed author-report path and the absent worktree `.venv`; these did not invoke a content gate.

## Real Current-Source Binding Evidence

One additional **read-only** command used the existing complete runtime with `-B`, imported this worktree's `edition.py`, loaded the current raw lesson/exercises and called `source_errata` once each for s15 and s15-t1. It did not invoke prepare, finalize, assembly output or image validation.

Exit **0**. Both exact calls returned `[]` and passed the explicit empty-result assertions. The current p0170 page contains one registered entry, `p0170-math-1` at `p0170#8`; therefore these successful calls used authoritative reconstruction rather than the no-registered-errata early return. The unrelated erratum was not inherited by either course. The synthetic positive test separately proves a relevant registered erratum is retained, not globally discarded.

| Current input/code | Actual SHA256 |
| --- | --- |
| `edition.py` before this task | `b48f7beedb54635876f426526d8541925c956c0f84e298f77c3fe34c229f4b2c` |
| `edition.py` after repair | `4c15c8aba51f65eb5ee3bf3cdeecf9691777b221bd120b590aba7e448f64cf19` |
| Final new `test_edition_owner_errata.py` | `84a6a1ed2c1474ed2d2f5f8a26861e5304138ff9d15e8d641d93f1b6cdab9f05` |
| Raw `6p/book.json` | `cb6507fd74bc8b8afd2087587c23d39d1975d75845969e8ea7c307b6bb074c86` |
| `toc/6p/zh.json` | `d2a28ad304a267a49beead1db8dde28c14fc3330245c07330f4086506f0baef2` |
| Raw `pages/0170/page.json` | `b1767dd56b4d4ab0bf48829b4c3b35ac39c01edb403b1f7074c983a93b2f9473` |
| Raw s15 `lesson.json` | `8179296f965eb92629e417043f83ab47f539a6e8ec745db997276886cd20b9e3` |
| Raw s15 `exercises.json` | `9651f91bc2d9092d425aa68074d8aad7402398504ff8188162fa39e3f1cd843f` |
| Raw s15-t1 `lesson.json` | `6f11e97b4436281f3e1db322ba1c3855272a5140d8df995da3661ea416f2c6ec` |
| Raw s15-t1 `exercises.json` | `65e2805623f01f59a52035212521f1c60165a0fb9ce9e8638bee43c42c3a9177` |

These are observed current hashes, not fabricated digests. The source files were only read.

## Handoff Boundary

The minimal repair and affected test evidence are ready for main's independent tool review and its already-planned failed s15-t1 retry/first s15 finalize. This report does not claim either course finalized, retained, promoted or approved as a result of this task.

Actual test-command count: 3. Actual current-source binding command count: 1, containing 2 `source_errata` calls. Content finalize/prepare/assemble and figure-gate calls by this task: 0. External model/image calls: 0. No process or browser remains in flight.

Exact runtime model identifier, reasoning setting and observable token/cost totals are not available and are unknown.
