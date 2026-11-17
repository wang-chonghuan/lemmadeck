---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "10c",
  "page": 165,
  "printed_page": 159,
  "source": {
    "pdf": "10c 苏联十年制学校数学教材 代数和分析初步 十年级.pdf",
    "pdf_sha256": "47b0358c5781f509ce35e0e22de13c6bb539b246099ade66e8856c9288954e40",
    "pdf_page": 165
  },
  "render": {
    "dpi": 300,
    "w": 1695,
    "h": 2580,
    "sha256": "94ef3110d4d42c922dbb5aecf4c493326e0cfc3929a6422ddbdfe89a4f5168fb"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849"
  },
  "notes": [
    "AUTHOR ONLY：图 75 粗框只含图形，图题另列并与“设”同排。页首续物理页 0164，页尾第 4 条性质及括号续下页；性质编号不是习题编号。",
    "唯一 StageB 对照确认性质 2 占两印刷行；仅移除已有 ↵ 后重复表达同一断点的 Markdown 换行，保留全部文字、公式及一个 ↵。不声明下游行数已通过。",
    "独立 NEW native crop 后图 75 原点字形仍为 O/0 UNKNOWN；不得由作者自述或坐标惯例替代像素判定。"
  ],
  "errata": []
}
---

<!-- p cont -->
有极小值 $f_{\min}=f(e^{-2})=\frac{-2}{e}$．在图 75 中作出了函数 $f$ 的
图象．

<!-- p -->
现在我们来证明第 109 小节中的(5)式：

<!-- p -->
$e=\lim_{n\to\infty}\left(1+\frac{1}{n}\right)^n$．

<!-- fig 图 75 box 990,570,480,470 -->

<!-- p -->
我们将从等式
$\ln' x=\frac{1}{x}$
出发．

<!-- p -->
当 $x=1$ 时，得到：

<!-- p -->
$\ln'(1)=\lim_{h\to0}\frac{\ln(1+h)}{h}=1$．

<!-- p open -->
设

<!-- cap 图 75 samerow -->
图 75

<!-- p cont -->
$h_n=\frac{1}{n}$，
$y_n=n\ln\left(1+\frac{1}{n}\right)$，$z_n=e^{y_n}=\left(1+\frac{1}{n}\right)^n$，
并利用函数 $\ln$ 与 $\exp$ 的连续性求这些数列的极限：

<!-- p -->
$\lim_{n\to\infty}h_n=0$，

<!-- p -->
$\lim_{n\to\infty}y_n=\lim_{n\to\infty}\frac{\ln(1+h_n)}{h_n}=\lim_{h\to0}\frac{\ln(1+h)}{h}=1$，

<!-- p -->
$\lim_{n\to\infty}z_n=\lim_{n\to\infty}\exp(y_n)=\exp\left(\lim_{n\to\infty}y_n\right)=\exp(1)=e$．

<!-- p -->
现在我们列出对数函数的基本性质：

<!-- p -->
1．对数函数的定义域是区间 $]0,\infty[$：$D(\log_a)=R_+$．

<!-- p -->
2．对数函数值的集合是整个数轴 $]-\infty,\infty[$：$E(\log_a)↵=R$．

<!-- p -->
3．对数函数连续并且可以微分．

<!-- p open -->
4．底 $a>1$ 的对数函数在它的定义域 $R_+$ 内上升．当
$0<a<1$ 时，以 $a$ 为底的对数函数在它的定义域内下降(参看

<!-- foot -->
• 159 •
