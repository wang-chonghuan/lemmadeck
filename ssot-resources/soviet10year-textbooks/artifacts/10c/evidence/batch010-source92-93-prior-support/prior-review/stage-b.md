# STEMROBIN-184: sole Stage B comparison

2026-11-16. NEW 10c physical 90-93 / printed 84-87.
Result: **no repair to the four current durable drafts is identified**.
Three Stage A readings are superseded below by genuinely new native crops.
Stage A, its ledger, the author handoff/manifest, and all durable files remain
unchanged. This is source comparison only, not finalize or a mechanical audit.

## Current draft hashes

Paths are relative to
`/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/`.

| Draft | Current SHA-256 |
| --- | --- |
| 0090/page.md | acc8962543b3ff75357af6a82dc875831c671c435157c3897aaedda23ae68679 |
| 0091/page.md | 2633060f85c966ea0d196ccc6f535a3d82c3dac59e9d5dcea4e31a6e10273b82 |
| 0092/page.md | 3382380b7b7f8114e3f537d7d6270ea6b3895fc8114f43c7f4935f74b42f6af3 |
| 0093/page.md | f58b369152b53dad6461f84e436afb4030a709d30f9184c4f476368bc508272c |

All four match the author hashes.sha256 entries. Read the entire current four
page.md files, source-handoff.md, and hashes.sha256 after Stage A disclosure.
Author source-handoff.md SHA-256:
`55ecf1f4d0db9fd580471629869689270a39e8cbed0afe9785c32ab207f525d4`.
Author hashes.sha256 SHA-256:
`7e84512a7bd8424bb4354d1ce52d6744a9dfe71c734e3596e05038977171eae9`.

## Crop-resolved Stage A differences

1. **304, page 92 line 51:** actual source is
   $\operatorname{ctg}x<-\frac{1}{\sqrt3}$, including the minus BEFORE the
   fraction. The author is correct; Stage A accidentally omitted that minus.
2. **306, page 92 line 57:** actual source is
   $\operatorname{ctg}(\pi-x)<-1$, strict `<`, not `<=`.
   The author is correct; Stage A's non-strict reading was wrong.
3. **Figure 44 left endpoint:** the native crop shows a small hollow center at
   $\pi/4$, as well as the hollow center at $\pi/2$. The author note on page 90
   line 26 is correct. Stage A's dark/uncertain left-glyph observation is
   superseded. Preserve BOTH hollow source marks despite formula (6)'s
   non-strict lower bound; do not redraw that mark from the inequality.

Figure 45's native crop independently confirms the small dark $\pi/4$ mark and
the hollow $\pi$ endpoint, consistent with Stage A and the author handoff.
No source297 crop was needed: its missing x was already independently observed
in Stage A and is preserved at page 91 line 66.

## Entire text and row comparison

Compared every body block, exercise, heading, caption, and folio with the
originals inspected in Stage A; original image history was not reopened.
Row schedules below are manual source observations, not pixel-line audit results.
They count caption/folio rows, count a paired exercise row once via samerow,
and count the single internal formula break on page 93 via its one `↵`.

| Page | Source-order row schedule represented by draft |
| --- | --- |
| 90 | incoming paragraph 2; Example 3 heading/formula 2; explanation/formula 5; caption 1; post-figure paragraph 2; periodic paragraph/formula 2; folio 1 |
| 91 | Example 4 heading/formula 2; explanation/formula 5; caption 1; periodic paragraph/formula 2; exercise heading/instruction 2; paired rows 294/295 and 296/297, 1 each; folio 1 |
| 92 | exercise rows 298, 299, 300/301, 302/303, 304/305, 306, 307, 308/309, 1 each; unit heading 1; introductions 2+2; Example 1 heading/formula 2; substitution/formula 2; outgoing fragment 1; folio 1 |
| 93 | incoming paragraph/formulas 3; second root case 3; Example 2 heading/formula 2; explanation 3; Example 3 heading/formula 2; explanation 2; Example 4 heading/formula 2; substitution/formula 2; final paragraph 2; folio 1 |

The corresponding represented row totals are 15, 15, 19, 22. No missing,
duplicated, moved, or incorrectly wrapped source body row was found.
In particular, the page-90 wraps after `标出了一`, `满足不等式`, and `用粗`;
page-91 after `在图中` and `满足不`; page-92 after `三角方` and `需要熟`;
page-93 after `然后`, `随后`, and final `+2` are retained.

