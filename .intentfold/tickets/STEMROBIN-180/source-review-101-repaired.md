# 6p Page 101 Affected-Only Repair Review

## Outcome: PASS For The Affected Source Unit

日期：2026-11-15。审查者：Codex，非101页作者。

本次仅复核首FAIL的`p0101#7`第1体行`停止→停住`修复，并只读比较首snapshot以确认没有其它源文字、标记、图框或审计变化。当前md/JSON已与实际源PNG局部一致，未发现该单位仍有缺陷。

原首FAIL报告`.intentfold/tickets/STEMROBIN-180/source-review-101.md`不修改、不覆盖；原报告SHA-256仍为`54ea70302086350e8e8927791fd9e7ff325da74cf47db66ca46983365701ed45`。其余已审101页源事实仅复用该报告，不重做全页审查。本报告不涉及104页或任何装订、现代图、课程及答案传播。

## Actual Affected Pixel Check

仅重看原PNG坐标`[535,1280,195,56]`的疑字局部，4倍最近邻内存放大实际显示“车停住的”，其中“住”为`亻+主`。未显示101整页、grid或图78，不保存新裁图。

当前`ssot-resources/soviet10year-textbooks/artifacts/6p/pages/0101/page.md:73`：

```text
在刹车时使汽车停住的是摩擦力，而若没有静摩擦力，汽
```

当前`page.json:134`、`blocks[6].lines[0]`为完全相同的字符串，与源局部符合。原印刷第15行的行界、后半句、标点均未改变。

## Read-Only Snapshot Diff

首snapshot：

`.tmp/ld-s10y-lesson/6p/pages/0101/failure-01-stop-word/`

实际目录仅有`page.md`、`page.json`、`audit.json`；其字节hash均与原首FAIL报告绑定文件一致，故它确实保存了被拒绝的版本。

分别对首snapshot与当前持久页文件执行只读`diff -u`：

- md：恰有1行差异，在第73行仅`停止`改为`停住`；没有其它正文、frontmatter、换行、空格或块头差异。
- JSON：恰有1行差异，在第134行、`blocks[6].lines[0]`仅同一字替换；所有其它字符串、块类型、`open/cont/samerow`、源hash、图身份及框均不变。
- audit：无差异，exit 0；不是仅行数相同，而是文件字节完全相同。

唯一文本差异：

```diff
-在刹车时使汽车停止的是摩擦力，而若没有静摩擦力，汽
+在刹车时使汽车停住的是摩擦力，而若没有静摩擦力，汽
```

因此初审已确认的页首粗体跨页、图题同排和末段open事实可以复用，不需重新打开整页源。没有运行作者finalize或任何测试来替代上述diff及局部像素。

## Figure 78 Preservation Evidence

首snapshot及当前页JSON/MD/audit中的图框均为`[1025,1573,195,343]`，半开像素范围`[1025,1573,1220,1916]`；图身份`fig-78`、图题和`samerow`标记无差异。当前原PNG字节hash与首轮绑定值一致：

`7cb99784f687f8034d5b8ca92fc6855bd424f5421ff22bae1d03e566525df1c2`

只读检查实际页级裁图：

`.tmp/ld-s10y-lesson/6p/pages/0101/figures/fig-78.png`

- 当前PNG为RGB、`219×367`；精确源框本身是`195×343`。差额是四周各12px纯白边，不是改变精确框或截掉胎图。
- 取当前PNG内框`[12,12,207,355]`，与未改变原PNG按首snapshot精确框取得的RGB像素比较，差异外接框为`None`，即逐像素完全相同。
- 两者RGB核心像素SHA-256同为`c1284148e3e64b9e6ef15b987c3e08dcee4cd489bb2d87c8e19d772132099349`。
- 给该首轮绑定源框的像素加四周12px白边后，与当前PNG整幅RGB逐像素比较，差异外接框仍为`None`。
- 同一重建图仅在内存编码PNG，所得文件SHA-256为`3cade476445468af918409000b9a62947d343331a131cf98d687584985e34b1e`，与当前实际PNG文件字节hash相同。没有保存、覆盖或重生成页级裁图文件。

**证据限界：** 首snapshot没有保存图78 PNG，也没有单独的旧裁图文件hash，故不能声称执行过“旧PNG文件与新PNG文件”的直接`cmp`。上面的结论是当前PNG与首轮绑定的、不变源PNG及不变框确定性重建结果一致，明确证明源胎图像素/框未漂移；不是凭作者报告假定历史PNG文件字节不变，也不把当前hash冒充实测旧文件hash。

图78完整轮胎与图题隔离的视觉事实复用首审，不重复整图或现代图审查。

## Snapshot Hashes

以下均为实际文件字节SHA-256：

| 文件 | 首FAIL / 首snapshot | 当前 |
| --- | --- | --- |
| `page.md` | `413af1e04d866120d00fca98d71070322cff2a65ea2ec152a1f442c49e787afe` | `b752a9d08e7fc2fd11804ab855d33df3b69339fe8c427a48f080c520e29dd766` |
| `page.json` | `b9b9c3fe24e221cf199e8e7510d5a281508de64b29c1f22aaca7f0adc34ca272` | `ee9f5d866c9dc8b487024505a20e7971e925395a791404d43479ace7f0e3e91c` |
| `audit.json` | `61b30bbe71b5e2283986ad63378e76bfa419ddd9c883b55bc485438d8b8ebddd` | `61b30bbe71b5e2283986ad63378e76bfa419ddd9c883b55bc485438d8b8ebddd` |
| 原`page.png` | 首FAIL绑定`7cb99784f687f8034d5b8ca92fc6855bd424f5421ff22bae1d03e566525df1c2` | `7cb99784f687f8034d5b8ca92fc6855bd424f5421ff22bae1d03e566525df1c2` |
| 页级`fig-78.png` | 未存历史文件；上述首轮源绑定重建值`3cade476445468af918409000b9a62947d343331a131cf98d687584985e34b1e` | `3cade476445468af918409000b9a62947d343331a131cf98d687584985e34b1e` |

字节hash通过`shasum -a 256`取得；像素/重建hash只读源PNG及当前裁图，在内存用共享Python/Pillow计算。没有修改源、audit、图框或图文件。

## Scope Closure

当前唯一被修复单位通过，首失败及首snapshot保留。未读取100页上下文或任何102/103页；未重审101整页；未读答案、choice或现代图作者文件。

用户说明尚未assemble，本次不做传播复核，不声称传播已通过。未运行finalize、assemble、vectorize、测试、DB、Git、应用、发布或外部服务操作。

此affected-only任务写集仅新增本报告。没有实施第二次修复或撤销任何他人改动。
