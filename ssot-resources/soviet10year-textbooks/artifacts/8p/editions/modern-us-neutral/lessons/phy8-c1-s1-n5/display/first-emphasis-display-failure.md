# First Emphasis Display Failure

Date: 2026-11-23. Explicit workdir:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180`.

The first full desktop/mobile script exited0, but its actual report contains
literal `<span style="text-emphasis: dot; ...">` in the projection-difference
paragraph. Its markup-presence assertion was missing. Preserve the first
report and all first screenshots; do not treat it as complete display PASS.
`first-auto-check.snapshot.txt` retains the actual original report. The exact
pre-repair renderer is retained in raw n5
`htmlfrag-before-emphasis-fix.snapshot.txt`.

The renderer only accepted `text-emphasis: filled dot`, not the source's
equivalent `text-emphasis: dot`. The single regex repair accepts this exact
shorthand and emits the existing fixed safe style. Seven new checks and five
existing formatting/safety test entries passed; unsafe extra attributes,
styles and unmatched tags still escape. No source/template/figure/answer
bytes changed.

The first partial-render invocation through `p2c.py render --text-only` exited2:
`p2c.py: error: unrecognized arguments: --text-only`.
No rendering occurred. The existing `render_lesson.js --text-only` entry then
completed once, preserving the unchanged exercises HTML.

The first affected-only display command exited1:

```text
node .intentfold/tickets/STEMROBIN-180/tmp/180-7-n5-emphasis-affected.mjs
AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

18 !== 2

at .../180-7-n5-emphasis-affected.mjs:57:14
actual: 18
expected: 2
operator: 'strictEqual'
```

Its actual script is retained as
`emphasis-check-first-selector-failure.snapshot.txt`. The generic `span[style]`
selector counted internal KaTeX spans. Only this selector is repaired to
`span[style*="text-emphasis"]`; the required two theorem spans, six total
emphasis spans, actual under-dot CSS and no visible markup remain strict.
No affected display PASS is claimed until the corrected check runs.
