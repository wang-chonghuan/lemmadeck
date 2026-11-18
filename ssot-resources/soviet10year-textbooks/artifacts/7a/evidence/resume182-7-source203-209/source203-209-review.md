# STEMROBIN-182: independent FIRST source review, 7a physical 203-209

Review date: 2026-11-18. Offline, report-only review.

Sole checkout and every shell cwd:
`/Users/yong/.codex/worktrees/d9b1/lemmadeck`.
Sole authorized branch: `codex/STEMROBIN-182-textbooks`.
Branch observed: unknown; no Git command was run.

This report is the only new file written by this reviewer. No candidate, source,
counter, existing report, receipt, or other file was edited or reverted. No
prepare/finalize retry, assembly, new mathematical solution, agent, old chat,
closed worker, network, DB, publisher, application, deployment, or Git operation
was performed.

## Verdict

`PASS` means the inspected source transcription, printed breaks, block/card/group
assignment and boundary facts pass this limited review. It is not modern-figure,
precise crop, assembled-card, full-course, app, publication, or 881 approval.
`REVISE` identifies an actionable page-format defect, even where the source words
and mathematics themselves are retained correctly. Separate HOLDs are not erased
by a source finding or by a zero process exit.

| Physical / printed | Source review | Actual FIRST exit | Retained counter printed / MD | Finding |
| --- | --- | --- | --- | --- |
| 203 / 197 | PASS | 0 | 23 / 23 | Exercise 715 continuation and exercise 721 open boundary agree. |
| 204 / 198 | PASS | 0 | 22 / 22 | Exercise 721 continuation, review group and exercise 728 open boundary agree. |
| 205 / 199 | REVISE | 1 | 25 / 24 | R205-WRAP: literal LF inside a cross-line formula instead of the required `↵`; counter HOLD remains. |
| 206 / 200 | REVISE | 1 | 21 / 20 | R206-WRAP: literal LF inside a cross-line formula instead of the required `↵`; counter HOLD remains. |
| 207 / 201 | PASS | 0 | 22 / 22 | Exercise 733 continuation precedes n32; prose really ends midword. |
| 208 / 202 | PASS | 0 | 22 / 22 | Prose continuation closes; fig-44 and fig-45 reference belong to n32 prose. |
| 209 / 203 | PASS | 0 | 16 / 16 | Whole fig-45, prose table and exact open tail agree; right boundary is unclosed. |

No missing actual source-text row was identified on 205 or 206. The two excess
counter bands have different physical causes, detailed below. This diagnosis
does not repair or rerun either counter, does not convert either exit to zero,
and does not authorize dependent production.

## Contracts And Binding Checks

Read the lesson `SKILL.md`, `references/production-resume.md`, source profile
`profiles/soviet-cn.json`, the page-block contract in the lesson skill and
`tools/blocks.py`, and the image skill's `SKILL.md`.

The supplied author MD SHA-256
`fabe081e72e0f185608087574a0120ab8b6ec8f72cfd12fe0573904b3afa356d`
and author JSON SHA-256
`802de8635f7d4e285205b15a803cc7e4fca6ab0652170eef87b6db7a42264e0c`
were independently recomputed and match.

Both author reports were read, then all seven actual start records, raw stdout,
raw stderr, receipts, durable MD, durable JSON and audits were read. A read-only
Node verification additionally checked:

- All 21 durable output SHA-256 and byte-size bindings against the actual
  per-call receipts, and the author manifest's output bindings.
- All seven MD frontmatters and every parsed block against their JSON
  counterparts, including order, exact line strings, boxes, owners and flags.
- All seven durable audit objects against the audit objects in the actual
  receipts. These audits are not used to infer process exits.
- Receipt identity, start identity, attempt `1`, exact argv, sole cwd, and actual
  receipt exit against the author manifest.
- 45 receipt-bound file checks, including starts/logs/21 outputs/3 figure files;
  28 prepared-input checks; 98 per-start tool/profile/TOC bindings; and 49 author
  manifest start/receipt/log/output bindings. All matched current bytes.
- Exercise subpart markers in the candidates use Cyrillic codepoints, not
  visually similar Latin letters. Source figure references use Cyrillic `а` and
  `б` as appropriate. Original numeric values, radicands, signs, exponents,
  operators and sentence punctuation were compared with the seven grids.

These are file and structural checks, not another pipeline execution. Historical
pre-finalize MD hashes in start records are not expected to equal normalized
post-finalize MD hashes. No original FIRST authored input was reconstructed or
claimed independently recovered.

