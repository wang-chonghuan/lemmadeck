# S18 Key Comparison 独立键比较

日期：2026-11-15。审者：Codex，独立choice审者，非本题作者会话。
**语义结论 PASS；带review机械验证一次，退出0。**

## 阶段隔离与冻结证据

两seed源解先完成，纯view再盲审；main明确授权后，才读取当前
draft.json、author-solution.md、author-notes.md。
此前已完成s21 source-first并冻结，再开始本次s18作者内部比较；
未读s21 draft/view/作者源解或键，未跨题回写任何源解。
没有读取标准答案、Sagan答案解或既有choice。

当前draft投影出的id/source_numbers/view与冻结view.json逐字段相等。
source-first.md及view-first.md均保留原字节；不是看作者键后重做盲解。

| 文件 | 字节SHA-256 |
| --- | --- |
| seed.json | ad5878233191ebd8c91efccf8a01dfbcd15251a2052611e2c40e506f38e53b59 |
| draft.json | 526a05cd05267a8248f3e93dcb2aba6064a7c0917d0b318dab5ecee941e02f69 |
| view.json | 87b2a7e10665d1a23d388981ae57d51f624da894ef8540d6d7c0136fc7740bd8 |
| source-first.md | c867fe38b49a96de545f42968ba96dcd5c5e1e1e2fc93617668b40d912c14437 |
| view-first.md | 50e0f022c3c7c5eae7e9e116c33a8faed24fc72a326f876419189a8d3e7aac02 |
| author-solution.md | 3fbc5587a936cf803d60607ae7a4aa3889d356ff814ece7b6ab191eda1704e71 |
| author-notes.md | 8bb20d935807114dfd9a87bbf1d5b7b9f5b8c9c4225a48e8577abf5f29b17a0a |

review使用contract canonical digest，不用文件字节hash代替：

- seed：`02349ec3f81f87389df7221ec002c6634a9a2b015d6ad0febd107da02f29772c`
- draft：`513eedd6fca204645906e8fce9d507401b12a923304e551f17172760676a7b57`

s21冻结source-first字节hash：
`3ca3cf2cf863927ee38a77d3a02da1b6fb5af5c545f281ec5570b75562045444`。
本次只核其冻结hash，不读取s21作者内部材料。

## 源解与完整键

作者两道源解与先行独立源解一致：重量是物体因地球吸引对
支承物或悬挂物施加的力；重力由地球作用于物体本身。
二者施力者和受力对象不同。作者没有把重量改成质量、支持力
或重力别名，也没有增补质量、g、数值计算或普遍相等性证明。
作者源解文件的“先于选项”是作者所述顺序，不替代本审者
source-first及view-first的独立顺序证据。

冻结盲审true set为`{A,C,E}`，false set为`{B,D}`；
当前作者key及全部五项truth与之完全一致。

| 项 | 盲审/作者truth | derivation及misconception比较 |
| --- | --- | --- |
| A | correct/correct | 地球施力、物体受力、重力竖直向下三项成立。作者推导依照重力定义和实际竖直悬挂情境，不依赖图内不存在的力箭头或数值。正确项misconception为null。 |
| B | incorrect/incorrect | 悬挂物对物体向上的承载力确实存在，但不是物体对悬挂物的重量。作者错误路径从物体上的向下重力/向上拉力出发，把后者命名为重量，恰好生成本项倒置施受对象且向上的陈述；不是任意编造错误，也不会在当前定义下意外为真。 |
| C | correct/correct | 物体施力、悬挂物受力，竖直静止悬挂时物体向下拉悬挂物，符合重量定义。作者没有用“悬挂物向上拉物体”替换它。正确项misconception为null。 |
| D | incorrect/incorrect | 地球对物体的关系只适用于重力，不适用于物体对悬挂物的重量。作者错误路径把重量当重力别名再复制地球→物体，确实产生本项；两力在某情境数值相同也不能救成本项真。该错误与B的支持力倒置不同。 |
| E | correct/correct | 桌面属于支承物，物体因地球吸引对桌面施力仍是重量。作者推导保留定义的支承/悬挂两分支，不把定义限于图中悬挂。正确项misconception为null。 |

## Coverage与能力损失

原题1的定义关系由C及E覆盖：物体对悬挂物、物体因地球吸引
对支承物的力，均作为重量辨认。原题2由A/C及B/D覆盖：
区分重力与重量的施受对象，同时排除支持力倒置和重力别名误思。
合并为一个native multiple有同一力关系的数学理由；
不是重复两道近义题，也没有组合编码或跨题答题依赖。

作者intent.limitations与两条coverage.omitted_tasks均明确保留
自主完整书写定义、自行组织完整比较说理的损失。
选出正确完整句不能证明无提示能生成这些句子；
本审查不把识别覆盖冒称书写覆盖。当前源题不要求作图、
计算数值或证明相等性，作者没有把这些未测能力冒称已测。
限定静止竖直悬挂和水平桌面的应用边界也有明文记录。
按当前choice标准，未发现关键关系被删除或必需任务静默遗漏；
生产能力损失真实但不自动阻断本组关系辨析。

图60复用源阶段完整640×840实见观察，当前字节hash仍为
`c32ab0d314c64b27cdcba3643555c087b968ff21ddf0d5f8aded41c860be7aa0`。
共同横梁、左空载自由绳、右负载绳/钩/提环/砝码及最右/底边完整；
没有力值、标签或箭头泄答。无new_figures。
本审者此前制作过图60，main独立图审负责它的审批；
这里仅记录choice的seed资产观察，不自称独立批准自己制作的图。
图69只有定义中的文字引用，本题无读它才能判真的选项。

## 验证与范围

新增本文件和绑定review.json，未改seed、draft、作者解/notes、
source-first、view-first或任何图。未消耗作者修复额度，
没有真实首FAIL需要规范化或隐藏。
随后只运行一次以下带review检查，不重跑无review作者检查：

```bash
env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c3-s18/seed.json --draft .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c3-s18/draft.json --review .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c3-s18/review.json
```

上述命令实际运行一次，退出0，输出：
`mechanical checks passed; declared semantic review: pass (not automatically proved)`。
结构、输入新鲜度及绑定一致性通过不替代前述独立语义依据。
没有另跑无review检查或修复作者稿，已冻结源解/盲审未改。
本结论是离线choice语义审查，不是发布、DB写入或图晋升。
