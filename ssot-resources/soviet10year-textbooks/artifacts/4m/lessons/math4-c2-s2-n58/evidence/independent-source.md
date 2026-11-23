# N58 independent original-source freeze

## Identity and isolation

- Ticket: STEMROBIN-187.
- Book: 4m. Target: math4-c2-s2-n58, 58. 小数的加法.
- Review date: 2026-11-23.
- Every shell command used workdir `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187`.
- This is a fresh independent original-source / blind-mathematics batch, not a comparison with an author's work.
- Before pixels, read the current lesson SKILL.md including inline cap1 transcription rules, production-resume.md, image SKILL.md including image batches, and quality-gate.md. No missing gate file was invented.
- No durable author page.md/page.json, assembled lesson, author observation/solution, modern text/figure/spec/candidate, choice/key, answer book, previous mathematics solution, or other chat was read.
- Original visual input: exactly six images, one batch, individually displayed once in the order below. No visual reopens, new crops, or extra image outputs. One subsequent numerical-only Pillow/NumPy decode of the already inspected fig-222.png supplied centerline measurements; it did not display an image.
- Parent's stated 24/24 exposure remains exhausted; this fresh context used 6/24, with no authorization for another batch.
- This file and its two companion independent evidence files were authored before any author-draft disclosure. No product/tool/DB/publishing/Git/branch/worktree/chat operation was performed.

## Pixel provenance

These are existing input paths and SHA-256 bindings, not new runtime dependencies. Absolute root for all six paths:

`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187`

| Exposure | Input relative to the absolute root | SHA-256 |
| --- | --- | --- |
| 1 | `.tmp/ld-s10y-lesson/4m/pages/0213/page.png` | `a4eefa8a4080bdece443000a571825c0ff277b57f1649c69ed5563c677313378` |
| 2 | `.tmp/ld-s10y-lesson/4m/pages/0214/page.png` | `6afb2869df43c3e94b06a8ca1282df46bc11627d1c224d19081b8a458d37f17f` |
| 3 | `.tmp/ld-s10y-lesson/4m/pages/0215/page.png` | `55eafe959f48ec300e1556310936f9e87ff179347c1f2b4f4640cf4e1b9191b4` |
| 4 | `.tmp/ld-s10y-lesson/4m/pages/0216/page.png` | `3af772c89782e2a95f0c646555f0c3f90a37eb25bc94603b065ead25fadd274c` |
| 5 | `.tmp/ld-s10y-lesson/4m/pages/0214/figures/fig-222.png` | `a2bbe279a2f55e8b0e1066c0bb9db425ae77130e4fcd4994b42e10492920c0cd` |
| 6 | `.tmp/ld-s10y-lesson/4m/pages/0216/figures/tbl-p0216-01.png` | `32c1efa4e2f87c8293ccd88bfdb3537b7385c16fea8cca6d516e7cbd63b4c92a` |

## Scope and boundaries

- Physical 0213 / printed 204: N57 exercise 960 appears above the new section and N58 heading. It is boundary evidence only, not a new exercise target. No N57 HOLD is cleared.
- N58 opens at `§ 9. 加法和减法`, then `58. 小数的加法`.
- Physical 0214 / printed 205: continuation of the addition rule; exercises 961-966; 复习题 starts at 967; figure 222 belongs to 967.
- Physical 0215 / printed 206: exercises 968-971 continue 复习题; 家庭作业题 contains 972-974; the wording of 974 continues into its table on the next physical page.
- Physical 0216 / printed 207: the table of 974 and all of 975 precede `59. 小数的减法`. N59 and its prose are excluded.
- Exactly 15 target source exercises, ordered 961-975, with original printed group boundaries retained.

## Faithful transcription

The following preserves source wording, digits, units, subpart order, and cross-page connections. Printed prose lines are kept on separate lines; source column placement is represented by explicitly ordered subparts. Mathematical typesetting uses LaTeX. These are independent evidence blocks, not replacements for durable author pages.

### Physical 0213 / printed 204

<!-- h2 -->
§ 9. 加法和减法

