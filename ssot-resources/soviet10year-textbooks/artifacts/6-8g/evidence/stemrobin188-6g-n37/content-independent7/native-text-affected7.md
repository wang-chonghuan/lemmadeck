# STEMROBIN-188 N37 - native text affected comparison 7

Date: 2026-11-23.
Status: pass.
Scope: the two repaired section-break anchors, the literal 487 marker, and
their actual canonical normalized text. This does not replace FIRST or
repeat source, figure, all-nine-task mathematics, or seven-standard review.

## Exact locations and bindings

Every command cwd is
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188` (W).
The only owned output root remains
`W/.intentfold/tickets/STEMROBIN-188/tmp/n37-content-independent7`.

Let B be the exact book root:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188/ssot-resources/soviet10year-textbooks/artifacts/6-8g`.
Let N be `B/evidence/stemrobin188-6g-n37`,
R be `N/native-text-repair7`, and
C be `B/editions/modern-us-neutral/lessons/geo68-c3-s2-n37`.

Actual input hashes, all observed mode 0644 and left unchanged:

- `R/recovery.json`
  `4638904f384c5195c7c0e6ce540a56bceed96c354f946fc25b84716038b1fc46`
- `R/lesson.before.json`
  `c5837502d8984364b97b4b77272519144d1dddf15f36c887572047e7ed098a83`
- `R/exercises.before.json`
  `afb2e2ffebcd00204877c5bc65858a18be901d94baa0ddd1a76585b89d2c2cd2`
- `R/adaptation.audit.before.json`
  `396d835c7661434e9521efef7341b81ea3bfc09d2a032f267e00391f3345619c`
- `R/lesson.template.json`
  `f07e29b7b45aad125a26eb610d4f6f2611e92f9814a3c2c06dfd7901bbf05a2a`
- `R/exercises.template.json`
  `dba55e15310efbc05e087229e6f4da00e00a401002c0fc91c20f7479c907dbff`
- `N/resume7/modern-finalize-first7.json`
  `e76214785c7979fcd5c302186c0ba737c0705e587b457372f5dac7a0638b238a`
- `N/resume7/modern-finalize-text-recovery7.json`
  `c159b776c9b934b7ffe809a5e05ac857b4943baa5b726240a7c23fe181b93a89`
- `N/resume7/modern-finalize-text-recovery7.stdout`
  `e85d370d101c78f7d41bf1891839f8cbf1c76ae6cc7052ebfef4feb76ffb5184`
