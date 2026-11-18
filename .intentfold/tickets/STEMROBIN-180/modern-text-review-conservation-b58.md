# STEMROBIN-180 B58 n75 Fresh FULLTEXT Review

Date: 2026-11-17. Lesson: `phy8-c4-s2-n75`, 守恒定律的意义.
Mode: same-invocation fresh independent **FULLTEXT REVIEWONLY**.
Overall result: **REVISE / HOLD**. This is the FIRST text-review result, not FIRSTPASS.

**Faithful-source retention: PASS, 8/8 original prose blocks, all constituent
sentences and conditions retained. Physics/teaching correctness: REVISE / HOLD.**
These are separate judgments. Exact reproduction of a historical source does
not prove its conceptual correctness or justify teaching its assertions as fact.
No author self-approval, candidate repair, source repair, or downstream release
is performed or authorized by this report.

## Findings

### F1 [P1] Stopping under gravity or elasticity skips the stored potential energy

Exact candidate: block 2, `prose[1].text`, lines 31-41, `p0290#2`:

> 如果停止的原因是重力或弹性力作用的结果，则代替一种机械运动，出现了另外一种机械运动——停止的物体把自己的动量和动能传给了另外的物体，使其运动，或同一个物体向相反方向运动。

[Frozen candidate, line 31](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-conservation-text-review/inputs/modern/lesson.template.json:31).
The supplied raw paragraph contains exactly the same clause.

This is not just old punctuation or an omitted source word. At a gravitational
or elastic turning point, kinetic energy can be zero while energy is stored as
potential energy; the subsequent reversal is not simultaneous replacement
motion at that stopped instant. Equal-and-opposite momentum exchange also
does not establish that all lost kinetic energy becomes the other body's
kinetic energy. Caltech's energy chapter treats gravitational and elastic
storage separately; its momentum chapter explicitly describes maximum elastic
compression with both bodies instantaneously at rest and energy stored
[S1: lines 534-569; S2: lines 833-837].

The final alternative, “或同一个物体向相反方向运动”, correctly recognizes possible
later reversal. Read with the entire paragraph, however, it still omits the
intervening stored-energy state while presenting this as the explanation of
conservation. The preceding friction branch is a defensible qualitative account
of increased microscopic motion/internal energy, not proof of this gravity/
elasticity branch. **Physics REVISE; fidelity PASS.**

### F2 [P1] Conditional physical laws become an infallible rejection of any report

Exact candidates: block 6, `p0290#6`, line 87, “动量和能量守恒定律是绝对精确的”;
block 7, `p0291#1`, line 106:

> 而动量和能量守恒定律却没有例外。如果不论是谁声明他发现了不遵循守恒定律的现象或过程，那么可以大胆地断定，这是错误的。

[Frozen candidate, line 87](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-conservation-text-review/inputs/modern/lesson.template.json:87)
and [line 106](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-conservation-text-review/inputs/modern/lesson.template.json:106).
These assertions are inherited, not introduced by the punctuation changes.

For the mechanics being discussed, a selected system's total momentum is
constant when its net external force is zero (with no omitted momentum
transport). Its total energy accounting must include stored/internal forms
and transfers across the boundary; mechanical energy alone need not be
constant under friction. Unknown force values are not a conservation
prerequisite. OpenStax explicitly distinguishes the ball alone from ball plus
Earth, and permits canceling external forces rather than requiring no external
forces individually [S4: lines 571-648, 917, 1199; S1: line 155].

Blocks 1 and 5 refer back to earlier chapters. That makes this a recap, and
the absence of a repeated prerequisite by itself is not treated as an
independent error. But the frozen eight-block text positively escalates the
recap into “绝对”, “没有例外”, and rejection of anyone's reported phenomenon.
Nothing in those eight blocks restricts that rejection to a complete,
correctly measured system or acknowledges the need to investigate missing
energy/momentum, the model, and the evidence.

Caltech's energy discussion qualifies its empirical confidence by current
knowledge; its relativity discussion explicitly bases physical-law judgments
on experiment and recognizes limited validity ranges [S1: line 41;
S3: lines 69-71]. The issue is the candidate's certainty argument, **not a
claim that a genuine violation of total energy/momentum conservation has been
established**. No cosmological extension or speculative counterexample is
needed for this finding. **Physics/teaching REVISE; fidelity PASS.**

## All Eight Blocks

The following is the complete review, not a sample. Block indices are one-based
for prose; the exact JSON pointers are zero-based. All text is preserved in the
frozen input and `text-observations.json`.

