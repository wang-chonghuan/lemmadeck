# STEMROBIN-184: Independent Source Math Review, Stage A Only

Date: 2026-11-16. Working directory: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

Scope: the FULL current ORIGINAL `geo910-c1-s2-n15` and `geo910-c1-s2-n16`, not an edition, a proposed rewrite, or an answer key. This is an independently derived source-first mathematical baseline. Stage B has NOT begun. No author disclosure has been received or opened. A unique subsequent Stage B requires the parent's explicit author disclosure; this Stage A is not to be redone using disclosed material.

## 1. Independence, Access, and Actual Budget

- Read the session entry, engineering, operations (including its final Redlines), and product Charter, plus the original lesson skill, image skill including Image batches, the batch skill `n-evoprompt`, and the IntentFold skill router. No capability, initialization, Grill, backend, Git, DB, production, publication, deployment, merge, closure, or workflow command was executed.
- Read ONLY the two target ORIGINAL `lesson.json`, `lesson.md`, and `exercises.json` as complete lesson/exercise content. The source Markdown's SVG link strings were seen as text; NO SVG was opened.
- The ORIGINAL `book.json` was hashed as an identity binding only. Its content was not read. Its hash matches the user's sole binding book.
- Earlier ORIGINAL material was accessed solely by parsing known `lesson.json` files and returning filtered `prose` records with `kind`, `text`, `printed_page`, and `source_refs`. No earlier Markdown, earlier exercise field, source-page OCR, page image, or earlier figure was exposed. Filtered lookup attempts and their hashes are disclosed below, including empty results.
- Filename discovery was one `rg --files` listing confined to the ORIGINAL 9-10g lessons and `lesson.json` filenames. There was no broad content search.
- Six ORIGINAL figure PNGs were independently opened with `functions.view_image`, each exactly once, `detail: original`. Their inventory below comes from those pixels, not SVGs, specifications, renderings, or author inventories.
- Actual image budget: ONE batch; 6 image loads out of 8 permitted per batch; 6 total images in this context out of 24 permitted. Reopens: 0. Crops: 0. Other page images: 0. Modern/candidate images: 0. Image payloads forwarded to another chat/parent: 0. No second image batch.
- No author/report/manifest/precursor/earlier-review/freeze/answer/choice/modern/template/specification/candidate artifact was opened. No other chat was queried or messaged. No other ticket or grade was worked on.
- Only this absolute report path is written. It did not exist before this invocation; its parent directory already existed. Existing work and source files are preserved.
- No source correction, errata registration, tool/pipeline/test/preparation/finalization/assembly/validation command was run. Read-only file hashes and PNG dimension metadata are source bindings, not pipeline acceptance.
- No numeric token-meter reading is available for this standalone invocation. No invented token usage is reported. The actual bounded visual budget above is directly counted.

Coverage: n15 has 11 body objects (9 prose, 1 figure, 1 caption); n16 has 17 (9 prose, 4 figures, 4 captions). Total: 28/28 body objects. Exercises: all nine 159-167, with 22 leaf requests: 1+2+3+2+7+2+2+2+1. Exercise 160's fig-61 is additionally inventoried; it is not a missing twelfth n15 body object.

## 2. Raw Source Bindings

All hashes are raw-file SHA-256, not normalized-text hashes. All six supplied lesson/exercise hashes matched on inspection.

| Role | Absolute path | Raw SHA-256 |
|---|---|---|
| Sole binding ORIGINAL book; hash only | `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/book.json` | `34ae066f8c1369116330f6b423c4b5a2e5b743b40c0901bfdd45f427c48a07f7` |
| n15 structured body | `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/lessons/geo910-c1-s2-n15/lesson.json` | `78131e44852840b8c1bdb7c273c21d10c70b66ea5ea4c76ee2cd9a9f10bd9da0` |
| n15 ORIGINAL Markdown | `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/lessons/geo910-c1-s2-n15/lesson.md` | `922524deba0a395b2923474704d2bfa61c07db3881e012c5d4e9c1875a710fcd` |
| n15 ORIGINAL exercises | `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/lessons/geo910-c1-s2-n15/exercises.json` | `6d53ac8520088a734935022cf69249fa07b6b63371bd907e7946308511c68ba0` |
| n16 structured body | `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/lessons/geo910-c1-s2-n16/lesson.json` | `d7b77bc175e5ed83743065ab7b01107e40d1f024e576b23740b6fb13a66921c9` |
| n16 ORIGINAL Markdown | `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/lessons/geo910-c1-s2-n16/lesson.md` | `c7d3d2c8dc54a38c0740e9cbbec8ededa4b9e04650a6d12ba809fa7d6548bef3` |
| n16 ORIGINAL exercises | `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/lessons/geo910-c1-s2-n16/exercises.json` | `202c0bbc5c230805edd30dc3a548fdbeff10c9beff43db823155f19db63d794e` |
| Original fig-60, 562 x 417 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-60.png` | `aae24ebf204aa8bbe9d0e7db308e94ae36e8bc15215fd511aeaf8d399c435ccb` |
| Original fig-61, 541 x 486 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-61.png` | `18b2c7ab86e489cbb6b002382e324de5f84633c3ed0ea0399e3a5555f2287830` |
| Original fig-62, 1160 x 355 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-62.png` | `1a7fcf866312be5c9827e8185b55b297e16ae9edd2e2dc4e1dcc89d4268c7cfb` |
| Original fig-63, 595 x 560 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-63.png` | `8bc29170e588184eb2c612dacba4c7bfbf0d83d88e1106454302ba50b8d8ac5f` |
| Original fig-64, 475 x 404 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-64.png` | `1f27aa01ffb48f811328894e535ca46f5c9d534e9468e450d811965679efaafc` |
| Original fig-65, 522 x 456 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-65.png` | `3eca7c34248a5a98b6c02cf830ffc13fd8edaf24a989c3b19d84db5502d23a86` |

The structured n15 identity is `id=card_id=geo910-c1-s2-n15`, number `"15"`, title `空间的位移. 图形的合同`, printed title `§15. 空间的位移. 图形的合同`, chapter `第二章　空间的变换·向量`, section `null`, start physical page 58 / printed 51. Its figure metadata lists fig-60/page 58 and fig-61/page 59; exercise count 5.

The structured n16 identity is `id=card_id=geo910-c1-s2-n16`, number `"16"`, title `空间的方向`, printed title `§16. 空间的方向`, same chapter, section `null`, start physical page 60 / printed 53. Figure metadata: fig-62/page 60; fig-63/page 61; fig-64/page 61; fig-65/page 62; exercise count 4.

### 2.1 Filtered earlier ORIGINAL dependency bindings

These are not substitute review targets. Only the selected prose fields were exposed.

