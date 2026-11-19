# B58 n38 Independent FULLTEXT REVIEWONLY FIRST

## Findings First

**FIRST overall: HOLD for an inherited teaching qualification in P3.**
**Bounded full SOURCE binding: PASS. Authorized punctuation/space adaptation: PASS.**
These are separate decisions. Neither PASS clears an existing source HOLD/FAIL,
proves original pixels anew, or authorizes publication.

1. **F1 [P2, inherited teaching/measurement ambiguity]: P3, `p0162#3`,
   "灵敏度最高的天平可以测量的最小质量是百万分之几克。"**
   The candidate faithfully preserves the source, but states an unqualified
   minimum measurable mass for the most sensitive balances. A few millionths
   of a gram means a few micrograms, not milligrams, and is not by itself a
   reliable minimum sample-mass specification. No balance, uncertainty
   tolerance, conditions, or historical scope is specified. Instrument
   readability and minimum sample weight are distinct; primary manufacturer
   text explicitly relates reliable minimum sample weight to a specified
   relative measurement uncertainty (S2). Therefore modern teaching approval
   of this sentence remains HOLD.
   This is **not** a demonstrated mistranscription, a proved wrong historical
   number, or a claim that 0.5 microgram readability is a 0.5 microgram minimum
   reliable sample mass. No replacement text, numeric change, or erratum was
   authored. The source and candidate remain unchanged.

No exact source-binding defect, unauthorized wording change, formula change,
number/unit change, missing target paragraph, target exercise, or target
figure was found in the FIRST comparison.

## Scope And Freeze

Same existing STEMROBIN-180 invocation, 2026-11-17. Independent sidecar review
of `phy8-c2-s2-n38`, 用悬挂法测物体的质量. Parent-owned staging was only read.
Read router, `.intentfold/readme.md`, project configuration, all four charter
boundaries, and the lesson skill's source/edition rules. No IntentFold
capability, freshness/setup, or backend access was invoked.

Before reading any target raw/candidate text or supplied source-report
contents, froze exact six target files plus three reports at
`2026-11-17T15:49:58.431Z` to `15:49:58.437Z`. Subsequent authoritative
text-page/TOC binding inputs were frozen before reading them at
`2026-11-17T15:51:18.268Z` to `15:51:18.273Z`.

Reviewer-owned evidence root:

```text
/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-suspended-mass-text-review/
```

| FIRST input, relative to the workspace | Bytes | SHA-256 |
| --- | ---: | --- |
| ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/phy8-c2-s2-n38/lesson.json | 2069 | `9b5ae4ef81708033ccc2de278b6d50fb8203552ac8e07956da1daa93f4cd2a7a` |
| ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/phy8-c2-s2-n38/lesson.md | 1270 | `2f9c032aa76306ff7a060a99eff20fdd9833a8706e406130a217e1b1fd81c92a` |
| ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/phy8-c2-s2-n38/exercises.json | 66 | `b1f80f06db6125aaceeeebd50f29f219a840d6fa29e3bb6dfea3c91762e665f5` |
| .tmp/ld-s10y-lesson/b58-suspended-mass/work/adapt/8p/modern-us-neutral/lessons/phy8-c2-s2-n38/lesson.template.json | 6271 | `3e8d145ca3d19c8efce04200ee24ef0c61e809239500bc68326cd0718c64e03d` |
| .tmp/ld-s10y-lesson/b58-suspended-mass/work/adapt/8p/modern-us-neutral/lessons/phy8-c2-s2-n38/exercises.template.json | 419 | `13cd8eaa331cd45b2c1fa9ae08a166d38537fed567b16c6cceafcd1ed659777e` |
| .tmp/ld-s10y-lesson/b58-suspended-mass/work/adapt/8p/modern-us-neutral/lessons/phy8-c2-s2-n38/figures.template.json | 153 | `d7d6fd80b75e6b9b6278725dd2c229bc92eb6f20217dccd22db9cbd88230103e` |
| .intentfold/tickets/STEMROBIN-180/source-review-8p161-b58.md | 11389 | `9dabe79e97efcd04fe285c82cb888812ce0e87c6d84f7d0ef114c5a298d7ce5a` |
| .intentfold/tickets/STEMROBIN-180/source-review-8p161-comma-space-affected-b58.md | 7568 | `d027663ff08cd893c8441af714aadba4af0da6df627235341732a69cd4323a78` |
| .intentfold/tickets/STEMROBIN-180/source-review-8p162163-b58.md | 11973 | `a6f6b3d2205fe26512d484d12379510ffd102338fccc20210ee69228e96b4cb7` |

