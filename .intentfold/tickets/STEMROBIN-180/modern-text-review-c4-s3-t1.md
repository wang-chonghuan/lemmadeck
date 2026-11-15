# phy6-c4-s3-t1 独立完整现代文字审查

- Ticket: STEMROBIN-180
- Reviewed: 2026-11-15
- Role: independent text reviewer; 作者为 Volta，本审查者未写候选文本。
- Result: **PASS (TEXT ONLY)**。
- First substantive failure: none。没有需修复的最小文字单位，也没有以作者结构 PASS 代替独立语义判断。
- 本结论只适用于下述冻结字节；不是现代图104/105/106的批准、整课 ready、adapt-finalize 或发布结论。

## 读取范围与冻结

工作区为 `/Users/yong/.codex/worktrees/0f12/lemmadeck`，以下路径均相对该工作区。

完整批准 raw:
`.tmp/ld-s10y-lesson/approved-through-130/artifacts/6p/lessons/phy6-c4-s3-t1/{lesson.json,exercises.json}`。
持久源 `ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c4-s3-t1/` 的这两个文件也核过 SHA，与批准 raw 相同；没有重做源页或 corpus 审查。

完整候选:
`.tmp/ld-s10y-lesson/text-author-c4-s3t1-s4/adapt/6p/modern-us-neutral/lessons/phy6-c4-s3-t1/{lesson.template.json,exercises.template.json,figures.template.json,author-handoff.json}`。
另读作者冻结报告 `.intentfold/tickets/STEMROBIN-180/modern-text-author-c4-s3t1-s4.md`，仅用于定位候选与冻结，不采用其 PASS 作为独审证据。

| 文件 | 实际 byte SHA-256 |
|---|---|
| raw lesson.json | `adc92daa2ebe4862e087239bf2ffaa0c1d4712380ee9babc7a485e51af23b558` |
| raw exercises.json | `b8e5e6e6a6006897854bcb71bd36942cdd1dbd8676f6a3ca69598ccd6d71c55b` |
| lesson.template.json | `f4862ac35bf3e9d862de4946fab6a13275686ab3657f320115c7187882159659` |
| exercises.template.json | `bfa36060b343d17685111bc483d2e6d3da36ff189e2c7aa66dfde91f9320cffa` |
| figures.template.json | `02e4d0881790003183b068fbca6556a8dc195b322352859798e984d663af186c` |
| author-handoff.json | `1b83ba6b37df99d6a1513cda25e845ae70b9d06016c3322ecfa0d5c4190044bb` |
| modern-text-author-c4-s3t1-s4.md | `79cbe3d51133369ac2d743c0e8a72fbe5843b29b2c2cc00d47eff34bcfc0b78e` |
| .claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json | `f03840602a5de0c22b7eea096fe24db758c6d66b6532c75cda26c6766a1573f1` |

所有候选 SHA 与 handoff 一致；两个 `source.data` 与实际批准 raw 结构相同，`source.sha256` 与实际 raw 字节一致。逐块 `source_text`、块顺序、kind/id/label/printed_page/source_refs 均保留。课号与 section/number 仍为 null；补充阅读身份、标题、印刷标题、起始物理页124/印刷页113及图引用均不漂移。

## 完整计数与逐块语义

批准 raw 与候选均有16个结构块：10p + 3fig + 3cap；原题0/现代题0，未把脚注或阅读内容变造为习题。经真实 normalizer 后为12个正文短段，含图与图注的完整 flow 为18项。以下 `prose[]` 索引为零基，涵盖全部16块。

