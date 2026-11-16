---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "10c",
  "page": 38,
  "printed_page": 32,
  "source": {
    "pdf": "10c 苏联十年制学校数学教材 代数和分析初步 十年级.pdf",
    "pdf_sha256": "47b0358c5781f509ce35e0e22de13c6bb539b246099ade66e8856c9288954e40",
    "pdf_page": 38
  },
  "render": {
    "dpi": 300,
    "w": 1695,
    "h": 2580,
    "sha256": "240b9f30df2c58441a0811d79caa6028f646cf571bebaddd0061a46ccc90b199"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849"
  },
  "notes": [
    "原PNG/网格先于MD逐张完整打开；人工计正文14个印刷横排含页码，表内行作为插图不计正文。",
    "无编号正文表保留四列、一表头、三数据行和全部横竖边框，不重构表值，不添加图号。",
    "原文为自变量alpha及闭区间[0,pi/2]，按源保持，不据函数未定义端点补限制或改区间。",
    "页末两条嵌套分式各为一印刷横排，不按分子分母拆行，不加↵；所有中间正负号照抄。",
    "本页无题号、星标、新小节；首段非物理37未完词的续文，最后公式句点闭合。",
    "不据四页边界认定83整课完成，不写counter exclusions或数学勘误。"
  ],
  "errata": [],
  "printed_lines": 14,
  "figures": [
    {
      "id": "tbl-p0038-01",
      "label": "表",
      "box": [
        231,
        775,
        1117,
        556
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
函数 $\operatorname{tg}$ 和 $\operatorname{ctg}$ 具有周期 $\pi$. 因为任何数 $x$ 可以写成：
$x=\pi n+u$，其中 $0\leq u<\pi$，$n\in Z$，
所以当 $x$ 是任何数时，求 $\operatorname{tg}$ 和 $\operatorname{ctg}$ 的值归结成自变量 $u$ 值处
在 $0\leq u<\pi$ 的范围的情形. 为了使自变量 $\alpha$ 变成在区间
$[0,\frac{\pi}{2}]$ 内的情形，用下表（对于正切和余切的诱导公式表）的
第1行就够了：

<!-- fig 表 box 231,775,1117,556 -->
![表](figures/tbl-p0038-01.png)

<!-- p -->
第2行里列出的公式表示这种情形：正切和余切都是奇
函数. 根据第2行结果，在第1行中用 $-\alpha$ 代替 $\alpha$，就得出第
3行.

<!-- p -->
这个表里第1行的公式，很容易由正弦和余弦的诱导公
式得出：

<!-- p -->
$\operatorname{tg}(\frac{\pi}{2}+\alpha)=\frac{\sin(\frac{\pi}{2}+\alpha)}{\cos(\frac{\pi}{2}+\alpha)}=\frac{\cos\alpha}{-\sin\alpha}=-\operatorname{ctg}\alpha$，

<!-- p -->
$\operatorname{ctg}(\frac{\pi}{2}+\alpha)=\frac{\cos(\frac{\pi}{2}+\alpha)}{\sin(\frac{\pi}{2}+\alpha)}=\frac{-\sin\alpha}{\cos\alpha}=-\operatorname{tg}\alpha$.

<!-- foot -->
· 32 ·
