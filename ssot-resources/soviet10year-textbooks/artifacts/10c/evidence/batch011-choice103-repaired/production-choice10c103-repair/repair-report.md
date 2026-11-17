# STEMROBIN-184 Session B Choice Repair

Status: q01/q02 repair authored; scoped equality/frequency checks passed; the first structural validator ran exactly once and passed. Semantic review remains pending. `view-only.json` has not been created: the permitted inputs do not specify its outer envelope, and reading the existing view is not authorized. An envelope-only read authorization or parent-supplied envelope is awaited. This is a partial handoff, not semantic approval.

## Authority And Scope

The sole mathematical authority is `../production-choice10c103/seed.json`. Only the rejected current draft may supply the unchanged question envelope and existing reproducible errors. This sidecar owns only `production-choice10c103-repair/`; existing candidate, view, reviews, screenshots, source/book files and standard answers remain untouched. No images, network, model, database, publisher, dependency, interaction, old tests, unrelated ticket artifacts, preparation rerun or browser work is authorized. Parent/reviewer owns later semantic review and WITH-review validation.

## Independent Mathematics Before Alternatives

The following full solutions were authored from seed exercises 440/441 and selected definition blocks 0, 1, 4, 5 before reading the rejected draft.

### Source 440

With upward positive, initial upward velocity `v0 > 0`, constant gravitational magnitude `g > 0` (approximately 9.8 in the source), and no air resistance, acceleration is `a(t) = -g`. Integration gives `v(t) = v0 - gt` and `y(t) = y0 + v0*t - g*t^2/2`.

At the apex, `v(tH) = 0`, hence `tH = v0/g`. Substitution gives the maximum rise above the launch point `H = v0^2/(2g)` and apex velocity `0`. The apex altitude above ground is `y0 + H`, so rise and absolute altitude must not be conflated.

The full ground-return task needs the launch height. If `y0 = 0`, solve `t*(v0 - gt/2) = 0`; discard the launch instant `t = 0` and obtain `T = 2v0/g`. If launch height above ground is an unspecified `y0 >= 0`, the positive root is `T = (v0 + sqrt(v0^2 + 2g*y0))/g`. The source prose does not explicitly give launch height; ground launch is therefore an assumption to state visibly, not an inferred source fact. This ambiguity and the loss of independent derivation in a choice response must remain honest.

The meaningful response is the coherent maximum-rise/apex-velocity/return-time result, distinguishing a stationary instant from the end of motion and an ascent time from the full flight time.

### Source 441

For `v(t) = 9.8t - 0.003t^2 = t*(9.8 - 0.003t)`, both factors are nonnegative on `0 <= t <= 5`; the second is at least `9.785 > 0`. Thus distance equals the velocity integral here, rather than being assumed to equal signed displacement for all motion.

`s = integral_0^5 v(t) dt = [4.9t^2 - 0.001t^3]_0^5 = 122.5 - 0.125 = 122.375`.

Acceleration is the derivative of velocity: `a(t) = 9.8 - 0.006t`, hence `a(5) = 9.77`. Independently, endpoint velocity is `v(5) = 49 - 0.075 = 48.925`; this is velocity, not acceleration. The source does not name measurement units, so these numeric results retain its implied consistent unit system without silently supplying a new source unit.

The meaningful response jointly determines distance over an interval and acceleration at its endpoint; integration and differentiation answer different parts of this task.

## Exact Repair Units

The independent solution section above was created before the rejected draft was opened. The rejected draft then supplied only the approved unchanged question content and existing error procedures. No standard answer was consulted.

All four original questions remain mathematically/source-approved as the human stated; this repair does not reopen or change q03/q04. The current q01 stem already preserves an unknown launch height `h0 >= 0`, defines `v0 > 0` as the initial vertical component, and asks only for vertical apex velocity. Its stem, entire intent, concept blocks and limitations remain unchanged. In that visible setting the correct later ground root is always `Tplus = (v0 + sqrt(v0^2 + 19.6*h0))/9.8`. The ground-launch simplification in the independent derivation above is conditional only and has not been introduced as a stem assumption. If the original throw is oblique, the complete apex velocity is `(vx0, 0)`; no missing horizontal component or angle has been silently supplied.

