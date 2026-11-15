# 6p 物理122计行修复受影响独立复核

审查者 Sagan，独立于作者/计行修复者；日期2026-11-15。**结论：PASS，仅122的F122-C计行门禁收口。** 复用 `source-review-121-125.md` 已完成的122全文、公式、对象、边界及真实24行像素判断；不重开整页，不重审121–125或已冻结的126–130。

## 未变范围与实际差异

- 当前持久122 `page.md`、`page.json` 与 `failure-01-two-column-line-count/` 首失败文件逐字节相同；两次 `diff -u` 均exit0。完整12块、所有文字/公式/数值/标点/强调/notes、open/cont、元数据均未变，不是删F1或合并独立条目凑计数。
- 原PNG、grid、layout.json和自有双栏局部像素证据的实际SHA均与首审manifest一致；源1472×2161、300dpi及JSON绑定的render.sha256一致。无本页图框/裁图，不存在借裁图删文字的修复。
- audit实际diff仅 `lines_printed:23→24` 及移除旧行数不匹配错误；`lines_md=24`、figures/normalizations/unknown_chars/katex_warnings均为空、errata=0不变。当前12blocks、24authored/24printed、errors=[]。
- 旧layout.json仍保存历史23带，未伪装成新计数；修后实际band证据来自 `page122-count.json` 和 `count-verification.json`，不是从未变layout反推PASS。

## 计行证据与判断

首审已独立确认左S2、F1、F2为三个条目，右高分式的上下伸展及已知/待求横线不能删掉其中一行；页首六行加其后18行，真实总24。保存的修前production trace中y359–512按pitch得3，但全宽strong_rows仅两组而降为2；栏内独立行证据与先行源审诊断相符。

修后保存的页首六带为 `[223,262]`、`[290,330]`、`[359,409]`、`[410,461]`、`[462,512]`、`[537,627]`；其余18带与修前相同。中间三带为计量展开，不冒称精密字形裁界。保存证据记录完整24带、源MD计数24、input_mask_unchanged=true，且绑定的修后layout.py SHA与当前文件实际相同。因此当前24/24符合既有独立源行账，不是只迎合作者期望。

已读保存的focused记录：修后46 tests/OK/exit0、无skips；该文件明示为执行结果记录，**不是原始runner全日志，也不是我本次实跑**。另两项新正例在pre-patch上的原始FAIL输出确为 `8 != 9`，无setup错误，保留。修前/后工具、测试文件及诊断证据实际hash与交接一致。本次未运行计行器、测试或finalize，不把作者的其他页分支发现扩大为本次独立审批。官方finalize exit0由main通知；本次实际核对的是当前持久产物与audit，不冒称亲自执行该命令。

## 首失败保留与SHA256

以下均为本次 `shasum -a 256` 读取完整文件字节所得，不是canonical摘要或手猜hash。路径相对repo；`D` = `ssot-resources/soviet10year-textbooks/artifacts/6p/pages/0122/`，`S` = `.tmp/ld-s10y-lesson/6p/pages/0122/`，`T` = `.intentfold/tickets/STEMROBIN-180/`。

| 文件 | 实际SHA256 |
| --- | --- |
| D/page.md；S/failure-01-two-column-line-count/page.md | `c72ab07f2d12ffc51ac461d15e152f68d40943d343b1c2d3df15b8ceb0954077` |
| D/page.json；S/failure-01-two-column-line-count/page.json | `5e617939ebc237acd6c95200b9a3541d8a73f8b4a9eaefa3d957add1d68589e3` |
| D/audit.json（当前24/24） | `8d969c6bc6a68f52990ca5ec3e779c3d72927fcf94c397dff3191cb097c5c792` |
| S/failure-01-two-column-line-count/audit.json（首23/24） | `294d0fdd5c232a1b0111c7b517903fff4fbbc80bd7ca97453b1f8dd212d1af5d` |
| S/failure-01-two-column-line-count/failure.md | `e41710f695e801c93225738b9ef31cd430af4e0bb821c02ad690878d5b74c1a2` |
| S/page.png | `613ca4951781a6f383fe0747ee617215eecf216fae937a776b6885d916460c87` |
| S/page.grid.png | `f10aeb44f1eb6eb512c2b2b98c06b809fe706e99325d8f82464fd821bb86db11` |
| S/layout.json（原几何/历史band） | `e6d0497b51de1859e32df4e1300b2f5196354b926df7b28f5d518498bf13bf7d` |
| T/source-review-121-125.md（旧完整首拒绝报告） | `62c737ff0ff96e8c6160905c1322e5789091730211e38cbc6bfb0076b19d7f97` |
| T/tmp/source-review-121-125-evidence/hashes.json（原manifest） | `3730d3f0fe98caead4ae8c80343395c35398952648787956517a49758b9aa683` |
| T/tmp/source-review-121-125-evidence/0122-two-column-detail.png | `5241d47e6e6c8579ba8dc1c3fc71ce8bec497ea0ea9a47e74ee9344015f6274f` |
| T/source122-counter-repair.md | `ec84653bae8143fb178c8de7c2630c711644fc9a6d6ad3fff2c05d06c1523112` |
| T/tmp/source122-counter-repair/diagnosis-before.json | `97a28f777a1c5f3cc1f3e693a2a7b78c19d17d0b89729430d8a39364d019f23f` |
| T/tmp/source122-counter-repair/count-verification.json | `452451707537f986a77e746ab61998951f772c2be679755ffc34b38d763944d2` |
| T/tmp/source122-counter-repair/page122-count.json | `337fc653583ef53ab938b854d47bd27c14ab73108b13079ab94d3068c2c26acb` |
| T/tmp/source122-counter-repair/focused-tests-pass.txt | `abe69a8cdda6c17411fa32cbecb95e8d03ec5a59888f30aafe863c12de581789` |
| T/tmp/source122-counter-repair/focused-first-fail-before-patch.txt | `fbd058410fcb75402411aded2fec5dc1a3a9744f010277b0a1e00bd8c1367d5d` |
| T/tmp/source122-counter-repair/layout-before.py | `1db896d4e81f41bf4557fc0a36a4c543a1cfdbc630124ba1fd8b450eaf412c2c` |
| .claude/skills/ld-s10y-lesson/tools/layout.py（修后） | `9723a80790ee216716e4a6097c77a57cc9bf4deab78da0250f851ad6bb7d9435` |
| .claude/skills/ld-s10y-lesson/tests/test_staggered_column_rows.py | `679c60a86f2aa6b2be180e3ec40e3142a6c528fe22a5e892cc04b67725eb69a5` |

首失败目录四文件均与原manifest一致，旧首拒绝报告未覆盖。这里只解除122已明确修复的计行阻塞；不改先行像素结论，不批准121–125整批、126–130整批、装订或108，不碰131+。

本次仅新增本报告。没有修改作者/source/tool、重跑finalize/vectorize/assemble/测试、读取答案/choices、开浏览器/用户桌面/CDP、访问DB/网络/模型服务、使用Git或晋升。精确模型部署、推理设置、token/费用计量未知。受影响复核完成后停止。