## Per-Page Observations

### 203

The page begins with exercise 715's `ж, з, и` row followed by `к, л`, then exercises
716-720 and the opening of 721. The printed radicals are retained, including
`0.04`, `25/4`, mixed `2 1/4`, `1 7/9`, `1 24/25`; exercise 716's multiplication
dot and division colon; negative radicands versus an external negative sign in
719/720; and `x-3`, `a+2`, `2b-1` in 721. No new h3, exhead or figure is printed.

Row inventory by object: 715 continuation 2; 716 5; 717 3; 718 3; 719 4;
720 3; 721 2; footer 1 = 23.
The last exercise row ends with a semicolon, not a completed exercise.
`ex 715 cont` closes; `ex 721 open` remains open.

The parent-supplied, independently confirmed page-202 TEXTONLY boundary is used
only for exercise 715: `sqrt(49), sqrt(10000), sqrt(2500)`, then
`sqrt(900), sqrt(0.81), sqrt(0.16)`, ending in a semicolon, transparent footer
`196`. No page-202 image or neighboring review was read. This is not a new
page-202/full-page approval.

### 204

Exercise 721's `г, д, е` and `ж, з` rows close that exercise. The five continuation
radicals, exercises 722-725, two-line 727, the star-replacement instruction in
728 and its punctuation agree with the source. Preserve the distinction between
using an empty root sign in 724 and supplying a radicand; do not invent one.

Row inventory: 721 continuation 2; 722 3; 723 2; 724 3; 725 4;
`复习题` 1; 726 2; 727 2; 728 2; footer 1 = 22.
`复习题` is `exhead`, not a card. Exercises 726-729 belong to this n30 review
group. `ex 728 open` genuinely crosses the page; its subparts are on 205.

### 205

The first four rows are exercise 728's continuation, not the beginning of n31.
Exercise 729 follows, still in n30's `复习题` group. Both systems and their
equations are present. The h3 really starts n31 after these exercises.

The source heading prints an inclusive nonnegative condition, represented by
`a\geqslant0`, while the following definition sentence literally prints `a>0`.
Preserve both source forms. The stricter body condition is visibly source-bound;
no mathematical correction or confirmed erratum is authorized by this review.
Any proposed scientific correction remains HOLD, not implied by this source
reading.

R205-WRAP: at durable `0205/page.md` lines 79-80, corresponding to
`page.json` `blocks[12].lines[0..1]`, the same formula opens on one string and
closes on another without the prescribed `↵`. The source break is specifically
after `0.01\times18=` and before `0.18`. The contract requires a complete formula
with a marked physical break.

Exact format-only requested diff, not applied:

```diff
-因为$(\sqrt{18})^2=18$，所以$(0.1)^2\cdot(\sqrt{18})^2=0.01\times18=
-0.18$.
+因为$(\sqrt{18})^2=18$，所以$(0.1)^2\cdot(\sqrt{18})^2=0.01\times18=↵0.18$.
```

It still represents two printed rows. It must not change a number, operator,
punctuation, total row expectation, audit or counter. A future authorized change
would require affected-only binding/review; the report does not make that change.
The existing single `↵` for 729's two parallel systems is consistent with two
equation rows; adding a second one would incorrectly count the shared lower row
twice.

### 206

The printed example 2 contains the same fractions and two equation-chain rows
as the candidate. Exercises 730-733, including all radical signs and external
negatives, agree. The final row contains only subparts `а, б, в` of 733 and ends
with a semicolon. `ex 733 open` is required.

R206-WRAP: durable `0206/page.md` lines 46-47,
`page.json` `blocks[4].lines[0..1]`, likewise split one math span using literal LF.
The actual break is after the second fraction and before the leading equals
sign. No source-text row is missing.

Exact format-only requested diff, not applied:

```diff
-$\frac{x^2-3}{x+\sqrt{3}}=\frac{x^2-(\sqrt{3})^2}{x+\sqrt{3}}
-=\frac{(x+\sqrt{3})(x-\sqrt{3})}{x+\sqrt{3}}=x-\sqrt{3}$.
+$\frac{x^2-3}{x+\sqrt{3}}=\frac{x^2-(\sqrt{3})^2}{x+\sqrt{3}}↵=\frac{(x+\sqrt{3})(x-\sqrt{3})}{x+\sqrt{3}}=x-\sqrt{3}$.
```

