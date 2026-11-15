# Figures 25-28 Independent Review

2026-11-15. **fig25 PASS; fig26 PASS; fig27 PASS; fig28 PASS**, limited to
the current scratch source/mathematical/visual snapshots. No figure repair
is required. Reviewer: Codex in this chat, independent of author Aristotle.
Boole's interrupted attempt was not treated as a completed review.

## Evidence and Boundary

Read `ld-s10y-image` and its FigureSpec/quality-gate contract, current s8
modern lesson/exercise/figure templates, and separately reopened all four
actual original PNGs before inspecting author inventories and geometry.
Read every spec object/assertion and parsed each actual SVG as XML.
Viewed all four complete 640px-media previews; also the full 1280/1440px
fig26/28 renderer previews, fig25/27 240px previews and fig26/28 mobile
right-end previews. Existing render/validation/display/topology records
were reused, not rerun.

Independent read-only coordinate calculations checked every source-derived
group's connections, vertex counts, adjacent bends, closure and nonadjacent
contacts. Expected structures below came from original pixels and edition
definitions, not from the author's topology-result fields. Every SVG segment
matches its spec endpoints with x unchanged and y=canvasHeight-y. All source
solid strokes remain solid semantic ink. No additional visible SVG path or
unmapped marker was found.

No browser, rerender, model, install, answer/choice access, exercise solving,
promotion, durable figure/spec/template edit, app/DB change, commit or message
to another chat was performed. Authorized outputs are this scratch report
and four current PASS review records only. Whole-lesson/headed-app acceptance
remains parent-owned.

## Independent Source Inventory and Mapping

### Figure 25: PASS

One open chain A1-A2-A3-A4-A5, four solid segments and five named, marked
vertices. A1 is left, A2 upper, A3 right, A4 lower-left return and A5 lower-right
end. All five A/subscript labels have unambiguous ownership. No A5-A1 closure,
endpoint-distance chord, arrow, length, fill, grid or extra label exists.

Mapped to `chain-v1..5`, `chain-edge1..4`, corresponding text IDs and all four
`*-connects` assertions. In-group displacement relationships cover every
marked vertex; `objectCount` supplements, rather than replaces, that mapping.
All adjacent bends are noncollinear, with no nonadjacent contact.

### Figure 26: PASS

Original one-row order Cyrillic а/б/в/г/д maps exactly to Latin a/b/c/d/e.
Source dot distinctions are preserved: the b shared joint is merged angular
ink rather than an additional distinguishable round marker, and e's crossing
is unmarked. No unnamed intersection was turned into a student vertex.

| Group | Pixel-derived graph and current result | Mapping |
|---|---|---|
| a | Four-edge open chain, five marked locations, no nonadjacent contacts | `a-v1..5`, `a-edge1..4`, `a-part-label`, connects/displacements |
| b | Lower-left end -> shared joint -> upper-right -> middle-right -> same joint -> lower-right end; five edges, five distinct locations, triangular return and two lower legs | Four marker IDs `b-v1/v3/v4/v5`; all `b-edge1..5` reuse joint `(315,305)` through connects |
| c | Open M-shape, four edges/five marked vertices, no nonadjacent contacts | `c-v1..5`, `c-edge1..4`, connects/displacements |
| d | Open inward rectangular spiral, 14 marked turns/endpoints, 13 segments; right/down/left/up repeated, ending rightward; no closure or contact | `d-v1..14`, `d-edge1..13`, connects and layout displacements |
| e | Three-edge open chain, four marked endpoint/bend locations; first/third edge cross once strictly inside both | `e-v1..4`, `e-edge1..3`, connects and paired `e-cross-1-3-on-*` assertions |

The b contact is one physical joint, not four distinct intersections: the
four nonadjacent edge-pair contacts are 1/4, 1/5, 2/4 and 2/5 at `(315,305)`.
For e, independent intersection parameters are approximately
`t=0.3616057954`, `u=0.6100211289`, both strictly between 0 and 1. Its
intersection `(1097.7452460,255.4467250)` is not dot-marked. Total 29 segments,
32 visible dots and five Latin subpart labels. These structures support the
current prose's a/c/d versus b/e distinction without writing classifications
into the image.

