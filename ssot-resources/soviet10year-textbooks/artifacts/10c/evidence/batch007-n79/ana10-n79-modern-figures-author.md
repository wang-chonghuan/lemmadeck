# ana10 n79: six deterministic figure author packages

Ticket: STEMROBIN-184. Parent-agent delegation under existing human ticket authority. Author handoff only; not an independent figure review or promotion.

Status: **AUTHOR PACKAGES FROZEN**, all six current official draft validations and render reports pass. Independent source/spec/visual gate belongs solely to the parent. No `review@1` was written.

Root: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
Scratch package root: `.tmp/s10y-image/batch007/10c/`.

## Chronology and inputs

Original-only StageA report was completed and frozen BEFORE specification work:
`.intentfold/tickets/STEMROBIN-184/tmp/ana10-n79-figure-author-source-inventory.md`,
SHA256 `6892beeca0128ac8aeea33cb6953006309bcf783e8561112c35360305fc54d21`.
Its six independently opened original PNG inventories were reused without reopening those PNGs.

Between figure stages, completed the separately authorized geo construction decision and sole22-task answer-prose comparison. That geo material was NOT used as an n79 figure input. Then read the FULL approved n79 edition lesson/exercises and all six official contexts. No parent figure freeze, answer keys, choice or other reviewer material was used.

Approved durable DRAFT inputs, not newly finalized by this author:

| File under `ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-s2-n79/` | Actual SHA256 |
| --- | --- |
| lesson.json | `f524ad010824e99b00118d124b150e0d8e9aa1eeff5999ee27fd74c63c6682cf` |
| exercises.json | `fe891a960cfb9d8af0e4756bfe7e9ee486b377a1bb6f344bda00e8c9406077f6` |

| Package / unchanged official context.json | Actual context SHA256 |
| --- | --- |
| fig-05 | `280b68decd7d25c04abc1614fe4a3ea824158f73e43208226f0fd850fdae06bf` |
| fig-06 | `9e4cabb0ce555614c76bd245e842e4ab348a90322e2083e1b69fb1dad2afe4ce` |
| fig-07 | `dee23034f8e4ef3aa696777a96fc43e6d1e4ce0069b041040b85bdd01c220a72` |
| fig-08 | `246eb370fc7a1558b9995b5537b4897f25ba9a63194dfbddefd6867a7dda2261` |
| tbl-p0021-01 | `16045bdb10ae5c02d9e06ffe38e0064e0245885ed99115ced5c18a23605abe1c` |
| fig-09 | `4db5b854298f6845b09fe9ce116267ba9435b8500c1dac05cfbbf7649cfceb99` |

Every spec binds its actual durable original source-image path/SHA from the official context. Every `source.authoritativeText` is the complete context projection in its original order, with no selected-text omissions. Full approved lesson reading supplied the semantic background; exercises46-51 remain unsolved written tasks, have no assigned figure refs, and supply no answer annotations. In particular no graph for exercise49 was invented.

## Packages and current mechanical outcomes

For each ID below, files are:

- `<ID>/spec.json`: current `ld-s10y-image/figure-spec@2`, deterministic/instructional.
- `<ID>/<ID>.svg`: official renderer output, not hand-edited.
- `<ID>/<ID>.render.json`: current hash-bound official report.
- `<ID>/<ID>.preview.png`: full native renderer PNG.
- `<ID>/<ID>.neutral-640.preview.png`, `.neutral-240.preview.png`, `.print-346.preview.png`: isolated contract previews.
- `<ID>/<ID>.author-display-evidence.json`: current context/spec/SVG/render/native-preview and all capture hashes; author mechanical evidence, not review.
- `<ID>/initial/`: original complete spec, official validation stdout/stderr, first render stdout/stderr, SVG/report/PNG and attempt.json.
- For05-09 only, `<ID>/repair/`: sole repaired spec, official validation stdout/stderr, second render stdout/stderr, SVG/report/PNG and final attempt.json. No further attempt is authorized.

| ID | First draft validation | First render | Sole repair | Current render |
| --- | --- | --- | --- | --- |
| fig-05 | exit0 | exit2, fail | labels0/a/b clearance only | exit0, pass |
| fig-06 | exit0 | exit2, fail | labels0/a/b clearance only | exit0, pass |
| fig-07 | exit0 | exit2, fail | labels0/a/b clearance only | exit0, pass |
| fig-08 | exit0 | exit2, fail | labels0/a/b clearance only | exit0, pass |
| tbl-p0021-01 | exit0 | exit0, pass | none; ready render not rerun | pass, first output unchanged |
| fig-09 | exit0 | exit2, fail | four labels + duplicated path-unit scale | exit0, pass |

