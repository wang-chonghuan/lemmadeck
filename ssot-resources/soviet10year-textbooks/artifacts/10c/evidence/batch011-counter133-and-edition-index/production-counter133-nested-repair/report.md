# STEMROBIN-184: Zero-Image Nested-Fraction Repair

Status: **SOURCE_REPAIR_UNRESOLVED_AWAITING_PARENT**
UTC: 2026-11-17T03:23:44.926517+00:00

## Outcome

**Do not treat this as a validated source repair.** The one authorized page-133
computational count still returns 17 against the unchanged independently reviewed
author witness 16. The original `[701,777]` / `[778,855]` split remains.
That count allowance is consumed. No second source count or finalize was run.
The edits remain present for parent review; this worker now waits.

All nine new focused cases have a passing latest result. Seven passed once at
the initial implementation version. Only the two failing cases were repaired
and rerun once each. No previously passing case, old test, or gate was rerun.
These independent cases are not sufficient to establish fidelity on native page 133.

## Exact Changed Files

- `/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/tools/layout.py`
  modified; final SHA256 `ebe5c9c61aced17ec39269048ac54ee26ca134db01288226a3ebf80d9a8c43dc`
- `/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/tools/test_layout_nested_fraction_rows.py`
  new; final SHA256 `dbef9063d266eff0df2e84185bb94748df3a83834a669c298dae520062cedfc7`

Original layout SHA256: `211f8b194c1fae5d5ab87543ea13931811d44574386d1082dc9eab816afde389`
Exact patch: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-counter133-nested-repair/layout-change.patch`

## Repair Design

Fractional evaluation-limit ownership requires an established neighboring main
fraction bar, a tall thin delimiter, an aligned upper limit, and a complete
lower numerator/bar/denominator object within scaled geometric bounds.
Ownership affects only the private classification copy; no native/page-count
ink mask, count exclusion, page-specific coordinate, or expected-count override
was added. The page input arrays remain unmodified by line_bands.

Original pre-cleanup components are available to the fraction-tail and final
expansion checks so a removed thin delimiter can still supply role evidence.
A new guard prevents whole-column ownership from swallowing two complete
body-scale fractions at distinct vertical levels with comparable widths.

Existing function AST bodies outside _single_fraction_row, _fraction_tail_split,
and line_bands are identical to the authorized dirty baseline. The new helper is
_fraction_limit_ownership. Existing carrier/offset helpers and global thresholds
are unchanged. No surrounding dirty work was discarded.

## New Independent Cases

Expectations were designed from the source-confirmed single horizontal expression
and production fraction/body ownership rules, without reading old tests.
Fixtures use independently authored connected-glyph Boolean geometry; no native
PNG/crop, previous image-bearing history, font asset, or model image was loaded.
No assertion, fixture, or expected result was changed after a test failure.

| New case | Attempts | Latest exit | Latest layout SHA256 |
| --- | --- | --- | --- |
| `NestedFractionRowsTests.test_horizontal_offset_fraction_is_not_a_limit` | 1 | 0 | `60e5e6822a596089c58605b1aa19299d409e3b60244dac1a6f33e62e99b4bc0d` |
| `NestedFractionRowsTests.test_independent_text_below_valid_limits_is_not_owned` | 1 | 0 | `60e5e6822a596089c58605b1aa19299d409e3b60244dac1a6f33e62e99b4bc0d` |
| `NestedFractionRowsTests.test_missing_upper_limits_cannot_claim_lower_fractions` | 1 | 0 | `60e5e6822a596089c58605b1aa19299d409e3b60244dac1a6f33e62e99b4bc0d` |
| `NestedFractionRowsTests.test_tall_nested_evaluation_is_one_row` | 2 | 0 | `ebe5c9c61aced17ec39269048ac54ee26ca134db01288226a3ebf80d9a8c43dc` |
| `NestedFractionRowsTests.test_translated_double_scale_row_is_one` | 1 | 0 | `60e5e6822a596089c58605b1aa19299d409e3b60244dac1a6f33e62e99b4bc0d` |
| `NestedFractionRowsTests.test_two_independent_equation_rows_stay_two` | 1 | 0 | `60e5e6822a596089c58605b1aa19299d409e3b60244dac1a6f33e62e99b4bc0d` |
| `NestedFractionRowsTests.test_two_independent_fraction_rows_stay_two` | 2 | 0 | `ebe5c9c61aced17ec39269048ac54ee26ca134db01288226a3ebf80d9a8c43dc` |
| `NestedFractionRowsTests.test_two_independent_text_rows_stay_two` | 1 | 0 | `60e5e6822a596089c58605b1aa19299d409e3b60244dac1a6f33e62e99b4bc0d` |
| `NestedFractionRowsTests.test_wrong_body_scale_does_not_claim_limits` | 1 | 0 | `60e5e6822a596089c58605b1aa19299d409e3b60244dac1a6f33e62e99b4bc0d` |

Full per-attempt test stdout/stderr/timing/status/hash evidence: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-counter133-nested-repair/test-evidence.json`
Fixed independent expectations: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-counter133-nested-repair/test-design.json`

The initial single-row fixture passed the helper but was split at fraction-tail
recovery after cleanup removed delimiters. Original component context repaired
that synthetic failure. The independent-fraction fixture exposed column-wide
ownership swallowing both fractions; the two-level complete-fraction guard
repaired that synthetic failure. Both expectations were retained.

Failed-fixture debug probes are retained under failed-probes/. The first
single-row probe failed while serializing slice objects; its command/stderr
and the subsequent serialization-only script repair are retained in commands/.
No successful test case was run by these failed-case probes.

## Original Failure

Recorded original args: `.claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 133 --work .intentfold/tickets/STEMROBIN-184/tmp/production-source10c130-133`
UTC start `2026-11-17T02:51:34.611Z`, finish `2026-11-17T02:51:35.126Z`,
exit=1, signal=None, error=None.
The original command record does not identify the Python executable; none is inferred.
```text
[finalize] 10c p0133: 6 块 / 16 行（印刷 17）, 插图 0 张, 规范化 2 处
  ✗ 失败 1 项:
    - 行数对不上：印刷 17 行，块体 16 行（块体一行 = 印刷一行；公式跨行用 ↵ 标断点）
