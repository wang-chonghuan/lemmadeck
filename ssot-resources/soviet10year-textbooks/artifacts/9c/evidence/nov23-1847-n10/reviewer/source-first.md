# N10 independent source freeze

- Ticket: STEMROBIN-184; lesson: `ana9-c2-s3-n10`; date: 2026-11-23.
- Sole working directory: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.
- Scope: original-page observations only, before candidate comparison. No author candidate, template, old answer key, or choice key has been inspected.
- Reused entry context supplied by the caller, not reopened here: physical p42 / printed p35 introduces equally likely die outcomes and probability as favorable outcomes divided by the mutually exclusive total; it ends `我们举几个例子.` This is the N10 left boundary, not a fresh transcription of p42.
- Local lesson skill and its linked image-batch rules were read before opening originals. One original per tool call; no crop, resize, or reopen.
- This report's locators are independent observation IDs, not claims about existing extraction block IDs. `p43:L01` means physical page 43, printed body line 1.
- In literal blocks below, each numbered row is one physical body line. Tall fractions and superscripts remain within their physical line; indentation is not reproduced. Standard LaTeX transcribes visible mathematics, not the former raster's unknowable Unicode encoding. Subpart glyphs are represented as `а)` / `б)` using the local transcription convention; this is not an assertion that raster pixels encode Cyrillic. That encoding limitation is not a new content or publication gate.

## Physical p43 / printed p36

Binding:

- Original: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n10-nov23-source4345/9c/pages/0043/page.png`
- SHA-256: `68aaea11ea8680a71b77933cd3e667ed56a78935f3edf5572d234ff70deb2428`
- Raster: 1695 x 2381 px; opened exactly once.
- Visible footer: `36`. No instructional figure or table. Right-margin ink spots and the bottom scan edge are not problem data.

### Literal physical lines

```text
L01 例1. 罐子里有10个大小形状完全一样的小球：3个白
L02 色，2个黑色，5个红色. 随机取出一个小球，发现它：а) 是
L03 红色的，б) 不是黑色的概率等于多少？
L04 因为10个小球大小形状全都一样，所以等可能的情况有
L05 10种（我们可以取出10个小球中任意一个）. 问题а)，有利的
L06 情况的数目是5——根据红球的个数. 因此，事件的概率等
L07 于$\frac{5}{10}=\frac{1}{2}$. 问题б)，有利的情况的数目是8（我们可以取出
L08 3个白球和5个红球中任意一个）. 因此，所求的概率等于
L09 $\frac{8}{10}=\frac{4}{5}$.
L10 例2. 有五条线段，长度分别是1、3、5、7和9厘米. 从
L11 这五条线段中随机取出三条，能够构成三角形的概率是多少？
L12 从给定的五条线段随机取出三条，有$C_5^3=10$种可能性.
L13 统计取出的三条线段能构成三角形的情况数目. 回忆一
L14 下，长度为$a$，$b$，$c$的三条线段（$a\leq b\leq c$），当且仅当$c-b<
L15 a$时才能构成三角形.
L16 如果最短的线段的长$a$等于1，不能构成三角形，这是
L17 因为两个奇数$c$和$b$（$c>b$）的差大于1（这样的情况有$C_4^2$
L18 种，即6种）.
L19 如果最短的线段的长$a$等于3，那么，当$b=5$，$c=7$，或
L20 者$b=7$，$c=9$时，可以构成三角形（如$b=5$，$c=9$，就不能）.
L21 如果最短的线段的长$a$等于5，那么$b=7$，$c=9$. 这种情
L22 况下，取出的线段可以构成三角形.
L23 这样，10种可能的情况中有利情况占了3种. 因此，所
L24 要求的概率等于$\frac{3}{10}$.
```

### Frozen objects and wrapping

| ID | Local reference | Source object | Physical closure |
| --- | --- | --- | --- |
| p43-ex1-stem | p43:L01-L03 | Example 1, ten physically alike balls; 3 white, 2 black, 5 red; one random draw; red / not black subparts | Complete on p43; `白 / 色` wraps at L01/L02 and `是 / 红色的` at L02/L03 |
| p43-ex1-work | p43:L04-L09 | Printed worked counts 10 total, 5 favorable, 8 favorable, and probabilities 1/2, 4/5 | Complete; L06/L07 splits `等 / 于`; fractions at L07 and L09 do not create extra body lines |
| p43-ex2-stem | p43:L10-L11 | Example 2, five lengths 1, 3, 5, 7, 9 cm; randomly select three to form a triangle | Complete stem on p43 |
| p43-ex2-count | p43:L12 | Printed total `C_5^3=10` | Single physical line |
| p43-ex2-condition | p43:L13-L15 | Sorted lengths and strict criterion `c-b<a` | L13/L14 splits `一 / 下`; the inequality wraps after `<` at L14, continues with `a` at L15; not two separate formulas |
| p43-ex2-work | p43:L16-L24 | Printed cases with shortest length 1, 3, 5; counts 6 failures and 3 successes; result 3/10 | Complete on p43; L17/L18 wraps after `C_4^2`; L19/L20 splits `或 / 者`; L21/L22 splits `情 / 况`; L23/L24 splits `所 / 要求` |

### Localized observations / limitations

- p43:L01: the container-name first glyph is heavily inked and is read as `罐`; the ball counts, colors, and physical equality statement are legible. No absent stroke or alternate container condition is supplied.
- p43:L14-L15: the visible sorted inequalities are non-strict, while `c-b<a` is strict. The wrap is physical, not a change to the triangle criterion.
- p43:L16-L18: the original ties `c>b` and a difference greater than 1 to these distinct odd lengths; this is recorded as printed, not generalized to arbitrary equal odd numbers.
- p43:L19-L24: the original itself prints the three successful cases and the answer 3/10. These belong to the literal source; an independent derivation will be kept separately.

## Physical p44 / printed p37

Binding:

- Original: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n10-nov23-source4345/9c/pages/0044/page.png`
- SHA-256: `34cd0bdc00ed4b63df4f92bd321ef9f618f8f67fe68b1165946ad9a8e1385616`
- Raster: 1695 x 2381 px; opened exactly once.
- Visible footer: `37`. One unnumbered instructional table below the prose; it belongs to Example 3, not to a numbered exercise. Left-margin spots and bottom scan-edge ink are not table entries.

