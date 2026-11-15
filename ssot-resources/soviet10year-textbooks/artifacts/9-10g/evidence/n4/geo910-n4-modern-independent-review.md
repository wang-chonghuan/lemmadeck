# geo910 n4 Modern Text/Written Independent Review

Ticket: STEMROBIN-184. Date: 2026-11-15.

## Stage 1: Source-Only Freeze

This section was written before opening any n4 modern author template. Inputs are only the current assembled original-layer `lesson.json` and `exercises.json`; no answer, choice, parent `n4source-first.md`, author notes, or old scan was read.

Root: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

| Source input, relative to root | Actual SHA256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/9-10g/lessons/geo910-c1-s1-n4/lesson.json` | `f3e98449b74ca8f9c090b3e10d7ea81d24f7052de25fa0d13a72c27c29f39ecd` |
| `ssot-resources/soviet10year-textbooks/artifacts/9-10g/lessons/geo910-c1-s1-n4/exercises.json` | `7ec37feaf4effe3e571e98fa52b31e36ae24e5fd9d17fd4982c815529b8122f7` |

Identity: `geo910-c1-s1-n4`, number 4, title “在空间里作直线平行于已知直线”, beginning physical 19 / printed 12. The original lesson has 12 prose objects: 10 textual paragraphs, fig-11, and its caption. Three complete written tasks are numbered 27–29, all in group `习题`, `group_id: g1`; none references or displays an exercise figure.

### Frozen Body Coverage and Meaning

- `p0019#4`: planar geometric constructions use compass, ruler, and set square.
- `p0019#5`: “作平面（直线）” in stereometry means proving existence of a plane/line satisfying the stated conditions, not carrying out a physical spatial drawing. The example is a plane through a line and a point outside it, referring to previous §3 corollary 1.
- `p0019#6`: sketches accompanying proofs and exercise solutions are not drawn to strict rules; they need to evoke the intended concept. The alternative drawing method is explicitly deferred to §5.
- `p0019#7`: exact task “问题.通过已知点 $M$ 作直线平行于已知直线 $a$.”
- `p0019#8`: “解.有两种可能情形.” The two cases are exhaustive.
- `p0019#9` + `p0020#1`: source case `а）`, $M\notin a$, fig11 case а. Parallel lines must be coplanar. Step 1 constructs plane $\alpha$ through $M$ and $a$ by §3 corollary 1; step 2 constructs $b$ through $M$, parallel to $a$, within $\alpha$, by axiom 9. Line $b$ is the required line.
- `p0020#2`: the problem has a unique solution; a proof is promised, not merely an existence statement.
- `p0020#3`: any sought parallel $b$ must lie in the unique plane $\alpha$ through $a$ and external point $M$; within $\alpha$, planar geometry gives exactly one parallel through $M$. Both uniqueness steps are necessary.
- `p0020#4`: source case `б）`, $M\in a$, fig11 case б. Exact wording: “在这种情况下，通过 $M$ 且平行于 $a$ 的唯一的直线就是已知直线 $a$.” Thus this source explicitly includes coincident lines as parallel. A modern statement restricted to distinct/nonintersecting lines would contradict this case.
- `p0020#5` / `p0020#6`: fig-11 and caption “图 11”; retain placement/ownership and both case references. This text review does not independently review image pixels or a modern figure.
- `p0020#7`: exact conclusion “我们证明了，在空间里通过已知点有且仅有一条直线平行于已知直线.” Quantification is any given point, including a point on the given line.

The logical transition to the worked construction should remain after the discussion of spatial construction and sketches. The two case branches belong to the same construction/uniqueness argument, not to different definitions of parallelism. Future section anchors must identify actual adjacent official proseFlow paragraphs, not block indices.

### Frozen Written Tasks and Independent Condition Analysis

**27**, `p0020#9`, exact original text:

> 27.已知直线 $a$ 和点 $M$.过已知点作直线和已知直线相交成直角.如果1）$M\notin a$；2）$M\in a$.问题有多少解？

Preserve the construction request, actual intersection at a right angle, both point-incidence cases, and the number-of-solutions question. Independent baseline: for $M\notin a$, the intersecting candidate and $a$ determine the same unique plane through $a,M$, where the perpendicular through $M$ is unique. For $M\in a$, infinitely many spatial perpendicular lines pass through $M$, arising in planes through $a$. The problem is spatial, not silently restricted to a preselected plane.

**28**, `p0020#10`, exact original text:

> 28.已知 $a\cap\alpha=M$，$N\notin\alpha$.作平面 $\alpha$ 与过 $a$ 和 $N$ 的平面的交线.

