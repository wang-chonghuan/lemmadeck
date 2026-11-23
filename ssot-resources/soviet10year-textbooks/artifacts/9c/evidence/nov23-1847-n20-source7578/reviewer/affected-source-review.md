# Affected source review: B1-B3 confirmation

Date: 2026-11-23. Ticket: STEMROBIN-184. Finish: review.
Sole cwd: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.
Write ownership: this `reviewer/` directory only.

**Disposition: PASS for the requested B1-B3 repairs and unchanged-formula
integrity. Source78 N21-only text blocks4-7: SOURCE-FIDELITY PASS.**

No additional local findings within those affected scopes.
These are bounded TEXT dispositions against the frozen independent source
inventory and immutable FIRST triples, not whole-page, whole-course, assembly,
publication, source-HOLD-release, or crop-pixel approval.

Image opens added: **0**. This reviewer's original batch remains **4**;
this reviewer's context remains **4**. No glyph/source/math replay, image/crop
reopen, new batch, candidate edit, mask, count exclusion, or production operation.
The separate optical reviewer used its own eight-image batch; reading its report
as TEXT did not import those images into this context.

## Exact affected changes

Candidate root:
`.tmp/stemrobin-184-six/n20-nov23-source7578/raw/9c/pages/`.
Block references are one-based candidate JSON array positions.

| Finding | Exact current declaration/text | Disposition |
| --- | --- | --- |
| B1, source77 block6 / `blocks[5]` | MD header `p owners-ex ["153","154"]`; JSON `owner_exercises: ["153","154"]`, `owner_exercise: null`; shared-request text unchanged | PASS: source-established owners declared exactly, with no additional owners. |
| B1, source77 `meta.notes[5]` | Historical unowned author snapshot is explicitly preserved; current independent B1 source comparison identifies153 and154 as the only shared-request owners | PASS: honest affected note; no retroactive claim that the FIRST declaration was already owned. |
| B2, source77 block9 / `blocks[8].lines[0]` | `155．随便用一种几何方式表示数列$(x_n)$．说明是否存在着一个` | PASS: both `几何方式` and `存在着一个` restored to the frozen source wording. |
| B3, source78 block5 / `blocks[4].lines[0]` | `我们来比较详细地研究一下前一小节中的第三个例子．“当` | PASS: missing `的` restored to the frozen source wording. |

The revised B1 note is:
`Historical author-only unowned prompt preserved in the original/first snapshots. Current independent source comparison B1 identifies153 and154 as the only shared-request owners.`

Only source77 block6 has a plural exercise-owner array. Its complete ordered
array is `["153","154"]`, with no duplicates. No other source77 block and no
source78 block acquired an owner declaration. In particular, the shared prompt
does not attach to155,156,157 or158, or to any N21 block.
The request still asks for two geometric methods for153/154; exercise155 retains
its own one-method request.

This verifies the raw declaration and parsed metadata only. No assembly was
run, and no claim is made about assembled source_refs, propagated exercise
fragments, stored lessons, database contents, or rendered requests.

## Integrity verification

Verification was read-only:

- Compared current page.json to a structured clone of immutable FIRST page.json
  with only the explicitly authorized changes applied in memory. Both were
  exactly equal to those expected objects; no other JSON field changed.
- Compared each entire current Markdown file to immutable FIRST Markdown with
  only the B1 header/note, B2 stem words, and B3 word restored in memory.
  Exact equality held, including whitespace and line breaks. No file was
  rewritten by this verification.
- Current Markdown frontmatter equals current page.json metadata on both pages.
- All formula-token contents are byte-identical to FIRST:22 tokens on77,
  16 on78. This is an equality check, not renewed solving, glyph certification,
  or endorsement of any unresolved mathematical/optical interpretation.
- All block kinds, labels, order, subpart markers/order, per-block line arrays'
  lengths, explicit `↵` markers, `open`, `cont`, and `samerow` states are
  unchanged except the authorized owner declaration itself.
- Source77 has exactly the one authorized note replacement; all other notes,
  formula-ink inventories, render/source/profile declarations, figures and
  metadata are unchanged. Source78 notes and metadata are entirely unchanged.
- Current audit77/78 files are byte-identical to immutable FIRST audit files:
 77 PASS19/19,78 PASS20/20, each with zero normalizations, no errors, no
 count exclusions and no new erratum.
- Original drafts and all twelve FIRST triple files retain the identities
  recorded in `source-comparison.md`. Current raw75/76 triples remain
  byte-identical to their FIRST triples.

**Unchanged mathematics disposition: PASS for no unintended formula, part,
threshold, or physical-row change caused by B1-B3.**
The independent source-solving freeze is reused without replay. This integrity
PASS does not replace its UNKNOWNs or turn candidate77's decimal-gap token,
candidate78's exercise157 encoding proxy, or source76's intervening ink into
newly certified mathematics.

## Source78 N21-only disposition

**SOURCE-FIDELITY PASS for candidate source78 blocks4-7 only**, corresponding to
the independently frozen S78.04-S78.06 text objects:

