# ana9-c1-s1-n3 choice review Stage1 freeze

## Boundary and snapshot

2026-11-15，独立 reviewer，未作者本课选择题或标准答案；选择题作者为 Peirce。**Stage1 frozen：唯一新输入为指定 seed；未读取 Peirce 的 notes、draft/view/intent/key、n3标准答案、旧选择题或旧答案。保留n2已有独立解，不互读作者notes。两课Stage2均等待父方提供view并明确授权。**

- Seed: `.intentfold/tickets/STEMROBIN-184/tmp/ana9-c1-s1-n3-choice-seed.json`。
- Schema/source: `s10y-choice-seed-v1`，book9c，lesson `ana9-c1-s1-n3`。
- Seed byte SHA256: `e5cc71fe9a2b7232df6c3d60cb1d825fb58a26ada17224d2e6d6d61a90dafabc`。
- Seed canonical SHA256: `013ec243788a26e27ab51a02c2c43f548bf495c641cf7849b4bae579035440e1`，按技能约定 sort_keys=True、ensure_ascii=True、separators=(",",":") 的JSON UTF-8字节计算。
- Source numbers=[10,11]，共两道源题、三项数学任务；concept_blocks=[0,1]。
- figures=[]，两个source figure_ids=[]，concept_figure_ids=[]；没有引用图需打开。
- 未打开trace所指lesson/exercises/book文件；seed输入新鲜度与后续包级验证分开，不能由本阶段独立解推断作者稿已通过。
- 所选定义明确：从任意整数起点m验证A(m)，再对所有整数k≥m证明A(k)⇒A(k+1)，才可得对所有整数n≥m成立。基点不能一律沿用n=1，也不能由少数样例直接归纳。

## Source10(a) independent solution

**对全部整数n≥0，2^n>n成立。起点m=0。**

基步n=0：2^0=1>0。

假设某个整数k≥0满足2^k>k。两边均为整数，故严格不等式给出单位间隔：

```text
2^k >= k+1;
2^{k+1} = 2*2^k
         >= 2(k+1)
         > k+1,          because k+1>0.
```

这对所有k≥0都适用，含k=0，得到A(k+1)，完成推广归纳。

另一合法写法是单独核验0→1：2^1=2>1；对k≥1再用

```text
2^{k+1}>2k>=k+1.
```

**不能**在k=0也直接声称2k≥k+1；0≥1为假。仅写2^{k+1}>2k对该步也不足以推出>k+1。必须使用上述整数间隔，或明确补齐0→1桥接。

冻结数学边界：原式严格为>，n含0；n=0和n=1均成立。不得把“验证n=1”当已证明源域n≥0的全部命题，也不把仅列几个数值当一般证明。

## Source10(b) independent solution

**对全部整数n≥3，2^n>2n+1成立。起点m=3。**

基步n=3：2^3=8>7=2×3+1。

假设某个整数k≥3满足2^k>2k+1。乘正数2，保持严格方向：

```text
2^{k+1} > 2(2k+1) = 4k+2;
(4k+2) - [2(k+1)+1] = 2k-1 > 0;
therefore 2^{k+1} > 2k+3 = 2(k+1)+1.
```

得到A(k+1)，所以所有整数n≥3成立。

冻结边界校验：n=0时1=1，不满足严格>；n=1时2<3；n=2时4<5。于是若后来view把起点换成0、1或2，不能仍把原严格不等式判为对该非负尾部全称成立。原任务只要求n≥3，不要求求出全部整数解；不把域外扩展偷偷加入源覆盖。

## Source11 independent solution

**对整数项数n≥2，|a_1+...+a_n|≤|a_1|+...+|a_n|成立。**

按任务通常的实数绝对值理解a_i；不添加a_i必须为正数、整数或非零的限制。证明所需二项三角不等式可以从绝对值的两侧界直接得到：

```text
-|x| <= x <= |x|;
-|y| <= y <= |y|;
-(|x|+|y|) <= x+y <= |x|+|y|;
therefore |x+y| <= |x|+|y|.
```

基步n=2正是此二项结论。

设k≥2且

```text
|a_1+...+a_k| <= |a_1|+...+|a_k|.
```

记T_k=a_1+...+a_k。先应用二项三角不等式，再使用归纳假设：

```text
|T_k+a_{k+1}|
  <= |T_k|+|a_{k+1}|
  <= |a_1|+...+|a_k|+|a_{k+1}|.
```

得到k+1项目标式，推广归纳起点m=2，结论对全部整数n≥2成立。

源11只要求证明，没有像源10那样写“利用数学归纳法”的方法限制。直接将每个a_i的两侧绝对值界相加，也能得到一般结论；后续不得仅因作者采用合法直接证明而自动判错。若view将能力目标定位归纳步骤，仍须单独审其保真与具体步骤。

### Frozen mathematical distinctions for later option checking

- ≤不能换成<。例如a_1=1、a_2=2时左、右均为3；全零时也等号成立。
- |sum a_i|与sum |a_i|不是一般相等。例如a_1=1、a_2=-1时分别为0和2。
- 对实数，可令P为所有正项之和，N为所有负项绝对值之和。左边=|P-N|、右边=P+N；等号当且仅当P=0或N=0，即所有a_i同为非负或同为非正，零项允许。只要同时存在正项和负项就严格小于。
- 等号条件是独立推导的后续可用数学事实，不是当前seed额外必考要求。若view另引入复数模，原不等式仍成立，但实数“同号”的等号表述不得直接移植；不读取外部作者定义来猜条件。
- 不能把归纳假设的对象|a_1+...+a_k|偷换成sum |a_i|相等；合法链使用两次≤。

## Stage1 completeness and authorization checkpoint

- 独立完成源10两个小问和源11，共三项数学任务；无未读引用图、缺失数值或必须向作者询问的源条件。
- 三项所需归纳起点分别m=0、3、2；严格/非严格不等号、整数域与关键0→1桥接都已冻结。
- 未见任何view，不评task_fidelity、redundancy、answer_leakage或包覆盖；没有选项真假集、作者key比较或标准答案比较。
- 此文件不是最终 `s10y-choice-review-v1`，不虚构draft_sha256、question_reviews或包级outcome，不运行需要draft的validator。
- 父方提供n2/n3 learner-facing view并授权后才进入各自Stage2；先审view、独立判每个选项，再按后续明确授权读取内部作者材料。标准答案比较独立等待授权。
- 如seed内容变化，保留此冻结文件及其旧哈希，只新记受影响任务；不根据作者稿倒改独立解。
