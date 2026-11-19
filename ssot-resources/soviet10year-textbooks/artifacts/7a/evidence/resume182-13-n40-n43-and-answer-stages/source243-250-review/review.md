# STEMROBIN-182 Independent FIRST Source Review: 0243-0250

Date: 2026-11-19.
Checkout: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.
Observed branch: `codex/STEMROBIN-182-textbooks`.
Scope: faithful cap1 source pages only; one complete content review.

## Verdict

**PASS on all eight pages; no affected repairs requested.**

| Physical page | Printed page | Independent visual rows, including foot | Block row counts in order | Verdict |
| --- | --- | --- | --- | --- |
| 0243 | 237 | 24 | 2,3,1,3,2,1,1,1,2,3,4,1 | pass |
| 0244 | 238 | 23 | 3,3,6,3,4,3,1 | pass |
| 0245 | 239 | 22 | 1,3,6,2,1,6,2,1 | pass |
| 0246 | 240 | 18 | 2,1,2,1,2,3,3,1,2,1 | pass |
| 0247 | 241 | 21 | 1,2,2,1,3,1,1,3,3,2,1,1 | pass |
| 0248 | 242 | 22 | 2,5,2,1,7,4,1 | pass |
| 0249 | 243 | 21 | 3,7,5,5,1 | pass |
| 0250 | 244 | 21 | 1,4,5,7,3,1 | pass |
| Total | | 172 | | pass |

Findings: none. Thus affected block/row/character/counterfact and repair set are empty.
This is source fidelity approval, not mathematical correctness, full-lesson completion,
modern-edition approval, assembly approval, or production approval.

## Method And Binding

Read the checkout's `.intentfold/readme.md`, project metadata, product and engineering
charters, all four relevant charter Redlines, lesson cap1, production-resume, and image
batch rules. No charter or workflow changes.

Actual pixels were authoritative. Opened exactly the eight prepared `page.grid.png`
files, separately and in physical-page order, using `functions.view_image` with
`detail: original`. Context image count began at 0 and ended at 8. No reopen, crop,
`page.png`, extra figure, other page, browser, or image generation.

For every page, read current durable `page.md`, `page.json`, and `audit.json`; compared
every visible body/title/exercise/footer row, number, sign, radical scope, fraction,
exponent, subpart, and page boundary with the MD and JSON blocks. Independently counted
actual visual rows, including the foot, before accepting their agreement with metadata.
Fractions count as one horizontal mathematical row; real formula wraps count separately.
The following row inventory records the reviewed source wording with the cap1 profile's
simplified Chinese, ASCII punctuation, and LaTeX representation. It is not a proposed
rewrite. A formula split across physical rows remains represented by one formula with
`↵` in durable MD; the inventory displays its actual separate rows.

No author reports, receipts, finalize statuses, or author rowcount evidence were read or
used. No finalizer, prepare, assembler, test, model call, network request, database,
environment, application, dependency, git mutation, or agent operation was run.
Only report files in this directory were written.

`hashes.sha256` binds 24 durable files and the exact 8 viewed grids. Hashing was a
read-only byte-binding step, not content approval. All paths in that manifest are
relative to the exact checkout root above.

## Metadata And Boundaries

Across all eight pages, MD frontmatter agrees with JSON `meta`: schema
`ld-s10y-lesson/page@3`, book `7a`, physical page 243-250, printed page 237-244, 300 dpi,
1504 x 2289, source PDF identity, render identity, and `soviet-cn` profile identity.
The source PDF SHA-256 declared in metadata is
`8070c333ee46fb0dc650cb32d4d898f605ed308559b6cc430425d908dae6b052`;
this review did not independently open/hash the PDF. The declared profile SHA-256 is
`dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849`.
The grids supply visible printed page numbers and page content, not independent proof
of the PDF/profile/render-byte metadata.