| Absolute JSON path | Raw SHA-256 | Filtered purpose/result |
|---|---|---|
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/lessons/geo910-c1-s2-n14/lesson.json` | `67a7a8e67142b87c753d110b5da9c8f23d751d558de33b69aefb36021ba9000a` | Mapping/image, transformation, central symmetry, identity, inverse and composition definitions/notation |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/lessons/geo910-c1-s1-n1/lesson.json` | `c5053b1aa9289337c0ab47d0e89cb356354aba36e83bb93efe2b83c6256515d2` | Axiom-9 lookup did not find that axiom; filter also exposed the planar/spatial distinction and plane/point/line notation |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/lessons/geo910-c1-s1-n2/lesson.json` | `543f3c62fca64866e0c2615f8e0313eddf6f8a4485509863018244d54f67ded8` | Axiom 9 |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/lessons/geo910-c1-s1-n3/lesson.json` | `cff9f404db4c72886aa3fe7d3901928ee35bba4b20d4daf91479e71b08dafaf1` | Inclusive line parallelism; plane through distinct parallel lines; convexity definition also matched |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/lessons/geo910-c1-s1-n4/lesson.json` | `f3e98449b74ca8f9c090b3e10d7ea81d24f7052de25fa0d13a72c27c29f39ecd` | Unique parallel line through a point, INCLUDING point on the given line |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/lessons/geo910-c1-s1-n5/lesson.json` | `f9f7d16c4b1650357d1861b77918322b5a0a9701e047a93025032eadcdc43a25` | Targeted parallel-definition filter: empty |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/lessons/geo910-c1-s1-n6/lesson.json` | `6c691494416fa49f3cdc9beb0236f1478a97e43ff7c35b35717ad256268e319c` | Skew-line definition matched the targeted parallel-definition filter |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/lessons/geo910-c1-s1-n7/lesson.json` | `f5bbd75eec0d897de1eac552492ce0f232a621449dc68beff41a722f57da5b9a` | Inclusive line-plane parallelism |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/lessons/geo910-c1-s1-n8/lesson.json` | `f4c81d011ac4472359b3b3a394ae0caee38018e6257e1fdf51adc3aad8fd4d72` | Parallel-line bundle definition matched; not used to infer target exercise answers |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/lessons/geo910-c1-s1-n9/lesson.json` | `f6f80f7377124447680d7c965a11781450e06fdd96077b236a94d0b63714ebc2` | Parallelepiped definition matched; subsequent no-common-point/coincidence filter: empty |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/lessons/geo910-c1-s1-n10/lesson.json` | `92c885394be36fcfd3ea7e9037085ce31c36a513833e31a511e97c8751d1ec3b` | Inclusive plane-plane parallelism at `p0035#9` (printed 28), together with paragraphs distinguishing coincident/intersecting/disjoint planes |

Necessary exact earlier premises:

1. `p0055#5`, printed 48: `如果图形$\Phi$的每一个点$M$与图形$F$的唯一的点$M_1$对应，那么这样的对应叫做图形$\Phi$在图形$F$内的映射.同时，点$M_1$叫做点$M$的象.` Image equality, rather than just inclusion in a codomain, is separately discussed at `p0055#9,p0056#1`.
2. `p0056#10`, printed 49: `定义. 在空间到它自身的映射下，如果任意两个不同的点有不同的象，这种映射叫做空间的变换.` This asserts injectivity of a self-map, NOT an additional onto/bijective requirement.
3. `p0056#9,p0056#11`: central symmetry sends each point to its symmetric point about center `$O$`; the actual notation string is `$Z_0$` (literal zero subscript), not `$Z_O$`.
4. `p0057#2`: reversed point pairs define the inverse. An arbitrary injective self-map only has that inverse on its image. A global inverse is not licensed by the transformation definition alone. `p0057#3,p0057#4` give the order `$f(M)=f_2(f_1(M))$` and `$f_2\circ f_1=f$`; `p0057#5` gives `$E(M)=M$`.
5. `p0016#6`, printed 9: `在立体几何中，平行直线的定义仍保留平面几何中的定义：如果两条直线在同一个平面内，且没有公共点或重合，就说这两条直线平行（图 9，а 和 б）.` Coincident lines ARE parallel. Distinct parallel lines determine a unique plane, `p0016#9`.
6. `p0020#4`, printed 13: `б）假设 $M\in a$（图11，б）.在这种情况下，通过 $M$ 且平行于 $a$ 的唯一的直线就是已知直线 $a$.` This closes the on-line case in n16's every-point claim.
7. `p0026#4`, printed 19: `定义. 如果直线和平面没有公共点或直线在平面内，就说直线和平面平行.` A contained line IS parallel to its plane.
8. `p0035#9`, printed 28: `定义. 如果两个平面没有公共点或者重合，就说这两个平面平行.` Coincident planes ARE parallel.
9. `p0013#7`, printed 6: `公理 9．在平面几何中学过的顺序公理、平面运动公理和平行公理，对于每一个平面都成立．`
10. `p0032#9`, printed 25: `这四条线段的端点是多面体的顶点，所有的六个面都是平行四边形. 这样的多面体叫做平行六面体.` Nothing here makes a parallelepiped rectangular.

## 3. Independently Derived Mathematical Basis

Coordinates in this section are reviewer proof devices, NOT extra source labels, a replacement for ray notation, or measurements read from a drawing. The ambient space is ordinary three-dimensional Euclidean space. A line has nonzero direction; a plane has two independent direction vectors; a genuine tetrahedron/parallelepiped is three-dimensional. These are the domains of the named objects, not extra generic-position restrictions on arbitrary configurations.

### 3.1 Isometry without assuming a global inverse

Let a self-map `$F:\mathbb R^3\to\mathbb R^3$` satisfy `$|F(x)-F(y)|=|x-y|$` for all points.

First, if `$F(x)=F(y)$`, then `$|x-y|=0$`, hence `$x=y$`. This alone proves it is a source-defined transformation.

Now prove, rather than assume, the stronger fact needed by n15's inverse claim. Put `$b=F(0)$`, and for an orthonormal coordinate basis `$e_1,e_2,e_3$`, put `$q_i=F(e_i)-b$`. Distances give `$|q_i|=1$` and, for `$i\ne j$`, `$|q_i-q_j|^2=2$`; hence `$q_i\cdot q_j=0$`. The three `$q_i$` form an orthonormal basis of the SAME three-dimensional target.

For any `$x$`, `$y=F(x)-b$` obeys

`$|y|^2=|x|^2$`, and `$|y-q_i|^2=|x-e_i|^2$`.

Subtracting gives `$y\cdot q_i=x_i$`. Thus

`$F(x)=b+Qx$`, with `$Qe_i=q_i$` and `$Q^TQ=I$`.

Consequently `$F$` is onto, and its global inverse is `$F^{-1}(z)=Q^T(z-b)$`, which preserves distances. Onto and the inverse are DERIVED here from distance preservation in finite-dimensional Euclidean space, not silently inserted into "space transformation."

The source's earlier global-inverse assertion for an arbitrary transformation is a dependency gap: `$f(x,y,z)=(e^x,y,z)$` is an injective self-map, but its image is only the half-space with first coordinate positive. Its inverse is defined there, not on all space. This counterexample does not contradict the proved stronger theorem for motions.

### 3.2 Image properties, including degenerate inputs

For `$F(x)=b+Qx$`:

- A line `$a+\mathbb R u$` maps EXACTLY to `$F(a)+\mathbb R Qu$`, not just a subset of it.
- A plane `$a+U$`, with `$U$` two-dimensional, maps EXACTLY to `$F(a)+QU$`.
- A segment `$\{(1-t)A+tB:0\le t\le1\}$` maps exactly to the segment with corresponding endpoints; `$A=B$` gives the singleton case.
- A half-plane is understood within its supporting plane. An affine signed-side inequality becomes the corresponding inequality after `$Q$`; a half-space works identically. Boundary-included versus boundary-excluded conventions are preserved, not chosen by this review.
- A tetrahedron, interpreted as the convex hull of its vertices, maps to the corresponding convex hull by preservation of affine combinations. Genuine affine independence is preserved; the same convex-hull identity remains valid for a degenerate hull without pretending it is a genuine tetrahedron.
- For nonzero edge directions `$u,v$`, `$Qu\cdot Qv=u\cdot v$` and lengths are unchanged, so ordinary angles are unchanged. A zero edge does not define an angle. No claim about oriented angles or orientation preservation follows: `$Q$` can have determinant `-1`.
- For any sets `$S,T$`, injectivity gives `$F(S\cap T)=F(S)\cap F(T)$`; equality, disjointness, and inclusion are preserved. Together with the image formulas this handles ALL inclusive-parallel cases.

### 3.3 Central symmetry

For center `$o$`, the source's `$Z_0$` is `$x\mapsto2o-x$`.

`$Z_0(x)-Z_0(y)=-(x-y)$`, so distances are equal, including coincident points. Also `$Z_0^2=E$`.

