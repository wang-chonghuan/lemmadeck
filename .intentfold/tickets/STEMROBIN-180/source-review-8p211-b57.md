# Batch57 Independent SOURCE Review: 8p / 0211

Date: 2026-11-17

**Per-page verdict: PASS.** Physical page 211, printed page 199. No source-fidelity revisions found.

## Scope and Independence

Only `.tmp/ld-s10y-lesson/b57-summaries/{work,artifacts}/8p/pages/0211` was reviewed for content. Read the `ld-s10y-lesson` and `ld-s10y-image` skills first. Opened the original `work/8p/pages/0211/page.png` before any page transcription, JSON, layout, audit, or author notes; then inspected the existing source emphasis crop. Established the following inventory before reading the complete MD/JSON/audit.

This is source transcription and page-boundary review only, not physics correctness, modern-edition, assembly, or publication acceptance. No identity for the preceding lesson or residual exercise was inferred from another page. No other page images or old HOLD reports were read.

## Independent Pixel Inventory

The page has nine textual blocks in this order:

| Position | Source object | Printed rows | Boundary |
| --- | --- | ---: | --- |
| 1 | Untitled, unnumbered exercise residual beginning `生什么现象？` | 2 | Continues from before this page; ends with a question here |
| 2 | Exercise 2, shuttered portholes / suspended shipboard weight | 2 | Closed |
| 3 | Exercise 3, design an acceleration-measuring device | 2 | Closed |
| 4 | Exercise 4, flatcar in uniform circular motion | 2 | Closed |
| 5 | Centered, bold `第六章提要` heading | 1 | Opens the summary, not another exercise |
| 6 | First summary paragraph, initial conditions / force / acceleration | 7 | Closed |
| 7 | Second summary paragraph, translation / center of mass / rotation | 4 | Closed |
| 8 | Third summary paragraph, non-inertial frame | 4 | Closed at `物体可以做匀速运动.` |
| 9 | Right-side footer: round dot, italic 199, round dot | 1 | Footer only |

Visible-row transcription below uses review row numbers, not added source numbering. Baseline solid sentence dots are represented by ASCII `.`; under-dot emphasis is inventoried separately.

```text
01 生什么现象？ а) 站在月台上的观察者； б) 站在车厢里的观察者，怎
02 样解释这个现象？
03 2. 在遮盖住舷窗的船舱里，观察悬挂在船舱顶板上的重物，能否
04 确定轮船的速度和轮船的加速度？
05 3. 试设计一个装置，把它固定在物体上，使得它可以测出物体的
06 加速度.
07 4. 类似本节中所讨论的那样，讨论一下平车做匀速圆周运动时的
08 情况.
09 第六章提要
10 如果除了已知初始坐标和初速度之外，还知道物体所受
11 的力，即如果知道力与坐标或速度的关系，则可以利用牛顿定
12 律解任何力学问题. 此时，必须注意：力或几个力的合力，确
13 定的不是物体的速度（大小和方向），而是物体的加速度. 因
14 此，物体不一定是沿力的方向运动. 物体运动的轨迹不仅决
15 定于物体所受的力，而且还决定于初始条件——物体初速度
16 的大小和方向.
17 只有当物体平动时，才可以把物体的运动看作是质点的
18 运动. 只有在所有力的合力的作用线通过物体的质心这个条
19 件下，物体才作平动. 否则，物体除作平动之外，还要绕某个
20 轴转动.
21 如果相对于非惯性系（相对于某个惯性系做加速运动的
22 参照系）来讨论物体的运动，则牛顿力学定律是不正确的. 相
23 对于非惯性系来说，物体的加速运动不是物体受力引起的，而
24 当有力存在时，物体可以做匀速运动.
25 • 199 •
```

Under-dots occur only beneath the characters of four spans in rows 12-13: `力或几个力的合力`, `确定的不是物体的速度`, `大小和方向`, and `而是物体的加速度`. The second span crosses the printed row break after `确`. Commas, parentheses, and the final baseline period are not under-dotted. These are emphasis marks, not extra textual rows or figures.

No actual figures, tables, captions, displayed formulas, or equation objects are present. Left-margin black blotches and isolated specks are scan artifacts, not content.

## Comparison Findings

