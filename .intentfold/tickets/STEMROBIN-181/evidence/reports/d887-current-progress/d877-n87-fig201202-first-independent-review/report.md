# d877 FIRST Independent Figure Review

Card: `phy10-c2-s3-n87`. Overall: **HOLD**.

## Findings

- **Fig-201 substantive PASS; affected-context HOLD (metadata only).** The
  source wedge, reference plate, test plate and right hatching are preserved.
  Labels and geometry are readable at 331, 342 and 640 px. The current d858
  sensitivity qualification needs rebinding into the frozen spec's historical
  d837 `authoritativeText`; it does not require a geometry repair.
- **Fig-202 substantive HOLD; readability and visible cultural gates PASS.**
  The layers, film-thickness dimension, two reflected branches and transmission
  preserve the source topology. However, current d858 `/prose/8/text` explicitly
  says only normal incidence, perpendicular to the surface, while the visible
  incident and film paths are slanted. Assertions enforce nonzero horizontal
  ray displacement; only the thickness dimension is asserted perpendicular.
  Metadata saying “nonmetric separation” does not explain this to the learner.
- **Both specs need metadata-context rebinding.** Both embed the full d837
  bilingual context, including superseded sensitivity, frequency and
  integer-multiple-footnote wording. This is distinct from the fig-202 depiction
  finding. No spec, SVG or render report was changed.

## Disposition

No current figure approval or `ld-s10y-image/review@1` pass receipt is created.
SCI, ZHEN and independent review of the exact repaired text remain separate.
The current lesson entries still contain only figure id/label/page metadata,
not completed final-output contracts. No promotion or publication is implied.

Actual usages are lesson prose `/prose/4` (fig-201) and `/prose/9` (fig-202),
in both locales. All six exercises in each locale have no figure association.
The 331 px exercise screenshots are preventive fixtures, not actual usages.

## Evidence Scope

Exactly eight images: each bound original reopened once, plus existing
331/342/640 images for each figure. The 640 images are native final previews;
their product-width measurements come from frozen offline display evidence,
not fresh live-route screenshots. No rerender, browser, crop or extra image.
Semantic SVG paint and neutral screenshots were checked; no new accent/print
or live-product approval is invented.

The pre-comparison inventory is preserved. Its tentative reading of fig-202's
left opposed marks as rays is explicitly corrected to the source `h`
film-thickness dimension in `independent-findings-FIRST.json`; the downward
transmission continuation is also added explicitly. No original was reopened
again to make these interpretation corrections.

Original d848 validation/render/display failures and d858 repair failures are
hash-bound and untouched. The local audit reruns only two native spec
validators, verifies frozen hashes and writes solely inside this directory.
Paid, canonical/index/meter, Git, DB, publisher, deploy and other-chat usage is
zero. The bounded FIRST review stops here.