JSON block text, labels and `cont/open/samerow` flags match the MD. Figure lists are
empty in MD metadata, page JSON, and audits, consistent with the pixels: zero figures,
zero tables. Independent totals agree with `printed_lines`, `lines_printed`, and
`lines_md` on every page. The audits' empty errors/normalizations/warnings and zero
errata were read only as current metadata; none was substituted for pixel comparison.
No false `samerow` or `labelrow`, empty continuation, or missing source block found.

Boundary facts:

- 0243 begins `p cont` and closes the supplied text-only 0242 `p open` tail:
  `当$a\geq0$时，根式$\sqrt{9a^7}$是有意义的. 把被开方式$9a^7$写成`,
  with intervening foot 236 transparent. No 0242 image was opened.
- 0244 B06 `ex 827 open` ends `里的什么数`; 0245 B01 `ex 827 cont`
  starts `时,等式...成立?` and closes.
- 0246 B09 `p open` ends at the factored fraction without a terminating period;
  0247 B01 `p cont` starts `=...` and closes that formula.
- 0247 B11 `p open` ends `不等式`; 0248 B01 `p cont` supplies the inequality
  and `成立.` and closes.
- 0248 B06 `ex 835 open` supplies а/б/в; 0249 B01 `ex 835 cont` supplies
  г/д/е and closes.
- 0249 B04 `ex 838 open` supplies а through з; 0250 B01 `ex 838 cont`
  supplies и and closes.
- 0250 B05 `ex 842` has both а and б, ending in a period; its `open` flag is false.
  Only foot 244 follows. No open end on 0250.
- The supplied unit boundaries are n40 start 242, n41 start 246, n42 start 252.
  Within the actual eight grids, the only new numbered unit title is 41 on 0246,
  after exercise 833. No heading 42 was seen or expected in this scope. Starts 242
  and 252 remain supplied text context, not extra-page visual review.

Source-printing observations retained, not repair findings:

- 0243 B09 row 16 visibly starts `=\sqrt{(-a)^2}` with no minus immediately after
  the equals sign, although later terms have minus signs. Current MD faithfully
  preserves it. No mathematical correction or erratum requested.
- 0244 exercise 826 and 0245 exercise 828 print `因式`; this is not silently
  changed to `因数`.
- 0245 exercise 829 prints `6;` as its own row and uses numeric method labels
  `1)` and `2)`. Current block preserves these facts.
- 0249 has a small isolated `1` near x20/y1780, outside the text column. Existing
  notes explicitly exclude it from the exercise text. The grid confirms the
  isolated margin mark; it is not an additional body row. This review does not
  identify the unseen neighboring page as its origin.
- Source exercise subpart labels remain Cyrillic; printed formula factor order,
  plus/minus signs and numerical values are not rearranged or "improved."

## Actual Image Ledger

Each entry is one actual image load; initial total 0, final total 8. All are full
prepared grids, 1504 x 2289. No other images were loaded.

| Load | Count transition | Image relative to checkout | SHA-256 |
| --- | --- | --- | --- |
| 1 | 0 -> 1 | `.tmp/ld-s10y-lesson/7a/pages/0243/page.grid.png` | `486d5325adc944d8bbf7f7bd42c81697fe4b7276fee52171db931a8d7115c37e` |
| 2 | 1 -> 2 | `.tmp/ld-s10y-lesson/7a/pages/0244/page.grid.png` | `3b62ae0249576f491a39fa6277d18f44ade0de04b6ac077308252ec6a875dfee` |
| 3 | 2 -> 3 | `.tmp/ld-s10y-lesson/7a/pages/0245/page.grid.png` | `94a310101041c1ccd86affe3e2dadc2c2d9dd620ed2e711462ffd45dd1a74f4c` |
| 4 | 3 -> 4 | `.tmp/ld-s10y-lesson/7a/pages/0246/page.grid.png` | `d938aa753a8bc0131abef2a3f6e5c56414ec42f82d458d1b3599c860b8f491f3` |
| 5 | 4 -> 5 | `.tmp/ld-s10y-lesson/7a/pages/0247/page.grid.png` | `29327ebc7211010bcf205b0a6cd465b9303be9c9c7616df8e6b24ad1017d242d` |
| 6 | 5 -> 6 | `.tmp/ld-s10y-lesson/7a/pages/0248/page.grid.png` | `01bce8ae37dfe2e282b699ce4f7eea178e8916c0995b8f186e66c92b64c441e5` |
| 7 | 6 -> 7 | `.tmp/ld-s10y-lesson/7a/pages/0249/page.grid.png` | `ac21ad8e198ef5cf2a9a5af674e8275431dc99943f95183ea470ad4e864adfa2` |
| 8 | 7 -> 8 | `.tmp/ld-s10y-lesson/7a/pages/0250/page.grid.png` | `a771cc58c49418a47b3f775e857383c7b6ce4772b43dd1f86de639ecc89c9721` |

