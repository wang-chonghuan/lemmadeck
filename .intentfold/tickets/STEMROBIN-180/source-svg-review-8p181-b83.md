# FIRST source SVG visual fidelity: 8p fig-181 (B83)

**Verdict: PASS.** Complete existing source SVG versus the approved original
PNG only. No visually material missing/extra contour or mark, incorrect label,
filled-in hollow arrow, clipping, or aspect distortion was found. This is not
pixel identity, scientific validation, whole-page/course review, or approval
of any modern-edition figure or model.

Date: 2026-11-18. Ticket/session: STEMROBIN-180 / 180-3.
Exact checkout: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Branch: `codex/STEMROBIN-180-textbooks`, verified by reading checkout HEAD
without a Git command. Other workers' files were left alone.

## Existing approvals retained

B67 SOURCE/PNG approvals are retained, not re-reviewed. B67's FIRST report
explicitly records fig-181 SVG visual status as **NOT REVIEWED**; its saved
0.006% vector mismatch is historical numeric evidence, not visual approval.
The later affected-0251 report likewise retains **NOT REVIEWED**. This bounded
run supplies the first actual SVG visual review for the exact bytes below;
it does not claim to search or approve any broader production history.

Metadata read as needed, without opening its source-page images:

| Existing durable metadata | SHA-256 |
| --- | --- |
| `.intentfold/tickets/STEMROBIN-180/source-review-8p250251-b67.md` | `75eb821bd391f7b3475b6cc0c4856a044c6c26ae17d8dfad24fd137c227573c5` |
| `.intentfold/tickets/STEMROBIN-180/source-review-8p251-affected-b67.md` | `62ce65eb3bbdef6f5e24edf2d9ae76d6ce0f967b0ff73fc6d23a8f99772dc855` |

## Exact inputs and native evidence

Original PNG:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/8p/figures/fig-181.png`

Existing SVG:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/8p/figures/fig-181.svg`

| File | Bytes | SHA-256 | Dimensions |
| --- | --- | --- | --- |
| Original PNG | 6041 | `a359e42e0869f9c94c186bac4aec5e4051a9ff855a761d105307d71b023b9269` | 758 x 255 |
| Existing SVG | 36261 | `8a43aec39b949a60522b30a3e962af7c585c1de4f744425019a2d1fb025c8ac7` | width 758, height 255; viewBox `0 0 758 255` |
| Owned `native.png` | 20545 | `8bcdfc40436b36c41e2674c5ceba8f998ac0c0f53cbca1282ff4971d6c53af68` | 758 x 255 |

Both source hashes were checked before and after rendering and are unchanged.
The helper is unchanged: `.claude/skills/ld-s10y-lesson/tools/svg_raster.js`,
1016 bytes, SHA-256
`bc37462e28d5b44e574505c03ed062441185a7ba747a0f9af1702d4d67656db8`.

The sole producer command ran with explicit workdir equal to the exact
checkout above, with stdout/stderr redirected directly into the owned parent:

```text
node .claude/skills/ld-s10y-lesson/tools/svg_raster.js ssot-resources/soviet10year-textbooks/artifacts/8p/figures/fig-181.svg .intentfold/tickets/STEMROBIN-180/tmp/b83-n65-svg181-review/native.png
```

No width argument, resizing, alternate renderer, dependency installation,
helper patch, or second producer invocation. Existing resvg was used.
**Helper result: exit 0; stdout `{"ok":true,"w":758,"h":255}` plus newline;
stderr empty.** The native output exists and was actually viewed.

