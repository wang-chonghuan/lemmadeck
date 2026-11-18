# n32 Ordered Independent Semantic Review

## Frozen Inputs and Order

- Worktree: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.
- Seed byte SHA-256: `74b07f0760726ab6b1152dd97494ca88a38a0ab2ae12c72ecc71d55793d140b2`.
- Draft byte SHA-256: `8cd7f6d0eaff0c2ff9891d893cffe1079bbb6d92b7009f718abe9f3e936e6ab0`.
- Independent source baseline: `../n32-independent-source.md`, byte SHA-256 `2e33d3fa4656c262ebc206c79040ead12738dbe5dc573e8e66d19234c01e0927`.
- Phase 1 established every complete written source solution before reading candidates. Phase 2 reused those solutions without source re-solving or image reopening.
- This first section was written after projecting only question IDs and learner-facing `view` objects, before reading author internals, the source-candidate author report, standard answers, or the answer audit.
- Actual image loads remain 2 total, both in phase 1; phase 2 adds zero.

## View-First Fidelity, Redundancy, and Leakage

The eight units correspond to eight distinct mathematical tasks, not eight isolated answer slots:

| Question | Written task preserved | View-first fidelity judgment |
| --- | --- | --- |
| `n32-comparison-certificates` | 737: all six comparisons, including equality and 4.21 versus 2.1 | Pass: select complete comparison-and-square certificates; incorrect direct-radicand comparisons require distinguishing the square-root operation. |
| `n32-proof-reasoning` | 738: both bounds and their positive-number square-order justification | Pass with proof-production loss: it evaluates supplied arguments, including a true conclusion with an invalid square-order justification; it does not ask learners to compose a proof. |
| `n32-integer-bounds-and-approximations` | 739: all six consecutive-integer brackets plus error below 0.5 | Pass with explicit restriction: the stem openly requires the bracket midpoint rather than claiming the unrestricted source has a unique approximation. |
| `n32-signed-tenth-bounds` | 740: four one-decimal brackets, including both negative roots | Pass: a whole tuple retains both positive bounding and order reversal on negation. |
| `n32-figure-distance-judgment` | 741: both endpoint comparisons for square root of 5, explained by distance on actual figure 45 | Pass: the alternatives explicitly pair both distance inequalities with both selections; source geometry supplies the evidence. |
| `n32-tenth-bound-and-closeness` | 742: consecutive one-decimal bounds for square root of 2 and closer endpoint | Pass: complete results distinguish a bad bracket, wrong endpoint, and false tie. |
| `n32-radical-sum-relation` | 743: both comparisons and the positive cross-term reason | Pass: evaluate square expansions and conclusions rather than selecting an isolated larger value. |
| `n32-linear-coefficient-pair` | 744: both coefficients satisfying both given points | Pass with equation-production loss: a coefficient pair can be obtained by solving or checked at both points; checking only A does not separate the correct pair from two distractors. |

Redundancy: pass for all eight units. No two options in a unit are equivalent complete results, and the two multi-select proof/sum options concern different source subparts rather than repeated paraphrases. Table recognition and elimination can reduce working, but the six-row and four-interval units remain meaningful whole results under the review contract; that does not constitute automatic task failure.

Leakage: pass for all eight units. No source-mapping instruction or answer-key cue is exposed. Correctness cannot be read from option IDs or a declared correct-count. In 737 the choice between using a squared comparator and a bare comparator is itself the mathematical issue, not nonmathematical wording leakage. Its `sqrt(5)>2.2` certificate supplies only a lower bound and cannot by itself settle 741's distance-to-2.2 versus distance-to-2.3 judgment. Questions 738 and 739 share the lesson's legitimate square/midpoint concepts but not the requested numerical answers. There is no duplicate endpoint/coefficient answer across units that supplies another unit's exact result.

## Pre-Key Enumeration of All 36 Visible Options

These truth sets were established against the frozen independent source baseline, not against the author's key.

### n32-comparison-certificates

