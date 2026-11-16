# 10c Physical35-38 Source Author Handoff

Date2026-11-16. STEMROBIN-184. Role: sole source author for physical35-38; not independent content reviewer. Authoring stopped immediately after physical38's first finalize failed. No repair, second finalize or counter diagnosis was performed.

## Scope and Source Order

Root `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

Parent-prepared original PNG/grid/template/layout existed for all four pages. This author did not prepare again. Read current lesson cap1; each page's native PNG was opened individually, followed by its grid, before writing that page's durable MD. Source-first rows, full objects, formulas and boundaries were frozen under `source-10c-p35-p38-evidence/<id>/source-first.md`.

Only durable `ssot-resources/soviet10year-textbooks/artifacts/10c/pages/{0035,0036,0037,0038}/page.md` was manually authored, using apply_patch. The four explicitly authorized finalizes generated their scoped JSON/audit/crops. No old10c34 or 9g source edits, reviewer/answer/choice/modern reads, tool/schema/library changes, browser/network/DB/dependencies, vectorization/assembly/index/Git/publishing occurred.

Evidence root: `.intentfold/tickets/STEMROBIN-184/tmp/source-10c-p35-p38-evidence/`. Prepared originals and crops: `.tmp/ld-s10y-lesson/10c/pages/<id>/`.

## Actual First and Only Gates

| Physical | Actual printed page | Manual print rows incl. foot | MD / machine | Blocks | Crops | Actual exit |
| --- | --- | --- | --- | --- | --- | --- |
| 35 | 29 | 16 | 16 / 16 | 10 | fig21 | 0 |
| 36 | 30 | 13 | 13 / 13 | 7 | body table | 0 |
| 37 | 31 | 19 | 19 / 19 | 11 | none | 0 |
| 38 | 32 | 14 | 14 / 16 | 7 | body table | 1 |

Physical35/36/37 stdout reports mechanical row/whitelist/formula PASS. Physical38 failed solely with:

```text
行数对不上：印刷 16 行，块体 14 行（块体一行 = 印刷一行；公式跨行用 ↵ 标断点）
```

All four have zero normalizations and no count exclusions or registered math errata; stderr is empty. Physical38's failure is retained, not conditionally passed. The source-first visual count is14, with its two tall nested quotients each occupying one physical print row. The counter's16 is recorded as actual, without adding two fictitious wraps/rows, deleting terms, adding masks or claiming an independently verified tool defect.

Commands actually run, once each:

```text
.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 35
.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 36
.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 37
.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 38
```

Per-page `finalize-run.json` retains exact argv/cwd/exit; `finalize.stdout.txt`/`finalize.stderr.txt` retain actual streams. `before-finalize/{durable,prepared}/` retains the manually authored MD and complete prepared source package. `after-finalize/{durable,prepared}/` retains the complete successful or failed first result. Current durable triples were checked byte-identical to after snapshots; original PNGs remain byte-identical to before snapshots. These are evidence bindings, not rerun gates or semantic approval.

## Faithful Content and Boundaries

- Physical35 starts the exercise heading, contains complete69 and70 plus70's full hint, then begins §17 “三角函数的研究” and83 “诱导公式”. Both exercises close locally. There is no star or difficulty marker on69/70. Printed “提示” has a wavy underline; its text is retained, not made into a new formula. The hint's actual “同样速度” is not changed to a mathematically inferred wording.
- Figure21's two panels remain one original numbered figure, with two same-row caption blocks using source Cyrillic а/б. All circle/axis/vector/angle/projection ink is retained. Source vector labels and original phase/direction relationships are not inferred from the task's requested proof.
- Physical35's last paragraph ends with `x=2pi n+u`, `0<=u<2pi`, `n in Z`, and a comma. It is `p open`; physical36 begins `p cont` with “所以当x是任何数时…”. The latter paragraph closes at the colon introducing the sine/cosine table.
- Physical36's body table is a whole original raster object, not rebuilt cell text. Four columns, a header and seven data rows; only the actual grouped horizontal dividers are retained. All signs and values were recorded from pixels in the source-first note. This page's final `p open` ends “很”; physical37's `p cont` starts “容易推出：”.
- Physical37 retains all six complete two-row derivation chains, including0/1 coefficients, multiplication dots, nested brackets, intermediate sine/cosine values and the final double negative. Exactly six `↵` markers locate the actual formula continuation rows; numerators/denominators were not counted as separate rows. The grade8 geometry unit102 reference remains literal; that book was not consulted. Final formula closes locally.
- Physical38 starts a new tangent/cotangent paragraph, retains `x=pi n+u`, `0<=u<pi`, `n in Z` and the literal subsequent variable alpha and closed interval `[0,pi/2]`. No endpoint/domain correction or variable substitution was made. Its body table has a header and three data rows, with the actual rule between every row.
- Physical38's two full quotient derivations retain all numerator/denominator signs and intermediate terms, each as one print row without a `↵`. The final period closes that paragraph. No new exercises, stars, section or unit heading occur on36-38. This page boundary does not prove unit83 complete; no next-page content was invented.

## Actual Crop Bindings

Physical35's complete fig21 crop and physical36's entire table crop were each opened alone at original detail after their successful finalize. Physical38's table was already inventoried from its complete original PNG/grid before writing; its failed-finalize crop was preserved and hashed but was NOT reopened after the stop-on-FAIL instruction. It is not claimed as post-finalize visually approved.

| Page / object | Exact snapped box | Current prepared PNG | SHA256 |
| --- | --- | --- | --- |
| 0035 / fig21 | [341,1150,1051,548] | `pages/0035/figures/fig-21.png` | `8a5269194ff7e9f89c3ebd71dbac69a07479ecace4218e778d1e4a07cba48f84` |
| 0036 / body table | [234,658,1122,940] | `pages/0036/figures/tbl-p0036-01.png` | `ab6f1b14ae9b98c981eb337d5c0b55bd692b1661fa45716c9c8132ff42f978a4` |
| 0038 / body table, failed result | [231,775,1117,556] | `pages/0038/figures/tbl-p0038-01.png` | `5efbd8da9ee3dcbaa1f50bd9b40315d4647f8c0a3705f15185b959a1cd301ba9` |

Paths in this table are relative to `.tmp/ld-s10y-lesson/10c/`; identical retained copies are in each page's `after-finalize/prepared/figures/`. No official source figure promotion or vectorization was done.

Fig21 full-crop observation: both circles/axes panels, x/y/O, A/P0/P(t)/x0/x(t), original arrows/arcs/phi and projection guides on the left; all three right circles, P1(t)/P2(t)/P(t), vector and parallelogram connections, axis arrows and bottom circle/axis ends remain. No caption/text crop contamination was seen.

Table36 full-crop observation: complete four-column header, all rows1-7 and signs, grouped separators and full outer border retained, including source worn segments. No neighbouring prose or caption was included.

## Current Raw Hashes

| Page | page.md | page.json | audit.json |
| --- | --- | --- | --- |
| 0035 | `f64ae5a54db07b4247d706b5516e49fce5cf54e31bcd22f12e744ac744db8016` | `c45d3f94ddb84b503e6babe5ce04c90271899264a22daad12e190dc0c369a5bd` | `642cf49e7afeff016567660bbe64cbf04d3bec799e60fdd2b4d1592f9f9e2035` |
| 0036 | `0dec3c1f054f58461bd7d28a3d8f085208466ca02eecc2d848ea85a7fa637d59` | `d56f1522dace9e542eecaa89e727dcfc7494b86b533aca219af169119a6f2ab5` | `83c66b0b5ae74cb858c9c5d57e58ab77e38a45d2a81ff0ad46ed36bc601c4d94` |
| 0037 | `9c09a6dcce033a2f6c8c0563fd3f47c233540ec286bc55689e217b1f062d92d6` | `78bab0ba3f43531c88c6a594496b488a5e7c102a40e64397050753cbb3a4fda6` | `4c947c6d8519af46faf3c5bf274405c44227a7a892486e576de112db1a63263e` |
| 0038 | `42c1e2bef45a048e65436f60789ee3f6deb3c420741cebbd00fa4932acd0ce69` | `1b8ddae67b63ec0335fb919fdb5d3f2ba20587a44df5e9cda592dd818a0a8f62` | `38b507026dbdaa7ae478b150a1c848b04da3001c7846572b65f65127bc85efd0` |

Original PNG hashes:

- 0035: `c525f938f126f8acc3bea2b4b676cea7c74ac953a901d9f89dc8ec6ba3263f7c`.
- 0036: `b9240fdea2d995f590ae6b73f39292f61c4258be2aefeedc96417f204313fc30`.
- 0037: `1b4d0456fa48d27e1888367920905e7db29bea283e0ecca336318b7d4f3fa1e7`.
- 0038: `240b9f30df2c58441a0811d79caa6028f646cf571bebaddd0061a46ccc90b199`.

Source PDF binding: `47b0358c5781f509ce35e0e22de13c6bb539b246099ade66e8856c9288954e40`. Actual printed29/30/31/32 individually establish physical-minus-printed6 for this batch.

Complete98-file evidence manifest: `source-10c-p35-p38-evidence/hashes.json`, SHA256 `0cfe3e930f67a92a95a52781bce26cade51d65da203bbc31e5033ca70a67774a`. It binds every source/grid/template/layout, source-first note, authored initial MD, first-result snapshots, streams/commands, durable triple and actual generated crop, including the failed38 result.

## Immutable Stop

All four page MDs and their sole actual finalize results are retained. Batch cannot be handed off as gate-passed because physical38 is FAIL14/16. No corrective content/count work, post-failure image cycle, second finalize or follow-on stage was started. Source-first independent review belongs solely to Ptolemy; this author report does not provide that approval.
