# FIRST independent source reading

Scope: physical pages 0157, 0158, 0159 of 9-10g, STEMROBIN-188,
same188-6. This file was written after loading only the three original
page.png files and BEFORE reading candidate md/json/audit, author report,
line-count diagnosis, or the page-0156 boundary text. It is the immutable
first observation record, not final approval.

Image loads so far: 3/8 in this fresh review context.
Root for all source paths:
`.intentfold/tickets/STEMROBIN-188/tmp/source157159-author/work/9-10g/pages/`.
Loads, in order: `0157/page.png`, `0158/page.png`, `0159/page.png`.
No grid, reopen, crop, older source image, or older transcription review loaded.

## Independent readable-row counts

| Physical page | Printed footer | Readable text rows | Derivation |
| --- | --- | --- | --- |
| 0157 | 150, with flanking dots | 18 | 11 top prose/formula rows + 1 shared caption row + 3 terminology rows + 2 problem-1 rows + 1 footer |
| 0158 | 151, with flanking dots | 18 | 4 solution-1 rows + 1 shared caption row + 2 problem-2 rows + 3 solution-2 prose rows + 1 equation row + 1 problem-3 row + 2 solution-3 prose rows + 1 distance-formula row + 1 exercise heading + 1 exercise-16 row + 1 footer |
| 0159 | 152, with flanking dots | 23 | exercise-16 continuation 1 + exercise-17 3 + exercise-18 2 + exercise-19 2 + exercise-20 3 + exercise-21 3 + exercise-22 3 + section heading 1 + section-opening prose 2 + equation 1 + last prose 1 + footer 1 |

Fractions, radicals and vector accents do not create extra printed rows.
The two captions on each of 0157 and 0158 share one physical row.
All four figure interiors, including their point/vector labels, are excluded
from these readable text counts and inventoried separately below.

## 0157: first line-by-line reading

The page starts mid-prose, not with a new heading. Formula symbols below use
LaTeX for a readable textual record, not a proposed edit.

```text
01 向量 \overrightarrow{OM}. 在这时，不同的点对应于不同的向量. 除点 O 之
02 外，还给出直角基底 (\vec i,\vec j,\vec k) (图 6). 每一个向量在这个基底
03 中的坐标是：
04 \overrightarrow{OM}=(x,y,z).
05 如果给定了直角基底 (\vec i,\vec j,\vec k) 和点 O，那么就说，建立了
06 空间的直角坐标系. 点 O 叫做坐标原点，而向量 \vec i,\vec j,\vec k 叫做
07 坐标向量. 向量 \overrightarrow{OM} 在直角基底 (\vec i,\vec j,\vec k) 中的坐标，称为在直
08 角坐标系中点 M 的坐标.
09 如果 \overrightarrow{OM}=(x,y,z)，那么点 M 的坐标写成 M(x,y,z). 数
10 x 叫做点 M 的横坐标，y 叫做点 M 的纵坐标，z 叫做点 M 的竖
11 坐标.
12 图 6                                      图 7
13 我们再引入几个常用的术语. 向量 \overrightarrow{OA}=\vec i、\overrightarrow{OB}=\vec j、
14 \overrightarrow{OC}=\vec k 所确定的轴叫做坐标轴(图 7)；通过每两个坐标轴的
15 平面叫做坐标平面；给出了坐标系的空间叫做坐标空间.
16 问题 1. 已知直角坐标系(图 8). 作出坐标为 (x,y,z) 的
17 点 M.
18 •150•
```

Figure 6 inventory: common origin O; downward-left directed basis i,
rightward directed basis j, upward directed basis k; directed OM diagonal
to upper-right endpoint M. O and M labels and all three vector accents
must remain. No x/y/z axis labels are present in this figure.

Figure 7 inventory: common O; x-axis down-left, y-axis right, z-axis up;
points A on positive x direction, B on positive y, C on positive z;
basis vectors i/j/k on those directions; directed OM to upper-right M.
Negative continuations include dashed horizontal left, dashed vertical down,
and dashed oblique upper-right from O. Preserve original relative placements,
solid/dashed distinctions, and all O/A/B/C/M/x/y/z/i/j/k labels.

No heading on this page is evidence for a new lesson boundary. The leading
prose continuation must later be checked using allowed page-0156 text only.
The problem-1 statement finishes here; its solution starts on 0158.

## 0158: first line-by-line reading

