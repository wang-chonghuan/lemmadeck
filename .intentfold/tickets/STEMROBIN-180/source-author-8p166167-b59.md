# STEMROBIN-180 / b59 / NEW SOURCE AUTHORONLY / 8p physical 0166–0167

## FIRST Results

Status: **PASS-SOURCE-MECHANICS-ONLY; STOP at author-only boundary.**

2026-11-17, same invocation, workspace `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
The four owned page directories and this report were absent before authoring.
Only new `artifacts/work/8p/pages/{0166,0167}`, this report, and ticket
`tmp/commands/b59-author166167-*` receipts/scratch were written.

| Physical / Printed | prepare FIRST | finalize FIRST | vectorize FIRST |
|---|---|---|---|
| 0166 / 154 | exit 0; 1695×2538, 300 dpi; unmasked preparation projection 25 lines | exit 0; 10 blocks, 17/17 lines, 2 figures, 0 normalizations | exit 0; 2 figures passed, 0 failed |
| 0167 / 155 | exit 0; 1695×2580, 300 dpi; unmasked preparation projection 25 lines | exit 0; 9 blocks, 25/25 lines, 1 figure, 0 normalizations | exit 0; 1 figure passed, 0 failed |

Both FIRST audits have empty `errors`, `unknown_chars`, `katex_warnings`,
`normalizations`, and zero `errata`. Each page's prepare/finalize/vectorize
ran exactly once with the existing lowercase positional recorder, the specified
external Python executable and `-B`, and existing `tools/p2c.py`.
No FIRST source-pipeline failure occurred. No source/code repair or rerun occurred.
The before-finalize author input, complete stdout/stderr, calls, and FIRST
outputs remain preserved. Finalize's generated metadata, snapped boxes and image
links explain the MD hash change; it reported no text normalization.

| Figure | FIRST snapped `[x,y,w,h]` | FIRST vectorize stdout mismatch |
|---|---|---|
| fig-112 | `[316,520,294,577]` | 0.024% |
| fig-113 | `[1005,467,257,690]` | 0.010% |
| fig-114 | `[963,1260,512,267]` | 0.002% |

Mismatch percentages above are exactly the tool's rounded stdout values, not
invented unrounded measurements. Diagram and label pixels were extracted and
traced, not redrawn. Fig-113's complete rectangle includes its printed caption:
the independent `cap` ink box `[1060,1120,155,45]` restored one real line in the
counting copy only. Original crop pixels were not erased or synthesized.

## Exact Boundaries

Incoming authority is the user's TEXTONLY handoff, not reopened 0165 evidence:
`coursephy8-c2-s2-n40`, `p open`, footer 153, exact supplied tail:

```text
112）. 要知道，鞋底向后没有滑动，就是说，鞋底和地面之间
```

`p0166#1` is `p cont`, not open. Its exact authored continuation is:

```text
的摩擦是静摩擦. 而如果鞋底滑动，那么也就不可能走路. 与
$\vec{F}_1$等值反向的力$\vec{F}_2$，使地球产生加速度. 汽车和其他自动车
的车轮，也是这样离开地面的，这个推动力就是静摩擦力.
```

The seam is exactly `鞋底和地面之间` + `的摩擦是静摩擦.`.
Figures/captions do not manufacture a new paragraph or prevent this closure.
After figs 112–113 and their captions, n40's last independent paragraph is
`p0166#6`, neither open nor cont:

```text
当皮带传动，皮带迫使皮带轮旋转（图113）时，使皮带
轮轮缘产生加速度的力，也是传动皮带和皮带轮之间的静摩
擦力.
```

The next actual source heading is `p0166#7`, `h3`:

```text
41. 滑动摩擦力
```

This is the n40 source-text closure and n41 start on printed 154.
It is **not approval of the full n40 course or its physics**.

The 0166→0167 seam belongs to n41. Exact stored boundary bodies:

```markdown
<!-- p open -->
**（滑动）摩擦力的方向，跟物体相对于与其接触的物体的
```

```markdown
<!-- p cont -->
运动速度的方向相反.**
```

The printed sentence, with Markdown emphasis delimiters removed, closes as:
`（滑动）摩擦力的方向，跟物体相对于与其接触的物体的运动速度的方向相反.`.
Foot 154 is transparent to this pairing.

Outgoing `p0167#8` is `p open`, not cont. Exact final printed row:

