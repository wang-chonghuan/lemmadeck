# 彩图I上图 tbl-p0005-01 独立复审

日期：2026-11-15。STEMROBIN-180既有短时独立审查者；不是图件作者。

## 结论

**FAIL，不批准晋升，不进行第二次修复。** 四容器、一滴和定性稀释关系的实质核对未发现遗漏或物理反转，但当前第二版仍未通过标签与容器底边的碰撞门禁。结构validate通过不代表render或独立视觉审批通过。

## 实际打开及完整正文

根目录：`/Users/yong/.codex/worktrees/0f12/lemmadeck`。

先实际打开源PNG `ssot-resources/soviet10year-textbooks/artifacts/6p/figures/tbl-p0005-01.png`，再完整读取 `ssot-resources/soviet10year-textbooks/artifacts/6p/editions/modern-us-neutral/lessons/phy6-c2-s2/lesson.json` 全部正文，并读当前spec、SVG、render。实际打开 `.tmp/s10y-image/tbl-p0005-01/browser-preview.png`，未把作者预览或render状态作为源保真的替代证据。

独立headed Chromium从当前SVG原字节构建仅在内存中的HTML，应用 `--ld-figure-*` 语义CSS；实际看完900px全图及声明的300/480/640/720px完整图，又以纯灰度CSS查看全图。截图只在内存显示，没有写入图文件或修改SVG。完整图及最右圆框均在视野内，无横向遗漏。另实际查看 `review-history/rejected-1/tbl-p0005-01.svg` 全图，读取第一次spec/render，与当前版逐字段比较。独立浏览器已关闭。

现代正文包括压缩、图11加热/冷却空气、图12钢球与环、图13液面升高、粒子间空隙的假说及实验检验，以及完整反复稀释段和最后均匀带色溶液/每滴仍含颜料粒子的论证。spec的authoritativeText覆盖后两段，不只是“越来越浅”的前半句。这里按本课定性模型理解小粒颜料可分成许多极小粒子，不把颜色明暗换算成粒径、计数或浓度测量。

当前现代lesson.figures只有fig-11/12/13，未收录新增彩图上图；其source快照也不是增长后源的完整现行清单。本审查不批准现代课整体完整，不读取或重绑旧§8选择题快照，更不把旧题审重记为pass。

## 逐组独立核对

| 源组/关系 | 原PNG实际观察 | 当前完整SVG实际观察及判断 |
| --- | --- | --- |
| 容器a | 左起第一个直立容器，深色液柱，上方留白，完整边界和底足；源无a标签 | 有一个完整直立轮廓、均匀深色液柱和留白。底部标签a为声明的现代添加。语义一致；标签边界碰撞不通过。 |
| 容器b | 第二个直立同类容器，仍带色、上方留白，无数字 | 完整轮廓及较浅均匀液柱。a到b的定性变浅与正文一致；b字形上端贴到底边，布局不通过。 |
| 容器c | 第三个直立同类容器，仍带色、上方留白，无数字 | 完整轮廓及进一步变浅的液柱。仍有可见颜色，不暗示颜料消失；标签包围框与底边相交。 |
| 容器d | 第四个直立同类容器，仍有浅色液柱、上方留白，无数字 | 最浅液柱在300px仍可辨认，均匀着色；d字形上端贴到底边，布局不通过。 |
| 右侧一滴 | 一个圆框内一个尖顶圆底色液滴，不是多个粒子点 | 一个完整圆框内恰好一个液滴，尖顶朝上，全部在框内；旁列英文Dye。没有额外液滴、粒子点或分子模型。语义一致。 |
| 组间关系 | 四容器并列，右边独立液滴；源不给精确浓度、液量、次数倍率 | 同类轮廓、等示意液面及左深右浅为现代说明性规整化，spec已声明；没有刻度、浓度数字、比例、转移箭头或测量声称。不是图16的界面扩散三阶段。 |
| 文化与泄漏 | 原扫描的老书背景及颜料色不属必要文化内容 | 无汉字/西里尔字母、徽号、人物身份或文化符号；可见a/b/c/d/Dye是英文标签。没有选择题答案或粒径数值；一滴不是一个分子或物理尺寸标尺。 |

