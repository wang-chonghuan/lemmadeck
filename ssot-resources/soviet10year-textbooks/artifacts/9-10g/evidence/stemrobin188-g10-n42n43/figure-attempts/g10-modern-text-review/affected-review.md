# 188-6 / N42 元数据修项收口

**status: pass。仅 `/prose/8/changes`；不是新的35项语义审查、源审、图审或整课批准。**

已核对当前 N42 `lesson.template.json` 中该字段由 `[]` 补为 `["layout"]`。只在内存中将这10个ASCII字节还原为原2字节 `[]`，完整模板即重新得到首次审查绑定的 SHA256；另以解析后的对象确认只改该字段即可与当前对象相等。没有改写候选文件，也没有用整份JSON重排版比较代替字节证据。

- 原模板 SHA256：`11058459b1f1c04bf85be90c32773e0fefeec3790a49441135085894b7fb296e`，18195字节。
- 当前模板 SHA256：`e1fc3a3a0d7ac2ec40fd19eed7bd47758007daf345dde676e50ca67b8c200377`，18203字节。
- 唯一替换从零基字节偏移5203开始，净增8字节。正文、公式、source、断点及其余所有字节由原完整模板哈希证明未变。

唯一发现 `N42-P8-MISSING-LAYOUT-DECLARATION` 收口为 pass。原已通过的文字语义判断沿首次 `review.md/json` 的哈希绑定复用，不重复35项、原源FIRST或原图PASS。其他三份模板本轮不重读，亦不作新批准。

首次两份报告未改动：`review.json` SHA256 `5bcde3a407e46d639f8fe59f8f4bdbb32146bb53ccabc995b3d896469544e24e`，顶层仍为 `revise`；`review.md` SHA256 `39ed892c21f243daea7838c09a11340424f5b1ac6281e109a6bae06f676b0981`，首次REVISE原样保留。完整路径、当前绑定和执行说明在 `affected-review.json`。

本轮图片加载0、打开尝试0、paid0、候选修改0；全部exec显式使用指定worktree cwd。只用apply_patch新增本目录的这两份报告。第一次只读检查误假设整个模板为统一JSON缩进而exit1，属于审者方法错误；改用唯一source_text锚定的字段字节替换后exit0，没有候选缺陷、内容修订或图片加载。未运行adapt-finalize/render、源/图复审、全项目防线、Git修改或任何外部操作。
