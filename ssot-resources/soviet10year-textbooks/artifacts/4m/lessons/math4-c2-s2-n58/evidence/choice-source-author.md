# N58 independent source-solving freeze

Author scope: STEMROBIN-187, offline, 2026-11-23.
Input: only `.tmp/stemrobin-187/n58/choices/seed.json` and its actual referenced figures.
Seed canonical SHA-256: `7505b326fa87ad0f8b9e209bd5a68ed7fd8c772eca671eef4659a4ff9aca0cfe`.
This complete solution record was written before any alternatives were constructed.
It is an author freeze, not an independent reviewer report or semantic approval.
No previous choices, answer keys, interactions, other lesson outputs, external
source solutions or current reviewer files were consulted.

## Definition

Selected block 9 only: equalize decimal places by appending zeros, align decimal
points, add as natural numbers and restore the aligned decimal point. This is a
rule definition, not a worked example. Appending zeros preserves the value.

## Actual-figure observation and bindings

Exactly two complete supplied 640px previews were opened, once each, in one batch.
The rightmost and bottommost content is visible. No producer was rerun.

- `fig-222`: A is the common vertex. The rays appear in order AO, AM, AK, AP.
  O is an uppercase textual label, not a measured value or answer annotation.
  The marked arc is between AK and AP. All A/O/M/K/P labels and ray endpoints
  are visible. Ordinary protractor reading gives roughly 49 to 50 degrees for
  KAP; the source's bisector statements, not pixel geometry, govern the ratios.
  Preview: `.tmp/stemrobin-187/n58/figures/fig-222.repair1.normal640.png`;
  SHA-256 `b1b18cf1536956f764ea83ca00516dc98cbd6e55747b912339c800351bb12652`.
  Seed/current SVG SHA-256:
  `918f4468d646d845a72c107e4942e6a109851195d73d9b161d84c00b0811fb75`.
  The official `fig-222.render.json` output path/hash matches that current SVG;
  report SHA-256 `ce3db933754becda896791a3e7fce964d3d74caa042dc87e7d498ab51fa3bab5`,
  status pass, width 640, minimum measured text 32px, no failures/collisions.
- `tbl-p0216-01`: complete 4-by-4 grid, blank upper-left corner, top seeds
  0.35, 0.72, 1.14 and left seeds 5.43, 0.68, 1.71. The nine interior cells
  are blank. Nothing represents an addition-header rule independent of earlier
  interior results: the written source explicitly requires immediate neighbors.
  Preview: `.tmp/stemrobin-187/n58/figures/tbl-p0216-01.normal640.png`;
  SHA-256 `4b62f9bafa0b229d5364f534bfef9665aa9f16d92892eee0e41a188a683e6707`.
  Seed/current SVG SHA-256:
  `b3e8d061c7413bc08aa72ab0f245c853908f33e18cf7be4cbc52c156bbd2070e`.
  The official `tbl-p0216-01.render.json` output path/hash matches the SVG;
  report SHA-256 `979103fcdc41530e271c6545bfee8ce5523b46891cd41cb5ba921ee5e55eb331`,
  status pass, width 640, minimum measured text 32px, no failures/collisions.

The supplied previews were reused by the user's explicit path designation.
The report binds the current SVG bytes; it does not itself certify these preview
PNG bytes or provide a new independent source-fidelity review.

## 961

Task: express the addition commutative law using x and y and verify both assigned
pairs. The conceptual distinction is order versus grouping.
General identity: x+y=y+x.
For x=7.3,y=2.9: 7.3+2.9=10.2 and 2.9+7.3=10.2.
For x=10.24,y=19.76: 10.24+19.76=30.00 and 19.76+10.24=30.00.
The two numerical checks instantiate, but do not prove, the general identity.

## 962

Task: express associativity using a,b,c and verify a=40,b=38.41,c=0.95.
Identity: (a+b)+c=a+(b+c), preserving term order.
Left side: (40+38.41)+0.95=78.41+0.95=79.36.
Right side: 40+(38.41+0.95)=40+39.36=79.36.
The conceptual distinction is regrouping without changing the addends.

## 963

Task: decompose each decimal by place value, including the internal zero.
8.64=8+6/10+4/100.
7.532=7+5/10+3/100+2/1000.
6.2703=6+2/10+7/100+0/1000+3/10000.
Thus its thousandths digit is zero, and 3 belongs to the ten-thousandths place.
Omitting the zero term yields a numerically equivalent place-value decomposition;
it is not false merely because zero is omitted, absent an explicit all-places
criterion. These are decimal places, not arbitrary regroupings of the same sum.

## 964

Task: compute all six sums, with decimal-point alignment and carries.
a: (769+42389)/1000=43158/1000=43.158.
b: (95381+3219)/1000=98600/1000=98.600=98.6.
c: (5800+22191)/1000=27991/1000=27.991.
d: (89021+6800)/10000=95821/10000=9.5821.
e: (270+135+80)/100=485/100=4.85.
f: (13750+8200+115)/1000=22065/1000=22.065.

## 965