### Literal physical prose lines

```text
L01 例3. 投掷两颗骰子，将可能出现的36种结果视为等概
L02 率的. 求掷出的两个点数的和是2、3、4、5、6、7、8、9、
L03 10，11，12的概率
L04 第一个骰子可以掷出6种可能的结果：1、2、3、4、5
L05 和6点. 对应于每个结果，第二个骰子也有1到6点，6种可
L06 能的结果. 这样一来，一共有$6\times6=36$种不同的结果. 根据
L07 题设，这些结果是等概率的. 我们来统计对某一事件（例如，
L08 和等于8点）有利的结果的数目.
L09 可以得到8点的结果有下面几种情况：第一个骰子得6
L10 点，第二个得2点；第一个5点，第二个3点；第一个4点，第
L11 二个4点；第一个3点，第二个5点；第一个2点，第二个6
L12 点. 也就是说，有5种有利的结果. 这样一来，两个骰子能掷
L13 出8点的概率等于$\frac{5}{36}$.
L14 其他事件的概率可以从下表中看出：
```

### Literal table inventory

ID: `p44-ex3-table`; location: below p44:L14, above footer 37.
Four columns, in left-to-right order: `点数` | `有利的结果` | `有利的结果数` | `概率`.
The third column's header physically wraps into `有利的` / `结果数`; it is one header cell. One header band and six data rows are visible. Outer and vertical rules frame the table; there are no numbered figure caption or separate exercise heading.

