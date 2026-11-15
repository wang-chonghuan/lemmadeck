# s24 Boundary Repair: Independent Affected-Only Review

2026-11-15. Ticket: STEMROBIN-180. Lesson: phy6-c3-s24.

**PASS: the sole anchor repair matches the existing tool's actual normalized paragraph flow.** This is not an adapt-finalize result or a repeat text/image approval.

## First FAIL and Binding

The initial adapt-finalize failure remains preserved in `tmp/s24-boundary-rejected-1/`:

| File | Actual Byte SHA-256 |
| --- | --- |
| Rejected `lesson.template.json` | `abe61637a90bef1a81fce591e1cc606a1300dcb4b4aff5bc78a40b9061ebc0b3` |
| Rejected `adaptation.audit.json` | `99a02020214c35c9b73b11adff1e04788cada58d8ed00633b795cb6f94c79b67` |
| Current `.tmp/ld-s10y-lesson/adapt/6p/modern-us-neutral/lessons/phy6-c3-s24/lesson.template.json` | `95d2d3f8de8c948dcf28e1f4d066d702f95af8c9c15e58f950e76835496cf2b1` |
| Unchanged s24 `exercises.template.json` | `42c92e76eb60f3bd427ef20ce77dbcee417925e476e2fac161edbcca73292c67` |

Rejected template/audit hashes match their retained `manifest.json` entries. The stored audit has `status: fail` and its sole error is `lesson.section_breaks 无法由 proseFlow 解析: section_breaks[0] must identify exactly one adjacent paragraph pair; matched 0`. It is not erased or relabeled PASS.

The only changed JSON leaf is `/section_breaks/0/after`. The repair appends exactly:

```text
图 75(a) 所示的就是把这种凸凹不平放大以后的情形.
```

It follows the existing two sentences with a newline, making the anchor equal to the actual normalized three-sentence paragraph. This sentence was already in rejected `prose[5].text`; it is not a new teaching assertion, new figure reference or change to that prose block.

All other template fields, complete `prose` objects and remaining anchors compare equal. A further literal-byte test replaced only the old JSON-encoded `section_breaks[0].after` string with the repaired string in the rejected file; the result equals the complete current file byte for byte. The exercise file retains its previously reviewed byte SHA. Normalizing the rejected and current documents yields identical entire prose objects.

## Actual Tool Observation

Read current `edition.py` normalization code and executed its exact existing pure functions in memory with `edition.normalize_lesson_layout`; no algorithm was rewritten. The default Python lacks Pillow and the skill-local venv is absent, so the diagnostic loads `MATH`, `masked_math`, `nesting_depths`, `normalize_prose_layout` and `normalize_lesson_layout` directly from the current module AST, excluding unrelated image/assembly imports. This limitation is explicit; it does not substitute a guessed normalizer.

Current `edition.py` SHA-256: `b48f7beedb54635876f426526d8541925c956c0f84e298f77c3fe34c229f4b2c`.

Read-only diagnostic: `.intentfold/tickets/STEMROBIN-180/tmp/s24-boundary-review.py`, exit0. It operates on deep copies and writes no input/evidence files.

Order:

1. Normalize a current lesson copy with the actual function.
2. Clear anchors in another copy and pass it to existing `prose_flow.mjs --stdin`, yielding the actual12-paragraph outline with no breaks.
3. Pass the normalized lesson with current anchors to the same tool. It succeeds with `resolvedBreaks: [4,8,10]`.
4. Check each returned before/after string against adjacent entries in the anchor-free outline.
5. Normalize the retained rejected template and reproduce its `section_breaks[0] ... matched 0`, tool exit2.

The indices4/8/10 are **zero-based indices of the paragraph after the break**, not one-based paragraph ordinals. They mean outline entries3→4,7→8,9→10 respectively.

| Tool Index | Before | After / Concept Transition |
| --- | --- | --- |
| 4 | “摩擦力与我们在前面研究过的重力、弹力等不同，是另一种类型的力.” | The full three-sentence paragraph beginning “摩擦力产生的原因之一是相互接触的物体粗糙不平” and ending with the appended fig75(a) sentence. General force distinction → contact roughness. |
| 8 | Existing rough/smooth surface and close-molecular-spacing paragraph. | Existing three-sentence lubricant introduction, film separation and sliding-layer paragraph. Causes of friction → lubrication. |
| 10 | Existing liquid lubrication, ice water film and engineering oils paragraph. | Existing sliding-friction definition and sled/skis example. Lubrication discussion → friction categories. |

Every anchor identifies one actual adjacent paragraph pair. No boundary moves into an unrelated concept, removes a sentence or duplicates a displayed paragraph.

## Unchanged Authority and Scope

The raw source snapshot, source refs, figure refs and complete authoritative lesson/exercise text are unchanged. Therefore the teaching text used by the already reviewed fig74/75 is unchanged even though the enclosing lesson-template byte hash changes due to anchor metadata. This report does not renew image reviews or claim their spec/output files have changed.

The earlier unnormalized paragraph count/indices in the full text report are retained as historical observations, not asserted as post-normalization publishing flow. The current affected check establishes12 paragraphs and `[4,8,10]` in the actual normalized flow without rewriting that frozen report.

Exactly one main-agent anchor repair is assessed. No original template, audit, source, exercise, figure, prior text/answer report or approval was edited here. No image, body paragraph or source exercise was substantively re-reviewed. No adapt-finalize, render, browser/app, DB, Git, dependency or model/service command was run. Main owns the single adapt-finalize retry. Wait for separately authorized10-answer key comparison.
