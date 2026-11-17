# modern-text-author-n101-b52

## Scope

- FIRST, batch52 third course: 7p / phy7-c1-s2-n101 only.
- Scratch TEXT authorship only: five original prose blocks and two canonical tasks.
- No shipped product changes; no IntentFold capability or backend mutation invoked.
- Reuse the already-prepared templates exclusively; no adapt-prepare rerun.
- Original authority: complete lesson.json, lesson.md and exercises.json for n101.
- Pages 262/263 and shared graph source page 258 are user-supplied approved premises, not newly reviewed or self-approved here.
- No other lessons, old answers, keys, choices or interactions read.
- All writes stay inside this owned directory.

## Source Figure Observation

Viewed original artifacts/7p/figures/fig-229.png once, without reopening or cropping.
It is a temperature-versus-time graph, not a table. D is the peak; D-to-E slopes
downward, E-to-F is horizontal, and the curve after F slopes downward again.
The first paragraph names the axes and D/E/F from that observation without adding
numerical graph data. One image loaded in this task/context; zero modern renders.

The latest integration clarification is binding: raw prose stays five p blocks;
raw lesson figures and task figure_refs/figures are empty. The figures template
remains byte-identical and empty. Graph 229 is a cross-lesson textual reference,
not an embedded diagram. No metadata, assets, slots or FigureSpecs are added.
The parent owns the cross-lesson reference record. No self-contained-diagram or
all-corpus-readiness claim is made.

## Authoring

- All five prose texts and both task texts rewritten in child-readable Chinese.
- Molecular kinetic energy and intermolecular potential energy are distinguished.
- Crystalline freezing is qualified by unchanged pressure and other conditions.
- Phase-change release balances outgoing heat while total internal energy decreases;
  it is not energy creation, external-force work, or a separate heat source.
- The source values 1 kg, 0 C and 3.4e5 J, formula sequence, identities, grouping,
  page references, source_text and source.data remain unchanged.
- Q1 remains an open explanatory task with no prescribed example or answer hints;
  Q2 remains a quantity question, with no answer inserted.

## Evidence

Exact action/check argv, cwd, environment, stdout, stderr and exits are recorded
under receipts/. The receipt wrapper only records actual commands.
Read-only discovery diagnostics are separate from candidate failures.
The first authored and first check candidates will be preserved before commands
that can fail. At most one actual TEXT content repair is authorized.

## Commands And Actual Results

All commands below ran from `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
For each receipt prefix, `.call.json` contains the exact actual argv, cwd and exit;
`.stdout` and `.stderr` preserve actual output without reconstruction.

| Receipt prefix | Actual action | Result |
| --- | --- | --- |
| `receipts/01-exclusive-copy` | Node exclusive copies of the three existing prepared templates into owned candidate and prepared-input directories | Exit 0; three original template hashes printed |
| `receipts/02-normalize` | Requested Python `-B -c`; existing `edition.normalize_lesson_layout` once and `edition.normalize_exercise_layout` once | Exit 0; five prose blocks, two questions |
| `receipts/03-prose-flow` | `node .claude/skills/ld-s10y-lesson/tools/prose_flow.mjs .tmp/ld-s10y-lesson/text-author-n101-b52/adapt/7p/modern-us-neutral/lessons/phy7-c1-s2-n101/lesson.template.json` | Exit 0; eight actual paragraphs and adjacent anchor objects |
| `receipts/04-freeze-FIRST` | Node exclusive copy of all three anchored candidates to frozen/FIRST | Exit 0; three FIRST hashes printed |
| `receipts/05-textcheck` | `/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/ld-s10y-lesson/text-author-n101-b52/check-text.py` | Exit 0; errors=[], warnings=[] |
| `receipts/05-textcheck-katex` | Existing `tools/katex_check.js`, using source-preserved formula input | Exit 0; all three formulas parsed, zero warnings; exact stdin retained |
| `receipts/05-textcheck-layout` | Scoped script calling existing `htmlfrag.js` proseOutline/sectionBreakIndices | Exit 0; eight paragraphs, boundaries resolve at 4 and 7 |
| `receipts/06-candidate-hashes` | `shasum -a 256` on the three full candidate paths | Exit 0; hashes below |

`PYTHONDONTWRITEBYTECODE=1` was set on all recorded actions. All recorded action
stderr files are empty. The focused TEXT check used existing source, identity,
text, subpart and math-delimiter validators, the actual KaTeX parser, and shared
paragraph/anchor functions. It did not run source-page validation, FigureSpec
validation, rendering, promotion, publication or global tests.

The two authored anchors were manually copied from the actual prose_flow stdout,
then validated against that output and the shared paragraph resolver. They were
not derived by counting raw blocks.

## Candidate Paths And SHA-256

1. `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-n101-b52/adapt/7p/modern-us-neutral/lessons/phy7-c1-s2-n101/lesson.template.json`
   - `52b37d1e59e61adad79eba7d01aa225b2631f55350fb9027e04f3e8d748f1b20`
2. `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-n101-b52/adapt/7p/modern-us-neutral/lessons/phy7-c1-s2-n101/exercises.template.json`
   - `215fbaf037446a42f81eff00b7be6f8b18dd020d692be1d3408a9ca2f853f3fb`
3. `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-n101-b52/adapt/7p/modern-us-neutral/lessons/phy7-c1-s2-n101/figures.template.json`
   - `f73ea7f8d437a28a6f246b80ceaf33f995ed3fed34b6d3f60f70b1dac934d827`

## Defects And Repair Budget

- Focused TEXT errors: 0. KaTeX and layout warnings: 0.
- Actual TEXT repairs used: 0 of 1; the one permitted repair remains unused.
- No candidate check failed; no failed candidate was produced or overwritten.
- `frozen/authored-before-normalize/` preserves the first authored candidate.
- `frozen/FIRST/` preserves the exact first checked candidate; final candidates have
  the same hashes. No affected-only recheck was needed or run.
- Discovery mistakes are in diagnostic-reads.md, separate from content defects.
- No adapt-prepare rerun; no source/FIG/key/answer/choice/interaction production or
  review; no DB, Git, app, dependency or model-service action; no finalize,
  promote, retain or global test command.

Status: bounded FIRST TEXT authorship complete, mechanical check clean, still
draft and not self-approved. Cross-lesson graph reference is not embedded.