| Block / Candidate Line / Binding | Complete Clause-Level Assessment |
| --- | --- |
| 1 / 16 / `prose[0]`, `p0289#12 + p0290#1` | Both the reference to the preceding two chapters and the “既不可能消灭，也不可能创生” conclusion survive exactly. Read with blocks 2-4, “运动” is a broad historical interpretation, not a newly defined conserved scalar or a reference-free velocity. It cannot itself prove a scientific “amount of motion” theorem; the concrete explanation has F1, and the universal certainty has F2. Fidelity PASS; no separate claim that mere use of this historical phrase is an error. Not independently approved as a precise physical theorem. |
| 2 / 31 / `prose[1]`, `p0290#2` | Every apparent stopping/starting sentence, “似乎” qualification, causation/other-body/force clause, friction conditional, gravity/elastic conditional, and both transfer/reversal alternatives is present in the original order. Force changing velocity is sound in the intended inertial mechanics. Friction's microscopic-motion explanation is acceptable qualitatively and distinguishes bulk mechanical motion from internal energy; it does not say all internal energy is only particle kinetic energy, and is not interpreted as random heat absorbing net vector momentum. The gravity/elastic branch is F1. Fidelity PASS; physics REVISE. |
| 3 / 45 / `prose[2]`, `p0290#3` | Change of form, body-to-body transfer, “但是，当进行这些改变时”, the no-unaccounted-creation/loss sentence, and the emphasized conclusion are all exact. Transfers/forms are useful conservation language only with complete totals and boundary accounting; the text does not define a separate conserved “运动” quantity. The bold historical generalization is retained as source emphasis, not certified by that markup. Read in the full lesson, it cannot cure F1 or the unconditional extension F2. Fidelity PASS; contextual physics HOLD, no invented standalone new law. |
| 4 / 59 / `prose[3]`, `p0290#4` | All three sentences are exact, including “如果…则”, “同样大小的速度”, the quotes around “安排”, and “只有…才”. Conservation does not generally require equal speed changes for different masses; this contrast is correct [S4: lines 216-231]. In this local comparison of speed, momentum, and energy, “只有” need not mean an exhaustive inventory of every conservation law. Angular momentum exists [S1: line 584], but this review does not demand an expanded curriculum or flag a missing inventory as a separate defect. “恒定不变” still concerns appropriate system totals, not each body's momentum or kinetic energy at all times; the unconditional full-lesson reading remains F2. Fidelity PASS; narrow speed contrast PASS, contextual HOLD. |
| 5 / 73 / `prose[4]`, `p0290#5` | Entire “当由于某种原因不知道…力的数值时” statement is unchanged. “也可以解力学问题” is an existence/usefulness claim, not “所有问题” or “不知道力就一定守恒”. It is correct for suitable systems and sufficient known relations [S2: line 850; S4: lines 648-651]. This recap need not repeat every earlier theorem to make that narrow statement true. Fidelity PASS; physics PASS in that stated context. |
| 6 / 87 / `prose[5]`, `p0290#6` | All three sentences, including the ordinal distinction “牛顿第二和第三”, are exact. Newtonian mechanics has a limited domain, so the non-absolute Newton contrast is qualitatively defensible; the absolute-certainty half is F2. The retained name has a source-bound historical declaration, not a correctness waiver. Fidelity/declaration PASS; physics REVISE for the absolute claim. |
| 7 / 106 / `prose[6]`, `p0291#1` | All four sentences remain in order, including “如果…速度趋近于光速，则”, “在这个意义上”, the no-exception assertion, and the universal-rejection conditional. Four periods become Chinese full stops and three following spaces are removed, with no lexical or logical alteration. The near-light-speed limitation is qualitatively correct; it does not invalidate conservation or mean every force-momentum relation is discarded. With relativistic momentum, the force-rate-of-momentum relation remains meaningful; the instantaneous particle-pair third-law picture may need field momentum [S2: lines 264-331, 876-935, 1098-1109; S3: line 69]. Caltech's historical relativistic-mass notation is not adopted into the candidate. The certainty conclusion is F2, independently of that valid limiting-domain observation. Fidelity/declaration PASS; physics REVISE. |
| 8 / 127 / `prose[7]`, `p0291#2` | All three sentences and “这象” survive; three periods change to Chinese full stops and two following spaces disappear. “指路星/首席检查官” is read as a useful consistency-check metaphor, not a proof that satisfying two conservation relations establishes every assertion. The course-use promise is not a physical theorem. No independent F3 is added for this metaphor; it does not neutralize block 7's explicit F2. Fidelity PASS; narrow methodological statement PASS. |

