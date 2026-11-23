# N33 affected source-bound candidate comparison

Date: 2026-11-23.
Sole working root: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188`.
Sole write scope: `.intentfold/tickets/STEMROBIN-188/tmp/n33-content-independent7/`.
The same sole independent reviewer continues after the parent collected the
blind baseline. No replacement reviewer or independent re-solve was dispatched.

`SOURCE-FIRST.md` remains untouched and locked at `0444`; the collected SHA-256
is `3b5a57a7a1795dfe0dfe32a918173a02bd33ce3dc65136e20b6164dbd7711a9c`.
The current comparison follows that already completed independent derivation.
It does not retroactively rewrite it to agree with the authors.

## Decision

- The received text is not yet mathematically approved as-is: D1 and D2 remain.
- Three exact source-bound corrections are explicitly mathematically approved
  in `approval.json`: D1, D2's quantifier distinction, and D2's dependent
  reductio inference. Together these are sufficient for this affected
  source/math/text comparison. They are approved edits, not an unresolved human
  waiting gate; none was applied or registered by this reviewer.
- All five displayed answers are substantively correct and approved unchanged.
  No answer replacement is needed.
- The source exercise text, numbering, group, and absence of exercise figures
  are preserved. O1-O4 do not generate additional mandatory rewrites or human
  gates under the source-scoped readings below.
- Image count is zero. Physical figures, rendering, native acceptance,
  registration, finalization, and publication remain outside this approval.
  There is no full-lesson/native PASS or complete answer Gate 2 claim.

## Received input bindings

The six newly authorized files are under:

`ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n33/`

| File | SHA-256 |
| --- | --- |
| `text-author7/lesson.template.json` | `72a6b9b148b27b895be11ad374769017e6e56eec4c2eff0d28a90a5200754968` |
| `text-author7/exercises.template.json` | `54fdb88f7a17e29bc871142690624bf46710c4968c28fed43f1d18c61f16e5f2` |
| `text-author7/proposed-errata.json` | `c23026dd2062b2658f6698b8f1010bf7570da02f0b7ddb27ceed4ea6cab0797e` |
| `text-author7/author-record.md` | `13cd0c086c8be432a3a7e33c8de23ec1b8811d5cb98f5e55214338ebd09a59a3` |
| `answers-author7/candidate-answer-keys.json` | `80f04b584695b7c99e63d153e7ce864cf41fffa985c6963d1ac9370178a1e1bc` |
| `answers-author7/source-solving-author-record.md` | `5c28f918eebb41986bc681547ddb867deb76863db53013e335eac65356120507` |

The candidates' embedded raw lesson and exercise snapshots exactly match the
original authorized raw objects. All 20 source entries remain ordered, all 12
`p` entries remain, and all five exercises 441-445 remain. Every `source_text`
matches its raw counterpart. Non-text entry text, IDs, and source refs remain
unchanged. These checks establish bindings/preservation only; the substantive
judgment follows below.

Only the authorized constituent saved page text was additionally consulted
to pin D1 to `p0155#7`, D2 to `p0156#8`, and the dependent sentence to
`p0157#1`. No other author, prior answer key, choice, interaction, image,
browser, package, environment, Git, database, or network source was consulted.

## Exact approved corrections

### D1: approve the author's span, narrowed to the actual block

The author's entire proposed parenthesis lies in **`p0155#7` alone**.
`p0156#1` is its paragraph continuation but contains none of this span.
The exact original occurs once in the source block and once at candidate
`/prose/0/text`:

```text
（论断 $A$ 与论断 $B$ 等价的意思是：从 $P$ 可以推出 $Q$，从 $Q$ 也可以推出 $P$．）
```

Approved exact replacement:

```text
（论断 $A$ 与论断 $B$ 等价的意思是：从 $A$ 可以推出 $B$，从 $B$ 也可以推出 $A$．）
```

