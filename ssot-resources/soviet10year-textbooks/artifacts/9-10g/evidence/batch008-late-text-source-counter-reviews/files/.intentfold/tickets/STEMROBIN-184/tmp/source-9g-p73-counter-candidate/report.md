# STEMROBIN-184: Isolated P73 Counter Candidate

## State And Boundary

Candidate engineering is complete for the authorized bar-local veto exception.
**Not ready for promotion: one valid source-scale control remains FAIL.**
Parent consumption/disposition and any subsequent promotion authorization remain
pending. No production change, prepare, finalize or source gate was run.

Only this new `source-9g-p73-counter-candidate/` directory was written.
No source MD/JSON/audit edit, exclusion, row override, expectation relaxation,
new image display/browser, dependency, service or Git operation occurred.
Other workers' files were preserved.

Candidate code SHA256:
`97b320b016afdf1a5deca0e5d1c89d06cf95914b1ace61d1a7c4b811e6df35e6`.
Its exact parent is the byte-identical frozen eb6fca6d module.
`baseline-to-candidate.diff` contains the complete cause-specific diff.
`code-scope.json` confirms only `_single_fraction_row` changed and
`_bar_local_fraction_support` was added. All other functions, constants and
module statements are identical, including compact-height limits, glyph-scale
estimation, pitch fallback and exclusions.

Production SHA256 remains:
`eb6fca6d9a62663ed7e97d7f39cda32d803375f61bf71adbf9aac84b4c335c3d`.
Released report534 remains:
`534986e4919a34cb448dfa0a9497cf5f75785f82bc201bfd24e41868bccd60bb`.

## Source Cause And Candidate

Frozen independent p73 row19 is exercise192's second printed row: all five
scalar-multiple expressions, including both fractions and both radicals.
The authorized independent excerpt and original first-finalize exit1 evidence
are retained under `protected/diagnostic/`; their originals were not edited.

The source bar x600-650, y1603-1604 belongs to a component
x600-673, y1583-1612. It is connected to the neighboring body glyph, while its
numerator x612-629, y1561-1591 and denominator x612-630, y1610-1640 are separate
components entirely within the bar span.
`local-facts.json` preserves actual original and bar-removed component geometry.
Removing the opened bar leaves the neighboring body x645-673, y1583-1612:
this is not an independent arrowhead belonging to the fraction bar.

The frozen counter vetoes that short genuine bar twice: whole-component arrow
recognition and generic glyph-stroke rejection. The candidate bypasses ONLY
those two vetoes when all the following original-array facts hold:

- The opened rule is shorter than two existing glyph heights.
- Independent full-size glyph components exist above and below, inside its
  horizontal span, with overlapping horizontal support and bounded bar distance.
- Components carrying the bar cannot supply its numerator/denominator evidence.
- The bar-bearing body extends beyond the opened rule and is body-sized.
- A local genuine head's narrowing branch cannot be found on either direction
  of the original shaft. Opening alone is never proof that an arrow is a bar.

Existing straightness, position, thickness and final fraction-compaction checks
still apply. No page, exercise identifier, expected total or enlarged threshold
is a production input.

## Retained Failures And Iteration

All command directories are append-only evidence, with exact code/script bytes
under `sources/` when a counter/test ran. The original candidate failures are
not overwritten or converted to PASS.

| Run | Candidate | Tests | Exit | Observed failure |
|---|---|---:|---:|---|
| candidate-v1-contracts | first local-tip candidate | 17 | 1 | Seven failed assertions |
| candidate-v2-contracts | body-origin boundary corrected | 17 | 1 | Source fraction classifier at line_h38 |
| candidate-v2-expanded-boundaries | unchanged v2 | 19 | 1 | Same line_h38 control |
| candidate-v2-detached-head-boundary | unchanged v2 | 19 | 1 | Both mirrored body-touching genuine heads; line_h38 |
| candidate-v3-contracts | local narrowing-branch candidate | 19 | 1 | Only source fraction classifier at line_h38 |

The v1 actual trace showed reverse scanning included the body's wide origin as
an apparent terminal head. v2 rejected that origin. Strengthened head controls
then exposed that requiring a fully narrow tip misses a real head when it
touches a neighboring body. v3 checks original narrowing segments instead;
both mirrored real-head controls now pass without changing their False contract.

The synthetic fixture corrections are independently recorded in
`v1-fixture-disposition.json`, produced before modifying those fixtures:

- An arbitrary arrow crop included detached denominator pixels; its actual
  original component is a genuine arrow under the unchanged baseline predicate.
- The H crossbar had merged into an88px opened rule, outside the short-rule
  contract; moving that same body vertically exposes the intended short rule.
