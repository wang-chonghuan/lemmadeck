# Source Author: 6p Physical Pages 126–130

2026-11-15. **Frozen author delivery for separate independent review, not
self-approval.** Five current mechanical PASS pages and eight vector PASS
figures. One author-discovered source-format defect was repaired once; its
first state is retained.

## Scope

- Reused the previously read AGENTS/IntentFold router, charter and live
  STEMROBIN-180 authorization; re-read the lesson skill cap1 rules and
  consulted the existing 6p TOC for section identities.
- Only physical 126–130 durable source pages, their scratch and this report
  were authored. Physical 125 was read only through its tail text, with no
  repeated pixel/audit review. Pages 121–125, including 122, were not changed.
- No assembly, book/index/lesson/modern/answer/choice changes, DB, Git, app,
  dependencies, charter, publication or page 108 operations. No browser,
  CDP, user profile or OS focus action occurred. Other authors' work was
  preserved.
- All five source pages were read individually through their original PNG
  and grid, never a multi-page image. Each resulting PNG figure crop was
  opened individually. Source-only details were used on 128 and 130.

## Exact Counts

Rows include printed page numbers and exclude labels within figure crops.

| Physical | Printed | Blocks | MD Rows | Detected Rows | Figures | Ex Blocks | Result |
|---|---|---:|---:|---:|---:|---:|---|
| 126 | 115 | 11 | 15 | 15 | 2 | 0 | First finalize PASS |
| 127 | 116 | 15 | 20 | 20 | 2 | 7 | First finalize PASS |
| 128 | 117 | 9 | 25 | 25 | 1 | 0 | PASS after one format repair |
| 129 | 118 | 9 | 15 | 15 | 2 | 0 | First finalize PASS |
| 130 | 119 | 8 | 18 | 18 | 1 | 0 | First finalize PASS |
| Total | | 52 | 93 | 93 | 8 | 7 | 5 mechanical PASS / 0 FAIL |

Block totals: 20 p, 7 ex, 2 exhead, 2 h3, 8 fig, 8 cap and 5 foot.
Seven distinct numbered source items are all on 127: four `问题` and three
`作业`, each group starting at 1. No unnumbered exercise was invented.
All current audits have zero normalizations, unknown characters, KaTeX
warnings, registered errata and errors. These are page-level results, not
assembled course counts or independent source acceptance.

## Source and Boundaries

- **126:** `p0126#3` begins `的压缩空气，却因受阀门 $2$ 的阻止出不去.`
  and continues 125's tail `而在压力缸左边及贮气筒中`. Figure 106 and its
  caption precede the continuation and remain transparent to its pairing.
  Section **51. 液体的自由表面** matches TOC `phy6-c4-s4`. Preserved the
  bold free-surface definition, `水平面`, the horizontal-plane definition
  and `水平仪`. Figure 107's left section/right instrument stay one image.
- **127:** preserved the gas/free-surface paragraph and its §14 reference.
  Kept all seven question/homework items, the plumb-line/triangle task,
  cardboard level task and small-wood-wedge/rolling-ball task. Figures
  108/109 are separate numbered images; their captions share a printed row,
  so only the latter cap is marked samerow. 128 starts with a new section,
  not a continuation of homework 3.
- **128:** section **52. 液体和气体中的压强** matches TOC `phy6-c4-s5`.
  Preserved horizontal labels aa/bb/cc/dd, liquid layers 1/2 and figure
  111's Cyrillic а reference. `p0128#3` is open at `实际上，最上`;
  after figure 110 and its samerow caption, `p0128#6` continues with
  `面的液层 $1$ 压平面 $bb$`. Original `压平面` was not rewritten.
  Source detail crops establish the dotted emphasis from `液体对` through
  `压强`, and from `橡皮膜上方` through `越厉害`, each retained as one
  emphasis range across printed lines.
- **129:** each of figures 111/112 retains both а/б panels and arrows
  within one source figure box. Text keeps the equality conditions for
  membrane flattening and equal liquid levels. `p0129#8` stays open at
  `用一个底可以脱落的容器来做实验，效果是很直观的. 把`.
- **130:** `p0130#1` continues with `这样的容器放到装着水的玻璃缸中…`.
  Figure 113 keeps both panels, strings, pouring cup and detachable bottom.
  The bold conclusion runs from `液体内部` to `随着增加`; the enlarged
  original confirms 着 in `随着`, correcting a provisional draft reading
  before the first finalize. The last paragraph about gas weight ends with
  a complete printed sentence and has no open flag. Physical 131 was not
  prepared/read; section 52 as a whole is not declared complete.

**Unresolved pixel ambiguity for the reviewer:** 128 has an isolated short
ink mark to the right of `最上`. It is not confidently identifiable as a
body character. It was not inserted into the word sequence; the original,
grid, `layer-text-detail.png` and page notes preserve the uncertainty.
Mechanical row equality does not settle that source-reading question.

