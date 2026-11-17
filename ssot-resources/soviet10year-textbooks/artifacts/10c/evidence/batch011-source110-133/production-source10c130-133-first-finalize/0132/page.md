---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "10c",
  "page": 132,
  "printed_page": 126,
  "source": {
    "pdf": "10c 苏联十年制学校数学教材 代数和分析初步 十年级.pdf",
    "pdf_sha256": "47b0358c5781f509ce35e0e22de13c6bb539b246099ade66e8856c9288954e40",
    "pdf_page": 132
  },
  "render": {
    "dpi": 300,
    "w": 1695,
    "h": 2580,
    "sha256": "f57c201e62a33505f186c6d093512a4afa7a9225bf61b42189518827a07cd83d"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849"
  },
  "notes": [
    "No actual heading, source exercise, figure, or caption. All rows are unit106 theory and proofs.",
    "ProofIII prints f(kx+ at the end of one row and p) at the beginning of the next; both row fragments are preserved.",
    "The second F argument in the penultimate proofIII equality is ka+p, confirmed by a native equal-pixel crop; no erratum.",
    "ProofIII is open to the one-row conclusion on physical133. Manual distinct printed rows including footer: 21; raw prepare bands are not authoritative."
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

<!-- p -->
III. 按照公式 $t=kx+p$（$k$ 和 $p$ 是常数，$k\ne0$）作变量替换：
$\int_a^b f(kx+p)dx=\frac{1}{k}\int_{ka+p}^{kb+p}f(t)dt$。

<!-- p -->
为了证明这些公式，我们来讨论函数 $f$ 的原函数 $F$ 和函
数 $g$ 的原函数 $G$。根据第 $99$ 小节的定理 $1$，和 $F+G$ 是函数
$f+g$ 的原函数。因此根据牛顿-莱布尼兹公式，得
$\int_a^b[f(x)+g(x)]dx=[F(x)+G(x)]\big|_a^b$
$=F(b)+G(b)-F(a)-G(a)$
$=F(b)-F(a)+G(b)-G(a)$
$=\int_a^b f(x)dx+\int_a^b g(x)dx$。
法则 I 得证。

<!-- p -->
根据第 $99$ 小节的定理 $2$，积 $kF$ 是函数 $kf$ 的原函数，因
此根据牛顿-莱布尼兹公式，得
$\int_a^b kf(x)dx=kF(x)\big|_a^b=kF(b)-kF(a)=k[F(b)-F(a)]$
$=k\int_a^b f(x)dx$。
法则 II 得证。

<!-- p open -->
根据第 $99$ 小节的定理 $3$，函数 $\frac{1}{k}F(kx+p)$ 是函数 $f(kx+$
$p)$ 的原函数，因此根据牛顿-莱布尼兹公式，得：
$\int_a^b f(kx+p)dx=\frac{1}{k}F(kx+p)\big|_a^b$
$=\frac{1}{k}F(kb+p)-\frac{1}{k}F(ka+p)$
$=\frac{1}{k}\left[F(t)\big|_{ka+p}^{kb+p}\right]=\frac{1}{k}\int_{ka+p}^{kb+p}f(t)dt$。

<!-- foot -->
• $126$ •
