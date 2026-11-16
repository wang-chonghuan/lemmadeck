# 7p Physical225–229 Source Author Freeze

作者Wegener；状态 **COMPLETE_AWAITING_FIRST_INDEPENDENT_REVIEW**。只负责忠实来源作者，不自签独审PASS。隔离root：

`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-7p-225-229/`

五页源MD/JSON/audit在 `artifacts/7p/pages/{0225..0229}/`；整页原PNG/grid/layout/template及原裁图PNG/SVG在 `work/7p/pages/{0225..0229}/`。全部当前字节与逐调用历史输入/输出、完整argv/exit/工具epochs由 `source-manifest.json`、`call-ledger.json`、`author-handoff.json`冻结。没有canonical或原始批准页变更。

## Source And Scope

先核对现有lesson skill、页块/强调/跨页/图归属规则、manifest、TOC及旧隔离调用记录器实现；没有复制旧页正文。catalog `7p → 6-7p`，`exerciseNumbering=lesson-group`，不得从6p推断题号重起。

共享原PDF：

`/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/sources/soviet10years/6-7p 苏联中学课本 物理 六-七年级.pdf`

实际SHA `46e2b2e4a92b7c00fab9adfc6a8a9b5340a9519fa90f1b82e79bc1e1432fcbb0`，与manifest一致。物理225–229对应印刷214–218；TOC中§85起于已批准223，本批承接其224尾段；§86起于226，§87起于229。没有重新读取/转录215–224扫描；仅继承用户给的 `p0224#7 open` 尾“但却”。没有读取230+像素或私有解/答案/choices。

各页先完成单张完整原 `page.png` 观察，再单张grid定位和逐印刷行转录。原页文件1472×2161，工具显示全页缩至1307×1920；228/229另以精确native裁片确认必要强调。独立视觉预期行数在转录时登记，不以gate数字反向凑行。

## Complete Page Inventory

| Physical / Printed | Blocks | Text Rows | Exercise Blocks | Full Original Figures | Boundary |
|---|---:|---:|---:|---|---|
|225 /214|12|24|5|无|首p cont“能把…”接224“但却”；本页句末闭合|
|226 /215|12|26|4|图214|末p open“为了观察在加”|
|227 /216|9|18|0|图215、216|首p cont“热时”；末p open“让我们照”|
|228 /217|8|17|0|图217、218|首p cont open“图217…”；跨两图由p cont“下去”续完；页末闭合|
|229 /218|13|25|7|无|末p0229#12 open“为了创”；87未闭合|

总计54块、110印刷文字行、16个完整源ex块、5张完整原图。ex块不是全书连续16题：225的“问题”四题及练习42第1题，226练习42第2–5题，229对流“问题”七题，栏目范围和原题号保持。没有装订运行，因此不凭作者报告分配新的稳定lesson/group IDs。

225完整保留金属/液体/气体导热、纤维与真空机制、室内保温及窖藏冰方法；原“导热也就是…”强调点以源斜体保存。226完整保留3.7、21.5及四题、暖气片位置、气流驱动纸风车、膨胀/密度/阿基米德力机制和粗体对流定义。227水循环示踪、室内对流、自然/自由/强迫对流及开放末句完整。228上部加热水与空气、冰未融化、不能形成对流/导热很慢、晶体粒子束缚和传导完整，源粗体仅“冷”“传导”。229七题、风的说明、完整海陆风两句强调及通风/蒸汽机车/炉灶/茶炊内容不现代改词；粗体段内编号标题保留为p，不误认练习或新课。五页页脚两侧圆点均原样保存。

## Original Figures And Actual Viewing

原粗框由官方finalize吸附，分别：

- 图214：`[1039,991,249,399]`，小纸风车、灯泡/灯丝/灯座、右侧完整支架；图题和左侧“流.”同印刷行，独立cap samerow。
- 图215：`[992,343,299,405]`，完整支架/夹具/烧瓶/液面/循环箭头/下方火焰与加热器；图题和左侧段末同排cap samerow。
- 图216：`[218,994,1107,545]`，完整室内边界、家具、灯、窗帘、暖气片及全部方向箭头；图题独占一行。
- 图217：`[255,569,401,482]`，手、斜试管、上部火焰/水蒸汽、底部冰、水及“水蒸汽/水/冰”中文原标签和引线。
- 图218：`[857,636,461,387]`，手持斜试管、上端加热、加热器与垫块。图217/218图题同一印刷行，218 cap samerow。

每张裁图PNG完整实际打开；每张source-native SVG实图通过技能现有 `svg_raster.js` 作一次native观察证据，完整sheet实际打开。此为原始potrace保真，不是现代图生成/现代门禁；没有清除中文源图标签、重画对象、改箭头或把原精度当成现代测量数据。可视原清单及记录在 `visual-observations.json` / `native-evidence/{0226,0227,0228}/`。

## Commands And Existing Evidence

共享Python：

`/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python`

隔离记录器只调用官方入口，对每页依次各一次：

```text
<sharedPython> -B <repo>/.claude/skills/ld-s10y-lesson/tools/p2c.py <prepare|finalize|vectorize>
--book 7p --page <225..229>
--root <authorRoot>/artifacts --work <authorRoot>/work
```

`PYTHONDONTWRITEBYTECODE=1`，无shared缓存写入。完整15个argv、真实stdout/stderr、exit和调用前后工具hash均在 `calls/<page>-<stage>/{start,record}.json` 与 `call-ledger.json`。全部15官方调用exit0；finalize各页errors0、unknown_chars0、KaTeX warnings0、normalizations0，数学公式0（原题3.7/21.5为原文数字，不造数学）。没有重跑计行或门禁。

一次官方vectorize的既有不匹配率：214=0.006%、215=0.000%、216=0.014%、217=0.010%、218=0.012%。5个额外native观察栅格化命令exit0；不是第二次vectorize。当前MD/JSON/audit与各唯一finalize输出快照SHA相同；PNG/SVG与唯一vectorize输出SHA相同。工具epochs是当时事实，后续shared代码变动不强迫重跑历史成功门禁。

## Failure Budget And Handoff

每页总修复上限1，含机械/runner；本批全部首轮成功，修复使用均0/1，未产生首FAIL，也不虚构失败或重置此前215的预算。若FIRST独审发现缺陷，由main单独决定唯一affected修复；当前作者冻结后不自改。

原crop细节helper在228/229之间仅扩展已授权229观察区域，没有失败/重试，不是页级修复。所有源页、图、gate快照/ledger保持冻结。

报告及完整绝对manifest/handoff交main待FIRST独审。未执行assemble/adapt/promotion/finalize现代课、canonical索引写、服务、图像API、安装、DB/Git或浏览器。没有把229未来内容或87视为闭合，止于本五页作者冻结。
