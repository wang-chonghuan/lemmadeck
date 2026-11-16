# STEMROBIN-184: fresh ORIGINAL-source mathematics author

Date: 2026-11-16. Role: SOURCE MATH AUTHOR ONLY. This is an author derivation, not an independent review, PASS, acceptance result, or permission to publish. Independent disclosure remains with the parent after its independent freeze.

Invocation cwd: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

Only the two current ORIGINAL lessons `geo910-c1-s2-n15` and `geo910-c1-s2-n16` supply the target mathematical text and exercises. Earlier material is restricted to the selected ORIGINAL JSON `prose` definitions listed below. Coordinate arguments in this document are newly derived mathematics, not transcribed answers, diagrams, or assertions obtained from another artifact.

## Binding And Read Boundary

All paths in the manifest are absolute. The following SHA-256 values are raw file-byte hashes:

| Input | SHA-256 |
|---|---|
| ORIGINAL `9-10g/book.json`, identity only, contents not read | `34ae066f8c1369116330f6b423c4b5a2e5b743b40c0901bfdd45f427c48a07f7` |
| n15 `lesson.json` | `78131e44852840b8c1bdb7c273c21d10c70b66ea5ea4c76ee2cd9a9f10bd9da0` |
| n15 `lesson.md` | `922524deba0a395b2923474704d2bfa61c07db3881e012c5d4e9c1875a710fcd` |
| n15 `exercises.json` | `6d53ac8520088a734935022cf69249fa07b6b63371bd907e7946308511c68ba0` |
| n16 `lesson.json` | `d7b77bc175e5ed83743065ab7b01107e40d1f024e576b23740b6fb13a66921c9` |
| n16 `lesson.md` | `c7d3d2c8dc54a38c0740e9cbbec8ededa4b9e04650a6d12ba809fa7d6548bef3` |
| n16 `exercises.json` | `202c0bbc5c230805edd30dc3a548fdbeff10c9beff43db823155f19db63d794e` |

All seven match the supplied binding. The source Markdown was read as target text only. Its SVG links were not followed. No source-page image, page OCR, FigureSpec, SVG, modern lesson, template, answer, candidate, review, precursor, or independent freeze was opened. No earlier `lesson.md` or `exercises.json` was read.

Read-only filesystem enumeration also returned earlier ORIGINAL lesson filenames and their JSON titles. These were not exercise contents or mathematical evidence. No backend, other chat, Git operation, initialization, Grill, database, production, publishing, merging, closure, deployment, pipeline, or validation command was used.

### Read-Scope Limitation

One `JSON.prose` definition filter was insufficiently narrow. In n5 it also returned body 9 (`p0021#11`, historical terminology footnote) and body 13 (`p0022#5`, annotation naming `K`, `D`, `MQ`, `QP` in an earlier construction). Body 13 is problem-adjacent earlier prose, not a needed definition; it was seen and excluded. Filters on n3 and n7 also returned n3 body 11 (`p0016#10`, `p0017#1`, a uniqueness-proof invitation) and n7 body 17 (`p0026#10`, a proof conclusion), which are excluded. The n14 filter returned incidental contextual prose in addition to its needed definitions. A subsequent first-two-object read there returned a projection illustration paragraph; that illustration is also excluded.

This limitation is disclosed rather than claiming a perfectly clean definitions-only exposure. No earlier exercise object, full earlier exercise statement, worked answer, or earlier image was obtained. None of the excluded material contributes to any result below. Whether this exposure requires another fresh author invocation is a parent decision; this author does not certify independence.

## Earlier Definition Basis

These are the only earlier blocks used as mathematical premises. Hashes of their ORIGINAL containing JSON files and all selected source references are in the manifest.

| Definition ID | ORIGINAL block | Literal defining content / purpose |
|---|---|---|
| D-AX9 | n2 body 36, `p0013#7` | 公理 9．在平面几何中学过的顺序公理、平面运动公理和平行公理，对于每一个平面都成立． |
| D-LL | n3 body 7, `p0016#6` | 在立体几何中，平行直线的定义仍保留平面几何中的定义：如果两条直线在同一个平面内，且没有公共点或重合，就说这两条直线平行（图 9，а 和 б）. |
| D-LP | n7 body 11, `p0026#4` | 定义. 如果直线和平面没有公共点或直线在平面内，就说直线和平面平行. |
| D-PP | n10 body 10, `p0035#9` | 定义. 如果两个平面没有公共点或者重合，就说这两个平面平行. |
| D-TET | n5 body 1, `p0021#3` | 最简单的多面体是三棱锥（图12）.它一共有四个面.因此，我们将它简称为四面体. |
| D-PAR | n9 bodies 1 and 4, `p0032#8`, `p0032#9` | 在平面 $\alpha$ 内作平行四边形 $ABCD$. 过顶点作不在 $\alpha$ 内的平行线；$AA_1$、$BB_1$、$CC_1$、$DD_1$ 相等且在 $\alpha$ 同侧；六个面都是平行四边形，称平行六面体. |
| D-IMAGE | n14 body 7, `p0055#9`, `p0056#1` | 所有象的集合为 $\Phi_1$；$\Phi_1\subset F$；如果 $\Phi_1=F$，说图形被映射成该图形. Only the defining clauses, not the subsequent projection illustration, are used. |
| D-CENTRAL | n14 body 15, `p0056#9` | 使空间每点 $M$ 对应关于已知中心 $O$ 的对称点 $M_1$，得到中心对称. |
| D-TRANSFORM | n14 body 16, `p0056#10` | 定义. 在空间到它自身的映射下，如果任意两个不同的点有不同的象，这种映射叫做空间的变换. |
| D-INVERSE | n14 body 20, `p0057#2` | 将有序对 $(M,M_1)$ 交换为 $(M_1,M)$，记作 $f^{-1}$；$f^{-1}(M_1)=M$. This only directly defines the inverse on the image. |
| D-COMPOSE | n14 bodies 21 and 22, `p0057#3`, `p0057#4` | $f(M)=f_2(f_1(M))$，$f_2\circ f_1=f$. |
| D-ID | n14 body 23, `p0057#5` | $E(M)=M$. |