<!-- h3 -->
58. 小数的加法

<!-- p -->
问题 1. 做一件大衣用料子 $3.14$ 米，做一套西服用料子
$2.83$ 米。做大衣和西服共用了多少米料子？

<!-- p -->
为了解这个题，需要把 $3.14$ 和 $2.83$ 加起来：

<!-- p -->
$3.14+2.83=3\frac{14}{100}+2\frac{83}{100}=5\frac{97}{100}=5.97$.

<!-- p -->
这个题也可以用另一种方法来解，把长度用米和厘米
表示：

<!-- p -->
$3.14$ 米 $+2.83$ 米 $=3$ 米 $14$ 厘米 $+2$ 米 $83$ 厘米
$=5$ 米 $97$ 厘米 $=5.97$ 米。

<!-- p -->
问题 2. 一南瓜重 $6.4$ 公斤，另一南瓜重 $5.28$ 公斤。这
两个南瓜共重多少？

<!-- p -->
由于 $6.4=6.40$，而 $6.40+5.28=11.68$，所以两个南瓜共
重 $11.68$ 公斤。

<!-- p -->
小数加法也和自然数加法一样，可以方便地写成“竖式”：

```text
   3.14          6.40
 + 2.83        + 5.28
 ------        ------
   5.97         11.68
```

<!-- p open -->
二个小数相加，需要：1) 使各加数的小数点后的位数相
等；2) 各加数小数点对齐；3) 和自然数的加法一样作加法；

### Physical 0214 / printed 205

<!-- p cont -->
4) 相加以后，在和的对着加数小数点的位置上点上小数点。

<!-- ex 961 -->
961. 利用变量 $x$ 和 $y$ 写出加法交换律的一般形式。用下列
各值进行验证：

а) $x=7.3$，$y=2.9$；
б) $x=10.24$，$y=19.76$.

<!-- ex 962 -->
962. 利用变量 $a$，$b$ 和 $c$ 写出加法结合律的一般形式。用 $a=$
$40$；$b=38.41$；$c=0.95$ 进行验证。

<!-- ex 963 -->
963. 按数位分解下列各数：
$8.64$；$7.532$；$6.2703$.

<!-- ex 964 -->
964. 做下列加法：

а) $0.769+42.389$；
б) $95.381+3.219$；
в) $5.8+22.191$；
г) $8.9021+0.68$；
д) $2.7+1.35+0.8$；
е) $13.75+8.2+0.115$.

<!-- ex 965 -->
965. 跳伞运动员没有打开降落伞下落 $4$ 秒钟。第一秒的速
度是 $4.9$ 米，以后每一秒的下降速度都比上一秒快 $9.8$
米。这个运动员在这 $4$ 秒钟共下降了多少米？

<!-- ex 966 -->
966. 从一块地里收到 $95.37$ 吨谷物，从另一块地里收到的谷
物比前一块多 $16.8$ 吨。从两
块地里共收到多少吨谷物？

<!-- exhead -->
复习题

<!-- ex 967 -->
967. 射线 $AK$ 是角 $OAP$（图 $222$）
的平分线，而射线 $AM$ 是角
$OAK$ 的平分线。量出角 $KAP$，
计算出角 $OAM$ 的大小。

<!-- fig 图 222 owner-ex 967 -->
Figure 222: see source-figure-inventory.md for the independently observed five labels, four rays, common vertex, one arc, and the upper-endpoint glyph discrepancy.

<!-- cap 图 222 -->
图 222

### Physical 0215 / printed 206

<!-- ex 968 -->
968. 求下列各和：

1) $\frac{3}{10}+\frac{5}{10}$；
2) $\frac{2}{7}+\frac{1}{7}$；
3) $4\frac{3}{11}+1\frac{8}{11}$；
4) $\frac{2}{5}+7\frac{1}{5}$.

<!-- ex 969 -->
969. 两辆公共汽车于不同时间从两地出发相向行驶，两地距
离为 $480$ 公里。第一辆车的速度为 $52$ 公里/小时，第二
辆车的速度为 $42$ 公里/小时。当第一辆车行驶了 $312$
公里后与第二辆相遇。其中一辆车早发车几个小时？

