# Changed-Only Repair Acceptance: 10c 86/87

ONE text-only changed-object comparison. No new images/crops/reopens,
counter action, whole-page gate, binder, runtime record or durable edit.
Reviewer image budget remains exhausted at 8/8.

## Evidence Binding

- Frozen StageA unchanged: `22afd741d5925e608b1d7a9f26a56bbea574200a970817dab07a6df272295351`.
- Frozen StageB unchanged: `0e53eaf62d9ce73eecd65497e989e843c821b6789382c01740337c2711dea470`.
- Clarification `production-source10c86-87-clarification/source-first.md`:
  `e95ecba5dc18b59824254fc6312666023c1132b0e5e6d1e1987cc3be9f0433c7`.
- Same directory `h3-clarification.md`:
  `3ceadfb567a5a10465dca6f289630d4ea8e15ab30f3716cb4bd162a33994dfcd`.

Both clarification hashes verified. Source report independently identifies
task 288/289 raised glyphs as 2 from stroke structure and same-page controls.
Its third original observation concerns sentence-leading 结, not the
disputed glyph; the H3 addendum explicitly corrects the locus to 三 before
角函数. It records three separated horizontal strokes and a same-page
control, using its already-loaded crop, zero extra opens. No author candidates
were read by that clarifier. These are inherited bounded source observations,
not new image evidence acquired by this reviewer.

## Accepted Changes

Compared current durable 0086/0087/page.md with preserved pre-repair bytes
under `production-source-repairs-before/`. Old hashes match StageB's exact
inputs: 86 `4aec98f3154aa8193c347bd5847e16683589dda61c4f1ab58c3b057e768f2120`;
87 `fcd108987934d9785578d1a5ab1943099df5ad7d869ef68d286599d09d2f6f92`.

| Changed object | Current text | Disposition |
| --- | --- | --- |
| 86#7 closing prose | 结果得到的式子中，三角函数都是一次的。 | PASS repair: 二 -> 三; clarified source and frozen StageA agree. |
| 87#19 task 288 | `288. $\sin^2 6x$.` | PASS repair: raised 4 -> 2 only; argument 6x unchanged. |
| 87#20 task 289 | `289. $\cos^2 4x$.` | PASS repair: raised 4 -> 2 only; baseline 4x unchanged. |

Body diff contains exactly these three substitutions. No other prose,
formula, task, group, physical wrap, `samerow`, figure or boundary changed.
The three prior local disagreement HOLDs are resolved by independent
clarification, not mathematical convention. Their original records survive.

Correction to my frozen StageB's reference: physical 85's outgoing `p open`
is **85#8**, NOT #9 (#9 is folio). Current 86 note uses the correct #8.
This corrects my reference error only; `得出` -> `公式：`, `86#1 p cont`,
the previously established text-boundary provenance and n92 owner are
unchanged. StageB itself is preserved, not rewritten.

Current full-file SHA-256, including generated metadata outside this review:
- Durable 0086/page.md: `643c24419062a3623b9bc906d584396a860ab772392dbca4c31027da5774c0f8`.
- Durable 0087/page.md: `967cb26a5ccd59a5c9562d252425cf80e90a990c444b10d090f5de29783ba7c6`.

## Unchanged Limits

Generated normalization fields and historical draft notes are outside this
body/math acceptance; no audit result is inferred from `normalized: true`.
Parent reports retained first-finalize evidence under
`production-source-first-finalize-failures`: 86 remains **mechanical HOLD,
20 versus 19**, awaiting its separately bounded count-only classification;
87's first finalize **21/21 passed**. Neither was rerun or audited here.

89 figure-43 left endpoint HOLD and outgoing n93 closure HOLD remain
unchanged. No blanket sourcePASS or whole-ticket acceptance.
