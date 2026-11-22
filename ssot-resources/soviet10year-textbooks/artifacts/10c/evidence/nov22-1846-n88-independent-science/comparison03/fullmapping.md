# N88 Full Substantive Mapping

This mapping compares the two first immutable freeze reports with the bound modern lesson, all 34 prepared task texts, and all 34 author display answers. The whole-file SHA-256 bindings in manifest.json identify the exact texts; indices below are zero based. Results are comparison conclusions, not freshly solved preferred answers. No candidate edit is recommended.

## Conventions And Science

Frozen conventions retained: angles in radians unless the prompt explicitly uses degrees; cot(t)=cos(t)/sin(t) with sin(t) nonzero; arccot is the inverse of cot restricted to (0,pi), not a reciprocal function or the inverse of the whole periodic graph; arctan takes values in (-pi/2,pi/2). Integer parameters below range over all Z. Domain exclusions are not endpoints that can be assigned limiting values.

| Frozen science item | Candidate location | Substantive comparison |
| --- | --- | --- |
| Cotangent domain | prose[0], [2], [25], [28], [32] | R excluding n*pi; branch endpoints and their derivatives are undefined. Correct domain membership supplied only by the registered [28] erratum. |
| Range and unboundedness | prose[8], [26] | Range is all R, with no finite upper or lower bound. |
| Derivative | prose[1]-[2] | -1/sin(t)^2 on the legal domain; negative there. No derivative at the poles. |
| Branch limits | prose[0]-[2], [8], [26] | Compatible with +infinity as t approaches n*pi from the right and -infinity as t approaches (n+1)*pi from the left. Limits are not explicitly expanded in prose and are not asserted as finite endpoint values. |
| Decrease | prose[2], [33] | Strict decrease within each (n*pi,(n+1)*pi); explicitly same branch, not global-domain monotonicity. |
| Period and parity | prose[5], [27]-[28] | Period pi, least positive period pi, oddness on the symmetric legal domain. |
| Zeros and signs | prose[29]-[31] | Zeros pi/2+n*pi; positive on (n*pi,pi/2+n*pi); negative on (-pi/2+n*pi,n*pi). Open sign intervals exclude both zeros and poles. |
| Continuity/differentiability | prose[32] | Both hold at every legal domain point, not across excluded poles. |
| Restricted inverse | prose[8] | Domain R, range (0,pi); reflection applies only to the restricted branch. No whole-periodic inverse is claimed. |
| Inverse derivative/limits | prose[8], tasks/answers[27] | Frozen derivative -1/(1+x^2) is proved in task 231. The prose's open range/decrease is consistent with limits 0 at +infinity and pi at -infinity; neither endpoint is a value. |
| Exact input versus table value | prose[13]-[15] | Exact arccot(3.078) rounds to 0.3141; 18 degrees rounds to 0.3142 radians. Candidate expressly distinguishes the two approximations. |
| Complete cotangent solutions | prose[16]-[23] | x=arccot(a)+n*pi for real a; one principal solution per branch. Closed-period discussion excludes poles and duplicate endpoint families. |

## All Modern Prose Objects

