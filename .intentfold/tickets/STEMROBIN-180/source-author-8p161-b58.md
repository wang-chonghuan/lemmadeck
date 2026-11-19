# SOURCEAUTHOR ONLY: 8p physical 0161 / b58

## Outcome

- Existing STEMROBIN-180 invocation; physical 161 only, actual printed footer `• 149 •`.
- SOURCEAUTHOR HOLD: FIRST finalize passed mechanically, but `p0161#8`, printed row 1, lacks the required trailing ASCII space after `重力.` before row 2 begins `但是`. Direct row concatenation would produce `重力.但是`. This is an author spacing omission, not a source-physics correction.
- Preserve this FIRST state for the parent. No repair, second finalize, vectorize rerun, promotion, or claim of source acceptance.
- Prepare exactly once; original page inspected before the generated template; finalize exactly once; figure crop inspected after its successful finalize; vectorize exactly once.
- Authoring used apply_patch. All shell commands used the existing recorder with unique `b58-author161-` labels.
- Five images inspected, all from physical 161: original, grid, first-paragraph crop, emphasis crop, finalized fig-109 crop. No 162 pixels/candidates or other-page content inspected.
- Scope writes: initially absent `.tmp/ld-s10y-lesson/b58-suspended-mass/`, this new report, and unique recorder receipts. No pre-existing dirty file or HOLD edited. No freshness/setup, code changes, Git, backend/network, app DB, publishing, assembly, adaptation, modern figures, answers, choices, promotion, or checkpoint usage.

## Authority And Boundaries

- PDF: `ssot-resources/soviet10year-textbooks/sources/soviet10years/8p 苏联中学课本 物理 八年级.pdf`; actual SHA256 matches manifest.
- Source profile: `soviet-cn`; sentence periods ASCII `.`, math `$P$`, source wording and physics unchanged.
- Authoritative `toc/8p/zh.json`: `phy8-c2-s2-n37` 物体的重量 starts printed 147; `phy8-c2-s2-n38` 用悬挂法测物体的质量 starts printed 149; next `phy8-c2-s2-n39` 地球的质量 starts printed 150.
- Manifest catalog: `8p` source PDF `8p`, `exerciseNumbering: lesson-group`. No exercise or exercise heading on this page.
- Incoming lesson context is n37, not an incoming textual `cont` block. Page first paragraph is visibly indented and independently complete.
- n37's source tail ends before the visible n38 heading; this page supplies that local section boundary, not proof that all preceding n37 pages are complete.
- n38 starts here and is NOT closed: its last paragraph is `open` and ends with a colon awaiting continuation. No n39 heading appears on physical 161.
- Parent's already-reviewed 162 is left entirely unread and unchanged. Full n38 closure was not verified here and must not be inferred solely from next TOC printed 150.

## Full Block Inventory

Block references are one-based `page.json.blocks`.

| Ref | Kind | Rows | Flags | Complete Source Inventory |
| --- | --- | --- | --- | --- |
| p0161#1 | p | 2 | none | Force on spring, not heavy object; named object weight; letter `$P$`. New complete paragraph in n37. |
| p0161#2 | p | 3 | none | Object on horizontal support, source reference 图 109; force on support also named weight. |
| p0161#3 | fig | 0 | none | 图 109 / fig-109; full apparatus described below. |
| p0161#4 | p | 2 | none | Entire printed bold definition of weight retained with `<strong>`. |
| p0161#5 | cap | 1 | samerow | Exact caption `图 109`; shares the first printed row of block #4 and adds zero distinct printed rows. |
| p0161#6 | p | 2 | none | `物体的重量——` followed by under-dot emphasis from `不是作用在物体上` through `悬挂体上的力`; full source statement retained. |
| p0161#7 | p | 3 | none | Support need not be helical spring; thread, metal wire, table; weight acts on them. |
| p0161#8 | p | 3 | none | In discussed examples weight equals gravity, conditional on stationary or uniform straight-line support relative to Earth. Required sentence-boundary trailing space is missing after row 1; HOLD. |
| p0161#9 | p | 2 | none | `应当注意：` followed by under-dot emphasis from `重量和重力不是一回事` through `用在不同物体上`; closes n37's local tail. |
| p0161#10 | h3 | 1 | none | Exact visible heading `38. 用悬挂法测物体的质量`; no h1/h2 or invented title. |
| p0161#11 | p | 6 | open | n38 opening explanation of acceleration-ratio mass measurement and suspension method; final colon requires continuation. No formula invented after it. |
| p0161#12 | foot | 1 | none | Exact visible footer `• 149 •`, retaining both solid dots. |

