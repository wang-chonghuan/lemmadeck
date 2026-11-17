# n97 Independent Internal Comparison: Stage3

Reviewer: independent choice reviewer n97, STEMROBIN-184, 2026-11-17.
Independently decided offline semantic outcome: **pass**.
No repair was made, no source or visible question was re-solved, and no
validator or screenshot opening was repeated. This compares the newly
disclosed internals with already frozen independent mathematics and fidelity.

## Ordered Independence and Current Snapshot

1. Stage1 solved only the authorized seed's ten exercises and sixteen tasks,
   before candidate exposure. `source-first.md` and `ledger.md` were frozen.
2. The parent explicitly consumed Stage1 before Stage2. Stage2 received only
   the `{id, view}` projection and two existing screenshots. Fidelity,
   redundancy, and leakage were assessed before complete option truth sets.
   Its report and ledger were frozen, with visual limitations recorded.
3. The parent explicitly consumed those Stage2 records before this sole Stage3
   disclosure. Only now were author solutions, intent, keys, rationales,
   misconceptions, coverage, handoff, and the existing validation record read.
   Earlier independent judgments were not rewritten to agree with the author.

All hashes below are SHA-256. Raw means actual file bytes, not canonical JSON.

| Artifact | Current raw-byte SHA-256 |
| --- | --- |
| `../seed.json` | `97df505324fbe5acb9cfb4c8f23f7c20c1580c4b92713bdf75c4fd09e2d15473` |
| `source-first.md` | `d56409b043adb7e0715e27e675f63a920d72f582411fdf77e9d2c68ac42437ac` |
| `ledger.md` | `78384113f2161bf5133dc78237d9b0398aa574b4217541490aa47b1d86e55e45` |
| `stage2-report.md` | `6a9767472ce0ecc37517fa052b356370e060abd7bc9f14924771a4f9caafeb8e` |
| `stage2-ledger.md` | `3f8598775159d24f2a82df9a10bb88477a3446357568253918d0e1edccda696e` |
| `../author/views.json` | `30667c88c102bdcdc8a436747c413437edbfb271d3d4a90798c09971224b827f` |
| `../author/draft.json` | `c9ca9ee2e6ccd2f19e2dd2f8cb7f73f78b3f6237cc7195ffff9efe05aa4586b6` |
| `../author/solutions.md` | `861c80dba486d6c0df526a1704ed711766aa6d76e707c3622abd708d9d09c785` |
| `../author/handoff.md` | `e8f2bfd18ccbb0f490d53c10cf96f9b3169e48bbe456a64b32feba6c06f0072c` |
| `../author/validation-first.txt` | `9557a4163a117dda964f78888a92210425bafb13774f1257b76a87626be49f35` |

Canonical digests were confirmed by read-only JSON serialization and hashing:

- Seed: `54cb3765d97f5f74b7dc26cf5ff7cfd2e5c552f9545a0582412e5f28e67cf091`.
- Draft: `d59a9210e4fa427969501515ff4c32d03f47766dda94cf23efe843a1a8909d8d`.
- Views: `4ab29362ac28624f69be05f6f8dc887ea22d650b524e1859f582bf2b895d16b4`.

The current draft's ordered `questions.map(q => ({id:q.id, view:q.view}))`
is exactly equal to the frozen Stage2 views projection. No option text,
ordering, mode, or stem was substituted after independent views-only review.
This was a hash/projection comparison, not a validator invocation.

## Source, Intent, and Coverage Comparison

The current seed still selects only book `10c`, lesson `ana10-c7-s1-n97`,
unsolved exercises 392-401, and definition blocks 10, 11, 12.
Every question cites exactly its corresponding source exercise and all three
definition blocks. There are ten coverage entries, each naming exactly its
one citing question. No source or authored figures, concept figures, question
figure IDs, option figure IDs, or figure observations are present.
`new_figures=[]`; both figure arrays in the review are therefore empty.
The original source JSON files named in the seed trace were not opened or
refreshed. Current projection confirmation does not claim a new live-source
freshness check.

Author `solutions.md` agrees with Stage1 on all twelve given-function
derivative proofs and four all-real primitive constructions, including the
constants, radical indices, tangent/cotangent signs, reciprocal sign on both
half-lines, absolute-value branches, and the mixed numeral $2\frac12=5/2$.
Its complete primitive families also match Stage1. The mean-value-theorem
completeness explanation is internal mathematical reasoning, not an added
selected lesson definition.

