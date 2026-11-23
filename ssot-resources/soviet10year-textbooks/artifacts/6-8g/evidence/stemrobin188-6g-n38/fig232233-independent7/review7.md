# Independent Comparison 7: fig-232 / fig-233

2026-11-23. STEMROBIN-188 ACTIVE; offline; finish=review.
Sole cwd: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188`.
Write scope: the existing `tmp/n38-fig232233-independent7` directory only.

**Current figure statuses: fig-232 REVISE; fig-233 REVISE.**
No modern source-fidelity approval, review@1 PASS, promotion or publication.
The component observations below do not approve either current candidate.

## Immutable Basis

The parent confirmed FIRST retained at
`ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n38/fig232233-independent7`.
The existing local FIRST files remain untouched, including seal SHA-256
`2d666e8aa50944d5d8175cbc4e5a6eef9e2d01d14ec0545a31648542437a2b7e`.
This comparison uses that original independent observation, not a rewritten
inventory inferred from the disclosed candidate.

Disclosed retained author directory:
`ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n38/fig232233-author7`.
Manifest SHA-256:
`b932a9c39fcfa9f06747b7b6a2dc66cd0d71a4c4e04914172c7aa6dfa576ca40`.
AUTHOR-RECORD.md SHA-256:
`a5d617b297a36901788395d7a925e80fc959ada626a1faca72622f4c65e03a30`.
Both actual hashes match the parent's disclosure. Current two-figure
spec/output/render/supplemental/inspected-preview hashes match the manifest.
Detailed actual path/hash bindings are in review7.json.

The original two PNG hashes and complete modern lesson/exercise text hashes
are reused from FIRST and agree with the author input bindings. No original
image was reopened, cropped, re-solved or measured again. Other figures,
answers, choices, prior crop/page-count checks and other reviewers' work were
not reviewed. The parent's report about closed fig-238/499 work was not
turned into evidence for these figures.

## Findings And Exact Repair Scope

1. **R232-C: REVISE, not missing-source HOLD.**
   `fig-232.spec.json /objects/2/label`, object `232-C`, is `?`.
   FIRST independently recorded the upper-left C-like glyph and vertex BC/CD.
   Use modern Latin `C` for that same source-position alias. The relevant
   edition paragraph does not name this vertex; do not claim that it does.
   Do not change its coordinate, incident edges or the source alphabet claim.

2. **R232-D: REVISE, not missing-source HOLD.**
   `/objects/3/label`, object `232-D`, is `?`.
   FIRST recorded the top D-like glyph between CD/DE. Use modern Latin `D`
   at that same slot, explicitly as the inventory's modern alias, not as
   recovered original encoding. No new source image is required.

3. **R232-E: REVISE, not missing-source HOLD.**
   `/objects/4/label`, object `232-E`, is `?`.
   FIRST recorded the upper-right E-like glyph between DE/EF. Use modern
   Latin `E` at that same slot under the same alias/encoding distinction.
   Three identical question marks do not preserve three distinct source
   point-label identities and are not a usable final naming convention.

4. **R233-H: REVISE, not missing-source HOLD.**
   `fig-233.spec.json /objects/6/label`, object `233-H`, is `?`.
   FIRST independently recorded the H-like upper-left endpoint and B-C-H
   order. The edition extends BC beyond C and establishes angle 3 = angle 6,
   but does not explicitly name that endpoint H. Use modern Latin `H` as
   the FIRST position alias. Preserve the B-C-H collinearity/order and the
   current CH ray. Do not infer Latin versus non-Latin source alphabet.

5. **R233-SECTOR6: REVISE provenance only; current arcs need no repair.**
   `fig-233.spec.json /source/inventory/6/description` still calls three
   strokes provisional because the author did not resolve their multiplicity.
   FIRST, sealed before disclosure, records THREE nested strokes in sector 6
   between CM and CH. Its independent sector table records the matching three
   strokes in sector 3; the edition independently establishes 3 = 6.
   The candidate has precisely three correct-side arcs
   `/objects/34`, `/objects/35`, `/objects/36`, and number 6 at `/objects/37`.
   The full and 294px previews substantively show them in the upper-left
   sector. Retain these arc objects, radii and directed-sector assertions.
   A successor record can resolve this author's provisional multiplicity
   against FIRST; it cannot rewrite the old author failure/UNKNOWN history.
   Update the corresponding supplemental `/checks/24/name` and successor
   resolution record. Do not rerender unchanged arcs solely for this note.

For the four naming repairs, successor specs also need truthful descriptions:
fig-232 `/description`, `/source/inventory/0/description`; fig-233
`/source/inventory/0/description`. Successor supplemental naming descriptions
are `/checks/2/name` for both figures and fig-233 `/checks/28/name`.
Refresh only changed-input/output evidence bindings as needed. This reviewer
has not edited any spec, SVG, output, author record or existing seal.

## Complete FIRST-To-Candidate Comparison

### fig-232

FIRST's one six-vertex diagram maps to `232-A` through `232-F`, six
`232-edge-*` segments and `232-region`, not to multiple panels. All incident
edges and cyclic A-B-C-D-E-F order are preserved. A is lower left, B left
below C, C upper left, D top, E upper right, F lower right. A/B/F/G are the
edition's named roles; C/D/E are the FIRST aliases affected above.

All six current boundary turns have the same nonzero sign; the candidate is
strictly convex, not a concave or self-crossing substitute. Its explicit
coordinates are modern construction, not exact source pixel measurements.
G-A-F lie on the same lower line with AG opposite AF. The right extension
continues beyond F, and the AB extension beyond B goes upper left. All three
source extensions are mapped and visibly present, without arrowheads.

`232-interior-arc` is centred at A between positive AF and AB rays, inside the
polygon. BAG lies outside with the opposite AG ray; no exterior arc,
numbered sector or reflex/interior confusion was introduced. A candidate-only
coordinate comparison gives interior/exterior sum 180 degrees. No degree
value is printed in the image and none is claimed as a source given.

FIRST's oblique fine-stroke family maps to ten `232-hatch-*` muted segments,
clipped just inside the boundary. The exact ten, equal spacing and strict
parallelism are explicitly MODERN REGULARIZATION, not a decoded source count
or parallel given. The visible family has not been omitted or promoted into
extra polygon edges, a lattice, diagonals or measurements. Keeping this
declared modern treatment does not require guessing its original blackbar
role. No change to those ten current segments is requested.

FIRST could not distinguish separate circular point dots from ink joins.
The candidate hides point markers but prints labels, preserving the joins.
There is no evidence of a dropped distinct source marker. No source-specified
axis, grid, tick, unit, right-angle square or arrow is missing.

### fig-233

The one shared frame maps to A/B/C/M/N/F/H position objects, base AB, sides
AC/BC, the two halves of MN and two side extensions. A-C-F and B-C-H are
collinear in source order. Actual candidate CF/AC components both equal
0.55; CH/BC components both equal 0.42, so both endpoints are beyond C,
not on backward rays. The upper-left extension remains shorter than the
upper-right. MN is horizontal through C and exactly parallel to AB.

Every FIRST numbered sector maps to its number, arc objects and sector
region: 1 at A between AB/AC; 2 below C between CA/CB; 3 at B between BA/BC;
4 upper right between CF/CN; 5 above C between CH/CF; 6 upper left between
CM/CH. Current multiplicities are 1/2/3/1/2/3, matching FIRST. Unnumbered
lower-left/lower-right sectors at C were not renamed 4/6 or given new numbers.

Current directed vectors give the same-angle pairs 1=4, 2=5 and 3=6.
The upper half-plane is partitioned successively CM-CH-CF-CN by 6,5,4.
This is a substantive geometry comparison against the independent FIRST
and edition proof, not approval derived from a native PASS or object count.
No equations, numerical angle values or new proof/solution text are printed.

## Visual, Cultural And Readability Observations

The four newly opened images, once each, were fig-232 full and width-294,
then fig-233 full and width-294. Both full canvases and 294px previews are
nonblank, not black/broken, fully framed and free of observed clipping.
The polygon's boundary/angle/extensions remain distinct from its muted fine
strokes. The triangle's sectors 1-6 and single/double/triple arcs remain
distinguishable at 294px. C is displaced clear of the MN/side strokes but
still uniquely associated with the common apex; its coordinate did not move.
No new visual geometry/sector repair is identified.

Visible named labels are clean Latin A/B/F/G in fig-232 and A/B/C/M/N/F in
fig-233, plus the four REVISE placeholders and Arabic sector numerals.
No Cyrillic/Chinese cultural text, flags, uniforms, Soviet decoration,
old-page texture or handwriting leaked into either modern preview.
The unknown source alphabet is NOT inferred from the chosen modern font.
The placeholders are a naming/source-fidelity defect, not cultural leakage.

Both SVGs use semantic CSS variables. Existing reports declare instructional
inline maxWidthPx 640 and widths 294/310/346/358/640. Current canvas font is
36px; at 294px its scale gives 16.5375px. Actual inspected previews support
readability at that width, independently of the existing native size PASS.
The other width checks and collision results are reused, not rerun.
This is a figure-preview review, not a claim that an actual headed lesson
surface or its measured media width was inspected. No app, offline full
lesson or print/theme browser test was run; that uncovered integration scope
is not a fabricated missing-original-source HOLD.

## UNKNOWN Versus Required Source HOLD

Original alphabet/codepoints, fig-232's exact fine-stroke count/printing role,
and very fine original ink/mark-production roles remain UNKNOWN. The old
author observations are preserved even where FIRST supplies stronger
independent multiplicity evidence. A claim to have decoded the original
alphabet, encoding or unknown printing details would still lack actual
authority. Neither repeated native PASS nor a modern font can resolve it.

No required-source-evidence HOLD remains for the four label repairs or
sector-6 multiplicity: FIRST supplies the visual position aliases and
three-arc observation; the edition supplies the geometric roles. These can
be revised without new original loads. Do not remove unresolved historical
facts, claim exact source stroke counts, or approve the unrepaired candidates.

## Failures, Counters And Affected-Only Continuation

Preserved independent first failure: destination `ls -ld`, exit 1, missing
owned directory, recovered by apply_patch in the FIRST phase.
Preserved author first failures: fig-232 attempt1 render exit2 (A/B/D/F/G
collisions); fig-233 attempt1 validation exit2 (sector5 margin 13), no
dependent render; fig-233 attempt2 render exit2 (C collision).
Current successful native results and their unchanged geometry/width checks
were reused. No original failed image was reopened and no failure was reset.

Two oversized textual tool outputs were truncated by the output channel;
missing spec geometry was recovered by a compact read of only the needed
two-candidate JSON fields. This was not an image failure, content verdict or
renderer retry. The SVG style search also had repetitive text truncation;
the displayed semantic-variable/font observations were sufficient.
No command in this comparison returned a nonzero exit code.

Same context: 2 original + 4 candidate image loads = **6/8 batch, 6/24 context**.
Reopens 0, crops 0, failed image loads 0, paid calls 0, new workers 0.
Exactly **two batch slots remain**, reserved only for a genuinely affected
repair preview later; they were not consumed now. Author counts stay separate:
six image loads, fifteen raster-production events and the original failures
are still retained in the immutable author record.

For a later authorized repair, do not repeat original inspection, source
solving, unaffected geometry/sector/hatch review, or already valid unchanged
checks. Only label text, its affected clearance/readability, successor
provenance and changed file bindings need continuation. Sector-6 geometry
already agrees; metadata correction alone does not create a new image batch.
No repair or promotion was performed. Return the two new sealed review paths
and hashes, then stop.
