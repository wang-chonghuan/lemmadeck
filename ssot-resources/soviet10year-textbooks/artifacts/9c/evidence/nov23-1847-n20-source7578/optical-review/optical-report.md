# Bounded Optical Report

Date: 2026-11-23. Sole working root: /Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184.

Frozen observations: optical-freeze.md in this directory, SHA-256 `fb72ede4dc9c7ea5f58b986dd40c973b959d6b2fec57718f6c2ebaaa53a3616c`. Written before this report and before byte-hash verification. No subsequent optical reconsideration or image reopen.

## Findings And Dispositions

| Target | Pixel finding and confidence | Disposition |
| --- | --- | --- |
| 0076 upper left-edge mark | Solid, ragged, left-clipped blot with fringe speckling; no independently identifiable character. Morphology: high; provenance: low. Classification: UNKNOWN. | Retain. No exclusion authorization. Protect the nearby caption and all figure ink. |
| 0076 lower left-edge mark | Small lobed marginal blot, white separation, isolated speck, and distinct figure-origin ink at ROI right. Morphology/separation: high; provenance: low. Classification: UNKNOWN. | Retain blot and speck. Protect horizontal/vertical figure strokes and origin label. No exclusion boundary approved. |
| Exercise 157 defining-row base | Lowercase italic z-shaped base immediately before a lowered n-shaped glyph. Shape confidence: medium-high. Latin `z` (U+007A) is a transcription proxy only; source codepoint/alphabet UNKNOWN. | Record visible `z` with subscript `n`, preserving the encoding caveat. No formula correction or source edit authorized. |
| 0077 middle approximation token | `0 [gap] 33` followed by a comma-shaped separator. No visible dot/comma inside the middle gap. Confidence: high. | Preserve gap and trailing comma observation. Do not insert a decimal mark from neighboring tokens or expected mathematics. Intended/lost character UNKNOWN. |
| 0076 opening-formula intervening ink | Thin interrupted horizontal fragment followed by a thicker horizontal fragment, before a separate clear two-stroke equals. Presence: high; grouping: medium; identity/origin: low. | Record `[irregular ink; UNKNOWN]`. Retain all ink; do not interpret, delete, or normalize it algebraically. |

Every ROI contains its requested object. Technical location failures: 0. No whole-page or whole-figure PASS is issued. No other disputed punctuation is asserted from the context originals.

## Bindings

Scratch root S = /Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n20-nov23-source7578.

Paths below are relative to S. Bounds are original-source `[left, top, right, bottom]` from the permitted manifests; they are input bindings, not exclusion rectangles. Hashes were computed from file bytes after freezing and match every relevant source/crop hash in the manifests.

| Observed image | Source page / bounds | Verified SHA-256 |
| --- | --- | --- |
| prepared/9c/pages/0076/page.png | Context original | `6e7977e9721d5d9a40ef423fbdd06e9028c9a398538355b271651688616bf4ae` |
| prepared/9c/pages/0077/page.png | Context original | `01f5ddb10cd704d5240cf4bb1667f986c5785b23462cdc5b9f1d60f66cb73e9e` |
| prepared/9c/pages/0078/page.png | Context original | `764747c3da056b31866efb9a4268523bcd3ba7619856ef8c7dfed913fa536164` |
| optical-recovery/left-edge-upper.png | 0076 / [0, 800, 200, 925] | `8b10b6faa2cc129f7407818ab26aa874c2ff5e53930f5dc7b086e4565aeb0142` |
| optical-recovery/left-edge-lower.png | 0076 / [0, 1610, 320, 1730] | `3b393540e0ee5f1d8994ba2bfa5134b0362847bdf05a33769a151e6e6f6398bc` |
| optical-recovery/exercise157-base.png | 0078 / [730, 475, 1150, 580] | `6a0a08c2b58469e9bf2422fbc41bfeb75a3a78ff41c9af40dec34e82e5dfee79` |
| optical-recovery-extra/top-formula-ink.png | 0076 / [675, 170, 1005, 300] | `a988f74763ab3829b4752211c50dbe310a98f7cdd873cacd06e949e6482bab55` |
| optical-recovery-extra/alpha2-token.png | 0077 / [250, 545, 1200, 620] | `efa8ac39c14c2d80cdcb6993e85ab189c6f54f6a353ab63df304791c43edfd24` |

Manifest-byte bindings:

- S/optical-recovery/manifest.json: `ebba51d81537ed6c37c5319e74ae64ac429f5f8210b0b19bb6bf5b97dfd2401f`.
- S/optical-recovery-extra/manifest.json: `3142d1a37a7659d13e817ab77d527f9d24ad6442a2f4bac9a3e2589e6e4c53c1`.

## Actual Accounting

- Image batches: 1. Unique images observed: 8. Image loads into context: 8 = 3 context originals + 5 supplied original-pixel ROIs.
- Per-image loads: exactly 1 each. Reopens: 0. Additional images/crops/rescaling: 0. Ninth image: not opened. No second batch.
- Tool route: eight local view_image calls dispatched together by one parallel wrapper. Absolute image paths stayed within the sole root; every shell call explicitly used that root as cwd. No browser or external image/model service.
- Text before freeze: shared ld-s10y-image SKILL.md plus filtered metadata from the two allowed crop manifests. The initial metadata filter failed because the manifests were arrays; the corrected filter selected only paths, bounds, and hashes. Neither call supplied candidate readings.
- Post-freeze byte hashing of eight image files, the two manifests, and the freeze did not display or reopen image payloads.
- Existing-file checks confirmed both output names were absent before creation. Writes: only optical-freeze.md and optical-report.md under the owned optical-review directory. No existing file overwritten; no staging operation.
- Candidate/old author/reviewer readings, solutions/keys, source-text/math replay, figure 9 work, network/browser, .env, DB, Git, app/dependency operations, peer messaging, native/finalizer tests: 0.
- Masks/exclusions, source edits, formula corrections, source-HOLD releases, publication authorizations: 0.

This report resolves only the bounded optical observations above. Provenance, intended missing characters, and exact source codepoints remain UNKNOWN where stated.
