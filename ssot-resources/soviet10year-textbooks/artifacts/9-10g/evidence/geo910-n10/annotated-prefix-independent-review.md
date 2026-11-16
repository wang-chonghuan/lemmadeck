# Annotated exercise prefix: independent focused review

Date: 2026-11-16.
Role: non-author verifier of the parent's narrow offline-renderer correction.
This is not an answer review, figure review, full-page render, or screenshot
acceptance.

## Single Finding

No actionable defect found in the requested scope. The two-regex change
supports `\bullet` and the Chinese full stop in both whole-math and split-math
task prefixes. Existing circ/star markers and ASCII/fullwidth periods remain
supported. Strict source-number comparison still prevents a mismatched
prefix from being moved or removed.

One focused execution passed: **62 cases, 38 positive, 24 negative, zero
failures, exit 0**. Expectations were defined from the user's contract before
executing the production branch; they were not obtained from its output.
No old tests were read to derive requirements.

## Minimal Diff Read

Actual read-only command:

```sh
git diff -- .claude/skills/ld-s10y-lesson/tools/render_lesson.js
```

The file's complete current working-tree diff contains one hunk and exactly
two removed/two added regex lines:

```diff
@@ -245,8 +245,8 @@ for (const lid of lessonDirs) {
     const hasPrintedPrefix = prefix && prefix[1] === String(printedNumber);
     const marker = hasPrintedPrefix && prefix[2] !== "." ? esc(prefix[2]) : "";
     const annotatedPrefix = printedNumber == null ? null
-      : (e.text.match(/^\s*\$(\d+)\^\{(\\circ|\*)\}\$(\*)?[.．]\s*/)
-        || e.text.match(/^\s*(\d+)\$\^\{(\\circ|\*)\}\$(\*)?[.．]\s*/));
+      : (e.text.match(/^\s*\$(\d+)\^\{(\\circ|\\bullet|\*)\}\$(\*)?[.．。]\s*/)
+        || e.text.match(/^\s*(\d+)\$\^\{(\\circ|\\bullet|\*)\}\$(\*)?[.．。]\s*/));
     const hasAnnotatedPrefix = annotatedPrefix && annotatedPrefix[1] === String(printedNumber);
     const numberLabel = hasAnnotatedPrefix
       ? inline(`$${annotatedPrefix[1]}^{${annotatedPrefix[2]}}$${annotatedPrefix[3] || ""}.`)
```

No change to strict comparison, captures, number-label construction, or
body-prefix slicing appears in that diff. The existing output punctuation in
the number label remains the ASCII period; accepting a Chinese source period
does not alter that output convention.

Production evidence:
[render_lesson.js](/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/tools/render_lesson.js:243).
SHA-256 before execution, at execution, and afterward:

```text
7c25b8e500b0027a213769f44fbf85911cb1a01b6050b184065c4fdd9e53d57a
```

## Independently Expected Cases

The scratch script was authored first, then executed once:
[annotated-prefix-independent-check.cjs](/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/annotated-prefix-independent-check.cjs).

The 36-case positive matrix is whole/split form x bullet/circ/star x
ASCII/fullwidth/Chinese full stop x absent/present existing outer star.
It also checks leading whitespace, exact captured task number, marker,
optional outer star, the number-label source, and removal of only the matched
prefix/adjacent whitespace from the body. Two additional positives cover the
actual task number 79 with a bullet and Chinese full stop in both forms.

Representative expectations, fixed before execution:

| Input, with printed number 77 unless stated otherwise | Independent expectation |
| --- | --- |
| `$77^{\bullet}$。 Body $x+1$.` | Accepted; label source `$77^{\bullet}$.`; body `Body $x+1$.` |
| `77$^{\bullet}$。 Body $x+1$.` | Same accepted label/body |
| `$79^{\bullet}$。 Body $x+1$.`, printed number 79 | Accepted with number 79, not 77 |
| `$77^{\circ}$． Body $x+1$.` | Existing circ/fullwidth-period support retained |
| `77$^{*}$*. Body $x+1$.` | Existing inner and outer stars retained separately |
| `$79^{\bullet}$。 Body $x+1$.`, printed number 77 | Annotated candidate not accepted; original body unchanged |
| `79$^{\bullet}$。 Body $x+1$.`, printed number 77 | Same strict wrong-number rejection |
| `$177^{\bullet}$。` or `$077^{\bullet}$。`, printed number 77 | No substring or numeric-coercion acceptance |
| Annotated prefix with no printed source number | Not accepted; no fabricated number label |
| `77. Body $x+1$.` | Not annotated; existing ordinary-prefix handling yields `77.` plus the body |
| `$x+1$ + $77^{\bullet}$。 Body $x+1$.` | Leading formula is not consumed; entire body preserved |
| `$77+1$ + $77^{\bullet}$。 Body $x+1$.` | Numeric leading formula is not a task prefix |
| `$77x^{\bullet}$。 Body $x+1$.` | Formula text is not an annotated task number |
| Unsupported marker, missing period, comma, unbraced exponent or literal bullet character | Not accepted; body preserved |
| `77* Body $x+1$.` | Not annotated; old ordinary-star behavior remains `77.*` plus the body |

The 24 explicit negatives include both forms of wrong numbers, substring/
leading-zero numbers and missing source number; ordinary numeric prefixes;
leading/numeric formulas; a noninitial prefix; unsupported markers; missing
or wrong punctuation; malformed/non-task math; and the ordinary-star
compatibility case. Their expected booleans, captures, labels and remaining
body text are fixture data, never sampled from production output.

## Actual Focused Check

Actual command, from `/Users/yong/.codex/worktrees/a07e/lemmadeck`:

```sh
node .intentfold/tickets/STEMROBIN-184/tmp/annotated-prefix-independent-check.cjs
```

The script reads the current production file, uniquely locates the block
from `const sourceNumber` through the body-text selection immediately before
the exercise HTML append, and executes that exact block with
`vm.compileFunction`. The regexes and strict comparison are not reimplemented
inside the test.

The caller supplies each fixture's printed source number. Identity `inline`
exposes the constructed label's TeX source rather than invoking KaTeX;
identity escaping is equivalent for the tested numeric/marker strings.
The tested production segment includes ordinary-prefix compatibility,
annotated recognition, captures, strict identity checking, number-label
construction, and body slicing. It does not exercise source-number lookup,
KaTeX HTML, `.no` CSS geometry, or full-page output.

Actual result:

```json
{
  "scope": "production prefix branch only; no browser, suite, or answer review",
  "production": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/tools/render_lesson.js",
  "productionSha256": "7c25b8e500b0027a213769f44fbf85911cb1a01b6050b184065c4fdd9e53d57a",
  "firstProductionLine": 243,
  "cases": 62,
  "positive": 38,
  "negative": 24,
  "status": "pass",
  "failures": []
}
```

Scratch script SHA-256:

```text
c54c83af128cc9c94caa1f8d54243ce5612d8ed9fd79fe15ef4cef33f537c2eb
```

## Boundary And Stop

Only the scratch test script and this report were authored. Production code,
source, modern text, answers and figures were not edited. No browser, network,
prepare/finalize/publish, full-project suite, or Git mutation was performed;
Git use was limited to the requested read-only file diff.

The prefix branch meets the supplied narrow contract at the recorded source
hash. The parent's n10 screenshot observation was the supplied trigger, not
independently reopened evidence. No new screenshot or whole-render PASS is
claimed. This single independent focused check is complete; stop here.