原PNG的四液柱并非可定量读取的校准色阶。现代色阶由正文反复稀释支持，不声称复制源给定浓度；opacity 0.85/0.6/0.4/0.22是绘图参数，不是溶液浓度、稀释倍数或四个源测量值。无独立数学题数值可计算。

## 四处碰撞与一次修复轨迹

当前render明确列出 `label-a-label`、`label-b-label`、`label-c-label`、`label-d-label` 四处碰撞，均CENTER、score10000，整体status=fail；Dye没有被报告碰撞。900px独立浏览器读取四个文本实际包围框的纵范围均约304.97至360.97px。四容器底边中心在313px，3px描边覆盖约311.5至314.5px，且横范围包含各自标签，故四个文本包围框确与底边交叠。实际字形b/d可见贴边；a/c字形自身较矮，不把“包围框碰撞”夸大为四个字母每一笔都穿过线。

四个标签底部都小于380px，Dye约333.97px，当前不是画布裁切。300/480/640/720px完整图缩放后仍保留同一贴边关系。render字号检查分别约16.6653/26.6653/35.5551/40px，全部通过；大于16px不能消除碰撞。

第一次spec/render/SVG仍完整保存在 `review-history/rejected-1/`，没有覆盖或改写。第一次render同样四处fail。逐字段比较表明唯一修复是a/b/c/d位置的用户坐标y从34改为43，SVG屏幕中上移9px；其他spec字段不变。第一次浏览器包围框约313.97至369.97px，也在380px画布内，原失败不能据此解释为底部裁切。上移使当前标签包围框更深入底边区域，并未解决布局门禁。一次修复机会已经使用，第二版维持FAIL并停止。

## 真实SHA-256

以下均为实际文件字节的Node SHA-256，不是猜测、伪造或canonical JSON digest。

| 文件 | SHA-256 |
| --- | --- |
| 源 `artifacts/6p/figures/tbl-p0005-01.png` | `f9526086d4fa60eef3789c6fa8f32da764d8045dfe934d4fff2109a8a3fcdfe3` |
| 当前 `tbl-p0005-01.spec.json` | `213c0a06e954a9772cfa983ac67b28bc44196f2d5c774af1169664644f33491b` |
| 当前 `tbl-p0005-01.svg` | `7033bc6e5a57b6c70bca63faa19c327aaa1bf8bf36d7aefe02a67bd6f16ef54a` |
| 当前 `tbl-p0005-01.render.json` | `3dbb14d7a444e11b5570c49824fc22745a4ef4124d5f2d0f024ded1749f147bd` |
| 当前 `browser-preview.png` | `32576c1fca60abb1b396246a808ba2712a482df36d1be0f1df7b89df39a35696` |
| 完整现代§8 `editions/modern-us-neutral/lessons/phy6-c2-s2/lesson.json` | `be4cf1bf923c0cfa2b1b6de7ecc3ab04ff6830d731db2aed0e0b9cc96ea30d9f` |
| 第一次 `rejected-1/tbl-p0005-01.spec.json` | `fa602004e3a54ac2a73a90445eccce38c8bf8cbec01fc75ed161858fe4ff5b8e` |
| 第一次 `rejected-1/tbl-p0005-01.svg` | `9642afa15abd5fb8a35468a6a51559eac5b637388b7b156ff110a1088691a5e1` |
| 第一次 `rejected-1/tbl-p0005-01.render.json` | `ed3da65c5f27397cd43fee0695a4e362ec0491827192949f5b221a6804275182` |

## 实际校验与记录

已运行 `python3 -B .agents/skills/ld-s10y-image/scripts/validate_spec.py .tmp/s10y-image/tbl-p0005-01/tbl-p0005-01.spec.json --stage rendered`，退出0，结构PASS。render保持FAIL，不重渲染以寻找放行结果。通过现有 `record_review.py --status fail` 记录当前源/spec/render/SVG的hash-bound `tbl-p0005-01.review.json`；脚本成功表示失败证据记录成功，不表示图审批通过。

精确审查模型ID、推理档位和完整模型token计量不可观察，明确未知；工具输出的局部token计数不等于模型总用量。没有生成图、编辑spec/SVG/模板/源、查看答案或其他会话、修图或晋升，也没有操作图15/17。
