# Independent SOURCE-first review: 9c physical23-24

Ticket: STEMROBIN-184. Finish: review. Date: 2026-11-23.
Sole working directory: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.

These observations were frozen immediately after one model image open of each
original, before reading any candidate, template, machine count, or parent
source observation. They are observations of the originals, not a candidate
acceptance decision.

## Originals and image budget

- physical23: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n4-nov23-source2324/prepared/9c/pages/0023/page.png`
- physical24: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n4-nov23-source2324/prepared/9c/pages/0024/page.png`
- Model image opens: 2 total, exactly 1 per original. No crops, ROIs, reopens,
  additional decodes, duplicate images, or image-processing commands.
- No machine count was consulted; no count override or added exclusion is
  proposed.

## physical23: printed page 16

The page begins mid-exposition, with "集合，只能用唯一一种方法排列！".
It discusses the sole element being the first element, then a two-letter
example and a three-letter example. The letters are Cyrillic А, Б, В, not
an A/B/C replacement:

- Two-element orders: `АБ` or `БА`.
- Three-element orders, in printed order:
  `АБВ, АВБ, БАВ, БВА, ВАБ, ВБА`.

The next paragraph defines an order established on a finite set as its
"元素的全排列" and says that `P_n` denotes the total number of permutations
of `n` elements. Wavy underlining is visible beneath the definition wording;
it supplies no additional prose or task.

Printed formulas and their boundaries:

```text
P_1 = 1, P_2 = 2, P_3 = 6.
P_n = n P_{n-1}                                      (1)
```

"利用递推公式" precedes (1); "依次计算 P_n 很方便。" follows it.
The proof begins "我们来证明公式(1)." It chooses the element in the last,
or nth, position in n ways; the remaining n-1 elements occupy the preceding
positions in P_{n-1} ways, giving n P_{n-1} permutations.
"根据公式(1)依次得到:" then introduces these printed calculation lines:

```text
P_2 = 2 × P_1 = 2;       P_3 = 3 × P_2 = 6;
P_4 = 4 × P_3 = 24;      P_5 = 5 × P_4 = 120;
P_6 = 6 × P_5 = 720;
P_7 = 7 × P_6 = 7 × 720 = 5040;
P_8 = 8 × P_7 = 8 × 5040 = 40320;
```

The page ends with P_8, followed by printed folio 16. There is no numbered
exercise or exercise heading on this page; the enumeration is exposition,
not separate exercise tasks.

Handwritten versus printed:

- A visibly freehand, two-line algebraic annotation sits to the right of
  "依次计算 P_n 很方便。" and above the proof. It contains recurrence-like
  symbols including n+1 and P subscripts. It is not a printed continuation
  of formula (1), a new formula number, or an exercise.
- Irregular dark spots along the right margin are not printed mathematical
  content.
- No printed reading here needs to be reconstructed from the handwriting.

## physical24: printed page 17

The top continues the preceding calculation list, without a new heading:

```text
P_9  = 9 × P_8 = 9 × 40320 = 362880;
P_10 = 10 × P_9 = 10 × 362880 = 3628800;
P_11 = 11 × P_10 = 11 × 3628800 = 39916800.
```

The following printed example says that arranging 11 guests on 11 chairs
allows 39916800 ways. The next paragraph cites formula (1) and
"参看第19题", and states that P_n equals the product of the first n natural
numbers:

```text
P_n = 1 × 2 × 3 × ... × n.                           (2)
```

It introduces the notation `n!`, read as "n 的阶乘", and rewrites (2):

```text
P_n = n!                                            (3)
```

The subsequent printed prose stipulates one permutation of the empty set
for convenience in later exposition, then displays:

```text
P_0 = 1.
```

It says formula (1) then also applies for n = 1, and displays:

```text
P_1 = 1 × P_0 = 1.
```

These statements conclude the exposition. A distinct centered "习 题"
heading introduces the exercise block below.

### Printed task boundaries

**32.** "用集合 A 的元素组成一切可能的全排列，如果:"
Four printed subparts occupy two rows. Their labels are the Cyrillic
sequence а), б), в), г), with а visually shared with Latin a:

```text
а) A = {1};             б) A = {7, 8};
в) A = {a, b, c};       г) A = {m, n, p, q}.
```

The set elements in the last two subparts are the printed lowercase Latin
variables shown above. Preserve them separately from the Cyrillic
subpart-label sequence.

**33.** "用红、蓝、白三种颜色的横布条，可以拼成多少种不同的三色旗?"
The question wraps onto a second printed line ending with "三色旗?".
There is no printed subpart or printed answer list for this task.

**34.** "证明公式(设 n > m):" begins a new task, followed by its visible
first subpart:

```text
а) (m+3)! / m! = (m+1)(m+2)(m+3);
```

The left side is a printed fraction with numerator (m+3)! and denominator
m!. The condition n > m is printed in the task header even though this
visible subpart uses m only; do not replace the condition or insert n into
the formula. Only this first subpart is present on physical24. The printed
semicolon and page boundary do not establish that exercise 34 is complete;
no unseen continuation is inferred. Printed folio 17 follows.

Handwritten versus printed:

- A freehand group of short color-like sequences appears to the right of
  exercise 33's second line and alongside the exercise 34 heading. The
  strokes are visibly unlike the typeset text and formulas. They are
  annotations, not printed answers, subparts, or extra tasks.
- Their individual readings are not used to infer an answer to exercise
  33, a count, or any textbook wording.
- Irregular dark left-margin marks are not additional printed content.
- The annotations do not prevent reading the printed exercise 34
  condition or its displayed fraction.

## Source disposition

physical23: SOURCE readable; no genuine ambiguous printed SOURCE HOLD.
physical24: SOURCE readable; no genuine ambiguous printed SOURCE HOLD.

Preserve the printed recurrence, factorial notation, empty-set convention,
Cyrillic examples/subpart labels, and exercise boundaries recorded above.
Handwriting is identified solely to distinguish it from printed textbook
content, not to add exclusions or inferred content. This bounded review
does not authorize downstream lesson stages or assert that any candidate
matches these originals.