```text
体的位置有关）；摩擦力与物体的位置无关，而与物体的速度
```

Exact terminal suffix is `摩擦力与物体的位置无关，而与物体的速度`.
Foot 155 is transparent. Physical 0168 was not viewed or authored; its
continuation is unknown here and must be read independently. n41 remains
incomplete. Nothing was assembled, adapted, promoted or published.

## Row And Math Inventory

One nonempty MD body line represents one actual printed row. No fake counts,
duplicate text, empty text blocks or artificial `↵` were added. The exact row
strings are preserved in both page MDs and the facts receipt's `blocks[].rows`.

| Page / Block | Source object | Body rows | Flags / accounting |
|---|---|---:|---|
| 0166 #1 | n40 continuation, including vector F_1 and F_2 | 3 | `p cont`; closes |
| 0166 #2 | fig 112 | 0 | complete source diagram |
| 0166 #3 | fig 113 | 0 | complete source diagram including caption ink |
| 0166 #4 | caption 图 112 | 1 | ordinary `cap` |
| 0166 #5 | caption 图 113 | 1 | `cap samerow`; shares #4's real row; one ink-box row |
| 0166 #6 | n40 belt paragraph | 3 | new closed `p` |
| 0166 #7 | 41. 滑动摩擦力 | 1 | `h3` |
| 0166 #8 | n41 introductory paragraph | 7 | closed `p` |
| 0166 #9 | bold direction statement | 1 | `p open` |
| 0166 #10 | footer 154 | 1 | `foot`; printed surrounding dots are decoration |
| 0167 #1 | bold statement continuation | 1 | `p cont`; closes #9 and its emphasis |
| 0167 #2 | acceleration / relative-speed paragraph | 2 | closed `p` |
| 0167 #3 | proportionality, formula, coefficient explanation | 4 | closed `p`; formula is its own actual row |
| 0167 #4 | coefficient ratio and fraction formula | 3 | closed `p`; numerator/denominator count as one formula row |
| 0167 #5 | coefficient example, left-side wrapped prose | 6 | closed `p`; includes actual 1, 0.5, 20牛顿, 10牛顿 |
| 0167 #6 | fig 114 | 0 | complete right-side diagram |
| 0167 #7 | caption 图 114 | 1 | `cap samerow`; shares last row of #5 |
| 0167 #8 | coefficient/material/surface/position paragraph | 8 | `p open`; source first term 摩擦系数 is bold |
| 0167 #9 | footer 155 | 1 | `foot`; printed surrounding dots are decoration |

Thus 0166 accounts for `18 - 1 = 17` printed rows; 0167 for `26 - 1 = 25`.
There are no exercise rows, tables, question numbers, answer objects or choices.
Scanning-edge lines, marginal black spots and isolated dirt are not text objects.

Math is faithfully authored using source vector marks, halfwidth digits and
LaTeX, with sentence punctuation outside math:

```latex
$\vec{F}_1$
$\vec{F}_2$
$|\vec{F}_{\text{摩}}|=\mu|\vec{N}|$.
$\mu=\frac{|\vec{F}_{\text{摩}}|}{|\vec{N}|}$.
```

Both formula F labels carry the source's Chinese subscript 摩; `\text{摩}`
preserves that character. Both F and N have vector over-arrows. Inline mu
occurs in the coefficient explanation and ratio introduction. No new
force magnitude, acceleration, speed, coefficient or inferred numerical value
was added to figs 112–113. Fig-114's printed numeric labels are separately
inventoried below; prose 0.5 was not inserted into the figure.

## Source Figure Inventory

**Fig 112, from the new full original first and then actual source detail:**
one person with face/head toward image-left, a large backpack on image-right
behind the torso, two hands near the chest/straps, trousers and two boots;
three separate wavy background groups on the left, a sun arc/rays at upper
right, and a shaded ground block with grass-like upper edge.
The image-left leg extends down-left; its boot toe points up-left, with
the sole sloping down-right and heel near the ground edge. The image-right
leg is nearly vertical, with its boot bottom at the ground edge. Its shoe
outline is close to the arrow ink; toe orientation and actual load/contact
allocation are not uniquely established by these pixels.

