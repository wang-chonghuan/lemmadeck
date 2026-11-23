# Independent WHOLETEXT / SCIENCE review: 8p n25

Date: 2026-11-23. Ticket: STEMROBIN-180.
Exact workdir: /Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180.
Target: phy8-c2-s1-n25, modern-us-neutral, first current modern draft.
Sole in-flight independent semantic reviewer; evidence-only assignment.

## Verdict

**Overall: REVISE. WHOLETEXT: REVISE for historical time attribution.
SCIENCE: REVISE for the unrestricted interaction-independence statement.**
Completeness, formula/literal fidelity, source-data bindings and paragraph
anchors PASS. There is no missing-input or image-dependent HOLD.

Two necessary prose corrections are identified below. No correction was made.
The retained SOURCE PASS is reused, not reopened or replaced. The present
verdict is not SOURCE, figure, display, answer or choice approval.

## Necessary Findings

### N25-MT-01: Invariant mass is not unconditional constancy through interactions

Status: **REVISE, SCIENCE, P2**.
Affected source refs: **p0118#3 + p0118#5**.
Affected candidate: `lesson.template.json`, `prose[11].text`, line 204
of the immutable snapshot. Tool-derived paragraph: zero-based 21.

The retained opening says:

> 这种固有性质既与*物体*怎样相互作用无关，也与*物体*如何运动无关.
> 不管*物体*怎样，是处于什么地方，还是在运动，它的质量都是一样的.

The addition correctly says that changing speed alone does not change the
same body's rest/invariant mass. It does not, however, qualify the separate
claim about *any interaction*. Calling the mass "不变质量" does not repair
that claim: invariance under a change of inertial reference frame is different
from remaining constant when an interaction changes the body's internal
state or energy. The draft itself recognizes connection-energy effects in
p0118#6 + p0119#1, so its unrestricted preceding assertion is misleading.

Required author action: explicitly restrict this comparison to the same body
with unchanged composition/internal state, and distinguish changing its bulk
motion from changing its internal state. A brief source-adjacent clarification
is enough; an advanced relativity derivation is not required. Do not leave
"怎样相互作用无关" as an unrestricted statement newly endorsed as an
invariant-mass definition.

This is a prose-scope correction, not a printing erratum. Keep `source_text`
and all printed formulas unchanged. Because this paragraph is also a section
anchor, update **`section_breaks[2].after`** from the actual revised tool
boundary. No independent change to p0119#3's preserved formula is required.

### N25-MT-02: "当时在苏联" attaches the copy to the wrong historical time

Status: **REVISE, WHOLETEXT historical fidelity, P2**.
Affected source ref: **p0118#1**.
Affected candidate: `lesson.template.json`, `prose[9].text`, line 165
of the immutable snapshot. Tool-derived paragraphs: zero-based 15-17;
the ambiguous sentence is in paragraph 16.

The first paragraph explicitly anchors the prototype history in **1889**.
The following paragraph begins:

> 当时在苏联，与一些其他国家一样，有这个标准器的复制品.

The nearest explicit antecedent of "当时" is 1889. Raw p0118#1 instead says
"在苏联，象一些其他国家一样，有这个标准器的复制品", as the old
textbook's account of national copies, without asserting that Soviet
possession belongs to 1889. Source-bound `historical_entities` correctly
retains the national identity, but does not fix this new temporal attribution.

Required author action: identify the copy sentence as a statement from the
old textbook's era, for example **"旧教材还记载，在苏联……"**, rather than
linking it to the preceding 1889 event. Preserve 苏联, the original prototype
history, 1889 and the original quantities. No invented replacement country
or date is needed. The caller supplied this possible risk during review;
comparison of the unchanged raw and frozen candidate independently confirms
that explicit source-era wording is necessary.

The currently stored section break before this historical passage anchors
its first paragraph, not the copy sentence. Only update an anchor if the
actual affected final paragraph text changes.

## Whole-Object Coverage

All 18 raw prose-array objects occur once, in the same order, with the same
kinds and source refs: 16 text objects, one figure object and one caption.
Each candidate `source_text` equals the corresponding raw text exactly.
Coverage is semantic, not merely a count.

