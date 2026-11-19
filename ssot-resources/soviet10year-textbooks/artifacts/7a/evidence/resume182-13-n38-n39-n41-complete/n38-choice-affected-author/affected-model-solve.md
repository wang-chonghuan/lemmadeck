# Affected Supplemental Model: Before Repaired Options

This is author reasoning for the new supplemental uncertainty datum only.
It is not an independent review, a source re-solve, or a semantic approval.
The six original 804 inputs and their report question are unchanged.

New datum: a positive unknown x rounds half-up to 6.42 at the hundredth place.
6.42 is distinct from all six original 804 inputs. It is new authored context,
not an original exercise datum or a captured historical table cell.

The lower tie 6.415 rounds to 6.42; the upper tie 6.425 rounds to 6.43.
Thus 6.415 <= x < 6.425. Squaring is strictly increasing on this positive
interval, so 41.152225 <= x^2 < 41.280625.

Squaring the supplied approximation gives 6.42^2 = 41.2164.
A single final positive half-up rounding to three significant digits reports
41.2. The last retained place is 0.1, whose half-unit is 0.05.
The error at the lower endpoint is 41.2 - 41.152225 = 0.047775.
The upper error supremum is 41.280625 - 41.2 = 0.080625, not attained.
Therefore this input-rounding model does not guarantee error at most 0.05.

An admissible witness is x = 6.424, which rounds to 6.42.
Its exact square is 41.267776, giving error 0.067776 > 0.05.
Even x = 6.42 has square 41.2164, not the reported estimate 41.2.

The endpoint and witness squares were calculated with integer numerators:
6415^2 = 41152225; 6425^2 = 41280625; 6424^2 = 41267776,
each divided by 1000000. No options or independent-review calculations
were used to derive this supplemental model.

Separate correction-scope repair: row 3.1's correction integer 25 is in
0.001 units and applies only to displayed main values below 10, columns
0, 1, 2 and 4. It must not be applied to column 7's 10.05.
Applying 25 in 0.01 units there would give 10.30, not 10.07.
Keep the existing main grid and the four intended original-input lookups;
do not invent a correction cell for the above-10 portion of the row.
