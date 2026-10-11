# STEMROBIN-168 交付

## 变更

- `app/src/components/catalog.tsx`：课节分支标题改为普通文字，不再含课程链接或导航回调；原生 `summary` 统一处理标题、箭头、空白及键盘折叠。
- 叶子课程、子课题的链接及未发布门槛不变。折叠项不关闭手机抽屉。
- `app/src/components/catalog.test.tsx`：增加结构型及带自有课程卡分支无链接、可用叶子目标和回调的覆盖；修正旧测试将可操作折叠标题计为 aria-disabled 的断言。

## 验收结果

2026-10-11，在真实 localhost 课程目录使用 headed Chromium：

- AC1 通过：两个视口各检查 282 个折叠标题均无链接。对学科、册、章、普通课节、自有课程卡分支及未发布分支，分别点击标题、箭头、行内空白并按 Enter、Space；展开状态切换，原课程标题及完整地址不变。
- AC2 通过：从实际目录发现 `math5-c1-s1-n1` 子课题及 `math5-c3-s1` 独立叶子；点击到达链接所指课程，课文可见。未发布叶子无链接，点击不导航。
- AC3 通过：桌面 1440x960、手机 390x844 均通过上述操作；手机折叠后抽屉保持打开，叶子导航后收起。
- 浏览器没有运行时异常。临时证据：`tmp/ac-check.mjs`、`tmp/ac-results.json`、`tmp/desktop-directory.png`、`tmp/mobile-directory.png`。

机械检查全部通过：产品资源审计、教材资源校验、内容 DB 4 项测试、应用 17 个测试文件共 118 项测试、生产构建。

初轮浏览器检查中的标题文本读取和跨书册同名章节定位问题已在验收脚本修正，未改变产品代码或验收标准。

## 偏离

无。遵循用户“所有可折叠项禁止跳转”的明确要求，带补充子课题的自有课程卡也没有标题链接；没有改变 TOC、内容或课程阅读顺序。

## 环境

- 预览：`http://localhost:52168/card/alg6-c2-s4-n20?tab=choices`
- 工作区：`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-168`
- 分支：`codex/STEMROBIN-168-leaf-navigation`
- web 端口：52168，保留运行等待人工确认。
- 环境变量新增、修改、删除：无。无数据库写入；未部署。

## 后续

本票无未完成实现。Finish 为 review，等待人工确认后执行合并与关闭。
