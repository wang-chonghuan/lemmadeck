# Source Author 161–165

**FROZEN AUTHOR CANDIDATES；15次官方机械调用均成功，非作者独审待 Bacon 执行。不是源审批、晋升或整书装订。**

身份：`author`，Codex。工单 STEMROBIN-180。范围仅6p物理161–165（印刷150–154）；无166+读取、canonical/源PDF/工具编辑、assemble、adapt、答案/选择题、DB、Git、app、网络/模型服务或依赖安装。

## Frozen Paths And Manifest

Workspace：`/Users/yong/.codex/worktrees/0f12/lemmadeck`

Author root：

`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-161-165`

页产物位于该 root 的 `artifacts/6p/pages/{0161,0162,0163,0164,0165}/{page.md,page.json,audit.json}`；无网格原渲染、grid、prepare模板及布局位于 `work/6p/pages/<页>/`；官方裁图/矢量位于对应页的 `figures/`。

[source-manifest.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-161-165/source-manifest.json)：93,136字节，SHA256：

`a7878f1262edfb8bf791b784ee4ddc6a1cea37f4450c51b0f86e861977abe04d`

manifest冻结91个实际文件，全部记录绝对路径、字节数及完整 SHA256，排除自己的自hash；另含源PDF/TOC/profile/工具绑定、各页行/块/题/续接、完整四图 inventory、精确粗框/收口框/PNG尺寸、15次调用原始流与退出结果、观察及不确定性。冻结之后的 handoff只绑定本报告和manifest，避免自hash循环。

本批全部官方调用的 stdout/stderr/call.json均完整留存于 `evidence/<页>-<stage>-1.*`，不存在丢失并行索引或未保存 prepare stdout 的情况。scratch recorder每次调用各写独立文件，不是新的教材处理管线。

## Source Identity And Book Boundary

使用现有 shared interpreter：

`/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python`

官方 source manifest明确 `6p -> 6-7p`，`exerciseNumbering: lesson-group`。实际源PDF：

`/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/sources/soviet10years/6-7p 苏联中学课本 物理 六-七年级.pdf`

23,802,196字节，SHA256 `46e2b2e4a92b7c00fab9adfc6a8a9b5340a9519fa90f1b82e79bc1e1432fcbb0`。使用原默认 `--books`，没有指向替代源目录。

TOC核对如下，全部仍在6p第四章：

| TOC对象 | 本批实际源范围 |
|---|---|
|`phy6-c4-s14` §61 压强计|161顶部图158/159与续文，随后问题1–3|
|`phy6-c4-s15` §62 活塞式抽水机，印刷150起|161标题及首段、162正文/图160/问题1–2、163问题3及练习29题1–3|
|`phy6-c4-s15-t1` 大气压强发现的历史，印刷152起|163标题及正文、164正文、165续文/图161及结尾|
|`phy6-c4-s16` §63 液体和气体对浸在它们之中的物体的作用，印刷154起|仅165标题及未完首行；不得当完整课晋升|

TOC下一章 `phy6-c5` 起于印刷171，未触及该章像素或任何7p材料。166及以后未授权，因此不为闭合§63越界读取。

## Exact Counts And Official Results

| 物理/印刷 | 块 | MD体行 | 真实共享行 | 实际/检测文字行 | 新完整题 | 图组 | prepare | finalize | vectorize |
|---|---:|---:|---:|---:|---:|---:|---|---|---|
|161/150|12|18|1|17/17|3|2|exit0，一次|exit0，一次|exit0，一次，2图|
|162/151|8|18|0|18/18|2|1|exit0，一次|exit0，一次|exit0，一次，1图|
|163/152|11|25|0|25/25|4|0|exit0，一次|exit0，一次|exit0，一次，真实0图|
|164/153|7|26|0|26/26|0|0|exit0，一次|exit0，一次|exit0，一次，真实0图|
|165/154|8|18|0|18/18|0|1|exit0，一次|exit0，一次|exit0，一次，1图|
|总计|46|105|1|104/104|9|4|5次|5次|5次，4图|

prepare挖图前的估计行数24/26/25/26/25均仅是原准备产物；实际文字行以逐页原像素/忠实转写及掩图后的finalize对账为准，未把prepare数值当文字真值。

9道完整原题 = §61问题3题 + §62问题3题 + 练习29三题。跨页的§62问题3是完整新题，不是空续题；无开放习题、无未编号题、无新增题。

五次 finalize均0规范化、空errors/unknown_chars/katex_warnings、errata=0；无人工 `↵`、空块、伪 `samerow`、改题凑行或跳过门禁。

调用总数15：每页prepare/finalize/vectorize各一次；**0首FAIL、0修复、0门禁重跑**。实际发生首FAIL才需保留快照，本批没有首失败产物，不伪造失败/repair记录。

各调用使用以下形式；参数和每次真实时间/退出/流hash在manifest及call.json中：

```text
env PYTHONDONTWRITEBYTECODE=1 <shared-python> -B
.claude/skills/ld-s10y-lesson/tools/p2c.py <prepare|finalize|vectorize>
--book 6p --page <161|162|163|164|165>
--root /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-161-165/artifacts
--work /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-161-165/work
```

