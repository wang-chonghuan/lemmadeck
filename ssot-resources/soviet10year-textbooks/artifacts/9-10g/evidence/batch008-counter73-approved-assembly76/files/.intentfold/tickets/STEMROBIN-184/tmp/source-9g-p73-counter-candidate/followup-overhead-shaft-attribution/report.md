# Original Overarrow Shaft Projection Attribution

Ticket: STEMROBIN-184. Additive continuation of the isolated shared-counter
candidate. No workflow restart, source review, finalize or promotion.

Owned directory:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p73-counter-candidate/followup-overhead-shaft-attribution/`

## Result And Authority

The original-component shaft attribution defect is repaired in candidate v6
only. The two previously failing23px H/hollow subtests PASS with unchanged
input geometry and assertions. They were run once first after repair.
The subsequent unique full candidate suite is37/37 PASS, exit0, with no
failures, errors or skipped methods. This includes all25 preserved contracts,
all3 preserved carrier methods, and9 added positive/negative identity methods.
All original19 source/geometry contracts remain unchanged and PASS.

One subsequent read-only68-76 exact-band comparison is PASS, exit0.
All v5-to-v6 source counts and band coordinates are identical. p76 retains
all20 exact bands and fig-84 box `[450,1199,550,227]`.

There is no unresolved valid test in the executed scope. This is not an
approval or promotion claim. Production remains eb6, released report remains
534, and every original v1-v5 file/failure remains unchanged.

## Frozen Identities

Production layout.py:
`eb6fca6d9a62663ed7e97d7f39cda32d803375f61bf71adbf9aac84b4c335c3d`

Released counter-vector-rows/report.md:
`534986e4919a34cb448dfa0a9497cf5f75785f82bc201bfd24e41868bccd60bb`

Frozen v5 candidate:
`5215ec429c4382036c70ef0e0bd86970048f5c1ea4f7dacef8840ab9b8a7688e`

Frozen v5 report:
`ed9f84b84ddf29ef15efff871cbd034d0c815350382f180f011fdf59b3b48d56`

New isolated candidate/layout.py,44469bytes:
`0e03889f54d21a3f509e1da1f3d1eebef88d9f531a558a346197c59aada25014`

## Actual Cause

The unchanged failed fixture has complete23px full glyph rows40-62 and100-122.
Original arrow-decoration IDs1,15 have real heads outside the surviving
projection bands. Projection retains only3px shafts23-25 and83-85.
The cropped-band arrow predicate is False although the original component's
independent decoration predicate is True.

The existing generic merge gap is0.4*23=9.2; the shaft/body coordinate gap is15.
Generic merging therefore leaves separate bands. The joined-row stage has
no original-arrow identity association. Later, the single-body compact-row
decision also checks only the cropped shaft, which has lost the head.
The final width-based decoration filter keeps these70px shafts, so v5
returns four bands instead of two. This is loss of original component
attribution, not a reason to enlarge a generic gap or height threshold.

`original-projection-facts.json` records actual original IDs, original boxes,
projection fragments, cropped/original arrow classifications, full-body support
and unchanged v5 output. SHA256:
`17a2f3d53a293e5a23765409f25f98075a57751455957bb4b894f6582323a76f`

`original-projection-arrays.npz` preserves the exact unchanged H/hollow masks
and original connected-component labels. SHA256:
`8ee2e9946faf148c04fd99a5e692469cd7c163de7edefa72dbeae88769637efa`

## Narrow Correction

Add _overhead_arrow_continues using the existing original page labels/boxes.
It requires every one of the following independent identity facts:

- The previous projection's live ink belongs exclusively to original arrow
  decoration independently recognized by the unchanged v5 predicate.
- The complete original arrow ends above the next body band, and its original
  extent is not fully represented by the clipped previous projection.
- The next band has a single supported complete full-glyph row using the
  existing projection and glyph-support functions.
- Each original arrow overlaps a complete original body glyph horizontally.
- Proximity uses the already-existing0.75*glyph_h overhead association limit.

At the joined-row stage, associate only that exclusive arrow projection with
the body band. At the existing single-body compact-row decision, use the same
original-identity contract as an alternative to the cropped arrow predicate.
This stops a shaft from acquiring a separate text-row identity, while keeping
the complete body and both bands' existing projection envelope.

There is no new pixel deletion. The original head pixels and all body/prose/
fraction ink stay in their arrays. The semantic band association does not
redraw an arrow or expand its source image geometry.

Generic merge_gap, all height/width cutoffs, compact thresholds, line pitch,
exclusions and expected results are unchanged. The v5 _single_fraction_row,
_bar_local_fraction_support and _original_arrow_decoration functions are
unchanged, including accepted genuine bar-carrier ID protection.

## Actual After Branches

The unique final suite trace records39 helper decisions,12 True. Actual
positive signatures include:

- previous23-25, body40-62, glyph_h23, original ID1;
- previous83-85, body100-122, glyph_h23, original ID15;
- source p73 previous1472-1478, body1487-1528, glyph_h38, original ID723;
- the same source exercise192 local slice, previous12-18, body27-68,
  glyph_h39, local original ID1;
- existing38px vector-prose controls,18-20/35-72 and93-95/110-147.

These source/body associations do not change any full-page source band.
The failed synthetic H/hollow fixture's exact v5-to-v6 band movement is:
`[[23,25],[40,62],[83,85],[100,122]]`
to `[[23,62],[83,122]]`, count4 to2.
The complete body rows remain inside their corresponding output bands.

`projection-decisions-full-v6.json` SHA256:
`a425a74b21664b3a0e93988f9e4813b845d910c8c069f382a155399a08b0ea60`

## Frozen Tests And Independent Boundaries

Both existing test files are byte-identical to v5, not merely equivalent:

- test_contracts.py, all25 methods including the two originally failing
  subtests, SHA256:
  `498ec0471ef88ef655182aa21301c8d8ef510eaac2efc7be7c2ff2fc11090d54`
- test_carriers.py, all3 methods, SHA256:
  `78ba06733f42e836b30c8d4e36516ed17c99e34fc8ff0c1c182a5412fffffc27`

The harness executes their unchanged declarations/fixtures/classes, without
executing either file's original standalone runner. The affected run selects
the exact original failing method only. The unique full suite includes all
25+3 methods, no omissions, plus9 independent new identity methods.
The source fraction remains True at actual line_h38 and39; all mirrored
genuine-arrow/body False controls and genuine bar-carrier contracts PASS.

New positive/negative contracts cover:

- Original headed identity survives a clipped shaft, including mirrored H
  and hollow bodies; exact two-band envelopes and unchanged arrays.
- Distant or horizontally disjoint bodies cannot claim the arrow.
- Missing or partial body glyphs cannot establish complete row support.
- Mixed arrow/prose/minus ink cannot become exclusive decoration.
- Independent complete H/hollow glyph rows cannot become decoration.
- Genuine minus, equality and radical cannot claim a body as an overarrow.
- A real arrow touching a full body retains that body and is not decoration.
- A genuine fraction bar carrier is not an overhead arrow; genuine fraction
  classification and source ink remain intact.

test_projection_boundaries.py SHA256:
`3d07eb64118db64cc03dd074789f7ba2cbd9b3d017e169feefe073745a91c55c`

The new boundary file is retained at closure after the full suite, with no
intervening file edit; this is not misrepresented as a pre-run snapshot.
Candidate, actual harness and both frozen test files have per-command
pre-run snapshots. No existing repository tests were read as design sources.

## Exact Commands And Raw Evidence

command-identities.md/json contains actual absolute child argv, cwd,
timestamps, exits, code/harness/test identities and raw stream paths/hashes.
command-identities.md SHA256:
`8ba01a37e2a3e52d5e8aad4877de763627ea12b2fd5f236fb0ce652035cc987a`

| Command Label | Exit | Actual Execution |
| --- | --- | --- |
| bootstrap-copy | 0 | Exact eb6/v5/test copies through apply_patch |
| frozen-v5-projection-trace | 0 | Raw pre-repair original/projection evidence |
| candidate-v6-affected-contracts | 0 | First affected method run, H/hollow subtests PASS |
| candidate-v6-unique-full-suite | 0 | Unique complete37-method suite PASS |
| candidate-v6-code-test-scope | 0 | AST/byte scope and complete diffs PASS |
| candidate-v6-readonly-68-76-compare | 0 | One final exact-band compatibility comparison PASS |

For every label, commands/<label>/result.json records real argv/cwd/exit,
and stdout.raw/stderr.raw preserve exact bytes. All Python command directories
also retain the candidate, actual script and both frozen test files under
sources/. No test or comparison command was retried.

Affected result summary SHA256:
`749c41c3b2bade6f0588e3a60a07315a38c759aa11b48c6f39da22a02255752e`

Full37-method result summary SHA256:
`09d9d3c51cf97a0fec09ea560ad91368387bb2ef299ee39eb93460073b5c584b`

## Single Read-Only68-76 Comparison

The comparison reads frozen original PNG/page.json inputs68-75 and preserved
current p76 original PNG/page.json. No MD, review, metadata, exclusions,
source gate or finalize is edited or executed.

| Page | eb6 | v5 | v6 | v5-to-v6 Coordinate Changes |
| --- | --- | --- | --- | --- |
| 68 | 21 | 21 | 21 | None |
| 69 | 25 | 25 | 25 | None |
| 70 | 26 | 26 | 26 | None |
| 71 | 24 | 24 | 24 | None |
| 72 | 17 | 17 | 17 | None |
| 73 | 25 | 24 | 24 | None |
| 74 | 20 | 20 | 20 | None |
| 75 | 13 | 13 | 13 | None |
| 76 | 20 | 20 | 20 | None |

The only entire eb6-to-v6 source band change remains the previously proposed
p73 rows19-20 `[1556,1599],[1600,1642]` to row19 `[1556,1642]`.
All p73 bands outside the original1556-1642 coordinates remain exactly equal.
There is no additional count or coordinate movement from this shaft repair.

p76's20 bands/coordinates and fig-84 box `[450,1199,550,227]` are identical
in eb6/v5/v6. p76-before.json and p76-after.json preserve current input
identities and verify no changes. All source/counting arrays are unchanged.

comparison-v6.json, complete bands and diffs, SHA256:
`08cc47d2cc60d427d90abfe8dbdb5a22f17caf962f58bb64c650f73745764658`

## Complete Diff And Protected Evidence

v5-to-candidate.diff, the complete narrow additive correction,3181bytes:
`ea8cc1485b372c32dd840f8123551e82a30c1fd94f41d08de5ac5244ecbfdf82`

baseline-to-candidate.diff, complete eb6-to-v6 candidate proposal,10662bytes:
`d161bb5580c04d51b72ec94beaee2ad893c55d23550cc5f66f43ef5cda651071`

Relative to v5, only line_bands changes and _overhead_arrow_continues is added.
All nonfunction module statements/constants and all other functions remain
unchanged. All25+3 existing method bytes and original19 method ASTs are
unchanged. code-test-scope.json SHA256:
`1c38da0bc95babe327033c4d4d50b7ef6bc86c14a78836464fa25870ae3ea4c0`

before.json inventories all341 original v1-v5 files and preserves exact old
counter/report/test/failure bytes before patching. after.json verifies the
entire inventory unchanged and retains final candidate/test/harness bytes.
after.json SHA256:
`5a0535f437c7945c1fe21e9f3fd1fe4a89d4346014cc580eb8c4daac0f150c07`

The original v4/v5 expected2/actual4 small-row logs remain raw FAIL with
exit1. The old v4 carrier and v1-v3 failures, including the strict outside
coordinate-identity failure, are also unchanged. None is relabeled PASS,
rewritten, rerun or weakened. The v6 PASS is separate evidence of the new
repair with the same assertions. Released report534 remains frozen.

All new output writes are confined to this owned additive directory.
Production promotion, source/review/metadata edits, prepare/finalize,
successful source-gate reruns, image displays, browsers, dependencies,
services, Git, other-worker edits, generic threshold changes, exclusions,
expected-count overrides and old input geometry changes are all zero.
Parent owns disposition and any future approved promotion/finalize.
