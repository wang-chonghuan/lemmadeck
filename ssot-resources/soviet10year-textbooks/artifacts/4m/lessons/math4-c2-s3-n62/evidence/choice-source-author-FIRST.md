# N62 independent source solutions FIRST

Status: complete independent source solving, frozen before any option construction.
Date: 2026-11-23.
Authority: only the prepared seed at `.tmp/stemrobin-187/n62/choices/seed.json`.
Seed canonical SHA-256: `ab95751a2bad384172e3c40181bfcea71459564ea5bdfaa6f89550879ae5034e`.
Seed byte SHA-256: `c7dcfa53f8f4463be4e7da0e91e8c4a3aaa5a81bc44db15f9006af10aec5817e`.
All 11 sources, 1073-1083, were solved below before drafting questions or alternatives.
No previous keys, book answers, interactions, parent mathematics, choices,
ticket mathematics outputs, tests or older tool versions were consulted.
The seed contains no images; actual image use is zero.
Only definition paragraphs 7 and 10 were supplied: decimal shifts for
multiplication by powers of ten and their reciprocal powers. No solved example
is being treated as a definition.

## 1073

Task: multiply each decimal by the stated power of ten, retaining positional
zeros and appending trailing zeros where the shift exceeds decimal places.

- a: 6.42 * 10 = 64.2; 0.17 * 10 = 1.7;
  6.387 * 100 = 638.7; 0.00081 * 1000 = 0.81.
- b: 3.8 * 10 = 38; 20.35 * 100 = 2035;
  0.75 * 100 = 75; 0.0001 * 1000 = 0.1.
- c: 0.006 * 100 = 0.6; 45.48 * 100 = 4548;
  7.8 * 1000 = 7800; 0.102 * 10000 = 1020.

The shift is rightward by the number of zeros in the multiplier, not necessarily
by the number of digits following the original decimal point.

## 1074

Task: substitute each specified x into 61.3x.

| x | 61.3x |
| --- | --- |
| 8 | 490.4 |
| 10 | 613 |
| 35 | 2145.5 |
| 100 | 6130 |
| 1000 | 61300 |
| 10000 | 613000 |

For the non-power values, 61.3 * 8 = (613 * 8) / 10 = 490.4;
61.3 * 35 = 61.3 * (30 + 5) = 1839 + 306.5 = 2145.5.
The remaining values use rightward shifts of 1, 2, 3 and 4 places.
The distinction is substitution and proportional scaling, not a universal
decimal-shift recipe for every multiplier.

## 1075

Task: substitute both parameters and perform multiplication before addition.

- a: 3.214 * 100 + 75 = 321.4 + 75 = 396.4.
- b: 0.041 * 100 + 59 = 4.1 + 59 = 63.1.

Only a is multiplied by 100. The additive term b is unchanged.

## 1076

Task: express each named magnitude as a natural number in digits.
Here thousand = 1000, million = 1000000, and billion = 1000000000.
The seed's Chinese units are respectively qian, baiwan and shiyi.

| Given magnitude | Natural number |
| --- | --- |
| 4.5 thousand | 4500 |
| 87.4 thousand | 87400 |
| 7648.1 thousand | 7648100 |
| 8.9 million | 8900000 |
| 42.4 million | 42400000 |
| 67.56 million | 67560000 |
| 0.954 million | 954000 |
| 1.1 billion | 1100000000 |
| 25.77 billion | 25770000000 |

Each result is the decimal coefficient multiplied by its unit, not by the
number of visible decimal places. The sub-unit coefficient 0.954 still gives
an integer because 0.954 * 1000000 = 954000.

## 1077

Task: round 8271.9354 independently to the specified places.

- Units: the tenths digit is 9, so 8272.
- Hundreds: the tens digit is 7, so 8300.
- Hundredths: retain .93 and inspect the thousandths digit 5, so 8271.94.
- Thousands: the hundreds digit is 2, so 8000.

