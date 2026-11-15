# geo910 n4 Choice Review: Stage 1 Freeze

Ticket STEMROBIN-184; 2026-11-15. Root `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

**Stage 1 complete: seed binding confirmed; all three source-task conditions, solution families, constructions, and capability baselines frozen.** This is not approval of a choice package or a guessed correct-option set. No view, draft, author notes/internal reasoning, answer, or parent source-first report was opened.

## Snapshot and Permitted Evidence

- Seed: `.intentfold/tickets/STEMROBIN-184/tmp/geo910-c1-s1-n4-choice-seed.json`.
- Actual seed byte SHA256: `e6254f6c66f04ff610e28742fd030b6a6d9c179673b4411d6e7f4587f690834d`.
- Canonical seed SHA256, from the existing read-only `prepare.py digest`: `804b2ce7fbb35175e1406cd7521824f4c389255053daee3c0770c7f47e35e1db`.
- Reused independent source/text freeze: `.intentfold/tickets/STEMROBIN-184/tmp/geo910-n4-modern-independent-review.md`, actual byte SHA256 `6fcb69786ec6567c3400a6f1db5d940fdceeeec128554f80873f896d34d25771`. That report contains the independent solutions obtained before the modern author template was disclosed. The unchanged tasks were not solved afresh here; their existing reasoning is recorded below as full Stage 1 construction/family baselines.

All four current trace files match the seed's recorded actual byte hashes:

| Trace path, relative to root | Actual SHA256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/9-10g/book.json` | `b6223765bc3127471a8c780fa634d0394b06b1f11c579d642579ba3c8c627e83` |
| `ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c1-s1-n4/lesson.json` | `c773d37fe764926c9a9451d7f481841676cfcebbc199260ff3b14113cc8447c7` |
| `ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c1-s1-n4/exercises.json` | `bca858c6c0ae1c5ea8ab5f49f277579af91fbf95277be967fe98aba0f99f5f29` |
| `ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c1-s1-n4/figures.json` | `46c4d2ce8617d9ce752439332f726e465866f770106d07df8afa1e8fccffc53a` |

The current lesson/exercise identities are `geo910-c1-s1-n4`, both `ready`. The current exercise file has exactly three tasks, 27–29. Every seed exercise text exactly equals the corresponding current written task; source references remain `p0020#9`, `p0020#10`, and `p0020#11` + `p0021#1`. All three current exercise figure-reference/display lists are empty.

**Actual seed figure inventory is empty:** `figures: []`, `source.concept_figure_ids: []`, and every exercise has `figure_ids: []`. There is therefore no seed image to inspect, no missing referenced asset, and no image observation to invent. The lesson's fig11 is not selected into this seed; it was not opened.

## Selected Definition

Seed concept block 1 exactly matches current lesson prose block 1, kind `p`, source reference `p0019#5`:

> 我们没有工具直接在空间里作出平面和直线。
> 因此，在立体几何中，“作平面（直线）”是指证明满足所给条件的平面（直线）存在。
> 例如，前一节的推论 1 讨论了通过一条直线和直线外一点作平面的问题。
>
> 这就是说，存在通过这条已知直线和已知点的平面。

This is the actual lesson-local definition of spatial construction, with a contextual existence example, not a selected solved version of tasks 27–29. Consequently a legitimate construction answer must justify existence and the required incidences; a plausible-looking sketch alone is insufficient. A spatial construction may be an existence argument rather than a physical ruler/compass procedure. The previously frozen plane-uniqueness and intersection reasoning is reused below; no extra definition, external convention, or solved-example input was newly selected.

## Source 27

Exact seed task:

> 27. 在空间中，已知直线 $a$ 和点 $M$。通过已知点作一条与已知直线相交成直角的直线。分别在下列两种情形下，问题有多少解？
> 1) $M\notin a$；
> 2) $M\in a$。

**Conditions:** spatial setting; a candidate line must contain $M$, intersect $a$, and make a right angle at the actual intersection. Both membership cases are requested. No common plane is given in advance. A skew line or the coincident line $a$ is not a perpendicular solution.

**Case 1, $M\notin a$: one solution.** Construct the unique plane $\pi$ through $a$ and external point $M$. Within $\pi$, construct the unique perpendicular line $\ell$ from $M$ to $a$, with its intersection point $H\in a$. This gives a spatial solution. Conversely, any candidate intersects $a$ at a point distinct from $M$, so the candidate and $a$ determine a plane containing both $a$ and $M$, necessarily $\pi$. Planar perpendicular uniqueness therefore excludes every other candidate.

**Case 2, $M\in a$: infinitely many solutions.** For any plane $\pi$ through $a$, take its planar perpendicular to $a$ through $M$. Each is a solution. Distinct such planes produce distinct perpendicular lines: otherwise the two intersecting lines $a,\ell$ would determine the same plane. Every solution determines a plane with $a$, so this is the complete solution family, not merely examples of an infinite subset.

**Frozen capability floor:** retain the contrast between one and infinitely many solutions and its spatial reason. Recognition of the complete two-case classification can meaningfully assess that reasoning. Reducing the task to “a perpendicular exists” drops the requested count/case distinction. Restricting case 2 to one chosen plane changes the source domain. Independent drawing/construction and a written uniqueness/family proof cannot be demonstrated by clicking; any conversion must honestly record those production losses rather than claiming they were assessed.

## Source 28

Exact seed task:

> 28. 已知 $a\cap\alpha=M$，$N\notin\alpha$。作平面 $\alpha$ 与通过 $a$ 和 $N$ 的平面的交线。

