# phy6-c5-s8 完整 TEXT 作者冻结

STEMROBIN-180，印刷§75「使用简单机械时的等功原理　力学的“黄金定律”」。仅作者，等待 main 首次完整独立 TEXT 审查；不作作者自审批或正式课批准。主 official adapt-prepare 一次 PASS/exit0已复用，作者重跑0。

## 精确交接

Root：`.tmp/ld-s10y-lesson/text-author-c5-s8`。

Candidate：`adapt/6p/modern-us-neutral/lessons/phy6-c5-s8`。

| 文件 | SHA256 |
| --- | --- |
| `author-handoff.json` | `5da9a786857329c178c0af94f62bf3cabc6d2e698af4915c1cafe7c011c5f9e1` |
| `frozen-manifest.json` | `f90f8d7b6f685fd3f20944be78bb836eb17377d8f1491b9760ed4b8c5c0b3bb7` |
| candidate `lesson.template.json` | `558d308179f0a763ca1ab67d6d50db5222d7c97818deab958483a316c4048936` |
| candidate `exercises.template.json` | `3908b852b09bf2e27e0a09f2c01cd19a7049f52a77b997c73ab665d5c18490f1` |
| candidate `figures.template.json` | `6efa13eea2a5e75a46b118d1b3eb79f7f8360fbfcc59bbc73306943b1e2fadc4` |

完整20块、9题、两正文fig/cap、源快照及模型/历史说明冻结于 `author-context.json`/`author-context.md`；逐20块/9题改写说明在 `author-notes.json`。`input-bindings.json`绑定完整 canonical raw lesson.json/lesson.md/exercises.json、全部 main prepared三模板及5张实际原PNG。原输入副本在 `raw-snapshot/`、`prepared-snapshot/`、`originals/`。全部 source.data/source_text、原页引用、题号/栏目/无题号作业身份保持原样。

Manifest覆盖48文件；manifest/handoff另绑定，freeze过程结束后产生的三份流/命令记录在 `evidence/freeze-1.{stdout,stderr,call.json}`，无循环自hash；全root53文件。原默认templates、canonical及其他作者/旧freeze未改。

## 语义与引用

完整20源块对应20现代块（16正文、2fig、2cap）、9原任务；原5问题、3练习、无印刷题号作业q1全部保留。全部16数学片段原字节及完整数字序列不变，无 numeric_changes/errata 数学改写。

杠杆、定/动滑轮的等功与倍数力/距关系明确限定忽略摩擦/机械与绳自重、近似平衡缓慢运动及不可伸长绳等理想模型；实际机械还需为摩擦或提升自身等做额外功。功比较输入与负载获得的大小，明确按力方向位移计算，不把任意轨迹弧长直接视为做功距离；图195实际弧形行程语义未删。长臂省力、短臂省距、定滑轮等力等距、动滑轮h/2h的源内容完整保留。

Archimedes采用English主名，并保留源中文阿基米德作为同一历史身份：`Archimedes（阿基米德）`。正文p0201#6/#7逐项 historical_entities.term绑定原词阿基米德，reason说明English身份与源“据传说”/教材叙述性质；不以虚构人物替换，不把历史声明当文化豁免。原地球抬高1厘米、长端1米/秒、几百万年完整保留为教材说明，未增地球质量、力、杠杆长度或任何计算。

练习原1.5米、7米、160牛顿、5米全部不变；没有计算答案。液压机无题号作业完整保留图100、F_1/h_1/h_2、同体积流动提示与活塞/缸壁摩擦忽略；补明本节理想不可压缩/无泄漏及液体自重和其他损耗忽略的适用条件，不提供证明式或答案。

实际分别打开原 `fig-195.png`、`fig-196.png`、`fig-181.png`、`fig-190.png`、`fig-100.png`，仅供本文语义。原195与181的力/臂下标分配各按各自原图，未串换；190为固定轴定滑轮，196为支架固定绳端/动滑轮/测力计自由端，100为小/大活塞和连通液体。完整观察与PNG尺寸/hash在notes/inputs；未重做源独审或制作现代图。

