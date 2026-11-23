# N18 modern text-only substantive review

Status: **NEEDS METADATA CORRECTION** for the retained historical entities. Mathematics, source binding, faithful scope and exercise/figure applicability: **PASS**. No mathematical defect found. Full modern-contract PASS is withheld for the single finding below.
Date: 2026-11-23.
Ticket / target: STEMROBIN-184 / ana9-c3-s1-n18.
Sole cwd: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.

## Finding

### P2: retained historical entities lack the required declarations

Affected file: `.tmp/stemrobin-184-six/n18-nov23-source71/raw/9c/editions/modern-us-neutral/lessons/ana9-c3-s1-n18/lesson.json`, prose block 4, `historical_entities` at line 81.

The modern text correctly retains `德国数学家康托尔` and the source's 1874 historical statement, but the corresponding `historical_entities` list is empty. The source snapshot contains the same entities, and the block has source refs `p0070#7` and `p0071#1`; the historical sentence specifically comes from `p0071#1`.

The binding lesson skill requires retained real historical people and countries to be declared individually with `term` and a source-bound `reason`: `.claude/skills/ld-s10y-lesson/SKILL.md:401-403`. This is an existing authorship contract, not a new review gate or a mathematical objection.

Needed correction: declare the retained person `康托尔` and country identity `德国` in this block's `historical_entities`, with reasons bound to the original historical passage `p0071#1`. Keep the identities, source text, mathematical formulas and historical numbers unchanged. Do not substitute a fictional modern person or treat the declaration as an unbound whole-book exception.

The saved adaptation audit's PASS does not waive this explicit declaration requirement. No validator or code repair was attempted or proposed. No author/template/output file was edited by this reviewer.

## Reviewed inputs and limits

The exact modern target is:

```text
.tmp/stemrobin-184-six/n18-nov23-source71/raw/9c/editions/modern-us-neutral/lessons/ana9-c3-s1-n18/
  lesson.json
  exercises.json
  figures.json
  adaptation.audit.json
```

The exact assembled source is:

```text
.tmp/stemrobin-184-six/n18-nov23-source71/raw/9c/lessons/ana9-c3-s1-n18/
  lesson.json
  exercises.json
```

Also read the preserved failed modern template `ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n18/first-modern-failure.json`. The independent source and mathematics baseline remains the existing `source-first.md`, `source-math.md`, `source-comparison.md` and `affected-source.md`; none was rewritten.

This continuation was entirely textual. New images: **0**. Cumulative image use remains **5/8 batch and 5/24 context**, with no image reopen, crop, screenshot or reset.

No finalize, proseFlow command, application/display check, dependency action, Git, DB, environment, network or other-agent action was performed. The historical date and attribution are preserved source facts; external historical research was not undertaken.

## Mathematics: PASS

### Practical approximation and rational-only arithmetic

Prose block 1 correctly says that 2 has no rational square root and that some real-axis points have no rational coordinates. It does not say that the square root does not exist among the reals.

Its practical statement is explicitly about specified precision and finite-decimal approximation, not exact finite-decimal representation of every real number. This resolves the distinction identified in the source mathematics review without introducing a new problem or changing a source formula.

### Density and nondegenerate intervals

Prose block 2 correctly states that a rational number exists strictly between any two distinct reals, and that a closed interval with different endpoints contains infinitely many rational points.

It explicitly requires a nondegenerate interval and says a singleton interval is outside that conclusion. This is the intended modern clarification of the approved page-70 wording; the embedded raw source snapshot remains unchanged. It does not assert that every singleton lacks a rational point.

The infinite-point conclusion follows by applying density to infinitely many disjoint nonempty subintervals. No endpoint counterexample remains in the modern claim.

### Density versus cardinality

Prose block 3 preserves the lamp metaphor but states what it illustrates: no nondegenerate interval is devoid of rational points. It explicitly rejects the inference that all real points are rational.

It identifies the sense in which irrational numbers are "more numerous" as cardinality, distinct from density. This is faithful to the source's qualified comparison, not a claim that one dense set occupies visually larger gaps.

### Canonical fractions and enumeration

Prose block 4 now specifies integer numerators, positive integer denominators, unique reduced representation and the zero-over-one convention. These are the mathematical conventions required by the source enumeration.

Ordering by increasing `|p|+q` and then increasing numerator is correct. Each shell has finitely many eligible fractions; each canonical fraction has a finite positive-integer shell number, so only finitely many finite shells precede it. Consequently every rational appears after finitely many steps. Canonical reduced representation prevents duplicate rational values.

Both printed fraction-prefix formulas remain unchanged and agree with the independent Stage A enumeration, including the transition from `-4/1` to `-3/2`. The convention of naturals beginning at 0 or 1 does not change countable cardinality.

### Real and irrational noncountability

The source theorem that every real-number sequence omits a real is retained correctly. It implies that the reals cannot be enumerated, including by a sequence containing repetitions.

The modern conclusion that irrationals are also uncountable is sound: if both rationals and irrationals were countable, interleaving their enumerations would enumerate the reals. This is a direct consequence of the source comparison, not an unrelated additional topic.

The output does not add a potentially incorrect decimal-diagonal construction. The independent Stage A proof already handled nonunique decimal expansions; no unverified author solution is used here.

### Closing paragraph

The final reading recommendation and late-19th-century historical motivation remain faithful in meaning. Replacing the raw expression `兴致` with the modern expression `兴趣` is a prose adaptation, not a raw-source rewrite or changed mathematical claim.

## Source binding and scope: PASS

