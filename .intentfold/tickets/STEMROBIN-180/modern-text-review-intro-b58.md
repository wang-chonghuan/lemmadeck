# Independent FIRST TEXT Review: B58 Introduction

Ticket: STEMROBIN-180. Assigned course: `phy8-c1-s1-t1` only.
Review date: November 17, 2026. Existing production invocation continued.

## Decision

**FIRST TEXT: REVISE. Whole-course TEXT: REVISE. Production disposition: HOLD.**

This is a complete independent reading of all 14 candidate blocks against all
14 supplied original blocks, not a source-review repeat or a gate execution.
Textual retention and knowledge structure pass; truthful historical/scientific
teaching does not. Source fidelity is not an endorsement of the source's facts.
No source or candidate repair was performed, and no repair is authorized here.

## Findings

### F1 [P1] The source footnote teaches an invalid certainty argument

Candidate block 12, `p0014#10`, `lesson.template.json:214`; its historical
conclusion is in block 9, `p0014#7`, line 145.

The retained footnote says the calculation cannot be wrong, gives approximately
200 years between total eclipses at one place, and asserts there was only one
solar eclipse in the entire Don-steppe region during the twelfth century.
Those are not interchangeable claims:

- NASA's major-city introduction gives an approximately 375-year average
  between total eclipses at the same place, with substantial interval variation
  [S1]. The candidate's unrestricted 200-year rule is not supported by that
  source. This does not justify silently substituting a new number.
- An average recurrence interval is not a minimum interval or a uniqueness
  proof for a particular century. A point is not a whole region, and a total
  eclipse is not every solar eclipse. This is an independent logical defect,
  even if the 200-year estimate were accepted.
- NASA explains that most local observations are partial even when an event is
  globally classified as total, and that local circumstances must actually be
  calculated [S1]. Its catalog distinguishes the eclipse types [S2].
- The regional "only one eclipse" assertion is not established by those
  premises. I did not calculate a regional century-wide catalog and do not
  claim an independently verified replacement count.

This footnote is ordinary candidate teaching in a `small` span, not an explicit
quotation identified to the child as a disputed historical assertion. The
source-role labels and transparent assembly fix do not supply that distinction.
Its blanket infallibility claim therefore remains an essential teaching defect.

### F2 [P1] The Igor example confuses global totality with local observation

Candidate block 9, `p0014#7`, `lesson.template.json:145`, read together with its
block-12 footnote.

NASA confirms a globally total eclipse on **May 1, 1185, Julian calendar** [S2].
That supports the astronomical event and date, not a total eclipse at Igor's
camp, his precise boundary location, or an infallible historical identification.

The university-hosted Kiev Chronicle excerpt places the solar observation on
the journey toward the Donets and describes a remaining moon-like Sun [S4].
Espenak's published umbral-path table supplies the complementary astronomical
constraint: at 14:36 UT1 its southern limit is 57 degrees 40.3 minutes N,
32 degrees 22.6 minutes E; at 14:38 it is 57 degrees 12.2 minutes N,
36 degrees 25.3 minutes E; at 14:40 it is 56 degrees 33.7 minutes N,
40 degrees 54.5 minutes E [S3].

**Independent inference from the chronicle location and these path limits:**
the Donets/Don-steppe campaign observation was outside this northern totality
band; describing that local historical observation as a total eclipse is not
truthful. A crescent-stage description alone would not prove this; the path
constraint matters. The candidate conflates an eclipse's global catalog type
with what the historical observers saw.

The useful teaching idea, using astronomical reconstruction to help date a
historical account, survives. Its current local-totality explanation and
certainty do not. The chronicle separately gives an April 23 departure [S4];
that is not permission to replace May 1 with April 23, since departure,
eclipse observation and battle are different events. The exact camp position
and the claimed unique regional century count were not independently established.

## Complete Block Review

