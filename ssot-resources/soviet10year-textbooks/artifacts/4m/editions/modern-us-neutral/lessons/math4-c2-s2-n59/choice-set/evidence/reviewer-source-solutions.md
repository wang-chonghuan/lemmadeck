# STEMROBIN-187 N59: frozen independent source solutions

Stage: STAGE1 SOURCE ONLY. Date: 2026-11-23.

This is independent mathematical source-solving, not a choice-question review
or a package approval. All 33 source exercises, 976 through 1008, are treated
below, including their compound tasks and conditions. No visible question
projection, draft, author reasoning, author solutions, answer keys, previous
choices, interaction material, tests, ticket outputs, figure specifications,
figure review reports, or other solution reports were read.

## Input and observation binding

- Sole mathematical text input:
  `.tmp/stemrobin-187/n59/choices/seed.json`.
- Seed SHA-256, actual file bytes:
  `35254d9424a6dd4cd574ae438c8738069991668f38ffda2c6f0632574d505e83`.
- Selected definition: concept block 5. Decimal subtraction uses equalized
  decimal places, aligned decimal points, ordinary subtraction with borrowing
  where needed, and a decimal point in the aligned position in the difference.
- Seed figure: `fig-223`.
- Seed SVG:
  `ssot-resources/soviet10year-textbooks/artifacts/4m/editions/modern-us-neutral/figures/fig-223.svg`.
- SVG SHA-256, actual bytes, matching the seed and the supplied approved binding:
  `e6cadbce72140f56b9ea5075409f845b3bfa4b004ac25373ed4a0b41f8a60ffd`.
- Actual full-canvas preview opened exactly once:
  `.tmp/stemrobin-187/n59/figures/fig-223.normal640.png`.
- Preview SHA-256, actual bytes:
  `5b790613e97fbc84c8d72ece97e0ed50c92f00129d2a8435befe81cc66cfd536`.
- Pixel observation: the whole canvas is visible. On the left is a long
  horizontal pipe, a dimension arrow spanning that pipe labelled `x`, and
  three schematic people. On the right is a shorter horizontal pipe with a
  dimension arrow labelled `2.89 m` and two schematic people. Both pipe ends,
  both dimension arrows and their labels, the rightmost pipe end, and the
  bottommost parts of the people are present and not cropped.
- The observation is bound jointly to the SVG hash and the preview hash above.
  Only the existing approved preview was visually opened; SVG bytes were
  hashed, not reopened as another visual. No original, crop, rerender, figure
  pipeline, figure specification, or prior figure review was used.
- Exercise 1005 supplies a total of 7.35 m and one part of 2.89 m.
  `x` is an unknown label, people are schematic, and illustrated relative
  lengths are not numerical measurements or extra givens. No answer was
  inferred from figure specifications or review numbers.
- Actual image use in this source-solving context: 1 new image, 1 batch of 1,
  cumulative 1 image, 0 crops, 0 reopens, 0 generated images. This is within
  the granted new-image budget of 1, batch limit of 8, and cumulative limit
  of 24.

## Independent solutions

### 976

Task: perform every subtraction AND verify every result by addition.

| Part | Subtraction | Addition verification |
| --- | --- | --- |
| a | 9.4 - 7.3 = 2.1 | 7.3 + 2.1 = 9.4 |
| b | 16.87 - 5.47 = 11.40 = 11.4 | 5.47 + 11.40 = 16.87 |
| c | 7.79 - 3.79 = 4.00 = 4 | 3.79 + 4.00 = 7.79 |
| d | 11.1 - 2.8 = 8.3 | 2.8 + 8.3 = 11.1 |
| e | 88.252 - 4.690 = 83.562 | 4.690 + 83.562 = 88.252 |
| f | 6.60 - 5.99 = 0.61 | 5.99 + 0.61 = 6.60 |

Trailing zeros equalize place values without changing the quantities.

### 977

The remaining wire is the original length minus the removed length:
30.00 - 4.75 = **25.25 m**.

