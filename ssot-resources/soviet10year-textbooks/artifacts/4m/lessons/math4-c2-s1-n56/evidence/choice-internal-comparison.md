# N56 B: disclosed-draft comparison

Reviewer: independent_agent, Raman ID01a2062b-b332-7983-a01c-8d801baab558. Date: 2026-11-23.

## Snapshot and order

The old `choice-blind-review.md` is unchanged, SHA-256 `accdfc6aab242cdb77d33e011635e29d9d1ce65cc63a3b025bf01e546a8446bc`. Its source-only checkpoint preceded views, and its full 46-option evidence preceded the first draft disclosure. B reused those frozen solutions; it did not solve the source again or consult answer keys.

Python stdlib `json.dumps(value, sort_keys=True, ensure_ascii=True, separators=(",", ":"))` plus `hashlib.sha256` produced:

- Seed canonical SHA: `255c29ec1f56bba854eb3bdac35d69874980207bdb69c3efebdfe9a3ed2ece81`.
- Draft canonical SHA: `70fd24b27a53849683e0fda9211731e0cec933b832ac37a87032e53b4e8619e4`.
- Draft raw SHA: `f6015df762addab4af7f77367289ae23cc9c9026cfe286e6e430de5d37fedc74`.
- Frozen views canonical SHA: `cdc57e29797f7095c2ea7eccad8867e50d8c61930346f2159cb412e1e1171a1f`; the draft's full `id/view` projection equals it.

## Findings

**B verdict: PASS for this exact offline choice draft. No affected REVISE unit found.** All eleven author solutions and exact keys agree with the frozen source/views. All 46 rationales were compared individually, including every false option's stated generation procedure, rather than accepting matching keys as proof.

In particular, q-940's decimal deletion-and-padding generates 6540/1270, decimal reversal generates 4560/7021, and integer reversal generates 73/054; q-942's two distinct missed sign changes generate 168/2712 in the appropriate root positions; q-939's supplement-of-120 error generates the final 1/3; q-944's quarter-of-already-used-20 error generates 25 minutes; q-945's explicitly doubled application of the minus generates -803-803=-1606. Correct alternatives have valid derivations and null misconceptions; every incorrect alternative is false and has a concrete generating procedure.

Declared fields, schemas, types, unique local IDs, source/concept subsets, option references, exact keys, one rationale per option, one reciprocal coverage row per source and required figure-observation multiplicity match the contract. Only block 6 is selected; every cited concept index belongs to it. No new figure is registered, so `new_figure_reviews=[]` is correct. The seed retains its admitted tool provenance; B did not refresh trace files or pretend to have rerun the preparer/validator.

All source mathematical tasks remain covered. The draft's repeated limitations/omitted_tasks statement explicitly admits independent written-solution and derivation loss. It is broad but not false, and there is no missing substantive source request. The finer limits already frozen in the blind review remain binding review evidence: q-937 may be selected from entries 1/3, q-939 from the last entry alone, q-940 from two cells, and q-943 from approximate perpendicular appearance. None is promoted to proof of separately computing every subpart or producing a construction/table. Unit reasons are substantive shared rules or complete-expression relationships, not merely printed item counts.

The two `figure_checks` reuse this reviewer's actual full 640px PNG observations and the existing durable/scratch SVG SHA/cmp binding; no image was reopened. The longer whole AMK arc and the smaller-radius whole AMK arc are compatible descriptions, not contradictory geometry. `q-*` IDs are contract-internal wrappers; only `view` is learner-facing. No source numbers occur inside view text, and no APP/payload integration was checked.

Formal evidence: `.tmp/stemrobin-187/n56/choices/review.json`, with all `s10y-choice-review-v1` fields and the independent reviewer identity. No renderer/checker/producer was rerun. Parent formal parsing is separate from this semantic/contract inspection.

**B actual image delta: 0; cumulative actual images remain 2/24.** This approves neither wholeLesson, answer-transfer content, display, integration nor publication. B was saved before C's first answer-key/lesson-source disclosure.