## Row Inventory

`B01` etc. means the one-based ordinal of the page's JSON `blocks` array, not an
assumed pipeline source-ref ID. `R01` etc. means independent visual reading order
within the physical page, with the footer last. Each block below passed comparison.

### 0243 / Printed 237: Pass, 24 Rows

Block map: B01 p cont R01-02; B02 p R03-05; B03 p R06; B04 p R07-09;
B05 p R10-11; B06 p R12; B07 p R13; B08 p R14; B09 p R15-16;
B10 ex 820 R17-19; B11 ex 821 R20-23; B12 foot R24.

```text
01 两个因式的积,其中一个因子恒等于一个单项式的平方:
02 9a^7=9a^6\times a=(3a^3)^2\times a.
03 那么,根据非负的因式的积的平方根的定理,得:
04 \sqrt{9a^7}=\sqrt{(3a^3)^2a}=\sqrt{(3a^3)^2}\cdot\sqrt{a}=|3a^3|\cdot\sqrt{a}
05 =3a^3\sqrt{a}.
06 例 2 在-4\sqrt{3}的表示式里,把因数移到根号下面.
07 -4\sqrt{3}的值是负的. 因此不能把-4\sqrt{3}写成算术平方
08 根. 但是这个式子可以变形为:
09 -4\sqrt{3}=-1\times4\sqrt{3}=-1\times\sqrt{16}\times\sqrt{3}=-\sqrt{48}.
10 把正因数4移到根号下面以后,我们把-4\sqrt{3}写成了和
11 算术平方根相反的表示式.
12 例 3 在a\sqrt{2}的表示式里,把因数移到根号下面.
13 在式a\sqrt{2}里,因数a可以是非负数,也可以是负数.
14 如果a\geq0, 那么a\sqrt{2}=\sqrt{a^2}\cdot\sqrt{2}=\sqrt{2a^2}.
15 如果a<0, 那么-a>0, a\sqrt{2}=-(-a)\sqrt{2}
16 =\sqrt{(-a)^2}\cdot\sqrt{2}=-\sqrt{a^2}\cdot\sqrt{2}=-\sqrt{2a^2}.
17 820. 从根号下面提出因数:
18 а) \sqrt{12}; б) \sqrt{18}; в) \sqrt{50}; г) \sqrt{48};
19 д) \sqrt{125}; е) \sqrt{108}; ж) \sqrt{363}; з) \sqrt{845}.
20 821. 从根号下面提出因数并化简所得各式:
21 а) \frac{1}{2}\sqrt{24}; б) \frac{2}{3}\sqrt{45}; в) -\frac{1}{7}\sqrt{147};
22 г) -\frac{1}{5}\sqrt{275}; д) 0.1\sqrt{20000};
23 е) -0.05\sqrt{28800}.
24 237
```

### 0244 / Printed 238: Pass, 23 Rows

