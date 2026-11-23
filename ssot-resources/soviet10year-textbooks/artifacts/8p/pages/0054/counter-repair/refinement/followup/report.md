# p54 bounded technical repair: VERIFIED AND APPLIED

Every command used cwd
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180`.
The candidate was tested privately against exact CURRENT p53 base before any
live edit. Only verified `line_bands` hunks and the portable owner-tool test
were applied, using `apply_patch`; the private entry snapshot was not copied
over the live file.

## Hashes and exact delta

- Base: `9872032f001b8066dc6ce223bd8381fc0d2b50953950a26c5a9aaeae3c44b9f6`
- Candidate05 and integrated live `layout.py`:
  `8cb92aec54903cec817cec5c0f4fa29502e6f16ffc3919b7052ef217ed4d9e8d`
- Exact base-to-candidate diff, `../candidate-05/candidate.diff`:
  `b1d391706f33f12d736bb0b4639ae8685123058a00bedd115e58f9afa2fd1ea1`
- Complete required-suite result, `../candidate-05/results.json`:
  `f515e8f271eac8f168e294e6bbe40b9b61a40188de686f0f290d14721852a15b`
- Owner `tools/test_line_bands_footnote_separator.py`, byte-identical to the
  privately tested portable test:
  `a74eacaa49d23c1205504ec6cbf1e6d0f16c53d02023ad8b504712c4f0adb890`

The production delta is 127 added / 6 removed lines, all inside `line_bands`.
Code before and after the function is byte-identical to base, not merely
AST-equivalent. The p53 fragment block is byte-identical. No helper, n7 logic,
fraction merging, source/page coordinates, count exception or global trim was
added or changed outside the verified function delta.

## Conservative refinement

Candidate03's symmetric typography/isolation separator rule and nearby
smaller-type standalone-letter recovery are retained.

The heading-deletion residue is a 15-pixel-high right-margin smear with a thick
hole-free core: the 8-by-8 opening retains 356 of its 448 counting pixels.
The existing height floor excluded it. Smaller compact margin cores now need
that existing strong core evidence before the lower subglyph floor applies.
The 12-by-12 and 18-by-9 solid specks meet this same isolated-core rule.
The original dust pixels no longer inflate their projected span into a row;
there is no pooled-width adjustment or dust-wide trim.

The prose-deletion residue comprises original shallow solid components. Closing
joins them into a cluster with 38 artificial hole pixels, although the original
components have no holes. The new exception requires at least two substantial
original components, each at most 0.45 glyph height, hole-free and retaining at
least 80 percent of its ink under a 3-by-3 opening. The overall cluster must be
shallow and compact. Existing margin placement, density and clearance checks
still apply; genuine holes and full-height original components veto this path.

Candidate04's real one-failure result is retained in `../candidate-04/`.
Candidate03 was not rerun as an unchanged procedural baseline.

## Complete executed proof

| Group | Methods | Failures | Errors | Skips |
| --- | ---: | ---: | ---: | ---: |
| Unchanged original p54 | 11 | 0 | 0 | 0 |
| Unchanged additional typography | 4 | 0 | 0 | 0 |
| Prior focused | 13 | 0 | 0 | 0 |
| p53 focused | 11 | 0 | 0 | 0 |
| Guard | 2 | 0 | 0 | 0 |
| New portable focused test, private | 6 | 0 | 0 | 0 |
| Unchanged shared | 47 | 4 | 0 | 2 |
| Integrated portable test, live | 6 | 0 | 0 | 0 |

All 21 original p54 actual-row deletions pass: the heading and prose controls
now count 20, with all remaining independent row anchors present. The portable
test also checks every deletion mirrored, for 42 deletion cases.
Both specks now preserve 21 rows; the portable test checks both page margins
and mirrored inputs. Standalone `t` and both smaller real footnote denominators
produce actual independent added bands. All original formula, numerator,
denominator, body glyph, minus and fraction-bar positives remain unchanged and
pass. Additional true minus/fraction strokes survive alone at either margin.
The scientific footnote still has two rows and unchanged counting pixels.

Shared failed IDs and skip reasons exactly equal the current-base-extended
signature: standalone margin `1` and `7` at left 21 and 1549; two original107
tests skipped because that original fixture is unavailable. No introduced
shared failures. The complete runner exits 1 solely for these four known
shared failures; it is not represented as an all-green shared suite.

No outstanding valid failure remains in the requested p54 controls.
This is bounded technical proof, not a full-book correctness claim.

## Evidence, preservation and reproduction

`verification-before-apply.json` binds the pinned base, exact candidate/diff,
unchanged control hashes, shared signature and protected rejection artifacts.
`integration.json` confirms exact tested-live equality, six passing integrated
tests, unchanged protected artifacts and unchanged original source bindings.
Private group logs are next to `../candidate-05/results.json`; portable logs
are `../candidate-05/portable.txt` and `integrated-portable.txt`.

The original first-reject report/diff/results and six failures, ENTRY snapshot
and original control file remain unchanged. Candidate03 layout/report/diff/results
remain unchanged; the refinement report hash at this continuation's entry was
`53441a2583de2eeaa5cd4851b1d4228ff72a900d8111b47d0465ed1a8a923653`
and is preserved rather than replaced by this report.

Reproduce from the stated cwd with the installed environment:

```sh
.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/180-7-p54-counter/refinement/run_checks.py candidate-05
.claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/test_line_bands_footnote_separator.py
```

No new visual images or reopens: 0 new, cumulative 3/8. Numeric fixture reads
and temporary PDF-backed test renders did not load image payloads or modify
original pixels. No new asset package or full-book pipeline was introduced.
No source, audit, lesson, artwork, app, schema, installer, Git, DB, paid call,
timer or chat/message operation occurred. No p53/p54 finalize or source55/56/57
stage was replayed. Parent owns finalize54 and downstream review/assembly.
