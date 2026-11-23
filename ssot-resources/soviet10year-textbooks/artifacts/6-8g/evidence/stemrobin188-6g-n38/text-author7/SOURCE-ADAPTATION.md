# N38 Text Author Candidate

Status: AUTHOR_ONLY. Offline, finish=review. Not mathematical approval, figure
approval, a finalized edition, or publication. The native templates remain draft.
Independent source-first text and mathematics review is still required.

The first text-layout execution failed an author-added stability assertion
after one native pass on the consecutive-formula givens at `p0174#8`; its body
math and number comparisons passed. The original nonzero receipt and stderr
are retained. Only the failed text-layout stage is resumed with the identical
authored input hash. Individual prose objects needing another native layout
pass are continued without producer regeneration, shared-tool edits, another
authoring pass, or full finalization. This recovery is not a content verdict.

## Scope And Inputs

- Sole working directory: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188`.
- Sole writable root: `.intentfold/tickets/STEMROBIN-188/tmp/n38-text-author7`.
- Input preparation: `ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n38/preparation7`.
- Manifest SHA-256: `d81564cf41d32e54238525797e153b05c4de3e990c612937d305f078c81c2109`.
- Selected source interval: `[p0174#1,p0178#9)`.
- Coverage: all 32 prose objects, including all 20 source `p` text objects, and
  all 18 written tasks 488-505. Source order, the teaching footnote, givens,
  proof requests, classifications, and every numbered case are retained.
- Only the raw lesson/exercise input and supplied native templates are used
  for authoring. No supplement506+, page179, source-review or other-author roots
  are opened. Source provenance and historical holds are referenced through
  the supplied preparation manifest, without another source/package review.

## Text And Layout

Chinese punctuation, spacing, and phrasing are modernized without adding
mathematical conditions or solutions. Exercise 489 uses the modern Chinese
term for congruence, `全等`, in place of `合同`; the same correspondence and
remaining-angle proof request are preserved. Equal-angle polygon questions
do not acquire an equal-side or regular-polygon assumption. Exterior-angle
questions do not acquire an invented adjacency or orientation condition.

Only modern `text`, exercise `lines`, text `changes`, and lesson
`section_breaks` are changed. Source snapshots, `source_text`, any source-math
fields, source references, identity, numbers, figure bindings, metadata,
`numeric_changes`, historical-entity fields, and empty errata stay unchanged.
Literal exercise prefixes `495*.` and `505*.` stay outside math delimiters.
ASCII prose numbers and stars are not wrapped into formulas or HTML.

The existing `edition.normalize_lesson_layout` and
`edition.normalize_exercise_layout` functions normalize the owned candidate.
Complete numbered sequences retain their labels and natural order with the
prefix and each part on its own line. Exercise 493 retains all three UNKNOWN
markers verbatim. A blank-line separation after its outer second-part prefix
lets the existing normalizer preserve the unresolved nested labels and the
final classification request on distinct lines.

The native `prose_flow.mjs` command is run exactly once after authoring and
normalization, on the owned lesson template. Its raw stdout/stderr, exact
command, exit code, input hash, parsed final paragraphs, and verbatim
`{before, after}` boundary objects are retained. Concept boundaries are copied
from that output, not calculated from raw prose blocks. The text is not revised
after this run. Adding the selected anchors does not change paragraph text;
the shared native outline and anchor-resolution functions verify that fact
without another CLI invocation.

Concept transitions are definitions to triangle theorem; triangle proof and
footnote to corollaries; triangle corollaries to convex-polygon interior sum;
interior sum and quadrilateral special case to exterior sum; and exterior sum
to the nonconvex-polygon note. No divider is inserted inside a proof.

## Mathematics And Unknowns

Exact delimited body-math expressions, their ordering, and native math and
non-math number signatures are compared with each object's retained source.
These are mechanical invariance facts, not substantive mathematical approval.
All formula expressions remain unchanged, including `180^\circ`, `2d`,
`2d(n-2)`, `2dn`, `4d`, `6d`, the mixed units in the written tasks, and the
source `\blacksquare` expressions.

The source itself states the triangle sum as `180^\circ` and later uses `2d`
for the sum in the polygon proof. Neither expression is converted. No original
glyph, font identity, standalone definition of `d`, unit glossary, source
erratum, or unsupported interpretation is introduced.

The roles of the blackbar/square marks remain UNKNOWN. No QED, editorial,
difficulty, or other meaning is claimed. The unknown source labels
`[UNKNOWN:493-2-1]`, `[UNKNOWN:493-2-2]`, and `[UNKNOWN:493-2-3]` are neither
resolved nor replaced with guessed letters.

## Figures And Deferred Work

`candidate/figures.template.json` is copied byte-for-byte, pending later
delegated figure work. Its inherited `modernized` entries and spec paths are
preparation placeholders, not completed authoring or approval. Original figure
numbers 232-238 and caption/source bindings remain unchanged. No figures,
images, geometry, or specs are authored, loaded, rendered, or approved here.

No producer regeneration, full finalization, rendering, answer/choice stage,
canonical-path write, Git operation, database operation, dependency change,
model-service call, message, timer, or deployment is performed. Historical
source repairs and preparation success are reused, not promoted to a
mathematical verdict. Actual counters, failures, hashes, and execution receipts
are in `AUTHOR-RECORD.json`; per-object coverage and invariance are in
`text-invariance.json`. Owned files are sealed `0444` after completion.