The points `$O,M,N,M_1,N_1$` lie in a plane containing `$O,M,N$`, because `$M_1=2O-M$`, `$N_1=2O-N$`. If `$O,M,N$` are collinear, coincide, or include `$O=M$`/`$O=N$`, choose any plane containing the resulting line or point. Its existence suffices; its uniqueness is NOT needed. That plane contains `$O$`, is invariant under `$Z_0$`, and axiom 9 permits the planar proof.

### 3.4 Rays and direction, not vectors substituted for source notation

Source `$AB$` in a sentence explicitly saying `射线` means ray `$[AB)$`, not a segment, infinite line, or arrow-vector. Its defining points must satisfy `$A\ne B$`.

For proof only, write `$h=\{a+tu:t\ge0\}$`, where `$u\ne0$`. Two rays are same-directed exactly when their proof directions satisfy `$u_2=\lambda u_1$` with `$\lambda>0$`; opposite-directed exactly when `$\lambda<0$`. This is justified from BOTH source cases:

1. On distinct parallel supporting lines, the line through the origins meets each carrier at that origin. A signed affine side-function of that separator has nonzero increment in the common carrier direction. Matching signs put the non-origin ray portions on the same side; opposite signs put them on opposite sides. Origins themselves lie on the boundary. Closed half-planes contain the full rays; with an open-side convention the statement applies to their non-origin portions.
2. On one supporting line, choose a coordinate `$s$`. Same-oriented rays `[a,infinity)` and `[b,infinity)` intersect in `[max(a,b),infinity)`, a ray; the negative-oriented version also intersects in a ray. Oppositely oriented rays `[a,infinity)` and `(-infinity,c]` intersect in `[a,c]` if `$a<c$`, a singleton if `$a=c$`, and the empty set if `$a>c$`. None is a ray.

Thus coincidence, shared origins, overlapping opposite rays, and disjoint opposite rays are all included. A singleton or "zero ray" cannot be assigned a direction by these definitions.

No common plane containing THREE parallel rays is assumed. Three parallel carriers can be noncoplanar; the direction-sign proof still applies.

## 4. FULL n15 Body: 11/11 Objects

Indices below are the one-based order in current `lesson.json.prose`, not inferred page-block indices. Each quoted source text retains its literal math strings.

### n15.01 - Distance-preserving class

Kind `p`; printed 51; raw refs `p0058#4`.

> 从全体变换的集合中划分出一类变换. 在这种变换下，任意两点间的距离等于它们的象之间的距离. 我们说，这样的变换保持距离不变. 例如，中心对称是保距变换. 我们来证明这一点.

Covered: universal quantifier over every pair, image distances, and the central-symmetry example. Proof is Section 3.3. Equal points cause no exception. Being a transformation is not strengthened to being onto by definition.

### n15.02 - Planar reduction of central symmetry

Kind `p`; printed 51; raw refs `p0058#5`.

> 假设中心对称$Z_0$将空间任意两点$M$和$N$分别映射成点$M_1$和$N_1$（图60），点$O$、$M$、$N$、$M_1$、$N_1$属于同一个平面. 用$\alpha$表示这个平面. 在中心对称$Z_0$下，平面$\alpha$映射成它自身，并且这个映射可以看成是平面$\alpha$内关于中心$O$的中心对称. 但平面的中心对称保距，因而$|M_1N_1|=|MN|$.

Covered: point correspondences, coplanarity, invariance of the chosen plane, restriction to its planar symmetry, and final distance equation. Section 3.3 proves every step and all collinear/coincident cases. The literal symbol is `$Z_0$`; the center point is `$O$`. The illustration does not limit "arbitrary" to its drawn noncollinear layout.

### n15.03 - fig-60 body object

Kind `fig`; id `fig-60`; label `图 60`; printed 51; refs `p0058#6`; source text is empty. Pixel inventory in Section 6.1 covers all named points, label positions, and strokes. This belongs to the body, not to an exercise.

### n15.04 - fig-60 caption

Kind `cap`; exact text/label `图 60`; printed 51; refs `p0058#7`; id `null`. Caption is its own body object, not an extra mathematical assertion or a label found inside the PNG.

### n15.05 - Definition 1

Kind `p`; printed 51; refs `p0058#8`.

> 定义1. 空间的保距变换叫做位移.

Covered: "motion" means distance-preserving space transformation, NOT only a translation or only an orientation-preserving rigid motion. Central symmetry is included. Section 3.1 derives the global image properties without modifying this definition.

### n15.06 - Identity, inverse, composition

Kind `p`; printed 51; refs `p0058#9`.

> 从位移的定义得出：а) 恒等变形是位移；б) 位移的逆变换是位移；в) 两个位移的合成是位移；

All three clauses covered:

- а) `$|E(x)-E(y)|=|x-y|$`.
- б) Existence of a global inverse is first derived in Section 3.1. If `$u=F(x),v=F(y)$`, then `$|F^{-1}(u)-F^{-1}(v)|=|x-y|=|u-v|$`.
- в) In the source order `$F_2\circ F_1$`, two applications of distance preservation give `$|F_2(F_1(x))-F_2(F_1(y))|=|F_1(x)-F_1(y)|=|x-y|$`.

The source spelling `恒等变形` is retained. Cyrillic clause labels are not Latin replacements.

### n15.07 - Lines and planes

Kind `p`; printed 51; refs `p0058#10,p0059#1` (one assembled object across pages).

> 以后还将应用位移的另外的性质. 任何位移将直线映射成直线，将平面映射成平面.

Covered by the exact affine image formulas in Section 3.2. An infinite line or plane is mapped onto the entire corresponding line/plane as a proved consequence, not by assuming a generic injective map is onto.

### n15.08 - Segments, half-planes, half-spaces, tetrahedra, angles

Kind `p`; printed 52; refs `p0059#2`.

> 可以同样证明，位移$F$将线段$AB$映射成线段$F(A)F(B)$；把以$p$为边界的半平面映射成以$F(p)$为边界的半平面；把以$\alpha$为边界的半空间映射成以$F(\alpha)$为边界的半空间；把四面体$ABCD$映射成四面体$F(A)F(B)F(C)F(D)$，等等. 最后，在位移下角度保持不变是位移的一个重要性质.

All five explicit image/measurement assertions covered in Section 3.2. `$p$` is the bounding line of a half-plane within a plane, not an ambient half-space boundary. `$F(\alpha)$` is the half-space boundary plane. Endpoint order is kept. Zero-length segments are valid singleton images; zero-edge angles are undefined; genuinely three-dimensional tetrahedra stay genuine. Open/closed boundary convention and orientation are not silently changed.

### n15.09 - Definition 2

Kind `p`; printed 52; refs `p0059#3`.

> 定义2. 如果存在位移将$\Phi$映射成$\Phi_1$，图形$\Phi_1$称为图形$\Phi$的合同图形.

Covered: congruence is existence of one ambient motion with image equality `$F(\Phi)=\Phi_1$`. Merely placing a smaller image inside a larger figure is not congruence. Arbitrary figures, not only tetrahedra, are permitted.

### n15.10 - Congruence notation

Kind `p`; printed 52; refs `p0059#4`.

> 记作：$\Phi_1\cong\Phi$.

Literal operand order retained. The relation is subsequently symmetric, but that does not authorize changing the source string.

### n15.11 - Reflexivity, symmetry, transitivity

Kind `p`; printed 52; refs `p0059#5`.

> 从位移的性质а) — в)得出图形合同具有反身性（$\Phi\cong\Phi_1$），对称性（如果$\Phi_1\cong\Phi$，那么$\Phi\cong\Phi_1$），传递性（如果$\Phi_1\cong\Phi$，$\Phi_2\cong\Phi_1$，那么$\Phi_2\cong\Phi$）.

Independent proofs: identity gives self-congruence `$ \Phi\cong\Phi $`; a witnessing motion's now-proved global inverse gives symmetry; ordered composition gives transitivity. These also work for empty/singleton figures.