In particular, ORIGINAL parallelism is inclusive: coincident lines, a line contained in a plane, and coincident planes count as parallel. No strict-disjoint convention is substituted.

## Author-Derived Mathematics

### A1. Distance Preservation, Affinity, And Onto

Use Euclidean coordinates only as an author proof device. Let the space be $\mathbb R^3$, and let a map $f:\mathbb R^3\to\mathbb R^3$ preserve every distance, without initially assuming it onto or affine. If $f(x)=f(y)$, then $|x-y|=0$, so $x=y$. This already proves transformation in D-TRANSFORM's injective sense.

Let $e_1,e_2,e_3$ be an orthonormal basis, $b=f(0)$, $u_i=f(e_i)-b$, and $y=f(x)-b$. Distances give

$$|u_i|=1,\qquad |u_i-u_j|^2=2\ (i\ne j),\qquad u_i\cdot u_j=0.$$

Thus $u_1,u_2,u_3$ are a basis. Also

$$|y|^2=|x|^2,\qquad |y-u_i|^2=|x-e_i|^2,$$

and subtracting yields $y\cdot u_i=x_i$. Consequently

$$f(x)=b+Qx,\qquad Qe_i=u_i,\qquad Q^TQ=I.$$

For every $z$ the actual preimage is $x=Q^T(z-b)$. Hence $f$ is onto and its global inverse exists; these are conclusions, not conventions about the word transformation. This is a finite-dimensional, equal-dimension Euclidean argument and is not asserted for arbitrary spaces.

General source-injective transformations need not be onto. An author counterexample is

$$g(x_1,x_2,x_3)=\left(\frac{x_1}{1+|x_1|},x_2,x_3\right).$$

Its first component is strictly increasing, with image $(-1,1)$; the inverse first component on that image is $t/(1-|t|)$. Thus D-INVERSE's swapped pairs do not alone furnish a global inverse on all of space. For a displacement, A1 supplies the missing onto proof.

### A2. All Geometric Images

For $f(x)=b+Qx$, image and inverse image formulas give equality of the complete sets, not just image containment:

$$f(a+tu)=f(a)+tQu,\qquad
f(a+su+tv)=f(a)+sQu+tQv.$$

For a line $u\ne0$; for a plane $u,v$ are independent. Invertibility of $Q$ preserves these conditions. A segment uses $0\le t\le1$ and its image is exactly the corresponding closed segment; if its endpoints coincide both are singletons. A ray uses $t\ge0$ and a nonzero direction.

An affine signed linear function defining a half-plane or half-space transports by $f^{-1}$ to another such function. Its zero set is the image boundary, and the selected side is the image side. This works separately for open and closed sides; the source has not specified which boundary-inclusion convention it wants. A nondegenerate tetrahedron and its faces transport by barycentric coordinates. Degenerate vertex data do not define the source tetrahedron.

For nonzero angle arms $u,v$,

$$\frac{Qu\cdot Qv}{|Qu||Qv|}=\frac{u\cdot v}{|u||v|}.$$

Thus ordinary nonoriented angles are preserved, including $0$ and $\pi$ for nonzero collinear arms. A zero arm does not define an angle; no numerical angle is assigned to it.

For arbitrary sets $X,Y$, injectivity gives $f(X\cap Y)=f(X)\cap f(Y)$; invertibility gives the converse incidence statements too. Coincidence, containment, disjointness, and coplanarity are preserved, with no generic-position assumption.

### A3. Central Symmetry

With center coordinate $o$, define the author formula for the source $Z_0$:

$$Z_0(x)=2o-x.$$

Keep the source literal subscript `0`, not a silently substituted letter `O`. The point $O$ is fixed, every other point and its image have $O$ as midpoint, and $Z_0^2=E$. Differences are negated, so every distance is preserved, including zero distances.

$O,M,N$ always lie in at least one plane. If collinear or coincident they do not select a unique plane; any containing plane works. Both opposite points also lie in it, and it maps to itself. This justifies n15's plane argument without assuming a noncollinear triangle.

For a line $L=a+\mathbb Ru$, $Z_0(L)=2o-a+\mathbb Ru$: it is parallel in D-LL's sense, and equals $L$ exactly when $o\in L$. For a plane $\Pi=\{x:n\cdot x=c\}$ with $n\ne0$,

$$Z_0(\Pi)=\{x:n\cdot x=2n\cdot o-c\}.$$

It is parallel in D-PP's sense and equals $\Pi$ exactly when $o\in\Pi$.

### A4. Directed Rays, Including Coincident Supports

An author parametrization is $H(P,v)=\{P+tv:t\ge0\}$, with $v\ne0$. Its ray label `[AB)` requires $A\ne B$, and $v=B-A$.

When two supports are parallel, including coincident supports, their nonzero direction vectors are proportional. The two source definitions are equivalent to

$$H(P,v)\uparrow\uparrow H(R,w)\iff w=\lambda v,\ \lambda>0,$$
$$H(P,v)\uparrow\downarrow H(R,w)\iff w=\lambda v,\ \lambda<0.$$

