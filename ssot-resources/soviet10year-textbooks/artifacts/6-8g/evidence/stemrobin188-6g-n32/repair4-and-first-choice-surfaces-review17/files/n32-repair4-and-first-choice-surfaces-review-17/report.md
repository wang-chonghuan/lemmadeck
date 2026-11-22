# STEMROBIN-188 / SAME188-6 bounded independent review

OFFLINE, finish=review, 2026-11-22. Two independent verdicts.
Owned output directory:
`/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n32-repair4-and-first-choice-surfaces-review-17`.

## A. Affected revision4 CODE: PASS

No new definite defect found in the authorized changed scope. Code-phase
images=0; new counterexamples=0; code fixes=0.

Current `edition.py` is byte-identical to immutable revision4:
`59a31f900c3c0830b1aa776adc5ba3ca917e6b838a2f9eac48df8962eea26a3a`.
The revision3-to-revision4 diff changes only
`structural_subpart_markers`, current lines 758-774. For a first paired
marker, lines 763-768 now require a line-start whitespace prefix or an
initial exercise number. A colon or semicolon after ordinary inline prose
cannot qualify that paired marker. The unpaired branch keeps its previous
colon/semicolon qualification byte-for-byte.

This addresses the prior actual P2, `12. Points: (a) and (b) are distinct.`
being falsely exempted when relabeled `(1)/(2)` with layout only. The
previous rejection report and actual exit-1 counterexample remain historical;
neither was replayed or rewritten.

Line-start paired lists and paired lists immediately following an initial
exercise number remain supported. Marker discovery, formula masking,
nesting/pair filtering, body nonemptiness, complete marker order, canonical
label replacement, numeric-style-change count protection and DATA/math
signatures are unchanged. The unpaired comma/two-column handling and suffix
normalizer are also unchanged. The revision4 test snapshot adds only the
colon-inline rejection and initial-exercise paired-list compatibility cases;
existing data/formula/count controls remain present. Old same-style
normalizer limitations were not expanded into findings.

Received once, not rerun: five affected paired checks, actual exit 0,
stdout empty, stderr five dots / `Ran 5 tests in 0.001s` / `OK`.
Receipt SHA:
`54881ba5da69af432f58619c5a4c85661dccfa0c078ec797b96975cbed57466d`.
Both streams and both bound immutable snapshots match their hashes.
Current test source matches snapshot SHA
`c7fdd039c96b800ecf336ba02e76c212ddf6e3d5f91f666a3033e617c85f7350`.

Reused once: unchanged revision3 unpaired438 receipt, actual exit 0,
source/modern structural counts 10/10, errors empty and identical DATA-only
signatures. Its receipt SHA is
`346cbfea0c128c5203c484996787ba16112f7df348e42dd49425620f85e6c896`;
both actual streams match. No exercise template/source was reopened.
This remains revision3 execution evidence, not a new revision4 run.

The supplied code retention SHA
`db0cbab960480b8ddf8c50eca35de341a0ae37de3c3026805a561382e220c666`
and prior review manifest SHA
`d71a81ef7e1451b25f04185c656ad5601976ec6f67aa132eda20f5f497231f83`
match actual files. Cumulative technical code revisions remain 4.
The received broader historical suite remains 34 PASS plus the preexisting
unrelated prose FAIL, not an all-green suite. No passed test, old
counterexample, actual438, full suite, native, editor, renderer, producer or
normalizer command was run.

## B. FIRST choice visual review: CHANGES_REQUESTED

Desktop: PASS. Mobile: CHANGES_REQUESTED for one P2 display-evidence finding.
The existing semantic choice PASS (9 questions, 37 options, all 9 sources,
438 ten relationships) is received and reused, not re-solved or reviewed.
The four existing text/exercise visual PASS surfaces were never opened.

### [P2] Mobile final option tables omit their rightmost side column

