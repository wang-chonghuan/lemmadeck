# STEMROBIN-180 n93 Choice First Source b94

Status: SOURCE_ONLY_COMPLETE_PENDING_PARENT_BINDING.
Date: 2026-11-19.
Reviewer: fresh independent agent `n93-CHOICE-FIRST-SOURCE/b94`.
Scope: offline STEMROBIN-180 C, finish=review.
This is a frozen pre-disclosure source review, not approval of a choice
draft, learner view, option set, key, or published lesson.

## Input Authority

Working root:
`/Users/yong/.codex/worktrees/stemrobin-180-resume/lemmadeck`.

Immutable seed:
`.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n93-choice-author/seed.json`,
SHA-256 `720f22849e03c73c9392c539aefc5d92166a07bf192efbb764b0396d6d434a24`,
5821 bytes.

Six selected written seeds: `2`, `3`, `4`, `g2-2`, `g2-3`, `g2-4`.
Six selected definition paragraph indices: `1`, `7`, `8`, `9`, `18`, `19`.
Full eight-task context was read only as a whitelist projection from
canonical n93 lesson/exercises/figures JSON with respective hashes:

- `aff54fa38715ea14ee37b26d84e4d48bf1a892670637171a34ea7344c3b4307b`,
  23176 bytes.
- `21ef3878e34f9439b37ffdf59f978856081289bb739582ab8db188944943120b`,
  11894 bytes.
- `006d35b01ff4133371c6d27c9ecdb7820486955d7d13814d7ea4d4c5c0c67c24`,
  819 bytes.

The seed stayed frozen. Canonical hashes matched when read.
A pending whitespace-only normalizer or metadata retarget is technical
recovery, not evidence that source mathematical fidelity failed.
Task words, quantities, questions, and definition object indices must stay
unchanged. A later layout-only repair does not authorize redoing this
passed source stage.

## Image Evidence

Opened once first:
`ssot-resources/soviet10year-textbooks/artifacts/7p/figures/tbl-p0241-01.png`,
SHA-256 `e14a09002ecc89035ccce5528109cebff7007998ba552db4952e52706df81189`,
26716 bytes, 1192 by 1129 pixels.

Opened once second:
`.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n92-table-author/native-repair-1-1440-full.png`,
SHA-256 `9a98cb8d83eeb6dd72bf986a1c7b633c74aa9c0772b92920feeff1ae14e51924`,
51646 bytes, 704 by 681 pixels.

Total images loaded: 2; zero crops, reopens, or new figures.
Both show the complete 16 data rows, one header row, and three columns.
The native rightmost kcal column and bottommost Water row/border are
fully visible and legible.

| Material | c, J/(kg*C) | c, kcal/(kg*C) |
| --- | ---: | ---: |
| Lead | 140 | 0.033 |
| Copper | 380 | 0.09 |
| Zinc | 380 | 0.09 |
| Brass | 380 | 0.09 |
| Iron | 460 | 0.11 |
| Steel | 500 | 0.12 |
| Cast iron | 540 | 0.13 |
| Brick | 750 | 0.18 |
| Laboratory glass | 840 | 0.20 |
| Aluminum | 920 | 0.22 |
| Vegetable oil | 2000 | 0.48 |
| Ice | 2100 | 0.50 |
| Kerosene | 2100 | 0.51 |
| Wood (oak) | 2400 | 0.57 |
| Alcohol | 2500 | 0.60 |
| Water | 4200 | 1.00 |

SI values are printed integers. Lead's kcal value uses three decimal
places; all other kcal values use two. Preserve trailing zeros.
Preserve ice's `2100 / 0.50` and kerosene's `2100 / 0.51` as printed.
Rounded columns are not exact unit-conversion identities.
This is visible source/native table correspondence, not a review of
an unseen FigureSpec, candidate option, or mobile layout.

## Independent Solutions

- `2`: for a reviewer-created example, 0.5 kg water warming 20 to 30 C
  absorbs `4200*0.5*(30-20) = 21000 J`. Cooling 30 to 20 C gives signed
  heat into water `-21000 J`, or positive released amount `21000 J`.
  The source permits a warming OR cooling example.
- `3`: `Q = c*m*(t2-t1)` with c specific heat, m mass, t1 initial
  temperature, and t2 final temperature. J/(kg*C), kg, and C cancel to J.
  For a positive cooling release amount use `c*m*(t1-t2)`.
