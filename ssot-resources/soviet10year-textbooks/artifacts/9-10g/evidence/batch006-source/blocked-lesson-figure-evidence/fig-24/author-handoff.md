# n8 Figures24-26 Scratch Author Handoff

2026-11-16. STEMROBIN-184 existing parent delegation; no new direct-user budget or production authorization. Source-first figure authorship only. Parent performs the single independent mathematical/visual review. No author-issued independent PASS, record_review, promotion or durable edits.

## Outcomes

| Figure | Initial renderer | One targeted repair | Current result | Package |
| --- | --- | --- | --- | --- |
|24|FAIL: A/B endpoint clearance, D hidden-edge collision|Only A/B/D text anchors moved|Renderer PASS; parent review pending|`.tmp/s10y-image/9-10g/fig-24/repair/`|
|25|FAIL: A/B endpoint clearance|Only A/B text anchors moved|Renderer PASS; parent review pending|`.tmp/s10y-image/9-10g/fig-25/repair/`|
|26|FAIL: A/B stroke collisions|Only A/B text anchors moved|**Second renderer FAIL: B-label-label stroke collision, score10000. Not promotable.**|`.tmp/s10y-image/9-10g/fig-26/repair/`|

Exactly six existing renderer invocations: one initial and one affected repair for each figure. Every first failure remains intact in its `initial/` directory, including spec, SVG, native whole PNG, render report and execution evidence. No third attempt, geometry change, output hand-edit or stable-output rerun after resume. Figure26 stopped after its second FAIL.

All nine requested whole previews actually opened separately:640neutral,240neutral,346print for each current candidate. Figure26 previews were screenshots of its already-failed SVG only, not a renderer invocation or a further repair. They remain failure evidence, not an approval.

## Source-First Provenance And Fidelity

Loaded current image skill, routing, FigureSpec and quality-gate contracts. Each actual durable original PNG was opened singly, then its inventory was frozen before any FigureSpec. No other figure inventory, answer key, answer/choice artifact or source-solution report read. Approved contexts were read in full; their complete lesson title and exercise text are copied exactly into source.authoritativeText. Scratch wrapper asserts exact equality against official context and rehashes the actual original before each authorized render. No context rebuild.

| Figure | Original PNG SHA256 | Official context SHA256 | Frozen source-inventory.md SHA256 |
| --- | --- | --- | --- |
|24|`17e61820bd2fe504a18fb94531ad21087468ccf529563e9791b83257e03ad57c`|`2708d2307afe7a8750ff0143120b2d0e1fdf9dfde6506aa586009893ba976e16`|`529f911297ecf3faf96744ea6dc8d4e2cfdd88e10efa08df6f5c59c95036c8ab`|
|25|`d15fefc825e83d55cf2d8452460b90a6ae03ad372b649c011dd92e9d5c9dc5dc`|`393f455baf0963adeb0f29c7da25d2c08208f05db94f3063ad27d29ebad241a8`|`d17396ac3a45e21cc266abd16ee66e680647ed2b0b06a53b8f3d9d58997dd7f3`|
|26|`d5938ff9a53163187e815c1f7e6f51be6b18d7d4d37bbe80e4b3255bb76aee13`|`4c1b06ed92d312e36e872cf2bfc2a63de5b7b407f96125c79fc440b48692ac2c`|`4950c41a0a6423c4ab6794bab79ba0abdf8b0684abc90f519153b8c1c697cce7`|

Original paths: `ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-24.png`, `fig-25.png`, `fig-26.png`. Context/inventory paths: `.tmp/s10y-image/9-10g/fig-N/context.json` and `source-inventory.md`. Endpoint hashes match first source/context observations; these files were not edited.

24: eight source vertices A/B/C/D/A1/B1/C1/D1; exactly12 edges, all connects mapped, three affine parallel families checked. AD/DC/DD1 remain hidden dashed. No exercise57 diagonals, answer points, lengths or angle claims. Source screen proportions are not 3D measurements. Clean typography and tiny endpoint markers are explicitly modern layout additions.

25: six vertices, seven unique parallelogram perimeter edges with shared CD, plus actual AA1/BB1 auxiliary connections. All nine actual source strokes are continuous solid ink in native and4x evidence; no periodic source dash confirmed, so none invented. BB1/CD projected crossing is unlabelled and has no new point or real spatial-incidence assertion. Full approved task61 copied without proof. Pixel evidence `.tmp/s10y-image/9-10g/fig-25/source-pixel-4x.png`, SHA256 `abf8b406a3e6e7b3cf5be451c9fcdfaae359bf5af5bc5fe3ecf9d3a5a8c34f49`;1816x968 displayed1441x768.

26: full alpha/beta polygon frames and extensions of the common edge beyond B/C, six unique shape segments, all source labels A/B/C/D/M/K/alpha/beta. AD//BC, K/B/M collinear, BK=KM from the given midpoint, interior plane memberships and B/C common-edge placement asserted. K source point marker retained. No gamma, solution segment, extra intersection point, length or unit label despite these appearing in the requested construction/context. Both plane frames use existing polygons, not a new geometry engine. Their common edge is overlaid by coincident polygon borders and BC; this does not introduce a new semantic stroke.

