# Source-First Mathematics: 5m n38

Author identity: STEMROBIN-182-Session-A-5m-n38-author.
Role is author, not independent reviewer. Model and usage: null.
Actual inspected lesson: math5-c2-s1-n38. Whitelist originals: 694--704,
eleven written tasks. No previous choices, answers, interaction configurations,
parent/reviewer solutions, author history, services or database read.
This full source record is saved before any candidate options, draft or view.

## Prepared Input and Definitions

Seed: seed.json.
Canonical seed SHA256:
e70c99a352c6a694b5ad883e26d2203df1d0a8f4f3cbc7dfd05ace7e92e6825a.
Raw book trace:
803378cd3f123e03e999552d8b57cf8df4e44a369ae70595ada325abcd6f7056.
Selected clean definition paragraphs are blocks 7, 9, 11:

- Multiplying or dividing both numerator and denominator by the same
  natural number preserves the fraction.
- Equal fractions are different representations of the same number.
- The integer set Z is contained in the rational set Q.

Circle demonstrations, computed transformation examples and the paragraph
containing several integer-as-fraction illustrations were not selected.
No source figure is needed to interpret these three selected paragraphs.
Only the actual written task 700 references a source figure, fig-135.

The general wording in block 7 does not explicitly say "nonzero." All source
transformations in this selected batch use the given positive factors 5, 3
or 9, and all source denominators are positive nonzero integers. Thus none of
these tasks depends on whether a different convention includes 0 among natural
numbers. Do not generalize the selected rule to multiplying/dividing by 0.
This unused edge of the general wording is not a missing premise for any
694--704 task.

## Actual Figure Before Options

Opened both actual source assets, not their specification or stored review:

- fig-135.svg:
  40b221ae8c3c368877d7be7cd84bbe77d651114fbb4c8536fa3a37167fa00a02.
- fig-135.artwork.png:
  0668777c9c031fe64dcc7e948e7da2ca3d23593dbe2afbd5fba3389b6138de73.

Both use a complete 640 by 600 extent. Actual headless browser renders show
each at 1000 CSS pixels wide by 937.5 pixels high. A third observational
render combines the existing transparent artwork with the existing SVG cage
without creating a replacement source image. Every full extent was inside the
viewport; all three complete screenshots were opened.

SVG: a rectangular cage frame and crossing wire lines; all four frame edges,
especially the right and bottom, are visible. No axis, count label, 19-head
annotation or 62-foot annotation is embedded in the SVG.

Artwork: three chickens across the upper row, two chickens across the middle
row, and three rabbits across the bottom row. Rightmost rabbit ears/body/feet,
bottom feet and all chicken heads are visible. Rabbit pose hides some legs;
do not infer anatomical total leg counts from visible paw pixels.

The eight depicted animals (five chickens, three rabbits) do not constitute the
text's complete nineteen-head cage. These are an illustration of the species,
not a usable exhaustive count of the mathematical unknowns. Record this
source-picture limitation rather than altering the image or replacing the
explicit printed numerical data. A later view can explicitly call the image
a species illustration. This does not erase the observed difference.

Browser: existing Chrome executable, explicit headless:true, fresh
nonpersistent context, PWDEBUG removed before loading Playwright, report
opening set to never, external requests aborted. Closed in finally.
Evidence: open-source-assets.mjs, source-figure-render.json and
figure-previews/fig-135-{svg,artwork,composite}-full-1000.png.
No raw book, lesson, asset, application or dependency was modified.

## 694: Multiply Both Terms by Five

Task: for all four supplied fractions, multiply numerator and denominator
by exactly 5 and write equalities. Do not substitute merely a reduced
equivalent form for the requested explicit transformation.

1. 1/5 = (1*5)/(5*5) = 5/25.
2. 3/7 = (3*5)/(7*5) = 15/35.
3. 25/8 = (25*5)/(8*5) = 125/40.
4. 39/40 = (39*5)/(40*5) = 195/200.

For each fraction a/b, (5a)/(5b)=(a/b)*(5/5)=a/b, with b nonzero
and 5 nonzero. All transformed denominators remain nonzero.
There are no physical units. An equivalent fraction with other terms can have
the right value without being the specified multiply-by-five record.
The ordered four transformations form one coherent full task.

## 695: Divide Both Terms by Three

1. 6/3 = (6/3)/(3/3) = 2/1.
2. 9/6 = (9/3)/(6/3) = 3/2.
3. 15/9 = (15/3)/(9/3) = 5/3.
4. 33/21 = (33/3)/(21/3) = 11/7.

Every supplied numerator and denominator is an integer multiple of 3.
The divisor is nonzero and the new denominators 1,2,3,7 are nonzero.
Dividing both terms by the same factor preserves value:
(a/3)/(b/3)=a/b. The first transformed fraction 2/1 is allowed, not
discarded for being an integer or improper fraction. Ordered complete task.

## 696: Explain Both Given Equalities

1. 4/5 = (4*2)/(5*2) = 8/10.
   Numerator and denominator are multiplied by the same nonzero factor 2,
   so the value stays fixed. Reverse verification:
   (8/2)/(10/2)=4/5. Cross products: 4*10=5*8=40.
2. 44/100 = (44/4)/(100/4) = 11/25.
   Both terms are divided by the same nonzero factor 4.
   Reverse verification: (11*4)/(25*4)=44/100.
   Cross products: 44*25=100*11=1100.

The task already states that the equalities hold; merely selecting the repeated
equalities would lose the requested explanation. A response must judge a
valid complete argument for both equalities, with actual factors and both
numerator/denominator operations. Independent written explanatory production
is still lost in a choice version and must be named.

## 697: Positive and Negative Rational Sets

