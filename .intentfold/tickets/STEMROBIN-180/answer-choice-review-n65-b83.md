# B83 n65 Combined Independent Answer/Choice Review

**Semantic verdict: PASS.** STEMROBIN-180/180-3; reviewed 2026-11-18 in
`/Users/yong/.codex/worktrees/0f12/lemmadeck`. This is one combined independent
review, not candidate authoring, SOURCE/TEXT/figure re-review, finalization or
publication. No definite candidate deficiency was found.

## Independence and Snapshot Binding

This separate, non-author review chat first read the current canonical modern
n65 lesson/exercises and seed, solved all nine written tasks and froze
`tmp/b83-n65-final-review/source-blind-freeze.md`. Only then it projected each
draft question's **id/view**, solved every visible option and froze complete
correct sets in `tmp/b83-n65-final-review/choice-blind-freeze.md`. Full draft
keys/rationales/intent and the current canonical answer keys were first exposed
after both freezes. Candidate references to parent/frozen author solutions were
not opened or accepted as independent evidence.

| Snapshot | SHA-256 |
| --- | --- |
| Seed, canonical JSON | `0417d9eb40bb0e727181f9b265ab07ebd356e25edc578e1e43b95cc6dd127e61` |
| Draft, canonical JSON | `8def48c7518499a74d67ee3454582877b17de1f5374bcf6acab6dcf3464496e8` |
| Seed, bytes | `f79af6c1d14ea2ca8a0173859e89cf6c13238651cfe16981fd4cb6097235fc2a` |
| Draft, bytes at view and full read | `bca8e9239ee6b45c06b7dedcf1743295db21afe3b2fdf74c0351f36bf2137e4d` |
| Canonical lesson, bytes | `15918be1a358c46b5025923e8307ecef826dda5da1d67f8060c03d47ef555aa2` |
| Canonical exercises, bytes | `e262116faf3a0139312c850f8500866e2e7b607e51a6d4891f235511f2653193` |
| Canonical answer keys, bytes | `3ef62c21eb6293ab580f726d47cf972edbbe0163adb6276bb85188ae83d15ecd` |
| Source blind freeze, bytes | `e0f76a10878d6672bbe5f9855d31820d2dec407349df192acfb60abd6abd3ee0` |
| Choice blind freeze, bytes | `7296ad57034e583cdd0b7c0ebb6e1585ce0dc4e3a8dab149256867187241ad90` |
| Sole inherited n47 constants text p0192, bytes | `ebe6c195a056f3a2dc85a6f8bed1820f37df493808984ee9866e9564fcbb8577` |
| Standard choice review, bytes | `593ea9d65789df65d9909dd8e13243fcdc1762a3f1e172987862926357e53a83` |

Canonical JSON digests use the choice contract, not file-byte hashes. The
standard review at `tmp/b83-n65-choice/review.json` binds the exact seed and
draft digests and contains eight source reviews, five distinct fidelity /
redundancy / leakage / mathematics records, and all 21 option checks.

## Answer Gate 2 Judgment

Nine canonical keys exactly cover exercises 1-9. All nine declare `derived`.
Exercise 6 alone is `auto`, with two parts: final energy `numeric` expected
`180` in joules, and final speed `expression` expected `2\sqrt{30}` in m/s.
The other eight are `ungraded`, each with a complete display answer and no
forced natural-language grading. Candidate status remains `draft`; no
finalize/input-runtime/publication claim is made.

| Original | Independent result and candidate comparison |
| --- | --- |
| 1 | Resultant work, equivalently summed work of all forces, equals final minus initial energy. Candidate formula and qualification agree. |
| 2 | Motion-associated scalar energy `mv^2/2`, joules, and work-from-rest interpretation. Candidate includes all three. |
| 3 | Positive total work increases energy; a single constituent force is insufficient. Candidate explicitly states the same contextual reading and caveat. |
| 4 | Negative total work decreases energy. Candidate retains the resultant qualification, rather than universalizing one force's work. |
| 5 | Direction change alone is insufficient; constant speed leaves energy unchanged, changed speed changes its square. Candidate includes both cases and a circular example. |
| 6 | `120+60=180 J`; final speed `sqrt(120)=2sqrt(30) m/s`. Both stages and both final quantities appear. Display and notes honestly identify aligned forces as the one-dimensional interpretation, NOT an explicit original datum. Numeric plus expression grading is suitable under that disclosed contextual interpretation. An arbitrary-angle version would be underdetermined. |
| 7 | `10^6 kg`, `30 m/s`, signed stopping work `-4.5*10^8 J`, magnitude `4.5*10^8 J`. Candidate cleanly distinguishes both meanings. |
| 8 | Complete circular-orbit model gives `E_k=mg0R^2/[2(R+h)]`; with inherited constants, `4.01408*10^10 J`, appropriately displayed as approximately `4.0*10^10 J`. Candidate model, constants and rounding agree; details below. |
| 9 | Resultant `2E_k/r=40 N`, always inward and perpendicular to instantaneous velocity; work zero on any arc. Candidate answers all three, not only a full revolution. |