### 978

The book is cheaper, so the album costs 0.69 + 0.79 = 1.48 dollars.
One of each costs 0.69 + 1.48 = **2.17 dollars**.
The requested sum is not just the album price or the difference in prices.

### 979

The pedestrian's speed is 15 - 9.7 = 5.3 km/h.
For motion toward each other, the distance closes at the sum of the speeds:
15 + 5.3 = **20.3 km/h**.

### 980

| Part | Calculation |
| --- | --- |
| a | 7.8 + 6.9 = 14.7 |
| b | 129 + 9.72 = 138.72 |
| c | 8.10 - 5.46 = 2.64 |
| d | 24.200 + 0.867 = 25.067 |
| e | 96.300 + 0.081 = 96.381 |
| f | 830.0000 - 0.0097 = 829.9903 |
| g | 0.0200 - 0.0156 = 0.0044 |
| h | 1.000 - 0.999 = 0.001 |
| i | 425.000 - 2.647 = 422.353 |

### 981

Relative to the bank, the current adds to the boat's own speed downstream
and subtracts upstream.

- Downstream: 21.6 + 4.9 = **26.5 km/h**.
- Upstream: 21.6 - 4.9 = **16.7 km/h**.

### 982

Both speed calculations AND the scaled-ray construction are required.

- Downstream: 6.5 + 2.5 = **9 km/h**.
- Upstream: 6.5 - 2.5 = **4 km/h**.
- Own speed: **6.5 km/h**.

Construction: draw a ray with origin 0 and equal small-cell intervals.
Two small cells represent 1 km/h, so one small cell represents 0.5 km/h.
Place and label the three points at these exact distances from the origin:

| Speed label | Speed | Small-cell intervals from 0 |
| --- | --- | --- |
| Upstream | 4 km/h | 8 |
| Own | 6.5 km/h | 13 |
| Downstream | 9 km/h | 18 |

From the origin outward, the points are upstream, own, downstream.
The own-speed point is midway between the other two: both gaps are
2.5 km/h, or 5 small-cell intervals. This is a construction prescription,
not a claim that a diagram was generated or physically measured in this stage.

### 983

All speeds below are relative to the bank; current speed is 60 m/min.

- a: own speed 60 m/min upstream gives 60 - 60 = **0 m/min**.
  The boat remains stationary relative to the bank while moving relative
  to the water.
- b: own speed 60 m/min downstream gives 60 + 60 = **120 m/min**.
- c: own speed 120 m/min upstream gives 120 - 60 = **60 m/min**.

### 984

The lake speed is the own speed, 27 km/h. The lake distance is
27 * 3 = 81 km.

Reading the stated trip continuously, the boat goes from the lake into a
river that flows into that lake. It therefore proceeds against the current
in that river. Its river speed is 27 - 3 = 24 km/h, and its river distance
is 24 * 4 = 96 km.

Total under that geographic reading: 81 + 96 = **177 km in 7 hours**.

Direction qualification: the prose does not separately say "upstream"; that
direction comes from entering the inflowing river from the lake. If the
connection and continuous-trip interpretation are not accepted, the text
does not explicitly fix river direction. A downstream river leg would give
81 + (27 + 3) * 4 = 201 km instead. The 177 km conclusion retains the
source's geographic relationship rather than silently discarding it.

### 985

Upstream speed equals own speed minus current, so own speed is
16.5 + 4.7 = **21.2 km/h**.

Downstream speed is 21.2 + 4.7 = **25.9 km/h**.
Equivalently, downstream speed exceeds upstream speed by twice the current:
16.5 + 2 * 4.7 = 25.9.
Both requested speeds are retained.

### 986

Evaluate both expressions for all three supplied values of a.

| a | 84 - a | a + 6.546 |
| --- | --- | --- |
| 30.4 | 53.6 | 36.946 |
| 2.454 | 81.546 | 9.000 = 9 |
| 83.998 | 0.002 | 90.544 |

### 987