Page 90: literal CLOSED $[7\pi/3,11\pi/3]$, both numerators/denominators, the
$2\pi k$ shift, and concluding sentence match. No mathematical repair inferred.
Example 3 retains tg, `>=1`, (5), y=1, the infinitely-many-intersections prose,
$\pi/4\leq x<\pi/2$, (6), and both repeated figure-44 references. The final
periodic formula uses **n** in both terms and the integer condition.

Page 91: Example 4 retains its star, ctg, `<=1`, (7), y=1, the function name,
$\pi/4\leq x<\pi$, (8), and **k** in both periodic terms/condition.
The two-line `习题` / `解不等式：` heading is present once.
The faithful 297 expression remains `cos >= 0.7900` with no supplied x.

All exercise expressions below match source after the crop resolutions:

| Exercise | Verified expression |
| --- | --- |
| 294 | $\sin x<\sqrt3/2$ |
| 295 | $\cos x\leq\sqrt2/2$ |
| 296 | $\sin x\geq0.5055$ |
| 297 | $\cos\geq0.7900$; missing x preserved |
| 298 | $\sin2x\leq\sqrt2/2$ |
| 299 | $\sin x\cos(\pi/3)+\sin(\pi/3)\cos x\leq1/2$ |
| 300 | $\sin(3\pi/2-x)>\sqrt3/2$ |
| 301 | $2\sin x\cos x\geq\sqrt2/2$ |
| 302 | $\operatorname{tg}x\geq\sqrt3$ |
| 303 | $\operatorname{tg}x<1/\sqrt3$ |
| 304* | $\operatorname{ctg}x<-1/\sqrt3$ |
| 305* | $\operatorname{ctg}x\leq\sqrt3$ |
| 306* | $\operatorname{ctg}(\pi-x)<-1$ |
| 307 | $\cos(\pi/6)\cos x+\sin(\pi/6)\sin x\geq\sqrt3/2$ |
| 308* | $\operatorname{ctg}(\pi/2-x)>1/\sqrt3$ |
| 309* | $(\operatorname{tg}x+\operatorname{tg}2x)/(1-\operatorname{tg}x\operatorname{tg}2x)\geq1$ |

The table uses compact explanatory notation; it proposes NO source rewrite.
The drafts preserve the actual fraction structure, tg/ctg notation, stars only
on 304/305/306/308/309, and every exercise's terminal punctuation outside math.
309's denominator is a product after `1-`, not a sum or squared tangent.
The samerow pairs exactly match the source pairs listed in the row schedule.

Page 92's actual `94. 解三角方程举例` is the sole h3; references to 85-88 are
小节 numbers, not source page numbers. Both introductory paragraphs match.
Example 1 retains $6\sin^2x-5\sin x+1=0$, (1), $\sin x=y$,
$6y^2-5y+1=0$, both printed roots, and the literal outgoing `因而 sin x`.

Page 93 retains the equals-first continuation, both printed root cases and their
separate k/m parameters. Its $x\approx(-1)^m\cdot0.34+\pi m$ retains `approx`,
the multiplication dot, 0.34, and the integer condition.
Example 2 is $6\cos^2x-5\sin x+5=0$ with **+5**; its substitution/explanatory
prose matches, without imported roots or an invented resulting quadratic.
Example 3 heading is only `例 3 方程`; equation
$\cos2x+\sin x=0$ has NO added terminal punctuation.
Its $1-2\sin^2x$ substitution and `请解出结果` parenthetical match.
Example 4 retains tg x + 2 ctg x = 3, reciprocal ctg identity,
$y+2\cdot1/y=3$, the explicit $y\ne0$ condition, and roots y=2 and y=1.
At line 68, exactly one `↵` after `+2` represents the actual source line break
before `=0`; the remaining sentence stays on that second printed row.

Terminal punctuation, equation-number punctuation, colons, and parentheses
were compared throughout; no semantic punctuation omission/addition was found.
Profile transcription of punctuation and spacing is not a facsimile-font claim.
The missing terminal punctuation on the first unsimplified root formulas, on
Example 3's equation, and on the page-92 outgoing fragment is correctly retained.
The separately numbered examples remain p blocks, not new numbered units.

## Figures, boxes, captions, and object boundaries

