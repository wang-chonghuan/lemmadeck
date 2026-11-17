# STEMROBIN-180 b58 Independent FULL TEXT REVIEWONLY: n19

Date: 2026-11-17. Same existing invocation, cwd `/Users/yong/.codex/worktrees/0f12/lemmadeck`.

**FIRST verdict: REVISE. One P3 finding: ex4's top-level modern `lines[0]` still names the Kremlin clock tower while modern `text` correctly uses a generic tower. All 7 complete prose blocks and all 4 written questions were reviewed. No scientific, formula, numeric-data, task-preservation or ordinary-model solvability defect was found in the canonical modern text.**

## Exact Actionable Finding

**[P3 / F1] Synchronize ex4's duplicated modern line with its already adapted text.**

- File: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b58-angular-speed/work/adapt/8p/modern-us-neutral/lessons/phy8-c1-s3-n19/exercises.template.json`.
- Location: line 71, JSON pointer `/exercises/3/lines/0`. The correct canonical modern question is at line 69, `/exercises/3/text`.
- Current modern line: `4. 如果克里姆林宫钟楼自鸣钟的分针长度为 3.5 米，那么，分针针尖的线速度等于多少？试把这个分针的角速度与手表的分针角速度进行比较.`
- Requested author change: make the top-level modern line match `text`: `4. 如果一座钟楼的分针长度为 3.5 米，那么，分针针尖的线速度等于多少？试把这个分针的角速度与手表的分针角速度进行比较。`
- Retain `3.5 米`, the tip's linear-speed task, the wristwatch minute-hand angular-speed comparison, ex number 4, group `练习 14` / `g1`, and `p0096#8`. Do not introduce a new named tower.
- Do **not** change the faithful historical text in `/exercises/3/source_text` or `/source/data/exercises/3`, or any raw source file.
- Impact is a conflicting duplicated modern-text field, not an observed learner-display leak. Narrow read-only contract inspection shows `modern_exercises` creates top-level `lines` from modern `text` (`edition.py:344`), whereas the offline renderer reads `e.text` (`render_lesson.js:318`). Layout normalization only rebuilds `lines` when it changes `text` (`edition.py:754`); it is not evidence that this mismatch was fixed. No renderer or normalization command was run.

Ex3's top-level `lines` differs only in sentence stops and spacing, not meaning, culture, data or tasks; it is not a second finding. Historical wording inside explicit source snapshots is legitimate provenance and was not counted as unadapted modern prose.

## Scope And Independence

- Initial SHA256 values for the three raw inputs and three templates were measured and saved **before content reads**. Both output destinations were confirmed absent before creation.
- Read `.intentfold/readme.md`, product/engineering charters, relevant IntentFold routing and lesson/edition text contracts. This is continuation of the user's bounded review, not a new capability invocation. No freshness, setup, project/backend lookup, Git or DB operation occurred.
- The learner's job, from the product charter: independently understand this circular-motion lesson and work its original questions. Definitions, derivations, units and supplied-model sufficiency were judged against that job, not against author acceptance claims.
- Raw lesson JSON, full lesson Markdown, all four raw exercises, and the three complete modern templates were read, including source snapshots, duplicated `lines`, change declarations and empty figure lists. Nothing was sampled.
- Source pages 95/96 and the two supplied approvals were read as **text only for provenance and source bindings**, not as scientific proof. Public primary units/year references were discovered with web search attempts and read with `cloak-fetch`; independent reasoning below establishes the physics.
- **Images loaded: 0.** Raw and modern lesson figure lists, every exercise's figure references/lists, and `figures.template.json` are empty. No image, answer, choice, interaction, rendered preview or DISPLAY artifact was opened.

## Complete Prose Coverage: 7/7

Block numbers below are one-based; JSON `prose` indices are zero-based. Lines refer to the modern lesson template's top-level `text`.

