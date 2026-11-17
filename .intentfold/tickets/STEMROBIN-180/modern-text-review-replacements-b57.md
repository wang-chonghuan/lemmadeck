# STEMROBIN-180 Batch57 Replacement TEXT Review

Review date: 2026-11-17. Fresh independent first review of exactly four replacement courses. Workspace: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.

## Verdicts

| Course | TEXT verdict | Required rework |
| --- | --- | --- |
| `phy8-c2-s1-t1` | **PASS** | None. All four source/modern blocks and five final paragraphs reviewed. |
| `phy8-c4-s2-t1` | **PASS** | None. Both source/modern blocks and three final paragraphs reviewed. |
| `phy8-c4-s2-t15` | **REVISE** | `prose[1]`, `prose[2]`, `prose[3]`: source emphasis spans become visible markup and broken emphasis in the current text pipeline. |
| `phy8-conclusion` | **REVISE** | `prose[1]`: source-relative “上世纪末” lacks a reader-visible historical date anchor. |

These verdicts bind only the twelve template byte hashes below and the inspected text-processing implementation. The PASS introductions can progress independently. A faithful-source PASS is not a modern-display PASS.

## Scope And Independence

- Read the live Plane ticket `5d849725-dbba-4fa6-9233-9967f86bad69` / STEMROBIN-180, the lesson skill, `modern-us-neutral` profile, edition text contract, and project charter. This is a bounded TEXT review, not an IntentFold development/handoff invocation.
- Read every raw `lesson.json`, `lesson.md`, `exercises.json`, every replacement lesson/exercise/figure template, all embedded source snapshots, and all nineteen contributing page-block references. No earlier author/reviewer verdict report was opened or imported.
- Verified all seventeen modern blocks against their source text and page blocks. Actual author edits are exactly ASCII sentence periods/spaces to Chinese full stops, plus Newton/Einstein history declarations. No physics wording, formula, quantity, exercise, figure, or source binding was rewritten.
- All four raw and template courses have zero exercises and zero figures. No questions, answers, images, or figure generation are needed. Images viewed: **0**.
- The human-supplied independent faithful-source PASS and accepted counter repairs remain premises, not rerun author gates. Reading the current durable ledgers confirms physical page 292 = **7/7**, physical page 294 = **11/11**, both with empty errors. This is not a fresh pixel/counter acceptance claim.
- Physical page 292 / printed page 280 closes the summary and has no conclusion heading. Physical page 293 / printed page **281** begins `结束语`; both raw and modern conclusion metadata use `start_page=293`, `start_printed=281`. Current `toc/8p/zh.json` also uses 281. The former TOC 280 boundary is source-backed corrected, not a new defect.
- No source/template/code edits, `adapt-finalize`, answer operations, whole-document rendering, browser/product checks, full checks, DB operations, commits, or ticket mutations were performed. Only this report is owned/written.

## Precise REVISE Findings

### R1: Nested Emphasis Is Not Publishable As Authored

Affected course: `phy8-c4-s2-t15`. Affected blocks: `prose[1]` (`p0291#5`, “运动的”), `prose[2]` (`p0291#6`, “动能”), `prose[3]` (`p0291#7` + `p0292#1`, “势能”). Severity: P2, readability/source-emphasis loss.

Each block faithfully retains this source construct:

```html
<span style="text-emphasis-style: dot; text-emphasis-position: under;">...</span>
```

The current `edition.py:509` sentence splitter treats the two CSS semicolons as prose sentence boundaries; its three-line/180-character grouping at `edition.py:561` then affects the real paragraphs. Independently executed `prose_flow.mjs` and `htmlfrag.js` `proseInline` reproduce these defects:

- `prose[1]` produces final P1 ending inside `style="...under;`, followed by P2 beginning `">运动的</span>...`. This splits the actual sentence inside an attribute.
- `prose[2]` produces P3 containing CSS split across lines and ending with the kinetic-energy sentence, followed by P4 with the theorem's remaining sentences and an unmatched closing `*`.
- `prose[3]` similarly produces P5 with the split CSS/potential-energy sentence and P6 with the two potential-energy formulas and an unmatched closing `*`.
- `proseInline` escapes source `<` and `>` (`htmlfrag.js:13-23`) instead of restoring source emphasis tags. It additionally treats `span`, `style`, `text`, `dot`, `under`, etc. as prose Latin tokens. Thus the HTML fragment displays source tag/CSS text instead of under-dots. For example:

