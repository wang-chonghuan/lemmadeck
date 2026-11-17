# Batch54 n147 Independent SOURCE Solutions

Status: **SOURCE_SOLVED_8_OF_8**. All solutions were derived after the independent FIRST TEXT verdict had been frozen as **BLOCK**. That verdict is unchanged. This report is SOURCE-only reasoning, not a modern FINAL display-answer conversion, answer-key production, grading declaration, or interaction specification.

No author answers, book answer keys, choices, prior solution reports or modern answer artifacts were consulted. After TEXT freezing, reread only the owned, byte-identical copies of the complete retained SOURCE `lesson.json` and `exercises.json`. The earlier modern-text comparison is not an answer source. No exercise requires an image; both lesson portraits remain pending and unapproved.

## Frozen Basis

- SOURCE lesson: `ssot-resources/soviet10year-textbooks/artifacts/7p/lessons/phy7-c2-s3-n147/lesson.json`, full SHA-256 `bbd9c9f66e00c3e54ee43a2779f46bb5e9a407f4556c27757ff813505811459d`.
- SOURCE exercises: `ssot-resources/soviet10year-textbooks/artifacts/7p/lessons/phy7-c2-s3-n147/exercises.json`, full SHA-256 `14adb682c7fa20b5647eded0e7ecf92fe52dfa62649b4a9fe7cc88e52523ecf0`.
- Owned SOURCE copies: `.tmp/ld-s10y-lesson/text-review-n147-b54/inputs/08-lesson.json` and `inputs/09-exercises.json`.
- Earlier TEXT report SHA-256: `ce570e680770c6d95acdf4c2fa7bb2310bc7abcd0139717c8ba49705f01b7ff5`.
- Earlier TEXT freeze: `.tmp/ld-s10y-lesson/text-review-n147-b54/text-freeze/manifest.json`, SHA-256 `77349dc8c0a0051866e38b6466965f1ae48ff43c51f96ddaf69d6cd328e6c4e5`.

## Common Physical Conditions

本课的 $Q$ 表示电流在电阻中转化为内能的能量，以下也记作 $Q_{\mathrm{gen}}$，单位为焦耳（J）。它不是物体“存有的热量”，也不必等于导体自身内能的增加量。在没有其他能量输入输出时，能量收支为

$$
\Delta E_{\mathrm{int}}=Q_{\mathrm{gen}}-Q_{\mathrm{out}}.
$$

$Q_{\mathrm{out}}$ 是向周围传出的能量；若输入和散出相等，导体仍不断产生热量，但温度不再升高。

把全部电功写成 $Q=UIt$，需要静止的纯电阻导体，不存在电动机机械输出或电解化学储能等非热输出，且计时期间 $U,I$ 保持不变。把整段时间的热量写成 $Q=I^2Rt$，还需要该段电阻满足 $U=IR$，并将 $I,R$ 在该段时间看作恒定或近似恒定。升温可能改变电阻，不能不加条件地使用初始电阻计算整个加热过程。

更一般的电阻发热关系是

$$
Q_{\mathrm{gen}}=\int_0^t I(\tau)^2R(\tau)\,d\tau.
$$

这是说明恒量公式适用边界的补充，不给 SOURCE 题目增加待求量。电阻率 $\rho_{\mathrm e}$ 与物质的质量密度不同；下面只在需要比较等长、等截面导线时使用 $R=\rho_{\mathrm e}l/S$。

## 1. Stable ID `1`

绑定：`group_id=g1`，`group=**问题**`，`source_number=1`，SOURCE `p0373#6`。

源题：对电流能使导体变热的现象应如何解释？

电场对带电粒子做功。金属里的自由电子产生定向运动，并与金属中的粒子相互作用，把从电场获得的能量传给导体；导体粒子的热运动增强，内能增加。对于电解质，移动的载流粒子是离子，同样存在相互作用导致的电阻发热，但若还发生电解，不能把总电功全部判作发热。

这不是电子仅凭原有能量一直加热导体：持续提供能量的是电场和电源。宏观上表现为电能转化成内能。导体温度是否继续上升，还取决于它向周围散出的能量，不能把“有电流热效应”等同于“温度必定持续上升”。

结论：带电粒子的电场驱动运动及其与导体粒子的相互作用，使电能转化为内能，产生电流热效应。此题是定性解释，没有需要虚构的数值或单位换算。

## 2. Stable ID `2`

