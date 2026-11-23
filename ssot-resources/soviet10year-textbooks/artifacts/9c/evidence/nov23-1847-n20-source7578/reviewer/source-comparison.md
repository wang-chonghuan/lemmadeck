# Phase B: bounded TEXT-only source comparison

Date: 2026-11-23. Ticket: STEMROBIN-184. Finish: review.
Sole cwd: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.
Write ownership: this `reviewer/` directory only.

Status: **TEXT COMPARISON RECORDED; SPECIFIC DISCREPANCIES AND OPTICAL LIMITS
REMAIN. NO BLANKET SOURCE/NATIVE APPROVAL.**

Phase A files are preserved byte-for-byte, including UNKNOWN-U1 through U4.
No original, native image, crop, screenshot, or other image was opened in Phase B.
Image opens added: **0**. Initial source batch remains **4**, context remains **4**.
No candidate changes, source-math replay, mask, count exclusion, normalization,
generation, DB, Git, network, browser, keyboard production, or peer message.
Source75 unchanged prose/math review is reused, not substantively repeated.
The pre-existing source75 figure9 HOLD is NOT released.

## Findings

References to blocks below are the disclosed candidate JSON's one-based array
positions, not previously invented source block IDs. All candidate references
are relative to the sole cwd under
`.tmp/stemrobin-184-six/n20-nov23-source7578/raw/9c/pages/`.

### B1: shared request lacks its source-established owners

Location: `0077/page.md:80`, `0077/page.json:126`, block6 / `blocks[5]`;
the explanatory note is at `0077/page.md:10`.

Phase A S77.05 independently assigns
`用两种几何方法表示下列各数列(a_n)` to exercises **153 and 154 only**.
The candidate retains the text as a plain `p`, but declares no `owners-ex`
on its block header. Its JSON has `owner_exercise: null` and no plural-owner
field. The note explicitly says `no invented shared-prompt ownership`.

This is a concrete source-ownership omission, not an unreadable glyph or a
count failure. Preserving words as unowned lesson prose does not bind the full
request to either independent exercise. Installed lesson block instructions
require an explicit `p owners-ex` declaration for a multi-exercise request;
they prohibit guessing ownership from proximity during assembly.

Affected criterion: the shared request must bind to both 153 and154, without
spilling into 155-158. The frozen independent source inventory already supplies
this ownership evidence; no additional image or mathematical solution is needed
for this finding. No candidate was edited, and no assembly was run here; downstream
loss is a risk from the missing declaration, not an observed database result.

### B2: exercise155 wording differs from the frozen source

Location: `0077/page.md:90`, `0077/page.json:169`, block9 / `blocks[8]`.

Phase A S77.08 records:
`随便用一种几何方式表示数列(x_n)。说明是否存在着一个数...`

Candidate:
`随便用一种几何方法表示数列(x_n)．说明是否存在一个数...`

Differences: `几何方式` becomes `几何方法`; `存在着一个` loses `着`.
These are source-text discrepancies, not algebraic discrepancies. The candidate
still requests one method and asks about a limiting number. All four subpart
formulas and their order match the frozen inventory.

The same wording already occurs in the retained original draft and FIRST native
triple; zero native normalizations therefore do not clear the author-level
transcription discrepancy. Any intended faithful-text repair belongs to the
parent's authorized affected work. If the parent disputes the frozen wording,
only exercise155's short stem requires a later optical adjudication; not its
formulas, answer mathematics, or the whole page.

### B3: N21 introduction drops a source word

Location: `0078/page.md:64`, `0078/page.json:107`, block5 / `blocks[4]`.

Phase A S78.05 records `前一小节中的第三个例子`.
Candidate has `前一小节中第三个例子`, dropping `的`.

This is a local faithful-text discrepancy. It does not change the referenced
example number or formula. It is already present in the retained original draft,
not introduced by native normalization. The N21 heading and boundary are retained
correctly; this finding does not authorize appending N21 prose to N20.

### B4: example4 decimal-point reading conflicts; remains optical UNKNOWN

Location: `0077/page.md:65`, `0077/page.json:81`, block2 / `blocks[1]`;
candidate note at `0077/page.md:7`.

Frozen S77.02 has `alpha_2=0.33`. The candidate has `\alpha_2=0\,33`,
with an explicit spacing command instead of a decimal point.

