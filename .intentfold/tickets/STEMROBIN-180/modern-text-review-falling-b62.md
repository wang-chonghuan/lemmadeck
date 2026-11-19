# STEMROBIN-180: falling b62 modern-text review

Date: 2026-11-17. Scope: **phy8-c2-s3-n51 only**.
Decision: **HOLD / REVISE**. First independent full-text review completed.
This is not a SOURCE, image, adaptation-finalization, publication or product-display approval.
No text was rewritten. The scientific assertions are intentionally unchanged from the source;
their correction or qualification requires explicit authorization outside this review.

## Findings

All loci below use zero-based `prose[]` and production-paragraph indices, and the frozen
`lesson.template.json` line numbers. Findings were assigned after reading the complete modern
lesson, source lesson and empty exercise object, not by sampling or importing another PASS.

### F1: HOLD / REVISE - the velocity reference frame is unstated

Locus: `prose[1].text`, line 38; `p0200#15`, `p0201#1`; production paragraph 1.
Exact assertions: `在物体开始降落的时刻($v=0$)` / `没有阻力` /
`其方向与速度的方向相反`.

Minimum rationale: zero velocity in the observer's frame does not establish zero velocity
relative to a moving fluid. A wind or current can produce drag at that instant, and drag
opposes the relative motion, not necessarily the object's observed velocity.
The preceding two-force description at `prose[0]`, line 22, is an idealization, not an
inventory of all actual fluid forces. The explicit `所有其他的力都忽略不计` qualifier in
`prose[1]` is retained and is useful; ignoring air buoyancy is permissible within that
declared approximation, but must not teach that gases have no buoyancy.

Minimum authorization needed: establish the stationary-fluid / relative-velocity scope
of the model. No replacement wording, additional formula or source-layer repair is supplied.

### F2: HOLD / REVISE - finite-time exact terminal speed is not guaranteed

Locus: `prose[2].text`, line 55; `p0201#2`; production paragraphs 2 and 3.
Exact assertion: `一定会出现一个它们的绝对值彼此相等的时刻`, followed by
zero resultant, zero acceleration and motion at constant velocity.

Minimum rationale: a standard countermodel already satisfies the stated increasing-drag
assumption. With constant positive `m`, `g`, `b`, linear drag and release from rest,
`m dv/dt = mg - bv` gives `v(t) = (mg/b)(1 - exp(-bt/m))`.
For every finite time, the speed is below its limiting value and acceleration is positive.
This is reviewer reasoning, **not** a proposed addition to the lesson or a source erratum.
The conditional inference from zero resultant to zero acceleration is correct; the
guaranteed finite instant is the defect.

The retained skydiver / snowflake / raindrop examples in paragraph 3 likewise need a
settled regime and a stated approximation: adequate fall time, sufficiently steady fluid
and stable object/drag properties. They are not universal assertions from release onward.

Minimum authorization needed: distinguish the limiting/approximately steady regime from
exact finite-time force equality, including the examples. No rewrite performed.

### F3: HOLD / REVISE - constant buoyancy needs conditions and a revised force balance

Locus: `prose[3].text`, line 71; `p0201#3`; production paragraph 4.
Exact assertion: `这个力是恒定的，与速度无关，所以，它不妨碍落体的匀速运动`.

Minimum rationale: hydrostatic buoyancy depends on displaced fluid, not merely velocity.
Constant displaced volume, approximately constant fluid density and local gravity are
needed for the constant-force claim. The fully immersed rigid-body case fits that
approximation; immersion changes or density variation do not.
Constant upward buoyancy does not preclude terminal descent, but it changes the balance:
for a downward terminal regime, drag balances weight minus buoyancy, not weight alone.
That downward regime also requires positive effective downward weight.

Minimum authorization needed: make the applicability and three-force balance explicit.
Keep the real historical identity `阿基米德`; do not fictionalize it.
No formula or explanatory sentence was inserted into the template.

### F4: HOLD / REVISE - the observation interval is not qualified

Locus: `prose[4].text`, line 92; `p0201#4`, `p0201#7`; production paragraphs 5 and 6.
Exact assertions: `很容易确信钢球在液体中是匀速降落` and the subsequent equal-time
distance observation claiming uniform descent.

Minimum rationale: release from rest includes a transient. A tube approximately 1 metre
long, with an unspecified steel ball in either water or glycerol, does not alone guarantee
a measurable terminal-motion interval. Ball size, fluid properties and usable fall distance
affect that interval. The proposed equal-time distance test is appropriate **within** an
established approximately steady interval, not automatically over the whole fall.

