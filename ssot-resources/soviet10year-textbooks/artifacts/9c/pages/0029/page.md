---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "9c",
  "page": 29,
  "printed_page": 22,
  "notes": [
    "实际原图确认物理29页为印刷22页。前页第5单元尾段已闭合，本页先列习题43至48，随后开始§3组合及第6单元有限集合的子集总数。",
    "正文集合元素А、Б、В均为大写西里尔字母，保留空集以及全部单元素、双元素、三元素子集；不把同形А、В写成拉丁字母。",
    "本页无图、表或脚注，正文下波浪线与页边墨迹不作为独立教材对象或新增行。正文与末尾等式均已闭合；首次24/23失败保留，独立源审查后只登记底边扫描线计数排除，不改原文或像素。"
  ],
  "count_exclusions": [
    {
      "kind": "scan-artifact",
      "box": [
        0,
        2340,
        1695,
        41
      ],
      "reason": "Independent source review confirms the uneven bottom scan boundary only. The folio ends at y2186, above this existing bottom5% strip; no prose, formula, heading, exercise number or folio glyph is excluded. Original pixels remain unchanged."
    }
  ],
  "errata": [],
  "source": {
    "pdf": "9c 苏联十年制学校数学教材 代数和分析初步 九年级.pdf",
    "pdf_sha256": "622f972014ce83a76a36b3174ce6d6995e77b86efa0f8dbaba7f5497729a8aec",
    "pdf_page": 29
  },
  "render": {
    "dpi": 300,
    "w": 1695,
    "h": 2381,
    "sha256": "9df7baba530bd4f13bdda1d118ddbf55aaa5934df8236b60dc98c24b36de03d4"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849"
  },
  "printed_lines": 23,
  "figures": [],
  "provenance": {
    "cap": "1",
    "normalized": true
  }
}
---

<!-- exhead -->
习题

<!-- ex 43 -->
43. 证明：$A_n^{n-1}=A_n^n=n!$.

<!-- ex 44 -->
44. 从9个申请工作的人中挑选4个人安排4种不同的工
作，有几种选法？

<!-- ex 45 -->
45. 九年级有35个学生，他们彼此交换像片，一共交换了多
少张像片？

<!-- ex 46 -->
46. 从多少个物体中，每次取2个物体的排列共有210种？

<!-- ex 47 -->
47. 已知$A_n^5=18\times A_{n-2}^4$，求$n$.

<!-- ex 48 -->
48. $10^7$个七位数电话号码中，由七个不同的数字组成的号码
所占比例是多少？

<!-- h2 -->
§ 3. 组合

<!-- h3 -->
6. 有限集合的子集总数

<!-- p -->
考虑集合{А，Б，В}的所有子集，它们一共有八个：$\varnothing$——
空集；含有一个元素的集合有三个——{А}，{Б}，{В}；含有
两个元素的集合有三个——{А，Б}，{А，В}，{Б，В}；含有三
个元素的集合有一个——{А，Б，В}.

<!-- p -->
从$n$个元素的集合中，每次取$m$个元素的子集的总数表
示为$C_n^m$. 在组合分析中，有限集合叫做组合. 因此，$C_n^m$叫做
“从$n$个元素中取$m$个的组合数”. 我们看到，
$C_3^0=1$，$C_3^1=3$，$C_3^2=3$，$C_3^3=1$，
并且
$C_3^0+C_3^1+C_3^2+C_3^3=8=2^3$.

<!-- foot -->
· 22 ·