```html
如果&lt;<span class="sr-prose-math">span</span> <span class="sr-prose-math">style</span>="<span class="sr-prose-math">text</span>-<span class="sr-prose-math">emphasis</span>-<span class="sr-prose-math">style</span>: <span class="sr-prose-math">dot</span>;<br>
```

- P1-P6 have **no `<em>`**, and each has a literal unmatched `*`. By contrast summary P0, P7, P8 each have one `<em>` and no exposed stars. The unrelated outer emphasis is not blanket-failed.

Required outcome for each affected block: retain its exact physics text/formulas and the emphasis on the named source words, produce complete sentence/paragraph boundaries outside source markup, and emit displayable emphasis with no literal tag/CSS text or stray `*`. A section-break anchor cannot fix this. Do not delete words, change physics, edit the faithful source, or merely declare a prior gate PASS. Fix ownership remains with the author/integrator; this reviewer made no fix. Where the current renderer cannot express retained source emphasis, report/resolve that implementation limitation rather than pretending a punctuation-only edit suffices.

### R2: Relative Century Has Shifted

Affected course: `phy8-conclusion`. Affected block: `prose[1]`, `p0293#3`, final P3-P4. Severity: P2, historical chronology.

The first sentence remains “在上世纪末以前，谁也没有怀疑这些定律的绝对正确性。” The source metadata identifies a 1977 original and a 1980 Chinese edition: its “上世纪末” means **the end of the nineteenth century**. For a reader on **November 17, 2026**, the same unanchored phrase means **the end of the twentieth century**, conflicting with the next source block's “然而，在二十世纪发现...” transition.

Required outcome: a reader-visible source-dated historical anchor that preserves the intended nineteenth-century chronology. A `historical_entities` reason alone is not visible published prose and does not solve this. Keep the faithful `source_text`/snapshot unchanged. This is historical framing, not a request to rewrite the Newtonian/relativistic physics or invent a new contemporary claim. Since the assigned author scope was punctuation/layout plus scientist declarations, an added historical date/context needs author/integrator authorization; this review does not silently expand that scope.

“直到今天” and “没有遇到牛顿定律‘失败’的情况” are read within this block's ordinary-machine examples, not as universal claims overriding the following relativistic/atomic limitations. No separate demand to rewrite those physics statements is made.

## Full Block Coverage

Indices are zero-based. P indices below are the actual in-memory-normalized `prose_flow` output, not manually counted source blocks. All rows PASS source identity, exact page-to-source joining, `source_text`, snapshot equality, source SHA, formula preservation, numeric preservation, and culture checks; the row verdict adds modern semantic/display judgment.

