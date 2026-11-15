# ana9-c1-ex Final Changed-Only Stage3

## Disclosure Boundary

2026-11-15. Independent reviewer, not the choice or standard-answer
author. Changed-view Stage2 was already frozen at raw SHA-256
`263bfeba2be5705063eaf5e0999287e738fee94d59d0e5991e37c21a28f6dbef`
before parent authorization to inspect the repaired internals.

New disclosure was limited to current `ana9-c1-ex-choice-draft.json`
and `ana9-c1-ex-choice-changed-notes.md`. Substantive internal comparison
was only q3/q15/q19 and sources14/26/30. The original author source/notes
were reused from the earlier authorized review, not reopened. No standard
answer, answer-review artifact, source rewrite, browser, service,
dependency, database or publisher was used.

The parent reports the three repaired units' desktop/mobile display
checks PASS; this reviewer did not perform or claim a new layout check.
The other17 semantic and display records are reused, not re-solved,
re-rendered or independently checked again.

## Verified Exact Repair Scope

Compared current draft structurally with the byte-exact
`ana9-c1-ex-choice-draft-before-stage3-repair.json`, whose raw SHA-256 is
`b49fddb6eea3f6c28d8d4dd4ce8943dc02c83ad51ac8781a8ba24771dfa77edb`.
The actual whole-draft diff exactly matches the author's five-field
report:

```text
/questions/2/view/options/2/text
/questions/14/view/options/0/text
/questions/14/view/options/1/text
/questions/14/view/options/2/text
/questions/18/view/options/2/text
```

These are q3(c), q15(a/b/c) and q19(c), respectively. Other17 complete
question records are deep-equal. All20 intents, keys/rationales,
coverage records and relationships, stems, modes, question/option orders,
source mappings and figure inventories are unchanged. There are no new
figures. The current complete `{questions: [{id, view}]}` projection
is deep-equal to the frozen repaired view-only file.

The documented earlier pre-final q13/source24 equivalent-proof correction
remains distinct from this one q3/q15/q19 repair. No draft repair was
performed by this reviewer and no further author repair is authorized
or needed by this result.

## Changed Internal Comparison

| Unit | Frozen repaired true set | Current internal comparison |
| --- | --- | --- |
| q3 | {c} | PASS: source_solution and c rationale use1^2/2^2 modulo3; the repaired visible c now correctly calls1/4 representative squares before reducing to remainder1. a's missing residue2 class and b's doubling-for-squaring misconceptions still produce the exact false options and counterexamples. Key{c} and every truth record agree. |
| q15 | {c} | PASS: intent requires the arbitrary-arrangement upper bound and all degeneracies, which every repaired candidate now visibly addresses. The original a rationale still accurately identifies m+1 closed arcs and a weaker n^2+1 bound; b still incorrectly sets a noncoincident zero-intersection increment to0. c's complete branch proof, key and null misconception agree with the frozen geometry. Comparable branch coverage removes the original cue; no internal explanation is substituted for visible coverage. |
| q19 | {c} | PASS: unchanged source_solution/rationale already used2^k>k^3; repaired c now explicitly assumes it at arbitrary k>=10. Base and ratio estimate complete the induction. a's false cubic expansion and b's finite-sample inference remain actual misconceptions. Key{c} and every truth record agree. |

All three unchanged coverage records retain their source tasks and
concrete independent-production losses: proof recognition does not
demonstrate discovering or writing a proof. No new source convention,
additional omitted target, key disagreement or misconception that fails
to generate its distractor was found. The standard-answer artifacts were
not needed to reach these conclusions.

For q15, coincidence/base/zero-intersection components are explicit in
all three candidates. Matching the target formula leaves b/c; deciding
between them requires that a disjoint noncoincident circle can add a
region. The frozen leakage PASS is not weakened or replaced by a
single-choice/key assumption.

## Current Aggregate And Evidence Reuse

Current `ana9-c1-ex-choice-review.json` is a complete
`s10y-choice-review-v1` artifact:20 source reviews,20 question reviews,
66 option checks, no figure records, **outcome=pass**.

Only the current snapshot binding/reviewer chronology, three affected
question reviews and their three source-coverage evidence strings were
updated. All20 frozen source independent_solution strings remain exact.
Every other17 question review and other17 source review is deep-equal
to the original review retained at:

`../evidence/ana9-c1-ex-choice-review-initial.json`

The original retained review still has raw SHA-256
`bb5ded2dba22988badd10758b91e4dd90b7090bd8b7fa2585ee400c2c9196428`
and outcome=revise. It was only read for hash/equality checks, not edited.
Its initial validator exit3 and Stage1/2/3 chronology are preserved.
Current PASS applies only to the repaired snapshot; it does not
retroactively approve or erase the initial defects.

## Snapshot Hashes

Basenames are under `.intentfold/tickets/STEMROBIN-184/tmp/`.

| Artifact | Raw SHA-256 | Official canonical SHA-256 |
| --- | --- | --- |
| `ana9-c1-ex-choice-seed.json` | `4cc597b0f08c5327b36861bb21d251bd943d245d21e6045873a9e1f3148c2398` | `971b9ae8483156bebd75c79e294e9f26a8c626256a7dfe89443c85af8a3b64e2` |
| `ana9-c1-ex-choice-draft.json` | `d83e6b74dd84dc8ed1fe83eae416eef663b8141859eeb0cdf821959785c551f8` | `fc67a9971486c8b14e2087c5179129f85caafab9e709216dfcc63719957499b5` |
| `ana9-c1-ex-choice-review.json` | `8b58124f89599c0544ebe58ac741a8548bd445d701d06556bd90ea721cbdf0d4` | `6044d314fc47c35184995257edc43ad89a8f152e645502fd8e26dbcad7c0535c` |

Further bindings:

- Repaired view-only raw:
  `3aa0832dbc90c1acb69d18a5d3356a12446d5b414ab16718289e5a3cdae6a3b5`.
- Frozen q3/q15/q19 view projection canonical:
  `eee7926bc7b139a8df9e11bfde804ce6be0cb9e9c44ad283ed54f99c5290c6f9`.
- Author changed-notes raw:
  `efb8fd68a96fc378f33127611168db30a68679fa0f6cd3a1977a1d76903cc8f2`.
- Original Stage1 raw:
  `a27bba85a67c261f86dab261fc3f43dd332eb415ff75f39ec8d20a4d809cd800`.
- Original Stage2 raw:
  `2cc385d8460b981e1f83bc62b282cd296d20af95bfacee37131eb86518281a1b`.
- Original Stage3 raw:
  `ba03e8165ebf46b82a181312116236bb044383962e7d7cc545028e1af9316f21`.

Current seed/draft/review canonical hashes were calculated with the
existing official `prepare.py digest`. No seed update or source assembly
was performed; the parent's stable book/source inputs were left alone.

## Exactly One Current Validate-With-Review Run

Executed once after updating the current aggregate review:

```bash
env -u PWDEBUG PLAYWRIGHT_HTML_OPEN=never python3 -B \
  .agents/skills/ld-s10y-choice/scripts/validate.py --repo . \
  --seed .intentfold/tickets/STEMROBIN-184/tmp/ana9-c1-ex-choice-seed.json \
  --draft .intentfold/tickets/STEMROBIN-184/tmp/ana9-c1-ex-choice-draft.json \
  --review .intentfold/tickets/STEMROBIN-184/tmp/ana9-c1-ex-choice-review.json
```

Actual result: **exit0**; stderr empty; stdout:

```text
mechanical checks passed; declared semantic review: pass (not automatically proved)
```

This is the single current repaired-snapshot validate-with-review run.
The original rejected-snapshot run remains exit3; the author's separate
structural-only run is not relabeled as independent review. The tool
settles current seed freshness, schema/identifiers, coverage relationships,
snapshot binding and declared passing-key agreement. It does not prove
mathematics, leakage or fidelity automatically; those rest on the frozen
independent evidence and this bounded internal comparison.

Read-only assertions additionally verified exact five-field draft diff,
repaired projection equality, unchanged seed and frozen Stage2 bytes,
deep-equal reused17 reviews, all20 exact source solutions and full review
record counts. Those assertions did not solve the17 questions again or
run another validator.

No second repair, new browser/layout check, source/code edit, DB write,
publication, promotion or commit followed. This is offline review
approval of the exact current snapshot only.