This is only the printed-break encoding prescribed by the page contract. It
neither supplies a new mathematical solution nor repairs the counter.
The current 21/20 failure and original three-file output remain retained.
No domain assumptions or new errata are derived from the printed example or
exercises; scientific adequacy beyond transcription is unadjudicated/HOLD.

### 207

The first row is `г) -a/(3 sqrt(a)).`, closing 733 from 206. Exercises 734-735
and the `复习题`/736 block remain in n31. Preserve their stated `c>0`, `a>0`
conditions and the printed money/weight wording without solving or modernizing
the exercise. The h3 then starts n32, not at the page's first row.

Row inventory: 733 continuation 1; 734 5; 735 3; `复习题` 1; 736 3;
n32 h3 1; first prose 4; second prose 3; footer 1 = 22.
The closed first prose paragraph ends `的横坐标就是无理数.`.
The next paragraph actually ends `而且这个映` without terminal punctuation.
Its `p open` and the following page's `p cont` are correct; footer `201` is
transparent.

### 208

The initial `射是可逆的.` closes the preceding midword continuation. It is not a
new paragraph invented from context and is not open across fig-44.
The source inequalities, decimal-accuracy statements, insufficient/excess
approximation terminology and their printed line breaks agree.
The `即` prefix shares the same physical row as its displayed inequality.

Row inventory: initial continuation 1; fig-44 caption 1; first prose 3;
approximation-method prose 2; square-introduction 1; square identity 1;
`因为` 1; first inequality 1; `即` inequality 1; `所以` 1;
root inequality 1; parenthesized property 2; approximation prose 3;
ten-part-interval prose 2; footer 1 = 22. Figure ink is excluded.
The final paragraph ends with a period and is closed, despite related material
continuing on the next page. The fig-45 reference points forward to 209.

### 209

The grid contains fig-45 as one object comprising all three number lines, one
caption, the two-line introductory paragraph, one unnumbered prose table, and
the remaining derivation prose. Numeric table contents and source inequalities
agree. `即` shares its row with the inequality. The later three-line paragraph
ending `坐标为$\sqrt{5}$的点的一个.` is closed; it is not an open continuation.

Row inventory excluding figure/table ink: caption 1; introductory prose 2;
`从上表可以看出，` 1; inequality 1; `即` inequality 1; `因此，` 1;
root inequality 1; approximation prose 3; subdivision prose 3;
open tail 1; footer 1 = 16.

Exact actual right boundary, in both MD and JSON:

```markdown
<!-- p open -->
从下表可以看出，

<!-- foot -->
203
```

The punctuation is a comma, not a period or colon. There are no additional
words in this open block. No page-210 text, image, next table, continuation flag
or closure was inspected, inferred or supplied. N32 completion/card approval
remains unavailable from this scope.

## 205 Row Inventory And Counter Diagnosis

Coordinates below are saved `layout.json` y bands, read as text and associated
with the actual single grid inspection. Inventory rows are semantic printed
rows under the page contract, not a blind count of projection bands.

| Actual row | Saved y band | Source content / owner |
| --- | --- | --- |
| 1 | 231-263 | 728 а: `a-0.6 * a-0.8；` |
| 2 | 296-330 | 728 б: `a^2-1 * a^2+1；` |
| 3 | 365-400 | 728 в: `a^2-4 * (a-2)(a+2)；` |
| 4 | 432-465 | 728 г: `(a-1)(a+1) * a^2-3.` |
| 5 | 495-533 | `729. 解方程组：` |
| 6 | 567-600 | Parallel upper equations: `x+2y=1,` and `3x-2y=2,` |
| 7 | 654-688 | Parallel lower equations: `2x-y=-8;` and `2x+y=13.` |
| 8 | 782-828 | n31 heading |
| 9 | 884-925 | Definition sentence through `的值是非负数，` |
| 10 | 956-997 | `它的平方等于...下列等式成` |
| 11 | 1033-1059 | `立：` |
| 12 | 1093-1131 | `(sqrt(a))^2=a.` with equation label `(1)` on the same row |
| 13 | 1169-1210 | `在非负数集上（1）式是一个恒等式.` |
| 14 | 1240-1281 | `利用恒等式...某个数的平` |
| 15 | 1314-1351 | `方，例如：` |
| 16 | 1386-1476 | Three parallel examples `2`, `0.5`, `1/7` as printed squares |
| 17 | 1517-1558 | `我们举两个应用恒等式（1）作变形的例子.` |
| 18 | 1587-1627 | Example 1 statement |
| 19 | 1660-1699 | `根据积的幂的性质，得` |
| 20 | 1730-1770 | Printed product-of-powers formula |
| 21 | 1800-1841 | `因为...所以...0.01×18=` |
| 22 | 1879-1909 | `0.18.` |
| 23 | 1943-1984 | `所以，...=0.18.` |
| 24 | 2020-2050 | Footer `199` |