- Standalone equality/radical examples were already compact in eb6fca6d.
  Their no-local-fraction-support assertions remain. Original compact behavior
  is explicitly preserved, and full independent glyph rows were added beside
  them for the existing False tall-band assertion.

No True/False, expected2 or expected24 assertion was weakened. The first fixtures,
their failed assertions, raw logs and candidate bytes remain retained.
The bootstrap wrapper also initially failed before any counter execution due to
an invalid encoding option. Its tool-visible transcript is explicitly labeled
as a transcript, not invented byte-exact stdout/stderr separation.

## Remaining Genuine Control Failure

`test_source_fraction_row_at_both_actual_scales(height=38)` still expects True
and returns False. It is not waived. At both38 and39, the new bar-local predicate
returns True and the actual x600-650 rule enters the existing accepted-rule list.

`trace-v3-scale38.json`, `trace-v3-scale39.json`, `residual-geometry.json` and
`residual-arrays.npz` settle the remaining branch:

| Existing classifier scale | Added full-glyph overarrow residues | Result |
|---|---|---|
| line_h38; lower height bound22.8 | Three23px residues qualify | False |
| line_h39; lower height bound23.4 | The same residues do not qualify | True |

The extra full-glyph boxes at38 are:
`[402,1557,60,23]`, `[670,1556,38,23]`, `[892,1556,61,23]`.
The middle is the real OA overarrow clipped by existing fraction-column erasure;
its residual predicate is False, whereas the other two residual predicates are
True. The frozen source row has overarrows, not separate prose on these levels.
This distinction is why blindly dropping all residual components classified as
arrows is not a justified follow-up repair.

Their central cores end at1574.25,1573.25,1573.25, respectively.
Neighboring body glyph cores start around1590-1592. The unchanged compact
fraction branch requires adjacent full-glyph overlap, so those cores make it
return False even though the remaining span68 is below the unchanged76px limit.
At39 the remaining span61 is below78 and body glyph overlap succeeds.

This is a downstream original-versus-residual full-glyph attribution problem,
not a failure to accept the short genuine bar. It lies beyond the authorized
exception to the two bar vetoes, so it was diagnosed, not repaired.
Any follow-up should retain original component identity when deciding whether
this surviving23px material is decoration or an independent body row, while
preserving full glyphs and separate vector-prose rows. That is an unimplemented
proposal, not authorization or a claim that all counter controls pass.

## Exact Shared-Counter Comparison

The final read-only comparison uses retained original PNG arrays and frozen
page JSON figure boxes/existing exclusions, with finalize's content-width
derivation. It does not call finalize, prepare or another source review.

| Physical page | Frozen counter | Candidate | Exact band identity |
|---|---:|---:|---|
| 68 | 21 | 21 | Identical |
| 69 | 25 | 25 | Identical |
| 70 | 26 | 26 | Identical |
| 71 | 24 | 24 | Identical |
| 72 | 17 | 17 | Identical |
| 73 | 25 | 24 | Sole source-row merge below |
| 74 | 20 | 20 | Identical |
| 75 | 13 | 13 | Identical |

The ONLY final band change is:

```text
old counter bands19-20: [1556,1599], [1600,1642]
new counter band19:    [1556,1642]
```

The entire envelope stays the same; one internal false boundary disappears.
All p73 coordinates outside the original y1556-1642 envelope are exactly
identical, not merely count-equivalent. The original independent24 baselines
each belong to exactly one candidate band; each band has one baseline.
Exercise192's two source lines remain two.
`comparison-v3.json` contains every old/new band and the exact movement.

The earlier p68-71 `verify_repair-production` strict outside-coordinate identity
FAIL remains exit1. It was neither changed nor rerun, and its asserted region
was not widened. Parent's earlier disposition belongs to the released report534,
not this report. Exact retained raw identities are recorded separately under
`protected/existing-outside-failure/` and in the manifest.

## Delivery

All evidence lives under the NEW directory:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p73-counter-candidate/`.

- `candidate/layout.py`, `baseline/layout.py`, `baseline-to-candidate.diff`.
- `before.json`, `after.json`: exact input/current protected bytes and hashes.
- `commands/`, `command-identities.md`: every actual argv, raw path, exit and SHA.
- `tests-v1.json` through final `tests-v3.json`: retained failures, not all PASS.
- `comparison-v3.json`: all68-75 counts and band-coordinate movement.
- `trace-v3-scale38.json`, `trace-v3-scale39.json`, `residual-geometry.json`,
  `residual-arrays.npz`, `residual-array-hashes.json`: surviving branch facts.
- `manifest.json`: candidate/report/diff/test evidence identities and pending state.

Production remains eb6; report534 remains frozen. New finalize=0, prepare=0,
production edits=0, source writes=0, images=0. No auto promotion.
