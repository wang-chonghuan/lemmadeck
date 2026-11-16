---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "10c",
  "page": 37,
  "printed_page": 31,
  "source": {
    "pdf": "10c 苏联十年制学校数学教材 代数和分析初步 十年级.pdf",
    "pdf_sha256": "47b0358c5781f509ce35e0e22de13c6bb539b246099ade66e8856c9288954e40",
    "pdf_page": 37
  },
  "render": {
    "dpi": 300,
    "w": 1695,
    "h": 2580,
    "sha256": "1b4d0456fa48d27e1888367920905e7db29bea283e0ecca336318b7d4f3fa1e7"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849"
  },
  "notes": [
    "原PNG与网格先于MD逐张完整打开；人工计19个印刷横排含页码，无插图。",
    "首句cont承接物理36末“很”；六条公式各印刷两排，各用一个↵保留真实断行，共六个，不拆高分式为两行。",
    "所有加法展开、0/1系数、乘点、中间函数值及双负号逐项照原保留，不按结果反推或压缩。",
    "八年级几何第102小节的原文引用完整保留，不读取他册内容。",
    "页末最后公式句点闭合，不虚设跨页公式open；页边噪迹不写进正文，不填count exclusions。"
  ],
  "errata": []
}
---

<!-- p cont -->
容易推出：

<!-- p -->
$\sin(\frac{\pi}{2}+\alpha)=\sin\frac{\pi}{2}\cdot\cos\alpha+\cos\frac{\pi}{2}\cdot\sin\alpha↵=1\cdot\cos\alpha+0\cdot\sin\alpha=\cos\alpha$，

<!-- p -->
$\cos(\frac{\pi}{2}+\alpha)=\cos\frac{\pi}{2}\cdot\cos\alpha-\sin\frac{\pi}{2}\cdot\sin\alpha↵=0\cdot\cos\alpha-1\cdot\sin\alpha=-\sin\alpha$.

<!-- p -->
（在八年级几何教材第102小节里给出了另一种证明
方法.)

<!-- p -->
利用加法定理，同样可以得出对于角度 $\pi+\alpha$ 和 $\frac{3\pi}{2}+\alpha$ 的
诱导公式.

<!-- p -->
然而，也可以用下面的方式处理：

<!-- p -->
$\sin(\pi+\alpha)=\sin[\frac{\pi}{2}+(\frac{\pi}{2}+\alpha)]↵=\cos(\frac{\pi}{2}+\alpha)=-\sin\alpha$，

<!-- p -->
$\cos(\pi+\alpha)=\cos[\frac{\pi}{2}+(\frac{\pi}{2}+\alpha)]↵=-\sin(\frac{\pi}{2}+\alpha)=-\cos\alpha$，

<!-- p -->
$\sin(\frac{3\pi}{2}+\alpha)=\sin[\pi+(\frac{\pi}{2}+\alpha)]↵=-\sin(\frac{\pi}{2}+\alpha)=-\cos\alpha$，

<!-- p -->
$\cos(\frac{3\pi}{2}+\alpha)=\cos[\pi+(\frac{\pi}{2}+\alpha)]↵=-\cos(\frac{\pi}{2}+\alpha)=-(-\sin\alpha)=\sin\alpha$.

<!-- foot -->
· 31 ·
