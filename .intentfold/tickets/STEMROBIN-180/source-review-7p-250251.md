# 7p 250-251 FIRST Independent SOURCE Review

2026-11-16。Reviewer：Session C；author：Archimedes。**两页 SOURCE PASS**。
本次是唯一 FIRST 独立源页审查，不是作者自审，不批准完整单元、装订、现代版、
答案、选择题或上线。没有发现源转写缺陷，没有请求或实施修复。

## 页级结果

| 物理 / 印刷页 | 块 | 独立源行 / MD / JSON / 既有 audit | 题块 / 新题 | 图 | SOURCE |
| --- | ---: | --- | --- | ---: | --- |
| 250 / 239 | 13 | 24 / 24 / 24 / 24 | 6 / 6 | 0 | PASS |
| 251 / 240 | 11 | 26 / 26 / 26 / 26 | 4 / 3 | 0 | PASS |
| 合计 | 24 | 50 / 50 / 50 / 50 | 10 / 9 | 0 | PASS |

两份 full original `page.png` 各单独以 `functions.view_image detail=original`
实际打开一次。逐行比较全部文字、原措辞、强调、标点、数字、公式符号、题号、
分组、块边界、continuation 和页脚。未抽样，未用 audit PASS 替代目视审查。
全 24 块的 MD/JSON 类型、编号、标记、块体和元数据表示相等。
逐块 PASS、独立行数及具体观察全部保存在 `review.json`。

250 的逐块源行数为 `1,2,6,3,1,2,2,2,1,1,1,1,1`。
保留能量守恒陈述的唯一粗体范围、完整黄金定律/斜面论证、原宗教传说段、
“问题”1-5 和另组“练习48”第1题。重复印刷题号1属于不同栏目，不混为一题。

251 的逐块源行数为 `2,1,3,2,1,2,5,2,4,3,1`。
完整保留打桩题括号内木桩和泥土发热条件，以及制动、钢球、乙醚黄铜管题。
“图210”只是原题文字引用，本页实际没有图；不重提取或批准旧图。
补充阅读标题粗体、括注普通；原15摄氏度、垂直入射条件、
每平方厘米每秒大约2卡、完整大气散失括注、1% 和三千万大型发电站全部保留。
本次忠实审查没有替原书改写或科学纠错。

## 来源与边界

workspace `/Users/yong/.codex/worktrees/0f12/lemmadeck`；
只读 Git status 观察到 branch `codex/STEMROBIN-180-textbooks`。
入口 readme、engineering/operations、lesson skill 的 cap1/SOURCE 规则、
共享图片批次规则和指定 background-browser skill 已读。
经 n-plane helper live GET 读取 STEMROBIN-180，HTTP200，state_group `started`；
没有 backend 写入或 IntentFold 开发/交付能力执行。

共用源 PDF 实际 23802196 bytes，SHA256
`46e2b2e4a92b7c00fab9adfc6a8a9b5340a9519fa90f1b82e79bc1e1432fcbb0`。
当前 source manifest 的7p确为 `sourcePdf=6-7p`、`exerciseNumbering=lesson-group`。
TOC n95从印刷237开始；无编号 `phy7-c1-s1-t16` 从印刷240开始。
没有渲染 PDF 或打开其它源页像素。

249只使用另存的 **repaired current MD 文字**作为 continuation context：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-7p-245249/repair-249-01/artifacts/7p/pages/0249/page.md`，
3548 bytes，SHA256 `83a25e3daf98881cba09cf725217c869a337d918b32bef9999114305c2a31740`。
其末尾“由炉”与250首块“子或暖气片处得到了能量.”正确相接。
作者原 active 249 MD 只作为原历史输入保留，不替代 repaired review context。
250 `ex 1 open` 末“在这”与251 `ex 1 cont` 首“个过程中”正确相接并闭合。
251 `p0251#10` 仍止于“地面. 这”，保持 `p open`。
**252、253未读未批，不能宣称 t16 或任何完整单元已完成。**
此前239、242、246缺口不读取、不修复、不批准、不越过。

## 冻结与调用复用

Reviewer独占根：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-7p-250251-first`。
图像加载前冻结45项当前输入；另冻结 repaired 249 MD 及其绑定。
作者根不动。当前稿路径在作者根 `artifacts/7p/pages/0250/` 和 `0251/`。

| 文件 | SHA256 |
| --- | --- |
| author `author-handoff.json` | `e3ce5abbffe80aeb8ab41ccf10b6be1fb2ac93ea4bf265b9e104d9e15c7d51b4` |
| author `source-manifest.json` | `117d4036475d55cd99a85c7fd81eef7c98975af479980828deca5608200ed271` |
| 250 `page.md` | `6ed9969b37483a98570934c1cd8f5523a95f216cf1c4f62501ade1bf7ceec1e9` |
| 250 `page.json` | `d733e41260bafc118395f0993c6afc114e711edf35287bad565922cf817d04aa` |
| 250 full `page.png` | `7a5239976ae3e3f754b478721a5406228f5044999e208ff63c91a17365bc1a13` |
| 251 `page.md` | `ccddf6be0ed598863496e28c18e6e2543181c9ce5733aa26d84dd2d01060616e` |
| 251 `page.json` | `fb9ef2fa7b9d7e83835ca45c39ac917eccb350b5dc40a638c18f5bf0da67a39c` |
| 251 full `page.png` | `a63ee9fff44523ae3b26cfa2f355a40bcf5010eaec7a63b6a69fc8d34509c7a3` |
| reviewer `inputs-manifest.json` | `784f6f20fecfa71e8d079b2bdf3653a8ded5d7bfbc2e6586666bb77022e310d5` |
| reviewer `review.json` | `a200b218964ef1c03d58928e3e303bf8681dc020f7d9ad016df93360d2912346` |

8项 authoritative、14项 author-current 和207项保留历史 byte/hash 绑定全部一致。
既有 Main prepare各一次exit0、author finalize各一次exit0、无图vectorize一次exit0，
均复用；完整 argv/cwd/streams 与历史 tool epochs 留在绑定记录中。
不将未知的 prepare历史 tool/output hashes伪造成已知。

**保留辅助失败：** reviewer首次冻结脚本exit1，40项 blanket output/current比较中
一项不等：250 finalize时保存的251 MD尚未经过251 finalize。
该历史MD3034 bytes、当前3136 bytes，正文完全一致；只新增
`printed_lines=26`、`figures=[]` 和normalized provenance元数据。
其余39项相等；251当前稿与它自己的finalize/vectorize快照一致。
原 `provenance-bindings.json` 未重写或重跑；解释另存
`provenance-resolution.json`。这不是SOURCE缺陷，不消耗作者0/1修复预算。

## 交接与计数

Reviewer handoff：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-7p-250251-first/reviewer-handoff.json`。
它绑定本报告以及inputs/provenance/resolution/context/review/current-bindings的实际
absolute path、bytes、SHA。结尾 current-bindings 对原路径、副本和PDF做字节绑定检查，
不重新目视或重跑门禁。

实际图片2；batch2/8、context2/24；grid/crop/reopen/其它页图片均0。
两页 author repair均0/1，reviewer repair0，新增prepare/finalize/vectorize/gate均0。
canonical/promotion/assemble/source index/tools/app/deps/DB/Git/backend写入均0。
只写指定reviewer根和本报告，保留其它会话全部改动。
browser打开0，task-owned browser剩余0；未启动服务或后台作业。
**无 in-flight exec/browser。** 本FIRST结束，不安排第二轮审核或作者修复。
