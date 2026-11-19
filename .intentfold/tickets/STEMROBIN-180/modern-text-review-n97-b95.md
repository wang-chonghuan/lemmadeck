# Independent TEXT Review: n97, C b95

Status: **REVISE**. STEMROBIN-180; phy7-c1-s2-n97 only; offline finish=review.
This is fresh independent TEXT evidence, not SOURCE or final DISPLAY approval.

## Finding

**N97-TEXT-1 (P2): all six nested italic terms fail in the actual shared parser.**
The four candidate definitions at p0256#3/#5/#7/#9 generate one complete
`<strong>` element each, with the final period outside it, but generate zero
nested `<em>` elements. The six `_物质_` ranges remain literal: twelve visible
underscore characters. Thus the stored marker-only edit preserves normalized
lexical content but does not preserve the intended emphasis or displayed words.

Actual `htmlfrag.js` `proseInline` observations, not a generic Markdown lexer:

|Source block|Whole-definition strong|Required nested em|Actual em|Literal underscores|TEXT|
|---|---:|---:|---:|---:|---|
|p0256#3|1|1|0|2|REVISE|
|p0256#5|1|2|0|4|REVISE|
|p0256#7|1|1|0|2|REVISE|
|p0256#9|1|2|0|4|REVISE|

Example actual output: `<strong>_物质_由固态变为液态叫做熔解</strong>.`
`render_lesson.js:18/83/321` delegates prose to this shared parser;
`publish.mjs:29/174` does likewise. Neither renderer nor publisher was run.
The unsupported-underscore failure is recorded without editing any candidate,
source, parser, anchor or other owned work.

## Per-Block Conclusions

All ten prose objects were reviewed against their complete approved source text.
The full substantive conclusions and scientific qualifications are in report.json.

|Source|TEXT|Conclusion|
|---|---|---|
|#2|PASS|Energy supplied/released and forward/reverse state-change examples retain causal direction and exact words.|
|#3|REVISE|Melting definition is correct and faithful; one nested term fails actual parsing.|
|#4|PASS|Heating to the melting temperature remains a necessary condition, not a claim that transition completion requires no further heat.|
|#5|REVISE|Melting-point definition remains faithful; two nested terms fail actual parsing.|
|#6|PASS|All melting examples, materials, apparatus, 0/80 Celsius formulas and approximate1500 description are unchanged. Source alloy simplification is disclosed.|
|#7|REVISE|Solidification/crystallization definition retains phase direction; one nested term fails. The concept boundary before it is valid.|
|#8|PASS|Cooling condition leading to crystallization is unchanged and causally consistent.|
|#9|REVISE|Freezing/crystallization-point definition is unchanged; two nested terms fail.|
|#10|PASS|Equilibrium melting/freezing comparison and 0/1539 Celsius source values remain unchanged. Source pressure/purity/supercooling qualifications are not expanded.|
|#11|PASS|Constant temperature during crystalline melting and solid/liquid coexistence remain intact; the complete object closes on256.|

The approximate cast-iron/steel description is not a universal exact alloy
melting datum; phase-point equality has the usual equilibrium/context limits.
These are inherited source simplifications, not a hidden candidate rewrite.
No numerical erratum is registered, and no scientific correction is authorized.
The source0/80/1539 Celsius and approximate1500 description are retained exactly.

## Complete Card And Applicability

Approved page256 (printed245) contains exactly12 blocks/25 rows: one n97 heading,
ten prose objects (23 prose rows), and one footer. Every block is closed, without
incoming or outgoing continuation. The assembled p0256#2 through #11 objects
match the original lines; lesson.md and all empty exercise/figure manifests agree.

Independent prose review finds **zero written tasks**, not merely an empty JSON
array: descriptions of the water bath, heated metals and observed melting are
explanatory demonstrations, not numbered or unnumbered written-response demands.
No observation-record request, calculation question or answer slot is present.
Written exercises0, figures0, answer tasks0, choice tasks0: **FIG/ANSWER/CHOICE
are not applicable**. No laboratory assignment or new task is manufactured.

## Boundary And Integrity

The new section-break anchors exactly match `prose_flow.mjs --json` output.
It resolves uniquely at paragraph index6 of11, after the second melting-example
paragraph (#6) and before the complete solidification definition (#7).
This is a genuine concept transition, not an integer guessed from block counts.
It is text-flow proof only; changed definition syntax would affect its after anchor.

Author manifest SHA256:
`0f6850986c6d7604fe8a41fdbed4f61ef25504756aaca7628c331c1d590de1b4`.
All17 parent-bound entries verified. Candidate SHA256:
`a362c38ed5fca7f3bc1dc5cee1646b73dcf4a02704ef1c7e174084ed21469e2c`.
Approved SOURCE256 JSON SHA256:
`ee534ac026a086222d0c0f5d7c4ca90ce4991a5abd5ee2f88d2b4244cc15eba0`.

Exact candidate delta: four definition blocks, six nested term ranges/twelve
delimiter-character replacements, one section break, and associated layout tags.
Wording/punctuation/formulas/numbers and protected source snapshots are unchanged.
All33 reviewed input bindings and the current work-template equality verify.

## Evidence And Limits

- `.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n97-text-review/report.json`
- `.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n97-text-review/probe-result.json`
- `.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n97-text-review/input-bindings.json`
- `.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n97-text-review/manifest.json`
- Recorder receipts: `commands/n97-text-review-emphasis-a13-1.json`,
  `commands/n97-text-review-flow-a14-1.json`, and
  `commands/n97-text-review-verify-a19-1.json` under the same resume-180-4 root.

The verify receipt exits1 deliberately for the real TEXT failure after all
integrity assertions completed; no technical execution failure occurred.
Optional DOM parser packages were unavailable; no dependency installation or
browser run was attempted. Actual shared-parser fragments settle this defect.

Image opens0, SOURCE pixel reviews/replays0, source finalize replays0, official
modern finalize0, native DISPLAY replays0, final DISPLAY approvals0, whole-lesson
renders0, browser runs0, paid calls0, candidate/source edits0. Environment, DB,
publish, deploy, app, dependency, Git and other-agent operations0.

SOURCE approval and repair1/1 are reused. The SOURCE report openly qualified its
generic lexer observation; it never proved modern shared-renderer nesting.
n98/physical257 remain BLOCKED and excluded. No old modern/answer/choice or
other-ticket content supplied a verdict. Parent images remain19/24; no image payload.

Owned outputs and manifest are frozen0444. **STOP for parent binding.**
No candidate retention, staging, finalization or downstream approval is performed.
