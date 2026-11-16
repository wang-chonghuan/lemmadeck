import assert from 'node:assert/strict';
import { author, flow, freeze } from './d021-prose-text-utils-20261116-a.mjs';

const phase = process.argv[2];
if (phase === 'author') {
  author(84, (lesson, exercises) => {
    const texts = [
      String.raw`用近距作用的观点描述静止带电体，可以把它们的静电相互作用能归于电场。
在有电介质时，这种储能的描述也包括介质可逆极化所对应的能量，不是带电体全部能量的总和。
在适当的介质模型下，储能便能用电场的主要性质，也就是电场强度来表示。`,
      String.raw`先考虑理想平行板电容器：忽略边缘效应，板间的电场近似均匀。
板间是真空，或均匀、线性、各向同性、无色散且损耗可忽略的电介质，介质性质与极板几何形状保持不变。
把电容表示式(8-38)代入公式(8-43)的最后一个式子，再用$|V|=Ed$把公式(8-43)中的电势差换成场强，得到`,
      String.raw`$E_P=\frac{CV^2}{2}=\frac{\varepsilon_0\varepsilon S}{d}\cdot\frac{E^2d^2}{2}=\frac{\varepsilon_0\varepsilon E^2}{2}Sd.$
(8-44)`,
      String.raw`这个理想模型中，电场主要占据两极板之间的体积$Sd$。
用这个体积除(8-44)式的总储能，便得到单位体积的能量，也就是能量密度：`,
      String.raw`$\omega=\frac{\varepsilon_0\varepsilon E^2}{2}.$
(8-45)`,
      String.raw`在原书同时介绍的静电单位制中，同样的能量密度关系写为`,
      String.raw`$\omega=\frac{\varepsilon E^2}{8\pi}.$
(8-46)`,
      String.raw`表示式(8-45)和(8-46)不仅可用于平行板间的匀强静电场，也可逐点描述非匀强静电场的能量密度。
但它们的适用范围是真空，或线性、各向同性、无色散且损耗可忽略的介质；不能把这一结论理解为对任何材料都成立。
对于交变电场，在同样的介质条件下，可以用瞬时场强计算电场部分的瞬时储能密度。
交变电磁场还可能具有磁场储能，必须另外计算磁场部分，不能把上面的电场表达式当成全部电磁场能量。
遇到有色散、非线性或显著损耗的介质，不能直接套用这两式。`,
    ];
    assert.equal(texts.length, lesson.prose.length);
    texts.forEach((text, index) => {
      lesson.prose[index].text = text;
      lesson.prose[index].changes = ['wording', 'layout', 'scope'];
    });
    assert.equal(lesson.errata.length, 1);
    assert.equal(lesson.errata[0].target, 'exercises[0]');
    assert.equal(lesson.errata[0].source.block, 'p0207#8');
    lesson.errata[0].corrected = String.raw`$C_1=\frac{\varepsilon_0 S}{x}$`;
    exercises.exercises[0].text = String.raw`1. 平行板电容器两极板的有效面积为$S$，板间距离为$l$。
在两板之间平行插入厚度为$d$的金属板，求插入后的电容，见图160。
采用理想静电模型：金属板最初不带净电荷，插入后保持电浮置，不接地、不接电源，也不接触任何极板。
金属板完全覆盖两极板的重叠区域，两侧间隙都是真空，忽略边缘效应，金属板厚度小于板间距离。
解：静电平衡时金属板内部没有电场，浮置且净电荷为零的金属板两面感应出大小相等、符号相反的电荷。
这样，带有金属板的结构可以等效为两个串联的电容器，各自对应一侧的真空间隙。
第一个电容器的电容为$C_1=\frac{\varepsilon_0 S}{x}$，其中$x$是一个极板到金属板的距离，两侧间隙都必须保持正值。
第二个电容器的电容为$C_2=\frac{\varepsilon_0 S}{l-d-x}$。
根据串联关系，
$\frac{1}{C}=\frac{1}{C_1}+\frac{1}{C_2}=\frac{l-d}{\varepsilon_0 S}.$
因此，总电容为
$C=\frac{\varepsilon_0 S}{l-d}.$
在这些条件下，电容与金属板沿板距方向的位置无关，但取决于金属板的厚度。
当金属板厚度趋于零，即$d\to0$时，电容趋于未插入金属板时的值。
原书所说的“保持不变”指这个零厚度理想极限，不能理解成任何有限厚度的薄金属板都完全不改变电容。`;
    exercises.exercises[0].changes = ['wording', 'layout', 'scope', 'math-correction'];
    exercises.exercises[1].text = String.raw`2. 两只电容器的电容分别为$C_1=1$微法拉和$C_2=2$微法拉。
连接前，它们的电压分别为$V_1=300$伏特和$V_2=150$伏特。
把正极板与正极板相连、负极板与负极板相连，求稳定后电容器组两端的电势差。
两只电容器在连接前已与充电电源断开，连接后组成电学上孤立的系统，同极性极板形成的导体组合不与外界交换电荷。
把电容视为不随电压变化，忽略导线的额外电容，并等待实际电路的暂态过程衰减到稳定状态。
解：连接前，第一个电容器的电量为$|q_1|=C_1|V_1|$；连接后为$|q'_1|=C_1|V|$。
同理，第二个电容器在连接前的电量为$|q_2|=C_2|V_2|$，连接后为$|q'_2|=C_2|V|$。
由于连接的是带同性电的极板，对同极性极板形成的导体组合使用电荷守恒，有$|q_1|+|q_2|=|q'_1|+|q'_2|$。
代入上述电量关系，得到共同电压
$|V|=\frac{C_1|V_1|+C_2|V_2|}{C_1+C_2}$，
求得$V=200$伏特。
这个结果来自电荷守恒，不是电容器电场储能守恒。
因为初始电压不同，连接时会出现暂态电流，稳定后的总电场储能小于连接前两只电容器储能之和。
减少的电场储能可以转化为电路中的热，也可以随电磁辐射离开电路；总能量仍然守恒。
不能在完全无耗散、无辐射的理想模型中，直接假定系统自动达到这里所说的稳定状态。`;
    exercises.exercises[1].changes = ['wording', 'layout', 'scope'];
  }, import.meta.filename);
} else if (phase === 'flow') {
  flow(84);
} else if (phase === 'freeze') {
  freeze(84, process.argv.slice(3).map(Number), import.meta.filename);
} else {
  throw new Error(phase);
}