Ordinals below are one-based candidate `prose[]` positions. Every row has an
identical corresponding raw `source_text` and identical source references.

| Block | Source refs | Entire content / teaching assessment |
| --- | --- | --- |
| 1 | `p0013#4` | All seven sentences retained: scientific prediction/explanation; chemical industry; cultivation, nutrition, growth, seed/soil outcomes; engineering design. PASS for this applied-science introduction. Universal wording is introductory rhetoric, not an independent precision theorem. |
| 2 | `p0013#5` | Place/time of events and the two parenthetical questions retained. Space/time under-dot emphasis retained. PASS. |
| 3 | `p0013#6`, `p0014#1` | Full mechanical-motion introduction and closing question retained across pages. PASS. |
| 4 | `p0014#2` | Position is explicitly relative to another body. PASS in the classical macroscopic setting. |
| 5 | `p0014#3` | Position changes with time, read with blocks 4 and 6 rather than as reference-free absolute motion. PASS. |
| 6 | `p0014#4` | Complete relative-position definition; whole definition bold, three body terms italic. PASS. |
| 7 | `p0014#5` | Mechanics subject and principal position-prediction problem retained, including both under-dot spans. PASS as the introductory course objective, not a guarantee for every unconstrained real-world system. |
| 8 | `p0014#6` | Astronomical position calculation and solar/lunar eclipse prediction retained. PASS: NASA explains forward/backward mechanics-based computation with measured positions/speeds and finite accuracy [S5]. |
| 9 | `p0014#7` | Complete historical example, title, identities, date and raised note marker retained. Fidelity PASS; truthful teaching REVISE, F2 and associated F1. |
| 10 | `p0014#8`, `p0015#1` | Full rocket/satellite explanation and closed Soyuz/Apollo docking example retained. PASS; date, continents and identities checked independently [S6]. |
| 11 | `p0014#9` | Actual source-footnote separator retained as `---`; not missing prose, a new exercise, or permission to discard the note. Text retention PASS; no visual-render claim. |
| 12 | `p0014#10` | All three footnote sentences, circled-one marker and small-text wrapper retained. Fidelity PASS; truthful teaching REVISE, F1. |
| 13 | `p0015#2` | Both projectile-trajectory and multi-operation conveyor-position applications retained. PASS as mechanics applications; no new operational or answer-bearing instructions added. |
| 14 | `p0015#3` | Full course preview for rockets, satellites, planets, projectiles and other bodies retained; explicitly computation in principle. PASS; closed terminal sentence. |

The broad introductory statements in blocks 1, 4, 7, 8, 10 and 13 were judged
as classical model-based prediction, not accepted as assertions of unlimited
real-world precision. F1 is different: it explicitly teaches historical
infallibility through an invalid argument, which introductory simplification
does not excuse.

## Boundary And Fidelity

- Full original and candidate contain **14 blocks**, including the separator
  and footnote, **zero exercises**, **zero figures**, and **zero formula objects**.
  Formula equality here is a checked empty set, not a sampled formula claim.
- Both raw `source.data` snapshots equal the supplied raw objects exactly, and
  both `source.sha256` values match their raw input bytes.
- Every block retains `kind`, `id`, `label`, `printed_page`, `source_refs`,
  source wording and HTML tag sequence. After normalizing periods and whitespace
  only, all 14 texts equal. No substantive word, formula, date or number changed.
- Chapter, section, title, printed title, null number, IDs, start-page fields,
  exercise count and figure lists equal the original. No next-unit material was
  imported into the supplied course.
- The two incoming/outgoing joins are present: `p0013#6 + p0014#1` and
  **`p0014#8 + p0015#1`**. The latter finishes both spacecraft names, closes
  quotation/parenthesis and ends the docking sentence. The source-footnote rule
  and note remain separate retained objects and did not swallow the continuation.
  Blocks 13 and 14 follow, ending with a complete course-preview sentence.
