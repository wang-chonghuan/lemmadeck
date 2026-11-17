# STEMROBIN-184 AUTHOR Handoff: Book10c Physical110-113

AUTHOR COMPLETE / WAIT. This is the same continuing authorized production invocation, not a new workflow. Parent owns independent review, finalization, integration, and subsequent source ranges. No image payload is attached or sent to the parent.

Workspace: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

## Author-Owned Outputs And SHA-256

These page.md files contain the complete faithful transcription of the assigned physical pages, including worked text, original unsolved exercises, original line boundaries, figure declarations, separate captions, and printed footers. None has been finalized or assembled.

| Physical / Printed | Complete Transcription Path | SHA-256 |
|---|---|---|
| 110 / 104 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0110/page.md` | `595c69a917dbb5d2edd97eac92f3918d045ae2a57d5e5c7998c28a20cc507822` |
| 111 / 105 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0111/page.md` | `2781e5d4199c3ef4760029463919381209f162ae485111566136abb912b50329` |
| 112 / 106 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0112/page.md` | `d323e950e64b87ab881a27fa4af375a1cf4142c4419d447609b99f9e79acfdf0` |
| 113 / 107 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0113/page.md` | `21fe0bd4e75d0cda41ff3625f3d0871a0eb47b3297c150d2a31f0a4e46a3ae81` |

Complete image-load ledger, every block-to-row/object mapping, figure inventories/owners, solved-owner exclusion table, actual headings/boundaries, and uncertainties:

- Path: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c110-113/author-ledger.md`
- SHA-256: `23c6ec8361885fd5bba4dbffc58d55b48178736f54303a3d2d61ceab96250ec3`

This handoff's SHA-256 is returned externally after its final write; it does not contain a self-referential hash.

## Original Evidence And Budget

Original root: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c110-113/10c/pages/`.

Each `0110/page.png` through `0113/page.png` was independently verified with native dimensions and SHA-256 immediately before its one individual `view_image(detail: original)` load. All were 1695 x 2580, full native rectangle(0,0,1695,2580). Dimensions and hashes matched only the prepared OWN templates.

| Original | SHA-256 | Load Count |
|---|---|---|
| 0110/page.png | `6568b4f13de15cfac55dc4bd41534271e85f5cb59ea19c932af79cfecb8b77b7` | 1 |
| 0111/page.png | `7fea8d28627de1cbe3a21b8f962a84301ac698d83126816275a732b37cb7ceda` | 1 |
| 0112/page.png | `d8abf50961bb085abcc33d96bc8e5923dc2252970b2ac3ea8b417d5928238d0c` | 1 |
| 0113/page.png | `6102a01cb60241ee1b45458a025c600820edafc98fa11cbedc4acb0600f946b1` | 1 |

Final author image consumption: 4/8 batch, 4/24 context. Zero crops, zero original reopens, zero grids, zero range-external adjacent-page opens, zero parent image payloads. The parent's already exhausted 24/24 context is not asked to reopen these pages.

## Independent Printed Rows

| Physical | Typed Blocks | Independent Printed Rows | Includes / Excludes |
|---|---|---|---|
| 110 | 8 | 22 | Includes unit heading, all theorem/proof/formula/example text, footer. No figures. |
| 111 | 7 | 19 | Includes all five worked examples' on-page text, two exercise-heading rows, footer. No figures. |
| 112 | 18 | 15 | Five two-column exercise rows; unit heading; four definition rows; one shared caption row; three example rows; footer. Excludes fig48/49 interiors. |
| 113 | 7 | 16 | Two top prose rows; one shared caption row; twelve derivation rows; footer. Excludes fig50/51 interiors. |

Independent total: 72 printed rows. This is ORIGINAL visual row evidence, not a finalizer/count-repair result. The right exercise in each pair on112 and the right caption on112/113 use `samerow`. Tall and nested fractions count once per actual printed horizontal row. No `↵` was necessary; no literal newline-plus-`↵` duplication exists. No artificial blank rows, `count_exclusions`, or expected-count override was created.

## Actual Headings And Incoming Boundary