Preserve the literal intersection notation, the sole restriction $N\notin\alpha$, and the requested intersection line. This restriction does **not** imply $N\notin a$. Independent baseline: if $N\notin a$, the plane through $a,N$ is unique, is distinct from $\alpha$, and intersects $\alpha$ in a line through $M$. If $N\in a$ (necessarily $N\ne M$), many planes contain both $a$ and $N$, and the intersection line is not uniquely determined. In fact, any line in $\alpha$ through $M$, together with $a$, determines such a plane. The original task can mean constructing an admissible intersection, but does not justify an unconditional unique plane/intersection. No new external-point condition or silent mathematical correction is authorized.

**29**, `p0020#11` + `p0021#1`, exact original text:

> 29.在平面 $\alpha$ 内已知直线 $a$ 和点 $M$.通过点 $N\notin\alpha$ 作平面 $\beta$，使得 $\alpha$ 和 $\beta$ 的交线通过 $M$，并且垂直于 $a$.

Preserve that both $a$ and $M$ lie in $\alpha$, that $N$ lies outside $\alpha$, and that the desired plane contains $N$ and intersects $\alpha$ in a line through $M$ perpendicular to $a$. There is no restriction on whether $M$ belongs to $a$. Independent baseline: the perpendicular line through $M$ within $\alpha$ is unique in either case. That line and external point $N$ determine a unique plane $\beta$; since $N\notin\alpha$, the planes are distinct and their intersection is precisely that line. Do not replace the intersection-line condition by an imprecise assertion that the whole plane is perpendicular to $a$.

These are independent condition/method baselines for fidelity review, not authored standard-answer files.

## Stage 2: Modern Comparison

**PASS for current modern text and all three written tasks.** No modern semantic or source-binding correction is required. This result does not approve fig-11, finalize/promote the lesson, or resolve the source's exercise 28 uniqueness ambiguity by imposing a new condition.

The parent explicitly disclosed the current author templates after Stage 1 source observations. The Stage 1 section was saved before these templates were opened. Only the current templates were compared; first-check snapshots, author notes, answers, choices, and other reviewers' reports were not read.

### Current Template Hashes

All paths are relative to the root above.

| Current input | Actual SHA256 |
| --- | --- |
| `.tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons/geo910-c1-s1-n4/lesson.template.json` | `78725b68d739504657c1e4ee3382f0dac2e1214fdf7af1d2b4bf53bcfe8ccec2` |
| `.tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons/geo910-c1-s1-n4/exercises.template.json` | `e92b23248c77e2bdea6942b653c77f9703d6ee41285101978911e024c73a1a85` |
| `.tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons/geo910-c1-s1-n4/figures.template.json` | `4d27931c1265a40e74dedc433268532417489314ca4d76caae83e5f85e8ab703` |

The actual current lesson/exercise hashes match the parent's disclosed values. Both original-layer hashes remain those frozen in Stage 1.

### Complete Body Comparison

| Source binding | Current modern finding |
| --- | --- |
| `p0019#4` | PASS. All three planar construction tools and the planar-construction statement retained. |
| `p0019#5` | PASS. Spatial construction still means proving existence under given conditions. The plane-through-line-and-external-point example and preceding corollary 1 reference remain. “直接” clarifies the physical-tool contrast without changing the existence definition. |
| `p0019#6` | PASS. Sketches remain non-strict illustrations for understanding; the alternative method remains a §5 reference, not a new prescribed construction. |
| `p0019#7` | PASS. Same unrestricted given point $M$, given line $a$, and parallel-line construction. |
| `p0019#8` | PASS. Two exhaustive cases remain. |
| `p0019#9` + `p0020#1` | PASS. $M\notin a$, necessary coplanarity, plane $\alpha$ through $M,a$, §3 corollary 1, planar parallel $b$, axiom 9, and identification of $b$ all retained in order. Numeric construction steps 1 and 2 remain distinct. |
| `p0020#2` | PASS. Unique solution and an ensuing uniqueness proof both retained. |
| `p0020#3` | PASS. The unique containing plane and the unique planar parallel are both explicit; no step in spatial uniqueness is omitted. |
| `p0020#4` | PASS. $M\in a$ and the given line $a$ as the unique parallel through $M$ are retained. The added sentence “两条直线重合也属于平行的情形” states what the original case directly asserts; it is a supported clarification, not an invented convention or formula correction. |
| `p0020#5` / `p0020#6` | PASS for text ownership only. The single fig-11 object/caption retains its position after the two cases. Both modern case references remain fig11 a/b. Image geometry and output quality are not reviewed here. |
| `p0020#7` | PASS. The conclusion still says “有且仅有一条” through the given point in space, without excluding incidence with the given line. |

Latin `a)`/`b)` and fig11 a/b translate only the original Cyrillic case markers `а）`/`б）`. They do not rename mathematical line $a$ or $b$ or create a new branch. All variable/figure/corollary/axiom meanings remain intact.

### All Three Written Tasks

