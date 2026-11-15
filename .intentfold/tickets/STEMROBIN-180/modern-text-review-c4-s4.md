# phy6-c4-s4 独立完整现代文字审查

- Ticket: STEMROBIN-180
- Reviewed: 2026-11-15
- Role: independent text reviewer; 作者为 Volta，本审查者未写候选文本。
- Result: **PASS (TEXT ONLY)**。
- First substantive failure: none。没有需修复的最小文字单位；不以作者结构 PASS 或与预期结果吻合替代实质审查。
- 本结论只适用于下述冻结字节，不是图107/108/109的现代批准、整课 ready 或 adapt-finalize/发布结论。

## 读取范围与冻结

工作区为 `/Users/yong/.codex/worktrees/0f12/lemmadeck`，以下路径均相对该工作区。

完整批准 raw:
`.tmp/ld-s10y-lesson/approved-through-130/artifacts/6p/lessons/phy6-c4-s4/{lesson.json,exercises.json}`。
持久源 `ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c4-s4/` 的这两个文件 SHA 也与批准 raw 相同；复用源页批准，没有重新审查源页像素或 corpus。

完整候选:
`.tmp/ld-s10y-lesson/text-author-c4-s3t1-s4/adapt/6p/modern-us-neutral/lessons/phy6-c4-s4/{lesson.template.json,exercises.template.json,figures.template.json,author-handoff.json}`。
另读作者冻结报告 `.intentfold/tickets/STEMROBIN-180/modern-text-author-c4-s3t1-s4.md`，仅用于定位/冻结，不视为独审证据。

| 文件 | 实际 byte SHA-256 |
|---|---|
| raw lesson.json | `45e735c94584123ef04122138bc4cc38c1a1c681c8576f6f8f78ea34e05362d8` |
| raw exercises.json | `b45358a8fd658bf562ed20661ce79abb9e3d1602fd59ec8be50405584191d583` |
| lesson.template.json | `59a370c5d16366da8d9fb81a3a9026465fb21ef96e5055d3beea79055e320d50` |
| exercises.template.json | `0854a8cdb9386e92aada2c80319f57a0f853a5c3b8d83759957a66c28de6de84` |
| figures.template.json | `c8db622ccfaf36672eabe4d213ac48515041771577e5252633b5c55ef36600f6` |
| author-handoff.json | `720f963895efaef57bc03ba4a5dffdec02c80086f1c0301a70508bc0b5b3c6ac` |
| modern-text-author-c4-s3t1-s4.md | `79cbe3d51133369ac2d743c0e8a72fbe5843b29b2c2cc00d47eff34bcfc0b78e` |
| .claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json | `f03840602a5de0c22b7eea096fe24db758c6d66b6532c75cda26c6766a1573f1` |

实际哈希与 handoff 全部一致；`source.data` 与实际批准 raw 结构相同，`source.sha256` 对应 raw 字节。逐块 `source_text` 与 raw 相同，所有非文字来源字段、块顺序、图引用及练习身份保留。number `"51"`、标题/printed_title、起始物理页126/印刷页115和正文 §14 引用保留；没有改成另一课号或另造问题。

## 全部正文块

批准 raw 与候选均6个结构块: 4p + 1fig + 1cap。真实归一化后的正文为4段，含图与图注的完整 flow 为6项。以下 `prose[]` 为零基，涵盖全部6块。

| prose[] / 源绑定 | 独立语义对照 |
|---|---|
| 0 / p0126#6 | 原“**不与容器壁接触的液体表面叫做液体的自由表面**”定义和整句强调完整保留；新增与气体相接的讨论范围，不把液液界面也算作本课自由表面，不以另一种定义替换原句。 |
| 1 / p0126#7 | 液体受重力、由高向低流动、最终达到宏观静止平衡并在同一高度形成水平面的因果链保留。将原“所有表面分子同高”改为忽略微小起伏的宏观表述，避免否认热运动；明确静止宽敞容器、上方气压近似相同和忽略壁边弯曲，未宣称旋转/加速容器、波动表面或不均匀外压下也水平。 |
| 2 / p0126#8 | 水平面概念、水平仪名称和强调、图107引用完整；“沿水平方向延伸”与原沿水平方向的平面一致。没有加入操作答案、读数或校准数据。 |
| 3 / p0126#9 | fig-107图块、图号、页、源绑定保留。 |
| 4 / p0126#10 | 图107图注保留。 |
| 5 / p0127#1 | 气体没有液体式自由表面、与液体相比的分子间距、较弱吸引、各方向运动及占满可占体积的完整说明保留；§14未丢失，结论整句加粗保留。“通常情况下”合理约束简化分子模型，未换成只向上运动、分子绝对无相互作用或气体有固定体积。 |