未加 `--force`、`--books`、fallback或lenient参数。工具hash在每次调用结束后记录，冻结时与全部结束记录一致；不冒称是调用启动前快照。

## Actual Pixel Reading And Transcription

5张1472×2161、300dpi原 `page.png`均**分别实际打开完整无网格图**，先认全部对象再写MD，不用多页缩图；未打开grid，但官方prepare的grid保留供独审。4张官方最终PNG裁图也分别实际打开。

- **161**：图158完整外观与图159完整内部结构分别裁取；两图题同一原横排，只有第二cap为真实 `samerow`。入界金属管/杠杆/齿轮/开关/指针续文6行完整，3题均完整；§62首段3行及粗体首次命名“活塞式抽水机”保留。图158原N/cm²和全部分度只留在裁图，不改单位或猜读数。
- **162**：原上移/下移活塞、上下只向上开启阀门、大气压/水压作用、反复抽水正文11行完整。图160的а/б两子图为一个编号图，不拆出新图号。左图题与右图题首行同横排，整体cap共3行；只有第一横排合写左右图题，后2条原编号说明各独立，不错误使用多行共享标记。两问题完整。
- **163**：保留问题3、练习29全部3题，含抽水银、酒精、空气室作用及“深于10.3米”的完整条件；没有解题或加入答案。独立补充阅读标题前半粗体/括注普通字在notes注明。原历史/文化/引语“自然界害怕真空”“拒绝”、亚里斯多德、佛罗伦萨、伽利略、原字“就象”、原“18意大利吋（约折合10米）”如实保存，未现代纠正。
- **164**：26行历史原文完整，含托里拆利、维维阿尼、1643年、山脚/山顶实验、100毫米高水银柱及帕斯卡原引语。末句原止于“仪器来”，不补尾字，保持 `open`。
- **165**：图161原两装置状态整体保留；正文中的A/B/C/h以行内数学编码，分图号为西里尔а/б。初态、排气、B/C液面变化与h高度叙述、补充阅读结论完整。§63标题一行及首行止于“石”，保持 `open`，不加入166正文。页脚微小点的不确定性见下。

本批没有真实圈号或小问西里尔枚举；可见装置编号1–5为普通数字，没有凭空改为圈号。原分图а/б按本教材西里尔序列保存，装置A/B/C/h保持原符号身份。

## Full Crop Inventory

每张精确框由现有finalize吸附产生，非手工SVG。坐标 `[x,y,w,h]`针对原1472×2161像素；PNG尺寸包括官方padding。

| 图/物理页 | 全部原物件与子图 | 粗框 → 最终墨迹框 | 实际PNG像素 | 官方vectorize不匹配 |
|---|---|---|---|---|
|158/161|完整外/内表盘、0–10刻度和数字、原N/cm²、指针/反端尾形、底部接口及开关手柄|`[310,230,355,440]` → `[317,237,340,430]`|364×454|0.033%|
|159/161|完整内部弧管/外壳、指针、齿轮、开关、杠杆，原1–5及全部标注连线、底部连接|`[850,265,420,400]` → `[865,272,401,383]`|425×407|0.007%|
|160/162|а普通泵与б空气室泵两子图；原上/下箭头、活塞、上下阀、手柄、空气室、各水源/水面、出水及全部重复2和1–5编号|`[280,980,825,565]` → `[292,993,797,546]`|821×570|0.003%|
|161/165|а/б两装置状态；A/B/C/h、所有容器/弯管/水银面、两端高度箭头、抽气管、两处“接抽气机”及原箭头|`[335,230,855,510]` → `[348,231,815,498]`|839×522|0.020%|

两张单图 + 两个双子图组 = 4个原编号图、6幅子图。图题均为文字cap，未烙入最终裁图。所有标注/箭头/刻度均源已有，modern additions为零。

全部4张PNG实际逐张打开；配对SVG全部由本批官方vectorize生成并通过其resvg栅格比较，无手工SVG或额外渲染器。上表百分比是官方日志已四舍五入的输出，不推算虚假精确误差。

| 图 | PNG SHA256 | SVG SHA256 |
|---|---|---|
|158|`534b87071b5b8e01fda7cafc09d933703b48be46e8cd305f9c5a6aa3c0c270aa`|`9989ed933d3117c350323daafc9867f2c1608658b9fa744a60277b9c6299761f`|
|159|`839f05cdc52287f4048567a733bddf46240daa7a382e0ad0947b7e1b716d547d`|`fcb4ff1d073848beed34edcf54efc7d9276faf2a91771c55e0ab50cafe2ab9be`|
|160|`e7952f5be3810bc82f0aa2e268043e63045dcd0cc84f9d6a0480ffabb251afdf`|`981efc26ce5c4b9bab09cb1e2e79261f697abed3449cc957ff7ece2588ea3d91`|
|161|`1c920bb357648907e6c91062c7622c15d2e86896f40fb8bf4d1b9a139c179308`|`4d173752db2a74a02219e547d0025a5a6cce9654af0f7e2cefe074bf4162b113`|