For distinct parallel supports, in their common plane the boundary line through the origins separates the non-origin ray points by the sign of this scalar. Origins themselves lie on that boundary. Thus if “half-plane” is open, its non-origin tails rather than entire closed rays determine the side; if closed, include the origins.

For coincident supports choose a unit $u$ and coordinates $P=p u$, $R=r u$ after an origin shift. Two positive directions intersect in $[\max(p,r),+\infty)$, two negative directions in $(-\infty,\min(p,r)]$; both intersections are rays, also when $p=r$. Opposite directions, with the first positive and the second negative, intersect in $[p,r]$ if $p<r$, $\{p\}$ if $p=r$, and the empty set if $p>r$. Reversing which ray is positive exchanges their roles. Opposite rays on distinct parallel supports have empty intersection.

Intersecting nonparallel supports and skew supports give neither relation. Zero vectors do not define rays; no “zero direction” is invented. These cases exhaust the support/direction alternatives.

At any point $M$, the two rays with support direction $\mathbb Ru$ are $H(M,u)$ and $H(M,-u)$. They are uniquely same/opposite to a prescribed ray. If $M$ is on its supporting line, that line itself is the unique inclusive-parallel line. Under central symmetry,

$$Z_0(H(P,v))=H(2o-P,-v),$$

so the image direction is opposite even when the supports coincide or the center is the origin of the ray.

Positive proportionality is reflexive and symmetric; multiplication of positive scalars proves transitivity. Negative proportionality is symmetric and irreflexive, but composing two negative factors gives a positive factor, so it is not transitive. A direction class is $\{H(P,\lambda v):P\in\mathbb R^3,\lambda>0\}$ and contains one ray with each origin. The opposite direction class uses $-v$.

## Complete Body Coverage

Indices below are one-based indices of ORIGINAL `lesson.json.prose`, not renumbered paragraphs. Source text is preserved literally, including the mathematical defects identified separately. All 11 + 17 = 28 objects, including each `fig` and `cap`, are accounted for.

### n15: 11 Objects

**n15-B01, p, `p0058#4`**

> 从全体变换的集合中划分出一类变换. 在这种变换下，任意两点间的距离等于它们的象之间的距离. 我们说，这样的变换保持距离不变. 例如，中心对称是保距变换. 我们来证明这一点.

Author derivation: A1 proves distance preservation implies injectivity and additionally Euclidean onto; A3 proves the particular central symmetry. Distinctness is not required for the distance equality.

**n15-B02, p, `p0058#5`**

> 假设中心对称$Z_0$将空间任意两点$M$和$N$分别映射成点$M_1$和$N_1$（图60），点$O$、$M$、$N$、$M_1$、$N_1$属于同一个平面. 用$\alpha$表示这个平面. 在中心对称$Z_0$下，平面$\alpha$映射成它自身，并且这个映射可以看成是平面$\alpha$内关于中心$O$的中心对称. 但平面的中心对称保距，因而$|M_1N_1|=|MN|$.

Author derivation: A3, or directly $M_1-N_1=-(M-N)$. Collinear, coincident, center-equal, and zero-distance cases still work. The pictured configuration is only an instance.

**n15-B03, fig, `p0058#6`**

Literal object: `kind=fig`, `id=fig-60`, `label=图 60`, `text=""`. Covered by the complete original-PNG inventory F60 below. The blank figure-object text is not a missing paragraph.

**n15-B04, cap, `p0058#7`**

> 图 60

Caption identity is paired with F60, with no additional mathematical given.

**n15-B05, p, `p0058#8`**

> 定义1. 空间的保距变换叫做位移.

Author interpretation: D-TRANSFORM plus the distance condition. No onto assumption is imported; A1 proves it for this class.

**n15-B06, p, `p0058#9`**

> 从位移的定义得出：а) 恒等变形是位移；б) 位移的逆变换是位移；в) 两个位移的合成是位移；

All three printed clauses: identity preserves distance; for $x=f^{-1}(p),y=f^{-1}(q)$, $|x-y|=|p-q|$, with the inverse global by A1; and $|f_2(f_1(x))-f_2(f_1(y))|=|f_1(x)-f_1(y)|=|x-y|$. D-COMPOSE fixes the order. General injective transformations outside the displacement class are not granted a global inverse.

**n15-B07, p, `p0058#10`, `p0059#1`**

> 以后还将应用位移的另外的性质. 任何位移将直线映射成直线，将平面映射成平面.

Author derivation: the complete-set formulas in A2. A plane's independent direction pair stays independent.

**n15-B08, p, `p0059#2`**

> 可以同样证明，位移$F$将线段$AB$映射成线段$F(A)F(B)$；把以$p$为边界的半平面映射成以$F(p)$为边界的半平面；把以$\alpha$为边界的半空间映射成以$F(\alpha)$为边界的半空间；把四面体$ABCD$映射成四面体$F(A)F(B)F(C)F(D)$，等等. 最后，在位移下角度保持不变是位移的一个重要性质.

Author derivation: A2 separately covers segment, half-plane, half-space, tetrahedron, and angle; coincident segment endpoints allowed, zero-arm angle undefined, tetrahedron nondegenerate, side convention unchanged. No unstated oriented-angle preservation is asserted.

**n15-B09, p, `p0059#3`**

> 定义2. 如果存在位移将$\Phi$映射成$\Phi_1$，图形$\Phi_1$称为图形$\Phi$的合同图形.

Author interpretation: $F(\Phi)=\Phi_1$ as set equality, not merely inclusion in an ambient target. D-IMAGE supplies this distinction.

**n15-B10, p, `p0059#4`**

> 记作：$\Phi_1\cong\Phi$.

Literal congruence notation retained.

**n15-B11, p, `p0059#5`**