This changes only the four operands in the two implications. Both directions
are retained, not just one sufficient implication. It leaves the following
`E`, all of `p0156#1`, T04's later `B`, and every geometric point `P`
unchanged. It is a mathematical notation correction to unbound labels, not a
claim that the original printer intended a particular glyph or that the
source's generic letters have been historically reconstructed.

### D2: smallest local quantifier distinction

The actual source prefix in **`p0156#8`** is:

```text
假设命题 $B$ 否定命题$A$（“假设一个相反的命题”）
```

The corresponding candidate prefix at `/prose/7/text` differs only in
formula-external whitespace:

```text
假设命题 $B$ 否定命题 $A$（“假设一个相反的命题”）
```

Approved replacement of that prefix alone:

```text
命题 $A$ 的逻辑否定是：存在一条直线 $a$ 和一个不在 $a$ 上的点 $P$，经过点 $P$ 至少可以引两条不同的直线与 $a$ 平行．这里采用普遍的相反假设 $B$
```

The existing colon and the entire following universal statement, including
`P`, `a`, `b`, `c`, and figure 211, remain. The preceding historical sentence
about attempted reductio also remains. The corrected local prose now
distinguishes an existential counterexample from the universal hyperbolic
replacement; it does not merely change the word "否定" to "相反" and leave
the quantifier error unexplained.

The reason is elementary quantified logic: negating "for every line-point
pair, at most one parallel" produces "there exists a line-point pair with at
least two distinct parallels". Universality of two parallels for every
outside pair is not the literal quantifier negation. It may be related to
the existential negation by additional geometric theorems with appropriate
background assumptions, but those theorems are neither displayed nor proved
in this text. The replacement does not assert their failure or invent their
proof; it simply prevents the invalid direct identification.

### D2 companion: remove the now-exposed invalid direct reductio conclusion

Once the above distinction is explicit, the next paragraph cannot be left
claiming that a contradiction under the universal `B` directly proves `A`.
That inference was only conditionally safe in SOURCE-FIRST when the assumption
was the actual negation. This is affected logical propagation of D2, not
broad rewriting of the historical account.

At **`p0157#1`**, candidate `/prose/10/text`, replace only:

```text
从而命题 $A$ 就得到了证明
```

with:

```text
但要直接由反证法证明命题 $A$，必须从命题 $A$ 的逻辑否定和其余公理推出矛盾；不能仅把否定上述普遍假设 $B$ 当作证明 $A$
```

The preceding attempted-contradiction account and final punctuation remain.
The logical distinction is `N + not A => contradiction`, not merely
`N + B => contradiction` together with `B => not A`. If a proof explicitly
established `N + not A => B`, the latter route could work, but the source
does not provide that intervening theorem. The correction makes no new
historical assertion about which past mathematician used which route.

All three approved changes target modern `text` only. Do not replace
`source_text`, embedded raw snapshots, original page text, or source refs.
Their target blocks need the existing `math-correction` classification and
source-bound correction handling when an authorized integrator applies them.
This report is not registration/finalizer evidence.

## All 12 modern text blocks

Pointers use the zero-based raw/candidate prose array; IDs refer to the
12-paragraph SOURCE-FIRST table.

