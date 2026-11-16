# phy6-c5-s5 现代TEXT作者冻结

2026-11-16；STEMROBIN-180；§72《杠杆在工程技术及日常生活中的应用》。**COMPLETE 作者冻结，待主完整独立TEXT审查**。仅作者文字及模板，不是自审批、现代图批准或完整课批准。

## 精确路径与哈希

作者root：`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c5-s5`

candidate：`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c5-s5/adapt/6p/modern-us-neutral/lessons/phy6-c5-s5`

| 相对作者root文件 | 字节 | SHA-256 |
| --- | ---: | --- |
| `adapt/6p/modern-us-neutral/lessons/phy6-c5-s5/lesson.template.json` | 12888 | `2bc1e7081cae85ab4d084c32090b17caad1d774f235273f78ab7ed8937137bb1` |
| `adapt/6p/modern-us-neutral/lessons/phy6-c5-s5/exercises.template.json` | 14545 | `4ddce2a29a7da24ea54582f1a0d4447910b450b46c87b01803af2afec92a68e4` |
| `adapt/6p/modern-us-neutral/lessons/phy6-c5-s5/figures.template.json` | 3588 | `7a04e222cacad700a231266065285aa8565de546288654bd1e634f210069a613` |
| `author-handoff.json` | 9672 | `e9e7503e44affa0d55f6753ea7a145fb98b784aa1d3ef0e43e878492aad0b6c6` |
| `frozen-manifest.json` | 19142 | `988e043cd67db0ae8d0f7b2dad35b575590f9d149425819c2e640a1d6a988eb8` |
| `author-context.json` | 47628 | `4fccb61ae56a1596ebb5d3c2ac3cc4e2a7768da1f9a85cbb0f1851bf3014f4b9` |
| `author-context.md` | 3311 | `8a53dd400fae76eae452c1c97011c67e1f2b171b9de9055f3949e447c0edaa94` |
| `input-bindings.json` | 10082 | `3c5d4d85ff8c29be5c93019485b83713106e0ff52e2f097bef0f3065835fcc9b` |
| `author-notes.json` | 6342 | `f98c0b1eda8300febea641299401ee644a3813c811903e46cdbc756afdd844b0` |
| `text-only-mechanics.json` | 22003 | `e16b71f6d0395d9252500a648dd19d838048e994e9b53f1c9109d39aeb941552` |
| `call-ledger.json` | 1856 | `165a698c4e1c99a116e8569bb5cc2c31abf55cbf552ed41d31d5548d77b3f2cd` |

manifest覆盖34个当时存在的作者文件。它不自哈希，不循环绑定handoff，也不绑定尚在执行的freeze调用输出；上表另外绑定manifest/handoff，下面另外绑定freeze三份证据，完整覆盖当前scratch39文件。本工单报告是额外1文件。所有字节SHA为实际文件，不是从文本重算或猜测。

## 输入与隔离

主代理的官方adapt-prepare一次exit0按明确通知复用，作者重跑0次。默认目录：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/adapt/6p/modern-us-neutral/lessons/phy6-c5-s5`

三个默认模板分别SHA：

- lesson：`891648e46b648541ec96d0ace4d10ce1d61c2fe72d82dbade265d011d6b84ef6`
- exercises：`d1523b65240a1471d3b009fa4cd3d05723e31e18e354e295531d9a36b8a3e45d`
- figures：`7a04e222cacad700a231266065285aa8565de546288654bd1e634f210069a613`

使用`cp -n`复制到独立candidate及prepared-snapshot；没有编辑默认模板。完整读取canonical raw的lesson.json/lesson.md/exercises.json，并保留raw-snapshot：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c5-s5`

| raw文件 | 字节 | SHA-256 |
| --- | ---: | --- |
| lesson.json | 4239 | `3c74dad2bea8142585fae23000379e98f00415c2758c5f03dcc3a94a2047ed11` |
| lesson.md | 1612 | `6b4d64ef89a05377a5874cb8c94db3a2f5c86a4653ec32f782720d4ab323b4a4` |
| exercises.json | 5563 | `1cd4f5b666eb07f54be332fee57a10cb325318065d362fa661c119f58c22e013` |