| Row ID | 点数 (printed) | 有利的结果 (printed) | 有利的结果数 (printed) | 概率 (printed) |
| --- | --- | --- | --- | --- |
| p44:T2 | 2 | 1和1 | 1 | $\frac{1}{36}$ |
| p44:T3 | 3 | 1和2，2和1 | 2 | $\frac{1}{18}$ |
| p44:T4 | 4 | 1和3，2和2，3和1 | 3 | $\frac{1}{12}$ |
| p44:T5 | 5 | 1和4，2和3，3和2，4和1 | 4 | $\frac{1}{9}$ |
| p44:T6 | 6 | 1和5，2和4，3和3，4和2，5和1 | 5 | $\frac{5}{36}$ |
| p44:T7 | 7 | 1和6，2和5，3和4，4和3，5和2，6和1 | 6 | $\frac{1}{6}$ |

Each data row occupies one horizontal row despite vertically stacked fraction glyphs. Entries such as `1和2` and `2和1` are separately printed, not one unordered outcome.

### Frozen objects and wrapping

| ID | Local reference | Source object | Physical closure |
| --- | --- | --- | --- |
| p44-ex3-stem | p44:L01-L03 | Example 3; two dice; 36 equally probable outcomes; all sums from 2 through 12 requested | Complete stem; L01/L02 splits `等概 / 率`; requested sum list wraps after 9 |
| p44-ex3-space | p44:L04-L08 | First and second die each have 1 through 6; `6 x 6 = 36`; equal probabilities explicitly attributed to the problem statement | Complete paragraph; L05/L06 splits `可 / 能` |
| p44-ex3-eight | p44:L09-L13 | Printed ordered pairs (6,2), (5,3), (4,4), (3,5), (2,6), favorable count 5, probability 5/36 | Complete paragraph; L10/L11 splits `第 / 二个`; L11/L12 splits `6 / 点`; L12/L13 splits `掷 / 出` |
| p44-ex3-table | p44:L14, p44:T2-T7 | Table introduction and sums 2 through 7 with ordered results, counts, simplified probabilities | p44 table segment has its own bottom rule; Example 3's request still includes sums 8 through 12, whose source continuation has not yet been viewed |

### Localized observations / limitations

- p44:L03: no terminal punctuation is clearly visible after `概率`; none is added to the literal block.
- p44:L04-L12 and p44:T3: dice are distinguished as first and second. The table confirms that reversing different values yields a different elementary result.
- p44 table: the first header literally says `点数`; interpreting it as the sum is supplied by p44:L02 and L14, not a replacement header silently attributed to the print.

## Physical p45 / printed p38

Binding:

