# fig-30 独立图审

2026-11-15，STEMROBIN-180短时独立审查者，非fig30作者。按ld-s10y-image cap4逐源/全文/成图完成一次核对。**结论：PASS，仅当前scratch图件，不批准整课或晋升。**

## 原PNG独立清点

实际打开`ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-30.png`：直立有盖、部分充液的滴液瓶在小车上，底部出口向纸带；两轮和运行面可见。五个旧滴痕在瓶左，当前一个在出口下，不能把纸带最左边框计为滴痕。间距左侧密、到右侧瓶下总体变大，前几小间隔不必从模糊印刷中强断为每个严格增大。上方箭头向右。绳连车右端，经右滑轮转下，钩挂一矩形重物，斜支架、桌沿和右腿完整。没有数字、单位或装置文字。

## 全文和全部尺寸检查

- 全读`.tmp/ld-s10y-lesson/adapt/6p/modern-us-neutral/lessons/phy6-c3-s2/{lesson,exercises}.template.json`全部正文/图注及5问。图30的关键条件是每滴所隔时间相等、滴痕距离不等；spec保留完整相关段，本轮另读前文匀速/变速定义和例子，未读答案键。
- 完整读取spec对象/断言、render，解析当前SVG；实际打开本目录preview.png及300/306/480全幅preview，尺寸600x360、300x180、306x184、480x288，无采样或只看瓶局部。
- 六个点d0..d5同纸带排列，d5正对出口。15/22/32/42/54为现代示意间距且未显示数值；严格增大是原总体趋势的清晰化，不是声称原图给出这些距离、等加速度或每个严格增幅。向右箭头与旧滴痕留在左侧相符。图29的等间距没有误套到本图。
- 瓶盖、液面、底出口、当前落滴、轮子与纸带区分清楚。车右连接环接水平绳，顶端绳与滑轮绕弧相接，右侧竖绳到钩，钩底接吊耳和重物；支架到滑轮、桌腿/桌沿保留。没有断开的悬挂链。
- 三种小尺寸仍可区分六滴及不等间距，最左小间隔点未合并。装置是实验示意，等滴落时间来自正文，不从无标注点间距擅推滴速。未增加速度数值、加速度或待答结论标签，不更改课给实验条件。
- 没有可见text，render.labels=0、字体实测null，不虚称16px字体。无中文/俄文文化标记或答案键内容。新侧视、均净笔画和点位正规化明确是现代整理，不是源测量格。

当前实际官方validate_spec draft退出0，无errors；现有render=pass、32 objects、0 labels、collisions=[]。实际核对源/spec/SVG与render哈希一致，没有修改或重跑render。机械报告不代替上述源/成图比较。未做产品/整课集成测试；所见是作者全幅预览，预览没有单独生产哈希绑定审计，本报告记录实际打开字节。

## 实际 SHA-256

| 文件 | SHA-256 |
| --- | --- |
| 原fig-30.png | `45287e90545bef5c95263b719e4e0a5f9be187423d349a9a71d75e2589d80bb7` |
| phy6-c3-s2/lesson.template.json | `07eec3786b3caa5ff42685f5ed6debd44916d5e0f1f2acea8d92be9e088138d2` |
| phy6-c3-s2/exercises.template.json | `4757b5ae60641f84692e86d3353696d40b99f30d995947f03bf82d55b0429580` |
| spec.json | `d1238f071996e1108241b46ba8041e8b44e1f2015ec04bc46e0113a81f0d1043` |
| fig-30.svg | `c2be854377e58c40884544366e594ca0a8b12a3f9c6b75254c1a0fa2f29bab58` |
| fig-30.render.json | `7587097fec27f4b7238325d6d4e16517f42a9737189228f5040282c28e813192` |
| preview.png | `a40075535a459796c016f5307210c5400e2405736fc5a21ff4f49bbe66ff745f` |
| preview-300.png | `cbc05dfc1de436e492ad8bc3cea378c24c83dac8c496575037201fe9e03bafef` |
| preview-306.png | `221d18fc04ac7406aeb95cc850468de947dc711c74f27b2cc2ac4db2e3829b64` |
| preview-480.png | `16fc9998b86f6d2723feec496e4c5ab0db57f15c5c25a984c6b1ffa5028dd787` |

无阻断发现。只写本报告及可选review.json，不改任何作者图件/模板/工具/durable，不晋升，不读取两表、新choice或答案，不网络/.env/DB/Git/消息其他会话。精确模型ID、推理设置、运行agent ID和完整token计量未知。
