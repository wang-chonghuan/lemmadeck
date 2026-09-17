# AC1 - Complete Reference-Derived Inventory

运行新课程图审计命令并保存 ticket evidence。它必须从 54 课的正文图、习题展示图和
`figure_refs` 推导目标，报告 171 张独立在用图、34 个原受影响单元，并在迁移后证明：

- 实际引用缺清单为零；
- 在用 `figure-spec@1` 为零；
- 缺 spec、render/generation、review 或当前哈希绑定证据为零；
- 13 张 STEMROBIN-139 当前图仍被正确归类，没有重复生成；
- live DB 与 repo 的已发布/未发布分类可逐课核对。

# AC2 - Figure Fidelity, Readability And Themes

对全部 158 张迁移图运行当前 FigureSpec validator、renderer 和 edition validator。每张
source inventory 的对象与断言都必须解析，数学断言、边界、碰撞、哈希和所有声明显示宽度的
最小 16px 字号检查全部通过。

查看全量原图/新图 contact sheet，并在桌面 `1440x960`、手机 `390x844` 的产品页或离线
课程预览检查每张图的点、线、箭头、标签、刻度、子图和表格行列。中性、现有 accent 主题和
黑白打印下均清楚，改变主题不改变图结构；hybrid 的 artwork 与 SVG overlay 保持独立。

# AC3 - Publication And Product Consistency

先对 21 个原已上线受影响课程运行 publisher dry-run，再通过现有 publisher 更新 live DB。
只读查询必须证明这些课程仍是原有 ID 和 edition，另外 13 个离线课程未被新增发布。

在 `http://localhost:52140` 对所有已发布受影响课程运行课程产品检查，证明正文、习题显示和
浏览器打印下载均使用当前持久图件，图非空且可到达；每个输入框的数学键盘和现有答案/交互
元数据仍存在。若迁移修正了题图给定事实，对应答案必须通过答案技能同步并通过同一产品检查。

# AC4 - Bugs And Regression Gates

加入失败 fixture，证明检查会拒绝：

- 正文或习题实际引用但本课 manifest 缺失的图；
- 缺少 source inventory 对象或关系；
- 越界对象、遗漏 containment/connects、最终字号不足；
- 旧规格、缺 review 或 spec/output/evidence 哈希过期。

用五年级第 3 课 `fig-05` 和迁移中发现的每个真实失败样本证明修复前失败、修复后通过。
最后按 Charter 运行资源审计、教材验证、应用测试和生产构建，所有命令必须退出零。
