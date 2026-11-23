# N58 independent blind mathematics freeze

## Basis

Ticket STEMROBIN-187; book 4m; lesson math4-c2-s2-n58; 2026-11-23.

All work below was solved from the six original images identified and hashed in independent-source.md, before any author-draft disclosure. No author solution, answer book, choice, key, previous mathematics solution, or modern figure supplied a value. Decimal/Fraction arithmetic was evaluated locally from independently transcribed digits; no pipeline checker, generation, rendering, app, DB, install, Git, worktree, or chat operation was run.

This file solves all 15 original exercises in their printed sequence, including all subparts. It also verifies the two worked prose examples. It is not approval of any authored answer or interaction.

## Prose examples

1. Fabric: $3.14+2.83=5.97$ 米. The hundredths computation $3\frac{14}{100}+2\frac{83}{100}=5\frac{97}{100}$ and $3$ 米 $14$ 厘米 $+2$ 米 $83$ 厘米 $=5$ 米 $97$ 厘米 agree.
2. Pumpkins: $6.4+5.28=6.40+5.28=11.68$ 公斤.
3. The four-part addition rule crosses physical pages 0213/0214: equalize decimal places, align decimal points, add as natural numbers, place the result's decimal point in the aligned position.

## Ordered solutions

### 961

General commutative law: $x+y=y+x$.

- а) $7.3+2.9=10.2=2.9+7.3$.
- б) $10.24+19.76=30.00=19.76+10.24$.

### 962

General associative law: $(a+b)+c=a+(b+c)$.

For $a=40$, $b=38.41$, $c=0.95$:

$(40+38.41)+0.95=78.41+0.95=79.36$.

$40+(38.41+0.95)=40+39.36=79.36$.

### 963

In the printed order, decompose by place value:

1. $8.64=8+0.6+0.04=8+\frac{6}{10}+\frac{4}{100}$.
2. $7.532=7+0.5+0.03+0.002=7+\frac{5}{10}+\frac{3}{100}+\frac{2}{1000}$.
3. $6.2703=6+0.2+0.07+0.000+0.0003=6+\frac{2}{10}+\frac{7}{100}+\frac{0}{1000}+\frac{3}{10000}$.

The zero thousandths place in the third number is real; do not shift its 3 into the thousandths place.

### 964

- а) $0.769+42.389=43.158$.
- б) $95.381+3.219=98.600=98.6$.
- в) $5.800+22.191=27.991$.
- г) $8.9021+0.6800=9.5821$.
- д) $2.7+1.35+0.8=4.85$.
- е) $13.750+8.200+0.115=22.065$.

### 965

Literal source quantities and units: 4 秒钟; first-second “速度” 4.9 米; each later second “下降速度” faster by 9.8 米. No velocity or acceleration denominator is printed.

For the intended addition of successive one-second descent quantities:

- First second: $s_1=4.9$ 米.
- Second second: $s_2=4.9+9.8=14.7$ 米.
- Third second: $s_3=14.7+9.8=24.5$ 米.
- Fourth second: $s_4=24.5+9.8=34.3$ 米.

$s_1+s_2+s_3+s_4=4.9+14.7+24.5+34.3=78.4$ 米.

**Qualification:** 78.4 米 is the intended discrete addition result, not a claim that “speed in metres” is dimensionally correct. The wording confuses speed with one-second distance. The source should be retained faithfully with this note; a modern rewrite should say each one-second descent distance, if authorized. Do not substitute endpoint velocities, multiply each term by a different elapsed duration, or introduce another physics model. No unreadable source value prevents the addition.

### 966

Other field: $95.37+16.8=112.17$ 吨.

Total: $95.37+112.17=207.54$ 吨.

The question asks both fields together, not only the other field.

### 967

#### Exact relationships supplied by prose

Use the prose's designation O for the upper ray endpoint; its Q-shaped crop glyph is separately retained in the inventory.

Let $\theta=\angle KAP$.

- $AK$ bisects $\angle OAP$, so $\angle OAK=\angle KAP=\theta$.
- $AM$ bisects $\angle OAK$, so $\angle OAM=\frac{1}{2}\angle OAK=\frac{\theta}{2}$.

