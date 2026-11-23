# N30 choices: bounded independent display review

Outcome: **pass**.
Date: 2026-11-23. Same sole independent N30 reviewer as the source, views
and final-comparison phases; not an author or an additional review gate.
Sole workdir: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188`.
Only this record is written, in the existing owned reviewer root.

## Scope and image accounting

This is the lesson's once authorized choices desktop/mobile visual check,
not another mathematical review, a rerender, an answers display review, or
a product/shared-functionality test.

- Prior image opens by this reviewer: 0.
- This first batch: exactly 3 existing screenshots opened, each once.
- Reopens, crops, generated images, or additional screenshots: 0.
- Actual reviewer image count after this phase: 3, within 8 per batch and
  24 per context. No image-count reset is claimed.
- Parent-reported image count remains 8/24; this handoff contains text,
  evidence paths and hashes only, not image payloads.
- Did not open the failed partial `choices-1440.png` or
  `choices-390-part1.png`, the capture script, or other images.
- No rerender, browser, UI interaction, DB, environment-file access, network,
  Git, subagents, canonical write, or new UI behavior.

The parent reports native retention succeeded and the current snapshots are
in the canonical choice-set. No retention or mathematics is redone here.
The visible snapshot used for pixel/content comparison is the already
reviewed `n30-choice-independent7/views.json`, byte SHA-256:
`223f83e503d8143a35f0b0524cb5b2125bfe3c4edc1f6c2784881291756da97d`.
That actual byte hash was checked again and is unchanged.

## Metadata and screenshot binding

Read:
`ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n30/display7/choices.json`.

Actual metadata byte SHA-256:
`81ccb612701558f7c9bec43643dd5f3ecbf8f60689988717161deff873770247`.

It identifies lesson `geo68-c2-s4-n30`, headless/offline capture,
`productFunctionalityTested: false`, zero media, and the three corrected
results. Its retained draft source hash is
`e048137f5b825074f8d9eea8206b28bea7c4dabd7600a4897e186b70c1174378`.
This is the renderer's reported retained-source binding, not a claim that a
PNG hash equals a JSON hash or that the old author-note snapshot was rendered.
Other source-hash entries in that metadata were not used to reopen answers
or conduct unrelated content checks.

The following actual PNG byte hashes equal the metadata results. PNG header
dimensions were independently read without loading more images into context.
These are full-page or whole-question split image sizes, not assertions that
the entire long page fits inside one viewport.

| Opened screenshot | Capture viewport | Actual PNG dimensions | Metadata clip |
| --- | --- | --- | --- |
| choices-1440-recovery1.png | 1440 x 960 | 1440 x 5450 | x=0, y=0, width=1440, height=5450 |
| choices-390-part1-recovery1.png | 390 x 844 | 390 x 4871 | x=0, y=0, width=390, height=4871 |
| choices-390-part2-recovery1.png | 390 x 844 | 390 x 3990 | x=0, y=4871, width=390, height=3990 |

All three paths are beneath the metadata's `display7/` directory above.

### Desktop screenshot

File: `choices-1440-recovery1.png`.

Actual byte SHA-256:
`eb5e9ee7cb8a59667b69d5f58921cef94ecede0577cab58b55fb6a321c6bd690`.

Opened pixels show the construction-problems heading and every question from
the hypotenuse/leg task through the final externally tangent circles task.
Observed inventory: all 11 question stems and all 53 options, consisting of
49 unselected square checkbox controls and 4 unselected circular radio controls
in q07. Each control has its corresponding A-through-final-letter label and
option text. No key, correctness mark, author intent or rationale is shown.

The centered reading column has clear margins on both sides, separations
between questions, and aligned first-line controls. Chinese prose, italic
mathematical letters, degree signs, radicals, squared terms, inequalities,
intersection and parallel symbols are visually legible. Long options wrap
within the column without covering their neighbors or controls.

Right-edge check: the rightmost wrapped prose and formula ends remain inside
the column, including q02's square root, q09's two radical-distance expressions
and half-angle bound, and q11's power equation. No formula is visibly cut at
the image or content-column edge.

Bottom check: q10 includes all eight A-H alternatives, followed by q11 with
its complete stem and A-D alternatives. The final D statement ends with the
two-open-rays/no-further-deletion claim, and its full bottom separator and
white margin are visible. This is not the failed one-viewport partial image.

### Mobile screenshot, part 1

File: `choices-390-part1-recovery1.png`.

Actual byte SHA-256:
`e9363d4137e2634d023501f684a101f609329517023c1fef1b3fc3720521c35d`.

Opened pixels show the heading and complete q01-q07.
Observed inventory: 7 full question stems and 31 options:
27 square checkboxes for q01-q06 and 4 circular radios for q07.
The split therefore occurs after q07, not after q06.

The approximately 16-pixel side margins remain visible. Option text is
indented beyond the control/letter column, and its wrapped lines stay within
the right margin. The leg/hypotenuse square roots, tangent/cotangent symbols,
0/90-degree conditions, minus versus plus radical denominators, equal-side
thresholds, and the h approaching a from below notation can be read.
Controls are not covered by long formula lines.

The q06 supporting-line foot statement is complete, including its three
positions and the extension allowance in the stem. q07's full same-count/
different-construction alternatives and its on-circle/inside statements are
visible; its radios are visually distinct from the preceding checkboxes.

Right-edge check: q04's radical formulas, q05's right/equilateral thresholds
and q06's chained inequalities wrap instead of disappearing beyond the image.
Some inequalities move their upper endpoint to the next line, but the endpoint
and following text remain visible and readable in order.

Bottom check: all of q07 D is present, including its incorrect zero boundary
claim, the d<r case and A=O inclusion. The question separator at the split is
visible after the full last option. No question stem, control or option is
cut mid-content.

### Mobile screenshot, part 2

File: `choices-390-part2-recovery1.png`.

Actual byte SHA-256:
`09c002877521d6fde1b04cc7fcc36a3b771cd1fa53d1b468e27f31c7eedf6f99`.

Opened pixels start with the complete q08 stem, not a continuation of q07.
Observed inventory: complete q08-q11, 4 stems and 22 square-checkbox options:
4 + 6 + 8 + 4. Every option is present once in this part.

q08's two zero-length conventions and both proposed radical radii are
visible. q09 retains the entire explicit full-chord interpretation, free
radius, allowed V endpoint, A-F alternatives, signed foot-distance filters,
common-length radius threshold and infinite-family versus uniqueness clauses.
Its d1/d2 subscripts, squared terms and radical bars fit through line wrapping.

q10 retains both I/II contact tasks, T and U definitions, A-H controls and all
exceptional-case text. The not-equal, membership, fourth-proportional radius
and OM-parallel-to-l notation are rendered as mathematics rather than raw
backslash commands. q11 retains its complete stem, unequal/equal-radius scope,
the equal-power equation and both whole-line/line-minus-T conventions.

Right-edge check: q09's paired radical distances and half-angle bound,
q10's TM squared divided by 4r and parallel symbol, and q11's indexed squared
center/radius terms are all visible, not truncated at the narrow right edge.
Text and formulas do not overlap controls or subsequent alternatives.

Bottom check: the complete q11 D option is visible through its final
no-additional-point-deletion wording, followed by a separator and white margin.
Neither its bottommost text nor its checkbox is cropped.

## Question and control coverage observed from pixels

The question IDs below map the recognizable stems to the locked view snapshot;
the screenshots themselves do not display internal IDs or source numbers.

| Question | Observed options | Observed controls | Desktop | Mobile location | Formula/content check |
| --- | ---: | --- | --- | --- | --- |
| q01 | 5, A-E | square | complete | part 1 | c,b, right angle, 0<b<c, c/sqrt(2), complete E |
| q02 | 3, A-C | square | complete | part 1 | sqrt(a^2+b^2) versus sqrt(a^2-b^2), zero/equal/swap text |
| q03 | 4, A-D | square | complete | part 1 | beta at A, tan/cot/sin, 0/90/45 degrees, final limit claim |
| q04 | 5, A-E | square | complete | part 1 | AH intersection, plus/minus radical denominators, strict h range |
| q05 | 5, A-E | square | complete | part 1 | doubled/undoubled half-base radicals, right/equilateral and angle ranges |
| q06 | 5, A-E | square | complete | part 1 | base/side altitude distinction, three foot positions, h approaching a |
| q07 | 4, A-D | circular radio | complete | part 1 | d/r cases, diameter versus centered circle, A=O, full final D |
| q08 | 4, A-D | square | complete | part 2 | sqrt(r^2+a^2), r+a, zero conventions, spurious inner radius |
| q09 | 6, A-F | square | complete | part 2 | full-ray-chord stem, d1/d2 radicals, L/(2cos(theta/2)), complete family text |
| q10 | 8, A-H | square | complete | part 2 | both I/II tasks, TM^2/(4r), T/U exceptions, OM parallel l, complete H |
| q11 | 4, A-D | square | complete | part 2 | MO_i^2-r_i^2 equality, real/exterior claim, full final D and bottom margin |

Desktop total: 11 questions, 53 options, 49 checkboxes, 4 radios.
Mobile combined unique total: 7 + 4 = 11 questions,
31 + 22 = 53 options, 49 checkboxes, 4 radios.

The mobile clips are adjacent in global document coordinates:
first [0,4871), second [4871,8861). More importantly, pixels show the whole
q07 finishing in part 1 and q08 starting in part 2. No question or option is
duplicated or omitted across that boundary.

## Findings and limits of the pass

Visual pass is supported by actual inspection of all three images, not just
their hashes or inventory metadata:

- All 11 stems and 53 alternatives are legible on both supplied surfaces.
- Radicals, superscripts/subscripts, degree signs, inequalities, intersection
  and parallel symbols render; no visible raw `\lt`/`\gt` or missing-math
  fallback appears. Full text and formula endings fit the available width.
- Checkbox versus radio presentation agrees with ten multiple questions and
  q07's one single question. All choices are visibly unselected.
- No essential clipping, overlap, missing rightmost object, missing bottommost
  option, or gap/overlap at the mobile whole-question split was observed.
- Minor narrow-width typography remains: for example q04 A's final punctuation
  can wrap to its own line, and some mathematical comparisons wrap between
  their operands. Their full symbols and continuations remain readable and
  separated. These are nonblocking wrapping observations, not hidden clipping
  or a claim that every line break is typographically ideal.

This pass concerns the supplied offline captured choices display only. It does
not prove click behavior, keyboard behavior, hit-target dimensions, feedback,
grading, scrolling behavior, production deployment, or a live product state.
No exact CSS font size is inferred from pixels alone. No functionality tests
are repeated, and no rendered question's mathematics is reauthored.

The two failed partial captures and their retained recovery history remain
untouched. The metadata's visual-review-pending status is not rewritten;
this separate owned record supplies the authorized visual observation verdict.
The actual record is sealed mode `0444` after completion, with its byte hash
verified and returned as text.