- **PASS: exact text and rows.** Complete `page.md` and `page.json` were compared with all 25 visible rows, not only the summary or line-count total. All nine MD block bodies equal the corresponding JSON `lines` arrays; frontmatter equals JSON `meta`. Summary body rows are exactly `7 + 4 + 4 = 15`; including heading, preceding exercises, and footer gives `2 + 2 + 2 + 2 + 1 + 15 + 1 = 25`.
- **PASS: prior material stays separate.** The first block is `<!-- ex cont -->`, JSON `kind: "ex"`, `label: null`, `cont: true`, `open: false`. No missing prefix, exercise number, or title is invented. The next three blocks retain printed exercise numbers `2`, `3`, `4` and are before the summary; they are not summary exercises or prose.
- **PASS: Cyrillic labels.** The residual retains `а)` as U+0430 and `б)` as U+0431, not Latin lookalikes. These are the only Cyrillic characters in the page block text.
- **PASS: heading and closure.** `第六章提要` is one `h3`, followed by exactly three `p` blocks. Every block has `open: false`; the summary has no continuation marker. The final paragraph ends on this page, not at a fabricated cross-page boundary. No `h1`, `h2`, or `exhead` was invented.
- **PASS: punctuation.** The question marks, fullwidth commas/semicolon/colon/parentheses, ASCII exercise-number dots, and baseline sentence dots match. In particular, `律解任何力学问题.` is not rewritten to a different verb; `初始条件——物体初速度` retains the paired long dash; `情况.` and `加速度.` retain solid dots rather than substituted hollow Chinese full stops. Spaces after baseline sentence dots in rows 12, 13, 14, 18, 19, and 22 preserve separation on joining printed lines.
- **PASS: under-dot scope.** MD/JSON use four `*...*` spans with exactly the independently observed characters. The cross-row span is `*确` / `定的不是物体的速度*`; the parentheses and punctuation remain outside emphasis. No emphasis is extended to `因` or the following discussion.
- **PASS: footer style.** `<!-- foot -->` / JSON `kind: "foot"` contains exactly `• *199* •`: U+2022 round dots on both sides and italic page-number digits. It is not plain `199`, a centered-dot substitution, prose, or an exercise.
- **PASS: empty figure contract and provenance.** MD and JSON have `figures: []`; the audit also has `figures: []`. Source physical page is 211, printed page is 199, and the actual original PNG hash matches `meta.render.sha256`. Render dimensions are 1695 by 2580 at the declared 300 dpi. The PDF hash is a declared provenance value only; no PDF or neighboring page was opened for this review.
- **PASS: existing first-finalize result.** Read the supplied existing audit: `lines_printed: 25`, `lines_md: 25`, `errors: []`, `normalizations: []`, `unknown_chars: []`, `katex_warnings: []`, `errata: 0`. The layout has 25 line bands, consistent with the independent inventory. No finalize or gate command was invoked here. The audit does not itself encode historical invocation count; this review does not manufacture one.

No REVISE findings. The source's physics statements are preserved as printed; this verdict does not endorse or modernize them.

## Hash-Bound Evidence

Absolute repository root: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.

The following SHA-256 values were computed read-only from the reviewed files:

| Absolute path | SHA-256 |
| --- | --- |
| `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b57-summaries/work/8p/pages/0211/page.png` | `8ca4b7d0c8164825548061bfd7d632e890a1e023c28ed6e97e4bf56f5cdba75c` |
| `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b57-summaries/work/8p/pages/0211/source211-emphasis.png` | `9794bfa463eb02dbceb6bbd974758161393fa766d606a133a5f0d11b9ff371c9` |
| `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b57-summaries/work/8p/pages/0211/layout.json` | `fb9786321141b5415cb60f8d6915bb5716a6c3356f25b27747a2b459fa9677fb` |
| `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b57-summaries/artifacts/8p/pages/0211/page.md` | `f9792e8634c2702a48333fbf6a5f5c230486ee01fb64cd719f6aac6fa4d73c9e` |
| `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b57-summaries/artifacts/8p/pages/0211/page.json` | `5d4e52c78eee4cbf7acad6f1e09d70df94857641e8a36455c455c14eef4eb802` |
| `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b57-summaries/artifacts/8p/pages/0211/audit.json` | `fff911316c7f6733a302c4d35f37c03af2c35b2aaf7963c4b1480dd8835c25a0` |

Declared source PDF: `8p 苏联中学课本 物理 八年级.pdf`, SHA-256 `4ec6a3d5fafe2c5c861a5053cf8cf047a3a6bd7988a4de799859d6a4fef8cc46`, physical page 211.

Actual images loaded for visual inspection: **2 / 8**. Image 1 was the original `page.png`; image 2 was the existing `source211-emphasis.png`. No reopens, grid images, new crops, generated figures, or browser screenshots were loaded. The original remains the authority; the crop only clarified emphasis. An optional pixel-equality check of the crop could not run because the local lesson venv/Pillow was unavailable; no dependency setup was performed and no pixel-equality claim is made.

Only this review file was written, via `apply_patch`. No source edits, prepare/finalize/gate reruns, vectorizing, assembly, DB access, index changes, old-HOLD changes, staging, or commits were performed. Other agents' work was preserved.