| Unit | Rejected value | Repaired value |
| --- | --- | --- |
| q01 A, apex velocity | `0` | `-v0` |
| q01 B, return time | `Tplus` | `(sqrt(v0^2 + 19.6*h0) - v0)/9.8` |
| q01 D, maximum rise | `v0^2/19.6` | `v0^2/9.8` |
| q02 C, distance | `244.625` | `122.125` |
| q02 C, endpoint acceleration | `9.77` | `48.925` |

Exactly four visible option-text strings changed: q01-A, q01-B, q01-D, q02-C. Each changed option also has its full internal `derivation` and `misconception` replaced to describe every now-wrong component: exactly 12 JSON string leaves in total. No other leaf changed.

The exact changed JSON pointers are:

```text
/questions/0/view/options/0/text
/questions/0/view/options/1/text
/questions/0/view/options/3/text
/questions/0/key/rationales/0/derivation
/questions/0/key/rationales/0/misconception
/questions/0/key/rationales/1/derivation
/questions/0/key/rationales/1/misconception
/questions/0/key/rationales/3/derivation
/questions/0/key/rationales/3/misconception
/questions/1/view/options/2/text
/questions/1/key/rationales/2/derivation
/questions/1/key/rationales/2/misconception
```

### Full Changed Rationales

The following are the complete replacement rationale strings, not shortened error labels.

**q01 A, incorrect**

Derivation: 高度由最高点时刻t_peak=v0/9.8代入v0*t-4.9*t^2，正确得到H=v0^2/19.6。速度却把最高点与回到抛出高度的时刻t=2*v0/9.8混淆，代入v_y=v0-9.8*t得到-v0而非0。落地方程的两个根是(v0±sqrt(v0^2+19.6*h0))/9.8；错误选取非正的减号根并取绝对值，得到T=(sqrt(v0^2+19.6*h0)-v0)/9.8。h0=0时该时间为抛出瞬间0，而非后续落地时间。速度与时间两项均错，故完整结果组不成立。

Misconception: 同时将回到抛出高度时的向下速度用于最高点，并把落地方程非正时间根的绝对值当作后续落地时间。

**q01 B, incorrect**

Derivation: 正确求得上升时间t_peak=v0/9.8后，错误地把整个上升阶段按初速度匀速计算，H=v0*t_peak=v0^2/9.8，遗漏速度逐渐降到0的影响。最高点竖直速度v_y=0正确。落地方程的两个根是(v0±sqrt(v0^2+19.6*h0))/9.8；错误选取非正的减号根并取绝对值，得到T=(sqrt(v0^2+19.6*h0)-v0)/9.8，而非后续落地的正根。高度与时间两项均错，故完整结果组不成立。

Misconception: 同时用初速度乘整个上升时间代替对递减速度积分，并把落地方程非正时间根的绝对值当作后续落地时间。

**q01 D, incorrect**

Derivation: 正确求得上升时间t_peak=v0/9.8后，错误地把整个上升阶段按初速度匀速计算，H=v0*t_peak=v0^2/9.8，而非对递减速度积分所得的v0^2/19.6。速度又把最高点与回到抛出高度的时刻t=2*v0/9.8混淆，代入v_y=v0-9.8*t得到-v0而非0。解h0+v0*T-4.9*T^2=0并选择后续落地的正根，时间T=(v0+sqrt(v0^2+19.6*h0))/9.8正确。高度与速度两项均错，故完整结果组不成立。

Misconception: 同时用初速度乘整个上升时间代替对递减速度积分，并将回到抛出高度时的向下速度用于最高点。

**q02 C, incorrect**

Derivation: 第一项9.8*t被正确积分为4.9*t^2，但把∫0.003*t^2 dt错写为0.003*t^3而不除以3，得到S=4.9*25-0.003*125=122.125。又把速度函数本身在终点的值v(5)=9.8*5-0.003*25=48.925当成加速度，没有先对速度求导。正确路程为122.375，正确加速度为9.8-0.006*5=9.77；两项均错，故完整结果对不成立。