The candidate note reports that an earlier tentative decimal reading was not
confirmed by a preregistered native ROI, and that a gap followed by33 is retained.
That note is a disclosed author observation, NOT newly inspected optical evidence
in this TEXT-only review. The retained original draft supplied in this bundle
already has `0\,33`; this bundle does not itself expose an earlier `0.33` version
or prove the note's historical transition.

Record an unresolved reading conflict, **not** automatic restoration of `0.33`,
automatic endorsement of `0\,33`, a newly approved source erratum, or a forced
modern interpretation. The repeated-decimal mathematics in Phase A is unchanged;
it is not pixel evidence for a missing dot. A later authorized native-scale
source ROI confined to the `alpha_2` token/gap is the affected evidence needed.
No new history package, whole-page review, or mathematical replay is needed.

### B5: exercise157 candidate symbol does not resolve UNKNOWN-U2

Location: `0078/page.md:52`, `0078/page.json:68`, block2 / `blocks[1]`;
candidate note at `0078/page.md:6`.

Candidate uses `z_n` and declares `reads z_n, retained from own original`.
Phase A deliberately froze the base glyph as UNKNOWN-U2 / `SEQ157(n)`,
without choosing a codepoint from mathematics.

The readable fraction `1/(2n+1)`, subscript n, task, reference point0,
and both strict thresholds agree with the freeze. A disclosed author reading
of `z` does not independently clear this reviewer's unknown. It is not declared
wrong merely because the first whole-page observation was x-like/n-like.
The affected evidence is a later authorized source ROI around this base glyph
and subscript, not a supplied answer, alternate symbol convention, or re-solving.

### B6: disclosed top-formula ink ambiguity is not cleared by formula matching

Location: `0076/page.md:7` and `0076/page.json:7`; opening display is block1.

The candidate's recognizable opening limit expression matches Phase A S76.01.
Its note separately reports an irregular horizontal cluster between the fraction
and the clear equals sign, with sign/damage/scan-or-print provenance UNKNOWN.
The independent Phase A formula/math check does not certify that every intervening
stroke was encoded or that an extra sign may be erased.

Keep this newly disclosed localized ink uncertainty in addition to, not instead
of, UNKNOWN-U4's weak figure-guide uncertainty. A later authorized ROI around the
top display's fraction-to-equals interval is the affected evidence. Do not infer
an extra equals sign, strike-through, correction, or harmless noise from the
valid algebra or the count target.

### B7: punctuation/codepoint differences are not silently adjudicated

At `0076/page.md:116` / JSON block8, candidate `这一点就更明显了．当...`
differs from frozen S76.06's `这一点就更明显了，当...`.
At `0077/page.md:70` / JSON block3, candidate `差越来越小．自然...`
differs from frozen S77.02's `差越来越小，自然...`.
At `0076/page.md:102` / JSON block4, the example3 formula/domain separator
is `；`, while the freeze used a comma in its formula transcription.

These are explicitly recorded punctuation-level differences against the freeze,
not confirmed replacement instructions from new pixels. The candidate describes
its dot-shaped full-stop convention; that convention does not decide comma versus
full stop in a particular ink cluster. Parent may adjudicate only these short
affected spans if literal punctuation certification is required.

UNKNOWN-U1 remains: the installed Cyrillic subpart convention is consistent with
the candidate, but optical a-shaped script identity is not proved by codepoints.
UNKNOWN-U3 remains: the two generalized limits are retained, including the prime,
but no arbitrary-real approximation construction is supplied on these pages.
UNKNOWN-U4 remains: no exact weak figure-guide/edge geometry was inspected here.

## Complete object comparison: source76-78

This compares text/formulas/structure against the already frozen inventory.
It does NOT repeat independent exercise solving or extend the source scope.

