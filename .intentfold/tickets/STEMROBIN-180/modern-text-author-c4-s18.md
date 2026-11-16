# phy6-c4-s18 Modern TEXT Author Freeze

Author-only immutable candidate, pending main's independent full TEXT review.
No lesson approval, modern figure approval, safety certification, finalize, or promotion.

## Complete Handoff

- Root: `.tmp/ld-s10y-lesson/text-author-c4-s18`
- `author-handoff.json`: SHA256 `5875cc9850e194f25b56c7e6a33290f7a63a37ceb2abe8a30d7c394385f9b52e`
- `frozen-manifest.json`: `6b66b228a232adb7e55ec436ac35518bd965fd77015193954312055fe4abf408`
- Full `author-context.json`: `56d67d66d62fe21a730ffce76224ed1a059cc9b5ab424d62cb18d0a5cf9a0f5a`
- Full readable `author-context.md`, complete original snapshots, per-target reasons,
  original PNG/SVG bindings, and every recorded stream are in the frozen manifest.
- Candidate directory: `adapt/6p/modern-us-neutral/lessons/phy6-c4-s18`
- `lesson.template.json`: `f30a33010f17149e3e20fd5b65fdaa8210c64546186feddcf66dc3de7240b0a2`
- `exercises.template.json`: `673282ed378caf7c12353f8b8cb43646cca4dd0fe756146c9ad4f5dc8eb2ad33`
- `figures.template.json`: `335f48642faf2ad03547b560b998da242d21ddff1f61799defc263f1b7ba90e8`

Counts: 15 source/modern blocks, 15 original/modern tasks (4 g1 + 10 g2 + 1
unnumbered g3 task `q1`), six figures 166/167/168/169/170/171, 15 actual prose-flow
paragraphs, three adjacent-text section anchors. No invented task or answer.
All task numbers, source_number, group/group_id, page identities, figures, source
snapshots, original mathematical bytes, and numerical data remain bound.

## Source and Authoring

Read complete approved raw lesson.json/lesson.md/exercises.json and full prepared
templates. Main's official adapt-prepare was reused by copying all three untouched
standard templates to isolated `prepared-01`; canonical scratch was not overwritten.
Opened originals fig-166 through fig-171 for text semantics only. Source approvals
were reused; no source or crop review/gate was repeated.

Raw bindings:
- lesson.json `4ef1ec00e8f488352905ce4cd53e126a8be58e8dbfc4b4577768aee9d356a9dd`
- lesson.md `d122937db6237fbde09712c6c4a2e23a1eb102f49015e949b1a7e31b9c767bd6`
- exercises.json `5975b45e5025e19987844f9823b0296b6b9998d5c29644d644eab1f7d6d9f9f5`

Full per-target rewrites and original text are in `author-change-log.json` and
the templates. Authorial clarification retains the initial-rest/two-force
model, uniform-liquid equilibrium, final static floating rather than instantaneous
stopping, negligible air buoyancy in the weighing experiment, solid/uniform
density comparison, and immersed volume fraction rather than unlike-shape depth.
All overflow/air-weighing/displaced-water steps and original liquids/materials
remain. Review q4's same-liquid/shape/orientation condition as an explicit
interpretive limitation, not numerical data. No answer direction or result was
inserted into prompts.

Full practical drawing, table lookup, construction, experiment, and explanation
tasks remain. `q1` retains headspace, partial gas/water cavity, initially slightly
exposed diver, membrane pressing, all three states, substitutes, and the source's
mouth-blown tube method. A concise source-bound historical-method clarification
does not constitute modern experimental safety advice or certification.
French Descartes identity and original `1596—1650` dates remain with per-task
`historical_entities` declarations for 笛卡儿 and 法国. No external history research,
fictional substitution, or Pascal cultural exemption was used.

Important unresolved original anomaly: g2-1 prints `б/б/в`, including first
reference `б`. Modern prose maps this to `b/b/c` only; no first-reference `a`
correction, formula correction, or registered erratum. Raw/source snapshots stay
unchanged. Figure168 author must preserve/declare the discrepancy, not silently
alter the prompt or source.

## Mechanics and Retained First Failure

Shared Python was used with `PYTHONDONTWRITEBYTECODE=1` and `-B`.
All command arrays, exit codes, and stdout/stderr hashes are in `evidence/*.call.json`.

1. `apply-author.mjs`: isolated copy/application exit0.
2. Canonical `edition.normalize_lesson_layout` and
   `edition.normalize_exercise_layout`: exit0.
3. `prose_flow.mjs` diagnostic exit0 exposed cross-paragraph emphasis closures.
   `final-layout.py` moved modern closing bold markers before punctuation and
   reapplied canonical layout, exit0. Words, numbers and source snapshots unchanged.
4. Final actual `prose_flow.mjs`: exit0; copied exact adjacent boundary objects
   for experiment, density criterion, and immiscible-liquid sections.
5. One full isolated text-only mechanics invocation: exit1, exactly one error,
   `exercises[11] 未改写但 changes 非空`; no math warnings or other errors.
   First report SHA `c623a4248e72c892ad142feb6f4be620ae603aa2deb38b651ac46211e4c4ca97`.
   All rejected templates are retained in `first-failure/phy6-c4-s18`.
6. Sole minimal metadata correction: q8 unchanged prompt's `changes` became `[]`.
   Structured comparison proves this is the only exercises delta. Canonical
   `edition.validate_text` on this affected task passes with no errors.
   `affected-metadata-repair.json` SHA
   `21358d7bddb888aef2905edc3ab3540474186dc040d8c9076414aa287abfbd63`.
   Full mechanics was not rerun; no final full-gate PASS is claimed.

Independent review must inspect the complete final text and the narrow declaration
correction; this author does not approve the candidate. All six modern figures
remain separate pending work. No private answer/source-solution/choice files read;
no durable edition/source, stable tool, app, dependency, schema, DB, Git or service
changes. Text freeze must remain unchanged while figure authors proceed.
