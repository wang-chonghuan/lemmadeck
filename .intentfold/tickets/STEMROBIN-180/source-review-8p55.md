# FIRST Source Review: 8p Physical Page 55

Ticket: STEMROBIN-180/C. Decision: BLOCKED. No source approval or promotion.

## Findings

1. **55-D1: underdots omitted.** Independent source-only inventory froze two dots under 连续 in the sixth paragraph's first row and three under 连续性 in its second row. The original lower-page detail shows both. Candidate Markdown/JSON and FIRST input omit both emphases; FIRST author's `formatting.underdots: []` is false.
2. **55-D2: italic conditional omitted.** The source italicizes 如果物体（或点）沿着直线从 A 点运动到 B in the visible last prose row. Candidate and FIRST input preserve only math styling for A/B, not the italic Chinese span. FIRST author's `formatting.other_italic: []` is false. Nothing beyond the visible B is inferred.

These are independent defects, not one bundled correction. The decision is BLOCKED, with no repair, source correction, rereview, replacement review or sole-correction HOLD referral.

## Uncertainties

- The source-only freeze records the opening 例如 as slanted-looking but does not establish definite bold or intentional italic. FIRST/candidate `**_例如_**` and FIRST `unresolved: []` must not settle that uncertainty.
- Printed sentence ends are solid dots; the source pixels do not establish a Unicode code point. Candidate fullwidth dots are not declared a code-point defect.
- The unchanged frozen inventory records a comma after the first paragraph's 米; candidate/FIRST record a fullwidth dot. This specific punctuation disagreement remains unresolved. No image was reopened and no frozen inventory was corrected.

FIRST `complete: true` and `unresolved: []` overclaim source certainty: two definite styles were omitted and the opening-style uncertainty remains.

## Evidence And Counts

The complete independent inventory was frozen before reading any candidate body, FIRST source facts, invocation receipts or audit semantics:

`.tmp/ld-s10y-lesson/source-review-8p55-first/source-inventory.json`

Frozen inventory: 6891 bytes, SHA256 `0dc22a404be3b87d057d70de858ee8d9ab0b7c6be5d62ab9b96637b1819e47ef`.

Source: 6 prose paragraphs, 24 body rows plus 1 footer row, 7 blocks, 0 headings/exercises/figures/captions. Footer's two round bullets and bold italic 43 are preserved. Formula arrows, average subscripts, scalar t, values and the final open flag agree, subject to the listed punctuation uncertainty. No numbering scope is inferred.

The existing FIRST actual invocation was read once, not rerun: exit 0; 25 printed/Markdown rows, 7 blocks, 0 figures, 0 normalizations, 0 audit errors. This is mechanical agreement, not source proof. Candidate Markdown, JSON and audit plus page-55 FIRST inputs/receipts were read in one bounded comparison. Main's completed bindings invocation is reused without reading or rerunning it; no equivalent author-leaf hash checker ran.

Defect families: 2; affected sites: 3. Source uncertainties: 3. FIRST overclaim families: 3.

## Authority And Limits

Workspace: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.

Aggregate was checked for identity only: OBJECT with files ARRAY of 84, 17406 bytes, SHA256 `21854709dd3b114bb82c1174c8eec34845765fed2eb0308542004f9905b23913`. No aggregate body/report/ledger semantics or pointer recursion.

Clean page-55 authority: OBJECT with workspace_base equal to the workspace and files ARRAY of 46, 9496 bytes, SHA256 `dedf975333d3a505394fd7330b534bc623ac89ac85e31457c6616e1c79235671`.

Page 55 shared smallest-repair allowance: limit 1, used 1, unused 0. Author startup/source 0; reviewer startup/source retries 0; reviewer mechanical completion retry 1. Reviewer startup and crop invocation each succeeded first time. No extra source allowance.

The FIRST source review completed before packaging with used 0/unused 1, and `first-review-0055.json` remains unchanged at that point-in-time accounting. FIRST packaging then exited 1 because its guard incorrectly required the two working PNG crops to be 0444 rather than the required 0644. The crops were already correctly 0644; no chmod, recrop, source read, candidate read, source correction or review replacement occurred. The sole mechanical correction recognizes PNG crops as working 0644 files and completes only current status/report/manifest evidence. `status.json` and `budget-use.json` carry the final used 1/unused 0 accounting. The failed package script, FIRST failure stream and earlier frozen status/report are preserved.

Page 56 remains permanently BLOCKED after its user-reported FIRST exit 1, actual used 0, unused 1. It was unavailable for review. No page-56 body, image, actual-failure receipt, mixed author report or ledger was read.

Images: one original grid and two owned bounded crops, 3 in this batch/context, no reopens, parent 0, inflight 0. Limits: 8 per batch, 24 per context. Full source PNG was used only by the crop script, not loaded visually or duplicated; no whole PDF, frozen grid or author crop.

Structure baseline unchanged: 8p approved11/entries0/modern0/numberingUNSET, permanent gaps17,18,20,23-27,29,30,33-37,39-54,56. 7p approved63/raw54pages21entries85tasks, gaps239242246257271-277280281288-296298-308310312-317. Neither page 55 nor 56 is approved; no full unit, inherited structure or other-book numbering is asserted.

Only new owned review evidence and the new ticket report are written. Author and other workers' inputs remain untouched. No freshness/Grill/backend/network/Git/env/app/DB/publish/merge/deploy/assembly/handoff/supervision/full-project checks/repairs/finalizer rerun/replacement review/promotion.

## Delivery

The first review, status, image ledger and this report are created before the current manifest. The manifest is a flat OBJECT with `workspace_base` and a `files` ARRAY of direct existing `{path,bytes,sha256}` records. It excludes itself, contains no history and expands no incoming manifests.
