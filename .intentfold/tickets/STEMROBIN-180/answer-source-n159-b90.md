# n159 b90 Independent ANSWER SOURCE

## Scope and Decision

- Ticket: STEMROBIN-180; existing cap3 invocation: 180-3; batch: b90; finish: review.
- Lesson: phy7-c2-s4-n159, modern-us-neutral, four original written questions in group g1.
- Local verdict: **PASS -- independent content solutions complete, approved DRAFT-TEXT stage only**.
- This is a frozen independent solver report, NOT an author answer key, candidate, interaction specification, finalized lesson, full cap2 gate approval, or publication approval.
- Historical FIRSTFAIL remains **UNKNOWN**. No older verdict, concurrent file, shared counter, or ticket/backend state was read, reset, or changed.
- All four questions are answerable from the full approved modern prose. Each has empty `figure_refs` and `figures`; the lesson still mentions three figures. This is NOT a claim that the lesson has no figures or that those figures are approved.
- `figures.json` remains UNAPPROVED and unread. Figure specifications, source PNGs, rendered images, choices, author drafts and candidate keys were not accessed.
- The independently collected TEXT report is accepted as PASS under the explicit instruction, with hash fe6762451a46fc6a7c453608ecc20ec7d8705a1d1546e5275d97a30fd8b108cd. SOURCE/RAW/TEXT reviews were not replayed.

## Bound Evidence

All paths below are under W = `/Users/yong/.codex/worktrees/0f12/lemmadeck`.

The manifest `W/.intentfold/tickets/STEMROBIN-180/tmp/b90-n159-answer-inputs.json` was read and bound before question reading. Binding time: 2026-11-19T07:37:32.723Z; full approved document reading time: 2026-11-19T07:37:38.343Z.

| Evidence | SHA-256 | Bytes |
| --- | --- | --- |
| Input manifest | 37c1e8589fee7a93f78916eda67c235e3afada05bbd5402cec316dc16a56ea35 | 2985 |
| Approved modern `lesson.json` | 7d10aa5f77ab675cc06463d1eba9df647207cc1c43f56766569718b406b1d7eb | 20797 |
| Approved modern `exercises.json` | ac627477efe274c2dfbafd77c81f3468c2c8d052c18196d0783c11bff8a51cda | 4177 |

The two approved documents are in `W/.tmp/ld-s10y-answer/b90-n159-inputs/artifacts/7p/editions/modern-us-neutral/lessons/phy7-c2-s4-n159/`. Their complete JSON was read without truncation. Only the modern `prose[].text` and modern question text govern the following solutions; embedded historical snapshots are not used to reverse modern scientific corrections.

Actual existence guards confirmed that original `answers.json` is absent both at `W/.tmp/ld-s10y-answer/b90-n159-inputs/artifacts/7p/answers.json` and `W/ssot-resources/soviet10year-textbooks/artifacts/7p/answers.json`. Neither file was read. Consequently all solutions below are independently **derived**, not copied from a book answer and not checked against an undisclosed author key.

## Independent Solutions

The written question labels （1）--（4） are preserved. The subheadings separate requested content, not new exercises or proposed input widgets.

### （1）什么是受话器和送话器？

Identity: `g1 / source_number 1`; question source reference: `p0402#10`.

**受话器：**电话筒中贴近耳朵收听的装置。它把电话线传来的电流变化，通过磁场和作用力的变化，转换成振膜的振动；振膜使附近空气振动，在接收处重新产生声音，供人听见。

**送话器：**电话筒中靠近嘴部讲话的装置，又叫微音器。它把声音引起的振膜振动转换成电信号的变化。本课的碳粒送话器利用振膜改变碳粉颗粒的接触和压力，从而改变电阻，调制外部电源提供的电流；不是靠声音本身提供线路电流的能量。

Evidence: modern prose at `p0400#11`, `p0400#13`, `p0400#14`, `p0401#6`, `p0401#10`, `p0402#7`, `p0402#8`.

Coverage: both devices, their distinct placement and conversion directions, carbon-transmitter qualification, external supply, and local sound production are present. A bare device name or “传送声音” is not a complete explanation.

### （2）送话器的构造如何？它是怎样工作的？

Identity: `g1 / source_number 2`; question source reference: `p0402#11`.

**构造：**本课介绍的是碳粒送话器。外壳1上装有碳靴2，碳靴的凹槽内装着碳粉5，碳靴通过衬垫4与外壳绝缘。振膜6是钢或经过压制的碳制成的薄片。外壳底部装有固定电极3，固定电极也与外壳绝缘。在有电源供电的简化电路中，电流经过振膜、碳靴、碳粉和电极3。

