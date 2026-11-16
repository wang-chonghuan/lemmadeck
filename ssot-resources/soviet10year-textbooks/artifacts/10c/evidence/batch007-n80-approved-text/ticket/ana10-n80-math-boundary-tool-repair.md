# n80 math-signature sentence-boundary tool repair

## Scope and frozen outcome

Existing STEMROBIN-184 authorization; tool-repair author only. Root: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

The reproduced ASCII sentence-punctuation boundary defect is repaired. The one focused test run passed all 9 test methods (exit 0). The subsequent affected-only, read-only signature comparison resolved all 17 targets (exit 0; `remaining_targets=[]`). These are tool results, not independent approval of n80 mathematics, wording, errata, or complete lesson readiness.

Only these implementation/test files were edited:

- `.claude/skills/ld-s10y-lesson/tools/edition.py`
- `.claude/skills/ld-s10y-lesson/tests/test_math_signature_sentence_boundary.py` (new)

No n80 template, faithful source, figure, answer, app, schema, dependency, or other helper was edited. No finalize, promotion, assembly, full-project test, browser, network, Git, DB, or other-chat operation was performed.

## Reproduction and diagnosis

The authorized immutable author handoff reported the original complete text check as **FAIL, exit 1**, with 17 formula-signature differences. That handoff is preserved byte-identically in the evidence directory as `initial-author-handoff.md`; the initial tool is preserved as `initial.edition.py`.

The initial affected-only diagnostic separately reproduced unequal signatures for all 17 selected targets. Its process exited 0 because it emitted diagnostic differences, not a gate verdict. That exit must not be confused with the author's original failing gate.

The text contract places ordinary sentence punctuation outside mathematical delimiters while retaining mathematical punctuation inside formulas. The old signature normalized Chinese boundary punctuation but retained terminal ASCII `,` and `.` as formula content. Consequently moving a sentence mark out of `$...$` or `$$...$$`, including before a retained equation label or at the final system row, falsely appeared to change mathematics.

Diagnosis used the current implementation, text contract, authorized author report, and formula projections from the faithful source/current templates. Old tests were not read to derive requirements. The whole lesson was not semantically reauthored or independently re-reviewed.

## Narrow implementation

`math_signature` now calls `normalize_math_sentence_boundary` on raw TeX before its existing text-literal canonicalization. The new helper removes at most one terminal ASCII comma or period at a closed formula boundary. It recognizes:

- End of the formula.
- A retained numeric equation label using `\qquad(...)` (including its supported text suffix) or `\tag{...}`.
- The final row before closing `aligned`/`cases` environments, optionally followed by the supported equation label.

The implementation checks group and environment closure. The book's interval delimiters, including `[a,b[` and `]a,b[`, are accounted for rather than rewritten.

It does not globally delete ASCII punctuation or extend the existing Chinese-punctuation splitter. Internal commas, coordinate/set syntax, interval/domain restrictions, numeric tags, escaped punctuation, ellipsis, unclosed groups, and matrix content are retained. A bare integer followed by a dot, such as `x=1.`, is conservatively retained because it can be a decimal literal. An additional sentence dot after a decimal, such as `x=0.8.`, and a dot after a single-token script, such as `\omega^2.`, are recognized without dropping the decimal point or exponent.

Raw `\text{...}` contents are not stripped by the new boundary helper. **Existing behavior caveat:** the pre-existing `normalize_text_literals` canonicalizes nonnumeric text words for localization and retains numeric content. That behavior was not changed. The new focused tests protect raw text-literal content at the boundary-helper level and numeric text differences end-to-end; this repair does not claim that the legacy signature distinguishes every nonnumeric word change inside `\text`.

No nonpunctuation mathematical equivalence relaxation was added. Changed signs, constants, exponents, variables, conditions, intervals, and equation-tag numbers remain distinct in the focused negative cases.

## One focused test run

Executed once, with bytecode disabled:

```sh
PYTHONDONTWRITEBYTECODE=1 .claude/skills/ld-s10y-lesson/.venv/bin/python -B \
  .claude/skills/ld-s10y-lesson/tests/test_math_signature_sentence_boundary.py -v
```

Result: **9 methods, all OK, exit 0**. Positive and negative subcases cover terminal marks, equation labels, final system rows, decimals, internal commas/coordinates/sets/conditions, intervals/domains, nonpunctuation mathematics, raw text contents, escapes, incomplete groups, ellipsis, and matrix entries. No old or full-project test suite was run.

