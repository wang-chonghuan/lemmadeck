# c4-s3-t1 / c4-s4 现代文字作者候选

2026-11-15。未来批次scratch，**不是batch7 ready**。
两课分别已宣布候选冻结，等待独立文字审查和另行现代图作者/审查；
本作者不独审、不finalize、不晋升、不写答案或choices。

## 输入与隔离准备

已读取ld-s10y-lesson、modern-us-neutral profile、edition-text-contract、
现有正文排版与prose_flow合同。完整读取两课的新批准raw
lesson.json和exercises.json，不采用旧答案或他人报告/源解。
raw仅作为只读输入：

`.tmp/ld-s10y-lesson/approved-through-130/artifacts/6p/`。

实际分别打开该raw图库的fig-104、105、106、107、108、109 PNG，
共6张。未打开或创作现代图，未将来源清单当作看图。
每课handoff含原图完整语义库存、实际查看记录及PNG SHA256。

官方adapt-prepare仅调用1次，exit0，未用force：

```bash
env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/p2c.py adapt-prepare --book 6p --edition modern-us-neutral --root .tmp/ld-s10y-lesson/approved-through-130/artifacts --work .tmp/ld-s10y-lesson/text-author-c4-s3t1-s4 --lesson phy6-c4-s3-t1 --lesson phy6-c4-s4
```

全部模板位于隔离目录：
`.tmp/ld-s10y-lesson/text-author-c4-s3t1-s4/adapt/6p/modern-us-neutral/`。
没有覆盖canonical work或持久edition。官方prepare自动创建的
book.template.json仅是scratch模板，未手工修改或晋升为索引。
其SHA256为
`7ea66bb56a6367e6fcc63e9ff13c6c13480a767945d70ff70cb50a6cd4ed650a`。

## 两课精确计数

| 候选 | 原结构块 | 显示段落 | 原任务 | 原图身份 | 段落分界 |
| --- | --- | --- | --- | --- | --- |
| phy6-c4-s3-t1 | 16：10p/3fig/3cap | 12 | 0 | 104/105/106 | 3/5/8 |
| phy6-c4-s4 | 6：4p/1fig/1cap | 4 | 7：问题4、作业3 | 107/108/109 | 3 |

总22原结构块、16显示段落、7原任务、6张原图身份。
s4的108/109在作业内引用，不误计为正文fig块。
补充阅读保留number=null及0题，不造question、choice或答案。
s4题号顺序为`1,2,3,4,g2-1,g2-2,g2-3`；源号、栏目、
group_id、页块和图引用全部保留。新增题0、数学改式0、
numeric_changes=0、需声明的具体historical_entities=0。

## 文字与语义调整

补充阅读保留气动机械脚注的原数学标记和定义；完整保留工具、
风镐交替受压/往复/撞击、喷沙与喷漆、三类车门应用和制动过程。
原图104实际只有风镐，现代说明不假称含铆钉枪第二对象。
正文的“气动机械”跨行碎强调整理为连续加粗，不改变定义。

图105的风压管1、滑阀2、活塞3、镐尖4完整绑定；
图106的主气路1、阀门2、贮气筒3、压力缸4、制动块5、车轮6、
左右方向和回位弹簧过程均保留。把原“停车开关”表述为图示放气开关，
用左右压强差阐明原驱动作用，不补阀门时序、参数或新状态。
把原“现在经常”与普遍化车门说法限定为应用实例，制动器明确为
原图的一种简化结构；不编造现代车型、普及率、年份或机构。
具体历史人物/地点/机构没有来源，故historical_entities为空；
技术类型“火车、地铁、无轨电车”仍保留。

自由表面课保留原定义和水平面/水平仪强调，明确讨论与气体相接的
液体表面。原表面所有分子同高的表达改为静止容器、平衡、近似相同
上方气压、忽略器壁弯曲和微小起伏时的宏观水平面，避免把分子热运动
误写成静止。气体段保留§14、间距/吸引/各向运动解释，并限定通常
气体条件；新批准raw中“气体就要占满它所能占有的全部体积”的
完整加粗继续保留。