| ID / pointer | Substantive judgment |
| --- | --- |
| T01 `/prose/0/text` | Received layout preserves the raw argument but retains D1. Approve only with the exact whole-parenthesis correction. Perpendicular-oblique `E` and its hypotheses remain unchanged and agree with independent 441. |
| T02 `/prose/5/text` | Retain. The quoted strict same-side-interior-angle postulate and intersection side are correct as a Euclidean axiom; the attribution is source-reported history. No new mathematical claim was introduced. |
| T03 `/prose/6/text` | Retain. Only layout changed. It reports unsuccessful historical proofs, not a supplied proof requiring reconstruction. The background-relative meaning of independence remains the SOURCE-FIRST qualification. |
| T04 `/prose/7/text` | Received whitespace fixes do not resolve D2. Approve with the exact existential-negation/universal-replacement prefix correction. Its `B` remains local to this non-Euclidean account, not exercise 441's `B`. |
| T05 `/prose/10/text` | Approve with the dependent concluding-clause correction, applied together with T04. Disproving an asserted stronger universal replacement is not itself the direct reductio proof of `A`. |
| T06 `/prose/11/text` | Retain source mathematics and history under a fixed hyperbolic-geometry reading. `Delta = 2d - K-hat - R-hat - L-hat` and `Delta = kS` retain every vertex, sign, and factor. Formula-external spacing introduces no scientific delta. O1-O2 are qualifications, not additional source errata. |
| T07 `/prose/12/text` | Retain the historical report. The scoped `N.I.` modern label preserves the Chinese identity and dates and does not claim original script/glyph verification. O3 is resolved by the equal-logical-standing interpretation, not by claiming equivalent theorem sets or a consistency proof. |
| T08 `/prose/13/text` | Retain as the particular historical no-parallels example, not every modern Riemannian metric. The two source fragments remain complete. No statement was added that only the parallel axiom changes, and no figure geometry was certified. O4 does not require a new source correction here. |
| T09 `/prose/16/text` | Retain the compressed source transition in conjunction with T10's explicit modeling/approximation language. It is not approval of deducing actual measured space from axioms alone. |
| T10 `/prose/17/text` | Retain. The explicit mathematical-model and approximation qualification is intact; it does not claim exact empirical truth of every ideal axiom. |
| T11 `/prose/18/text` | Retain as source-reported measurement history. Small deviation is approximate agreement at that precision, not proof of an exactly zero angle defect. Names, dates, and German setting are not researched or changed. |
| T12 `/prose/19/text` | Retain as the source's qualified physics discussion. The phrase "很可能" and model-fit scope remain. It is not certified as current physics or a universal microscopic/cosmic geometry rule. |

All five exercise prompts retain source meaning; 441 preserves the `B` then `A`
order, 442-443 remain open examples, 444 remains a sufficient criterion, and
445's "任一个" still requires both strict comparisons. No exercise-text
replacement is required.

### O1-O4: what is and is not scientifically unsafe

**O1:** The unclear "后者" antecedent in the historical narrative is awkward,
but either the established Euclidean theory or the emerging contrary theory
can be discussed as a rigorous theory. The candidate does not resolve it by
inventing new history or a false equation. Ambiguity alone is not an approved
mathematical erratum and does not create a human waiting gate.

**O2:** The intended `d` unit is recoverable from the adjacent "两直角".
The three hatted vertices are exactly those of `KLR`; reordering their
subtraction is irrelevant. Within the fixed hyperbolic geometry under
discussion, the positive constant-area-defect relation has the source's
intended scope. It is not approved as a theorem of a bare isolated assertion
`B` with no other metric/area assumptions. No sign, vertex, or constant error
was found that requires correction.

**O3:** The candidate explicitly reports what the mathematician "公开宣称";
the prior paragraph also says the resulting propositions differ from
Euclidean ones. Thus "一致的" can remain source-compressed language for equal
logical standing, not identical theorem sets. A declaration or unsuccessful
search for contradiction is not treated as a consistency proof. No additional
historical/scientific rewrite is necessary for that retained reading.

**O4:** "例如" and the repeated "这个几何" identify the particular historical
example, rather than assert a theorem of every modern Riemannian geometry.
Read in that source scope, retaining the no-parallels example and the statement
that the textbook's earlier proof does not apply is acceptable. The candidate
does not claim that its failure is due solely to dropping the parallel axiom.
Such a claim would be unsafe: the neutral double-perpendicular argument also
depends on the global incidence/order background. No image is needed to judge
this textual dependency, but no physical trace in figure 212 has been judged.

These are explicit source-scoped approval limits, not modern-physics research
or invented historical repairs. D1 and D2, by contrast, are explicit logical
relations in the lesson and cannot remain knowingly incorrect.

## All five displayed answers

Every candidate answer is `derived`, `ungraded`, and has `parts: []`. No
`bookRaw` or automatic formula key is invented. Written proofs and open examples
appropriately remain ungraded while providing substantive standard solutions.

