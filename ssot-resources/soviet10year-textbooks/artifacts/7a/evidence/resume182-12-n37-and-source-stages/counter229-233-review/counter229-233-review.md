# Affected Counter/Source-Binding Review

STEMROBIN-182; book7a physical pages229/233; offline; finish:review.
Sole cwd: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.

**PASS. No actionable defect found in the scoped patch or affected source bindings.**
This inherits the two per-page source-faithful findings, not the older whole-batch
approval/HOLD. No source images opened, tests rerun or finalizers invoked.

## Counter And Preservation

- Read-only forward application of `counter-repair/own-change.patch` to
  `layout-before.py` reproduces current `layout.py` byte-for-byte. Reversing it
  restores the baseline exactly. Four hunks,38 added lines,1 removed line.
- Reverse/forward comparison of `preexisting-diff.patch` also passes. The existing
  `_fraction_baselines`, `_single_fraction_row` and expansion callsite remain
  byte-identical; no preexisting fraction work was rewritten.
- The new helper at `layout.py:293` requires a spanning narrow component and
  existing fraction baselines, then combines distinct fraction/plain-row centres.
  No-brace and one-fraction controls leave the existing estimate intact.
- The radical join at `layout.py:574` requires a thin fragment, tall companion,
  bounded span and the existing single-fraction predicate, while retaining
  common gap/full-row/stacked-arithmetic guards.

## Source And Gates

| Physical Page | Inherited Source Rows | Audit Detector | Authored Rows | Result |
| --- | --- | --- | --- | --- |
| 229 | 21 content + footer =22 | 23 ->22 | 22 unchanged | PASS |
| 233 | 22 content + footer =23 | 24 ->23 | 23 unchanged | PASS |

Both current `page.md`/`page.json` pairs equal FIRST snapshots and independent
review hashes byte-for-byte. Both audits change only `lines_printed` and `errors`;
the latter are now empty. Zero figures and complete text are inherited from the
hash-verified independent source review. Source raster/grid hashes and page JSON
render bindings still match; hashes were read as opaque bytes, without decoding.
Existing wrap markers reproduce the independent per-block row inventories.
FIRST exit1 receipts, failure audits and their stream hashes remain intact.

Existing receipt/command/cwd/stream checks pass: focused4 tests OK; fraction42
tests OK with4 unavailable historical-pixel skips; layout17 tests OK. Existing
affected finalizers exited0 with22/22 and23/23, zero figures/normalizations.
The focused cases are included in the fraction discovery, not additional unique
coverage. Nothing was rerun.

`test_fraction_system_rows.py` is bound separately from the layout-only patch.
Its braced fraction/plain-row positive, no-brace negative and one-tall-fraction
negative match printed-row requirements. Its already-written source expectations
match the preexisting independent inventory, not a new detector run.

## Hash Bindings

| File | SHA-256 |
| --- | --- |
| Current layout.py | `83f273057b6ae56d5807ec8ad650d099ea831d2bd270660b5c851f3c09194cd8` |
| layout-before.py | `c1bbc020c51e82f02ffb74ece09b44533ecdd3ee33b8e64ea8707497fb4c38a4` |
| own-change.patch | `947bf1eb727f6ea0e3232665fba914cc4d337ed1aee51818e4ac57a32b4e5d04` |
| New test | `cc902283ea1b4dad7dbba3c192857cd94886862b9700a05d2c114a979d36a778` |
| Independent source review JSON | `5065a97ab7f37141d7ccea648a8edefe3f3bd268d725c6b980c8f4b89fefd845` |

Full paths, triplet/receipt/source hashes, comparisons and rules are recorded in
the companion `counter229-233-review.json`; `report-hashes.json` binds both reports.

## Residual Limits

Geometric brace and radical heuristics are not semantic recognition. Damaged
spanning strokes, unusually close plain rows or tiny unrelated marks remain
possible risks; no affected-source defect is established. There is no dedicated
new synthetic radical-negative case; existing wrapped/outside-row and
single-fraction negatives supply inherited coverage. Four historical pixel
subcases remain unavailable.

Receipts bind commands/cwd/streams, not runtime tool/test bytes. The existing
after-binding manifest matches current layout/patch, and layout/test mtimes
precede the passed stages; this supports inheritance, not runtime attestation.
`p2c.py`, `blocks.py` and the lesson `SKILL.md` changed concurrently after the
initial read. Earlier read hashes and later observed hashes are distinguished in
JSON; all were left
untouched and their edits are not approved here. Scoped counter/test/source
bindings still match. The changed finalizer stack was not rerun or approved.
Prepared `layout.json` files retain FIRST detector history and are not the
current gate authority. PASS applies only at these hashes, not to unrelated
holds, further production, publication, merge or ticket closure.
