# B83 n144 Combined Independent Answer/Choice Review

**PASS** for the current offline candidates. Required revisions: none.
Ticket scope: STEMROBIN-180/180-3; 7p, modern-us-neutral, phy7-c2-s3-n144.
Date: 2026-11-18.
Every shell invocation explicitly used `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Reviewer: Codex in this review-only session, not the candidate author.
No candidate edits or writes outside the authorized review outputs.

## Independent Evidence Order

1. Read the seed and current canonical lesson/exercises; wrote both source
   solutions in `tmp/b83-n144-final-review/source-solutions-frozen.md` before
   opening any draft subtree or answer key.
2. Displayed only ordered `{id, view}` projections; solved all eight visible
   options and froze fidelity, redundancy, leakage and complete correct sets
   in `tmp/b83-n144-final-review/view-judgments-frozen.md`.
3. Only then read full draft internals and the current canonical answer keys.
   Wrote `tmp/b83-n144-final-review/semantic-comparison-frozen.md`, the standard
   `tmp/b83-n144-choice/review.json`, and ran validate-with-review once.

The canonical lesson container was printed in full, incidentally exposing its
unselected motor worked example. This is an input-reading limitation: that
example was excluded from definitions, source solutions and semantic authority.
No candidate keys or prior answers were exposed before either blind freeze.
There was no TEXT or figure re-review, old output lookup or delegated review.

## Independent Results

Source 1: `A = Uq`, with work in J, voltage in V and charge in C;
`1 J = 1 V * 1 C`. At fixed charge, doubling voltage doubles work; at fixed
positive voltage, work changes directly with charge.

Source 2: steady current gives `q = It`; substituting gives `A = UIt`.
Use V, amperes and seconds to obtain J: `1 J = 1 V * 1 ampere * 1 s`.
`UI` alone is power, not accumulated work. The product domain is constant
voltage/current over the interval; arbitrary time-varying readings are not
approved.

| Question | Mode | Independent Correct Set | All Option Truths |
| --- | --- | --- | --- |
| n144-charge-work | multiple | `{a,c}` | a true; b false; c true; d false |
| n144-current-time-work | single | `{d}` | a false; b false; c false; d true |

Every author key agrees with the frozen independent set. Each misconception
actually generates its false option: `q/U` yields inverse voltage dependence;
omitting charge yields unchanged work; omitting elapsed time yields power
`UI`; mistaken `t = Iq` yields `t/I` and `Ut/I`; mistaken `I = qt` yields
`I/t` and `UI/t`. Their units or conditional behavior disagree with the source.

## Choice Findings

Task fidelity, redundancy, leakage and mathematics: **PASS** for both questions.
The positive quantities and within-interval constants remove degenerate cases;
fixed charge and fixed voltage are distinguished correctly. Native selection
units are complete propositions and one complete substitution chain.

The product-law option and its fixed-voltage consequence are not equivalent:
the latter alone does not determine voltage dependence. The second question
adds the distinct rate-to-accumulation step. Shared unkeyed lesson scaffolding
and dimensional elimination are real aids, but neither exposes a correct set
or removes the need to distinguish current-times-time from inverse operations.
The second stem's universal quantifier rules out accidental numerical equality.

Capacity losses are real and accurately declared in intent and coverage:
recognition does not demonstrate unaided formula/prose production, nor unaided
construction/explanation of the charge-to-work derivation. Both source
conceptual tasks remain covered; neither is silently deferred.

## Answer Gate 2

**PASS**: exactly two derived, ungraded keys match source exercises "1" and "2".
The first explains `A = Uq`, meanings and `J = V*C`. The second explains
`q = It`, substitution into `A = Uq`, and `J = V*ampere*s`.
These are exact answers, not generic methods. Neither display restates
constancy; their approval is limited to the source lesson's elementary domain.

Both have `parts = []`, so natural-language explanations are not forced into
automatic exact/numeric/expression grading. There are no expected values;
automatic-input/MathLive editing checks are not applicable. No `bookRaw` or
previous answer was consulted. `status = draft` remains intentional:
semantic PASS is not finalized, published or runtime acceptance.

## Exact Bindings

Canonical SHA-256 uses the contract's sorted, ASCII-escaped compact JSON.

| Artifact | Canonical SHA-256 |
| --- | --- |
| seed.json | `c4d8d904a9914694d3217a925118baa617e127c12b82216f5a276cca3080ee14` |
| draft.json | `d0101bb1b18d9f86aa2cf5379e0de0e49a9dd177258f9eae3d7177b4e192f5d4` |
| review.json | `d6269b9ece6f93f76a3d1000c966f7d4c7b55f9b846f972a756f12614accbb41` |
| canonical answer-keys.json | `0d9808bfcb2ebf1538a33991e758d9ca257b64af2794126e9b8941eb3274a892` |
| ordered draft `{id,view}` projection | `40da34fff1240a05e796920148f4402366a99973a3edcda2e38f398511500e47` |

Byte SHA-256:

- lesson.json: `e97ed15704f249102c7f0dd067849cca11d1ab0baa8f0fa74b50028c564566f4`
- exercises.json: `eb1adfac8f5dd76d771fa94dc585ff0e2f801a653df9f289317ffeb6b4be0982`
- answer-keys.json: `a889e80485c5ba61824ad0932f854f06768531154893d0fbe951d2bcdeddc2a9`
- draft.json: `aa5aed83eab73fd7967f484abc4dcaa3edf828cb16a4704741b7cd3977746b06`
- review.json: `8ae206dc616f3e2e40b48ad0fca48bfdcb6c0b9fa7a4502c6987827353bb63d9`
- source freeze: `7eec29cb5f58c75a6cd315555945b0546751c732a79159c39e0030d054d7fd83`
- view freeze: `0068ec30ebdf8c0172a9c96756f40b88d4da2260ca97d30f0a1baf1ede3f3af4`
- semantic comparison freeze: `8036c3e58b68e96e510c07a95dcace5cd5232755e381beea0179b6eefca7c84c`

## Actual Validation

Executed once, after semantic judgment, from the explicit checkout above:

```sh
python3 .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .intentfold/tickets/STEMROBIN-180/tmp/b83-n144-choice/seed.json --draft .intentfold/tickets/STEMROBIN-180/tmp/b83-n144-choice/draft.json --review .intentfold/tickets/STEMROBIN-180/tmp/b83-n144-choice/review.json
```

Exit `0`; actual stdout:

```text
mechanical checks passed; declared semantic review: pass (not automatically proved)
```

This settles structure, freshness and snapshot agreement, not semantic proof.
The command receipt retains the single exit-1 preflight for absent output
destinations; creating the authorized new files resolved it without content
repair or any repeated semantic check.

Images expected/opened/rendered/generated/fetched: **0**; source and candidate
figure references/new figures are empty. Browser commands: **0**.
Combined semantic reviews: **1**; validation runs: **1**; repair/repeat rounds: **0**.
No tests, old choice/interaction/ticket output lookup, DB/.env, publisher,
service/model calls, dependency change, Git, descendants, other chats or
finalize. Other contributors' work and all candidates remain unchanged.
