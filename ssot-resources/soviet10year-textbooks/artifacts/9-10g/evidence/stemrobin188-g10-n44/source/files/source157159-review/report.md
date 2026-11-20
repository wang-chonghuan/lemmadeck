# Independent FIRST SOURCE review: physical 157-159

STEMROBIN-188 / same188-6. Independent reviewer only. Exact execution cwd:
`/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck`.
Only this review directory was written. No author/candidate/core edits.

## Findings

| Item | Disposition | Finding |
| --- | --- | --- |
| 0157 / printed 150 | PASS | Independently read all 18 rows; source prose, symbols, captions, problem 1, footer and g10 identity match the candidate. |
| 0158 / printed 151 | PASS | Independently read all 18 rows; problems/solutions 1-3, formula (1), figures, exercise heading and exercise-16 opening match. |
| 0159 / printed 152 | REVISE + HOLD | Readable rows independently total 23. Exercise-22 punctuation needs revision; damaged footer and unchanged 23/24 mechanical failure remain separate HOLDs. |
| fig-g10-06 | PASS | O/M, all three accented basis labels, every ray and arrowhead retained; no caption or neighboring prose baked into crop. |
| fig-g10-07 | PASS | O/A/B/C/M, x/y/z, i/j/k, directed rays and negative dashed continuations retained without clipping. |
| fig-g10-08 | PASS | O/A/B/M, basis accents, segment labels x/y/z, construction strokes and original interruptions retained. |
| fig-g10-09 | PASS | O/A/B, x/y/z, basis accents, OA/OB/AB arrow directions and dashed strokes retained. |
| 0159 lower-edge crop | PASS, count-only classification | Marginal fragmented residue, not an additional readable source line. Narrow exclusion proposed below, not applied. |
| 0159 damaged footer | HOLD | 152 is readable; damaged decorations and the tiny right-hand curved mark are not confidently identified. |

### Required punctuation revision, not mathematical correction

`0159/page.md:70-71`, JSON block `p0159#7` / `blocks[6]` (ex 22):

- Source row 15 ends `$C(-2,0,5)$，`; candidate ends `$C(-2,0,5)$、`.
- Source row 16 reads `是平行四边形的顶点. 并计算它的两条对角线`;
  candidate reads `是平行四边形的顶点，并计算它的两条对角线`.

Preserve the source comma after C and the source period/new sentence after
顶点. All four coordinate tuples, the star, exercise number and three
printed-row breaks are correct. This is transcription drift, NOT printer
errata. No candidate was repaired.

## FIRST order and counts

`FIRST.md` was persisted after exactly the three full original pages and
before any author report, candidate or count diagnosis was read.
Its SHA256 is
`7b3ea79bdd164b6a2aa215a455eba15fd8d345cf8091890b9d8a1e85fab7e3aa`.
It remains unchanged.

Independent readable rows are **18 / 18 / 23**, including the genuine folios;
paired captions count once per shared row and figure interiors do not count.
0158's initial OM equality spans two rows via one genuine `↵`. Fractions,
vector accents and the distance radical do not add rows.

The author's 18/18 receipts were inspected only AFTER this record and are
mechanical evidence, not the reason for either independent PASS.
FIRST's preliminary separator readings on 0158 row 09 and 0159 row 03 used
`、`; final comparison against the already-loaded pages identifies `，`
there, which the candidate correctly preserves. No image was reopened.

## Source boundaries, labels and mathematics

- Allowed prior-0156 md/json text alone establishes actual §44 title and its
  open final prose ending `一个`; 0157 `p cont` begins `向量 OM` and completes
  that sentence. No old image or old review was loaded or rerun.
- 0157 problem 1 ends with a period; 0158 starts a new solution paragraph.
  Problems 1/2/3 are prose examples, not numbered exercise blocks.
- 0158 `ex 16 open` preserves numeric subparts 1)/2) and the terminal semicolon.
  0159 `ex 16 cont` has 3) D, 4) E, 5) G, without inventing a second printed 16.
- Exercises 17-22, every coordinate sign/fraction/subscript, Oyz, Oy, PQ, OB,
  AA1/BB1, and the star only on 22 were compared. Mathematical content PASS.
  No answer key, answer computation or inferred vertex ordering was used.
- All three pages declare `numbering_scope: g10`. Raw printed captions remain
  图 6/7/8/9; IDs are fig-g10-06/07/08/09. Both paired second captions have
  `samerow`. References and original figure placements match.