全raw11块（5正文、3图、3图题）、8题、7图。原题组身份：问题g1两题；练习37 g2四题；作业g3两题。稳定number为`1,2,g2-1,g2-2,3,4,g3-1,g3-2`，印刷source_number、group_id、pages、figure_refs、唯一展示归属全未改。嵌入完整source.data/source_text、原数学字节、原数字序列及已准备errata空数组未改。原图模板完全未改。

已读lesson SKILL、edition-text-contract、modern-us-neutral profile和生产文本API；复用已批准源事实，不重新全文审原页、不重跑source/assemble。未读main私有解、任何其他答案/keys/choices；也没有重读先前c5-s3源解freeze。

## 原图实际观察

下面每张原PNG完整实际打开一次，原目录：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/figures`

| PNG | 实际尺寸 | SHA-256 | 本次观察与保留 |
| --- | --- | --- | --- |
| fig-182.png | 362x205 | `d3b36b8d44179216475330e5c26d06e8879df4f0361685e667b449d257038f15` | 剪刀两半、共同轴、手、材料接触和F_1/F_2；不添力臂读数。 |
| fig-183.png | 325x155 | `6276ef5c0d1598304385e50d431a94e86c7298bab25ab6d1bca7aa7856c5f949` | 短剪切部分、长双柄与联结区，保留源文金属剪工具身份。 |
| fig-184.png | 331x168 | `b9944c7ab5a616400db42a800288bc5f53f731d4fdbc1e3a8d16f4972f741d66` | 短钳口、连接处、长双柄，保留剪线钳用途。 |
| fig-185.png | 1136x606 | `033ad2d7f7e28cee362bb9a9b265262db2da023d84e5c0118bf2462126ea530c` | 上排4、下排5，共九子图；完整保留车轮、横柄装置、托物前臂、含A/B/F的机构、两种肩挑负载、可升桥板、背负物人物、手提容器人物。 |
| fig-186.png | 646x239 | `6d017350546c4e01721177487fbf8c4b9bf66affb74c07db16e8a64fcf474f95` | 船、握桨者、船侧、伸向水面的桨；不提前指认解题支点。 |
| fig-187.png | 700x216 | `2c8ed9ad56da09566279ba213cae403194ff64c14109121afabcdb56f4f6fd2e` | O支承、A处阀杆及上箭头、下方剖面通道、B端挂物及下箭头、末段凹口；图未印力臂长度。 |
| fig-188.png | 544x429 | `49381c07a48a38947557bc93cebca6469fd9d244c23a1de8d33eafaa5c9f1c81` | 履带、吊物、右侧平衡块、下方杠杆支点，支点左7.2米/右3米及端部下向力。 |

原PNG逐字节副本在originals/，完整清单/尺寸/源SVG provenance哈希在input-bindings。源SVG只用于文件绑定，不代替PNG实际观察。图185原г的具体器件名称未据形状猜测；保留所有现有构件和A/B/F，后续图作者需自行观察，不能用此未命名观察删减原图。

## 全部改写及语义边界

五个正文p块和八题均有逐项理由，见author-notes.json；非p块身份/文字不变。

- p0194#12：明确本节是“利用杠杆省力”的工具，不泛称所有类型的省力工具都是杠杆。源内杠杆平衡规律保留，声明为source-bound scope clarification。
- p0194#13/p0194#16/p0195#1：规范剪刀两半共同转动轴、动力F_1和材料阻力F_2，完整保留纸剪长刃便于整齐、金属剪长柄增大动力臂、剪线钳口相对柄长特别短；不添新公式或数值。
- p0195#6/#7：脚蹬子写成脚踏板；自行车手闸、汽车/拖拉机刹车踏板、打字机按键、钢琴琴键、台虎钳紧固手柄、钻床送进手柄全部保留，没有用现代新设备替换原科学技术例子。
- p0196#10：安全阀的超压排汽知识保留；圆圈1仍为题面安全阀引用和本脚注的对应，不是物理变量或另一个条件。
- 问题g1两题：仍要求列举三类场景中的杠杆实例、解释剪刀/剪线钳省力；没有给源题答案。
- g2-1：全部九子图按原`а,б,в,г,д,е,ж,з,и`映射现代`a,b,c,d,e,f,g,h,i`；挑物原`д/е`对应现代`e/f`。仍要逐图找支点/力臂并回答肩部压力位置及理由，未拆造新题。
- g2-2：仍把船桨看作杠杆解释作用原理，未指定待求支点。
- g2印刷3：保留187、圆圈脚注、P待求重量、12标准大气压、S=3厘米^2、不计阀/杠杆重量、由图量力臂。未把原汽压自行确定成表压/绝对压，未加g、测量读数或计算答案。
- g2印刷4：保留188、1000千克平衡块及计算可吊多重的原任务。7.2米/3米只保留为原图权威数据，没有替量臂题添现成数值或补导出负载。
- 作业g3两题：构造研究、找转动轴/动力臂/阻力臂、计算增益，以及家用绞肉机/缝纫机/罐头刀/钳子观察和识别支点/作用点/力臂，全部完整保留。没有预填个人数据、换成新题或宣称儿童操作安全。

numeric_changes全空，math-correction全无；源内没有待文化替换的真实人名/国家/机构，historical_entities全空，没有构造例外。所有源技术内容保留。发布文字西里尔0；西里尔原文仅在完整source快照中留存。

## 实际prose_flow边界

官方normalizer运行一次后，通过实际`prose_flow.mjs`输出复制相邻before/after文本对象，未手算prose块索引。发布流8段，最终解析锚点`[5,7]`：

1. “剪断铁丝用的剪线钳（图184），钳口到转动轴线的距离相对于柄长特别短。”之后，进入“许多机器里都有不同类型的杠杆。…”。
2. “在学校车间里，也能找到杠杆的应用。…钻床的送进手柄等都是杠杆。”之后，进入原圆圈1安全阀说明。

完整锚点对象与最终相邻段落在handoff和text-only-mechanics.proseFlow中冻结。只在现代层分行、短段落、规范句式/标点与接续印刷强调，不改变source段落和数学字节。

## 精确命令、退出与证据

cwd均为`/Users/yong/.codex/worktrees/0f12/lemmadeck`。未重新运行官方adapt-prepare，未adapt-finalize。五个`cp -n`命令分别复制candidate三模板、prepared三模板、raw三文件、七个原PNG和既有run-recorded.py，各exit0。目录创建exit0；manual文字只用apply_patch。

下面是实际执行的四条记录化命令，每条只执行一次。R仅为命令展示变量，记录文件保存完整实际argv与cwd：

```bash
P=/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python
R=.tmp/ld-s10y-lesson/text-author-c5-s5/run-recorded.py
A=.tmp/ld-s10y-lesson/text-author-c5-s5/text-author.py
C=.tmp/ld-s10y-lesson/text-author-c5-s5/adapt/6p/modern-us-neutral/lessons/phy6-c5-s5/lesson.template.json
env PYTHONDONTWRITEBYTECODE=1 "$P" -B "$R" normalize-1 "$P" -B "$A" normalize
env PYTHONDONTWRITEBYTECODE=1 "$P" -B "$R" prose-flow-1 node .claude/skills/ld-s10y-lesson/tools/prose_flow.mjs "$C"
env PYTHONDONTWRITEBYTECODE=1 "$P" -B "$R" text-mechanics-1 "$P" -B "$A" check
env PYTHONDONTWRITEBYTECODE=1 "$P" -B "$R" freeze-1 "$P" -B "$A" freeze
```

| stage | exit | call.json SHA-256 |
| --- | ---: | --- |
| normalize-1 | 0 | `181fcad19eab037cee1ec3482f8d4d0bd014ae5a11f9ba4f1bf1ea1aecf7f904` |
| prose-flow-1 | 0 | `f0dd3995b8b6e949c005f6429addef07b9a1bc24da394c11f0213a1732cea379` |
| text-mechanics-1 | 0 | `31a9a91d9e477d1729801e7eb256fee729144d2c61d164a4892cad656ea2a899` |
| freeze-1 | 0 | `ff5d98153a834b17de97768aba4d560ab04278e21a3435d4b6d3696f5dfd0569` |

路径均为作者root的`evidence/{stage}.call.json`；每条call另绑定其stdout/stderr，全部保留。freeze输出在manifest之外，另精确绑定：

- `evidence/freeze-1.stdout`：1578字节，SHA `349b96588a38058973ed72892e7e56f1b67c72082dcb01eab03aba9c131b15a2`。
- `evidence/freeze-1.stderr`：0字节，SHA `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`。
- `evidence/freeze-1.call.json`：SHA如表。

完整TEXTmechanics首跑PASS，exit0：11源块/11现代块，8源题/8现代题，7原图模板，19逐项检查单位，8发布段落，2锚点，7公式片段。复用生产validate_source、validate_identity_fields、validate_text、公式分隔/KaTeX、numbered_subparts、normalize、figure-reference及prose_flow解析API；没有调用现代图gate或正式finalize。完整嵌入快照、逐项source_text、题号/分组/页面/图归属、原数学字节、全部数字序列、强调和实际flow均在报告绑定。

机械错误0，首次FAIL不存在，修复0/1。保留两条非致命KaTeX提示：lesson.prose[10]与exercises[4]的源`textcircled`均得到`mathVsTextAccents: LaTeX's accent \textcircled works only in text mode`，解析`ok=true`。源圈号仍正常对应引用/脚注；没有为抹除提示改数学、静默回退或增设勘误。独立TEXT reviewer应看此明确边界。

