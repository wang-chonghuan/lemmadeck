# fig-29 独立图审

2026-11-15，STEMROBIN-180短时independent reviewer。本图由另一作者制作，本审查者不是fig29作者。按ld-s10y-image cap4完成一次完整核对。**结论：PASS，仅当前scratch图件语义/视觉审查；不批准整课或晋升。**

## 实际原图观察

实际打开`ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-29.png`。一辆薄平台小车，两只可见轮，直立有盖/肩部的部分充液瓶，底部出口；纸带上的当前滴痕在瓶下，另五个已留下的滴痕在右侧，大致等距。上方箭头向左。车左端有连接环/绳，水平绳到桌左侧滑轮，绕向下方，钩接一块矩形重物；可见斜支架、厚桌面、侧沿和左桌腿。原图没有装置名称、时间/速度/质量数字；滴痕不是轨道边框或轮子。

## 全文、装置和实际预览

- 完整读取`.tmp/ld-s10y-lesson/adapt/6p/modern-us-neutral/lessons/phy6-c3-s2/{lesson,exercises}.template.json`：全部正文、图注和5问。当前spec的authoritativeText保留图29等时间滴落及再次开大滴液开关的完整相关段，未把这两个条件删成只凭等距点判断。
- 完整读取spec/全部对象及assertions、render，并解析当前SVG。实际打开同目录`preview.png`及`preview-300.png`、`preview-306.png`、`preview-480.png`，都是完整图幅，尺寸分别600x360、300x180、306x184、480x288。
- 瓶、液面、出口贯穿平台、两轮/运行面/纸带都可区分。六个滴痕保持同一直线；d0在出口下，d1..d5向右等距，与向左运动留下旧痕的方向相符。绘图等距34是明确现代示意坐标，不声称源提供34长度单位。扁平侧视、纸带/轮分离是已声明现代整理。
- 实际图与坐标同时核对车端连接、水平绳、滑轮顶端切向过渡、外侧竖绳、钩下弧与重物吊耳接触。左支架通向滑轮，桌/腿保留；未出现绳直接穿过轮心或重物悬空断开。
- 正文的结论以等时间滴落和观察到等间距为条件；图并不证明任意悬重拉车都会匀速，不擅补无摩擦/恒加速度条件。开大开关后的更短等时间间隔来自全文，本图不是另画第二次实验，也不冒充测得时间或匀速的普遍动力学证明。
- 三种小尺寸仍能辨认滴痕、轮、绳、钩和运动箭头。图无text标签，render.labels=0、measuredMinPx=null；不能声称实际测到16px文字。没有新增答案术语、计算值或中文/俄文文化标签；原实验的等距数据属于教学内容，不是新答案泄漏。

当前官方`validate_spec.py --stage draft --json`实际退出0，无errors；已读取的render为pass、32 objects、0 labels、collisions=[]。原PNG/spec/SVG与render引用哈希已实际核对一致。没有重绘或重跑render，机械pass不作为上述实质核对的替代。未进行产品/整课离线集成验证；只读作者全幅预览，未伪称新headed产品测量。预览无单独生产哈希审计，下面绑定的是实际打开的PNG字节。

## 实际字节 SHA-256

| 文件 | SHA-256 |
| --- | --- |
| 原fig-29.png | `50f11d4acd72e7a39c3043f72a89f073a87b8398ac218a1abf98f74b598b8745` |
| phy6-c3-s2/lesson.template.json | `07eec3786b3caa5ff42685f5ed6debd44916d5e0f1f2acea8d92be9e088138d2` |
| phy6-c3-s2/exercises.template.json | `4757b5ae60641f84692e86d3353696d40b99f30d995947f03bf82d55b0429580` |
| spec.json | `c2d2efdb6c075d57a90bab5a96507b2be23ddb4af0ea585434baa53e468b3b28` |
| fig-29.svg | `56d17409ec30296206580779490bdf3f4b579b05c621467a42fbba144e3376e4` |
| fig-29.render.json | `ae89b998fef9778d1aeb1a31e22cb9ef34c2af9f9a9aa62801a89d589433c4aa` |
| preview.png | `92b1961f2b18f95fdaf7fa1ed0d9ffccbb24695619a11446020289c7c5a53d99` |
| preview-300.png | `85e9af8f14c741657d1bd8a7a94e82ee972e04451c700a77036e8d088112b2be` |
| preview-306.png | `ceb0995351961260c49eeb3a3e5d796907d7765601be75e2d65595d307f23b50` |
| preview-480.png | `0c5093c4b3fd0c62261c92efdb7f37e7f87df8311ea80fc379016a41fb333971` |

未发现阻断源保真/装置/实验语义缺陷。只写本independent-review及可选hash-bound review.json；未改源、spec、SVG、render、预览、工具或durable，未读取本审查者作者的两表、choice或答案键；不晋升、不网络/.env/DB/Git/消息其他会话。精确模型ID、推理设置、运行agent ID和完整token计量未知。
