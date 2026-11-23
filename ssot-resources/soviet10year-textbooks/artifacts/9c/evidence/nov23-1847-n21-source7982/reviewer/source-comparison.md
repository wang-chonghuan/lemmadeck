# N21 Phase B source comparison

Date: 2026-11-23. STEMROBIN-184. TEXT-only candidate comparison.
ROOT: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.

## Disposition

**HOLD for the requested combined source scope: one specific physical-continuation
metadata discrepancy, D1 below.** Complete N21 words/formulas, original exercise
order and the already independently derived mathematics PASS. No blanket N21
source approval is granted while the 80-to-81 continuation is unmarked.

This does not reopen mathematical solving or source inspection. It does not
approve crop pixels, modern content, answers/options, rendering, publication or
the full lesson. Candidate files and both Phase A freezes remain unchanged.

## Specific discrepancy

**D1: source80-to-source81 proof continuation is not represented by open/cont.**

- The frozen independent inventory records source80's decimal-approximation proof
  continuing onto source81 with “因此” and the two concluding limits.
- Candidate source80's last prose paragraph begins “因为，对于每一个正数…”.
  In `page.md` it has `<!-- p -->`; in `page.json`, `blocks[8].open` is `false`.
- Candidate source81's first paragraph begins “因此” and the two correct limits.
  In `page.md` it has `<!-- p -->`; in `page.json`, `blocks[0].cont` is `false`.
- All conclusion text is present and correctly ordered, so this is not a missing
  formula or a mathematical error. The raw representation nevertheless lacks
  the physical cross-page continuation identified before candidate disclosure.
- The affected metadata should represent the source80 outgoing paragraph as open
  and the source81 incoming conclusion as continuing. No source or metadata edits
  were made by this reviewer, and no native replay is requested here.

The correctly marked 79-to-80 handoff is distinct: source79 `blocks[6]` is open
and source80 `blocks[0]` is continuing; “对于一切” joins “n>N，不等式…成立”.

## Candidate bindings