- Figure 44 header at page 90 line 47 is `[320,1170,890,575]`, equivalent to
  x=320..1210, y=1170..1745. From the original inspection this encompasses the
  graph, axes, labels, three increasing solid branches, four long dashed
  asymptotes, short pi/4 projection, reference line, and thick interval.
  Both hollow endpoint marks are now independently crop-confirmed.
- Figure 45 header at page 91 line 43 is `[435,905,880,570]`, equivalent to
  x=435..1315, y=905..1475. Its three decreasing solid branches, three long
  dashed asymptotes, short pi/4 projection, axes, reference line, labels,
  thick interval, dark left mark, and hollow right mark are represented.
- Neither box includes its source caption, which lies below its lower bound.
  `cap 图 44` / `图 44` and `cap 图 45` / `图 45` each occur once in distinct
  blocks (page 90 lines 49-50; page 91 lines 45-46). No numeric caption box is
  declared in page.md; this review checks coarse figure-box/caption separation,
  not a nonexistent explicit caption rectangle or deterministic pixel snapping.
- Source label inventories agree: x, y, 0, 1, y=tgx, pi/4, pi/2 for 44;
  x, y, 0, 1, y=ctgx, pi/4, pi for 45. No negative/outer asymptote coordinates
  or extra intersection labels are claimed as visibly printed labels.
- Both figures/captions belong to the relevant prose examples, not exercises.
  There are no figures/tables/captions on 92-93 and no extra figure objects.
- Page 90's first p cont closes the authorized incoming Example-2 paragraph;
  it does not reconstruct page 89. The exercise GROUP continues 91 -> 92
  without splitting any individual exercise or repeating its heading.
- Page 92 p open -> page 93 p cont correctly joins the literal `sin x` /
  `=1/2` split. No continuation symbol or equation is supplied to page 92.
- The last page-93 paragraph is a complete sentence, so its plain p is not
  itself a missing open marker. Example 4/unit 94 completion beyond that
  sentence remains outside the inspected pages; do not declare the unit complete.

## Exact repair / UNKNOWN list

**Durable draft repairs: NONE.** Do not change 304 or 306 to match Stage A.
Do not add x to 297, change the page-90 closed interval, fill figure 44's left
endpoint from the inequality, invent source labels, or append page-94 content.

**Frozen Stage A interpretation overrides:** 304 needs the negative RHS;
306 needs strict `<`; figure 44's left mark is hollow. These overrides are
recorded HERE ONLY; the frozen Stage A file/ledger were not rewritten.

**UNKNOWN:** the actual page-94 continuation and completion of Example 4/unit 94.
Page-89 predecessor pixels/text remain uninspected except the authorized incoming
TEXT context. This limits cross-boundary/full-unit certification, not the literal
source facts on 90-93. No unresolved in-scope token or endpoint difference remains.
Exact connected-component snapping and mechanical print-line auditing were not
run and are not claimed by this bounded coarse-source review.

## Stage B image ledger

All three crops were made directly from the original page.png into this owned
directory at native resolution, without resizing or opening any author crop.
Boxes below are `(left, top, right, bottom)` with the last two bounds exclusive.
Each crop was image-opened exactly once, alone, using original detail.

| Lifetime open | New crop beside this report | Source / native box | SHA-256 |
| --- | --- | --- | --- |
| 5 | stage-b-p0090-fig44-endpoints-native.png | 0090/page.png / (775,1365,905,1555) | 67fe5ade3c723608d64ca87cc7da2ed1b102451a3c795f43677830810d190fa7 |
| 6 | stage-b-p0091-fig45-endpoints-native.png | 0091/page.png / (820,1110,1030,1280) | d7712edfeca44ee470f81f8aa092a10125f016cec6dd15e3e87760a25e08a1aa |
| 7 | stage-b-p0092-ex304-306-native.png | 0092/page.png / (120,795,680,1010) | 6e7c37cef8b1098c80861e92aabfffbe75363eeca260709e186f670b230f6853 |

Total: 4 Stage A originals + 3 Stage B new crops = **7/8 allocation, 7/24 context**.
Zero full-page reopens, zero old/author crop opens, zero other image opens.
One crop slot was left unused because no further material uncertainty required it.
No image payload is returned to Parent.

Preserved Stage A SHA-256:
`c955991f98b0dcd56206eeb3c0d1ec34f62c79ad3eaf91bf323b284776caa85f`.
Preserved Stage A ledger SHA-256:
`2d01ddd961e65e613edd288924203a5e2e6da3072788988d4159b539ed4e1757`.