Totals: 12 blocks = 8 p + 1 fig + 1 cap + 1 h3 + 1 foot. Distinct printed rows 25, transcription rows 25; no cont, one open, one samerow. No exercise, exhead, table, footnote, or additional figure.

## Full Figure Inventory

- One figure, original source 图 109 / `fig-109`, attached to n37's support/weight discussion, not n38.
- Left: tall unloaded helical spring standing on a horizontal support, top plate, visible open coil gaps.
- Right: shorter compressed helical spring on the same support, dark block above it, downward force arrow along the block/spring, label P with a rightward vector accent above P.
- Common support retains its top edge, parallel horizontal strokes and left-side downward supports/strokes. Both spring bases and all original ink remain.
- No numerical scale, extra alphabetic label, axis, panel letter, or tabular values inside the figure.
- Independent caption `图 109` is transcribed, not baked into the cropped apparatus.
- Author rough box `[1195,440,325,235]`; FIRST snapped box `[1206,453,299,215]`, 8 connected components. Saved PNG is 323x239 including crop padding.
- Finalized PNG inspected: complete apparatus and P/vector mark; caption and surrounding prose absent.
- Deterministic original trace only, not a modern redraw. FIRST/only vectorize: 1 pass, 0 failures, reported mismatch 0.000%.

## Exact Incoming And Outgoing Text

Incoming page-first paragraph, exact two source rows, with inline math transcription:

```text
这个力不是作用在重物上，而是作用在弹簧上，把它叫做
物体的重量. 物体的重量用字母 $P$ 表示.
```

Last n37 paragraph before the n38 heading, exact two source rows (under-dot markup omitted here only for readable inventory):

```text
应当注意：重量和重力不是一回事，重量和重力总是作
用在不同物体上.
```

Exact heading:

```text
38. 用悬挂法测物体的质量
```

Outgoing `p0161#11`, exact six source rows, `open: true`:

```text
在第四章中我们已经知道：测量一个物体与作为质量标
准的物体相互作用时加速度的比值，可以确定物体的质量. 显
然，这种方法是很不方便的，实际上往往是不采用的. 现在，
我们讨论另外一种比较方便的测量质量的方法. 这个方法叫
做悬挂法. 悬挂法测质量的基础是：作用在物体上的重力和
该物体的质量彼此成正比：
```

True closure: physical 161 was fully transcribed as the frozen FIRST author state, with the one disclosed spacing HOLD. n37 locally ends; n38 remains open. Nothing beyond 161 was read, assembled, or accepted.

## FIRST Receipts

Receipt root: `.intentfold/tickets/STEMROBIN-180/tmp/commands/`. Each prefix has `.call.json`, `.stdout`, `.stderr`.

| Prefix | Actual Invocation | Result |
| --- | --- | --- |
| b58-author161-prepare-first | prepare --book 8p --page 161 | exit 0; 1695x2580 at 300 dpi; initial 25 printed rows |
| b58-author161-finalize-first | finalize --book 8p --page 161 | exit 0; 12 blocks / 25 of 25 rows; 1 figure; 0 normalizations; line/whitelist/formula pass |
| b58-author161-vectorize-once | vectorize --book 8p --page 161 | exit 0; 1 pass / 0 mismatch failures; mismatch 0.000% |