Complete true set: **a, b, c, d, e, f**.

| Option | Truth | Independent evidence |
| --- | --- | --- |
| a | Correct | `7<9=3^2` gives `sqrt(7)<3`. |
| b | Correct | `49=7^2<50` gives `7<sqrt(50)`. |
| c | Correct | `5>4.84=2.2^2` gives `sqrt(5)>2.2`. |
| d | Correct | `10.89=3.3^2<11` gives `3.3<sqrt(11)`. |
| e | Correct | `6.25=2.5^2` and the principal root is nonnegative, so equality holds. |
| f | Correct | `4.21<4.41=2.1^2` gives `sqrt(4.21)<2.1`. |
| g | Incorrect | `4.21>2.1` is numerically true but compares the radicand with the unsquared comparator; its root conclusion contradicts f. |
| h | Incorrect | `6.25>2.5` is true but is not a root comparison; the actual root equals 2.5, not greater. |

### n32-proof-reasoning

Complete true set: **a, b**.

| Option | Truth | Independent evidence |
| --- | --- | --- |
| a | Correct | `9<12<16` are the squares of the three positive compared numbers; both strict bounds follow. |
| b | Correct | `50.41<51<51.84` are the appropriate squares; positivity permits the conclusion. |
| c | Incorrect | The displayed numerical chain `3<12<16` is true, and the final bound happens to be true, but the claimed square-order inference lacks the lower square `3^2=9`. It compares 3 with 12 instead of the squares of 3 and sqrt(12); a true conclusion does not validate this stated proof. |
| d | Incorrect | The chain contains `51<7.2`, which is false; the required upper square is `7.2^2=51.84`. |

### n32-integer-bounds-and-approximations

Complete true set under the **explicit midpoint rule**: **b**.

| Option | Truth | Independent evidence |
| --- | --- | --- |
| a | Incorrect | All six brackets agree with the baseline, but all q values use the lower endpoint rather than the midpoint. Errors also exceed 0.5 for sqrt(0.4) with q=0, sqrt(35.4) with q=5, and sqrt(120) with q=10. |
| b | Correct | Brackets `(5,6),(3,4),(0,1),(5,6),(10,11),(12,13)` and q values `5.5,3.5,0.5,5.5,10.5,12.5` match the baseline. Strict bracketing proves midpoint error strictly below 0.5 for every row. |
| c | Incorrect here, not intrinsically invalid source approximations | All brackets are correct and all q values meet source tolerance; they are also the nearest-half-unit values for these roots. However, five rows use q values other than the explicitly required bracket midpoint; only sqrt(0.4) uses its midpoint. The stem makes this distinction explicit. |
| d | Incorrect | Every bracket is shifted upward by 1 from the actual lower integer. Each root is below the listed lower bound. Its q values are midpoints of those wrong brackets and have error greater than 0.5. |

Source nonuniqueness is retained as a limitation: b is the sole answer to this **restricted visible question**, not the sole valid approximation list for written source 739. Option c must never be described as failing source accuracy.

### n32-signed-tenth-bounds

Complete true set: **c**.

| Option | Truth | Independent evidence |
| --- | --- | --- |
| a | Incorrect | Both positive brackets are correct; both negative chains are reversed, with the claimed lower endpoint greater than the upper one. |
| b | Incorrect | Both positive intervals are one tenth too low: sqrt(3)>1.7 and sqrt(18)>4.2. The corresponding negative intervals are one tenth too high and exclude the negative roots. |
| c | Correct | The full tuple is `(1.7,1.8),(-1.8,-1.7),(4.2,4.3),(-4.3,-4.2)`, matching the baseline. |
| d | Incorrect | Positive intervals are right, but `(-1.7,-1.6)` and `(-4.2,-4.1)` lie above the respective negative roots. |

### n32-figure-distance-judgment

Complete true set: **a**.

