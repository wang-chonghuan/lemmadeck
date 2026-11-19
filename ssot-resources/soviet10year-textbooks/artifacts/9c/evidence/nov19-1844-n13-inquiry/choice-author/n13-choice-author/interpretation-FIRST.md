# FIRST Task and Notation Interpretation

Status: FIRST, fixed before consideration or construction of choice options.
Scope: STEMROBIN-184 B, exercise 115 in the supplied seed only.

## Input Authority

Mathematical inputs are exclusively:

- .tmp/stemrobin-184-resume/n13-choices/seed.json
- .tmp/stemrobin-184-resume/n13-choice-inspect-first/native.stdout

The saved inspect output is an inventory, not a concept selection. Only seed
concept blocks 1, 3, 5, 8 and 9 are selected. Mixed solved-example block 2 is
excluded, including its worked examples. Its explicit integer-only bar-sign
convention was observed in the permitted saved inventory solely to resolve
notation; it is not a selected definition or a solution source. No underlying
textbook files, answer candidates, answer keys, previous choices or figures were
opened. The procedural skill, authoring and contract references were read.

## Full Source Task

For each of 7/3, 23/30, -3/7 and -29/11:

1. Construct an exact infinite decimal representation, not a rounded finite
   approximation.
2. Explain why its digits eventually repeat, using division remainders and the
   deterministic next-digit/next-remainder transition.

The mathematical distinctions include a nonzero integer part, a nonrepeating
prefix, negative numbers, a longer repeating cycle and a two-digit cycle.
Representation and the repeating-remainder explanation are both required.
Neither an unsupported rational-number theorem citation nor a few matching
printed digits alone supplies the requested concrete explanation.

## Notation Decision

Use ordinary signed-decimal notation throughout: a leading minus sign negates
the entire positive decimal magnitude. No integer-part overbars and no
repeating-digit overbars will be used. Infinite decimals will be printed by
showing a repeating block twice followed by \ldots. Repetition conventions will
be stated in the visible stem; negative stems will explicitly say that the
leading minus sign applies to the entire decimal.

Concept block 5 describes the reduction to a nonnegative fractional part in
an integer-plus-fraction convention. For negative r this is the floor-based
decomposition, not the fractional digits of the ordinary signed magnitude:
-3/7 = -1 + 4/7 and -29/11 = -3 + 4/11. Accordingly, do not silently identify
those nonnegative fractional parts with the digits after the point in an
ordinary signed decimal. Instead divide the positive magnitude, prove its
digits repeat, then negate the whole decimal. This is an exact representation
of the requested number and does not depend on the unselected bar convention.
The fixed choice of notation precedes, and is not inferred from, any options.

For digit-period witnesses, index the first digit after the decimal point as
a_1. N and p are positive integers as in selected block 1; p counts digits,
not the numerical value of a repeating block. Minimal N and minimal p will
be calculated as explanatory witnesses, not imposed as a new source task.

## Explanation Convention

For positive divisor n and current remainder r, the next step is
10r = nq + r', with 0 <= q <= 9 and 0 <= r' < n.
The same remainder, with the same divisor, determines the same q and r'.
Repeated remainders therefore repeat all subsequent transitions and digits.
The initial remainder before decimal digits is included in the remainder
sequence. None of these four cycles reaches zero; selected block 9 remains
a valid general terminal case, not an additional problem to manufacture.

## Response Distinction and Capacity Boundary

Choices may test recognition of an exact representation together with the
correct concrete explanation, rather than separate questions that disclose
each other's representation or remainder sequence. No item/option count is
fixed by the source lettering. Independent production of the decimal digits,
long division and written proof cannot be demonstrated by selecting a
prepared claim; those losses must be recorded in the draft coverage.

## Images

Fresh image cap0: the selected exercise and selected definitions have no
figure IDs; the seed figure inventory and concept figure IDs are empty.
The saved inspect inventory's unselected figure is not authorized or needed.
Images opened: 0. Images created: 0. New figures: none.
