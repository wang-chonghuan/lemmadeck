# STEMROBIN-184: Bounded AUTHOR Source-Defect Observation

Observation date: 2026-11-16. Evidence copied at 14:42:32 UTC; all five image observations completed before 14:43:22 UTC.

Role: AUTHOR source observer only. This is a new observation of exactly two affected discrepancies, not a repeated full source/math gate, acceptance decision, approval, or publication authorization.

## Boundary and Method

- Existing worktree: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
- Content inputs: current durable `page.md` text/metadata for physical 59 and 62; their respective raw prepared `page.png`; only the B-REFLEX/B-DIRECTION qualifications and corresponding provenance uncertainty in `geo910-n15-n16-math-independent-review.md`.
- Opened the two raw full-page PNGs first, before reading current transcriptions or mathematical qualifications. Then observed three narrowly bounded crops of those same source pixels.
- Image budget: one batch, 5 images total = 2 raw full pages + 3 crops; 5/8 batch and 5/24 context. No reopens, grid PNGs, old image history, generated illustrations, answer images, or independent-observer output.
- No full source review, mathematical re-derivation, exercise solving, or other discrepancy observation. Pixels outside the requested spans on the full pages supplied location context only.
- No source pages, templates, tools, counters, or other workers' files edited. No prepare/finalize/assemble, Git, backend, DB, publish, app, or dependency operations.
- The separate independent observer was not contacted or given these author findings, and its report was not read. No independent approval is inferred here.
- Owned outputs are this report and `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-n16-source-defect-author-evidence/` only.

## B-REFLEX: Physical 59, Printed 52, p0059#5

Raw source:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/9-10g/pages/0059/page.png`

Current transcription:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0059/page.md`

The two relevant visible strings, represented with the current transcription's LaTeX encoding of the printed mathematical relation, are:

```text
反身性（$\Phi\cong\Phi_1$），
对称性（如果$\Phi_1\cong\Phi$，那么$\Phi\cong\Phi_1$），
```

The source relation glyph has a horizontal double-loop curve above two parallel horizontal strokes. `\cong` above reports the existing transcription encoding; it does not assert a Unicode codepoint for raster ink or silently replace the source's glyph by a preferred modern shape. The source is printed ink, not an encoded string; parentheses are represented as readable textual punctuation.

Every Phi operand in these two spans, in left-to-right reading order:

| Span | Operand | Visible base glyph | Visible subscript |
| --- | --- | --- | --- |
| Reflexivity | left | Phi | NONE |
| Reflexivity | right | Phi | 1 |
| Symmetry premise | left | Phi | 1 |
| Symmetry premise | right | Phi | NONE |
| Symmetry conclusion | left | Phi | NONE |
| Symmetry conclusion | right | Phi | 1 |

In particular, the Phi on the right of the printed reflexivity relation really has a lower-positioned `1`. It is not an unsubscripted Phi, and the subscript is not UNKNOWN. The four symmetry subscripts are likewise visible: `1, NONE, NONE, 1`. No additional Phi occurs within these two requested spans.

Existing faithful transcription comparison: MATCH for both requested strings and all six Phi/subscript positions. This does not assess the paragraph's adjacent transitivity statement.

Source-versus-math distinction: the printed source itself labels `\Phi\cong\Phi_1` as reflexivity. The approved B-REFLEX qualification distinguishes this from self-congruence `\Phi\cong\Phi`; that mathematical defect is not a transcription defect. The requested symmetry string is faithfully transcribed; this observation finds no source/transcription difference in it. Neither the printed reflexivity statement nor its faithful transcription has been corrected.

## B-DIRECTION: Physical 62, Printed 55, p0062#2

Raw source:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/9-10g/pages/0062/page.png`

Current transcription:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0062/page.md`

Visible definition, preserving the three printed text lines:

```text
所有与同一条直线方向相
同的射线的集合，叫做在空间
的方向.
```

The critical visible substring across the first line break is `同一条直线方向相同`. The source clearly prints `直线` at that location, not `射线`. The later `射线` in the second line is also visibly present and has not been used to override the earlier word.

Existing faithful transcription comparison: MATCH, including `直线`, the first-line break between `相` and `同`, and the rest of this definition. The current `page.md` uses the same three text lines.

Source-versus-math distinction: the `直线` wording is present in the actual printed source, not introduced by transcription. The approved B-DIRECTION qualification says an unoriented line does not select a unique ray-direction class, making this source terminology defective/ambiguous; a ray-class reading remains conditional. This observation does not replace `直线` with `射线`, supply an orientation, or assert an inferred intended wording.

## Evidence and Hash Bindings

Evidence root:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-n16-source-defect-author-evidence`

The two evidence `page.png` files are byte-for-byte copies of the raw prepared PNGs observed at full-page size. Evidence `page.md` files snapshot the current durable text/metadata, not an old transcription.

All hashes are SHA-256:

| Evidence file relative to evidence root | SHA-256 |
| --- | --- |
| `0059/page.png` | `95c14531579e127b2046d4a14463c4407c5b7f73f1aa9666c2774d04456c39cf` |
| `0059/page.md` | `a9e1f7175028521d2e7fd3d6194ff7f21cdcb5782f13c66f0ba038defb3bf1ab` |
| `0059/reflexivity.png` | `f13001dc4c54d1c59062e0c69532d864150d5fac13d6eb4c9f033fc81b01cc6c` |
| `0059/symmetry.png` | `0b44df2457bb0be19ab9b540f7b9c745eb286decfede17f2dce8d7b15128c9b3` |
| `0062/page.png` | `e98e4a08d20a66492f951ce08d7f402e68a90055fbe7a38543917334c30799d9` |
| `0062/page.md` | `87eb7964c80b9d689042e905275fabb3e4050bd4e1f9cc2d3ff9a3de5e87e91f` |
| `0062/direction.png` | `207511a773280cd5e6a2c3cf9e2f0444b2d4058856eb978c020cd51e8b8dbc6e` |

The two raw PNG hashes match their current `page.md` metadata `render.sha256`. Both full-page sources are 1506 x 2126 pixels, recorded as 300 dpi.

Crop coordinates are `[x, y, width, height]`, zero-origin, in the corresponding original full-page pixels:

- `0059/reflexivity.png`: `[195, 810, 1085, 70]`.
- `0059/symmetry.png`: `[105, 885, 655, 70]`.
- `0062/direction.png`: `[130, 425, 615, 210]`.

Crops were made with `sips --cropToHeightWidth HEIGHT WIDTH --cropOffset Y X SOURCE --out DESTINATION`. Only cropping was requested; no resizing, sharpening, thresholding, annotation, OCR, or enhancement. Observed crop dimensions match the recorded rectangles.

Mathematical qualification input:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-n16-math-independent-review.md`

SHA-256: `427c44a87b366b57d1a683513b9334dec3d8a4a85d86e786edbd3123f4e3f858`.

Only its B-REFLEX/B-DIRECTION qualifications (lines 24-25) and the relevant prior printing-versus-transcription UNKNOWN (line 338) were used. This pixel observation resolves that narrow provenance uncertainty for these two spans on the bound PNGs only. It does not amend the mathematical review or claim anything about other editions, authorial intent, or other UNKNOWNs.

## Observation Result

Both requested discrepancies are visibly present in the bound original printed pixels and faithfully retained in the current transcriptions. The first is a printed mathematical statement error; the second is printed terminology ambiguity/defect under the approved qualification. Neither is an observed transcription mismatch. No relevant glyph or subscript remains UNKNOWN in the requested spans. No correction or approval is issued.