- a: 68.7 - (44.7 + 0.375) = 68.7 - 45.075 = **23.625**.
- b: (90.4 + 65.4) - 90.8 = 155.8 - 90.8 = **65**.
- c: (504 - 47.9) + (58.7 - 49) = 456.1 + 9.7 = **465.8**.
- d: 7.654 + (37 - 22.9) + 0.345
  = 7.654 + 14.1 + 0.345 = **22.099**.

### 988

Combine constant terms, preserving variables and signs.

- a: 4.6 + x + 54.8 = **x + 59.4**.
- b: y + 4.65 + 5.15 = **y + 9.8**.
- c: 56.8 + 44.3 + p = **p + 101.1**.
- d: a - 12.8 + 3.2 = **a - 9.6**.
- e: 7.2 + m + 6 + 8.7 = **m + 21.9**.
- f: p + x + 2.542 + 17.468 = **p + x + 20.01**.

### 989

a: 7.38 + y + 2.56 + 1.04 = y + 10.98.

| y | Value |
| --- | --- |
| 8.6 | 19.58 |
| 21.3 | 32.28 |
| 40.08 | 51.06 |

b: x + 8.39 + 65 - 3.39 = x + 70.

| x | Value |
| --- | --- |
| 32.021 | 102.021 |
| 65.65 | 135.65 |
| 37.133 | 107.133 |

### 990

- a: 8.6 - (x + 2.75) = 1.85 implies x + 2.75 = 6.75,
  hence **x = 4**.
  Substitution: 8.6 - (4 + 2.75) = 1.85.
- b: 93 - (71.8 - y) = 22.48 becomes 21.2 + y = 22.48,
  hence **y = 1.28**.
  Substitution: 93 - (71.8 - 1.28) = 93 - 70.52 = 22.48.

### 991

Start at 4.612 and repeatedly add 2.154. The four numbers are:

**4.612, 6.766, 8.920, 11.074**.

Successive differences are all 2.154; the fourth number is reached after
three additions, not four.

### 992

This is an open construction AND measurement task, not a request for a
uniquely prescribed list of angles.

One valid construction is a square ABCD. Draw AB of length 20 mm.
At A and B construct perpendicular rays on the same side of AB.
Mark D and C respectively 20 mm along those rays, then join D to C.
The resulting closed quadrilateral has four equal sides and four right
angles. Place a protractor's center at each vertex and its baseline along
one incident side to measure the interior angle:

| Vertex | Interior angle for this construction |
| --- | --- |
| A | 90 degrees |
| B | 90 degrees |
| C | 90 degrees |
| D | 90 degrees |

Their sum is 360 degrees. Many other quadrilaterals and angle lists are
valid; neither four right angles nor a square is imposed by the source.
The construction and expected measurements here are exact mathematical
source-solving evidence. No physical drawing or protractor measurement
was performed or fabricated, and the hands-on requirement remains explicit.

### 993

Construct all three named angles with the shared vertex O and shared rays
OB and OC as named, rather than replacing the task with angle arithmetic.

One compatible planar construction:

1. Draw ray OA as a starting direction.
2. At O use a protractor to draw ray OB 32 degrees counterclockwise from OA.
3. From OB draw ray OC a further 88 degrees counterclockwise; relative to
   OA, OC is at 32 + 88 = 120 degrees.
4. From OC draw ray OK a further 124 degrees counterclockwise; relative to
   OA, OK is at 120 + 124 = 244 degrees.

Place points A, B, C and K on their respective rays. This produces
angle AOB = **32 degrees**, angle BOC = **88 degrees**, and
angle COK = **124 degrees**. Each required angle is less than 180 degrees,
so the indicated sector is also the ordinary smaller angle between its
two rays. The construction is consistent and needs no unprovided lengths.
Reflections and other allowed placements need not be identical to this one.
No new image or physical construction was produced in this source-only stage.

### 994

Use 10 dm = 1 m and 1000 kg = 1 tonne.

a, in the source order:

- 8 m 9 dm = **8.9 m**.
- 9 m 8 dm = **9.8 m**.
- 4 dm = **0.4 m**.
- 15 dm = **1.5 m**.

b, in the source order:

- 3 tonnes 246 kg = **3.246 tonnes**.
- 380 kg = **0.380 tonnes = 0.38 tonnes**.
- 1244 kg = **1.244 tonnes**.

### 995

1. 7/15 - 4/15 = 3/15 = **1/5**.
2. 3/8 + 1/8 = 4/8 = **1/2**.
3. 5/6 - 2/6 = 3/6 = **1/2**.
4. 11/20 - 9/20 = 2/20 = **1/10**.
5. 3 1/2 + 2 1/2 = (3 + 2) + (1/2 + 1/2) = **6**.
6. 3 1/2 - 2 1/2 = (3 - 2) + (1/2 - 1/2) = **1**.

### 996

Each decimal lies strictly between these consecutive natural numbers:

- **5 < 5.1 < 6**.
- **6 < 6.32 < 7**.
- **9 < 9.999 < 10**.
- **25 < 25.257 < 26**.

The inequalities are strict; 9.999 is not equal to 10.

### 997

Preserve the instruction NOT to calculate the sums. Compare corresponding
addends directly.

- a: 3.72 < 3.84, 0.89 < 0.98, and 5.21 < 5.64.
  Every addend of the second expression is larger than its counterpart,
  so **3.84 + 0.98 + 5.64 is larger**.
- b: 21.4 > 20.7, 8.3 > 8.1, and 6.1 > 5.73.
  Every addend of the first expression is larger than its counterpart,
  so **21.4 + 8.3 + 6.1 is larger**.

No sum or numerical difference of sums was calculated for this task.

### 998

The rectangular timber's volume is length * width * height.
Convert all three dimensions first:
580 mm = 58 cm, 120 mm = 12 cm, and 42 mm = 4.2 cm.

V = 58 * 12 * 4.2 = 696 * 4.2 = **2923.2 cubic centimetres**.

Equivalently, 580 * 120 * 42 = 2,923,200 cubic millimetres;
1000 cubic millimetres = 1 cubic centimetre, yielding the same volume.
The requested unit is cubic centimetres, not millimetres or centimetres.

### 999

Both word problems are independent and must be solved.

1. Let t be surface travel time in hours. Underwater time is 20t,
   and its excess over surface time is 57 hours:
   20t - t = 57, so 19t = 57 and **t = 3 hours on the surface**.
   Underwater time is 60 hours, whose excess over 3 is 57.
2. Let s be surface distance in km. Underwater distance is 17s.
   Their difference is 320 km:
   17s - s = 320, so s = 20 km.
   The requested underwater distance is 17 * 20 = **340 km**,
   not the surface distance 20 km. Check: 340 - 20 = 320.

### 1000

Taking each digging operation as one full 2-cubic-metre bucket, the four
hours require 600 / 2 = 300 operations. Operations per hour:
300 / 4 = **75 operations per hour**.
Equivalently, (600 / 4) / 2 = 75.
This is the hourly rate, not the four-hour total.

### 1001

| Part | Calculation |
| --- | --- |
| a | 1.23 + 46.56 = 47.79 |
| b | 0.59 - 0.27 = 0.32 |
| c | 0.43 + 2.98 = 3.41 |
| d | 4.348 + 1.593 = 5.941 |
| e | 6.05 - 2.87 = 3.18 |
| f | 14.200 + 5.384 = 19.584 |
| g | 3.10 - 0.09 = 3.01 |
| h | 15.00 - 1.12 = 13.88 |
| i | 3.00 - 0.07 = 2.93 |

### 1002

- Downstream: 40.5 + 5.8 = **46.3 km/h**.
- Upstream: 40.5 - 5.8 = **34.7 km/h**.

Both requested directions are retained.

### 1003

The given 23.7 km/h is already the downstream speed.

- Own speed: 23.7 - 3.8 = **19.9 km/h**.
- Upstream speed: 19.9 - 3.8 = **16.1 km/h**.

