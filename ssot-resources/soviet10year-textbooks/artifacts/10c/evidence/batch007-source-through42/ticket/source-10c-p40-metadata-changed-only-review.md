# 10c physical40 metadata affected-only 独立复核

日期：2026-11-16。STEMROBIN-184。Worker B / Codex，父方既有工单委托下的原唯一source reviewer，非诊断/metadata作者。先完成41/42唯一Stage B及图21有界source clarification，再执行本次；无新完整source gate。

## 限定结论

**本次notes/count-only metadata及其当前绑定 limited PASS。** 44个blocks、全部38题/五exheads/folio、23个samerow和MD body全部原值相同；新框只覆盖已实际看到的底部扫描墨迹，不遮正文/公式/页码。父方现有一次affected-finalize audit为21/21，与本审者先行冻结21排相符；本审者未重计或执行该命令。

原首21/22 FAIL及唯一Stage B原报告仍保留，不覆写成“从未失败”。101数字/分式邻接的数学语义仍UNKNOWN，当前note准确撤回过确定的mixed-number断言。**这不是101语义解决、全页无条件source批准、整83/84审批或现代/答案/出版许可。**

## 复用冻结和实际检查范围

先行完整源冻结 `source-review-10c-p39-p42-source-first.md` 最终raw SHA256 `68cd478a852dab7c538cb4d604c3c18cc0e6108741b109150a2500575cd8788c`；唯一39/40 Stage B `source-review-10c-p39-p40.md` SHA256 `647096d83ba52416d0abc7019ad9524774d417910d964112d634f6c9afd9d308`。两份未改；其初读误述和顺序局限保留。早先12b settling值不是最终immutable SHA，未补造pre-final副本。

仅复用其中40完整38题、四组任务、21个印刷横排和101 literal未决事实。读取父方保存诊断/元数据及first/current/after triples，实际单张打开三份现有bounded native strips一次；未重开40完整原页、未重解101、未重看39或其他原题/图。

路径根 `D=.intentfold/tickets/STEMROBIN-184/tmp/10c-p40-count-diagnostic/`。三个strip均无缩放增强/标注，独立读取全部RGBA字节与下列权威原PNG对应裁片相同；只作静态绑定比较，不运行line_bands/counter：

| 实际打开的已有strip | 原source `[x,y,w,h]` | raw PNG SHA256 | 实际观察 |
| --- | --- | --- | --- |
| bottom-left-native.png | `[0,2440,850,100]` | `10814fe72da3e699c6bee2bfb831a525bbd42fdd2dc4239c4e7b31f4bcd64446` | 断续近水平扫描边线与孤墨，无正文/公式/caption |
| bottom-right-native.png | `[850,2440,845,100]` | `0b577d4bc5d9e036cc30365b42a4737162120338f334f4477c428be91d41cf90` | 同一底扫描线延伸及空白边缘小污迹，无教材文字 |
| folio-native.png | `[130,2258,230,90]` | `ef85d7d216cf6bc65caa61fd7c861808d87feceb38ef48cefcbe7ac6bae1f8b9` | 完整34及两侧实心点，未被新框覆盖 |

静态原PNG仍为1695×2580，raw SHA256 `76cac42c4045ebd6e457fb8cc6f6b2ca71069fb8a5d4381a466154181d9da4e0`。current原PNG/grid/layout/template均byte-equal此前作者 `source-10c-p39-p42-evidence/0040/after-finalize/prepared/`，未修改源像素/分段文件。

## 已保存定位与框的范围

只读 `D/diagnostic.json`，没有重新执行诊断或其脚本。该保存结果最后两个band分别为folio y2282–2316、extra y2472–2492，extra横向x20–1647、宽1628。两个bottom strips覆盖0–1695全宽，实际无教材内容，与保存定位的底扫描墨迹一致。不是由“22减21”反推分式拆排，也没有声称发现fraction算法bug。

新唯一count exclusion：

```json
{
  "kind": "scan-artifact",
  "box": [0, 2452, 1695, 128],
  "reason": "Broken bottom scan line at y2472-2492 lies after the complete folio at y2282-2316; both full-width native strips contain no textbook text, formula or caption. Counting copy only; original pixels and all exercise rows remain unchanged."
}
```

全框y2452–2580，处在2580高页的bottom5%（下边5%始于2451）；folio最后2316在框前至少136px。已观察噪迹2472–2492在框内；不是正文mask、手填期望或公式删改。这里只确认保存metadata和源事实的适用性，不声称再次运行margin guard或counter。

## 精确差异

first-failed MD→current diff只有frontmatter以下三处；其余metadata和整个body字节值相同：

