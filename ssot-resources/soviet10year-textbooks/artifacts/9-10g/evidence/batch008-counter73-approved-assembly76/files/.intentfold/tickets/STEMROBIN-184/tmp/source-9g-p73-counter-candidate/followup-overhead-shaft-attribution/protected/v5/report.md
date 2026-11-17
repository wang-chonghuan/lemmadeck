# Original Versus Residual Full-Glyph Attribution Followup

Ticket: STEMROBIN-184. This is an additive continuation of the isolated p73
counter candidate, not a workflow restart, source review or promotion.

Owned directory:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p73-counter-candidate/followup-original-glyph-attribution/`

## Disposition

The authorized downstream attribution correction is implemented in candidate
v5 only. The actual source fraction is True at line_h38 and39. All19 approved
v3 methods and assertions are unchanged and PASS. All existing mirrored genuine
arrow/body False controls remain unchanged and PASS.

The complete followup suite is NOT green: one new method has two retained
small23px vector-prose failures, expected2 versus actual4. Baseline eb6, v3
and initial followup v4 independently return identical four bands. This
pre-existing raw-band joining/filtering defect was not expanded into this
downstream attribution repair. Its assertion and fixture remain unchanged.
Promotion remains unapproved; no production or source file was written.

## Frozen And Candidate Identities

Production layout.py:
`eb6fca6d9a62663ed7e97d7f39cda32d803375f61bf71adbf9aac84b4c335c3d`

Released counter-vector-rows/report.md:
`534986e4919a34cb448dfa0a9497cf5f75785f82bc201bfd24e41868bccd60bb`

Original v3 candidate:
`97b320b016afdf1a5deca0e5d1c89d06cf95914b1ace61d1a7c4b811e6df35e6`

Original v3 report:
`47c9fafbb663481daf3202b9c92e1cfb7afa3423eb8b565fa8f742e2ed159e28`

Original v3 diff:
`d4c5d13f42ff737552d4685b65049a15a644f2777a0a9f1f9216b55380134fda`

Final isolated candidate, candidate/layout.py,42313bytes:
`5215ec429c4382036c70ef0e0bd86970048f5c1ea4f7dacef8840ab9b8a7688e`

## Actual Source Cause

The prior bar-local repair already accepts the genuine short fraction rule.
Downstream, _single_fraction_row erases the same existing fraction columns and
relabels surviving ink. At38, three genuine overarrows with23px height satisfy
the existing0.6*38 lower full-glyph bound and are incorrectly attributed as
independently supported upper text. At39 they fail0.6*39, so the same source
previously returned True at39 but False at38.

Source original ID1 is clipped from61px to38px width after the existing
fraction-column erasure. Its residual shape no longer satisfies the original
arrow-head predicate. Reclassifying residual shapes alone therefore loses
decoration identity. Conversely, removing every original predicate-positive
component would lose real bodies: source IDs14,16,19,24,25,27 trigger the broad
arrow predicate despite containing text/body ink.

Independent raw original-component facts:

- Genuine overarrow IDs1-5 have narrow3-6px central spans and opened straight
  shafts; the shaft-only geometry probe leaves no full body.
- Predicate-positive body glyphs have wider central spans or no long opened
  shaft, or retain a full body after probing.
- The genuine bar's carrier ID19 spans original x600-673, y1583-1612.
  Its opened rule is x600-650 with2px height. Its connected full body
  x645-673 remains30px high in the private shaft-removal probe.
- After the unchanged fraction-column erasure, residual ID27 maps back to
  original ID19 at x670-673, y1586-1602. It is17px high and4px wide, so it
  does not satisfy the existing full-glyph geometry; it is not decoration
  and its surviving ink is retained.

## Narrow Correction

Save original connected-component labels before existing column erasure.
After erasure, map each eligible residual glyph back to original IDs.
An original component can be omitted from full-glyph attribution only if it
independently has a narrow headed shaft, a straight opened horizontal shaft,
and no remaining full body in a private geometry probe.

The geometry probe operates on a copy only. It does not delete counting ink.
The broad _arrow_headed_rule, bar-local bilateral support, fraction acceptance,
line_bands, glyph estimator, pitch, compact-height limits and exclusions are
unchanged from v3.

The accepted bar-carrier contract is explicit: collect original IDs when a
rule is accepted, and never classify those IDs as decoration for residual
full-glyph attribution. Source accepted carriers are19,38,39,40,41.
Original decoration attribution IDs are exactly1,2,3,4,5 at38 and39.

This protects a genuine bar's connected body even if a decoration predicate
misrecognizes that original carrier. A dedicated injection test changes only
that predicate's answer for a known accepted carrier, not source geometry or
expected results. Initial v4 fails the independent-body-row expectation in
both orientations; final v5 passes both. The normal source carrier and normal
body-touching fraction controls already passed v4 and remain passing v5.
This is an attribution contract regression test, not a claim that actual
source ID19 was deleted in v4.

## Unchanged Counting Bytes

For the actual source at38 and39, v3, v4 and v5 have byte-identical residual
ink and row-count arrays. Only glyph attribution differs:

- Residual ink SHA256:
  `63dce98705e970db9f898577368e2780055255b1e2681f5db7a547a5f603a03c`
- Counts SHA256:
  `1293c7ccfcbd4fe3da9a3d5250e56953972d5920813901d0b0ed0e7c4c4aadcc`
- Full-glyph support at38 changes from20 to17 components; the three omitted
  components map to original overarrow IDs1,2,4, not to carrier ID19.
- Full-glyph support at39 remains17 components.
- Input source arrays are unchanged in every trace and test.

`attribution-trace.json` records all original/residual mappings, accepted
carrier IDs, decoration IDs, remaining rows and actual return branches.
Its SHA256:
`ce676b601b09d522faeccf977c704c81359042b5164aca52377084605ab18091`

`attribution-arrays.npz` retains raw source/original-label/residual/count/remaining
arrays without displaying images. SHA256:
`de0ea6b49d755ffafa0d555a716cfaa48e3c78fb68948ccbc53710959ec64635`

## Tests And Retained Failures

All actual commands, absolute argv/cwd, start/end times, code/script identities,
raw stdout/stderr paths/hashes and exits are in command-identities.md/json.
The command-identities.md SHA256 is:
`2e3c5cf7606bbb78b41c1b73696f8233cec0b4ae7257d08ae59e4f476863ed94`

The test files do not read existing repository tests as design sources.
They retain the previously authorized independent source/geometry contracts.
AST comparison proves all19 approved methods, fixture helpers and assertions
are unchanged; all25 v4 methods are byte-identical in v5.

Final method-level results:

- Original19 v3 methods:19 PASS, including actual38/39 True, mirrored
  source-like genuine-arrow/body False, hollow/H/two-sided terminals,
  radical/minus/equality, supported/missing/misaligned fraction glyphs,
  two independent38px vector-prose rows and input immutability.
- New original/residual attribution controls: source arrows versus bodies,
  clipped arrow identity, normal/wide/full H/hollow/A glyphs, attached
  arrow/body preservation, and independent23px full glyph rows all PASS.
- New small23px adjacent vector-prose method: two unchanged subtest FAILs,
  H and hollow; complete25-method suite exit1.
- Three accepted-carrier methods: all PASS, exit0. They cover actual source
  ID19, genuine bar touching a full body with an independent lower body row,
  and injected decoration false-positive precedence, mirrored/unmirrored.

Actual evidence labels and exits:

| Label | Exit | Meaning |
| --- | --- | --- |
| bootstrap-copy | 0 | Exact v3/eb6 copies through apply_patch |
| inspect-original-components | 0 | Raw source geometry before followup repair |
| candidate-v4-contracts | 1 | First new small-row failures preserved |
| candidate-v4-small-row-probe | 0 | Independent eb6/v3/v4 raw branch trace |
| candidate-v4-carrier-contracts | 1 | First carrier-precedence failures preserved |
| candidate-v5-carrier-contracts | 0 | Unchanged carrier contracts PASS |
| candidate-v5-contracts | 1 | Same small-row failures, all other methods PASS |
| candidate-v5-attribution-trace | 0 | Source identity, carrier and byte invariants PASS |
| candidate-v5-code-test-scope | 0 | Narrow AST/diff and unchanged test checks PASS |
| candidate-v5-readonly-68-76-compare | 0 | Single final exact-band comparison PASS |

For every label, raw files are commands/<label>/stdout.raw and stderr.raw;
result.json preserves exact argv, cwd, exit and source/script SHA256.
Every candidate-v4/v5 Python run also retains exact candidate and test/probe
bytes in commands/<label>/sources/.

### Retained Small-Row Failure Cause

The unchanged small-row fixture expects two vector-prose rows, not four.
Baseline eb6, v3 and initial v4 independently return:
`[[23,25],[40,62],[83,85],[100,122]]`.

Actual branch trace shows line_h=23, glyph_h=23 and correctly recognized
original arrow IDs1,15. Projection fragments retain the3px shafts but omit
thin head tips. Each shaft ends15 coordinates before its body row starts,
exceeding merge_gap0.4*23=9.2; the merged/joined bands remain separate.
Neither isolated shaft establishes supported full-glyph rows. Its70px width
also lies between the final narrow and wide decoration-filter ranges, so
it survives as a separate one-count band.

This is upstream raw-band joining/filtering, not downstream original/residual
full-glyph attribution. Final v5 retains the same two expected2/actual4
failures, and line_bands is AST-identical to eb6/v3. No fixture, assertion,
threshold, band region or test result was relaxed to make the suite green.
`small-row-probe.json` SHA256:
`f440c07e505c531ccb5ff7ff6d9000043e18e13a3bc7c96ab983d233bf82ea97`

## Single Final Exact-Band Comparison

One final read-only comparison covers frozen inputs68-75 and newly authorized
current p76 page.json plus original PNG. This is counter compatibility only;
it does not rerun any successful source gate or finalize.

| Page | eb6 | v3 | Followup v5 | Coordinate Disposition |
| --- | --- | --- | --- | --- |
| 68 | 21 | 21 | 21 | All bands identical |
| 69 | 25 | 25 | 25 | All bands identical |
| 70 | 26 | 26 | 26 | All bands identical |
| 71 | 24 | 24 | 24 | All bands identical |
| 72 | 17 | 17 | 17 | All bands identical |
| 73 | 25 | 24 | 24 | v3/followup identical; one eb6 split merged |
| 74 | 20 | 20 | 20 | All bands identical |
| 75 | 13 | 13 | 13 | All bands identical |
| 76 | 20 | 20 | 20 | All20 bands and coordinates identical |

p73's entire eb6-to-followup diff is before rows19-20
`[1556,1599],[1600,1642]` to after row19 `[1556,1642]`.
All outside bands under the original1556-1642 coordinates are exactly equal.
There is no v3-to-followup full-page band movement anywhere68-76.

p76 retains fig-84 box `[450,1199,550,227]`, existing exclusions empty,
and all20 exact coordinates in comparison-v5.json. Its current inputs were
copied byte-exact before comparison, then verified unchanged afterwards:

- page.json SHA256:
  `245153b466f9916e433c59a32c503bd8af6320676cef5d2317d1fb72d1b69b9a`
- Original PNG SHA256:
  `b75eeed6c492c3b5f44f1728eaa7b584041ac69f9d033a6873c3fd0c6c4e7ac2`

comparison-v5.json SHA256:
`1b7bb17cb2d24acf47355ac147d75dadd70c45514b9fbb05b45f95a80cf9779d`

## Exact Diffs And Protected Evidence

v3-to-followup.diff is the complete additive behavior correction,3769bytes:
`717daf186147b9625ec3d45db1448354d4c987621dbd63f2126bce211c094fb5`

baseline-to-followup.diff is the complete eb6 candidate proposal,7531bytes:
`b8e8d7f918411b19c95b4c9c41665fecac9109d786febb360466234154b5a014`

AST scope: only _single_fraction_row changes relative to v3, and only
_original_arrow_decoration is added. Relative to eb6, the previously proposed
_bar_local_fraction_support is also added; that helper is byte/AST unchanged
from v3. All nonfunction statements and every other baseline function remain
unchanged. code-test-scope.json SHA256:
`83cc1174a648525dcdfd7119ead8d1e5ac8139b6c46b50b2a63312dc7b47f97b`

before.json inventories all228 prior candidate files. after.json verifies
that exact inventory and preserves current production/report/v3 bytes plus
final candidate/test bytes. No original v1-v3 file, failure or result was
modified. after.json SHA256:
`04e306242debac7469c3c1a8639d2f45fe70fad934413ca6f5580730818d1ea6`

The original verify_repair-production strict outside_old==outside_new exit1
is copied verbatim under protected/existing-outside-failure/. It was not
rerun, overwritten or broadened. Its original stderr SHA256 remains
`ed419d4c925014d68916e287d0ee24caa13031602047c57436acde2e41f6bb71`.
The frozen released report534 remains the earlier disposition; this new
p73 compatibility comparison does not reinterpret that retained failure.

No production/source/review/metadata writes, prepare, finalize, source gate,
image display, browser, exclusions, expected-count overrides, height-threshold
increase, dependency/service/Git operation or other-worker edit occurred.
The only output writes are under this owned additive followup directory.
Parent owns all future disposition and any approved promotion/finalize.
