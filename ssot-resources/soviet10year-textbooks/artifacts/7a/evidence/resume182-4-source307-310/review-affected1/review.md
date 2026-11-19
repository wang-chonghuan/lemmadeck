# STEMROBIN-182：307一字受影响复核

日期：2026-11-19。工作目录：`/Users/yong/.codex/worktrees/stemrobin-182-resume/lemmadeck`。
本次只核1030а“当”的修复差异及新307的MD/JSON/audit绑定，不重做源页审查。

## 结论

**新307 / 印刷301 PASS**。原FIRST发现是可修内容 **REVISE**，不是原文缺源。
FIRST报告的原HOLD及其原候选哈希原样保留；本记录解决该缺字，不回写历史结论。
308、309、310仅复用FIRST原PASS及原哈希，未读取当前三页候选、未重新审查图66。

## 差异与绑定

- 旧：`1030. а) 劳动小组在一定期限内应生产 $360$ 个零件。由`
- 新：`1030. а) 劳动小组在一定期限内应当生产 $360$ 个零件。由`
- 位置：MD第51行；JSON `/blocks/2/lines/0`；原页第14条印刷行。
- 单一差异：插入“当”，U+5F53，UTF-8增加3字节。将旧MD这一整行替换后与新MD逐字节相等；没有其他文本或元信息差异。
- 新JSON与旧JSON仅这一行的值不同；其他块、标记、元信息及行数组不变。
- 新MD frontmatter与新JSON的meta相等；全部MD块体与JSON行数组一致，共28行。
- 新audit与原FIRST audit逐字节相等：28/28行，零图，零normalizations，零unknown_chars，零katex_warnings，零errata，零errors。
- history的307三个文件实际哈希与FIRST所绑定的原候选完全一致。
- 源字面依据复用本人FIRST已实际看见的“应当生产”；本次没有打开或读取图片文件。
- 用户提供的新307正常finalize一次、退出0作为外部执行信息记录；本复核没有重跑finalize或再次核验其运行日志。

## 原FIRST证据

原报告保持以下实际SHA256：

- `/Users/yong/.codex/worktrees/stemrobin-182-resume/lemmadeck/.tmp/resume182-4-source307-310/review-FIRST/review.md`
  SHA256：`6d7670f3c6d0c4394294f54fb88a35d2fdde900656e08dfbf80709dbb5825585`
- `/Users/yong/.codex/worktrees/stemrobin-182-resume/lemmadeck/.tmp/resume182-4-source307-310/review-FIRST/review.json`
  SHA256：`5703a5331a3683312f74f4712e6f5570026f408302dcde334df9d1d0200c1892`

原307字节保留目录：
`/Users/yong/.codex/worktrees/stemrobin-182-resume/lemmadeck/.tmp/resume182-4-source307-310/history/source307-FIRST/`

| 原文件 | 实际SHA256 |
| --- | --- |
| page.md | `1462593f9c8319ee01c6f30a40a87646d3037a43bcfb3f141dbfab0405cb6677` |
| page.json | `dbd206d499123cbed7df4a6f71fc1b26b3164a797294371a44787096eb502e7c` |
| audit.json | `9f3cdef112c910c14ecf474e475a3eef68635581e2e33d7acbce4bab7ed818f5` |

复用源观察路径：
`/Users/yong/.codex/worktrees/stemrobin-182-resume/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0307/page.grid.png`
FIRST已实际观察并绑定的SHA256：
`95d28ffd87519d2d5f760b2246fcede2669114285d3fb8d56ba43a59a42c8051`。
该图片本次未打开、未重新计算哈希。

## 新307候选

目录：
`/Users/yong/.codex/worktrees/stemrobin-182-resume/lemmadeck/.tmp/resume182-4-source307-310/artifacts/7a/pages/0307/`

| 新文件 | 实际SHA256 |
| --- | --- |
| page.md | `deee0c27beb6823950079d5927db4b3723470c2de69bd44467c0df6dd7175578` |
| page.json | `6e32734ae49206e17602c33a9f3430624e1c032c120d0b49128972ac3d0cf851` |
| audit.json | `9f3cdef112c910c14ecf474e475a3eef68635581e2e33d7acbce4bab7ed818f5` |

## 其余三页原PASS复用

这里只引用FIRST原记录，不宣称重新核验当前文件；各页完整MD/JSON/audit原绑定见本目录review.json。

| 页 | 复用结论 | FIRST page.md SHA256 |
| --- | --- | --- |
| 308 / 302 | PASS | `5e0100fbc8aec09f2f379c9edd020d467ea42c805e6d57d415bb7ff15a6018a1` |
| 309 / 303 | PASS | `7a9c67b2b478d763f5a0f45d55db6fef8fdd18aa8226b55aab891dbbfb76c415` |
| 310 / 304 | PASS | `096c0909888cfbbd23fa7948da25842130bab1a096ad1e835a0b94743a3501da` |

## 边界

本次新增图片观察0；上下文历史累计仍为5图。
没有浏览器、其他会话/代理查看或消息、工作树创建、Git提交、数据库访问、付费或解题。
未改作者候选、history、FIRST报告或其他人的文件；仅用apply_patch写本目录review.md/review.json。
结论仅绑定上述新307哈希；其余三页沿用原FIRST哈希与结论，不扩大范围。