**Answer 8 local-givens gap, not a hidden correction:** current n65 supplies
only `m=1300 kg` and `h=100 km`, no speed or Earth constants. Only the expressly
authorized `ssot-resources/soviet10year-textbooks/artifacts/8p/pages/0192/page.md`
was read for inherited n47 `g0=9.8 m/s^2`, `R=6.4*10^6 m` and its near-Earth
model. No original page image, SOURCE audit or other raw page was reviewed.

For spherical-Earth gravity and negligible non-gravitational forces,
`r=R+h=6.5*10^6 m`, `GM=g0R^2`, and `GMm/r^2=mv^2/r`.
Therefore `v=7858.43985299 m/s` and `E_k=4.01408*10^10 J`. This is exact
within that model and the supplied approximate constants, not physically exact
orbital data. Ignoring height gives the near-Earth estimate
`mg0R/2=4.0768*10^10 J`; additionally rounding speed first to `8 km/s` gives
`4.16*10^10 J`. The candidate appropriately labels the latter as a rough
estimate, not a competing exact value or new source data. Using surface g at
altitude with `r` or using `h` as the geocentric radius would be wrong; the
candidate does neither. Its notes disclose the missing local constants, and
`ungraded` avoids inventing a numeric tolerance or assuming local givens.

## Choice Semantic Judgment

Actual counts: **eight selected seeds** (1-7, 9), **five native whole-response
units**, **four single / one multiple**, **21 options**, **seven true /
fourteen false**. All source, concept, question, option and new-figure
references used in this review are zero images. No renderer, image or browser
check was warranted or run.

| Unit | Blind complete set | Every false-option procedure verified |
| --- | --- | --- |
| `n65-energy-and-work` | `{c}` | a omits 1/2; b drops initial energy despite `v1>0`; d squares the difference instead of subtracting squares. |
| `n65-work-sign-and-direction` | `{a,b,e}` | c mistakes negative change for negative final energy; d mistakes vector change for magnitude change. |
| `n65-successive-force-stages` | `{b}` | a resets energy at stage 2, yielding 60 J and `2sqrt(10)`; c uses 40 N throughout 6 m, yielding 240 J and `4sqrt(10)`; d stops after stage 1, yielding 120 J and `4sqrt(5)`. |
| `n65-stopping-train-work` | `{d}` | a reverses work sign; b omits tonnes-to-kg factor 1000; c retains 108 as m/s, yielding `5.832*10^9 J`. |
| `n65-circular-force-and-work` | `{b}` | a omits factor 2, giving 20 N; c reverses inward resultant; d uses force magnitude times arc length without directional projection, giving false positive work for `s>0`. |

All 21 truth labels and all 14 claimed misconception procedures agree with
the blind results; each wrong procedure really generates its displayed false
option. Units and complete pairs/tuples are coherent. No candidate was repaired.

Sources 1/2 are legitimately merged into the energy-state/work-change
relationship, and 3/4/5 into determinate work-sign consequences versus
direction-only insufficiency. The remaining three units each preserve a
different application: accumulated two-stage work, signed stopping work, and
centripetal force with zero work. Conceptual overlap is not duplicate
answer-slot questioning. d/e in the multiple unit allow ordinary logical
elimination but do not leak a key or settle all other conditionals. Shared
theorem knowledge across units is intended; no other unit gives the
application's numerical answer or full correct tuple.

**Explicit capacity losses:** choice recognition does not prove independent
verbal definition/theorem production, a work-from-rest explanation, a
direction-change counterexample, written unit conversions, intermediate
stage calculations, square-root speed derivation, or a written centripetal /
perpendicularity proof. These losses are substantively recorded in the draft
intent and coverage. Both final quantities in source 6 and all three in
source 9 remain in complete response units; recognition may establish a
correct pair/tuple without proving separate production of each component.
These disclosed production-to-recognition losses do not destroy the
mathematical distinctions still assessed.

**Source 8 deliberately deferred for choice:** it is NOT in the seed and NOT
converted. Its numerical orbital calculation cannot be locally determined
without inherited constants/model; answer review uses the narrowly permitted
inheritance, but no choice input permission or source rewrite is inferred.
The schema correctly has coverage only for selected seeds, so this whole-lesson
omission is recorded here rather than adding an invalid unseeded coverage row.

## Scoped Validation

Semantic judgment was complete before execution. Run exactly once from the
explicit assigned cwd:

```bash
python3 .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .intentfold/tickets/STEMROBIN-180/tmp/b83-n65-choice/seed.json --draft .intentfold/tickets/STEMROBIN-180/tmp/b83-n65-choice/draft.json --review .intentfold/tickets/STEMROBIN-180/tmp/b83-n65-choice/review.json
```

Actual execution: **one run, exit 0**, after the semantic PASS was written.
The exact output was:

```text
mechanical checks passed; declared semantic review: pass (not automatically proved)
```

The receipt is `tmp/b83-n65-final-review/validation-receipt.json`. This check
settles structural/input freshness, snapshot binding and declared agreement
only; it does not supply semantic proof. No project-wide checks, repeat pass,
answer finalize, dependency, application, renderer, database, service, model,
publish, Git, ticket backend, other-chat or descendant action was performed.
Writes were confined to the two blind freezes and receipt under the owned final
review scratch directory, the authorized choice `review.json`, and this durable
combined report. No candidate content or other contributor's output was changed.