绑定：`group_id=g1`，`group=**问题**`，`source_number=2`，SOURCE `p0373#7`。

源题：用什么公式计算电流在导体中所产生的热量？

对上述纯电阻导体，电流所做的功全部转化为内能，因此 $Q=A$。电压、电流不变时，电功 $A=UIt$，于是

$$
Q=UIt.
$$

$U$ 用伏特（V），$I$ 用安培（A），$t$ 用秒（s），$Q$ 用焦耳（J）；单位核对为 $\mathrm{V\cdot A\cdot s=W\cdot s=J}$。若 $U,I$ 随时间变化，应逐段累计或使用 $\int UI\,dt$，不能只把某一瞬间的值乘以全部时间。对有机械或化学能输出的器件，$UI$ 是总输入电功率，不自动等于全部发热功率。

## 3. Stable ID `3`

绑定：`group_id=g1`，`group=**问题**`，`source_number=3`，SOURCE `p0373#8`。

源题：怎样才能应用欧姆定律把电流在导体中所产生的热量用电流强度、导体的电阻以及时间表示出来？

先由纯电阻导体的电功与发热关系写出 $Q=UIt$。欧姆定律给出 $U=IR$。只替换原式中的 $U$，其余的电流和时间不变：

$$
Q=(IR)It=IRIt=I\cdot I\cdot R\cdot t=I^2Rt.
$$

因此所需公式为 $Q=I^2Rt$，其中 $I$ 是通过这段导体的电流，$R$ 是这段导体的电阻，$t$ 是通电时间。单位为安培、欧姆、秒和焦耳；$\mathrm{A^2\cdot\Omega=A\cdot V=W}$，再乘秒得到 J。

整段时间直接使用该乘积时，$I,R$ 需恒定或近似恒定。不能将升温前的 $R$ 无条件用于电阻显著变化的长时间过程；一般情形见共同条件中的累计关系。

## 4. Stable ID `4`

绑定：`group_id=g1`，`group=**问题**`，`source_number=4`，SOURCE `p0373#9`。

源题：焦耳-楞次定律如何表述？

在电流、电阻恒定或可近似看作恒定的通电过程中，电流在导体中产生的热量与电流强度的平方、导体电阻及通电时间的乘积成正比，公式为 $Q=I^2Rt$。

每次比较一个量时，另外两个量必须相同：

- 比较电流：固定 $R,t$，有 $Q_2/Q_1=(I_2/I_1)^2$。
- 比较电阻：固定 $I,t$，有 $Q_2/Q_1=R_2/R_1$。
- 比较时间：固定 $I,R$，有 $Q_2/Q_1=t_2/t_1$。

上述比值要求比较用的分母量非零。$I$ 为安培，$R$ 为欧姆，$t$ 为秒，$Q$ 为焦耳。不能把“保持电流相同”换成“保持电压相同”：固定电压时，代入 $I=U/R$ 得到 $Q=U^2t/R$，此时电阻越大，产生的热量反而越少。这不与定律矛盾，而是比较条件不同。

## 5. Stable ID `g2-1`

绑定：`group_id=g2`，`group=**练习69**`，`source_number=1`，SOURCE `p0373#11`。

源题给定电阻丝电阻 $20$ 欧姆，电流 $5$ 安培，通电 $30$ 分钟；求产生的热量。

采用 SOURCE 计算题隐含的恒电流、恒电阻近似：

$$
R=20\,\Omega,\qquad I=5\,\mathrm A,\qquad
t=30\times60\,\mathrm s=1800\,\mathrm s.
$$

先求发热功率：

$$
P=I^2R=5^2\times20\,\mathrm W=25\times20\,\mathrm W=500\,\mathrm W.
$$

再乘实际秒数：

$$
Q=Pt=500\times1800\,\mathrm J=900000\,\mathrm J.
$$

答案：$9.0\times10^5\,\mathrm J=900\,\mathrm{kJ}$。

独立代数核对：$U=IR=5\times20=100\,\mathrm V$，故 $UIt=100\times5\times1800=900000\,\mathrm J$，与结果一致。这里的 $100\,\mathrm V$ 和 $500\,\mathrm W$ 是题目模型的计算结果，不是安全课堂装置参数；不得按题中数据自行搭建发热实验。

没有质量、比热容、散热等数据，不能由此进一步给出电阻丝的温升，也不能声称其自身内能恰增加同样数值。若实际电阻随温度显著变化，给定模型的乘积计算不代表完整真实过程。

## 6. Stable ID `g2-2`