| prose[] / 源绑定 | 独立对照结论 |
|---|---|
| 0 / p0124#8 | 利用气体传递压强制造气动机械与工具的原目的完整；原跨行 `**气****动机械**` 合为连续加粗，未改知识点；脚注数学标记保留。 |
| 1 / p0124#9 | 铆钉枪和风镐两种压缩空气工具都保留。新增“图104展示风镐外形”与实图相符，未把图中单一风镐说成两件工具。 |
| 2 / p0124#10 | 脚注“气动机械: 用压缩空气工作的机器”完整，只有现代标点变化；原标记在正文及脚注各保留一次。 |
| 3 / p0124#11,p0125#5 | 管1输入、滑阀2、缸上/下部轮流受压、活塞3往复、镐尖4反复撞击、泥土/煤层破碎脱落全部保留。原撞击进入土/煤层并打下碎块的叙述压缩为撞击破碎/脱落，未换成气流直接吹落或只单向推动。没有添加频率、尺寸或阀门时序。 |
| 4 / p0125#1 | fig-104 的图块、标签、页与源引用保留。 |
| 5 / p0125#2 | fig-105 的图块、标签、页与源引用保留。 |
| 6 / p0125#3 | 图104图注保留。 |
| 7 / p0125#4 | 图105图注保留。 |
| 8 / p0125#6 | 喷沙机的含沙强气流和清理器壁表面用途保留；不是无沙气流或喷漆用途。 |
| 9 / p0125#7 | 墙壁喷漆、压缩空气喷出油漆保留。“现在还经常”改为“有些”，免作无来源的当代普及率声明，不删应用实例。 |
| 10 / p0125#8 | 火车、地铁列车、无轨电车三种车门开关应用都保留。新增非所有车辆同驱动方式的限制合理，没有移植当代品牌/车型。 |
| 11 / p0125#9 | 主气路1、压力缸4、贮气筒3充气，活塞两侧压强相等及制动块5不接触车轮6的未制动状态均保留。限定“一种简化结构”，未宣称所有现代列车通用，也未以压强相等推导任意活塞两边受力必相等。 |
| 12 / p0125#10,p0126#3 | 打开放气开关、主气路排气、缸右侧降压、阀门2阻止左侧和贮气筒放气、压差推动活塞向右、连杆将块抵住轮缘的完整因果链保留。将原“停车开关”按作用写为“放气开关”有 raw 过程及实图支持，不是电气开关或整体同时泄压。 |
| 13 / p0126#1 | fig-106 的图块、标签、页与源引用保留。 |
| 14 / p0126#2 | 图106图注保留。 |
| 15 / p0126#4 | 主气路重新充气、回位弹簧使制动块与车轮分离、解除制动保留；没有倒置为再充气制动。 |

全部数学签名逐块相同：脚注 `\text{\textcircled{1}}` 两处，图105的 `$1$/$2$/$3$/$4$`，图106充气段的 `$1$/$4$/$3$/$5$/$6$` 和过程段的 `$2$` 未漂移。全部非数学数字签名也相同，图号不是压力值。本课无应换算的测量单位或数值，未杜撰 N/Pa、尺度、测量结果；`numeric_changes`、`errata` 为空与本次实际改写相符。

脚注、定义强调及作用顺序完整。原文没有具体历史人物、机构、国家或日期身份需要声明；`historical_entities: []` 不构成漏列。未加入无来源现代实体；气动工具及三类车辆应用的身份未因文化转换被删除。实际候选文字没有 profile 禁词、禁用虚构人名或西里尔字母。

## 实际原图观察

以下 PNG 均用 `view_image` 完整实际打开，不是从 author inventory 猜图；路径为 `.tmp/ld-s10y-lesson/approved-through-130/artifacts/6p/figures/<id>.png`。

| 原图 | 实际观察及文字核对 | byte SHA-256 |
|---|---|---|
| fig-104 | 单一竖直风镐，顶部手柄、侧方接口、长机身、下方弹簧状结构及尖端；没有第二件铆钉枪或编号读数。候选保留两种工具实例但只把本图归于风镐，正确。 | `cc0edaa67f064741b9a089ebfce765af51ac2d199ab093a3936800488b4e2e83` |
| fig-105 | 单幅风镐剖面，左上管1、其下滑阀区2、缸内活塞3、下方尖端4；上下通道、箭头、下部弹簧与尖端均可见。编号/对象关系与候选逐项相符，图不是两个并排工作状态或压力计。 | `53068283514bb743c93dc3b45a32659f71d1dd34d418d3470f56c52730d38e40` |
| fig-106 | 下方主气路1连上方人物操作的排气口；左侧贮气筒3，经阀2连缸4左侧；缸右侧连主气路，内有活塞、弹簧和杆，右侧连杆/制动块5面对车轮6。完整左右关系支持原文的降右压、保左压和向右制动过程；不从静态 PNG 独立臆测阀门详细时序。 | `4c0567e85d871b6ab9bc0afe6ef5c95ea2f75ff028105785cc2d3fd9220e311d` |

