# STEMROBIN-184 NEW N11: independent initial source freeze

Date: 2026-11-23. Scope: physical pages 0046-0049, offline source-first review only.
Sole working directory: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.
This is an independent observation record, not an authored page, finalized
transcription, reconciliation result, or approval of an edition.

## Inputs and actual image usage

Each following original was visually opened exactly once, individually, in this
order. Actual image total: **4**. No other images, crops, reopens, screenshots,
browser pages, or image-bearing histories were loaded.

| Physical / printed page | Original relative to the sole working directory | SHA-256 |
| --- | --- | --- |
| 0046 / 39 | `.tmp/stemrobin-184-six/n11-nov23-source4651/prepared/9c/pages/0046/page.png` | `c38155937133b54ad558d7643270418093e1564550a8db3f6b35bb2d502bd54b` |
| 0047 / 40 | `.tmp/stemrobin-184-six/n11-nov23-source4651/prepared/9c/pages/0047/page.png` | `2376df301f612e7df27a715d45e735acf75c3a10916477e9150addd7f2092101` |
| 0048 / 41 | `.tmp/stemrobin-184-six/n11-nov23-source4651/prepared/9c/pages/0048/page.png` | `615a2e66ee1f30e7511a2ba6a70388413d897be05c25626f650306335005d0fd` |
| 0049 / 42 | `.tmp/stemrobin-184-six/n11-nov23-source4651/prepared/9c/pages/0049/page.png` | `70dcf454d1db7eeacd0983fec3a4276e4284206eb8c3b4d2d58928a6699cf1b8` |

Already-reviewed context was read as text only:
`ssot-resources/soviet10year-textbooks/artifacts/9c/pages/0045/page.md`,
SHA-256 `e403f6dd531ea18842af7c736f7a401e97775f6189a3d1e327e358bf30ca0298`.
Page 0045 was not reopened as an image or independently re-reviewed.
Its N11 heading is `11*. 概率论中比较复杂的应用问题举例`.
Its open example 1 ends with
`证实了这个观察结果. 第一次投掷骰子有6种不同的可能性`;
0046 immediately supplies the parenthetical list completing that sentence.
The context's exercises 74-79 are not new objects in this review.

Read the lesson `SKILL.md`, `references/production-resume.md`, and image
`SKILL.md`, including the image-batch rule. No author candidate/report,
modern-edition draft, answer draft/key, or choice draft was read before or during
this freeze. No network, DB, `.env`, app, dependency, Git, browser, or other-agent
tool operation was performed.

## Recording convention

The stable identifiers below are reviewer observation IDs, not canonical block
numbers. In each source-text fence, a newline preserves a visible printed
baseline/line boundary; a tall fraction remains one formula row, not separate
numerator and denominator lines. These are **not** authoritative line counts:
no recount, finalize, source edit, or count-exclusion registration was run.
LaTeX expresses visible mathematical typography; it does not silently repair
numbers or operators. Chinese source text and Cyrillic subquestion labels are
retained for fidelity. `[r/n?]` is an explicit uncertainty marker, not source ink.
For parallel formulas, LEFT/RIGHT are reviewer layout descriptions, not printed
words or a printed separator.

## Physical 0046 / printed 39

### P46-E1a: example 1 continuation from 0045

```text
(出现1、2、3、4、5或6点). 其中每一种可能性，根据第
二次投掷的结果，又分成6种可能性. 这样，就有36种可能
性. 如果投掷三次，就有6^3=216种不同的可能性，而投掷四
次的话，就有6^4=1296种. 我们自然认为这1296种情况是
等概率的. 但是，其中有5^4=625种情况，6点一次也不出
现，而有1296-625=671种情况，每掷四次6点至少出现一
次. 这就是说，每掷4次骰子，至少出现一次6点的概率
等于：
```

P46-F1 is the next, separately displayed formula row:

```latex
\frac{671}{1296}\approx0.52>\frac{1}{2}.
```

