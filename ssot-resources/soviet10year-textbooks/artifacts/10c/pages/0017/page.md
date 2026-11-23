---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "10c",
  "page": 17,
  "printed_page": 11,
  "source": {
    "pdf": "10c 苏联十年制学校数学教材 代数和分析初步 十年级.pdf",
    "pdf_sha256": "47b0358c5781f509ce35e0e22de13c6bb539b246099ade66e8856c9288954e40",
    "pdf_page": 17
  },
  "render": {
    "dpi": 300,
    "w": 1695,
    "h": 2580,
    "sha256": "4214f52aa58439c1042685a87be35752bd4fbf4c9fb0d9de439d25b4cc54aba5"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849"
  },
  "notes": [
    "页首不等式承接上一页n78定理1证明的冒号；完成证明后为例1至例3；页末注释在这个函处断字，续至下一页。",
    "原图人工观察为18个正文/公式横排及1个页脚横排。绝对值估计等式实际两排；例1的嵌套分式和极限上下标仍为一个横排。无图；上下边细线和左边孤立黑点不属于正文，仅登记已独立确认的底部扫描边界计数排除，不修改源像素。"
  ],
  "errata": [],
  "count_exclusions": [
    {
      "kind": "scan-artifact",
      "box": [
        0,
        2452,
        1695,
        128
      ],
      "reason": "独立源审与母方局部原像素确认folio11结束于y2312，其下额外y2491–2508带为扫描下边界；此底部5%范围不含正文、公式、题号、图题或folio，仅作用计数副本，不改源像素。"
    }
  ],
  "printed_lines": 19,
  "figures": [],
  "provenance": {
    "cap": "1",
    "normalized": true
  }
}
---

<!-- p cont -->
$1<\left|\frac{x}{\sin x}\right|<\frac{1}{|\cos x|}$.
考虑到在给定条件下，$\frac{x}{\sin x}>0$，$\cos x>0$，就有
$1<\frac{x}{\sin x}<\frac{1}{\cos x}$，　因此　$1>\frac{\sin x}{x}>\cos x$.
由此得到：
$0<1-\frac{\sin x}{x}<1-\cos x=\cos0-\cos x$.
因为余弦函数是连续函数，那么对于任意的 $\varepsilon>0$，可以指定
$\delta>0$，使得
$|0-x|<\delta\Longrightarrow|\cos0-\cos x|<\varepsilon$.
因此，对于 $x\ne0$ 并满足不等式 $|x|<\delta$ 的 $x$，有
$\left|1-\frac{\sin x}{x}\right|=1-\frac{\sin x}{x}<\cos0-\cos x↵=|\cos0-\cos x|<\varepsilon$.
这就是说，
$\lim_{x\to0}\frac{\sin x}{x}=1$.

<!-- p -->
根据定理 1，可以计算某些极限.

<!-- p -->
例 1　$\lim_{x\to0}\frac{x}{\sin x}=\lim_{x\to0}\frac{1}{\frac{\sin x}{x}}=\frac{1}{\lim_{x\to0}\frac{\sin x}{x}}=\frac{1}{1}=1$.

<!-- p -->
例 2　$\lim_{x\to0}\frac{\sin4x}{x}=\lim_{x\to0}\frac{\sin4x}{4x}\cdot4=1\cdot4=4$.

<!-- p -->
例 3　$\lim_{x\to0}\frac{\operatorname{tg}x}{x}=\lim_{x\to0}\frac{\sin x}{x}\cdot\frac{1}{\cos x}=\lim_{x\to0}\frac{\sin x}{x}\cdot\lim_{x\to0}\frac{1}{\cos x}=1$.

<!-- p open -->
注　在数学分析里，正弦是数值自变量的数值函数. 但是这个函

<!-- foot -->
· 11 ·