这些观察仅支持文字语义与原图引用，不是新图的 source page/tool gate 或现代图批准。未来图作者仍须独立核对原图并忠实实现已冻结文本；不得添加未提供的压力大小、倍率或第二状态。

## 实际 prose_flow 边界

使用已有主工作区 Python 环境
`/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B`，
导入本工作树 `tools/edition.py`，对候选深拷贝调用 `normalize_lesson_layout`。先用 `prose_flow_contract(normalized.prose, [])` 获取无锚点 outline，再用候选原锚点调用同一合同，底层为 `prose_flow.mjs --stdin` / `htmlfrag.js`。不写归一化文件，不运行 author validator/finalize/renderer。

- normalizer 改变的文字块: `[]`。
- 真实正文 outline: 12段；来源 `prose[]` 顺序为 `[0,1,2,3,3,8,9,10,11,11,12,15]`。
- `resolvedBreaks: [3,5,8]`，均处于实际相邻段之间，各锚点匹配1次且严格递增。
- 零基索引 `[2] -> [3]`: 气动机械脚注定义结束，开始图105风镐机构。
- `[4] -> [5]`: 撞击破碎过程结束，开始其他气动应用。
- `[7] -> [8]`: 三种车门应用结束，开始图106简化制动器。

实际工具输出的完整锚点如下，与候选逐字相同:

```json
[
  {
    "index": 3,
    "before": "$\\text{\\textcircled{1}}$ 气动机械：用压缩空气工作的机器。",
    "after": "图 105 是风镐的结构示意图。\n压缩空气由风压管 $1$ 输入。\n名为滑阀的装置 $2$ 使压缩空气轮流进入压力缸的上部和下部，从两侧交替推动活塞 $3$，使活塞迅速往复运动，并带动镐尖 $4$ 反复撞击泥土或煤层。"
  },
  {
    "index": 5,
    "before": "镐尖的连续撞击使泥土或煤层破碎，一块块脱落。",
    "after": "**喷沙机**利用掺有沙子的强气流，清理器壁表面。"
  },
  {
    "index": 8,
    "before": "压缩空气也可以用于开关火车、地铁列车和无轨电车的车门。\n这是气动装置的一类应用，并不表示所有车辆的车门都采用同一种驱动方式。",
    "after": "图 106 展示一种火车车轮气压制动器的简化结构。\n在图示的未制动状态，主气路 $1$、制动压力缸 $4$ 和贮气筒 $3$ 中充有压缩空气。\n按这个简化模型，压力缸内活塞两边的气体压强相等，制动块 $5$ 不与车轮 $6$ 接触。"
  }
]
```

实际使用代码 SHA-256:
`edition.py b48f7beedb54635876f426526d8541925c956c0f84e298f77c3fe34c229f4b2c`;
`prose_flow.mjs f2a16357e2a0d5f8541b0cb401c5193c9cb10f6333dc16f92d5c7a18a5bee309`;
`htmlfrag.js c2f0301c5ba7811336a5268a404f795ace7873b75eb93c42c10186f3d9c3f9f6`。

## 结论与边界

完整16块/全部10个原正文块/脚注/0题均对照完成，未发现任务、数值、对象、编号、历史身份或概念边界的实质漂移。**本冻结候选 TEXT PASS**。

作者 handoff 的 first_failure 为 null，本轮也没有实质首 FAIL；不虚构拒绝或修复记录。工作树技能 `.venv` 不存在、系统 Python 缺 Pillow 曾阻止本地内存检查启动；复用既有主工作区环境后该检查实际 exit0，这不是作者稿的语义失败。没有安装依赖或改变工具。

只新增本独审报告及另一课独审报告；没有阅读答案/choice/其他求解者记录，没有修改 source/模板/图/代码，没有浏览器、网络、DB、Git、服务、render、finalize 或 promotion 动作。实际306/640图预览与整课发布不在本次文字审查范围。