| Candidate block | N21 source object | Disposition |
| --- | --- | --- |
| 4 / `blocks[3]` | `21．数列的极限的定义` heading | PASS: numbered boundary/title preserved; not an N20 exercise or continuation. |
| 5 / `blocks[4]` | Introduction referencing the previous section's third example and its quoted claim | PASS: B3 restored `中的`; remaining text, closing-quote comma, quoted formula and `含意` remain as compared to the freeze. |
| 6 / `blocks[5]` | Question about absolute difference and its displayed error identity | PASS: source text, bars, sign, denominator and given threshold retained, unchanged from the previously compared setup. |
| 7 / `blocks[6]` | Strict inequality setup and closing sentence | PASS: complete inequality and `的自然数n` sentence retained; no reviewer-derived solution inserted. |

This source-fidelity PASS is confined to the inspected physical78 heading,
introduction and setup text/formula objects. The sentence closes locally; the
whole N21 course remains incomplete outside this source boundary. No source79,
whole N21 lesson, stable N21 ID, assembled lesson, continuation beyond the
boundary, answers, exercises, modern edition, display, or crop was approved.

Preceding source78 blocks1-3 belong to N20 and are **outside this N21 PASS**.
Their unchanged-formula integrity was checked, but unresolved N20 glyph/
encoding questions are not cleared by the neighboring N21 disposition.
Source78 as a whole is not given a blanket source-fidelity PASS.

## Retained UNKNOWNs and outside-scope issues

Read only the sibling
`optical-review/optical-report.md` as TEXT.
SHA-256:
`d807db482dffc64e6c6e8f3165caff9f5ff4f570e0f20a8326084c85266759e4`.
Its source/crop bindings and optical observations are attributed to that
separate reviewer; no images or manifests were reopened or visually reconsidered
here.

The external report states: both source76 marginal marks have UNKNOWN
provenance; exercise157's base is visibly lowercase italic z-shaped but exact
source codepoint/alphabet remains UNKNOWN; the middle approximation token is
`0 [gap] 33` without a visible decimal mark, with intended/lost character
UNKNOWN; source76 intervening ink identity/origin remains UNKNOWN.
It grants no exclusion, whole-page/figure PASS, algebraic normalization or
source-HOLD release. These observations are retained as later textual evidence,
not retroactive edits to this reviewer's original observations.

- UNKNOWN-U1 through U4 in `source-first.md` and
  `exercise-math-first.json` remain byte-for-byte intact.
- B4 decimal-gap/intended-character uncertainty, B5 exact exercise157
  codepoint/alphabet uncertainty, B6 intervening-ink identity/provenance,
  B7 unadjudicated source76/77 punctuation, and generalized approximation
  convention UNKNOWN-U3 are outside the B1-B3 and N21-only PASS.
- Source76's actual FIRST count-only FAIL11/9 remains untouched. Both margin
  provenances remain UNKNOWN; no mask/count exclusion was created or approved.
- Source75 figure9's old HOLD and its disclosed optical/encoding uncertainties
  remain intact. No source75 prose/math review was repeated.
- Native figure9/10/11 crop pixels remain unreviewed by this reviewer. No
  metadata, component count, external token ROI, or neighboring text PASS
  approves those crops.

## Snapshot bindings

Current affected files:

| Page | File | SHA-256 |
| --- | --- | --- |
| 0077 | page.md | `3b7d5e5466150031335152c1339f3b14af7ba1decc090a3b65ae33a7266e38eb` |
| 0077 | page.json | `47e68aa2ffe73a05c42c26db0081a23438bd8b250c650bb2ead590023f7ad1ef` |
| 0077 | audit.json, unchanged FIRST | `9b426f6dbfc5a8b171f6609e9dfd46952d40033f79d65f0d61a0123bbe9c1ce8` |
| 0078 | page.md | `014ebe7c8663e774bd613b71a704d646a3a0872ce4df3bdc197b6065b8ac3bc7` |
| 0078 | page.json | `1a6b18aaea1a0e9048514dc5ec31a45f8c9e27ba2979ef07a192d503d01af5f5` |
| 0078 | audit.json, unchanged FIRST | `f274a797fbd5b456ea7a9b560540bc67400559c633a913a05522b40733998ee8` |

Prior reviewer evidence, verified unchanged:

- `source-first.md`:
  `a658471effaa159744072cdcff5255cdaf8b4225b6747797ae55b6a4fa244b5f`
- `exercise-math-first.json`:
  `4dddc84c3f6d5d3099a316a2b51898fd0073b0a9b64dfcff26e6a4e17f64173d`
- `source-comparison.md`:
  `531d84f6927e4ecac6d67a5795a6a146ae229b8f557da593181de189da880d81`

The older comparison remains the immutable pre-repair finding record; this
affected review supplies the bounded current dispositions, without overwriting
its historical candidate hashes or UNKNOWNs.

No further affected evidence is needed for B1-B3 or the source78 N21 text
blocks4-7 at this snapshot. All remaining optical, provenance, crop or
whole-course work requires separate parent authorization and lies outside
this confirmation.