## Exact Retention And Declarations

The read-only observation script completed once at `2026-11-17T15:32:30.725Z`.
It compares the frozen objects; it is not `adapt-finalize`, a pipeline gate,
an answer check, or author approval.

- Raw `lesson.md` equals the heading plus all eight raw JSON paragraphs exactly.
  The modern embedded `source.data` equals the entire supplied raw lesson object;
  both lesson/exercises `source.sha256` fields match their raw input bytes.
- All eight `source_text` fields and ordered `source_refs` equal raw; `kind`,
  `id`, `label`, `printed_page`, identity, title, number, and start-page fields
  match. There is no insertion, deletion, reordering, renumbering, or clause
  shortening. Nine page-block references form eight assembled prose blocks.
- Blocks 1-6 have identical text and `changes: []`. Blocks 7-8 have exactly
  period/space changes and `changes: ["layout"]`. All eight
  `numeric_changes` arrays are empty.
- No prose formula, Arabic numerical datum, unit, inequality, subquestion, or
  exercise calculation occurs. The title formula `$75$` is exact.
  “前两章”, “第二和第三”, “同样大小”, and all conditional/absolute terms remain
  unchanged as prose; absence of numeric tokens is not proof of physical truth.
- The sole bold span is exactly `**物质的运动是守恒的**` in block 3, with its
  final stop outside emphasis. Block 2's two long-dash separators and block 4's
  quotation marks survive. No emphasis was added or flattened.
- Only blocks 6 and 7 declare `term: "牛顿"` with the exact source-bound
  reason “牛顿是原书科学定律或科学史中的真实姓名，保留来源身份。”
  Each term occurs in that block's raw and modern wording. No fictional-name
  replacement, invented scientific identity, or blanket historical exemption.
  These declarations preserve identity; they do not label the broad conservation
  assertions as disputed quotations or correct them.
- Both exercise lists have count 0; raw/modern lesson figure lists and the
  figures template are empty. `section_breaks: []`, `errata: []`.
  No mathematical correction is declared. Draft layout is reviewed textually,
  not approved as final paragraph rendering or DISPLAY.

The source profile was also read: its sentence-period convention is `.`, while
the already-approved supplied raw blocks 1-6 contain `。`. This is reported as
an inherited profile/raw distinction, not silently normalized, reopened as a
source review, or cleared by this modern text review. Exact raw retention and
the two declared modern layout changes remain the observations above.
[Source-rule receipt](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-conservation-text-review/source-rules-read.md).

## Reused SOURCE Closure

Only the existing reports were read/copied. No source page, page image, page
Markdown/JSON, audit, screenshot, or prior command stream was opened or rerun.

| Reused Approval | Target Binding And Boundary |
| --- | --- |
| `source-review-8p289290-b58.md`, SOURCE PASS | `p0289#11` is the n75 heading; `p0289#12` ends with “也”, marked open, and `p0290#1` is exactly “不可能创生。” marked continuation. The raw/modern first paragraph has the exact assembled ending “也不可能创生。” and ordered two-reference binding. `p0290#2-6` supply blocks 2-6, complete. Earlier figure/exercise content on physical 289 precedes the heading and is excluded. |
| `source-review-8p291292-b57.md`, physical 291 SOURCE PASS | `p0291#1-2` are two complete preceding-section paragraphs. These supply blocks 7-8, ending before `p0291#3`, the next “第九章提要” heading. Summary formulas/emphasis from `#4` onward and physical 292 do not belong to n75. The report's physical-292 mechanical HOLD is neither needed nor cleared here. |

Thus the supplied lesson is closed at both assigned textual boundaries and has
no exercise/figure carry-over according to the reused approvals and exact
packet bindings. This is **reused source provenance plus raw-to-candidate
comparison**, not a new pixel approval or a current authoritative page-stream
reconstruction. No claim is made about uninspected page bytes, PDF freshness,
unrelated HOLDs, or successful downstream gates.

Report snapshot hashes:

| Existing Report | SHA-256 |
| --- | --- |
| `source-review-8p289290-b58.md` | `a005fcef7288c9636a9e42ebbe9c3300493c248b06162cbb76cb66163bb96ad5` |
| `source-review-8p291292-b57.md` | `07d8375df7badec8ca5fc4b3446e724d90aef37fed27b6b2f15ab8b95b80ad3d` |

## Scientific Evidence

Primary authored textbooks were read through four sequential, one-shot
`cloak-fetch` commands, each exit 0 and HTTP 200. No interactive browser-tool
session was opened or left holding a seat; no images/screenshots were requested.
Search was permitted for URL discovery; rendered public-page reads used only
`cloak-fetch`.