The actual assembled-source hashes match both modern `source.sha256` declarations and the corresponding adaptation-audit source hash fields.

The embedded `lesson.source.data` and `exercises.source.data` are structurally identical to the actual assembled source files. For every modern prose block:

- `source_text` exactly equals its assembled source prose text.
- `source_refs` exactly equal the source block's refs.
- The ordered sequence of dollar-delimited formulas matches the source, after ignoring only mathematical whitespace.

The five prose bindings are:

| Prose block | Source refs | Ownership |
|---|---|---|
| 1 | p0070#4 | Rational-only limitations and practice |
| 2 | p0070#5 | Rational density |
| 3 | p0070#6 | Lamp metaphor and irrational comparison |
| 4 | p0070#7, p0071#1 | Enumeration paragraph, correctly joined across pages |
| 5 | p0071#2 | N18 closing historical/reading paragraph |

The source's joined enumeration paragraph correctly contains `一一对应`, including the page-71 continuation. N18 closes with the page-71 final reading paragraph. No source reference reaches the §6 heading, N19 body or any exercise outside N18.

Neither partial outer N19 nor x1 is present in the reviewed target. Their scratch existence is not used as evidence or approval for promotion.

The modern extensions explain conditions and consequences of the same five source paragraphs. They do not change the knowledge scope, source formulas, printed mathematical values, topic ownership or exercise/figure inventory. `numeric_changes` and `errata` remain empty; the source snapshots retain the original wording rather than silently correcting raw page 70.

## Retained failure and affected formula-order recovery

The parent reports the first actual adapt-finalize exited 2 for formula appearance order and the second actual run passed. The preserved failure file is the exact draft template, not a command log; I did not rerun either command.

Textual comparison confirms:

- Only prose block 4's text changed between the retained failed template and the current output.
- The failed/current mathematical formula multisets are equal: no formula was added, removed or mutated.
- The failed template's formula appearance order does not match the source.
- The current output's formula appearance order matches the source in every prose block.

In particular, the current fourth block presents the rational sequence, `|p|+q`, and `p/q` in source appearance order before the printed fraction prefix. Its associated section anchor was updated to the corresponding current text. The original failed template remains retained and hash-bound below.

The saved current `adaptation.audit.json` independently records `status: pass`, five prose blocks, five changed prose blocks, zero exercises, zero changed exercises, zero figures, zero errata and `errors: []`. That mechanical PASS is accurately reported, separate from the historical-declaration finding.

## Text-flow anchors and applicability

The parent reports the current authoritative proseFlow derives eleven paragraphs. I did not replace that with a speculative body count or rerun proseFlow.

The output stores three section-break anchors; the saved audit resolves them at indices 1, 5 and 9. Their before/after strings exactly match the output anchors. Text-only inspection of the already-normalized stored paragraphs confirms each pair is adjacent and follows an actual conceptual transition:

1. Practical limitations/approximation to density.
2. Density versus cardinality to enumeration.
3. Rational countability to real/irrational noncountability.

This is a text adjacency check, not a desktop/mobile display approval.

Exercise applicability is **NONE**: source and modern exercise files both declare count 0 and an empty list, consistent with the independent source freeze. Figure applicability is **NONE**: source lesson, modern lesson and modern figure manifest all contain empty figure lists, consistent with the original pixel inventory.

Therefore no answer, choice, figure rendering, figure-generation evidence or new image review is required for this target's absent exercise/figure objects. The new metadata finding does not create such an applicability requirement.

## Exact target and source hashes

All findings and PASS subresults apply to these exact reviewed bytes:

| File | SHA-256 |
|---|---|
| modern lesson.json | `c9bca2b6719da00bdf46058bad044c0c2fb893c341edc8e1e931f3ba9f576fa5` |
| modern exercises.json | `643c491e9b27a0a5d7033ef1d966d828ef9023f4991e40e624cc503efca4a68e` |
| modern figures.json | `6dfed33a1bef35b48b162dd9e50dd3e017c254983113d35effd36afbcf134657` |
| modern adaptation.audit.json | `0bc25c09647972782cc5bcc34e2674722bd55906aa208ad44cecbe0f00cc6453` |
| assembled source lesson.json | `6363fa4a3147fa4178cd3ca8eb979b64f2cb7c79b31428de751a24b98ac12b6b` |
| assembled source exercises.json | `00234d5e42d0d8cc1fb912450cd67178f8151e481178a5d10b5ac70071f05e18` |
| retained first-modern-failure.json | `fef20443dbe978f969f922ca865541dbd631bd43250f6d0182b3c061aaa44b4a` |

The prior reviewer report hashes were checked unchanged:

| Preserved report | SHA-256 |
|---|---|
| source-first.md | `d6d74feea5ae1eceb01a44722500f38533a63d30e64a9112aa133ad436304708` |
| source-math.md | `300da9633ced0b7997953a103b79678e17006e18cd4686a7cb94919ddccfc329` |
| source-comparison.md | `1213d9db5e2f4fc775e19a21c50d30148de19a5c4e203ea0dcb77f937aafa70d` |
| affected-source.md | `1ea0082130884080d7e776f5d6e2963c5a380f532739f297ef5557abdd6421e9` |

## Stop

Only this owned `reviewer/modern-review.md` was created. No author, source, template, modern output, audit, validator or prior report was changed. Full modern-contract PASS remains withheld only for the required historical-entity declarations; the mathematical and scope review is complete and passes for the bound output.

The existing review remains open for parent collection. No chat closure, Git, DB, environment, network, app, dependency or other-agent action was taken.