Block map: B01 ex 822 R01-03; B02 ex 823 R04-06; B03 ex 824 R07-12;
B04 ex 825 R13-15; B05 ex 826 R16-19; B06 ex 827 open R20-22; B07 foot R23.

```text
01 822. 把因数移到根号下面并化简:
02 а) 7\sqrt{10}; б) 5\sqrt{3}; в) 5\sqrt{6};
03 г) 10\sqrt{5}; д) 6\sqrt{\frac{2}{3}}; е) 2\sqrt{\frac{3}{2}}.
04 823. 把因数移到根号下面并化简被开方式:
05 а) 3\sqrt{5}; б) -5\sqrt{2}; в) 2\sqrt{7}; г) -6\sqrt{3};
06 д) 5\sqrt{\frac{a}{5}}; е) -12\sqrt{\frac{c}{2}}; ж) \frac{1}{2}\sqrt{6x}; з) -\frac{2}{3}\sqrt{3y}.
07 824. 比较下列各题里两式的大小:
08 а) 3\sqrt{3}和\sqrt{12}; б) \sqrt{20}和3\sqrt{5};
09 в) 2\sqrt{3}和3\sqrt{2}; г) 5\sqrt{4}和4\sqrt{5};
10 д) \frac{1}{3}\sqrt{54}和\frac{1}{5}\sqrt{150}; е) 3\sqrt{120}和2\sqrt{270};
11 ж) \sqrt{72}和0.5\sqrt{162}; з) \sqrt{24}和\frac{1}{3}\sqrt{216};
12 и) \frac{1}{2}\sqrt{6}和6\sqrt{\frac{1}{2}}; к) \frac{2}{3}\sqrt{72}和7\sqrt{\frac{2}{3}}.
13 825. 按照递增的顺序排列下列各数:
14 а) 3\sqrt{3}; 2\sqrt{6}; \sqrt{29}; 4\sqrt{2};
15 б) 6\sqrt{2}; \sqrt{58}; 3\sqrt{7}; 2\sqrt{14}.
16 826. 从根号下面提出因式:
17 а) \sqrt{7a^2}, 其中a\geq0; б) \sqrt{10y^2}, 其中y<0;
18 в) \sqrt{16x^3}, 其中x>0; г) \sqrt{0.01b^5}, 其中b\geq0;
19 д) \sqrt{50a^7}, 其中a>0; е) \sqrt{27c^6}, 其中c<0.
20 827. а) 变量x是集合 {2, 3, -5, -10} 里的什么数时,
21 等式x\sqrt{3}=\sqrt{3x^2}成立?
22 б) 变量c是集合 {-3, 1, 4, 10, -10} 里的什么数
23 238
```

### 0245 / Printed 239: Pass, 22 Rows

Block map: B01 ex 827 cont R01; B02 ex 828 R02-04; B03 ex 829 R05-10;
B04 ex 830 R11-12; B05 exhead R13; B06 ex 831 R14-19; B07 ex 832 R20-21;
B08 foot R22.

```text
01 时,等式c\sqrt{5}=-\sqrt{5c^2}成立?
02 828. 把因式移到根号下面:
03 а) a\sqrt{3}, 其中a\geq0; б) a\sqrt{3}, 其中a<0;
04 в) x\sqrt{\frac{2}{x}}; г) x\sqrt{-\frac{2}{x}}.
05 829. 用两种方法求表示式6\sqrt{\frac{1}{3}}的值:
06 1) 从平方根表里找出\sqrt{0.3333}的值以后,把结果乘以
07 6;
08 2) 把6\sqrt{\frac{1}{3}}写成\sqrt{12}, 再从平方根表里找出这个式子
09 的值.
10 这两种方法当中,用哪一种方法更方便?
11 830. 查平方根表求下列各式的值:
12 а) 4\sqrt{5}; б) 15\sqrt{2}; в) 14\sqrt{\frac{1}{7}}; г) 12\sqrt{\frac{5}{6}}.
13 复习题
14 831. 计算圆的面积的公式是S=\pi r^2, 其中r是圆的半径.
15 用S表示变量r, 再查表求圆的半径. 设:
16 а) S\approx12.5\mathrm{cm}^2; б) S\approx8.24\mathrm{cm}^2.
17 取\pi\approx3.14.
18 如果圆的面积增加到4倍或减小到1/25, 半径r怎样变
19 化?
20 832. 求下列函数的定义域:
21 а) y=\sqrt{\frac{2x-6}{5}}; б) y=\sqrt{\frac{x-2}{x-1}}.
22 239
```

