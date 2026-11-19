# Disclosed n13 Textual Content Review

STEMROBIN-184 B; lesson `ana9-c3-s1-n13`; modern templates remain DRAFT.
Manual textual assessment: PASS_TEXT_ONLY for the hash-bound candidates below.
This is NOT figure approval, whole-lesson approval, finalization, author-answer
approval, choice approval, publication approval, or Gate2.

## Evidence and Independence

Reuse the already frozen FIRST mathematics, retained at
`ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov19-1844-n13-inquiry/source-first/`.
The original `.tmp/stemrobin-184-resume/n13-independent/` remains untouched.
No FIRST tests, arithmetic, solutions, or proofs were rerun or regenerated.
Only retained findings, scope, expectations, and freeze metadata were read.
No FIRST evidence file was copied into this package.

Disclosed inputs are precisely the two parent modern templates and the current
canonical raw lesson/exercises. Their paths, initial bytes and SHA-256 are in
`review-contract.json`. The two modern candidates are copied byte-for-byte
inside this new review root, and those copies are frozen with the verdict.

| Input | Bytes | SHA-256 |
| --- | ---: | --- |
| modern lesson.template.json | 18706 | 20ffd453585388eac6a410e7265e8dbefd867488ed60a9450d942f4074285656 |
| modern exercises.template.json | 2192 | f3a8b77823acc53fc4b3e5873506a8a0019c66d4b08d7948f9b3b1eda4ee8314 |
| raw lesson.json | 5981 | b91ecc72ee2a87a46310801cb653431c1c343d696dafa29e7cdea120553b47ce |
| raw exercises.json | 742 | 3d777839ee902639805129dd385c04675b280f90d778a3263427964e1747f76b |

The current canonical source-page hashes match FIRST:
0055 `dde98491e1c31c0e7cc56af1e09f85f693a25c78c839821d899264b141542e77`;
0056 `1aa23cce5149a69f3b3699bd0408c53134bbe7e5b3b1a1a73bd634133eddf00f`;
0057 `5a8e2c4dafa5f1560c7f2ebc4a7f602f5c7f16f978f10ef4a8e4c9bc71be5985`.
This phase reads/hashes source JSON for source identity, not for a new solution.
Source scope remains n13 h3 on page55 through exercise115, before n14 h3 on
page57; ex114 and n14 content are excluded.

## Source Snapshots and References

Both templates embed the exact current raw object in `source.data`, with the
matching relative `source.path` and full-file `source.sha256`. There is no
literal field named `source_snapshot` in these inputs: `source.data` is the
actual snapshot being reviewed. Every per-block `source_text` equals the
corresponding current raw text. Exercise `source_text` likewise matches raw.
No stale raw snapshot or hash discrepancy was observed.

Raw `source_refs` use ONE-BASED block ordinals (`p0055#3` maps to canonical
0055 `/blocks/2`). FIRST uses ZERO-BASED JSON pointers. This conversion is
explicitly checked, not inferred as an off-by-one defect.
All 14 entries of `prose` are reviewed: 13 text entries plus one fig entry.
The two open/cont joins are correctly bound:
raw prose6 joins `p0056#2,p0056#4`, around the fig at `p0056#3`;
raw prose11 joins `p0056#8,p0057#1`, around the intervening folio.
The translator footnotes become prose with `label: note`; folios, n13 title,
exercise heading and exercise itself are not improperly merged into prose.

## Per-Block Verdict

Indices are zero-based `/prose/index`; references are one-based canonical
block ordinals. "Pass" below is textual only.

| Index | Source Refs | Verdict and Coverage |
| ---: | --- | --- |
| 0 | p0055#3 | PASS: informal repeated-digit examples retained; only line/paragraph layout changes. |
| 1 | p0055#4 | PASS: definition retained; two trailing mathematical commas moved outside; N and p explicitly positive integers, p a period length. No minimum-period claim added. |
| 2 | p0055#5 | PASS: all N/p examples, digits, parity values, abbreviation/readings and integer bar retained. Added tail-domain and integer-only sign clarifications agree with FIRST. |
| 3 | p0055#6 | PASS: theorem1 unchanged. |
| 4 | p0055#7 | PASS: translator note unchanged except layout; historical statement, not a current Chinese-usage certification. |
| 5 | p0056#1 | PASS: fractional-part reduction unchanged; integer-bar clarification in prose2 makes the convention explicit. |
| 6 | p0056#2,p0056#4 | PASS: 12/55=0.2(18), second occurrence of remainder10, and source textual 象 retained; no interpretation as division step2. Figure's numerical chain is not reviewed. |
| 7 | p0056#3 | IDENTITY ONLY: empty-text fig `tbl-p0056-01`, label 长除法, source page56/printed49. Visual and figure-math approval PENDING. |
| 8 | p0056#5 | PASS: n positive, initial remainder included in the count, deterministic next-digit/remainder transition. This supplies FIRST's precise n-step domain without altering n or the remainder list. |
| 9 | p0056#6 | PASS: zero remainder stays zero; zero-digit repeating block retained. |
| 10 | p0056#7 | PASS: all9 exclusion explicitly means another equal-value expansion, not irrationality; terminating decimals use zero-tail standard. Applies to eventual all9, not any period merely containing9. |
| 11 | p0056#8,p0057#1 | PASS: literal theorem2 retained with correct cross-page source refs, including both decimal spans and division-recovery clause. |
| 12 | p0057#2 | PASS: deferred fraction-conversion prose unchanged; no later section was consulted. |
| 13 | p0057#3 | PASS: full k fractional-digit width, includes opening23, integer k>=3, all such k with no upper bound, fixed positive gap. Both literal underbraces and exponent-k retained. |