| Block / Line | Full Source Binding | Entire Block Review |
| --- | --- | --- |
| B1 / 16 | `p0095#4`, printed 83 | Retains the section 18 reference, radius/central-angle representation, equal angles in equal times, elapsed-time division and omega notation. `omega = phi/t` is correct for uniform circular motion when phi is the swept angle over that interval, including accumulated turns rather than a final angle modulo one turn. Definition is an angular rate, not a distance rate. PASS. |
| B2 / 32 | `p0095#5`, printed 83 | Complete naming convention retained: call the rotating radius's angular rate the moving point's angular rate. This does not claim the material point must spin about its own center. PASS. |
| B3 / 48 | `p0095#6`, printed 83 | Entire bold definition preserved: swept radius angle divided by the time for that sweep, explicitly for uniform circular motion. No omitted qualification, reversed ratio or spurious vector assertion. PASS. |
| B4 / 64 | `p0095#7`, printed 83 | Both premises and conclusion retained: angle in radians, time in seconds, angular rate in radians per second. Does not call radians degrees or Hz. PASS. |
| B5 / 80 | `p0095#8` + `p0096#1`, printed 83-84 | Complete long block reviewed: path length l divided by time t, m/s, uppercase V, equality with magnitude of instantaneous velocity in uniform circular motion, radians relation phi=l/r, omega=l/(r*t), l=V*t, omega=V/r, and V=omega*r. Here l is traveled arc length, not chord or displacement magnitude; V is scalar speed, not a fixed-direction velocity vector. Both cross-page formulas are present and closed. PASS. |
| B6 / 97 | `p0096#2`, printed 84 | Complete discussion retained: rotations per unit time, 2*pi radians per turn, n turns in the chosen unit interval, and omega=2*pi*n. The formula uses a frequency/rate, not an arbitrary total rotation count. When n is turns/s, omega is rad/s; a turns/min value gives rad/min unless converted. No incompatible time units are supplied by this block or the questions. PASS. |
| B7 / 113 | `p0096#3`, printed 84 | Complete frequency name, inverse-frequency interpretation, one-turn duration, uppercase T and T=1/n=2*pi/omega retained. n=0 would not define a finite rotation period; the described rotating motion uses positive frequency. Seconds for T require reciprocal seconds for n and rad/s for omega. PASS. |

All seven modern blocks differ from their raw source text only by sentence stops and adjacent layout spaces. Every math token, variable case, operator, numerator/denominator and numeric token is unchanged. Both ordinary and bold prose were checked in full.

## Complete Question Coverage: 4/4

All questions retain original internal/source numbers `1`-`4`, group `练习 14`, `group_id: g1`, one page-block binding each, and zero figures. No extra questions or tasks were inserted.

| Question / Modern Text Line | Binding | Full Question And Independent Solvability Review |
| --- | --- | --- |
| ex1 / 10 | `p0096#5` | Both requests preserved: what angular speed is, and its measurement unit. The full definition and rad/s convention are supplied by B1/B3/B4. No numerical or contextual alteration. PASS. |
| ex2 / 29 | `p0096#6` | Requests the angular/linear-speed relation. B5 supplies V=omega*r and omega=V/r; r is the circular-path radius. No radius value is necessary for a symbolic relation. PASS. |
| ex3 / 48 | `p0096#7` | Both requested Earth-around-Sun rates preserved, with exactly **150000000 km orbital radius**. This is not Earth's surface radius or axial rotation. Ordinary textbook model: one approximately circular, uniform orbit per year. Radius alone cannot determine a rate in an abstract circle, but Earth's ordinary one-year period supplies the intended model; no gravitational calculation or additional named object is needed. The exercise does not specify a particular day-count precision, so results must remain approximate. Independent calculation below verifies sufficiency without changing the data. Canonical text PASS. |
| ex4 / 69 | `p0096#8` | Canonical scene is **one generic clock tower**, no new named tower; exactly **3.5 m minute-hand length**, tip linear speed and comparison with wristwatch minute-hand angular speed preserved. Ordinary operating analog clocks complete a minute-hand revolution in one hour; both have the same period irrespective of hand length. Both tasks are solvable; no wristwatch hand length is needed because its tip speed is not asked. Canonical text PASS; duplicated modern `lines` REVISE only for F1. |