绑定：`group_id=g2`，`group=**练习69**`，`source_number=2`，SOURCE `p0373#12`。

源题：导线接头不仅简单扭接，还要焊牢，目的是什么、物理依据是什么？

简单且不牢靠的接触可能只有少量实际接触点，并受氧化、松动影响，接触电阻较大且不稳定。牢靠、合适的导电连接使接触稳定，减小额外的接触电阻和电压损失，减少接头处的异常发热，也减少断续接触带来的危险。

设接头的接触电阻为 $R_{\mathrm c}$，实际通过电流为 $I$。在可近似保持恒定的一段时间内，

$$
P_{\mathrm c}=I^2R_{\mathrm c},\qquad
Q_{\mathrm c}=I^2R_{\mathrm c}t,\qquad
U_{\mathrm c}=IR_{\mathrm c}.
$$

比较相同电流、相同时间下的接头，较大的 $R_{\mathrm c}$ 导致较大的局部热量和电压损失。接头区域很小，热量集中时可能造成明显局部升温，损伤绝缘或连接；因此不能只保证“电路暂时导通”。

单位：$R_{\mathrm c}$ 为 $\Omega$，$I$ 为 A，$P_{\mathrm c}$ 为 W，$Q_{\mathrm c}$ 为 J，$t$ 为 s，$U_{\mathrm c}$ 为 V。实际接头电阻变化也可能改变整条电路的电流，因此上面的大小比较明确限定为相同电流，而不是对所有固定电源电压的电路作无条件单调断言。

原书“焊牢”是其连接情境，不等于现代所有接线都必须焊接。此处只回答目的及电阻发热原理，不提供焊接、带电维修、供电线路拆装步骤，也不要求学生实践。

## 7. Stable ID `g2-3`

绑定：`group_id=g2`，`group=**练习69**`，`source_number=3`，SOURCE `p0373#13`。

源题：没有预先切断电源就把电热煮水器从水中取出，它很快烧坏，为什么？

对原题所指的浸入式电热器，通电时电阻发热。浸在水中时，水能较有效地带走电热器产生的能量；离开水后，向空气传热的条件通常明显变差。如果供电未停止，电热器仍产生热量，而散出速率不足，于是自身内能积累、温度迅速升高，可能损坏电热元件、绝缘或其他部件。

用功率表示能量收支：

$$
\frac{dE_{\mathrm{int}}}{dt}=P_{\mathrm{gen}}-P_{\mathrm{out}}.
$$

两种功率均用 W；当右侧为正，能量以 J/s 积累，温度可能升高。损坏的关键是离水后散热不足，不是“空气使电阻突然变为零”，也不是“水消失使电流必然增大”。

若固定电压且元件可作电阻模型，则 $P_{\mathrm{gen}}=U^2/R(T)$；升温引起的电阻变化可能降低或改变发热功率，不能声称离水前后功率必定完全一样。即使功率降低，仍可能超过空气中的散热能力并过热。原题结论针对缺少有效保护或保护未及时起效的装置；有适当保护的实际产品可能断电，并非所有现代电热器都必定烧坏。

安全边界：此题是故障原因分析。不得进行带电离水、空烧或绕过保护的演示，学生不得操作这类故障情境。没有质量、热容量、散热曲线和温度限值，无法计算烧坏时间或具体最高温度。

## 8. Stable ID `g2-4`

绑定：`group_id=g2`，`group=**练习69**`，`source_number=4`，SOURCE `p0373#14`。

源题给定铜、钢、铜镍合金三条导线，长度和横截面积相同，串联接入电路；比较发热，说明理由，并尽可能在课堂验证。

**课堂近似下的答案：用于电阻丝的铜镍合金导线产生热量最多，普通钢其次，铜最少。** 这里明确采用常见课堂材料的冷态近似：普通铜、普通钢和较高电阻率的铜镍电阻合金，初始温度相近，通电时间相同且温升小，电阻可近似保持不变。不是对任意钢牌号、任意铜镍成分和任意高温过程的无条件断言。