### Figure 27: PASS

One three-edge open chain A1-A2-A3-A4. Source A1/A2/A4 have distinguishable
round dots; A3 is the lower angular corner and remains unmarked. All four
subscript labels remain. The source shows neither A1-A3 nor A1-A4 chord,
and the modern image adds neither despite their use in the prose proof.

Mapped to `chain-v1/v2/v4`, `chain-edge1..3` and all four text labels; the
literal A3 join `(375,80)` is shared by edges2/3. Connects bind every edge;
mapped visible points have in-group displacement relations. Three segments,
four locations, three visible dots, noncollinear adjacent bends and no
nonadjacent contact all agree with the actual original and current definition.

### Figure 28: PASS

Original five closed figures remain one horizontal row, Latin a-e. No source
corner or crossing has a separately distinguishable marker; the SVG correctly
has zero visible dots. Only a's A1/A2/An and the five subpart labels are present.

| Group | Pixel-derived graph and current result | Mapping |
|---|---|---|
| a | Six-edge simple closed outline; A1 lower-left, A2 upper-left, An lower return bend; three unnamed other corners | `a-edge1..6`, A1/A2/An text IDs, six connects |
| b | Left triangle and right quadrilateral share one upper apex; seven edges, six distinct locations, closed repeated-apex traversal | `b-edge1..7`, all connects reuse apex `(405,325)` |
| c | Five-edge simple concave closed outline with inward right notch, no diagonal or crossing | `c-edge1..5` and connects |
| d | Ten-edge simple star outline, five tips alternating five inward bends; no internal strokes or crossings | `d-edge1..10` and connects |
| e | Five-edge crossed closed star, five strictly interior unmarked intersections; lower tip-to-tip line continuous | `e-edge1..5`, connects and ten paired point-on-line assertions |

For b the four nonadjacent edge-pair contacts are 1/3, 1/4, 3/7 and 4/7,
all at one apex. For e the crossing pairs are 1/3, 1/4, 2/4, 2/5 and 3/5;
independently calculated parameters for every pair are strictly interior.
All other groups have no nonadjacent contacts, and every closed adjacency
bends rather than continuing collinearly. Total 33 solid segments and eight
labels. No fill, invented regular-star/equal-angle premise or classification
annotation was added. The d outline/e pentagram distinction is preserved.

## Display and SVG Results

| Figure | Canvas | Existing actual-media evidence | Visible SVG segments / markers / labels |
|---|---|---|---|
| 25 | 640x440 | Inline 240..640px; smallest declared label 18px at 240px | 4 / 5 / 5 |
| 26 | 1280x400 | Scroll media 640px, labels 20px; 280px container reaches scrollLeft360 | 29 / 32 / 5 |
| 27 | 640x440 | Inline 240..640px; smallest declared label 18px at 240px | 3 / 3 / 4 |
| 28 | 1440x400 | Scroll media 640px, labels about 19.55px; 280px container reaches scrollLeft360 | 33 / 0 / 8 |

Existing viewport checks cover 240/280/310/343/358/400/560/640px. They report
no collisions, whole-SVG clipping or inaccessible scroll end. Viewed previews
confirm readable label ownership, complete endpoints, spiral spacing, distinct
star interiors and no black/broken image. Normal-width evidence is not merely
a source-canvas check. Mathematical subscripts remain recognizable; no Cyrillic
or Chinese text leaked into visible labels.

SVG XML contains respectively 0/4/2/66 hidden construction ellipses; these
remain hidden and are not additional source dots. All visible segments agree
with current specs, are solid, and use semantic ink. No visible extra path,
fill, axis, arrow, numeral measurement, tick/equality mark or answer overlay
appears.

## Provenance Finding, Not a Figure Defect

All source/spec/SVG/render bytes and every figure-local display-hashed artifact
are current. Existing display/topology files still contain older **whole s8
template hashes**, so those trace fields are not byte-current. Do not call the
old files a fully current whole-lesson provenance gate.

