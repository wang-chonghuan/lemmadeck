# N41 Source-First Mathematical Determination

Recorded on 2026-11-20 before opening any modern candidate, normalized preview, or proof-author report. This file is an independent source determination, not a transcription rereview.

## Read Sequence

1. Read the lesson skill, production-resume contract, image-batch rules, and project entry/charters.
2. Read the retained raw `lesson.json` (all 17 prose objects), raw `exercises.json` (all 14 exercises 391-404), and `pages/0141/page.md`, including its explicit faithful NSD/NSB distinction.
3. Opened the actual retained original `figures/fig-160.png` once.
4. Opened the actual retained original `figures/fig-161.png` once.
5. Independently derived the cosine-law comparison and a source-admissible counterexample; computed numerical checks locally.
6. Saved this source determination. No modern candidate or proof-author determination had been read.

Image-open ledger: 2 total, no crop or reopen, no modern image, no whole-page image. The optional third source-page opening is unused.

## Original-Pixel Observations

Figure 160: S is the common vertex; A and B lie on the outer rays, D lies on the ray toward C, and N lies on the dashed AB segment and dashed ray toward M. The angle alpha is between SB and SC/SD; beta is between SA and SC/SD; gamma is between SA and SB. The source construction places SN inside angle ASB with angle ASN = beta and SD = SN. Projection strokes alone do not supply lengths: SD = SN is supplied by the raw prose.

Figure 161: A1, S, and A lie on a straight line, with SA1 opposite SA. The displayed alpha is between SB and SC, beta between SA and SC, and gamma between SA and SB; the supplements are 180 degrees minus beta and gamma. This matches the subsequent theorem 25 proof and confirms the angle naming without reading a modern figure.

## Independent Proof

Let r = SD = SN > 0 and b = SB > 0. In triangle BSD the included angle between SB and SD is alpha. In triangle BSN the included angle between SB and SN is BSN = NSB, not NSD. Therefore

```text
DB^2 = b^2 + r^2 - 2br cos(alpha)
NB^2 = b^2 + r^2 - 2br cos(NSB)
DB^2 - NB^2 = 2br [cos(NSB) - cos(alpha)] > 0.
```

Thus `cos(alpha) < cos(NSB)`. Cosine is strictly decreasing for these nondegenerate angles in (0, pi), so NSB < alpha. Since ASN = beta and gamma = ASN + NSB, gamma < alpha + beta follows. NSD instead belongs to triangle NSD, which is not either triangle in the cited cosine-law comparison.

Independent supported modern formula: `\cos\alpha<\cos(\widehat{NSB})`. The raw printed/transcribed `\cos\alpha<\cos(\widehat{NSD})` remains unchanged as source evidence.

## Independent Exact Counterexample

This example was constructed before reading the author's example:

```text
S = (0,0,0)
A = (1,0,0)
B = (-sqrt(3)/2, 1/2, 0)
C = (-1/2, -1/sqrt(2), 1/2)
r = (sqrt(3)-1)/2
N = r(-1/2, sqrt(3)/2, 0)
D = r C
```

C is a unit vector and has a nonzero third coordinate, so the trihedral is noncoplanar. N is on segment AB, on the interior ray making 120 degrees with SA; D is on SC and SD = SN = r. Here beta = 120 degrees, gamma = 150 degrees, and alpha = arccos((sqrt(3)-sqrt(2))/4) = 85.442512381651 degrees. Gamma is the largest face angle, as required by the source proof.

```text
cos(alpha) = (sqrt(3)-sqrt(2))/4 = 0.07945931129894551
cos(NSD) = (1-sqrt(6))/4 = -0.36237243569579447
cos(NSB) = sqrt(3)/2 = 0.8660254037844386
AD = AN = 1.2247448713915887
DB = 1.0372108480006856 > NB = 0.7071067811865476
AB = AN + NB = 1.9318516525781364
DB^2 - NB^2 = 0.5758063432103012
2r[cos(NSB)-cos(alpha)] = 0.5758063432103014
```

The printed NSD inequality is false in this admissible construction; the NSB inequality and the source's following inference are true. This is a genuine source-bound mathematical typo, not a modern stylistic preference.

## First Input Bindings

SHA256 of bytes actually read before modern/author inspection:

| Repository-relative input | SHA256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/9-10g/lessons/geo910-c1-s3-n41/lesson.json` | `ff0038a25c7bb25600b58c6ebbb128f56283aab342349fe915e76d49f4577acc` |
| `ssot-resources/soviet10year-textbooks/artifacts/9-10g/lessons/geo910-c1-s3-n41/exercises.json` | `1bb2d3d4533d61bdad4f0ea17cf5e08df0c6b48bd7352977775c38a965e02017` |
| `ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0141/page.md` | `ac68ea384835d9240f42c8f94d40b0efda4ed92d167d0a5a7fe17f8c0af51a2e` |
| `ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0141/page.json` | `ff61d15d61f12cca27fdf3bfd8ec6a718501f803b3fa9d9a6deab45bed162760` |
| `ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-160.png` | `b300d00a19c2e2733dc2574e28e228ec64776c11860ce3e243cd33aabea98565` |
| `ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-161.png` | `6311f626bec075fd09ae16a4f04e0a2509ce6f3d0f27dffe114d256bffddeed9` |

First hash receipt timestamp: `2026-11-20T03:42:35.643Z`. No source/candidate/core write, answer-key lookup, external model, or backend operation was performed.
