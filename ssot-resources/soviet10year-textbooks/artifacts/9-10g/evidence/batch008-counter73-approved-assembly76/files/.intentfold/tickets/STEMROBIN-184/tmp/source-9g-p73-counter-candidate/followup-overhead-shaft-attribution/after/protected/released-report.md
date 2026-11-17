# STEMROBIN-184 Counter Repair

## State

Bounded engineering repair implemented and independently tested. Parent inspection
and the strict outside-boundary FAIL disposition remain pending; page finalize has
not been run by this worker. No image/browser opens, prepare, transcription edits,
count exclusions, count overrides, pages72–75 work, Git, services or dependency changes.

StageB authority: parent independently consumed476 lines, SHA256
`a022f516e4f98370b8ea59c151cbbfe82b3cdec6d142dd05c98b6700b0b47f53`.
This is continuing the existing invocation, not a new source-production authorization.

## Repair And Proof

Only production `layout.py` changed: reject original overarrow components as fraction
rules; require actual full-body glyph support; prevent arrow decoration from setting
the body scale; prefer compact local body groups over contradictory global pitch.
Parent's subsequent boundary review confirmed a both-terminal body false positive;
one authorized predicate-only correction now requires a genuinely tapered arrowhead.

The six source regions independently assert3,2,2,3,2,3 rows.
Final focused production run:17 tests, all passed, exit0.
Legal single/nested/connected/vector-numerator fractions remain one row; real small
font and script controls pass. Hollow and both-terminal body glyphs are not arrows.
Source fixture arrays remain byte-identical. Test design did not read existing tests.

Original production SHA256:
`734e2e31b457009fe1454964bd874776b65127b2ac6b7941bf31476b6cf07479`.
First repair SHA256:
`922609fb6d2ff6a741d30e6768aebcaae273d3ece937f6330f038de9da4941ce`.
Final production SHA256:
`eb6fca6d9a62663ed7e97d7f39cda32d803375f61bf71adbf9aac84b4c335c3d`.

## Preserved Failure

The original `verify_repair.py production` strict coordinate-identity check exited1.
Its assertion/script/raw failure remain unchanged, and it was not rerun.
No source region or expectation was relaxed. Independent read-only observation finds
the same number of outside bands on every page, with exact changes retained separately.

The largest movement is p70:
`[(1025,1069),(1085,1143)]` -> `[(1025,1083),(1084,1143)]`.
Height estimation39->40 changes merge gap15.6->16 and joins a16px gap;
local full glyph groups y1032–1068 and y1101–1143 still establish exactly two rows,
then uniform expansion moves their boundary. Both source printed lines remain intact.
Other movements are1–2px; no outside row quantity changes were observed.
Parent must inspect this disposition before its own affected finalize.

## Evidence

All artifacts are under the actual ticket tmp:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/counter-vector-rows/`.

- `cause-and-proposal.md`: full branch causes, source facts and boundary addenda.
- `before/`, `initial-failures/`:43 frozen original files and first finalize failures.
- `before-patch/`, `after-patch/`: exact bytes around the one initial production patch.
- `before-predicate/`, `after-predicate/`, `verified/`: exact bytes around the authorized predicate correction.
- `trace-v2/`: actual masked array intermediates, hashes and frozen branch locals.
- `height-estimator-*.json`, `outside-geometry-trace.json`: exact estimator/merge traces.
- `scope-observation.json`, `scope-observation-production-final.json`: all outside old/new coordinates.
- `patch/`: exact original-to-final and initial-repair-to-final unified diffs plus raw diff command results.
- `commands-index.md`, `manifest.json`: every actual command, stdout/stderr/result path and hash, including all failures.

Final focused command:
`node /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/counter-vector-rows/run.mjs test_counter_vector_rows.py production-predicate-final`.
Its retained raw files are
`commands/test_counter_vector_rows-production-predicate-final/{stdout.raw,stderr.raw,result.json}`.
No audit has been rewritten or marked passed.
