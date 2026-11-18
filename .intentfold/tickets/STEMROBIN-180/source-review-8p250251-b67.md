# FIRST independent SOURCE review: 8p 0250/0251 (b67)

Ticket C/STEMROBIN-180, same invocation; reviewer scope is only physical pages 0250/0251 under `.tmp/ld-s10y-lesson/b60-elastic`. **SOURCE: REPAIR REQUIRED (one whitespace finding). Final PNGs: PASS. SVG visual: NOT REVIEWED, both figures.** This is not scientific correction, modern-edition review, assembly acceptance or publication approval.

## Frozen Sole Repair

**[P2] Preserve the space between 5 and 米 when physical rows join.** Page 0250 exercise 7, `page.md:74`, and `page.json` pointer `/blocks/7/lines/1`, omit the trailing separator before the next row begins `米时`. The binding lesson skill requires preserving end-of-row spaces needed for direct concatenation; current direct joining produces `移动 5米时`. The source uses separated numeric/unit typography, also visible in the same exercise's `31 千克` and elsewhere on the page. Append exactly one U+0020; do not change prose, math, line breaks or neighboring content.

Frozen input paths and hashes:

- `.tmp/ld-s10y-lesson/b60-elastic/artifacts/8p/pages/0250/page.md`: `b29b8b68dfc00a87263419f36516a0e068fcd72624166cfecf085c0d4528e252`.
- `.tmp/ld-s10y-lesson/b60-elastic/artifacts/8p/pages/0250/page.json`: `2d6d5984252366237287c65f33380a41352d70e2bd49694fbd7bfc96a3ad0e88`.

Exact whole-row strings below use JSON escapes so the final ASCII space is explicit and cannot be mistaken for formatting:

```json
{
  "mdLine": 74,
  "jsonPointer": "/blocks/7/lines/1",
  "before": "与水平线夹角为 $60^\\circ$. 如果物体是以恒定速度运动，那么当物体移动 5",
  "after": "与水平线夹角为 $60^\\circ$. 如果物体是以恒定速度运动，那么当物体移动 5\u0020",
  "nextMdLineUnchanged": 75,
  "nextJsonPointerUnchanged": "/blocks/7/lines/2",
  "nextWholeRowUnchanged": "米时，该力做功多少？ 如果物体的质量是 31 千克，物体与平面的摩擦"
}
```

This is the complete repair list. No author artifact was edited, no finalize/vectorize was run, and no second source finding is authorized by this review. The frozen review binds the current MD/JSON; any intervening change must not be overwritten from this snapshot.

## Independent Basis

The FIRST image was whole source `work/8p/pages/0250/page.png`, original detail. Its complete independent 21-row/object inventory was persisted before opening 0251. Whole 0251 was then opened at original detail; its independent 22-row/object inventory and `expected.json` were persisted before ANY author artifacts/provenance/receipts. Author `source-inventory.md`, templates and `source-tail.png` were not read. Source-only crop adjudications are explicitly appended without erasing the initial observations.

0250: ex 2/3/4/5/6/7/8 body rows = 1/1/2/2/2/4/4; figure 180 plus separate caption; two-row section-65 h3; one-row open prose; italic-number footer 238. Total 21 physical text rows, 19 without caption/footer, 12 artifact blocks.

0251: four-row incoming prose; four-row figure-interrupted prose; figure 181 plus separate caption; four one-row displayed equations including same-row tag (1); all intermediate prose; two-row open final paragraph; italic-number footer 239. Total 22 physical text rows, 20 without caption/footer, 10 artifact blocks. Grouping multiple prose/equation rows in one block is not a missing-object defect.

Every literal MD/JSON body row and JSON/frontmatter metadata pair agrees. Source PDF hash `4ec6a3d5fafe2c5c861a5053cf8cf047a3a6bd7988a4de799859d6a4fef8cc46` was recomputed from the actual PDF and matches both pages. Scan hashes match metadata; actual `soviet-cn` profile hash matches both pages. Audits report 21/21 and 22/22 rows, no normalizations, unknown characters, KaTeX warnings, errors or errata. These mechanical facts do not waive the frozen whitespace defect.

Literal controls reviewed: all Chinese prose, 180/181 references, 200/50/31 and 5/6 quantities, 60/30-degree math, 牛顿/千克/米 units, uppercase X, scalar versus vector F/s/a, speed subscripts/squares, all four equations, punctuation external to math, and equation (1). Cyrillic sublabels are actual U+0430 `а)` / U+0431 `б)`, same printed positions. Ex 3 `运动.` / ex 5 `所示.` and 0251 `（图 181）.` are source periods, not missed commas. Preserve ex 8's source-visible `功 和` gap and existing trailing space after `6 米.`. All other joins were checked.

Emphasis/footer controls: h3 supplies the larger/heavier two-row heading; no extra inline bold is required there. On 0251 the distinctly bold second `物体速度` is retained exactly; `的平方` is not bold. Initial broader weight suspicions were resolved as uneven source ink, not an instruction to add emphasis. Footers `· *238* ·` / `· *239* ·` preserve side dots and italic numerals. Nothing was scientifically corrected; no confirmed source erratum was established.

## Figures And Receipts

