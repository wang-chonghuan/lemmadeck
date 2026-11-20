# STEMROBIN-180 n129 independent ANSWER SOURCE

Status: **SOURCE PASS**. This is an independently derived source solution and facet review, not approval of any candidate answer key, CHOICE key, finalization, publication, or final Gate 2.

## Scope and binding

- Workdir: `/Users/yong/.codex/worktrees/stemrobin-180-resume/lemmadeck`.
- Lesson: `phy7-c2-s2-n129`; book identity `7p` comes from the assignment, not a separately opened book artifact.
- Read only the three current exercises and their embedded original `source.data`, and candidate `prose[0,1,2,3,6]`. Instruction reads were limited to the session/engineering router, answer cap2/Gate 2, and production-resume.
- No author answer, parent candidate answer, CHOICE draft/key, other ticket output, raw lesson file, image, DB, environment, service, paid probe, network, git, publish, handoff, or other-chat message was used.
- All three solutions were derived before any author answer/key inspection; none was inspected at any time.
- Figures required/read: `0/0`. All three exercises have empty `figure_refs` and `figures`. `graph273` is only the supplied cross-course prose reference to the experiment, not a structural figure or missing dependency.
- Original tasks are the embedded `exercises.template.json` `source.data` tasks. Its declared raw source SHA-256, `96db942c7ed933a14d5340bcb215431cd25e2d202c6dd78a1cc83b6445cae228`, is provenance metadata only: the raw file was not opened or independently hashed.
- Printed-page binding: the experiment/definitions have `printed_page: 314` at `p0325#9/#10/#11/#12`; the convention has `printed_page: 315` at `p0326#1`. Tasks carry `p0326#3/#4/#5`, placing them on that source page. Their exercise objects do not separately expose a printed-page field.

Actual full-file input SHA-256, recorded at the first selected-field read and checked again after writing these source solutions:

| Input under the absolute workdir | Before | After |
| --- | --- | --- |
| `.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n129-text-author/candidate.template.json` | `6a5c4e71590a82aabcd353bc00392962464616ac9e5ba22188a68ff44d68c7a9` | See verified manifest |
| `.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n129-text-author/exercises.template.json` | `90bb28a83f82e1e444fe5e6ba43b39ca55b65d5327739c427e76a4e53581a394` | See verified manifest |

Full-file hashing does not make unselected JSON fields evidence; only the authorized fields were displayed or used.

## Task 1

Identity: `phy7-c2-s2-n129 / g1 / 1`; group `问题`; exercise number `1`; original source number `1`; source ref `p0326#3`.

Original and current written task:

> (1) 根据哪些现象可以得出电路中的电流具有一定方向的结论？

完整源解：在所述硫酸铜溶液实验中，铜只在与电源负极相连的电极上析出。交换两根导线与电源两极的连接后，原先的另一个电极现在连接电源负极，铜便改在这个电极上析出。同样，在这个电路中接入电流计，交换电源两极的连接会使指针从零刻度向与原来相反的方向偏转。这两种随接线极性改变而改变的现象说明，电流具有一定的方向，电流的某些效应与方向有关。

推理：铜析出并非任意发生在两个电极之一，而是随负极连接移到另一个电极；电流计也不只是“有偏转”，而是偏转方向随之反转。二者提供方向性证据。这里不能把“电流有方向”直接当作支持它的实验现象，也不需要给出铜的电化学反应方程式。

Facet coverage: `4/4`.

1. `T1-F1`: copper initially deposits on the source-negative-connected electrode.
2. `T1-F2`: swapping terminal connections moves deposition to the other, now source-negative-connected electrode.
3. `T1-F3`: the galvanometer deflects from zero in the opposite direction after polarity reversal.
4. `T1-F4`: these changes support definite current direction and direction-dependent effects, not a claim that every effect reverses.

Evidence: `prose[0] / p0325#9`, `prose[1] / p0325#10`, `prose[2] / p0325#11`.

Applicability: original and current tasks coincide; the answer is specific to the supplied experiment. No figure-dependent location or unobserved apparatus detail is needed.

Grading rationale: recommend `grading: "ungraded"` with a complete explanatory `displayAnswer`. This is an open experimental-evidence explanation; current cap2 judges `exact`, `numeric`, and `expression` do not reliably judge equivalent Chinese prose. Do not invent a semantic/LLM runtime judge or a mathematical `expected`. For a human facet check, require both experimental effects and the negative-electrode/polarity relationship; an unexplained “电流有方向”, only “指针偏转”, or copper deposition at the positive-connected electrode is incomplete or incorrect.

## Task 2

Identity: `phy7-c2-s2-n129 / g1 / 2`; group `问题`; exercise number `2`; original source number `2`; source ref `p0326#4`.

Original and current written task:

> (2) 把哪种带电粒子的运动方向取为导体中电流的方向？

完整源解：把正电荷移动或可能移动的方向规定为导体中的电流方向。这是电流方向的约定，并不是说所有导体中实际运动的载流粒子都是正电荷。在金属导体中，载流粒子是带负电的电子，电子的定向移动方向与规定的电流方向相反；在电解质中，正、负离子都可以参与导电，它们在电场作用下向相反方向定向移动。