一次只读文件发现错误单独保留在call-ledger：读取可复用runner的旧猜测路径`text-author-c4-s19/run-author.py`不存在，sed exit1；随后只读rg找到实际run-recorded.py。此时没有候选写入或机械执行，不冒充生产FAIL，也不计为内容修复。

## 工具epoch

已实际读取主代理修过的katex_check.js第14行`process.stdin.setEncoding("utf8")`。此前旧工具hash没有由本作者捕获，记录为null而不是捏造；主已完成的UTF-8修复测试未重复。本作者稳定工具改动0。

完整TEXTmechanics调用开始和结束以下SHA相同，两组实际绑定均在报告/交接中保留：

| 工具 | SHA-256 |
| --- | --- |
| edition.py | `4c15c8aba51f65eb5ee3bf3cdeecf9691777b221bd120b590aba7e448f64cf19` |
| mathcheck.py | `8f703e723234c3ccc4d9b329d8e2f7b0053d0af261d0526169c31110a53fa8f7` |
| htmlfrag.js | `c2f0301c5ba7811336a5268a404f795ace7873b75eb93c42c10186f3d9c3f9f6` |
| prose_flow.mjs | `f2a16357e2a0d5f8541b0cb401c5193c9cb10f6333dc16f92d5c7a18a5bee309` |
| katex_check.js | `b5e082a863b785bf037a3fbf7b27f92221342359d313be144a27fc6ed98df35e` |
| modern-us-neutral profile | `f03840602a5de0c22b7eea096fe24db758c6d66b6532c75cda26c6766a1573f1` |
| edition-text-contract.md | `8deecbc68434e57b30ed8717dc22170a1988a0856af200a1875da58a3334bf90` |

作者scratch dispatcher SHA `77872d9a2441297edffa15ca10b170d6dad3c21b51a43eae669c750a6ddda656`，同样记录开始/结束实际字节；它只是复用现有生产文本API的隔离调度，没有稳定tool/schema/app修改。

## 未完成边界

立即停止，不改freeze。完整独立TEXT审查交主；七现代图只能在主fullTEXT PASS后另行授权制作，现在零现代图创建/检查/批准/晋升，未认证任何测量比例。

官方finalize0，promotion0，answers/choices读写0，main私有解读取0，源审复跑0，DB0，Git0，服务0，浏览器0，安装0，环境文件改动0，durable/app/schema/stable-tool写入0。工具进程全部结束。主独审与现代图批准后由主执行正式retain/finalize，本作者不自批准。