Each rounding starts from the original number, not from a previous rounded
result. Hundreds and hundredths refer to different sides of the decimal point.

## 1078

Task: first round BOTH factors to units, then multiply the rounded factors.

- 78.164 rounds to 78; 11.289 rounds to 11; estimate = 78 * 11 = 858.
- 67.236 rounds to 67; 10.635 rounds to 11; estimate = 67 * 11 = 737.

These are estimates from rounded factors, not exact products rounded afterwards.
The second product particularly requires rounding 10.635 upwards rather than
truncating it.

## 1079

Task: perform the subtraction inside each pair of parentheses, then multiply.

- (7 - 5.38) * 2.5 = 1.62 * 2.5 = 4.05.
  Exact check: 162 * 25 / 1000 = 4050 / 1000 = 4.05.
- (8 - 4.46) * 1.5 = 3.54 * 1.5 = 5.31.
  Exact check: 354 * 15 / 1000 = 5310 / 1000 = 5.31.

Equivalently distribute the outside factor to BOTH terms of the subtraction.
The parentheses cannot be discarded while multiplying only the second term.

## 1080

Task: draw two angles of 60 degrees and 100 degrees with a common vertex whose
intersection is exactly one ray; find the degree measure of their union.

Independent construction specification: take a common ray OA at direction
0 degrees. Place ray OB at +60 degrees and ray OC at -100 degrees.
The closed 60-degree sector from OA to OB and the closed 100-degree sector
from OC to OA lie on opposite sides of OA. Their intersection is exactly OA.
The outer rays OC and OB bound a 160-degree sector through OA.
Therefore the union has measure 100 + 60 = 160 degrees.

The intersection premise excludes overlapping angular interiors. A common
vertex alone, or even a common boundary ray without specifying opposite
sides, would not justify adding the two measures.

No image is supplied or authored here. A textual construction specification is
not an actual student drawing. A choice response may assess the union inference
using the original intersection premise but cannot demonstrate constructing the
two angles or measuring/placing rays with a protractor. That production capacity
must be explicitly recorded as lost, never claimed as construction coverage.

## 1081

Task: calculate the stated power-of-ten products.

- a: 3.12 * 10 = 31.2; 0.14 * 10 = 1.4;
  2.174 * 100 = 217.4; 0.00015 * 1000 = 0.15.
- b: 0.314 * 10 = 3.14; 151.45 * 100 = 15145;
  0.0001 * 10000 = 1; 0.3 * 100 = 30.
- c: 0.0062 * 1000 = 6.2; 2.348 * 10000 = 23480;
  0.1002 * 100 = 10.02; 0.1 * 10 = 1.

The last two groups include a product reaching exactly an integer, a shift
requiring appended zeros, and an interior positional zero that must remain.

## 1082

Task: substitute the specified parameters, multiply coefficients by their
variables, then add.

- a: with x = 10 and y = 100,
  15.2x + 1.73y = 152 + 173 = 325.
- b: with a = 10,
  16.52a + 18.1 = 165.2 + 18.1 = 183.3.

In the first expression the two coefficients have different multipliers.
In the second expression only 16.52 is multiplied by a; 18.1 is a constant.

## 1083

Task: use the day-to-day factor 1.5 to find all four daily counts and their sum.

Day 1: 8.
Day 2: 8 * 1.5 = 12.
Day 3: 12 * 1.5 = 18.
Day 4: 18 * 1.5 = 27.
Total: 8 + 12 + 18 + 27 = 65 white mushrooms.

The factor applies to the preceding day's count, not always to day 1.
The increments are 4, 6 and 9, so growth is not a constant additive increase.
Every derived count is a whole number; the source has no fractional-count issue.

## Freeze declaration

All 11 complete source solutions above were established before any draft option
was constructed. This file is the FIRST snapshot and will not be revised during
question authoring. Its post-write byte hash and read-only freeze are recorded
in author-notes.md and the text handoff. Any later concern is recorded separately,
not silently patched into this source-solving evidence.
