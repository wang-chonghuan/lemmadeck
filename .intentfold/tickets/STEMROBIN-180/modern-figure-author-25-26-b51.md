# First Modern Figure Author: 25 / 26, B51

Date: 2026-11-17. Scope: `6p`, `phy6-c3-s1`, existing offline checkout. Authoring only; independent TEXT review is in progress. No TEXT approval, figure approval, promotion, publishing, DB/Git operations or app/dependency/tool changes are claimed or performed.

Owned scratch: `.tmp/s10y-image/b51-fig25-26/`, with isolated `fig-25/` and `fig-26/` roots. Existing shared utilities are read-only. This report is the only write outside the owned scratch.

## Frozen Authority

- Modern candidate lesson SHA-256: `376eb2a93b85758ebca1434d014323d9d1371ccb50040c9b50a9529265340c3f`.
- Modern candidate exercises SHA-256: `8a817e764d196570de530e74c28d9f1945e45a2e563e707f8fa9402e7c8668cf`.
- Exact files: `.tmp/ld-s10y-lesson/text-author-motion-b51/candidate/lesson.template.json` and `exercises.template.json`; frozen byte-identical in the owned `artifacts/6p/editions/modern-us-neutral/lessons/phy6-c3-s1/`.
- Complete raw lesson JSON/Markdown and all 8 raw exercises read from canonical `6p/lessons/phy6-c3-s1/`. No answers, keys, choices or other figure-author proofs read.
- Official `build_context.py` called once per figure against the owned ephemeral artifacts tree. Source lookup is a symlink, not copied PNG; `context.sourceImage` and `spec.source.image` use the canonical durable PNG.
- `authoritative-text.json` SHA-256: `8ec287c9c7266246c5ed7e0b7b97ff7955b7a09ab770a74156053648d2aaf793`. Both specs contain these same 23 complete actual modern strings, stable source/exercise identifiers and per-string SHA-256 identifiers, not JSON containing scratch paths. Authority contents will not be altered later.
- Figure 25 source SHA-256: `d3b5b247fc6e3431c11936d75c28d630a7d2f78a38270ade8ea398ebef3ed65a`.
- Figure 26 source SHA-256: `f1b7bc38028e55b9c54694e2f16a0df2e3f9466268c8bf9755733625f97c02db`.
- Both canonical source PNGs opened once, with full source inventories frozen in each `source-inventory.md` before drafting specs/object lists.

## Routes And Display

25: generated semantic scene containing the full source urban inventory: one pedestrian and bag, one car/two wheels, one airplane, one bird, two vegetation groups, nine building bodies including spire/finial and rooftop penthouse details, road/shadow. Contemporary civilian appearance; no text-only examples added.

26: deterministic JSXGraph, 16 connected straight segments, 15 sharp bends, two filled endpoint molecule discs and original self-crossing topology. No generated mathematics, added angle values, branch markers, labels or arrows.

Both instructional inline, maximum 640 px, native complete previews generated and opened at 306 and 640 CSS px with minimum-text contract 16 px. Neither source has internal labels and neither candidate requires visible labels. Vector colors are semantic roles; figure 25 semantic raster artwork uses natural colors.

## Figure 25 Preflight

Authorization: requested content production; no resource creation or deployment mutation. Read-only Azure login state `Enabled`; account `FinleySwedenCentralInstance`, resource group `finley-azure-openai`, existing deployment `gpt-image-2`, model version `2026-04-21`, SKU `GlobalStandard`.

Current official Azure public pricing read through `cloak-fetch` on 2026-11-17: GPT-Image-2 Global per million tokens, text input USD 5, image input USD 8, image output USD 30. Documentation URL: `https://azure.microsoft.com/en-us/pricing/details/azure-openai/`. Context7 resolve + two docs calls read the current image-edit contract. Older model fixed-output-token tables were explicitly not treated as GPT-Image-2 counts.

One request: n=1, 1536x1024, high, opaque, canonical durable reference PNG, full 12,277-byte prompt, retries=0. Conservative planning allowances: 12,277 text tokens (one per UTF-8 byte), 32,768 input-image tokens, 65,536 output-image tokens. Calculation: `12277*5/1e6 + 32768*8/1e6 + 65536*30/1e6 = USD 2.289609` per request; at most one affected-only repair means two requests / USD 4.579218 per figure, below USD 5. These are deliberately generous planning allowances, not API-enforced limits or an invoice.

Billing observability: unchanged official `n-azure` helper preserves prompt/request/reference/output hashes but discards response token usage, request IDs and invoice data. Report actual request count and absence of billed-cost visibility, not a fabricated actual cost.

Repair preflight, before request 2: prepend 1,760 bytes of affected-only count instructions; full repair prompt 14,037 bytes. Same n=1, size/quality/background/reference and retries=0. With the same generous image-token allowances, `14037*5/1e6 + 32768*8/1e6 + 65536*30/1e6 = USD 2.298409`; total two-request figure allowance USD 4.588018, still below USD 5. No third request is allowed.

## Execution

Initial draft validation ran once per figure: both PASS. Figure 26 JSXGraph render ran once: PASS, 18 objects, 0 labels, no collisions, both width checks PASS. Native media preview ran once for figure 26, producing complete 306 x 354 and 640 x 740 PNGs, both opened once.

