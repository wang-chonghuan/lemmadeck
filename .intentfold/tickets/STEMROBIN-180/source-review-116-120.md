# Independent Source Review: 6p Physical 116-120

2026-11-15. **PASS for these five page-level source artifacts. No source repair requested.**
Reviewer is not their author. This is not a modern-figure review, whole-lesson
approval, assembly approval, publication approval or batch6 completion.

## Method And Findings

Actually opened each original `page.png` alone at original detail, followed by
that page's `page.grid.png`, and compared all printed text and objects with its
MD, JSON and audit. No reduced-resolution multi-page composite was used. Also
opened each of the eight complete crop PNGs, including their outer edges.
The source-first reading and row counts preceded consulting Banach's author
report; its mechanical PASS claims were not substituted for this source review.

No missing words, wrong source quantities, mistaken figure ownership, clipped
source objects, unsupported changes or unaccounted printed rows were found.
Original spelling, punctuation, emphasis, dates, circled markers and
section/question identities are retained.

| Physical / Printed | Independent Rows | Audit / MD | Blocks | Source Result |
| --- | ---: | --- | ---: | --- |
| 116 / 105 | 5 | 5 / 5 | 4 | PASS; question 2 continuation and questions 3-4; no figure |
| 117 / 106 | 17 | 17 / 17 | 12 | PASS; two-line chapter h1, section 48, five prose fragments, figures 94-95 |
| 118 / 107 | 17 | 17 / 17 | 12 | PASS; compression continuation, Pascal law and experiments, figures 96-97 |
| 119 / 108 | 20 | 20 / 20 | 15 | PASS; water/smoke experiments, four questions, exercise 20 question 1, figures 98-99 |
| 120 / 109 | 26 | 26 / 26 | 14 | PASS; exercise/homework, biography, section 49, complete footnote and open apparatus prose |

Total 85 independently counted printed rows, not merely an aggregate gate.
Per-block increments, including zero increments for same-row captions, are
recorded in the hash-bound `evidence.json`. All five complete MD parses match
durable JSON metadata and blocks after deriving figure IDs with the existing
`blocks.fig_id`. Audits contain zero errors, normalizations, unknown characters,
KaTeX warnings or errata.

## Source Details And Ownership

- 116's substantial blank lower area is genuinely blank. Its first text is the
  continuation of section 47 question 2, not a new question.
- 117's chapter title occupies two printed rows and is correctly `h1`; section
  48 is `h3`. Original `象` and the emphasis-dot span
  `它们均匀地分布在整个容器中` remain, with the exact span represented as bold.
- 118 retains all three original `1` 帕斯卡 statements, the complete two-line
  bold Pascal-law conclusion and the bold law name. Figures 96 and 97 represent
  the water and smoke experiments respectively.
- 119 preserves the full emphasis-dot span
  `气体也要把加给它的压强以同样的大小向各个方向传递`. Figure 98 belongs to exercise
  20 question 1. Figure 99 belongs to exercise 20 question 3 on 120, not question
  2 or the preceding explanatory prose.
- The original figure 99 caption says `瓶子的制做`; its last mark is a comma.
  Its first row shares figure 98's caption row, while its second row is separate.
  `cap open samerow` followed by `cap cont` expresses this faithfully.
- 120 retains original `制做`, `帕斯卡·布列斯`, 1623-1662, France, Italy and
  `托里拆利`. The portrait has no printed caption/number. Its stable identity
  `tbl-p0120-01` and explicit `owner-lesson phy6-c4-s1` match the biography and
  authoritative TOC section 48, not homework or section 49.
- Both circled-1 source markers are retained as `$\text{\textcircled{1}}$`.
  The original complete footnote is physically below figure 100 and above the
  page number. Its one-row text block is logically placed immediately after
  the referenced definition, with this placement explicitly noted. Source
  wording is unchanged and this avoids interrupting the final open paragraph.
  This is a documented encoding/ordering decision, not the original physical
  location or a new explanatory paragraph.
- Figure 100's caption really shares the final apparatus-prose row. That
  caption contributes zero additional printed rows; the footnote and page
  number each contribute one.

## Actual Figure Checks

For every crop, the exact box agrees between MD, metadata and audit. The crop
pixels equal the exact source rectangle with the existing 12px white padding
rule; padding does not copy adjacent prose. No caption was cut into an image.

| Figure | Actual Source Inventory Checked | Exact Box |
| --- | --- | --- |
| 94 | Rectangular vessel, complete particle field and central top piston; no added force arrow | `[216,1680,471,244]` |
| 95 | Vessel and particle field, lower piston position and original white downward arrow | `[799,1704,466,221]` |
| 96 | Whole piston/rod/tube and hollow ball, downward arrow, liquid region and outward water jets | `[408,1359,179,573]` |
| 97 | Whole corresponding apparatus, downward arrow, smoke-filled region and outward smoke plumes | `[972,1327,188,616]` |
| 98 | All three solid/granular/liquid vessels, texture distinctions, original loads and downward arrows | `[193,1579,392,280]` |
| 99 | Bottle/mould section, blowing tube, hatching, all callout lines and labels 1/2/3 | `[963,1506,219,390]` |
| Portrait | Full halftone rectangle and oval head/shoulders; no neighboring text or invented caption | `[850,802,398,440]` |
| 100 | Connected unequal-width cylinders, both pistons, liquid marks, dotted reference line, A/B/S1/S2/F1/F2 and both force arrows | `[879,1433,441,393]` |

