# STEMROBIN-184 Offset Rule Repair

Bounded AFFECTED-ONLY repair; continuing invocation; no refresh/setup or completion workflow.
Only production edit: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/tools/layout.py`.
Only additive permanent test: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/tools/test_layout_offset_rules.py`.
All evidence is in `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-counter-offset-rule-repair`.
Images opened/generated: 0/0; permanent images: 0/0. No source page reads/edits, exclusions, count override, finalize, database, publish, app/dependency/Charter edits, peer math reports, or Git operations except the owned-file read-only diff check.

## Diagnosis

The independent expected count remains nine: six ordinary rows, two full body rows,
and one offset horizontal rule. The original test and its geometry are byte-unchanged.
Both the preserved Hubble baseline and pre-repair layout return eight.
The defect predates the parent's detached-fraction splice.

At the first close-gap merge, line_h = glyph_h = 20 and merge_gap = 8.
Body row 350..369 occupies columns 80..275; bar 375..377 occupies columns 450..619.
The vertical gap is 6, but column overlap is false. The unconditional close-gap join
turns those two bands into 350..377 before fraction attribution. Both fraction probes
(350..377 and 350..407) return false. Subsequent expansion keeps this 28-pixel band
as one row, losing the independent bar row.

The repair blocks only gap-only joins involving a fragment no taller than 0.25 times
the local glyph scale when the two bands have no shared ink columns. It is symmetric
and scale-relative; it does not filter, erase, reclassify, or exclude any ink.
Aligned strokes keep the existing join. Later fraction/carrier proofs are unchanged.
The Hubble body/carrier patch and the parent's seven-line detached_fraction splice
are preserved verbatim. The only diff against the pre-repair file is the new guard.

## Commands And Failures

Working directory unless stated otherwise:
`/Users/yong/.codex/worktrees/a07e/lemmadeck`.
Every recorded child command has full argv, cwd, timing, exit status, stdout and stderr
under `commands/<name>/{command.json,stdout.txt,stderr.txt}` in this scratch directory.

The inherited parent command was NOT rerun:
```sh
.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/test_layout_carrier_rows.py -v CarrierRows.test_bare_fraction_is_one_printed_row CarrierRows.test_scaled_bare_fraction_is_one_printed_row CarrierRows.test_bare_fraction_does_not_absorb_following_text_row CarrierRows.test_offset_rule_between_text_rows_is_not_a_fraction
```
Its preserved record is `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-counter-detached-fraction/first-affected-check/command.json`.
Recorded exit 1: three PASS, offset FAIL `AssertionError: 8 != 9`.

Pre-edit invocation:
```sh
node .intentfold/tickets/STEMROBIN-184/tmp/production-counter-offset-rule-repair/run.mjs diagnose-before
```
Runner exit 0 records the following two deliberately reproduced failures, without
rerunning any known-passed fixture:
```sh
/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-counter-offset-rule-repair/baseline/test_layout_carrier_rows.py -v CarrierRows.test_offset_rule_between_text_rows_is_not_a_fraction
/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-counter-offset-rule-repair/before/test_layout_carrier_rows.py -v CarrierRows.test_offset_rule_between_text_rows_is_not_a_fraction
```
Both exit 1, one test each, `AssertionError: 8 != 9`.
Records: `commands/baseline-offset-only` and `commands/before-offset-only`.
The corresponding baseline/before synthetic diagnostic commands exit 0 and retain
their complete projection/merge/join/expansion traces, not a claimed test PASS.

