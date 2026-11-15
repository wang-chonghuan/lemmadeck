# fig-50 独立图审查

结论：**PASS，仅下列绑定snapshot的图级审查，不是晋升或整课批准。**

审查者：Codex independent reviewer，非Ramanujan图作者。2026-11-15。

## 最终稿与权威上下文

先读author-handoff.json、author-preview.json、author-notes.md确定本次交接文件。它们保留`draft`生命周期状态，但作者工作已最终交接，剩余门禁明确只有独立审查及晋升；本结论不批准仍在编辑的pending稿。独立核对handoff与preview的20项当前文件哈希全部一致，并核对当前完整s15正文、cap及四题与spec.authoritativeText逐项完全一致。历史generation-time模板哈希不冒充当前哈希。

权威模板：

- `.tmp/ld-s10y-lesson/adapt/6p/modern-us-neutral/lessons/phy6-c3-s15/lesson.template.json`：`6220965c96d575ebfc474309626cd54ea94605703c43f4f5c4bb73d021cadae8`
- 同目录`exercises.template.json`：`794143435f24a4a53d42bad7e37effa574dd172b4ed9c26f2ba06787223962c4`

相关正文是人推斗车使其开始运动；四题没有额外图数值或要求。不读答案键，不从其它课补造数据。

## 独立像素库存与覆盖

完整逐张打开原PNG：`ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-50.png`。

原图实际有：右侧一个完整戴帽人，面向左、上体前倾、双臂伸向车右上缘、一前一后两腿及鞋；左侧一个上宽下窄的斗车，完整上缘/斜侧/底部，下面两个可见轮；手与车缘接触；轮与脚在一条水平地线上；车上缘附近一支向左箭头。无数字、标签、刻度、载荷或第二子图。

最终`artwork.png`单独全图已打开：完整人/斗车/两轮/双脚/地线保留，手在车右上缘接触，不是拉车、坐车或隔空推。衣服自然现代配色，不加制服、旗徽、品牌。源库存逐项映射到`source-scene`；不是用one-artwork-layer数量断言证明图中人数/轮数。

最终`fig-50.svg`在只读Playwright内存中以640实际CSS媒体宽度打开：仅一支水平左向箭头，未让image模型写方向。其`connects`及`displacement(dx=-400,dy=0)`对应原方向；坐标是现代注册，不是原书给定长度。

另将当前独立artwork与overlay现场组合，分别实际查看640/306宽度，不依赖作者缩图或预先flattened composite。完整场景均可辨识、无裁切/错位，箭头与车不冲突。图无文字，16px合同保留，实际最小文字值为null，不能虚称测得16px。

## 只读复验与证据

当前spec以`validate_spec.py --stage rendered --json`复验PASS。render的spec、artwork及SVG哈希与实际文件一致；CSS语义色及`xMidYMid meet`保持分层/aspect ratio。没有图片内文字/数字、文化符号或答案注释；未检查/批准应用、整课、出版或DB。

本审查的媒体截图只在内存中显示，没有新增截图/preview文件。现场度量如下：

| 宽度/层 | 实际mediaWidth | 图像载入 | 文字数 | overflow | 内存PNG SHA-256 |
| --- | --- | --- | --- | --- | --- |
| 640 overlay | 640 | 不适用 | 0 | false | `1e1e21c6b002e1b52fe2a6a0aec507d41bfd6911ccafa3a0c6a9573aed319926` |
| 640 composite | 640 | true，1536×1024 | 0 | false | `79e9629a825c78ea3e932cc8e091f8d07b214bc87aaf166919493b1d00bb536b` |
| 306 composite | 306 | true，1536×1024 | 0 | false | `fb3364d9db859c166226f608dd53da4d0a6b911cdcda45364997ca3b39e39c2d` |

核心文件字节哈希：

| 文件 | SHA-256 |
| --- | --- |
| 原PNG | `e938567a51bf8fb034b331b895a5e644b6e61a0f8b677b467db53d01db12329b` |
| spec.json | `b55f65d0002127088b63e8ac4a1afea214198903f43bdb230dfd6d53f010ba9a` |
| source.inventory.json | `63c978edb05cdf58a339ca65c78c628e8572b29b81d76efea716dfd07f6c8a74` |
| artwork-opaque.png.json | `504a938ff1823c693323ec064d5ec35300edc4372477463cfaa0c53354d316e7` |
| artwork.png | `44f4fd56823c5ad8d3403dc12a0ab15f32d722ee119c708dc5ca5876e83a0d29` |
| fig-50.svg | `efc582d4feff191912b934f1fd76f7df466eeea806e044533d92258e73690222` |
| fig-50.render.json | `7374e7c39868671c71c971063554038f205332cbe62b5f28cca3b7302319e13b` |
| author-preview.json | `faf97068a2518ed392b81cc9d993ff224e59c4aebc3422dcc39c7516abc14193` |

review.json由`record_review.py --render fig-50.render.json --status pass`写入，绑定当前源/spec/render/两层输出，并在notes引用本报告哈希。本次无生成调用、无修复；作者记录1次Azure调用，0次修复。本图唯一新增写集为independent-review.md与review.json；不改作者产物、不晋升。
