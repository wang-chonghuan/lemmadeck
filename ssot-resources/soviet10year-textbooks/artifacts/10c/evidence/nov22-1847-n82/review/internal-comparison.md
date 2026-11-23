# STEMROBIN-184-7 / n82: internal comparison and official binding

Date: 2026-11-23, Europe/Dublin.
Same independent review, after Stage A and blind Stage B were frozen.
Authority remains delegation by the parent chat under direct user authorization.
No additional direct-human gate, second mathematical review, source/view/image
reopen, browser, DB, network, dependency, keyboard interaction or peer message.
Cumulative image count remains 4. Elapsed time and reviewer model cost: UNKNOWN.

Only workdir:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.
Only new writes: the authorized official review path and existing evidence directory.

## Frozen and disclosed bindings

| Record | Actual-byte SHA-256 |
| --- | --- |
| `source-first.md` (accepted historical binding, not reread) | `8bb8c942cacf449179bb3e05b16aa335932fd1f7b48b59dfbce0d9caba9e491c` |
| `view-first.md` (accepted historical binding, not reread) | `f6f57a21cd408e7a80776212edfdb512277c50cef1975f1d1382ef5bc38f3668` |
| `view-first.json` (accepted historical binding, not reread) | `90afab043982b710d33d836d92b251c9c56ee4956ef29fd5b86e98243a52faf2` |
| `.tmp/stemrobin-184-six/n82-resume/question-author.json` | `177cba4e22af3c1c6648abe66765f0f9b1264b369ef9e5da38527ae5e7982989` |
| `.tmp/stemrobin-184-six/n82-resume/answer-author.json` | `3e7917f65da8bb184d0e76c7e77e42964fa3c45738365fc653c8866a38bc640d` |
| `.tmp/stemrobin-184-six/n82-resume/seed.json` | `477c0b9eae86d7d293a88a0fc5e9c9c891c2d429df6c0c8d326f68419f420991` |
| `.tmp/stemrobin-184-six/n82-resume/draft.json` | `6881ee0c5529424a2c503506f662fea541105cbaf148c99a3b12bc45a734b155` |

Official review uses the contract's canonical JSON digests, not these raw-byte
file digests:

- Seed: `67e0fefe595301719e53456a6ac3dad407033bab51844eb5bccb50d950cf5101`.
- Draft: `708718ec47cd43e8c019c5cbcff598ab40740860ec457ff5291a834be257adad`.

The documented `prepare.py digest` commands computed those canonical digests.
Official draft questions and coverage exactly match the disclosed author
snapshot. Compared with the already frozen visible content, no changed
mathematical fact, option, mode, figure reference or response unit was observed.
This is binding/comparison, not fresh option solving.

## Every key and rationale

Frozen independent sets remain q1 {a}, q2 {a,b,e}; they were not normalized to
the author. Both author's sets and every per-option truth agree.

| Question / option | Author truth | Comparison of derivation and misconception |
| --- | --- | --- |
| projection-phase / a | correct | theta = omega*t + varphi and x = A*cos(theta) yield the same law/parameters; correct rationale has no misconception. |
| projection-phase / b | incorrect | Reflecting the initial ray gives -varphi while keeping CCW motion, exactly producing this distractor. The author's example varphi=pi/3, omega*t=pi/2 gives true -sqrt(3)*A/2 versus distractor +sqrt(3)*A/2. Special varphi=0 coincidence does not make it a general law. |
| projection-phase / c | incorrect | Swapping the x/y projections produces A*sin(theta); the stated varphi=0,t=0 example gives 0 instead of A. The wrong procedure matches the actual option. |
| projection-phase / d | incorrect | Doubling the specified angular rate produces 2*omega in the formula. The author's varphi=0, omega*t=pi/2 example gives -A instead of 0. |
| rotating-vector-sum / a | correct | Factoring a common linear rotation from the two vectors is the frozen proof identity, valid also for zero sum. No misconception attached. |
| rotating-vector-sum / b | correct | A is the nonzero initial resultant's preserved length; its angle advances by omega*t and its x projection is the frozen cosine expression. No misconception attached. |
| rotating-vector-sum / c | incorrect | Unconditionally replacing the norm of a sum with the sum of norms produces the option. Equal positive-length antiparallel vectors give resultant norm 0, not their positive length sum. Zero is allowed by the source. |
| rotating-vector-sum / d | incorrect | Adding the two angular speeds produces the erroneous 2*omega claim; the common R rotates the resultant by omega*t only. The option explicitly excludes zero, so the rationale does not misuse zero direction. |
| rotating-vector-sum / e | correct | Rotation sends the zero initial sum to zero at every t; projection stays zero. No misconception attached. |
| rotating-vector-sum / f | incorrect | Transferring nonzero-amplitude phase identifiability to A=0 produces the false uniqueness claim; every varphi gives 0*cos(...)=0. |