## Parent Additions, Precisely

Five blocks have `clarification`, containing nine exact added sentences.
Their literal strings and per-block classifications are in the contract.

Definition: "N 和 p 都取正整数" closes the possible zero-natural ambiguity.
"p 是周期长度" correctly distinguishes a positive count from a digit/block;
it does not require the shortest period or incorrectly exclude a zero DIGIT.

Examples: "上述循环尾部" binds odd/even digits to the preceding n>=3 condition,
not the exceptional prefix positions1,2. The bar negates only the integer;
the fractional part remains nonnegative. Neither statement changes any
source decimal, bar placement, parity equation, N, p, or repetition count.

Remainders: positive n, the initial remainder before decimal digits, and
deterministic state transitions exactly supply FIRST's domain/counting
conditions. This is not a new mathematical correction or a bound change.

All9: the added equal-value/non-irrational statement resolves the potential
misreading of the preceding restricted rationality sentence. The literal
theorem remains unchanged. The zero-tail statement makes canonical division
representation explicit. No claim that all9 is irrational is introduced.

Inequality: the k label includes ALL fractional digits, not just the nines
and not `0.`. k>=3 is correct for the displayed prefix-plus-nines family.
"对所有这样的 k 成立" together with the lower bound imposes no upper bound.
"一个固定的正数" makes the positive-gap quantifier explicit. This matches the
retained FIRST limiting conclusion, without replaying that proof.
The source's `10^{-k}` is kept, not "corrected" to `10^{-(k+2)}`.

## Mathematical and Glyph Preservation

Every mathematical span is compared exactly, in order, to raw. The ONLY span
edits are the two final commas in the definition:
`$a_0.a_1a_2a_3\ldots,$` becomes `$a_0.a_1a_2a_3\ldots$，`;
`$a_{n+p}=a_n,$` becomes `$a_{n+p}=a_n$，`.
N, p and n spans between them are retained. The two outside commas remain
immediately after their formulas. No numeric change, exponent change,
sign/bar change, or registered/claimed math-correction is present.
`numeric_changes` is empty throughout; template `errata` is empty.

After removing only the nine reviewed clarification sentences, source
prose content matches ignoring whitespace and ordinary punctuation outside
math. This preserves all nonpunctuation characters, including source 象;
mathematical punctuation/digits are separately matched without that
normalization. Source equations containing commas such as N=1,p=1 and the
remainder list are not modified by a global punctuation-removal rule.

The raw physical-wrap annotations are already absent from assembled semantic
text. FIRST recorded one wrap in the example and two in page57's k annotations.
No new digit/exponent change or source interpretation is inferred from their
absence in assembled raw/templates.

Glyph UNKNOWN remains physical 象 versus 像; the given textual 象 is retained.
Exact printed repetition counts remain UNKNOWN, while their supplied textual
digit sequences are retained exactly. No source pixel certainty is manufactured.

## Exercise115, All Four Parts

Raw exercise identity115, group 习 题/g1, and `pages: ["p0057#5"]` are retained.
The source group heading is `p0057#4`. Count1 is correct for a single numbered
exercise with four subparts, not four numbered exercise objects.

| Part | Raw to Modern Label | Formula | Verdict |
| --- | --- | --- | --- |
| a | Cyrillic а -> Latin a | 7/3 | PASS: same input and request; FIRST result remains applicable. |
| b | Cyrillic б -> Latin b | 23/30 | PASS: same input and request; FIRST result remains applicable. |
| c | Cyrillic в -> Latin c | -3/7 | PASS: leading whole-number minus on the given fraction unchanged; source integer-bar convention for its decimal answer remains applicable. |
| d | Cyrillic г -> Latin d | -29/11 | PASS: sign and fraction unchanged; no answer-tail convention switch. |

Prompt prefix and each naturally ordered Latin subpart occupy their own line.
The last period moves to ordinary Chinese punctuation. No formula, input
number, sign, requirement, exercise grouping, figure reference or count changes.
No solutions are inserted in the modern question. No author answer/key,
choice or interaction has been disclosed or evaluated in this phase.

## Formal Check and Remaining Holds

`content-check.mjs` is a NEW identity/text-preservation check, not FIRST-check
or a mathematics replay. It asserts input hashes, snapshots, all14 mappings,
source text, exact math spans, declaration scope, nine specific additions,
all four input formulas and labels, and figure identity only. Failed
assertions produce a concrete FAIL report and exit1; passing ones exit0.
The runner captures actual stdout/stderr/exit ONCE, does not run a deliberate
mutation, does not retry or execute any source solution/proof, and freezes
the recorded verdict, candidates and evidence. `verdict.json` states the
actual result; `freeze.json` inventories files as `{path,bytes,sha256}`.

No concrete textual defect was found in the disclosed candidate. There is
no request to alter the candidate, canonical raw, errata, FIRST evidence,
or author keys. The assessment is limited to the exact frozen hashes, not
future parent or figure-author edits.

Still pending: ALL figure visual/mathematical review, rendering/finalization,
whole-lesson approval, Gate2, answers and choices. No separate figure
author's output, FigureSpec, image, renderer or finalizer was read or called.
Source glyph and printed-count historical UNKNOWNs remain as above.
No backend, browser, Git, DB, publisher, new worker, other-chat message or
further stage occurred. Stop for parent intake after this phase's freeze.

Usage: phase images0, cumulative worker images0, parent permanently24/24;
browser0, paid calls0; tokens UNKNOWN, monetary cost UNKNOWN.
