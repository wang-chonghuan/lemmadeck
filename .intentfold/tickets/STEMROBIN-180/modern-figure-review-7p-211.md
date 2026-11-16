# Figure211 FIRST Independent Review

Reviewer: Feynman, not author Volta. Decision: **PASS** for the exact frozen figure211 only. No approval of blocked figure210, complete n84, or production promotion.

## Exact Input Freeze

Author root: `.tmp/s10y-image/7p/fig-211-author/`.
Independent root: `.tmp/s10y-image/7p/fig-211-review-feynman/`.

- Author handoff SHA: `5a6571b11d9c1323ef292d7a903c9f541999ca0371ad45f408b6332874412e53`.
- Authorized author manifest SHA: `0c64722f2c37fa6c35fb9cb9b70511ff041fbf13241d374577e3b7e4adfc8985`.
- Independent input-binding SHA: `7fd970e9ae498520c4a0158da9f6ddf4a71ca0675e6e541e8286df402205d50d`.
- Durable original PNG SHA: `32eb97ecb06175722a3babb71b5f96e8d8c51c819573c1a7a168dd085f23d2c8`.
- Complete approved modern context SHA: `258eca48dfded5c16f692be0e1279ff52ed536fed5648f2474f19876c57f3847`.
- Modern lesson/exercises SHA: `f72be94126220904b8cba826564efb4265428a6669773a6ef171dc06cf5415bb` / `cd3b496bdbc6f4bfcf8ac864b63f43913c1bebd6cb64d898ad61377b1b64c237`.

Before current spec/artwork/SVG/native inspection, the original211 PNG was actually reopened and independently inventoried. Complete raw lesson JSON/MD/all six original tasks and approved full upper modern text were read. The independent inventory is `source-first-inventory.json`, not copied from the author's inventory. Input bookkeeping verified every authorized author-manifest file and external text input by exact bytes/hash and made 66 distinct file copies under `inputs-01/`; this was not a gate or source re-review. Cancelled210 outputs and its external historical pricing files were not inspected or approved.

## Full Source And Functional Review

| Unit | Independent observation and disposition |
|---|---|
| Two hands and hand pump | Original has an upper hand holding the plunger handle and lower hand holding the same inclined cylinder. Original generation, final artwork and all six final samples show both complete grips, plunger, cylinder, collars and lower fitting. Forearms leave the frame as contextual limbs; neither hand or functional pump part is cropped. PASS. |
| Pump outlet / hose joint | Source outlet joins the hose at the lower pump fitting. Full U-loop joins that fitting visibly, without a white break. Object `pump-outlet-hose-junction` and its `connects` assertion bind [268,355] to [285,359] in user coordinates; actual SVG is [268,605] to [285,601]. The short ink segment lies on the visible joint, not a detached line or an invented quantity. Lower unlabelled end detail is retained as shape, not claimed as an added valve or calibrated vent. PASS. |
| Continuous hose | Complete hose descends, bends through its full lower U and rises to the separate bottle shoulder inlet. Both ends and lowest curve are visible at306/640. No second hose/state or invented flow arrow. PASS. |
| Separate vessel inlet | Original hose goes into a separate upper-side/shoulder opening, below and independent of the main neck. Artwork and samples retain that distinction. Object `vessel-separate-side-inlet` / its `connects` assertion bind [389,348] to [410,351]; actual SVG [389,612] to [410,609] lies on that joint. It does not close or route through the main mouth. PASS. |
| Complete glass vessel | One thick-looking upright glass vessel with complete sides, shoulder, neck and base remains in frame, separate from the hose. Clean natural material styling regularizes an uncalibrated historical drawing; no liquid-level measurement, extra vessel or scale was invented. PASS. |
| Open main mouth / ejected stopper | The open neck rim is visible, and one cork is already above the mouth with a clear gap. It is not a sealed cap or second apparatus state. Source moment is retained without speed/pressure/force labels. PASS. |
| Internal mist | Visible mist remains inside the vessel, down toward the base. Neither a clear empty bottle nor an invented measured water-fill level substitutes for source fog. Fog is a qualitative event, not a thermometer reading or a prescribed droplet count. PASS. |
| Full context / leakage | Approved prose explains air admission through a separate opening, rapid expansion/ejected cork, cooling and mist with limited heat exchange, and explicitly forbids self-pressurization. Full17 entries and six g1/g2 prompts were read, including the open example/explanation requests and coin-friction observation task. Figure depicts only the source apparatus/event; no “internal energy decreases” caption, equation, mechanism answer, measured temperature, pressure, volume, operating steps or task answer was added. PASS. |