> 从位移的性质а) — в)得出图形合同具有反身性（$\Phi\cong\Phi_1$），对称性（如果$\Phi_1\cong\Phi$，那么$\Phi\cong\Phi_1$），传递性（如果$\Phi_1\cong\Phi$，$\Phi_2\cong\Phi_1$，那么$\Phi_2\cong\Phi$）.

Author derivation: identity gives $\Phi\cong\Phi$; inverse gives symmetry; composition gives transitivity. The displayed source formula for reflexivity is literally $\Phi\cong\Phi_1$, not the derived reflexivity formula. E-REFLEX records that source defect without changing it.

### n16: 17 Objects

**n16-B01, p, `p0060#5`**

> 在日常用语中常常使用“方向”这个词. 例如，说大型飞机飞行的方向或者星际站的运动方向. 在八年级学校课程里，你们熟悉了平面上的方向概念. 下面，我们对于空间阐明这个概念的意义.

Motivational introduction, not additional quantitative data.

**n16-B02, p, `p0060#6`, `p0061#1`**

> 1. 设射线$h_1=[O_1A_1)$和$h_2=[O_2A_2)$在不同的平行直线上. 于是这两条直线在某个平面$\alpha$内（§3）. 研究它的以$(O_1O_2)$为边界的两个半平面$\alpha_1$和$\alpha_2$. 如果两条已知的射线在这两个半平面中的同一个半平面上（图62，а），那么这样的两条射线叫做同方向的；如果$h_1$和$h_2$在不同的半平面上（图62，б），那么这样的两条射线叫做反方向的.

Author derivation: A4's sign test on distinct parallel supports, with the origins on the boundary. Nonparallel and zero-arm cases are not silently included in this definition.

**n16-B03, fig, `p0060#7`**

Literal object: `kind=fig`, `id=fig-62`, `label=图 62`, `text=""`. F62 inventories both actual subfigures.

**n16-B04, cap, `p0060#8`**

> 图 62

Caption identity only.

**n16-B05, p, `p0061#2`**

> 2. 设射线$h_1$和$h_2$在同一条直线上. 如果它们的交集是射线，这两条射线叫做同方向的（图63，а），如果$h_1\cap h_2$不是射线（图63，б、в、г），它们叫反方向的.

Author derivation: A4's complete same-support intersection classification. Same origin/same direction gives identical rays; same origin/opposite gives a singleton; facing separated origins gives a segment; outward separated origins gives empty intersection.

**n16-B06, fig, `p0061#3`**

Literal object: `kind=fig`, `id=fig-63`, `label=图 63`, `text=""`. F63 inventories all four rows, not just one representative.

**n16-B07, fig, `p0061#4`**

Literal object: `kind=fig`, `id=fig-64`, `label=图 64`, `text=""`. F64 inventories both displayed supports and the two rays from $M$.

**n16-B08, cap, `p0061#5`**

> 图 63

Caption identity only; original order retained.

**n16-B09, cap, `p0061#6`**

> 图 64

Caption identity only.

**n16-B10, p, `p0061#7`**

> 射线$h_1$和$h_2$是同方向的，记作$h_1\uparrow\uparrow h_2$. 如果$h_1$和$h_2$是反方向的，那么记作$h_1\uparrow\downarrow h_2$. 如果给定射线$AB$和点$M$（图64）. 过点$M$作直线$m$平行于$(AB)$（§4，问题）. 这样的直线是唯一的. 我们研究在直线$m$上有公共始点$M$的射线$m_1$和$m_2$. 它们中的一条与射线$AB$是同方向的（图64中的$m_1$）.另外一条射线与$[AB)$是反方向的.

Author derivation: choose $u=B-A\ne0$; support $m=M+\mathbb Ru$, with rays $H(M,u)$ and $H(M,-u)$. Any parallel support through $M$ has the same direction span and thus this same set. If $M\in(AB)$, use the coincident line rather than demand a distinct parallel line. Literal `AB`, `(AB)`, `[AB)`, and both arrow signs are retained. The referenced earlier §4 problem was not opened.

**n16-B11, p, `p0061#8`**

> 于是，以空间的每一个点为始点的射线只有一条与已知射线方向相同，同时也只有一条射线同已知射线方向相反.

Author derivation: the uniqueness just proved, including an origin on the original support.

**n16-B12, p, `p0061#9`**

> 我们指出，中心对称将每一条射线映射成方向相反的射线. 为了证明这一点，只要过射线和对称中心作平面，并利用公理9.

Author derivation: A4's exact image formula. A containing plane exists even if $O$ lies on the ray support; it need not be unique. Center at the origin gives two opposite rays sharing their origin.

**n16-B13, p, `p0062#1`**

> 在空间里，如同平面上一样，射线的方向相同具有反身性：$h\uparrow\uparrow h$；对称性：如果$h_1\uparrow\uparrow h_2$，那么$h_2\uparrow\uparrow h_1$；传递性：如果$h_1\uparrow\uparrow h_2$和$h_2\uparrow\uparrow h_3$，那么$h_1\uparrow\uparrow h_3$（图65）.

Author derivation: positive scalar factors $1$, $1/\lambda$, and $\lambda\mu$. This does not rely on the pictured origins being noncollinear.

**n16-B14, p, `p0062#2`**

> 所有与同一条直线方向相同的射线的集合，叫做在空间的方向.

Literal source says “直线”. A nonoriented line does not itself select either of its two ray direction classes. E-DIRECTION records that underdetermination. No silently corrected source sentence is authored. Conditional intended ray-class formulation is derived in A4 and supported by the next source object.

**n16-B15, p, `p0062#3`, `p0062#6`**