Unittest output is preserved in `focused-tests.stderr.txt`; stdout and stderr are both retained. This run was not repeated.

## Final affected-only comparison

One read-only comparison used actual `normalize_numbered_subparts` and repaired `math_signature` against current faithful source and immutable modern templates. It did not invoke a full text, semantic, rendering, or publication gate.

All targets below now have equal signatures, no remaining differences, and `source_text_unchanged=true`:

```text
lesson.prose[2]
lesson.prose[7]
lesson.prose[8]
lesson.prose[9]
lesson.prose[13]
lesson.prose[14]
lesson.prose[15]
lesson.prose[16]
lesson.prose[19]
lesson.prose[20]
lesson.prose[21]
lesson.prose[22]
lesson.prose[24]
lesson.prose[25]
lesson.prose[29]
lesson.prose[30]
exercises[1] (source exercise 53)
```

Final totals: `affected_target_count=17`, `resolved_count=17`, `remaining_targets=[]`, exit 0. There is no remaining signature discrepancy among these selected targets. Unaffected targets and whole-lesson semantic readiness are outside this repair result.

## Byte bindings

All hashes are raw SHA-256. Paths are relative to the root above.

| File | SHA-256 |
| --- | --- |
| Initial `tools/edition.py` | `dce437725008392aff38c23af3704e68d1724a84325196a2b312bcf0e013e9a5` |
| Repaired `tools/edition.py` | `b0d9451146995abee3d275985b62ac20d638e2a921d89919019726e38dac4f41` |
| New `tests/test_math_signature_sentence_boundary.py` | `34a6b9d38cf544e970dca83f9d628692897a94120a892d742328d4de59998502` |

The short tool/test paths in the table are under `.claude/skills/ld-s10y-lesson/`.

Unchanged text/figure-template bindings:

| File | SHA-256 |
| --- | --- |
| `.tmp/ld-s10y-lesson/adapt/10c/modern-us-neutral/lessons/ana10-c6-s2-n80/lesson.template.json` | `4fe86dbb51c4668aa69e60a229941318ac26500ff5dddde4b81e2d4b146f6d39` |
| `.tmp/ld-s10y-lesson/adapt/10c/modern-us-neutral/lessons/ana10-c6-s2-n80/exercises.template.json` | `8a35b97edf24c8111f54c22ae5ec80b8a9d6dc516f19a2c84e86903e4b9db387` |
| `.tmp/ld-s10y-lesson/adapt/10c/modern-us-neutral/lessons/ana10-c6-s2-n80/figures.template.json` | `ab32579782c726f8b2f4dba09bc963ebde102dd6f1a25d92a87b8281a1d99d95` |
| `ssot-resources/soviet10year-textbooks/artifacts/10c/lessons/ana10-c6-s2-n80/lesson.json` | `efacd3b9f188d6c26f36b34fbed4109d1159eb6c06b026e478131cc1ab95556f` |
| `ssot-resources/soviet10year-textbooks/artifacts/10c/lessons/ana10-c6-s2-n80/exercises.json` | `c21cc8e0889df7494d49425eb40b94d7b6f3c97679e139bf0c9d19d63b434e66` |

## Preserved evidence and stop

Evidence directory:

```text
/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/ana10-n80-math-boundary-tool-repair/
```

It contains `initial.edition.py`, `repaired.edition.py`, the focused test copy, `initial-author-handoff.md`, initial/final signature stdout JSON and stderr, focused-test stdout/stderr, and `bindings.json`.

| Evidence | SHA-256 |
| --- | --- |
| `initial-author-handoff.md` | `53875ee0567aec80bf90028d3c1bec77a36403268caed0787f922e42a7f24374` |
| `initial-signatures.stdout.json` | `ffd7c0f5d71e82e0d0b9ea4b6c9a7f0da73a1458a55ce4529385802b1a583586` |
| `focused-tests.stderr.txt` | `70d9575d8eb5f817c58785e3abf4bc585e210c9a6acf1c253105f59a8633172d` |
| `final-signatures.stdout.json` | `d32e868fcc3c7c662717d5a458e80cd41cc0aa4afc2854ec2775913d710b98ed` |

Implementation, test, and evidence are frozen. This report closes the bounded tool-author handoff only; n80 independent content review and any subsequent official gate remain with the parent workflow. No further edits or checks were performed after the saved successful comparison.
