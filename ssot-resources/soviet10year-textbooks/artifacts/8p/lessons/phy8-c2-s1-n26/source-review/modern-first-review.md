# n26 FIRST Independent Modern Wholetext / Science Review

Date: 2026-11-23. Ticket: STEMROBIN-180. Reviewer: sole independent semantic
reviewer for this bounded phase, not the text or figure author.
Every command used the exact cwd
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180`.
All paths below are relative to that cwd.

## Verdict

**PASS: FIRST wholetext/source-preservation and scientific derivation for the
retained modern lesson snapshot and current modern exercises.**
All 8 prose objects were compared independently against RAW, including the
complete cross-page paragraph, both figure objects, both captions, all source
references, every mathematical expression and the literal numerical values.
No substantive text correction or source-bound erratum is required.

**HOLD: working-template section-break synchronization only.**
The current `lesson.template.json` differs from the reviewed modern `lesson.json`
solely in `section_breaks`: the template has `[]`, whereas the reviewed lesson
has the three exact adjacent-paragraph anchors resolving to indices 4, 6, 9.
The template's prose, formulas, source snapshot and other fields match the
reviewed lesson. The wholetext/science PASS is not a claim that these two files
are byte-identical or that the current template will preserve the reviewed
section breaks if finalized.

**Modern figures 80/81 and display: NOT REVIEWED / NOT APPROVED.**
Figure objects, identities, references and caption text pass this textual
comparison; rendered assets, FigureSpecs, visual relationships and desktop/mobile
display are outside this phase. This is not whole-package or publication approval.

## Binding and Immutable Snapshot

Byte-level SHA-256, not a whole-package hash:

| Input / retained evidence | SHA-256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/phy8-c2-s1-n26/lesson.json` | `eed9262794a0b01011df7a09acab9483dabf617d7b6fb9ec4fb3e496cb24a1da` |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/editions/modern-us-neutral/lessons/phy8-c2-s1-n26/lesson.json` | `7729148053ce9efe403c0fc87b51c4129be2ce446eb2693c0d09d2ac7e01c4c4` |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/phy8-c2-s1-n26/source-review/modern-first/lesson.json` | `7729148053ce9efe403c0fc87b51c4129be2ce446eb2693c0d09d2ac7e01c4c4` |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/phy8-c2-s1-n26/exercises.json` | `41a0fd6a7f1a6ec4efec3309521b4f848a6fdd1133dfb62a4c4d5a2c6200b22b` |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/editions/modern-us-neutral/lessons/phy8-c2-s1-n26/exercises.json` | `262b7a48e80607b0e67f2e1ec9afed2d64d0cdecb97f161c190b1fbdf09395f7` |
| `.tmp/ld-s10y-lesson/adapt/8p/modern-us-neutral/lessons/phy8-c2-s1-n26/lesson.template.json` | `491483b16cf14166155e6b496e57a74649e9074843318851d21df7fba1a66f47` |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/phy8-c2-s1-n26/source-review/retained-source-figure-bindings.json` | `cd8e324a1146f74776fdfa4a074e7a2a17173e75206049247dfff588c68d837e` |

The snapshot is an exact byte copy of the reviewed modern `lesson.json`, retained
once under the authorized `source-review/modern-first/` directory, with file
mode `0444`. It is evidence, not an editable template. Do not overwrite it when
fixing the working template or completing figure/display work.

The modern lesson and exercise `source.data` objects match their current RAW
JSON objects exactly, and their embedded source hashes match the RAW file
hashes above. Lesson identity, title, number, start pages, figure list and
exercise count are unchanged.

## Actual Comparison Scope

Indices below are zero-based RAW/modern prose-object indices, NOT paragraph or
section-break indices.

| Object | Kind | Exact retained source refs | Independent result |
| --- | --- | --- | --- |
| 0 | `p` | `p0120#8` | Mass-from-mutual-acceleration introductory sentence unchanged. |
| 1 | `p` | `p0120#9` | Earth/Moon introductory circular-orbit statement and `384000` preserved; whitespace-only wrapping. |
| 2 | `p` | `p0120#10` | Both bodies accelerate, Earth has centripetal acceleration, and the question about the center preserved; whitespace-only wrapping. |
| 3 | `p` | `p0120#11`, `p0121#5`, `p0122#1` | Complete cross-page paragraph through the final Moon-mass formula preserved; all reasoning, units, expressions, punctuation and references unchanged except whitespace. |
| 4 | `fig` | `p0121#1` | `fig-80`, label `图 80`, empty prose text and printed-page metadata unchanged. |
| 5 | `fig` | `p0121#2` | `fig-81`, label `图 81`, empty prose text and printed-page metadata unchanged. |
| 6 | `cap` | `p0121#3` | Caption `图 80` unchanged. |
| 7 | `cap` | `p0121#4` | Caption `图 81` unchanged. |

Tool-assisted comparison verified exact metadata/source refs and exact
`source_text` against RAW for each object. Removing whitespace from prose
leaves identical character sequences; independently extracted `$...$` contents
match in order, character-for-character, including internal spaces.
Only objects 1, 2, 3 have `changes: ["layout"]`; other objects have `changes: []`.
Every object's `numeric_changes` and `historical_entities` is empty.
`errata` is empty. No cultural substitution or scientific-history declaration
is needed for this source text.

Preserved exact unusual source wording includes `沿以运动` and `因此；`.
Neither was silently normalized. The printed semicolon was already resolved
by the retained SOURCE review; no source images or original-review inventory
were reopened to adjudicate it again.

