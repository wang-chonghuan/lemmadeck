# ana9-c1-s1-n2 choice review Stage1 freeze

## Boundary and snapshot

2026-11-15，独立 reviewer，未作者这些选择题或标准答案。**Stage1 frozen：只从指定 seed 的题面、概念定义独立求解；未打开 draft、view、intent、key、标准答案、旧选择题或旧答案。Stage2尚未授权，不作选择题或包覆盖PASS。**

- Seed: `.intentfold/tickets/STEMROBIN-184/tmp/ana9-c1-s1-n2-choice-seed.json`。
- Schema/source: `s10y-choice-seed-v1`，book9c，lesson `ana9-c1-s1-n2`。
- Seed byte SHA256: `eb6df6d284995aaa540cb1cded7b89fd9625e47ac8372cb7a25eeb7e66782024`。
- Seed canonical SHA256: `76fa1d9151c016c5f57b8a2791530e05d412997f2c67930257cc3e616654ba8c`，按技能约定 sort_keys=True、ensure_ascii=True、separators=(",",":") 的JSON UTF-8字节计算。
- Source numbers恰为3、4、5、6、7、8、9；7道源题包含11项数学关系/任务。concept_blocks=[17,19,58,59,60]。
- Seed figures=[]，所有 source figure_ids=[]，concept_figure_ids=[]。没有应打开而未打开的引用图。
- 未打开trace指向的lesson/exercises/book文件；本阶段输入严格限定seed。trace记录的冻结来源留在seed中，今后输入新鲜度检查与Stage1独立数学判断分开。
- 按concept17/19，归纳基点n=1，步骤只允许从对任意k成立的归纳假设证明k+1；检查有限几个值不能代替证明。S_n按任务通用记号表示前n项和，d为公差，q为公比。

## Source3 independent solution

**两个恒等式均成立，对全部n≥1；分别给出基础步骤和归纳步骤。**

设 T_n=1+2+...+n。n=1时T_1=1=1×2/2。假设T_k=k(k+1)/2，则

```text
T_{k+1}=T_k+(k+1)
        =k(k+1)/2+(k+1)
        =(k+1)(k+2)/2.
```

因此a)对全部正整数成立。

设 U_n=1^2+2^2+...+n^2。n=1时U_1=1=1×2×3/6。假设U_k=k(k+1)(2k+1)/6，则

```text
U_{k+1}=U_k+(k+1)^2
        =(k+1)[k(2k+1)+6(k+1)]/6
        =(k+1)(2k^2+7k+6)/6
        =(k+1)(k+2)(2k+3)/6.
```

这是将n换成k+1的目标式。因此b)成立。两小问不可被静默合并成只识别一个和式结果；后续实际能力保留程度待view。

## Source4 independent solution

**等差通项 a_n=a_1+(n-1)d，前n项和 S_n=n(2a_1+(n-1)d)/2，均成立。** 不限制公差为正数或整数。

可同时归纳两式。n=1时通项为a_1，S_1=a_1=1×2a_1/2。假设两式对k成立，由定义a_{k+1}=a_k+d，得到

```text
a_{k+1}=a_1+(k-1)d+d=a_1+kd;
S_{k+1}=S_k+a_{k+1}
        =k[2a_1+(k-1)d]/2+a_1+kd
        =(k+1)(2a_1+kd)/2.
```

两结果都是原通项/和式的k+1版本，故全部n≥1成立。归纳步骤必须加新项a_{k+1}而非再次加a_k。

## Source5 independent solution

**等比通项 b_n=b_1q^{n-1}；q≠1时 S_n=b_1(q^n-1)/(q-1)，均成立。**

首项直接为b_1。若b_k=b_1q^{k-1}，由公比递推

```text
b_{k+1}=qb_k=b_1q^k.
```

和式基步为S_1=b_1=b_1(q-1)/(q-1)，用到给定q≠1。假设S_k=b_1(q^k-1)/(q-1)，则

```text
S_{k+1}=S_k+b_{k+1}
        =b_1(q^k-1)/(q-1)+b_1q^k
        =b_1[q^k-1+q^k(q-1)]/(q-1)
        =b_1(q^{k+1}-1)/(q-1).
```