| Raw object / candidate index | Exact source refs | Substantive finding |
| --- | --- | --- |
| 1 / `prose[0]` | p0116#3 | PASS: inertia and acceleration introduced; no lost assertion. |
| 2 / `prose[1]` | p0116#4 | PASS: volume analogy, mass as the measure of inertia and prior-course connection retained. |
| 3 / `prose[2]` | p0116#5 | PASS: smaller acceleration magnitude corresponds to larger mass; inverse relation has the correct order and absolute-value bars. |
| 4 / `prose[3]` | p0116#6 | PASS: verbal inverse-mass statement agrees with the formula; adjacent bold spans consolidated without changing its meaning. |
| 5 / `prose[4]` | p0116#7 | PASS: aluminium/steel example preserves acceleration ratio 3 and mass one third, not their reciprocals. |
| 6 / `prose[5]` | p0116#8 + p0117#1 | PASS: cross-page measurement explanation, selected standard, interaction, acceleration measurements and both equivalent formulas complete. |
| 7 / `prose[6]` | p0117#2 | PASS: variables identified; standard acceleration is the numerator, test-body acceleration the denominator; unit-standard numerical shorthand retains its mass-unit suffix. |
| 8 / `prose[7]` | p0117#3 | PASS: mass/inertia definition and standard-to-body acceleration ratio retained together. |
| 9 / `prose[8]` | p0117#4 | PASS: common-standard comparison and centrifuge consistency test retained under the ordinary two-body experiment model. |
| 10 / `prose[9]` | p0118#1 | REVISE only for N25-MT-02; prototype, BIPM/France, Soviet copy, water estimate, SI/CGS and gram conversion all present. |
| 11 / `prose[10]` | p0118#2 | PASS: impracticality of repeatedly accelerating a standard, weighing alternative and astronomical/atomic examples retained; unsupported universal "only possible method" appropriately softened. |
| 12 / `prose[11]` | p0118#3 + p0118#5 | REVISE for N25-MT-01; no missing source span, but the new invariant-mass explanation needs the unchanged-state restriction. |
| 13 / `prose[12]` | p0118#4 | PASS for text-level presence/binding only: empty-text `fig-79` object, label and location retained. No visual approval. |
| 14 / `prose[13]` | p0118#6 + p0119#1 | PASS: two joined aluminium cylinders versus steel, section 23 reference, ratio 3/2, doubling and additive conclusion complete; the appended low-speed/neglected-energy restriction prevents universal system-mass additivity. |
| 15 / `prose[14]` | p0118#7 | PASS for caption text/binding only: "图 79" retained. No figure approval. |
| 16 / `prose[15]` | p0119#2 | PASS: twice the aluminium explanation retained; everyday "物质的量" explicitly distinguished from SI amount of substance measured in moles. |
| 17 / `prose[16]` | p0119#3 | PASS: old velocity-dependent relativistic-mass terminology, rest mass, hypothetical old centrifuge description and exact relation retained with explicit historical framing. |
| 18 / `prose[17]` | p0119#4 | PASS in the stated low-speed teaching scope: light-speed approximation, historical speed example, approximate Earth orbital speed and precision caveat retained. |

## Scientific Clarity Already Satisfied

- p0116#5-#7, p0116#8 + p0117#1, p0117#2-#4: ratios are of
  acceleration **magnitudes**, not signed or vector quotients. Their inversions
  and standard/test assignments are consistent. The unit-standard shorthand
  is a numerical mass in the chosen unit, not an assertion that a bare ratio
  has mass dimensions.
- p0118#1: the prototype is explicitly historical; current SI is explicitly
  defined using the fixed Planck constant rather than the cylinder. The
  one-litre water value at 15 degrees is twice qualified as an approximation,
  not a kilogram definition. The gram conversion is unchanged. Only the
  copy sentence's time attribution fails.
- p0118#6 + p0119#1: the additive conclusion is expressly restricted to
  ordinary low-speed cylinders with connection-energy effects neglected,
  not all relativistic systems. No new universal additive-mass claim is made.
- p0119#2: the colloquial amount-of-material explanation is not confused
  with the SI base quantity amount of substance.
- p0119#3: the formula's `m` belongs to the explicitly named legacy
  relativistic-mass convention; `m_0` is the rest/invariant mass. The draft
  says motion alone does not increase the same body's rest mass and marks
  the centrifuge passage as the old textbook's hypothetical description,
  not a new high-speed laboratory procedure. The relation is correct in
  that convention and **is not a demonstrated printing error**.
- p0119#4: the 30000 km/s value is presented as the original example, not a
  precision-independent threshold. The Earth value 30 km/s is approximate.
  The final explicit precision caveat and low-speed scope govern the ordinary
  constant-mass approximation. Raw "超近于" survives exactly in `source_text`;
  modern "接近" is a prose modernization, not a mathematical erratum.