All six wrong alternatives are actually false under the source's general
conditions, and each stated mistaken procedure produces its own alternative.
Correct alternatives' rationales have null misconception, as required.
No circular appeal to the correct set substituted for mathematical evidence.

## Intent, coverage and loss comparison

The author q1 source solution matches the frozen theta/cosine/second-derivative
derivation and phase modulo 2*pi. Its unit combines the law and its three
parameters instead of turning given parameters into isolated copying.
The author q2 solution matches common rotation linearity, projection of the
nonzero resultant and the zero/nonunique-phase case.
Both figure observations agree with the existing source/candidate check;
representative circle radii are not asserted as source numerical givens.

Both `concept_blocks` lists are empty consistently with the officially prepared
`--no-concepts` seed. No new condition was invented from an omitted definition.
Coverage maps source 69 to q1 and source 70 to q2 exactly.
The author expressly records the lost requirement to independently write the
proof; original written tasks and full ungraded proofs remain separately
available in the disclosed answer records. That recognition loss was already
accepted in blind Stage B and is not silently removed here.
No key, rationale or intent was inserted into the learner-facing view.

## Actual seed and promoted figure

The seed's 69/70 prose agrees with Stage A's frozen modern task facts: radius A,
origin, CCW omega-radians/time, initial phase from Ox+, x projection, and the
common-speed vector-sum hint. The only observed textual addition is the
nonmathematical heading `习题` before each exercise.
The seed contains no concepts and no concept-only figure IDs.
Changed provenance/file digests after promotion/finalization do not themselves
mean changed mathematics and do not require another source review.

The actual durable seed asset is
`ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/figures/fig-21.svg`.
Its actual-byte SHA-256 remains
`55192034b90fc2a677d5a0b8bbf05794f6a5357c4d4cfc3d248bab139571a624`,
the already approved output. Hashing it did not reopen its pixels.
It is a seed figure, not a draft `new_figures` item; `new_figures` is empty.
Formal `figure_checks` therefore binds this durable SVG and cites the existing
actual source observation and isolated browser PNG, without demanding a new
figure review or reopening the preview.

## Outcome and next display stage

Internal comparison: PASS for both keys, all ten rationale/truth records,
misconception derivations, source intent and package coverage.
Both complete ungraded proof comparisons: PASS, retained in `answer-review.md`.

Authorized official output:
`.tmp/stemrobin-184-six/n82-resume/review.json`,
schema `s10y-choice-review-v1`, outcome pass, using the original independent sets.
The standard choice checker verifies structural/freshness/snapshot binding,
not a second semantic or image review. No new acceptance gate is introduced.
Executed once from the sole workdir:

```bash
python3 .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .tmp/stemrobin-184-six/n82-resume/seed.json --draft .tmp/stemrobin-184-six/n82-resume/draft.json --review .tmp/stemrobin-184-six/n82-resume/review.json
```

Exit code: 0.
Output: `mechanical checks passed; declared semantic review: pass (not automatically proved)`.

Final course desktop/mobile display is still to be supplied and inspected once,
adding its images to cumulative 4. The choice/content verdict is not a claim
that this later display has already passed.
