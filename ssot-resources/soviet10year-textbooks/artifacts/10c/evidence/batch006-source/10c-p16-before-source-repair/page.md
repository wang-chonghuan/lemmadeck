---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "10c",
  "page": 16,
  "printed_page": 10,
  "source": {
    "pdf": "10c 苏联十年制学校数学教材 代数和分析初步 十年级.pdf",
    "pdf_sha256": "47b0358c5781f509ce35e0e22de13c6bb539b246099ade66e8856c9288954e40",
    "pdf_page": 16
  },
  "render": {
    "dpi": 300,
    "w": 1695,
    "h": 2580,
    "sha256": "ccecddca9bd0eee706caea1de7612167a0e164e446b2b7874bc592d3c0698340"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849"
  },
  "notes": [
    "页首一句接完上一页定理3的证明。习题32至41属于n77；同页开始78*，页末证明停在得到冒号后，续下一页。",
    "原图人工观察为19个正文/题/标题/公式横排及1个页脚横排。题32/33/34、35/36/37、38/39分别同排；题41分段函数上下两个分支为两排，左侧f(x)=处于两排之间，不另计一排。",
    "分段函数的中文条件以LaTeX文本保留在对应分支中；没有解题或更改原式。页边孤立黑点、底边细线不属于正文；未登记排除框或修改源像素。"
  ],
  "errata": [],
  "printed_lines": 20,
  "figures": [],
  "provenance": {
    "cap": "1",
    "normalized": true
  }
}
---

<!-- p cont -->
类似地，可以证明定理 3 的第二部分.

<!-- exhead -->
习题*

<!-- p -->
求极限：

<!-- ex 32 -->
32. $\lim_{x\to0}\sin x$.

<!-- ex 33 samerow -->
33. $\lim_{x\to\frac{\pi}{2}}\sin x$.

<!-- ex 34 samerow -->
34. $\lim_{x\to0}\cos x$.

<!-- ex 35 -->
35. $\lim_{x\to\frac{\pi}{4}}\cos x$.

<!-- ex 36 samerow -->
36. $\lim_{x\to0}\operatorname{tg}x$.

<!-- ex 37 samerow -->
37. $\lim_{x\to\frac{\pi}{4}}\operatorname{tg}x$.

<!-- ex 38 -->
38. $\lim_{x\to\frac{\pi}{4}}\operatorname{ctg}x$.

<!-- ex 39 samerow -->
39. $\lim_{x\to\frac{\pi}{2}}\operatorname{ctg}x$.

<!-- ex 40 -->
40. 证明函数 $\sin$ 在点 $x_0\in R$ 和函数 $\operatorname{ctg}$ 在点 $x_0\in D(\operatorname{ctg})$ 的连
续性.

<!-- ex 41 -->
41. 证明：对于所有的 $x\in R$，函数 $f$ 是连续的，其中
$f(x)=\begin{cases}\frac{\sin x}{x}&\text{当 }x\ne0\text{ 时，}\\↵1&\text{当 }x=0\text{ 时.}\end{cases}$
作出它的图象.

<!-- h3 -->
78*　弦长与弦所对的弧长的比的极限

<!-- p -->
我们从证明第 75 小节假设 6 着手.

<!-- p -->
定理 1
$\lim_{x\to0}\frac{\sin x}{x}=1$.

<!-- p open -->
证明　设 $0<x<\frac{\pi}{2}$ 或 $-\frac{\pi}{2}<x<0$. 于是，有不等式
$|\sin x|<|x|<|\operatorname{tg}x|$（参看第 77 小节）. 用 $|\sin x|$ 除这个不
等式的各个部分，得到：

<!-- foot -->
· 10 ·
