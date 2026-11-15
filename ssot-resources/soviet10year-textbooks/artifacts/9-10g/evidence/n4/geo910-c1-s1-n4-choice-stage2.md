# geo910 n4 Choice Review: Stage 2 Freeze

STEMROBIN-184; 2026-11-15. Independent reviewer, not the choice author.

**Stage 2 complete. Visible task fidelity, redundancy, and answer leakage: PASS. All 12 options independently enumerated; complete true sets are `{b}`, `{c}`, `{d}` in projection order.** This is a view-only result, not author-key comparison or final package approval. Stage 3 remains unauthorized/pending.

## Snapshot and Order

Root `/Users/yong/.codex/worktrees/a07e/lemmadeck`; paths below are relative to root.

| Evidence | Actual byte SHA256 |
| --- | --- |
| `.intentfold/tickets/STEMROBIN-184/tmp/geo910-c1-s1-n4-choice-views.json` | `1de0182d46f36ac05d59f9f3436bd4dcabaa8f392dd97d8052b5b9c73daf0e08` |
| `.intentfold/tickets/STEMROBIN-184/tmp/geo910-c1-s1-n4-choice-stage1.md` | `21865c81122c1c7e4ab95391909d21b82d60bea0b8e4e29bb1187958edf4db86` |
| `.intentfold/tickets/STEMROBIN-184/tmp/geo910-c1-s1-n4-choice-seed.json` | `e6254f6c66f04ff610e28742fd030b6a6d9c179673b4411d6e7f4587f690834d` |

Canonical view-projection SHA256, from existing `prepare.py digest`: `2b89ef515cde41f6fc85fd4077cc7565176d689593b1b1069ba7e668b32b3b65`.

Canonical seed binding remains the Stage 1 value `804b2ce7fbb35175e1406cd7521824f4c389255053daee3c0770c7f47e35e1db`.

Permitted inputs were only the current `id/view` projection, my frozen Stage 1 record, and the choice semantic-gate reference. The unchanged source tasks were not solved again. First evaluated visible task fidelity/redundancy/leakage against the frozen baselines; then independently solved every visible option below. No internal draft, author notes/rationale/key, parent answer/source-first file, or other review was opened.

The projection contains three `single` questions, four options each. Every stem and option has `figure_ids: []`; there is no image requirement and no image/browser work.

## Visible Fidelity, Redundancy, and Leakage

### `spatial-perpendicular`

**Task fidelity PASS.** This preserves the spatial setting, actual right-angle intersection, both $M\notin a$ and $M\in a$ cases, and the complete construction/count distinction of source 27. Each alternative is a two-case mathematical record, not an isolated answer-cell click. Rejecting a record requires detecting a false intersection assertion or confusing planar uniqueness with spatial multiplicity.

**Redundancy PASS.** One coherent record covers both requested cases without duplicate fragment questions. This task's unrestricted spatial perpendicular family differs from the fixed-plane perpendicular used in the third question.

**Answer leakage PASS.** The stem supplies no solution counts. Alternatives a and b share the same correct external-point construction but differ on incident-point uniqueness; alternatives c and d supply different mathematical errors. No wording marker, source-number cue, or uniquely styled option supplies the answer without a geometry judgment.

**Production loss:** selecting a complete record does not demonstrate unaided construction or a written proof of uniqueness/completeness. Those losses must be truthfully declared in the later internal coverage/limitations record.

### `plane-intersection-branches`

**Task fidelity PASS.** The stem retains exactly the original incidence domain: $a\cap\alpha=M$ and $N\notin\alpha$, without adding $N\notin a$. It explicitly asks about *all* allowed positions. Every alternative discusses both $N\notin a$ and $N\in a$. Saying construction requires existence, not a prior assumption of uniqueness, is supported by the selected lesson definition and prevents an invented uniqueness premise.

**Redundancy PASS.** A whole two-branch construction record assesses the unique/nonunique distinction coherently. Options b and c differ in a substantive incidence claim, $NP$ versus $MP$, not merely synonyms. The first and third questions cannot replace this task's degenerate plane/intersection family.

**Answer leakage PASS.** “不预先要求唯一” explains the task's legitimate scope; it does not supply the correct construction. Both b and c have the same successful degenerate-branch description, so that scope statement alone cannot select c. The learner must check which proposed line lies in both planes. No answer is quoted from another question.

**Production loss:** recognition does not demonstrate producing the auxiliary construction or independently proving its existence and complete family. That loss is acceptable only if honestly recorded; neither allowed branch may be silently omitted.