- Recorded lesson: `576ebbfa1f1e4efab05b24c3978ed355f70c7960292aff54e5da7941a2bc477d`
- Current lesson: `c6644e2f8d81f9dc9173621d5c7a8476a7cd470aff520f26baf2df11e9ea06de`
- Recorded exercises: `a43c6fc4b4836c7b15338e0c770607108142ffde5a39a45ca913fc8b22a889f1`
- Current exercises: `08fef28289e18cdc4194b2b3d4b83fb93f504194227f6c3dd8f8245499d181ec`
- Current figure template: `56376db2e1b9ea1ff18132d8b8106902e73661693e6d49fff06237953b3167c4`

Independently compared all 19 spec-authoritative prose entries for each figure
with current s8 text, ignoring whitespace/layout only: their semantic content
is unchanged. Current s8 figure manifest includes 25-28 with the same original
PNG hashes; no written exercise directly references these four figures.
The current exercise83 erratum concerns fig33, not the geometry reviewed here.
This report binds the authority used for this review; no spec/display/topology
trace was silently rewritten. Parent should retain this distinction when
performing later provenance binding/promotion.

## Exact Figure Snapshots

| Figure | Source PNG SHA-256 | FigureSpec SHA-256 | SVG SHA-256 | Render SHA-256 |
|---|---|---|---|---|
| 25 | `16aba1e452d4d2eddc5ee1e750e1a3895fe3e5be451c8d76da36caf53d0b1f6a` | `fbc311ca8eea0ca94ca63de76fa7ff6773203adcbb634468d584720b57c05e55` | `e7f7da2b1bc4180e618ae57c7d7a082abf65ec6fa0af6cd4c5176e921e46c94b` | `b9229ab7f57257abc6e946caf3f7fe6012b8bce7bbd0e17393c1b9b93042239b` |
| 26 | `99a8e86b78d28592a837f68c796e675976c57b713a391899e50621ee9cee60e9` | `1d1e6c3da295cfe183689eba52f0b321de1a38ccfd08a1a29682a71395a96927` | `bc82c0b58845897366109803d2da58c56047b466d77b9f9e06561bbc72ffd5dd` | `2eaab18518d239d3ff24cdba0410063d78a96609a0e8fc57732e00639456e452` |
| 27 | `e08b02246cf0e43bb40ce52e485ac6aa3f91011453f8afda52906d2094ee9118` | `6c11b484b6122f930cde2e8b854990a8ed9aa87f01397c47d4cbe44dfad7fb6c` | `3352f4656dbfe9def0bfcab5b6ecea83e4cb859fb7ab5643427d805a6deb0b1d` | `71778d324f38e5a096faeeb41edd4ef50dddc1d91dd7c2770e102582c9d8d6d1` |
| 28 | `7a12963abde73fd158660c73ae74721203170012a9d1ec51f4d950d3594a4bf9` | `583c45a04bb25a5329bc3938dffc0aa35bcb43a6627e69f437b65aabbd53d84c` | `1e99f982457082b05cb773832d8c72f2a643bb2facb44dea232356bd7330b6b6` | `961a66a3e6e3966e2d9e38c29ce8dc393b57f092e760962b68b91782d23bcfec` |

No review file existed for any of the four when inspected. All four authorized
one-shot `record_review.py --render` calls completed with exit 0, recording
`status: pass` for the snapshots above at approximately
`2026-11-15T16:11:30Z`. Their built-in hash guard was not another substantive
review. Each resulting record was read once and its source/spec/render/SVG
binding matched. No process remains active.

| Figure | Current scratch review SHA-256 |
|---|---|
| 25 | `97c624d6db7e3d22f13cae475276ca66790eaff960be1fe62e40af92ab76125c` |
| 26 | `7d3218dbded403f59180caf34b755c81952ad298f22271179b6202dc3f3bb5c2` |
| 27 | `f61eadc7e1862d6955d8db82156f4e00f4bb9046a9bb757ae406eafd00558006` |
| 28 | `62f42ae080e06d66aee7c7a0ebf7eb9ea2d7e6418bb0049a96646442f4884558` |