Literal inventory: die faces 1, 2, 3, 4, 5, 6; branching factor 6;
two-roll outcomes 36; `6^3=216`; `6^4=1296`; `5^4=625`;
`1296-625=671`; at least one six in 4 throws; `671/1296`;
approximation `0.52`; strict `>` against `1/2`.

### P46-E1b: paired-dice story and complement calculation

```text
这个谜被揭穿后，有一位玩骰子的人想出了一个新花样.
因为他觉得掷两个骰子出现双六的可能性是掷一个骰子出现
六点的可能性的六分之一(这一点，他是对的)，于是他作出下
面的结论：一对骰子投掷4×6=24次，多半情况至少出现一
次双六. 但是，实验的结果使他失望：一对骰子投掷24次，
至少出现一次双六的情况不多于一半. 当时，玩骰子的人请
帕斯卡解释. 帕斯卡轻易地阐明了这个似是而非的奇论. 两
个骰子每一次，有36种可能的情况，其中只有一种情况出现
双六. 投掷24次的话，一共有36^24种可能的情况，其中有
35^24种情况双六一次也不出现，有36^24-35^24种情况双六至
少出现一次. 至少出现一次双六的概率等于*：
```

P46-F2 is the following single displayed formula row:

```latex
\frac{36^{24}-35^{24}}{36^{24}}
=1-\left(\frac{35}{36}\right)^{24}\approx0.48<\frac{1}{2}.
```

The fence wraps the LaTeX for readability only: **P46-F2 occupies one physical
formula row**, with both equalities and the inequality horizontally continuous.
The printed decimal is **0.48**, not 0.49. This is a clear source reading;
the separate mathematical record must not be used to reinterpret its glyph.
The superscript star after `等于` points to the bottom instructional footnote.

P46-E1c is a new indented concluding line:

```text
可见，概率比1/2稍微小一点.
```

The `1/2` here is visibly a stacked fraction. This closes example 1 on 0046;
it does not continue onto 0047.

### P46-note and scan/content distinction

Instructional footnote, below a short horizontal separator:

```text
* 用对数计算.
```

Footer: `• 39 •`. The short separator, star, and note are genuine visible page
objects; the instructional note must not be dropped as a scan artifact.
Several irregular black blotches along the far left margin, scattered small
specks, and the long bottom-edge black line are outside the text area. They are
scan-margin marks, not dice drawings, extra mathematical signs, figures, or
text baselines. No exclusion boxes or provenance beyond that visual observation
are claimed. No illustration, numbered figure, or table occurs on this page.

## Physical 0047 / printed 40

### P47-E2q: complete example 2 statement

```text
例2. 验收大批产品时，进行抽样检查：从一批100个产
品中抽出20个，只要发现其中有一个废品，这批产品就报废
(或者送去作普遍检查). 这批产品有10个废品. 抽出来的
产品中至少有一个废品的概率是多少？
```

The parameters are 100 total products, 20 sampled, 10 defective; the event is
**at least one** defective product. The source does not say exactly one.
The parenthetical alternative is a full inspection, not a new probability event.

### P47-E2s: complete example 2 solution, interleaved prose and displays

First prose block:

```text
解 从100个产品中抽取20个，不同的抽法总数等于从
100取20的排列数：
```

P47-F1, one displayed row:

```latex
A_{100}^{20}=\frac{100!}{80!}.
```

Next prose:

```text
这些方法中，有
```

P47-F2, one displayed row:

```latex
A_{90}^{20}=\frac{90!}{70!}
```

Next prose:

```text
种情况，抽出来的产品里一个废品也没有. 余下
```

P47-F3, one displayed row:

```latex
A_{100}^{20}-A_{90}^{20}
```

Next prose:

```text
种情况，抽出来的产品里至少有一个废品. 于是，相应的概率
等于
```

P47-F4, one displayed row:

```latex
\frac{A_{100}^{20}-A_{90}^{20}}{A_{100}^{20}}
=1-\frac{90!80!}{100!70!}\approx0.9049.
```