### `specified-intersection-plane`

**Task fidelity PASS.** Both $a,M$ remain in $\alpha$, $N$ remains outside $\alpha$, and the desired intersection line must pass through $M$ and meet $a$ at a right angle. Neither incidence case for $M$ is excluded. The extra request to judge existence/uniqueness is mathematically supported by the frozen construction, not a changed source condition.

**Redundancy PASS.** The question tests constructing the *right line in the specified plane*, then the plane through that line and $N$. It is not a repeated perpendicular-count question or a repeated arbitrary-intersection question.

**Answer leakage PASS.** All alternatives propose a construction and claim success/uniqueness. Option d must still be distinguished from using the wrong generating line, imposing whole-plane perpendicularity, or preserving direction instead of making a right angle. Its fuller necessity argument is mathematical evidence to assess, not an external correctness annotation.

**Production loss:** selecting the valid method cannot demonstrate independent plane construction or written existence/uniqueness reasoning. Stage 3 must check that the author does not claim those production abilities were directly tested.

### Whole-Projection Assessment

The visible questions correspond substantively to all three frozen source tasks, without source-number labels or mapping instructions shown to the learner. Shared use of planar uniqueness and a plane through a line plus an external point is legitimate concept reuse. It does not provide a cross-question shortcut: source 27 varies the plane; source 28 has $a$ crossing $\alpha$; source 29 has $a$ contained in $\alpha$ and requires a perpendicular intersection. No displayed record for one question gives the complete answer record for another.

The three-item grouping preserves the mathematical distinctions. Full-record recognition and reasonable elimination are not automatically fidelity failures. Actual internal `source_numbers`, coverage, declared omissions/limitations, and keys are still unseen and cannot yet be approved.

## Independent Mathematics: All 12 Options

False means the proposed complete record is not valid over the stated domain; success in a special configuration does not make a universal construction record true.

### `spatial-perpendicular`: Complete True Set `{b}`

| Option | Independent truth | Concrete evidence |
| --- | --- | --- |
| a | Incorrect | The external-point construction is valid, but for $M\in a$ choosing one plane gives only that plane's perpendicular. Other planes through $a$ give other perpendiculars. Uniqueness within the chosen plane is not uniqueness in space. |
| b | Correct | For $M\notin a$, any candidate and $a$ determine the unique plane through $a,M$; its perpendicular through $M$ is unique. For $M\in a$, every plane through $a$ supplies its perpendicular through $M$. Distinct planes give distinct lines, since $a$ and any such perpendicular determine a unique plane. Every solution belongs to this family. |
| c | Incorrect | Orthogonal directions do not force intersection in space. Counterexample: $a=\{(t,0,0)\}$, $M=(0,1,0)$, and $\ell=\{(0,1,t)\}$. The direction of $\ell$ is perpendicular to that of $a$, but $\ell$ never meets $a$. Thus the claimed infinite external-point solution family is false. |
| d | Incorrect | Two perpendicular planes can supply two solutions, but not all of them. With $a$ the x-axis and $M=(0,0,0)$, their y- and z-axis perpendiculars do not exhaust the family: the line through $M$ in direction $(0,1,1)$ is another right-angle-intersecting solution. |

Each false alternative has a false substantive assertion, not merely an incomplete proof. Exactly one alternative is true.

### `plane-intersection-branches`: Complete True Set `{c}`

**Existence detail for the visible auxiliary construction.** In the $N\notin a$ branch, the plane $\beta$ through $a,N$ is unique. The parallel line $b$ through $N$ lies in that plane: coplanarity of $a,b$ gives a plane containing $a,N$, hence the same $\beta$. Let $\ell=\alpha\cap\beta$. It exists because the distinct planes share $M$. Within $\beta$, $a$ meets $\ell$ at $M$, so the distinct parallel $b$ also meets $\ell$, at $P$. Therefore $P=b\cap\alpha$ exists. Moreover $P\ne M$, since $M\in a$ and distinct parallels $a,b$ do not meet. Thus $MP$ is precisely the two planes' intersection. This supplies the existence and distinct-point justification rather than assuming the printed step $P=b\cap\alpha$ succeeds.