SOURCE TEXT ERROR: the bracketed source formula called reflexivity is literally `$\Phi\cong\Phi_1$`, not self-congruence. It does not express reflexivity unless the two symbols name the same figure, which is not stated. The independent mathematical conclusion above is explicitly distinguished from that unchanged raw string. Whether this originated in printing or transcription is UNKNOWN without the prohibited source-page comparison.

## 5. FULL n16 Body: 17/17 Objects

### n16.01 - Motivation and scope

Kind `p`; printed 53; refs `p0060#5`.

> 在日常用语中常常使用“方向”这个词. 例如，说大型飞机飞行的方向或者星际站的运动方向. 在八年级学校课程里，你们熟悉了平面上的方向概念. 下面，我们对于空间阐明这个概念的意义.

Covered: everyday examples and transition from planar to spatial direction, with no numerical aircraft/station data or extra velocity/vector premise. The earlier-grade mention is source prose, not authorization to inspect another grade.

### n16.02 - Distinct parallel carriers

Kind `p`; printed 53; refs `p0060#6,p0061#1`.

> 1. 设射线$h_1=[O_1A_1)$和$h_2=[O_2A_2)$在不同的平行直线上. 于是这两条直线在某个平面$\alpha$内（§3）. 研究它的以$(O_1O_2)$为边界的两个半平面$\alpha_1$和$\alpha_2$. 如果两条已知的射线在这两个半平面中的同一个半平面上（图62，а），那么这样的两条射线叫做同方向的；如果$h_1$和$h_2$在不同的半平面上（图62，б），那么这样的两条射线叫做反方向的.

Covered: BOTH defined relations; distinctness of carriers; coplanarity; separator through origins; half-plane labels; exact ray endpoint order. Section 3.4 proves the equivalence with positive/negative direction multiples. Origins on the separator must not be interpreted as a contradiction to the side description. Distinct carriers ensure distinct origins and ensure the carrier direction is not the separator direction. No perpendicularity is required.

### n16.03 - fig-62

Kind `fig`; id `fig-62`; label `图 62`; printed 53; refs `p0060#7`; empty text. Both subfigures and all their point/ray/half-plane labels are inventoried in Section 6.3.

### n16.04 - fig-62 caption

Kind `cap`; exact text/label `图 62`; printed 53; refs `p0060#8`; id `null`. Independently counted caption, not part of PNG content.

### n16.05 - Same carrier, intersection criterion

Kind `p`; printed 54; refs `p0061#2`.

> 2. 设射线$h_1$和$h_2$在同一条直线上. 如果它们的交集是射线，这两条射线叫做同方向的（图63，а），如果$h_1\cap h_2$不是射线（图63，б、в、г），它们叫反方向的.

Covered: same carrier including identical rays; intersection criterion; ALL three opposite-direction possibilities (empty, nonzero segment, singleton). Section 3.4 gives explicit interval formulas. "Not a ray" is scoped to this same-line situation, not to arbitrary skew or nonparallel rays.

### n16.06 - fig-63

Kind `fig`; id `fig-63`; label `图 63`; printed 54; refs `p0061#3`; empty text. All four ordered rows are inventoried in Section 6.4.

### n16.07 - fig-64

Kind `fig`; id `fig-64`; label `图 64`; printed 54; refs `p0061#4`; empty text. Full inventory in Section 6.5. The object precedes both captions in the actual body array; its array position is retained.

### n16.08 - fig-63 caption

Kind `cap`; exact text/label `图 63`; printed 54; refs `p0061#5`; id `null`.

### n16.09 - fig-64 caption

Kind `cap`; exact text/label `图 64`; printed 54; refs `p0061#6`; id `null`.

### n16.10 - Signs and construction through M

Kind `p`; printed 54; refs `p0061#7`.

> 射线$h_1$和$h_2$是同方向的，记作$h_1\uparrow\uparrow h_2$. 如果$h_1$和$h_2$是反方向的，那么记作$h_1\uparrow\downarrow h_2$. 如果给定射线$AB$和点$M$（图64）. 过点$M$作直线$m$平行于$(AB)$（§4，问题）. 这样的直线是唯一的. 我们研究在直线$m$上有公共始点$M$的射线$m_1$和$m_2$. 它们中的一条与射线$AB$是同方向的（图64中的$m_1$）.另外一条射线与$[AB)$是反方向的.

Covered: exact same/opposite signs, ray `$AB$` versus carrier `$(AB)$`, unique carrier `$m$`, exactly two rays starting at `$M$`, and assignment of `$m_1$`/`$m_2$`.

For `$u=B-A\ne0$`, `$m=M+\mathbb R u$` and the rays are `$M+tu$` and `$M-tu$`, `$t\ge0$`. If `$M\in(AB)$`, the unique parallel line IS `$(AB)$` under the actual inclusive definition; this includes `$M=A$`, `$M=B$`, and points on either extension. If off the carrier, the two parallel carriers are distinct and coplanar. No hidden off-line assumption is imposed.

### n16.11 - Every-point uniqueness

Kind `p`; printed 54; refs `p0061#8`.

> 于是，以空间的每一个点为始点的射线只有一条与已知射线方向相同，同时也只有一条射线同已知射线方向相反.

Covered: existence and uniqueness for EVERY point, for each of the two signs. The carrier uniqueness plus the two orientations proves this, including all on-line cases. It is not a statement about a unique finite vector length.

### n16.12 - Central symmetry reverses each ray

Kind `p`; printed 54; refs `p0061#9`.

> 我们指出，中心对称将每一条射线映射成方向相反的射线. 为了证明这一点，只要过射线和对称中心作平面，并利用公理9.

Proof: `$Z_0(a+tu)=2o-a-tu$`, `$t\ge0$`, has direction `$-u$`. If the center is off the carrier, source/image carriers are distinct parallel lines. If on it, the carriers coincide; with original ray coordinate `[a,infinity)` and center coordinate `$c$`, the image is `(-infinity,2c-a]`. Their intersection is a segment if `$c>a$`, the origin singleton if `$c=a$`, empty if `$c<a$`. In every case the direction reverses. A center at the ray's origin fixes that point but NOT the ray.

A plane through carrier and center exists; if the center is on the carrier, it is not unique and may be chosen arbitrarily. Axiom 9 allows the planar argument. No center-off-line generic-position premise is added.

### n16.13 - Same-direction equivalence properties

Kind `p`; printed 55; refs `p0062#1`.

> 在空间里，如同平面上一样，射线的方向相同具有反身性：$h\uparrow\uparrow h$；对称性：如果$h_1\uparrow\uparrow h_2$，那么$h_2\uparrow\uparrow h_1$；传递性：如果$h_1\uparrow\uparrow h_2$和$h_2\uparrow\uparrow h_3$，那么$h_1\uparrow\uparrow h_3$（图65）.

All three properties proved by positive multiples: `$u=1u$`; invert a positive multiplier; multiply two positive multipliers. The proof handles identical rays, coincident carriers, and noncoplanar triples. The drawn noncollinear origins do not impose that layout on the theorem.

### n16.14 - Definition of spatial direction

Kind `p`; printed 55; refs `p0062#2`.

> 所有与同一条直线方向相同的射线的集合，叫做在空间的方向.

SOURCE TERMINOLOGY DEFECT/AMBIGUITY: the literal comparison object is `同一条直线`, an unoriented line, whereas the preceding same-direction relation is defined for rays. An unoriented line has two opposite orientations; the set of all rays merely parallel to it contains both, and is NOT one same-direction class.

The coherent mathematical object established by the preceding equivalence relation and the following paragraph is one equivalence class of nonzero rays under `$\uparrow\uparrow$`. This interpretation is derived and flagged, not silently substituted into the source sentence. An independently oriented line could also specify such a class, but the source sentence gives no orientation. Printing-versus-transcription origin of the wording is UNKNOWN.