### 0246 / Printed 240: Pass, 18 Rows

Block map: B01 ex 833 R01-02; B02 h3 R03; B03 p R04-05; B04 p R06;
B05 p R07-08; B06 p R09-11; B07 p R12-14; B08 p R15;
B09 p open R16-17; B10 foot R18.

```text
01 833. 函数用公式y=\frac{1}{3}x^2给出. 如果x\in[0,10], 这个函数
02 取几个整数值?
03 41. 含二次根式的代数式的变形
04 现在我们讨论各种不同的题,解这种题时,需要把含二次
05 根式的代数式变形.
06 1. 化简表示式2.3\sqrt{5}-\sqrt{20}-\sqrt{\frac{1}{5}}.
07 利用从根号下面提出因数的方法可以使\sqrt{20}变形:
08 \sqrt{20}=\sqrt{4\times5}=2\sqrt{5}.
09 利用关于分数的平方根的定理和分数的基本性质使\sqrt{\frac{1}{5}}
10 变形:
11 \sqrt{\frac{1}{5}}=\frac{1}{\sqrt{5}}=\frac{1\times\sqrt{5}}{\sqrt{5}\times\sqrt{5}}=\frac{1}{5}\sqrt{5}=0.2\sqrt{5}.
12 于是
13 2.3\sqrt{5}-\sqrt{20}-\sqrt{\frac{1}{5}}=2.3\sqrt{5}-2\sqrt{5}-0.2\sqrt{5}
14 =\sqrt{5}(2.3-2-0.2)=0.1\sqrt{5}.
15 2. 约分: \frac{\sqrt{15}+2\sqrt{5}}{3+2\sqrt{3}}.
16 因为\sqrt{15}=\sqrt{5}\cdot\sqrt{3}, 3=(\sqrt{3})^2, 那么
17 \frac{\sqrt{15}+2\sqrt{5}}{3+2\sqrt{3}}=\frac{\sqrt{5}\cdot\sqrt{3}+2\sqrt{5}}{(\sqrt{3})^2+2\sqrt{3}}=\frac{\sqrt{5}(\sqrt{3}+2)}{\sqrt{3}(\sqrt{3}+2)}
18 240
```

### 0247 / Printed 241: Pass, 21 Rows

Block map: B01 p cont R01; B02 p R02-03; B03 p R04-05; B04 p R06;
B05 p R07-09; B06 p R10; B07 p R11; B08 p R12-14; B09 p R15-17;
B10 p R18-19; B11 p open R20; B12 foot R21.

