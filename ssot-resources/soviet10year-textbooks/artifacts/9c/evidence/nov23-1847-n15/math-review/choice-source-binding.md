# N15 choice seed / source-freeze binding

STEMROBIN-184; ana9-c3-s1-n15; 2026-11-23; TEXT-ONLY; finish=review.
Authorized seed: `.tmp/stemrobin-184-six/n15-nov23-recovery/choices/seed.json`.
Seed SHA-256: `16a8424424383422c83f3e1028faa7e245e646bf5e6cf15f1e7eeab1c85dbd1d`.
Reused immutable `math-review/source-math.md` SHA-256: `4b37e257aaafb965f205d7d4f6b961a8592edc4558f59e15f04ea75310ae62ef`.

**Binding matches.** Seed identity is book 9c / N15, with exercises 118-125, selected definition blocks **1/2/3/5/8/15/16**, and zero figures or exercise figure references. The existing independent proofs, endpoint pairs, decimal-digit certificates, and rounded results apply unchanged; no new source solving was performed.

- **121:** first three approximation pairs explicitly mean units, tenths, hundredths. Fractional digits use the negative integer characteristic plus nonnegative tail; a bar on the integer is not a minus on the whole ordinary decimal. Reuse the frozen negative intervals and source-tail results, not ordinary negative-magnitude digits.
- **124:** seed explicitly requires nearest rounding to four significant figures and precision-bearing terminal zeros. Reuse the freeze's nearest-rounded branch; its separately retained source-truncation alternative is not the answer to this seed prompt.
- **125:** seed explicitly requests actual first three fractional digits without rounding. Reuse the frozen digit results, not whole truncated values or a rounding task. 120 likewise preserves actual digits and strict bounds; 122/123 retain unspecified operand tails.
- **Selected definitions:** lower/upper approximations, sum bounds/definition, and product definition/qualification agree with the freeze. Lower may equal the real number; upper is one precision unit above the lower approximation. Direct product bounds require nonnegative factors; negative products use absolute values and the sign rule. Product-interval width is not generally the single-factor precision unit.
- **Carried convention qualification:** the selected set omits the canonical-expansion note in prose block 4. The freeze's no-eventually-all-nine convention still governs strict upper bounds; the selected formulas do not make such bounds valid for arbitrary all-nine tails. Any isolated learner task depending on this distinction must make its convention clear. Likewise, an isolated product-definition task must retain its nonnegative-domain qualification. These are retained constraints, not newly solved source issues or edits.

Only this new binding report is authored. No current choice draft, author solution, answer candidate, or learner views were accessed; no images, shell commands, producer/checker operations, Git/DB/app/env/dependency work, or peers. Prior reports and the frozen source context remain unchanged.
No task/leakage/every-option verdict is made before `learner-views.json` disclosure. Stop after binding and await that disclosure.
