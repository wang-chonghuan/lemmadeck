# Interval/Fraction Counter Repair

STEMROBIN-184; author implementation and focused counter evidence; 2026-11-16.
Workspace: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
No independent content PASS, source approval, metadata approval, or finalize.

## Owned Changes

Only `.claude/skills/ld-s10y-lesson/tools/layout.py` and the new
`.claude/skills/ld-s10y-lesson/tests/test_interval_fraction_rows.py` were edited
outside this report and its ticket-local evidence directory.

The complete pre-existing tool was preserved before editing as
`source-10c-interval-row-tool-repair/layout.before.py`, SHA256
`f1cf22ba2bf945665bd607fbe2b74adc01006215a39fecf54a1f8d41a6b9e20c`.
This is the dirty-workspace starting point, including all prior repairs, not a
repository revision. The exact additional unified diff is `exact.patch` in that
directory; immutable final code/test copies and the individual diff command
stdout/stderr/exit records are retained there. No Git operation was used.

Three local changes implement the generic repair:

- `_single_fraction_row` retains its existing fraction-bar requirement and
  envelope test. A detached narrow delimiter stem is not normal glyph support:
  its central horizontal extent is checked rather than its wide terminal tip.
  When skew exceeds the envelope test, at least three full-height glyphs must
  have overlapping central vertical halves in horizontal order. This supports
  one slanted text baseline without accepting the tested separate two/three rows.
- The existing narrow-streak filter preserves bent strokes whose terminal/hook
  width exceeds the median stem width. Straight streak handling remains intact.
- Adjacent projected fragments can join across an actual shared connected
  component only when the existing single-fraction predicate, with the repaired
  glyph evidence, independently recognizes one fraction row.

No page number, source path, bounding box, expected-count override, manual row
hint, or source-specific threshold appears in the production patch. Existing
global constants, figure geometry, extraction pixels and exclusion guards are
unchanged. This is geometric recognition, not mathematical text recognition.

## Source Basis

The supplied source-count author report was read and its SHA256 verified:
`4df0a4d779be588b163175b36200584cf4bb5dc4131f62b9596124a0346ac804`.
Production code and source physical facts drove the implementation; existing
test assertions were first read after the first implementation was ready.

Only four ORIGINAL existing native strips were opened, each once at original
detail, in one batch:
`p43-final-prose-row.png`, `p46-three-fraction-prose-rows.png`,
`p46-final-prose-row.png`, `p46-single-a-minus-one-row.png`.
They show a single prose baseline beside the stacked fraction endpoints; the
interval brackets rise above and descend below that baseline. The three-row
strip really contains three separate interval/prose rows. No full source page,
whole screenshot, generated image, reopen, new crop, or other image was loaded.
Image context usage: 4/8 in the batch, 4/24 total. The supplied native-strip
manifest binds their original pixel slices and hashes; this report does not
repeat its content-identification review or upgrade any UNKNOWN.

## Actual Counts

`counts-before.stdout.txt` and `counts-after.stdout.txt` are JSON from the same
read-only observation script. It reuses the supplied diagnostic's snapped
figure masks and original content width, plus the exact existing margin-only
candidate for 46. It never prepares, finalizes, writes pages, or substitutes an
expected count. Expected 10 and 13 come from the supplied source author's
physical-row observations, not from the new test or the repaired output.

| Counting Input | Before | After | Source Expectation |
|---|---:|---:|---:|
| 43, existing figure mask only | 12 | 10 | 10 |
| 46, existing figure mask only | 28 | 21 | 13; still unresolved without margin candidate |
| 46, same mask + existing diagnostic margin candidate | 16 | 13 | 13 |

43's final row is now the single natural band `[2115,2223]`, replacing its
isolated bracket-top band and two formula halves. 46's candidate middle row is
`[1682,1787]`; its final row is `[2113,2219]`. The neighboring true rows remain
separate. The source count-copy hashes are identical before/after for all three
variants, and the observation asserts the caller's boolean masks are unchanged.
No new margin boxes or reasons were proposed. The existing candidate's three
boxes remain ONLY a diagnostic copy, pending independent metadata review.

The first candidate also yielded 10/13; its real outputs remain separately
preserved as `counts-first-candidate.*`. The final raw-46 result is 21, not that
intermediate candidate's 23. Neither result is represented as source acceptance.

## Focused Tests

New fixtures were authored from physical layout: five independent ordinary
anchor rows plus a deliberately constructed target with one, two or three
printed rows. They contain no textbook page coordinates, source counts, durable
resources, font dependency, or expected value copied from tool output.

The final eight tests exercise single skewed interval/fraction prose, a single
fraction without delimiters, a disconnected bracket stem, two genuine interval
rows, two and three brace-connected equations beside fractions, a radical above
its radicand with another genuine text row, and staggered independent rows.
Each count assertion runs at both 1x and 2x scale and checks input immutability.

| Preserved Run | Actual Result |
|---|---|
| `focused-test-first` | 8 tests, 3 failures, exit 1 |
| `focused-test-second` | 8 tests, 2 failures, exit 1 |
| `focused-test-third` | 8 tests, OK, exit 0 |
| `focused-test-final` | 8 tests, both scales, OK, exit 0 |
| `focused-test-before-tool` | Same final fixtures against preserved original: 8 tests, 6 failing scale subtests across 3 single-row cases, exit 1; multirow negatives pass |
| `related-tests` | 37 directly related existing tests, OK, exit 0; no skips |

The first radical fixture had its bar below the first text row, making that
shape fraction-like instead of a physical radical. Its drawing was corrected
to place the bar above the radicand and include the descending hook, retaining
the independently authored expectation of TWO text rows. No existing test was
changed or assertion weakened. Both failed attempts remain in the command
records, not overwritten or hidden.

Related verification is limited to `test_layout`, `test_inline_fraction_row`,
`test_fraction_line_spacing`, `test_underlined_rows`, `test_scan_border_rows`,
and the six synthetic compound-fraction tests. The compound test's unrelated
source-page corpus check was explicitly not selected. Every actual argv, cwd,
safe environment override, exit code, stdout and stderr is preserved.

## Limits And Handoff

No durable MD/JSON/audit, count exclusions, resource, figure, metadata, index,
framework, dependency, database, app, ticket state, other chat, or Git change.
No prepare/finalize, broad project check, repeated full diagnosis suite,
browser operation, or content acceptance. The compared 43/46 source bytes,
prepared layouts and initial FAIL audits remain unchanged.

The repair is verified only against the named synthetic cases and the two
source masks, not every font, skew, delimiter damage, radical layout or corpus.
The central-half support and bent-stroke protection are conservative geometric
heuristics; focused tests do not establish universal semantic correctness.
Raw 46 still overcounts with its scan noise, so applying the existing margin
candidate requires the parent's independent metadata decision. Initial audits
remain FAIL 10/12 and 13/28; this author did not replace them with 10/10 or 13/13.

Parent owns affected finalize after tool repair and independent metadata
review, and all source/content/figure approval. 43 T/tau-like and 46 final a/q
UNKNOWNs are unchanged. No independent-content PASS is claimed.