- `4`: heat flows from hot to cold water. In an isolated water-only
  idealization with negligible container capacity/loss,
  `c*m_hot*(T_hot-T_final) = c*m_cold*(T_final-T_cold)`.
  This equates heat amounts, not mass or temperature changes. The real
  balance includes container/air gains; when they gain heat, hot release
  exceeds cold-water absorption by those gains. The discrepancy shrinks
  with reduced losses. Arithmetic-mean final temperature is not general
  for unequal masses; no equilibrium-temperature calculation was requested.
- `g2-2`: listed liquids have c values oil 2000, kerosene 2100,
  alcohol 2500, water 4200 J/(kg*C). At equal mass and net heating
  power, `dT/dtime = P_net/(m*c)`, so vegetable oil warms fastest.
  Equal mass is a condition of the inference, not an explicit source
  quotation. If oil is 1 kg and water 0.1 kg at equal net power, water
  warms faster because its total heat capacity is 420 versus 2000 J/C.
  An unconditional arbitrary-mass ranking is underdetermined.
- `g2-3`: water's largest listed-liquid c means greatest heat uptake
  for fixed mass/rise, or least temperature rise for fixed mass/heat.
  It does not prove fastest heat transfer or universal best coolant
  under unspecified engineering conditions.
- `g2-4`: cast iron `540*1.5*200 = 162000 J`; aluminum
  `920*0.050*(90-20) = 3220 J`; brick
  `750*2000*(60-10) = 75000000 J`. These are 162 kJ, 3.22 kJ, 75 MJ.
  The alternate rounded kcal column yields 39, 0.77, and 18000 kcal.
  Use 50 g = 0.050 kg and 2 metric tonnes = 2000 kg; rises are 200,
  70, and 50 C. All are positive heat absorbed by the bodies, not
  unspecified heater/fuel energy including efficiency.

Definition interpretation: blocks 1/7 supply c, m, and temperature change;
8/9 define the signed formula; 18/19 distinguish ideal balance from
container/ambient losses. Constant listed c, unchanged phase, and
sensible heat are the operative model.

The two unselected written tasks are not silently claimed as covered:
`1` asks for c, m, and temperature change; `g2-1` interprets aluminum's
920 J or rounded 0.22 kcal per 1 kg per 1 C. A package claiming all
eight tasks needs actual elicitation of these capacities or explicit
substantive omissions.

## Frozen Fidelity and Capacity Criteria

- Require an explained numerical example for `2`, not only formula recall.
- Require the complete formula and temperature order for `3`; distinguish
  signed heat into a cooling body from positive heat released.
- Require heat direction and ideal/real energy balance for `4`.
- Require liquid filtering and inverse-c heating reasoning with controlled
  mass/net power for `g2-2`; do not guess an unconditional unequal-mass key.
- Require heat-storage reasoning for `g2-3`, not merely locating a maximum.
- Require all three heat quantities, material rows, conversions, and
  temperature intervals for `g2-4`.
- Record losses of independent example generation, explanatory writing,
  formula writing, and calculation production in a choice conversion.
  Complete-chain or complete-triple recognition is not inherently a
  failed task; genuine given-cell copying or absent math judgment is.
- Judge fidelity, redundancy, and leakage before author-key disclosure.
  Later solve each visible question anew and check every option and the
  complete true set. Inspect cross-question shortcuts and all coverage.
- Merging/splitting tasks requires preserved mathematical relationships;
  every selected task must have substantive coverage or declared loss.
  All-eight coverage additionally requires `1` and `g2-1`.
- Preserve table precision, quantities, units, endpoints, and definition
  indices. Missing evidence/operative conditions block the affected check.
  Metadata-only retargeting does not manufacture a fidelity failure.

## Evidence and Boundary

Owned evidence directory:
`.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n93-CHOICE-FIRST-SOURCE/`.
Its frozen report, independent solutions, and generated manifest provide
exact path/SHA-256/byte bindings for inputs, outputs, and command receipts.
All shell commands used the existing run-stage recorder with this exact
working directory and unique `n93-cfs-*` labels. Native image observations
are recorded above; they are not fictitious shell receipt claims.

No DB/env/app/dependency/paid-model access, other-chat/history inspection,
author answers, draft, learner views, or foreign output manifests.
No existing edits were overwritten or reverted.
No full semantic review schema is claimed without a draft snapshot.
STOP: awaiting parent binding before BLIND disclosure.
