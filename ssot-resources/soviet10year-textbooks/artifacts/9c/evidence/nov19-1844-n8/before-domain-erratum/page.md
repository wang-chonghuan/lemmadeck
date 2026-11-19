---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "9c",
  "page": 35,
  "printed_page": 28,
  "source": {
    "pdf": "9c 苏联十年制学校数学教材 代数和分析初步 九年级.pdf",
    "pdf_sha256": "622f972014ce83a76a36b3174ce6d6995e77b86efa0f8dbaba7f5497729a8aec",
    "pdf_page": 35
  },
  "render": {
    "dpi": 300,
    "w": 1695,
    "h": 2381,
    "sha256": "51d02cdaf4f204f227d2559b269066b2fadd2ee9af045aac9e97f2e52dff947f"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "19d56195a3a63cf4be93a7a159e1513d37b9b17d1b92235d8ae3d4e826cc45d0"
  },
  "notes": [
    "SOURCEFIRST 作者首稿；逐行、题号、公式、数量及对象 inventory 在本稿前独立冻结；未收口、未计行、未验收。",
    "题63的六个小问实际是两横排、每排三列；保留每个系数和西里尔小问表记，不把并排列各算作另一真实横排；字母源 Unicode 祖源 HOLD。",
    "题64末项的上标5由新增原生560×75 ROI直接确认（SHA25641b88a3f0fb93a0142106b8dc06c075dfcd84ea22723f117ca7198155e154c3f）；照录 C_6^5=2^6 的原印，不从恒等式或求解改为另一上标，也不声明数学 erratum。",
    "题67保留七种币值、各一枚和两个口袋；题68保留至少两朵，题69保留偶数块，不补答案或删条件。",
    "末块粗体介绍的递推公式在0036实际继续；本页无实际表格、插图、图题或教学脚注；边缘墨迹来源 UNKNOWN，未登记 count_exclusions 或 errata。"
  ],
  "errata": [],
  "count_exclusions": [
    {
      "kind": "scan-artifact",
      "box": [
        0,
        2350,
        1695,
        31
      ],
      "reason": "Independent source-count review identified bottom scanner-edge ink below the printed folio, not printed content. Source SHA51d02cdaf4f204f227d2559b269066b2fadd2ee9af045aac9e97f2e52dff947f; evidence artifacts/9c/evidence/nov19-1844-count3537/report.md and rowmap.json. Count-only exclusion; all source blocks and E64 literal-upper-5 HOLD unchanged."
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

<!-- exhead -->
习题

<!-- ex 63 -->
63. 计算：
а) $C_{18}^{17}$；　б) $C_{20}^{18}$；　в) $C_{94}^{94}$；
г) $C_{1000}^{999}$；　д) $C_{37}^{34}$；　е) $C_{100}^{98}$.

<!-- ex 64 -->
64. 证明等式成立：
$C_6^0+C_6^1+C_6^2+\cdots+C_6^5=2^6$.

<!-- ex 65 -->
65. 证明下列等式成立：
а) $C_5^0+C_5^1+C_5^2=C_5^3+C_5^4+C_5^5$；
б) $C_6^0+C_6^1+C_6^2=C_6^4+C_6^5+C_6^6$.

<!-- ex 66 -->
66. 计算：
$C_7^1+C_7^3+C_7^5+C_7^7$.

<!-- ex 67 -->
67. 一个学生有一戈比、两戈比、三戈比、五戈比、十戈比、十
五戈比和二十戈比的硬币各一枚. 把它们装在两个口袋
里，有几种装法？

<!-- ex 68 -->
68. 从 $10$ 朵不同品种的花中至少取两朵花扎成花束. 这种花
束一共有多少种扎法？

<!-- ex 69 -->
69. 从 $12$ 块不同品种的糖块中，取出偶数块糖堆成一堆，有
多少种取法？

<!-- h3 -->
8. 计算组合数的递推公式

<!-- p open -->
**从帕斯卡三角的任意一行内，取两个相邻的数相加，每次**
**都得到下一行并且位于第二个数下面的那个数. 例如，帕斯卡**
**三角（看 $24$ 页）的第 $4$ 行内的 $4$ 和 $6$ 相加，就得到第五行并且**
**位于 $6$ 下面的 $10$. 显然，对于 $0\le m\le n$，下列公式成立：**

<!-- foot -->
• 28 •
