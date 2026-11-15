# Source Unit 107-108 Repair

2026-11-15, Session C, STEMROBIN-180. Additional narrow human authorization
after the counter diagnosis. Source-author work, not independent approval.

## Status

| Affected Item | Status |
| --- | --- |
| 107 N107-1 boundary note | Repaired; finalize exit 0, 15/15; affected review pending |
| 108 F108-1 complete calculation objects / false samerow | BLOCKED; one minimal candidate retained in scratch, not promoted |
| 106/108 printed-row counter | Reported separately in `source-counter-106-108-repair.md` |

The original `source-review-106-110.md` was read only after the independent
counter diagnosis and actual source-image/component investigation. It remains
unaltered, including both original REVISE findings.

## 107 Notes Only

Changed only the ambiguous note tail to explicitly say that the experiment
crosses fig-85, 107 ends with the original two characters, and 108 starts
with the original fig-85 reference. The Cyrillic source label is preserved.
No body, block kind, open/cont flag, figure box, caption or number changed.

`verify_repair.py finalize 107` invokes existing
`p2c.py finalize --book 6p --page 107`: exit 0, 15/15, normalization 0.
Full JSON block arrays are byte-equivalent as serialized data; all metadata
except `notes` is identical. Audit and both PNG/SVG files are unchanged.

| Current File | SHA-256 |
| --- | --- |
| page.md | `261defa7431c536f27dabfde5a5e4d5ea5082260c98989a584ccbdc09702e237` |
| page.json | `a0267ccc9d7c407213ee783f25725d974e5c272386df3a6daeaa76fc3ca3b95f` |
| audit.json, unchanged | `3df3dc58b31221c32faa8c2c8407365d4cbd3023e780e53b8e6388ece034cb00` |

Precise boxes remain `[224,224,1085,455]` and `[307,1551,873,299]`.
Before/after source and figure hashes are in
`.tmp/ld-s10y-lesson/6p/pages/0106/counter-repair/after/hashes.json`.

## 108 First Failure and Candidate

F108-1 concerns object continuity and geometric sharing, not missing numbers.
The two right-column calculations each have two genuine original lines;
the higher pressure fraction is not wholly aligned with the middle `F=P`
line. The original two vertical dividers and left-column local rule remain
only source pixels, not an invented rectangular table or figure.

Pre-repair evidence was copied without overwrite to:
`.tmp/ld-s10y-lesson/6p/pages/0108/source-unit-repair/before/`.
It includes original MD/JSON/audit/layout, the existing block-count mechanism,
and an unchanged copy of Sagan's FIRSTFAIL report. The original aggregate
counter diagnostic also remains in the earlier counter snapshot.

One scratch candidate groups each right-column calculation into a single
two-line `p` object. The mass entry shares the actual second line of the
first calculation. The final middle weight relation shares the final result
line. The false whole-pressure-fraction `samerow` is removed.

The candidate preserves every original source line exactly once, all digits,
units, P/F/p case, punctuation and actual line breaks; its upper 20 rows are
unchanged. It does not use `open/cont` across intervening unrelated paragraphs:
the existing merge mechanism associates `cont` with the preceding
nontransparent block, so that would join to the wrong object.

Actual scratch check:

```text
verify_repair.py source-candidate
source-line multiset unchanged: true
upper blocks unchanged: true
complete right calculations: two objects, two original lines each
blocks.printed_lines(candidate): 27
current source pixel counter: 26
promoted: false
```

`blocks.py:116` subtracts only the first shared line of a non-caption block.
It has no explicit binding for an irregular formula spanning two existing
horizontal bands while continuing later in the same source column.
Reintroducing `samerow` solely to reduce this candidate to 26 would again
claim an unsupported whole-formula alignment. Adding/deleting text or a
fake equal-row table is also forbidden.

This proves that this minimal candidate does not pass the existing row
contract; it is not a claim that every possible supported encoding has been
exhausted or that 27 is the independently approved source-row count.
No counter threshold or target number was changed to fit the candidate.
No additional block/schema/assemble tool change was made.

Candidate:
`.tmp/ld-s10y-lesson/6p/pages/0108/source-unit-repair/candidate.page.md`.
SHA-256:
`fbabd4ad151ee5424e20476e9a9d4455d37c93f7b7a8e0b2a867b65e3dbbb6c4`.
Full check and calculation lines are in adjacent `candidate-check.json`.

108 durable MD/JSON/audit and source PNG remain unchanged:

| File | SHA-256 |
| --- | --- |
| page.md | `5a9f3a6fa19d824521f40a325dfda9e25786cd735a1acc3f9a4b138618b2fc02` |
| page.json | `187f01a6de51300db77266bdc0d354acd77bcf14ac8cde8a1dfaadd731b3e130` |
| audit.json | `80467751a244f553fac572e3ec147ad6049abef254c67caf18fa6218944ce3f1` |
| source PNG | `c95e2e48c92f52c3895dba2393e1f76d0e106800f6c22447f9147a99cf24752e` |

The authorized 108 re-finalize ran on the unchanged durable source and returned
26/26. It is only a counter replay; **F108-1 remains REVISE**. The candidate
was not finalized or presented as passing.

## Handoff Boundary

Main needs to select a defensible existing representation or explicitly
authorize an affected row-binding mechanism before this candidate can replace
the original. Do not infer source approval from 26/26.

An affected-only Sagan review should cover repaired 106 counter evidence and
107's note-only delta, and leave 108 structural rejection open until a valid
representation passes. The current tool interface does not expose Sagan's
agent ID or a subagent messaging entrypoint; thread inventory/discovery did
not identify an addressable Sagan task. No new reviewer was created and no
review completion is claimed. Main must dispatch that independent review.

No new source page, source-review edit, assemble, book/lesson/app/dependency/
DB/publication/Git action occurred. No browser or user desktop input was used.
No in-flight exec session remains. Work stopped with 108 candidate and all
first-failure evidence intact.