| Course / block | Complete source refs | Final paragraphs | TEXT result and substantive review |
| --- | --- | --- | --- |
| `phy8-c2-s1-t1` / 0 | `p0105#4` | P0 | PASS: initial position/velocity plus acceleration describe the kinematics-to-dynamics motivation. No unsupported new formula. |
| `phy8-c2-s1-t1` / 1 | `p0105#5` | P1-P2 | PASS: starting/stopping, speed and direction changes correctly motivate acceleration in a specified reference frame. Magnitude/direction and causes remain distinct. |
| `phy8-c2-s1-t1` / 2 | `p0105#6` | P3 | PASS: transition to dynamics, no invented force law. |
| `phy8-c2-s1-t1` / 3 | `p0105#7` | P4 | PASS: complete definition of dynamics; `*动力学*` emits one `<em>`, no exposed marker. |
| `phy8-c4-s2-t1` / 0 | `p0243#3` | P0-P1 | PASS: introduces work before energy conservation without equating work with effort or adding a universal mechanical-energy claim. |
| `phy8-c4-s2-t1` / 1 | `p0243#4` | P2 | PASS: complete closing question; no need to invent exercises. |
| `phy8-c4-s2-t15` / 0 | `p0291#4` | P0 | PASS within the chapter's constant-force/displacement work model; scalar work and acute/obtuse sign rules are correct. Outer emphasis survives. |
| `phy8-c4-s2-t15` / 1 | `p0291#5` | P1-P2 | REVISE R1: corrupt nested “运动的” emphasis/paragraph boundary. Force-work sum is considered in the stated moving-body, zero-resultant-force model, not as proof that every arbitrarily varying force must do nonzero net work. |
| `phy8-c4-s2-t15` / 2 | `p0291#6` | P3-P4 | REVISE R1: corrupt nested “动能” emphasis and split outer emphasis. Preserves `mv^2/2` and the operative work-energy theorem; see model-scope note below. |
| `phy8-c4-s2-t15` / 3 | `p0291#7`, `p0292#1` | P5-P6 | REVISE R1: corrupt nested “势能” emphasis and split outer emphasis. Complete cross-page join; signed kinetic/potential exchange, height reference, `m|g-vector|h`, `h`, and `kx^2/2` retained. |
| `phy8-c4-s2-t15` / 4 | `p0292#2` | P7 | PASS: expressly isolated system with gravitational/elastic interactions; total mechanical-energy conservation is not generalized to arbitrary interactions. Outer emphasis survives. |
| `phy8-c4-s2-t15` / 5 | `p0292#3` | P8 | PASS in the source's dissipative-friction/internal-energy model. Mechanical-energy loss is not loss of total energy. Complete final source paragraph; outer emphasis survives. |
| `phy8-conclusion` / 0 | `p0293#2` | P0-P2 | PASS: scope of this studied course, Newtonian mechanics, physical measurements and measurement error lead coherently to the accuracy question. Newton declaration is source-bound. |
| `phy8-conclusion` / 1 | `p0293#3` | P3-P4 | REVISE R2: ambiguous source-relative century. Industrial examples/quantities retained; Newton declaration valid. |
| `phy8-conclusion` / 2 | `p0293#4`, `p0294#1` | P5-P6 | PASS: complete cross-page relativity passage, high-speed limitation and low-speed classical limit. Newton and Einstein both retained with source-bound declarations. |
| `phy8-conclusion` / 3 | `p0294#2` | P7 | PASS: atomic-particle quantum limitation prevents reading the preceding low-speed condition as sufficient at every scale. Conservation principles are distinguished from an assertion that unmodified classical formulas hold universally. |
| `phy8-conclusion` / 4 | `p0294#3` | P8 | PASS: complete final reflection on further physics study; no terminal omission or fabricated material. |

### Physics Model Scope

This is a faithful chapter-summary adaptation, not a new general mechanics textbook. Work as force magnitude times displacement magnitude times cosine is evaluated in the constant-vector-force model; a zero displacement/orthogonal force contributes zero work. Variable-force integration, circular-motion counterexamples and a new calculus lesson are not required additions.

The valid kinetic-energy statement is change of kinetic energy equals net work. A nonzero resultant force alone is not a universal guarantee of a nonzero kinetic-energy difference between arbitrary endpoints: a perpendicular force can change direction without speed. Accordingly the summary's introductory “合力不等于零...改变” clause is accepted only as the source's model-dependent lead-in to the stated theorem, not independently certified as that universal implication. This scope note is not a physics-rewriting requirement or an additional REVISE reason.

Potential-energy exchange is read for the stated conservative interactions; the linear height formula is the constant-gravity/local-height model, and the elastic formula is the ideal spring model. Isolated conservative mechanical-energy conservation and dissipative conversion into internal energy are distinct. Static-friction generalizations or cosmological exceptions are not forced into the source summary.

Likewise the conclusion's low-speed classical limit concerns the relativistic comparison; its next block explicitly supplies the quantum-scale limitation. Neither low speed alone nor the retained introductory rhetoric is treated as proof that Newtonian mechanics is exact in every domain. No quantum, strong-gravity, or new conservation-law content is requested.