| Source and tasks | Actual disclosed declaration compared with frozen Stage2 |
| --- | --- |
| 392.a/b | `intent.limitations` explicitly says quotient limits and equalities to $f$ are not required and are a genuine omission; `coverage.omitted_tasks` records both unaided proofs and both final limit completions. Correct rationales finish those limits internally, without pretending the view elicits them. |
| 393.a/b | Intent and coverage explicitly omit taking the selected quotient limits and writing final derivative equalities, as well as unaided construction of both proofs. The supplied root substitution and trigonometric setup are also disclosed. |
| 394.a/b | Intent and coverage explicitly omit writing final simplifications of both valid derivative chains to $f$ and unaided proofs/domain arguments. The closed-endpoint assertion is labeled supplementary, not a change to either source interval. |
| 395.a/b | Intent and coverage explicitly omit the final simplifications to $f$ and unaided radical/cotangent proofs. Supplied setup and added endpoint judgments are disclosed. |
| 396.a/b | Both negative- and positive-half-line proof-production losses are separately recorded. The common derivative permits one paired assertion without dropping either source part or its constant. |
| 397.a/b | Both branch-proof-production losses are separately recorded. Intent also discloses supplied branches and the added zero-limit recognition, not unaided cusp proof production. |
| 398 | Intent and coverage record loss of unaided primitive construction, complete $+C$ family production, and written verification. The extra composite-polynomial cancellation demand is disclosed. |
| 399 | Intent and coverage record loss of construction and complete family/verification production, together with increased shifted-power expansion demands. |
| 400 | Intent and coverage record construction, family completeness, and written reasoning losses. Two offered family members are not represented as a proof of completeness. |
| 401 | Intent, coverage, and handoff all disclose that $2\frac12=5/2$ is supplied, so unaided mixed-number decoding is not assessed; affine construction, written verification, and family completeness remain production losses. |

The handoff expressly states that recognizing any of the twelve source proofs
is not evidence of writing it, and recognizing the four construction units is
not evidence of blank-page construction. It repeats the additional 392-395
completion losses and the 401 notation scaffold. Thus no frozen Stage2 loss
is silently converted into a claim of full production-skill retention.

## Keys and All Correct Rationales

Every author key and every per-option truth agrees with the frozen Stage2
inventory: 10 questions, 42 options, 17 true and 25 false.
There are 4 native single questions and 6 native multiple questions.
All 17 correct rationales have `misconception=null`; their substantive
derivations agree with the independent relationships below.

| Question | Frozen independent set = author key | Correct-rationale comparison |
| --- | --- | --- |
| n97-392 | B, C | B uses the legitimate difference-of-cubes cancellation and nonzero denominator; C cancels both constants and uses sine addition. Their internal limits agree with the already frozen source derivatives. |
| n97-393 | A, C | A retains $u+v$ and gives limit $1/v$; C uses $\cos x-\cos(x+h)$ and gives limit $\sin x$. |
| n97-394 | A, C | A includes inner $4x^3$ and reduces to $x^{1/3}$; C uses the plus quotient numerator and nonzero cosine, with the constant derivative zero. |
| n97-395 | B, C | B reverses the negative cotangent derivative; C includes inner $3x^2$ and reduces to $\sqrt x$ on $x>0$. |
| n97-396 | C | The same positive $x^{-2}$ derivative and zero constant derivatives apply on both original half-lines, excluding zero. |
| n97-397 | B, C, E | B and C use opposite absolute-value branches; E uses the ordinary one-sided quotients, not the symmetric quotient. |
| n97-398 | B | The composite derivative $x^3+x$ loses its surplus $x$ through subtraction of $x^2/2$, giving $x^4/4+1/4$. |
| n97-399 | B | All four lower-degree derivative terms cancel; the candidate is $x^5/5+1/5$. |
| n97-400 | A, D | Both translated quadratics differentiate to $x$ and differ by the constant $3/2$. |
| n97-401 | D | For each fixed real $C$, the derivative is $5/2$ everywhere on $\mathbb R$. |

## All Incorrect Rationales and Mistaken Procedures

The following compares each of the 25 declared wrong procedures against its
actual option and the already frozen independent counterexample. It does not
assert that any real learner was observed making the error.