### n16.15 - A representative ray specifies a direction

Kind `p`; printed 55; refs `p0062#3,p0062#6`.

> 任何一条射线完全确定与它同方向的射线的全体的集合. 因此，以后空间的方向将利用一条射线来给出.

Covered: a ray specifies its whole same-direction class; any two representatives in that class specify the same class by reflexivity/symmetry/transitivity. The source object is one assembled paragraph with refs on both sides of the intervening figure/caption, not two independent paragraphs.

### n16.16 - fig-65

Kind `fig`; id `fig-65`; label `图 65`; printed 55; refs `p0062#4`; empty text. Inventory in Section 6.6, including all unlabeled origins and connector lines. The reference plane is not labeled `$\alpha$` in the pixels.

### n16.17 - fig-65 caption

Kind `cap`; exact text/label `图 65`; printed 55; refs `p0062#5`; id `null`.

## 6. Six Original-Pixel Inventories

These are inventories of visible mathematical stroke chains and labels, not a count of antialiased pixels or accidental scan specks. A silhouette boundary is a representation of a plane, not a finite mathematical boundary of that plane. Unless explicitly described otherwise, strokes are unarrowed. None of the six PNGs contains a numerical length, angle value, axis, grid, equality tick, right-angle marker, or vector-arrow label. Mathematical midpoint/parallel facts come from the cited text, not from measuring projected scan lengths.

Some handwritten shapes are intrinsically ambiguous as Unicode: a pixel `a)` cannot establish Latin versus Cyrillic codepoint, and an oval point label cannot alone establish letter O versus digit 0. Point names/subscripts below identify the visible glyphs in their supplied textual context; this does NOT change literal `$Z_0$` in the prose.

### 6.1 fig-60: central symmetry in a plane

Opened once at 562 x 417 original detail.

- One irregular, closed, oblique oval-like plane outline, label `$\alpha$` low inside it.
- Five marked named positions: `$M_1$` upper-left; `$N_1$` lower-left; `$O$` at the central crossing; `$N$` upper-right; `$M$` lower-right. All five have dark point/intersection marks. `$M_1$` and `$N_1$` visibly retain subscript 1; the other names do not.
- Stroke chain `$M_1-O-M$`: a thin solid diagonal from upper-left to lower-right, with `$O$` on it.
- Stroke chain `$N_1-O-N$`: a solid nearly horizontal, slightly rising left-to-right segment, with `$O$` on it.
- Solid side stroke `$M_1-N_1$` on the left, relatively heavy; solid side stroke `$N-M$` on the right, relatively heavy.
- No side stroke `$M_1-N$` or `$N_1-M$`; no polygon whose fourth sides should be invented. No dashed chain or arrowhead.
- Textual central pairs are `$M\leftrightarrow M_1$`, `$N\leftrightarrow N_1$`, NOT `$M\leftrightarrow N_1$`. Pixels show the crossing incidences; exact midpoint status and equal opposite lengths are prose-backed, not marked by ticks.
- The PNG does not contain the external `图 60` caption. Tiny isolated ink flecks carry no identifiable mathematical label.

### 6.2 fig-61: exercise 160, oblique reflection construction

Opened once at 541 x 486 original detail.

- One irregular plane outline, oblique oval-like footprint, label `$\alpha$` lower-left inside.
- Four named marked points: `$M$` upper-left, `$N$` upper-middle/right, `$M_1$` bottom-left below the footprint, `$N_1$` bottom-middle/right below it. Subscript 1 is retained at the bottom points.
- Three additional dark, unlabeled positions: a point on the `$MM_1$` carrier inside the plane footprint; a point on the `$NN_1$` carrier inside it; a point on the right-hand `$l$` carrier inside it. The source gives them NO names. Calling them `$H_M,H_N,H_l$` would be reviewer shorthand only, not a source-label inventory.
- Three approximately vertical/oblique supporting stroke chains: `$M-M_1$`, `$N-N_1$`, and the right-hand line labeled `$l$` near its upper end. The lowercase line glyph resembles a handwritten L; the source prose identifies it as `$l$`, not a new uppercase point L.
- The `$M-M_1$` chain is solid above/through the upper visible portion and dashed along part of the hidden lower passage, then solid to `$M_1$`. The `$N-N_1$` chain likewise has a solid upper part, dashed hidden passage, and a solid lower continuation. `$l$` has a solid upper part to its visible point, a dashed hidden portion, and a solid continuation below the footprint.
- Three transverse connector strokes: a solid `$MN$` top segment, sloping downward toward `$N$`; a solid segment between the two unlabeled points on the first two carriers inside the plane; a solid `$M_1N_1$` bottom segment, nearly horizontal.
- The plane outline crosses the carriers; outline crossings are not additional named points. The solid/dashed distinctions must not be flattened into three uninterrupted visible solids.
- No right-angle box, no perpendicular label, no bisection tick, no numerical length, no arrowhead, no caption inside the PNG. Apparent carrier alignment in projection does not assert `$l\perp\alpha$`.
- Required textual mathematics: the midpoint of each `$MM_1$` is on `$\alpha$` and its carrier is parallel to `$l$`; the corresponding assertions for `$N$` are an illustration of the same mapping rule. The visible midpoint connector is not an added answer annotation.

### 6.3 fig-62: two subfigures on distinct parallel carriers

Opened once at 1160 x 355 original detail. Two complete plane-outline subfigures lie side by side; their lower panel glyphs correspond to source references а and б. No external `图 62` caption is inside the PNG.

Left panel (а, same direction):

- One closed irregular plane outline. A thick separator stroke crosses from its upper-left edge to lower-left edge through `$O_2$` (upper) and `$O_1$` (lower).
- Two rays extend rightward from those origins to the right footprint: upper `$h_2$`, ending at the position labeled `$A_2$`; lower `$h_1$`, ending at the position labeled `$A_1$`.
- All named positions/labels: `$O_1,O_2,A_1,A_2,h_1,h_2,\alpha_1,\alpha_2$`. `$O_1,O_2$` are dark origin junctions; `$A_1,A_2$` are labeled positions at the footprint/ray ends without separate isolated dot markers.
- `$\alpha_1$` is written on the large right side containing both non-origin ray portions; `$\alpha_2$` is written on the left of the separator.
- Upper ray is slightly downward toward the right in the scan; lower ray has the same approximate projected orientation. No perpendicularity or slope number is encoded.

Right panel (б, opposite direction):

- One closed irregular plane outline. A thick diagonal separator goes from upper-left to lower-right through upper-left `$O_2$` and lower-right `$O_1$`.
- `$h_2$` runs from `$O_2$` down-left to the position labeled `$A_2$` on the left footprint. `$h_1$` runs from `$O_1$` up-right to `$A_1$` at the right footprint.
- The same eight mathematical labels occur. `$O_1,O_2$` are dark origin junctions; endpoint positions `$A_1,A_2$` are labeled at outline intersections, not independently isolated dots.
- `$\alpha_1$` labels the side containing `$h_1$`; `$\alpha_2$` labels the side containing `$h_2$`.
- No arrows, dashes, equal-length marks, numerical values, or other point labels. Ray origins, not arrowheads, provide the endpoint order in the source explanation.

### 6.4 fig-63: four same-line intersection configurations

Opened once at 595 x 560 original detail. Four horizontal stroke configurations in top-to-bottom order corresponding to source а, б, в, г; no external caption inside.