- Figure 79 remains the centrifuge/joined-cylinder experiment, not the
  historical kilogram cylinder. The supplied source-bound steel-left /
  two-aluminium-right, r1/r2 identity is not newly visually verified here.

These judgments reuse `modern-context-references.md`: BIPM's prototype and
kilogram pages and Okun's primary paper, already read on 2026-11-23. No concrete
uncovered factual research was required; no research was rerun.

## Exercise-Stem Scope

All seven exercise texts are unchanged, including emphasis, source numbering,
group "练习 18" / `g1`, source refs and numerical literals. Questions remain
about instantaneous velocity change, inertia, its quantitative measure,
mass/acceleration, measurement, units and the two-cart collision respectively.
Exercise 7 retains 50, 150 and 100 cm/s, common initial direction and common
final direction/speed. No stem is missing, reordered or turned into an answer.

Refs in order: **p0119#6; p0120#1; p0120#2; p0120#3; p0120#4;
p0120#5; p0120#6**. PASS is for faithful, coherent exercise wording only.
No solution, ratio result, answer key, distractor or choice key was generated
or approved.

## Tool Evidence

Read-only comparisons passed for both template `source.data` objects against
current raw JSON, both embedded raw SHA-256 values, every `source_text`,
all ordered source refs, object metadata, dollar-delimited formula contents
and ordered numeric literals. **Registered errata: 0; numeric_changes: 0.**

The existing `prose_flow.mjs` was run against the immutable lesson snapshot.
It reports **30 final paragraphs**. The same `htmlfrag.js` helpers resolve
all four stored exact adjacent anchors to after-indices **6, 15, 21, 25**
(zero-based); pairs are **5/6, 14/15, 20/21, 24/25**. They divide inertia/
inverse ratios, standard comparison, unit history/weighing, intrinsic mass/
additivity, and legacy relativistic terminology. No block-based counting,
assembly, finalization or rendering was used.

## Snapshot And Binding

One author candidate snapshot is retained in **`author-snapshot-01/`**.
Its two files are byte-identical copies of the current editable templates,
mode **0444**. They are evidence, not editable edition templates. No second
author snapshot or duplicate source/review package was created.

SHA-256 values:

| Bound file, relative to this raw lesson root unless noted | SHA-256 |
| --- | --- |
| `modern-text-review/author-snapshot-01/lesson.template.json` | `41ad50b91bbcba4a22a429353625bd6328de4a194b8ef6a5181a5cb798c19567` |
| `modern-text-review/author-snapshot-01/exercises.template.json` | `e51f53b0031870680c440ffb9c91afd1d89b3af6edbc811da78c53d11abb712f` |
| `lesson.json` | `258542d97b9373647d0d65b4930f8040164f4f1b9b03f746ea36055339eca671` |
| `exercises.json` | `d50efedb3130c4b43b8851750da3bc6e502794b4f8f405336d259416a540ada4` |
| `source-review/final-affected-source-review-8p-n25.md` | `cb2381c90d6c1bcb6cd9a3c551c3f827a3d90c655e16a5e74837103308913fc5` |
| `source-review/final-affected-source-bindings.json` | `8b4f4136518e139e285b423f1f865cb01af288a33e0208c107f7bee471786b4f` |
| `modern-context-references.md` | `0a8b36575ecb81a2d91283160c05e039c8d002d229e13f9a0f98acc3f43fed8b` |

Editable originals at capture:
`.tmp/ld-s10y-lesson/adapt/8p/modern-us-neutral/lessons/phy8-c2-s1-n25/lesson.template.json`
and `exercises.template.json`, with the same respective snapshot hashes.
The accompanying **`modern-text-bindings.json`** records paths/hashes, reused
SOURCE PASS, review findings and scope. This is not a full-package hash.

## Retention And Limits

All writes are within this lesson's `modern-text-review/`: this report, its
binding and the single two-file author snapshot. All existing SOURCE failures,
snapshots, author files, installer files and other dirty/staged work are
untouched. No prior approval or historical FIRST authorship is inferred.

**Actual images used: 0.** Paid/model-generation calls: 0. Browser/CUA: 0.
Source pages/crops/PDF images reopened: 0. Figure/template visual inspections: 0.
No author edits, finalize/assemble/render, figure approval, answer/choice keys,
DB/Git/install, new agent/chat/tree or peer messages.

This first failed semantic candidate remains immutable. Later author changes
must not overwrite it or silently turn this report into PASS. Only the affected
prose and any actually changed tool anchors need follow-up semantic review;
unchanged passed findings remain reusable. The parent owns the separate figure
and answer phases. No text approval is granted to a future candidate.