| Frozen object | Disclosed candidate | TEXT comparison and limit |
| --- | --- | --- |
| S76.01 incoming example2 limit | 76 block1, `p cont` | Recognizable expression retained; correct incoming continuation, no invented heading. Extra-ink provenance remains B6. |
| S76.02 figure10/caption | 76 blocks2-3 | One figure10, one caption, no exercise owner. Candidate inventory matches five alternating-side upper points and five labeled lower term locations. Pixel fidelity remains unchecked. |
| S76.03 example3 | 76 block4 | `(n-1)/(3n)`, positive-index domain notation retained. Separator punctuation differs as B7. |
| S76.04 example3 explanation/rewrite | 76 block5, `p open` | All prose content and `1/3-1/(3n)` retained; printed break splits the quoted word 趋/向 without dropping it. Explanation remains open through figure11. |
| S76.05 figure11/caption | 76 blocks6-7 | One figure11 and separate caption; four point locations, reference1/3, zero/first-term coincidence, lower-point order retained in notes. No native pixels reviewed. |
| S76.06 outgoing example3 explanation | 76 block8, `p cont open` | Tail `因` retained; open/continuation flags correct. Punctuation difference B7. |
| source76 footer | 76 block9, `foot` | Printed page69 retained separately, not lesson prose. Ornament codepoint fidelity not independently certified. |
| S77.01 incoming example3 completion | 77 block1, `p cont` | Begins `此差`, joins frozen tail `因` correctly; error-term prose and concluding limit retained. Object closes here. |
| S77.02 example4 heading/displays/annotation | 77 block2 | First/third explicit decimals, repeated3 display, brace notation, n-digit annotation retained. Second-decimal conflict B4 remains. Annotation is formula typography, not an invented numbered figure. |
| S77.02 example4 explanation | 77 block3 | Conclusion/prose retained; punctuation difference B7. No replacement approximation algorithm introduced. |
| S77.03 generalized limit statement | 77 block4 | Both `lim`, both lower n-to-infinity annotations, `alpha_n`, `alpha'_n`, and final alpha retained; UNKNOWN-U3 unchanged. |
| S77.04 exercise heading | 77 block5, `exhead` | 习题 retained as exercise group, not a numbered lesson. |
| S77.05 shared request | 77 block6, plain `p` | Words retained, required owner declaration absent: B1. |
| S77.06 exercise153 | 77 block7, `ex 153` | Both formulas `(n^2)/2-6` and `(2n+3)/n`, first/second order and grouping retained. Task inheritance incomplete until B1 is handled. |
| S77.07 exercise154 | 77 block8, `ex 154` | Multiplication n outside `(-1)^n` and numerator plus in `(1+(-1)^n)/n` retained; task inheritance incomplete under B1. |
| S77.08 exercise155 | 77 block9, `ex 155` | All four formulas, plus sign, exponent n+1, one-method request and finite-number question retained. Stem word differences B2. |
| source77 footer | 77 block10, `foot` | Printed page70 kept outside prose/exercises. No figure/caption/table added. |
| S78.01 exercise156 | 78 block1, `ex 156` | Full distance-to-point2 request, defining fraction and indices5/20/100/1000 retained. No indexed-plane distance substituted. |
| S78.02 exercise157 | 78 block2, `ex 157` | Value-axis task, fraction, limit request, point0, strict 小于0.1/0.01 retained. Glyph declaration does not clear B5/UNKNOWN-U2. |
| S78.03 exercise158 | 78 block3, `ex 158` | Defining fraction, limit claim3, judgment question, point3, strict 小于0.1/0.04 retained. One literal `↵` records the frozen observed fraction-to-`=3` line break; equality remains inside one complete formula. |
| S78.04 N21 boundary | 78 block4, `h3` | Printed21 and 数列的极限的定义 retained; exercises156-158 precede the boundary. No guessed N21 stable ID or exercise159. |
| S78.05 N21 introduction | 78 block5, `p` | Quoted formula, arbitrary-small-difference claim, comma after closing quote, and 含意 retained; missing 的 is B3. This block is N21, not N20. |
| S78.06 N21 question/error display | 78 block6, `p` | Question, absolute-value bars, negative error, denominator3n and threshold0.001 retained. No independently derived answer injected. |
| S78.06 N21 inequality/setup closure | 78 block7, `p` | Full strict inequality and closing 的自然数n retained. Sentence closes; whole N21 remains incomplete outside the reviewed boundary. Do not mark a closed sentence open merely because the topic continues. |
| source78 footer | 78 block8, `foot` | Printed page71 separate; no numbered figure, table, teaching footnote or supplied answer added. |

All six original exercise objects are complete within these pages; their
subpart order/grouping matches the freeze. The omission of shared ownership
is not cured by complete numeric labels/formulas. Stable assembled source_refs,
N20 lesson output, actual request attachment, and publication were not disclosed
or tested here.

## Source75: new figure9 metadata only

Inspected only page metadata, figure/caption blocks, notes relevant to figure9,
and native audit. Prose/math bodies were not substantively re-reviewed.
Retained bytes were hashed for snapshot identity; a mechanical original/native
body inequality was not interpreted as source75 text drift and is not used to
extend the authorized review.