All eight PNG/SVG pairs are hash-bound in the review evidence. The author's
existing vectorizer PASS results (0.016%, 0.024%, 0.006%, 0.000%, 0.002%, 0.036%,
0.947%, 0.078% respectively, portrait before 100) are inherited tool evidence.
The reviewer did not rerun vectorize or claim a new independent vector-fidelity
execution. Independent source-object/crop inspection and exact crop checks did
run and pass.

## Boundaries

- 115 -> 116: read 115's tail only as textual context:
  `...压强大？试` (`ex 2 open`) joins `解释这是为什么？` (`ex 2 cont`).
  No repeat review or edit of 115.
- 117 -> 118: `...紧靠着活塞下方` (`p open`) joins
  `的气体受到了压缩.` (`p cont`).
- 118 -> 119: `...若在球中装上水，然后向` (`p open`) joins
  `管内推活塞...` (`p cont`).
- 119 -> 120: exercise 20 starts with question 1 on 119 and continues with
  separately starting questions 2 and 3 on 120. Figure 99's reference closes
  with question 3; no empty/artificial continuation was introduced.
- 120 -> 121: 120 retains `p open` ending
  `以下的部分通常都装满了油（最常`. Actually opened 121's original source PNG
  for its first line only and confirmed `用的是矿物油）.` (`p cont`).
  This establishes the continuation, not review/approval of 121.

## Preserved 117 First Failure

The original author semantic FAIL and unique repair remain in
`.tmp/ld-s10y-lesson/6p/pages/0117/failure-01-chapter-level/`.
Independent comparison confirms current MD differs from that snapshot only
by the first block header `h2` -> `h1`; JSON differs only by
`blocks[0].kind`. Complete metadata and audit bytes are identical. The original
text, exact figure boxes and both PNG hashes remain unchanged. No second
repair was made or requested.

| Preserved File | SHA256 |
| --- | --- |
| failure page.md | `fa6adeee2944595294c260a64aaf8f4b98f2b3a073105ab5d46aef8911bebd7e` |
| failure page.json | `59a0c7de9c83c3eda26afeb8396c344b1d05b39dd4648082ad337059d93ec1ca` |
| failure audit.json | `c4cf2564bab574e9775d623ac010da867625b2596dcc681a9294e024a5652bd0` |

## Commands And Reviewer Helper Status

Used local original-detail `view_image` for each separate page/grid/crop.
No browser, visible window, OS input, CDP or external service was used.

```sh
env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/ld-s10y-lesson/6p/source-review-116-120/check.py --write-evidence
env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/ld-s10y-lesson/6p/source-review-116-120/check.py .tmp/ld-s10y-lesson/6p/source-review-116-120/evidence.json
shasum -a 256 .tmp/ld-s10y-lesson/6p/source-review-116-120/{check.py,evidence.json}
```

First helper execution exited 1 before page validation because the reviewer
assumed a nonexistent TOC `printedNumber` field. Failed helper and exact
diagnosis are retained in `failure-01-helper-schema/`. Schema-only correction
uses actual `source.printedSection` and parser exercise `label`, not `number`.
No source/tool/count/threshold was changed; this is not an author repair or
source FAIL. Rerun exited 0: **PASS: 63 hash-bound inputs**. Freeze verification
exited 0: **UNCHANGED: 63 hash-bound inputs**.

## Frozen Inputs

| Page | Original page.png SHA256 | Durable page.md SHA256 |
| --- | --- | --- |
| 116 | `531c5c2f284c5526fd9d0a096c83dc574e3cd5f7222f79ca78d6b8ef73514636` | `0e0709bb6af826d30d4a482096c01e9cd131df7c5d93b72ccc91979ee70f979e` |
| 117 | `4e91a2e074159f09d2070b04ab1c983591fb29ef8cefc5ee5314ff062acbde37` | `316cc021160c013742903ff39e60ecf448731c1bf2e268c9dc914205692781d1` |
| 118 | `4730b08b1ed381bc1c014bfd8adbe4f560fb5dee50fed7489a09b6d74f888073` | `ff9b10c75265bb177a599fc24d61d6f93c826f6e16527dd5b2b2674311676ea1` |
| 119 | `bec691d33f53217583d4dea0ff974924c6afa7edde6a42245270cf0317399b5c` | `09fe866f221a3fdffc26cc76256e1d81945c97b126b279502a1f17aed2fce633` |
| 120 | `b7d68faab9d5221ed8e10352bee0eac588e967ac22c903dd03954bf80b82aa7e` | `cf216da184b8948d205afd1c21306298afbb8eef49635db42d0b88f9e2cc4d5c` |

PDF SHA256: `46e2b2e4a92b7c00fab9adfc6a8a9b5340a9519fa90f1b82e79bc1e1432fcbb0`.
121 boundary PNG SHA256: `2fd016dea3d527673ee06a166ad0b5352c364cd05b66689055cb5e6fc52da52b`.
All durable page.json/audit, grids, layouts, figure PNG/SVGs, boundary MD,
TOC/profile/tool and failure snapshots are individually hashed in
[evidence.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/6p/source-review-116-120/evidence.json).

Helper SHA256: `c3501b8541b86581e028b3d2292f0d27bc7fbbdfe565d0384c39ebf7fe99b8c1`.
Evidence SHA256: `42e06f636523e16506b3625de6446615270c17c5a37567b1797bb728e5647a13`.

## Stop Boundary

Only this report and its independent scratch helper/evidence were authored.
No source text/boxes/audits, first-failure archives, old reviews, tool,
lesson/index/book, dependency, DB, app, publication or Git change. No
finalize/prepare/vectorize/assemble/publish command, answer/choice reading or
self-approval of author work. All source-review commands have exited; no
source-review session is in flight. Delivered separately before starting the
newly authorized scratch figure 79/80 author task.