| ID | Primary Source / Frozen Receipt |
| --- | --- |
| S1 | Caltech, Feynman/Leighton/Sands, *The Feynman Lectures on Physics*, I.4, sections 4-1 to 4-4. `https://www.feynmanlectures.caltech.edu/I_04.html`. [Rendered text](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-conservation-text-review/science/S1-feynman-energy.stdout.txt); [receipt](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-conservation-text-review/science/S1-feynman-energy.receipt.json). |
| S2 | Same authors, I.10, sections 10-2, 10-4, 10-5. `https://www.feynmanlectures.caltech.edu/I_10.html`. [Rendered text](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-conservation-text-review/science/S2-feynman-momentum.stdout.txt); [receipt](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-conservation-text-review/science/S2-feynman-momentum.receipt.json). |
| S3 | Same authors, I.16, section 16-1 and relativity-domain discussion. `https://www.feynmanlectures.caltech.edu/I_16.html`. [Rendered text](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-conservation-text-review/science/S3-feynman-relativity.stdout.txt); [receipt](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-conservation-text-review/science/S3-feynman-relativity.receipt.json). |
| S4 | OpenStax/Rice University, *University Physics Volume 1*, section 9.3, “Requirements for Momentum Conservation”, “The Meaning of System”, and ball/Earth discussion. `https://openstax.org/books/university-physics-volume-1/pages/9-3-conservation-of-linear-momentum`. [Rendered text](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-conservation-text-review/science/S4-openstax-momentum.stdout.txt); [receipt](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-conservation-text-review/science/S4-openstax-momentum.receipt.json). |

The findings above are reviewer inferences from those specified passages and
the exact candidate claims, not quotes asserting that the external authors
reviewed this lesson. Only the mechanics and epistemic distinctions necessary
to assess this packet are used. No new lesson content or replacement wording
is proposed.

## Frozen Inputs

Freeze completed before opening any raw/candidate text:
`2026-11-17T15:30:33.093Z`. Byte-exact, read-only snapshots and absolute source
paths are recorded in
[input-manifest.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-conservation-text-review/input-manifest.json).

Raw input directory:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/phy8-c4-s2-n75/`.

Modern input directory:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b58-conservation/work/adapt/8p/modern-us-neutral/lessons/phy8-c4-s2-n75/`.

| Input | Bytes | SHA-256 |
| --- | ---: | --- |
| Raw `lesson.json` | 4063 | `534ecd30e2f59f6aae6598e5ab6bec03cf0de69aa59e9c15fb8d51dc5f3f608f` |
| Raw `lesson.md` | 2465 | `8a4d2c6d7245dcabdad8d19802be25565246fcc52f8b9e11a09fa6a31f13da28` |
| Raw `exercises.json` | 66 | `1b358a374763186b82a3661b74b1db32159691aed6ab4679d4fa76fbcbee40c3` |
| Modern `lesson.template.json` | 12469 | `f53d1218923d62e49e7aef6ab14d42c92e58d6a47663b8b13e7bef90a395e25c` |
| Modern `exercises.template.json` | 419 | `78e2c3b3b2f289ce76b2f703177abce6809e8b91c5bfb287e5c729f10ed3270e` |
| Modern `figures.template.json` | 153 | `81d10eb8f47e8f7df2c37ae4ad749493a2ae19f9875c05747a0b5ea464440668` |

## Evidence And Stop

All new evidence is confined to the actual absolute directory:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-conservation-text-review/`.
This is not root `.tmp/`.

[text-observations.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-conservation-text-review/text-observations.json)
holds complete paired texts, per-block references, transformations, emphasis,
formula/number observations, historical declarations, and hashes of the reused
reports and lesson/profile/edition rules.

[end-verification.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-conservation-text-review/end-verification.json)
records the final input/snapshot hash comparison and the owned evidence
inventory. If a live input differs, this report still identifies the frozen
reviewed bytes and does not approve the new bytes.

Only this new report and new files below the assigned evidence directory are
owned/written. No existing dirty/HOLD file is edited or reverted. No backend,
Git, DB, app/server, dependency, freshness/setup, checkpoint/usage, source or
candidate changes, gates, adaptation finalization, answers, DISPLAY, promotion,
or publication. SOURCE approvals are reused, not rerun.

**Image opens: 0/8; source-page opens: 0; screenshot opens: 0.**
Stop here, text only. F1/F2 remain unresolved; no speculative fix, automatic
repair pass, author self-approval, or further workflow step follows.
