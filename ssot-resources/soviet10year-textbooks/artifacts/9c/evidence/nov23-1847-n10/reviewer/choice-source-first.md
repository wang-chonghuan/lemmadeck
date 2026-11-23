# N10 choice review Stage A source freeze

STEMROBIN-184 / `ana9-c2-s3-n10`, 2026-11-23.

Sole working directory: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.

## Scope and Stage A Result

The official seed identifies book `9c`, lesson `ana9-c2-s3-n10`, exactly six selected Exercises 74 through 79, and the actual definition block **2**. Its selected exercise conditions match the previously approved modern tasks, with no missing data or answer-changing ambiguity found. No selected exercise or concept requires a figure.

This is the requested pre-candidate source freeze, not approval of a choice candidate. Existing valid original solving is reused, not rerun for seed packaging. New choice-author reasoning, keys, options, candidate views and internal coverage have not been disclosed to this reviewer during Stage A.

Read only the seed, retained independent mathematics and relevant approved modern-task evidence, plus local choice-review instructions. Neither `choices/draft.json` nor `author-source-first.md` was opened. No report or retained result was sent to the independently reasoning choice author.

## Retained Source Evidence

- [source-math.md](/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n10/reviewer/source-math.md): original independent solutions, frozen before author answers/options.
- [modern-review.md](/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n10/reviewer/modern-review.md): approved task identities, explicit sampling conditions, PLANET and dollar substitutions.
- Existing source-first/corrected-source findings remain valid; no original was reopened to reconfirm them.

Retained independent mathematics SHA-256: `20a7e58bc2cbdc868ff43b7061f0d860f64d5b62daf6a7972e405a2b4d137712`.

The exact current seed exercise text equals the approved modern exercise's `group + "\n" + text` for every selected number. The added `习 题` heading is packaging, not a new mathematical condition.

## Definition Review

Seed `/concepts/0` has `block: 2`, a zero-based definition index. Its decoded text exactly matches approved modern `/prose/2`, whose source reference is `p0042#6`:

```text
当基本结果有限且总数非零，彼此互斥、覆盖全部可能，并且每个基本结果等可能时，某事件的概率等于有利结果数与基本结果总数之比。
这里计数的是基本结果，不是默认把颜色、价格或点数和等类别看成等可能。
```

This is the applicable finite-equiprobable counting definition, not a worked example substituted as a definition. It requires nonempty, exhaustive, mutually exclusive elementary outcomes and equal probabilities. It does not grant equiprobability to price groups, colors or numerical sums.

`source.concept_figure_ids`, all six exercise `figure_ids`, and seed `figures` are empty. The lesson's separate dice table is not needed by these six tasks or this selected definition; its absence here is not a lost source figure.

## Source Reviews and Coverage Expectations

These are retained independent solutions and prospective source-coverage standards. Candidate `coverage` cannot be judged before exposure; no question IDs, correct option sets or candidate verdicts are invented here.