Post-edit invocation:
```sh
node .intentfold/tickets/STEMROBIN-184/tmp/production-counter-offset-rule-repair/run.mjs verify
```
Runner exit 0. The sole post-edit test command, cwd
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/tools`, is:
```sh
PYTHONDONTWRITEBYTECODE=1 /Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B -m unittest -v test_layout_carrier_rows.CarrierRows.test_offset_rule_between_text_rows_is_not_a_fraction test_layout_offset_rules
```
Exit 0: ten PASS, exactly the failed offset fixture plus nine new fixtures.
No broad tests or known-passed tests were rerun.

New boundaries, expected values derived from their independent geometry:
- Rule close to both full body rows: 9; separate rule retained.
- Scaled and reflected rule: 9; separate rule retained.
- Rule inside the body's envelope but in a gap between actual ink groups: 9.
- Disjoint rule exactly at the close-gap threshold: 9.
- Standalone minus between body rows: 9; its own band retained.
- Inline minus: 7; the minus remains in the body row.
- Aligned close numerator/rule/denominator: 7.
- Body-connected fraction rule: 7.
- Delimiter-connected two-row math: 8; neither equation removed.

`commands/after-synthetic-diagnosis`: exit 0; unchanged original geometry returns nine
and separately retains 350..369, 375..377 and 388..407.
`commands/owned-diff-check`: exit 0; command:
```sh
git diff --check -- /Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/tools/layout.py /Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/tools/test_layout_offset_rules.py
```
`commands/repair-diff` and `commands/preserved-baseline-diff`: exit 1 means differences
were found, not a test failure. They retain the full native unified diffs. Initial
read-only `diff -u` of preserved baseline versus pre-repair layout also exited 1,
showing only the inherited seven-line splice.
`commands/new-additive-tests-diff` retains the entire new test file as an additive diff.
The evidence-only invocation executes no tests:
```sh
node .intentfold/tickets/STEMROBIN-184/tmp/production-counter-offset-rule-repair/run.mjs evidence
```

## Ink And Preservation

Original synthetic fixture input and output SHA-256 are identical in baseline,
before, and after diagnostic runs:
`1299098881fa420cd87e40745bfeaf4fe5b5a6dc503060095e602d0ae8af0d68`.
Ink count is unchanged at 25,150. Its 510 bar pixels remain in the explicit 375..377
band after repair. All nine new tests assert full array equality, unchanged SHA-256
and ink counts. Eight rule/minus/fraction fixtures also assert that every rule row
is represented by returned bands; independent rules require their exact own band.
Per-fixture hashes/counts/bands are in `commands/after-offset-and-new-guards/stdout.txt`.

Before and after snapshots are separate exclusive copies, not replacements.
`before-hashes.json` and `after-hashes.json` cover the twelve protected input/evidence
files, including all parent's first-operation files, its runner, the Hubble baseline,
Hubble 17-PASS command/stdout/stderr, and the existing test file.
All twelve remained byte-identical. `evidence-index.json` hashes all new scratch files
and verifies both the protected files and the tested owned files still match.

Reused evidence, not new verification of the repaired file:
- Parent three PASS: bare fraction, scaled bare fraction, following row not absorbed.
- Hubble seventeen PASS: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-counter110-121/commands/focused-final/stderr.txt`.

No source-page revalidation is claimed. No product-wide or finalization acceptance
is claimed. This bounded coding repair stops here and waits.

## File Hashes

SHA-256:
- layout old: `51d5d0f46e92e2c6dbcd1ff2f24cfa21b38b91906ef963e961baf79f5d2ed39e`.
- layout new: `211f8b194c1fae5d5ab87543ea13931811d44574386d1082dc9eab816afde389`.
- Hubble baseline unchanged: `a461573faba4d03671a6e1ab07f28f39c4de056587265adad2ea7284e3ca495f`.
- Existing test file old = new: `707eccaeab90a7996dce822ffb54950b016706859211ec7327fe6ed56f1bb375`.
- New additive test (previously absent): `7e3c53c35b21415b6dde44b77d35aa9e0724ffbb01bc54b0783bfc27fe74951e`.
- `after-hashes.json`: `2914fd5045dcde87910dcbacac4a61c2e171e8e7c3f2240bf25f3b49896f17f5`.

## Repair Diff

```diff
@@ -849,7 +849,15 @@
                 min(prev_b - prev_a + 1, b - a + 1) >= 1.8 * glyph_h
                 and not _single_fraction_row(ink, prev_a, b, glyph_h)
             )
-            if a - prev_b <= merge_gap and not separate_tall_rows:
+            # A nearby thin rule needs shared columns before a gap-only join.
+            disjoint_thin_fragment = (
+                min(prev_b - prev_a + 1, b - a + 1) <= 0.25 * min(line_h, glyph_h)
+                and not np.any(
+                    ink[prev_a:prev_b + 1].any(axis=0)
+                    & ink[a:b + 1].any(axis=0)
+                )
+            )
+            if a - prev_b <= merge_gap and not separate_tall_rows and not disjoint_thin_fragment:
                 merged[-1] = (prev_a, b)
                 continue
         merged.append((a, b))
```