The additional saved band **608-641** contains the vertically centered `а)` and
`б)` labels and the brace region between the two equation rows. Both labels
already exist in candidate block 729; neither an equation nor a prose line is
missing there. This is an offset system-label projection band, not a third
equation row under the binding multirow-systems contract. The actual inventory
has 24 rows; the saved projection has 25 bands. Do not pad 729 or delete its
labels, equations or wrap marker to reconcile it.

This page does not have the parent-described page-196 footnote-separator issue.
Counter diagnosis is localized from pixels plus the retained layout; its repair
and a verified counter result remain HOLD and were not attempted.

## 206 Row Inventory And Counter Diagnosis

| Actual row | Saved y band(s) | Source content / owner |
| --- | --- | --- |
| 1 | 261-346 | Example 2 statement with one inline fraction |
| 2 | 374-412 | `将分式的分子写成平方差的形式：` |
| 3 | 436-476 | Printed square-difference identity |
| 4 | 505-541 | `于是` |
| 5 | 565-661 | Upper equation-chain row: two fractions and one equals sign |
| 6 | 696-759 plus 763-792 | Lower equation-chain row: product fraction, then `=x-sqrt(3).` |
| 7 | 898-937 | `730. 求下列各数的平方：` |
| 8 | 955-1005 | Seven printed radicals from `sqrt(25)` through `-sqrt(6)` |
| 9 | 1031-1119 | `sqrt(1/2)，-sqrt(1.3).` |
| 10 | 1159-1198 | `731. 求下列各式的值：` |
| 11 | 1219-1263 | 731 а, б, в |
| 12 | 1281-1327 | 731 г, д, е |
| 13 | 1362-1451 | 731 ж, з, и |
| 14 | 1497-1595 | 731 к, л; two fraction-containing squares on one row |
| 15 | 1631-1673 | `732. 把给定的下列各数（或式）写成平方的形式：` |
| 16 | 1700-1737 | 732 а, б, в, г |
| 17 | 1760-1806 | 732 д, е, ж, з, with printed `a>0`, `b>0` |
| 18 | 1834-1873 | `733. 化简：` |
| 19 | 1898-1987 | 733 а, б, в; three fractions, terminating semicolon |
| 20 | 2028-2058 | Footer `200` |

Saved bands **696-759** and **763-792** split one physical fraction row. The
lower band's `x+sqrt(3)` is the denominator of the fraction immediately above,
not an independent text/equation row. That denominator is already in
`blocks[4].lines[1]`. The equality and terminal `x-sqrt(3).` belong to the same
row as this fraction. Actual inventory: 20; saved projection: 21. There is no
missing denominator, missing exercise row or page-bottom footnote separator.

This is a tall-fraction denominator split, different from 205's centered labels
and from 196's parent-confirmed footnote separator. R206-WRAP is separately a
format defect; changing that encoding would still represent 20 rows and cannot
legitimately make the counter's 21 correct. Preserve both failed FIRST outputs
and leave counter repair/validation HOLD.

## TOC, Groups And Boundaries

The actual `toc/7a/zh.json` was read. Its n30-n34 starts are:

| Card | Printed start | Physical start | Consequence for this review |
| --- | --- | --- | --- |
| `alg7-c4-s1-n30` | 192 | 198 | Exercises at the beginning of this scope belong to n30. |
| `alg7-c4-s1-n31` | 199 | 205 | Starts at h3 after 728 continuation and 729, not at physical-page top. |
| `alg7-c4-s1-n32` | 201 | 207 | Starts at h3 after 733 continuation, 734-735, review heading and 736. |
| `alg7-c4-s1-n33` | 205 | 211 | Outside scope; do not create this card from page 209. |
| `alg7-c4-s1-n34` | 208 | 214 | Outside scope. |

The section is `alg7-c4-s1`, printed section 10, `二次根式`. Examples are prose,
not numbered exercise cards. Both `复习题` headings are group headings, not h3.
No new group begins on 205 before n31 or on 207 before the printed review
heading. Unclosed objects are 721 across 203-204, 728 across 204-205, 733 across
206-207, prose `而且这个映` / `射是可逆的.` across 207-208, and the independent
209 tail. All observed open/cont flags match these actual source boundaries.