Existing SOURCE authority was reused from
`source-review/retained-source-figure-bindings.json` and
`.intentfold/tickets/STEMROBIN-180/source-review-8p-n26.md`.
The accepted scope remains physical 120/121 plus ONLY physical 122's two n26
closing rows and outgoing heading 27. This phase did not review source pages,
incoming n25, whole page 122, or n27. No new page-mechanical verdict is asserted.

## Independent Science Check

The derivation is evaluated in its stated circular two-body approximation,
relative to the Earth-Moon center of mass, not as an exact description of the
full Earth-Moon-Sun system.

1. The common point P is the barycenter. In the barycentric frame the center
   positions satisfy `m_E r_E_vector + m_M r_M_vector = 0`: the radii are on
   opposite sides of P. Both rotate with the same angular speed, so
   `a_E_vector = -omega^2 r_E_vector` and
   `a_M_vector = -omega^2 r_M_vector`. The source correctly uses acceleration
   magnitudes, NOT a positive equality between oppositely directed vectors.
2. Thus `|a_M| / |a_E| = omega^2 r_M / (omega^2 r_E) = r_M / r_E`.
   Equal and opposite mutual forces give
   `m_E a_E_vector = -m_M a_M_vector`, hence
   `|a_M| / |a_E| = m_E / m_M`. The printed reciprocal mass ratio and both
   subsequent formula chains have the correct numerator/denominator ordering.
   Therefore `m_M = m_E r_E / r_M`, not its reciprocal.
3. `384000` in the introductory Earth-centered description and `380000`
   for the Moon's radius about P are distinct source-context quantities.
   They must not be homogenized. The quoted barycentric radii sum to
   `380000 + 4700 = 384700` km, consistent with the source's coarse numbers.
   Taking the introductory separation and mass ratio 81 gives
   `r_E = 384000 / 82 = 4682.926829...` km and
   `r_M = 384000 * 81 / 82 = 379317.073170...` km, supporting the stated
   approximate radii rather than exposing a mathematical printing error.
4. P at approximately 4700 km from Earth's center is inside Earth, consistent
   with Earth's roughly 6400 km radius. The larger body's smaller orbit and
   the smaller body's larger orbit are consistent with the mass ratio.
   The textual use of a common P is scientifically sound in this approximation;
   actual figure placement remains unreviewed.
5. `380000 / 4700 = 80.851063829...`, correctly approximated by 81.
   `6e24 / 81 = 7.407407407...e22` kg, correctly reduced to the printed
   one-significant-figure `7e22` kg. `6\times10^{24}`, `7\times10^{22}`,
   `4700`, `81`, `1/81`, the numerator's `\text{ 千克}`, vector notation,
   radius/mass subscripts, `=`, and `\approx` all remain literal RAW content.
   Coarse numerical precision and the context-dependent `1/81` wording do
   not establish an erratum and do not require a newer measured Moon mass.

The retained reference to the aluminum/steel cylinder experiment in section 23
is used as stated: the common-angular-speed radius/acceleration relation.
No prior lesson or experiment image was reopened or newly approved.

## Tool-Derived Flow and Exercise Scope

Read-only `prose_flow.mjs --json` on the modern lesson reports 10 paragraphs,
with `resolvedBreaks: [4, 6, 9]`. Its exact boundary output agrees with the
reviewed lesson's anchors: question to P/orbits; orbital radii and experimental
analogy to acceleration ratio; relative mass to absolute Moon mass.
These are coherent conceptual transitions without omitting prose.

The same tool on the current template reports the same 10 paragraph texts but
`resolvedBreaks: []`, confirming the specific synchronization gap.

RAW and modern exercises both have `count: 0` and `exercises: []`, consistent
with the lesson's `exercise_count: 0`. There is no exercise, choice, answer-key
or interaction authoring/review task to manufacture from this lesson.

## Required Fix and Unresolved Facts

- Required parent-owned fix before template-based finalization: synchronize
  ONLY `lesson.template.json.section_breaks` with the three exact anchors in
  the reviewed modern lesson or the tool's corresponding boundary objects.
  Re-resolve the affected anchors to 4, 6, 9; do not alter prose or formulas.
  No wholetext or SOURCE replay is needed for an anchors-only synchronization.
- Figures 80/81 were authored separately and are not approved by this review.
  No FigureSpec, asset or visual output was opened, hashed or inspected here.
  Figure science/visual approval and display evidence remain outstanding for
  their separately authorized phases; this reviewer did not poll the author.
- No unresolved fulltext/scientific fact requires a correction or erratum.
  The circular two-body approximation is the review's explicit physical scope.

An initial read-only comparison command exited 1 because it asserted complete
template/modern equality and found the empty template `section_breaks`.
That failure is retained here as a real file-synchronization discrepancy,
not relabeled as a science failure. A narrowed read-only comparison then
confirmed that `section_breaks` is the ONLY differing field and that all
8 prose objects, source snapshots, formulas and exercise objects satisfy the
comparisons above. No authoring or finalize command repaired or hid the gap.

## Usage and Ownership

Actual images loaded in this phase/batch: **0**. Actual image loads in this
reviewer context: **0**; carried source evidence's historical 8 loads were not
replayed. Limits for any separately authorized future phase remain 8 per batch
and 24 cumulative; this review does not reset historical usage.

Only this review file and `source-review/modern-first/lesson.json` were created.
No authoring edits, Git commands, DB access, installation, paid calls, messages,
new chat, new worktree, browser/image loads or polling occurred. Other workers'
files and the current template were left unchanged.