- `N/resume7/modern-finalize-text-recovery7.stderr`
  `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- `C/lesson.json`
  `2824a52dc50d95aa59d48e2e7ed20249e6034cc9eb96beceafddada290ddf23e`
- `C/exercises.json`
  `ad5b62e04d1f9d14825d32255127af2101cbec2955f403a361534ee82ae354b2`

The before-template hashes exactly match the text candidates bound by the
existing comparison. These are the original reviewed templates, not new
mathematical inputs.

Reused old seals, all unchanged and still 0444:

- SOURCE-FIRST.md:
  `b31993fa620fb84a02f4d68df86e23af16c67ce95537724760014fdfed4e4914`
- source-review.json:
  `b3233e5dcb08d590a0289bf51192faac4e4a6c64097ee82bbd6ccd166dd4be0f`
- COMPARISON.md:
  `38d58bc3681a1f5cdc3804afb990bb73cd2828d1c3da23ea22dd90fa8342e172`
- review.json:
  `8e2265c2daad63327fe83f08cf4b147b8fdcd43dd417535e7ec1a10d3555c742`

## Actual native failure and recovery evidence

The original receipt records the selected N37 adapt-finalize command in W
with exitCode=2. Its retained audit remains status=fail with three errors:
the first section-break anchor matched no adjacent normalized paragraph pair;
the display-only math-wrapped 487 prefix was seen as an unbound formula
change; and the corresponding outside-formula number 487 appeared to drift.
No original failure is overwritten, relabeled pass, or discarded.

The recovery receipt records the same command, argv, cwd, book, edition and
single lesson with exitCode=0. Its stdout reports N37 PASS and stderr is empty.
Both canonical JSONs are actually status=ready. These are read existing
execution facts, not a command rerun or a substitute for content review.

The caller reports independent approval of figures 229-231, unchanged source/
SVG geometry, and three successful native record_review calls. That figure
approval is reused as caller provenance; no image, spec, SVG or figure-review
record was opened or re-reviewed here.

## Two affected concept boundaries

The before/repaired lesson-template comparison has exactly these leaf changes:

- section_breaks[0].before
- section_breaks[1].after

All lesson prose text, source_text, source metadata and other template fields
are byte-equivalent as structured values before versus repaired.

The canonical text contains six emitted paragraphs, extracted from the
already normalized text by its blank-line separators, excluding the figure
and caption entries. No native normalizer was called or reimplemented.

**Boundary 1 - pass, unique canonical paragraphs 2/3 (one-based).**
The before anchor now includes the existing sentence introducing the
translation from O to O1, followed by its ray-image argument and convex-angle
equality. The after anchor remains the direction-angle definition and the
0-degree same-direction convention. This is the same proof-to-definition
transition already checked in FIRST and COMPARISON.md, not a new boundary
inside a mathematical argument.

Anchor UTF-8 string hashes:
before `98bd68f7f3d150ca9c4ee205e1ac290aa21eeada34ef9d7d14f0188ba546f9da`;
after `bf97b5da3fc93a3c6f138aa88a9a5fcb081793a674a85da85242a396ad2c866b`.

**Boundary 2 - pass, unique canonical paragraphs 4/5 (one-based).**
The before anchor remains the congruence conclusion for convex angles
with corresponding same-direction sides. The after anchor includes the
existing magnitude-not-region explanation, the two regions, and now the
existing sentence choosing the convex magnitude. The following common-origin
sentence occupies paragraph 6. This remains the same theorem-to-clarification
transition and changes no mathematical condition or definition.

Anchor UTF-8 string hashes:
before `d436158dfb0ecf5adcd41ec209416cd3b09621206755c5e4ce7539b4bdf8e022`;
after `296d419b4dfec2b9ebfbe854a2342b5cda587b017bf9729cdedfb2daff96fb1c`.

Both repaired anchors equal the canonical section_breaks and each identifies
exactly one adjacent paragraph pair. Canonical-versus-repaired lesson changes
are only prose[0].text, prose[5].text (whitespace/paragraph grouping), and
status. The prose character content ignoring whitespace and all non-text
prose metadata remain identical. This is a layout-only invariant check,
not renewed review of all prose mathematics.

## 487 literal marker and unchanged condition

The before/repaired exercise-template leaf differences are exactly
exercises[8].text and exercises[8].lines[0].

Old prefix: `$487^{*}$. `
New prefix: `487* `

After removing these respective prefixes, the body is exactly unchanged.
The actual canonical 487 entry exactly equals the repaired template entry,
including lines, number/source_number, source_text, page reference, empty
figure bindings and other metadata. The whole canonical exercises document
differs from the repaired template only in status.

487 body UTF-8 string hash:
`2449ba5355e343a4fcaa5a3fb9be555887fdac4a0dba38d11d0e8a461fd617fa`.
Unchanged raw 487 source_text UTF-8 string hash:
`f091a7da064381866a558d15102ce16b2ec45452632fdb071dbc8da1d00deba2`.

The candidate still states two acute angles, or two obtuse angles, whose
corresponding sides are perpendicular, with the congruence conclusion.
It does not weaken that condition to mixed types or arbitrary angles.
The literal star is preserved beside the formula-external exercise number;
its role remains UNKNOWN. This repair corrects a display/number-contract
artifact, not the mathematical statement or the written standard.

## Findings, preservation, and counters

Affected comparison: pass. No affected revise or hold finding.
The same two conceptual transitions resolve against actual canonical
paragraphs, and the 487 repair is precisely literal-prefix-only.
Canonical source objects remain identical to the repaired template source
objects, bound to FIRST lesson/exercise source hashes. No source was reopened.

All previous mathematical conclusions and UNKNOWNs are reused without
revision: glyph/codepoint/alphabet identity, C-adjacent speck roles, and
487-star role. No point, condition, numerical value or mark role is inferred.
Seven-standard approval and figure approval are reused, not re-reviewed.

Stage counters: zero image loads/reopens, original pages, raw source-file
reopens, source/math re-solves, answer-key reads, native reruns, rendering,
app/shared-code/env/DB/Git/worktree/installation/browser/chat/peer/paid calls.
The inherited FIRST image counts remain 3/8 and 3/24, with zero new images.
Two boundaries and one literal-marker repair were compared.

Only native-text-affected7.md and native-text-affected-review7.json are
authored and sealed 0444. Original FIRST/comparison seals, the old FAIL,
all recovery records, template snapshots and canonical JSONs are untouched;
their bound digests and observed permissions are checked for preservation.

This is not a new figure or whole-lesson approval, native finalization,
answer authoring, publication or grading/keyboard work.
No answer keys are disclosed or read in this stage. Only the fresh 479/486
answer candidates remain eligible for later affected comparison using FIRST;
none are compared now. Available for that bounded follow-up.
