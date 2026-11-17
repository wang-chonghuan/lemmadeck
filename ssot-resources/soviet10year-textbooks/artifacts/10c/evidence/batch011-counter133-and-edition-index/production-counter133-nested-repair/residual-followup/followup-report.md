# STEMROBIN-184 Session B: Residual Native133 Failure

## Outcome And Freeze

The genuine prior native failure was unresolved on entry: 17 printed rows versus
the unchanged independently source-reviewed witness of 16. Synthetic passes in
the previous report were not source approval.

This additive followup proves a narrow classification defect computationally.
The one newly authorized native133 count now returns 16/16. The original failed
expression is one complete band `[701,855]`, not `[701,777]` plus `[778,855]`.
Every band outside that expression is identical to the preserved previous count.
This is read-only count evidence, not a finalize result. The persistent audit
still contains its original 17/16 failure and is deliberately unchanged.

Final owned tool hashes, frozen with no further production writes:

- `/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/tools/layout.py`
  SHA256 `b303055123e59a72a05c043f9c04c9631eb3fc8baa8c38e40832ced331dc21a4`
- `/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/tools/test_layout_nested_fraction_rows.py`
  SHA256 `415bf9189a7cbb1e115523f02e44be28977a8cbdeaaac6c39174c34cf5e5948d`

No active writes, child processes, or background sessions remain at handoff.
Ownership is released to the parent after the final evidence seal. WAIT.

## Scope

Only the failed native133 expression y=701..855 was computationally diagnosed.
No model image opens, image displays, crops, reopens, resizes, or enhancements
occurred. Permanent consumption remains 6/24, unchanged. Copying the original
PNG bytes for the authorized input snapshot did not load or emit model imagery.

Diagnosis ran the actual production cleanup/scale prefix extracted with AST,
stopping before the second row-projection refresh can proceed to joining or
counting. Only the existing expression's fraction helper and role classification
were traced. Diagnostic full-page count calls: zero.

Post-implementation native full-page count calls: exactly one, for native133
only. No old passing tests/gates, other pages, finalize, database, application,
browser, dependencies, Git, workflow refresh, or source/metadata/body/expectation
changes were made. Page130 remains UNKNOWN and untouched.

## Original Failure And Exact Call Path

Preserved original layout SHA256:
`211f8b194c1fae5d5ab87543ea13931811d44574386d1082dc9eab816afde389`.
Followup entry layout SHA256:
`ebe5c9c61aced17ec39269048ac54ee26ca134db01288226a3ebf80d9a8c43dc`.
The prior report SHA256 remains
`07ea6136ec751dcc3101bb9c9d1794a6cf6839f7e2cd26e0e99a1406bee343e2`.

The preserved original trace shows:

1. The ordinary joins form one `[701,855]` expression band.
2. `_fraction_tail_split` calls `_single_fraction_row` at glyph scale 43.75.
3. `_single_fraction_row` rejects at its final
   `return len(cores) >= 3 and overlapping` guard, with exactly one core
   `[46.75,64.25]` and `overlapping=True`.
4. `_fraction_tail_split` returns `None`; it does not explain the extra row.
5. `line_bands` expansion proposes count=2 for band height 155, line_h=46,
   glyph_h=43.75, typical_gap=40, pitch=86.
6. Its helper checks at 46 and 43.75 reject, leaving two synthetic subdivisions
   `[701,777]` and `[778,855]`.

The entry repair already owned the actual fractional evaluation limits.
This followup did not infer that connected delimiters caused the native failure.

## Native Computational Geometry

The original labels preserve all three detached tall stems even though ordinary
counting cleanup removes their pixels from its private counting copy:

| Original component | Native XYWH | Original ink pixels | Cleanup survivor |
| --- | --- | --- | --- |
| 145 | `[937,701,4,125]` | 328 | 0 |
| 147 | `[523,701,5,135]` | 351 | 0 |
| 148 | `[719,701,5,136]` | 510 | 0 |

At both production scales, `_fraction_limit_ownership` correctly owns the same
12 components: 151, 152, 154, 174, 175, 176, 178, 179, 180, 182, 185, 186.
Its returned ownership-mask array hash is unchanged before and after:
`23e2ebc3eea69218e9135e297515004db3fb66dcc8c7698f4aa55049ea03eb92`.
The cleanup-prefix hash is also unchanged:
`cc60032d0a43fce3aa3e6d58737ccde09d156931a33c760dba869fb7ff9bbfc9`.
Original-context expression ink: 8882 pixels. Cleaned expression ink: 7693.

After the existing limit and fraction-support classifications, the relevant
residuals are:

- Component 164: `[765,739,32,35]`, 216 pixels; the single supported body core.
- Component 163: small surviving pieces of an original body-height component
  near x=807..810; source connectivity is retained.
- Component 187: `[16,821,11,15]`, 138 pixels; a disconnected, sub-body singleton
  far outside every established fraction/body support interval.
