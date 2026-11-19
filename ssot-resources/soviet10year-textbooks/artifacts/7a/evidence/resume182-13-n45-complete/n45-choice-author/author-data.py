"""Serialize explicitly authored mathematics; no solver, option generator or review."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
QUESTIONS = []


def yes(text, derivation):
    return (text, True, derivation)


def no(text, procedure):
    return (text, False, procedure)


LOSS = "Recognition of a complete result does not demonstrate independently setting up and writing the solution."
PROOF_LOSS = "Selecting a valid proof transformation does not demonstrate independently constructing and writing the proof."
COMPONENT_LOSS = (
    "Source does not specify positivity of fraction components or whether a zero numerator is permitted. "
    "This authored item explicitly permits integer components, including negative or zero numerators, "
    "with both denominators nonzero. The unqualified historical component convention remains unresolved."
)
N_LOSS = (
    "Source does not say whether natural numbers include zero. This authored item explicitly uses "
    "N={0,1,2,...}; identifying that qualified graph is not a determination of the historical convention. "
    "The original unqualified graph has 20 or 21 points depending on that convention."
)
DRAW_LOSS = "Recognizing the complete graph or coordinate order does not demonstrate drawing it or placing the points."

FIG_OBS = {
    "fig-60": (
        "Opened actual original PNG and complete 640px modern preview once each. The finite nonanalytic curve "
        "crosses y=3 at x=0 and x=4, is below between them and above outside them on [-1.5,6]. "
        "Endpoint guides are at -1.5 and 6; no extrapolation or quadratic formula inferred."
    ),
    "fig-61": (
        "Opened actual original PNG and complete 640px modern preview once each. Panel a: 0<A(x)<B(x^2); "
        "panel b: 0<B(x^2)<A(x). Both arrows and labels are visible. There is no unit scale, so spacing "
        "is not numeric data. Hollow A in panel a marks a location, not an excluded endpoint."
    ),
}


def add(number, suffix, mode, stem, task, solution, reason, options, losses=None, figures=()):
    qid = f"q{number}{suffix}"
    # Order uses visible content only, never truth flags or a key-position quota.
    options = sorted(options, key=lambda opt: hashlib.sha256(
        (qid + "\0" + opt[0]).encode("utf-8")).digest())
    ids = [chr(65 + i) for i in range(len(options))]
    QUESTIONS.append({
        "id": qid,
        "source_numbers": [str(number)],
        "view": {
            "mode": mode,
            "stem": stem,
            "figure_ids": list(figures),
            "options": [{"id": oid, "text": opt[0], "figure_ids": []}
                        for oid, opt in zip(ids, options)],
        },
        "intent": {
            "task": task,
            "source_solution": solution,
            "unit_reason": reason,
            "concept_blocks": [],
            "limitations": [LOSS] if losses is None else losses,
            "figure_observations": [{"figure_id": fid, "observation": FIG_OBS[fid]}
                                    for fid in figures],
        },
        "key": {
            "correct": [oid for oid, opt in zip(ids, options) if opt[1]],
            "rationales": [{
                "option_id": oid,
                "truth": "correct" if opt[1] else "incorrect",
                "derivation": opt[2],
                "misconception": None if opt[1] else opt[2],
            } for oid, opt in zip(ids, options)],
        },
    })


add(873, "a", "single",
    "Two natural numbers have product 187 and differ by 6. Which unordered pair satisfies both conditions?",
    "Find both natural numbers from their product and difference.",
    "n(n+6)=187 gives (n-11)(n+17)=0; n is natural, so the numbers are 11 and 17. The zero convention cannot affect this result.",
    "One pair must satisfy both relationships; the other printed subpart has a different domain and is independent.",
    [no("$\\{1,187\\}$", "Factor 187 as 1*187 and stop without checking the difference; 187-1=186, not 6."),
     yes("$\\{11,17\\}$", "11*17=187 and 17-11=6; the other quadratic root -17 is not natural."),
     no("$\\{-17,-11\\}$", "Keep n=-17 from the quadratic because the product and difference work, but omit the natural-number condition.")])

add(873, "b", "multiple",
    "Write 120 as the product of two numbers, one 2 less than the other. Select every unordered pair that works.",
    "Find every pair without adding a positivity or natural-number restriction.",
    "For smaller x, x(x+2)=120 gives x=10,-12. Thus {10,12} and {-12,-10} both satisfy the unqualified number domain.",
    "A native multiple selection preserves the two admissible pairs instead of splitting or suppressing a quadratic branch.",
    [yes("$\\{10,12\\}$", "10*12=120 and 12-10=2."),
     no("$\\{-12,10\\}$", "Report the two roots of x^2+2x-120 as the requested two numbers rather than pairing each root with x+2; their product is -120."),
     yes("$\\{-12,-10\\}$", "(-12)*(-10)=120 and -10-(-12)=2; no source condition excludes negatives.")])

add(874, "a", "single",
    "A rectangle has length 4 cm more than its width and area $60\\,\\mathrm{cm}^2$. What is its perimeter?",
    "Recover the physical side lengths and compute the perimeter.",
    "w(w+4)=60 gives w=6 or -10; positive sides are 6 and 10 cm. P=2(6+10)=32 cm.",
    "Perimeter is one complete geometric result, not separate width and length answer clicks.",
    [no("$16\\,\\mathrm{cm}$", "Solve for sides 6,10, then add them once as 6+10 instead of doubling for the four sides."),
     no("$60\\,\\mathrm{cm}$", "Use the given area number as the perimeter, confusing the product of sides with their doubled sum."),
     yes("$32\\,\\mathrm{cm}$", "Positive width 6 and length 10 give 2(6+10)=32 cm.")])

add(874, "b", "single",
    "A rectangle has perimeter 62 m and area $210\\,\\mathrm{m}^2$. Which pair gives its side lengths?",
    "Determine two positive sides from their sum and product.",
    "s+t=31, st=210; s^2-31s+210=(s-10)(s-21), hence 10,21 m.",
    "The complete side pair retains the simultaneous sum/product task.",
    [yes("$10\\,\\mathrm{m},\\ 21\\,\\mathrm{m}$", "10+21=31 gives perimeter 62; 10*21=210."),
     no("$31-\\sqrt{751}\\,\\mathrm{m},\\ 31+\\sqrt{751}\\,\\mathrm{m}$", "Set s+t=62 rather than 31 and st=210; solving z^2-62z+210 gives 31+-sqrt(751)."),
     no("$14\\,\\mathrm{m},\\ 15\\,\\mathrm{m}$", "Choose the near-square factor pair 14*15=210 but do not check perimeter; 2(14+15)=58.")])

add(875, "a", "single",
    "The product of two consecutive natural numbers exceeds their sum by 109. Which pair is it?",
    "Model product minus sum, preserving consecutiveness and natural admissibility.",
    "n(n+1)-(2n+1)=109 gives (n-11)(n+10)=0; natural pair 11,12.",
    "The two numbers are one coherent result from one condition.",
    [no("$\\{10,11\\}$", "Take the magnitude of the inadmissible root n=-10 and attach its successor; 110-21=89."),
     yes("$\\{11,12\\}$", "132-23=109, and the numbers are consecutive natural numbers."),
     no("$\\{9,10\\}$", "Use product PLUS sum=109, giving n^2+3n-108=0 and n=9; the resulting pair has product minus sum 71.")])

add(875, "b", "single",
    "For two consecutive natural numbers, the square of their sum exceeds the sum of their squares by 112. Which pair satisfies this?",
    "Distinguish (a+b)^2 from a^2+b^2 and solve the resulting product equation.",
    "(2n+1)^2-[n^2+(n+1)^2]=2n(n+1)=112, so n(n+1)=56; natural n=7, pair 7,8.",
    "The whole pair tests the cross term rather than separate calculations.",
    [no("No such natural pair exists.", "Omit the factor 2 in the cross term and solve n(n+1)=112. Its positive solution (-1+sqrt(449))/2 is not natural, so incorrectly conclude the original problem has no natural solution."),
     no("$\\{8,9\\}$", "Solve n(n+1)=56 correctly as n=7 but then increment both numbers once more as though n were the predecessor."),
     yes("$\\{7,8\\}$", "15^2-(49+64)=225-113=112.")])

add(876, "a", "single",
    "A right triangle has legs in the ratio $8:15$ and hypotenuse 6.8 m. What is its area?",
    "Use Pythagoras to determine the scale and then the triangular area.",
    "The ratio triple is 8:15:17; scale k=6.8/17=0.4, legs 3.2,6 m; area (3.2*6)/2=9.6 m^2.",
    "Area combines the ratio, Pythagorean constraint and one-half factor in a single response.",
    [yes("$9.6\\,\\mathrm{m}^2$", "k=0.4 gives half the product 3.2*6, namely 9.6."),
     no("$19.2\\,\\mathrm{m}^2$", "Find legs 3.2 and 6 correctly but omit the factor 1/2, returning 3.2*6."),
     no("$\\frac{13872}{2645}\\,\\mathrm{m}^2$", "Treat the hypotenuse as the sum of the legs: 23k=6.8 so k=34/115; area 60k^2=13872/2645.")])

add(876, "b", "single",
    "In a right triangle, the hypotenuse and one leg have ratio $13:12$. The other leg is 15 cm. What is the perimeter?",
    "Identify the missing 5-part leg and scale the 5:12:13 triple.",
    "Hypotenuse 13k and specified leg 12k give other leg 5k=15, k=3; sides 39,36,15 and perimeter 90 cm.",
    "A complete perimeter keeps the identification of which leg is given.",
    [no("$\\frac{75}{2}\\,\\mathrm{cm}$", "Attach the given 15 cm to the 12-part leg, k=15/12; sum of ratio parts 30 gives 30*15/12=75/2."),
     no("$75\\,\\mathrm{cm}$", "Scale correctly to 39 and 36 cm, but omit the other leg 15 when adding the perimeter."),
     yes("$90\\,\\mathrm{cm}$", "5k=15, so all three sides sum to (5+12+13)*3=90 cm.")])

# Each constant-denominator equation is mathematically independent: different
# coefficients, expansions and root sets. Options are complete sets, not boxes.
EQ_REASON = "This equation has its own coefficients and expansion; one complete root set preserves both roots and is independent of the other equations."

add(877, "a", "single",
    "Which is the complete root set of $\\frac{x^2+1}{2}-x=2$?",
    "Clear a constant denominator and solve the quadratic.",
    "x^2+1-2x=4 gives (x-3)(x+1)=0, roots {-1,3}.", EQ_REASON,
    [no("$\\{-3,1\\}$", "Change -2x to +2x after multiplying by 2; x^2+2x-3 factors as (x+3)(x-1)."),
     yes("$\\{-1,3\\}$", "Multiplication by 2 gives x^2-2x-3=0; factors yield -1 and 3."),
     no("$\\{1-\\sqrt2,1+\\sqrt2\\}$", "Multiply the left side by 2 but leave the right side as 2, giving x^2-2x-1=0.")])

add(877, "b", "single",
    "Which is the complete root set of $x\\frac{x+1}{6}-2x=2$?",
    "Multiply all terms by 6 and retain the coefficient of the linear term.",
    "x(x+1)-12x=12 gives (x-12)(x+1)=0, roots {-1,12}.", EQ_REASON,
    [yes("$\\{-1,12\\}$", "x^2-11x-12=(x-12)(x+1)."),
     no("$\\{-3,4\\}$", "Multiply only the fractional term and right side by 6 but leave -2x unchanged: x^2-x-12=0."),
     no("$\\{1,-12\\}$", "From x^2-11x-12=0 read the sum of roots as -11 instead of +11, giving the sign-reversed pair.")])

add(877, "c", "single",
    "Which is the complete root set of $3-\\frac{x+2}{4}x=x+5$?",
    "Distribute the negative product and rearrange the quadratic.",
    "12-x(x+2)=4x+20 gives x^2+6x+8=(x+2)(x+4), roots {-4,-2}.", EQ_REASON,
    [no("$\\{2,4\\}$", "Reverse the sign of the combined linear coefficient, solving x^2-6x+8=0 instead."),
     no("$\\{-3-\\sqrt{17},-3+\\sqrt{17}\\}$", "Move the constant 20 across incorrectly to produce x^2+6x-8=0 rather than +8."),
     yes("$\\{-4,-2\\}$", "The correctly cleared and rearranged equation factors as (x+4)(x+2)=0.")])

add(877, "d", "single",
    "Which is the complete root set of $\\frac{3x+4}{5}-\\frac{x^2-4x-6}{10}=-1$?",
    "Clear unequal constant denominators and distribute a minus sign across a polynomial.",
    "6x+8-x^2+4x+6=-10 gives x^2-10x-24=(x-12)(x+2), roots {-2,12}.", EQ_REASON,
    [no("$\\{2,-12\\}$", "Change the sign of the linear term in x^2-10x-24, solving x^2+10x-24."),
     yes("$\\{-2,12\\}$", "Both roots of x^2-10x-24=0 solve the original constant-denominator equation."),
     no("$\\{5-\\sqrt{29},5+\\sqrt{29}\\}$", "Use RHS +10 rather than -10 after multiplying by 10: x^2-10x-4=0, roots 5+-sqrt(29).")])

add(877, "e", "single",
    "Which is the complete root set of $\\frac{(y+1)^2}{12}-\\frac{7-y}{4}=\\frac y2$?",
    "Expand the square and distribute the negative multiplier before solving.",
    "(y+1)^2-3(7-y)=6y gives y^2-y-20=(y-5)(y+4), roots {-4,5}.", EQ_REASON,
    [yes("$\\{-4,5\\}$", "Expansion gives y^2+2y+1-21+3y=6y, hence y^2-y-20."),
     no("$\\{\\frac{7-\\sqrt{129}}2,\\frac{7+\\sqrt{129}}2\\}$", "Expand -3(7-y) as -21-3y, giving y^2-7y-20=0."),
     no("$\\{-5,4\\}$", "Read the coefficient -1 as the sum of roots instead of its negative, reversing both correct roots.")])

add(877, "f", "single",
    "Which is the complete root set of $\\frac{3-y}{5}=\\frac{y-2}{4}+\\frac{(y-2)^2}{8}$?",
    "Scale the denominators consistently and solve without losing the fractional root.",
    "Multiplying by 40 gives 8(3-y)=10(y-2)+5(y-2)^2, hence 5y^2-2y-24=(5y-12)(y+2); roots {-2,12/5}.", EQ_REASON,
    [no("$\\{-\\frac{12}{5},2\\}$", "Reverse the sign of the linear coefficient in 5y^2-2y-24 and solve 5y^2+2y-24."),
     no("$\\{\\frac{11-\\sqrt{601}}{10},\\frac{11+\\sqrt{601}}{10}\\}$", "Multiply the squared term by 5 and the left side by 8 but leave (y-2)/4 as (y-2); obtain 5y^2-11y-24=0."),
     yes("$\\{-2,\\frac{12}{5}\\}$", "The factors y+2 and 5y-12 give both roots; all original denominators are constants.")])

RAT_REASON = "One full admissible root set preserves the rational equation, including forbidden denominator zeros; this equation is independent of the others."

add(878, "a", "single",
    "Which is the complete root set of $\\frac{2x^2}{x-2}=\\frac{7x-6}{x-2}$?",
    "Solve the numerator equation and remove the original denominator zero.",
    "x!=2; (2x-3)(x-2)=0 leaves only 3/2.", RAT_REASON,
    [no("$\\{\\frac32,2\\}$", "Cancel x-2 and solve the resulting quadratic but fail to retain x!=2."),
     no("$\\{2\\}$", "Set the common denominator x-2 to zero as if that made the fractions equal."),
     yes("$\\{\\frac32\\}$", "The two polynomial candidates are 3/2 and 2; only 3/2 has a defined original denominator.")])

add(878, "b", "single",
    "Which is the complete root set of $\\frac{x^2-6x}{x-5}=\\frac5{x-5}$?",
    "Clear the common denominator with its exclusion and solve an irrational-root quadratic.",
    "x!=5; x^2-6x-5=0 has roots 3+-sqrt(14); neither equals 5.", RAT_REASON,
    [yes("$\\{3-\\sqrt{14},3+\\sqrt{14}\\}$", "The discriminant is 36+20=56 and dividing 6+-sqrt(56) by 2 gives these roots."),
     no("$\\{1,5\\}$", "Move RHS 5 to the left with a plus instead of minus, factoring x^2-6x+5; also keep the forbidden candidate 5."),
     no("$\\{6-2\\sqrt{14},6+2\\sqrt{14}\\}$", "Compute numerator 6+-sqrt(56) in the quadratic formula but omit division by 2.")])

add(878, "c", "single",
    "Which is the complete root set of $\\frac{2x-1}{x+7}=\\frac{3x+4}{x-1}$?",
    "Cross-multiply unequal linear denominators and preserve both exclusions.",
    "x!=-7,1; cross multiplication gives x^2+28x+27=(x+1)(x+27)=0, so {-27,-1}.", RAT_REASON,
    [no("$\\{1,27\\}$", "Reverse the sign of 28x when bringing terms together and solve x^2-28x+27=0."),
     yes("$\\{-27,-1\\}$", "Neither root of (x+27)(x+1)=0 is an original denominator zero."),
     no("$\\{-7,1\\}$", "Solve (x+7)(x-1)=0, mistaking the factors used to clear denominators for a zero numerator.")])

add(878, "d", "single",
    "Which is the complete root set of $\\frac{5y+1}{y+1}=\\frac{y+2}{y}$?",
    "Cross-multiply and discriminate equation roots from denominator exclusions.",
    "y!=-1,0; 4y^2-2y-2=2(2y+1)(y-1)=0 gives {-1/2,1}.", RAT_REASON,
    [no("$\\{-1,\\frac12\\}$", "Reverse the linear coefficient -2y to +2y and solve 4y^2+2y-2."),
     no("$\\{-1,0\\}$", "Return the zeros of y(y+1) rather than solve the cross-multiplied numerator."),
     yes("$\\{-\\frac12,1\\}$", "Cross multiplication gives y=-1/2 or 1, both permitted by y!=-1,0.")])

add(878, "e", "single",
    "Which is the complete root set of $\\frac x{x-2}+\\frac5{x+2}=\\frac8{x^2-4}$?",
    "Use the product denominator, solve and remove an extraneous root.",
    "x!=+-2; x(x+2)+5(x-2)=8 gives (x+9)(x-2)=0; only -9 remains.", RAT_REASON,
    [yes("$\\{-9\\}$", "The polynomial roots -9,2 must be checked in the original domain; 2 is forbidden."),
     no("$\\{-9,2\\}$", "Solve the cleared polynomial but forget the exclusion x!=2."),
     no("$\\{9\\}$", "Reverse +7x to -7x in x^2+7x-18; roots become 9,-2, and deleting the forbidden -2 leaves 9.")])

add(878, "f", "single",
    "Which is the complete root set of $\\frac{3x+1}{x+2}-\\frac{x-1}{x-2}=1$?",
    "Distribute the subtracted product and retain irrational admissible roots.",
    "x!=+-2; (3x+1)(x-2)-(x-1)(x+2)=x^2-4 yields x^2-6x+4=0, roots 3+-sqrt(5).", RAT_REASON,
    [no("$\\{3-\\sqrt{13},3+\\sqrt{13}\\}$", "Move -4 from the right side with the wrong sign, obtaining x^2-6x-4=0."),
     no("$\\{-2,2\\}$", "Solve the common denominator x^2-4=0 instead of the numerator equation."),
     yes("$\\{3-\\sqrt5,3+\\sqrt5\\}$", "The discriminant is 36-16=20; neither 3+-sqrt(5) equals +-2.")])

add(878, "g", "single",
    "Which is the complete root set of $\\frac4{9y^2-1}-\\frac4{3y+1}-\\frac y{1-3y}=0$?",
    "Handle oppositely signed denominator factors before solving.",
    "y!=+-1/3; the numerator is 4-4(3y-1)+y(3y+1)=(3y-8)(y-1), roots {1,8/3}.", RAT_REASON,
    [no("$\\{\\frac{-13-\\sqrt{265}}6,\\frac{-13+\\sqrt{265}}6\\}$", "Use 1-3y=3y-1 without its minus sign, giving 4-4(3y-1)-y(3y+1)=0, or 3y^2+13y-8=0."),
     yes("$\\{1,\\frac83\\}$", "Replacing -y/(1-3y) by +y/(3y-1) gives 3y^2-11y+8=0."),
     no("$\\{-\\frac13,\\frac13,1,\\frac83\\}$", "After multiplying by the denominator, incorrectly take the union of its zeros and the numerator's zeros as roots.")])

add(878, "h", "single",
    "Which is the complete root set of $\\frac4{x+3}-\\frac5{3-x}=\\frac1{x-3}-1$?",
    "Normalize denominator signs and solve with the original domain.",
    "x!=+-3; 4/(x+3)+4/(x-3)+1=0 yields x^2+8x-9=(x+9)(x-1), roots {-9,1}.", RAT_REASON,
    [yes("$\\{-9,1\\}$", "Use 3-x=-(x-3), then clear denominators to obtain x^2+8x-9=0."),
     no("$\\{-1,9\\}$", "Reverse the sign of 8x in the cleared quadratic and factor x^2-8x-9."),
     no("$\\{-3,3\\}$", "Set x^2-9=0 as though denominator zeros solved the original equation.")])

add(878, "i", "single",
    "Which is the complete root set of $\\frac{2x+1}{2x-1}-\\frac{3(2x-1)}{7(2x+1)}-\\frac{8x}{4x^2-1}=0$?",
    "Recognize that every polynomial candidate can be forbidden in the original equation.",
    "x!=+-1/2. Clearing 7(2x-1)(2x+1) gives 4(2x-1)^2=0. Its only candidate 1/2 is forbidden, so the root set is empty.", RAT_REASON,
    [no("$\\{\\frac12\\}$", "Solve the cleared numerator 4(2x-1)^2=0 and omit the original exclusion."),
     no("$\\{-\\frac12,\\frac12\\}$", "Solve 4x^2-1=0, confusing the common denominator with the equation numerator."),
     yes("$\\varnothing$", "The sole polynomial root 1/2 makes the original fractions undefined; no admissible root remains.")])

add(878, "j", "single",
    "Which is the complete root set of $\\frac{2y-5}{y^2-3y}-\\frac{y+2}{y^2+3y}+\\frac{y-5}{y^2-9}=0$?",
    "Factor three denominators and exclude a canceled candidate.",
    "y!=0,+-3. The numerator is 2y^2-3y-9=(2y+3)(y-3); only -3/2 remains.", RAT_REASON,
    [no("$\\{-\\frac32,3\\}$", "Keep both roots of the cleared numerator without checking the forbidden y=3."),
     yes("$\\{-\\frac32\\}$", "Multiply by y(y-3)(y+3); discard candidate 3, retain -3/2."),
     no("$\\{\\frac32\\}$", "Reverse the linear coefficient -3y to +3y; (2y-3)(y+3)=0 gives 3/2,-3, then discard -3.")])

add(879, "a", "single",
    "For which values of $y$ does the sum of $\\frac{y+1}{y-5}$ and $\\frac{10}{y+5}$ equal their product?",
    "Translate sum equals product and enforce both denominator restrictions.",
    "y!=+-5; (y+1)(y+5)+10(y-5)=10(y+1) gives (y+11)(y-5)=0; only -11.",
    "The equality between two operations is one complete parameter-set task.",
    [yes("$\\{-11\\}$", "The cleared equation has roots -11 and 5, but the latter is undefined in the original fractions."),
     no("$\\{-11,5\\}$", "Retain the root 5 of the cleared equation after dropping y!=5."),
     no("$\\{9\\}$", "Use the first fraction minus the second instead of their sum; the numerator becomes (y-5)(y-9), leaving 9 after excluding 5.")])

add(879, "b", "single",
    "For which values of $a$ does $\\frac6{a-4}-\\frac a{a+2}$ equal $\\frac6{a-4}\\cdot\\frac a{a+2}$?",
    "Preserve the order of subtraction and original denominator exclusions.",
    "a!=4,-2; 6(a+2)-a(a-4)=6a yields (a-6)(a+2)=0; only 6.",
    "Subtraction order and product constraint belong in one complete result.",
    [no("$\\{-2,6\\}$", "Solve the quadratic but retain the forbidden denominator zero -2."),
     no("$\\{8-2\\sqrt{19},8+2\\sqrt{19}\\}$", "Reverse the difference to second minus first: a(a-4)-6(a+2)=6a yields a^2-16a-12=0."),
     yes("$\\{6\\}$", "Only a=6 survives the original restrictions; at a=6 the difference 3-3/4 and product 3*3/4 are both 9/4.")])

add(880, "a", "multiple",
    "A fraction is written with integer numerator $n$ and integer denominator $d$. In this question either component may be negative, and both $d$ and $d+18$ must be nonzero. Suppose $n=d+1$ and $\\frac{n+3}{d+18}=\\frac nd-1$. Select every possible original pair $(n,d)$.",
    "Solve the component-change equations while explicitly declaring, rather than guessing, a component convention.",
    "With n=d+1, d^2+3d-18=(d-3)(d+6)=0, giving (n,d)=(4,3),(-5,-6). Both satisfy the literal equations; a positive-component convention would retain only (4,3). Source does not resolve that convention.",
    "Select whole numerator/denominator representations because reducing a fraction before changing components changes the task.",
    [no("$(5,6)$", "Reduce the literal solution (-5,-6) to 5/6 before applying the conditions; then n=d+1 fails and the component-change equation is no longer the same."),
     yes("$(4,3)$", "n=d+1 and 7/21=4/3-1=1/3; both denominators are nonzero."),
     yes("$(-5,-6)$", "n=d+1 and (-2)/12=(-5)/(-6)-1=-1/6; the explicit integer convention allows both negative components."),
     no("$(7,21)$", "Report the modified fraction's components for the (4,3) branch as the original components; 7 is not 21+1.")],
    losses=[LOSS, COMPONENT_LOSS])

add(880, "b", "multiple",
    "A fraction is written with integer numerator $n$ and integer denominator $d$. In this question zero and negative numerators are allowed, while both $d$ and $d+5$ must be nonzero. Suppose $n=d-4$ and $\\frac{n-3}{d+5}=\\frac nd-\\frac13$. Select every possible original pair $(n,d)$.",
    "Solve component changes and preserve the zero-numerator solution under a visible convention.",
    "Substitution gives d^2-19d+60=(d-15)(d-4)=0. The pairs are (11,15),(0,4). The second is removed by a positive-numerator convention not specified in the source.",
    "Whole component pairs test the actual changes, rather than merely equivalent numerical fraction values.",
    [yes("$(0,4)$", "0=4-4 and (-3)/9=0/4-1/3=-1/3; the explicit convention allows zero numerator."),
     no("$(8,20)$", "Report the modified components of the (11,15) branch as the original pair; then 8!=20-4."),
     no("$(15,11)$", "Reverse the numerator and denominator of the branch (11,15) when reporting the original representation; 15!=11-4."),
     yes("$(11,15)$", "11=15-4 and 8/20=11/15-1/3=2/5.")],
    losses=[LOSS, COMPONENT_LOSS])

STORY_REASON = "One complete physical result retains the distance/work-rate equation, units and all admissible roots; unrelated stories are independent."

add(881, "a", "single",
    "A cyclist covers 67 km in 4 h. During the last 27 km the speed is 2 km/h greater than during the first part. How long does the last part take?",
    "Model two consecutive travel times and report the time of the requested segment.",
    "First speed v>0 satisfies 40/v+27/(v+2)=4; (v-16)(4v+5)=0 leaves v=16. Final speed 18, time 27/18=3/2 h.", STORY_REASON,
    [no("$\\frac{27}{16}\\,\\mathrm h$", "Solve first speed 16 correctly but use it, rather than final speed 18, in time=27/speed."),
     yes("$\\frac32\\,\\mathrm h$", "The positive speed branch gives final speed 18 km/h and final time 27/18=1.5 h."),
     no("$\\frac{108}{67}\\,\\mathrm h$", "Replace both segment speeds with overall average speed 67/4, then compute 27/(67/4); average speed need not equal the last speed.")])

add(881, "b", "multiple",
    "A cyclist goes from a city to a village along a 24 km road and returns along a 30 km road. The return speed is 2 km/h greater, but the return takes 6 min longer. Select every possible pair of speeds (outbound, return), in km/h.",
    "Preserve both positive roots of the time-difference model.",
    "30/(v+2)-24/v=1/10, v>0, gives (v-10)(v-48)=0. Speed pairs (10,12),(48,50) both work: times (12/5,5/2),(1/2,3/5) h.",
    "A native multiple selection of full journeys preserves both physical solutions without imposing an unstated slow-travel restriction.",
    [yes("$(48,50)$", "24/48=1/2 h and 30/50=3/5 h; difference is 1/10 h and speed increase is 2."),
     no("$(12,10)$", "Reverse the labels of the admissible (10,12) pair; this changes a 2 km/h increase into a decrease."),
     yes("$(10,12)$", "24/10=12/5 h and 30/12=5/2 h; difference is 1/10 h and speed increase is 2."),
     no("$(10,48)$", "Treat the two roots of the outbound-speed equation as the two speeds in a single journey, rather than as two separate outbound possibilities; the increase becomes 38.")])

add(882, "a", "single",
    "Increasing a train's speed by 10 km/h reduces the travel time for 720 km by 1 h. What was its original speed?",
    "Use a difference of reciprocal travel times and reject a negative speed.",
    "720/v-720/(v+10)=1, v>0, gives (v-80)(v+90)=0; original speed 80 km/h.", STORY_REASON,
    [no("$90\\,\\mathrm{km/h}$", "Solve original speed 80 and report the increased speed 80+10 instead."),
     no("$\\sqrt{7200}\\,\\mathrm{km/h}$", "From v(v+10)=7200 omit the +10 term and replace v(v+10) by v^2."),
     yes("$80\\,\\mathrm{km/h}$", "720/80=9 h and 720/90=8 h, a one-hour reduction.")])

add(882, "b", "single",
    "Two cyclists start together on a 33 km journey. One rides 4 km/h faster and arrives 48 min earlier. Which pair gives their travel times (slower, faster)?",
    "Convert the time difference, determine speeds, and report both correctly labeled times.",
    "33/v-33/(v+4)=4/5 gives v(v+4)=165, v=11 (not -15). Times are 3 and 11/5 h.", STORY_REASON,
    [yes("$(3\\,\\mathrm h,\\ 2\\,\\mathrm h\\ 12\\,\\mathrm{min})$", "Speeds 11 and 15 give times 33/11=3 h and 33/15=11/5 h=2 h 12 min."),
     no("$(3\\,\\mathrm h,\\ 2\\,\\mathrm h\\ 20\\,\\mathrm{min})$", "Read the decimal 2.2 hours as 2 hours 20 minutes rather than converting 0.2*60=12 minutes."),
     no("$(2\\,\\mathrm h\\ 12\\,\\mathrm{min},\\ 3\\,\\mathrm h)$", "Compute both times correctly but reverse their labels; the slower cyclist must take longer.")])

add(883, "a", "single",
    "A boat travels 9 km on a lake and then 20 km downstream in a total of 1 h. The river current is 3 km/h. What is the boat's speed on the lake?",
    "Add lake and downstream times using still-water speed and current.",
    "9/v+20/(v+3)=1 gives (v-27)(v+1)=0; lake speed v=27 km/h.", STORY_REASON,
    [no("$29\\,\\mathrm{km/h}$", "Ignore the current and divide the total 29 km by the one-hour duration, treating both legs as having the same speed."),
     yes("$27\\,\\mathrm{km/h}$", "9/27+20/30=1/3+2/3=1 h; lake speed is 27."),
     no("$30\\,\\mathrm{km/h}$", "Solve lake speed 27 but report the downstream speed 27+3 instead.")])

add(883, "b", "multiple",
    "A boat travels 6 km upstream and then 15 km on a lake. The lake part takes 1 h longer than the upstream part. The current is 2 km/h. Select every possible lake speed.",
    "Retain two physical still-water speeds instead of discarding a positive quadratic root.",
    "For v>2, 15/v-6/(v-2)=1 gives (v-5)(v-6)=0. Both 5 and 6 km/h work, with lake/upstream times (3,2) and (5/2,3/2) h.",
    "A native multiple selection tests the full admissible speed set, not separate time boxes.",
    [no("$3\\,\\mathrm{km/h}$", "Find the valid lake branch 5 and subtract the current to report its upstream speed 3 as the lake speed."),
     yes("$6\\,\\mathrm{km/h}$", "15/6-6/4=5/2-3/2=1 h, and 6>2."),
     no("$11\\,\\mathrm{km/h}$", "From v^2-11v+30=0 use the sum of the roots 11 as if it were one root."),
     yes("$5\\,\\mathrm{km/h}$", "15/5-6/3=3-2=1 h, and 5>2.")])

add(884, "a", "single",
    "A motorboat travels 45 km downstream and then 22 km upstream in 5 h. The current is 2 km/h. What is its upstream speed?",
    "Relate upstream and downstream speeds by twice the current and report the requested speed.",
    "Upstream u>0 and downstream u+4 satisfy 45/(u+4)+22/u=5. (u-11)(5u+8)=0 gives u=11 km/h.", STORY_REASON,
    [yes("$11\\,\\mathrm{km/h}$", "45/15+22/11=3+2=5 h; the upstream speed is 11."),
     no("$13\\,\\mathrm{km/h}$", "Solve upstream speed 11 and add current 2 to report the still-water speed instead."),
     no("$15\\,\\mathrm{km/h}$", "Solve upstream speed 11 and add twice the current to report the downstream speed instead.")])

add(884, "b", "single",
    "A speedboat has still-water speed 20 km/h. It travels 36 km upstream and 22 km downstream in 3 h. What is the current speed?",
    "Treat the current as a nonnegative magnitude below still-water speed.",
    "36/(20-c)+22/(20+c)=3, 0<=c<20, gives (c-2)(3c+20)=0; current 2 km/h.", STORY_REASON,
    [no("$\\frac{20}{3}\\,\\mathrm{km/h}$", "Take the magnitude of inadmissible root -20/3 instead of rejecting it; absolute values of quadratic roots do not necessarily solve the model."),
     no("$18\\,\\mathrm{km/h}$", "Solve current c=2 correctly but report the upstream speed 20-2 instead."),
     yes("$2\\,\\mathrm{km/h}$", "36/18+22/22=2+1=3 h, with nonnegative current below 20.")])

add(885, "a", "single",
    "A first harvester works alone for 4 h. A second joins it, and both work another 8 h to finish the field. Working alone, the first would need 8 h more than the second. Which pair gives their solo completion times (first, second)?",
    "Combine unequal work durations using reciprocal solo times and retain the machine identities.",
    "If second solo time is t>0, first is t+8; 12/(t+8)+8/t=1 gives (t-16)(t+4)=0. First 24 h, second 16 h.", STORY_REASON,
    [no("$(16\\,\\mathrm h,24\\,\\mathrm h)$", "Find the valid solo times but reverse the machine labels, making the first faster despite the stated longer solo time."),
     yes("$(24\\,\\mathrm h,16\\,\\mathrm h)$", "First contributes 12/24=1/2 field and second 8/16=1/2; first solo time exceeds second by 8 h."),
     no("$(12\\,\\mathrm h,4\\,\\mathrm h)$", "Count only the initial 4 h for the first machine, omitting its additional joint 8 h: 4/(t+8)+8/t=1 yields t=4, first 12.")])

add(885, "b", "single",
    "Two typists work together for 2 h. The first then leaves, and the second finishes in another 1 h 20 min. Alone, the second would need 1 h 10 min longer than the first. Which pair gives solo times (first, second)?",
    "Convert mixed minutes to fractions of hours and add each worker's actual contribution.",
    "Let first t>0, second t+7/6. Equation 2/t+(10/3)/(t+7/6)=1 gives 6t^2-25t-14=0, positive t=14/3; second 35/6.", STORY_REASON,
    [yes("$(4\\,\\mathrm h\\ 40\\,\\mathrm{min},\\ 5\\,\\mathrm h\\ 50\\,\\mathrm{min})$", "First works 2/(14/3)=3/7 job; second (10/3)/(35/6)=4/7; solo-time difference is 7/6 h."),
     no("$(5\\,\\mathrm h\\ 50\\,\\mathrm{min},\\ 4\\,\\mathrm h\\ 40\\,\\mathrm{min})$", "Solve both times correctly but reverse the typist labels."),
     no("$(\\frac{13+\\sqrt{505}}{12}\\,\\mathrm h,\\ \\frac{27+\\sqrt{505}}{12}\\,\\mathrm h)$", "Omit the second typist's initial joint 2 h: 2/t+(4/3)/(t+7/6)=1 gives 6t^2-13t-14=0, positive t=(13+sqrt(505))/12.")])

add(886, "a", "single",
    "Which common-denominator calculation correctly proves $\\frac1{11+2\\sqrt{30}}+\\frac1{11-2\\sqrt{30}}=22$?",
    "Recognize a valid conjugate-denominator proof, not merely the given final number.",
    "The nonzero denominator product is 11^2-(2sqrt(30))^2=1; common numerator is 22, so the sum is 22.", 
    "One complete proof transformation tests the decisive conjugate identity; recognizing the given number alone is not the response.",
    [no("$\\frac{1+1}{(11+2\\sqrt{30})+(11-2\\sqrt{30})}=\\frac1{11}$", "Add numerators and denominators separately, using invalid 1/a+1/b=2/(a+b)."),
     no("$\\frac{22}{121+120}=\\frac{22}{241}$", "Form the correct common numerator but multiply conjugates as a^2+b^2 rather than a^2-b^2."),
     yes("$\\frac{(11-2\\sqrt{30})+(11+2\\sqrt{30})}{121-120}=\\frac{22}{1}=22$", "Use 1/a+1/b=(a+b)/(ab), with conjugate product 1.")],
    losses=[PROOF_LOSS])

add(886, "b", "single",
    "Which common-denominator calculation correctly proves $\\frac{\\sqrt5+2}{\\sqrt5-2}+\\frac{\\sqrt5-2}{\\sqrt5+2}=18$?",
    "Recognize the squared-numerator sum and nonzero conjugate product.",
    "The denominator product is 5-4=1. Numerator is (sqrt(5)+2)^2+(sqrt(5)-2)^2=18, so the sum is 18.",
    "A complete algebraic proof step preserves the squared numerator distinction rather than displaying a copied target value.",
    [yes("$\\frac{(\\sqrt5+2)^2+(\\sqrt5-2)^2}{5-4}=\\frac{18}{1}=18$", "Common-denominator addition yields sum of squares 2(5+4)=18 over conjugate product 1."),
     no("$\\frac{(\\sqrt5+2)+(\\sqrt5-2)}{5-4}=2\\sqrt5$", "Multiply the denominators but fail to multiply either numerator by the missing conjugate, replacing squares with first powers."),
     no("$\\frac{(\\sqrt5+2)^2+(\\sqrt5-2)^2}{5+4}=2$", "Use the correct numerator 18 but replace the conjugate denominator product 5-4 by 5+4=9.")],
    losses=[PROOF_LOSS])

add(887, "a", "single",
    "Let $x=5+2\\sqrt6$ and $y=5-2\\sqrt6$. What is $\\frac{xy}{x+y}$?",
    "Use conjugate sum and product to evaluate the entire expression.",
    "xy=25-24=1, x+y=10, so value 1/10.",
    "One expression value combines both symmetric relations; it is independent of the different expression in the other subpart.",
    [no("$\\frac{49}{10}$", "Multiply conjugates as 25+24=49 rather than 25-24=1, then divide by the correct sum 10."),
     yes("$\\frac1{10}$", "Conjugate product 1 divided by sum 10 gives 1/10."),
     no("$10$", "Compute xy=1 and x+y=10 correctly but evaluate the reciprocal (x+y)/(xy).")])

add(887, "b", "single",
    "Let $x=\\sqrt{11}+\\sqrt3$ and $y=\\sqrt{11}-\\sqrt3$. What is $\\frac{x^2+y^2}{xy}$?",
    "Combine a sum of squares with a conjugate product.",
    "xy=8 and x^2+y^2=28, hence 28/8=7/2.",
    "The complete symmetric expression is distinct from the preceding reciprocal product/sum expression.",
    [no("$\\frac{11}{2}$", "Replace x^2+y^2 by (x+y)^2=44, omitting subtraction of 2xy=16; divide 44 by 8."),
     no("$2$", "Use conjugate product 11+3=14 instead of 11-3=8, while keeping numerator 28."),
     yes("$\\frac72$", "The irrational cross terms cancel in the squares, giving numerator 28; conjugate product is 8.")])

add(888, "a", "single",
    "If $x=2y+3$ and $y=\\frac12t-5$, which expression gives $x$ in terms of $t$?",
    "Compose two affine expressions and distribute the multiplier.",
    "x=2(t/2-5)+3=t-7.",
    "The complete composed expression preserves the substitution; it is independent of the quadratic composition in the next task.",
    [yes("$x=t-7$", "Distribute 2 to both t/2 and -5, then add 3: t-10+3."),
     no("$x=t-2$", "Distribute 2 to t/2 but not to -5, obtaining t-5+3."),
     no("$x=t-13$", "Distribute correctly to obtain t-10, then treat the outer +3 as -3.")])

add(888, "b", "single",
    "If $x=(y-1)(y+1)$ and $y=t\\sqrt2$, which expression gives $x$ in terms of $t$?",
    "Compose the difference of squares with an irrational scaling.",
    "x=y^2-1=(t sqrt(2))^2-1=2t^2-1.",
    "One complete polynomial captures both the conjugate product and squaring the coefficient.",
    [no("$x=\\sqrt2\\,t^2-1$", "Square t but leave its sqrt(2) coefficient unsquared."),
     yes("$x=2t^2-1$", "The product is y^2-1 and y^2=2t^2."),
     no("$x=2t^2+1$", "Use (y-1)(y+1)=y^2+1 rather than y^2-1.")])


def partition(eq, above, below):
    return (
        "| Condition | Complete solution set |\n| --- | --- |\n"
        f"| $f(x)=3$ | ${eq}$ |\n"
        f"| $f(x)>3$ | ${above}$ |\n"
        f"| $f(x)<3$ | ${below}$ |"
    )


add(889, "", "single",
    "Use the displayed graph of $f$, whose domain is $[-1.5,6]$. Which table correctly gives all three solution sets?",
    "Read the equation and two strict inequalities from the actual finite graph.",
    "Actual curve crosses y=3 at x=0,4. Equality set {0,4}; above set [-1.5,0) union (4,6]; below set (0,4). No formula or extension of the curve is assumed.",
    "One coherent partition of the given domain preserves all three source tasks, including strict crossings and closed domain endpoints.",
    [no(partition("\\{0,4\\}", "(-\\infty,0)\\cup(4,\\infty)", "(0,4)"),
        "Read crossings correctly but extrapolate the finite curve beyond the stated domain, using unbounded outer intervals."),
     no(partition("\\{0,4\\}", "[-1.5,0]\\cup[4,6]", "(0,4)"),
        "Treat the strict comparison >3 as >=3, including both equality crossings in the above set."),
     no(partition("\\{0,4\\}", "(0,4)", "[-1.5,0)\\cup(4,6]"),
        "Read the middle valley as satisfying >3 and the outside high parts as <3, reversing the inequalities."),
     yes(partition("\\{0,4\\}", "[-1.5,0)\\cup(4,6]", "(0,4)"),
         "The graph is below the level between its two crossings and above outside, with the given endpoints included where their values exceed 3.")],
    losses=["Recognition of the complete graph-derived partition does not demonstrate independently recording the three sets."],
    figures=("fig-60",))


def graph_table(rows, verdict):
    return (
        "The graph consists only of the isolated points listed by this table.\n\n"
        "| Output coordinate | Input coordinates |\n| --- | --- |\n"
        + "\n".join(f"| ${i}$ | {row} |" for i, row in enumerate(rows))
        + f"\n\nThis relation **{verdict}** a function."
    )


REM6 = ["$0,6,12,18$", "$1,7,13,19$", "$2,8,14,20$", "$3,9,15$", "$4,10,16$", "$5,11,17$"]
QUOT6 = ["$0,1,2,3,4,5$", "$6,7,8,9,10,11$", "$12,13,14,15,16,17$", "$18,19,20$", "none", "none"]
REM5 = ["$0,5,10,15,20$", "$1,6,11,16$", "$2,7,12,17$", "$3,8,13,18$", "$4,9,14,19$", "none"]

add(890, "", "single",
    "For this question, natural numbers mean $\\{0,1,2,\\ldots\\}$. Each natural number not exceeding 20 is paired with its remainder on division by 6. Which table and classification describe the entire graph?",
    "Determine the complete discrete remainder correspondence and whether it is a function, with an explicit zero convention.",
    "With zero included, rows r=0..5 have inputs {0,6,12,18},{1,7,13,19},{2,8,14,20},{3,9,15},{4,10,16},{5,11,17}. These are 21 isolated points. Every input has one unique remainder, so it is a function. Excluding zero removes exactly (0,0), yielding 20 points without changing functionhood; the source does not choose between conventions.",
    "The entire six-row graph inventory plus function classification retains all inputs and residues; it is not a per-cell arithmetic exercise.",
    [no(graph_table(QUOT6, "is"), "Use the quotient floor(n/6) as output instead of the remainder; groups become 0..5,6..11,12..17,18..20."),
     yes(graph_table(REM6, "is"), "Write n=6q+r, 0<=r<6, for all n=0..20; each input appears once, and repeated output coordinates are allowed in a function."),
     no(graph_table(REM5, "is"), "Use divisor 5 instead of 6, cycling remainders every five inputs and leaving output 5 unused."),
     no(graph_table(REM6, "is not"), "Compute every remainder correctly but require distinct inputs to have distinct outputs; confuse injectivity with being a function.")],
    losses=[N_LOSS, DRAW_LOSS])

add(891, "a", "single",
    "In panel a, $A$ has coordinate $x$ and $B$ has coordinate $x^2$. The spacing is schematic. Which left-to-right order places all four additional coordinates $1,-x,1/x,\\sqrt{x}$ correctly?",
    "Infer x>1 from the source order and locate all four requested coordinates without numerical guesses.",
    "Panel a gives 0<x<x^2, hence x>1. Therefore -x<0<1/x<1<sqrt(x)<x<x^2. This locates every requested point relative to A, B and zero, but provides no numerical coordinate values.",
    "A complete coordinate order is one coherent construction-recognition unit; separately clicking four positions would obscure their shared inequalities.",
    [no("$-x<0<\\sqrt{x}<1<1/x<x<x^2$",
        "Determine the two intermediate positions correctly but swap the labels sqrt(x) and 1/x when reporting them."),
     no("$-x<0<x^2<x<\\sqrt{x}<1<1/x$",
        "Apply the 0<x<1 case despite the displayed order 0<A<B; this reverses the square and root relationships."),
     yes("$-x<0<1/x<1<\\sqrt{x}<x<x^2$",
         "Since x>1, reciprocal lies in (0,1), square root in (1,x), and -x is negative; combine with source x<x^2."),
     no("$0<1/x<1<\\sqrt{x}<-x=x<x^2$",
        "Keep the positive power/reciprocal orderings but replace -x by its magnitude x, placing it at A instead of left of zero.")],
    losses=[DRAW_LOSS], figures=("fig-61",))

add(891, "b", "single",
    "In panel b, $A$ has coordinate $x$ and $B$ has coordinate $x^2$. The spacing is schematic. Which left-to-right order places all four additional coordinates $1,-x,1/x,\\sqrt{x}$ correctly?",
    "Infer 0<x<1 from the source order and locate all four additional coordinates.",
    "Panel b gives 0<x^2<x, hence 0<x<1. Therefore -x<0<x^2<x<sqrt(x)<1<1/x. All four requested points are located relationally; the image supplies no numerical unit or x.",
    "The whole order tests the linked fractional-power and reciprocal behavior on (0,1), without arbitrary numeric labels.",
    [yes("$-x<0<x^2<x<\\sqrt{x}<1<1/x$",
         "For 0<x<1, squaring decreases x, square root increases it but remains below 1, reciprocal exceeds 1, and -x is negative."),
     no("$-x<0<1/x<1<\\sqrt{x}<x<x^2$",
        "Apply the x>1 case despite displayed 0<B<A, reversing the square, root and reciprocal relationships."),
     no("$-x<0<\\sqrt{x}=x^2<x<1<1/x$",
        "Interpret the square-root operation as squaring, so place sqrt(x) at B(x^2) rather than between A and 1."),
     no("$-x<0<x^2<x=1/x<\\sqrt{x}<1$",
        "Treat forming a reciprocal as leaving the input unchanged, copying x as 1/x and placing it at A instead of right of 1.")],
    losses=[DRAW_LOSS], figures=("fig-61",))


def digest(value):
    raw = json.dumps(value, sort_keys=True, ensure_ascii=True, separators=(",", ":"))
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def write_new(path, value):
    if ".work." not in path.name:
        raise ValueError("Only writable work artifacts may be serialized here")
    with path.open("w", encoding="utf-8") as stream:
        json.dump(value, stream, ensure_ascii=True, indent=2)
        stream.write("\n")


if __name__ == "__main__":
    seed = json.loads((ROOT / "seed.work.json").read_text(encoding="utf-8"))
    coverage = []
    for exercise in seed["exercises"]:
        number = exercise["number"]
        selected = [q for q in QUESTIONS if number in q["source_numbers"]]
        losses = list(dict.fromkeys(loss for q in selected for loss in q["intent"]["limitations"]))
        coverage.append({
            "source_number": number,
            "question_ids": [q["id"] for q in selected],
            "omitted_tasks": losses,
            "reason": (
                "All mathematical result tasks in this source are represented by the cited complete response units. "
                "The listed production/convention losses are disclosed, not claimed recovered by recognition."
            ),
        })
    draft = {
        "schema": "s10y-choice-draft-v1",
        "seed_sha256": digest(seed),
        "new_figures": [],
        "questions": QUESTIONS,
        "coverage": coverage,
    }
    write_new(ROOT / "draft.work.json", draft)
    write_new(ROOT / "authored-counts.work.json", {
        "source_originals": len(seed["exercises"]),
        "source_lettered_subparts": 44,
        "result_tasks": 57,
        "result_task_count_basis": "44 lettered tasks + 889 equality/two inequalities (3) + 890 graph/function (2) + 891 two panels/four coordinates (8)",
        "questions": len(QUESTIONS),
        "single": sum(q["view"]["mode"] == "single" for q in QUESTIONS),
        "multiple": sum(q["view"]["mode"] == "multiple" for q in QUESTIONS),
        "options": sum(len(q["view"]["options"]) for q in QUESTIONS),
        "correct_options": sum(len(q["key"]["correct"]) for q in QUESTIONS),
        "source_figures_used": ["fig-60", "fig-61"],
        "excluded_example_figure": "fig-59",
        "new_figures": 0,
        "source_mathematical_tasks_omitted_entirely": [],
        "qualified_sources": ["880a", "880b", "890"],
        "seed_canonical_sha256": digest(seed),
        "draft_canonical_sha256": digest(draft),
        "pre_options_solutions_sha256": hashlib.sha256((ROOT / "source-solutions.pre-options.md").read_bytes()).hexdigest(),
        "option_ordering": "Per-question SHA-256 ordering of question ID plus visible option text, independent of correctness; no position quota, fixed rotation or key template.",
        "key_positions": {q["id"]: q["key"]["correct"] for q in QUESTIONS},
        "semantic_review": "pending independent parent review; no semantic self-review performed",
    })
    print(f"authored {len(QUESTIONS)} questions; draft_sha256={digest(draft)}")
