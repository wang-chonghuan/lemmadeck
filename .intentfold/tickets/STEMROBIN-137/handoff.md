# STEMROBIN-137 交付

本工单通过开放开发完成；本文记录交付内容与实际验证结果，不追溯每项编辑使用了什么工具。

## 交付内容

- 目录中的未发布课程、课内小节改为灰色禁用文本，并带有 `aria-disabled` 语义，不再显示
  可点击指针或 hover 背景。
- 完全没有已发布内容的学科、教材和章节标题同步使用禁用灰色，但其 disclosure 箭头和
  折叠展开交互保持可用，完整目录结构仍可查看。
- 已发布课程继续使用原有链接、选中态和导航行为。
- 新增目录组件测试，覆盖未发布课的禁用语义和“父层仍为 details/summary”这一交互边界。

## 验收结果

| AC | 结果 | 实际证据 |
|---|---|---|
| AC1 未生成课程项禁用 | PASS | 在六年级代数第二章找到 19 个未发布目的项；均为 `aria-disabled` 非链接，点击后 URL 不变，计算颜色为 `rgb(138, 151, 149)`，对应 `--sr-ink-dim` |
| AC2 父层级折叠展开 | PASS | 桌面和手机均实际点击未发布章节 summary，`open` 状态正常切换 |
| AC3 已生成课程行为不变 | PASS | 同一本书内已生成项保持链接，颜色为正常 ink，实际导航至 `/card/alg6-c1-s1-n1` |
| AC4 响应式无回归 | PASS | headed Chromium 在 `1440x960` 与 `390x844` 完成相同检查；截图为 `tmp/catalog-desktop.png`、`tmp/catalog-mobile.png` |

机械检查：

- `python3 ssot-resources/audit.py`：通过。
- `python3 ssot-resources/soviet10year-textbooks/validate.py`：通过，16 PDFs、17 catalog
  volumes、510 lessons、158 figure render records。
- `npm run test`：14 个测试文件、82 项测试通过。
- `npm run build`：生产构建通过。

## 偏差

无 `draft.md`，无约定方案偏差。

## 环境

- 分支：`codex/STEMROBIN-137-disabled-catalog-items`。
- 工作目录：`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-137`。
- 预览：`http://localhost:52137`，HTTP 200；按 review 模式保留运行。
- 没有增加、修改或删除环境变量；没有依赖、数据库、资源或 Charter 改动。

## 剩余事项

无。本工单等待人工验收后再进入合并关闭流程。