## Figure Inventory Only

No figure PNG, crop, modern figure, screenshot or other image was opened.
The following inventories come only from the assigned page grids. Cropped PNG
hashes were checked as bytes against receipts, not visually approved.

| Figure | Owner | Source inventory | Retained rough -> snapped box |
| --- | --- | --- | --- |
| fig-44, 208 | n32 prose | One horizontal right-arrow number line, marked/labeled `-sqrt(7)`, `0`, `sqrt(5)`, `32/7`; separate `图44` caption. | `[170,350,1090,105]` -> `[182,359,1069,84]` |
| fig-45, 209 | n32 prose, referenced by 208/209 | One figure with three labeled subfigures `а, б, в`, each a right-arrow number line, endpoints labeled `2`, `3`, and a `sqrt(5)` marker. The middle line labels `2.1` through `2.9`; the bottom dense tick line additionally shows `2.2`, `2.3` and leader-labeled `2.23`, `2.24`. Separate `图45` caption. | `[240,240,1110,375]` -> `[256,250,1085,358]` |
| tbl-p0209-02 | n32 prose | One rectangular table, two rows and five columns; first column is the row heading. Row 1: `x, 2.0, 2.1, 2.2, 2.3`; row 2: `x^2, 4.0, 4.41, 4.84, 5.29`. | `[230,895,1145,260]` -> `[237,904,1133,247]` |

The rough regions correspond to the right semantic objects on the grids and
exclude their separate captions/prose. Exact snapped-crop completeness is not
certified without opening the crops, which was forbidden. The table is prose,
not an exercise-owned figure; absence of `owner-ex` is correct. Fig-45 stays one
figure, not three exercise objects. No table is open/cont across this boundary.
Exact fine-tick count/placement and modern FigureSpec/renderer approval remain
unreviewed/HOLD; visible coarse inventory is not a modern mathematics gate.

## Actual FIRST Receipts

Evidence directory:
`/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-7`.

For each N below, the actual saved command is precisely the following argv, with
N substituted as its decimal page, and cwd equal to the sole checkout:

```text
/Users/yong/.codex/worktrees/d9b1/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python
/Users/yong/.codex/worktrees/d9b1/lemmadeck/.claude/skills/ld-s10y-lesson/tools/p2c.py
finalize --book 7a --page N
```

These are historical commands read from start and receipt records; none was run
by this reviewer. All receipts have attempt `1`, `launch_error: null`,
`retry: false`, `post_first_author_edits: false`, and null source/lesson approval.
Actual exit comes from `exit_code`, never from audit errors or output presence.

| N | Start UTC, 2026-11-18 | Finish UTC, 2026-11-18 | Actual exit | Receipt filename / SHA-256 |
| --- | --- | --- | --- | --- |
| 203 | 21:26:10.060480 | 21:26:10.468009 | 0 | `p0203.first.receipt.json` / `ecca215d72d7104033949ab4fd4e54dcefb8a1c1677c5239590a3799b4f9fccb` |
| 204 | 21:26:41.922756 | 21:26:42.369249 | 0 | `p0204.first.receipt.json` / `e6a59aa838eecf60dfd0a4c93be4a33719892f78fa102f865031c217e201271f` |
| 205 | 21:27:48.646528 | 21:27:49.052758 | 1 | `p0205.first.receipt.json` / `5e310d6ffd5653b0cb3d8d2b1252871890c759a3d36919fa42e04bf1bd94dfbb` |
| 206 | 21:28:27.454731 | 21:28:27.858199 | 1 | `p0206.first.receipt.json` / `54336ba4997e8e630104f4de2c8e06877273d1a5b4734455377e1045b01c48eb` |
| 207 | 21:29:03.194309 | 21:29:03.548599 | 0 | `p0207.first.receipt.json` / `2732e79d43adb7db5e4b3981dca6e8867379cb5c55521b3a4598d72a20b3a736` |
| 208 | 21:29:47.245750 | 21:29:47.671044 | 0 | `p0208.first.receipt.json` / `e4bd28f493f7c6d6ab7e40bde31aa55c3773ec91647d83f8ad7e142b76b6a254` |
| 209 | 21:30:47.364106 | 21:30:47.726098 | 0 | `p0209.first.receipt.json` / `74d4a9a35fe393246a122fabaf95ea8e80c7908560829272ba482e27db246abf` |