Task: sum the four successive one-second falling distances, not just find the
fourth distance. First second 4.9m; each subsequent second adds 9.8m to the
preceding second's distance.
d1=4.9, d2=4.9+9.8=14.7, d3=24.5, d4=34.3, all in meters.
Total=4.9+14.7+24.5+34.3=78.4m. Equivalently,
4*4.9+(0+1+2+3)*9.8=19.6+58.8=78.4m.
This solves the mathematical data as stated, not an external physics model.

## 966

Task: find the combined grain harvest when the second field exceeds the first.
First 95.37t, second 95.37+16.8=112.17t.
Combined 95.37+112.17=207.54t, equivalently 2*95.37+16.8.

## 967

Task: measure KAP in the supplied figure, then calculate OAM using both stated
bisectors. No exact angle is supplied by the source.
Let theta be the learner's ordinary approximate measurement of KAP.
AK bisects OAP, so OAK=KAP=theta.
AM bisects OAK, so OAM=theta/2, and OAP=2*theta.
The supplied preview gives KAP approximately 49 degrees and hence OAM
approximately 24.5 degrees. Ordinary nearby reading 50 degrees gives 25 degrees
and is also acceptable; no adjacent 49/24.5 versus 50/25 judgment is warranted.
Keep the act of measurement and the half-relation together. Do not add a
calibrated-paper prerequisite, state a measured angle as a given, or infer an
exact irrational/geometric angle from rendering coordinates.

## 968

Task: compute all four like-denominator sums, including a carry to the integer.
1: 3/10+5/10=8/10=4/5.
2: 2/7+1/7=3/7.
3: 4 3/11+1 8/11=5 11/11=6.
4: 2/5+7 1/5=7 3/5.
Equal denominators identify the same unit; only numerators add.

## 969

Task: determine which bus left earlier and by how long from unequal elapsed
travel times. The buses leave at different times, travel toward each other,
start 480km apart, have speeds 52 and 42km/h, and meet after bus 1 travels 312km.
Bus 2 travels 480-312=168km.
Bus 1 elapsed time 312/52=6h; bus 2 elapsed time 168/42=4h.
Same meeting time implies bus 1 left 6-4=2h earlier.

## 970

Task: solve both independent linear equations by reversing the operations.
1: (327x-5295)/57=389 implies 327x-5295=22173,
327x=27468, x=84. Check: (327*84-5295)/57=22173/57=389.
2: (27x+11)*315=11970 implies 27x+11=38,
27x=27, x=1. Check: (27+11)*315=38*315=11970.

## 971

Task: evaluate both independent expressions using brackets and operation order.
1: 16112/304=53; 6112-53=6059; 200500-39591=160909;
160909-6059=154850.
2: 609*25=15225; 3078+15225=18303;
71999+22111=94110; 94110-18303=75807.

## 972

Task: compute all four decimal sums, including unequal places and full carry.
a: (395486+4580)/1000=400066/1000=400.066.
b: (760+90867)/100=91627/100=916.27.
c: (5400+241789)/10000=247189/10000=24.7189.
d: (19679+20650121)/10000=20669800/10000=2066.9800=2066.98.

## 973

Task: total both the time and the distance of all four relay stages.
Stages: 100m in 10.2s; 200m in 20.5s; 400m in 46.7s;
800m in 1min42.7s.
Last time=60+42.7=102.7s.
Total time=10.2+20.5+46.7+102.7=180.1s=3min0.1s.
Total distance=100+200+400+800=1500m.

## 974

Task: fill all nine interior cells recursively from the immediately adjacent
above and left cells, preserving six seeds and the blank upper-left corner.
With rows r1..r3 and columns c1..c3 for interiors:
r1c1=0.35+5.43=5.78;
r1c2=0.72+5.78=6.50;
r1c3=1.14+6.50=7.64;
r2c1=5.78+0.68=6.46;
r2c2=6.50+6.46=12.96;
r2c3=7.64+12.96=20.60;
r3c1=6.46+1.71=8.17;
r3c2=12.96+8.17=21.13;
r3c3=20.60+21.13=41.73.

| | 0.35 | 0.72 | 1.14 |
| --- | --- | --- | --- |
| 5.43 | 5.78 | 6.50 | 7.64 |
| 0.68 | 6.46 | 12.96 | 20.60 |
| 1.71 | 8.17 | 21.13 | 41.73 |

This is a recurrence, not row-header plus column-header addition.

## 975

Task: compute the triangle perimeter from two successive length comparisons.
First side 83.6cm; second 83.6+14.8=98.4cm;
third 98.4+8.6=107.0cm.
Perimeter=83.6+98.4+107.0=289.0cm=289cm.
The comparison for the third side refers to the second side, not the first.
The sides satisfy 83.6+98.4>107, consistent with a triangle.

## Freeze procedure

Exact decimal arithmetic above was checked with integer-scaled sums; equations
were substituted and the table was independently computed from the six seeds.
After this file is written, its byte SHA-256 is recorded before creating the
draft. This freeze is not changed to agree with a later choice key.