1. 串联电路无分支，三个导线段在同一时刻通过相同的电流；比较同一段时间，它们的通电时间也相同。这里共同的是电流，不是各段电压。
2. 长度 $l$、横截面积 $S$ 相同，由 $R_j=\rho_{\mathrm e,j}l/S$，各导线电阻的比等于所用材料电阻率的比。
3. 按上述冷态课堂材料近似，$\rho_{\mathrm e,\mathrm{CuNi}}>\rho_{\mathrm e,\mathrm{steel}}>\rho_{\mathrm e,\mathrm{Cu}}$，所以 $R_{\mathrm{CuNi}}>R_{\mathrm{steel}}>R_{\mathrm{Cu}}$。
4. 在相同非零 $I$ 和相同正时间 $t$ 下，$Q_j=I^2R_jt$；公共因子 $I^2t$ 相同，得到 $Q_{\mathrm{CuNi}}>Q_{\mathrm{steel}}>Q_{\mathrm{Cu}}$。发热功率 $P_j=I^2R_j$ 也按同样顺序排列。

各量的单位：电阻率 $\rho_{\mathrm e}$ 为 $\Omega\cdot\mathrm m$，$l$ 为 m，$S$ 为 $\mathrm m^2$，$R$ 为 $\Omega$，$I$ 为 A，$t$ 为 s，$Q$ 为 J，$P$ 为 W。源题未给出具体材料牌号或电阻率数值，不应虚构精确数值或热量倍数。

即使共同电流随时间变化，只要三段电阻仍固定，共同积分 $\int_0^t I(\tau)^2d\tau$ 仍使热量按 $R_j$ 排序；若升温使各段 $R_j(T)$ 显著改变，就需要分别累计，不能直接沿用冷态常数。若三段的电阻在整个过程中始终保持上述大小关系，共同电流仍支持相同的累计排序；仅凭材料名称不能保证所有真实温度范围都满足该关系。

**材料信息限制：** SOURCE 没有指定钢牌号或铜镍合金成分。因此上述排序是原题的常见教学近似，不是由给定文字单独证明的普适材料事实。若要判定某三条真实导线，应取得其实际温度下的电阻率或测得电阻；不满足上述排序的材料不能强套结论。只说“铜镍合金总比任何钢的电阻率大”是不成立的泛化。

**热量与温度的区别：** 原题“发热得最厉害”在本课定律下解释为同一段时间产生的热量最多。它不自动意味着实际温度或温升最大。在无相变、热容量可近似恒定时，

$$
m_jc_j\Delta T_j=Q_{\mathrm{gen},j}-Q_{\mathrm{out},j}.
$$

相同长度和截面仅使体积相同，不保证质量 $m_j$、比热容 $c_j$ 或散热相同。温度还受这些因素影响，所以不能用摸起来最烫或温度最高直接替代定律中的 $Q$ 排序。

**可选课堂验证的安全边界：** 没有在本次任务中运行实验。仅可由教师使用经检查、隔离低电压、限流并在元件额定范围内的教学装置，保持短时、低温升条件。教师可比较各段实际电压和共同电流，用纯电阻段的 $P_j=IU_j$ 判断发热功率；非接触温度观察只能作辅助，不能忽略热容量、散热差异后直接当作热量测量。没有合适器材时，以理论分析完成原题的“尽可能”要求。不提供接线步骤，不接家庭电源，不触摸通电或发热导线，不追求烧红或烧断；低电压本身也不消除大电流发热危险。

## Completeness And Freeze

恰好完成八个 SOURCE 对象：`1,2,3,4` 属于 `g1` / `**问题**`，`g2-1,g2-2,g2-3,g2-4` 属于 `g2` / `**练习69**`，各组原印刷号均为 `1..4`。全部来源引用、推理、计算中间步骤、单位和适用条件已明确；开放解释没有被强行转为自动判题。

SOURCE 的 `1` 卡约等于 `4.2` J、`1` J 约等于 `0.24` 卡是两种各自取近似的换算，不是严格互逆常数。本题数值结果用 J / kJ，不借这两个近似数制造相互冲突的精确卡数。

`solve-ledger.json` 和本报告将单独冻结到 `.tmp/ld-s10y-lesson/text-review-n147-b54/solve-freeze/`，并绑定早先的 TEXT freeze 和两份完整 SOURCE 副本。该 solve manifest 的当前完整哈希在最终回复给出，TEXT report/manifest 保持不变。

本次图片加载 `0`、父上下文图片 `0`，候选修改 `0`、修复 `0`、新交互 `0`。SOURCE 页 372/373/374 的已有批准只保留，不新增源页或像素审查；现代两幅肖像与整课均不批准。不运行 prepare/finalize/check/test、管线、Git/backend/DB/services/app/dependencies/global checks 或发布。只写指定的两份报告及 review-owned scratch，保留共享仓库其他工作。