| Question/option | Does the stated mistake produce or wrongly accept this alternative? | Frozen falsification agrees with author |
| --- | --- | --- |
| 392 A | Yes: omit the subtracted $+3$, leaving an extra $3/h$. | At $x=0,h=1$, the asserted quotient exceeds the true one by 3. |
| 392 D | Yes: replace $u^3-v^3$ by $(u-v)^3$, then cancel once. | At $x=1,h=7$, $3$ is asserted instead of $3/7$. |
| 393 B | Yes: reverse $\cos x-\cos(x+h)$ before expansion. | At $x=\pi/2,h=\pi/2$, $-2/\pi$ is asserted instead of $2/\pi$. |
| 393 D | Yes: omit the factor $u+v$ in the square difference. | At $x=1,h=7$, $3/14$ is asserted instead of $9/14$. |
| 394 B | Yes: use $u'v+uv'$ rather than $u'v-uv'$. | At $x=\pi/4$, the asserted derivative is 0 instead of 2. |
| 394 D | Yes: infer finite endpoint limits and extension from interior differentiability without evaluating the limits. | Tangent diverges with opposite endpoint signs and secant squared diverges positively. |
| 394 E | Yes: read cube root as square root before differentiating. | Stage2 used $x=8$; the author uses $x=1$. Both show a false derivative, and Stage2 also falsifies the root identity. |
| 395 A | Yes: differentiate only the outer square root, omitting $3x^2$. | At $x=1$, the claimed derivative is $1/3$ rather than 1. |
| 395 D | Yes: omit the outside coefficient $-1$ on cotangent. | At $x=\pi/2$, the derivative is wrongly $-1$ instead of $+1$. |
| 395 E | Yes: infer finite endpoint extensions from the interior derivative identity. | Cotangent and cosecant squared have divergent one-sided endpoint limits. |
| 396 A | Yes: carry additive constants 14 and 9 into derivatives. | At $x=-1$ and $x=1$, the assertions give 15 and 10 instead of 1. |
| 396 B | Yes: join equal local derivative formulas across an assumed finite value at zero. | $1/x$ has no finite two-sided limit; neither reciprocal formula extends continuously. |
| 396 D | Yes: assign $x^{-2}$ the sign of $x$ after differentiating. | At $x=-1$, the derivative is $+1$, not $-1$. |
| 397 A | Yes: remove absolute-value bars on the negative branch. | At $x=-1$, $|x|\ne x$; the actual derivative is $-1$. |
| 397 D | Yes: treat the symmetric-quotient limit as sufficient for the ordinary derivative. | The symmetric quotient is zero, but the ordinary one-sided limits are $1$ and $-1$. |
| 398 A | Yes: dropping the square's cross term makes the unchanged candidate appear to differentiate correctly. | Its actual derivative is $x^3+x$, not $x^3$. |
| 398 C | Yes: integrate surplus $x$ by raising its exponent without dividing by 2. | The proposed subtraction gives derivative $x^3-x$. |
| 398 D | Yes: divide surplus $x$ by 2 but do not raise its exponent. | The derivative is $x^3+x-1/2$, failing at zero. |
| 399 A | Yes: use a constant 1 instead of $x$ to compensate surplus derivative 1. | The resulting derivative is $x^4+1$, failing at zero. |
| 399 C | Yes: integrate surplus $4x^3$ as $4x^4$ without division by 4. | The derivative is $x^4-12x^3$, failing at $x=1$. |
| 400 B | Yes: compensate derivative offset $+1$ by subtracting constant 1 instead of $x$. | The derivative remains $x+1$, failing at zero. |
| 400 C | Yes: compensate offset $-2$ with another negative correction. | The derivative becomes $x-4$, failing at zero. |
| 401 A | Yes: read the mixed numeral as $2(1/2)=1$, then integrate 1. | The derivative is 1, not $5/2$. This procedure necessarily overlooks the visible scaffold equality; the author explicitly acknowledges that the equality rules it out. |
| 401 B | Yes: copy the given constant into a primitive without an $x$ factor. | The derivative is zero for every $C$. |
| 401 C | Yes: replace constant input by $(5/2)x$ before integration. | The derivative is $(5/2)x$, failing at zero for every $C$. |

No incorrect option is equivalent to a correct one on its required whole
interval. Correct clauses inside false conjunctions are acknowledged,
particularly 396 B and 397 D, rather than wrongly labeled false in isolation.
The 401 A scaffold narrows the mistake's plausibility; it does not make the
procedure algebraically non-reproducible or the option mathematically true.

## Visual and Validation Boundary

No images were opened in Stage3. The permanent reviewer image count remains
2/8 batch and 2/24 context, all from Stage2:

- Desktop `../../offline/ana10-c7-s1-n97/choices-1440.png`:
  raw SHA-256 `6db80510322736f6518abfcc4ff4fcc07ad7f9cf20fb578708cb1fbbffc50c6e`,
  stored 1440x5159; the display ratio was not certified.
- Mobile `../../offline/ana10-c7-s1-n97/choices-390.png`:
  raw SHA-256 `6944388995e37050250eac4b0b2c342ef5571937c6e9a667a20e4f63d993ad51`,
  stored 390x6979 and explicitly displayed resized to 335x6000.

The frozen observations establish broad full-page layout through question 10 D,
not certified native-pixel fine readability, font sizes, every local overlap,
or interaction behavior. Existing `choices-report.json` raw SHA-256
`ecc2b708545100f6eec2223f2ba9ab3606bd6d19cee7b49f71580b0216fb1176`
supplies earlier option-box geometry, not a new visual certification.
These are verification screenshots, not source/authored mathematical figures;
they must not be fabricated as entries in contract `figure_checks`.

The disclosed `validation-first.txt` records one actual no-review invocation,
exit 0, stdout `mechanical checks passed; semantic review still required`,
and empty stderr, bound to the current canonical seed and draft hashes.
This was read as existing evidence. No validator was rerun, and no
review-bound validation success is claimed.

## Disposition and Stop

Every contract fidelity, redundancy, leakage, mathematics, and source-coverage
check has substantive supporting evidence. Author keys agree with the
independent results; all 42 rationales and all 25 wrong procedures were
compared. The actual declared production losses match the frozen independent
assessment. No definite repair or unresolved mathematical/source condition
was identified.

`review.json` therefore independently records `outcome=pass` for this exact
offline snapshot under the bounded recognition standard. This does not claim
full written-proof competence, construction competence, pixel-perfect visual
certification, live-source refresh, product integration, publication, or new
human approval. No other collaborator's files were edited.

Preserve Stage1, Stage2, and both new Stage3 outputs unchanged after their
raw-byte hashes are returned. STOP.