```text
01 解. 根据点的坐标的定义，本题归结为作表示向量 \overrightarrow{OM}
02 =x\vec i+y\vec j+z\vec k 的有向线段 OM(图 8). 依次作向量 \overrightarrow{OA}=x\vec i、
03 \overrightarrow{AB}=y\vec j 和 \overrightarrow{BM}=z\vec k，点 M 即为所求的点. 实际上根据多边形
04 法则 \overrightarrow{OM}=\overrightarrow{OA}+\overrightarrow{AB}+\overrightarrow{BM}=x\vec i+y\vec j+z\vec k.
05 图 8                                      图 9
06 问题 2. 根据点 A(x_1,y_1,z_1) 和 B(x_2,y_2,z_2) 的坐标求向
07 量 \overrightarrow{AB} 的坐标.
08 解. 按向量的计算公式(§19)，\overrightarrow{AB}=\overrightarrow{OB}-\overrightarrow{OA}(图 9). 根
09 据点的坐标的定义，\overrightarrow{OB}=(x_2,y_2,z_2)、\overrightarrow{OA}=(x_1,y_1,z_1). 应用
10 用坐标给出的向量减法法则(§42)，得到：
11 \overrightarrow{AB}=(x_2-x_1,y_2-y_1,z_2-z_1).                 (1)
12 问题 3. 求点 A(x_1,y_1,z_1) 和 B(x_2,y_2,z_2) 之间的距离.
13 解. 只需求向量 \overrightarrow{AB} 的长(图 9). 根据公式(1)计算它的
14 坐标. 应用向量长度的公式(§43，习题1)得到
15 |AB|=\sqrt{(x_2-x_1)^2+(y_2-y_1)^2+(z_2-z_1)^2}.
16 习 题
17 16. 按下列坐标作点：1) A(2,3,1)；2) B(1,-1,2)；
18 •151•
```

The first displayed equality crosses the line-01/02 break; it must not be
silently split into separate mathematical objects. Equation label (1) is
printed separately to the right of the AB coordinate formula on the same row.

Figure 8 inventory: common origin O; basis i along down-left x direction,
j along right direction, k along up direction; point A lower-left, B lower-right,
M above B; O-to-M diagonal directed segment; AB horizontal lower segment
label y; BM vertical segment label z; OA side label x. Preserve dashed/solid
construction strokes, all endpoint labels and all basis-vector accents.

Figure 9 inventory: O with positive x down-left, y right, z up and dashed
negative-axis continuations; basis i/j/k; upper-right point A and higher point B;
directed OA, directed OB, directed AB pointing from A to B. There are dashed
oblique construction/continuation strokes inside and below the triangle.
All O/A/B/x/y/z/i/j/k labels and arrowheads must remain.

Exercise 16 is open: its printed numeric subparts 1) and 2) occur here;
the next page starts with 3), 4), 5). These are numbers, not Cyrillic
alphabetic subpart labels. No printer erratum is established here.

## 0159: first line-by-line reading

```text
01 3) D(-3,1/2,-1)；4) E(0,2,-3)；5) G(0,0,-3/2).
02 17. 根据点 P 和 Q 的坐标求向量 \overrightarrow{PQ} 的坐标：
03 1) P(2,-3,0)、Q(-1,2,-3)；2) P(1/2,-4/3,5/6)，
04 Q(-3/5,0,2/3).
05 18. 点 B 是点 A(2,-3,1) 在坐标平面 Oyz 的正投影. 计
06 算 |\overrightarrow{OB}|.
07 19. 计算在坐标轴 Oy 上与点 A(2,-1,1) 和 B(0,1,3)
08 等远的点的坐标.
09 20. 给定三角形的顶点的坐标为 A(3,-2,1)、B(3,1,5)、
10 C(4,0,3). 计算：1) 中线 AA_1 和 BB_1 的长；2) 从坐标原点到
11 三角形 ABC 中线交点的距离；3) 这个三角形内角的大小.
12 21. 已知平行四边形三个顶点的坐标：A(1,-3,0)、
13 B(-2,4,1)、C(-3,1,1)，计算这个平行四边形对角线的
14 长度.
15 22. *证明：点 A(2,4,-4)、B(1,1,-3)、C(-2,0,5)，
16 D(-1,3,4) 是平行四边形的顶点. 并计算它的两条对角线
17 的夹角的大小.
18 §45. 平面的方程
19 在空间里引进直角坐标系以后，便可以用代数课中讲过
20 的方法解决几何问题. 我们研究含三个变量的方程：
21 P(x,y,z)=0.
22 假定它的解集不是空集. 每一个解是一个数组 (x,y,z).
23 •152•
```

There is no star on exercises 17-21. Exercise 22 has a printed star after
its number, before 证明. Preserve that mark and all raw numeric subparts.
Exercise 16's last point is G, not F; its preceding point is D, not C.
Both fractions in exercise 16 and all four fractions in exercise 17 belong
to the readable rows shown above.

The section-45 title is actually printed on 0159. This page closes the
exercise sequence above and opens a different section; it is NOT evidence
that section 45 is complete, nor authorization for whole-lesson/TOC approval.
The last visible sentence ends with a period after (x,y,z); whether the
following page continues the same paragraph is outside this three-page scope.

### First bottom-edge observation, unresolved

Below the genuine printed 152 footer is a large blank margin and an isolated
ragged dark cluster at the extreme lower-right edge. It does not yield a
readable source line in this full-page view. My readable-row count is 23.
I have NOT read the author's numerical diagnosis, loaded a lower crop,
determined its exact bbox, or approved any count exclusion. The isolated
edge cluster requires the reserved limited-crop inspection before judging
scan-artifact eligibility.

## First-stage disposition

Readable rows: 18 / 18 / 23, independently derived from source pixels.
Final per-page and per-crop PASS/REVISE/HOLD are pending candidate comparison.
No candidate modification, count-tool run, count exclusion, mathematical
correction, source finalization, assembly, or promotion has occurred.