> 任何一条射线完全确定与它同方向的射线的全体的集合. 因此，以后空间的方向将利用一条射线来给出.

Author derivation: A4's ray class. Giving a nonzero representative ray selects precisely one of the two opposite classes.

**n16-B16, fig, `p0062#4`**

Literal object: `kind=fig`, `id=fig-65`, `label=图 65`, `text=""`. F65 accounts for the unlabeled origins and their connecting strokes; origin names are not fabricated.

**n16-B17, cap, `p0062#5`**

> 图 65

Caption identity only.

## Original PNG Freeze

Exactly six `view_image(detail="original")` calls, individually in F60 through F65 order, one call each. No crop, resize, reopen, screenshot, page image, or further image load. Pixel sizes below describe the file, never mathematical lengths, angles, or ratios.

### F60 / fig-60

Absolute path: `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-60.png`.

Raw SHA-256: `aae24ebf204aa8bbe9d0e7db308e94ae36e8bc15215fd511aeaf8d399c435ccb`. Size 562 x 417. Open 1, once.

- One irregular, closed solid outline marked $\alpha$, representing a plane region, not a mathematical bounded plane.
- Five labeled point marks: $M_1$ upper left, $N_1$ lower left, $O$ central crossing, $N$ right upper, $M$ right lower.
- Solid segments/strokes $M_1N_1$, $NM$, $M_1OM$, and $N_1ON$. The two latter strokes pass through the common marked $O$; $O$ lies between each opposed pair in the pictured instance.
- The source prose, not estimated pixel lengths, says $M_1=Z_0(M)$ and $N_1=Z_0(N)$, giving both midpoint relations and distance equality.
- No ticks, numeric values, arrows, dashed edges, or right-angle mark. No perpendicularity or metric ratio is a pixel given.
- A tiny isolated unlabeled speck above/right of $O$ is not identified by the source as another point; its geometric meaning is UNKNOWN.

### F61 / fig-61

Absolute path: `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-61.png`.

Raw SHA-256: `18b2c7ab86e489cbb6b002382e324de5f84633c3ed0ea0399e3a5555f2287830`. Size 541 x 486. Open 2, once.

- One irregular, closed solid plane outline marked $\alpha$.
- Four named point marks: upper $M,N$ and lower $M_1,N_1$. Solid $MN$ and $M_1N_1$ join the corresponding pairs.
- Two through-strokes connect $M$ with $M_1$ and $N$ with $N_1$. Each includes a filled unnamed interior mark representing its intersection with $\alpha$. A solid segment joins these two unnamed marks.
- A third through-stroke at the right is labeled $l$ (source literal lowercase `l`), with another unnamed marked intersection in the depicted plane.
- Each of the three through-strokes has an upper solid portion, a lower/interior dashed portion, then a lower solid portion beyond the outlined plane. Dashed and solid portions are preserved as depicted visibility distinctions, not distance/equality markings.
- Task 160 supplies $(MM_1)\parallel l$ and the midpoint-plane condition; the similar depiction for the $N$ pair follows the map's rule for every point, not a measured congruence.
- No origin named $O$, no right-angle square, no equal-length ticks, no numerical measurements, and no arrowheads. Whether $l\perp\alpha$ is UNKNOWN from this PNG.

### F62 / fig-62

Absolute path: `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-62.png`.

Raw SHA-256: `1a7fcf866312be5c9827e8185b55b297e16ae9edd2e2dc4e1dcc89d4268c7cfb`. Size 1160 x 355. Open 3, once.

- Exactly two side-by-side subfigures, source labels `а)` and `б)`.
- Both have an irregular solid plane outline, dividing line $(O_1O_2)$, marked origins $O_1,O_2$, labels $A_1,A_2$, ray labels $h_1,h_2$, and half-plane labels $\alpha_1,\alpha_2$.
- In `а)`, $O_1$ is below $O_2$ on the slanting dividing stroke. Both ray strokes go toward the right: $h_1$ from $O_1$ toward $A_1$, $h_2$ from $O_2$ toward $A_2$. Their non-origin points occupy $\alpha_1$; $\alpha_2$ is on the other side.
- In `б)`, $O_2$ is upper-left of $O_1$ on the dividing stroke. $h_1$ runs from $O_1$ toward right-upper $A_1$ in $\alpha_1$, while $h_2$ runs from $O_2$ toward left-lower $A_2$ in $\alpha_2$.
- $A_1,A_2$ label positions along/at the drawn ray ends; separate filled endpoint dots or explicit arrowheads are not visible. They are ray-defining points in the prose, not finite termination of a ray.
- Solid strokes throughout, no dashes, no metric values, no equality ticks, no perpendicular marker. Contacts with the schematic outline do not put $A_i$ on any genuine geometric boundary of the infinite plane.

### F63 / fig-63

Absolute path: `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-63.png`.

Raw SHA-256: `8bc29170e588184eb2c612dacba4c7bfbf0d83d88e1106454302ba50b8d8ac5f`. Size 595 x 560. Open 4, once.

- Exactly four horizontal rows labeled `а)`, `б)`, `в)`, `г)`. Each has one solid supporting-line stroke with heavy ray portions and labels $h_1,h_2$.
- `а)`: marked $O_1$ left of marked $O_2$; $h_1$ points right from $O_1$, $h_2$ right from $O_2$; shared part is the rightward ray with origin $O_2$.
- `б)`: marked $O_1$ left of marked $O_2$; $h_1$ leftward from $O_1$, $h_2$ rightward from $O_2$; outward, empty intersection.
- `в)`: marked $O_1$ left of marked $O_2$; $h_1$ rightward from $O_1$, $h_2$ leftward from $O_2$; facing, intersection the closed segment $O_1O_2$.
- `г)`: one common marked origin with literal label $O_1=O_2$; $h_1$ leftward, $h_2$ rightward; intersection just that origin.
- No $A$ labels, no lengths, no dashes, no ticks, no conventional arrowheads. Direction is communicated by labeled/heavy ray portions together with n16-B05, not by measuring stroke length.

