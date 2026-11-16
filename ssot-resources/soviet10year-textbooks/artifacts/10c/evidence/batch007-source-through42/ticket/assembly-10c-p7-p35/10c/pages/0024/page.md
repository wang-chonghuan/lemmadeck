---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "10c",
  "page": 24,
  "printed_page": 18,
  "source": {
    "pdf": "10c 苏联十年制学校数学教材 代数和分析初步 十年级.pdf",
    "pdf_sha256": "47b0358c5781f509ce35e0e22de13c6bb539b246099ade66e8856c9288954e40",
    "pdf_page": 24
  },
  "render": {
    "dpi": 300,
    "w": 1695,
    "h": 2580,
    "sha256": "47fd3f37eb74d76e56ea798d46f3fb7e72f1e7b66f437327bf8902d8831568bc"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849"
  },
  "notes": [
    "物理24页页脚18；无插图。实看正文/公式22横排，加页脚1横排，共23。",
    "页首两行承接物理23页末“于方程”；首行高分式是一横排。末尾左指实心三角以 blacktriangleleft 记录。",
    "保留微分方程说明、注、第110小节引用和公式(2)-(7)；原区间为左闭右开 [0,2pi[，未改成括号记号。",
    "页末止于“中学教科”，open 承接下一页；右缘零散黑点、底边长细线仅保留在原PNG，不作正文或计数排除。"
  ],
  "count_exclusions": [
    {
      "kind": "scan-artifact",
      "box": [
        0,
        2460,
        1695,
        40
      ],
      "reason": "源物理24页底部5%内的扫描边迹；Ptolemy只读诊断10c-p23-p25-count-diagnostic.md（SHA-256 f7f33c51058a1fbd3b8837f73b0d123ebf1841e7b817fa0715e7058d97dd4c90）及母方实际打开原像素p0024-folio-bottom-artifact.png确认此处无正文或公式，页码结束于y2278。本框在已观察crop内覆盖实际扫描迹，仅从计数副本排除，不改原PNG、正文、页码或裁图。"
    }
  ],
  "errata": [],
  "printed_lines": 23,
  "figures": [],
  "provenance": {
    "cap": "1",
    "normalized": true
  }
}
---

<!-- p cont -->
$x''(t)=-\frac{k}{m}x(t),$
也就是服从于（1）这种类型的方程. $\blacktriangleleft$

<!-- p -->
通常说，按照方程（1）随时间改变的物理量作谐振动. 方
程（1）本身叫做谐振动的微分方程.

<!-- p -->
注　一般地，表示函数和它的导数之间的关系的方程叫
做微分方程（关于微分方程可参看第110小节）.

<!-- p -->
怎样才能看出哪些函数满足具有任意已知正常数 $c$ 的微
分方程（1）呢？

<!-- p -->
$f(t)=A\cos(\omega t+\varphi)\qquad(2)$
这种类型的函数就是这样的函数，其中 $A$，$\omega$ 和 $\varphi$ 都是常数.
事实上，由（2）得出：
$f'(t)=-A\omega\sin(\omega t+\varphi),\qquad(3)$
$f''(t)=-A\omega^2\cos(\omega t+\varphi).\qquad(4)$

<!-- p -->
由（2）和（4）得到
$f''(t)=-\omega^2f(t),\qquad(5)$

<!-- p -->
也就是（1）这种类型的方程，其中
$c=\omega^2.\qquad(6)$

<!-- p -->
我们看到，按照规律（2）随时间改变的物理量作谐振动.
反过来说也成立，在实数集合 $R$ 上给出的任何满足方程（1）的
函数 $f$ 可以写成（2）的形式，其中
$\omega=\sqrt{c},\ A\geqslant0,\ \varphi\in[0,2\pi[.\qquad(7)$

<!-- p open -->
证明微分方程（1）的任一解具有（2）的形式超出中学教科

<!-- foot -->
· 18 ·