Misconception: 同时在二次幂积分时遗漏除以新指数3，并把终点速度的函数值当成终点加速度而省略求导。

All option IDs, truth labels and correct keys remain unchanged. q01-C's complete correct rationale and q02-A/B/D's complete rationales remain unchanged. Existing errors have been combined rather than replaced by invented nearby values. The old q02-C terminal-speed-times-duration error is removed only from that affected option; its replacement combines the existing q02-A integration error and q02-D acceleration confusion.

## Component-Frequency Evidence

For q01 use `Hc = v0^2/19.6`, `Hw = v0^2/9.8`, `Vc = 0`, `Vw = -v0`, `Tc = Tplus`, `Tw = (sqrt(v0^2 + 19.6*h0) - v0)/9.8`.

| Option | H | Apex vertical velocity | Return time | Full truth |
| --- | --- | --- | --- | --- |
| A | Hc | Vw | Tw | incorrect |
| B | Hw | Vc | Tw | incorrect |
| C | Hc | Vc | Tc | correct |
| D | Hw | Vw | Tc | incorrect |

Actual visible-string counts: `Hc` occurs at A/C and `Hw` at B/D; `Vc` at B/C and `Vw` at A/D; `Tc` at C/D and `Tw` at A/B. Every column has exactly two occurrences of each value. Thus no uniquely most-frequent component, and no uniquely assembled modal tuple, identifies C. The options have identical field order and comparable notation; internal error explanations are not visible.

The wrong q01 components cannot become correct at a permitted boundary: `Hw = 2*Hc` with `Hc > 0`, `Vw = -v0 != 0`, and `Tc - Tw = 2v0/9.8 > 0` for every `v0 > 0`, `h0 >= 0`. At `h0 = 0`, `Tw = 0` is specifically the launch instant, not later ground return. All four tuples remain distinct and exactly C is fully correct.

| q02 Option | Distance | Endpoint acceleration | Full truth |
| --- | --- | --- | --- |
| A | 122.125 | 9.77 | incorrect |
| B | 122.375 | 9.77 | correct |
| C | 122.125 | 48.925 | incorrect |
| D | 122.375 | 48.925 | incorrect |

Actual visible-string counts: distance `122.125` at A/C and `122.375` at B/D; acceleration `9.77` at A/B and `48.925` at C/D. This is the complete two-by-two Cartesian product, with no modal tuple cue. Correct distance `979/8` and incorrect distance `977/8` differ by `1/4`; endpoint acceleration `977/100` and endpoint velocity `1957/40` are distinct. Exactly B is fully correct.

These observations address the authorized component-frequency defect only; they do not stand in for the parent's complete semantic leakage gate. The proposed route caused no mathematical issue, so no departure or gate weakening was needed.

## Recorded Equality Assertions

The sidecar's manually authored `verify-repair.mjs` was run once with:

```bash
node .intentfold/tickets/STEMROBIN-184/tmp/production-choice10c103-repair/verify-repair.mjs
```

Outcome: exit 0, JSON `outcome: pass`, exactly 12 allowed changed leaves. The program checks exact visible text before counting actual components, so the frequency table is not merely an assertion about an intended matrix.

- q03: `assert.deepEqual(repairedQuestion, rejectedQuestion)` passed; UTF-8 bytes of the complete canonical JSON question are equal; both canonical SHA-256 values are `7c67b1638201b7dd12e5bd0cdb3e9d79a82fae6ca47cab2a7db66a2059329e30`.
- q04: the same deep-value and canonical-byte assertions passed; both canonical SHA-256 values are `083b856c40004214e2a8a683550d3f587ceabdb78ca17b34f60cc7f4d472c95f`.
- The complete recursive diff equals the 12-pointer whitelist above, proving that IDs, stems, source numbers, concepts, keys, figures, coverage, all intents/limitations, all remaining options and all remaining rationales stayed equal.
- Every q01/q02 component has count distribution `[2,2]`; all four visible tuples per question are distinct; both keys stay C/B; seed and draft figure inventories are empty.

This is equality/component evidence, not an independently authored review and not an old test suite.

