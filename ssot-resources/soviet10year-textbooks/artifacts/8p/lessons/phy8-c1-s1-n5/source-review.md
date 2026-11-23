# First independent SOURCE review: phy8-c1-s1-n5

## First verdict (preserved)

**SOURCE HOLD.** The original candidate has two confirmed punctuation changes requiring REVISE, six missing durable local figure dependencies, and an external figure 7 whose source fidelity is not approved by this review. This is not SOURCE PASS, canonical assembly acceptance, or publication authorization.

- Ticket: STEMROBIN-180 / 180-7; reviewer is the sole first independent SOURCE reviewer.
- Review date: 2026-11-23.
- Every shell command used explicit workdir `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180`.
- Independent inventory was saved before reading any page candidate, historical review, mechanical audit or counter result.
- Frozen inventory: `source-first.md`, SHA-256 `cedd37de90883e74478266da3dc4ffea23fc8b0158287e4e62e284f96d4f52d9`.
- Actual visual image count: **5**, full original pages 0028 through 0032, one at a time, one batch; no image reopen, crop preview, figure preview or screenshot payload.
- Only reviewer-authored writes: this file and `source-first.md`. No source-candidate, figure, code, assembly, DB or Git writes; no installation, bootstrap, publisher, child agent or paid image call.
- Original verdict is bound to the exact candidate hashes below, not to a later corrected page or an assembly output.
- Parent subsequently authorized a markup-only p28 heading normalization and preservation of the old Markdown at `pages/0028/page-title-before-normalization.snapshot.md`. Snapshot verification and affected-only assessment belong in a separate addendum below; they do not rewrite this first verdict.

## Exact original candidate hashes

All paths in this table are below `ssot-resources/soviet10year-textbooks/artifacts/8p/pages/`. Both Markdown and JSON existed and were read.

| Physical | Original candidate | SHA-256 |
| --- | --- | --- |
| 0028 | 0028/page.md | bc4cb698e02e0d99d7dded8de3ec4d4fbeb12d40f805bd4bde86ac1ddb010760 |
| 0028 | 0028/page.json | f000c234d37de3bb99038b478d9346889580c0a60abc24c147c04a6bd6309526 |
| 0029 | 0029/page.md | 85c2c0ba061e83777a5087184c74b50d9a2e08e12eae8339b0c3ea18e2ab9635 |
| 0029 | 0029/page.json | b02fa16843f9db334077c2457ac2e233957e784cba7176b5d3a792ff104fbbb2 |
| 0030 | 0030/page.md | 6163ef312151803898e3f902d8aad3d7f1ed03bd8e73599ee474836cd1dce777 |
| 0030 | 0030/page.json | 2fddd8fb9699e1e2818f0f7aa932a4f658a1201aaf877df1a1d4c8078e54f6f1 |
| 0031 | 0031/page.md | 4ba2285adaf9419e0c44223d306a4ac7883ff3f95cd9ee3a89c24aa777d170f1 |
| 0031 | 0031/page.json | 6bd18a159e57792efe2786ce53cc8f569d14d8ace4086ba199a6bf355737824e |
| 0032 | 0032/page.md | c1a0c6c308aeb830a806f5c6b60176ce3da4b39087d7aa3c720b5b8661d93f93 |
| 0032 | 0032/page.json | 9d36297a9d4844b29f47953e735c0a58d11333de62e5c5cf3914f8864a25d9b3 |

All five original JSON `meta` objects matched their Markdown frontmatter, and all JSON text rows appeared in the Markdown in the same order. All five `render.sha256` values matched the inspected full-page image bytes. These are binding/integrity observations, not SOURCE approval.

## Concrete findings

