# N55 两项文字修复限定补核

日期：2026-11-23。
唯一根：`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187`。
课：`math4-c2-s1-n55`，55《小数的数位》。

## 范围与证据保留

按最新直接授权，本次只检查0206三处数位强调的恢复及929/933现代人名改写记录的补齐，不重新转写源、不重做数学、不读作者解、答案或键，不读其他课。新增图片0；完成本补核时累计仍 **16/24**。212/213既有限定PASS直接复用，214上一REVISE保留，本文件不审图214修稿。

用户报告已经重装订、`adapt-prepare --force` 后重跑modernize。本审核查其实际保存结果，不重跑这些命令或normalizer，不运行课程checker，也不宣称验证这些生产命令的执行过程。

旧 `independent-comparison.md` 保持原字节，SHA-256仍为 `21e82e513fd2ca54e95fddb938c7d6247d1ce542b865c1802a40e34204fff510`。旧报告是旧候选的历史比较；以下仅对两项修复给出当前结果，不覆盖旧发现或扩张为重新通过整课。两份FIRST不改。

## 当前相关文件绑定

完整路径为上述唯一根加表中相对路径。

| 文件 | 当前SHA-256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/pages/0206/page.md` | `f0f56a0b07cb5ca1a0d5d0e0a5d032ad58f491c517b2f1ad545463556d57b37a` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/pages/0206/page.json` | `9239c1909b8a39490fbc5d6f55285f3dbee381d3c627781022a7dfe711657776` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/lessons/math4-c2-s1-n55/lesson.json` | `6cab76fbd6848ddb0de1698f0078c0eeea0c8c91d56873d1a1fd069a94c37fe5` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/lessons/math4-c2-s1-n55/exercises.json` | `87be0451579e95373408e623da45680d94a83e63d35f936dacbbfdbd2bb7871e` |
| `.tmp/ld-s10y-lesson/adapt/4m/modern-us-neutral/lessons/math4-c2-s1-n55/lesson.template.json` | `ac480da9da87b891ed6ff1af1c4713483ab686fd43563ac6d8002d7556aac15b` |
| `.tmp/ld-s10y-lesson/adapt/4m/modern-us-neutral/lessons/math4-c2-s1-n55/exercises.template.json` | `cc0ab943a9e981a11e78d81edbd52b55d12ea0b37242bd61eaa67385e2183f54` |

两模板的 `source.path/sha256` 分别绑定当前本课原lesson/exercises JSON，路径与实际hash匹配。原exercises JSON的hash没有变化；原lesson和两现代模板是本次修复后的新字节。本绑定只覆盖上述相关文件，不重复采集其他课或图的hash。

## 修复一：三处数位强调

**限定PASS：三处强调已实际传播到页稿、结构化页、原课装订及当前模板。**

- `pages/0206/page.md` 第49–50行分别保留 `**十分位**`、`**百分位**`、`**千分位**`。
- `pages/0206/page.json` 对应正文的 `lines` 同样包含三处双星号强调；没有只改Markdown而漏结构化页。
- 原课 `lesson.json` 的 `source_refs:["p0206#2"]` 正文中，第一/第二/第三位对应的三个数位名称均带相同强调。
- 当前 `lesson.template.json` 对应正文的 `source_text` 与当前原课该段完全相等；现代 `text` 仍保留三处强调，只按既有layout分句换行，`changes:["layout"]`、`numeric_changes:[]`。

旧比较记录“FIRST有强调，原课/现代没有”的差异，在本次上述hash候选上已修复。本审确认保存的Markdown强调标记，不进行APP显示或浏览器加粗效果验收，不重开0206源图。

## 修复二：929/933人名改写记录

**限定PASS：两题当前均准确记录 `changes:["names"]`。**

| 题 | 当前记录 | 受影响内容的核查结果 |
| --- | --- | --- |
| 929 | `changes:["names"]`，`numeric_changes:[]` | 现代text等于原text仅按科里雅→Alex、别佳→Ben、任尼亚→Casey、谢尼亚→Drew的全处替换；现代source_text等于当前原题text。 |
| 933 | `changes:["names"]`，`numeric_changes:[]` | 现代text等于原text仅将两处别佳替换为Ben；现代source_text等于当前原题text。 |

两题现代 `lines` 均恰为包含完整当前 `text` 的单行数组。对两题作严格字符串比较确认没有同时改数、单位、比较关系或题干其他字句；这不是重新求解。37.7/42.5/39.2/40.8与933数量相等、308脚仍属于原题文字，不因补元数据而变。

旧比较中两题“实际改人名而changes为空”的修订要求，在本次上述模板hash上已完成。没有修改模板或重复运行normalize。

## 收束

本次两项affected-only文字修复均限定PASS，未发现这两项仍有遗漏。旧报告、FIRST、上一图214 REVISE及212/213限定PASS保留；不替代其他原比较差异的历史记录，不批准wholeLesson，不写review@1。只写本补充文件；未读env/DB、其他课、答案或键，未执行安装、paid、APP、commit/push或其他聊天。
