# Source Author 156–160

Status: **FROZEN AUTHOR CANDIDATES; independent review pending; NOT whole-batch gate PASS.**

Scope: original 6p physical156–160 only, printed145–149. No assemble, promotion, canonical/durable writes, modern lesson/figure/answer/choice work, Git, DB, service, dependency install, schema, charter or stable-tool edits. Previously accepted sea supplement and151–155 artifacts unchanged. No161+ source reading.

## Frozen Locations

Workspace: `/Users/yong/.codex/worktrees/0f12/lemmadeck`

Author root: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-156-160`

- Artifact pages: `artifacts/6p/pages/{0156,0157,0158,0159,0160}/{page.md,page.json,audit.json}` beneath author root.
- Original renders/templates: `work/6p/pages/{0156,0157,0158,0159,0160}/{page.png,page.grid.png,layout.json,page.template.md}` beneath author root.
- Crops and traced SVGs: `work/6p/pages/<page>/figures/<fig-id>.{png,svg}` beneath author root, enumerated below.
- [Full file manifest](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-156-160/source-manifest.json): `8a42de8925fc702072f448c58dfb5c896ae2b2545f9001e9a0123b2bcaa19921`.
- [Complete call ledger](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-156-160/evidence/calls-complete.json): `14c084b1e1b8ebd8b721bd6737a0954f1d6f3599cf7e3ef26e85e970febb9970`.

The manifest binds **71 files**, excluding its own self-hash, including every original render/grid/template/layout, all15 page artifact files, six PNG/SVG pairs, ten official stage logs, the original and reconciled call ledgers, first-failure snapshot, one original-row observation image and two author-only evidence scripts. Total frozen scratch files including manifest:72. Each entry records exact relative path, byte count and full SHA256. Resolve entries only beneath the absolute author root above. Pipeline/source manifest/TOC hashes in the manifest are measured **at handoff**, not falsely presented as per-call hashes.

## Exact Counts and Calls

| Physical / printed | Blocks | Actual printed rows | Audit detected rows | Ex segments / new tasks | Figures | Prepare exit | Finalize exit | Vectorize exit |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
|156 /145|10|24|24|2 /1|0|0|0|0, genuine zero figures|
|157 /146|10|16|15|3 /3|1|0|**1, first failure retained**|0|
|158 /147|14|26|26|5 /5|1|0|0|0|
|159 /148|8|14|14|0 /0|2|0|0|0|
|160 /149|9|10|10|0 /0|2|0|0|0|
|Total|**51**|**90**|**89**|**10 /9**|**6**|5 calls|5 calls:4 exit0,1 exit1|5 calls, all exit0|

There are92 nonempty body lines in the MD blocks, minus two **actual** shared-caption rows, giving90 distinct printed text rows. No `↵`, empty task, artificial line, forced `samerow` or fallback was inserted. Ten exercise segments comprise one incoming155 question continuation and nine new complete tasks: seven new numbered tasks and two real unnumbered practical tasks. No task is `open` at160. Five raw `open` flags include intra-page and cross-page paragraph continuations; only the final metal-manometer paragraph remains unclosed at this batch's right boundary.

Official source calls: **15 total**, each page once for prepare/finalize/vectorize; **0 gate reruns, 0 source repairs**. One genuine minimal source content/encoding repair was permitted for a failed unit, but no such defect was established for157 and no repair was invented to make the counter pass.

All calls used:

```text
env PYTHONDONTWRITEBYTECODE=1
/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B
.claude/skills/ld-s10y-lesson/tools/p2c.py <prepare|finalize|vectorize>
--book 6p --page <156|157|158|159|160>
--root .tmp/ld-s10y-lesson/source-author-156-160/artifacts
--work .tmp/ld-s10y-lesson/source-author-156-160/work
```

`--books` was **omitted**, preserving official default `ssot-resources/soviet10year-textbooks/sources` and its source manifest. `_book_dir`, `_catalog_config` and current `common()` were read, not changed. Source numbering is `lesson-group`, not whole-book numbering.

The original five prepare calls completed in the preceding context with exit0 and estimated row counts24/22/27/23/23. Their stdout was not separately captured; the complete ledger states that limitation rather than inventing logs. Their actual generated files are fully hash-bound. Every finalize/vectorize call has a standalone `evidence/<page>-<stage>-1.log`.

Evidence-index limitation: parallel vectorize158 overlapped finalize159; the author-only recorder's shared `calls.json` lost the159-finalize index entry. The per-call log and original exec exit0 remained complete. `calls.json` is preserved unchanged with9 entries; `calls-complete.json` reconciles the missing call from those original facts and adds the five prepare records. No page/tool call was repeated to repair this index. These scratch capture scripts are evidence helpers, not new official tools or tool fixes.

All tool sessions ended. No browser was opened.

## First Failure: F157-1

Official finalize157 first result:

```text
[finalize] 6p p0157: 10 块 / 16 行（印刷 15）, 插图 1 张, 规范化 0 处
fig-152(图 152) → [213, 658, 1109, 442]
失败: 行数对不上：印刷 15 行，块体 16 行
```

Immutable first-failure directory:

`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-156-160/evidence/0157-finalize-1-first-failure`

It contains rejected `artifacts/{page.md,page.json,audit.json}`, original `work/{page.png,page.grid.png,layout.json,page.template.md}`, first crop `work/figures/fig-152.png` and original failure stdout log. All eight artifact/work files are byte-identical to the current candidate counterparts; the manifest records each comparison. The standalone failure log SHA is `621e0e2e3597e18eaba5c655242ae25d01b48d5754f22b7e1b5095919a713846`.

Original pixels show distinct rows at approximately429–469 and500–537 for `p0157#2` lines2/3, with emphasis dots beneath them. Already-produced prepare `layout.json` contains **one merged band `[429,537]`** for that region. This supports a counter/row-segmentation diagnosis, not a missing or extra source-text line; exact counter causation remains for a separately authorized maintainer/reviewer to establish. No counter API was patched and no diagnostic gate rerun was used.