Official rendering internally calls the existing draft validator as part of its entrypoint; no extra rendered/approved validator, tests or independent-review recorder was run. Current reports have zero collisions and passing declared-width checks.

### Exact repair scope and preserved failures

05-08 first reports each record `0/a/b` stroke collisions, score10000, while all size checks already pass. Native first05 preview confirmed the glyphs touching the x-axis. The single repair changes only:

- `objects[0].labelPlacement.gap`, origin0:16 ->40.
- `objects[3].labelPlacement.gap`, a:20 ->40.
- `objects[4].labelPlacement.gap`, b:20 ->40.

All object coordinates, endpoint circles, paths, guides, source text/inventory, assertions, description and display fields remain structurally equal to the first spec.

09 first report records origin0/y/pi-half/pi stroke collisions. Actual native preview ALSO exposed a missing cosine: its source-screen path coordinates had already been scaled to pixels, whereas the existing raw-path layer multiplies by640/4.8 again. This real output defect is preserved in `initial/`; it was not concealed by the label-only report. The ONE repair changes only:

- Origin label gap18 ->40.
- y label W gap18 ->40.
- pi/2 label S gap65 ->95.
- pi label S gap20 ->40.
- `objects[9].d`: mechanically divide the existing sampled path coordinates by640/4.8 to remove the duplicated transform. No SVG was edited; no cosine sample/domain, mathematical datum or tangent object was changed.

09's source wrapper/inventory/text and ALL assertions remain structurally equal. This repaired native output visibly contains the required cosine. No second repair was made.

Table spec/output has no first/current structural or byte changes.

## Source inventory realized and honest regularizations

###05-08

Each has exactly the five source labels0/x/y/a/b, two hollow endpoints, two aligned vertical dashed guides, one function curve and two positive-axis arrows with short negative continuations. Origin/x/y/a/b point objects hide only markers and expose their labels; they do not create printed dots. Hollow endpoint centers are white, not filled.

The axes inventory group maps all its points wholly within perpendicular/connects assertions. The endpoint-guide group maps a/b/x-end and both endpoints wholly within collinearity, vertical displacement and guide-connects assertions. The curve group includes all points needed by its mapped relations. Native count assertions supplement rather than substitute for those point relations.

Unmeasured modern author model: normalized t on the displayed a-to-b interval, x=230+260t, with y respectively:

| Figure | Internal schematic y(t), NOT a visible/source equation | Exact sign logic |
| --- | --- | --- |
|05 |180+40t+190t^2 | y'>0, y''>0 |
|06 |180+420t-190t^2 | y'>0, y''<0 |
|07 |410-420t+190t^2 | y'<0, y''>0 |
|08 |410-40t-190t^2 | y'<0, y''<0 |

On0<=t<=1 all displayed heights are positive and neither endpoint slope is claimed zero/infinite. These numeric canvas coordinates/heights are solely an unmeasured layout regularization, not learner givens, labels or distances. No tangent or derivative-graph overlay is added. Dash rhythm is regularized, not a recovered exact source dash count. Existing raw path sampling omits only each hollow-marker footprint so top-layer curve ink cannot fill the circle centers.

Existing native assertions do not test derivative signs or full curvature. The deterministic author formulas establish the intended sign pairs; the parent's independent source/spec/visual gate must still judge this. “向下凸/向上凸” is interpreted exactly as the approved lesson's tangent-side definition, not a flipped modern naming convention.

### Table

Existing native grid primitive with bounds aligned to its offsets/steps; required `gridDimensions` proves EXACTLY3 rows and3 columns. There are all nine cells and exactly eight text objects, explicitly retaining blank r0c0.

Headers are `0 < x < pi/2` and `pi/2 < x < pi`; displayed pi is its mathematical glyph. First derivative row retains `cos' x (= -sin x)` with both `<0` signs; second derivative row retains `cos'' x (= -cos x)` with `<0`, `>0`. Mathematical prime/double-prime/minus glyph typography is regularized, not a changed derivative. No zero column, invented title or value row.