- §45. 平面的方程 actually opens on 0159. Its two prose rows, P(x,y,z)=0,
  and last complete sentence about 数组(x,y,z) are preserved. No TOC was read
  to infer this boundary. Page 0160 was not read; further continuation is unknown.
- No confident mathematical printer erratum was found or registered.

These are bounded page/crop dispositions, not whole N44/N45 lesson approval,
assembly approval, promotion, or a rerun of physical 152-156.

## 0159 first FAIL and proposed narrow exclusion

First author receipt remains exit 1, md 23 versus detected 24.
Current audit still contains that error and no `count_exclusions`.
Band 24 is y=[2105,2121), 314 detector ink pixels; its reported x extent
[0,1255] includes edge ink and is NOT a proposed exclusion box.

Load 8 was the existing `evidence/0159/first/lower-source-crop.png`,
source LTRB [100,1860,1400,2126], unresized 1300x266.
The genuine last prose is above y=1933; genuine footer band ends at y=1995.
At the extreme lower-right edge, substantially below both, only small ragged
fragments remain, with no complete glyph sequence or additional readable
text baseline. For counting, this local patch is marginal scan residue,
not an omitted prose/formula/exercise row. Its causal origin is not asserted.

Conservative exact full-page XYWH proposal:

```json
{
  "kind": "scan-artifact",
  "box": [1188, 2100, 80, 26],
  "reason": "Isolated fragmented lower-right edge residue below the genuine printed 152 footer, within a non-content margin; independently inspected full page and limited crop show no additional readable text row."
}
```

This padded box ends at the source bottom edge and contains only the inspected
lower-right cluster and surrounding blank margin. It excludes NO body text,
formula, star, heading, question number or genuine footer. It is a proposed
count-copy exclusion only, not permission to alter source/crop bytes.
Other isolated edge/fleck ink is not broadly excluded. Whether this narrow
proposal alone clears the detector was NOT tested or claimed.

No exclusion was written, count tool changed, text padded, source finalize
rerun, or first receipt replaced. The mechanical gate remains HOLD.
The curved mark next to the genuine footer remains a separate source HOLD;
`[unknown]` is retained, and audit `unknown_chars: []` does not resolve it.

## Actual image ledger

All paths below are beneath
`.intentfold/tickets/STEMROBIN-188/tmp/source157159-author/`.
Absolute paths and SHA256 for every load are in `report.json`.

| Load | Actual image | Result |
| --- | --- | --- |
| 1 | work/9-10g/pages/0157/page.png | loaded once; FIRST |
| 2 | work/9-10g/pages/0158/page.png | loaded once; FIRST |
| 3 | work/9-10g/pages/0159/page.png | loaded once; FIRST |
| 4 | artifacts/9-10g/pages/0157/figures/fig-g10-06.png | loaded once; PASS |
| 5 | artifacts/9-10g/pages/0157/figures/fig-g10-07.png | loaded once; PASS |
| 6 | artifacts/9-10g/pages/0158/figures/fig-g10-08.png | loaded once; PASS |
| 7 | artifacts/9-10g/pages/0158/figures/fig-g10-09.png | loaded once; PASS |
| 8 | evidence/0159/first/lower-source-crop.png | loaded once; classification above |

Actual context 8/24; batch 8/8. Reopens 0; grids 0; failed image loads 0;
new review crops 0. Binary hashes and PNG header dimensions were read without
loading image payloads into context. No further images were loaded.

## Current byte binding

`evidence.json` contains 73 absolute-path byte/hash records and 112 checked
author-reference bindings. SHA256:
`d1fcb916568cccde168fcef00b1bb8002cb302935ce035ef956679c0596eeffa`.
It binds all current sources, md/json/audits, four crops, author reports,
three first receipts, stdout/stderr/input/snapshots, diagnosis and lower crop.
Current candidate bytes equal first snapshots; all author claims checked
against current bytes match. Metadata and retained source hashes agree.
No source/count/normalization/renderer tool was executed by this reviewer.

`report.json` embeds the complete current input hash inventory and actual
image ledger; `report-generation-receipt.json` binds both final reports.
All reviewer writes are confined to this directory. No Git, network, backend,
DB, env/install, paid, publish/deploy/closure/setup/freshness/Grill operation,
or contact with another reviewer/author was performed.
