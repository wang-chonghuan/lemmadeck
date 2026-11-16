# 7p225–229 FIRST Independent Source Review

**PASS：225、226、227、228、229全部来源页。** 审查者Feynman，作者Wegener；
本次是唯一FIRST完整源审，未发现必要字句、标点、强调、数学、题身份、
图框/图题或跨页标记缺陷。仅批准本五页冻结源事实，不批准现代课/现代图，
不声明§87闭合，不执行promotion或assembly。

## Exact Authority

作者root：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-7p-225-229`

作者handoff SHA256：
`e9afd23929a2e3791695c83e42849f9d9078b96048170918c5a0e5e4bcfffc2f`

作者source-manifest SHA256：
`c2d489b79fd0ba36f66f2f412d28b4133d52955c2adfd9da5e76ce85ae846586`

实际像素观察前冻结的独审input-manifest：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-7p-225-229/input-manifest.json`
SHA256 `53f99aceb9cbdc10b639de5f7fa61e1778e6ae3603072aef39ed478a1c605a4c`。
5745个声明、337个精确文件绑定全部匹配；包括本五页原PNG/grid/layout、
完整MD/JSON/audit、五裁图/原SVG/native、作者报告、ledger、
全部逐调用输入/输出与工具epoch。历史finalize-input只代表当时输入，
不是当前已收口MD；不拿历史输入SHA强求当前输出相等。

## Actual Full Observation

逐页各自实际打开原page.png及page.grid.png，读完整page.md、page.json、
audit.json；每张裁图和既有native另行单张完整打开。原图不是作者清单或
PASS计行报告的代用品。完整54块逐leaf事实在独审root的
`page-observations.md`；`source-binding-observation.json`保留MD/JSON逐块一致、
历史输出字节一致、所有SVG XML元素/完整路径哈希和native输入绑定。

| Physical / Printed | Blocks | Independently Read Rows | Source Ex Blocks | Figures | Decision |
|---|---:|---:|---:|---|---|
|225 /214|12|24|5|无|PASS|
|226 /215|12|26|4|214|PASS|
|227 /216|9|18|0|215、216|PASS|
|228 /217|8|17|0|217、218|PASS|
|229 /218|13|25|7|无|PASS|

总54块、110印刷行、16源ex块、5图。16题块是225“问题”4题+练习42
题1、226练习42题2–5、229对流“问题”7题；不是跨栏目连续16号。
本批公式0；原3.7倍、21.5倍及冰晶括注逐字保留，没有自造公式/单位。
五页圆点页脚全部保留。各页audit已有normalizations/unknown_chars/
KaTeX warnings/errors均为空，机械结果只复用，不代替像素判断。

225金属/液体/气体、羊毛棉花绒毛毛皮/贮空气/真空、保温/窖藏冰、
完整能量传递着重点及五题忠实。226粗体对流定义、阿基米德力与重力的
原比较、灯与风车现象及全部四题条件忠实。227闭合水循环、高锰酸钾、
室内对流、自然/自由/强迫对流及非均匀加热条件忠实。228“冷”与
“传导”恰为原黑体；上部加热/冰未融化/不能对流与晶体束缚原文完整。
229七题全部请求、风/通风段内编号、两组海陆风着重点、夏季昼夜、
密度/压强/流向、蒸汽机车/炉灶/茶炊完整。着重点采用既有单`*`+notes
语义表示；本报告不误称原页字形为斜体。

## Figures And Boundaries

| Figure | Exact Box XYWH | Complete Source Inventory Observed | Caption |
|---|---|---|---|
|214|[1039,991,249,399]|纸风车、灯泡/灯丝、灯座/基座、完整右侧支架|与左正文末“流.”同排；cap samerow|
|215|[992,343,299,405]|立架/夹具、烧瓶/液面/水中循环箭头、火焰与加热器/基座|与左正文末句同排；cap samerow|
|216|[218,994,1107,545]|完整室内边界、窗帘/暖气片、桌椅/柜/书架/花瓶/吊灯/墙画、全部循环箭头|独立一行|
|217|[255,569,401,482]|手/试管/水/冰/蒸汽、火焰与灯；水蒸汽/水/冰原中文标签和引线|与218同排|
|218|[857,636,461,387]|完整手/斜试管/上部加热/火焰/灯/木纹垫块|cap samerow|

各PNG恰为精确原框像素加官方12px白边；图题未混入裁图。
各完整SVG为单currentColor/evenodd路径，native与SVG及裁图input绑定准确。
作者一次vectorize既有不匹配率214=0.006%、215=0.000%、216=0.014%、
217=0.010%、218=0.012%；本次没有再render/vectorize/native。
五图均被86正文引用，语义owner为TOC `phy7-c1-s1-n86`，没有虚造owner-ex。

边界逐字核对：224尾“但却”→225“能把…”句末闭合；
226“为了观察在加”→227“热时”；227“让我们照”→228“图217”；
228“冷水底”→两fig/cap透明间隔→“下去”同段闭合。
229 `p0229#12`为open，准确止于“为了创”。未读230+。
只读224末尾文字及块头定位，当前尾段为p0224#10；作者p0224#7是
所继承的用户上下文称谓，未当成当前canonical source_ref或重审224。

## Execution And Handoff

复用作者15official calls（prepare/finalize/vectorize每页各一次）和5native
calls全部exit0，逐调用before/after工具hash相同。实际当前p2c SHA256：
`acda64449af5a9c043a8502e7840f6391c95cf01a63458bbf005011b773fa8ac`。
本次仅整理绑定的辅助脚本首轮KeyError/exit1已保留
`inspect-bindings-first-helper.py`与`helper-first-error.md`；更正读取既有ledger
输出字段后exit0，未触源、作者记录或任何source gate。

active approved union全部来自同一作者root的`artifacts`和`work`，页范围
225–229；准确可复制文件与SHA见独审root的`approved-manifest.json`，
完整不可覆盖handoff见`review-handoff.json`，证据副本见`frozen-first-review/`。
作者每页repair仍0/1，未消耗或重置。审查者source repairs、official gates、
native renders、浏览器/模型/服务、DB/Git、canonical writes、assembly/
promotion均0。未读answers、keys、choices或私有源解。