Physical110 begins with `99．求原函数的三个法则`; no continuation of exercise408 appears. Given the parent's supplied incoming109 TEXT authority, the actual110 heading proves exercise408.globalright and unit98.n98right CLOSED.

Physical111 ends with the two printed rows:

```text
习题
求下列函数的原函数：
```

Physical112 starts with complete unsolved exercises409-418, five left/right pairs. Preserve stars on416,417,418. These ten exercises have no owned figure and no source solution on the assigned pages. Do not fabricate an exercise-head continuation block.

Physical112 then actually starts `100．曲边梯形的面积`, proving unit99.n99right/globalright CLOSED after418 and unit100's left boundary.

## Figure Owners

- Fig48: independent unit100 curvilinear-trapezoid definition (`p0112#12`), coarse native box(240,1570,510,355), caption `p0112#15`. Retain as independent conceptual content.
- Fig49: unit100 example1 statement (`p0112#17`), box(850,1390,350,540), caption `p0112#16`. Exclude with the WHOLE worked example.
- Fig50: same unit100 example1 (`p0113#1`, `p0113#6`), box(410,445,360,535), caption `p0113#4`. Exclude with that WHOLE owner.
- Fig51: same unit100 example1 (`p0113#6`), box(805,430,490,550), caption `p0113#5`. Inventory includes A,B,C,D,E,N, the bounds rectanglesABCD/ECDN, x and x+Delta x, the two dashed horizontal guides, and the hatched strip. Exclude all of it with that WHOLE owner.

Exact pixel snapping, cropping, finalization, and any subsequent vectorization remain untouched. Complete coarse figure inventories and point relationships are in the ledger.

## Whole Solved-Owner Exclusions

Exclude complete statements AND all proofs/solutions, equations, conclusions, owned figures/captions, and future owner continuations. Never extract only an apparent question prefix:

- Unit99 theorem1: `p0110#3`, rows3-8, complete statement and entire proof.
- Unit99 theorem2: `p0110#4`, rows9-13, complete statement and entire proof.
- Unit99 theorem3: `p0110#5`, rows14-19, complete statement and entire proof.
- Unit99 example1: `p0110#7` + `p0111#1`, complete cross-page statement and solution.
- Unit99 examples2,3,4,5: `p0111#2`, `#3`, `#4`, `#5`, each complete statement and solution.
- Unit100 example1: `p0112#17` + `p0113#1` + `p0113#6`, with fig49/50/51 and all three captions. This is an OPEN future-right solved owner; its future continuation must also be excluded until actually closed.

Inherited parent TEXT authority remains in force: source106-109 theorem plus ALL proofs, and the solved example with fig47, are excluded as WHOLE owners. Incoming109's solved-example conclusion `C=-8` belongs to that solved owner; the subsequent independent general-form/table and unsolved table verification do not. That109 independent material must not be conflated with111's example1 general-form conclusion, which belongs inside its worked solution.

## Outgoing113 Text Authority

No new heading or exercise appears on113. The same worked example is interrupted by fig50/51 and continues below them. The final actual printed row is:

```text
由此可以看出，当$\Delta x$趋向零时，分式$\frac{\Delta S(x)}{\Delta x}$有等于$x^2$的极
```

`p0113#6` is positively OPEN because the printed sentence is truncated at `极`; this is not an uncertainty-forced marker. The exact future closure of unit100 example1 and unit100.n100right/globalright is UNPROVEN. No114 source was inspected.

## Caveats And Stop

No unresolved transcription character/formula reading required a crop. Preserve original `象` on111 and `图象上部` on112; neither was silently modernized or registered as an unproven mathematical erratum. Coarse fig51 semantics do not certify exact pixel geometry. This AUTHOR pass is not independent reviewer approval or finalized acceptance.

Only the six owned output files were manually written, using apply_patch. All persistent page directories and both author records were absent beforehand. Other workers' files/edits were not read or changed. No previous author's/reviewer's content, answer/choice source, tests, pipeline command, database, publisher, app, dependency, schema, Charter edit, Git, SkillHost, or other-chat message was used.

AUTHOR COMPLETE. Return these text paths/hashes only, then WAIT. Parent handles every downstream action.
