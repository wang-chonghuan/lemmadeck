---
name: ld-s10y-choice
description: Load when generating and publishing a parallel multiple-choice exercise set from Soviet 10 Years textbook lessons, including requests such as “生成六年级代数16至18课的选择题” or “给这些课生成平行选择题”. Preserves original exercises and covers their subquestions; not a free-form quiz generator.
---

# ld-s10y-choice

输入教材和课程范围，输出已校验、已发布、在对应课的“习题”选项卡可作答的平行单选题。
从仓库根运行。产品改动遵守项目 IntentFold；发布只限用户指定的课程。

## 生成到交付

1. 从教材 TOC 唯一解析课号；读取现代版课文、原题、答案与实际图表。
   `node .agents/skills/ld-s10y-choice/scripts/choice.mjs prepare --book 6a --units 16-18`
   已有现代版是前提，不重抽扫描，不改原题、原答案或原图。
   来源变动时用 prepare --refresh 将旧题备份到临时目录并创建新草稿；
   然后重新出题、审核，不能把旧 source 哈希直接改成新值。
2. 阅读 [authoring.md](references/authoring.md)，在备料提供的结构化模板中建立
   原题逐小问覆盖表并写选择题。主模型负责语义拆分、求解、判断和干扰项；
   工具不按现有答案框数量猜覆盖，不用随机数生成假选项。group 沿用原题栏目，仅作内部记录。
3. 首次新类型先生成真实样本，按 [review.md](references/review.md) 审核。
   失败先修产物；可重复的管线问题修本技能后重新 prepare/finalize。
   不把样本题号、数量或具体答案写成未来课程的硬编码规则。
4. `node .agents/skills/ld-s10y-choice/scripts/choice.mjs finalize --book 6a --units 16-18`
   检查来源绑定、覆盖、格式、唯一键、等价选项和数学判据。机械通过不代替语义审核。
5. `node .agents/skills/ld-s10y-choice/scripts/choice.mjs publish --book 6a --units 16-18`
   通过共享内容连接更新目标课程的独立题组，保留原题和答案。
   重复发布替换同一题组，不追加副本；来源变动时拒绝发布旧产物。
6. 按项目 operations 的本地浏览器流程确认“课文｜习题｜书写题”顺序，
   平行选择题位于“习题”，完整教材题位于“书写题”，只展示题面和图表、不提供输入控件。
   “习题”选项卡内整课题目在同一页连续展开，
   单选点击选项立即提交并显示判分，每题独立加载、失败重试与反馈，不设提交按钮。
   键盘方向键只移动焦点，空格或回车确认作答。图表可读。
   来源关系留在产物与数据库，不显示给学生。
   `--dry` 只是检查，不是完成。网站部署不是内容发布，不包含在技能的默认授权里。

持久产物位于
`ssot-resources/soviet10year-textbooks/artifacts/<book>/editions/<edition>/lessons/<id>/choices.json`。
备料和预览位于 `.tmp/ld-s10y-choice/`。`--lesson <id>` 可重复指定；默认 edition
为 `modern-us-neutral`。语言切换和新课程 UI 不是本技能自由扩展的范围。
