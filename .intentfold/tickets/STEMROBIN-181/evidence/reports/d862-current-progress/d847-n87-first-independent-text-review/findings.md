# d847: First Independent n87 SCI + ZHEN Text Review

Ticket: STEMROBIN-181 / successor181-3. Card: phy10-c2-s3-n87.
Frozen first review: **HOLD**. SCI: **HOLD**. ZHEN: **HOLD**.
No authoring, repair, second review or downstream approval.

## Exact Inputs

All paths below are in the sole authorized repository. JSON pointers are zero-based.
The complete path/hash ledger is [input-bindings.json](/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d847-n87-first-independent-text-review/input-bindings.json).

- `L-ZH`: [Chinese lesson](/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d837-n87-first-bilingual-text-author/candidate/zh/lesson.template.json), SHA-256 `32754542697164d7cb580b772845fc62ef84d870f872f7166c4bb41647223569`.
- `E-ZH`: [Chinese exercises](/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d837-n87-first-bilingual-text-author/candidate/zh/exercises.template.json), SHA-256 `2db6f9ed76e11a68ed3452ccf4083a6f89cc100b1fa33b23e1575afaf352e875`.
- `L-EN`: [English lesson](/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d837-n87-first-bilingual-text-author/candidate/en/lesson.template.json), SHA-256 `9d509433164778008c8476bb7bd354043e18445505e40cd4b368fd41623ba44b`.
- `E-EN`: [English exercises](/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d837-n87-first-bilingual-text-author/candidate/en/exercises.template.json), SHA-256 `94512adf4d464f0d366c058ad17a695e351e08a164ec9b62eba3125a2db1f59d`.
- `REQ`: [Frozen source requirements](/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d836-source233-consume-n87-prepare/n87-preauthor-source-requirements.json), SHA-256 `e2035f5a3e0a9608d90ef5275d9056dd59da9c221d3b3c9f596a46b09059d071`, matching the human-provided hash.
- `RAW-L`: [Raw lesson](/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d836-source233-consume-n87-prepare/root/10p/lessons/phy10-c2-s3-n87/lesson.json), SHA-256 `6fe57df85e6b9986854b00c662cb9249ac71a32e1417a6fbad0bf6a4dd32a83c`.
- `RAW-E`: [Raw exercises](/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d836-source233-consume-n87-prepare/root/10p/lessons/phy10-c2-s3-n87/exercises.json), SHA-256 `9299fe2333c9d0bb5157ad0a9deeb4d0d456972596c5d9178dea6ee042fbb43a`.

All four candidate hashes match the author freeze. Source hashes match preparation.
The nine review inputs were rehashed unchanged at 2026-11-19T00:17:18.470Z.
The author freeze was used for locations/hashes only, never approval. No author
answers, choices, native reports, source-mapping, locale-mapper claims or usage
reports were read.

## Findings

### d847-F01 [P1]: Integer-Wave Footnote Remains Physically Unresolved

Pointers: `L-ZH /prose/18/text` (line 320), `L-EN /prose/18/text` (line 337),
`REQ /blocks/30/lines` (`p0232#10`). Compare both lessons' `/prose/14`, `/prose/15`,
`/prose/17`, `/prose/19`.

Both texts preserve the quoted assertion that practical thickness is an integer
multiple of the wavelength and say they do not use it as a derivation. They do
not tell a child whether it is a valid coating rule under the stated assumptions.
Repeating normal incidence, the index inequalities and amplitude conditions
does not resolve that conflict.

Independent model check: both reflections have the same phase reversal. The
unchanged design formula gives the smallest thickness as one quarter of the
in-film wavelength. If thickness is an integer multiple of that wavelength,
the round-trip propagation phase is `4*pi*m`, not an opposing phase. If the
quoted wavelength means the vacuum wavelength, the generic integer-multiple
rule still does not follow. The missing wavelength/model cannot be invented.

Required correction: preserve the raw quotation and history. Separately
authorized modern text must explicitly distinguish this unresolved source
statement from the usable rule under this lesson's model, in child-readable
language. Obtain source-backed clarification/erratum before changing any
original expression. Do not silently substitute another multiple or invent
an industrial explanation.