## Exact Affected-Only Repairs

Structured current-versus-initial comparison confirmed source, assertions, canvas and all geometry unchanged. Only these text.at values differ; other fields of each changed object are identical:

| Figure | Text object | Initial at | Current at |
| --- | --- | --- | --- |
|24|A-label|105,75|95,50|
|24|B-label|405,75|415,50|
|24|D-label|242,185|277,170|
|25|A-label|71,51|60,34|
|25|B-label|398,51|414,34|
|26|A-label|215,152|223,124|
|26|B-label|325,343|310,335|

Figure26's remaining B collision is not waived based on the apparent visual clearance. No precise culprit attribution beyond the actual renderer stroke-collision result; no code investigation or repair to weaken that gate.

## Current Candidate Hashes

Paths in each table are relative to the stated exact package directory. `.whole.png` is native renderer output. `preview-whole-*` is a separate full-canvas headless screenshot.

### Figure24

Package `.tmp/s10y-image/9-10g/fig-24/repair/`.

| File | SHA256 |
| --- | --- |
|fig-24.spec.json|`d7e558cbb7d675ffd76841e7a45f38efc6e7cb20e75dec5efc8eb1acfd1d2c59`|
|fig-24.svg|`85367e8abe785103f6753e2cc095c9aa769ab3f22642f0bd46ba9d915232dc85`|
|fig-24.render.json|`071de0dea2fd6feabe8646fd7ccbc7100d6474e33c80912d1e6f0eea009d5bed`|
|fig-24.whole.png|`d215ef3ca42db4d0ed41dcc6935e2cde16f30c63f1f78fd9d292b29d2cd04b1b`|
|execution.json|`6e49dd79e3823efde5c3d3a9570fc09f253b1d0ed96dcb0d3a62fceb5aa0e4fd`|
|preview.json|`5cbafbbfb2f287a2da67683f93b933223df193384f35b706d3bf959033f6f56c`|
|preview-whole-640-neutral.png|`d215ef3ca42db4d0ed41dcc6935e2cde16f30c63f1f78fd9d292b29d2cd04b1b`|
|preview-whole-240-neutral.png|`bbd11c766730cf8f3971007b6657a16dc7f19a08cc3b39ed9cb95802e32fb31f`|
|preview-whole-346-print.png|`2bb5382a5caf6553bc3d57d199c4f5e5b902424dfcb772077e2887b55a8caa25`|

### Figure25

Package `.tmp/s10y-image/9-10g/fig-25/repair/`.

| File | SHA256 |
| --- | --- |
|fig-25.spec.json|`986de8ffd5d592155eb956420ee95ee2a94c1c031b50418f4ca8e2063a8ebbb0`|
|fig-25.svg|`05ede5958ec708bc0af003eec7c2696ec92783c20b192b394fc8a9004395ddeb`|
|fig-25.render.json|`b7a79af681a37b4bf02e91ebb469c77f938f55b7c2aa706f8d423a373e3259aa`|
|fig-25.whole.png|`d0514c0f6d38a5b2585a2bafba84aad60708eedbdd0f8d3087b7a872db31921c`|
|execution.json|`18304af24bb33557d5568188169698072dd11f80d0c270dd09d96b5be79fa06b`|
|preview.json|`876d280a517d8f00fed890f36647dc37a7eaf833d961901d0ab0beb3602cadb5`|
|preview-whole-640-neutral.png|`d0514c0f6d38a5b2585a2bafba84aad60708eedbdd0f8d3087b7a872db31921c`|
|preview-whole-240-neutral.png|`2ef05a53b2b69377e2c98c284a022ccb5ad059043ff7e3256cbee7b030a9b81e`|
|preview-whole-346-print.png|`1e68e6ce12c328615dde7d923aa6f37f79600759da061dc294a62bc4101fce5e`|

### Figure26

**Failed package** `.tmp/s10y-image/9-10g/fig-26/repair/`.

| File | SHA256 |
| --- | --- |
|fig-26.spec.json|`0c543dc8de2be599176d3f1c77a0c9f5e14e5a89b09f5a1c376f16b1a60135db`|
|fig-26.svg|`83d82698927a8937e85bbfee767e993fe08f278b1635fba58affb1bc63bcd1b4`|
|fig-26.render.json|`1a14ddb6ba875f820e2ced02036aba8c7987601367a826065bd3c4c21c9c976d`|
|fig-26.whole.png|`2f6906e55c3c6b8357e6608c8887a3c46d4cc1160608a23f807dc3a095d5b590`|
|execution.json|`2aa53503c0880f776142f89d75720f48a2e6614547eea112b62cab8c19a4cd9a`|
|preview.json|`9d5c251846e68b42d2eb0f3d7224891f84556c679ebb80278cbc9258aed97361`|
|preview-whole-640-neutral.png|`2f6906e55c3c6b8357e6608c8887a3c46d4cc1160608a23f807dc3a095d5b590`|
|preview-whole-240-neutral.png|`768946f22e10091db46fb1bf4ee2857f0666c8d46cdb87186d76168ba26226a3`|
|preview-whole-346-print.png|`8bb529b56db74af7a5b49c266e9d0446d1f1027bb43ff3b90e6c450be77f180d`|

