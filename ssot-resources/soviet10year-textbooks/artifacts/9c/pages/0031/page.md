---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "9c",
  "page": 31,
  "printed_page": 24,
  "notes": [
    "实际原图确认物理31页为印刷24页，继续第6单元；例子C_35^3的分式、乘积和6545按原印一行保留。",
    "无编号正文表按整表一个粗框保存，不造图号、图题或owner-ex。表内m列0至5、n行0至5、三角形组合数与无表头右列1、2、4、8、16、32全部由原裁图保存，空白单元格和空白右列表头不补内容。",
    "习题49的а)、б)、в)和题50的а)、б)均为西里尔标号；题49的四项数字条件保持印刷同排及断行。第50题本页只到“满足”，标记ex open续下页。",
    "表格外16个内容行加页脚1行；本页无脚注。首次19/17失败保留；独立源审查确认右缘孤立污墨及底边扫描线，仅登记计数副本排除，不改表格、原文或原像素。"
  ],
  "count_exclusions": [
    {
      "kind": "scan-artifact",
      "box": [
        1560,
        830,
        65,
        50
      ],
      "reason": "Independent source review confirms an irregular right-margin blob at x1566..1606,y835..873 only. The table ends at x1368; no table cell, border, caption, mathematical dot or letter is masked. This box obeys the existing right10% guard."
    },
    {
      "kind": "scan-artifact",
      "box": [
        0,
        2330,
        1695,
        51
      ],
      "reason": "Independent source review confirms the dense bottom scan boundary below the actual folio ending at y2192. This existing bottom5% strip contains no instructional or folio glyph pixels; the table and original scan remain unchanged."
    }
  ],
  "errata": [],
  "source": {
    "pdf": "9c 苏联十年制学校数学教材 代数和分析初步 九年级.pdf",
    "pdf_sha256": "622f972014ce83a76a36b3174ce6d6995e77b86efa0f8dbaba7f5497729a8aec",
    "pdf_page": 31
  },
  "render": {
    "dpi": 300,
    "w": 1695,
    "h": 2381,
    "sha256": "4d64fe5dfe10ba7d5a8e845e82bfd471af14157621fbb5fd27aa0d5685e86e50"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849"
  },
  "printed_lines": 17,
  "figures": [
    {
      "id": "tbl-p0031-01",
      "label": "表",
      "box": [
        142,
        826,
        1227,
        497
      ]
    }
  ],
  "provenance": {
    "cap": "1",
    "normalized": true
  }
}
---

<!-- p -->
例如，
$C_{35}^3=\frac{35\times34\times33}{6}=35\times17\times11=6545$.
因此，从一个有35个学生的班级中，选举三个代表参加一个
会议，有6545种选法（不考虑姓名的顺序）.

<!-- p -->
下面列出了一个不大的$C_n^m$数值的表格. 表格最右边列
出对应于一个给定的$n$的所有$C_n^m$的和（对于满足$0\leqslant m\leqslant n$
的$m$，$C_n^m$有定义）.

<!-- fig 表 box 142,826,1227,497 -->
![表](figures/tbl-p0031-01.png)

<!-- exhead -->
习题

<!-- ex 49 -->
49. 写出集合$M$的一切子集和子集的个数，如果：
а) $M=\{1\}$；б) $M=\{1,2\}$；в) $M=\{a,b,c,d\}$.
对于情况в)，写出所有符合下列条件的子集：
1) 一个元素的子集；2) 两个元素的子集；3) 三个元
素的子集；4) 四个元素的子集.

<!-- ex 50 open -->
50. 给定集合$X=\{a,b,c,d\}$. 写出集合$X$所有满足下列条
件的子集：
а) 不包含元素$a$的子集；б) 包含元素$a$的子集. 满足

<!-- foot -->
· 24 ·
