---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "9c",
  "page": 33,
  "printed_page": 26,
  "source": {
    "pdf": "9c 苏联十年制学校数学教材 代数和分析初步 九年级.pdf",
    "pdf_sha256": "622f972014ce83a76a36b3174ce6d6995e77b86efa0f8dbaba7f5497729a8aec",
    "pdf_page": 33
  },
  "render": {
    "dpi": 300,
    "w": 1695,
    "h": 2381,
    "sha256": "c28bb5974ca47250d2a2dc546abad5bc94844dc8c4e26893dbf7579f020e207b"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "19d56195a3a63cf4be93a7a159e1513d37b9b17d1b92235d8ae3d4e826cc45d0"
  },
  "notes": [
    "SOURCEFIRST 作者首稿；四页原图各读一次，独立逐行和对象 inventory 在写入本稿前冻结；未收口、未计行、未验收。",
    "首块 ex60 cont 仅承接父任务的0032 TEXT：题干“下列各多边形有多少条对角线？”及 а) 凸五边形；。本页实际可见 б)、в)、г) 后题60闭合；未重读0032或批准外部对象全部来源。",
    "B形姓名首字母按现有西里尔表记为 В；字母系统、日期长横线、省略号、引号及页脚实心点的源 Unicode 祖源不能仅由字形确定。",
    "三条单行组合数公式的上下标不是额外横排；星号译者脚注保留两个真实印刷行；页码为 •26•。",
    "末块“证明这个式子很简单：”在0034由公式继续；此页没有实际表格或插图，所引24页表格未读；边缘墨迹来源 UNKNOWN，未登记 count_exclusions 或 errata。"
  ],
  "errata": [],
  "count_exclusions": [
    {
      "kind": "scan-artifact",
      "box": [
        0,
        2304,
        1564,
        66
      ],
      "reason": "Independent source-first review 2026-11-19 confirmed nonprinted bottom-edge debris below all footnote text and the printed folio; no printed glyph or rule is in this box. Evidence: artifacts/9c/evidence/nov19-1844-count-repair/source-review.md; source SHA c28bb5974ca47250d2a2dc546abad5bc94844dc8c4e26893dbf7579f020e207b. Count-only exclusion; source pixels and blocks unchanged."
    }
  ],
  "printed_lines": 24,
  "figures": [],
  "provenance": {
    "cap": "1",
    "normalized": true
  }
}
---

<!-- ex 60 cont -->
б) 凸十二边形；
в) 凸二十五边形；
г) 凸 $n$ 边形，其中 $n\ge3$.

<!-- ex 61 -->
61. 在象棋循环赛中，每个棋手要跟其他每一个棋手下一盘
棋. 如果一共下了 $210$ 盘棋，有多少棋手参加比赛？

<!-- ex 62 -->
62. $15$ 个学生分成两组，一组 $4$ 个，而另一组 $11$ 个. 一共有
多少种不同的分法？

<!-- h3 -->
7. 组合数的几个性质

<!-- p -->
前一小节所列 $C_n^m$ 的数值的表格可以无限地继续往下
列. 表格里的行用非负整数 $n=0,1,2,3,\ldots$ 编上号. 标有
号码 $n$ 的一行，有 $n+1$ 个数：
$C_n^0,C_n^1,C_n^2,\ldots,C_n^n$.

<!-- p -->
这个表通常叫做“帕斯卡三角”，以此纪念研究了这个表的性
质的法国数学家 В. 帕斯卡（1623—1662）*.

<!-- p -->
从 $24$ 页上的帕斯卡三角中，我们发现，它的每一行都有
对称性：每行中与左右两端等距的数相等. 例如，
$C_5^2=C_5^{5-2}=C_5^3=10$.

<!-- p -->
看来这个规律有普遍性：对于任意 $n$ 和 $m$，$(0\le m\le n)$ 下列等
式成立：
$C_n^m=C_n^{n-m}.\qquad(1)$

<!-- p open -->
证明这个式子很简单：

<!-- foot note -->
* 帕斯卡三角在我国叫“杨辉三角”，它首先载于我国宋朝数学家杨辉
1261 年所著的《详解九章算法》一书. ——译者注

<!-- foot -->
• 26 •