All raw stderr files were read and are empty (0 bytes), SHA-256
`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

| Page prefix | `first.start.json` SHA-256 | Raw `first.stdout` SHA-256 / bytes |
| --- | --- | --- |
| p0203 | `54f56706d7f87e14e62f09fdd465258617050c767c5f0e4d0570bfe1fbeabfbc` | `5714429af3197164b9498a4c8be1932325d9b41b3963737143c13ecf8816ad25` / 129 |
| p0204 | `dbb843f0c2d427e94ef9ecb57d56dcbc95dc6e40ad02af76a9b38d43350aa44b` | `68f747db852b7916e1d36862b35ae1e305c99982f73f4e389d686eb8d1346e64` / 130 |
| p0205 | `0dd12a72e50f6cd865ffc2051f783e2e639b9f6462dbd0bb37cf859664934c80` | `c01b3be632ae6414c354bdf7ead1792d0b5aef6255dd4ae319820ac9918b5634` / 222 |
| p0206 | `206c35148cf7c0c9aeebe362f2936978f0cac93c94ae6822a4f392e3631195f6` | `159abab19a3c94b55b64f584b1c738594f5e16293ae914baf9b35849356b0fba` / 222 |
| p0207 | `b9af0825b96df2ee97a49f914ad43ba6a9abd8e8d5b957ae34f8bf6b17f201bf` | `7385ad62853f7728499099be24ac63b0da25ac165eda901c91bc35bf6512ac8f` / 129 |
| p0208 | `ebf7951dc1a2b749707aef6d22cc55d685550b109cf5026197d6e6ad4f96997f` | `43c703ac51b92cc189a2bbe4bd17c0377fe9f057cea2fdfe6a46f8f47bcc9959` / 174 |
| p0209 | `3d6286067f6a3722c1090064a3f4e51425f0ebc7ab65291a21893e8932da62f6` | `44cdcc7c824ac5ffe96727a362cafe6401a676dd6385c64f6806642ed1c5666b` / 223 |

## All 21 Durable Output Bindings

Each row names one file relative to this explicit absolute root:
`/Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages`.
Every hash was recomputed and matches the author's final output and the actual
FIRST receipt. These are the unchanged candidates reviewed here.

| File | SHA-256 |
| --- | --- |
| 0203/page.md | `93d57b1ebc623171fa531656ee9f198c50e09294aec20ab65dc8c85fddbe3d7e` |
| 0203/page.json | `ea132ae7c9dae1d1237d6fd3ffbdefaffb4428a9ba0dc3338e0ee08fb3e2ec4b` |
| 0203/audit.json | `a4dab314f9d588a74ec7fc09073e920fb16fd3a57bb42878c335e4bac84868dd` |
| 0204/page.md | `7f6b5399ee8afaca6f73f5cf452ad8246665d1776b4b28efb9f1d731f8199306` |
| 0204/page.json | `74c1cfbe7f2689c12dc9b19696f164f4f41585b06ddcdc1962087de1ac0639e5` |
| 0204/audit.json | `f8aed3d3d2f118b5a8660cf806e8bce22ac92d72d2f3f75910d1f1e6a9731e4d` |
| 0205/page.md | `e1f3cad710d8240af28189062b2e1c5c50e60d8d51d5818572c8ad1237dd80c9` |
| 0205/page.json | `d00b9b641fd29c579a8a12a666b3b89fa105acffdf1f2ff0386261a2356c4ccc` |
| 0205/audit.json | `effeeec5a942a84c1582d300d6c11e048d05bbb126c0fa863affaf2e4b2f09e7` |
| 0206/page.md | `fc6de82ecd32b16ec59f01d734c2ebe30c5eb4db3de3febd7076c2a25e02c8e0` |
| 0206/page.json | `a586c8a7903797c51534651addbb1dfb998b92d11dd4fbc7edbcb8e1fc5e2ac7` |
| 0206/audit.json | `9b34a92bf74dd0d022ce2c5d506e063063d86282a858d9cda99fc6aa5f24a658` |
| 0207/page.md | `6aec4202d696946b72c311b5b61fad174eb986756be3270ed9f5aa07e3532fb9` |
| 0207/page.json | `8240ba2050e1f4df0cea11e49f64f8469d41a104d60d3d3ddd8725e957348a76` |
| 0207/audit.json | `8b5ceb1c231a69e5c3b4c2adcdcfb19a2603910504dad2c445f5ffdbfe1604e3` |
| 0208/page.md | `e463e78f96cf151556d014296ac4d078fefac1686561cce9f6cf65c630d8830f` |
| 0208/page.json | `b65abed05bd4f563d6ea7dd144ac2386c1fd7aa5f3a0081d357d20128d6a7962` |
| 0208/audit.json | `1d992878a8a5f3ddd86c6e83c41f2a03ae38c5768fef878dc3b7f5a662fadf73` |
| 0209/page.md | `d3cfd22738149a4820f158845cef5948da01020a5b3d910129b00ef9fdd0d80c` |
| 0209/page.json | `369bcbdf7b2013ff1a0a12ea0224f862f93574a4229522b93f67893f632d241e` |
| 0209/audit.json | `9a9fc9cfa469b35baa4c8c83d398d1aea61f8bdd05ba4496031e56cd904581bc` |

## Actual Image Calls

Fresh image-free entry. One batch, exactly seven individual
`functions.view_image` calls, each `detail: "original"`, in this order. No crops,
reopens, page-202 image or other image; seven total in batch/context, within the
user's <=7/batch and <=24/context limits. No image payload is returned with the
review.

Root:
`/Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages`.

| Call | Path below that root | SHA-256 |
| --- | --- | --- |
| 1 | 0203/page.grid.png | `2bfc35d6cb7294fb9e2e489372f512da7b6b452307b2b66e83a0f03e0fc735b6` |
| 2 | 0204/page.grid.png | `da3c48ee8b4ea055934715e6a90b3a3ad6d82387e24dccade3a87d25ed8f16dd` |
| 3 | 0205/page.grid.png | `aa3bcb4fff2e9801e5d39f0b375b9c4e49299b5daf3ccfea48ed9498ffa0f380` |
| 4 | 0206/page.grid.png | `01ff879d1170687b42fd878c730e1eb8889c1be43cf39257066a100638c1429f` |
| 5 | 0207/page.grid.png | `5dac73b850a106eaa97f935540593344c70fb785522716e1b1ec17c13333594b` |
| 6 | 0208/page.grid.png | `38241dcd6a98e9fc8d1d76fd256b6cc8ca36ca07a1914458e6bd4583979cd2ff` |
| 7 | 0209/page.grid.png | `ff07ce4d9e7d4d439a8337e9e374c652584b121faf4f81d502ad6ae0168ce8d1` |

Text-read layouts used for diagnosis:
0205/layout.json SHA-256
`18966dd0565dce0767481a2292be1785358d728143f7cdc20e979b7736a0aaed`;
0206/layout.json SHA-256
`b35da0eeb656e66f50fda40540e1d9c201727c5b63fa728370af319c325d93bb`.

## Additional Evidence Hashes

Paths in this section are rooted at the sole checkout, not another worktree.

| Path | SHA-256 |
| --- | --- |
| `.claude/skills/ld-s10y-lesson/SKILL.md` | `f63f3eac20f57814d511b3c792c58637a45627cdbf3fba3f89a59a4980f6ffec` |
| `.claude/skills/ld-s10y-lesson/references/production-resume.md` | `8d489fdcdd1a00866e951958009f6c8602e6b970108f8e7fc87368c3197b6a58` |
| `.claude/skills/ld-s10y-lesson/profiles/soviet-cn.json` | `dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849` |
| `.claude/skills/ld-s10y-lesson/tools/blocks.py` | `1b6540373067b80cdc34ab7973a26ccfc1b21b62f655139731f16408ea072b66` |
| `.agents/skills/ld-s10y-image/SKILL.md` | `d31ecbea164b4c5c0ac781146976f50381466ae4a8931486bdb2e92e29015747` |
| `ssot-resources/soviet10year-textbooks/toc/7a/zh.json` | `e6400aaaef7b352c4c70b7fb282f5982be0addb8bd70656780c968e4dad006b5` |
| `ssot-resources/soviet10year-textbooks/sources/soviet10years/7a 苏联十年制学校数学教材 代数 七年级.pdf` | `8070c333ee46fb0dc650cb32d4d898f605ed308559b6cc430425d908dae6b052` |
| `.tmp/ld-s10y-lesson/7a/pages/0208/figures/fig-44.png` | `b8244509cdf733fe7e2ae54d0692cdbb684b35bcf84a70aa1737f7377ef05ab9` |
| `.tmp/ld-s10y-lesson/7a/pages/0209/figures/fig-45.png` | `b840613b41a3f84fa29c1105cfe2a9b0120856a71734b164ec5bc6852813cbaa` |
| `.tmp/ld-s10y-lesson/7a/pages/0209/figures/tbl-p0209-02.png` | `13975e4addf1ae5e9bcb809b97fc06c35151a06618de4a3bf83f28dba1edbd9b` |

## Reviewer Command Record

All shell invocations used the explicit sole W as `workdir`; none invoked a
pipeline producer or wrote a file. `multi_tool_use.parallel` was used only for
independent read/hash commands. The command operations actually used were:

- `pwd` to confirm W.
- `sed -n` contract reads: `.intentfold/readme.md`, engineering charter, lesson
  skill (including its complete cap1 page contract), production-resume, source
  profile and image skill.
- `rg --files` to locate production-resume/profile/contract/evidence files.
  One inventory also listed existing prepared/durable filenames outside the
  seven pages; no additional page content or images were opened from it.
- `rg -n` on lesson skill, `blocks.py`, `layout.py` and `p2c.py` to locate the
  format and row-count definitions. No source/tool edits or execution followed.
- `cat .claude/skills/ld-s10y-lesson/tools/blocks.py`.
- `cat .intentfold/tickets/STEMROBIN-182/tmp/resume182-7/source203-209-author.md .intentfold/tickets/STEMROBIN-182/tmp/resume182-7/source203-209-author.json`;
  large JSON output was also read through focused `jq` projections of pages,
  receipts, output hashes, TOC, boundaries, holds, figures and FIRST input facts.
- `cat ssot-resources/soviet10year-textbooks/artifacts/7a/pages/020{3,4,5,6,7,8,9}/page.md`.
- `cat ssot-resources/soviet10year-textbooks/artifacts/7a/pages/020{3,4,5,6,7,8,9}/page.json ssot-resources/soviet10year-textbooks/artifacts/7a/pages/020{3,4,5,6,7,8,9}/audit.json`.
- `cat .intentfold/tickets/STEMROBIN-182/tmp/resume182-7/p020{3,4,5,6,7,8,9}.first.start.json`.
- `cat .intentfold/tickets/STEMROBIN-182/tmp/resume182-7/p020{3,4,5,6,7,8,9}.first.receipt.json .intentfold/tickets/STEMROBIN-182/tmp/resume182-7/p020{3,4,5,6,7,8,9}.first.stdout .intentfold/tickets/STEMROBIN-182/tmp/resume182-7/p020{3,4,5,6,7,8,9}.first.stderr`.
- `cat .tmp/ld-s10y-lesson/7a/pages/0205/layout.json .tmp/ld-s10y-lesson/7a/pages/0206/layout.json`.
- `jq '.contents[] | select(.id == "alg7-c4")' ssot-resources/soviet10year-textbooks/toc/7a/zh.json`.
- `nl -ba` on 0205/page.md and 0206/page.md to bind exact actionable lines.
- `shasum -a 256` on author MD/JSON, all 21 outputs, seven grids, both diagnostic
  layouts, contracts/profile/blocks/TOC, source PDF and three existing figure
  PNGs. These were byte reads; only the seven grid calls displayed images.
- One `node -e` read-only verification using `fs.readFileSync`, `fs.statSync`,
  `crypto.createHash("sha256")` and JSON parsing, checking the bindings and MD/JSON
  agreement enumerated above. It used no imports from the pipeline, no image
  decoder, no child process, no network and no write API. It returned exit 0.
- `test ! -e .intentfold/tickets/STEMROBIN-182/tmp/resume182-7/source203-209-review.md`
  returned exit 0 immediately before this new report was created.

The report itself was created with one `functions.apply_patch` Add File at its
absolute authorized path. Final report/source hash checks are read-only.

## Preserved Holds And Limits

The parent's physical-196 fact remains **HOLD: 18 actual text rows plus a
footnote separator counted as a 19th band; existing 19/18 counter unchanged**.
No 196 file/image was read or repaired here. This specific separator diagnosis
must not be substituted for 205's system-label band or 206's denominator split.

205/206 original exits 1 and counters 25/24, 21/20 remain unchanged. Scientific
uncertainties, source errata decisions, crop/modern-figure/fine-tick verification
and the unobserved 209-to-210 closure are HOLD/unadjudicated, not approvals.
Existing SOURCE/figure/881 holds receive no credit from this report.
No full-course, assembled-card, app, production or 881 completion is claimed.

This report's own SHA-256 is returned externally after creation; it deliberately
contains no circular self-hash. There is no optional JSON companion.
