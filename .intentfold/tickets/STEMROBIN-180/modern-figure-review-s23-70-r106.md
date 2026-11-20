# FIG70 Independent Review R106

Verdict: **REVISE**. Scope: STEMROBIN-180 / 180-6 / section 23 / FIG70 only.
This is one fresh independent visual/provenance decision, not TEXT, ANSWER,
CHOICE, publication, full-course DISPLAY, or product acceptance.

## Findings

- **FIG70-R106-01 / P2 / unsupported apparatus provenance.**
  `spec.json#/source/inventory/0/description` calls the lower transverse member
  a "reference arm"; the `a-reference-arm` / `b-reference-arm` object IDs and
  corresponding assertion IDs repeat that interpretation. The independent
  pixels establish horizontal members meeting/overlapping the spring-end
  junction, not their mechanical function. The recovered FIG70 paragraph
  never identifies this component. Function remains **UNKNOWN**. Accurate
  source inventory must separate the visible member from any proposed modern
  interpretation. This is a provenance defect, not proof that it supports or
  arrests the spring; no removal or apparatus redesign is justified here.
- **FIG70-R106-02 / P2 / ambiguous force-label association.**
  `added-a-load-1-force` renders `1 N` at SVG `(282,365)`, beside the suspension
  connector between spring bottom `y=350` and upper block `y=395..435`.
  Its associated `0.1 kg` is at `(282,428)`, beside the block. The four left
  numeric labels form an ungrouped column at `y=365,428,491,554`, with equal
  63-unit spacings and no leaders or explicit pairing. In both supplied
  views, `1 N` can be read as a force at the upstream suspension rather than
  the upper block's weight. The experiment requires unambiguous individual
  weight association. This is a misleading-use risk, not a demonstrated
  claim that the actual suspension force is 1 N. A scoped label-association
  correction needs affected-only review; this reviewer made none.

## Independent Evidence

The complete original PNG was SHA-verified and opened **once**, before any
candidate or recovered prose reading. Its pixel-only inventory was written
and frozen `0444` first:
`tmp/resume-180-6/s23-fig70-independent-r106/independent-pixel-inventory.json`,
SHA256 `7a6c7e595e178b999d5f079f29848bf25c971d8a0a104530ce1f742baa84dac7`.
Then both complete recovered templates, complete spec, render and native JSON
were read; all 43,678 SVG bytes were parsed as XML without rendering.
The new complete native screenshot was SHA-verified and opened **once**.
It shows the full-width 640 figure and mobile-width 297 figure.

Pixel facts: two stands with bases, masts, upper and lower horizontal members,
two left blocks with serial hooks, one larger right block with hooks, comparable
drawn spring spans, and two bottom subfigure marks. No numeric/unit labels or
calibrated extension/equality marks occur in the original.

Prose facts: `lesson.template.json#/prose/1/text` supplies the mass/weight pairs
0.1 kg / 1 N and 0.2 kg / 2 N under the stated 10 N per kilogram approximation;
it requires replacement with one 3 N weight producing the same stretched
length. It does **not** assign these pairs to upper versus lower blocks.
The complete exercise context was read only to judge FIG70 instructional use,
not to replay or approve its semantics.

Modern additions: English `a`/`b`, numeric/unit labels, upper 0.1 kg / lower
0.2 kg placement, unequal left-block heights, clean coils and semantic palette.
Numerical additions are acknowledged by the candidate description. Neither
block ordering nor modern dimensions are recovered pixel facts; no reversed
ordering is established. The source inventory's "reference" designation is
the unsupported exception identified above.

## Checks And Limits

- Source structure/count mapping is visually retained. All 5 inventory groups
  resolve their object/assertion IDs; 31 spec objects, 7 labels, 13 assertions.
  Polygon-count and text-count assertions alone do not prove apparatus semantics.
- Both visible modern coils extend from SVG `y=100` to `350`, with matching
  endpoint relationships. The equal-length assertion implements a **prose**
  requirement, not exact source-pixel equality. No unloaded reference or
  measured extension is claimed.
- Units and values match the given approximation. The 3 N replacement value
  is already explicit teaching prose, not a newly obtained answer-key value.
  No visible Cyrillic, equation, force arrow, clipping or broken raster was found.
- Existing render PASS: 31 objects / 7 labels / 7 declared widths.
  Existing native fixture PASS: 14 observations / 98 label observations /
  minimum 16.70625 px. Labels are legible in both viewed sizes.
  Native evidence is headless current-app-CSS fixtures, **not headed product
  or full-course DISPLAY**. Determinism and these passes are not semantic approval.
- Source and candidate before/after identities are retained in the owned
  byte-identity records and manifest; no input bytes or modes were changed.
- Historical repair 1/1 retained; current label-only repair 1, cumulative 2,
  under the latest direct ordinary reversible recovery delegation; widths-only
  declaration correction retained. Reviewer repairs/regenerations: **0**;
  budget resets: **0**. This verdict does not authorize another repair.
- Actual tool image loads: **2** total, original 1 + native screenshot 1.
  Crops/reopens/browser/render: **0**. New paid image-generation calls: **0**.
  Tokens: **UNKNOWN**. Billing: **UNKNOWN**.
- No AUTHOR keys, answer-source, choice content, old reviewers, chats, agents,
  gates/recreation/attachment, promotion, DB/Git changes or full checks.

`fig-70.review.json` records `status: fail`, bound to actual source/spec/render/SVG,
plus native and recovered-text evidence. `review-result.json` records REVISE
and defect scopes. The PASS-only official recorder was **not invoked**.
All 7 produced files, including this report and the manifest, are frozen `0444`.
The manifest binds the other six outputs and all input dependencies by actual
SHA256, byte length and mode; its own hash is returned externally to avoid
an impossible self-referential digest.
