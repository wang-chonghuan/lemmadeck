# N61 独立答案作者报告

2026-11-20，同一 STEMROBIN-188 / 188-6 限定工作，全部写入 `n61-answer-author/`。
从既有模板及当前现代源独立求解 206–215；没有重 prepare，也没有读取其他作者、旧答案、旧审证或聊天消息。全部答案 `source=derived`。

## 候选与验核

- FIRST：`work/9-10g/modern-us-neutral/lessons/geo910-c2-s3-n61/answer-keys.candidate.json`，15767 bytes，`0444`。
  SHA256 `f143fe03dcafc8c758fcd0c37c20825b2abecd48e3f8fb5fc4b20acd7dd2a660`。
- 首次结构通过，Parse 失败：208(2) 的 `Q(...)` 被 ComputeEngine 推断为函数，继而使同一引擎中的 212 公式受污染。失败记录在 `verification.first.json`，FIRST 未改。
- 可写后继：同目录 `answer-keys.candidate.v2.json`，16386 bytes，`0644`。
  SHA256 `60d5c4de1cdb8f01fcf25a0125939b409864bf21e7735f4094179e85148bcf0d`。
- 后继只在 208(2)、212 公式的 expected 补显式乘号；推理与数学内容不变。结构及 25 项 Parse 均通过，记录在 `verification.v2.json`。
- 8 题 auto，206/207 ungraded；25 parts 为 18 numeric、7 expression、0 exact。每项标签和单位具体。仅做最小结构、Parse/有限实数验核；没有正式 finalize、MathLive 键盘验证、发布或候选选择修改。

## 具体计算与限制

| 题 | 结果及关键限制 |
|---|---|
| 206 | 轴截面等腰三角形；内部平行截面圆面；过顶点平面切穿底圆面才有三角形，相切仅母线段，未切到底圆面仅顶点。 |
| 207 | 无对称中心；一条 SO 旋转/半周对称轴；无穷多个含 SO 的镜面对称面。明确三维轴术语，不混作平面对线反射。 |
| 208 | 底面积 $\pi l^2\sin^2(\varphi/2)$；轴截面 $\sqrt{Q(\pi l^2-Q)}/\pi$。非退化第二问要求 $0<Q<\pi l^2$。 |
| 209 | $H=R\tan\alpha$、$d=H\cot\varphi$，弦半长 $\sqrt{R^2-d^2}$，三角形高 $H/\sin\varphi$。面积 $R^2\tan\alpha\sqrt{\sin^2\varphi-\tan^2\alpha\cos^2\varphi}/\sin^2\varphi$ 适用 $\alpha<\varphi\le90^\circ$。相等时仅母线段，小于时仅顶点；两者平面面积 0，但二维三角形不存在。$\varphi=0$ 不符合题设平面相交。 |
| 210 | $l=\sqrt{13}$ m，总料 $1.10(3\pi\sqrt{13})$ m²，每张 0.98 m²，商 38.1425226706，向上取整 **39 张**。10% 基数依题面为屋顶面积。 |
| 211 | 两锥侧面之和：1) $\pi a^2(3+\sqrt3)/2$；2) $\pi b^2\cos(\varphi/2)/(2\sin^2(\varphi/2))$。不加内部共用圆盘。 |
| 212 | $\sqrt{2\pi QS/\sin\alpha}$；28°42′=28.7°，约 **50.1592051771 cm²**。存在条件 $\pi S\tan(\alpha/2)\le Q<2\pi S/\sin\alpha$，给定值满足。 |
| 213 | 1) 母线 10 cm，侧面积 **120π cm²**，全面积 **224π cm²**；2) 半径 $h/2,3h/2$，母线 $h\sqrt2$，表面积 $\pi h^2(2\sqrt2+5/2)$。 |
| 214 | 高 $6\sqrt3$ cm，半径 2/8 cm，母线 12 cm，表面积 **188π cm²**。 |
| 215 | 1) 母线 5 cm，外/内展开半径 25/3、10/3 cm，外/内弧长 10π、4π cm，共同角 **216°**。2) 母线 $4\sqrt{37}$ cm，展开半径 $14\sqrt{37},10\sqrt{37}$ cm，弧长 28π、20π cm，角 $360/\sqrt{37}$ 度。普通水桶按大口开口、小圆封底，材料 $\pi(24\sqrt{37}+25)/2500$ m²，约 **0.214867722492 m²**。 |

完整独立推导在两份候选的 `displayAnswer`；候选前的纯数值核算见 `calculation-results.json`，脚本没有生成推理。

## 图 88 实际查看与用量

实际查看原 PNG、当前现代 SVG 的本次 headless 截图、当前 FigureSpec。原图与现代图均为环形扇形、实线两边、虚线共顶点和相切大小底圆，均无尺寸标签。Spec 的示意半径 2.4/4.2 及带宽 1.8 不用于题目取值。图上两底圆是一般圆台全面积示意，不能因此给开口水桶多算一块大圆板。

一次批次：上下文图像实际加载 2 次，另保守计 headless SVG 渲染 1 次，共 **3**；无重开、crop、源页或 83–87。父基数 **15** 不清零，保守累计 **18≤24**，批次 **3≤8**。没有接收或返还父图像载荷；父无需复看整批。

浏览器隔离 headless、外部请求全部阻断且已关闭。未读 `.env`、DB、网络模型、付费、安装、发布、Git、Plane；未改题面、图、索引或候选选择。

`output-index.json` 只列本作者实际产物的绝对路径、sha256、bytes、mode，不列模板及目录外输入；索引自身哈希由最终文字交付。