| Seed pointer / `source_number` binding | Approved source identity and exact seed conditions | Retained independent result | Coverage expectation for later choice review |
| --- | --- | --- | --- |
| `/exercises/0`, **74** | Modern/source number 74, original `p0045#2`. Six distinct labels `P,L,A,N,E,T`, one row, all permutations equally likely, specified target `PLANET`. | One successful order among `6!=720`; probability `1/720`. The cultural word substitution preserves six distinct letters. | Preserve the specified-arrangement probability task and distinct-letter permutation space. Merely recognizing or copying the word PLANET would not cover the probability question. Do not introduce repeated-letter multiplicities or unsupported nonuniform orders. |
| `/exercises/1`, **75** | Modern/source number 75, original `p0045#3`. Balls 1 through 5, two sequential draws without replacement, each remaining ball equally likely, strictly increasing numbers. | Twenty ordered outcomes, ten increasing outcomes; probability `1/2`. | Preserve both order and sample size two. Increasing is not restricted to consecutive labels; drawing with replacement is a different experiment. Cover probability/counting, not only sorting a provided pair. |
| `/exercises/2`, **76** | Modern/source number 76, original `p0045#4`. The same five labels, sequential removal of all five without replacement, uniform remaining-ball choices, strictly increasing full order. | One increasing order `(1,2,3,4,5)` among `5!=120`; probability `1/120`. | Preserve the complete five-ball ordering task, distinct from Exercise 75. Merely displaying the already-ordered labels, or silently reducing the task to two balls, does not cover its probability. |
| `/exercises/3`, **77** | Modern/source number 77, original `p0045#5`. Four different balls selected at once from labels 1 through 5, uniform groups, all four labels odd. | Only three odd labels `1,3,5`; no successful four-element subset; probability `0`. | Preserve the cardinality/impossibility judgment. Do not repair four to three, permit replacement, or treat this as four independent odd/even draws. Recognition of impossibility may be a valid mathematical response; independent written derivation is not an added choice-response requirement. |
| `/exercises/4`, **78** | Modern/source number 78, original `p0045#6`. Ten distinct books: five priced 4 dollars, two priced 3 dollars, three priced 1 dollar; two different books, equal chance per pair; total 5 dollars. | `C_10^2=45` pairs; successful price pattern 4+1 gives `5 x 3=15`; probability `1/3`. | Preserve distinct-book multiplicities, price-sum event and pair sampling. Price categories are not equiprobable objects. Dollars are the approved hypothetical currency substitution, not a real exchange-rate conversion. Merely matching two printed prices without judging favorable/total pairs would lose the probability task. |
| `/exercises/5`, **79** | Modern/source number 79, original `p0045#7`. Eight values `2,4,6,7,8,11,12,13`, two different cards, uniform pairs, formed fraction irreducible. | Twenty-eight pairs; ten even-even failures; the actual distinct odd primes `7,11,13` divide none of the actual even values, so eighteen pairs are coprime; probability `9/14`. | Preserve actual-number coprimality and the pair-probability task. Reversing numerator/denominator does not alter gcd; all possible denominators are nonzero. Do not use the false generalization that arbitrary odd-even pairs are always coprime or substitute another number inventory. |

The table's `source_number` is the internal source selector for subsequent question `source_numbers` and coverage records, not a learner-facing mapping instruction.

Many-to-many question/source coverage remains permitted: justified splitting or merging is not precluded and exactly one question per seed is not imposed. Any omission or capacity loss must be assessed concretely after candidate exposure. Essential distinctions above must not disappear silently. Choice recognition or reasonable elimination is not automatically a failure merely because the original response was written.

## Exact Seed Binding

Official seed:

`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n10-nov23-source4345/choices/seed.json`

- File-byte SHA-256: `1b387525f90b3c09dd18b0a2b578a6e7e6d0f4937de502676d8226eaeff71d3f`.
- Choice-contract canonical seed digest: `d5ff3a99b5a540ded47eade0b4f86bca321a733eedbb6038fead4eb8ab77635d`, returned by the documented `prepare.py digest` command. This is the digest to use as subsequent `seed_sha256`; it differs from the formatted file-byte hash.

Approved modern task comparison:

`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n10-nov23-source4345/adapt/9c/modern-us-neutral/lessons/ana9-c2-s3-n10/exercises.template.json`

SHA-256: `aaa9ece85802646032ca3c36d1a6f1b8ca78023f6efbb79b9c6c809df1b57c96`.

Read-only checks confirmed seed identity, the exact six numbered task texts after their group headings, definition block 2 and its source reference, and empty selected figure inventories. No seed regeneration, whole-book refresh, source solving or candidate validation was undertaken.

## Stop Before Stage B

Stage B still needs the blind learner-facing views. Task fidelity, redundancy, cross-question leakage, full option truth sets, author-key comparison and actual candidate coverage are **not yet reviewed**. This internal source freeze is not a learner payload or an instruction to disclose retained solutions to the new author.

Additional image opens: **0**; cumulative visual opens remain **5**. No new candidate exposure, key access, image/source reopening, DB, Git, `.env`, network, dependency or peer operations occurred. Only this report is newly written; existing evidence is unchanged.

Stop at Stage A.