两正文图195/196的 supplied figures.template逐字节不变。跨课181/190/100文字及exercise引用全部保留；该prepared图模板只含两正文图，最终跨课图manifest保留/引用绑定及现代图审批为main后续范围，未以假占位图冒充完整图门禁PASS。

## 一次机械与首次失败

首次 canonical prose_flow process exit0，但实际输出显示动滑轮一对粗体跨独立段落14/15，作者如实记录 `S8-LAYOUT-1` FAIL；不是伪造工具退出码。原候选三文件、normalization、第一次flow stdout/stderr/call、own pre-repair dispatcher及failure.json都保存在 `first-failure-01/`。

唯一修复仅在 lesson.prose[15]于现有段落边界闭合/重开强调；去掉粗体标记后全部文字字节及其他候选字段不变。一次 affected block canonical/flow API验证exit0，未另行重跑全flow CLI或全TEXT检查；随后唯一完整TEXT检查按合同在内部解析最终flow一次。修复文件 `layout-repair.json` SHA `046a1a174cf8a91a6ad299d9d7cf941884ca7b713062e6eee63aaa030cd06027`；首次failure SHA `d3059e0ec08a9b0a42ad9e5a82aaee1df1918c713035fd9a848359c0e2ca9c19`。

三个section_breaks从实际全flow和受影响flow输出的相邻段落复制，最终解析边界10/13/16，分别为历史例述、滑轮、总体规律。未按块号手算。首次完整TEXT机械检查仅一次PASS：29单元、18最终段落、3锚点、16数学片段；错误0、警告0。修复1/1耗尽；若独审仍有缺陷，BLOCK，不再修。

实际调用cwd为workspace；共享Python始终 `env PYTHONDONTWRITEBYTECODE=1`、`-B`。完整argv、UTC起止、exit、stdout/stderr hash在 `evidence/*.call.json`；计数与首次FAIL链在call-ledger/handoff。

```bash
P=/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python
W=.tmp/ld-s10y-lesson/text-author-c5-s8
env PYTHONDONTWRITEBYTECODE=1 $P -B $W/run-recorded.py compose-1 $P -B $W/text-author.py compose
env PYTHONDONTWRITEBYTECODE=1 $P -B $W/run-recorded.py normalize-1 $P -B $W/text-author.py normalize
env PYTHONDONTWRITEBYTECODE=1 $P -B $W/run-recorded.py prose-flow-1 node .claude/skills/ld-s10y-lesson/tools/prose_flow.mjs $W/adapt/6p/modern-us-neutral/lessons/phy6-c5-s8/lesson.template.json
env PYTHONDONTWRITEBYTECODE=1 $P -B $W/run-recorded.py layout-repair-1 $P -B $W/text-author.py repair
env PYTHONDONTWRITEBYTECODE=1 $P -B $W/run-recorded.py text-mechanics-1 $P -B $W/text-author.py check
env PYTHONDONTWRITEBYTECODE=1 $P -B $W/run-recorded.py freeze-1 $P -B $W/text-author.py freeze
```

以上各一次、均process exit0。稳定工具epoch起止完全相同，全部hash见mechanics/handoff；edition.py `4c15c8aba51f65eb5ee3bf3cdeecf9691777b221bd120b590aba7e448f64cf19`，katex_check.js `b5e082a863b785bf037a3fbf7b27f92221342359d313be144a27fc6ed98df35e`。未改稳定脚本或重跑main已完测试；own dispatcher初版字节随首次证据保留。

## 停止边界

未读取旧/其他答案、keys/choices、私有source-author-c5-s8或main解；未做图/model请求、figure gate、adapt-finalize/retain/publish、DB/app/Git、服务/浏览器/安装/环境变更。仅own scratch与此durable工单报告写入。等待首次独立fullTEXT审批及main后续处理。