```text
01 =\frac{\sqrt{5}}{\sqrt{3}}.
02 把分子和分母同乘以\sqrt{3}, 得:
03 \frac{\sqrt{5}}{\sqrt{3}}=\frac{\sqrt{5}\cdot\sqrt{3}}{\sqrt{3}\cdot\sqrt{3}}=\frac{1}{3}\sqrt{15}.
04 于是,
05 \frac{\sqrt{15}+2\sqrt{5}}{3+2\sqrt{3}}=\frac{1}{3}\sqrt{15}.
06 3. 查平方根表求表示式\frac{3\sqrt{2}+4}{\sqrt{2}-1}的近似值.
07 我们设法化简这个表示式. 把这个分式的分子和分母分
08 解因式不能化简,因此用下面的方法来作: 把这个分式的分
09 子和分母乘以这样一个式子,使得在分母里得到有理数.
10 式\sqrt{2}+1是这种因式当中最简单的一个.
11 实际上,(\sqrt{2}-1)(\sqrt{2}+1)=(\sqrt{2})^2-1^2=2-1=1.
12 于是,
13 \frac{3\sqrt{2}+4}{\sqrt{2}-1}=\frac{(3\sqrt{2}+4)(\sqrt{2}+1)}{(\sqrt{2}-1)(\sqrt{2}+1)}
14 =(3\sqrt{2}+4)(\sqrt{2}+1).
15 作乘法计算后,得到:
16 (3\sqrt{2}+4)(\sqrt{2}+1)=3(\sqrt{2})^2+4\sqrt{2}+3\sqrt{2}+4
17 =3\times2+7\sqrt{2}+4=10+7\sqrt{2}.
18 查表求出\sqrt{2}\approx1.414. 由此得:
19 10+7\sqrt{2}\approx10+7\times1.414=19.898.
20 4. 证明: 对于任何a\geq0和b\geq0, 不等式
21 241
```

### 0248 / Printed 242: Pass, 22 Rows

Block map: B01 p cont R01-02; B02 p R03-07; B03 p R08-09; B04 p R10;
B05 ex 834 R11-17; B06 ex 835 open R18-21; B07 foot R22.

```text
01 \sqrt{a+b}\leq\sqrt{a}+\sqrt{b}
02 成立.
03 显然,对于任何a\geq0和b\geq0来说,\sqrt{a+b}和\sqrt{a}+
04 \sqrt{b}的值是非负的. 我们来比较它们的平方的大小:
05 (\sqrt{a+b})^2=a+b;
06 (\sqrt{a}+\sqrt{b})^2=(\sqrt{a})^2+2\sqrt{a}\cdot\sqrt{b}+(\sqrt{b})^2
07 =a+b+2\sqrt{a}\sqrt{b}.
08 因为2\sqrt{a}\sqrt{b}\geq0, 所以
09 (\sqrt{a+b})^2\leq(\sqrt{a}+\sqrt{b})^2.
10 由此 \sqrt{a+b}\leq\sqrt{a}+\sqrt{b}.
11 834. 化简:
12 а) \sqrt{75}+\sqrt{48}-\sqrt{300};
13 б) 3\sqrt{8}+2\sqrt{18}-\sqrt{50};
14 в) \sqrt{242}-\sqrt{200}+\sqrt{8};
15 г) \sqrt{54}+\sqrt{96}-\sqrt{150};
16 д) 6\sqrt{\frac{1}{3}}-\sqrt{12}+\sqrt{3};
17 е) 40\sqrt{\frac{2}{5}}-\sqrt{1000}+2\sqrt{10}.
18 835. 化简下列各式再查表求它们的值:
19 а) 3\sqrt{2}+\sqrt{32}-\sqrt{200};
20 б) 2\sqrt{72}-\sqrt{50}-2\sqrt{8};
21 в) 5\sqrt{3}+\frac{1}{3}\sqrt{27}-\sqrt{48};
22 242
```

### 0249 / Printed 243: Pass, 21 Rows

Block map: B01 ex 835 cont R01-03; B02 ex 836 R04-10;
B03 ex 837 R11-15; B04 ex 838 open R16-20; B05 foot R21.
Margin `1` excluded as described above.