推理：问题问的是“取为”电流方向的约定，而不是辨认所有导体的实际载流粒子。约定中的“可能移动”允许在金属中使用这一方向定义，不需要让金属中的正离子实际自由移动。

Facet coverage: `4/4`.

1. `T2-F1`: the defining sign is positive charge.
2. `T2-F2`: the definition includes actual or possible movement, not a requirement that positive carriers move in every conductor.
3. `T2-F3`: conventional current direction is distinguished from the opposite electron drift in metal.
4. `T2-F4`: no universal claim that positive and negative charges can both freely move in every conductor; electrolyte ion movement is not confused with metal conduction.

Evidence: `prose[6] / p0326#1`, with carrier distinctions from `prose[3] / p0325#12`.

Applicability: original and current tasks coincide. The convention applies without assuming that the actual carrier is always positive. The historical explanation in the prose is not a present-day physical assertion.

Grading rationale: recommend `grading: "ungraded"` with explanatory `displayAnswer`. Although the concept has a definite answer, it is expressed in natural-language equivalents, not any of the three supported mathematical judge domains. For a human conceptual check, “正电荷的运动方向” is sufficient as the core identification; a full source solution retains “或可能移动” and the convention/carrier distinction. “电子移动的方向” or “所有导体中都由正电荷移动形成电流” is incorrect. Do not require students to recount scientific history or list electrolyte carrier details in order to answer the asked sign.

## Task 3

Identity: `phy7-c2-s2-n129 / g1 / 3`; group `问题`; exercise number `3`; original source number `3`; source ref `p0326#5`.

Original written task:

> (3) 在电路中电子是从电源的哪一极运动到哪一极？

Current written task:

> (3) 电源正常向外部金属电路供电时，导线中的电子定向移动是从电源的哪一极到哪一极？

完整源解：在电源正常向外部金属电路供电时，导线中的电子净定向移动方向从电源负极指向正极。因为规定的电流方向是正电荷移动或可能移动的方向，所以这时外部电路的电流方向从正极指向负极；电子带负电，其定向移动方向与规定的电流方向相反，因而是负极到正极。

推理：先限定正常供电的外部金属电路，再用本课明确的“电流方向与电子定向移动方向相反”关系得到负极到正极。这里说的是电子总体的净定向移动，不是声称每个电子只做单向运动，也不是把同一结论无条件推广到电源内部、充电过程或电解质。

Facet coverage: `4/4`.

1. `T3-F1`: applicability is a normally powering source and its external metal circuit.
2. `T3-F2`: net electron drift is source-negative to source-positive.
3. `T3-F3`: conventional external current is source-positive to source-negative; electron drift is opposite because electrons carry negative charge.
4. `T3-F4`: the original shorthand is resolved by the current explicit scope; there is no universal assertion about internal-source paths, charging, electrolytes, or each electron's entire motion.

Evidence: `prose[3] / p0325#12`, `prose[6] / p0326#1`.

Applicability: the current task provides the needed physical scope. The original wording is interpreted in that same ordinary external-metal, normally-powered lesson context, not approved as an unrestricted assertion about every possible circuit. Its recorded changes are `wording` and `conditions`; no numerical change occurred.

Grading rationale: recommend `grading: "ungraded"` with explanatory `displayAnswer`. This is a directional verbal answer with a definite physical meaning, but neither a numeric result nor a mathematical expression reliably suited to the available judges. A human core-response check accepts “从负极到正极” or an equivalent negative-to-positive formulation in the current question's already stated scope. Do not demand that a short student answer repeat every premise. Reverse polarity order, the conventional-current direction substituted for electron drift, or a universal claim covering the source interior is incorrect. No CHOICE conversion or draft key is produced.

## Source verdict and recovery

- Tasks solved: `3/3`; unique source task identities: `3`; groups: `1` (`g1`).
- Facets covered: `12/12`; unresolved source/physical facets: `0`.
- Suggested prose grading: `ungraded` for all `3`; mathematical/automatic parts: `0`. These are source recommendations, not changes to an author answer artifact.
- SOURCE PASS means the authorized original/current tasks are independently solved with identities, evidence, scope and applicable grading rationale. It does not mean the whole author-key Gate 2 has run or passed.
- Author comparison, answer preparation/finalization, source capture/assembly/freeze, MathLive, browser checks and publication were not performed and are outside this assignment.
- The pre-existing rate error referred to by the supervisor was not reopened, overwritten, reconstructed, or replaced. Its exact text/retry-after is not available in these authorized inputs. No new rate error occurred and no rate-limited call was retried.
- One local path-discovery command returned exit code `2` because the owned scratch directory did not yet exist. Its exact diagnostic was: `rg: .intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n129-ANSWER-SOURCE: No such file or directory (os error 2)`. This technical finding was resolved by creating only the authorized scratch outputs, not classified as a content HOLD.
- No pre-existing owned scratch directory or named report existed when checked; no existing file was replaced.

Bound output manifest:

`/Users/yong/.codex/worktrees/stemrobin-180-resume/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n129-ANSWER-SOURCE/manifest.json`

Its companion `manifest.sha256` binds the manifest without a recursive self-hash. The manifest and companion are read-only (`0444`); the manifest records actual before/after input and payload-output hashes.
