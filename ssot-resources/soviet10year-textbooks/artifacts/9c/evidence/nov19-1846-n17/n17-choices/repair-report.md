# 最小修复完成

状态：本次授权修复完成，不是语义评审或审批。`contentRepairCount=1`，仅实施一次数学内容补丁；没有第二次内容修复，没有读取父任务或 Ptolemy 的内部报告、答案、其他输出或图像。

所有命令工作目录为 `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck`。所有新写入仅在 `.tmp/stemrobin-184-six/n17-choices/`。未修改任何原始产物，未访问原始学习者视图。图像使用仍为 0，无网络、模型服务、依赖、数据库、环境文件、Git、后端、发布或应用编辑。

## 新产物

- `draft.repaired.json`：原始草稿机械复制后用 apply_patch 做一次最小补丁，保留可写权限。
- `view.repaired.json`：投影全部 12 道题的 `id` 和 `view`，没有解答、答案键、意图、映射或其他内部字段。
- `repair-field-diff.json`：精确字段差异及全部受保护字段相等的机械凭据。
- `repair-option-comparison.json`：内部完整数值结果、分量频次及选项等价性比较。
- `repair-originals.sha256.txt`、`repair-originals-check.stdout.txt`：22 份原作者产物修复前后的字节哈希核对。
- `repair-receipts.json`、`repair-failures.json`：本次独立执行凭据与失败记录；未覆盖先前日志或报告。

## 精确改动

目标题保持 `id=n17-distance-results`。JSON 数组索引以下均从零开始，选项索引 1 对应 B。

仅以下 3 个字段改变：

1. `/questions/1/view/options/1/text`：原为“依次为 $0.5$、$4.1$、$3.6$、$1.4$。”，新为“依次为 $0.25$、$2.05$、$1.8$、$6.4$。”。
2. `/questions/1/key/rationales/1/derivation`：改为误把两点中点到原点的距离当作两点间距离的逐组具体推导。
3. `/questions/1/key/rationales/1/misconception`：改为混淆 $\left|\frac{u+v}{2}\right|$ 与 $|v-u|$。

独立计算正确完整结果仍为 $(3.5,16.5,3.6,1.4)$，正确键仍为 C。新的统一错误规则为中点坐标的绝对值，逐组精确得到：

$\left|\frac{1.5-2}{2}\right|=0.25$，
$\left|\frac{-10.3+6.2}{2}\right|=2.05$，
$\left|\frac{-3.6+0}{2}\right|=1.8$，
$\left|\frac{-5.7-7.1}{2}\right|=6.4$。

这是混淆距离对象后得到的自然一致错误结果，不是任意邻近数值。学习者选项只呈现数值，错误说明仅存在内部 rationale。

A、C、D 的文本、所有选项的 id 和 figure_ids、所有 rationale 的 truth、C 的正确推导、题目 id、source_numbers、mode、stem、表格与全部数据、intent 和响应单位、key.correct、其余 11 道题、coverage、seed_sha256 及 new_figures 全部严格不变。

## 分量频次与等价性

| 分量 | 修复后的数值与出现次数 |
| --- | --- |
| 第一分量 | $-3.5$：1 次；$0.25$：1 次；$3.5$：2 次 |
| 第二分量 | $2.05$：1 次；$16.5$：3 次 |
| 第三分量 | $1.8$：1 次；$3.6$：3 次 |
| 第四分量 | $-1.4$、$1.4$、$6.4$、$12.8$：各 1 次 |

没有任何分量在所有候选中相同。四个完整结果各不相同，没有通过小数等值造成的选项重复。此处仅记录授权的作者内部比较，不代表独立语义评审。

## 保护字段与哈希

`repair-field-diff.json` 的 `changed_field_count=3`；`only_authorized_three_fields_changed`、`protected_fields_equal`、`all_other_questions_equal`、`target_intent_equal`、`target_correct_set_equal`、`coverage_equal` 和 `seed_digest_equal` 全部为 true。

保护投影只删除上述 3 个字段，保留整个草稿其余内容。使用 `jq -S -c` 生成排序、紧凑的 UTF-8 JSON，含末尾换行，再执行 `shasum -a 256`。新旧保护投影的字节哈希均为：

`673644c0eb284c103f3dddfbb509a91a6aed0f9106f5dd33cde632df2d97375c`

原始草稿规范化 SHA-256 保持：
`c37e7b3ae1272e9cd34d056d26e2484ff1e1d78d37dee335a0778bd9184e06cc`。

新草稿规范化 SHA-256，由现有 `prepare.py digest` 计算：
`f2478695917c68928962da44919a7ef11367c6e24b63fcfee9993ed7812d997e`。

新草稿原始字节 SHA-256：
`237e77e8848d45a54b00978c7ad51c987eb4bdecd79c53516612283e90c9b37b`。

新学习者视图原始字节 SHA-256：
`b5c73bf4ece4ceed4353f53e21f2e3f82989cb6442666b1bd8a63b411412e77b`。

22 份明确列出的原作者文件全部哈希核对成功，包括原 seed、draft、独立解答、作者报告、执行凭据和所有原作者日志。其他原始文件未访问或写入，原学习者视图未读取或覆盖。原文件权限也未改变。

## 唯一一次结构验证

```bash
python3 .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .tmp/stemrobin-184-six/n17-choices/seed.json --draft .tmp/stemrobin-184-six/n17-choices/draft.repaired.json
```

退出码 `0`。stdout 原文：`mechanical checks passed; semantic review still required`。stderr 为空。原样记录在 `repair-validate.stdout.txt`、`repair-validate.stderr.txt`。仅运行一次；本轮结构失败为空，单独记录在 `repair-failures.json`。

`view.repaired.json` 通过机械投影检查：12 个条目，每项只有 id、view，并与新草稿逐项相等；退出 `0`，stdout 为 `true`。

本次仅报告修复完成；未生成 review.json，未输出通过审批，未改写先前独立评审结果。