- **27 PASS:** “在空间中” makes the existing stereometry setting explicit; it does not add a plane restriction. The requested perpendicular must actually intersect the given line. Both incidence cases and the question asking how many solutions are retained. Natural numeric `1)`/`2)` markers are valid and each occupies its own line. No construction method or number of solutions is inserted into the exercise.
- **28 PASS with retained source caveat:** current text still has exactly $a\cap\alpha=M$ and $N\notin\alpha$, then requests the intersection of $\alpha$ with a plane through $a,N$. It does not assert $N\notin a$, a unique containing plane, or a unique intersection line. Therefore the admissible $N\in a$ case and its underdetermination remain exactly as frozen above. This is a source condition issue to respect in future answers/choices, not grounds for silently changing the modern task.
- **29 PASS:** $a$ and $M$ remain in $\alpha$; $N\notin\alpha$ remains explicit; the constructed $\beta$ must pass through $N$. It is the intersection line of $\alpha,\beta$ that must pass through $M$ and be perpendicular to $a$. Neither $M\in a$ nor $M\notin a$ is imposed. No proof or construction obligation is converted into a mere numerical question.

### Structured and Mathematical Checks

Read-only checks used the existing lesson runtime with Python `-B` and existing `edition` helpers; they wrote no tool outputs or templates.

- All original lesson top-level fields remain equal in the modern document, except the adapted prose and added edition/staging metadata. The 12 prose objects retain their order, kinds, IDs, labels, printed pages, and exact `source_refs`.
- Every prose and exercise `source_text` exactly equals its corresponding current original text. Both `source.data` snapshots exactly equal the original JSON documents, and both `source.sha256` and `source.path` match those originals.
- All 12 prose-object math signatures and non-formula numeric signatures equal the originals. All three exercise math signatures and non-formula numeric signatures equal the originals. Semantic comparison above additionally checks wording-based conditions and quantifiers; matching signatures alone was not treated as proof of fidelity.
- Exercise count is 3 in both layers, with exactly tasks 27, 28, 29. Each preserves `number`, `source_number`, `group`, `group_id`, `pages`, `figure_refs`, and `figures`. Each modern `lines` equals `text.splitlines()`, and official natural-subpart normalization leaves each exercise unchanged.
- All changes are declared `wording`/`layout`; numeric-change and historical-entity lists are empty. No errata or mathematical correction is introduced.
- Modern visible prose/exercise text contains no Cyrillic. Chinese mathematical punctuation is outside math spans; current formulas retain their mathematical symbols. Language is neutral and readable; no cultural replacement, answer annotation, or unsupported assumption was found.

### Official ProseFlow Anchors

Official `normalize_lesson_layout` on an in-memory copy changes **no current text**. The existing official `prose_flow_contract` resolves both declared section breaks without errors, at actual final-paragraph indices `[4, 10]`. These indices are parser results, not authored block counts.

Boundary 4, after the discussion of sketches and before the worked spatial construction:

```json
{
  "before": "定理的证明和许多习题的解答都附有示意图。\n这些示意图并不按照严格的作图规则绘制，只需帮助我们理解所讨论的图形。\n此外，立体几何中的另一种画图方法可参看 § 5。",
  "after": "问题：通过已知点 $M$ 作一条平行于已知直线 $a$ 的直线。"
}
```

Boundary 10, after the external-point uniqueness proof and before the incident-point case:

```json
{
  "before": "所求直线 $b$ 必须位于通过直线 $a$ 和点 $M$ 的唯一平面 $\\alpha$ 内。\n由平面几何可知，在平面 $\\alpha$ 内，通过 $M$ 且平行于 $a$ 的直线只有一条。",
  "after": "b) 假设 $M\\in a$（图 11，b）。\n在这种情形下，通过 $M$ 且平行于 $a$ 的唯一直线就是已知直线 $a$。\n这里沿用本课程的口径：两条直线重合也属于平行的情形。"
}
```

Both are exact adjacent official paragraphs. The second separates distinct incidence cases within one argument, not different definitions of parallelism; the final quantified conclusion still covers both.

### Figure Manifest and Limits

The figure template retains exactly fig-11, label “图 11”, intended spec `figures/fig-11.spec.json`, and original PNG identity `figures/fig-11.png`. The actual original PNG byte hash is `78d51e15df951d37f27e06a81d182a96e4762d7c7491e0917c5000e847843fb1`, matching the manifest. Only that binary identity was checked; no source scan/image reopening or modern figure review occurred.

The parent reported two first-author `validate_text` math-sequence errors that were corrected before disclosure. That history is not converted into a claim that the first draft passed: first-check snapshots were not inspected and `validate_text`/finalize was not rerun. This review binds only the current hashes above, whose per-object math and numeric sequences independently match.

Only this report was written. No template/spec/tool edits, finalize, render, browser, source assembly, DB, promotion, answer/choice inspection, or further n1/fig07 work occurred. The current modern text/written review is complete; future independent choice Stage 1 waits for an explicit seed-ready notification.