The final candidate still has16 real rows and the official audit still says15. **This page is not gate-approved.** Vectorization success for its crop does not waive its page failure.

## Source Identity and Boundaries

TOC identities retained:

| Source identity | Printed source section / title | Author ownership in this batch |
|---|---|---|
|`phy6-c4-s12`|§59 无液气压计, starts printed143|156 first `ex 3 cont`, then separate 作业 column with one unnumbered task|
|`phy6-c4-s13`|§60 不同高度处的大气压强, starts printed145|156 heading/body;157 body/图152/问题1–3;158练习28题1–4 and separate 作业 task|
|`phy6-c4-s14`|§61 压强计, starts printed147|158 heading onward,159–160正文及图153–157; unfinished at160|

Only155's final20 frozen **text** lines were read for incoming identity, not its pixels or a repeated source review. Incoming155 `ex 3 open` ends `（3）为什么需要在地球上的不同地点有系统地测定大气`;156 `p0156#1` continues `压强的值？` and closes it. Neither a new question number nor a nearest-object owner was guessed.

158 `p0158#10 open` continues across图153 via `p0158#13 cont open`;159 `p0159#5 cont` closes the same paragraph with `呢？...停止流动）.`.159 `p0159#7 open` ends `液体内部的压`;160 `p0160#3 cont` starts `强.`.160 `p0160#4 open` ends `在这`, then `p0160#7 cont` starts `个过程中` across图157.160 `p0160#8 open` ends `这种压强计的主要部分是`, with original图158 reference only. **图158 and the rest of§61 are outside this batch; no161+ source was read or authored.**

All six extracted figures are source-bound **body figures**, with actual prose references. There are no unnumbered figures requiring guessed exercise owners. Original task group titles and repeated printed1/2/3 labels remain separate; no assembly/stable exercise-key generation was performed.

## Actual Pixel Observations

Each original full page and its grid was opened individually, not as a multi-page composite.156's original/grid had already been opened in the preceding context of this same author run; those observations and exact render hash were reused without reinspection.

Actually opened full pages:

```text
/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-156-160/work/6p/pages/0156/page.png
/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-156-160/work/6p/pages/0156/page.grid.png
/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-156-160/work/6p/pages/0157/page.png
/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-156-160/work/6p/pages/0157/page.grid.png
/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-156-160/work/6p/pages/0158/page.png
/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-156-160/work/6p/pages/0158/page.grid.png
/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-156-160/work/6p/pages/0159/page.png
/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-156-160/work/6p/pages/0159/page.grid.png
/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-156-160/work/6p/pages/0160/page.png
/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-156-160/work/6p/pages/0160/page.grid.png
```

All6 **final PNG crops** below were also actually opened separately. A single ambiguity-driven detail was opened at:

`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-156-160/evidence/0160-row-1852-observation.png`

It is a crop of160 original pixels `[180,1845,1250,1915]`, enlarged2× only for reading. It confirmed original `向各方向的压强` includes `的`, and the emphasis starts at `在`, not `即`. This is observation evidence, not a new figure.