Disposition: **SCI HOLD + ZHEN HOLD**, both lesson texts.

### d847-F02 [P2]: Precision Correspondence Lacks Wavelength Context

Pointers: `L-ZH /prose/3/text` (line 78), `L-EN /prose/3/text` (line 81),
`REQ /blocks/4/lines` (`p0230#6`).

The modern text associates `1/10` wavelength with approximately `10^-6 cm`
without giving the testing wavelength or explaining this approximation.
A fraction of a wavelength is not a fixed centimetre length. For the green
wavelength later given in the lesson, the tenth is `5.5*10^-6 cm`, a factor
of 5.5 from `10^-6 cm`. This does not prove the surface test used green light;
it demonstrates the missing premise.

Required correction: retain both exact source quantities but separate reported
source sensitivity from a general unit conversion. Supply a source-bound
testing-wavelength/order-of-magnitude qualification if available. Do not change
the exponent or invent an ultraviolet/testing wavelength. No particular
printing/transcription correction is asserted without source-image evidence.

Disposition: **SCI HOLD**, numeric explanation only. Exact tokens **PASS**.

### d847-F03 [P2]: English Display Still Contains Chinese Source Labels

Pointers: `L-EN /prose/3/text` (line 81), `/prose/6/text` (line 129),
`/section_breaks/0/after` (line 662), `/section_breaks/1/after` (line 666);
`E-EN /exercises/0/group` (line 8) through `/exercises/5/group`.

The English prose retains bold `表面加工质量的检验` and `光学增透`. All six
English exercises retain `问题` as group metadata. English explanatory text
beside the headings does not establish a fully English heading/group display.

Required correction: resolve source identity versus learner-facing locale
display through the approved contract. Preserve `source.data`, `source_text`,
`printed_title`, source group and `group_id: g1`; do not overwrite them to pass
English display review. Use only an approved display mechanism and affected
flow-anchor update. If none is authorized, return a scoped contract decision
instead of inventing a mapper or silently replacing identity tokens.

Disposition: **ZHEN HOLD**. Source group identity **PASS**. English title,
locale and Figure 201/202 caption text **PASS**. No UI projection is assumed.

### d847-F04 [P2]: Paragraph Break Interrupts The Amplitude Contrast

Pointers: `L-EN /prose/16/text` (line 300),
`/section_breaks/3/before` (line 673).

The equal-amplitude clause ends `cancel completely;`, followed by a blank
paragraph break and a new paragraph starting `nearly equal amplitudes`.
This cuts a sentence across independently displayed short paragraphs. The
important complete-versus-near cancellation distinction is scientifically
correct, but its English reading boundary is not complete.

Required correction: keep that distinction and make each affected paragraph
an independently readable full-sentence group. A separately authorized revision
may adjust only this prose/anchor. No formula or new scientific claim is needed.

Disposition: **ZHEN HOLD**, exact paragraph text only, not a claimed render bug.

### d847-F05 [P2]: Questions 3-5 Need A Prerequisite/Model Bridge

Pointers: both exercise files `/exercises/2/text`, `/exercises/3/text`,
`/exercises/4/text`; English lines 54, 76, 98. Related lesson pointers:
`/prose/11/text`, `/prose/17/text`, `/prose/20/text`.

The colour-property and underwater-wavelength questions require a connection
between colour and the wave property preserved across a stationary interface.
The lesson states unchanged frequency and different frequencies in white light,
but does not explicitly complete that bridge. The ice-crack question also
requires transfer to an appropriate thin-gap/illumination regime; arbitrary
fractures are not guaranteed to show the source's stated glints.

Required correction: retain all six original written tasks. Establish the
source-bound conceptual/model bridge in the lesson or identify the already
taught prerequisite through an approved learner-facing route. Do not provide
worked answers, choices or grading keys. Do not treat the descriptive ice
scenario as an instruction to perform an experiment.

Disposition: **ZHEN independent-child-readiness HOLD**. Task identities and
translations **PASS**. Prior lessons were not read; missing course-wide teaching
is not asserted and prerequisite coverage is **unverified**.

### d847-F06 [P2]: reference46 Cannot Be Bound To This Source

Pointers: `REQ /requirements/0`; complete `RAW-L /prose` and
`RAW-E /exercises`.