Two primary textbook pages were read once, text-only via `cloak-fetch`, to check these model limits, not to replace the source or run a research loop: OpenStax *University Physics Volume 1*, 7.1 Work, `https://openstax.org/books/university-physics-volume-1/pages/7-1-work`; and *University Physics Volume 3*, 5.9 Relativistic Energy, `https://openstax.org/books/university-physics-volume-3/pages/5-9-relativistic-energy`. Both returned HTTP 200. The first explicitly distinguishes constant-force endpoint work from general variable-force work; the second gives the low-speed classical approximation and appropriately redefined relativistic conserved quantities.

## Snapshots, Math, Culture, And Quantities

- Every lesson/exercise `source.path` resolves to the designated durable raw file. All eight recorded source SHA-256 values equal current raw bytes; all eight `source.data` objects exactly equal the raw parsed objects. Figure templates have empty `figures`, not a fabricated source snapshot.
- All seventeen blocks retain `kind`, `id`, `label`, `printed_page`, `source_refs` and source order. The nineteen contributing page blocks concatenate exactly to their assembled `source_text`, including both cross-page continuations. No surrounding next-unit material, preceding §75 prose, footers or source line counts leak into modern prose.
- Formula inventory, ordered and exact: summary block 2 `\frac{mv^2}{2}`; summary block 3 `m|\vec{g}|h`, `h`, `\frac{kx^2}{2}`. All four render through the real `proseInline` without `katex-error` or `sr-tex-err`. All other blocks contain no delimited math. Chinese punctuation is outside formulas; no vector arrow, absolute-value bar, exponent, sign, denominator or variable was changed.
- Every block has `numeric_changes=[]`; every lesson has `errata=[]`. All formula and nonformula quantities remain unchanged, including the conclusion's tons/grams and century wording. The date ambiguity is not concealed by falsely claiming a numeric change.
- No profile forbidden terms/names or Cyrillic letters appear in the modern prose. No fictional Russian-name remapping is needed. The source filename/bibliography are source metadata, not modern prose.
- Exactly five history declarations: conclusion blocks 0, 1, 3 each declare `牛顿`; block 2 declares both `牛顿` and `爱因斯坦`; block 4 has none. Each declared term occurs in both its own source and modern text, with a nonempty source-bound historical reason. All other course blocks declare no historical entities. This is not a global culture bypass.
- Empty `section_breaks` resolve to `[]` for every course. No unsupported section boundary is asserted.

## Complete Final Paragraphs

Executed the current layout functions in memory only, then fed the result to the actual `prose_flow.mjs --stdin` and each paragraph to the actual `proseInline`. No normalized JSON was written. The as-authored paragraph counts are **4, 2, 6, 5**; the deterministic normalized counts are **5, 3, 9, 9**. The latter are the 26 paragraphs below. Single newlines denote actual sentence lines; blank lines denote actual paragraph boundaries. The summary's damaged markup and unmatched markers are intentionally recorded, not repaired.

### phy8-c2-s1-t1

```text
P0 [block 0]
在前一章中我们看到，为了根据物体的初始坐标和初速度来计算物体在任意时刻的速度、位移和坐标，必须知道物体的加速度。
现在，我们需要很好地学习加速度的获得。

P1 [block 1]
在某一参考系中，物体开始运动和停止运动，运动变得较快或较慢，运动的方向改变。
在所有这些情况中，我们注意的是速度的变化，即出现加速度。
很明显，知道在什么条件下产生加速度，在什么条件下物体运动没有加速度，如何确定加速度（它的绝对值和方向），是十分重要的。

P2 [block 1]
没有这个就不可能解决力学问题，也不能控制运动。

P3 [block 2]
力学的主要部分——动力学，回答了所有这些问题。

P4 [block 3]
研究产生加速度的原因和讨论计算加速度的方法的这部分力学，叫做*动力学*。
```

### phy8-c4-s2-t1

```text
P0 [block 0]
在上一章我们已经知道了动量守恒定律的重要意义。
另外一个守恒定律——能量守恒定律具有更重要的作用。
但是，在讨论这个定律之前，我们应当先掌握叫做机械功（或简称为功）的这个量。

P1 [block 0]
这个量与能量有密切联系。
此外，它本身也很重要，因为各种机械和机器，以及人们的劳动，通常都要完成机械功。

P2 [block 1]
究竟什么是机械功呢？
```