**工作过程：**说话时，声带振动，引起空气的声振动；声振动到达送话器振膜6，使振膜振动，改变碳粉5颗粒间的接触和压力，因而改变碳粉的电阻。在电源及其他条件不变的简化模型中，电阻变化使线路电流强度随之变化，电流变化反映振膜的振动。一般在这一模型内，碳粒压得较紧、接触改善时电阻减小、电流增大，反之电阻增大、电流减小；不需要假定未给出的电压、电阻数值或接线极性。没有声振动且条件保持不变时，电阻和电流保持不变。通话时的“脉动电流”是直流基础上的强弱变化，不表示电流方向不断反转。电流能量由电源提供，声音通过碳粒电阻变化调制电流，并非振膜直接发电。

Evidence: construction at `p0400#12` and `p0401#1`; supplied current path at `p0401#6`; operation at `p0401#8`, `p0401#9`, `p0401#10`. The resistance/current direction is a qualitative deduction within that supplied, otherwise fixed simplified circuit; it is not a measurement taken from a figure.

Coverage: all six numbered components; both insulation statements; carbon-powder location; both permitted diaphragm materials; supplied current path; voice/air/diaphragm/contact-pressure/resistance/current causal chain; quiet baseline; supply-energy distinction; pulsation without repeated current reversal. The prose mentions AB and BC as quiet and speaking portions of a graph, but no question requests graph reading and no graph values or geometry were inferred.

### （3）受话器的构造如何？它是怎样工作的？

Identity: `g1 / source_number 3`; question source reference: `p0402#12`.

**构造：**外壳2内装有带两个极靴的永磁铁3，极靴上套着用细导线绕成的线圈4。振膜1是圆形钢薄片，放在外壳2上，与极靴之间留有很小的空隙；盖板5把振膜1压在外壳2上。这里的编号属于受话器，不能与送话器的同号零件混用；文本没有给出线圈匝数、间隙尺寸或振膜厚度，不能自行补值。

**工作过程：**线圈中没有电流时，永磁铁仍会吸引钢质振膜，使它稍稍下凹。电流恒定时，线圈磁场与永磁铁磁场叠加，振膜保持相应的静态位置；恒定电流本身不会使它持续发出谈话声。线路电流强度变化时，线圈的附加磁场随之变化，与永磁铁磁场共同作用，改变振膜所受的吸引力。吸引力的强弱变化与振膜的弹性恢复作用使振膜在静态位置附近振动；它不是因本课电流方向反复反转而被交替吸引和排斥。振膜再使贴近它的空气振动，在听者所在地重新产生反映讲话声变化的声音。磁场、电流和声音之间的变化对应是本课简化模型的说明，不能据此保证真实电话的波形、响度或音色完全无失真。

Evidence: construction at `p0402#3` and `p0402#6`; no-current, constant-current and varying-current distinctions at `p0402#7`; local air and regenerated sound at `p0402#8`. Elastic recovery explains how a steel diaphragm returns as attraction weakens; it does not add an unprovided separate spring or reverse the attraction into repulsion.

Coverage: all five numbered components; permanent magnet with two pole shoes; fine-wire coils on the pole shoes; circular steel diaphragm; small noncontact gap; securing cover; zero-current magnetic attraction; constant-current equilibrium; changing coil field plus permanent field; changing attractive force; diaphragm motion and local air. “电磁铁产生声音” alone omits the mechanism and permanent magnet.

### （4）用电话谈话是怎样进行的？

Identity: `g1 / source_number 4`; question source reference: `p0402#13`.

**完整通话链：**讲话者把送话器靠近嘴部，声带振动，使当地空气产生声振动；空气使送话器的振膜振动，振膜改变碳粉颗粒的接触和压力，碳粉电阻因此改变。外部电源供电时，电阻变化调制电流强度；在本课的简化线路中，这种电流变化经电话线传到另一端受话器的线圈。线圈的附加磁场变化，与永磁铁磁场共同改变对钢质振膜的吸引力，使受话器振膜振动。振膜带动接收处附近空气振动，贴近受话器的耳朵及听觉系统便感知到重新产生的声音，听懂对方的讲话。对方回答时，对方送话器和原讲话者受话器按同样的转换链工作，双方以相同作用的装置进行通话。

因此，这一过程是“讲话端声振动 -> 送话器机械振动 -> 碳粒电阻变化 -> 电源提供的电流强弱变化 -> 电话线 -> 受话器磁场及吸引力变化 -> 受话器振膜振动 -> 接收端当地空气声振动 -> 听觉”的链条。沿线传递的是电信号的变化，不是讲话端的空气或声波直接沿电话线到达听者；脉动也不意味着线路电流方向不断反转。这里只说明早期有线电话的简化原理，不推断交换机、拨号、感应线圈、振铃、双工接线或现代数字通信结构，也不声称声音无失真复制。