| Index | Textual subject | Comparison to first science freeze |
| --- | --- | --- |
| 0 | Period and selected interval | Open (0,pi) excludes both endpoints. Studying one branch and extending by period is sound; no pole value is introduced. |
| 1 | Cotangent derivative | Exact derivative -1/sin(x)^2 matches. Radian calculus convention retained. |
| 2 | Legal inputs, decrease, zero | Poles n*pi excluded for function and derivative; negative derivative implies decrease on the stated branch; cot(pi/2)=0. No global disconnected-domain decrease claim. |
| 3 | Empty figure-associated object | No scientific prose assertion. Object retained; no image inspected or approved. |
| 4 | Figure 38 caption text | Caption preserved as text only; no figure-content evidence claimed. |
| 5 | Periodic translation | Shifts by (pi*n,0) produce branches (pi*n,pi*(n+1)); period pi agrees with freeze. |
| 6 | Empty figure-associated object | No scientific assertion or optical approval. |
| 7 | Figure 39 caption text | Caption retained, not figure approval. |
| 8 | Range, inverse, reflection | Each real value occurs exactly once on (0,pi). Inverse domain R/range (0,pi) and decrease are correct. Reflection is expressly of the restricted branch only. |
| 9 | Empty figure-associated object | No scientific assertion or optical approval. |
| 10 | Figure 40 caption text | Caption retained, not figure approval. |
| 11 | Inverse-value introduction | Instruction retained; no new mathematical quantity or branch convention. |
| 12 | Three inverse examples | arccot(sqrt(3))=pi/6; arccot(sqrt(3)/3)=pi/3; arccot(-1)=3*pi/4. Each angle lies in the selected open range and has the stated cotangent. |
| 13 | Tables and conversion | Degree cotangent table followed by degree-to-radian conversion is a valid approximation method, not an exact-input guarantee. |
| 14 | Conversion recipe | 0<angle<180 degrees selects the right branch. Same angle in radians preserves cotangent, hence the stated inverse value. |
| 15 | Example arccot(3.078) | Registered final numeric correction to 0.3141 matches freeze. Input 3.078 and 18-degree table result 0.3142 retained; approximation explicitly qualified. No desired-result glyph inference. |
| 16 | Equation cot(x)=a | Original equation and label retained. General discussion uses real a. |
| 17 | All equation solutions | x=arccot(a)+pi*n, n integral, complete. Closed interval language is qualified by pole exclusion and duplicate endpoint residue classes. |
| 18 | Empty figure-associated object | No scientific assertion or optical approval. |
| 19 | Figure 41 caption text | Caption retained, not figure approval. |
| 20 | Equation example cot(x)=1 | Quantity and task unchanged. |
| 21 | Solution of preceding example | pi/4+pi*k, k integral. Correct full family, not only principal angle. |
| 22 | Equation example cot(x)=sqrt(3) | Quantity and task unchanged. |
| 23 | Solution of preceding example | pi/6+pi*k, k integral. Correct full family. |
| 24 | Property-list introduction | Preserves subject; no new scientific assertion. |
| 25 | Domain | All real numbers except n*pi. Excluded inputs do not possess cotangent values. |
| 26 | Range and bounds | All R and unbounded both ways. Informal explanation does not assign endpoint values. |
| 27 | Oddness | cot(-x)=-cot(x) only for legal x. Split inline spans on the equality are preserved; mathematical relation is unchanged. |
| 28 | Least period | pi and cot(x+pi)=cot(x) for x in D(cot). Only the registered missing-D mathematical correction changes a source span. Original encoding is UNKNOWN. |
| 29 | Zeros | x=pi/2+pi*n, n integral; these are legal points. |
| 30 | Positive intervals | (pi*n,pi/2+pi*n), open at pole and zero. |
| 31 | Negative intervals | (-pi/2+pi*n,pi*n), open at zero and pole; same negative halves as frozen branches. |
| 32 | Regularity on the domain | Continuous and differentiable at each legal x. Readable local explanation does not claim continuity at excluded poles. |
| 33 | Per-branch decrease | Decrease on every (n*pi,pi+n*pi); explicit same-interval wording prevents global-domain overstatement. |

## All Prepared Tasks And Author Answers

For every row: modernExercises.exercises[i].number and authorKeys.answers[i].exercise are the same source task number; prepared prompt equals modern task text exactly; author source is derived; no figureEvidence is claimed. Proof and drawing requests remain in the prepared prompts. The answers are compared with the original solutions freeze, not used to rewrite that freeze.

### 204-210: Proofs

| Task / index | Exact task quantity and obligation | Frozen result and inspected author reasoning | Domain/completeness and verdict |
| --- | --- | --- | --- |
| 204 / 0 | Prove cot(312 degrees)=-cot(48 degrees) | 312=360-48 degrees; cosine preserved and sine negated; divide to obtain negative cotangent. | sin(48 degrees) nonzero is stated. Complete proof, MATCH; ungraded with empty parts. |
| 205 / 1 | Prove cot(17.3*pi)=cot(0.3*pi) | Difference 17*pi; quotient proof establishes pi-periodicity on legal inputs before applying it. | 0.3*pi is not a pole, so both sides defined. Complete proof, MATCH; ungraded. |
| 206 / 2 | Prove cot(-320 degrees)=cot(40 degrees) | -320=40-360 degrees; whole-turn sine/cosine invariance. | sin(40 degrees) nonzero. Complete proof, MATCH; ungraded. |
| 207 / 3 | Prove cot(6.4*pi)=cot(-0.6*pi)=-cot(0.6*pi) | Difference 7*pi gives first equality; even cosine/odd sine gives second. | All three angles nonpoles; both links proved. MATCH; ungraded. |
| 208 / 4 | Prove cot(7 1/2*pi)=cot(pi/2)=0 | Mixed number explicitly 7+1/2, giving 15*pi/2=7*pi+pi/2. Period reduction and 0/1 yield zero. Not the product 7*(1/2)*pi. | Original task quantity retained. All involved angles legal. MATCH; ungraded. Mixed-number reading is frozen textual interpretation, not new source-glyph/codepoint approval. |
| 209 / 5 | Prove chain at 5,15,31,45 degrees | The cotangent difference is sin(beta-alpha)/(sin(alpha)*sin(beta))>0 for 0<alpha<beta<180 degrees; applies to ordered angles. | Same legal branch, positive denominators and numerator; all three inequalities supported. MATCH; ungraded. |
| 210 / 6 | Prove chain at -4,-14,-28,-45 degrees | Positive-angle decrease gives the ordered positive chain; oddness and negation reverse the inequalities. | All angles legal, all links established; no global-domain monotonicity shortcut. MATCH; ungraded. |

