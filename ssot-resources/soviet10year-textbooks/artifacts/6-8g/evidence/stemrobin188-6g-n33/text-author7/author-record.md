# N33 Text Author Handoff

Date: 2026-11-23. Ticket: STEMROBIN-188. Lesson: `geo68-c3-s1-n33`.
Status: **author handoff only**, not lesson/source/figure PASS or publication readiness.
Sole cwd: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188`.
Writes are confined to `.intentfold/tickets/STEMROBIN-188/tmp/n33-text-author7/`.

## Candidates

- `lesson.template.json`: copied from the specified preparation-recovery7 template.
- `lesson.before-initials7.json`: byte-exact preservation of the received lesson candidate before the authorized initials extension.
- `exercises.template.json`: copied from the same input directory.
- `proposed-errata.json`: one exact, unapplied notation proposal.

Both candidates remain `draft`. The source templates were read-only references.

## Authored Changes

- `/prose/7/text`: add formula-external spaces in `命题 $A$` and `$b$ 和`.
- `/prose/11/text`: add formula-external spaces around the angle-deficit formula.
- `/exercises/0/text` and `/exercises/0/lines`: put 441's introductory request, B statement, and A statement on separate lines, preserving their order and wording.
- `/prose/5/historical_entities`, `/prose/12/historical_entities`, `/prose/13/historical_entities`, and `/prose/18/historical_entities`: source-bound retention declarations, not rewritten history.
- `/section_breaks`: copy three exact adjacent-paragraph anchors from current `prose_flow.mjs` output: parallel-postulate forms to attempted proofs; the preceding account to the Riemann passage; non-Euclidean geometry to geometry/physical modeling.

The initial handoff ran current `edition.normalize_lesson_layout` and `normalize_exercise_layout` on the owned copies only. Current `prose_flow.mjs` resolved 15 final paragraphs and break indices `[3, 9, 11]`; these were derived, not handcounted.

## One-Unit Initials Extension

- Content delta: `/prose/12/text`, source ref `p0157#3`, replaces exactly one saved `Н·И·` label with the authorized equivalent Romanized `N.I.`. The result is `N.I.罗巴切夫斯基`; the Chinese identity, dates, all other wording, and existing whitespace remain unchanged. No given names are expanded or guessed.
- Classification: append `historical-label` at `/prose/12/changes/1`. This is modern historical-label typography for the existing Cyrillic prohibition, not source/math errata or a new historical fact.
- Retention metadata: `/prose/12/historical_entities/1/term` becomes `罗巴切夫斯基`, present in both source and modern text; only that declaration's `/reason` is updated to explain the source binding and authorization.
- Dependent anchor: update only `/section_breaks/1/before` with the exact current `prose_flow.mjs` paragraph. All other anchor strings are unchanged. Because this label affected an existing anchor, prose_flow was run; it still resolves 15 paragraphs and breaks `[3, 9, 11]`. Normalization was not rerun for this extension.
- Exact comparison against `lesson.before-initials7.json` succeeded: the only changed paths are the content target, classification and historical-entity term/reason above, and the dependent anchor. No other initials, prose, profile, formulas, dates, or diagrams changed. Exercises and the unapplied A/B-P/Q proposal remain byte-identical.

## Preservation Check

Local structured comparisons succeeded: all 20 ordered prose entries and all five exercises 441-445 remain; source objects including embedded snapshots, `source_text`, `source_refs`/exercise `pages`, identity fields, numeric fields, figure entries/references, and every math span are unchanged. Relative to the supplied templates, text differs only in the previously recorded whitespace and the one authorized modern initials label. Non-prose entries are identical. Exercise 445 is text-identical, including `445**.`; `printed_title` retains its original mark. Their identity and printing role remain unknown and are neither interpreted nor used as approval gates. The supplied native source/TOC identity is left untouched; SEC_NUM recovery is not re-audited.

Apart from the one modern initials label, no historical wording, dates, cross-references, formulas, physical claims, or exercise terminology were modernized or researched. Candidate `/errata` remains empty, and no target declares `math-correction`.

## Proposal And Scope Limits

`proposed-errata.json` targets `/prose/0/text`, backed by `/prose/0/source_text` and `/source/data/prose/0/text`, with source refs `p0155#7` and `p0156#1`. The exact parenthetical definition names A/B but its implications use P/Q; the proposal aligns those operands to A/B. The original span occurs exactly once in each target and remains present. E, the later contrary-assumption B, and geometric point P are untouched. This is internal consistency reasoning, not verification of the printed page; no constituent page-block location or page/PDF hash is invented. No registration, approval request, or approval gate was created.

The initial handoff preserved the saved `Н·И·` label because only whitespace changes were then authorized. The explicit follow-up authorizes `N.I.` in modern text; no Cyrillic remains in `/prose/12/text`. All saved source strings, including its `source_text` and embedded source, remain untouched. The original printed glyph/script identity stays **UNKNOWN**: neither the saved characters nor this modern-label choice establishes a source codepoint identity. Current `edition.py` rejects Cyrillic independently of `historical_entities`; this scoped label change addresses that known text issue without changing the profile or creating an erratum. No full edition validator/finalizer was run.

Figure-context constraints are retained as handoff instructions, not added to the lesson: fig209/210 keep the source's hypotheses and extension conditions; fig211's finite source strokes do not establish full Euclidean parallelism; fig212's curved geodesic traces may meet although both are perpendicular. Do not substitute a Euclidean parallel-line interpretation. No figures or image assets were opened, drawn, or generated: **0 images**.

No answers, old choices, interactions, tests, environment/DB, network, Git, dependency installation/change, browser, subagents, or canonical lesson/edition output were used. No full source/figure review, render, publication, or ticket-level handoff was performed.

## File Bindings

- Input lesson template SHA-256: `96f319b9671b2241cba26a97181ae8755cc4af670bc61e3a7e56f8ad4d8425a5`.
- Input exercises template SHA-256: `0548b7aba6087cac83d9dc216dd7f4188de5fc582aaa6297a256d0547efad587`.
- Preserved pre-initials candidate SHA-256 (`lesson.before-initials7.json`): `32aa2a954010e1baba6c6fdd50fb65d29fea2ed2dfa204acaafecbf5e28a75c0`.
- Revised candidate lesson template SHA-256: `72a6b9b148b27b895be11ad374769017e6e56eec4c2eff0d28a90a5200754968`.
- Candidate exercises template SHA-256: `54fdb88f7a17e29bc871142690624bf46710c4968c28fed43f1d18c61f16e5f2`.
- Proposed errata SHA-256: `c23026dd2062b2658f6698b8f1010bf7570da02f0b7ddb27ceed4ea6cab0797e`.