`FIRST-manifest.json` SHA-256:
`a8f89e174c549bd783e361ed577f5067c82657a564986bd065f17d4867ef0334`.
`binding-manifest.FIRST.json` SHA-256:
`16ee477c6c29c9f33157b2cdacc9881ccb1f555268373f69a0430a98441c2a85`.
Exact byte copies retain original paths beneath `FIRST-inputs/` and
`binding-inputs/`; no mutable input was edited.

## Full Three-Paragraph Coverage

Read **all three full raw paragraphs**, full raw Markdown, full candidate
JSON including embedded `source.data` and every `source_text`, and both empty
exercise/figure templates. Not a headings-only, excerpt-only, or diff-only
review. Full source and candidate strings and per-paragraph hashes are also
retained in `text-binding-comparison.FIRST.json`.

| Paragraph | Entire semantic coverage | SOURCE / adaptation | Physics / teaching |
| --- | --- | --- | --- |
| P1, `p0161#11` + `p0162#1`, 6 + 7 source rows, 7 sentences | Prior acceleration-ratio mass measurement; inconvenience; alternative method; suspension name; gravity proportional to mass; stationary scale/object condition and weight magnitude; measured spring-balance weight divided by local free-fall acceleration | Exact full row concatenation equals raw; candidate `source_text` equals raw; only 7 ASCII sentence periods become Chinese periods and 5 following ASCII spaces disappear | Newtonian idealized method consistent; local-g and stationary conditions explicitly retained. Weight is not silently made identical to gravity as a vector or as a force on the same body. Limits below. |
| P2, `p0162#2`, 5 source rows, 5 sentences | Balance convenience; comparison of object/standard weights; balance equilibrium; equal weights imply equal masses; standard mass labels summed | Exact full binding; only 5 periods and 4 following spaces change. Exact source wording `砝码上部标明` retained, not guessed into `上都`. | Correct for the ordinary equal-arm, zeroed balance comparing total standard mass with the object at the same local g under the elementary approximation. No claim for an arbitrary unequal-arm lever or remote locations. |
| P3, `p0162#3`, 2 source rows, 2 sentences | Sensitivity statement and complete millionths-of-a-gram minimum-mass claim | Exact full binding; only 2 periods and 1 following space change. No unit/numerical substitution. | F1 teaching HOLD; faithful source preservation does not settle present measurement meaning. |

Total: **3/3 paragraphs, 20/20 target source body rows, 14/14 sentences**.
Exactly 14 U+002E sentence-period replacements and deletion of their 10
following U+0020 spaces; the separate space before the weight formula
remains. All other prose characters and all metadata inherited from raw are
unchanged. `changes` is exactly `["layout"]` per paragraph;
`numeric_changes` and `historical_entities` are empty throughout.

## Formula, Number, Unit, And Condition Inventory

All three formulas occur in P1, in this order, exactly unchanged:

```latex
|\vec{F}|=m|\vec{g}|
|\vec{P}|=|\vec{F}|
m=\frac{|\vec{P}|}{|\vec{g}|}
```

No sign, exponent, denominator, magnitude bar, vector arrow, or letter was
changed. No Chinese sentence punctuation is placed inside these formulas.
The prose treats the force magnitudes as equal in the stated stationary
measurement, not the two different forces as identical vectors.

Dimensional interpretation for the review, not added lesson text:
force in N divided by local acceleration in m/s^2 gives kg. No numerical g
value is supplied, changed, rounded, or assumed to be identical everywhere.
NIST's weighing-mode description explicitly uses local g and equilibrium
(S1). A moving/accelerating suspension or additional significant forces
would need a different analysis; the candidate does not omit its explicit
stationary condition.