<!-- ex 970 -->
970. 解方程：

1) $(327x-5295):57=389$；
2) $(27x+11)\cdot315=11970$.

<!-- ex 971 -->
971. 求下列各式的值：

1) $200\,500-39\,591-(6112-16\,112:304)$；
2) $71\,999+22\,111-(3078+609\cdot25)$.

<!-- exhead -->
家庭作业题

<!-- ex 972 -->
972. 做加法：

а) $395.486+4.58$；
б) $7.6+908.67$；
в) $0.54+24.1789$；
г) $1.9679+2065.0121$.

<!-- ex 973 -->
973. 在接力赛中第一位运动员跑了 $100$ 米用 $10.2$ 秒，第二
位运动员跑了 $200$ 米用 $20.5$ 秒，第三位运动员跑了 $400$
米用 $46.7$ 秒，第四位运动员跑了 $800$ 米用 $1$ 分 $42.7$ 秒。
四人共跑了多少时间？共跑了多少米？

<!-- ex 974 -->
974. 按下列规则把表格填上：每个空格里填入它的上面和
左面的两个数的和。

### Physical 0216 / printed 207, before N59

<!-- fig 表 owner-ex 974 -->
The original unnumbered table belonging to 974 is 4 rows by 4 columns. The cells below are a source transcription, NOT a filled answer. `[blank]` means no number was printed.

| Source row / column | c1 | c2 | c3 | c4 |
| --- | --- | --- | --- | --- |
| r1 | [blank] | 0.35 | 0.72 | 1.14 |
| r2 | 5.43 | [blank] | [blank] | [blank] |
| r3 | 0.68 | [blank] | [blank] | [blank] |
| r4 | 1.71 | [blank] | [blank] | [blank] |

No table number, caption, column name, operation sign, or value in r1c1 is printed. The coordinate labels above are evidence-only labels, absent from the source.

<!-- ex 975 -->
975. 三角形的一边长 $83.6$ 厘米，第二边比第一边长 $14.8$ 厘
米，第三边比第二边长 $8.6$ 厘米。求这个三角形的周长。

<!-- boundary excluded -->
59. 小数的减法

## Source caveats, not silent corrections

1. **965 units/wording:** the source really says “速度是 4.9 米” and “下降速度 ... 快 9.8 米”; it does not print 米/秒 or 米/秒平方. This is a dimensional wording inconsistency. Its addition-task reading uses successive one-second descent quantities 4.9, 14.7, 24.5, 34.3 米. Do not silently replace it with a different physical model or pretend the source prints velocity/acceleration units.
2. **967 upper glyph:** the upper endpoint in the actual crop has an O-shaped loop with a short diagonal tail, visually Q-shaped. The prose consistently names O in OAP, OAK and OAM. Preserve this glyph observation separately from the text-governed mathematical designation O; do not silently describe the scan as an unequivocally clean O or change the three printed angle names to Q.
3. **967 measurement:** no numerical angle is printed. Its wording asks an ordinary drawing measurement followed by a calculation. The raster permits a concrete approximate measurement; an exact-paper, dewarping, or calibration prerequisite is not needed to perform that task. Approximation and uncertainty are stated in independent-solutions.md.
4. **974 corner:** the source's literal “每个空格” also covers an empty top-left cell visually, but that cell has no above/left predecessor. The nine interior blanks have both predecessors and are uniquely solvable. Keep the top-left cell structurally blank; the source supplies no corner seed. Do not invent 0 or infer a seed from an answer.

## Freeze status

Full N58 prose and all 15 source exercises are independently transcribed. No concrete unreadable numeral or geometry blocks this scope; no new source-measurement HOLD is asserted. The four caveats above remain explicit qualifications. Existing N57 HOLDs/failures are untouched.

This is source/mathematical evidence only. It does not approve authored or modern text, figures, choices, answers, display, publication, or a whole lesson.