These nine candidate files were hashed once, without additional image access.
Absolute candidate prefix:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n21-nov23-source7982/raw/9c/pages/`.

| Page/file suffix | SHA-256 |
| --- | --- |
| `0079/page.md` | `d26b6b14657061fda183d92dffd3f6f33b21c645c0f7acb2aa8694e3c5c3ca36` |
| `0079/page.json` | `b5ff96fb47db92e870116083cad71b255bdec91c04af4cc1385d6b4319c098a8` |
| `0079/audit.json` | `cdf6c973f6d057d7d810e35adfeeba2b8495549d3b3237b39a67bb34b4f66d4c` |
| `0080/page.md` | `471236f664a77b5a729312167a9f5579073219233124bd53d891d995688c7785` |
| `0080/page.json` | `675f7558ffb2bf8076fc0f90a457b556862e2253f2b571061e155c2c979c95ad` |
| `0080/audit.json` | `b8b421f64788a865cefd639111f1cd00451f1dafb003de78830101f11ba9ae26` |
| `0081/page.md` | `48133cc93cb31299748b170bc4db8a8e92b1f226967707fe7886c771469a445b` |
| `0081/page.json` | `e2b3f21e90efb3a512f9df37c0b23aa54574bb8d6c627817703cf1aa11bc4d16` |
| `0081/audit.json` | `86c129d4747d68eac26940806b91e9b7c6e594f3e82ec67f5f28f5ca4f74481b` |

All three candidate render hashes match the respective original image hashes
already frozen in Phase A. Original images were not rehashed or reopened.
The PDF name/hash metadata was not independently verified against PDF bytes;
no PDF was copied, opened or inspected.

Parent-supplied native evidence is reused, not newly executed:

| Page | Reused result | Candidate profile hash |
| --- | --- | --- |
| 79 | FIRST PASS20/20; zero normalizations | `19d56195a3a63cf4be93a7a159e1513d37b9b17d1b92235d8ae3d4e826cc45d0` |
| 80 | Exact historical PASS23/23 with its older profile | `dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849` |
| 81 | FIRST PASS22/22; zero normalizations | `19d56195a3a63cf4be93a7a159e1513d37b9b17d1b92235d8ae3d4e826cc45d0` |

The authorized historical source80 profile is not treated as a fresh failure.
Each disclosed audit has equal printed/MD line counts, empty normalizations,
unknown-character, warning and error arrays, and zero errata. These machine
records do not establish source approval or erase the independent UNKNOWNs.
Historical AUTHOR/OPEN notes and their observations are not new reviewer evidence.

## Complete N21 comparison

**Source79: words and formulas PASS.** The candidate preserves all seven frozen
prose groups: reciprocal-inequality equivalence, `3n>1000`, mixed-number
`n>333 1/3`, strict cutoffs `n>n_0=333` and `n>n_1=333333`, both numerical
tolerances, tagged inequality(1) including the question, general epsilon
threshold and integer-part explanation, then the earlier-examples request.
The outgoing phrase and printed page72 footer are present. No figure or exercise
is inserted. List punctuation/font codepoints are not being certified.

**Source80: words and formulas PASS; outgoing metadata has D1.** The incoming
earlier-examples sentence, zero-limit error bound, complete epsilon/N definition,
formula(2), limit notation, convergence terminology and N-dependence all match.
The approximation claim preserves alpha, both approximation sequences and the
prime on the upper sequence. Both displayed decimal-error inequalities remain
non-strict (`\leqslant`), followed by strict epsilon bounds. No sentence or formula
is omitted. The printed page73 footer is present.

**Source81: words, formulas and exercise parts PASS; incoming metadata has D1.**
Both concluding alpha limits are present. The signed double inequality,
translated double inequality(3), tail indices, original reversed-bracket open
interval, epsilon-neighborhood definition and finite-exceptions statement match.
The intervening geometry explanation retains its local open/cont sequence across
the figure/caption. The exercise heading and printed page74 footer are present.

Complete original exercise correspondence, using frozen order rather than an
assumption about homograph encoding:

| Task | Candidate formula/claim | Reused independent result |
| --- | --- | --- |
| 159, top left | `(n+1)/n -> 1` | Error `1/n`; proved |
| 159, top right | `(5n-2)/n -> 5` | Error `2/n`; proved |
| 159, bottom left | `(3n-2)/(2n) -> 1.5` | Error `1/n`; proved |
| 159, bottom right | `1/(n^2+1) -> 0` | Error `1/(n^2+1)`; proved |
| 160, left | `a_n=(5n-1)/(2n)` | Limit `5/2`; proved |
| 160, right | `b_n=(3n^2+1)/n^2` | Limit `3`; proved |
| 161, no subparts | Constant `x_n=c -> c` | Zero error; proved |
| 162, no subparts | `1` is not the limit of `(n+1)/(2n)` | Epsilon `1/4` tail counterexample; proved |

No answer key or proposed option was used. The complete symbolic witnesses and
the Phase A arithmetic result are reused without replay.

## Figure12 metadata, not crop approval

Candidate MD/JSON identify one prose-owned `fig-12`, caption “图 12”,
`owner_exercise: null`, and coarse box `[803,493,526,62]`.
The figure reference is retained between the signed and translated inequalities;
the caption has `samerow: true`. The audit repeats the box and records
`components: 9` and `from: [795,485,540,90]`.

The historical descriptive note's right-facing line, three filled reference
points and left-to-right labels `a-epsilon`, `a`, `a+epsilon` agree with the
independently frozen optical inventory. That agreement is a TEXT-metadata
comparison, not new pixel evidence. The frozen inventory also distinguishes the
unmarked far-left stroke end, right arrow tip beyond the last labelled point,
and the two excluded neighborhood endpoints.

No crop PNG was opened. Exact boxes, snapping, component segmentation/count,
caption-row coordinates, crop completeness/legibility and modern rendering are
NOT CERTIFIED. Nine segmentation components are not nine mathematical points.

## Separate UNKNOWNs and exclusions

- Earlier examples1/2 and the precise earlier approximation definitions remain
  outside the supplied N21 review. Their frozen limitations are unchanged.
- Natural-number inclusion of zero remains a convention UNKNOWN; the already
  derived positive-N witnesses resolve the mathematics without changing source.
- Epsilon/font variants, Cyrillic/Latin homographs and punctuation encoding are
  not certified from print. Their candidate encodings do not alter the reviewed
  mathematical structure.
- Figure crop/coordinate issues above are optical exclusions, not D1 and not
  evidence of an incorrect three-point mathematical inventory.
- Source78's byte-identical, approved N21 projection is reused as explicitly
  authorized; it was not reread, rehashed or optically re-reviewed.
- Source82's frozen heading-only N22 boundary suffices. No source82 candidate
  body was read; no N22 prose, mathematics or approval is needed or granted.

Phase B loaded zero new images and ran zero new mathematical/native/application
checks. Context image total remains four. Only this comparison file was written.
Current disposition is the narrow D1 HOLD above; modern/key TEXT-only comparison
can use the existing independent mathematics when specifically disclosed.