The first sentence gives no explicit acceleration-ratio formula; none was
invented, reversed, or altered. It relies on the prior Newtonian
mutual-interaction lesson and a known standard mass. TOC confirms that
`第四章` is the earlier printed chapter `第四章　运动定律`, containing
the interaction, mass, and Newton-law units. It is **not** an erroneous
reference inferred from the UI's `c2` hierarchy. Prior-unit prose was not
read or certified.

For P2, cancellation of the common local g supports equal masses when the
object weight equals the **total** standard weight. Adding the marked mass
values requires compatible units. No marked mass values, worked example,
calibration data, or balance diagram exists in this target and none was
added. Air buoyancy, unequal-arm calibration, tare, and metrological
uncertainty are outside the elementary idealization; precision measurement
claims cannot be derived from its simplified equality alone. S1 also
describes why air buoyancy matters at high precision.

For P3, `百万分之几克` is a few times 10^-6 g, equivalently a few times
10^-9 kg. It is not a full capacity range or a specified reliable weighing
range. No upper capacity is given in the source. S2 supports the need for
an uncertainty criterion; S3's readable body separately describes 6.1 g
capacity and 0.5 microgram readability, **not** a verified minimum reliable
sample mass. These observations do not prove a global best instrument or
the source's historical numerical limit.

## Full SOURCE Binding, Separately

Bound exact SSOT source-page text to reviewed staging text, then to the
assembled raw and candidate; did not use formula plausibility as binding
proof.

| Text-page identity | Exact SHA-256 |
| --- | --- |
| SSOT physical161 page.json and suspended-mass staging page.json | `13d74b4ac24cfde20ffc3ebe20cf7a7acd9f80deb9b12dba940b7dfa094c9cf6` |
| SSOT physical161 page.md and suspended-mass staging page.md | `d240021fc4e2f22f3e275fc7686a0fe3a584d3bad6c54ba6ffa533e8afcba53a` |
| SSOT physical162 page.json, suspended-mass staging copy, and approved earth-mass copy | `18c39581dccb7458123195a5b7fc615d1a06c0f87c43bf41eb30b394e7c7b4e1` |
| SSOT physical162 page.md, suspended-mass staging copy, and approved earth-mass copy | `3cf497b19f496d86f2ffaf02166ac5894518c493c0436ef50dbc66f940037b80` |
| Authoritative 8p zh TOC | `12799b8b9e414dc4b8ca9fc246cd146a18886a7751aca91aaf9c9618d434baa8` |

These match the supplied affected161 and exact approved162 report bindings.
Both page metadata records name the same source PDF hash
`4ec6a3d5fafe2c5c861a5053cf8cf047a3a6bd7988a4de799859d6a4fef8cc46`
and source profile hash
`dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849`.
Those are **text-metadata/report bindings**, not a new PDF/pixel inspection.

Real n38 heading is `p0161#10`. Its `#11` paragraph is open at the final
colon and pairs with `p0162#1` marked cont, which closes. P2 and P3 are
closed, separate source paragraphs. Immediately after `p0162#3` is the
real n39 heading `p0162#4`, excluded from the target. Physical161/162 map to
printed149/150; title, printed number38, start page, and TOC identity match.
Raw chapter/section null metadata is retained rather than guessed.

`fig-109`, its textual reference, and caption occur before n38's real
heading (`p0161#2/#3/#5`), in preceding n37 context. They are **not target
assets**. All target figure inventories and raw/modern exercise inventories
are empty, and `exercise_count` remains 0. No missing-target-figure claim,
source109 migration, modern figure, or exercise was introduced.

Existing source history remains distinct and unchanged:

- physical161 FIRST **HOLD**: missing comma at `#2` row2 and missing
  sentence-boundary space at `#8` row1. Both precede this target.
- physical161 affected-only **LIMITED PASS**: those two substitutions only;
  original HOLD preserved; supplied repair budget already 1/1, remaining0.
  This sidecar performs zero repairs and does not reset that budget.
- physical162/163 FIRST **FAIL**: missing comma at `p0163#5`, partial n40.
  The same report explicitly passed the complete `p0162#1/#2/#3` wording
  locally, while withholding unseen upstream pairing. Current exact
  text binding supplies that pairing without redoing pixel/source approval.
  Its n39 bounded PASS and n40 FAIL stay separate; physical163 was not read.