Let Q+={q in Q:q>0}, Q-={q in Q:q<0}.
No real number can be both strictly positive and strictly negative:
Q+ intersection Q- is empty.

Every nonzero rational is either positive or negative, so
Q+ union Q- = Q without {0}.
Zero is rational (0/1), but it is neither strictly positive nor strictly
negative. Therefore the union is not all of Q. No natural-number zero
convention is involved. Both intersection and union are requested, including
the single excluded rational boundary point.

## 698: Integer and Rational Sets

For any integer n, n=n/1 is rational, since denominator 1 is nonzero.
Thus Z is contained in Q, consistently with selected block 11.

An element in both Z and Q is exactly an integer:
Z intersection Q = Z.
An element in Z or Q is exactly a rational:
Z union Q = Q.

Containment is proper: 1/2 is rational and not an integer, so Q is not
contained in Z and the two sets are not interchangeable. Include negative
integers and zero; neither changes the containment argument. Full ordered
intersection/union task, not a single membership question.

## 699: Linear Equation

3x+96 = 1568-5x.
Add 5x to both sides:
8x+96 = 1568.
Subtract 96 from both sides:
8x = 1472.
Divide by 8, which is nonzero:
x = 184.

Original check: 3*184+96 = 552+96 = 648;
1568-5*184 = 1568-920 = 648.
Unique root in the real numbers. No variable denominator or physical unit.

## 700: Chickens and Rabbits, Explicit Head/Foot Totals

Use the printed numerical totals, not a count of the eight illustrated animals.
In the conventional chicken/rabbit head-and-leg model each animal has one
head, a chicken two legs and a rabbit four legs.

Let c,r be nonnegative integers, c chickens and r rabbits:
c+r = 19,
2c+4r = 62.
Subtract twice the first equation from the second:
2r = 62-2*19 = 62-38 = 24.
Thus r=12 and c=19-12=7.
Check heads: 7+12=19.
Check legs: 2*7+4*12=14+48=62.
Both counts are nonnegative integers. The coefficient difference is nonzero,
so these are the unique counts under the stated species-leg model.

All-rabbit alternative derivation: 4*19-62=14 missing legs relative to
nineteen rabbits; each replacement by a chicken loses 2, so c=14/2=7.
The source illustration's five chickens and three rabbits would instead give
8 heads and 22 legs under that model; it does not meet either printed total.
The view must retain the actual figure and explicitly distinguish illustration
from an exhaustive mathematical census rather than making its picture counts
into the answer.

## 701: Complete Numerical Expression

Expression:
(36*1.5+3.6*85)/1.8 + 11.88/0.11.
First multiplication: 36*1.5=54.
Second multiplication: 3.6*85=306.
Parenthesized sum: 54+306=360.
First quotient: 360/1.8=200.
Second quotient: 11.88/0.11=1188/11=108.
Final sum: 200+108=308.

All operations are exact terminating-decimal rational arithmetic;
denominators 1.8 and 0.11 are nonzero. The colon means division. The
parentheses bind both products before division by 1.8; the last quotient is
added afterward. No rounding or physical unit is specified. A complete
response must preserve both products, both quotients and final addition.

## 702: Divide Both Terms by Nine

1. 18/27 = (18/9)/(27/9) = 2/3.
2. 27/36 = (27/9)/(36/9) = 3/4.
3. 72/63 = (72/9)/(63/9) = 8/7.
4. 45/27 = (45/9)/(27/9) = 5/3.

Both terms in every supplied fraction are multiples of the same nonzero
factor 9. Denominators 3,4,7,3 remain nonzero; improper fractions 8/7 and
5/3 are legitimate. All four ordered equalities are required, not just
the first fraction or a generic statement that dividing both terms works.

## 703: Full Unit-Fraction Counts in Both Groups

"How many 1/d in a fraction p/q" means n*(1/d)=p/q,
so n=(p/q)/(1/d)=p*d/q.

Group 1, unit 1/6:

- 1/2=(3/6)=3*(1/6); count 3.
- 1/3=(2/6)=2*(1/6); count 2.
- 3/2=(9/6)=9*(1/6); count 9.

Group 2, unit 1/15:

- 1/5=(3/15)=3*(1/15); count 3.
- 2/3=(10/15)=10*(1/15); count 10.
- 3/5=(9/15)=9*(1/15); count 9.
- 4/3=(20/15)=20*(1/15); count 20.

Complete ordered counts: (3,2,9) and (3,10,9,20).
Every count is a nonnegative integer here. Improper source fractions have
counts greater than the unit denominator when appropriate; no cap at one
whole or at d is justified. There are no physical units. Both original
groups and their distinct unit fractions must be preserved.

## 704: All Three Days and Total Wire Mass

Let x>0 be first-day wire mass in kg. Second-day mass is 2x and third-day
mass is 3x. The first day is 30kg less than the third:
3x-x=30, hence 2x=30 and x=15kg.
Ordered three-day masses: 15kg,30kg,45kg.
Total: (1+2+3)x=6*15=90kg.
Check: 45-15=30, 30=2*15, 45=3*15.

Do not interpret the stated difference 30kg as third-day mass or first-day
mass. Fractional kg quantities are valid in an intermediate or candidate
model; no integer procurement convention is stated or needed.
The original asks the complete three-day total; an authored complete record
can retain the related daily masses as well without replacing the total.

## Source-Level Status Before Authoring

All eleven original mathematical tasks have determinate solutions under their
stated conditions and the standard head/leg model for the animal word problem.
No missing source ownership found. fig-135 is correctly referenced.
The illustration is not an exhaustive cage census and that observed limitation
is preserved, not silently corrected.
No seed, book, lesson or actual figure is regenerated after preparation.
No draft/view/options were read or made while establishing this source record.
No structural or canonical validation has yet run.