- Original: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n10-nov23-source4345/9c/pages/0045/page.png`
- SHA-256: `12a80fa5de28dceda4d993416601bfc2305492376c264db5d650a821ae4ab277`
- Raster: 1695 x 2381 px; opened exactly once.
- Visible footer: `38`. No table or instructional figure. Page starts with the N10 exercise heading, not a continuation of the dice table.

### Literal physical lines through the N10 right boundary

The uppercase card letters and target word in Exercise 74 are transcribed conventionally as Cyrillic `А В К М О С` and `МОСКВА`, with the source's visible shapes and order preserved. The Latin lookalikes would have the same raster appearance; no former Unicode identity is recoverable or needed for the probability question.

```text
L01 习题
L02 74. 在六张完全相同的卡片上分别写着А、В、К、М、О和С
L03 六个字母. 打乱这些卡片的顺序，然后随机地排成一行，
L04 排出单词МОСКВА的概率是多少？
L05 75. 罐子里有五个编了号码1、2、3、4、5的小球，从中随
L06 机地一个接一个取出两个球. 按号码增加的顺序取出球
L07 的概率等于多少？
L08 76. 罐子里有五个编了号码1、2、3、4、5的小球，从中随
L09 机地一个接一个全取出来. 按号码增加的顺序取出的概
L10 率等于多少？
L11 77. 罐子里有五个编了号码1、2、3、4、5的小球，随机地
L12 一次取出4个球. 这4个球的号码全是奇数的概率是
L13 多少？
L14 78. 小图书馆有十本不同的书，其中有5本各值4个卢布，有
L15 2本各值3个卢布，有3本各值1个卢布. 随机取出两
L16 本. 求它们共值5个卢布的概率.
L17 79. 在8张完全相同的卡片上写着数2、4、6、7、8、11、12
L18 和13. 随机地取出两张卡片. 求这两个数组成的分数是
L19 不可约分数的概率.
L20 11*. 概率论中比较复杂的应用问题举例
```

### N11 visible fragment, boundary record only

The following is outside N10 and is not solved or mathematically reviewed here. It is recorded solely to identify where p45 changes ownership and where the visible next-unit paragraph stays open.

```text
N11:L01 例1. 早在17世纪，玩骰子的人发现，每投掷4次骰子，
N11:L02 多半情况下，至少出现一次6点. 通过用概率论的法则计算
N11:L03 证实了这个观察结果. 第一次投掷骰子有6种不同的可能性
```

The paragraph is unfinished at the page bottom; no unseen continuation is reconstructed. The heading's asterisk is visible and is part of the boundary label.

### Frozen exercises and wrapping

| ID | Local reference | Literal given / request | Physical closure |
| --- | --- | --- | --- |
| p45-ex74 | p45:L02-L04 | Six identical cards bearing six different letters; shuffled then randomly arranged in a row; specified word `МОСКВА` | Entire exercise on p45; letter list is on L02, `六个字母` continues L03 |
| p45-ex75 | p45:L05-L07 | Five balls numbered 1 through 5; sequential random extraction of two; increasing numerical order | Entire exercise; `随 / 机` at L05/L06; final question starts at L07 |
| p45-ex76 | p45:L08-L10 | Five balls numbered 1 through 5; sequential random extraction of all five; increasing order | Entire exercise; `随 / 机` at L08/L09; `概 / 率` at L09/L10 |
| p45-ex77 | p45:L11-L13 | Five balls numbered 1 through 5; take four at once; all four numbers odd | Entire exercise; `是多少` wraps as `是 / 多少` at L12/L13; no order condition |
| p45-ex78 | p45:L14-L16 | Ten distinct books: five priced 4 rubles, two priced 3, three priced 1; randomly take two; total price 5 | Entire exercise; `两 / 本` at L15/L16; distinctness is explicit despite repeated prices |
| p45-ex79 | p45:L17-L19 | Eight identical cards carrying 2, 4, 6, 7, 8, 11, 12, 13; randomly take two; fraction irreducible | Entire exercise; number list wraps after 12; `是 / 不可约分数` at L18/L19 |
| p45-n11-boundary | p45:L20, N11:L01-L03 | Next numbered unit `11*` and visible opening of its first example | Excluded from N10; visible paragraph remains open to the next physical page |

### Localized observations / ambiguities

- p45-ex75 and p45-ex76: no replacement instruction is printed. Reading `取出` / `全取出来` as retaining removed balls gives sampling without replacement; that interpretation and uniform selection will be explicit mathematical assumptions, not extra words attributed to the original.
- p45-ex77: `一次取出4个球` means a four-ball selection, not four independent draws with replacement. Only three odd-numbered balls occur in the printed inventory.
- p45-ex78: elementary selections distinguish all ten books, not merely the three price categories.
- p45-ex79: the original does not specify which selected number becomes numerator. Irreducibility is invariant under reversing a positive numerator/denominator, so this unspecified orientation does not obstruct the requested probability.
- p44-ex3-table / p45:L01: there is no table continuation at the top of p45. The visible original table has sums 2 through 7 only; sum 8 is worked in p44 prose; no printed rows or printed answers for sums 9 through 12 occur in these three originals. Those missing rows must not be invented as literal source objects.

## Completed source freeze

- Image opens: **3**, exactly once each for p43, p44, p45; no crops or reopens.
- N10 inventory: three worked examples (Example 1 has two subparts; Example 3 asks all eleven sums) and six numbered exercises, 74 through 79. Example 3 owns one four-column table with six printed data rows.
- All six exercise stems close on p45. The N10 right boundary is immediately before p45:L20, the `11*` heading.
- Literal objects and physical wrapping are frozen above before author candidates/templates/keys. Independent source math follows in `source-math.md`; N11 math and candidate comparison remain outside this request.
