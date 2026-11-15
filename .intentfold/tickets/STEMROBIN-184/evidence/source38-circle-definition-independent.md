# STEMROBIN-184: Independent Source 38 Definition Verification

Date: 2026-11-15.
Root: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
Target: original exercise 38, identified by the request as `geo68-c1-s4`.

## Scope And Evidence

Reopened the actual full-resolution source PNG for PDF page 0013 first, then
the PNGs for 0012 and 0022. Compared the definitions and exercise 38 with their
faithful `page.md` text. No grid or reconstructed figure was substituted.
No choice drafts, authored answer files, source solutions, or other reviewers
were consulted. No pipeline, tests, DB, environment, network, model or install
operations were performed. Only this report was written; other changes were preserved.

## Observed Printed Wording

PDF page 0012, printed page 2, defines the boundary separately. The two printed
definition rows read:

```text
定义 在同一平面上，和已知点的距离为已知正数的点
的集合，叫做圆周．
```

Faithful counterpart: `artifacts/6-8g/pages/0012/page.md:87-88`, below the
`ssot-resources/soviet10year-textbooks/` resource root.

The last body row of page 0012 reads:

```text
例如，我们来给出圆的定义．不难看出，半径为 r 的圆的
```

Its continuation is the first body row on PDF page 0013, printed page 3:

```text
点在同一平面上，而且和圆心的距离小于或等于 r（图4）．
```

Thus the joined sentence explicitly specifies both a common plane and distance
less than or equal to the radius. The continuation matches p0012 line 106 and
p0013 line 67 of the faithful text.

The next two printed rows on page 0013 read:

```text
定义 在同一平面上，和已知点的距离不大于已知正数
r 的点的集合，叫做圆．
```

The next row gives the notation:

```text
圆心为 O、半径为 r 的圆记作：圆(O,r)．
```

These match faithful p0013 lines 70-71 and 74. Figure 4 also shades the interior
and depicts interior as well as boundary points; the explicit definition, not
the illustration alone, determines the meaning.

At the bottom of PDF page 0022, printed page 12, exercise 38 has an asterisk and
two printed rows:

```text
38.* 证明：对于 n 个任意的点 A_1、A_2，...，A_n，存在包含所有
这些点的圆．
```

The scan uses an ellipsis between the indexed points; ASCII/LaTeX here represents
the printed mathematical symbols, not a replacement statement. The faithful
counterpart is p0022 lines 95-96. The noun is `圆`, not `圆周`; the wording is
`包含`, not a requirement that the points be on the boundary.

## Conclusion And Independent Proof

**The book explicitly defines `圆` as a closed disk in a plane, with positive
radius.** The disk interpretation is not an invented convention. The separate
`圆周` definition requires equality of distance and describes only the boundary.

For any finite nonempty set of points lying in one plane, exercise 38 is true
under exactly this definition:

1. Choose the center `O=A_1` in that plane.
2. The finite list of distances `|OA_1|,...,|OA_n|` has a maximum `M >= 0`.
3. Choose any positive distance `epsilon` and set `r=M+epsilon > 0`.
4. Every `A_i` is in the chosen plane and satisfies `|OA_i| <= M < r`.
   Consequently every `A_i` belongs to the book's `圆(O,r)`.

This proof is independently derived from the observed definition, not taken
from a solution. It covers coincident and collinear points as well as other
coplanar configurations. No circumcircle or equal-distance construction is needed.

There is a separate quantifier limitation: exercise 38 itself does not print
`在同一平面上`. The verified definition settles the disk/boundary issue, but it
does not make arbitrary noncoplanar spatial points fit inside a planar disk.
The source p0013 also explicitly says, at faithful lines 103-104:
`几何里全体点的集合叫做空间．每一个几何图形是空间的子集．`
These bounded source pages therefore do not establish a blanket convention that
all uses of `任意的点` exclude spatial configurations.

For an unrestricted spatial reading, a counterexample under the actual definition
is the four points `(0,0,0)`, `(1,0,0)`, `(0,1,0)`, `(0,0,1)`.
The first three are noncollinear and determine the plane `z=0`; the fourth is
outside that plane. No plane contains all four, so no `圆` as defined by this
book contains them, regardless of radius.

Accordingly: **yes, the explicit definition settles source 38 for arbitrary
finite coplanar points without inventing a disk convention; no, it alone does
not justify an unqualified assertion about arbitrary points in space.**
Coplanarity is necessary and, by the proof above, sufficient for a finite set
to be contained in such a disk. No options or answer artifacts were reviewed.

## Actual File SHA-256

Hashes were computed from the local PNG and transcription bytes with `shasum
-a 256`, not copied from frontmatter. They identify the observed snapshots.

```text
.tmp/ld-s10y-lesson/6-8g/pages/0012/page.png
8b52b9b3e0586595918f787864c996bbc94155526a986b2a7533dbca5b45182c
.tmp/ld-s10y-lesson/6-8g/pages/0013/page.png
addbe7a177fdca16ee55dea7e01886adfcfb071e6b2c6f53a2f001aed779cced
.tmp/ld-s10y-lesson/6-8g/pages/0022/page.png
346e0e35da01cabf793e94f472fb826bce6389cbe1e0d9224002e89e0bdfede4
ssot-resources/soviet10year-textbooks/artifacts/6-8g/pages/0012/page.md
6d91433dd069d7ee35166e534583ecd9cd8bac9baaefd62c9a50187e5b875630
ssot-resources/soviet10year-textbooks/artifacts/6-8g/pages/0013/page.md
a4901f08bdce73c07f141097581775388ceed1e23025ac0fd6428b96bb883a90
ssot-resources/soviet10year-textbooks/artifacts/6-8g/pages/0022/page.md
f94b3ec85c883c7d5ddd0d27cda22bd80c0a702cc2eb4ac100e5639446212cbe
```

Source report complete. No further action taken.