Figure 25's first Azure request returned a PNG and metadata, but the one opened generated asset visibly has an extra far-side car wheel, an extra low background connector building and seven instead of six airplane passenger windows. Left facade window bands also exceed the source inventory. Its initial browser preview completed mechanically and was preserved without opening the two PNGs. One affected-only figure-25 repair was executed within the original budget; `fig-25/FIRSTFAIL.md`, the original PNG, generation metadata, prompt and initial native previews preserve the failed output. New generation and native previews use `fig-25/repair-1/`. No prior PASS validation/render or figure-26 preview was rerun; the changed repaired asset received its own complete-media preview.

Repair output returned 1536x1024 PNG (1,948,782 bytes), with unchanged-helper metadata and canonical durable reference. Its complete media checks at 306 and 640 px PASS mechanically and both PNGs were opened once. Residual author-production observations remain: an additional far-side tire is still visible under the front bumper; additional far-left/background facade structure remains distinguishable beyond the nine-body source inventory; the tall-left facade still exceeds eight window bands. The six passenger-window instruction is now represented, but the complete exact-count scene is not achieved. **Figure 25 is blocked, not accepted and not promotable.** Its repair budget is exhausted; no third generation, hidden fallback or further repair was performed. This is not an independent-review judgment.

**Figure 26 has mechanical PASS only and awaits fresh independent review.** No source-fidelity/visual-review PASS is claimed for either figure.

No independent review files or `record_review.py` calls will be authored. Promotion must wait for independent TEXT PASS and fresh independent figure review; the reviewer supplies substantive `independent-review*.md` beside each spec/review for the existing promotion helper.

Final image reads: **8 task / 8 context**, against 8 task / 24 context limits: source 25, source 26, figure-26 native 306, figure-26 native 640, initial generated 25, repaired generated 25, repaired native 25 at 306, repaired native 25 at 640. No crops or reopens. First figure-25 native previews were generated but not opened. No contact sheets or six-theme preview scripts. No further images may be opened in this task.

Repairs: figure 25 = 1 consumed by affected-only generated object-count repair; figure 26 = 1 conservatively consumed by the author-caused patch mismatch and count-field correction. Each figure has FIRSTFAIL evidence. No further repairs are allowed; a remaining defect must be handed to fresh independent review without claiming approval.

## Calls And Outputs

Calls: official context helper 2; draft validator 2 (one per figure); JSXGraph renderer 1 (figure 26); Azure image edits 2 (figure 25, n=1 and retries=0 each); complete-media browser preview 3 (26 once, initial 25 once, changed repaired 25 once). No `record_review.py`, lesson publisher, DB/Git command, promotion helper or app/dependency/tool modification. Context7 documentation commands: 3. Azure management calls were read-only. Existing Python, JSXGraph and app Playwright packages were reused; the only glue scripts are inside the owned disposable tree.

Python entry point for every Python execution: `env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B`.

Azure helper: `/Users/yong/.agents/skills/n-azure/scripts/generate_image.py`, with each full prompt file, `--reference-image ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-25.png --size 1536x1024 --quality high --background opaque --retries 0`. First output/metadata in `fig-25/`; repair output/metadata in `fig-25/repair-1/`.

Renderer: `node .agents/skills/ld-s10y-image/scripts/render_spec.mjs --spec .tmp/s10y-image/b51-fig25-26/fig-26/spec.json --svg .tmp/s10y-image/b51-fig25-26/fig-26/fig-26.svg --report .tmp/s10y-image/b51-fig25-26/fig-26/render.json`.

Manifest: `.tmp/s10y-image/b51-fig25-26/manifest.json`. This is an author-output index, not a publication-ready edition manifest. It deliberately has no fabricated review entry. Fresh substantive `independent-review*.md` and hash-bound review records must be written by the independent reviewer beside each root spec, after TEXT PASS; figure 25's known residual deviations must not be suppressed.

Final output paths and SHA-256:

| Artifact | Path under owned root | SHA-256 |
|---|---|---|
| 25 spec | `fig-25/spec.json` | `52f968071186aae80b752c78ec9d2baf69c8ff082f135a0a482377f5128a4cc8` |
| 25 blocked repair PNG | `fig-25/repair-1/fig-25.png` | `11aa2770b83c462059f30b2915816c2be911103d83d2fe46999aa60d9aabe9fa` |
| 25 repair generation metadata | `fig-25/repair-1/generation.json` | `44b83c74370fd0cdb4768a8d6e831a2e62fd6fe5fb2e352a3e7b4cbc1928cb42` |
| 26 spec | `fig-26/spec.json` | `90c6d3c866dcae3e5898299450130ee277bdae2ad5e68093f3cf902946481103` |
| 26 SVG | `fig-26/fig-26.svg` | `a4f31927ea010fa26ca11fb34b0f5650f3c57691ccb0a177c8bd6ed3d238172c` |
| 26 render report | `fig-26/render.json` | `4399f52604bc6c9cf39f9d40d90e9f3777b4d21b16bf73de2fbf530563c6a5b4` |

Actual Azure calls: 2 successful responses / 2 generated PNGs. Final planning allowance USD 4.588018; **actual token usage and billed USD are not observable in the unchanged helper metadata**. Figure 26 incurred no image-generation call. No claim of paid cost equal to the allowance.

All requested author work has stopped at the explicit repair/image boundaries. Nothing outside the owned scratch and this report was written by this task; all other workers' files were left alone.