The frozen requirement says to preserve `reference46`. No `46` or identifiable
reference to it occurs in the supplied complete n87 raw lesson, six exercises
or relevant source blocks. An author deletion cannot be proven from a source
that does not contain the referent.

Required correction: source-preparation authority must identify its exact block
and meaning, or supply a separately versioned clarification. Preserve the
original requirements and this failure. Do not fabricate a cross-reference or
guess its destination.

Disposition: **source-requirement HOLD**, only this ambiguous obligation.

### d847-F07 [P2]: Historical Identity Declarations Are Incomplete

Pointers: `L-ZH /prose/18/historical_entities`,
`L-EN /prose/18/historical_entities` (line 351). Gate:
`ld-s10y-lesson/SKILL.md`, cap4 item 3 (line 360).

The retained country and two historical researchers must be declared
individually with source binding. ZH declares only `苏联`; neither named
researcher is declared. EN retains the Soviet attribution and both identifiable
researchers but has an empty declaration list.

Required correction: complete per-object, per-identity provenance using the
allowed contract. Preserve the literal source credit and identifiable
translations. If localized names cannot satisfy the existing same-term
source/modern constraint, obtain a scoped localization decision; do not add an
arbitrary whitelist or rewrite the source. Do not add invention-priority claims.

Disposition: **modern-adaptation provenance gate HOLD**. This is not a finding
that the translated names or the printed historical attribution are false.
External historical authentication was outside the offline scope.

## Scoped Passes

- Both candidate `source.data` snapshots deeply equal the respective raw JSON.
  All 22 source texts and kind/id/printed-page/source-reference identities match
  per language. All ordered dollar-delimited source math tokens are unchanged.
- All six original questions retain numbers `1`-`6`, `source_number`,
  `group: 问题`, `group_id: g1`, source pages, empty figure references and count.
  Both languages' task translations retain the original demands.
- The two footnotes have separate owners `p0231#11` and `p0232#10`; the repeated
  marker does not cause provenance loss. Cross-page prose joins remain bound.
- Normal incidence; air < film < glass indices; both reflection phase reversals;
  geometric `2h` compared with the in-film wavelength; equation `(7.8)`; the exact
  green vacuum wavelength and quarter-wave formula are preserved and explained.
- Equal amplitudes versus near amplitudes, wavelength-selective cancellation,
  violet reflected light versus transmitted light, and lossless-model energy
  conservation are distinguished correctly.
- English `locale: en` is present in lesson and exercises. The English lesson
  title is accurate. Figure labels/captions are `Figure 201` and `Figure 202`.
  The Chinese `printed_title` is valid source provenance, not English display
  approval. Shared Chinese math subscripts are preserved source notation, not
  an excuse for an unregistered formula change.

Full topic-by-topic and six-question assessments are frozen in
[report.json](/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d847-n87-first-independent-text-review/report.json).

## Limits And Preserved Failures

This is text-only independent analysis, not approval of images, diagrams,
answers, choices, grading, rendered blocks, runtime, full edition or publication.
No source images/PDF pages were opened, so transcription fidelity is bound to
the supplied frozen text, not freshly authenticated pixels.

The initial `rg --files` discovery returned exit 2 because the new d847 output
directory did not yet exist. Its successful input inventory remained available;
the failure is retained in `report.json`, not converted into content approval.
All seven substantive HOLD findings remain unrepaired.

Same-source beam splitting and the two-reflected-wave model are pedagogical
idealizations, not a certification of arbitrary path delays, polarizations or
full multiple-reflection designs. Prior instruction of frequency, refractive
index, amplitude, optical path and symbols was not inspected. No visual/runtime
behavior is inferred from text.

## Usage And Stop

One independent substantive review, two tracks, four candidate files, 44 lesson
objects and 12 bilingual displays of six original written questions. Images: 0.
Authoring/repair/second-review rounds: 0. No native/adapt/render/full validator,
tests/build, shared indices/meter, canonical writes, DB/publisher/deploy, Git,
network calls or other chats.

No additional paid-model call was made. Actual model-token billing, monetary
cost and total compute usage are **unknown**, not zero; they are not exposed
in this session. Stop after this frozen review. No downstream approval granted.
