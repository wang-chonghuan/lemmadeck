# Independent SOURCE review: next8p n26

## Verdict

**PASS for selected n26 semantic SOURCE fidelity.** No definite n26 text,
formula, printed-row, caption-grouping or figure-source-inventory correction
was found. This covers the whole source transcription of physical 120 and 121,
and ONLY physical 122's two closing n26 rows plus heading `27. 力`.

**Not mechanical approval and not whole-page 122 approval.** The existing
physical-121 first machine FAIL remains FAIL. Physical-122 finalize has not run.
Local outgoing n27 defects/uncertainties below remain local; neither n25 nor n27
is promoted by this review. No modern FigureSpec/output or display approval.

Reviewer is the sole independent SOURCE reviewer, not the author. Latest direct
human authority is resumed same180-7. Every command used explicit workdir
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180`.

## Independent printed rows

| Physical / printed | Actual distinct source rows | Independent decomposition |
| --- | ---: | --- |
| 120 / 108 | 26 | Incoming n25 exercises 2-7: 10; n26 heading: 1; n26 paragraphs: 2+2+5+5; footer: 1. |
| 121 / 109 | 15 | Two captions on one row: 1; continuation prose: 6+2+1+1; standalone formulas: 3; footer: 1. |
| 122 / 110, selected only | 2 + 1 | n26 closing text: 1; n26 closing formula: 1; outgoing n27 heading: 1. No whole-page count/approval. |

Physical 121 has 16 literal block-body lines because both captions are
transcribed separately, but only 15 distinct printed rows. Its three displayed
formulas each occupy one actual row. The final prose `1/81` numerator and
denominator are also part of ONE prose row. No table is present. Internal
diagram labels are figure facts, not additional text rows.

n26 itself occupies 31 selected instructional printed rows across these pages:
15 on physical 120, 14 on physical 121, 2 on physical 122, excluding source
footers, incoming n25 and outgoing heading 27. Do not add `↵`, duplicate text,
invent a caption row or split fractions to satisfy the machine's 16.

## Source Comparison

Original-only row/object/formula/label inventory was frozen BEFORE candidate
`page.md` or author-report access. Its immutable SHA-256 is
`fe58274e88991e82d27584e3df5f075fa1dd73fb6a3fe2dd78256fa11b028466`.

Compared current candidates:
- `ssot-resources/soviet10year-textbooks/artifacts/8p/pages/0120/page.md`
- `ssot-resources/soviet10year-textbooks/artifacts/8p/pages/0121/page.md`
- `ssot-resources/soviet10year-textbooks/artifacts/8p/pages/0122/page.md`

Physical 120 preserves all incoming exercises without inventing preceding
content; all n26 paragraphs and references to figures 80/81 are present.
Physical 121 preserves the source's `沿以运动`, all three formula chains,
caption `samerow`, and the continuing paragraph.

Retain literal `384000` on physical 120 and `380000` on physical 121; retain
`4700`, `81`, `6\times10^{24}` and `7\times10^{22}`. Acceleration vectors,
radius/mass subscripts, equalities and approximation signs match. Physical 122
preserves `千克` inside the numerator and closes n26 before heading 27.
No modern scientific correction or mathematical erratum is asserted.

An original-only eighth image adjudicated physical 121's final punctuation:
the printed mark is **`因此；`**. Candidate line 85 is correct. The frozen
grid-level inventory initially wrote a comma; that observation is explicitly
corrected in `original-followup-observations.md`, leaving the freeze unchanged.
This follow-up confirms, rather than infers from the author, the semicolon.

## Figure 80 / 81 Source Inventories

Full independent original inventories with stable observation IDs are in the
frozen raw record. Both original-only native figure crops were inspected before
candidate/report access.

- Figure 80: shaded Earth sphere with Earth-center point below/left of internal
  P; Moon disk on solid larger orbit; visible smaller dashed Earth-center path
  about P; horizontal rightward `r_月` radius and short inner `r_地` radius;
  two counterclockwise direction arrows. Labels are `地球`, `月球`, `P`,
  `r_地`, `r_月`; separate caption `图 80`.
- Figure 81: no shaded globe; P common center of solid large and dashed small
  orbits; Earth-center point on lower-left small orbit and Moon-center point on
  upper-right large orbit; the two radii and two counterclockwise arrows.
  Labels are `地心`, `月心`, `P`, `r_地`, `r_月`; separate caption `图 81`.

Candidate grouping, two caption identities, `samerow`, n26 ownership and
declared boxes agree with source layout. Current boxes are `[282,213,603,620]`
and `[932,208,605,617]`. Hash bindings include existing extracted PNGs, but
those PNGs were not additional visual loads. This is not a claimed snapped-
output/vector/modern-image review. No axes, grid, numerical distance labels or
added force/acceleration arrows are original facts.

## Definite Local n27 Corrections

These affect outgoing n27 ONLY and do not invalidate the selected n26 closing
rows. Candidate remains untouched.

1. `pages/0122/page.md:51`, block 5 row 1: replace
   `[HOLD:p0122-b5-r1-g1]` with **`自`**. Independent native pixels show
   `（自称为被加速的`, not a scientifically or stylistically inferred rewrite.
   The held glyph is the one AFTER the parenthesis; `从` at the row start is
   unrelated to the hold. Preserve the unusual printed `自称`.
2. Same local row: `被加速` is visibly slanted but unmarked in the candidate.
   Restore that source emphasis within the parenthetical; do not invent the
   exact wider punctuation span.
3. `pages/0122/page.md:65-66`, block 7: candidate italicizes only `物体` in
   `被研究物体` and isolated portions of the force-definition wording. Native
   pixels show omitted slant in `被研究`, `产生加速度的`, and the connecting
   `的影响，简称为` within the definition phrase. Restore these missing
   typographic portions alongside the already italicized terms.

Local uncertainty: exact punctuation-inclusive endpoints of continuous italic
spans, and the uninspected detailed spans in n27 blocks 4 and 6, are not
independently approved by the two native local crops. Existing author emphasis
HOLD cannot be globally cleared on this report. No whole-122 or whole-n27
semantic approval follows from the independently readable glyph.

## Mechanical Boundary

The current physical-121 audit reports `lines_printed=16`, `lines_md=15`, two
figures, and the row-count failure. Independent pixels show 15 actual rows.
This establishes the semantic expected count, NOT the technical root cause or
a successful repaired run. The separate NON-semantic technical worker owns
counter diagnosis; it was not duplicated here.

Caller reports physical 120 machine PASS 26/26, physical 121 first FAIL
16-counted/15-authored, and physical 122 not finalized after that failure.
Those statuses are not overridden. First failure artifacts remain untouched at
`pages/0121/finalize-first-failure/` and the existing initial receipt paths.

## Evidence and Handoff

All following paths are relative to the explicit workdir above:

- `.intentfold/tickets/STEMROBIN-180/raw/n26/source-review/independent-original-observations.md`
- `.intentfold/tickets/STEMROBIN-180/raw/n26/source-review/original-followup-observations.md`
- `.intentfold/tickets/STEMROBIN-180/raw/n26/source-review/current-source-figure-bindings.json`
- Original crop evidence directory:
  `.intentfold/tickets/STEMROBIN-180/raw/n26/source-review/original-crops/`

Minimal binding file records the three original native-page hashes, current
candidate hashes, figure identities/boxes/output hashes, original detail-crop
hashes, and selected physical-122 n26/heading substring hashes. It contains no
full-package hash or large pixel arrays. A local n27 repair changes the whole
122 candidate hash but does not require repeating n26 semantic review if its
selected n26 and heading bindings remain unchanged; perform affected binding
confirmation instead.

Final image use: **8 actual loads = 3 grids + 5 original-only native crops;
8/8 batch, 8/24 current context.** The seventh-load freeze and original-only
eighth-load follow-up are both retained. No image payload is returned to parent.
No further image load is authorized within this batch.

No candidate, shared source, renderer or tests edited. No prepare/finalize/
assemble/vectorize/modern/DB/Git/install/paid call/new worker/chat/tree/timer
executed. No historical full package, answer/choice key or delivered n12 was
read. Review evidence only was written.

Waiting for an explicit affected/current-source binding request or modern-phase
handoff. A modern task needing new visual inspection requires a fresh bounded
image context; the present 8-image batch is exhausted.