| Option | Truth | Independent evidence |
| --- | --- | --- |
| a | Correct | The established root lies below both midpoints 2.5 and 2.25, making the distances to 2 and 2.2 smaller. Actual inspected figure positions agree. |
| b | Incorrect | First distance inequality is reversed and selects 3; its second pair alone is correct. |
| c | Incorrect | First distance comparison is correct; second is reversed and selects 2.3. |
| d | Incorrect | Both distance inequalities are reversed and both endpoint selections are wrong. |

### n32-tenth-bound-and-closeness

Complete true set: **d**.

| Option | Truth | Independent evidence |
| --- | --- | --- |
| a | Incorrect | sqrt(2)>1.4 because 2>1.96, so the displayed `(1.3,1.4)` bracket fails, even though 1.4 is the correct closer endpoint of the actual bracket. |
| b | Incorrect | Bracket `(1.4,1.5)` is correct, but sqrt(2)<1.45, so 1.4 is closer than 1.5. |
| c | Incorrect | Equal endpoint errors would require sqrt(2)=1.45; `1.45^2=2.1025` is not 2. |
| d | Correct | Both the bracket and the choice 1.4 match the complete established solution. |

### n32-radical-sum-relation

Complete true set: **a, c**.

| Option | Truth | Independent evidence |
| --- | --- | --- |
| a | Correct | The square is `29+2sqrt(190)>29`; both compared expressions are positive, giving the strict greater-than conclusion. |
| b | Incorrect | It drops the strictly positive cross term `2sqrt(190)` and falsely claims equality. |
| c | Correct | The square is `27+2sqrt(140)>27`; positivity gives the stated strict comparison. |
| d | Incorrect | It drops the strictly positive cross term `2sqrt(140)` and falsely claims equality. |

### n32-linear-coefficient-pair

Complete true set: **b**.

| Option | Truth | Independent evidence |
| --- | --- | --- |
| a | Incorrect | k=3, l=-34 gives y(12)=2 but y(-6)=-52, not -4. |
| b | Correct | k=1/3, l=-2 gives y(12)=2 and y(-6)=-4; it matches the established unique solution. |
| c | Incorrect | k=1/3, l=6 gives y(12)=10 and y(-6)=4, neither required ordinate. |
| d | Incorrect | k=-1/3, l=6 gives y(12)=2 but y(-6)=8, not -4. |

## Ordered Checkpoint

All 36 visible alternatives and all eight complete true sets are now recorded. Author internals, current standard answers/audit, and the source-candidate author report may be read only after this checkpoint. The semantic outcome is not finalized until their late comparison and the required structural validation.

## Late Author and Standard-Answer Comparison

Only after the preceding checkpoint, the author internals and per-option misconception derivations were read. All eight author sets match the independently enumerated sets. Every correct derivation agrees with the frozen baseline; every incorrect procedure produces its stated false alternative. In particular:

- 737 g/h drop the radical and transfer a radicand comparison back to a root, producing the wrong sign and missing equality.
- 738 c squares only the upper endpoint; its true conclusion does not repair the unsupported lower-bound proof step. d squares only the lower endpoint and includes the false inequality 51<7.2.
- 739 a uses truncation instead of midpoint, c replaces the visible midpoint rule with nearest-half-unit rounding, and d uses ceilings as floors. The author correctly states that c is valid for the original source tolerance.
- 740 a fails to reverse negation, b treats positive truncations as upper bounds, and d treats negative truncations toward zero as floors.
- 741 b prefers the upper coarse endpoint without distance comparison; c transfers an upper-endpoint preference from the hundredth bracket to the tenth bracket; d always prefers an overestimate. Those procedures account for the displayed wrong directions without changing the figure.
- 742 a treats truncation as an upper bound, b reverses the midpoint-square implication, and c assumes the bracketed root is the midpoint.
- 743 b/d omit the positive mixed product in squaring a sum.
- 744 a inverts the slope ratio, c solves for the intercept with the wrong sign, and d reverses only one subtraction order. The resulting pairs exactly match the rejected options and their both-point failures.

