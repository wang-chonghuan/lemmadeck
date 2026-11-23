# N15 affected choice review

Outcome: PASS for this repaired snapshot, reusing the original independent
source freeze and unchanged question/option evidence. No new source solving,
images, or replay of unchanged learner options.

## Affected learner inspection first

- Q2 E: incorrect. Its first three rows match the freeze; its sqrt(11) row
  (3.4,3.5) does not. The frozen 10.89<11<11.56 implies sqrt(11)<3.4, so
  3.4 cannot be its lower endpoint. E supplies the previously missing root-only
  distinction. Whole-table recognition still does not prove row-by-row production.
- Q3: "小数点后的前四位" removes the integer/fractional-position ambiguity;
  the no-rounding instruction and all original options remain unchanged.
- Q5/Q6: both stems explicitly exclude eventually-all-nine expansions and
  quantify only over compatible tails under that convention. This matches the
  frozen canonical enclosures [1.9053238,1.9053240) and
  [3.31272708,3.31309608), respectively. No endpoint equality is silently
  discarded outside the stated scope. Prefix/interval tasks are unchanged.
- These changes introduce neither equivalent alternatives nor new author-key
  leakage. The unchanged cross-question evidence is reused, not re-reviewed.

## Subsequent internal comparison

- Q2 E's rationale and misconception match the actual false row: use the upper
  endpoint 3.4 as a lower endpoint, then add 0.1. Updated source119 coverage
  correctly records the new distinction and retains the production limitation.
- Q5/Q6 source_solution, unit_reason and C derivation consistently use the
  stated canonical-tail convention. Their unchanged C options are now warranted
  within that explicit scope; original A/B/D judgments are reused.
- Q7 only unit_reason changed. It now honestly describes displaying a
  precision-bearing zero, not independently discriminating omission of it.
- No new rationale or coverage defect was found in the affected units.

## Evidence Reuse And Limits

Reuse `source-math.md`, `choice-source-binding.md`, `choice-views.md`,
`choice-internal.md`, and retained `first-choice/review.json`. The source freeze
byte SHA-256 remains
`4b37e257aaafb965f205d7d4f6b961a8592edc4558f59e15f04ea75310ae62ef`.
Original REVISE and all retained originals remain untouched.

Mechanical comparison confirms 8 questions / 35 options; all original 34 option
texts, truth labels and exact keys are unchanged. Current learner views exactly
equal the draft's id/view projection. The only learner deltas are Q2 E and the
three disclosed stems. Complete sets remain Q1 B; Q2 C; Q3 C; Q4 B,C,F,H;
Q5 C; Q6 C; Q7 B; Q8 B, with E newly false.

Retain the original limits: Q7 has no separate zero-omission alternative; Q8's
actual digits do not distinguish truncation from coinciding nearest rounding;
Q4 provides partial sqrt(3) assistance to Q8(a). Recognition does not establish
independent production. No stronger production-capability gate is asserted.

## Snapshot Binding

Canonical seed SHA-256:
`0e52f8bbc8c61a52456c10e917b668e3e67abe7fd644f7747dc2a987126da899`.

Canonical repaired draft SHA-256:
`450c07e6b686543d2a2ce98fd37a9789c05b54816dc91ab91e9456fb9c693109`.

The existing `prepare.py digest` CLI returned each digest with exit 0.
`choices/review.json` replaces only affected review fields and adds E's check,
binding the reused evidence to this snapshot with outcome `pass`.
No `validate.py`, parent final-validator, display/render check, or publication
operation ran in this affected review. Complete display remains the next stage.