| Option | Independent truth | Concrete evidence |
| --- | --- | --- |
| a | Incorrect | Its first branch is valid. In the allowed $N\in a$ branch, the line through $N$ having the same direction as $a$ is $a$ itself. Hence $P=b\cap\alpha=M$, not $P\ne M$. Also $a,N$ do not determine a unique plane. The proposed $MP$ consequently collapses to one point. |
| b | Incorrect | The degenerate branch is valid, but the external-point branch names $NP$ as the intersection. Since $N\notin\alpha$, a line containing $N$ cannot be contained in $\alpha$. In fact $NP=b$, the auxiliary parallel line; only $P$ is in $\alpha$. The intersection must be $MP$, not $NP$. |
| c | Correct | The first branch is valid by the existence argument above. If $N\in a$, any $Q\in\alpha$, $Q\ne M$, lies outside $a$, since $a\cap\alpha=M$. The plane through $a,Q$ exists uniquely, contains $N$, and intersects $\alpha$ in $MQ$. Every line in $\alpha$ through $M$ is obtained by selecting another point $Q$ on it. This is the entire allowed degenerate family. |
| d | Incorrect | Nonuniqueness does not imply nonexistence. For $N\in a$, choose any $Q\in\alpha$ other than $M$; the plane determined by $a,Q$ contains both $a$ and $N$, and its intersection with $\alpha$ is $MQ$. There are infinitely many admissible choices rather than no solution. |

No branch assumes $N\notin a$ from $N\notin\alpha$. The point-on-line branch has been explicitly evaluated in all four records. Exactly c is valid for every allowed position.

### `specified-intersection-plane`: Complete True Set `{d}`

| Option | Independent truth | Concrete evidence |
| --- | --- | --- |
| a | Incorrect | The plane through $a,N$ is distinct from $\alpha$, and both contain $a$, so its intersection with $\alpha$ is $a$, not a line perpendicular to $a$. If $M\notin a$, then $M$ is not even in that plane; if $M\in a$, constructing an in-plane perpendicular still does not make it the planes' intersection. |
| b | Incorrect | A plane through $N$ perpendicular to $a$ need not meet $\alpha$ along a line through the separately given $M$. Counterexample: $\alpha:\ z=0$, $a$ the x-axis, $M=(0,0,0)$, $N=(1,0,1)$. The plane through $N$ perpendicular to $a$ is $x=1$; its intersection with $\alpha$ is $\{(1,t,0)\}$, which does not contain $M$. It can satisfy a special position, but is not a generally valid construction. |
| c | Incorrect | The proposed $\ell$ has the same direction as $a$, so it is parallel to $a$ or coincident with it. In neither case does it intersect $a$ at a right angle. Constructing a plane with intersection $\ell$ does not fix that failure. |
| d | Correct | The unique perpendicular through $M$ within $\alpha$ is $\ell$. Because $N\notin\alpha$, $N\notin\ell$, so $\ell,N$ determine a unique plane $\beta\ne\alpha$. Their shared line is exactly $\alpha\cap\beta=\ell$. Any admissible plane must contain the same unique planar perpendicular and $N$, so it is this $\beta$. Both possible incidences of $M$ with $a$ are covered. |

Exactly one alternative is true. In particular, b is false for a concrete admissible configuration; it was not rejected merely because it mentions a concept beyond the seed.

## Frozen Result and Remaining Gate

```json
{
  "spatial-perpendicular": {
    "task_fidelity": "pass",
    "redundancy": "pass",
    "answer_leakage": "pass",
    "independent_correct": ["b"],
    "option_truths": {"a": false, "b": true, "c": false, "d": false}
  },
  "plane-intersection-branches": {
    "task_fidelity": "pass",
    "redundancy": "pass",
    "answer_leakage": "pass",
    "independent_correct": ["c"],
    "option_truths": {"a": false, "b": false, "c": true, "d": false}
  },
  "specified-intersection-plane": {
    "task_fidelity": "pass",
    "redundancy": "pass",
    "answer_leakage": "pass",
    "independent_correct": ["d"],
    "option_truths": {"a": false, "b": false, "c": false, "d": true}
  }
}
```

All three visible modes are consistent with the independently determined singleton true sets. No visible correction is required. Stage 3 must still compare the authorized current full draft's exact view projection, seed binding, source/coverage mapping, author correct sets, all rationales/misconception derivations, and honest production-loss declarations. None of those unseen internal fields is approved by this report.

Only this Stage 2 report was written. No unchanged source re-solving, draft/key access, validation, rendering, browser, image generation, template edit, finalize, promotion, or DB work occurred. Read-only hashing/digest does not substitute for a structural or semantic checker run. Awaiting explicit authorization and disclosure for Stage 3.