The LaTeX wraps above are not physical row breaks. Literal notation is `A`,
not `C`, at every occurrence. Factorial products `90!80!` and `100!70!`
have no extra factorial around the product. The result `0.9049` is readable.
The solution closes before the following historical paragraph.

### P47-H1: complete historical/methodological paragraph

```text
对于概率论发展的初期来说，例1是很典型的. 数学家研
究的计算概率的问题有相当大一部分是取自赌博、中奖等活
动的. 因为在制作骰子和纸牌以及组织抽彩时，都很注意遵
守各种试验结果的“等可能性”，所以采用有利的情况数目与
相等可能的情况总数之比作为概率的定义，是特别简便的. 近
代在组织抽样检查和抽样统计检验时，也很注意这一点. 但
是，概率论应用的范围并不限于全部可能试验结果容易分为
“等可能”事件的情况. 这里，我们不再阐述如何在较为普通
的情况下定义概率.
```

Its final sentence is complete on 0047. The paragraph starting on 0048 is a
new paragraph, not a missing word or continuation of this sentence.
Historical assertions are frozen as source assertions, not externally verified
historical facts in this offline review.

### P47 scan/content distinction

Footer: `• 40 •`. Irregular black blobs in the far right margin at several
heights, small isolated dots, and the long bottom-edge line are scan marks;
they do not form formulas, figures, captions, or tables. The four math displays
are text/formula objects, not figure assets.

## Physical 0048 / printed 41

### P48-H2: new, complete historical paragraph

```text
20世纪初，人们就把组合分析看作一个完整的、极其重
要的数学分支. 这里采用的专门术语(全排列、组合和排列
等)早已形成. 在20世纪，人们开始把组合作为集合论的第
一章，用来研究有限集合(其子集，集合之间的相互映射等
等)，从而促进了组合分析问题一连串的分类. 最近一个时
期，由于研制复杂的控制设备和计算机以及“信息论”的发展，
组合分析所起的作用有了相当大的提高. 在组合分析方面出
现了大量引起数学家们关注的新课题.
```

Visible emphasis/annotation: a wavy underline below `集合论` in the third
printed line. Its printed-versus-reader-added provenance is not established
by this one image. It does not add a word, value, diagram, or exercise.
Literal dates are `20世纪初` and `20世纪`; no year number is supplied.

### P48-exhead: N11 exercise-group heading

```text
习 题
```

The following exercises 80-86 are complete on 0048.

### P48-X80

```text
80. 罐子里有a个白球、b个黑球，从中抽出两个球. 求这两
个球都是白球的概率.
```

White count `a`, black count `b`, sample size 2, both white; no replacement
instruction is printed.

### P48-X81

```text
81. 10张彩票中有2张有奖. 随机地抽出的5张票中，有а)
一张中奖，б) 两张中奖，в) 至少有一张中奖的概率各是
多少？
```

Labels are the source Cyrillic sequence `а) б) в)`. The line break is after
`а)`; this is not a lost subquestion. Parameters: 10, 2, 5; events exactly
one, exactly two, and at least one winning ticket.

### P48-X82

```text
82. 水果店里有60个西瓜，其中有50个是熟的. 一位顾客
随机地取了两个，这两个瓜都是熟瓜的概率是多少？
```

Parameters 60 total, 50 ripe, 2 taken; event both ripe.

### P48-X83

```text
83. 16个人参加象棋比赛；抽签分成两组，每组8人. 两位最
强的选手а) 分在一组，б) 不在一组的概率是多少？
```

Parameters 16 and 8; two specified strongest players; same versus different
groups. Both subquestions share the second physical line.

### P48-X84: unresolved letter isolated explicitly

```text
84. 一批产品有[r/n?]件，其中有k件废品. 随机抽出的s件产
品中，发现正好有l件废品的概率是多少？
```

