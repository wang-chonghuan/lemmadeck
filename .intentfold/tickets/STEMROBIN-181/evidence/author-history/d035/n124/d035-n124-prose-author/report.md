# D035 n124 Prose Author Freeze

Scope: STEMROBIN-181, 9p, phy9-c2-s6-n124, magnetic flux only. This is provisional bilingual author text for independent SCI and ZHEN review. It is not a publishable payload, SOURCE approval, RAW approval, figure approval, display approval or completed card.

## Frozen Files

All paths below are relative to this owned directory only:

- `frozen/lesson.template.json`: normalized modern Chinese lesson, immutable original source snapshot, source references, historical declaration and native section anchor.
- `frozen/english.lesson.json`: full normalized English translation, the same immutable source snapshot and object identities, explicit Faraday mapping and native English section anchor.
- `frozen/exercises.template.json`: unchanged native Chinese exercises template; count 0.
- `frozen/english.exercises.json`: English exercises object; count 0.
- `frozen/figures.template.json`: unchanged native draft entry for fig-283. Its source copies are provisional. The indicated modern spec does not exist here; no render/review is supplied or approved.
- `frozen/texts.json`: exact authored bilingual text and source-bound adaptation reasons.
- `inputs/source/{lesson.json,lesson.md,exercises.json}`: exact assembled source124 snapshots.
- `root/9p/pages/0307/{page.md,page.json,audit.json}`: byte-exact copies of the supplied native page artifacts.
- `work/9p/pages/0307/figures/fig-283.{png,svg}`: byte-exact provisional copies, never decoded or opened by this author.
- `translation-alignment.json`, `native-flow.json`, `native-text-result.json`, `counts.json`: object-level text alignment, actual native output, mechanical text check and body counts.
- `commands/`: once-only invocations, stdin where applicable, stdout/stderr and tool hashes.
- `commands/assemble.loaded-modules.json`: actual p2c invocation and loaded assembler path/hash.
- `9p-n124-prose-freeze.json`: hash-bound author freeze manifest.

The author freeze binds these files individually. The post-freeze `verification.json` binds the freeze hash and confirms file hashes and structure only.

## Source Boundary

The actual source heading is p0307#2, `**124. 磁通量**`. Last source124 text is p0307#10; the next actual heading is p0307#11, `**125. 感生电流的方向　楞次定律**`. Incoming123 p0307#1 and outgoing125 p0307#12 are not in either language's124 source snapshot or body. No page306 input was copied or approved.

Native assembly retains five paragraph objects, one figure and one caption. The definition p0307#4 and equation p0307#7 form one source-bound paragraph across fig283/caption. The figure and caption remain at their native assembled positions. Source124 has no exercises, invented examples, tasks, choices or answer statements.

Single-page assembly also emitted incidental incoming/125 context objects within this isolated root. Those objects are not authored, adapted, frozen as124, finalized or approved. The unmatched incoming p0307#1 `cont` warning is retained. Ancestor chapter/section identities remain native nulls; no heading was fabricated from the TOC.

## Native Evidence

Assemble: one invocation, exit0, no audit errors, one incoming-cont warning. Actual TOC9p was supplied. Actual loaded `assemble.py` SHA256 is `4f16b51802a415cebcfec6fb359549027f8b3bd6ba8d62ef0fad5f0187494340`; the existing whole-bold-heading identity fix was present and produced the correct124 card ID and printed title. Its bytes were stable before/after invocation.

Adapt-prepare: one invocation, target124 only, exit0. Normalize: one command for both languages, exit0. Prose-flow: one command per language, exit0. Text-only native validation: one command, exit0, no returned errors. Complete literal math tokens, numeric sequences, figure-reference sequences, source snapshots and source object identities match their source-bound objects.

No page finalize, vectorize, native row count, figure generation, figure render, adapt-finalize, lesson render, full tests, build, application, dependency, canonical, meter, index, database, Plane, Git or IntentFold refresh operation was performed. Existing25/25 source row counts are recorded as reused evidence, not recomputed.

Native body counts: Chinese7 paragraphs, English11 paragraphs. Each language has one exact adjacent paragraph section anchor, before the pointwise-field-versus-flux comparison. Source objects remain5 paragraphs +1 figure +1 caption; written exercises remain0 in both languages. `counts.json` supplies precise character/word diagnostics, including math notation.

The native Chinese normalizer separated the printed equation tags from their equation lines; `(12-2)` became a standalone native paragraph. Its source value is preserved. This is an exposed formatting limitation of the once-run native flow, not missing source text or an independent display acceptance. The current Chinese boundary is the actual emitted adjacent tag-to-comparison pair, not a hand-counted paragraph index. English tags remain attached to formula lines. All English prose paragraphs contain complete sentences or an explicitly introduced displayed formula, not clause fragments.

## Conditions and Notation

- The loop is a plane closed wire loop in a uniform magnetic field; its area is S.
- Alpha is the angle between vector B and the plane normal vector n, not the angle between B and the plane.
- B is the field magnitude in the definition and flux formula. Arrow-marked vector B and vector n are retained separately from scalar B and subscripted B_n.
- The source equations remain exactly `Phi=BS cos alpha`, `B cos alpha=B_n`, and `Phi=B_n S`, in their original source token order; the printed tags remain12-1 and12-2. No equation is rewritten as an absolute value, new integral, calculation or solution.
- B_n is the projection onto the normal, not a separately asserted nonnegative magnitude. The source relation also states B_n=B cos alpha mathematically, without reversing its printed equality.
- Magnetic induction describes the field at each point; flux additionally depends on loop area and orientation.
- The field-line interpretation retains its explicit convention: the number crossing a unit area perpendicular to vector B is set equal to magnitude B. The conditional nature is preserved in both languages.

Independent SCI review should assess the source's unspecified normal choice and its field-line "number" wording for orientations with obtuse alpha. The source does not state a directed-count convention. This author neither erases the orientation distinction nor adds a sign rule, positive-only restriction or absolute value. Field lines are represented by the source's convention, not introduced as literal countable physical objects. No numerical examples or additional claims about flux units or induction law are added.

## Glyph and Culture Bindings

The supplied native manifest SHA256 is `62a26cbd30de4e36014dc56b18056fa82c956125b91addca499f2aa1a702d868`. The original independent SOURCE review SHA256 is `8c6ca25decb0a667b2537c99ab7ac4f1cfdce3a2613a3910270af2395b213efd`. Both were verified before copying.

The source review's307 FAIL remains unchanged in the frozen evidence. The supplied `glyph-repair/affected-binding.json` proves the exact sole delta in p0307#10 row2, bar B to vector B, against the independently read literal. Current page bytes and authored Chinese/English use vector B. The copied metadata still contains the earlier author's historical uncertainty note; this does not mean the current text contains bar B. No physics-derived restoration, new glyph review or new source approval occurred here.

The source names Faraday in p0307#3. Chinese declares the literal term `法拉第` with that source-bound reason. English uses `Faraday`, with explicit `historical_translation` mapping to the same source term/reference. The native `historical_entities` contract requires the exact same term in source and modern text, so the English declaration array remains empty rather than falsely declaring `Faraday` as a Chinese source literal. The separate mapping is asserted by the text check and frozen alignment.

No fictional names, places, monetary values or institutional contexts occur in124. Cultural substitutions: none. Scientific attribution is preserved; no historical episode is imported from123.

Fig283 exact RAW review remains pending by the assigned owner; this author's provisional copies are not approval. Modern fig283 authoring must consume the frozen current edition text. No modern assets or fabricated audit PASS exist here.