Thus **exactly as a relation**, $\angle OAM=\frac{1}{2}\angle KAP$. The task does not give an exact numerical $\theta$.

#### Actual-raster measurement, numerical output only

Input: existing fig-222.png, SHA-256 `a2bbe279a2f55e8b0e1066c0bb9db425ae77130e4fcd4994b42e10492920c0cd`, dimensions 396 by 487 pixels.

After the single visual opening, one Pillow decode converted the existing image to grayscale in memory. NumPy selected dark stroke pixels in narrow numerical windows around each already identified ray. No new image, crop, preview, plot, or screenshot was made or emitted.

Coordinates below use x rightward, y downward from the crop's upper-left corner. For upper, M and K, sample one median stroke y per integer x: upper x=90..275, M/K x=90..334. For P sample one median stroke x per integer y=310..445. Windows were approximately +/-8 px around visually identified line locations; these avoid the vertex, lower arc, labels, and tips. Fit each median centerline by total least squares, using the principal eigenvector of centered coordinate covariance, oriented to positive x. The selected baseline grayscale threshold was 128.

| Ray | Samples | Centerline centroid, px | Unit direction vector, screen frame | Screen angle, degrees | Perpendicular RMS, px |
| --- | --- | --- | --- | --- | --- |
| upper, text AO | 186 | (182.500, 120.156) | (0.803036, -0.595931) | -36.57901 | 0.3153 |
| AM | 245 | (212.000, 194.302) | (0.978837, -0.204641) | -11.80849 | 0.3750 |
| AK | 245 | (212.000, 270.092) | (0.976220, 0.216781) | 12.52003 | 0.4619 |
| AP | 136 | (112.688, 377.500) | (0.477581, 0.878588) | 61.47248 | 0.3694 |

Least-squares intersection of the four fitted line normals: A approximately (33.3054, 231.0342) px.

Baseline measured $\angle KAP=61.47248^\circ-12.52003^\circ=48.95245^\circ$.

Repeat numerical fits on the same in-memory array with grayscale thresholds 80, 128, 180 and with each sampling interval trimmed by 0, 12, 24 pixels at both ends:

| Trim at both ends, px | Measured KAP, degrees | Half, degrees |
| --- | --- | --- |
| 0 | 48.95245 | 24.47622 |
| 12 | 49.08594 | 24.54297 |
| 24 | 49.20837 | 24.60419 |

All three thresholds gave the same displayed values for each trim. The KAP sensitivity range was 48.95245..49.20837 degrees.

**Declared ordinary-measurement result:** $\angle KAP\approx49^\circ$, rounded to the nearest whole degree, with a conservative drawing/raster reading allowance of approximately $1^\circ$. This allowance is not a statistical confidence interval and not a calibrated physical-paper uncertainty.

Using the text-given exact bisector relationships, $\angle OAM\approx24.5^\circ$, with a corresponding approximately $0.5^\circ$ propagated reading allowance. The reported half-degree result comes from halving the whole-degree measurement, not from claiming an exact printed angle or half-degree instrument precision.

For contrast, direct fits to the drawn upper ray give $\angle OAK\approx49.09904^\circ$, $\angle OAM\approx24.77052^\circ$, and $\angle MAK\approx24.32852^\circ$. Small differences are drawing/raster imperfections; the requested derivation uses the prose's equalities, not a claim that fitted rays exactly bisect one another.

**No measurement HOLD:** the actual lower rays and arc are readable and separable. Ordinary measurement is feasible. No exact-paper access, dewarping or calibration gate is invented. Raster sensitivity is not physical-paper precision. Neither exact $50^\circ$/$25^\circ$ nor any other neat integer is a printed given.

### 968

1. $\frac{3}{10}+\frac{5}{10}=\frac{8}{10}=\frac{4}{5}$.
2. $\frac{2}{7}+\frac{1}{7}=\frac{3}{7}$.
3. $4\frac{3}{11}+1\frac{8}{11}=5+\frac{11}{11}=6$.
4. $\frac{2}{5}+7\frac{1}{5}=7\frac{3}{5}$.

### 969

First bus travel time: $312:52=6$ 小时.

Second bus travel distance: $480-312=168$ 公里.

Second bus travel time: $168:42=4$ 小时.

Both arrive at the same meeting instant, so the first bus departed $6-4=2$ 小时 earlier.