`fig-09`, label `图 9`, native box `[748,402,605,493]`.
Audit `from` rough box `[742,395,625,505]`, connected components48.
The figure/caption metadata agrees between page.md frontmatter, page.json and
audit.json. Caption is a separate `cap`, `samerow: true`; the historical prose-row
sharing claim is reused, not independently re-certified.

Candidate figure note agrees with the frozen optical inventory: five upper
positive descending term points; lower four labeled locations in order
y4,y3,y2,y1; no y5 label, no connecting curve or added numerical y-height labels.
That is semantic-note agreement, NOT crop-pixel agreement.

Additional disclosed candidate uncertainty: both zero-shaped origin glyphs may
be0 orO; lower-line left-end ink is not established as an extra point. Preserve
those author UNKNOWNs. The freeze's zero-shaped reading and four labeled-point
inventory do not resolve exact character intent or the left-cap ink. Do not
manufacture a fifth lower term, label y5, or erase the cap to force four components.

The metadata's rectangular extent, the reported component count, and native
22/22 cannot show that every axis arrowhead, dot, label, weak guide, or subfigure
marker survived snapping. The caption is not figure data. No retained native PNG
was decoded or opened, and no figure-pixel hash or source/crop identity assertion
was tested. Existing figure9 HOLD remains unresolved.

## Native receipt and source-declaration limits

Raw triples were compared to retained `first-native/<page>/` triples:
**all twelve files byte-identical** at the read snapshot.
For every page, page.md frontmatter equals page.json meta, figure box metadata
agrees with audit.json, and the declared render SHA-256 agrees with the Phase A
original-input SHA-256. This verifies declaration consistency, not a new render
or an independently certified PDF-to-image transform.

All four declare the same PDF name/hash and profile ID/hash. The PDF/profile
bytes were not opened, fetched, validated or refreshed. Candidate use of
`provenance.normalized: true` describes pipeline processing; it is not evidence
of manual corrections, optical approval, or a passed source review.

| Native page | Actual FIRST receipt | Normalizations | Count exclusions | Source-review consequence |
| --- | --- | --- | --- | --- |
| 75 | no native errors;22/22 | 0 | none | Does not release figure9 HOLD or approve its crop. |
| 76 | FAIL;11/9, single line-count error | 0 | none | Original failure preserved. Does not prove two missing prose rows or authorize masks. |
| 77 | no native errors;19/19 | 0 | none | Does not bind shared owners, restore omitted wording, or resolve decimal ink. |
| 78 | no native errors;20/20 | 0 | none | Does not resolve glyph157, omitted 的, or approve the entire N21 unit. |

All audits have empty `unknown_chars`, empty KaTeX warnings and errata0.
Those machine lists do not erase explicit UNKNOWNs in the frozen review or
candidate notes. Candidate76's extra ink and candidate77's missing-dot
provenance were expressly not registered as confirmed source math errata.

Notes claiming prior native ROIs/StageB punctuation evidence remain claims
within the disclosed candidate. Those referenced histories/images were not
reopened here. The recurring note `Outer80 remains UNKNOWN` is not evidence for
an uninspected page nor a substitute for the locally established76-to77
continuation or the78/N21 boundary. No new outer-page work was undertaken.

### Native76 count-only diagnostic: what follows and what does not

Parent supplied read-only localization:
extra band816-859 at x0-83; extra band1641-1672 at x0-142;
adjacent band860-904 includes a caption.
No diagnostic images/log files were opened in this review.

Metadata boxes:
figure10 `[535,333,620,505]`, audit rough `[530,320,640,520]`, components40;
figure11 `[245,1489,1211,460]`, audit rough `[245,1480,1220,470]`, components104.
Treat rectangular intervals as descriptive extents here, not a pixel ownership
proof or a declaration about inclusive-edge implementation.

The supplied narrow x strips lie left of both declared figure rectangles.
Frozen S76.02/S76.05 already record marginal blotches/isolated ink and two
separate figure captions. Thus the localization is **compatible with**
margin-ink participation in counting; no missing semantic prose/formula object
was found in the frozen-versus-candidate object inventory.

It does NOT establish the exact strips' provenance, their exclusive ownership,
that every pixel is a scan artifact rather than original ink, or that the
authoritative native count should equal9. Frozen margin observations contain
no pre-approved exclusion boxes or exact connected-component provenance.
11/9 remains the actual first failure. A diagnostic reduction to9 would be
an intervention result, not source evidence.