- Component 188: `[275,821,1,2]`, 2 pixels.
- Component 181: `[1556,807,1,1]`, 1 pixel.

Component 187 contributes 8..11 pixels on its rows, so the global residual
projection exceeds the existing `max(8,0.25*peak)` threshold. The two-pixel
component contributes alongside it on two rows. These lower projection rows
extend `remaining` from the real core's local 38..72 to local 120..133.
Its global extent exceeds `2*line_h`, bypassing the compact single-body
classification and triggering the three-core requirement despite no independent
second body core.

This is geometry/row-support attribution only. It is NOT a new visual assertion
that the remote component is a scan artifact, separator, or particular glyph.
No legal exclusion was invented, and no native ink was removed.

## Precise Generic Repair

Only `_single_fraction_row` changed in this followup. No constants, imports,
other production declarations, carrier/offset routines, or prior ownership
classification changed.

The private residual row projection discounts a component only when all apply:

- Residual height and width are each below 0.6 of the current body scale.
- Its horizontal interval is farther than 2 body scales from established
  fraction rules and full body-glyph support.
- Every original source component it belongs to is also short and narrow.
  Thus a short remnant connected to a tall delimiter/bar/body glyph is retained.
- It has no horizontally nearby overlapping peer with credible sub-body
  dimensions (height >=0.2 scale, width >=0.15 scale).

The repair subtracts that component's contribution from `counts`, not `band`,
source pixels, counting ink, metadata, or figure geometry. Existing full-glyph
endpoints still enter the projection. Repeated small text, complete body glyphs,
nearby fraction content, and connected original context remain evidence.
Existing compact and multiple-core decisions and global thresholds are retained.
No page IDs, native coordinates, expected counts, overrides, or exclusions enter
the production code.

The same residual component geometry/pixel totals remain after the repair.
Only relevant projection extent changes to local `[38,53,54,55,72]`.
Both native helper decisions then return True at the compact-row guard.

## Independent New Tests And Every Attempt

Eight NEW cases were specified in `new-test-design.json` and appended to the
owned new test file BEFORE the production fix. Expectations were constructed
from printed-row geometry, not the previous tests or desired native total.
Existing fixtures and test declarations were not changed.

All method names below belong to `ResidualFractionProjectionTests`.

| New method | Initial result and layout | Repair-only retry | Latest |
| --- | --- | --- | --- |
| `test_remote_short_singleton_does_not_split_sparse_nested_row` | FAIL, entry layout | PASS, repaired layout | PASS |
| `test_scaled_translated_remote_singleton_still_has_one_row` | FAIL, entry layout | PASS, repaired layout | PASS |
| `test_repeated_remote_small_text_is_an_independent_row` | PASS, entry layout | Not rerun | PASS |
| `test_remote_body_height_single_glyph_is_an_independent_row` | PASS, entry layout | Not rerun | PASS |
| `test_remote_short_glyph_aligned_with_a_lower_fraction_is_supported` | PASS, repaired layout | Not rerun | PASS |
| `test_two_independent_equations_with_remote_short_singleton_remain_two` | PASS, repaired layout | Not rerun | PASS |
| `test_two_independent_fractions_with_remote_short_singleton_remain_two` | PASS, repaired layout | Not rerun | PASS |
| `test_connected_delimiter_bar_keeps_original_context_and_independent_row` | PASS, repaired layout | Not rerun | PASS |

Ten actual new test subprocess attempts: 2 FAIL and 8 PASS; eight distinct cases
have passing latest outcomes. Only the two failing positives were retried.
No passing case was rerun. The two entry-layout negative passes were deliberately
not rerun after the patch under the invocation's no-PASS-rerun restriction.
The post-repair remaining negatives and explicit source-context assertions
provide the bounded additional safety evidence; broad regression is not claimed.

The previous nine cases and all eleven prior test attempts remain preserved
verbatim in `original/prior-test-evidence.json`. None was rerun. Thus the additive
attempt ledger retains all 21 test attempts across both repair phases, not just
the final passing outcomes. Prior native 17/16 evidence is also retained.

Two diagnostic READ commands failed with the harness's allowlist AssertionError:
an attempted harness self-read and an attempted skill read. They executed no
image operation, count, test, or production write. Both stderr streams and
exit=1 command records remain in the additive ledger. The harness self-read was
performed through a separately logged `sed` subprocess; the skill was read once
successfully after extending the scratch-only allowlist.

## Exactly One Native Count

Actual logged subprocess argv:

```text
/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python
-B
/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-counter133-nested-repair/residual-followup/evidence.py
_execute
native-count
```