1. а: marked `$O_1$` left of marked `$O_2$`; `$h_1$` label above the inner/right-going portion after `$O_1$`; `$h_2$` farther right after `$O_2$`. Both rays run to the right. Their common right-going tail is thick/overprinted. A thin leftward baseline continuation is visible; it is not an arrow or a third ray. Intersection is a ray.
2. б: `$O_1$` left of `$O_2$`, both marked. `$h_1$` label on the left-running portion ending at `$O_1$`; `$h_2$` label on the right-running portion starting at `$O_2$`. They point away from the intervening gap. The thin carrier is still drawn between origins: that is NOT a shared ray segment. Intersection is empty.
3. в: `$O_1$` left of `$O_2$`, both marked. `$h_2$` label is on the left portion; `$h_1$` is on the right portion. `$h_1$` starts at `$O_1$` toward the right; `$h_2$` starts at `$O_2$` toward the left. The common segment between origins is heavier. Intersection is the nonzero segment `$O_1O_2$`.
4. г: a single marked shared origin, exact visible equality label `$O_1=O_2$` below it. `$h_1$` labels the left-going portion; `$h_2$` labels the right-going portion. Intersection is that one origin.

All rows preserve ray labels `$h_1,h_2$` and origin subscripts. No endpoint `$A_i$` labels occur. No arrowheads or dashed carriers are drawn. Thickness/overprinting and label placement, read together with the raw definition, distinguish the ray portions from the underlying carrier. The four configurations cannot be replaced by a single generic pair of parallel arrows.

### 6.5 fig-64: unique same/opposite rays through a point

Opened once at 475 x 404 original detail.

- Left: a solid oblique ray stroke from a dark point `$A$` low-left toward upper-right. The `$B$` glyph is beside an interior position of this stroke; there is NO isolated marked dot at `$B$` and NO arrowhead at the upper tip.
- Right: a parallel oblique full carrier through a dark point `$M$`, extending both down-left and up-right. Label `$m$` appears beside the upper carrier region.
- Its upper/right ray portion is heavier and labeled `$m_1$`; its lower/left portion is finer and labeled `$m_2$`. They share exactly the visibly marked origin `$M$`.
- All six label strings: `$A,B,M,m,m_1,m_2$`. `$A,B,M$` are point names and the other three are carrier/ray labels. No `$O$` label, plane outline, extra connecting segment, right-angle mark, arrow, or caption occurs.
- The depicted `$M$` is off `$(AB)$`; that is one example, not a restriction on the every-point theorem. No metric distance between the parallel carriers is specified.

### 6.6 fig-65: transitivity in space

Opened once at 522 x 456 original detail.

- One closed irregular oblique plane footprint. NO plane letter or origin-point name is printed.
- Three dark, unlabeled origin junctions: left/back, middle/front (low), and right/back.
- Three heavy, unarrowed, upward-going ray strokes: left labeled `$h_3$`, middle labeled `$h_2$`, right labeled `$h_1$`. Their upper tips lie at different drawn heights; these are finite illustrative truncations, not different prescribed ray lengths or isolated labeled endpoint points.
- Three thinner straight connector/carrier chains form the triangle of the three origins and continue to the footprint boundary beyond the origins: left-origin to right-origin, left-origin to middle-origin, and middle-origin to right-origin. They are not extra rays with their own labels.
- Approximate visual incidences: left-right chain slopes slightly downward to the right; left-middle chain slopes steeply down-right; middle-right chain slopes up-right. Each reaches the plane outline at both ends of its drawn chain.
- All three ray origins are incident with their two triangle-side chains. No dashed/hidden chain, numerical value, right-angle marker, origin subscripts, vector arrow, or caption is present.
- The plane through the three drawn origins is a reference footprint. It does not say all three rays are in that plane; three distinct parallel carriers through noncollinear origins can be noncoplanar. The vertical-looking projection is not a perpendicularity premise.
- REQUIRED semantic labels are `$h_3$` on the left and `$h_1$` on the right, not the reverse. The theorem must also cover collinear/coincident origins not drawn here.

## 7. ALL Nine Source Exercises and Every Request

All exercises retain group `习　题`, group_id `g1`, and source_number equal to their string number. The `°` in 159/164/165 and `1°)` in 166 is preserved as a source marker, not interpreted as an angle unit.

### 159 - Is every distance-preserving self-map a transformation?

Raw source, n15; refs `p0059#7`; figure_refs `[]`; display figures `[]`.

> 159°. 任何将空间映射成自身的保距映射是空间变换吗？

Request 159.1: **Yes.** If two image points coincide, their distance is zero; preservation makes the original distance zero, so the original points coincide. This is exactly the injectivity criterion in the earlier ORIGINAL definition.

No onto/bijective assumption is necessary. If `映射成自身` is given its stricter earlier image-equality reading, the same injectivity proof still answers yes; if read as a self-map into space, Section 3.1 also proves onto as a separate Euclidean theorem. Neither reading warrants redefining "transformation."

Zero distances/coincident input points are part of the quantifier, not a counterexample.

### 160 - Directional reflection about a plane

Raw source, n15; refs `p0059#8,p0059#11`; figure_refs `["fig-61"]`; one display figure `{id:"fig-61",label:"图 61"}`.

> 160. 已知平面$\alpha$以及和$\alpha$相交的直线$l$. 使每一个点$M\notin\alpha$对应这样的点$M_1$：$(MM_1)\parallel l$，而且$\alpha$平分线段$MM_1$（图61）. 使平面$\alpha$的任何点对应这点本身. 这样给出的将空间映射成自身的映射1) 是空间变换吗？2) 是位移吗？

Premises: the given line is transverse to the plane, i.e. meets it in one point; it is NOT assumed perpendicular. The rule has a separate fixed-point branch for `$M\in\alpha$`.

Write `$\alpha=\{x:n\cdot x=c\}$`, `$|n|=1$`, and let `$v\ne0$` be a direction of `$l$` with `$n\cdot v\ne0$`. The unique line through `$x$` parallel to `$l$` meets the plane at

`$H=x-\frac{n\cdot x-c}{n\cdot v}v$`.

Thus the given image is uniquely

`$T(x)=2H-x=x-2\frac{n\cdot x-c}{n\cdot v}v$`.

This formula also gives `$T(x)=x$` on the plane. Off it, `$T(x)\ne x$`, its joining carrier is parallel to `$l$`, and `$H=(x+T(x))/2$` is on the plane.

Request 160.1: **Yes, always for this transverse premise.** Since `$n\cdot T(x)-c=-(n\cdot x-c)$`, applying the formula twice yields `$T^2(x)=x$`. Therefore it is single-valued and injective; indeed this specific map has a proved global inverse equal to itself. The latter is a derived stronger fact, not a transformation-definition requirement.

Request 160.2: **It is a motion if and only if `$l\perp\alpha$`; it is not a motion in the general oblique case.**

Proof of both directions: shift the origin to the plane and scale `$v$` so `$v=n+w$` with `$w\perp n$`. Write `$x=u+zn$`, `$u\perp n$`. Then

`$T(u+zn)=u-2zw-zn$`.

If `$w=0$`, this is ordinary orthogonal reflection, preserving all distances. If `$w\ne0$`, choose `$P=n$` and `$R=0$` on the plane. Initially `$|P-R|=1$`, while `$T(P)=-n-2w$`, `$T(R)=0$`, so `$|T(P)-T(R)|=\sqrt{1+4|w|^2}>1$`. Thus it fails the universal distance condition.

Domains/degeneracies:

- Points in the plane are fixed; do NOT form the undefined line `$(MM_1)$` when `$M=M_1$`. That carrier condition belongs only to the off-plane branch.
- If `$l$` were contained in the plane or disjoint and parallel to it, `$n\cdot v=0$`; the off-plane midpoint construction would be impossible. Those are not valid transverse instances. Reading mere set intersection to allow a contained `$l$` makes the exercise ill-posed, not another reflection case.
- `$M=N$` or coincident projected midpoint positions in an illustration do not invalidate the pointwise map.
- fig-61 supplies no perpendicular marker. Perspective lengths/slopes cannot establish a distance-preserving special case.

### 161 - Preservation of all three parallelisms

Raw source, n15; refs `p0059#12,p0060#1`; no figure refs or display figures.

> 161. 位移是否保持下列性质：1) 两条直线的平行性；2) 直线和平面的平行性；3) 两个平面的平行性.