Evidence: same-role devices and simplified connection at `p0400#11`; voice at `p0401#8`; supply/modulation at `p0401#6` and `p0401#10`; remote current change at `p0402#1`; receiver at `p0402#7`; local sound at `p0402#8`.

Coverage: every physical conversion and the line between the two ends; external supply; correct receiver mechanism; local air and hearing; reply through the counterpart devices; simplified-model boundaries. “声音通过电话线传过去” is not an adequate answer.

## Coverage and Practical Grading

| Original question | Required content facets | Independent result | Practical grading verdict |
| --- | --- | --- | --- |
| （1）, g1/1 | Receiver function; transmitter function | Both fully explained | ungraded |
| （2）, g1/2 | Full transmitter construction; full operation | Both fully explained, labels/materials/insulation preserved | ungraded |
| （3）, g1/3 | Full receiver construction; full operation | Both fully explained, labels/magnet/coils/gap preserved | ungraded |
| （4）, g1/4 | Complete conversation chain, including reply | Complete causal chain and model limits | ungraded |

Coverage is **4/4 original questions, 7/7 primary requested facets**, with no omission or duplication; explicit question-figure associations are **0/4**. Detailed conceptual coverage is frozen separately in `tmp/b90-n159-answer-SOURCE/source-coverage.json`.

All four require explanatory prose, not a uniquely normalized numeric, expression, or exact mathematical response. A faithful correct answer can use many phrasings, and listing one term or a sequence of part numbers does not demonstrate the requested causal explanation. Under the cap2 gate's actual `exact` / `numeric` / `expression` boundary and absence of runtime LLM grading, the defensible verdict is **ungraded for all four, auto for none**. Each future authored answer must still supply a complete understandable display answer. This report's independently solved prose demonstrates the necessary content, but no production `displayAnswer`, `expected`, answer key, or interaction file was generated or approved.

For later human comparison, accept scientifically equivalent phrasing that covers the requested construction and mechanism. Flag a missing half-question, wrong or swapped part labels/materials, omitted insulation or gap, missing permanent magnet or coil-field/force stage, sound-powered current, repeated direction reversal, repulsive-force storytelling, or air travelling along the wire. Do not invent numerical tolerances or enforce one exact sentence.

## Gate Boundary and Freeze

The cap2 gate was read for derived-source completeness, intelligible answers, decomposition of multi-facet questions, and the practical grading boundary. Those **content-only criteria PASS** here. No original `bookRaw` exists to verify; no candidate key or `expected` values were disclosed or assessed. Candidate-to-question alignment, any future key's content, figure evidence, actual exact-input contracts, finalize, publish and finalized-course approval remain **NOT_RUN / NOT_APPROVED**, as applicable.

The SOURCE freeze consists of this report, `source-coverage.json`, `input-binding.json`, and the full-approved-text command evidence, with SHA-256 hashes in `tmp/b90-n159-answer-SOURCE/freeze-receipt.json`. The receipt's own hash is recorded in `freeze-receipt.sha256`. The freeze command makes the report and coverage read-only and verifies the platform's user-immutable flag; it then independently protects the receipt and its hash sidecar. A command failure would invalidate the freeze claim and is not silently treated as success.

The original recorder at `T/tmp/b83-n65-raw-and-text/record-command.mjs` hardcodes a write prefix outside the permitted scope. It was preserved; a same-format local copy changes only that output prefix plus an orienting comment. All solver command labels are unique within the new SOURCE directory. There were no writes outside the two authorized locations.

## Counters and Handoff

| Counter | Value |
| --- | --- |
| Original written questions independently solved | 4 |
| Requested primary facets covered | 7 |
| Questions eligible for reliable current auto grading | 0 |
| Images viewed/rendered/generated | 0 |
| Author/book/candidate answer-key content reads | 0 |
| Author drafts / choices / interaction specifications read | 0 |
| Figure files / FigureSpecs / source PNGs read | 0 |
| SOURCE / RAW / TEXT review replays | 0 |
| Paid calls / network calls / browser calls | 0 / 0 / 0 |
| Git / backend / database / app / setup / freshness / other-chat operations | 0 |
| Prepare / finalize / publish calls | 0 / 0 / 0 |
| Candidate edits / canonical product writes | 0 / 0 |
| Finalized courses approved or claimed complete | 0 |

No future key or figure is preapproved. A later **explicit FINAL comparison**, if requested after this freeze, must compare the disclosed author key against these immutable independent solutions and coverage, bind its own inputs, and leave this SOURCE report untouched. This report does not itself authorize that comparison or any production action.