### phy8-c4-s2-t15

```text
P0 [block 0]
*力的功是一个标量，它等于力的大小、物体位移的大小与力和位移矢量方向夹角的余弦的乘积。
如果这个角是锐角，则功是正的，如果它是钝角，则功是负的。
*

P1 [block 1]
*只有当力对运动的物体作用时，才可以谈到力的功。
如果<span style="text-emphasis-style: dot;
text-emphasis-position: under;

P2 [block 1]
">运动的</span>物体受到几个力的作用，其矢量和等于零（物体做匀速运动），则所有力的功的代数和等于零，但是，每个力所做的功并不等于零（除了其方向垂直于位移方向的一些力）。
*

P3 [block 2]
*如果物体受到的合力不等于零，那么由于这些力的作用，说明物体运动、并叫做物体<span style="text-emphasis-style: dot;
text-emphasis-position: under;
">动能</span>的量$\frac{mv^2}{2}$改变。

P4 [block 2]
它的变化量等于合力的功。
这就是动能定理。
*

P5 [block 3]
*如果物体受到的是重力（万有引力）或弹性力，那么动能的变化量，在绝对值上等于说明物体相互作用、并叫做<span style="text-emphasis-style: dot;
text-emphasis-position: under;
">势能</span>的量的变化量，但相差一负号。

P6 [block 3]
在重力的情况下，相对于规定的零水平面的势能等于$m|\vec{g}|h$，这里$h$是物体在该水平面上的高度。
在弹性力的情况下，势能等于$\frac{kx^2}{2}$。
*

P7 [block 4]
*当物体间彼此以万有引力和弹性力相互作用时，动能和势能的变化量，在绝对值上相等，并相差一负号。
因此，对于相互作用物体的孤立系统来说，满足总机械能守恒定律。
*

P8 [block 5]
*如果除了弹性力和重力之外，还有摩擦力作用，则总机械能不守恒。
它们的一部分要转换为产生摩擦力的物体的内能。
*
```

### phy8-conclusion

```text
P0 [block 0]
力学是一门内容丰富的科学，是内容最丰富的科学——物理学的重要部分之一。
我们只研究了它的基本原理。
力学的许多部分，例如刚体的转动或振动，我们还没有讨论。

P1 [block 0]
力学的一些问题还根本没有解决。
然而，我们所研究的课程，已经描绘了这门科学，更确切点说，描绘了它的一部分的特点，这部分叫做经典力学或牛顿力学，因为它是以牛顿定律为基础的。
我们曾看到：这些定律是以一系列物理量（动量、加速度、质量、力，等等）之间的数学关系式的形式表示出来的。

P2 [block 0]
这些量本身可以利用仪器进行测量来得到。
这些仪器无论做得多巧妙，测量也要有误差。
这就发生了一个问题：牛顿定律精确到什么程度？

P3 [block 1]
在上世纪末以前，谁也没有怀疑这些定律的绝对正确性。
事实上，牛顿定律是在人们开始广泛利用各种机器和工具的时期建立起来的。
直到今天，还是根据牛顿定律来计算复杂机器和机械的结构——从好几吨重的汽轮机和火箭，到其质量不超过几克的精密仪器。

P4 [block 1]
没有遇到牛顿定律“失败”的情况。
这些定律具有巨大的实际意义。

P5 [block 2]
然而，在二十世纪发现牛顿定律毕竟不是绝对精确的。
当物体的运动速度很大，接近于光速时，不能利用牛顿定律。
被称为二十世纪的牛顿的爱因斯坦，总结出来了更普遍的运动规律，对于接近光速的运动也是正确的。

P6 [block 2]
这些规律是所谓相对论力学或相对论的基础。
牛顿定律是这些规律在物体速度远小于光速时的推论。

P7 [block 3]
牛顿定律“不能”用于研究原子内部粒子的运动。
研究这种运动的规律叫做量子力学，从量子力学中作为特殊情况同样可以得到经典力学。
非常出色的是，从牛顿定律导出的动量和能量守恒定律，在量子力学和相对论中也是正确的。

P8 [block 4]
我们看到：力学是所有自然科学的基础。
我们只学习了经典力学的一小部分。
但是，在整个物理课程中，我们必须利用这部分知识。
```