Two outlined horizontal arrows are at the ground/boot region: the upper/left
one points left, with printed vector `F_1` below it; the right one sits slightly
lower and points right, with printed vector `F_2` below it and to the right of
`F_1`. Both labels themselves also carry the small rightward vector-over-arrow
notation; that typographic mark must not be confused with the left/right
directions of the large diagram arrows.
No scalar numeric value, axis, tick, velocity arrow, third force, foot name,
or force-recipient label is printed. No swap of F_1/F_2, motion-direction
correction, or inferred physical assignment was made.
Caption `图 112` is below this diagram and outside its snapped crop.

**Fig 113, from the new full original and grid:**
upper fixed support and upper belt wheel, lower wheel and its base, two
connecting belt runs, an upward small arrow left of the left belt run and
a downward small arrow right of the right run. An outlined upward force
arrow is beside the upper wheel at left; vector `F` is above-left of that
arrow. The support has a protruding right-side line. No numeric magnitude,
speed label, wheel radius, angle or extra letter is printed. Caption `图 113`
is below the lower base, horizontally level with `图 112`, and included in
the complete rectangular extraction with a separate real caption ink box.
The finalized fig-113 PNG/SVG were hashed; that crop was not reopened because
the eight-image budget was exhausted. Its source diagram was viewed on
the full original/grid, not inferred from a previous HOLD image.

**Fig 114, from the new full original/grid and actual finalized crop:**
solid rectangular wooden block above a horizontal tabletop, horizontal
parallel table-board/wood-grain strokes below, and vertical strokes at the
right table-board end. These strokes are not a data table or numeric ruler.
A hollow rightward arrow projects from the block's right edge;
`F=10牛` is printed above that arrow toward the right. A solid downward
arrow passes from the block center through the table/board, with
`P=20牛` printed below/right of its point. Caption `图 114` is below the
diagram, sharing the left prose row `着桌面运动.`.
No left friction arrow, upward normal arrow, mu annotation, axis, measurement
grid, extra numerical datum or solution label was added.

## Image Budget And Evidence

Read lesson cap1, profile and Image batches before viewing. **Eight image
loads total, in this exact order, with no reopen, old HOLD image, or further
image after view 8.** Each page's full actual original preceded its template.
Both details are real crops, not resized or redrawn.

Image base:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b59-friction/work/8p/pages/`.

| View | File under image base | SHA-256 |
|---|---|---|
| 1 | `0166/page.png` | `8ded5f55183cbbe486975449efbb7badc18a5bc134e114ccf231919375676532` |
| 2 | `0166/page.grid.png` | `5444f4d117b84834fea2a9aaefa10dd44bf22d3d49198f403e9060e8bc43261a` |
| 3 | `0166/detail-fig112.png` | `75b4e019705eae6133eb6a8a5c10be68f37423683ca1b9cccbb740f2416c311b` |
| 4 | `0167/page.png` | `69dd009d04805dea39d26baac0d5f2c997b1dcbcc71cbc95d57cfdf4abb3bc6e` |
| 5 | `0167/page.grid.png` | `5494e2bcba961edf106c19e4e67ffdfe3092764c32d1e8644936e7789efaed24` |
| 6 | `0167/detail-formulas.png` | `0bef497e7344751cd5832d28cac7ac98bb40f39e4efaae2033f6aa6dbeadb0b0` |
| 7 | `0166/figures/fig-112.png` | `a5f4c6344a84cd573b60e8474cd3801462060fb4a060e77f7312a0fcb5fc5761` |
| 8 | `0167/figures/fig-114.png` | `d158a8de1097461f392fdb1e93afb4421196903c16d5208fbddf3e313e2a8f7c` |

Detail LTRB coordinates: fig112 `[280,490,650,1105]` from 0166 original;
formula detail `[690,630,1020,1130]` from 0167 original.
Both detail commands and source/output hashes are in their new recorder receipts.

Common source PDF: `8p 苏联中学课本 物理 八年级.pdf`,
SHA-256 `4ec6a3d5fafe2c5c861a5053cf8cf047a3a6bd7988a4de799859d6a4fef8cc46`.
Existing p2c SHA-256:
`fa43af66d13a5799c3a523631e41d034dae25ab18bc894e1389556147d8fa520`.
Profile SHA-256:
`dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849`.
Recorder SHA-256:
`a480dc90be720552a2833087cc4b6f7e84b69af670a87eb20a003d2496c030ec`.

Artifact base:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b59-friction/artifacts/8p/pages/`.