Source unmeasured row/column dimensions are regularized into equal cells; grid/cell count and content are unchanged. This wide table deliberately uses the existing fixed640px scroll-media contract rather than shrinking all text into240px.

###09

One analytic cosine sampled only on0<=x<=pi, with y(0)=1, y(pi/2)=0 and y(pi)=-1; one native straight tangent with slope-1 through(pi/2,0). All seven source labels retained. Mathematical point anchors for labels have no visible point marker; no tangent/contact dot, endpoint dot, extra period, guide, curve-name/equation/slope label or answer annotation is added.

Tangent `y=pi/2-x` is an approved lesson example, not an exercise answer. Contact/slope/incidences and exact object counts have executable native assertions, while the full cosine/tangent left-right inequality is not falsely claimed as an available native assertion type. Native/240/346 actual previews show the tangent above the curve left of contact and below it right of contact.

## Actual media metrics and viewed outputs

Using the already existing capture routine's approach, a scoped scratch adaptation reads only current SVG/spec/render/context, applies semantic CSS theme variables and captures an isolated offline DOM. It measures `svg.getBoundingClientRect()` and each text's `getScreenCTM()`, not just the viewport/column. It also measures the actual scroll maximum and reachable end.

| Packages | Viewport/theme | Actual media CSS width | Smallest text |
| --- | --- | --- | --- |
|05/06/07/08/09 |640 neutral |640 |44px |
|05/06/07/08/09 |240 neutral |240 |16.5px |
|05/06/07/08/09 |346 print |346 |23.7875px |
| table |640 neutral |640 |21.3333333333px |
| table |240 neutral |640 |21.3333333333px |
| table |346 print |640 |21.3333333333px |

Inline figures have no unintended horizontal overflow. Table's240px viewport has scrollWidth640 and actual end400/maximum400;346px print viewport has scrollWidth640 and actual end294/maximum294. The left/scroll-end captures intentionally show only the current viewport portion of this wide table; full native960px and640px neutral captures separately show every cell. They are not mislabeled as an inline fit.

Actually viewed each current full native PNG, every240-neutral and346-print capture, plus the table's full640-neutral and both narrow scroll-end captures. No black/blank current curve output, clipped text or new annotation was observed in this author check. This is necessary author observation, not the parent's independent review. The previews implement current product media sizing in an isolated document; no full app/lesson display approval is claimed.

All renderer/capture launchers were read and use headless:true, isolated nonpersistent contexts and task-owned process closure. Invocations unset PWDEBUG and set PLAYWRIGHT_HTML_OPEN=never. Capture contexts are offline and abort requests. No user window/tab/profile/CDP/system input was touched. No browser tool or visible fallback was used.

## Current package SHA256

Filename roots below are their exact package IDs, under the scratch root above.

| ID | spec.json | ID.svg | ID.render.json |
| --- | --- | --- | --- |
|05 | `ca447e10e7f9239495f2a55bc41905b5164f1f375ba743764abbcb43ce31ee4d` | `b51ff9727794f080e26d50a229e1f848d7152158e15a6a75cf54df661705b029` | `dd756897bedf7037faa466248c771848e181207885ca37559905d7ff02acb9e9` |
|06 | `6d5532d0fdd76ad9d9854b1e122b636314e63121f6159246a0100c8f88ef9979` | `369afa3771c9d85802bbdb3b836d948ca9a03d3e588d3e6adf8cf8c51bf9e439` | `655b0b592ccc37e15128e03166234888136b50ec283288b31c8043c075e7fbe7` |
|07 | `45a8f03fcbda861ba0ef64f757980fd2395c48c300d8f4ff51d6ce954b7bfcdb` | `7a724216e69a6f91773e3ca5d9b12ae7307f2acfaf9bca47a469f53ae0e4b8ed` | `17d6516c24adf8af705f76d108552199246024c96f8181e6e6d6290354b51a78` |
|08 | `94fa70ad45cbc9926c6507c061f81bceb407daa45ac604b86738d5686fe1d831` | `778e06160d7407416e8f430b8f6a2df0a8d0fd052886d20a599118cf20739380` | `4c55fdf71dcab013bf49741ecee1709012480718f2526d8afacc18a79764a754` |
|table | `1c8f63f9aee1e2d49bb8e8c0c6539746190cab897adeb75d7192fcfd435ea067` | `987a5ad7b1d4ca5d1e5d85ec70cb280fabf8a213229cae0ec10f85020dc4a922` | `0a1e1e309dd603732c8f4743ab1787fb63c2674150d83277ccf80f81f57e3307` |
|09 | `d97f8681431ead26e4663a20050f190bdcd9c59237b5b4bfc58af0d3b482e17f` | `1f23e6fb0138e8e89771c9190042814c5bfc6d98bf2f8afdaa0612a242f593b9` | `a6f708bb13efeb2f17024f7630b3d459042c59a19c155ba0f8ae92ca66ab79f8` |