### F64 / fig-64

Absolute path: `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-64.png`.

Raw SHA-256: `1f27aa01ffb48f811328894e535ca46f5c9d534e9468e450d811965679efaafc`. Size 475 x 404. Open 5, once.

- Left solid/heavy ray stroke starts at marked $A$ and runs upper-right past label $B$. There is no separately visible filled dot at $B$; it is nevertheless the named ray-defining point from the prose.
- Right solid supporting line labeled $m$, with a marked point $M$ and two opposed portions: upper-right $m_1$ (heavy), lower-left $m_2$ (thinner).
- Illustrated supports are distinct; prose gives $m\parallel(AB)$, $m_1\uparrow\uparrow[AB)$, $m_2\uparrow\downarrow[AB)$.
- No plane outline, numeric values, dashes, equal-length or right-angle marks, or explicit arrowheads. The pictured off-support $M$ does not exclude the general on-support branch.

### F65 / fig-65

Absolute path: `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-65.png`.

Raw SHA-256: `3eca7c34248a5a98b6c02cf830ffc13fd8edaf24a989c3b19d84db5502d23a86`. Size 522 x 456. Open 6, once.

- One irregular, closed solid outline represents the plane through three depicted ray origins. There is NO printed $\alpha$ label.
- Three unlabeled marked/junction origins: left for $h_3$, lower/front-middle for $h_2$, right for $h_1$. Source origin names are UNKNOWN; no $O_i$ names are supplied.
- Three heavy upward ray strokes, with literal labels $h_3$, $h_2$, $h_1$. They depict the same orientation.
- Three thin solid connecting through-lines join each pair of origins; portions continue toward the outlined plane boundary, producing a pictured triangular arrangement. No additional points at boundary intersections are labeled.
- No dashes, arrowheads, ticks, numerical values, or perpendicular marker. A vertical-looking ray is not evidence of being normal to the depicted plane. The proof of transitivity also covers collinear or coincident origins, not just this instance.
- A tiny isolated upper speck has no identified geometric meaning; UNKNOWN rather than an extra named point.

## All Nine Tasks And All Requests

The JSON precursor contains the full literal task text, source block references, each requested result, its author proof, and the conditional branches. There are 20 explicitly numbered printed subparts plus the two single unnumbered requests in 159 and 167: 22 semantic leaves total.

### 159: One Request

Source `p0059#7`:

> 159°. 任何将空间映射成自身的保距映射是空间变换吗？

Yes under D-TRANSFORM: equal images force zero original distance and equal original points. If “映射成自身” demands onto rather than merely into, A1 independently proves onto for this Euclidean distance-preserving class. It is not assumed for arbitrary injective maps.

### 160: Two Printed Subparts

Source `p0059#8`, `p0059#11`:

> 160. 已知平面$\alpha$以及和$\alpha$相交的直线$l$. 使每一个点$M\notin\alpha$对应这样的点$M_1$：$(MM_1)\parallel l$，而且$\alpha$平分线段$MM_1$（图61）. 使平面$\alpha$的任何点对应这点本身. 这样给出的将空间映射成自身的映射1) 是空间变换吗？2) 是位移吗？

Let $\alpha=\{x:n\cdot x=c\}$, $|n|=1$, and choose a nonzero direction $d$ of $l$.

For the intended unique-intersection branch $a=n\cdot d\ne0$, the intersection on $M+\mathbb Rd$ is

$$P=M-\frac{n\cdot M-c}{a}d,$$

and the unique required image, also valid for the separately fixed plane points, is

$$R(M)=M-2\frac{n\cdot M-c}{a}d.$$

**1)** $n\cdot R(M)-c=-(n\cdot M-c)$, hence $R(R(M))=M$. Therefore it is a transformation, indeed an onto involution. For $M\notin\alpha$, the connecting difference is nonzero and parallel to $d$; the midpoint is $P$. For $M\in\alpha$ the rule gives $R(M)=M$ and does not demand an undefined line $(MM)$.

**2)** Write $d=a n+w$, with $w\perp n$. On a unit normal difference $n$ the linear part gives $-n-2w/a$, whose squared length is $1+4|w|^2/a^2$. Thus it is a displacement exactly when $w=0$, i.e. $l\perp\alpha$. If $w=0$ it is ordinary plane reflection, and its linear part $I-2nn^T$ is orthogonal. If $w\ne0$ it fails distance preservation.

An author counterexample, not a measurement of F61: $\alpha:z=0$, $d=(1,0,1)$; $M=(0,0,1)$ maps to $(-2,0,-1)$ and $N=(0,0,0)$ is fixed, changing distance $1$ to $\sqrt5$.

Changing $d$ to $-d$ or any nonzero multiple changes neither $R$ nor its classification. Coincident inputs give distance zero; inputs in the plane stay fixed; these special pairs do not rescue a nonisometric oblique map.

If $a=0$ (line direction parallel to the plane, including a contained $l$), the parallel through an off-plane $M$ never meets $\alpha$, so no stipulated midpoint exists. The purported map is not defined on all space. A disjoint parallel $l$ contradicts “相交”; if that word were taken to include a contained $l$, this is the explicit invalid branch. $d=0$ is not a line direction. F61 contains no right-angle given, so the unconditional assertion “it is a displacement” is unsupported.

