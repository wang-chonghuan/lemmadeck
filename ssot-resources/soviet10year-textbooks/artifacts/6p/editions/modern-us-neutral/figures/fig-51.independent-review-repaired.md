# fig-51：D51-1 受影响修复独审

**结论：PASS，仅下列哈希绑定的修后图snapshot。** 近水上红段S、下远蓝段N正确；306/640实际显示均清晰、无裁切或遮挡，分层组合对齐。首次FAIL不覆盖，本报告不执行晋升。

审查者：Codex independent reviewer，非Ramanujan图作者。日期：2026-11-15。

## 范围与前置核验

仅审51唯一修复D51-1的标签极性、字号、位置、完整组合及来源/输出哈希。原图极性使用首次实际开源PNG的已核事实：近水上端S、远水下端N；本次不重复打开完整源图。铁块在浮于水中的软木上、非接触磁铁及朝磁铁箭头沿用首轮已审事实；50/53/54原PASS复用，未重读或重开其它图。不读答案。

先读当前repair-01-report.md、author-handoff.json和author-preview.json，确认作者唯一修复已交接，剩余门禁只有affected-only独审，修复额度1/1。handoff/render/preview中的48项当前文件hash引用独立核对一致。author-handoff的draft表示仍待独审/晋升，不把作者报告当作独审证据。

当前s15两份权威模板hash仍与首次独审绑定一致，本次不全量重扫课文。与首FAIL存档spec做结构化对比：authoritativeText、assets、canvas、display、原artwork对象、原方向箭头对象和原断言全部未变。新增仅两text、两个不可见标签区域及其inside/标签数量断言；库存正确映射S/N，未增加器材或答案内容。SVG实际仅两个文字S/N，无内嵌image，继续是独立overlay。

## 实际修后组合检查

只用当前原artwork.png与当前fig-51.svg在只读Playwright现场叠加，分别实际显示306×459、640×960媒体。HTTP/HTTPS禁用；两张截图在内存中输出，未写新截图或重渲染作者输出。未再输出源整体、单层图或其它图。浏览器已关闭。

| mediaWidth | S实测字体 | N实测字体 | S/N位置与覆盖 | 媒体状态 |
| --- | --- | --- | --- | --- |
| 306 | 19.125px | 19.125px | S近水上红段，N下远蓝段；两个字的完整rect均在正确色段内 | artwork载入成功，width306，height459，无overflow |
| 640 | 40px | 40px | 极性相同，完整字形清晰；未触碰色段边缘、箭头或器材 | artwork载入成功，width640，height960，无overflow |

306的S rect为`[146.6171875,297.5390625,12.765625,21]`，N为`[146.09375,359.6953125,13.812484741210938,21]`；640的S为`[306.65625,621.875,26.6875,44]`，N为`[305.5546875,751.875,28.890625,44]`。字体经SVG screen CTM实测，不是canvas字号推断；均大于16px。两字均为paper语义角色白色，在实际红/蓝段上易读。不可见区域多边形未出现在组合中。

两张完整组合实际看过：标签没有颠倒、遮挡、错位或裁切；原器材/原箭头没有因新增标签变形或移动。新增只有合法S/N物理标签，无力大小、数值、文化文字或答案。

现场内存组合PNG与作者当前组合截图逐字节SHA相同，但PASS依据包括实际视觉/字体/边界核对，不只靠图片hash：

- 306：`a89fd649e94d1ae3bb4aea2e116a073d7c9becd4725cbb8fcb34be7830afb04f`
- 640：`6001168dbcf18bc926772690354cf918641d053798e5bff4dce035d149485212`

独立只读`validate_spec.py --stage rendered --json`结果PASS；当前render为PASS、2 labels、collisions空，两种width检查PASS、aspect ratio为xMidYMid meet。render/spec/两层实际hash一致。

## 首次失败及生成来源保留

failure-01-missing-poles/snapshot.json所列18个存档文件逐一复核hash全部一致。根目录原independent-review.md/review.json与存档同名文件仍字节相同，旧review仍status=fail。它们绑定首次失败，不能批准当前修后输出。

artwork.png、artwork-opaque.png及其原generation metadata与存档逐字节相同；prompt/context也未变。本次无生成、无render写入、无修复。作者本单位已用1/1修复；本次新增Azure调用0，历史生成次数仍1。未发现剩余essential defect，不触发BLOCK或第二次修复。

## SHA-256绑定

以下相对文件名均位于本fig-51目录：

| 文件 | SHA-256 |
| --- | --- |
| author-handoff.json | `e68b6ef13768ffb5bfcd5f2f3df09a8a2dfc5fe35637b9e1d102f603a40ab917` |
| repair-01-report.md | `eb42f16bcce33e74d53dd6241a98efbf06433bc6947dd42871d9320459e94fd5` |
| author-preview.json | `63ba5c2188ce2d3b2cde2cfb707c9f5c37675127e79c19f7045931e831422fb7` |
| spec.json | `134289ad26994875f45d0c360a7f5c553320dc702328660818bf7f1ffc3c4223` |
| source.inventory.json | `0033f30b067eae8c7b28ab689e6518c9aae1bf02fcbc27a262cd3e9f607b2904` |
| fig-51.svg | `3be77167e49d5bafcd246a3fc342bd032b925da9419ca62bd6271eaa0553f230` |
| fig-51.render.json | `c9b0737f120f9fd74da3e36d8cc62a5d370c6ccc34153b53abe6cc6a95aeaaf7` |
| artwork.png | `3a674a4c6c8c60cb5a47a235e37d68eb110818d69cc6c4aaf6b95cab4bd8b7a4` |
| artwork-opaque.png | `2ffdd4b61a5fd630c384e8782a0bf6e6bfc211830a1895f71fe1569583bcb5d9` |
| artwork-opaque.png.json | `88df4192fa83e42db52b34c0311bcb396794956f8b8a0207c7afb884882b0661` |
| independent-review.md（原FAIL） | `bee97fd16808442ec453f3e5cedfa87ca0ce9f453c7e357d9a37e0568151cb38` |
| review.json（原FAIL） | `b94f64c8b936ad1bfa69ac465a2a3f176b335a9cbb87ead4cdb6be1e9c3171f9` |
| failure-01-missing-poles/snapshot.json | `b5a9b9d644b2e2538806f7ccca85eaa2e7eb4e3c51671e54934a3088a06d7653` |

原PNGhash仍为`04e66edb8a3036ebcf33a1c93df356dab0124fabe06e188f02ff4d8434bb6de2`。当前s15 lesson/exercises模板hash分别为`6220965c96d575ebfc474309626cd54ea94605703c43f4f5c4bb73d021cadae8`、`794143435f24a4a53d42bad7e37effa574dd172b4ed9c26f2ba06787223962c4`。

本次唯一新增写集：independent-review-repaired.md及**repair-01-independent/review.json**。新review用record_review.py --render当前fig-51.render.json --status pass生成，notes绑定本报告hash与首FAIL留存；不覆盖根目录旧review或存档。没有修改作者图/spec/源/模板/旧报告、othergroups、Git或DB，不执行发布、装订或晋升。