“静止”限制的是容器与宏观平衡，不是每个分子停止运动。说明有明确适用条件，未删除原重力机制或把普通液面水平变成所有自由表面必须精确平坦。

本课无测量数据/计算公式/需要换算的单位；各块与题目的数学签名、非数学数字签名逐项相同。图号107/108/109、练习原编号和 §14 都未漂移；没有从示意图构造长度、角度、仪器精度或球速。`numeric_changes` 与 `errata` 为空合理。没有历史人物/机构/国家/日期身份可漏列，`historical_entities: []` 有实际 raw 支持；未加入现代品牌或数据。候选无 profile 禁词、禁用虚构人名或西里尔字母。

## 全部7道原题

原题7/候选7，顺序严格为 `1,2,3,4,g2-1,g2-2,g2-3`；g1“问题”4题，g2“作业”3题。`number/source_number/group/group_id/pages/figure_refs/figures` 逐题相同；题目 `lines` 与当前完整 `text.splitlines()` 相同，没有隐去续句或把作业图变成正文图。原题均为单项完整任务，没有遗漏编号子问。

| 题目 / 源绑定 | 独立全任务与条件判断 |
|---|---|
| 1 / g1 / p0127#3 | 自由表面定义提问原字不变，不提供另造答句；完整任务保留。 |
| 2 / g1 / p0127#4 | 保留解释“宽敞容器液面水平”的说理要求。新增静止容器、液体静止平衡、近似相同上方气压和忽略壁边弯曲，避免原“总是”的过宽断言。条件虽使题干变长，仍须解释重力/平衡关系，不是只点选已给词语或删除原解释任务。 |
| 3 / g1 / p0127#5 | 检验平面是否水平的仪器名称提问原字不变。没有改成报读数或依赖不存在的单位。 |
| 4 / g1 / p0127#6 | 保留解释气体为何没有液体式自由表面的任务；“通常情况下”与正文一致，不放宽为任意物态/环境。 |
| g2-1 / g2 / p0127#8 | 铅垂线与三角板、实际检查液面、亲自画实验示意图三部分都保留。“重垂线”改为同一器具的现代常见名称并说明悬重细线，非更换设备；加静止平衡条件，未给摆放步骤/示意图答案或测量结果。 |
| g2-2 / g2 / p0127#9 | 厚纸或硬纸板两种材料、照图108自己制作水平仪、检查窗台/桌面/地板三个对象全部保留。没有删制作能力、换成成品仪器或只检查其中一个对象；没有假造尺寸和刻度。`figure_refs:["fig-108"]` 及原图号保持。 |
| g2-3 / g2 / p0127#14 | 水平仪、小木楔、胶合板或一小块木板、调水平、图109、放滚珠并观察全部保留。新增平整板面/无明显振动/原先静止/轻放是合理实验条件。原题已给“水平则不滚”的预期说明，现代末句将其限定为理想情况下不因倾斜自行滚动，不是从答案键新增实验结果。没有反推“球不动必水平”，也没有用观察描述冒充已实际完成实验。 |

实际制作、操作、画图和观察任务仍是学生任务，未改为 auto 或取消实际验证。g2-3的条件说明不能代替真实调平与观察；“不动”不构成水平的充分检验，微小倾斜、阻力、板面缺陷等仍可能限制实验判断。候选没有错误宣称充分性，因此不需为了这个已保留的边界修改稿件。

## 原图实际像素观察

以下 PNG 均用 `view_image` 完整实际打开，非采用作者 inventory 作为视觉证明；路径为 `.tmp/ld-s10y-lesson/approved-through-130/artifacts/6p/figures/<id>.png`。

