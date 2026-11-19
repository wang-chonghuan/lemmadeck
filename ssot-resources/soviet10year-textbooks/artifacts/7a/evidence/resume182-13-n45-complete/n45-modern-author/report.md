# STEMROBIN-182: n45 RAW Assembly And Modern TEXT Candidate

Date: 2026-11-19. Exact cwd: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.
Branch: `codex/STEMROBIN-182-textbooks`. Scope is offline TEXT authoring only.
All paths below are relative to that cwd unless marked otherwise.

## Result

**RAW complete; modern TEXT candidate frozen. Not figure/content-review or publication approval.**
Selected lesson: `alg7-c4-s3-n45`, 可化为解二次方程的问题.
Source starts at `p0266#5` and ends immediately before n46 heading `p0273#11`.
Physical 274 is excluded. n46's one partial prose block and incoming 869-872
remain only unselected mechanical assembly outputs, never modernized or promoted.

- Eight complete faithful page triplets, physical 266-273, were copied byte-for-byte and frozen 0444.
- Frozen `source267-274-review/report.md` was reused for 267-273; frozen `source259-266-review/report.md` and the approved first-finalize snapshot were reused for 266.
- Current successful finalizers were hash-bound and reused. No page finalizer, source review, page preparation, or vectorization was rerun.
- RAW n45: 19 prose-layer blocks (17 prose, figure 59, caption 59), 19 complete originals 873-891, and three figure records.
- Every source prose/exercise block is accounted for with exact reconstructed text and refs. All n45 open/cont objects close, including 877, 883, and 887.
- Modern TEXT: the same 19 source-layer blocks become 18 tool-derived prose paragraphs; 19 originals contain 44 Latin subparts, with each prefix and subpart on its own line.
- All 86 TeX spans remain byte-exact, including the original `g\approx10^{\bullet}` footnote notation, source equation system, radicals, variables, signs, and inequalities. All 86 pass the installed KaTeX checker.
- All non-math numeric signatures, source snapshots, source refs, groups, figure refs, and display ownership are unchanged. There are zero numeric changes and zero mathematical corrections.
- The only contextual neutralization is six occurrences of 女打字员 → 打字员 in 885. Work order, manuscript task, and all durations stay intact. Cyrillic enumeration and 891's panel refs become natural Latin.

## Conditions And Boundary

Both source worked examples and their source-authored solutions are retained in full;
no old answer or choice artifacts were consulted. The first keeps no air resistance,
40 m/s, height 60, the source gravity approximation/footnote, and graph 59 prose.
The boat example keeps 5 hours, 42/20 km, 2 km/h, `x>2`, and the source
`(x+2)(x-2)\neq0` condition. All 873-888 task quantities and conditions remain intact.
889 retains `f(x)=3`, `f(x)>3`, `f(x)<3`, domain `[-1.5,6]`, and figure 60.
890 retains natural numbers at most 20 and remainders on division by 6.
891 retains `A(x)`, `B(x^2)`, both a/b panels, and requested positions
`1`, `-x`, `1/x`, `\sqrt{x}` without inferred geometry or added subquestions.

The section boundary was copied from the actual `prose_flow.mjs` adjacent-paragraph output:
before the source gravity footnote ending “这里凑整到 10 米/秒$^2$。”
and after “我们来看另一个问题。” Final tool output resolves exactly this boundary
at paragraph 8. No block-count or handwritten integer boundary was used.

## Files

Scratch base: `.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/`.
RAW: `n45-source-stage/artifacts/7a/lessons/alg7-c4-s3-n45/{lesson.json,lesson.md,exercises.json}`.
Prepared templates: `n45-adapt-work/adapt/7a/modern-us-neutral/lessons/alg7-c4-s3-n45/`.
Authored writable 0644 templates: `n45-modern-author/WORKING/alg7-c4-s3-n45/`.
Frozen 0444 candidates: `n45-modern-author/FINAL/alg7-c4-s3-n45/`.
FINAL includes the three templates plus readable `modern-text.md` and `modern-exercises.md`.
`final-binding.json`, `text-preservation.json`, `source-prose-equivalence.json`,
and `freeze.json` bind the actual files, source pages, commands, counts, and hashes.

FINAL lesson SHA-256: `0b8bb379c1385ea806297d637a9571e75253d9e7cd12a201f19c6fc7b23323d5`.
FINAL exercises SHA-256: `de94b4d04f4fd508b35f5f16e8bad0f83e8f0c89859e4301142a8112141f8e8e`.
Unchanged prepared/FINAL figures SHA-256: `daa233a23b80a21ea837d23df869508ec942728c3230508a8df7f82199cce7d8`.

## Commands And Receipts

Exactly one call each, exit 0:

```sh
.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py assemble --book 7a --root /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n45-source-stage/artifacts --work .tmp/ld-s10y-lesson --toc ssot-resources/soviet10year-textbooks/toc/7a/zh.json
.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py adapt-prepare --book 7a --edition modern-us-neutral --lesson alg7-c4-s3-n45 --root /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n45-source-stage/artifacts --work /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n45-adapt-work
```

Both used `PYTHONDONTWRITEBYTECODE=1`. Command/cwd/exit/stdout/stderr and stream
hashes are recorded in `n45-source-stage/assembly-FIRST.*` and
`n45-adapt-work/adapt-prepare-FIRST.*`. Assembly passed all authoritative object/math
checks; its two warnings refer only to incoming `p0266#1` and n46's `p0273#12`.
`text-check-RECOVERY1.*` records the passing text check; `prose-flow-FINAL.*` records
the actual final paragraph/boundary tool output.

The initial staging preflight read the wrong receipt field (`exit` versus author
`exit_code`) and stopped before p2c. Its valid 24 copies were reused, not recreated.
The first text check exposed the existing signature regex's treatment of `6.` when
its sentence punctuation changed; the actual number never changed. Only this
punctuation was restored, retaining all other authored text. Both failures and
diagnoses are retained; neither was a permission/path failure or new approval gate.
No passed producer stage or author stage was rerun.

## Figure Handoff And Restrictions

The three prepared figure entries are byte-identical in PREPARED, WORKING, and FINAL.
Figure 59 is prose (`p0267#5`); figure 60 belongs to 889 (`p0273#4`), not 890;
figure 61 belongs to 891 (`p0273#9`). Their actual raw PNG refs/hashes and existing
page-crop paths are in `raw-figure-handoff.json` and `final-binding.json`.
No modern figure, guessed geometry, replacement label positions, or image preview
was authored. The readable Markdown uses textual RAW-ref placeholders, not images.
The built-in assembler copied existing figure bytes into the isolated scratch
library; no image was decoded, viewed, rendered, or supplied to a model.

**ZERO image opens.** No DB, env-file, network, app, dependency install, external
model/image call, answer/choice consultation, adapt-finalize, render, publish,
progress/usage/durable-index write, durable promotion, commit, or revert.
Writes are confined to the three authorized scratch roots. FINAL and evidence are
0444; authored WORKING templates remain 0644 for downstream composition.
