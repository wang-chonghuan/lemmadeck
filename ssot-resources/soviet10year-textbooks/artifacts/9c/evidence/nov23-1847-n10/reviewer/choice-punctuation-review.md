# N10 affected choice punctuation review

2026-11-23. Sole cwd:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.

## Scope and finding

**Pass for the four changed stem wrappers only. Display review remains pending.**
No rendered-layout success is claimed.

The current draft was structurally compared with the preserved
`choice-pre-punctuation.draft.json`. Exactly these four leaf paths differ:

| Question | Changed draft path | Observed wrapper repair |
| --- | --- | --- |
| `two-ball-order` | `/questions/1/view/stem` | The unchanged values 1,2,3,4,5 now each occupy one inline-math span; four U+3001 separators are outside math. |
| `full-ball-order` | `/questions/2/view/stem` | The unchanged values 1,2,3,4,5 now each occupy one inline-math span; four U+3001 separators are outside math. |
| `four-odd-balls` | `/questions/3/view/stem` | The unchanged values 1,2,3,4,5 now each occupy one inline-math span; four U+3001 separators are outside math. |
| `irreducible-fraction` | `/questions/5/view/stem` | The unchanged values 2,4,6,7,8,11,12,13 now each occupy one inline-math span; seven U+3001 separators are outside math. |

For each row, an exact replacement assertion confirmed that the former single
math-wrapped U+3001-separated list became individually math-wrapped numbers
joined by the same prose separators. Removing only dollar delimiters makes the
entire old and current stem strings identical. All remaining characters, list
order and values are unchanged, not merely mathematically equivalent.

Every other draft field is structurally identical, including the two unaffected
stems, options, keys, rationales, intent, coverage and figure references.
No source task or visible question was re-solved; no option review was replayed
and no key values were exposed by the structural comparisons.

## Official review continuity

The preserved first PASS review exactly matched the official review before this
rebind. Only `/draft_sha256` and the four affected
`/question_reviews/{1,2,3,5}/task_fidelity/evidence` strings were changed.
Each original evidence string remains intact, explicitly labeled as the
pre-punctuation assessment, followed by the localized wrapper observation.
The former exact-view-equality statements therefore remain historical evidence,
not claims that changed wrapper bytes still equal the Stage B projection.

A restore-and-compare assertion confirmed every other official review field is
identical to `choice-pre-punctuation.review.json`: all substantive verdicts,
source/coverage records, mathematics, complete true sets and nineteen option
checks are retained. The official semantic outcome remains `pass`.
Stage A/B files and the preserved pre-repair snapshots remain unchanged.

## Exact bindings

Choices base: `.tmp/stemrobin-184-six/n10-nov23-source4345/choices/`.
Evidence base:
`ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n10/`.

Actual canonical digests returned by official `prepare.py digest`:

- Seed: `d5ff3a99b5a540ded47eade0b4f86bca321a733eedbb6038fead4eb8ab77635d`.
- Preserved pre-repair draft: `58018c5000404bd609f496764fdc3547a6983a2a772e28cfc5b66b7f38c0471e`.
- Current draft: `132677e62363487e381e664dfbbeec89c44d850c6645920875043460a3b98ce9`.

The current seed/draft digests are bound in official `choices/review.json`.
File-byte SHA-256 values:

| File | SHA-256 |
| --- | --- |
| Current `choices/draft.json` | `c277ea6210b6784ebcd500d529e637871ea49b273536c7a910eedeffec0c28d1` |
| Current `choices/review.json` | `3ce837501482fec9852221326ad2df425eaebd191fe5156d2e60de9fdb426a72` |
| `choice-pre-punctuation.draft.json` | `2a3564b9e7e809af356aa7eb53733ae98940af9536428f272cfbff67d601ed46` |
| `choice-pre-punctuation.review.json` | `08eb987249fbcb290366490f620b4570baae2197545ad31b94ddc0425ad053ce` |

## Actual checker result

Exactly one checker invocation for this affected review, from the sole cwd:

```bash
python3 -B .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .tmp/stemrobin-184-six/n10-nov23-source4345/choices/seed.json --draft .tmp/stemrobin-184-six/n10-nov23-source4345/choices/draft.json --review .tmp/stemrobin-184-six/n10-nov23-source4345/choices/review.json
```

Actual exit: **0**. Output:

```text
mechanical checks passed; declared semantic review: pass (not automatically proved)
```

This result is mechanical validation of the current binding and retained
review, not a substitute for display review. Extra image opens: **0**.
Only official `choices/review.json` and this report were edited or written.
No candidate edits, new mathematics, app/display access, DB, Git, `.env`,
dependency or peer operations occurred. Stop after affected wrapper review.