## Figures

All eight final PNGs exactly match their original RGB source rectangles with
the crop helper's 12px blank padding. The PNG crops were also individually
opened to inspect objects and labels.

| Figure | Page | Final Box x,y,w,h | Vector Command Mismatch |
|---|---|---|---|
| 106 | 126 | 405,200,666,505 | 0.000% |
| 107 | 126 | 341,1755,835,138 | 0.000% |
| 108 | 127 | 341,1557,220,151 | 0.000% |
| 109 | 127 | 935,1410,250,367 | 0.004% |
| 110 | 128 | 1020,446,250,449 | 0.023% |
| 111 | 129 | 422,210,735,329 | 0.000% |
| 112 | 129 | 409,1180,744,320 | 0.000% |
| 113 | 130 | 371,525,737,433 | 0.000% |

These are the exact percentages emitted by p2c, with its resvg comparison,
1px tolerance and 2% mismatch limit. No vector PASS was rerun. All eight
PNG/SVG hashes remain identical to their first vector-command snapshots,
including figure 110 after the text-only repair.

## First Failure and One Repair

No prepare/finalize/vectorize command failed. There was **one author-found
source-format failure after the first mechanical gate**, on page 128.

`p0128#3`'s fourth printed line ended `而水平平面`, and the next began
`$aa$`. Joined text exposed `水平平面$aa$`, missing the cap1 Chinese/Latin
separator. One minimal repair adds **exactly one trailing ASCII space**.
The repair collector asserts that this is the only MD-byte change from the
retained first state. Refinalize only 128: exit 0, 25/25 rows, zero
normalizations, unchanged figure box. Zero second repairs were performed.

First-state MD/JSON/audit and explanation:
`.tmp/ld-s10y-lesson/6p/pages/0128/failure-01-aa-join-space/`.
The complete initial command input/output/exit status and figures are also
retained under `0128/author-evidence/finalize-1/`; repaired command evidence
is under `finalize-2/`. The first batch manifest remains unchanged, and the
final manifest explicitly supersedes it rather than overwriting it.

No counter/tool patch, source deletion, artificial wrap, false samerow or
row-threshold override was used. The final collector ran successfully;
there was no auxiliary collector failure in this batch.

## Commands and Frozen Evidence

All Python calls used the shared runtime with bytecode disabled:

```text
env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B
```

With `.claude/skills/ld-s10y-lesson/tools/p2c.py`: prepare once for each of
126–130, finalize once for each, vectorize once for each, and one additional
finalize for 128's sole repair. **16 p2c commands, all exit 0.**
15 are captured by the scoped scratch command runner; 126's initial
unwrapped prepare output/exit status is retained in the manifest.
The separate source-evidence collector and affected-only repair collector
both exited 0. No passed finalize or vectorize was otherwise repeated.

Each page's `author-evidence/commands.json` retains exact invocation,
timestamps, stdout/stderr, exit status and snapshot paths. Finalize snapshots
include input MD and output MD/JSON/audit/figures; vector snapshots include
the actual PNG/SVG bytes. Runtime/token totals for the whole author session
are unknown, not estimated.

Final manifest:
`.tmp/ld-s10y-lesson/6p/pages/0130/source-author-evidence-final.json`

SHA256: `cea171414c95126a75aea9a7a131a758d67732fb27bac8b4a9eed1a772ead45a`.

Unchanged first-state manifest:
`.tmp/ld-s10y-lesson/6p/pages/0130/source-author-evidence.json`

SHA256: `579dabfb632aa4c52f43e64ce5e7adb3c9b4b4797153ab10c24c26fd7d7ada68`.

Current durable MD hashes:

| Page | SHA256 |
|---|---|
| 126 | `09b3a840f2ba1d566addeda1e8e5dbe1697d5e218a1368fb5637e77556225491` |
| 127 | `f5bee6441d63820771726814d3a1385388f4ee611a0337594c2d239ae7ce44d3` |
| 128 | `31e72e3d169363fa654e0896bb1a9905e64f48be0f41d8176bf5816b949d9258` |
| 129 | `ef525c2e7bd482c45497205c77c0e3a24afb8d53e909e24e5d71ac6c0da00415` |
| 130 | `d65ba13a54849b80eca5af4cb9f0882523fda568a73c4c23a996d8216479befe` |

The manifests contain full durable MD/JSON/audit, source/grid/layout,
source-detail, crop/SVG and command-snapshot hashes. Independent review
must compare source pixels and semantics; neither this author report nor
mechanical PASS counts replace that review. No assembled lesson, book,
modern edition, answers, choices or product delivery is claimed.
