---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "10c",
  "page": 170,
  "printed_page": 164,
  "source": {
    "pdf": "10c 苏联十年制学校数学教材 代数和分析初步 十年级.pdf",
    "pdf_sha256": "47b0358c5781f509ce35e0e22de13c6bb539b246099ade66e8856c9288954e40",
    "pdf_page": 170
  },
  "render": {
    "dpi": 300,
    "w": 1695,
    "h": 2580,
    "sha256": "68ffce71c08910ed4882f42608268333d84ecef250b35404795d23d96aeb343b"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849"
  },
  "notes": [
    "页首为性质5的证明；随后性质6和7仍属第114单元，未见新标题或习题。",
    "性质6的分步标号和引用保留西里尔а、б、в、г；原生裁片确认г步引用б)和в)，以及ln括号内x的m/n次方再在括号外取n次方。",
    "б步公式有两个下括号：第一个位于ln括号内的x…x下面，标为r个因数；第二个跨ln x的和，标为r项。两标签共用一个低行，在同一MD公式内仅放一个↵，不另加MD换行。",
    "于是与ln x^r=(m/n)ln x=r ln x共用一个印刷行，不另拆行；Q、R按原印普通字母保存。",
    "末段止于函数，承接物理171页的值的集合，标为open。",
    "页码两侧实心圆点保留；页边孤立墨痕记录为未分类痕迹，不设置count_exclusions。"
  ],
  "errata": [],
  "printed_lines": 22,
  "figures": [],
  "provenance": {
    "cap": "1",
    "normalized": true
  }
}
---

<!-- p cont -->
实际上，$\ln a=\ln\left(\frac{a}{b}\cdot b\right)=\ln\frac{a}{b}+\ln b$.
于是，
$\ln\frac{a}{b}=\ln a-\ln b$.

<!-- p -->
6. 对于 $x>0$ 并且 $r\in Q$，
$\ln x^r=r\ln x$.

<!-- p -->
我们分几步进行证明.

<!-- p -->
а) 对于 $r=0$ 和 $r=1$：
$\ln x^0=\ln1=0=0\cdot\ln x$.
$\ln x^1=\ln x=1\cdot\ln x$.

<!-- p -->
б) 对于自然数 $r>1$：
$\ln x^r=\ln(\underbrace{x\cdots x}_{↵r\text{ 个因数}})=\underbrace{\ln x+\ln x+\cdots+\ln x}_{r\text{ 项}}=r\ln x$.

<!-- p -->
в) 对于负整数 $r$，就是 $r=-n$，这里 $n$ 是自然数，利用性
质 5，得到：
$\ln x^r=\ln\frac{1}{x^n}=\ln1-\ln x^n=0-n\ln x=r\ln x$.

<!-- p -->
г) 对于 $r=\frac{m}{n}$（$m$ 是整数，$n$ 是自然数），由于 б) 和 в)，
得到：
$n\ln x^r=n\ln x^{\frac{m}{n}}=\ln\left(x^{\frac{m}{n}}\right)^n=\ln x^m=m\ln x$.
于是，　$\ln x^r=\frac{m}{n}\ln x=r\ln x$.

<!-- p -->
7. $E(\ln)=R$.

<!-- p open -->
函数 $\ln$ 连续. 根据第 84 小节中定理的第一部分，函数

<!-- foot -->
• 164 •