精确PNG/SVG绝对路径与字节数在manifest，不只依赖此图号表。

## Continuation And Explicit Ownership

- 复用已有160尾文“这种压强计的主要部分是”作上下文，不重读160像素：161的 `p0161#5 p cont` 在图158/159及图题之后承接并闭合。图158此前正文引用来自160；图159在161正文有实际引用。
- `p0164#6 p open` → 跨页图161/cap → `p0165#3 p cont`，原“仪器来”/“做.”相接。
- `p0165#7 p open`止于“石”，§63未完整；166+既未读取也未编码。
- 图158/159属于§61正文；图160属于§62正文，练习及历史亦有真实引用；图161属于独立补充阅读正文。无无编号图或推测 `owner-ex`，不得把正文图凭位置改为练习独占图。
- “问题”与“练习29”的重复题号按lesson-group保留原栏目身份；163首问题3延续162栏目，未虚构第二栏目。
- 图160/161的分图名是原同编号的子图，不把图160а/б或图161а/б编码成相互覆盖的两份 `fig-160`/`fig-161` 文件。

## Uncertainty And Honest Limits

**U165-footer-dot**：165页脚为原两侧圆点夹154；右装饰点右下约 `(350,2041)`另有独立微小点，无法确定为印刷句点还是扫描斑。

[0165-footer-observation.png](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-161-165/evidence/0165-footer-observation.png) 为原 `[175,1990,400,2070]`区域放大3倍，已实际打开。候选foot保留可见点表示为 `· 154 · .` 并在notes登记，不断言其语义；独审应明确判定或继续保留不确定性，不把机械PASS当已识别正确的证据。

不存在不可读题面或已知数学印刷错误；未登记erratum。历史“18意大利吋”按原忠实保存，不因现代常识而修改。扫描散点不凭空组出其它文字/对象。

MD/JSON全46块及metadata经现有只读 `blocks.parse`核对一致；这是作者冻结字节/结构校验，不是独立内容审批。4张SVG XML也读取成功；没有再次运行官方门禁来生成报告。

## Page Hash Freeze

| 页 | page.md SHA256 | page.json SHA256 | audit.json SHA256 |
|---|---|---|---|
|0161|`3fa34f3a7f7baf0bc30b07e662ae42ce84be8cca353397266b38c3d5cd26ae47`|`8d557815dc357b09516fb024798e016a4f19183f08c79e0b84bed834d6fd2aca`|`8d79c79e02bd02c7a4e7562d02df0e23bcaf033271331e092a246ad3dded6d40`|
|0162|`8fb11152fa5a4ed2cb10f6305548d717dd286d0d57701f0c677c1b37cbf61dc1`|`717f9778a09e0c1cb07f288dc836a0615c44955abdccece6dedb12ed0e37505d`|`2c5afbcd3ea4ed3cbc4b0485e6000df0a1b234a7e558f03e7c560de0ff220c0d`|
|0163|`099e2621a7744f2e31577e2d18fe9fa1efa19a42442f3c22474a1f2267215c57`|`072a577a3ff5e34f87ba56e61c066f7d7d6757c31289aab2a7bf2c8752c06819`|`5ceb3e1f6ed5bee74af54d34f4549a926be0398b5546fd44d2902073e7adef83`|
|0164|`fdd92a65be1b2630a4aeaaf3331c17a79808ac3cb7af74bcf0350a337e4b68be`|`55b5dbaf3440b52245eb11978843c2ebcd3ff135b4ebd348aaec758f64266e76`|`cf5d768d91214c3f650c88fd13bb460c5d6b5c33dd1499dc2fa4444711461898`|
|0165|`2950963eb709325870bcbfdb674339e15ccae1206e8251495758ea7fb02faacd`|`239c2098c1ea505905256dc5e3254c30e8a8d93677558899ac3aeecec96de8a7`|`5a5ef9f756217b6a3d6114060b6c01e8a4cc82d18f3cedf43cfd2ec18df11bda`|

| 原页PNG | SHA256 |
|---|---|
|0161|`513bea106616bf4584631e9dd031cd4ba9f5ee3ac30b3787e6a8e696117c9744`|
|0162|`ddb84ae8839b2ee4eff89b1dc361973de3b32f9c6f7781569774e5d137020e63`|
|0163|`e45edcda155085ff259da559139a7183335f9a86c0f94befed50c4e8c267ac68`|
|0164|`27d0fee7f3c62c014c41456f3cd4540083b75427db5f9afb6fab49e236fde480`|
|0165|`39ca6e42c9e201db3f3d90978d194aa5401cf32f3a7ccd41fb33da9d600b92f4`|

## Handoff

源码作者完成冻结，所有官方子进程已结束。本报告、manifest及handoff为作者证据，**不含自签 independent PASS**。交 Bacon 在同一精确冻结上做非作者独审；main决定审批/晋升及任何后续受影响授权。

canonical/assemble仍未改动，166+仍未派且未读取。本批保持冻结，不预先修审查尚未指出的内容。