All three used exactly:

```text
/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/p2c.py
--root .tmp/ld-s10y-lesson/b58-suspended-mass/artifacts
--work .tmp/ld-s10y-lesson/b58-suspended-mass/work
```

FIRST audit also records: empty normalizations, unknown_chars, katex_warnings, errors; errata 0. Mechanical success does not clear the author spacing HOLD.

## SHA256

Source authorities:

```text
4ec6a3d5fafe2c5c861a5053cf8cf047a3a6bd7988a4de799859d6a4fef8cc46  PDF
12799b8b9e414dc4b8ca9fc246cd146a18886a7751aca91aaf9c9618d434baa8  toc/8p/zh.json
904dd05c8987efef50f788c456c412616253c3082bc734c1eb0771ceda1c799a  sources/manifest.json
dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849  profiles/soviet-cn.json
```

Artifact base: `.tmp/ld-s10y-lesson/b58-suspended-mass/artifacts/8p/pages/0161/`.

```text
638b38c91a2485a8c638229f347f440c77e53a195bfc72e981e30e5e4d6dda43  page.md
8bdabba524b5634c913da2ed77dbc5c39d454ad4807a2ccfc4b3eeffa263ada7  page.json
05c9ca5565699cc8ffd5e777c65622d716a66885e17987dd0be18a9810bd2996  audit.json
```

Work base: `.tmp/ld-s10y-lesson/b58-suspended-mass/work/8p/pages/0161/`.

```text
1453faae6d44ad5af9c1883e1489257eee3c50226451a0c01a8f0b475731a9b8  page.png
4742e603377d8f0feb1e5fb155c5d828b8611068fa503ca35351fbf6283fa0b9  page.grid.png
36cf479c95669546e383146175f1acadc7f2dc43aa02a29bf5fa7413bb096db8  page.template.md
076f80b7faff991d0d294c64ed02cec555e805eae0548b317555a156c4c66724  layout.json
ef016e3cf38aa972922e9e02db4ef5ec34fd841df2ba3a2567eb1fd26ff7f991  source-first-paragraph.png
ffcf36653d23f13c7ba895ca5913e520180a71ba8e6e925944fb97a99ea1d727  source-emphasis.png
4cf8bfe1cb7d51d4a367394a46883eb7d36a9238f266972aa2cb2494e884a2de  figures/fig-109.png
f01cf4c216566a9c59f56f4bfbe23a0132598c2e1844065936f581b914c6e81a  figures/fig-109.svg
```

Initial authored page.md before FIRST finalize: `306c496fa86e379451a6f38440a1a94c5547cd4d88bb8dc5c9db229d7d5d5790`, recorded by `b58-author161-authored-before-first`. Finalize deterministically wrote exact figure geometry and provenance; no subsequent manual page edit.

Receipt SHA256:

```text
ba72d931f22ccde6f715b8004a16e954939a72c1f7c03c9ee370e3b7c3a35ef7  b58-author161-prepare-first.call.json
085afc653f92183b609ecfbb9ee6f93a34c616067edf5b2f138e4fc68a6d9fe0  b58-author161-prepare-first.stdout
b513b1fb7358304480dd24fa6d93f244d923fdb63f514de56e74afb8dfb7108d  b58-author161-finalize-first.call.json
48dd4ccfe77f900638299369112e4a3ba4a26ef73cd31db8ddf0e978572e31f1  b58-author161-finalize-first.stdout
a65bde72ed3b5229a6772b898307dad88f568d790ec389737b0f78b364e2eb46  b58-author161-vectorize-once.call.json
9fa00dbf95a6f61873a75676d26dd8fa4bc6f9c1956072db8ba3cfff8eceaff8  b58-author161-vectorize-once.stdout
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  each of the three empty .stderr files
```

Hashes and actual receipt contents are recorded in `b58-author161-output-sha-and-first-receipts.stdout`; the final line explicitly records the missing cross-row space. Stop at physical 161.
