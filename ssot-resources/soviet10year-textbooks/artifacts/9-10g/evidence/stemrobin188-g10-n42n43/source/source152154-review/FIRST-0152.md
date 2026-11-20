# FIRST 0152

Blind source-pixel record. Candidate files and actual crops have not been read.
Source: `.tmp/ld-s10y-lesson/9-10g/pages/0152/page.png`
SHA256: `6226375517257cf718076ac720b983cf57606afc5661ab4b47a50f7a7e752683`
Image ledger event R1: one full-page load; no reopen, OCR or outside-page pixels.
Physical page 152; printed page 145. Spacing below separates content, not a claim about typographic kerning. Mathematical arrows are transcribed as `\vec`.

## Printed Lines

| FIRST ID | Source text | Role |
|---|---|---|
| 152-L01 | 十 年 级 | grade/division heading |
| 152-L02 | 第四章 空间坐标方法 | chapter heading |
| 152-L03 | §42. 向量坐标. 用坐标给出的向量的运算法则 | section/course title |
| 152-L04 | 1. 设已知三个两两垂直的单位向量组$(\vec i,\vec j,\vec k)$（图1）. | exposition starts, not an exercise |
| 152-L05 | 这样的向量组叫做直角基底. 我们知道，空间的每一个向量 | same paragraph |
| 152-L06 | 可以按向量$\vec i,\vec j,\vec k$分解（§23）. 这就是说，对于任意的一个 | same paragraph |
| 152-L07 | 向量$\vec a$，存在唯一的数组$(x,y,z)$，使得 | same paragraph |
| 152-L08 | $\vec a=x\vec i+y\vec j+z\vec k.$ （1） | display equation; terminal dot and right-hand equation number |
| 152-L09 | 图1 / 图2 | two captions on one printed row |
| 152-L10 | 逆命题也成立：在已知的直角基底$(\vec i,\vec j,\vec k)$中，每一个数 | new paragraph |
| 152-L11 | 组$(x,y,z)$确定唯一的向量. 数$x,y,z$叫做在基底$(\vec i,\vec j,\vec k)$中 | same paragraph |
| 152-L12 | 向量$\vec a$的坐标. | same paragraph |
| 152-L13 | 如果向量$\vec a$的每个坐标都不等于零，那么$\vec a$可以利用长 | new paragraph, open at page end |
| 152-L14 | ·145· | printed-page footer |

No standalone exercise heading or exercise occurs on this page. The last paragraph is visibly unfinished after 长. The equation is complete; the first paragraph must not be left open merely because figures follow it.

## Source Figure Inventory

Inventory recorded from the full-page pixels before reading actual crops.

- 图1: three arrows share one unlabelled origin. `\vec i` runs diagonally down-left, `\vec j` horizontally right, and `\vec k` vertically up. Each arrow has its own adjacent vector label. No origin letter, coordinate values, right-angle square, extra axis label or caption is inside the semantic figure.
- 图2: a perspective parallelepiped with eight vertices and all twelve edges represented, rear/hidden edges dashed. A common lower-front-right vertex is the origin for the depicted components: `\vec i` and `x\vec i` point up-right along the receding edge; `\vec j` and `y\vec j` point left along the bottom front edge; `\vec k` and `z\vec k` point upward along the front-right vertical edge. Each unit arrow is shorter than its corresponding full component. A dashed body-diagonal arrow labelled `\vec a` runs from that common origin to the opposite upper-back-left vertex. Seven vector labels: `\vec i`, `x\vec i`, `\vec j`, `y\vec j`, `\vec k`, `z\vec k`, `\vec a`. No numerical lengths or vertex names. Caption 图2 is below, outside the figure.

## Boundary Observations

- The literal grade heading is 十年级, not 九年级.
- Chapter number remains 第四章; it does not restart as 第一章.
- This grade division begins with §42, not §1. Preserve printed §42.
- The first printed exposition item and the two captions are numbered 1, 1 and 2 respectively. Whether subsequent exercise numbering starts at 1 will be established only from authorized later source pages.
- Under the skill contract, the chapter is an ancestor heading and a publishable §42 course requires `h3`; the grade heading needs explicit division semantics rather than silently replacing the chapter.
- No erratum or doubtful glyph is registered as a confirmed correction.