Minimum authorization needed: specify a suitable configuration and steady observation
interval/approximation. No invented ball diameter, viscosity, temperature, timing value,
numerical tolerance or extra exercise was added; the source's `1 米` remains untouched.

## Full Coverage

All seven raw objects were read in full and independently matched, including the complete
text of merged cross-page objects. Five prose blocks produce seven final paragraphs.

| Raw / modern block | Type | Complete source bindings | Modern template line | Production paragraphs | Assessment |
| --- | --- | --- | --- | --- | --- |
| 0 | p | `p0200#14` | 22 | 0 | Gravity/drag introduction and `§ 42` retained; two-force statement read with block 1's approximation; F1 scope applies. |
| 1 | p | `p0200#15`, `p0201#1` | 38 | 1 | Full release, gravity and drag account retained; both formulas exact; F1. |
| 2 | p | `p0201#2` | 55 | 2, 3 | Complete terminal-force argument and all three examples retained; F2. |
| 3 | p | `p0201#3` | 71 | 4 | Complete liquid-buoyancy explanation retained; historical declaration correct; F3. |
| 4 | p | `p0201#4`, `p0201#7` | 92 | 5, 6 | Complete tube setup, steel ball, water/glycerol, figure reference, coloured scale and metronome procedure retained; F4. |
| 5 | fig | `p0201#5` | 108 | not prose | Empty text is legitimate figure metadata; `id=fig-136`, `label=图 136`, printed page 189 preserved. No image inspected. |
| 6 | cap | `p0201#6` | 122 | not prose | Entire caption `图 136` and figure association preserved. No caption omitted or invented. |

The nine references listed above match the authoritative raw objects exactly, in their
assembled order. Block 4's `p0201#7` continuation remains attached to its prose, even though
the source figure and caption use `#5` and `#6`; no source-order reconstruction was rerun.

## Text And Source Evidence

- Modern lesson and exercise `source.data` equal the authoritative retained JSON objects.
  Their recorded source hashes also match the frozen raw bytes.
- Raw `lesson.json`, `lesson.md` and `exercises.json` equal the isolated cohort copies
  byte-for-byte and match their own lesson-copy entries in the retention receipt.
- Lesson source SHA-256: `c9e67476ef30145cf4aec14b4fca31580ce25a3a4ccdc58b3d2b5b1919db61ac`.
- Raw lesson Markdown SHA-256: `bcbb7d41ce72c8345dea63faaa3a1d172819f5846a9403b0045bb574cb4bd7dd`.
- Exercise source SHA-256: `eff567d9b6b3a085328cbdfd21a2bfb2da615ea480489c8da014d10d4d9164eb`.
- Exercises: source count 0, modern count 0, lesson exercise count 0 and both arrays `[]`.
  No source exercise omitted; none invented. No answer or choice artifact reviewed.
- Values and notation preserved: lesson 51, `§ 42`, figure 136, approximately `1 米`,
  `$v=0$` and `$m\vec{g}$`. Both formula token sequences are exactly unchanged.
  Physical start page 200, printed start page 188 and subsequent printed page 189 are
  source identity, not revised scientific quantities.
- Every block's kind, id, label, printed page and `source_refs` match the raw block.
  Every `source_text` is exact. The full text differs only in sentence punctuation and
  layout; the mechanical equivalence check normalizes whitespace and ASCII/fullwidth stops.
  That check supplements, rather than replaces, the complete semantic reading.
- All five prose blocks declare only `layout`, all `numeric_changes` are empty, and
  `errata=[]`. Figure/caption prose objects declare no textual changes.
  No undeclared numerical/formula correction or scientific modernization was found.

## Production Paragraphs

The existing production `tools/prose_flow.mjs --json` was invoked **once**, with the frozen
modern lesson template. It calls the shared `htmlfrag.js` paragraph and section-anchor
logic. Exit 0; no retry. No renderer or publisher was invoked.

The actual paragraph sequence is:

1. Index 0, block 0: falling in a fluid; two-force introduction and `§ 42`.
2. Index 1, block 1: release condition, gravity and speed-dependent opposing drag.
3. Index 2, block 2: claimed force equality, zero resultant and zero acceleration.
4. Index 3, block 2: skydiver, snowflake and raindrop examples.
5. Index 4, block 3: liquid buoyancy.
6. Index 5, block 4: approximately 1-metre tube, water/glycerol, steel ball and figure 136.
7. Index 6, block 4: uniform-motion claim and equal-time-distance metronome observation.