| ID | Native ID.preview.png | ID.author-display-evidence.json |
| --- | --- | --- |
|05 | `cec6a89b44091f0becd77145dc3e486ab315eaf72e6dd2c6a04b37e09cded4cd` | `7ef855c4445f96d1207bac4d8b6054b390b4e0357e0eeb49a2581bf1ca998576` |
|06 | `048e1ee8c9297aef4b2a11c21274e411515c5d97dc9170c20b7fa996839b609a` | `892f0950179894c334935f048ad99c24db9d7050c1709eb0499be03d99974329` |
|07 | `9be552e78ec2cd96d80bd729587db513fd8a8b07ca11d19fe5a542a3ad6da6bd` | `102eb26ea3b0124d4a63e41e4e4cdd273196605867ce8aaa725c6c8de977fa3f` |
|08 | `cfd409c3994d127026c8afe5a8391a7ae05456e6374105c345e257bcb149030d` | `d1351d08e98c5a4cb504558e9011321810fa2213c36da9c14c2425d6e7a50963` |
|table | `ea86d54bbb28e5ed7cb5de315e4c458489ad0747a72a106030f7327a44f249ce` | `0c6e052cb765736883ee9dc904f3dcdff06ae7872503c77d52b48e74beb677b0` |
|09 | `b3f07527b73bfa69a5420a2d6ec819a0311fb07dde4cd9e4acaff3036c82cd9f` | `1887c1ae3bd3bdf32aee219e66447b0558ef89cc65513dc02cf5561237934527` |

All per-width PNG hashes and table scroll-end hashes are explicitly recorded in each immutable author-display-evidence JSON above.

## First-result hashes retained, not replaced by current pass

| ID | initial/spec.json | initial/ID.render.json |
| --- | --- | --- |
|05 | `7bf7e7c8f511f23644dd732866c6d0342f6002b19534b026025887b1c29489ba` | `8466bc72126fea87d7b56a4cf1fbd37cdcfbb832c11973dadabdc48bf37e7e30` |
|06 | `436b8af5521139656997dca9eab52edfd279a46e7386acc96c4812e47d5c5f71` | `e8294b118416e95cdd9d792fe8442658e9c6d3a4a136a41cc3ea9e3bd455d24a` |
|07 | `c74534225559d8fbfff20d29de9010659b05b4c2bcd52f695c203bb4c28e0248` | `ffab984cd35336eb38ba89e579de0e4d10c3c3104c2f0a38f39bdf37edd5c097` |
|08 | `05398c9d72c067ef735c8793a232b399259b812e29b129bce66b75b2d21eb4e8` | `361adbb6f9d67ec7c3e4cc3da6565f7dd58c214fb2e49053c5fabb10ac4861c0` |
|table | `1c8f63f9aee1e2d49bb8e8c0c6539746190cab897adeb75d7192fcfd435ea067` | `0a1e1e309dd603732c8f4743ab1787fb63c2674150d83277ccf80f81f57e3307` |
|09 | `233190da001ead038cf75654150052f066114def042a507b16a72167630c1b55` | `4ea4704ca1075bb73d723f751a02c2ffa7371c4befe73a9ef905507900cbdb53` |

## Stop and next owner

No manifest/context/source/edition/tool/index/dependency was edited, no paid/model call or new engine was used, and no Git/DB/publish action occurred. Scratch JSON serialization/capture/one-attempt wrappers use the unchanged existing renderer and validator only; they are not repository tool patches. No figure has been approved or promoted by its author.

All six are handed off immutable for the parent's one independent figure gate. First-ready table notification was already sent. Author stops figure changes/renders here; the separately queued n11 construction changed-only binding review follows without touching these packages.