The source-candidate author report `../n32-author.json` was read only at this late comparison. Its actual byte SHA-256 is `f4e4165ecc8c24225f1a6f8013304305d4a0aa574b70a3278c429cb09f6d6c8d`, matching the supplied frozen report hash. It is not a substitute for independent mathematical evidence.

The current standard answers were also opened only after the view-first enumeration. Their byte SHA-256 is `a8fcb0b324fd9ca8f3274b97acce1f512c603d0ae26e609a198b299622711baf`; the current audit hash is `d065a8190c585226f6cabb853b05a5ed52d4e965be62e067b17b2bcfb0e2c7a4`. All eight full answers bind to the established source solutions, with complete evidence in `../n32-answer-binding.md`. The audit's mechanical pass and 4-auto/4-ungraded count are not semantic approval.

## Semantic Outcome

**Independent semantic PASS** for the frozen eight-question, 36-option package and **PASS for all eight standard-answer bindings**. There are no findings requiring revise or blocked.

This conclusion rests on the ordered independent source solutions, view-first fidelity/redundancy/leakage judgments, every-option enumeration, late rationale comparison, and complete standard-answer binding, not on a structural zero.

The declared losses are real but do not destroy the retained tasks: recognizing supplied certificates/results replaces independent production; 738 does not measure writing proofs, 741 does not prove that a learner actually used the figure, 744 permits candidate substitution, and 739 visibly narrows a nonunique approximation task to midpoints. The standard answers retain complete written reasoning and do not inherit 739's added midpoint restriction.

Canonical contract bindings in `review.json`: seed `3f518afd4927d9e90de2e494f0285dc8bbf8befa0e934c0d33d044200eff27ac`; draft `26ca56bcf341ad6d5a86043d8adb67d81e3629cfa55f803f2110a4d093dfd92c`.

## Validation Boundary

The required one validation with this review will run through `run-stage.cjs` under the unique label `n32-choice-semantic-FIRST`. Its actual exit and hash-bound receipt are recorded after execution below; the semantic judgment above was already reached independently.

A preliminary read-only hash-report command had a JavaScript syntax error (exit 1) and was corrected without modifying any input or repeating mathematical review. No validator run, paid call, or artifact write occurred in that failed command.

## Actual Validation and Final Integrity

Validation with review ran **exactly once**, under `n32-choice-semantic-FIRST`, and exited **0**. Actual stdout:

```text
mechanical checks passed; declared semantic review: pass (not automatically proved)
```

The executed command, from the sole authorized worktree:

```sh
node .intentfold/tickets/STEMROBIN-182/tmp/resume182-8/run-stage.cjs n32-choice-semantic-FIRST python3 .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-choice/seed.json --draft .intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-choice/draft.json --review .intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-choice/review.json
```

- Review JSON actual byte SHA-256: `27a0e9fe16a0d862e8d2f487621f0d85804f43263280b7eb25541799c0c88685`.
- Receipt: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/stages/n32-choice-semantic-FIRST.receipt.json`.
- Receipt byte SHA-256: `36e127683cc6a14cc5c07245e0972966811e2c8342e27f904f3e94cc3e146711`.
- Stdout byte SHA-256: `4d6e19d8819a643ffffe3767f827ec9c4ef89649dc6c78b83a0d8d8e789adc09`.
- Stderr is empty; SHA-256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

Final read-only assertions confirmed all six frozen inputs unchanged: independent source baseline, seed, draft, author report, current standard-answer keys, and audit. Receipt stream hashes match actual bytes. The review contains 8 complete source reviews, 8 question reviews, and 36 option checks.

Actual images: **2 total**, both original-detail phase-1 opens; **0 additional** in phase 2. No source re-solving, figure recertification, input interactions, app, publisher, database, Git, network, or paid/model calls. Only the requested reviewer artifacts and the explicitly requested unique run-stage evidence were written; other work was preserved.

Final gate outcome: **independent semantic PASS**, with no revise/blocked findings. This is the end of the single ordered source-first/view-first/late-key gate.