- The circled-one reference and body remain equivalent `&#9312;` entities.
  The added whitespace inside the superscript and small span does not remove
  the marker. Entity code point 9312 is not an added historical number.
- The historical date `1185 / 5 / 1`, docking date `1975 / 7 / 17`, and footnote
  number `200` all remain unchanged; every `numeric_changes` array is empty.
  Unchanged 200 is part of the factual problem, not a successful correction.
- Six declared identities are verbatim source-bound: Igor, Polovtsy, Soviet
  Union, Soyuz, Apollo and Don. Their reasons declare provenance only, not the
  accuracy of the surrounding claims. The USA and the two continents remain
  visible in both texts but are not separately declared; this is a declaration-
  completeness observation under the lesson skill, not an invented source repair.
- `changes` is `layout` for 13 blocks and empty for the retained separator;
  `errata=[]` and `section_breaks=[]`. There is no registered factual correction,
  corrective annotation or explicit historical-quotation framing in this packet.
  Rendered paragraph flow, footnote presentation and UI behavior were not tested.

## Satellite Date And Technical Claim

NASA records both launches on **July 15, 1975**: Soyuz from Baikonur, Kazakhstan,
and Apollo from Kennedy Space Center, Florida; docking occurred on
**July 17, 1975 at 12:12 p.m. EDT** [S6].

The candidate's July 17 date governs the docking predicate. Its wording describes
vehicles launched from two continents; it does not require reading July 17 as
their launch date. Asia/America therefore remain consistent with the recorded
sites. Both were Earth-orbiting spacecraft, so the source's broad satellite
classification is not a separate orbital-physics error. NASA also describes
their orbital adjustments, supporting the mechanics application without implying
that laws alone, absent initial conditions or control, accomplish docking.
**No satellite date/name correction is required by this review.**

## Public Evidence

Web search was attempted for discovery; public page readings used `cloak-fetch`,
not a built-in browser/page fetch. Successful text receipts below include URL, title,
HTTP status, complete rendered stdout, stderr, exit code and SHA-256. Browser
images/maps were not opened or returned into this review context.

| ID | Public authoritative/primary source | Bound scratch receipt |
| --- | --- | --- |
| S1 | NASA/GSFC, Solar Eclipse Visibility from Major Cities, same-place averages, local versus global eclipse type; `https://eclipse.gsfc.nasa.gov/SEcirc/SEcirc.html` | `nasa-eclipse-frequency.receipt.json` |
| S2 | NASA/GSFC, Five Millennium Catalog, 1101-1200, May 1, 1185 entry and calendar conventions; `https://eclipse.gsfc.nasa.gov/SEcat5/SE1101-1200.html` | `nasa-eclipse-catalog.receipt.json` |
| S3 | Fred Espenak, primary computed totality path, May 1, 1185, EclipseWise; `https://eclipsewise.com/solar/SEpath/1101-1200/SE1185May01Tpath.html` | `espenak-1185-path.receipt.json` |
| S4 | University of Toronto-hosted Kiev Chronicle excerpt, expedition of Igor Svyatoslavich against the Polovtses; `http://www.individual.utoronto.ca/aksmith/resources/IGOR.HTM` | `kiev-chronicle-http.receipt.json` |
| S5 | NASA Science, eclipse FAQ, mechanics, initial positions/speeds, forward/backward integration and finite forecast accuracy; `https://science.nasa.gov/eclipses/faq/` | `nasa-eclipse-faq.receipt.json` |
| S6 | NASA, The Apollo-Soyuz Mission, launch sites/dates and docking; `https://www.nasa.gov/missions/apollo-soyuz/the-apollo-soyuz-mission/` | `nasa-apollo-soyuz.receipt.json` |