### 211-214: Unit-Circle Drawing Sets

P_t=(u,v)=(cos(t),sin(t)), u^2+v^2=1, and v nonzero throughout. Cotangent poles t=k*pi correspond to (1,0) and (-1,0), always excluded. These are complete mathematical construction specifications, NOT evidence that an answer diagram or drawing-capable runtime exists.

| Task / index | Frozen complete set and exact coordinates | Inclusion/exclusion and author comparison |
| --- | --- | --- |
| 211 / 7 | 0<=cot(t)<=1. Angles [pi/4+k*pi,pi/2+k*pi]. Counterclockwise closed arc from (sqrt(2)/2,sqrt(2)/2) to (0,1), and its antipodal closed arc from (-sqrt(2)/2,-sqrt(2)/2) to (0,-1). | All four endpoints included and marked solid; all arc points included; all other circle points excluded; both poles explicitly excluded. Full MATCH. Drawing request retained; ungraded, parts empty, figureEvidence empty. |
| 212 / 8 | -2<=cot(t)<=2. Let a=arccot(2)=arctan(1/2) in (0,pi/2). Angles [a+k*pi,pi-a+k*pi]. Upper closed arc from (2/sqrt(5),1/sqrt(5)) via (0,1) to (-2/sqrt(5),1/sqrt(5)); lower antipodal closed arc from (-2/sqrt(5),-1/sqrt(5)) via (0,-1) to (2/sqrt(5),-1/sqrt(5)). | Four boundary points included/solid; both whole specified arcs included; all other circle points and poles excluded. The equivalent absolute-coordinate inequality is correct for either sign of v. Full MATCH; drawing hold remains. |
| 213 / 9 | cot(t)=1.5=3/2. Exactly (3/sqrt(13),2/sqrt(13)) and (-3/sqrt(13),-2/sqrt(13)); angles arccot(3/2)+k*pi=arctan(2/3)+k*pi. | Both points included/solid. No arc or whole auxiliary line is part of the solution. Nonzero vertical coordinates and pole exclusions explicit. Full MATCH; drawing hold remains. |
| 214 / 10 | cot(t)=0. Exactly (0,1),(0,-1); angles pi/2+k*pi. | Both points included/solid. Other circle points, arcs/diameter as answers, and the two poles excluded. Full MATCH; drawing hold remains. |

### 215-221: Principal Inverse Values

All seven inputs are real, hence in the inverse domain. The returned angles are in (0,pi), with nonzero sine. Each display answer checks its cotangent; negative inputs select quadrant II, not a negative out-of-range principal angle. All are auto with one expression part and radian unit; runtime parsing is untested.

| Task / index | Original input | Frozen and author result | Exact expected LaTeX / verdict |
| --- | --- | --- | --- |
| 215 / 11 | sqrt(3) | pi/6 | `\frac{\pi}{6}`; MATCH |
| 216 / 12 | 1/sqrt(3) | pi/3 | `\frac{\pi}{3}`; MATCH |
| 217 / 13 | 1 | pi/4 | `\frac{\pi}{4}`; MATCH |
| 218 / 14 | 0 | pi/2 | `\frac{\pi}{2}`; MATCH |
| 219 / 15 | -sqrt(3) | 5*pi/6, not -pi/6 | `\frac{5\pi}{6}`; MATCH |
| 220 / 16 | -1 | 3*pi/4, not -pi/4 | `\frac{3\pi}{4}`; MATCH |
| 221 / 17 | -1/sqrt(3) | 2*pi/3, not -pi/3 | `\frac{2\pi}{3}`; MATCH |

### 222-226: Relational Tokens

Prepared instructions require replacing the star by an equality or inequality sign. Each author display answer supplies the actual relation, not only a hint. Ungraded/empty parts preserves the explicit capacity limit for relational-token edit-contract validation; no unsupported auto exact-token claim.

| Task / index | Comparison | Frozen/author sign and reasoning | Verdict |
| --- | --- | --- | --- |
| 222 / 18 | arccot(1) versus arctan(1) | =; pi/4 equals pi/4 on their principal branches. | MATCH |
| 223 / 19 | arccot(sqrt(3)) versus arctan(sqrt(3)) | <; pi/6 less than pi/3. | MATCH |
| 224 / 20 | arccot(1/sqrt(3)) versus arctan(1/sqrt(3)) | >; pi/3 greater than pi/6. | MATCH |
| 225 / 21 | arccot(0) versus arctan(0) | >; pi/2 greater than 0. | MATCH |
| 226 / 22 | arccot(2) versus arctan(2) | <; 0<arccot(2)<pi/4<arctan(2)<pi/2, using decrease/increase on their proper branches. | MATCH |