All three requests: **Yes**, under the actual inclusive definitions.

161.1, line-line: if carriers have the same one-dimensional direction subspace, their images have the same subspace transformed by `$Q$`. Distinct parallel lines remain distinct and disjoint; coincident lines remain coincident. Parallelism is not replaced by "strictly disjoint" parallelism.

161.2, line-plane: a parallel line's direction lies in the plane's direction subspace. `$Q$` preserves that inclusion. If the line lies in the plane, its image lies in the image plane; if they are disjoint, injectivity preserves disjointness. These are precisely the two permitted parallel cases.

161.3, plane-plane: equal direction subspaces remain equal after `$Q$`; coincident planes remain coincident, distinct parallel planes remain distinct and disjoint. Again both source cases are included.

For all three, the inverse motion derived in Section 3.1 proves the converse as well: the relation cannot be newly created between formerly nonparallel objects. Nonparallel intersections and skew-line status are correspondingly preserved; no position restriction is needed.

### 162 - Central symmetry maps a line/plane to a parallel one

Raw source, n15; refs `p0060#2`; no figures.

> 162. 证明：1) 中心对称将直线映射成它的平行线；2)将平面映射成它的平行平面.

162.1: for line `$L=a+\mathbb R u$`, `$Z_0(L)=2o-a+\mathbb R(-u)$`, with exactly the same direction subspace. Equality occurs exactly when `$o\in L$`: `$2o-a\in a+\mathbb R u$` iff `$o\in L$`. Otherwise the image is a distinct parallel line.

162.2: for plane `$P=a+U$`, `$Z_0(P)=2o-a+U$`, with the same direction subspace. Equality occurs exactly when `$o\in P$`; otherwise it is a distinct parallel plane.

Both are parallel EVEN in the equality cases under the bound earlier definitions. The source is not false merely because a center lies on the line or plane. Neither proof requires orthogonal coordinate axes aligned with the drawing or any generic position.

### 163 - Number and locus of symmetry centers, all seven cases

Raw source, n15; refs `p0060#3`; no figures.

> 163. 在关于$O$对称下，如果一个图形映射成它自身，那么点$O$叫做图形的对称中心.下列图形有多少个对称中心？1) 线段；2) 直线；3) 平面；4) 两个平行平面的并集；5) 两个相交平面的并集；6) 相交的直线和平面的并集；7) 平行的直线和平面的并集.

Semantic prerequisite: a symmetry center means image EQUALITY of the whole union/set, not just fixing one point or preserving individual distances. Every case below states both the requested count and the exact locus; "infinitely many" alone hides important geometry.

163.1, segment: **one**, its midpoint `$(A+B)/2$`. For a nonzero segment, central symmetry must exchange its two extreme endpoints, giving this midpoint, which also suffices. For a zero-length segment `{A}`, the only center is `$A$`, so the count remains one. An empty set is not a segment under this premise.

163.2, line: **infinitely many**, exactly ALL points on the line. Section 162.1 proves necessity and sufficiency. An off-line center gives a distinct parallel line, not the same figure.

163.3, plane: **infinitely many**, exactly ALL points in the plane. Section 162.2 proves necessity and sufficiency.

163.4, union of parallel planes:

- For DISTINCT planes `$n\cdot x=a$` and `$n\cdot x=b$`, `$a\ne b$`, **infinitely many**, exactly the midplane `$n\cdot o=(a+b)/2$`.
- Proof: central symmetry sends levels `$a,b$` to `$2n\cdot o-a,2n\cdot o-b$`. The pair must equal `{a,b}`. It cannot fix both separately for `$a\ne b$`; it must exchange them, giving precisely the midplane equation.
- If the two planes COINCIDE (allowed by "parallel"), their union is one plane: **infinitely many**, exactly that plane. The level formula gives the same result for `$a=b$`.

163.5, union of intersecting planes:

- For two DISTINCT planes intersecting in a line `$r$`, **infinitely many**, exactly the points of `$r$`.
- Proof: central symmetry preserves a plane's direction subspace. These two planes have different subspaces, so they cannot be exchanged. Each must map to itself, requiring `$o$` in both; every such `$o$` suffices.
- More explicitly, a plane contained in a union of two distinct planes must equal one of them: otherwise its two line intersections cannot cover that whole plane. This rules out a hidden third-plane image.
- If "intersecting" were used loosely to include coincident planes, the union instead has the single-plane locus from 163.3. The usual distinct-intersection premise gives the line, not an arbitrary plane.

163.6, union of an intersecting line and plane:

- If `$L$` meets `$P$` at the unique point `$X$` and is not contained, **one**, exactly `$X$`.
- Proof: `$P$` is the unique full plane contained in `$P\cup L$`, so an invariant union forces `$Z_0(P)=P$`. The line's off-plane points must then map to the same line; two such points force `$Z_0(L)=L$`. Hence `$o\in P\cap L=\{X\}$`, and that point suffices.
- If a loose set-intersection reading allows `$L\subset P$`, the union is merely `$P$`: **infinitely many**, exactly `$P$`. Under the source's inclusive-parallel definition, containment is a parallel case, not the proper one-point-intersection case.

163.7, union of a parallel line and plane:

- If `$L\cap P=\varnothing$`, **zero**. The same unique-plane argument forces `$o\in P$`; line invariance forces `$o\in L$`, impossible.
- If `$L\subset P$` (explicitly allowed by the earlier definition of parallel), the union is just `$P$`: **infinitely many**, exactly `$P$`.
- The components cannot be exchanged: an ambient central symmetry maps a plane to a plane and a line to a line. A "center halfway between the line and the plane" is NOT a center of this union.

All infinite loci have the cardinality of a continuum; no finite count was discarded. In particular a blanket answer "0" to 163.7 without its disjointness condition conflicts with the bound inclusive definition.

### 164 - Directions among four rays of a tetrahedron

Raw source, n16; refs `p0062#8`; no figures.

> 164°. 已知四面体$ABCD$. 在射线$AB$、$AC$、$AD$、$CD$中有没有1) 同方向的？2) 反方向的？

164.1: **No pair is same-directed.** 164.2: **No pair is opposite-directed.**

Proof: put `$u=B-A$`, `$v=C-A$`, `$w=D-A$`. A genuine tetrahedron makes these independent. The four ray directions are `$u,v,w,w-v$`. The first three have no proportional pair. `$u$` proportional to `$w-v$` contradicts independence; `$v$` proportional to `$w-v$` makes `$w$` proportional to `$v$`; `$w$` proportional to `$w-v$` makes `$v$` proportional to `$w$`. Thus all SIX distinct pairs are neither positive nor negative multiples.

Shared origins or a common endpoint along two rays do not make directions equal or opposite. No rectangular/right-angle assumption is used. If "tetrahedron" is weakened to a flattened or collinear four-point set, these conclusions can change; repeated defining vertices can create undefined zero rays. Such weakened objects are not the stated genuine-tetrahedron premise.

### 165 - Exact literal parallelepiped ray list

Raw source, n16; refs `p0062#9`; no figures.

> 165°. 已知平行六面体$ABCDA_1B_1C_1D_1$. 在射线$AB$、$AD$、$AA_1$、$BC$、$C_1D$、$BB_1$、$C_1C$、$A_1D_1$中说出：1) 同方向的；2) 反方向的.

Literal-binding warning: the fifth listed ray is **`$C_1D$`**, NOT `$C_1D_1$`. The seventh is `$C_1C$`, not `$CC_1$`. These endpoint/subscript differences change the requested pairs and must be retained. A parallelepiped need not have perpendicular edges or equal edge lengths.

Independent model: `$A=0$`, `$B=u$`, `$D=v$`, `$C=u+v$`, `$A_1=w$`, `$B_1=u+w$`, `$D_1=v+w$`, `$C_1=u+v+w$`, where `$u,v,w$` are independent.