Limitations preserved rather than counted as successful evidence:
`steele-1185-history.receipt.json` records an HTTP 404 despite process exit 0;
it does not establish access to the scholarly paper. `kiev-chronicle.receipt.json`
records the failed HTTPS transport, exit 1; the public HTTP page was subsequently
read successfully. S4 is a university-hosted translation of a primary chronicle,
not direct examination of its manuscript. Search snippets and the unread paper
are not the factual basis of F1/F2. The FAQ's stale "next eclipse" text was not
used for current schedules.

The first exploratory NASA mission read and first successful HTTP chronicle
read were repeated solely to capture full byte-bound public-page receipts.
They are not additional source-textbook reviews or gate reruns.

## Exact Input Binding

Root: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
R = `.tmp/ld-s10y-lesson/b58-intro/artifacts/8p/lessons/phy8-c1-s1-t1/`.
C = `.tmp/ld-s10y-lesson/b58-intro/work/adapt/8p/modern-us-neutral/lessons/phy8-c1-s1-t1/`.

| Exact input | Bytes | SHA-256 |
| --- | ---: | --- |
| R `lesson.json` | 6289 | `e86212391f3dfc9819640a04ef190c157deb967475139198b504a912132aa2b7` |
| R `exercises.json` | 65 | `1f130928f6601af02653534eec7d711e573f79bc96361052d4d5909fe870e7df` |
| C `lesson.template.json` | 19885 | `5c04e46d73ca40847932efc6499b8e96418703433c8e2e95e75aad85467b7c23` |
| C `exercises.template.json` | 416 | `272be8a77f10eb793f492b04794fe677e0645daccf02e12e0090a7992364101e` |
| C `figures.template.json` | 152 | `4d0328a20aa44f7f53c4670530f3d106f8c37312ba977bcc0fd7e887997f72e8` |

The two existing reports were read **for provenance only**, not as independent
modern-text judgments:

| Report | Bytes | SHA-256 |
| --- | ---: | --- |
| `source-review-8p-1314.md` | 17196 | `3d9399162755af94082e0465d19f51f2247214670d71858996cd19d24fe5c669` |
| `source-review-8p-1516.md` | 5172 | `559ab3187a9b3f2eda10846b12daabe3ec82bce17a61cc0a61a4f68f9e9d984e` |

Scratch: `.intentfold/tickets/STEMROBIN-180/tmp/b58-intro-text-review/`.
`input-bindings.json` binds the seven read inputs and their byte-preserved
snapshots. `text-comparison.json` preserves every raw/candidate block and the
read-only comparison. `review-decision.json` records the whole-course verdict.
`manifest.json` binds the exact final report bytes/SHA-256, all five raw/template
inputs, both provenance reports and the scratch receipts, checking that inputs
still match the reviewed snapshots. Report hashing is external to avoid a
self-referential report digest. These receipts are not a publishable course
dependency or an existing product gate.

## Budget And Ownership

The known physical-page-14 source repair budget is **1/1 used, 0 remaining**,
as stated in the supplied source review. The later source-footnote transparency
fix and successful cross-page closure are not a source-content repair or a
budget reset. The reviewer did not reopen page pixels or recheck old source
audits. No source-page-byte freshness claim beyond the supplied provenance is
made; the two supplied raw lesson/exercise inputs are byte-bound here.

**HOLD this candidate.** Resolution of essential factual/teaching defects needs
an explicit, recorded author/human disposition consistent with the existing
invocation and exhausted source budget. Do not quietly edit the raw page,
retranscribe it, substitute a new date/count, drop the footnote/history, treat
entity declarations as corrections, rerun gates, or publish this packet.
This review supplies no automatic repair route or second-review authorization.

Only this new report and the owned scratch directory were written. No freshness
or setup restart, backend access, DB connection, service operation, publish,
promotion, Git operation, code/product edit, gate run or source review repeat
occurred. Other dirty work was not modified.

Actual image loads: **0 total, 0 source, 0 reopens, 0 screenshots**.
Text-only results; no image payloads returned. No formal handoff, book-wide
approval or production acceptance is claimed.
