# n2 original Stage2 q3 boundary addendum

## Immutable evidence and disclosure boundary

2026-11-15。保留原 Stage1/Stage2 文件不变，此补记仅收紧原 q3 的无条件通过判断，不重做源解，不读取任何修稿。父方提出边界疑点后，在首次披露原 draft 内部材料之前，独立核对原 q3 view 与原 seed 的必要约定。

- 原 Stage1 SHA256 `88426463e40a7cd3a1616f8e2307321a0e9b68bad8101c9f3bb6738488f464a6`。
- 原 Stage2 SHA256 `108b5c9cbcb8d62acf726fa2d05331cb125c3abbd9c7caeb36d957b97bed16e3`。
- 原 views byte SHA256 `abe9458d5b65274eedcafba9e4743d1f68cee42dfc928d5ceaebcff29ed8bef8`，canonical `f8312ecf59f76a30c2f50b8cdc7955cac1f6228a43eb52d42db0eeab2687478b`。读取前对字节作 hash guard，仅输出 q3；不是修后稿。
- 原 seed byte SHA256 `eb6df6d284995aaa540cb1cded7b89fd9625e47ac8372cb7a25eeb7e66782024`，canonical `76fa1d9151c016c5f57b8a2791530e05d412997f2c67930257cc3e616654ba8c`。hash guard 后仅核对 source5 及五个既有定义，不打开 trace 指向的现代源文件。
- 未读取原 draft、intent、key 或标准答案；此补记的约定判断先于 Stage3 内部披露。不是声称父方反馈之前已经发现该缺口。

## Concrete original-view boundary

原题干为等比数列、公比 q、q!=1，要求证明通项 b_n=b_1*q^{n-1} 与有限部分和。原 d 开头写“首项系数为 1”，随后证明 S_1=b_1，并给出正确的两式递推。

1. q!=1 单独不排除 q=0。source5 同样只列 q!=1；五个选定概念块只定义归纳方法，没有定义等比数列为非零项/非零公比，也没有规定零次幂或空乘积。
2. 如果允许 q=0，用乘法递推可得到 b_1,0,0,...，和式仍合法。但通项在 n=1 涉及 b_1*0^0；不能从所给 seed 或 view 推出这里的 0^0 已定义为 1。
3. 原 d 的“首项系数为 1”可以表达使用空乘积的意图，却未说明这一边界约定。它不是已有定义的引用或从递推导出的首步说明，不能由 reviewer 默默补成权威定义。
4. 若本课等比数列定义本来要求公比/各项非零，则 q=0 不属于定义域，问题会消失；但本次允许输入没有该定义。不能擅自选这一解释，也不能断言在所有数学语境 0^0 都为假或都无定义。

## Disposition

**q3 mathematics: blocked on convention/domain; exact unconditional correct=null。** 对明确限定非零公比的域，或明确允许 n=1 通项系数为空乘积 1 的约定，原 d 的递推有效，条件真集合为 {d}。a/b/c 仍由原 q=2 的反例判无效，复用原逐项数学证据，无需重做另外六题。

原 Stage2 的 q3 无条件 {d}/pass 应由此补记限定，不能将原文件中“无数学输入阻塞”的陈述用于最终审核。q1/q5 的措辞泄漏 REVISE 及其它原题证据均保留。因此原 snapshot 的聚合结论在此补记后为 **BLOCKED，并存 q1/q5 的明确 REVISE**，不是覆盖或抹去原 REVISE 记录。

最小缺失前提：在获授权的可见/源定义层明确适用域，或明确零公比时首项系数及 n>=2 的通项解释；不凭内部作者 intent 充当定义权威。仅改为 q!=0 是缩窄原明列条件，必须由父方判定有源依据或批准，而非 reviewer 自动修订。

Stage3 只比较父方指定、哈希匹配的原始内部稿，特别记录作者新增约定是否来源于 seed。修后 q1/q3/q5 的 changed-only 复核等待明确 diff；此补记不查看或批准修稿。