| Exercise / pointer | Independent comparison and decision |
| --- | --- |
| 441 `/answers/0/displayAnswer` | **Approve unchanged.** The neutral double-perpendicular lemma uses 445, not angle sum. `A => B` uses uniqueness at exactly the two-parallels step and handles coincident feet. `B => A` uses neutral perpendicular existence/uniqueness, and uses hypothesized `B` to exclude every nonperpendicular candidate parallel. Points on the original line are treated. Both implications are complete; neither secretly assumes `A` in reverse. |
| 442 `/answers/1/displayAnswer` | **Approve unchanged.** Its examples differ permissibly from the baseline's open example set. Necessary corresponding/alternate-angle equality has the explicit copied-angle, neutral 444, then `A` uniqueness chain. Triangle angle sum depends on that necessity theorem. Exterior-angle equality depends on angle sum. It correctly distinguishes that equality from neutral 445's inequalities. |
| 443 `/answers/2/displayAnswer` | **Approve unchanged.** Vertical angles use supplements of a straight angle, not triangle angle sum. Comparing ordered `ABC` and `ACB` by SAS is legitimate: the equal leg pair and common included vertex angle give the reflected correspondence and equal base angles without assuming them. The third example uses the internal bisector/crossbar, SAS, and equal supplementary angles to get median and perpendicular properties. All three are genuinely neutral. |
| 444 `/answers/3/displayAnswer` | **Approve unchanged.** It converts corresponding equality to the needed alternate interior/exterior pair by vertical angles. Both possible intersection sides are handled explicitly: on one side the exterior angle at `Q` contradicts the interior at `P`; on the other side the roles reverse. It never uses necessary parallel-angle equality to prove sufficiency. |
| 445 `/answers/4/displayAnswer` | **Approve unchanged.** The `AC` midpoint construction/SAS gives the opposite angle at `C`; strict positions on both relevant line sides put the new ray inside the selected exterior angle. The `AB` midpoint construction/SAS independently gives the opposite angle at `B`; the second exterior angle is then identified by vertical equality. Both inequalities are strict, boundary rays excluded, and the other adjacent exterior angle is covered. No parallel or triangle angle-sum theorem is used. |

The changed choice of open examples in 442-443 is not a source mismatch:
those exercises do not prescribe a unique example list. No answer correction
or replacement file is needed; `approval.json` has `answerReplacements: []`.

The dependency graph remains the blind baseline's acyclic graph:

`construction/SAS/order -> strict 445 -> neutral double-perpendicular lemma and sufficient 444`

`neutral lemma + A -> 441 A=>B; neutral lemma + hypothesized B -> 441 B=>A`

`neutral 444 + A -> necessary angle equality -> triangle angle sum -> exterior-angle equality`

443 stays on neutral branches. Using the later numbered 445 as a constructed
lemma is not circular: its candidate proof is complete and independent.

## Preservation and handoff limits

The original historical glyph/codepoint/script/printing role remains UNKNOWN.
The title mark and `445**` stay source tokens; neither is a human approval
gate, a mathematical rejection, or a figure rejection. `N.I.` is only the
authorized modern label with unchanged Chinese identity and dates.

All correction originals are exact source spans; the D2 target's whitespace
variation is separately explicit in `approval.json`. Corrections are approved
for a later authorized working copy only, not for the retained source or
authors' immutable evidence. The section-break anchors do not contain any
of the three corrected spans, so these mathematical edits do not require a
new anchor proposal in this substantive review.

Only this report and `approval.json` were written. There were zero images,
no source/author/canonical/app edits, no correction registration, no finalize,
no Git/index operation, no database/network/install/package activity, no
browser/render/interaction run, and no messages to other chats.

The parent may integrate the three exactly approved text corrections and retain
the five unchanged answers. This is affected content approval, not proof that
integration, physical figures, display, native acceptance, or publication has
already succeeded.