Record directory:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-counter133-nested-repair/residual-followup/commands/20261117T033452816780Z-native-count`.
The actual complete start/end/elapsed/exit/stdout/stderr and stream hashes are in
its `command.json` and the sealed `command-evidence.json`/`.md`. Tool-wall time
was 6.0279 seconds; traced `line_bands` time was 5.737292249978054 seconds.
Exit=0. Stdout records the full 16 bands and affected helper/expansion trace.
Stderr is empty.

The count runs unchanged `counting_ink(ink,[])` then `line_bands` once.
There are no figures or exclusions for native133. Both input arrays and source
PNG hashes are identical before and after the count. The actual production call
path returns True at glyph_h=43.75 and line_h=46, with original source context
present, and the expansion count becomes 1 at the original pitch=86.

All final bands:

```text
[246,292] [323,371] [408,510] [543,647] [701,855]
[891,1006] [1046,1136] [1193,1275] [1315,1361] [1400,1571]
[1612,1707] [1758,1837] [1898,1945] [2005,2094]
[2141,2218] [2269,2300]
```

## Preservation Hashes

Native source, 1695x2580 RGB:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c130-133/10c/pages/0133/page.png`
SHA256 unchanged:
`5e95f8447938b6b0d6781ea937124a1b4cac643181dec76445735237a2093816`.

Native133 persistent input hashes unchanged:

- `audit.json`: `0e357b1c738a7162233cc5da37b2e6df77590b4593f078457d593e2dc838cdc8`
- `page.json`: `465f5c1e9de3cab00028ab2ea569535bff73b751e2f76546442792ac997c6bff`
- `page.md`: `c3a5faa17ed62c85beb6ba232b47c9c473780e9d536b3fbcdf1712c731a9f238`

AST comparison against the entry snapshot proves only `_single_fraction_row`
changed; every other production declaration plus imports/constants is identical.
The entire existing test-file prefix before `if __name__` is unchanged, as are
its existing declarations and fixtures. Previous dirty carrier/offset work and
the first repair are retained. All snapshotted prior reports, trace, inventory,
count, test evidence, and original layout remain byte-identical.

## Full Evidence Paths And Hashes

All additive artifacts below are under this NEW absolute evidence directory:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-counter133-nested-repair/residual-followup`.
No prior evidence was replaced.

| Artifact filename | SHA256 |
| --- | --- |
| `followup-test-evidence.json` | `f98379fa3f7a6bb39fd9ff5e3cf26bce497dc2e23e6407a2719546ecd17213b6` |
| `followup-affected-count.json` | `b2ab1350027c6d31ae27d9c9572b9477b6d339e45ee20dcf9249238f3f51f86f` |
| `before-residual-trace.json` | `9f84d1127d872d4d3c4c96cad36b336748c22d9d080073925360f2548c20f358` |
| `after-residual-trace.json` | `af38f79d6bd0631290ebe01a623350e6e0e94058c6456ddd8511db207f78c29f` |
| `layout-followup.patch` | `6143857f5e0313ee4f2299f90ac4e972a41840d069ce3587555a37104627df2c` |
| `test-followup.patch` | `9b3e23bd501fd63ad71a15bd551781e660efab7a4ba063531ffed68dd2492351` |
| `preservation-proof.json` | `77f9a2a2a785ccdc2df1cfbcb96f62bf1cc8ea58259c5b79a0aeedf0c65967e5` |
| `preserved-failure-summary.json` | `ed12513cf098c6dd092959bd0c3fba392c35fa0238af8b7c01ddc56ba897660d` |
| `new-test-design.json` | `0b6b1555365ec8dbdde58960af5466cb08fd1a10f9f5a6a9b5fa4c6fcbaec75c` |

`command-evidence.json` and `command-evidence.md` include every actual subprocess
argv, cwd, absolute stdout/stderr paths, complete-stream hashes, UTC start/end,
elapsed duration, exit and status, including failed reads, failing tests,
repair-only retries, wrappers, and final sealing. The separately logged harness
self-read is included even though it is not in the harness's earlier JSONL.
`attempt-ledger.json` retains every prior and new test outcome and both native
count outcomes. `final-hashes.json` binds all immutable snapshots, inputs,
reports, patches, scripts, ledgers, command records and stdout/stderr streams.
`handoff-freeze.json` binds the final report and manifest hashes and records the
explicit final owned-file freeze. Their final hashes are returned as text after
sealing, avoiding self-referential report hashes.

## Limits And Handoff

The remote native component's semantic identity remains unclassified by a new
visual review. No visual source approval or scan-artifact exclusion is claimed.
The native computational count supports the source-confirmed single expression
and unchanged manual witness without deleting ink or changing its authoring.

The repair does not generally add ownership for wide, connected delimiter-limit
assemblies; that hypothesis was not the actual native rejecting defect.
Connected original components are conservatively retained by the new projection
guard, and a newly constructed connected delimiter/bar/body negative preserves
both original labels and independent lower-row evidence.

No broad test/corpus validation or finalize was authorized. Parent owns those
actions and the persistent audit update. No further writes/counts/tests/images
are active or planned by Session B. WAIT.