The total-population italic letter is r-like in this single opening; I cannot
securely freeze its identity as `r` rather than `n`. This is **U84-total**, a
source-glyph unknown, not a mathematical error. Preserve the ambiguity rather
than choosing a letter from a general hypergeometric formula or a draft.
The other letters are readable as `k`, `s`, and lowercase `l` respectively:
defective count, sample size, and exact defective count in the sample.
No printed formula or parameter-domain constraint accompanies the question.

### P48-X85

```text
85. 投掷一个骰子k次，掷出的点数全不一样的概率等于多
少(k=2,3,4,5,6)？
```

Literal values are **2, 3, 4, 5, 6**, and the event is pairwise distinct results,
not merely different successive throws. The condition appears on the second
physical line, not as a separate exercise.

### P48-X86

```text
86. 五位客人都带着帽子进来. 走时，每个人随便拿了一顶
帽子. 他们都戴别人的帽子的概率是多少？
```

There are **five** guests; every guest takes one hat; the event is that
**all** wear someone else's hat. The object is complete before the footer.

### P48 scan/content distinction

Footer: `• 41 •`. Far-left irregular black blobs, small specks, a faint lower
edge line, and a short lower-right edge mark are outside the content.
No hat drawing, watermelon illustration, tournament diagram, table, or
numbered figure occurs. The questions are prose only.

## Physical 0049 / printed 42

### P49-X87: continuation of the exercise group, not of exercise 86

```text
87. 8本不同的书随便放在一个书架上. 两本指定的书正好
挨着的概率是多少？
```

Eight distinct books; two designated books adjacent; no endpoint requirement.

### P49-X88

```text
88. n个元素的集合分成k个两两不相交(没有公共元素)的
子集合，这些集合分别包含m_1，m_2，…，m_k个元素，数
m_1，m_2，…，m_k两两不相等，而且满足m_1+m_2+…+m_k
=n. 证明有n!/(m_1!m_2!…m_k!)种分法.
```

The final line contains a **stacked fraction**, not a slash in the actual ink:
`\frac{n!}{m_1!m_2!\cdots m_k!}`. That tall fraction belongs to the same
physical text row as `=n. 证明有` and `种分法.`.
The sum crosses the boundary between the third and fourth physical lines,
with **`=n` starting the fourth line**. Distinct group sizes
(`m_i` pairwise unequal) are an explicit condition and must not be omitted.
No `k!` divisor is printed.

### P49-X89

```text
89. 10个元素分成4组：两组各有三个元素，两组各两个元
素. 一共有多少种不同的分法？
```

Ten elements, four groups, sizes 3, 3, 2, 2. The statement does not give group
names or numbered slots. This is the final visible N11 exercise.

### P49-chapter-exhead: new boundary after exercise 89

```text
第二章 补充习题
```

This centered heading is a new chapter-level supplementary-exercise group.
Do not silently append exercises 90 onward to the `习题` group for N11 merely
because they share this physical page. Exact card/TOC ownership beyond this
visible boundary was not looked up in the bounded review.

### P49-X90: complete, two-column formula arrangement

Introductory physical line:

```text
90. 解方程：
```

First physical formula row, left and right:

```text
LEFT а) (n+2)!/n!=72;       RIGHT б) (k+1)!/(k-1)!=30;
```

Second physical formula row, left and right:

```text
LEFT в) (2n)!/(2n-3)!=20n!/(n-2)!;       RIGHT г) k!/(k-4)!=12k!/(k-2)!.
```

Every slash above represents a source stacked fraction. Exact formulas:

- `а) \frac{(n+2)!}{n!}=72`
- `б) \frac{(k+1)!}{(k-1)!}=30`
- `в) \frac{(2n)!}{(2n-3)!}=\frac{20n!}{(n-2)!}`
- `г) \frac{k!}{(k-4)!}=\frac{12k!}{(k-2)!}`

In `в)`, the right numerator is **`20n!`**, with **no parentheses around 20n**;
it is not `(20n)!`. In `г)`, the right numerator is **`12k!`**, not `(12k)!`.
The parentheses in `(2n)!` on the left of `в)` are visible.
The formulas in each row share a baseline; there are no displayed multi-line
equation systems, braces, or vertical stacks of separate subquestions.