## Preserved Initial Failures

Each package `.tmp/s10y-image/9-10g/fig-N/initial/` retains exactly its five first-attempt files. No initial preview was overwritten or replaced by repaired bytes.

| Figure | File | SHA256 |
| --- | --- | --- |
|24|fig-24.spec.json|`8ee7080b59be6b861680601f8cb0808a9dedf22cbde6e3ed7121e032168b2e02`|
|24|fig-24.svg|`649c8b2e39151fbb30dadce49612dafe93bf78179c438cc829e1d911b8dd619a`|
|24|fig-24.render.json|`f7034658042170259006cbb7336777f1e3121922042e67111b2628b38f2d5761`|
|24|fig-24.whole.png|`f4a50fefb5fe11964183748f9ff3f6e11f8a210861b2c5386c133753a155d6ef`|
|24|execution.json|`c5f04bd70daaabe41c40e8f26bb1950fea0c4b3374f4da44f0fba95d8b631d34`|
|25|fig-25.spec.json|`e7abc7c50959c144d1959a3c5b9bffde7dfdd0981fcb328bdde0c65ed7c9dbfd`|
|25|fig-25.svg|`fc0e09cc8294ef5345c46f53505ad0210391e9b6ed4097e8bf408c58820835dc`|
|25|fig-25.render.json|`49c3faf2066594e7cea3488e30a73fc92a3f5de7dc42d8a43d5a0977ceda7643`|
|25|fig-25.whole.png|`9fc6186a0efecd3fedbd28ea4204421da6dcbb2eb165d6e08e47f8dc3778cf51`|
|25|execution.json|`dec1fa4fdbc173f60fc02d7ac3244dc8d560695552000fe45ccf8fcb2a9ae165`|
|26|fig-26.spec.json|`ad91074e02d39d1b0610960f7b2d6429c26a38100a86bf8281274b6d156fddb1`|
|26|fig-26.svg|`46266137f540e2e52c2c32a4913f76b67ba3301cf79bccecd6ed902fef5df0a5`|
|26|fig-26.render.json|`7345e490190f7b27443b147bb1651b8b6261d6d6b17fa198f4b8cd386808efe3`|
|26|fig-26.whole.png|`f6f63ada265fd333af4aaa5e7600d64be7eb6b9657247f6948e4511df5a73b32`|
|26|execution.json|`4fe13cf7a9de633cbedd2047ad5758b09b4feebf230a95bef6dda83353ba40a6`|

## Actual Preview Evidence

Existing JSXGraph renderer1.13.1, isolated headless Chromium with fresh context. PWDEBUG cleared; no OS input, CDP, persistent user profile, browser auto-open or remote requests. Scratch scripts follow the existing n7 script pattern rather than creating a geometry library. Official renderer performs draft validation internally; no broad validation or runtime operation.

All three current render reports measure minimum text17.25px at240,24.86875px at346,46px at640. Actual screenshot screen transforms independently measured those same sizes and all eight/six/eight labels within full media bounds. These are scratch-media measurements, not a claim of headed product testing. The46px declared renderer font size is the measured contract; subscript glyphs naturally have their own smaller glyph outlines.

| Figure | Preview width/theme | Actual PNG dimensions | Nonwhite pixels | Nearwhite pixels |
| --- | --- | --- | --- | --- |
|24|640neutral|640x640|15880|393670|
|24|240neutral|240x240|3173|54396|
|24|346print|346x346|5993|113660|
|25|640neutral|640x480|13612|293530|
|25|240neutral|240x180|2414|40762|
|25|346print|346x260|4759|85165|
|26|640neutral|640x640|17971|391392|
|26|240neutral|240x240|3469|54068|
|26|346print|346x346|6200|113448|

All nine PNGs visually inspected whole, separately; also each initial native failure PNG and figure26 second-failure native PNG actually opened. Pixel checks confirm nonblank/nonblack, not mathematical approval. Figure25 print screenshot rounds259.5px media height to260pixels; no crop/resize was used to conceal boundaries.

Scratch runner `.tmp/s10y-image/9-10g/fig-24/author-preview.mjs`, SHA256 `18d67ef3f995fff4933f515549f7caa46859c3f3fb15f1f207ddd616c02db5c1`. Failure-only screenshot script `.tmp/s10y-image/9-10g/fig-26/preview-failed-output.mjs`, SHA256 `d749f4657329a2ac7d2ad403ed0223f71d4803a1763a46f91e455ab23c175615`. Pixel inspection emitted a Pillow getdata deprecation warning; no dependency/tool change or rerun made.

## Stop

24/25 are mechanical-PASS scratch candidates only;26 remains explicit FAIL and is blocked from promotion. Parent receives full spec/SVG/render and whole-preview evidence for one independent review. No source/durable/manifest/book/page edits, Azure/API/network/Git/DB, new library, answers/choices, record_review or promotion. No10c77 reading/writing yet. Stable candidates will not be rerendered; no further task or repair automatically begins.