**Conditions:** the literal given relation is $a\cap\alpha=M$, so $a$ meets $\alpha$ in exactly the indicated point and is not contained in $\alpha$. The only restriction on $N$ is $N\notin\alpha$. In particular, $N\in a$ remains admissible, and then $N\ne M$. No right-angle, parallelism, named second intersection point, or unique containing plane is supplied.

**Nondegenerate branch, $N\notin a$: unique intersection line.** Construct the unique plane $\gamma$ through $a$ and external point $N$. It is distinct from $\alpha$ because it contains $N\notin\alpha$, and both planes contain $M$. The plane-intersection property gives a line $\ell=\alpha\cap\gamma$ containing $M$. This proves existence of the requested line under the selected definition of spatial construction. Both the containing plane and its intersection with $\alpha$ are unique. If describing the line by two points, take a second common point $Q\ne M$, whose existence follows from that intersection being a line, and write $\ell=(MQ)$; do not merely assume such a point without the intersection argument.

**Degenerate branch, $N\in a$: an entire family, not a unique line.** Choose any line $\ell$ in $\alpha$ through $M$. The distinct intersecting lines $a,\ell$ determine a unique plane $\gamma$. It contains $N$ because $N\in a$, and it is distinct from $\alpha$ because $a$ is not contained in $\alpha$. Its intersection with $\alpha$ is exactly $\ell$. Conversely, any plane through $a,N$ intersects $\alpha$ in a line through $M$. Thus the complete family of possible intersection lines is **every line in $\alpha$ through $M$**. Each such line corresponds to the plane determined by $a,\ell$; there are infinitely many.

**Frozen interpretation:** the source admits constructing an admissible plane/intersection. It does not determine an unconditional unique plane or line over the whole stated domain. It is not unsolvable in the degenerate branch: admissible constructions exist, but they are not unique. “$N\notin\alpha$ implies $N\notin a$” is false. No guessed unique answer/key is authorized; a later choice can assess condition-aware construction or the complete family without inventing a missing premise.

**Frozen capability floor:** preserve the common-point/intersection reasoning, the containing-plane condition, and the allowed $N\in a$ branch. A statement about the intersection passing through $M$ alone does not cover the construction/family task. A genuinely narrower conditional item may explicitly say $N\notin a$, but its coverage must not silently stand in for the original full domain; any deferred degenerate branch must be recorded and weighed. Recognition of a sound complete construction is possible, with honest loss of independent construction/proof production.

## Source 29

Exact seed task:

> 29. 在平面 $\alpha$ 内，已知直线 $a$ 和点 $M$。通过点 $N\notin\alpha$ 作平面 $\beta$，使平面 $\alpha$ 和 $\beta$ 的交线通过 $M$，并且垂直于 $a$。

**Conditions:** both $a$ and $M$ lie in $\alpha$; $N$ lies outside $\alpha$; the desired plane $\beta$ contains $N$. Its intersection line with $\alpha$, rather than the whole plane, is required to pass through $M$ and be perpendicular to $a$. Both $M\in a$ and $M\notin a$ are allowed.

**Complete construction:** in $\alpha$, construct its unique line $\ell$ through $M$ perpendicular to $a$. Because $N\notin\alpha$ and $\ell\subset\alpha$, the point $N$ is outside $\ell$. Construct the unique plane $\beta$ through $\ell$ and $N$. It is distinct from $\alpha$ and contains $\ell$, so $\alpha\cap\beta=\ell$. The intersection therefore has exactly the required incidence and right-angle properties. This also proves spatial existence in the lesson's meaning of “作”.

**Uniqueness and complete family:** any admissible plane must intersect $\alpha$ in the unique planar perpendicular $\ell$ through $M$ and must contain $N$. It must therefore be the plane determined by $\ell,N$. There is exactly one such plane in either incidence case for $M$. No extra $M$ condition is needed.

**Frozen capability floor:** assess selection/justification of the perpendicular **within $\alpha$**, then the plane through that line and external point $N$, and verify the exact intersection. Merely asserting a plane through $M,N$ leaves many choices and does not satisfy the full task. Requiring the whole plane to be perpendicular to $a$ silently strengthens/changes the source. Choice recognition cannot establish independent construction or a written existence/uniqueness proof; those are concrete limitations to record.

## Package Baseline for the Next Disclosure

- All three selected sources require coverage or a substantive, visible-to-reviewer omission/loss record. A construction-to-recognition limitation is not automatically fatal, but deleting the mathematical condition distinctions is.
- Meaningful combined-case or full-construction judgments may be legitimate; source subparts need not become mechanical one-click fragments. No response mode or number of candidate questions is prescribed before seeing the view.
- Do not use source 29's named plane/incidence conditions to smuggle an absent $N\notin a$ premise into source 28. Shared geometry does not make their condition domains identical.
- No options or true sets have been seen or guessed. Fidelity, redundancy, cross-question leakage, and every option's truth remain pending the separately disclosed view-only projection. Author keys and reasoning remain unopened until independent visible-option enumeration is frozen.

## Actions and Stop Boundary

Only this report was written. Input projection/equality checks and byte hashing were read-only; the sole skill command was `python3 -B .agents/skills/ld-s10y-choice/scripts/prepare.py digest <seed>`, not inspect, prepare, or validate. No browser, render, answer/choice draft access, template/tool edit, DB, promotion, or new figure work occurred.

Stage 1 is frozen. Awaiting the parent’s explicit view-only disclosure; no further choice review is started here.
