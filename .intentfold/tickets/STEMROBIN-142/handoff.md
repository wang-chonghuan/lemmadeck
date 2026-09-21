# STEMROBIN-142 Handoff

## What changed

- 生成并发布六年级物理第一章 6 课：`phy6-c1-s1` 至 `phy6-c1-s6`，包含 13 道原书问题、
  17 张现代插图、13 份标准答案和 13 份交互规格。
- 修复合订本 PDF 映射、叶子 section 认领、课内题号作用域、无编号题身份、历史实体保留、
  正文/打印插图覆盖、中文自由回答与未判分验收等共享流程缺陷。
- 运行时新增 `sourceNumber` 投影，页面只显示原书题号；无编号题保留内部稳定 id `q1`，
  但页面显示为空。无练习课程收到 `?tab=ex` 时仍停留在课文页。
- 主要运行时代码位于 `app/src/lib/lessons.ts`、`app/src/routes/_app/card.$id.tsx` 和
  `app/src/routes/_app/mistakes.tsx`；课程持久产物位于
  `ssot-resources/soviet10year-textbooks/artifacts/6p/`。

## AC results

1. **第一章六课完整且边界正确：通过。** 生产库读回 6 行，正文块数为
   `10/8/8/23/6/26`，题数为 `0/5/2/3/2/1`；edition 均为
   `modern-us-neutral`。查询确认没有 `phy6-c2-*` 行。
2. **正文、物理关系和插图可读：通过。** headed Chromium 在 `1440x960`、`390x844`
   和打印媒体逐课检查；17 张图均有非空像素、可完整滚动、无横向溢出或打印裁切。
   代表性桌面、手机、打印截图保存在工单 `tmp/product-check/`。
3. **题目、答案、交互和数学键盘完整：通过。** 13 道题均有一个 `ungraded` 答案键和
   一个 `free` 交互；每个输入框可独立打开共享数学键盘并输入中文，匿名提交后显示标准答案
   且不判正误。本章无 `auto` 题，该项按约定不适用。第 1 课保持 0 题；第 6 课数据库
   `number="q1"`、`sourceNumber=null`，浏览器断言页面显示题号为空。
4. **共享流程修复有可执行证据：通过。** 课程工具 52 项、答案工具 4 项、应用 82 项测试
   通过；FigureSpec、render/generation metadata 和 hash-bound review 全部通过。
   `ssot-resources/audit.py`、教材 `validate.py` 与生产构建通过。

## Deviations

- 浏览器验收首次运行时发现检查器同时选择了屏幕正文和隐藏的打印副本。已将屏幕态定位限定到
  `.sr-deck`，补充聚焦测试和原书题号显示断言后重新运行全部浏览器验收并通过。
- 17 张来源图片最终都属于正文覆盖集合，没有习题专属图片；打印覆盖仍由正文与习题集合并集
  推导，没有用固定数量绕过检查。

## Environment

- 本地验收端口：`52142`。
- 生产内容库：现有 `LEMMADECK_DATABASE_URL`，仅通过三个既有 publisher 写入。
- 没有新增、修改或删除环境变量；`.env` 与 `app/.env` 均未提交。

## Residual

- 交付分支需要通过 cap4 合并到 `main`，随后按现有 n-easyapp 路径例行重部署
  `lemmadeck`，再对生产页面做只读验收。用户已在 2026-09-21 明确要求完成该步骤。