In the actual 390px screenshot, question 9's A-D tables visibly end at or
inside the right content boundary while the final `|DA|` column is outside
the captured visible area. The complete desktop surface has eight columns:
four angle columns and four side-length columns, including `|DA|`.
All four mobile tables show only the first seven column contents. The
bottom crop confirms this at original pixel resolution.

Evidence: original mobile screenshot SHA
`d6e262b1a3388809d101eb7c8b744ad11a841ac37b20542614e5b337cbab522a`,
and `mobile-bottom.png` SHA
`af2a1fbfaaf052c4752219d0a0cbf47d903647aa898dbc34eb139bf3424a2d86`,
actual source crop box `[0, 5400, 390, 8486]`.

The last question and all A-D controls are vertically present; the issue is
incomplete visible table content, not a missing question. The mechanical
`documentWidth=390` pass does not establish completeness inside an
overflowing table. This screenshot-only review does NOT prove that the
runtime permanently hides the column: horizontal scrolling may reveal it,
but no scrolled-right evidence or interaction proof was supplied, and
browser/rerender activity is prohibited here. Mobile visual PASS therefore
requires affected evidence of the complete right edge, or a complete
legible table layout. No implementation diagnosis or fix is asserted.

Desktop pixels independently show all 9 stems and 37 options, intact KaTeX,
all 16 option tables, complete fig-208, and the final D table plus bottom
space. On mobile, questions 1-8, their controls, wrapped prose, symbols,
fig-208 and all question 6-8 table contents are legible and separated.
The figure visibly includes line labels a/b/c and angle labels 1-8, with no
blank/missing media, clipping or overlap. No mathematical correctness was
reassessed. Q9's visible symbols/values render, but its complete option
content cannot be approved from the mobile capture.

Display receipt SHA
`ab6439b9819e4ce0d3bf7db5dee71027d62468666339aeb353968fee8050d631`
records the FIRST command, actual exit 0, two observations, stderr empty;
its streams match their hashes. Result SHA:
`bd7e6ac3caea585b1448344cb271d2d367cf5c4424c5645d0f6152ded5ef4148`.
Display retention SHA
`ed7172c0c54c4195bd81524dbb0e17ce05edcfd236954a553e008d19d95b4351`
matches its actual file. Both screenshot hashes match.

## Actual image ledger and failures

One batch, 5 attempted opens / 8 limit; 5 loaded images / 24 context limit.
Full screenshots opened exactly once each:

1. `choices-1440.png`, actual 1440x6393; viewer resized to 1351x6000.
2. `choices-390.png`, actual 390x8486; viewer resized to 276x6000.
3. `mobile-top.png`, actual crop `[0,0,390,3000]`, 390x3000.
4. `mobile-middle.png`, actual crop `[0,2700,390,5700]`, 390x3000.
5. `mobile-bottom.png`, actual crop `[0,5400,390,8486]`, 390x3086.

Crops are actual unchanged screenshot pixels, not resized composites,
new renders or browser captures. Crop execution tool receipt `9afc61`
returned exit 0. Image-open failures=0; reopens=0. Parent remains permanently
24/24 and receives TEXT plus paths/hashes only, with zero image payloads.

No new code/test execution failure occurred. The preserved prior code
counterexample remains exit 1; the broader historical prose test remains
FAIL. This review adds the mobile display-evidence P2. Nonzero read-only
command statuses were: initial `ls` exit 1 because the assigned new root did
not yet exist; code and test `diff` exit 1 because differences exist; one
filename-filter `rg` exit 1 because no path matched. These are not content
or harness test failures. All are recorded in `report.json`.

Writes were confined to the owned directory. No network/docs, environment,
DB, paid, installs/dependencies, Charter/app, Git, publisher, retention
execution or new agents. No product/content edits. Completed output files
are frozen 0444 and bound in `manifest.json`.

This is affected code and FIRST two-surface display review only, not full
lesson, ticket, live-product or publication approval.
Final activeExecSessions=[].