Owned evidence parent:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b83-n65-svg181-review/`.
It was created through `apply_patch` by freezing `source-inventory.md` before
the helper ran.

| Preserved evidence | SHA-256 |
| --- | --- |
| `source-inventory.md` | `94a8a70e66dc479c16f9aae49ef490284b4d0799a8299ab1d21874e698d8d09e` |
| `render.stdout` (28 bytes) | `7f3ba37895c6d315ec4a779f1fa9fa84fa069c26263f4e67d0636f89f8066635` |
| `render.stderr` (0 bytes) | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |

`render.call.json` preserves the exact invocation, exit, stream bindings,
native dimensions, before/after source/helper hashes, and actual image ledger.

## Complete visual coverage

The entire approved PNG was opened first at original detail. All source
objects, geometry, labels, relations, contour marks, and ambiguities were
frozen in the inventory before rendering the SVG. The entire native render
was then opened once at original detail and compared against that inventory.

| Frozen inventory | Whole-contour comparison | Result |
| --- | --- | --- |
| 1-2: two bodies and asymmetric interior marking | Both rectangular positions, relative height/size and baseline contacts remain. The left perimeter's irregular dark clusters and white holes remain; the right interior remains white. Neither body is dropped, duplicated, uniformly filled, or repositioned. | PASS |
| 3: filled force arrows and both vector F labels | Two rightward black shafts/heads meet the respective left edges. Both capital F labels and their separate overhead rightward vector marks remain associated and intact. | PASS |
| 4-5: hollow velocity arrows, vector v1/v2 | Both outlined shafts and triangular heads retain their white interiors and rightward direction. Both italic v labels, overhead vector marks, and respective subscripts 1 and 2 are present in the correct positions. | PASS |
| 6: tabletop/axis and capital X | The long common line, slight source unevenness, rightward axis head and separate capital X remain. No added origin, ticks, coordinate axis, or relabelling. | PASS |
| 7: S displacement bracket | Both downward endpoint/projection strokes, horizontal arms and central capital S gap remain at their source positions. No new distance value, subdivisions, or bracket arrowheads. | PASS |
| 8: table body, lip, stacked rules and gaps | Full left-to-right span and stepped right lip remain. Upper interruptions around S, lower continuing lines, thick/thin rules, and intervening white channels are retained without turning the table into a solid slab. | PASS |
| 9: right support | Complete descending grouped support remains below the right body/table, with thick/thin parallel contours, white interior channels, and uneven lower ends. No leg or ground added; no bottom clipped. | PASS |
| 10: relationships | Both force/body/velocity groupings remain distinct in left-to-right order. Common axis direction, S endpoint association, and support/table joins match the source. | PASS |
| 11: outlines, irregular marks and holes | Left-body ink clusters, ragged-arrow character, scan-shaped outlines, differing line weights and white holes remain recognizable. Tracing rounds/smooths pixel-scale edges and introduces antialiasing; no visually material semantic mark loss or extra contour was found. No exact-pixel claim or new mismatch percentage is made. | PASS |
| 12: full canvas, exclusions and aspect | Complete wide figure and white perimeter remain at 758:255. X, both vector-label groups, velocity heads, table lip and support ends are inside the canvas. No caption, number, prose, answer annotation, legend, extra body, or other apparatus appears. | PASS |
| Retained ambiguities | Source-merged body/table/bracket/support joins and uncertain intent of tiny left-body ink marks are preserved visually, not resolved by invented apparatus geometry, cleanup, or lesson/scientific interpretation. | PASS |

Coverage is complete for all 12 frozen inventory items plus their explicit
ambiguities, not a selected-label or partial-contour check. The PASS applies
only at the exact source SVG/PNG hashes above.

## Actual image ledger and boundary

**Actual images opened: 2/2, both readable. Reopens: 0. Crops: 0.**

1. Complete original `fig-181.png`, `functions.view_image`, detail `original`,
   758 x 255; inventory frozen immediately afterward.
2. Complete owned `native.png`, `functions.view_image`, detail `original`,
   758 x 255; whole-contour comparison recorded above.

No image payload is returned or reopened in this report. No transport failure,
failed producer, alternate render, or technical retry occurred. There are no
unknown partial outputs to reinterpret as a pause or content verdict.

Only the authorized owned evidence parent and this durable report were
written. Manual evidence/report edits used `apply_patch`; the unchanged
helper wrote its one native PNG and shell redirection preserved its actual
streams. No source figure was edited or reauthored. No vectorization,
prepare/finalize, modern work, model call, descendant, chat coordination,
Git command/change, DB action, publish, deployment, product test, or
whole-page/course review was performed.