s4全部实践要求保留：铅垂线和三角板检查液面并画实验图；
用厚纸/硬纸板照图108制作水平仪，检查窗台/桌面/地板；
用水平仪及小木楔调平胶合板/木板，并放滚珠观察。
“重垂线”现代化为同一器具“铅垂线（悬挂重物的细线）”。
滚珠说明补原先静止、平整板面和无明显振动条件；不把球不动
反推为水平的充分证明，不填实验结果或调平操作答案。
具体逐源块调整声明均在各自author-handoff.json。

## 段落与作者检查

先使用现有normalize_prose_layout的只读输出整理短段落，再实际运行
prose_flow.mjs，从其相邻最终段落复制before/after锚点。
没有按原块或换行手算索引。现有proseFlow解析分别得到3/5/8和3；
这只是作者排版合同证据，不是现代图或独审批准。

两课各做一次只读作者结构/文字合同检查：
原快照与raw逐结构相同、来源SHA相符，原块/题身份及元数据不变，
math_signature及非公式数字序列相同，profile禁词/西里尔检查零错误，
正文短段落与编号分题排版兼容现有规范化器。figures.template.json
仍严格等于官方prepare的来源清单，没有手填现代spec或造图。
另做一次交付包hash绑定核对，六模板、两handoff、raw及原PNG相符。

作者合同检查失败0次，首次失败无，失败后修复0次；
不声称正式adapt-finalize、KaTeX离线渲染、独审或现代图门禁已通过。
探索时有一次rg查询附带不存在的edition_text.py路径及一次ls确认
新work目录尚不存在；均未造成内容单位失败，未据此改工具或输入。

## 冻结SHA256

完整文件字节SHA256，不是canonical摘要。每课目录均在隔离
`adapt/6p/modern-us-neutral/lessons/<lesson>/`。

| phy6-c4-s3-t1文件 | 字节 | SHA256 |
| --- | --- | --- |
| lesson.template.json | 16162 | `f4862ac35bf3e9d862de4946fab6a13275686ab3657f320115c7187882159659` |
| exercises.template.json | 416 | `bfa36060b343d17685111bc483d2e6d3da36ff189e2c7aa66dfde91f9320cffa` |
| figures.template.json | 1627 | `02e4d0881790003183b068fbca6556a8dc195b322352859798e984d663af186c` |
| author-handoff.json | 5918 | `1b83ba6b37df99d6a1513cda25e845ae70b9d06016c3322ecfa0d5c4190044bb` |

| phy6-c4-s4文件 | 字节 | SHA256 |
| --- | --- | --- |
| lesson.template.json | 7480 | `59a370c5d16366da8d9fb81a3a9026465fb21ef96e5055d3beea79055e320d50` |
| exercises.template.json | 9891 | `0854a8cdb9386e92aada2c80319f57a0f853a5c3b8d83759957a66c28de6de84` |
| figures.template.json | 1624 | `c8db622ccfaf36672eabe4d213ac48515041771577e5252633b5c55ef36600f6` |
| author-handoff.json | 7508 | `720f963895efaef57bc03ba4a5dffdec02c80086f1c0301a70508bc0b5b3c6ac` |

| 只读raw输入 | SHA256 |
| --- | --- |
| c4-s3-t1 lesson.json | `adc92daa2ebe4862e087239bf2ffaa0c1d4712380ee9babc7a485e51af23b558` |
| c4-s3-t1 exercises.json | `b8e5e6e6a6006897854bcb71bd36942cdd1dbd8676f6a3ca69598ccd6d71c55b` |
| c4-s4 lesson.json | `45e735c94584123ef04122138bc4cc38c1a1c681c8576f6f8f78ea34e05362d8` |
| c4-s4 exercises.json | `b45358a8fd658bf562ed20661ce79abb9e3d1602fd59ec8be50405584191d583` |
| modern-us-neutral profile | `f03840602a5de0c22b7eea096fe24db758c6d66b6532c75cda26c6766a1573f1` |

六张原PNG hash与观察库存已逐图绑定在handoff，未修改PNG/SVG。

## 停止边界

只写本次隔离work模板、两个author-handoff及本工单报告。
未修改raw源、源页、工具、canonical候选、持久edition或他人报告。
没有assemble、vectorize、adapt-finalize、render、现代图制作/晋升、
答案/choices、DB、Git、浏览器、服务或安装；工具session均已结束。
先后分别宣布两课候选待独审，未擅自通知其他chat。
未来批次文字scratch完成，等待独立审查，不晋升为batch7 ready。