The neighboring860-904 band includes caption content according to the parent.
The independent inventory also requires caption 图10. No whole-row deletion
covering that band, broad margin extrapolation, caption-in-figure relabeling,
new `samerow`, omitted text, fabricated `↵`, expected-count override, or altered
source/crop pixels is authorized. The lower strip overlaps figure11's vertical
region but is horizontally outside its declared box; that fact alone does not
authorize excluding it or expanding/shrinking the instructional crop.

Needed affected evidence, if parent later authorizes: original-native-scale
local observations for exactly the two reported strips, with adjacent ink
retained to establish the provenance and caption/figure separation. Bind any
read-only diagnostic receipt to the frozen source hash, exact queried strip
coordinates, intervention description, and original/before-after bands. Only
then can the parent decide whether an allowed `count_exclusions` entry is
source-supported. This report neither creates nor approves any such entry.

## Retained identity

Phase A unchanged SHA-256:

- `source-first.md`:
  `a658471effaa159744072cdcff5255cdaf8b4225b6747797ae55b6a4fa244b5f`
- `exercise-math-first.json`:
  `4dddc84c3f6d5d3099a316a2b51898fd0073b0a9b64dfcff26e6a4e17f64173d`

Candidate snapshot SHA-256. Each equals the corresponding retained FIRST file:

| Page | page.md | page.json | audit.json |
| --- | --- | --- | --- |
| 0075 | `330d675f95c4b41dcabe9d6a02a486a9f270251c4ccb353f776398047ff81049` | `a932080acadaf37cd9a08b499c0d7c41bb20bcbeade8555806372e59417c538c` | `41f537ddcf8fcfd5e9c8a3b6b4ec86258aaf94848dc7614308065ea51fec0c26` |
| 0076 | `4c648736065d73d1ce0986b55b77800a04489540147d5d80bec31783761669df` | `cb05f5293c6c16de7ce30c2f0bd1192b2cdae9e3ba4a697e7f8a2dc2da58f488` | `1845b5066795807d472263410606bdc6d08a85864d67a40cea34834f1618338e` |
| 0077 | `6fe24a1bcaf62b69d1993614f13e2c26ed273b88d29f78ab2d094d249acf30d7` | `3ad5968428779176d3499e12d2b53e3275dbcfbabf9758f58694b6bf790c0fbb` | `9b426f6dbfc5a8b171f6609e9dfd46952d40033f79d65f0d61a0123bbe9c1ce8` |
| 0078 | `ab2e54b71cc27aa6c322a2116f071732dfd1685c84d6f8ce9cf68eba27694612` | `6f28a4077b75f7e8328eafcda94a49055d3fa413cded3f164b24b57663432a7f` | `f274a797fbd5b456ea7a9b560540bc67400559c633a913a05522b40733998ee8` |

Retained original drafts are source-author transcriptions, not replacement
original pixels. Their hashes:
0075 `983011245aad56446e0408bd1a63bc1329ce609c84542b3a1082e319ee57e069`;
0076 `dfc1bbbfce9d6e28375cf7de5c104465c8719ce1ba0bd4b15e29330d0d4db191`;
0077 `be5b40387e1a6b26ff28eae3a3e1c15ad3048eb152b5f3fa355767919121d04d`;
0078 `aff680b3cf43f901753be0351bab742f7340de8b8c006c127411940ff1c162ba`.
Draft77/78 bodies equal the disclosed native MD bodies; draft76 gains snapped
figure coordinates and image links. No author prose change on76 was detected
between its retained draft and candidate. These retained-version comparisons
do not override the independent source disagreements B1-B7.

## Affected next evidence only

- B1 can be handled from the frozen owner inventory with a source-bound affected
  declaration/readback; no fresh pixels needed.
- B2/B3 are frozen-versus-candidate wording omissions. If disputed, inspect only
  the two short stems, not their already checked mathematics or whole pages.
- B4 requires only the alpha2 decimal/gap token; B5 only exercise157's base glyph;
  B6 only the top-display irregular ink interval. B7 requires only disputed
  punctuation/separator spans if the parent elects to certify them.
- Count76 needs exactly the localized margin provenance and caption protection
  evidence described above, not a desired9 target.
- Native figure9/10/11 crop review remains separate and unperformed. Any later
  authorized crop views must retain the frozen complete optical inventories
  and caption separation; component counts and identical metadata do not approve
  their pixels. Figure9's historical HOLD and zero/left-cap UNKNOWNs stay intact.

No new batch is requested or started automatically. Await the parent's specific
authorization before any optical/crop review. Preserve all freezes, originals,
FIRST native receipts, failure files, candidates and unrelated work.