## Snapshot Hashes

Canonical JSON uses the contract's sorted-key, ASCII-escaped, separator-free representation encoded as UTF-8. Raw hashes cover complete on-disk bytes, including formatting and final newline.

| Artifact | Canonical SHA-256 | Raw SHA-256 |
| --- | --- | --- |
| Authority seed | `02950a8ca7ca60681040fff0150972ef34adfb328918bdaeeedd9911934640cf` | `103a6fda2ee82573be7af97b2f2906dccd7230334b5d6ee2b525ac645cad46da` |
| Rejected current draft, preserved | `a7149030c0401f0f187092b2182ef1d0c1e6d6ed4e5752b4d1b89aa2c5febffb` | `6bcd7db62f42c47fff24ea3cbc7e558a53a5da60ed2855545936720050301058` |
| Repaired draft | `ce35f566b5bf75b3a5cad497d3aa54e236f7f621c9d94098a0f28bcf79ff731e` | `99c86c2632881662d62d013f0d46ac668ea344605c2dd9c1e64f9c252d0fb836` |

No view snapshot hash is claimed because a new view has not been authored and the existing view has not been read or hashed.

## First Structural Validator, Exactly Once

```bash
node .intentfold/tickets/STEMROBIN-184/tmp/production-run-once.mjs \
  .intentfold/tickets/STEMROBIN-184/tmp/production-choice10c103-repair/structural-first \
  python3 -B .agents/skills/ld-s10y-choice/scripts/validate.py \
  --repo . \
  --seed .intentfold/tickets/STEMROBIN-184/tmp/production-choice10c103/seed.json \
  --draft .intentfold/tickets/STEMROBIN-184/tmp/production-choice10c103-repair/draft.json
```

The existing recorder was used without modification and refused pre-existing output paths. `python3 -B` prevents Python bytecode writes outside the owned directory. No `--review` argument was used.

Recorded start: `2026-11-17T03:41:11.194Z`. Recorded finish: `2026-11-17T03:41:11.229Z`. Exit code: `0`. Signal: `null`. Spawn error: `null`. Stdout: `mechanical checks passed; semantic review still required` followed by a newline. Stderr: empty.

Evidence:

- `structural-first/command.json`, raw SHA-256 `cd4c66c260beed62eefd73e41a4caf5c78fcbff4b1438a1bfbd89617a2fc1bd3`.
- `structural-first/stdout.txt`, raw SHA-256 `1c46f6519fd9f330b0c6109ab08c85474ff02f961f0fb5eb11550590e646f90b`.
- `structural-first/stderr.txt`, raw SHA-256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

The validator's required source-freshness projection reads the four seed-traced source JSON files and imports its local preparation helper; these were not opened for mathematical authoring. Their later direct access was bytes-only SHA-256 accounting, not content inspection. Their hashes still match the seed trace. No prepare/inspect command was run and no source answer file was read. These accesses are explicitly listed in `load-ledger.md`; Python standard-library/runtime files are outside the project-text input ledger.

## Outcomes, Limitations And Stop

Author repair: complete. Full seed-only 440/441 solution: recorded before alternatives. q03/q04 equality: passed. Strict changed-leaf scope: passed. Two-by-two component counts: passed. First structural validation: passed once. Command/tool failures: none.

View envelope: unresolved authorization boundary, not a claimed pass. The contract specifies each question's `view`, but does not specify the separate `view-only.json` envelope. The user's instruction permits only the rejected candidate `draft.json` to be read. Accordingly the rejected view, reviews and screenshots remain unopened and untouched. An envelope-only read was requested in the session; neither learner text nor review evidence was read to infer it. No envelope was guessed.

Independent semantic review, new review JSON, WITH-review validator and browser evidence: deliberately not performed; owned by the parent/reviewer. No images, network/model calls, DB/publisher/dependency/interaction work, old tests, other ticket artifacts or source changes were performed. Manual authored text/code was written only with `apply_patch`. All output writes are within the new repair directory.

STOP AND WAIT for parent. Do not rerun structural validation or alter the repaired draft for envelope-only completion.