### P49-X91: complete inequalities and their physical arrangement

Introductory physical line:

```text
91. 解不等式：
```

First physical formula row:

```text
LEFT а) (n-1)!/(n-3)!<72;       RIGHT б) (2n-1)!/(2n-3)!>420;
```

Second physical formula row, left only:

```text
в) (n+2)!/((n+1)(n+2))<1000;
```

Third physical formula row, left only:

```text
г) ((n-4)(n-3))/(n-3)!>0.00002.
```

Exact stacked-fraction readings:

- `а) \frac{(n-1)!}{(n-3)!}<72`
- `б) \frac{(2n-1)!}{(2n-3)!}>420`
- `в) \frac{(n+2)!}{(n+1)(n+2)}<1000`
- `г) \frac{(n-4)(n-3)}{(n-3)!}>0.00002`

All four comparison operators are **strict**. In `в)`, the denominator is an
ordinary product, **not** a factorial. In `г)`, the numerator is an ordinary
product and the denominator has the factorial. The decimal has four zeros
after the point before 2: **0.00002**.

A handwritten/pen-like note lies below the right-hand `б)` formula. Its full
characters are not securely readable in this opening (**U91-annotation**);
it must not be promoted to a printed condition, solution, or new equation.
This is distinct from uncertainty about the printed `>420`, which is clear.

### P49-X92: complete

```text
92. 用数字0、1、2、3、4一共可以构成多少个没有重复数字的
五位数？
```

Digits include **0**; length is **five**; no repeated digits. Leading-zero
exclusion follows from the mathematical meaning of a five-digit number,
not from a separate printed qualifier.

### P49-X93-open: only the visible beginning

```text
93. 求可以用数字1、2、3组成的、没有重复数字的一切三位
```

The line ends at **`三位`** before the footer. The problem is physically
unfinished and must remain open to 0050. No next-page image/text was read,
and no completion such as `数`, a requested sum, or an answer is frozen.

### P49 scan/content distinction

Footer: `• 42 •`. Far-right black blobs, an isolated lower dot, and the
long bottom-edge line are scan-margin marks, not source diagrams or
continuations. The pen-like note under 91б is located nearer the formulas
but is visually distinct from the typeset exercise. Its provenance and text
remain unknown. No figures, tables, or captions occur on 0049.

## Continuation map and limits

- 0045 text context -> 0046 P46-E1a: the open example 1 sentence continues
  directly, beginning with the parenthetical list of six faces.
- 0046: example 1 closes; starred logarithm note belongs to its paired-dice
  computation. Nothing is pending from its last sentence.
- 0047: example 2 starts and ends; the historical paragraph also ends.
- 0048: a new historical paragraph ends, then `习题` begins; 80-86 each close.
- 0048 -> 0049: the exercise **group** continues with 87, not an `ex 86 cont`.
- 0049: 87-89 close; `第二章 补充习题` starts a distinct group; 90-92 close.
- 0049 -> unseen 0050: exercise 93 remains open at `三位`.

## Source unknowns versus mathematical issues

1. **U84-total:** r-like total-count letter in exercise 84 is not securely
   distinguished from `n`; do not infer it from a desired formula.
2. **U91-annotation:** handwritten note below 91б is not securely transcribed
   and is not printed mathematical content.
3. **U93-tail:** the continuation and complete demand of exercise 93 are
   outside the authorized images. No completion or solution is authorized.
4. Wavy underline under `集合论`: visible mark, provenance unknown.
5. Unnamed-versus-labelled groups in exercise 89 and whether zero is allowed
   by the textbook's factorial-variable convention are interpretation/domain
   questions, not illegible source glyphs; see the mathematical record.
6. **P46-F2 prints 0.48 unambiguously.** Its discrepancy with the numerical
   evaluation is a mathematical approximation issue, not source ambiguity.

Initial freeze ends here. No candidate comparison, source correction,
reconciliation, finalization, publication, or further image loading was done.
