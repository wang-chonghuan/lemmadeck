---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "9-10g",
  "page": 308,
  "printed_page": 301,
  "numbering_scope": "g10",
  "source": {
    "pdf": "9-10g 苏联十年制学校数学教材 几何 9-10年级.pdf",
    "pdf_sha256": "1900be5207d00404f64e5a40ab855fbfb8495bd2a06c5ce295ae0e145444578a",
    "pdf_page": 308
  },
  "render": {
    "dpi": 300,
    "w": 1506,
    "h": 2126,
    "sha256": "e82c528f9181f9bfc4d675da7f6c63ddbd30cccde5f840efe00a5ea09b3ad8f5"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "19d56195a3a63cf4be93a7a159e1513d37b9b17d1b92235d8ae3d4e826cc45d0"
  },
  "notes": [
    "FIRST sealed before manifest/layout/template/predecessor reads; source308 only, four native image loads before seal.",
    "Printed sentence periods are ASCII '.', retained exactly; no Chinese sentence-period conversion.",
    "Top printed answer has two items and five values. After FIRST, supplied predecessor text identifies exercise 2 as its owner. ex 2 cont is an answer continuation candidate, not proof of the predecessor card's right boundary; supplied predecessor open=false is preserved, not edited or approved.",
    "Actual new title 三面角存在的充分必要条件(§41) follows exercise 4 on this page. Theorem/proof/case labels are internal, not whole-card headings.",
    "Final proof tail remains OPEN: two cases were announced but only the first is present here; closed final sentence and footer 301 do not establish the new card's right boundary.",
    "The a-shaped source case marker is visually Latin/Cyrillic ambiguous; Cyrillic а (U+0430) follows the native source profile, not a pixel-proven script identity.",
    "Row 18 uses the observed slanted less-than-or-equal glyph, encoded as LaTeX leqslant. The inequality across source rows 19-20 is one formula with the sanctioned printed-row wrap marker.",
    "No source figures, captions, tables or figure references. No neighboring source pixels read. Source science/independent review/whole-card approval remain pending.",
    "H303, H304 plane-reference, H300, H301 and all real inherited HOLDs are preserved without adjudicating earlier objects. A new independent source card candidate is not blanket-blocked by them."
  ],
  "errata": [
    {
      "id": "p0308-ex2-answer2",
      "block": "p0308#1",
      "original": "2) $\\approx26^\\circ34',\\ \\approx98^\\circ35'$.",
      "reason": "Actual stated30/90 face angles and included right dihedral give third face90 and remaining internal30/90, or supplementary150/90. Concrete ray witness determinant1/2. Neither printed26deg34min nor98deg35min matches, irrespective of the unspecified target."
    }
  ],
  "printed_lines": 25,
  "figures": [],
  "provenance": {
    "cap": "1",
    "normalized": true
  }
}
---

<!-- ex 2 cont -->
答：1) $\approx54^\circ44',\ \approx109^\circ28',\ \approx125^\circ16'$；
2) $\approx26^\circ34',\ \approx98^\circ35'$.

<!-- ex 3 -->
3. 在三面角中有两个面角的值相等，证明它们所对的二面角相
等.

<!-- ex 4 -->
4. 三面角中有两个面角合同，第三个面角是直角. 证明：等于直
角的面角所对的二面角不是锐角.

<!-- h3 -->
三面角存在的充分必要条件(§41)

<!-- p -->
定理. 三面角存在的充分必要条件是属于$]0^\circ,180^\circ[$的
三个面角$\alpha$、$\beta$、$\gamma$满足不等式：
$|\beta-\gamma|<\alpha<\beta+\gamma$ (1)
和
$\alpha+\beta+\gamma<360^\circ$. (2)

<!-- p -->
证明. 1) 必要性. 如果存在面角为$\alpha$、$\beta$、$\gamma$的三面角，
根据§41定理，不等式(1)和(2)成立.

<!-- p -->
2) 充分性. 如果三个面角$\alpha$、$\beta$、$\gamma$满足不等式(1)和
(2). 需要证明：以这三个角$\alpha$、$\beta$、$\gamma$为面角的三面角存在.

<!-- p -->
考虑两种情况.

<!-- p -->
а) $\beta+\gamma\leqslant180^\circ$. 在区间$[0^\circ,180^\circ]$里，余弦函数是单调
递减的，所以由不等式(1)可得不等式$\cos(\beta+\gamma)<\cos\alpha<↵\cos|\beta-\gamma|$. 利用余弦的奇偶性，省去绝对值号，然后运用三
角公式：
$\cos\beta\cos\gamma-\sin\beta\sin\gamma<\cos\alpha<\cos\beta\cos\gamma+\sin\beta\sin\gamma$.

<!-- p open -->
因为$\sin\beta\sin\gamma>0$，由上面的不等式，得到

<!-- p cont open -->
$-1<\frac{\cos\alpha-\cos\beta\cos\gamma}{\sin\beta\sin\gamma}<1$.

<!-- foot -->
· 301 ·