## Independent Physics And Arithmetic

This is verification work, not an answer-key artifact, and no existing solution was consulted.

For a fixed radius r, the radians definition gives traveled arc length `l=r*phi`. Uniform motion therefore gives `V=l/t=r*(phi/t)=r*omega`. As an independent velocity check, a circular parameterization `x=r*cos(omega*t), y=r*sin(omega*t)` has derivative magnitude `sqrt((r*omega*sin)^2+(r*omega*cos)^2)=r*omega`; its direction varies. Thus uniform circular **speed** need not imply constant velocity. Over a duration t with N turns, `phi=2*pi*N` and `n=N/t`; hence `omega=2*pi*n` and one-turn period `T=1/n=2*pi/omega`. These results do not depend on transcription approvals.

- **ex3:** retain `r=150000000 km=150000000000 m`. With a 365-day classroom year, `T=365*24*60*60=31536000 s`, giving `omega=2*pi/T=1.9923849908611068e-7 rad/s` and `V=omega*r=29885.7748629166 m/s`, approximately `29.9 km/s`.
- **ex3 time precision:** with 365.25 days, `T=31557600 s`, giving `omega=1.991021277657232e-7 rad/s` and `V=29865.31916485848 m/s`. The speed ratio between the two conventions differs from 1 by about `0.0685%`. Both round to the same ordinary `2.0e-7 rad/s`, `3.0e4 m/s` estimate. This is not permission to demand a unique many-digit result or replace the stipulated radius. Day-to-second conversion here uses ordinary 24-hour calendar days, not a rounded sidereal axial-rotation period.
- **ex4:** `r=3.5 m`, `T=60*60=3600 s`, `omega=2*pi/3600=0.0017453292519943296 rad/s`, `V=3.5*omega=0.006108652381980153 m/s`. For the tower/watch comparison, `omega_tower/omega_watch=T_watch/T_tower=1`. No inference about equal tip linear speeds is made.

NIST's SI tables independently support m/s, rad, Hz and rad/s distinctions. NASA's Earth facts distinguish the roughly 365.25-day orbit from calendar-year and daily-rotation conventions. Exact public page addresses, read results and evidence limits are recorded in `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-angular-speed-text-review/public-primary-reference-notes.md`. Search discovery returned no usable results; the successful primary page reads, not nonexistent search snippets, supplied this corroboration.

## Source Equality And Historical Boundaries

The completed read-only structured comparison found:

- Raw `lesson.md` is exactly the title plus all seven raw JSON prose blocks, including order and final newline.
- Both templates' `source.data` objects deeply equal the corresponding complete raw JSON; their `source.sha256` fields equal independently measured raw file hashes.
- All seven raw prose texts equal the concatenated lines of their independently enumerated page-block bindings; all four raw question texts equal the source exercise lines. Both modern and raw bindings agree with the same enumeration.
- Every modern `source_text` exactly equals its raw counterpart. Canonical prose/question changes are only layout, except ex4's declared `context` substitution from the original named tower to a generic one. All numeric lists match independently; `numeric_changes` is empty throughout and no hidden data changes were found.
- There are no source or modern mathematical errata in these target inputs. No erratum, correction, source approval or failure status was synthesized.

Supporting text bindings, measured during this review:

| Supporting File | SHA256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/pages/0095/page.json` | `3e6121da22f8ba5a1b0fa854e7d329e01f7f2ffdf111b2c2e3fa31e296821962` |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/pages/0096/page.json` | `bccfe0ca0709ab790ec8c5a846fd9340e79ba264ba148cf9cba0d9388cd6dce0` |
| `.intentfold/tickets/STEMROBIN-180/source-review-8p9596-b58.md` | `dcecd24c49c6b74cca09726cfc57d8979e4bcd9f5abcd334b3273528308b727f` |
| `.intentfold/tickets/STEMROBIN-180/source-review-8p95-period-affected-b58.md` | `a9c570fa3805523df306e8661ad0b93a1373cf16840ef575f8b5b70b22237f7c` |