Each whole FINAL PNG was actually opened at original detail and compared with its independent source inventory:

| Figure | Source comparison | Final PNG | Bound final SVG | Visual SVG |
|---|---|---|---|---|
| 180 | seven vector force arrows F1–F7; down/down-left/left/up-left/up/steep-up-right/shallow-up-right; separate rightward vector v; body/hub/table/left support; caption excluded | 783×545, SHA `9966a12342fe7d3ce5a0c2c8cf06ecbe80598d2036a00be75422db5147f07eae` | 783×545, SHA `1cf91fe2a414cffc94b67327939fa446585a12054be7aa8afff8af8365be4db5` | NOT REVIEWED |
| 181 | two block positions, two rightward vector F arrows, outlined rightward vector v1/v2 arrows, X axis, capital S displacement bracket, table/right support; caption excluded | 758×255, SHA `a359e42e0869f9c94c186bac4aec5e4051a9ff855a761d105307d71b023b9269` | 758×255, SHA `8a43aec39b949a60522b30a3e962af7c585c1de4f744425019a2d1fb025c8ac7` | NOT REVIEWED |

Actual crop boxes are `[431,635,759,521]` / `[576,882,734,231]`. Read-only pixel comparison establishes that each PNG interior is exactly the source box, framed with 12px white padding. Comparing with the surrounding source rectangle initially differed because padding is white rather than surrounding scan pixels; the correct boxed-interior/white-padding check is exact for both. Whole-PNG observation confirms intact labels/geometry and no answer additions. Figure 180 belongs to ex 5; figure 181 belongs to section-65 prose. Both numbered figures legitimately have null `owner_exercise`; the explicit source reference supplies ownership.

The actual `.call.json`, `.stdout`, `.stderr` triples were read for all six exact names below in `.intentfold/tickets/STEMROBIN-180/tmp/commands`. Each call has correct cwd, book/page, root/work, approved absolute Python interpreter with `-B`, exit 0, null signal, empty stderr. All recorded stdout/stderr byte lengths and SHA256 values were independently verified. All 18 files are included individually in flat `bindings.json`.

| Exact receipt stem | Saved result |
|---|---|
| `b66-source250-prepare-first` | 1695×2584 at 300dpi; raw 24 line bands |
| `b66-source251-prepare-first` | 1695×2580 at 300dpi; raw 22 line bands |
| `b66-author250251-finalize250-first` | 12 blocks / 21 rows, 1 figure, 0 normalizations, pass |
| `b66-author250251-finalize251-first` | 10 blocks / 22 rows, 1 figure, 0 normalizations, pass |
| `b66-author250251-vectorize250-first` | fig-180 mismatch 0.284%, 1 pass / 0 over-limit |
| `b66-author250251-vectorize251-first` | fig-181 mismatch 0.006%, 1 pass / 0 over-limit |

0250's raw 24 bands include three bands inside figure 180; independent text inventory and finalized masked-text count are 21, not three omitted prose rows. SVG headers have matching PNG dimensions, `currentColor` fill and even-odd path fill. **These are saved numeric/vector facts only: no SVG rendering or screenshot was opened, so neither SVG is visually approved.** The saved calls hash streams, not PNG/SVG bytes at execution time. Bindings freeze current outputs alongside exact receipts; they do not fabricate historical output hashes.

## Flags And Controls

- Incoming 0249 and outgoing 0252: **UNKNOWN**, no neighboring image opened or content guessed. Ex 2 begins complete; no empty continuation invented.
- Local 0250→0251 join: VERIFIED `几个力` + `的合力.`. 0250 last prose open/non-cont; 0251 first prose cont/non-open. Figure-181 interrupted paragraph open/cont is correct; final `关系式，` remains open/non-cont. Exercises closed; all samerow false; same-row equation tag retained.
- Source errors/errata: no confirmed scientific or printing error established; no correction performed. Empty author audit flags are recorded, not visual proof.
- All shell/subprocess commands, including reads and in-memory crop production, used `node .intentfold/tickets/STEMROBIN-180/tmp/record-step.mjs` with unique lowercase `b67-review250251-...` labels. Python only `/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B`.
- Read binding readme, product/engineering/operations charter, IntentFold skill, lesson skill and image skill/profile. No setup/freshness replay, prepare/finalize/vectorize rerun or retry, Git, DB, publication, deployment, source/code edits, repairs, checkpoint/usage/seal workflow, or reversal of others' changes.
- Only the four requested review outputs were manually written. Required command recording created its ordinary receipts; source crops stayed in memory, with full base64 in those receipts. No new PNG/SVG/screenshot file was written.
- Image budget: **8 charged, 7 readable**. Sequence: whole 0250; whole 0251; whole final PNG 180; whole final PNG 181; failed/truncated 0250 crop attempt; complete reopen of that crop; 0251 upper source crop; 0251 lower source crop. All crops/reopens counted; no additional image may be loaded in this invocation.

Detailed row inventory, corrections and image rectangles: `tmp/b67-source250251-review/inventory.md`. Independent expectations, frozen whole-row repair and machine-readable controls: `tmp/b67-source250251-review/expected.json`. Current hash bindings: `tmp/b67-source250251-review/bindings.json`, flat `[{path,sha256}]`; this report is intentionally excluded.