1. `/notes/2` 由“101原式为带分数2又1/7乘π……”改为：“101原式在sin后印数字2、紧邻上下分式1/7、再接π；带分数或乘积的语义解析仍未决，字面不增乘号或括号。102为小数2.1π；分式与分角标按实际源字形保留。”
2. `/notes/3` 改为：“首次作者稿未添加计数排除或数学勘误；本次只登记独立源审之后实际定位的底部扫描线计数排除，不改38道题、同排关系或源像素。”
3. 新增上述唯一 `/count_exclusions`。

current JSON对first-failed的完整deep diff同样只有 `/meta/notes/2`、`/meta/notes/3`、新增 `/meta/count_exclusions`。**其余顶层/metadata字段全部deep equal，所有44个blocks完全deep equal。** 不改101源式 `101. $\sin2\frac{1}{7}\pi$.`，不增乘号/括号/结果，不改102或其余36题、不登记erratum。

audit精确deep diff只有：

- `/lines_printed`：22→21。
- `/count_exclusions`：空数组→上述一条。
- `/errors`：原唯一行数不符错误→空数组。

audit `/lines_md=21`、page40、figures空、normalizations空、unknown_chars空、katex_warnings空、errata0均原值不变。audit空unknown不消除本审者101 UNKNOWN。

## 首失败、实际命令与raw绑定

`D/first-failed-triples/` 与 `D/current-triples/` 三文件分别字节相同，且SHA与原Stage B首失败绑定相同。这里的 `current-triples` 是诊断开始前保存副本，**不是本次修后durable current**。`before-handling-hashes.json`内所有保留snapshot及历史source路径raw hash/长度逐项匹配；动态durable旧值由首失败快照和当前diff分别核对，未错误要求修后durable等于旧manifest。

当前durable三文件均与 `D/after-metadata/` byte-equal：

| 文件 | first-failed/current-triples raw SHA256 | 修后durable/after-metadata raw SHA256 |
| --- | --- | --- |
| page.md | `13c53b1c416b525adb57182207eb0ceb7beea80da04c62558dff226d7cfba637` | `bdeb75009ff3212f141e2b518063fbdbc13ca0c7731eda035023712fb44b5202` |
| page.json | `88af1f446cc15852d6a66d4b483840a506744688ccb5a4a5ca3a5f68562e4e29` | `46aab0bb078a5547e709a4aa76936578b2077de376f2fa86a176e4c574c48605` |
| audit.json | `ef7d43a8a1a6af6199ac3f23c16bec0ad4b780bf0e944f7dce09f2b532678aa7` | `557b27c5b11197e92b64ede6a9fc373c7c1bde090e8df9e0949b8ccefca355d1` |

| 其他既有证据 | raw SHA256 |
| --- | --- |
| source-10c-p40-count-diagnostic.md | `b4146ac89d0e592aac8ffd0c96a612822ae7dfbebc54f16a9d45e01608add258` |
| D/diagnostic.json | `f9001c7faa2b31d2023f14e9c3cc40d77f3535b2040ccd99acc157837b99493b` |
| D/before-handling-hashes.json | `1a2a8be8ea7bf25e0e69f4d76e23a6e9ed20a3192299dada44f901efc496d486` |
| D/first-results/finalize-run.json | `9646b65fbf8599696d9d7c9a7c37e3e329a5b13a8b2f48045a76dca6a04b8808` |
| D/first-results/finalize.stdout.txt | `0d6e8d931d3b02f37fe551a352dc37f6859550225383c0f168f21172014ecfa5` |
| D/finalize-command.json | `082f5859c3a3169fea824ca07eae9509f82ae571940bac56bfb992d4714bd931` |
| D/finalize.stdout.txt | `e4870e5dd0d374d5c788ecc38ec05e5f93ab3dd1a651ffb1685cefea829b1c7f` |
| D/finalize.stderr.txt，空 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |

首failed stdout/argv仍记录21MD/22machine及exit1。本次父方保存affected command为 `.claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 40`，cwd本工作树；记录2026-11-16T06:36:29.630Z开始、06:36:30.060Z结束，exitCode0/signal null/error null。stdout实际44块/21行（印刷21）/图0/规范化0，通过。只读该记录，不假称本审者执行。

父方报告说明Confucius完成保存诊断后受50-image模型限制未生成handoff，父方复用已保存结果且实际看条带后登记修复；本报告不编造Confucius成功收尾或新source批准。现存诊断角色与旧FAIL均明确保留。

## 停止

限定affected-only notes/count metadata和当前raw绑定PASS，源数学/101解析仍原UNKNOWN。只写本报告，不改旧source freeze/Stage B/源包/metadata/工具；不重新计行/finalize/test、完整源页审、数学求解、装订/现代/发布/答案/choice、Git/DB/网络/浏览器或其他聊天。停止在本次bounded复核，不开启新gate。