### 970

1. $(327x-5295):57=389$ gives $327x-5295=389\cdot57=22173$, then $327x=27468$, so $x=84$. Substitution: $(27468-5295):57=22173:57=389$.
2. $(27x+11)\cdot315=11970$ gives $27x+11=38$, then $27x=27$, so $x=1$. Substitution: $(27+11)\cdot315=11970$.

### 971

1. $16\,112:304=53$; $6112-53=6059$; $200\,500-39\,591=160909$; $160909-6059=154850$.
2. $609\cdot25=15225$; $3078+15225=18303$; $71\,999+22\,111=94110$; $94110-18303=75807$.

### 972

- а) $395.486+4.580=400.066$.
- б) $7.60+908.67=916.27$.
- в) $0.5400+24.1789=24.7189$.
- г) $1.9679+2065.0121=2066.9800=2066.98$.

### 973

Printed question order: total time first, total distance second.

$1$ 分 $42.7$ 秒 $=102.7$ 秒.

$10.2+20.5+46.7+102.7=180.1$ 秒 $=3$ 分 $0.1$ 秒.

$100+200+400+800=1500$ 米.

### 974

Use the immediately adjacent above and left predecessor, not the original row/column headers for every interior entry. Denote the original 4 by 4 cell positions by $t_{r,c}$, where r1 and c1 are the printed border seed row/column.

The six original seeds, copied from pixels before solving, are:

$t_{1,2}=0.35$, $t_{1,3}=0.72$, $t_{1,4}=1.14$;
$t_{2,1}=5.43$, $t_{3,1}=0.68$, $t_{4,1}=1.71$.

For r=2..4 and c=2..4, $t_{r,c}=t_{r-1,c}+t_{r,c-1}$.

Ordered row-major computations:

1. r2c2: $0.35+5.43=5.78$.
2. r2c3: $0.72+5.78=6.50$.
3. r2c4: $1.14+6.50=7.64$.
4. r3c2: $5.78+0.68=6.46$.
5. r3c3: $6.50+6.46=12.96$.
6. r3c4: $7.64+12.96=20.60$.
7. r4c2: $6.46+1.71=8.17$.
8. r4c3: $12.96+8.17=21.13$.
9. r4c4: $20.60+21.13=41.73$.

| Completed table | c1 | c2 | c3 | c4 |
| --- | --- | --- | --- | --- |
| r1 | [structural blank] | 0.35 | 0.72 | 1.14 |
| r2 | 5.43 | 5.78 | 6.50 | 7.64 |
| r3 | 0.68 | 6.46 | 12.96 | 20.60 |
| r4 | 1.71 | 8.17 | 21.13 | 41.73 |

**Corner qualification:** r1c1 is visibly blank and has neither an above nor a left predecessor. Its value is not printed or determined, and it is not needed for any of the nine interior computations. Leave it blank. Interpreting “每个空格” literally to require a numeric value there would be underdetermined; it does not justify inventing 0 or deriving a seed from results. The nine intended answer cells are unambiguous.

### 975

First side: $83.6$ 厘米.

Second side: $83.6+14.8=98.4$ 厘米.

Third side: $98.4+8.6=107.0$ 厘米.

Perimeter: $83.6+98.4+107.0=289.0$ 厘米 $=289$ 厘米.

The longest side 107.0 is less than 83.6+98.4=182.0, so the specified side lengths do form a triangle.

## Result and revision constraints

- All 15 target exercises and all printed subparts are independently solved.
- No new unreadable-source or geometry-measurement HOLD is present; existing N57 HOLDs/failures remain untouched.
- Concrete qualifications: 965's speed/metre wording; 967's upper-endpoint glyph; 967's approximate measured angle rather than printed numeric givens; 974's structurally empty corner.
- **REVISE any later draft if it** substitutes a different 965 physics model without disclosing the source wording; treats a numerical angle in 967 as an exact printed given; drops/reorders any of its four rays or invents equal-angle arc marks; fills 974 by repeated header addition rather than neighboring predecessors; or invents a top-left seed.
- This is a blind evidence baseline, not a finding that an unseen author draft contains any of those defects. No authored/modern figure, choice, answer, display, or whole-lesson approval is granted.