The first source review's REVISE and later affected-only punctuation PASS remain distinct historical records. Neither becomes physics proof or a rewritten FIRSTPASS. The incoming p0095#2 punctuation repair lies outside this lesson's bindings; this review did not repair or re-review it. The visible next-lesson boundary and all historical **HOLD / OPEN / UNCLAIMED** states remain untouched. Parent-owned source161 repair and n39 empty answers were not inspected or handled.

## Six-Input FIRST Hash Seal

All paths in this table resolve under the exact cwd above. Initial hashes were measured before reading content; the completed comparison independently remeasured them at its start and end, with **6/6 exact equality**.

| Input Path | Initial And Closing SHA256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/phy8-c1-s3-n19/lesson.json` | `470bd3e2710678aa4f8d6decbafe1dde48a83570d8a5bfd3b0c0341477c01742` |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/phy8-c1-s3-n19/lesson.md` | `6bc5c17ca7767ab72d6b521a3994ee081d9e8420b29b610ce99dae0fc9f47595` |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/phy8-c1-s3-n19/exercises.json` | `74e10c93f7da64ebafafc4feffb74f1e48138a500294fb721149851d1c4b84cf` |
| `.tmp/ld-s10y-lesson/b58-angular-speed/work/adapt/8p/modern-us-neutral/lessons/phy8-c1-s3-n19/lesson.template.json` | `e48ce60882300cf31b3bdcade214d291860fa5bb18b27534c0186edbb735ca2a` |
| `.tmp/ld-s10y-lesson/b58-angular-speed/work/adapt/8p/modern-us-neutral/lessons/phy8-c1-s3-n19/exercises.template.json` | `ff94b64e83ed7a0ff46d689893ae4cb49dc5b87bca7e661101401b75faaf22e6` |
| `.tmp/ld-s10y-lesson/b58-angular-speed/work/adapt/8p/modern-us-neutral/lessons/phy8-c1-s3-n19/figures.template.json` | `333e82eda65dd362210bfa3290a4d130f4c22cf683258be0af2145b8df7e4a24` |

FIRST manifest: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-angular-speed-text-review/input-hashes-first.sha256`, SHA256 `1006d63132148e0ed88ba351ad4819392853b72b31100d4beb727a0e22e2fa98`.

Complete comparison/arithmetic evidence: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-angular-speed-text-review/independent-text-comparison.json`. The first offline comparison exited 1 because its predicate did not allow removal of source spaces after sentence stops; that attempt is preserved separately in `FIRST-comparison-failure.md`, not relabeled as a pass. The subsequent completed read-only comparison exited 0 with separate exact math/numeric checks. Neither command invoked a lesson pipeline gate or altered any input.

Narrow supporting tool-text hashes: `edition.py` = `1e6f02be38091f4ed944bba30fad525b22aa39ddc965e41616621eb2e4c673a1`; `render_lesson.js` = `b281febf489d97e67dd6765fc0862740b5b11851ef5d2cdc054285a58d230d8d`. No tool file was changed.

## Immutable FIRST And Stop

This new report is the immutable FIRST text-review record for these frozen inputs: write once, retain its **REVISE** verdict. Its byte-identical `FIRST-review.md` snapshot and external `report-seal.sha256` live only in the newly owned evidence directory. Any future affected review must be a separate artifact, not an edit to this report.

Writes are confined to this new report and `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-angular-speed-text-review/`. No source, template, existing report, dirty edit, historical FIRST failure or HOLD artifact was changed. No repair, pipeline gate, finalize, assemble, promote, answer generation, DISPLAY or publication was performed or authorized by this report.

**REVISE for F1 only; text-only return, then STOP.**