There is exactly **one** authored `{before, after}` text anchor, lines 236-240.
It resolves to paragraph index **5**, between the complete buoyancy paragraph (index 4)
and the complete experimental-setup paragraph (index 5). This is a genuine conceptual
transition from force discussion to observation; it is not an integer inferred from block
counts. The exact seven paragraph strings and boundary are preserved in the parser output.
No malformed, ambiguous or stale section anchor was found.

## Figure And Culture Scope

Figure 136 appears once in the lesson figure list, once in the figure prose object and
once as its caption; block 4 explicitly references it. The modern figures template retains
its id/label and source paths. Its declared PNG/SVG source hashes match the corresponding
fig-136 metadata in the supplied retention config. Raw and cohort PNG/SVG files are present,
checked using file metadata only. **Zero image bytes were read or hashed.**

The figures-template `modernized` flag and spec path are declarations, not image acceptance
evidence. Modern artwork, labels, FigureSpec, geometry, display and source pixels remain
outside this text-only verdict.

The entire modern text contains no profile forbidden term, forbidden fictional Russian
name or Cyrillic character. Water/glycerol, steel ball, tube, scale, metronome and the
falling-object examples are culture-neutral, so no US fictionalization is needed.
`阿基米德` is present in both block 3's source and modern text, explicitly declared in that
block's `historical_entities` with a source-identity reason and bound to `p0201#3`.
Retention is appropriate and is not a profile bypass or an invented modern person.

## Frozen Bindings And Closure

Before any lesson semantics were read, 21 local inputs were copied byte-for-byte into
`.intentfold/tickets/STEMROBIN-180/tmp/b62-n51-text-review/snapshots/`.
The binding file is a **flat array**, with precisely `{path, sha256, snapshot}` per input;
both paths are absolute.

Bindings: `.intentfold/tickets/STEMROBIN-180/tmp/b62-n51-text-review/bindings.json`.
Bindings SHA-256: **`7a5581bdd98818ade754ac92c5bdf48e6959a446fc6393f875d768b20a2ad229`**.

It binds the three modern templates, the three authoritative n51 raw files, the three
n51 cohort files, cohort book metadata, the specified retention config/receipt, all four
binding charter files, lesson SKILL, modern text contract/profile and both production
parser source files. Only n51's entry was projected from cohort book metadata; no cohort-wide
consistency judgment was made.

`receipt.bookSha256 = 1d87f6330d0e4673520c2b55cebd2c2a22260c91a5e18c14437c9461f874d574`
is the **historical destination total-index hash**. It was not compared with the isolated
cohort book. The mutable shared durable `artifacts/8p/book.json` was not read, frozen,
hashed or used as a precondition.

Primary scientific references were consulted as text only: OpenStax, *University Physics
Volume 1*, section 6.4 (relative-fluid drag, linear-drag limiting solution) and section
14.4 (displaced-fluid buoyancy and sinking condition). Their rendered text and hashes are
recorded by steps `b62-n51-textreview-science-drag-15` and
`b62-n51-textreview-science-buoyancy-17`. These are not source-scan gates or new content.
The finite-time countermodel above is explicitly reviewer reasoning.

Other evidence in `tmp/b62-n51-text-review/`: `text-evidence.json`,
`production-parser.stdout.json`, `production-parser.stderr.txt`,
`production-parser.call.json`, and final `closure.json` containing the read-only
end-of-review input/snapshot hash comparisons and report SHA-256.
No input was written. The verdict applies to the frozen bytes; any later input change
must not inherit this review as a PASS.

## Remaining Unknowns And Stop

Human authorization for science qualification/correction is unresolved: this review
does not grant it. Specific experimental parameters and an acceptable approximate-steady
measurement criterion are not supplied by these frozen texts.
The `§ 42` number is retained; its app navigation/resolvability was not inspected.
Source pages 200/201 are independently approved by the user and were not re-reviewed.
Modern image fidelity/readability, product rendering and database/published state are
unknown within this explicitly bounded review, not newly invented prerequisites.

No freshness/setup/backend replay, SOURCE gate, OCR, source-pixel review, prepare,
assemble, adapt-finalize, render, modernfig generation, answer/choice work, database,
Git, backend or repair operation was performed. No inherited PASS was used.
No second review, retry or remediation is authorized or attempted. **Stop after this
first completed full review.**