### 227-230: Sums

All are auto/expression, one part in radians, with exact expected `\frac{\pi}{2}`. Principal branches are respected; the display answers show the actual individual values.

| Task / index | Preserved input | Frozen/author evaluation | Verdict |
| --- | --- | --- | --- |
| 227 / 23 | sqrt(3) | arctan=pi/3, arccot=pi/6; sum pi/2. | MATCH |
| 228 / 24 | 1/sqrt(3) | arctan=pi/6, arccot=pi/3; sum pi/2. | MATCH |
| 229 / 25 | 1 | pi/4+pi/4=pi/2. | MATCH |
| 230 / 26 | 0 | 0+pi/2=pi/2. | MATCH |

### 231-232: Full Proofs

| Task / index | Preserved obligation | Frozen proof compared with actual author proof | Domain and verdict |
| --- | --- | --- | --- |
| 231 / 27 | Use inverse-function derivative formula, retaining reference to section 112, to prove both derivatives. | Set y=arctan(x) in (-pi/2,pi/2); dx/dy=1/cos(y)^2 nonzero, so dy/dx=cos(y)^2=1/(1+x^2). Set z=arccot(x) in (0,pi); dx/dz=-1/sin(z)^2 nonzero, so dz/dx=-sin(z)^2=-1/(1+x^2). | Angles radians, restricted branches, no inverse endpoint or pole admitted; both formulas hold for every real x. Complete MATCH; ungraded/empty parts preserves proof requirement. |
| 232 / 28 | Prove arctan(x)+arccot(x)=pi/2. | y=arctan(x), z=pi/2-y in (0,pi); cot(z)=tan(y)=x. sin(z)=cos(y)>0 ensures legality. Restricted-branch uniqueness gives z=arccot(x). | Every real x, including zero and negative inputs; not merely positive-x reciprocal identity. Complete MATCH; ungraded/empty parts. |

### 233-237: Complete Periodic Families

The prepared equations preserve the source arguments, including (1/2)x, 2x, 3x, and (1/5)x. Parentheses here explain the frozen argument grouping and are not edits to source typography. All display answers provide integer-parameter families, legality, and completeness; all five are ungraded with empty parts because a scalar-expression judge cannot certify integer-parameter sets, complete families, and domain exclusions.

| Task / index | Preserved equation | Frozen and author full solution | Excluded poles / completeness verdict |
| --- | --- | --- | --- |
| 233 / 29 | cot(x)=1 | x=pi/4+k*pi | x not m*pi. Unique principal pi/4 and pi-period extension cover every legal branch. MATCH. |
| 234 / 30 | cot(x/2)=sqrt(3) | x=pi/3+2*k*pi | x not 2*m*pi. x/2=pi/6+k*pi; multiplying entire family by 2 preserves all integer shifts. MATCH. |
| 235 / 31 | cot(2*x)=1/sqrt(3) | x=pi/6+k*pi/2 | x not m*pi/2. 2*x=pi/3+k*pi; dividing entire family by 2 gives all solutions and no poles. MATCH. |
| 236 / 32 | cot(3*x)=3.5 | x=arccot(7/2)/3+k*pi/3 = arctan(2/7)/3+k*pi/3 | x not m*pi/3. Exact 3.5=7/2 retained; principal angle in (0,pi/2), unique, with complete period extension. No rounded-angle substitution. MATCH. |
| 237 / 33 | cot(x/5)=0 | x=5*pi/2+5*k*pi | x not 5*m*pi. x/5=pi/2+k*pi; sine at these arguments is (-1)^k nonzero. Full family legal and complete. MATCH. |

## Text Bindings, Uncertainty, And Holds

All 34 ordered IDs, prepared prompts, derived-source fields, and no-figure-claim checks agree. The 11 scalar expression expected strings agree with the frozen values; the remaining 23 answers retain ungraded/empty-part classification.

Across the embedded source_text and current text of all 68 objects, ordered inline-math sequences have 127 spans on each side. Every sequence is identical except prose[15] span[3] and prose[28] span[1], whose exact changes match the two registered errata. This compares bounded single-dollar-delimited text, not LaTeX rendering, actual source glyphs, or native counts.

Underlying source page bodies were not reopened. Their claimed frontmatter-only changes and unchanged bodies are bound errata evidence, not newly measured page equality. The missing-D author/ROI rationale is historical provenance only. Original source Unicode/codepoints remain UNKNOWN, and no original glyph correction is inferred from a desired identity.

Drawing capacity for 211-214, actual diagrams/figures 38-41, optical/source approval, display, MathLive editability, relation-token editing, runtime expression equivalence, proof assessment, set/family grading, finalization, and publication remain outside this verdict. Absence of task figure references never cancels the explicit drawing instructions.
