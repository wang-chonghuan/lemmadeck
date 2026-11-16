# STEMROBIN-180 CHOICE 作者交接：7p n89

状态：作者冻结候选，待独立复核。没有 self-review、独立 review、approved 或 review validation。

## Path And SHA

- Worktree：`/Users/yong/.codex/worktrees/0f12/lemmadeck`
- Branch：`codex/STEMROBIN-180-textbooks`
- 当前 HEAD SHA：`31b1b46fd80841c5b92e065126b98efcfe5fa546`
- 新 root：`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/choices/phy7-c1-s1-n89`
- 作者交接：`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/choices/phy7-c1-s1-n89/author-handoff.json`
- 作者交接 raw-byte SHA-256：`cba6244709fa7a47a5c2c48d3f1e68a31da2d0cce8b3eb2aadaa170ac175be4b`
- Seed canonical SHA-256：`86881a492e9fdd1b496a39c7f6fb7fea3a36ff4aa92083b6baf4367581c75681`
- Draft canonical SHA-256：`6f66182d1f524b010ab3e099b44601e185c08c49f155f584fc8a2656d35ce50f`
- Source-first 解答在构造选项之前冻结，raw-byte SHA-256：`b3c7edcbea2f792f777af7c3815d34bb2e14ff8a8fff9dc43971c680c9889b8b`；交接时未改变。

## Count And Evidence

完整原书写题 `2`；新题 `2`，均为 `single`；`multiple 0`；选项 `8`；源图 `0`；新图 `0`；上下文图片加载 `0`。

新作者修复预算 `0/1`，包括机械缺陷，无旧 history 继承。每个自然 response unit 均未修复。唯一一次结构校验 exit `0`，原始输出：

```text
mechanical checks passed; semantic review still required
```

完整命令和证据冻结于 root 内 `structural-validation.json`，没有 `--review`。纯视图与 draft 的两个 `view` 子树一致；这些只是结构及快照绑定事实，不是语义复核结果。

## Inputs And Units

按 `prepare.py inspect` 后 `prepare`，只使用 allowlist 的 7p 选定 book index、现代 n89 lesson/exercises/figures 投影。两原题均无 `figure_refs`；正文保温瓶图223、224与两航天任务无关，未打开，也未机械加入选择题。候选正文段落为应用或已解释实例，没有选作本任务定义，显式 `--no-concepts`。

第一单元保留高度增加与减少时两受热因素的通常相对比较及理由，未拆为两个高度槽位。第二单元保留双层壳体充气、流过放热仪器、向外壳传热的完整情境，显式说明用户要求的在轨微重力，整体辨析自然循环受限与风扇驱动。未增加高度、速度、温度、受热量等定量数据，未改成恒温测量。

两原题均在 source-first 中先完整自解；随后手工生成 draft，每项都有正确推导或具体错误推导，全部 intent/source_solution/coverage 完整。没有读取 answers/private/source-solution/author final keys、旧 choice/inputspec、邻课或旧题稿。

## Capacity Loss

选择候选解释不能验证学习者无提示地提出、组织并书写两高度比较及理由，也不能验证自主写出温差、密度差、重力浮力、自然循环与风扇驱动之间的完整因果链。原书写题能力仍需保留；不能把点选宣称为独立论证、装置操作、路径设计或恒温控制证据。损失已写入每题 limitations 和两项 coverage。

## Frozen Artifacts

root 内冻结 `author-handoff.json`、`source-first-solution.json`、`draft.json`、`pure-view.json`、`seed.json`、`author-notes.md`、`input-binding.json`、`current-sha.txt`、`structural-validation.json`；所有内容文件 raw-byte SHA 由作者交接绑定。

只写此新 root 和本报告。未改 canonical、未 retain/finalize/publish、未操作 Git 状态、DB、app、依赖或工具，未回滚他人。浏览器启动 `0`，没有生产交互、图片 payload 或遗留 task-owned 浏览器/exec 会话。独立 reviewer 应先读 seed 自解，再读 pure view，最后才解锁作者内部解答和 draft。