## Hash Binding

All hashes are SHA-256 of file bytes. Template root T:

```text
/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b57-summaries/work/adapt/8p/modern-us-neutral/lessons
```

| Path relative to T | SHA-256 |
| --- | --- |
| `phy8-c2-s1-t1/lesson.template.json` | `5b3dcf627d7dc303fa868eb0d5af5da84a991218345c7fd1e9ef4888fdfdb522` |
| `phy8-c2-s1-t1/exercises.template.json` | `2b3117198cda4e60357fcafe7e7023fc809e87ddbff3c0f3bc6a092ba75f0866` |
| `phy8-c2-s1-t1/figures.template.json` | `548558714c7bfb625fe5b3142f03e8f84207637c97822b803310558dc753ef73` |
| `phy8-c4-s2-t1/lesson.template.json` | `192aff05e227c4c93d723b640a92282313f7fcaf0b0424d6337b03ca1b9d000b` |
| `phy8-c4-s2-t1/exercises.template.json` | `38ad05bb902c596d8e03862faae3d4524c0a5532c844f90ea7c047db2c465708` |
| `phy8-c4-s2-t1/figures.template.json` | `e7bcaf545466bbfd624066afb991fdec8e939100b79eb79eef465d75c9ee56dd` |
| `phy8-c4-s2-t15/lesson.template.json` | `445c0e60e47167cf0f4713e22f94cad855882db9aea981fdd6ccb065d2054e5d` |
| `phy8-c4-s2-t15/exercises.template.json` | `4f7106c3bac9d79f5e337fa480876f558f7fdb8473972f1f541c0f3e95ac98dc` |
| `phy8-c4-s2-t15/figures.template.json` | `a6f65d473919367903596c61c3723123205022e28e773fc74024c7a686516288` |
| `phy8-conclusion/lesson.template.json` | `5247e774045ed9d372d584f1d59946c92e9b56b2f777a76a73bfd758dd293b4b` |
| `phy8-conclusion/exercises.template.json` | `63680e5f021d353fcc53ede8d70cc5f0eac6c34f4013f6ee3b10fdcebd60494f` |
| `phy8-conclusion/figures.template.json` | `da38c5f0c163aaec8acd4637875eff786e822be46f6f1068cf1d90082b035ae0` |

Raw root S:

```text
/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/8p
```

| Source path relative to S | SHA-256 |
| --- | --- |
| `lessons/phy8-c2-s1-t1/lesson.json` | `768794f0658b2f8bc1d8fc37c08e448bfec2c73ee2b5d88956f8b17f71cb7fe6` |
| `lessons/phy8-c2-s1-t1/exercises.json` | `8cf098e491d793bdf68d3d4c6d354243442077ed161a061ecf47be7b6f87e4b4` |
| `lessons/phy8-c4-s2-t1/lesson.json` | `dda2dfb1466cb62a8ba985c2ea578a83d1b579f650222a40c5ac6fefa188df58` |
| `lessons/phy8-c4-s2-t1/exercises.json` | `a045f06d00239778bbd075e559eb26bc6da9a61281be387d663aa97e8e05d9c1` |
| `lessons/phy8-c4-s2-t15/lesson.json` | `0e42fca5e9253c3b56b36f54bce08c21709a33f55745e4b4a0bc3d6ec97baf84` |
| `lessons/phy8-c4-s2-t15/exercises.json` | `5fdfef1d4129ea38b17a50b8934d101c48a126fa7a294c192395eb33948c0b5a` |
| `lessons/phy8-conclusion/lesson.json` | `66c533de5762c864796c497f9888ad3f38e7474353cfe4d73c3ddc6a6741b013` |
| `lessons/phy8-conclusion/exercises.json` | `b8e236726169c14472f8cf7ae0ae53531b648b77c151d9b80fdc753198dfff9b` |
| `pages/0105/page.json` | `a45d3084c55748ac929f837c2c9f2bf508f4873a2e9c0f9d88923ec9b288f690` |
| `pages/0243/page.json` | `fa57198e53577e989afe9735557b23e90460ee62c0baff2467fa0c87b037241c` |
| `pages/0291/page.json` | `3c524fe8e209b101b98d82f2b018b686603cdea63d350646a493ff3cc81e52f0` |
| `pages/0292/page.json` | `a67859bd7a7e88bdcba3f3908a8503d528b7d1f39547d67f75f700d5c6135026` |
| `pages/0293/page.json` | `54d975a898b3ff1ad8c7c5c985b22e4719ecbba23f72de7b2fbf11e941da50fb` |
| `pages/0294/page.json` | `406a84f7f4980f2f9d1e5a1a01835055d6e0dd99c41da88baea3765c42fc8216` |