All three objects and all three assertions were read, as was the complete SVG. `one-coherent-artwork-scene` is only an image-object-count assertion. It does not prove two hands, cork position, mist or functional continuity: those were independently established from pixels. The two `connects` assertions and actual SVG endpoints were checked against the visible joints, not accepted as self-proving connectivity. No source grid, calibrated distance, labelled point geometry or symmetry exists to be replaced by objectCount.

## Layers, Display And Six Actual Samples

Original generated `artwork-opaque.png` and final separate `fig-211.artwork.png` were actually opened. Complete overlay SVG was read independently: two semantic-ink joint lines, no visible text, ticks or arrowheads; construction points/default-colored paths are `display=none`. Existing combined native samples were each actually opened, not inferred from author PASS:

| Existing sample | Actual media | SHA256 |
|---|---|---|
| 306 neutral | 306x459 | `a91dc10e4555790f47bce6590776712424756e117d978badb42057f281678129` |
| 306 accent | 306x459 | `0327b80659ecea82b25933d7fe5bee0198c7e1b53b87ddcbbb741712cb7847dd` |
| 306 print | 306x459 | `8242b51c4c674cc114114837765e2ab73ebe85116fa4ba8b6f02e6bbdf39f727` |
| 640 neutral | 640x960 | `7681190cd555aceb3e9c1a692c9f492ba45d4925a78e770e54b5c15b7f95369b` |
| 640 accent | 640x960 | `d34956a43c6e63b80a799fa2b55e2c3d0e485bea65497d3108968e2c05b1c3ee` |
| 640 print | 640x960 | `0001617eb72ef900a1e95e1b1d94dd627ec082726b58e2dc4d84a98994cce8e9` |

Full bottle base, hose U, pump end, hands and separated cork remain visible in every sample; no clipped functional object, blank layer, detached overlay, stretch or obstructed port. Original generated aspect ratio1024x1536 and final640x960 preserve the same ratio. Existing renderer `xMidYMid meet` evidence is reused. Native display is inline, so horizontal-scroll-end review is not applicable.

There are zero visible source or modern figure labels. `minTextPx16` is declared, but measured minimum is correctly null, not a fabricated16px measurement. Visible SVG uses `--ld-figure-ink`; natural-color raster materials remain legible in all three themes. No old engraving texture, copied scripts, cultural symbols or archival-identity claim. No new preview or layer image was generated for this review.

## Bound Outputs And Evidence

- Spec: `6a06860d1c794f29344925421a4f15374a6782e2d77e2a4b7dd239db38ae1b11`.
- Render: `55009e6c05ed34e2e774af2d105d61d88f78be3a3c6aa7d7c60030c4289d3582`.
- Full overlay SVG: `06effe512ae20ecb6247e1089b6aec03649384d521d3eaba518a567710cc6027`.
- Separate final artwork: `b8ea820e250f742402634124de0646d6844f124de685c6f3f5c5ad87e9bc38f5`.
- Original generated artwork: `7692f022573bfe95ed1ba40657e0539466eef1080f075d52f35422972140b3af`.
- Generation metadata: `03d140cca2216f395df1f4261a7828d3a458bcf38c4488ba8fe56d5265d16ea3`.
- Native metadata: `2934224e098c4a8c141b50732d13cf712f543461b33ee6bcc0093d52c8b2d896`.

Successful author validator/render/native executions were read and reused, not rerun. Ledger and generation metadata record exactly one Azure request, n1, retries0; actual billing and returned usage remain null. The author's preflight is a2.35USD planning allowance under5USD, not measured spend or a billing-enforced cap. Reviewer made no network/service/model/browser calls.

Necessary findings: none. Author repair0/1 remains unchanged; no repair was consumed by this FIRST PASS. After this substantive decision, `record_review.py --render` is authorized exactly once to the independent root; its intrinsic binding checks are not a separate author-gate rerun. Command/exit and the resulting review@1 hash are bound by `reviewer-handoff.json`.

No author bytes, source, modern text, canonical files, stable tool, DB, Git or promotion were changed. Review is scoped to this frozen figure211 only.