| ID / disposition | Source and original candidate locator | Finding and required handling |
| --- | --- | --- |
| R1 / REVISE | 0028/page.md:75; p0028#6 row 2, also page.json | Source reads `示，用一定比例...`; candidate reads `示.用一定比例...`. The comma after `示` became a period. Restore the printed comma in the authorized candidate repair; preserve this original verdict. |
| R2 / REVISE | 0030/page.md:87; p0030#9 row 3, also page.json | Source reads `按代数方法相加，也就是考虑到...`; candidate reads `按代数方法相加. 也就是考虑到...`. Restore the source comma rather than introducing a sentence boundary. This is not a line-counter issue. |
| H1 / HOLD | 0029/page.md:77,83,102,108; 0030/page.md:63,69 | The six relative `figures/fig-15.png` through `figures/fig-20.png` targets do not exist in the durable page directories. The corresponding book-level PNGs also do not exist. Crop PNGs exist only in `.tmp/ld-s10y-lesson/8p/pages/0029/figures/` and `0030/figures/`. An inventoried box, cache SVG or mechanical assembly does not make these durable dependencies complete. Retain the exact approved source crops via the owning workflow; this reviewer does not copy or repair them. |
| H2 / HOLD | 0028/page.md:74; p0028#6 row 1 | `图 7а 和 б` is a genuine external reference. A durable `artifacts/8p/figures/fig-07.png` exists, but its original source pixels and source-fidelity binding were not inspected in this five-image review. File existence is not approval. Do not delete the reference, invent geometry, or count this review as figure 7 approval. Its actual source inventory/review dependency must be provided separately. |
| H3 / canonical representation HOLD | Original 0028/page.md:66; p0028#4 | Printed source is bold `5. 矢量及其投影的运算`; original candidate is `**$5.$ 矢量及其投影的运算**`. Printed number/title and bold are faithful, but the parent reports its math-wrapped heading caused noncanonical `x2` in the limited TOC assembly. This review did not inspect or approve that assembly. A markup-only change to bold `5. ...` can resolve the representation defect; it cannot resolve R1/R2/H1/H2 or establish canonical assembly by itself. |
| S1 / source inconsistency, not a transcription replacement | 0032/page.md:58-59; p0032#3; `errata: []` | Source and candidate both read `矢量投影的运算也是根据几何学的一般法则`. This conflicts with the explicitly algebraic projection-sum/difference rules. Keep the faithful source prose; a modern correction requires an explicit source-bound erratum with rationale, not an unregistered replacement of `几何学` by `代数学`. The frozen inventory preserves this issue. |
| S2 / source-arrow uncertainty | Physical 0031, F22а; candidate fig-22 box `[553,984,692,461]` | The outlined lower resultant appears down-left in the full-page scan despite the longer up-right a and shorter up-right b. This possible original arrow anomaly is recorded independently, not confirmed as a candidate crop or geometry error. Do not silently reverse it in faithful extraction or call a corrected redraw source-identical. |

## Substantive comparison results

These scoped PASS observations retain their scope; none overrides the first overall HOLD.

| Physical / scope | Disposition | Source-first comparison |
| --- | --- | --- |
| 0028 n5 prose/boundary | REVISE | All 17 n5 prose rows and the n5 heading are present. n4 exercise blocks p0028#1-#3 precede the heading and are excluded from n5; no adjacent exercise solving or approval is made. R1 affects punctuation. Last block p0028#10 is `open`, correctly ending `作一`. |
| 0028 equality emphasis | PASS, retained source record only | p0028#7's two dot-under rows are explicitly recorded in `meta.source_emphasis`, with Chinese-character scope and punctuation excluded. The review does not require turning the source dots into bold. Rendering/assembly propagation of this record was not inspected. |
| 0029 prose/captions | PASS for transcription; HOLD for H1 | All 10 original prose rows survive: p0029#5 has 1 continuation row, #6 has 8 rows, #11 has 1 final open row. Four captions are retained; captions 16 and 18 have `samerow`, making two physical caption rows. Including the footer gives 13 printed text rows. No omission was excused by a failed counter, and no deletion is required by the repaired counter. |
| 0030 prose/formulas/emphasis | REVISE | All 18 body/formula rows remain; plus/minus direction convention, $\vec f=\vec a+\vec b+\vec c$, and $\vec c=\vec a-\vec b=\vec a+(-\vec b)$ match. Dot-under sum theorem is preserved on the two actual rows, with final punctuation outside the span. R2 is a real punctuation drift; H1 affects figures 19/20. |
| 0031 n5 prose/math/emphasis | PASS for prose/math recording | All 12 body/formula rows remain. Negative b has equal magnitude/opposite direction; magnitude formula retains both absolute-value factors and the centered dot; signed k direction clauses are intact. Two projection-difference emphasis spans match the actual rows, punctuation outside. Bold subsection 3 is prose, not an h3/exercise. Final p0031#11 is correctly `open`. S2 remains a source-figure uncertainty. |
| 0032 n5 prose/math/boundary | PASS for faithful transcription, with S1 recorded | First `cont` closes p31; $b_x=ka_x$ and $|\vec a|=\sqrt{a_x^2+a_y^2}$ retain signed k, both squares, the full radical, and formula punctuation. All 7 n5 body/formula rows remain. n5 ends after p0032#7 / caption 23. p0032#8 is n6's heading; all subsequent content is excluded from this review. |