| Artifact | SHA-256 |
|---|---|
| 0166 authored input MD, preserved in authored-inputs receipt | `2a5e7877530ba78adf709878d741a604c402e70d36d83442948f4e05dc651d32` |
| 0167 authored input MD, preserved in authored-inputs receipt | `673efc83b7000855a5484a5e6d3a037662d20db955e055b065558c6dffcbf9f8` |
| `0166/page.md` FIRST finalized | `cce81fe7d3234363b5467e90d51e14a147e4505f0936e84648923a691110a358` |
| `0166/page.json` FIRST | `997506b16c745ded233e02b8525a9ebb8e032f3795b5d5603a7edc1976d175c2` |
| `0166/audit.json` FIRST | `a53a3686403763e2e3d93790ddbe967d7e2189d0230bbbbb48fedf466560aa51` |
| `0167/page.md` FIRST finalized | `08e9de2357bc5437b54f968622cf65481f1141d4d481507edbf0935cb60b9aa7` |
| `0167/page.json` FIRST | `d44a7fa74e120e79280e38c38ad06d54a9c04e0d39be2eea09d9c060389466c1` |
| `0167/audit.json` FIRST | `7586fb940b94de6c8401de700197d449b9dcdbac60382ae7632f05ad38de99d1` |
| `0166/figures/fig-112.svg`, under image base | `51c456fc7f5b4d62677ff20ce7325ae73c55c99a09c08d2a8870d9543453d310` |
| `0166/figures/fig-113.png`, under image base | `0752892156716c3dc7e42603f7d11f29f288e70305e05626bfc624e07cea6cd6` |
| `0166/figures/fig-113.svg`, under image base | `52302d740c232ef771fcc630a80d517364b4c96b0eb4a7039402c6f94f1f5a6b` |
| `0167/figures/fig-114.svg`, under image base | `213347d72e2c1bd6b20ffcdb462a35c4e46cb7916b6bc725df09e00930e5ef4f` |

Receipt base:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/commands/`.
Each row names a prefix with retained `.call.json`, `.stdout`, `.stderr`.
Full argv, times, exit, stream hashes and all artifact hashes are also copied
into the facts receipt.

| FIRST receipt prefix | `.call.json` SHA-256 |
|---|---|
| `b59-author166167-prepare-0166-first` | `856ef5e3dbcd43812a7f235b34cd206885e72d4ed7625bd9e537571908cb728c` |
| `b59-author166167-prepare-0167-first` | `29c5b5f2bececc35bb53419522dcfa5100d78a1f1f3a1769dca3d73436d97ccb` |
| `b59-author166167-finalize-0166-first` | `eeb4c2625037d2d10e30c85958f545e7ac68740bb5c16dc83abad4d9854db4f7` |
| `b59-author166167-finalize-0167-first` | `e397142e607ec1afc4f0f7275297a30afa0d8b5440546f57306340486099692d` |
| `b59-author166167-vectorize-0166-first` | `777dd74e4f262b31ab800347828cf5d3c9c35525ee8362dc52f40d2400db0e06` |
| `b59-author166167-vectorize-0167-first` | `9c3662151124173f247b091986a0fac1e397f461a45bf0275831e33742d6367f` |
| `b59-author166167-report-facts-first` | `9443b9fcd3dd36e0db0cb56177ffce66be8f69e4ca254442c827c48eddae9792` |

Facts receipt `.stdout` SHA-256:
`88eeb9edd11565c1752d08e4a8f2d0089053f650685445fb4c44b120800c606d`.
Additional preserved prefixes: `b59-author166167-detail-fig112`,
`b59-author166167-detail-formulas`, `b59-author166167-authored-inputs`.
The facts scratch script is `b59-author166167-report-facts.mjs`; it only
reads owned outputs and records facts, not source repair or a second p2c run.

## STOP And Limits

Faithful transcription is not physical truth. Source wording including
`使地球产生加速度`, `这样离开地面的`, the source's force labels, and the
source first-read `表证` is preserved. No physics correction, inferred
force assignment, unverified erratum or course approval was substituted.

The user's coordination handoff says the parent 0165 caption patch is ready,
its sole finalize FIRST passed, and independent affected review is in flight;
those are received TEXTONLY coordination facts, not reverified by this author.
0165 is not physics approval. No 0164/0165 file was read or edited; no old
HOLD image was opened. The full n40 course remains unapproved.

No freshness/setup/backend/network/DB/model service/Git operation,
assemble/adapt/promote, answers/choices, parent checkpoint, or usage record
was performed. No other worker's outputs were changed.
**Return this new report and STOP.**
