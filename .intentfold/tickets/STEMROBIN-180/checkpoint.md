# 生产检查点

2026-11-15 13:46 UTC。STEMROBIN-180仍为开发中；不是cap3handoff，不是全组验收，也没有PR、合并、写库或部署。正在保存可接续的阶段提交，不把阶段提交称为完整分支交付。

## 当前产物

- 分支 `codex/STEMROBIN-180-textbooks`；共同基线 `ae9769c6402093de057e30ad38e3c007067b6e7e`，无同步其他组或移动main。
- 6p有效页：物理12至42页，另有无印刷页码的彩图I物理5页；共32页。新转写为23至42页及彩图I，保留原六课源/现代正文快照。
- 已装订15个课程项、52道原始题、24张编号图。§13/14跨页文字和栏目已闭合，但§14缺彩图II；这些计数不是完整三册计数。
- 现代层保留9个阶段快照；其中§8随新增彩图变为过期，当前不得认作完整。已有新增§7、§11可接续。
- 持久保存8组19道选择题独立审查；当前源有效的为7组16题，§8三题待完整现代版后重新准备和审查。
- 新现代图11/12/13/14/16已批准；图15、17、彩图I上图失败，未晋升。彩图II暂不入有效原始层。
- 7p、8p未开始。三册274项目标没有完成，不缩减范围。

## 已观察检查

- `python3 ssot-resources/audit.py`：退出0；误留§11的三个模板已删除，仅保留正式产物。
- `python3 ssot-resources/soviet10year-textbooks/validate.py`：退出0，16 PDFs、17 catalogs、510 lessons、878 figure render records；这个仓库级结果不证明本组全册完成。
- `node --test .agents/skills/lib/content-db.test.mjs`：4项通过。
- `npm --prefix app run test`：18文件、131项通过；`npm --prefix app run build`：退出0，有既存大chunk警告。未改应用或依赖。
- 选择题工具：42项通过；macOS路径别名断言改为双方resolve，白名单范围未放宽。
- 课文工具最终144项测试通过，4项缺本地源图跳过；包含新增无页码图页7项正反例。
- 九课离线渲染和headed Chromium检查：52个1440x960/390x844页面通过，包含图像、实际字号、末端内容、无横向溢出、只读书写题及无答案键。该检查发生在彩图入源之前，只证明当时快照，不证明当前§8已完整。
- `git diff --check`：退出0。
- 原六课源/现代lesson、exercises及现代figures与共同基线比较：退出0，字节未改变。

独立源检查37至42页首次发现四处转写错误；作者修复后已独立核对源像素、两页结构和§14源正文/练习传播，限定文字PASS。首次拒绝报告和复核报告分别保存为 `source-review-37-42-rejected-1.md`、`source-review-37-42-repaired.md`。彩图II未收口，不批准§14整体完整。

彩图I上图的独立第二次审查维持FAIL，报告保存为 `plate-I-upper-rejected-2.md`；没有第三次修复或晋升。图18首轮确定性渲染PASS，现代正文/四道问答与图件独立审查尚在进行，暂不计为新增完整现代课。失败图详情见两个figure blocker和 `plate-blockers.md`。实际用量在 `production-usage.json`；模型token及费用未知，不编造。