- Previously reported auxiliary manifest-selector exit1 and source-review
  interpreter-launch failures remain historical limitations recorded in
  the frozen reports; no receipt was rerun or relabeled.

## Public Primary Text Evidence And Failures

Search discovery preceded text-page reads. Only `cloak-fetch` read public
pages; no PDF download, form submission, new image, screenshot, or visual
inspection. Early discovery queries yielded no usable tool output; later
exact NIST and manufacturer discovery supplied the URLs. No search snippet
was used in place of the captured page bodies.

| Primary observation | HTTP / process | Saved stdout SHA-256 |
| --- | --- | --- |
| FIRST attempted NIST measuring-mass address | **404 / exit0**, page-not-found only; no scientific evidence | `aa0ffab8338ee6b4547bd18d875a173d59baa43d95729d5b6b8bf79ae619b409` |
| S1 NIST, Kilogram: The Kibble Balance | 200 / exit0; body read | `48d2c1212437dcf0fd46474f33bc8a12440e737748486a495dd6135430aec0f0` |
| S3 METTLER TOLEDO, Balance XPR6UD5 | **406 / exit0**; readable overview body only, no complete specification table | `422c685c0b91b3a19e0e63ebcd17efcedd899d2bcc531da32f6f87f266a5baeb` |
| S2 Sartorius, Minimum Sample Weights resource overview | 200 / exit0; overview read, not gated white-paper contents | `859eed17a65b69d64e308939912fcb9c0f2bae15934cdb1ef35bb488a3128d51` |

Exact URLs, also retained in `.call.json` receipts:

```text
Failed FIRST: https://www.nist.gov/si-redefinition/kilogram-measuring-mass
S1: https://www.nist.gov/si-redefinition/kilogram/kilogram-kibble-balance
S2: https://www.sartorius.com/en/products/weighing/lab-weighing-resources/minimum-sample-weights-according-to-usp-41-oiml-r76-and-euramet-cg-18
S3: https://www.mt.com/us/en/home/products/Laboratory_Weighing_Solutions/microbalances/XPR6UD5.html
```

S1 has mixed historical/future language despite its displayed update date;
used only for stable local-g/equilibrium/buoyancy principles, not a latest
technology ranking. S2's overview names a September2026 update and explains
uncertainty-dependent minimum sample weights; no gated document was read.
S3's non-200 status is not hidden or treated as a clean full-page PASS.
All four initial stdout/stderr/call records remain separate and immutable;
exit0 is never substituted for HTTP success.

## FIRST Check And Text-Only Stop

Single reviewer-owned static comparison ran once: **122/122 assertions
PASS**, zero static binding/layout failures. It checks exact manifests,
source reconstruction, Markdown/JSON target rows and metadata, embedded
snapshots and source hashes, three formulas, ordered refs, allowed
punctuation changes, and zero target exercises/figures. It is **not** a
source gate, pipeline acceptance, or proof of teaching correctness.

`text-binding-comparison.FIRST.json` SHA-256:
`6b2d7f60bb9a3203bc4d049e6044f8eb02d8b856a3ff552d630f26b568d2c3ad`.
Final exact report copy, report SHA-256, evidence hashes, preserved failures,
and current/frozen input-identity results are sealed in
`report.FIRST.md` and `review-seal.FIRST.json` under the evidence root.

No images were opened, decoded for inspection, displayed, or reviewed.
Original scan correctness is inherited only through the exact supplied
source-review reports. No previous choices, answers, interactions, or
answer-production artifacts were read. No input repair, source gate,
prepare/finalize/vectorize, adapt, assemble, promotion, publisher, DB, Git,
app server, render, DISPLAY, setup, freshness, or backend operation.
The draft's eventual deterministic sentence splitting and learner rendering
were not run; no final-layout or learner-view PASS is claimed.

Only this NEW report and NEW files under the sole authorized evidence
directory were written. Existing dirty files, original FIRST findings,
source reports, receipts, and HOLDs were preserved. **Text-only STOP** with
bounded SOURCE/layout PASS and inherited P3 teaching HOLD.