## Crop Inventory and Vector Evidence

Coordinates `[x,y,w,h]` refer to1472×2161 original pages at300dpi. Final PNG dimensions include the official crop function's padding, not invented geometry.

| Figure / page | Original inventory observed | Coarse box → final ink box | PNG pixels | Official mismatch |
|---|---|---|---|---|
|152 /157|13 mercury-barometer drawings, sea level plus1–12km, entire mm axis0–1000, altitude captions, connecting level lines and source numbers674/596/526/462/405/354/308/267/232/200/171/150|`[205,650,1130,455]` → `[213,658,1109,442]`|1133×466|0.015%|
|153 /158|U-type liquid manometer, both limbs/liquid levels, central0/1/2 scale marks, stand/clamps/base; source numeral forms kept in crop|`[1090,1265,150,445]` → `[1097,1271,138,436]`|162×460|0.036%|
|154 /159|upper partial apparatus and lower complete tube/rubber-pipe/flattened membrane-box drawing: **one original figure containing both**|`[360,235,180,780]` → `[363,241,159,767]`|183×791|0.012%|
|155 /159|pressing fingers/box, rubber hose, manometer, both liquid columns and scale/stand|`[835,460,310,520]` → `[843,468,294,513]`|318×537|0.025%|
|156 /160|two side-by-side beaker/probe/hand/hose/manometer arrangements, different depth and level difference|`[335,235,865,525]` → `[342,239,845,521]`|869×545|0.009%|
|157 /160|three side-by-side arrangements with membrane upward/sideways/downward, all water marks, hose/hand/probe/manometer scales|`[150,1210,1230,465]` → `[161,1220,1208,447]`|1232×471|0.008%|

Crop paths (each actually opened; paired SVG uses the same path with `.svg`):

```text
/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-156-160/work/6p/pages/0157/figures/fig-152.png
/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-156-160/work/6p/pages/0158/figures/fig-153.png
/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-156-160/work/6p/pages/0159/figures/fig-154.png
/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-156-160/work/6p/pages/0159/figures/fig-155.png
/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-156-160/work/6p/pages/0160/figures/fig-156.png
/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-156-160/work/6p/pages/0160/figures/fig-157.png
```

All six SVGs were generated only by official potrace/vectorize and passed its raster comparison. Ratios above are **the official rounded stdout percentages**, not more precise values inferred from rounding. There was no modern figure generation or human-authored SVG.

## Text Fidelity Notes

-156: two full bold definition rows, printed temperature0°C and760mm mercury preserved; gas compressibility explanation and altitude conditions not modernized; real unnumbered laboratory task kept.
-157: first two conversion rows bold; `101300帕斯卡 =101.3千帕斯卡 ≈100千帕斯卡` unchanged; dot emphasis spans `在不太高的高度内，平均每升高12米大气压强减少1毫米高水银柱`; first named `高度计` retains bold. Source figure labels stay source pixels.
-158: all four exercise prompts including the full task4 hint and all three real practical-task rows retained. Formula remains `$p=g\rho h$`; `g=9.8牛顿/千克`, `h=760毫米=0.76米`, `ρ=13600千克/米³` retain numbers and units. Official normalization alone changed `^{3}` to `^3` (`collapse_single_brace`); no mathematical correction or erratum.
-158: original bold `压强计`, `液体压强计`, `金属压强计`; original dot emphasis `开口式液体压强计`. 图153 cap truly shares the printed row with `的，可以用...`, hence genuine `samerow`.
-159: original `从而由所差的这一段液柱` was observed and retained as `所差`, not silently rewritten. Original dot emphasis on `根据液柱的高度差就可以判定压强值的变化` spans two rows. Two图154/155 captions occupy one actual horizontal row; second cap uses genuine `samerow`.
-160: full depth and same-depth/different-direction explanation preserved as source prose, not converted to answers. Emphasis on depth relation, `在液体内部同一深度处向各方向的压强都相等` and `金属压强计` retained.

Dot-emphasis ranges use Markdown `**...**` plus explicit notes naming the original **着重号**; they are not extra text rows or claims that the source printed bold in those ranges. Printed numbers/page feet retained; decorative footer dots on157–160 use the profile-supported middle-dot character. There are no substantive footnotes on these pages. No author-imposed safety advice, guessed source solution or modern-language rewrite was added.

## Full Page Hash Binding

All pages reference source PDF SHA256:

`46e2b2e4a92b7c00fab9adfc6a8a9b5340a9519fa90f1b82e79bc1e1432fcbb0`

