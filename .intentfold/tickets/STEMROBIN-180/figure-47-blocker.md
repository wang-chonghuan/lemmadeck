# fig-47 独立图审

2026-11-15，STEMROBIN-180短时独立审查者，非fig47作者。一次完整源/全文/全部成图核对。**结论：FAIL，保留作者唯一修复后的render failure，blocked；不批准、不修图、不生成pass review、不晋升。**

## 具体 Finding

**F1，阻断：上排右侧200 mg标签与下一行100 mg三角片的顶点留白不足。** 当前render.collisions明确为`mg200a-label-label`、`200 mg`、CENTER、score=10000。本轮实际打开600px完整图和300/306/480全幅图后核对：该200 mg位于上排方片下方，下一行三角片尖端正对其标签下边，邻近笔画/尖端的安全间距不足，而不是画布底部裁切或字号不足。

当前SVG中该文字anchor=(440,1310)、font-size=36；spec中mg100顶点(440,570)对应SVG屏幕(440,1330)，anchor到尖端仅20绘图像素，还需容纳文字字形下缘、加粗笔画及碰撞留白。不能以anchor本身不同坐标或截图看似读得出，宣称strokeCollision无效。其余标签和最下10 mg均在图内；display字号18/18.36/28.8px通过不覆盖此间距失败。这里是标签布局问题，不是200/100质量值抄错或毫克组缺失。

作者authoring.md记述首轮500 mg碰撞，唯一修复把第一排两caption下移12绘图单位并更新断言，清除原碰撞后留下本项。该历史仅作为已读作者记录，未重新打开不可见的首轮spec/SVG快照，不伪称首轮字节由本审查者验证。当前spec/SVG/render/全部预览保持原样；不给第三轮修复。

## 独立原图全清点

实际打开`ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-47.png`，并逐组核对：

- 左侧开放盒：竖起盒盖、铰链/连接沿、盒壁/厚底和前扣；盖里一件长圆头工具，以及下排约六个凹位、右上三个小圆凹位，不把这些凹位算作额外砝码。盒内可见约六个立式带钮轮廓/暗小件，前窄槽有模糊小片；像素不能可靠读出每个克值或直接证九个立式件。
- 右上另有独立长镊子。右侧八片小砝码都确实存在：500大六边形、两个200大方形、100三角形、50小六边形、两个20小方形、最下小三角形；最后的10数值在源像素中不可清晰辨读，来自当前正文。厚双边是片厚示意，不是重复件。
- 所有可读源数值500、200、200、100、50、20、20均与现代caption匹配，没有把氢/其他内容套入；mg单位及最小10由正文提供，不伪称源PNG逐片印了单位。此图无坐标或计量格，形体面积不是质量比例刻度。

## 完整现代上下文和图件语义

全读`.tmp/ld-s10y-lesson/adapt/6p/modern-us-neutral/lessons/phy6-c3-s10/{lesson,exercises}.template.json`全部正文、图注及4题，图47 relevant authoritativeText逐字保留克/毫克两段。完整读取spec全部对象、assertions、render、当前SVG；实际打开preview.png及preview-300/306/480.png，尺寸600x1900、300x950、306x969、480x1520，没有只看盒或取样某些片。

逐件枚举当前组：

- 九个独立克砝码及caption：100、50、20、20、10、5、2、2、1 g，两组重复件都保留。
- 八个独立毫克片及caption：500、200、200、100、50、20、20、10 mg；500/50六边形，200/20方形，100/10三角形均保留。
- 现代新增九克件可读标签、明写单位与英文组名，依据完整正文而非源可读标签。源左右分组改为上下，克件3x3/毫克片2x4新排列，放大最小片、扁平化盒/阴影已声明；不冒充原图位置、比例或新增17种测量值。
- 前槽模糊片由下方放大组说明，而非再增另一套八片；盖凹位和工具与质量组可区分。图未替某待测物体选择砝码组合，未新增总质量计算或开放问答答案文字；原正文给定砝码组本身不当作违规新泄漏。可见标签英文/数学数字，没有俄文/苏联符号。
- 内容上没有另发现遗漏重复件、错误单位或shape/value配错；这些正确项不覆盖F1。盒与薄片为示意，未声称尺寸按质量比例。该图仍不可放行，且fig46通过不解除phy6-c3-s10阻塞。

本轮官方validate_spec draft实际退出0、errors=[]；当前render为fail，55 objects、19 labels，单项碰撞如F1。源/spec/SVG/render绑定已实际核对一致，失败不是过期哈希；没有改写或重跑render。只使用作者全幅预览与SVG坐标读验，不冒充产品/整课集成测试或新headed碰撞验证。

## 当前实际字节 SHA-256

| 文件 | SHA-256 |
| --- | --- |
| 原fig-47.png | `f7a56fb8c9cc9a50ddca85ad15f2e98414485783b84f507d060623b78617a4aa` |
| phy6-c3-s10/lesson.template.json | `11c106cc6757e3eaae5b63666c60f917cc2827afd566faf39972df36df55f3c8` |
| phy6-c3-s10/exercises.template.json | `beca40f2b9499a38deaef1914509e424faa9f4c77b2d49ca41f7daf4c0cfb3cc` |
| spec.json | `3af20233a503c4c1c9b13ad378b057b0c1e1c59720a629b4b148b7457be9cf1b` |
| fig-47.svg | `3b45b844b739ee35570e37e433b86c1f702d839b95889d61e1e76b26f0bd6070` |
| fig-47.render.json | `6e23e40fe0fc61ec35151cb2256f2b8773865062376b30a8dc0929624371762d` |
| preview.png | `27fd94b26bdf4894f8b2d9fd72a4177366f77218f2e20cefd1fb6cebd73c274f` |
| preview-300.png | `436b4f88c02141486d3688452a85bf2d7f38a5f3c530f10e0a285a64d9d6e4d5` |
| preview-306.png | `9c6ac6d88cfe85982f3262bf0db89cc8c982940b8efa0af96e4cc23e9f4cdedd` |
| preview-480.png | `76f08db020f3a0edc9c417914a6b97165a46d9f8cb905b5948204005d8ea0230` |
| authoring.md，仅读修复历史 | `a134bba01b4713dfc8d6b88809530dfa06cc4163e6920749ac419da871ed6f3f` |

只新增本报告，原failure和作者全部文件保持。不写pass review或继续修复；未读两表、新choice/答案，不网络/.env/DB/Git/消息其他会话。精确模型ID、推理设置、运行agent ID及完整token计量未知。审查到此停止。