| 原图 | 亲自观察及与文字的关系 | byte SHA-256 |
|---|---|---|
| fig-107 | 同号图左侧为弯曲管/气泡区域的局部示意，右侧为长条水平仪及完整支承板；有顶面窗口/小圆形部件和下侧弯曲轮廓。无数值刻度，不据窗口图形猜精度。正文只以图107引出水平仪名称，与源相符，未拆成两个新图号。 | `a68bc9ccec96a4a489e94d4f92484010eb8468bafb9000d3ab34c39239ce5d0a` |
| fig-108 | 纸制三角形仪器，完整折面/底边、顶部悬垂线及下方重物；没有标尺寸或角度刻度。支持厚纸/硬纸板照图制作的任务，候选未据透视猜长度或补测量数据。 | `17dae0c54faaee65a316f5e84b5619fb2aec1042309ed645a6e03856fd306359` |
| fig-109 | 完整长板与下沿木纹，板边四处支承/木楔轮廓、左侧滚珠、右侧长条水平仪、下方三角形水平仪/悬垂部件。候选板材、楔子、仪器和滚珠实验对应此布局；原图无球轨迹/速度或数值读数，未从静态透视冒称精确水平或实际观察结果。 | `d571377564117c161d5ed714ad5434314ca6d955cdf16bfa3c5418f0ba28ea61` |

图108/109分别属于作业g2-2/g2-3，虽没有正文 fig 块仍在 lesson 图清单、题目图引用及 figures.template 中保留。原图读取仅用于本次文字语义关系核对，不是现代图或源页的重复批准。

## 实际 prose_flow 边界

使用已有环境
`/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B`，
导入本工作树 `tools/edition.py`，深拷贝候选后实际调用 `normalize_lesson_layout`。
先清空锚点调用 `prose_flow_contract(normalized.prose, [])` 获取 outline，再用候选锚点解析；底层调用现有 `prose_flow.mjs --stdin` / `htmlfrag.js`。没有写归一化文件、运行 author validator/finalize/renderer。

- normalizer 改变的文字块: `[]`。
- 真实正文 outline: 4段；来源 `prose[]` 顺序 `[0,1,2,5]`。
- `resolvedBreaks:[3]`；唯一锚点匹配1次。
- 零基 `[2] -> [3]`，即第3/第4正文段间: 水平面/水平仪说明结束，转入气体为何没有液体式自由表面。fig107与图注保留在完整 flow 的原位置，不冒充正文段。

实际完整输出边界，与候选逐字相同:

```json
{
  "index": 3,
  "before": "**水平面就是沿水平方向延伸的平面**。\n用来检验平面是否水平的仪器叫做**水平仪**（图 107）。",
  "after": "通常情况下，气体不像液体那样具有自由表面。\n气体分子之间的距离通常比液体分子之间的距离大得多（§14），分子间的相互吸引作用较弱。\n气体分子可以向各个方向运动，所以**气体就要占满它所能占有的全部体积**。"
}
```

实际使用代码 SHA-256:
`edition.py b48f7beedb54635876f426526d8541925c956c0f84e298f77c3fe34c229f4b2c`;
`prose_flow.mjs f2a16357e2a0d5f8541b0cb401c5193c9cb10f6333dc16f92d5c7a18a5bee309`;
`htmlfrag.js c2f0301c5ba7811336a5268a404f795ace7873b75eb93c42c10186f3d9c3f9f6`。

## 结论与约束

全部6块正文结构、4原正文块、全部7道原题及其制作/画图/观察子任务一次完整对照完成。适用条件澄清合理；没有实质概念、题量、数字、原图引用或实验能力遗漏。**本冻结候选 TEXT PASS**，不构成整课/现代图 approval。

作者 handoff 的 first_failure 为 null，本轮未出现实质首 FAIL，不虚构修复记录。工作树技能环境缺失/系统 Python 缺 Pillow 的执行前环境问题已通过复用已有主工作区环境解决；实际内存合同检查 exit0，未安装依赖，也未把环境启动失败算作作者稿失败。

只新增本报告及另一课独审报告，作者候选/raw/图/代码未改。不读答案、choices 或其他求解者记录；不浏览器、不网络、不 DB/Git/服务，不 source assembly/page re-audit，不 finalize/binding/promotion，也不生成或渲染图。未来图作者须另行完成现代图 gate；本次没有视觉断言现代306/640布局已通过。