```text
01 г) \sqrt{80}+\frac{1}{2}\sqrt{20}+3\sqrt{45};
02 д) \sqrt{75}-0.1\sqrt{300}-\sqrt{27};
03 е) \sqrt{98}-\sqrt{72}+\frac{1}{2}\sqrt{8}.
04 836. 化简:
05 а) (3\sqrt{5}-2\sqrt{3})\cdot\sqrt{5}+\sqrt{60};
06 б) (\sqrt{28}-2\sqrt{3}+\sqrt{7})\cdot\sqrt{7}+\sqrt{84};
07 в) (\sqrt{12}+2\sqrt{18})\cdot\frac{1}{2}\sqrt{2}-\sqrt{96};
08 г) (4\sqrt{3}-2\sqrt{6}-1)2\sqrt{3};
09 д) (\sqrt{6}+\sqrt{5})^2-\sqrt{120};
10 е) (\sqrt{14}-3\sqrt{2})^2+6\sqrt{28}.
11 837. 分解因式:
12 а) \sqrt{14}-\sqrt{7}; б) \sqrt{33}+\sqrt{22};
13 в) \sqrt{15}-\sqrt{6}; г) 3+\sqrt{3};
14 д) 10-2\sqrt{10}; е) a-5\sqrt{a};
15 ж) b-3\sqrt{b}; з) b-\sqrt{3b}.
16 838. 约分:
17 а) \frac{\sqrt{2}+2}{\sqrt{2}}; б) \frac{5+\sqrt{10}}{\sqrt{10}};
18 в) \frac{2\sqrt{3}-3}{5\sqrt{3}}; г) \frac{a\sqrt{b}+b\sqrt{a}}{\sqrt{ab}};
19 д) \frac{x-\sqrt{ax}}{a\sqrt{x}}; е) \frac{y+b\sqrt{y}}{b\sqrt{y}};
20 ж) \frac{2+\sqrt{2}}{1+\sqrt{2}}; з) \frac{\sqrt{15}-\sqrt{5}}{1-\sqrt{3}};
21 243
```

### 0250 / Printed 244: Pass, 21 Rows

Block map: B01 ex 838 cont R01; B02 ex 839 R02-05; B03 ex 840 R06-10;
B04 ex 841 R11-17; B05 ex 842 R18-20; B06 foot R21.

```text
01 и) \frac{2\sqrt{3}-\sqrt{6}}{\sqrt{8}-2}.
02 839. 化简:
03 а) \frac{x+\sqrt{xy}}{\sqrt{x}+\sqrt{y}}; б) \frac{x-\sqrt{x}}{\sqrt{x}-1};
04 в) \frac{a+\sqrt{6a}}{6+\sqrt{6a}}; г) \frac{p-2\sqrt{p}}{2\sqrt{p}-4};
05 д) \frac{a-4}{\sqrt{a}-2}; е) \frac{b-9}{\sqrt{b}+3}.
06 840. 比较下列各题里两式的大小:
07 а) \sqrt{2.5}和\frac{\sqrt{2}+\sqrt{3}}{2};
08 б) \sqrt{11}-1和\sqrt{5}+\sqrt{7};
09 в) \sqrt{2}+\sqrt{7}和2\sqrt{2}+1;
10 г) \sqrt{5}+\sqrt{7}和3+\sqrt{3}.
11 841. 利用公式(a-b)(a+b)=a^2-b^2化简下列各式:
12 а) (\sqrt{3}-1)(\sqrt{3}+1);
13 б) (\sqrt{11}-3)(\sqrt{11}+3);
14 в) (\sqrt{10}+7)(7-\sqrt{10});
15 г) (2\sqrt{5}+\sqrt{19})(2\sqrt{5}-\sqrt{19});
16 д) (5\sqrt{7}-13)(5\sqrt{7}+13);
17 е) (\frac{1}{2}\sqrt{14}+\sqrt{3})(\sqrt{3}-\frac{1}{2}\sqrt{14}).
18 842. 证明下列各式的值是有理数:
19 а) \frac{1}{3\sqrt{2}-4}-\frac{1}{3\sqrt{2}+4};
20 б) \frac{1}{5+2\sqrt{6}}+\frac{1}{5-2\sqrt{6}}.
21 244
```

Review complete. Image count remains 8. Stop; no source edits or downstream actions.