没有增加q>0、q为整数等隐藏条件。通项n=1按首项处理；递推只用乘以q。q=1时通项仍是b_1，但不能代入除q-1的和式；其延伸值S_n=nb_1不是当前seed要求的额外任务。后续若选项扩展参数边界，应明确辨别，不能偷换给定q≠1。

## Source6 independent solution

**和为 n/(n+1)。** 对j≥1，有

```text
1/[j(j+1)]=1/j-1/(j+1);
sum(j=1..n) 1/[j(j+1)]
  =(1-1/2)+(1/2-1/3)+...+(1/n-1/(n+1))
  =1-1/(n+1)=n/(n+1).
```

也可归纳：基值1/2；若T_k=k/(k+1)，则

```text
T_{k+1}=k/(k+1)+1/[(k+1)(k+2)]
        =[k(k+2)+1]/[(k+1)(k+2)]
        =(k+1)/(k+2).
```

源题只说求和，没有明确只准归纳法；裂项相消是合法独立解法。不能从单项值或前几项猜想替代一般和。

## Source7 independent solution

**a) sum(j=1..n) j(j+1)=n(n+1)(n+2)/3；b) sum(j=1..n) j(3j+1)=n(n+1)^2。**

a)基步n=1时1×2=2=1×2×3/3。设V_k=k(k+1)(k+2)/3，则

```text
V_{k+1}=V_k+(k+1)(k+2)
        =(k+1)(k+2)(k/3+1)
        =(k+1)(k+2)(k+3)/3.
```

b)基步n=1时1×4=4=1×2^2。设W_k=k(k+1)^2，则

```text
W_{k+1}=W_k+(k+1)[3(k+1)+1]
        =k(k+1)^2+(k+1)(3k+4)
        =(k+1)[k(k+1)+3k+4]
        =(k+1)(k+2)^2.
```

两者都是对应k+1目标式，完成归纳。b)亦由3sum(j^2)+sum(j)得到相同结果，但源题明确要求归纳证明；后续判断不能只看结果数值匹配。

## Source8 independent solution

**n^3+11n总是6的整倍数。**

令F_n=n^3+11n。n=1时F_1=12=6×2。对任意k≥1，

```text
F_{k+1}-F_k
  =(k+1)^3+11(k+1)-(k^3+11k)
  =3k^2+3k+12
  =3k(k+1)+12.
```

k、k+1相邻，至少一个偶数；因此k(k+1)为偶数，3k(k+1)为6倍数，12亦为6倍数。若F_k可被6整除，F_{k+1}也可。基步及步骤齐全。

独立交叉推导：n^3+11n=n(n-1)(n+1)+12n；三个连续整数的乘积含2和3因子，故两项均为6倍数。注意不需也不能声称每个k(k+1)都为3倍数，例如k=1时为2；3因子来自前面的3。

## Source9 independent solution

**7^n-1总是6的整倍数。**

令G_n=7^n-1。n=1时G_1=6。若G_k=6t，其中t为整数，则

```text
G_{k+1}=7^{k+1}-1
        =7(7^k-1)+6
        =7G_k+6
        =6(7t+1).
```

所以对全部n≥1成立。独立因式检验：

```text
7^n-1=(7-1)(1+7+...+7^{n-1})
      =6(1+7+...+7^{n-1}).
```

成立理由是正确基步与一般递推，而不是只列7、49、343等几个值。递推中的+6不可遗漏。

## Stage1 completeness and pending authorization

- 七题的11项数学任务已独立求解，无不可读图或缺失数值；没有标准答案比较结果，因为尚未读取标准答案。
- source3/4/5/7各含两项，source6/8/9各一项。概念区分包括有限情形的完全归纳、猜想性质的不完全归纳，以及任意k的数学归纳步骤；不能把查验几例当一般证明。
- **Coverage/task_fidelity/redundancy/answer_leakage 全部未评判**：没有view，不能提前通过；也没有作者correct set或选项真假集合。
- 此记录不是最终 `s10y-choice-review-v1`，不运行需要draft的validator，不虚构draft_sha256、question_reviews或包级outcome。
- Stage2仅在父方提供 learner-facing view并明确授权后，先按view检查任务保真、冗余、泄漏，再独立解各选项；仍不先读作者key/intent。标准答案以后单独授权比较时复用本冻结解，不回填或自动修正作者答案。
- 如果seed内容改变，保留此记录及哈希，只对受影响的源任务做新的明确版本记录；不偷偷覆盖冻结解。