Profile: `soviet-cn`, SHA256:

`dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849`

| Page | page.md SHA256 | page.json SHA256 | audit.json SHA256 |
|---|---|---|---|
|0156|`45e5dd5ff5cb612011a001021a56b666dadc481ba5733e6c241ea3fbe9111861`|`78b7e16a75ab71dab29df8dec5c1db3f3001f8c329b6736f939a7a4895e861f6`|`07394cfdb4980ab069e10a87e014fd08124bdddee631a56550d667c51e5a91ff`|
|0157|`b381005d791ecdc8c8441391ee151b0bc5c52983cbd26162354909b0eb1d73a7`|`ecfff7ff392f2aab8ed931c9b9b2d6d7f5c444cc060a6b57408f89133f4c172c`|`a6744445a6d85a2b27536972414df6a5850c41a7ae5f590c49e1160f99407d65`|
|0158|`b3804d7ca80397a2b1eaf944514477acc07a8348e05ca41c239a9db439cc03f6`|`bf058de471669a49002a0e51fa879addea1d4bd9fbfddc73a06b55f28e37c189`|`a519ec6ccfeb0f984c8d71faf0dce438c3ed452362b61dfad9cae9e92e299aea`|
|0159|`3add5461dcdd0b05ab8acea22fc23a560d2b6bd783fbdddb456e05fa7bee432e`|`5b7420233b4bffd6a8ed2b3940132be7e9bd1c67185374b45e37da0d266c704f`|`7e638aa21b3a1141f59fc3a03cc5933c32ac634792c15e1724d6823c65041963`|
|0160|`ab32b65004a85fd967af70a60e33c8830946a19bc33e03193a10b1d21f12d23c`|`275878f58312a1c75b1695aa7d03570f82966442711cbca7ca98d6f8daa88a71`|`070061d428d738aa71d3aac62562ddc8be9e959ff451bcbca7f63424921b50f0`|

| Page | Original page.png SHA256 |
|---|---|
|0156|`5f8e8a9cbcf32ee5929b35720cf8b8daef06e85d0c35b6f239f2cea0a9d0fb9d`|
|0157|`6ea043493bbef3974ceefc70783670ee6de9c5b4f83c2d0b42311e85f33312b4`|
|0158|`fd7d86b36fb96b4bfbfdc5890a78d0a0253af13a1a4be132e5977ab0351485c6`|
|0159|`07be0ea9422c1187c2df28bdb0762912b9c21e67d15db031d8297ffedbc4aa0d`|
|0160|`59dd1944e59d79384e1b3294f3fcc0f4dbc084530aaacabbbce75254171b5d91`|

| Figure | PNG SHA256 | SVG SHA256 |
|---|---|---|
|152|`ab51ebbbf1edd3b248b2fc8f53ba02801a261bd486b3a8e5ce8da121a5b77117`|`dd8f86b966988885b6a2aea05a9143dd11b4572b257d5c25bb5302a12ce1f849`|
|153|`d2580ea16170096ec87b93c72cc89dd98c928be0b2a3b44e018c8b05211f2961`|`c1a0f24fdc219646afe5555c0341e9e043f4e2866b0426b282cc1857e7a63426`|
|154|`b12bd02d6710464f0d855e7ab569dc2cc20fb67b3811e38fd51e5ceb865dded0`|`ad2cadb65db17705745838fa732cef476417b60ec81325def81989344fa676cf`|
|155|`add336f4eeb136cd82ef0549521224a85947f0e8921afa922c642e353c8aeaf9`|`109c05e220a42ba8357e3f2642bd97f9d836ab9ff18b203c6c068c83aaaa52e9`|
|156|`41434d4720ffa30b93424696dd15cf85a7be6ae4904918958b5c426212490d31`|`4adc2bed01f87f7164d7dd161575018724d9f0b55f5a881ddbae9f723af1be81`|
|157|`8d6b192883509837344bab0364e0de91c3fcdc1ac9b2dc8b0a3200c3897dbba4`|`cb14b3a0fbe25e1308cb778e586d44aa81de9ee416687b194e901b792bea7703`|

## Handoff Boundary

Author transcription and crop observations are complete for156–160, but **157 retains one failed official row gate**. No self-approval is asserted, and no source promotion/assembly is authorized by this handoff. Independent reviewer should read complete originals and candidate MD/JSON/audit, retain this first-failure evidence, and separately judge text/figure fidelity and the unresolved row count. Tool correction, any future affected rerun and closing§61 require separately bounded authorization.
