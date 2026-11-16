# Physical55 Affected Margin Allocation Clarification

## Scope and Evidence

This is an affected allocation clarification only. It is not a new StageA,
StageB, repeated source review, count override, or automatic approval.

Evidence is limited to the existing frozen source observations and the text
diagnostic supplied by the parent in this request. No diagnostic file was
opened, no image was loaded, and no command or pipeline was executed.

Frozen records remain immutable:

- StageA: `source-10c-p54-p55-independent-source-first.md`;
  SHA-256 `6a1bbcd5af9d206ce72ca2e46dd609066a79ef57c7f113082fe2292b445228a4`.
- StageB: `source-10c-p54-p55-independent-review.md`;
  SHA-256 `a2584f13da56a1b86dab4e00d92de195e4ac5e8ee7ff421994e9cadadea890e0`.

Parent-supplied diagnostic location:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-10c-p55-margin-diagnostic/diagnostic.json`.

Its reported ONCE exit0 and reproduced 17-versus-15 result are diagnostic
context, not evidence by themselves that either extra band is non-content.
The parent's statement that source, crop, audit, and tool bytes are unchanged
is supplied context, not a newly performed independent byte verification.

## Allocation Judgment

**SUPPORTED, limited to counting-only NON-CONTENT page-margin allocation.**

Here `scan-artifact` means an edge no-body area. It does not identify how the
marks were physically produced. Exact origin remains **UNKNOWN** for both
regions.

The proposed boxes use `[x, y, width, height]`. Inclusive pixel ranges below
describe allocation bounds, not new pixel observations or crop operations.

| Proposed Box | Inclusive Bounds | Existing Observation and Allocation Basis |
| --- | --- | --- |
| `[797,0,898,19]` | x797..1694, y0..18 | The frozen VisibleDefects observation identifies a dark uneven top edge. The supplied diagnostic locates its extra band at that page edge, with 2296 ink pixels. Existing content allocation places body, figures, captions, and footer outside this box. These observations support an edge no-body region, without identifying the trace's physical cause. |
| `[230,2479,1377,33]` | x230..1606, y2479..2511 | The frozen VisibleDefects observation identifies a thin irregular bottom trace at approximately y2485..2510. The supplied diagnostic's extra band encloses that trace, with 1717 ink pixels. The additional vertical allocation around the observed trace remains in the bottom margin, beyond the inventoried footer and other content. This supports an edge no-body region, without identifying its physical cause. |

The supplied diagnostic places the two caption bands at y722..755 and
y2201..2234 and the footer at y2280..2314. They do not intersect either proposed
box. The remaining 15 bands reportedly match the existing complete 15-band
body/caption/footer inventory. That correspondence is corroboration; the
classification rests on the already observed edge traces and their separation
from meaningful source content, not on subtracting 15 from 17.

No meaningful body text, mathematical glyph, figure stroke or label, caption,
or footer was allocated to either edge region in the existing frozen
observations. The bottom trace's approximate observed vertical extent is not
silently promoted to a fresh exact pixel reading of the entire proposed box.

## Limits and Hold Conditions

This supports only the two specified boxes under the stated edge no-body
schema. It does not support broader exclusions, content deletion, altered line
breaks, additional rows, count overrides, mathematical normalization, repairs,
or another finalize attempt.

**HOLD** if the proposed allocation would include meaningful source content,
if its geometry or bound source changes, or if contrary evidence identifies a
meaningful mark within either box. Existing observations support the narrow
allocation described here; they cannot authorize resolving any newly disputed
pixels with an exhausted image budget.

The original physical55 first-finalize failure remains historical:
exit1, printed17 versus MD15. This clarification neither changes that result nor
declares a global PASS. No exclusion, edit, retry, or pipeline approval is
performed by this document.

All source gaps and the prior open boundary are preserved:
`现在，为了写出方` remains OPEN; `ana10-c6-s3-n86` remains OPEN; its right boundary
remains UNKNOWN.

Image budget unchanged: **8/8 batch, 8/24 context**. Zero additional images.
Only this separate clarification file is written; old evidence and images are
untouched.