```
Original stderr: ''

## Sole Affected Source Count

UTC result `2026-11-17T03:21:04.213991+00:00`; command exit 1; printed count 17;
unchanged author witness 16; no exclusions.
Current layout SHA256 `ebe5c9c61aced17ec39269048ac54ee26ca134db01288226a3ebf80d9a8c43dc`.
Source SHA256 before/after `5e95f8447938b6b0d6781ea937124a1b4cac643181dec76445735237a2093816`.
Result path: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-counter133-nested-repair/affected-count.json`
The residual native failure was not diagnosed through another pixel read or count.

## Preservation and Scope

Original layout and relevant tool/source/metadata/trace/failure inputs were
byte-hash snapshotted below original/. Every input except the owned layout.py
still matches its original SHA256; all snapshots themselves remain unchanged.
Full preservation record: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-counter133-nested-repair/final-hashes.json`

New model image opens: 0. Prior permanent consumption remains 6/8 and 6/24.
The sole native decode was computational count evidence with no image payload.
Page 130 remains UNKNOWN and untouched. Source, metadata, author body, wraps,
and expected values were not edited. No finalize, workflow refresh, dependency,
database, app, project test/build, Charter, publish, or Git operation occurred.

## Commands

All logged execution argv, working directories, exact UTC start/finish, elapsed
time, exit/signal/status, and byte-exact stdout/stderr with hashes are retained
in commands/*/command.json and the complete live commands.jsonl index.
Index: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-counter133-nested-repair/commands.jsonl`

Logging limitation: the initial `sed -n '1,260p' layout.py` read occurred before
the persistent logger. Its exit and reported 0.0000s wall time are known;
exact UTC timestamps were not exposed by exec_command. stdout is reproducible
from the unchanged authorized baseline; missing times are explicitly null.
Bootstrap record: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-counter133-nested-repair/bootstrap-read.json`

## Parent Decision

Native page 133 is not fixed by the current candidate despite focused-case passes.
Review the retained patch and evidence before using it. This worker has stopped
and waits for a new bounded authorization; it will not consume another count
or image allowance or finalize on its own.