### 161: Three Printed Subparts

Source `p0059#12`, `p0060#1`:

> 161. 位移是否保持下列性质：1) 两条直线的平行性；2) 直线和平面的平行性；3) 两个平面的平行性.

All three: yes, with the ORIGINAL inclusive definitions.

**1)** Coincident lines have coincident images. Distinct coplanar disjoint lines have images inside the image plane and remain disjoint by injectivity. Thus their images are parallel. The inverse proves the reverse implication; intersecting and skew supports cannot acquire parallelism.

**2)** A contained line remains contained. A disjoint line and plane remain disjoint. A proper intersection point stays exactly one point. All these statements follow from A2 and intersection equality.

**3)** Coincident planes remain coincident; disjoint planes remain disjoint; distinct intersecting planes keep their intersection line. Plane direction independence is retained by $Q$.

### 162: Two Printed Subparts

Source `p0060#2`:

> 162. 证明：1) 中心对称将直线映射成它的平行线；2)将平面映射成它的平行平面.

**1)** A3 gives $Z_0(a+\mathbb Ru)=2o-a+\mathbb Ru$. If $O$ is on the line, image equals original; otherwise they are distinct parallel lines.

**2)** A3 gives the same plane normal and reflected level $2n\cdot o-c$. If $O$ is in the plane, image equals original; otherwise they are distinct parallel planes. Both satisfy the ORIGINAL parallel definitions.

### 163: Seven Printed Subparts

Source `p0060#3`:

> 163. 在关于$O$对称下，如果一个图形映射成它自身，那么点$O$叫做图形的对称中心.下列图形有多少个对称中心？1) 线段；2) 直线；3) 平面；4) 两个平行平面的并集；5) 两个相交平面的并集；6) 相交的直线和平面的并集；7) 平行的直线和平面的并集.

**1)** Exactly one, the midpoint. A bounded nondegenerate segment's endpoints must be exchanged. For a zero-length segment $\{A\}$ the sole center is $A$, the same midpoint formula.

**2)** Every point of the line and no other point, by A3's equality criterion; infinitely many (one-dimensional set).

**3)** Every point of the plane and no other point; infinitely many (two-dimensional set).

**4)** For distinct parallel planes $n\cdot x=c_1,c_2$, equality of the reflected unordered two-level set requires exchanging the levels: $2n\cdot o=c_1+c_2$. Centers are exactly the middle parallel plane, infinitely many. If the planes coincide ($c_1=c_2$), the union is that single plane and all its points are centers.

**5)** For distinct intersecting planes $\alpha,\beta$, each central image has its original direction. They cannot exchange with the other, different-direction plane, so both must be fixed and centers are exactly $\alpha\cap\beta$, an infinite line. If coincidence were admitted under an unrestricted “intersect” reading, the union is one plane and its entire plane is the center set.

**6)** If $L$ meets $\alpha$ in exactly one point $P$, a plane cannot turn into a line under central symmetry, so preserving the union forces the plane to be fixed. The portion of $L$ outside the plane must map onto itself, forcing $L$ fixed too. Centers must lie in $\alpha\cap L=\{P\}$: exactly one. No perpendicularity is required. If $L\subset\alpha$, the union is just $\alpha$: all its points are centers.

**7)** ORIGINAL parallelism includes two branches. If $L\cap\alpha=\varnothing$, the same dimension argument requires a center in both $L$ and $\alpha$, impossible: zero centers. If $L\subset\alpha$, the union equals the plane and every plane point is a center: infinitely many.

For the union arguments, an entire plane cannot be contained in a union of two different planes without being one of them: its intersections with them would otherwise be at most two lines, which cannot cover a plane. Nor can one line cover the missing portion of a different plane. These observations exclude hidden swapping or partial-cover alternatives.

### 164: Two Printed Subparts

Source `p0062#8`:

> 164°. 已知四面体$ABCD$. 在射线$AB$、$AC$、$AD$、$CD$中有没有1) 同方向的？2) 反方向的？

For the source tetrahedron, put $A=0$, $B=u$, $C=v$, $D=w$ with $u,v,w$ independent. Direction vectors are $u,v,w,w-v$. No pair is proportional: the three basis vectors are independent, and proportionality of $w-v$ with any of $u,v,w$ contradicts that independence.

**1)** No distinct listed pair is same-direction. **2)** No distinct listed pair is opposite-direction. This includes all six unordered pairs. Reflexivity still makes each ray same-direction to itself; the task comparison is between distinct listed rays.

If the vertices were coplanar or repeated, they would not define this tetrahedron. For such outside-premise data use A4's scalar test on every nonzero pair; $A=B$, $A=C$, $A=D$, or $C=D$ makes a listed ray undefined. No perpendicular or regular tetrahedron assumption is used.

### 165: Two Printed Subparts

Source `p0062#9`:

> 165°. 已知平行六面体$ABCDA_1B_1C_1D_1$. 在射线$AB$、$AD$、$AA_1$、$BC$、$C_1D$、$BB_1$、$C_1C$、$A_1D_1$中说出：1) 同方向的；2) 反方向的.

D-PAR supplies a genuine, possibly oblique parallelepiped. Set

$$A=0,\ B=u,\ D=v,\ A_1=w,\ C=u+v,\ B_1=u+w,\ D_1=v+w,\ C_1=u+v+w,$$

with $u,v,w$ independent. In exact printed order the eight ray directions are

$$u,\ v,\ w,\ v,\ -u-w,\ w,\ -w,\ v.$$

The fifth literal ray is $C_1D$, NOT $C_1D_1$. Its direction $-u-w$ is a diagonal direction and must not be silently made an opposite $AB$ edge.

