# P53 Counter Repair

2026-11-23, STEMROBIN-184, finish=review. Actual cwd:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.

The latest delegation authorized the minimal `layout.py` algorithm repair and
focused tests for the independently diagnosed p53 body/caption merge. It
supersedes only the old count diagnostic's prohibition on this tool repair.
The original diagnostic, failed calls and source/figure HOLDs are unchanged.

## Actual Cause

The native detector's body scale was 44px and row scale 49px. Expansion identified
two supported fragments, [1419,1462] and [1466,1502], but `_single_fraction_row`
collapsed the count back to one. Caption `图` has a 35px component; nearby `31`
components are 26px and 25px high. Both digits missed the complete-glyph threshold,
so the caption was rejected as an unsupported remote singleton.

The repair lets a complete glyph retain nearby smaller glyph peers only when their
central halves overlap on the same baseline. Existing height/width and horizontal
reach constraints remain explicit. No source text, marker, exclusion, figure
rectangle, artificial row or count override changed. Existing dirty algorithm
changes outside this repair were preserved.

## Verification

Twelve focused caption tests passed, including the original hash-bound p53 source,
synthetic smaller-digit captions, inline captions, fraction-only and unsupported
singleton negatives, translation and scaling. Related fraction/carrier/layout
regressions: 163 run, 158 passed, five explicitly skipped, zero failed.

Only the failed p53 finalize was rerun:

```bash
.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 53 --root .tmp/stemrobin-184-six/n86-nov23-source53-current-engine/artifacts --books ssot-resources/soviet10year-textbooks/sources --work .tmp/stemrobin-184-six/n86-nov23-source53-current-engine/prepared
```

Actual exit 0: ten blocks, printed20/authored20, zero normalizations, one figure.
fig-31 remains [1017,939,447,500]. Markdown and page JSON are byte-identical to
the retained failed outputs. Figure PNG remains
`3f145fb0c6accc839d51c48a3efcb24d0f445004aae185e68ec26a259f4283b9`.
Only the count audit changed; its retained file is
`p0053-counter-repair.audit.json`, SHA256
`3880695d3b20ee6afba8b97526fef49f9cfad01f9672f78cb2c14537b9019e9f`.
The shared original source remains SHA256
`10c637fa27f71059839822d4f579bde1cceb2f27084cbf00e14077779c1af333`.

Three diagnostic source opens and one native-regression source open occurred.
The direct native finalizer's internal codec activity is UNKNOWN, not zero.
No model image opens, paid-service calls, new receipts/packages, DB writes or
publication occurred. P52 r/tau, O/0 and fine figure semantics remain SOURCE HOLD.
The counter PASS does not complete N86 or release any other source/figure HOLD.
