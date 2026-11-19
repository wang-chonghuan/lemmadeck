---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "10p",
  "page": 326,
  "printed_page": 316,
  "source": {
    "pdf": "10p 苏联中学课本 物理 十年级 .pdf",
    "pdf_sha256": "7190041b66182e5f6c5a4ef7ae0b04ee3f1afa0df1f5b3ff6317b2c2d1cb8f40",
    "pdf_page": 326
  },
  "render": {
    "dpi": 300,
    "w": 1536,
    "h": 2337,
    "sha256": "5b96eb82a47876882334e222d4ccd27fdea93f09924196e27e3ed0adb96f7270"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "c364d68442cfccc9920d3e23932d418c3d7b123cf4a47408e6535dcb19f7104a"
  },
  "notes": [
    "D041 candidate from hash-bound independent observation. Native finalization is not SOURCE approval.",
    "HOLD: the two v-shaped frequency glyphs remain diplomatic visual placeholders, not Latin v or Greek nu approval.",
    "No math glyph identity or stacked-formula layout is inferred. Unit125 is ineligible for promotion.",
    "Incoming p0325#9 ends literally with 从光束中获得的能 and joins the initial 量. Discarded earlier paraphrase is not used.",
    "RAW figures254-256 remain machine candidates only.",
    {
      "type": "diplomatic-math-shapes",
      "shapes": [
        {
          "block": "p0326#1",
          "line": 1,
          "shape": "h followed by v-shaped glyph, equals E with subscript2 minus E with subscript1.",
          "literal_visual": "hv=E₂−E₁",
          "defensible_latex_structure": "h{GLYPH}=E_2-E_1",
          "glyph_identification": "HOLD"
        },
        {
          "block": "p0326#6",
          "line": 3,
          "shape": "Standalone v-shaped glyph equals stacked fraction; numerator E subscript2 minus E subscript1, denominator h.",
          "literal_visual": "v=(E₂−E₁)/h",
          "defensible_latex_structure": "{GLYPH}=\\frac{E_2-E_1}{h}",
          "glyph_identification": "HOLD"
        },
        {
          "block": "p0326#9",
          "line": 5,
          "shape": "10 with raised negative8.",
          "literal_visual": "10⁻⁸",
          "latex": "10^{-8}"
        },
        {
          "block": "p0326#12",
          "line": 2,
          "shape": "10 with raised negative3.",
          "literal_visual": "10⁻³",
          "latex": "10^{-3}"
        }
      ],
      "holds": [
        {
          "id": "p0326-v-shaped-frequency",
          "phase": "SOURCE-glyph",
          "status": "HOLD",
          "scope": [
            {
              "block": "p0326#1",
              "line": 1,
              "start": 4,
              "end": 4,
              "text": "v"
            },
            {
              "block": "p0326#6",
              "line": 3,
              "start": 1,
              "end": 1,
              "text": "v"
            }
          ],
          "candidate_latex": [
            "v",
            "\\nu"
          ],
          "reason": "Both full original and essential crop show a v-shaped glyph. Latin v/Greek nu cannot be uniquely assigned here; no frequency/physics inference allowed.",
          "blocks_card_eligibility": [
            125
          ]
        }
      ],
      "basis": "Exact observed glyph strings retained in scratch; mathematical layout and held codepoint identities are not approved."
    }
  ],
  "errata": [],
  "printed_lines": 26,
  "figures": [
    {
      "id": "fig-254",
      "label": "图254",
      "box": [
        162,
        504,
        513,
        185
      ]
    },
    {
      "id": "fig-255",
      "label": "图255",
      "box": [
        766,
        517,
        518,
        183
      ]
    },
    {
      "id": "fig-256",
      "label": "图256",
      "box": [
        1061,
        1567,
        208,
        292
      ]
    }
  ],
  "provenance": {
    "cap": "1",
    "normalized": true
  }
}
---

<!-- p cont -->
量 hv=E_2−E_1，等于能级 E_2 与 E_1 间的能量差。图 254а 中简略地表示
出未激发的原子和一段正弦曲线形式的电磁波，这时电子处于低能级。
图 254б 表示吸收了能量的被激发原子。被激发原子可以在碰撞中把
自己的能量给予相邻的原子，或者在任何方向上辐射光子。

<!-- fig 图254 box 162,504,513,185 -->
![图254](figures/fig-254.png)

<!-- fig 图255 box 766,517,518,183 -->
![图255](figures/fig-255.png)

<!-- cap 图254 -->
图 254

<!-- cap 图255 samerow -->
图 255

<!-- p -->
现在我们想象我们用任何一种方法激发了媒质中大部分的原子，
那么，当频率为
v=(E_2−E_1)/h
的电磁波通过物质时，这个波将不减弱，相反还由于感应辐射而加强，
在它的作用下原子一致地转入低能量状态，同时放出与入射波频率和
相位都相同的波。图 255а 中表示被激发的原子和波，图 255б 中表示
原子转入基态，而波加强了。

<!-- p -->
**三级系统** 获得激发态的原子的媒质的方法是多种多样的。为此
在红宝石激光器中利用了专门的大功率的灯。原子由于吸收光而被
激发。

<!-- p -->
但是对于激光器的工作二个能级是不够的。不论灯光多强，被激
发原子的数目将不大于未被激发的原子数目。须知光在激发原子的同
时又引起了从高能级向低能级的感应转化。

<!-- p open -->
解决问题的办法是利用三个能级（能级的总数
是很多的，但现在说的只是各“工作”级）。图 256 表
示了三个能级。重要的是在没有外界作用的情况下，
系统处于不同能态的时间（“寿命”）是迥然不同的。
系统在能级 3 的寿命极短，数量级为 10^{-8} 秒。此后

<!-- fig 图256 box 1061,1567,208,292 -->
![图256](figures/fig-256.png)

<!-- cap 图256 samerow -->
图 256

<!-- p cont open -->
在没有光辐射的情况下自发地转入能态 2（这时能量传给晶格）。在
能态 2 的寿命要长 100000 倍，即约 10^{-3} 秒。在外来电磁波的作用下由

<!-- foot -->
• 316 •
