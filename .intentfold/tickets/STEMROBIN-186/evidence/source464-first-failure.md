# FIRST Comparison: Stopped At Confirmed SOURCE Discrepancy

Verdict: FAIL_STOPPED. This is a single independent original-to-candidate comparison attempt, not a second authoring/finalization pass.

## Frozen Inputs

- expectations.FIRST.md SHA-256: 4997093d6fc7b13f5c72670b7860fe9b8cb50fd9f686c07e8f64edc73c4bfce2
- Original page.png SHA-256: ac8b699e583533b5b74fc12590ba814295780de190f0e5f9596f1911ba273e07
- Candidate page.md: 3788 bytes; SHA-256 f43573caaf10081b443eb076114c1a9e0958fbdfdae84d801aeda2f7fdec3181
- Candidate page.json: 6729 bytes; SHA-256 74824a3421fb3ec1090ce73f40adf32a2b291e453c8ec0ac60d1d03af3bdc99a
- Candidate audit.json: 178 bytes; SHA-256 04af1bb1e940d06f9133b9125419ff9b9bef8d0b1fc2dbf374505d1d2f3ac0f5

The freeze-hashes recorder command completed before the read-candidates command. The latter exposed all three candidate files in one successful read, with their byte lengths and hashes. No prepared layout/template/grid or author report/bindings content was used.

## First Confirmed Failure

Source body row 22; exercise 155, first printed line.

Frozen original:

```text
155. 第 151 题里所说房间中的空气是靠了砖砌的火炕升温的. 若
```

Candidate page.md, exercise 155 first body line, and page.json at blocks[9].lines[0]:

```text
155. 第 $151$ 题里所说房间中的空气是靠了砖砌的火炉升温的。若
```

Confirmed substantive lexical substitution: original 火炕 -> candidate 火炉.
This is not mathematical markup, whitespace, punctuation normalization, uncertain ink, an unknown neighbor identity, or a confirmed source-print erratum.
Both candidate representations carry the substitution. Their mutual consistency and any successful finalize do not prove fidelity to the original.

The assignment stopped immediately at this first confirmed SOURCE discrepancy.
No repair, retry, re-extraction, further source comparison, neighbor read, or author-content read followed.

## Comparison Coverage Before Stop

| Source Rows | Scope Actually Compared | Result Bounded To Those Rows |
| --- | --- | --- |
| 1-3 | incoming fragment text, physical breaks, sentence/question punctuation | no confirmed lexical discrepancy; cont=true and label=null preserve locally visible continuation without assigning a preceding number; declared ex type/owner identity remain UNKNOWN |
| 4-5 | 147; buckets, uncovered/glass-covered distinction, question | no confirmed discrepancy |
| 6-7 | 148; water, 1 kg, 2/10/100 degree-C increments, enumeration punctuation | no confirmed discrepancy; raised degree encoded as LaTeX, no inferred boiling value |
| 8-9 | 149; 3/4/10 kg, 1 degree-C increment, physical 所/需 split | no confirmed discrepancy |
| 10-11 | 150; 30 kg steel, 20 to 1120 degree-C, punctuation | no confirmed discrepancy; 1120 preserved |
| 12-14 | 151; no heat loss, 10 to 20 degree-C, 4 x 5 x 3 meters, 0.24 unit string, 提/高 and 比/热 splits | no confirmed discrepancy; unit slash/product-dot roles preserved; no density/parentheses/power invented |
| 15-18 | 152; 12 g ceramic, 1000 degree-C increment, two questions, 590 unit string, 高/速, 途/径, 焦/耳 splits | no confirmed discrepancy |
| 19-20 | 153; iron pot 1.5 kg, 2 liters water, 80 degree-C increment | no confirmed discrepancy |
| 21 | 154; 640 kilocalories, water from 20 degree-C to boiling | no confirmed discrepancy |
| 22 | 155 first row | confirmed 火炕/火炉 substitution; STOP |
| 23-31 | remainder of 155, 156, 157, 158, footer | NOT REVIEWED after stop, even though candidate bytes were already exposed |

Period glyph normalization from the source's solid dot to prose 。 does not change sentence role; decimal dots remain decimal dots, and unit-product dots remain mathematical product dots.
Unknown semantic emphasis is not treated as a discrepancy.
Closed/open flags were considered only for the locally compared incoming fragment and complete tasks 147-154; there is no page-wide flags PASS.

## Audit And Stage Limits

The loaded audit bytes state page 464, lines_printed=31, lines_md=31, empty figures, empty unknown_chars, empty katex_warnings, and empty errors.
Those are exposed candidate declarations, not a new audit/gate execution or a SOURCE PASS. The original-only freeze independently records 31 printed rows and no figures.
Full pageMD/JSON/audit fidelity, all source rows, all continuation/open flags, footer comparison, and whole-page lexical review were not completed because the mandatory first discrepancy stop took precedence.

Actual figures visible in the original: none. No SVG/vectorization/modern rendering stage was executed or credited.
Existing prepare/finalize receipts may be retained only as exact opaque bytes after this terminal stop. Neither command was repeated. No unexecuted stage is called PASS.

## Unreviewed Remainder

Body rows 23-30 and footer row 31 remain unreviewed against candidates.
The incoming preceding task/type/owner, all neighboring text and joins, and exercise 158's next-page continuation remain UNKNOWN or unreviewed.
Author terminal report and lexical bindings contents were not read; only opaque bytes may be hashed for identification.
PDF/profile identity was not independently verified against the supplied metadata.
No assembly, retention, promotion, course approval/closure, answers, choices, index, publication, display, backend, Git, network, tests, modern edition, checkpoint/usage, or parent accounting work was performed.