The `а`/`б` figure-reference letters are retained as Cyrillic. The first sign on p30 and the small separator in the F22 reference have scan-level uncertainty: the inventory's `、` versus the candidate's `，` is **not** a confirmed additional punctuation revision. R1 and R2 are the confirmed changes. Do not modify the frozen inventory to follow the candidate.

## Figure rows, labels and crop scope

| Figure | Original candidate box | Requirements checked against the independent full-page inventory |
| --- | --- | --- |
| 15 | `[268,357,615,435]` | Separate a/b plus common-tail parallelogram; dashed opposite sides; outlined a+b arrow and rotated label. |
| 16 | `[977,290,534,509]` | Separate a/b and **both** addition-order constructions, both sum labels; not a one-triangle replacement. |
| 17 | `[335,1627,362,457]` | Six letters O,A,B,C,D,E; directed chain O->A->B->C->D->E and resultant O->E. O is not numeric 0. |
| 18 | `[969,1700,483,336]` | Three arrow-layout rows, a right, b right, head-to-tail a/b with rightward a+b. |
| 19 | `[221,620,467,349]` | Three arrow-layout rows, a right, longer b left, resulting a+b left. |
| 20 | `[842,600,473,372]` | Foot-label order A,B,D,C, rightward X, a/b/c/f arrows, all four projection labels, lower brackets and dashed drops. c_x is negative; no invented scale or Y axis. |
| 21 | `[566,269,643,358]` | Standalone a/b, triangle a and -b, full outlined c=a-b label; no lost minus. |
| 22 | `[553,984,692,461]` | Both subfigures а/б inside one grouping, all a/b/-b/c=a-b labels; preserve the source-arrow uncertainty S2. |
| 23 | `[480,820,696,499]` | Offset vector tail, X/Y/O, two a_x and two a_y labels, both brackets and dashed guides. Do not relocate vector tail to O or drop repeated projection labels. |

Candidate box declarations cover the inventoried figure group locations and keep captions separate. No specific clipped point/label can be established from the inspected full pages and those declarations alone. No cropped candidate PNG was visually reopened, so this is not a separate pixel-fidelity or modern-figure approval. The concrete crop dependency failure is H1, not a fabricated clipping claim. Existing durable page PNGs for figures 21-23 are retained and untouched.

## Existing figure-byte hashes (not source approval)

| Evidence location | SHA-256 |
| --- | --- |
| artifacts/8p/figures/fig-07.png (durable, external/uninspected) | 6078b261d71eeca1492f623a2eae47011ecf662efc7b223543cf7c078b8765a4 |
| .tmp/.../pages/0029/figures/fig-15.png (cache only) | 0f6c36251427b0f83722ccd7f638e159fd8ae76ef66b6c1d5fb328238c4a9b43 |
| .tmp/.../pages/0029/figures/fig-16.png (cache only) | 244cc3d546a70fa6d65b9e440e33162346f32ee37e9cdc0076d310aa7516d888 |
| .tmp/.../pages/0029/figures/fig-17.png (cache only) | 74ea7dcd9365da08431b4e1a406ab401f396b3d4a01ee791e6f12163a5a55c9d |
| .tmp/.../pages/0029/figures/fig-18.png (cache only) | d93d3fef8cbcb120b0b5d9be02e11a92d686ff17f283ca65e165861c841af110 |
| .tmp/.../pages/0030/figures/fig-19.png (cache only) | 98370364987503ee52744d3b007389d61ab182cfd038914c14f985c4d4171bd2 |
| .tmp/.../pages/0030/figures/fig-20.png (cache only) | f42099a98394107bb8d663471cc9cf97a7c9b444716173416f9685989eabc8fe |
| artifacts/8p/pages/0031/figures/fig-21.png (durable) | a4605a9d47afdab96eee5c6a2330da42f9ea7f6b818b0bd7105e5e95ac3b7842 |
| artifacts/8p/pages/0031/figures/fig-22.png (durable) | 1761ff0407f2b5b08d8395bdbe7198d145a4f9d2433495de0a40d861bcf83b33 |
| artifacts/8p/pages/0032/figures/fig-23.png (durable) | 2865e54b151a8865f048a7dec699cd4338810a092092e371c558fdf3dfbab69d |