Source PDF bytes independently hashed: `ssot-resources/soviet10year-textbooks/sources/soviet10years/8p 苏联中学课本 物理 八年级.pdf` = `4ec6a3d5fafe2c5c861a5053cf8cf047a3a6bd7988a4de799859d6a4fef8cc46`, equal to the contributing pages' `pdf_sha256`.

| Implementation/contract path relative to workspace | SHA-256 |
| --- | --- |
| `.claude/skills/ld-s10y-lesson/tools/edition.py` | `1ca989345eaef77baaa3d8d56e4fcab6fdc253339cd5c3f2d93219e286cda6f7` |
| `.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs` | `f2a16357e2a0d5f8541b0cb401c5193c9cb10f6333dc16f92d5c7a18a5bee309` |
| `.claude/skills/ld-s10y-lesson/tools/htmlfrag.js` | `1ef2f96de83a3b2690e6660a6585c6a0d8895b6283ec7b4eaac09aa10612fc92` |
| `.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json` | `f03840602a5de0c22b7eea096fe24db758c6d66b6532c75cda26c6766a1573f1` |
| `.claude/skills/ld-s10y-lesson/references/edition-text-contract.md` | `8deecbc68434e57b30ed8717dc22170a1988a0856af200a1875da58a3334bf90` |

## Execution Record

Unique review-local labels, not author gate recordings:

1. `B57-REPLACEMENTS-INDEPENDENT-TEXT-01-BINDINGS`: read-only assertions of twelve template hashes, eight source hashes/snapshots, zero object counts and punctuation-only changes; PASS.
2. `B57-REPLACEMENTS-INDEPENDENT-TEXT-02-FINAL-FLOW-AND-INLINE`: initial in-memory inspection could not start the nonexistent skill `.venv/bin/python` (`spawnSync` status null); no template verdict inferred from that environment failure and no gate ran.
3. `B57-REPLACEMENTS-INDEPENDENT-TEXT-03-PAGE-COVERAGE`: exact concatenation of all nineteen page refs into seventeen source blocks and current conclusion TOC 281; PASS.
4. `B57-REPLACEMENTS-INDEPENDENT-TEXT-04-AST-EXACT-FINAL-FLOW-AND-INLINE`: used installed `python3 -B` to execute the exact five needed AST nodes from current `edition.py` (`MATH`, `masked_math`, `nesting_depths`, `normalize_prose_layout`, `normalize_lesson_layout`) on in-memory JSON. This avoids importing unrelated dependencies or creating bytecode/files. The actual `prose_flow.mjs --stdin` and `proseInline` then produced all counts, paragraphs and fragment signals above. This is executable fragment evidence, not a browser/whole-document render claim.
5. `B57-REPLACEMENTS-INDEPENDENT-TEXT-05-CULTURE-MATH-COUNTER-FACTS`: exact math inventories, absence of forbidden prose/Cyrillic, source-bound scientist declarations, read-only current counter-ledger facts and actual PDF SHA; PASS.
6. `B57-REPLACEMENTS-INDEPENDENT-TEXT-06-REPORT-BINDING`: report-only write and byte-hash consistency verification against the reviewed inputs. No author gate repeated.

Final independent TEXT disposition: **2 PASS, 2 REVISE**. Required rework is limited to the three identified summary display blocks and the one identified conclusion historical-date block; no physics rewrite is demanded.
