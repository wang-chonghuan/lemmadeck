---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "10c",
  "page": 164,
  "printed_page": 158,
  "source": {
    "pdf": "10c 苏联十年制学校数学教材 代数和分析初步 十年级.pdf",
    "pdf_sha256": "47b0358c5781f509ce35e0e22de13c6bb539b246099ade66e8856c9288954e40",
    "pdf_page": 164
  },
  "render": {
    "dpi": 300,
    "w": 1695,
    "h": 2580,
    "sha256": "c237ccfe747d9fb8668cf07b0027ed1f0fc3301fc206202c1be3b6b20fe94ab5"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849"
  },
  "notes": [
    "AUTHOR ONLY：顶部承接上页正文；单元 113 归属暂定，须由父会话结合另行观察的物理页 0163 文字确认。本页未见单元标题，末句续下页。",
    "唯一 StageB 对照确认导函数推导占两印刷行；仅移除已有 ↵ 后重复表达同一断点的 Markdown 换行，保留全部等式、符号及一个 ↵。不声明下游行数已通过。"
  ],
  "errata": [],
  "printed_lines": 21,
  "figures": [],
  "provenance": {
    "cap": "1",
    "normalized": true
  }
}
---

<!-- p cont -->
定义．由(2)式得出，在 $R_+$ 上 $\ln x$ 是它的原函数．

<!-- p -->
我们来证明，在 $]-\infty,0[$ 上，函数 $f$ 的一个原函数是函数
$\ln(-x)$．事实上，

<!-- p -->
$[\ln(-x)]'=\frac{1}{-x}(-x)'=\left(-\frac{1}{x}\right)(-1)=\frac{1}{x}$．

<!-- p -->
例 2 求函数 $\frac{1}{2+3x}$ 的原函数．

<!-- p -->
这个函数在区间 $]-\infty,-\frac{2}{3}[$ 和 $]-\frac{2}{3},\infty[$ 上有定义．在
区间 $]-\frac{2}{3},\infty[$ 上，$2+3x>0$，根据求原函数的法则，所求的原
函数是函数 $\frac{\ln(2+3x)}{3}+C$．而在区间 $]-\infty,-\frac{2}{3}[$ 上，函数
$y=\frac{1}{2+3x}$ 的原函数就是函数 $\frac{\ln(-2-3x)}{3}+C_1$．事实上，

<!-- p -->
$\left[\frac{\ln(-2-3x)}{3}+C_1\right]'=\frac{1}{-2-3x}\cdot(-3)\cdot\frac{1}{3}=\frac{1}{2+3x}$．

<!-- p -->
例 3 作出函数 $f(x)=\sqrt{x}\ln x$ 的图象．

<!-- p -->
这个函数的定义域是区间 $]0,\infty[$．在这个区间内，函数
$f$ 连续并且当 $x=1$ 时它等于零．我们来讨论函数 $f$ 的增减
性和极值．为此，求导函数

<!-- p -->
$f'(x)=(\sqrt{x}\ln x)'=\sqrt{x}'\ln x+\sqrt{x}(\ln x)'↵=\frac{\ln x}{2\sqrt{x}}+\frac{\sqrt{x}}{x}=\frac{\ln x+2}{2\sqrt{x}}$．

<!-- p open -->
当 $\ln x=-2$ 也就是当 $x=e^{-2}$ 时，它等于零．在区间 $]e^{-2},\infty[$
上，导函数 $f'>0$；因此，在这个区间上，函数 $f$ 上升．在区间
$]0,e^{-2}[$ 上，导函数 $f'<0$；因此，在这个区间上，函数 $f$ 下降．
在点 $e^{-2}$，导函数 $f'$ 由负号变成正号，因此，函数 $f$ 在点 $e^{-2}$ 具

<!-- foot -->
• 158 •
