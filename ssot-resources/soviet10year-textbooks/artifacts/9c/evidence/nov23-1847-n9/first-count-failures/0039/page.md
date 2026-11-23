---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "9c",
  "page": 39,
  "printed_page": 32,
  "source": {
    "pdf": "9c 苏联十年制学校数学教材 代数和分析初步 九年级.pdf",
    "pdf_sha256": "622f972014ce83a76a36b3174ce6d6995e77b86efa0f8dbaba7f5497729a8aec",
    "pdf_page": 39
  },
  "render": {
    "dpi": 300,
    "w": 1695,
    "h": 2381,
    "sha256": "085cb7726695bcee5b28e830e6feb5af349e6435e5b2e18fe5a9f8ed4750717f"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "19d56195a3a63cf4be93a7a159e1513d37b9b17d1b92235d8ae3d4e826cc45d0"
  },
  "notes": [
    "原图首次阅读后转写，无图、表、习题或脚注。一般归纳步骤的展开式保留九个印刷行，以八个↵记录。",
    "末块推论2°在“a与b的幂”处跨页，标记open；不按数学语义补齐下一页。页边墨迹不作教材对象，未设置计数排除。"
  ],
  "errata": [],
  "printed_lines": 26,
  "figures": [],
  "provenance": {
    "cap": "1",
    "normalized": true
  }
}
---

<!-- p -->
因为
$C_3^0=1=C_4^0$，$C_3^0+C_3^1=C_4^1$，$C_3^1+C_3^2=C_4^2$，
$C_3^2+C_3^3=C_4^3$，$C_3^3=1=C_4^4$，
因此最后得
$(a+b)^4=C_4^0a^4+C_4^1a^3b+C_4^2a^2b^2+C_4^3ab^3+C_4^4b^4$.

<!-- p -->
对于任意自然数$k$，类似地进行计算：
$(a+b)^{k+1}=(C_k^0a^k+C_k^1a^{k-1}b+\cdots+C_k^ma^{k-m}b^m↵+\cdots+C_k^kb^k)(a+b)↵=C_k^0a^{k+1}+C_k^1a^kb+\cdots+C_k^{m+1}a^{k-m}b^{m+1}+\cdots+C_k^kab^k↵+C_k^0a^kb+\cdots+C_k^ma^{k-m}b^{m+1}+\cdots+C_k^{k-1}ab^k↵+C_k^kb^{k+1}↵=C_k^0a^{k+1}+(C_k^0+C_k^1)a^kb+\cdots+(C_k^m+C_k^{m+1})a^{k-m}b^{m+1}↵+\cdots+(C_k^{k-1}+C_k^k)ab^k+C_k^kb^{k+1}↵=C_{k+1}^0a^{k+1}+C_{k+1}^1a^kb+\cdots+C_{k+1}^{m+1}a^{k-m}b^{m+1}+\cdots↵+C_{k+1}^kab^k+C_{k+1}^{k+1}b^{k+1}$.

<!-- p -->
由（1）和（2），根据数学归纳法得出：对于任意自然数$n$，
命题$A(n)$成立. 公式（1）证毕.

<!-- p -->
例1. $(a+b)^7=a^7+7a^6b+21a^5b^2+35a^4b^3+35a^3b^4↵+21a^2b^5+7ab^6+b^7$.

<!-- p -->
牛顿公式中的系数$C_n^k$叫做二项式系数.

<!-- p -->
我们研究牛顿公式的主要推论.

<!-- p -->
1°. 根据牛顿公式，$(a+b)^n$的展开式有$n+1$项. 这可
由等式（1）看到（说明为什么）.

<!-- p open -->
2°. 牛顿公式即等式（1）里，$a$的幂指数由$n$减小到0，而
$b$的幂指数由0增加到$n$. 展开式的每一项中，$a$与$b$的幂

<!-- foot -->
• 32 •