The current must be removed twice when going directly from downstream
speed to upstream speed.

### 1004

Read the seed's digit-grouping notation as grouped integers.
In particular, `146\,325` means **146325**, not 146 multiplied by 325.
The colon in part a denotes division.

a:

- 124821 / 207 = 603, since 207 * 603 = 124821.
- Parentheses: 603 + 2086 = 2689.
- 83491 - 2689 + 12763 = 80802 + 12763 = **93565**.

b:

- 72 * 306 = 22032.
- Parentheses: 22032 - 1693 = 20339.
- 146325 - 20339 + 75014 = 125986 + 75014 = **201000**.

The grouping, subtraction of the entire parenthesized expression,
and final addition are all retained.

### 1005

Source givens only: the original pipe totals 7.35 m and the first,
specified piece is 2.89 m. The other piece has length
7.35 - 2.89 = **4.46 m**.

The requested quantity is how much longer the second piece is than the
first, not merely the second piece's length:
4.46 - 2.89 = **1.57 m**.

Check the decomposition: 2.89 + 4.46 = 7.35 m.
The diagram's long-piece label x would consequently be 4.46 m, but x
itself is not given data. People and apparent scale supply no lengths.

### 1006

- a: 73.12 - (5.34 + 13.12)
  = 73.12 - 18.46 = **54.66**.
- b: 101.3 + (84.7 + 1.11)
  = 101.3 + 85.81 = **187.11**.
- c: (47.28 - 34.98) + (55.02 + 34.98)
  = 12.30 + 90.00 = **102.30 = 102.3**.
  The subtracted and added 34.98 also cancel, leaving 47.28 + 55.02.
- d: (46.83 + 15.77) - 16.83
  = 62.60 - 16.83 = **45.77**.

### 1007

Both simplified forms AND substituted values are required.

| Part | Simplified expression | Substitution and value |
| --- | --- | --- |
| a | 3.9 + 18.55 - a = 22.45 - a | a = 1.64: 22.45 - 1.64 = 20.81 |
| b | 16.4 + m + 3.8 = m + 20.2 | m = 2.7: 2.7 + 20.2 = 22.9 |

### 1008

- a: 16.1 - (x - 3.8) = 11.3 implies x - 3.8 = 4.8,
  so **x = 8.6**.
  Substitution: 16.1 - (8.6 - 3.8) = 16.1 - 4.8 = 11.3.
- b: 25.34 - (2.7 + y) = 15.34 implies 2.7 + y = 10,
  so **y = 7.3**.
  Substitution: 25.34 - (2.7 + 7.3) = 25.34 - 10 = 15.34.

## Source qualifications and freeze boundary

- Exercise 984 is the only identified direction qualification: upstream is
  inferred from the continuous journey from the lake into its inflowing river,
  not supplied by an isolated explicit upstream word. The intended geographic
  interpretation gives 177 km; without that interpretation the river direction
  is underdetermined, with 201 km for a downstream leg.
- Exercises 992 and 993 intentionally allow nonunique constructions. That
  freedom is not missing data. Their construction requirements are preserved,
  and no claim of actual drawing or physical measurement is made.
- Exercise 1000 uses the standard word-problem convention of full buckets
  and a per-hour rate; arbitrary partial buckets or varying hourly schedules
  are not additional source facts.
- No unresolved numerical, figure-label, or source-literal ambiguity was
  identified beyond the direction qualification stated for 984.
- Arithmetic and construction reasoning were performed independently before
  writing this document. No mathematical checker, test, database, network
  service, installation, publishing operation, or Git write was used.
- Frozen at the first complete write. The document's byte SHA-256 is reported
  separately after writing, so that a self-referential hash is not embedded.
  No other output was written. Do not revise this source-solving snapshot
  after exposure to any choice projection, key, or author reasoning.
- STAGE1 ends here. Await explicit STAGE2 authorization before reading any
  visible question projection. No draft file has been opened.
