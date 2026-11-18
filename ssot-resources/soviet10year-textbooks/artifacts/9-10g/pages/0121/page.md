---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "9-10g",
  "page": 121,
  "printed_page": 114,
  "source": {
    "pdf": "9-10g 苏联十年制学校数学教材 几何 9-10年级.pdf",
    "pdf_sha256": "1900be5207d00404f64e5a40ab855fbfb8495bd2a06c5ce295ae0e145444578a",
    "pdf_page": 121
  },
  "render": {
    "dpi": 300,
    "w": 1506,
    "h": 2126,
    "sha256": "52524665970229be72997141949f488c32a354fb2f33877caf60c7c8e210ab5e"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "19d56195a3a63cf4be93a7a159e1513d37b9b17d1b92235d8ae3d4e826cc45d0"
  },
  "notes": [
    "Physical121/printed114; one new full prepared page.grid.png view and one native ROI (100,165)-(1285,640), with no previous-image reopening. Context image total is8 including the prior five; no further image loading.",
    "Incoming exercise330 closes after both vector-angle cases, both dot products and the final printed radical. The native ROI confirms the radical has m^2+n^2 plus/minus 2mn cos(phi), without d^2. Original formula is retained exactly; a coordinate counterexample and source equation(1) confirm the registered mathematical printing error, not a speculative correction.",
    "The actual section36 heading 三垂线定理 follows the complete exercise330, closing section35. Full theorem21 statement, proof setup, sufficiency and necessity proof with printed black square, and complete exercise331 are preserved as boundary content only. Section36 is not claimed complete; no page122 or later acquisition.",
    "Figure131 belongs to section36's theorem21 proof, not exercise330 or331: A/B/C, m, alpha, both plane outlines, oblique/perpendicular/projection segments, dashed lines and right-angle mark. Caption shares the final proof-setup row 的射影(图131). No count exclusions or count overrides."
  ],
  "errata": [
    {
      "id": "p0121-math-1",
      "block": "p0121#1",
      "original": "$|AB|=\\sqrt{m^2+n^2\\pm2mn\\cos\\varphi}$",
      "reason": "Native source ROI confirms no d^2 term, although equation(1) on120 retains vec(d)^2 and d is the nonzero common-perpendicular length. Independent coordinate check: skew lines a=(t,0,0), b=(0,s,1), M=(0,0,0), N=(0,0,1), A=(1,0,0), B=(0,1,1) give m=n=d=1, phi=90 degrees and |AB|^2=3; the printed radical gives |AB|^2=2. Original is retained, not corrected."
    }
  ],
  "printed_lines": 24,
  "figures": [
    {
      "id": "fig-131",
      "label": "图 131",
      "box": [
        783,
        865,
        464,
        328
      ]
    }
  ],
  "provenance": {
    "cap": "1",
    "normalized": true
  }
}
---

<!-- ex 330 cont -->
1) $\widehat{(\vec{m},\vec{n})}=\varphi$(图130，а)；2) $\widehat{(\vec{m},\vec{n})}=180^\circ-\varphi$(图
130，б).
在第一种情况下$\vec{m}\cdot\vec{n}=mn\cos\varphi$，而在第二种情况下，
$\vec{m}\cdot\vec{n}=-mn\cos\varphi$.
在(1)式中代入这些值并开方，得到：
$|AB|=\sqrt{m^2+n^2\pm2mn\cos\varphi}$.

<!-- h3 -->
§36. 三垂线定理

<!-- p -->
**定理21. 平面内的一条直线垂直于平面的斜线的充分**
**和必要条件是这条直线垂直于斜**
**线的射影.**

<!-- p -->
证明. 我们研究下列三条直
线：$(AC)$是平面$\alpha$的垂线，$(AB)$ 
是斜线，$(CB)$是斜线在平面$\alpha$上
的射影(图131).

<!-- fig 图 131 box 783,865,464,328 -->
![图 131](figures/fig-131.png)

<!-- cap 图 131 samerow -->
图 131

<!-- p -->
充分性. 设直线$m$在平面$\alpha$内且垂直于$(CB)$. 这样，直
线$m$垂直于平面$ABC$内的直线$(CB)$和$(AC)$.
于是，$m\perp(ABC)$(§28，定理14)，因此$m\perp(AB)$.

<!-- p -->
必要性. 设$m\subset\alpha$，$m\perp(AB)$. 因为还有$(AC)\perp m$，所以
$m\perp(ABC)$，因此，$m\perp(CB)$. $\blacksquare$

<!-- exhead -->
习题

<!-- ex 331 -->
331. 以下的论断正确吗？1) 如果直线垂直于斜线的射
影，那么这条直线垂直于斜线本身；2) 如果直线垂直于斜线
和它的射影，那么直线在射影平面内.

<!-- foot -->
• 114 •