**1)** All distinct same-direction pairs are

$$[AD)\uparrow\uparrow[BC),\quad
[AD)\uparrow\uparrow[A_1D_1),\quad
[BC)\uparrow\uparrow[A_1D_1),\quad
[AA_1)\uparrow\uparrow[BB_1).$$

**2)** All distinct opposite-direction pairs are

$$[AA_1)\uparrow\downarrow[C_1C),\qquad
[BB_1)\uparrow\downarrow[C_1C).$$

All other 22 unordered distinct pairs are neither relation: independent $u,v,w$ have different direction spans, and $-u-w$ is proportional to none of them. Each ray is same-direction to itself, but no ray opposite to itself. No rectangularity, equal edge lengths across directions, or orthogonality is assumed.

If $u,v,w$ are dependent, the object is outside the genuine source parallelepiped premise. For any surviving nonzero listed vectors the positive/negative scalar test classifies all coincident or parallel ray possibilities, and $-u-w=0$ or any other zero vector makes that ray undefined. These cases are not absorbed into the stated nondegenerate result.

### 166: Two Printed Subparts

Source `p0062#10`:

> 166. 1°) 射线的方向相反这一性质具有传递性吗？2) 证明，两条射线如果都和第三条射线方向相反，那么它们方向相同.

**1°)** No. For nonzero $u$ take $h_1=H(0,u)$, $h_2=H(0,-u)$, $h_3=H(u,u)$. Then $h_1\uparrow\downarrow h_2$ and $h_2\uparrow\downarrow h_3$, but $h_1\uparrow\uparrow h_3$, not opposite. The first and third are distinct rays, so the example does not depend on allowing equality.

**2)** If $v_1=-a v_3$ and $v_2=-b v_3$ with $a,b>0$, then $v_2=(b/a)v_1$ with positive multiplier. Thus the first two are same-direction. Works with coincident supports/origins, distinct parallel supports, and any positive scales. The hypothesis itself excludes nonparallel supports and zero directions.

### 167: Full Direction And Relative-Position Request

Source `p0062#11`:

> 167. 已知：$[AB)\uparrow\uparrow[MN)$，$[CD)\uparrow\downarrow[MN)$. 射线$AB$和$CD$的相关位置如何？

Let $u=N-M\ne0$. Then $B-A=a u$, $D-C=-b u$ for $a,b>0$. Hence $[AB)\uparrow\downarrow[CD)$; their supporting lines are parallel in the inclusive ORIGINAL sense, not necessarily distinct.

If the supports are distinct parallel lines, the ray sets are disjoint. If the supports coincide, use the unit direction of $u$ and origin coordinates $A=p u$, $C=r u$ after an origin shift. For $p<r$ their intersection is the closed segment $AC$; for $p=r$ it is $\{A=C\}$; for $p>r$ it is empty. Their intersection is never a ray, and skew or nonparallel crossing supports are impossible under the given direction hypotheses. No origin ordering or separation is supplied by the task, so a unique intersection type is UNKNOWN.

If any of $A=B$, $C=D$, or $M=N$ were admitted as raw point data, the corresponding ray/arrow statement would be undefined rather than have a zero direction.

## Errors, UNKNOWN, And Disclosure Status

- **E-REFLEX:** n15-B11 prints reflexivity as $\Phi\cong\Phi_1$. The actual derivation gives $\Phi\cong\Phi$. Source is untouched; no errata file authored.
- **E-DIRECTION:** n16-B14's literal “同一条直线方向相同” is underdetermined without choosing a ray. n16-B15 supports a ray-class reading, but this is a conditional mathematical interpretation, not a source rewrite.
- **E-INVERSE-SCOPE:** earlier n14's global inverse assertion does not follow merely from its injective transformation definition. The inverse on the image is valid; A1 separately proves global inverse for every Euclidean displacement.
- **U160:** the source does not assert $l\perp\alpha$, and no right-angle mark appears in F61. The displacement answer must be conditional. A contained-direction reading of “相交” would not define the off-plane map.
- **U167:** relative origin position is unspecified; opposite direction does not determine empty/point/segment intersection.
- **UFIG:** isolated unassigned specks, no named F65 origins, no separate visible $B$ point mark in F64, and schematic plane-outline contacts are not fabricated mathematical data.
- **Literal guards:** preserve $Z_0$, $\Phi_1\cong\Phi$, $[AB)$, arrow signs, all point subscripts, and especially $C_1D$. No evidence identifies $C_1D$ as an error.
- **Exposure limitation:** the definitions filter overmatch described above remains disclosed. This file is an author artifact, not an independent freeze or certificate.

## Actual Budget And Outputs

Image batches: 1. Original image loads: 6. Each F60-F65 loaded exactly once at original detail. Reopens: 0. Crops: 0. Other image loads: 0. Batch cap 8, used 6, remaining 2. Context cap 24, used 6, remaining 18. Images retained in this context are not claimed cleared.

Coverage: n15 11/11 body objects; n16 17/17; total 28. PNGs 6/6. Tasks 9/9, 159-167. Explicitly printed numbered subparts 20/20; semantic leaves including the two single requests 22/22. Coverage is an author accounting, not independently verified PASS.

Only these three outputs are created:

1. `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-n16-math-author.md`
2. `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-n16-math-author.manifest.json`
3. `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-n16-derived-answer-precursor.json`

The manifest records input hashes, complete inventories, body/task accounting, exact definition provenance, read-scope limitations, and budget. The precursor contains freshly derived answers only, not a production answer contract. Raw output hashes are reported after file creation; the manifest's own hash is external to avoid a self-hash cycle. No validation commands or independent checks run.
