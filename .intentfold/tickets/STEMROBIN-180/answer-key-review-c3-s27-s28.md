# s27/s28 Answer-Key Comparison

身份：`independent_agent / frozen_source_solution_key_comparison / Codex`。
日期：2026-11-15。s28 结论：**PASS**。s27：**PENDING，未批准**。

角色边界：先完成并冻结 s32 TEXT handoff，之后才切换为本次答案键比较角色。
未使用答案键创作 s32 文本；本次不创作或修改任何答案，不运行 finalize。

## 冻结对照与实际输入哈希

仓库根目录：`/Users/yong/.codex/worktrees/0f12/lemmadeck`。

| 输入 | SHA-256 |
| --- | --- |
| `.intentfold/tickets/STEMROBIN-180/answer-source-c3-s27-s28.md` | `f426e3e34baf70343068949717fa0b49c30aaf38efe829cf95ca0f675f3dba6c` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/editions/modern-us-neutral/lessons/phy6-c3-s28/lesson.json` | `543579c326db795e7697e9cc019c72f6c537d75efe16257d7900a533b4839fe5` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/editions/modern-us-neutral/lessons/phy6-c3-s28/exercises.json` | `83b4d958a3b1c764c8c0cd205bd64aea3ebd437b2d0effdff19c1349415628fd` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/editions/modern-us-neutral/lessons/phy6-c3-s28/answer-keys.json` | `77ae0ea47cb64594ca5a94f916e707c5af3b641cd0207f5133e3065ab4f86f0d` |

已读 ld-s10y-answer gate2。仅复用既有冻结独立源解，与 s28 最终现代正文/四题和四个新键比较；未重新完整求解，未重看原图、现代图、FigureSpec 或图审。

## s28 逐题

| 稳定题号 | 判定 | 比较理由 |
| --- | --- | --- |
| s28 / g1 / 1 | PASS | 拉断线的例子明确是外力克服断裂处大量分子间吸引，使物体两部分分离；不把它解释成劈开单个分子，也不硬套课文特定线材的断裂阈值。完整满足举例任务，合理替代例子保留开放性。 |
| s28 / g1 / 2 | PASS | 同时保留引力和斥力；近距离斥力增长更快、超过引力而形成推斥合力。说明不能任意紧靠或重合，不误称绝对不能压缩；平衡处两力相等不等于各力消失。 |
| s28 / g1 / 3 | PASS | 在本课近距离定性范围内，两力随间距减小而增大，斥力增长更快；较远引力占优、平衡合力为零、再靠近斥力占优的三个状态均完整。与冻结源解及最终正文一致；图82仅作已有定性对应，不读取箭头像素算数值或比例。 |
| s28 / g1 / 4 | PASS | 保留钢索未断裂且处于弹性范围这一冻结源解已明确的前提。拉伸增大间距、引力胜过斥力形成恢复作用，撤力后收缩、趋向原长，因果完整；不无条件推广到塑性变形/断裂，也不承诺撤力瞬间已经恢复。 |

## 完整性、条件、单位与判分

- 最终现代题号为1、2、3、4，各恰有一个键；键的 prompt 与最终 exercises.json 逐字一致，无漏题、重复或新增小问。
- 最终四题相对冻结源题没有新的数值、图绑定或过载条件；第1题只有排版标点差异。第4题未明写弹性范围，键将该必要适用条件显式说出，未偷换为任意钢索都能恢复原长。
- 四键均为 `source: derived`、`grading: ungraded`、`parts: []`；没有 expected 或自动判分槽。开放例子及文字说理不以固定词串硬判。
- 每题 displayAnswer 有完整理由而非仅给结论。没有把近距离分子吸引误作地球重力，也没有声称两力不能共存。
- 本批四题不要求数值计算。最终正文的1平方毫米、约250牛顿和25千克只是实例；键不另造数值题，不把千克当力单位，不把宏观拉断力称作单个分子力。
- `figureEvidence: []` 与这四题空 figure_refs/figures 一致。不能据此称整课没有图：最终正文确有81/82，本次只复用冻结源解已记录的原图事实与主代理告知的批准状态，不冒称本轮实际打开或重新批准现代图。
- 四键无 bookRaw；本次按已经独立完整求解的 derived 路径比较，不声称读取或验证了书后答案。historical_entities 为空且未引入文化实体。
- 已执行只读结构/题面对齐检查：4题覆盖、prompt一致、derived/ungraded、空parts均通过，errors为空。未运行 finalize、MathLive/浏览器、interaction、publish、DB/Git 或任何服务。

本次没有发现真实作者缺陷，因此没有生成伪造的 author-fail，也没有修键。PASS 仅绑定上表当前字节；主代理后续负责 finalize。

## s27 Pending

s27 五键尚未被本审查读取或比较。既有五题独立源解仍冻结保留，**不据此批准尚未比较的答案键**。本报告只批准上述 s28 四键。