Here `artifacts/` abbreviates `ssot-resources/soviet10year-textbooks/artifacts/`; `.tmp/.../` abbreviates `.tmp/ld-s10y-lesson/8p/`. Cache references record inspected byte identities only and do not establish durable publication dependencies.

## Mechanical update and acceptance limits

After the independent inventory was frozen, the user reported p29's counter recovered **13/13** without candidate prose/hash change. This agrees with the independent 10 prose + 2 caption rows + 1 footer accounting, but no counter-worker conclusions or historical reviews were read or used to construct the inventory.

The user also reported limited physical28-32 assembly with TOC emitted noncanonical n5 `x2`, caused by the original math-wrapped heading. No assembly file was reviewed; neither its reported successful run nor the repaired counter supplies canonical identity or SOURCE acceptance. Subsequent candidate work may proceed under the parent's authority, but this first source verdict and unresolved findings remain preserved.

## Affected-only heading addendum

This addendum was made after saving the first verdict above. SHA-256 of this review before the addendum was `1f5d5d80eae661444690deca328946866ccc8a1b1e2a96643e6d2f340e070db5`. The first verdict and original hash table are unchanged.

**Heading representation: PASS, affected scope only. Overall SOURCE HOLD remains.**

| p28 retained/current artifact | SHA-256 |
| --- | --- |
| pages/0028/page-title-before-normalization.snapshot.md | bc4cb698e02e0d99d7dded8de3ec4d4fbeb12d40f805bd4bde86ac1ddb010760 |
| pages/0028/audit-title-before-normalization.snapshot.json | 37cad0ded59b948140680feff7c423000e8dbdf9f550532c15f717b9d9784fa6 |
| pages/0028/page.md after heading normalization | 86cac677697e77c48e50e19d185b992f67f719ec43fe6f78a45ba9328b738949 |
| pages/0028/page.json after heading normalization | 183dca31d30a516dec252849cb04c01040ecfdb5a95d07babfc5041fbf3099c5 |

The Markdown snapshot is byte-identical to the original page.md that this reviewer read. It is the durable binding for the original p28 verdict, including R1 and the original heading representation. The audit snapshot was hashed only, not interpreted as source approval.

The current Markdown differs from that snapshot in exactly two places:

1. `**$5.$ 矢量及其投影的运算**` becomes `**5. 矢量及其投影的运算**`. Printed number, title, bold emphasis and h3 block position are unchanged, and the math wrapper is removed.
2. `meta.profile.sha256` changes from `dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849` to `ae373713f7b09f810d6de1e4a12b5916710e5673e4827148c875674f847f1e81`. This is a profile-binding refresh, not a prose/formula repair; no profile semantics were independently audited here.

The JSON has precisely the corresponding heading and profile-hash changes: restoring those two values in memory and serializing with its existing format reproduces the original JSON hash `f000c234d37de3bb99038b478d9346889580c0a60abc24c147c04a6bd6309526`. Current Markdown frontmatter still matches current JSON metadata. No reviewer file writes or image reopens were used for this comparison.

R1 remains `示.用...` in the normalized p28 JSON. All eight page.md/page.json files for physical29-32 still match the original hash table at the addendum check. Therefore this assessment resolves H3's **heading representation only**, not R1/R2, the durable crop gap H1, the unreviewed figure-7 dependency H2, source issues S1/S2, or canonical TOC assembly acceptance. A successful subsequent canonical assembly must be evidenced by its owner separately.

Final visual image count remains **5**. The frozen `source-first.md` hash remains `cedd37de90883e74478266da3dc4ffea23fc8b0158287e4e62e284f96d4f52d9`.