| Literal source ray | Reviewer direction difference |
|---|---|
| `$AB$` | `$u$` |
| `$AD$` | `$v$` |
| `$AA_1$` | `$w$` |
| `$BC$` | `$v$` |
| `$C_1D$` | `$-u-w$` |
| `$BB_1$` | `$w$` |
| `$C_1C$` | `$-w$` |
| `$A_1D_1$` | `$v$` |

165.1, ALL distinct unordered same-direction pairs:

1. `$[AD)\uparrow\uparrow[BC)$`.
2. `$[AD)\uparrow\uparrow[A_1D_1)$`.
3. `$[BC)\uparrow\uparrow[A_1D_1)$`.
4. `$[AA_1)\uparrow\uparrow[BB_1)$`.

Equivalently the non-singleton groups are `{AD,BC,A_1D_1}` and `{AA_1,BB_1}`. `$AB$`, `$C_1D$`, and `$C_1C$` have no same-directed PARTNER in the list. Every ray is, separately, same-directed with itself by reflexivity; the requested list of distinct pairs does not erase that fact.

165.2, ALL distinct unordered opposite-direction pairs:

1. `$[AA_1)\uparrow\downarrow[C_1C)$`.
2. `$[BB_1)\uparrow\downarrow[C_1C)$`.

Completeness proof: independence excludes proportionality across `$u,v,w$`. The literal diagonal difference `$-u-w$` is proportional to none of `$u,v,w,-w$`: any such equation contradicts independence. Thus it creates NO additional same/opposite pair, in particular NOT an opposite pair with `$AB$`.

There are 28 unordered pairs among eight distinct listed rays; the direction table accounts for all: 4 same, 2 opposite, 22 neither. No unlisted edge was added. The unusual `$C_1D$` is mathematically legitimate and is NOT established as a source error. Changing it to `$C_1D_1$` would be an unauthorized different problem.

### 166 - Opposition is not transitive; a common opposite gives same direction

Raw source, n16; refs `p0062#10`; no figures.

> 166. 1°) 射线的方向相反这一性质具有传递性吗？2) 证明，两条射线如果都和第三条射线方向相反，那么它们方向相同.

166.1: **No.** For one coordinate line, take `$h_1=[0,\infty)$`, `$h_2=(-\infty,0]$`, and `$h_3=h_1$`. The first is opposite to the second and the second opposite to the third, but first and third are same-directed, not opposite. Repeated rays are allowed; no distinctness premise was stated.

If three distinct examples are preferred, use rays from origins `(0,0,0)`, `(0,1,0)`, `(0,2,0)` with directions `(1,0,0)`, `(-1,0,0)`, `(1,0,0)`. They give the same failure without requiring coincidence.

166.2: **Proof for all configurations.** If `$u_1=-a u_3$` and `$u_2=-b u_3$`, `$a,b>0$`, then `$u_1=(a/b)u_2$`. The multiplier is positive, so the first two rays are same-directed. This covers common/coincident carriers, distinct parallel carriers, coincident origins, and all intersection types. It does not depend on the false transitivity property in 166.1.

### 167 - Relation AND full relative-position alternatives

Raw source, n16; refs `p0062#11`; no figures.

> 167. 已知：$[AB)\uparrow\uparrow[MN)$，$[CD)\uparrow\downarrow[MN)$. 射线$AB$和$CD$的相关位置如何？

The request is not exhausted by saying "parallel." From nonzero direction differences, `$B-A=a(N-M)$` and `$D-C=-b(N-M)$`, `$a,b>0$`, so

`$[AB)\uparrow\downarrow[CD)$`.

Their supporting lines are either DISTINCT PARALLEL lines or the SAME line. They cannot be skew, nor distinct nonparallel lines meeting at an angle.

ALL relative-position possibilities:

- Distinct parallel supporting lines: the rays have empty intersection. This is one possible placement, not the only one.
- Same supporting line: orient its coordinate in the `$AB$` direction, let origin `$A$` have coordinate `$a_0$` and `$C$` coordinate `$c_0$`. Then `$[AB)=[a_0,\infty)$`, `$[CD)=(-\infty,c_0]$`.
- If `$a_0<c_0$`, the rays face into a common nonzero segment `[a_0,c_0]` (the segment `$AC$`).
- If `$a_0=c_0$`, they share only their origin, `$A=C$`.
- If `$a_0>c_0$`, they face apart and have empty intersection.

Each case is achievable while the given `$[MN)$` has the required positive reference direction; its origin may be anywhere on another parallel carrier or the same one. Consequently neither disjointness, a shared point, nor a nonzero overlap is uniquely determined by the premises. Identical rays cannot be opposite-directed; zero-length defining pairs are outside the ray domain.

## 8. Source Errors, Conditional Domains, and UNKNOWN Register

1. **Confirmed defect of the bound ORIGINAL text:** n15 body 11 at `p0059#5` labels `$\Phi\cong\Phi_1$` as reflexivity. This is not a reflexive formula. Its derived self-congruence conclusion is distinguished above; no source file was changed.
2. **Bound ORIGINAL terminology inconsistency/ambiguity:** n16 body 14 at `p0062#2` defines one direction by rays same-directed with `同一条直线`, although the relation is for oriented rays. The immediately following representative-ray statement and the proved equivalence relation determine the coherent mathematical reading, not permission to silently rewrite the source.
3. **Earlier definition gap:** n14 defines transformations as injective self-maps but presents reversed point pairs as an unrestricted inverse transformation. Only an inverse on the image follows for a general transformation. For n15 motions, a global inverse is proved independently from distance preservation, not assumed.
4. **NOT a confirmed error:** exercise 165's literal `$C_1D$`. It gives a diagonal direction `$-u-w$` and a coherent exercise with the listed pairs above. A familiar alternative edge list is not evidence against this exact binding.
5. **Conditional result, NOT automatic perpendicularity:** exercise 160's map is an involutive transformation for every transverse direction, but is a motion only for a normal direction. No perpendicular premise is present in the source or in fig-61.
6. **Inclusive definitions are binding:** coincident lines and planes, and a line contained in a plane, are parallel here. The equality cases in 161/162 and the contained/coincident cases in 163 cannot be omitted.
7. **Ray domains:** all defining endpoint differences must be nonzero. Opposition does not exclude coincident carriers, overlap, or a shared origin. Same-direction transitivity does not require all rays to be coplanar.
8. **Not determined by the source:** fig-61's three unlabeled point names; exact numeric slopes/lengths/angles in every PNG; any orthogonality of the pictured carriers; any origin names or plane letter in fig-65; a unique incidence configuration in 167. These remain unasserted.
9. **UNKNOWN provenance:** whether the two target textual defects are original printing errors or faithful-layer transcription errors. The prohibited page/OCR comparison was not performed. No errata action or source correction is authorized by this report.
10. No needed mathematical label remained unreadable at the single original-detail viewing. Handwritten glyph codepoints and incidental isolated specks do not establish extra mathematical objects; script-level identity of a visually identical subfigure marker is not provable from pixels alone.

## 9. Stage A Closure

Stage A independently covers the entire current bound ORIGINAL source: 28 body objects, six original figure inventories, nine exercises, all 22 leaf requests, and additional semantic obligations (definition of a center, all direction pairs, full relative-position alternatives). All conclusions are supported by original text/pixels and explicit independent proofs, with conditional/undefined cases separated.

At completion, all 24 bound raw source files (book identity, six target text/JSON files, six PNGs, and eleven earlier filtered-definition JSON files) were rehashed read-only. Every hash remained identical to the recorded binding. No source drift was observed; rehashing did not reopen any image or redo Stage A.

This is NOT an approval of any author output, a modern edition, an answer key, a rendering, a tool, or publication. No Stage B material has been opened and no comparison has been made. WAIT for the parent's explicit author disclosure before the one unique Stage B; do not peek early and do not redo Stage A.
