# STEMROBIN-182 Independent FIRST Source Review: 7a physical 217-220

Review date: 2026-11-18.
W: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.
Assigned sole branch: `codex/STEMROBIN-182-textbooks`.
Actual branch verification: null (no Git commands).

## Verdict

| Physical | Printed | Independent source verdict | Actionable diffs | Actual FIRST exit | Printed / MD lines |
| --- | --- | --- | --- | --- | --- |
| 217 | 211 | PASS | [] | 0 | 27 / 27 |
| 218 | 212 | PASS | [] | 0 | 24 / 24 |
| 219 | 213 | PASS | [] | 0 | 19 / 19 |
| 220 | 214 | PASS | [] | 0 | 20 / 20 |

These are faithful-page source verdicts for the 12 current hash-bound files below,
based on four actual original-resolution page-image inspections, not inferred
from author approval or successful finalize execution. No source revision is
requested. No page in this assignment is REVISE or BLOCKED.

Each page's MD and JSON were read, including metadata and every block; each audit
was read. Checked source characters, punctuation, formula signs and fractions,
printed line breaks, Cyrillic subquestion markers, paragraph/exercise continuation
flags, heading kinds, captions, footer text, and rough figure identity/ownership.
The MD and JSON agree on the inspected source content and block flags.

## Independent Page Findings

### 217: PASS

- The opening `p cont` prints `$y=\frac{1}{3}x+2$` and `$y=-0.5x+1$`, the
  sentence-ending dot and footnote star. It closes the example-1 opening supplied
  by the human as text from 216; 216 pixels and files were not read.
- The bold two-line linear-function statement, proof text, and three stacked
  difference equalities are retained. The latter use two `↵` markers, without
  deleting or inventing a printed row. The split `$k(x_2-↵x_1)$` is retained.
- Example 2's `y=|x|` wraps after `y=` and is represented by `↵`.
  The two French-style open intervals retain their printed bracket directions.
- Figure 50 is the single gridded absolute-value graph beside example 2, with
  x/y labels and printed tick values. Audit rough input `[980,1348,374,381]`
  and durable box `[984,1349,365,377]` identify this one graphic, excluding
  its caption and prose. It belongs to prose/example 2, not an exercise.
  Its caption is correctly separate and `samerow` with the preceding prose.
- The final `p open` ends with printed `因`. The separate starred footnote
  keeps the split `y=↵f(x)` and quoted wording; footer is 211.
- Actionable diffs: [].

### 218: PASS

- Opening `p cont` begins `此，`, closing 217's `因` as `因此，`.
  The two-row piecewise expression retains `-x`, `x`, the first open interval
  and second interval including zero, and one `↵`.
- Example 3 and figure 51 preserve `y=12/x`, the two hyperbola branches,
  grid, x/y labels and printed tick values. Audit rough input
  `[220,756,375,382]`, durable box `[226,759,366,376]`: prose/example 3
  ownership, no exercise-owner requirement.
- The right-side paragraphs preserve the domain union and the printed
  decrease statements. `p open` ending `注意，如果由此便作出结论，`
  continues after the transparent same-row figure-51 caption.
- The subsequent fractions, comparison sign and quotation are faithfully
  retained. In particular, the printed quotation says
  `自变量较大的值对应的函数值也较大`; it was not semantically rewritten.
- Exercise 746 contains its opening and Cyrillic `а)`, `б)`, `в)` in the
  printed rows. `open: true` is correct: its `г)` is on 219.
  Footer is 212.
- Actionable diffs: [].

### 219: PASS

- Opening `ex 746 cont` supplies Cyrillic `г)` and the final instruction,
  closing the exercise opened on 218. It is not a new independent exercise.
- Figure 52 is the gridded upward curved graph referenced by exercise 746.
  Figure 53 is the separate gridded bicycle-speed/time plot referenced by
  exercise 747, including printed `v`, `t`, units and the rising, level,
  falling segments. No graph-read answers were derived.
- Figure 52 rough input `[230,398,372,385]`, durable box
  `[233,399,371,380]`; figure 53 rough input `[604,398,760,385]`,
  durable box `[609,400,752,378]`. The two identities and separate boxes
  are faithful and nonoverlapping. Captions are separate text blocks;
  figure 53's caption is correctly `samerow` with figure 52's caption.
  Numbered references determine ownership, not page-nearest guessing.
- Exercises 747-751, their Cyrillic subquestions, formula coefficients,
  signs, fractions and printed rows are retained.
- At exercise 751 `а)`, the actual pixels show an x-shaped left-hand
  variable, not the y-shaped glyph used in `б)`. Current
  `$x=-\frac{6}{x}$` and its source note preserve that printing.
  No substitution to `y`, solution or proposed correction is authorized.
  Mathematical-error diagnosis/correction: null.
- Exercise 751 closes on this page with
  `分别指出函数增大和减小的区间.` and footer 213. This is NOT n34's
  right boundary: exercises 752 and review 753 follow on 220 before n35.
- Actionable diffs: [].

### 220: PASS

- Exercise 752 is a new closed `ex` block, not a continuation of 751.
  Its three printed lines retain `[-5,7]`, `[-5,-2[`, `]-2,4[` and
  `]4,7]` and the printed increase/decrease wording.
- `复习题` is correctly `exhead`; exercise 753 follows with both
  Cyrillic subquestions, radicals, decimal coefficients, fraction
  `1/9`, semicolon and final dot. It closes before the next heading.
- `35. 函数 $y=\sqrt{x}$ 和它的图象` is the genuine `h3`,
  not an exercise heading or prose. It is after 752 and review 753.
- The first n35 paragraph visibly prints `$x>0$`, not a non-strict
  comparison. Its subsequent nonnegative-value wording and domain
  `$[0,+\infty[$` are also retained. The source note records the
  printed condition; this review does not alter it or assert a semantic
  repair. Mathematical-error diagnosis/correction: null.
- The unnumbered table is the prose table introduced by `列表：`,
  not a figure owned by 752 or 753. `owner_exercise: null` is correct.
  Rough input `[174,1398,1140,256]`, durable box
  `[177,1402,1133,249]` identify the entire two-row table, excluding prose.
  There are 12 columns including the row-label column. Visible row labels
  are `x` and `sqrt(x)`; the printed x row is
  `0, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9`; the second row is
  `0, 0.71, 1, 1.41, 1.73, 2, 2.24, 2.45, 2.65, 2.83, 3`.
  These are pixel observations, not recomputed values or answers.
- The final paragraph keeps its two printed lines, the radical comparison,
  and final printed `就`, with `p open`. Footer is 214.
  Physical 221 was not read; its continuation text and closure are null.
- Actionable diffs: [].

## Boundary Scope

The human-supplied, independently reviewed TEXT ONLY 216 tail is:
`p open`, example 1, `例1 在图48和49里画出了下列两个线性函数的图／象：`,
followed by figures 48/49, captions and footer 210. This review uses only that
supplied text to judge 217's incoming `p cont`; no 216 image or durable file
was read. Independent verification here of 216's files/hashes: null.

Human-supplied TOC anchors, not independently reopened here:
n34 printed 208 / physical 214; n35 printed 214 / physical 220;
n36 printed 219 / physical 225. They are consistent with the inspected n35
heading. No n36 page was inspected.

The actual local n34 right boundary is **on 220 immediately before n35's h3**:
219 closes 751; 220 then closes 752 and review 753. No n34 open paragraph,
exercise or unclaimed figure crosses that h3. Local source-boundary verdict:
PASS. Whole-n34 source certification: null. Whole-n34 modern/scientific
approval: null. Whole-n35 completion/approval: null. APP/full-course/publishing
approval: null.

Physical 215's existing endpoint-zero scientific HOLD remains untouched.
That status is supplied by the human, not freshly audited here.

## Current Durable Hash Bindings

All paths are under W. Each hash below was independently computed from the
current file, agrees with the author report, and agrees with the corresponding
actual FIRST receipt's target hash.

| Physical | Actual absolute file path | Current SHA-256 |
| --- | --- | --- |
| 217 | `/Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0217/page.md` | `1ef411851d245ab4e96779e63181de7776161cab1a2c0388922e3634303b5e20` |
| 217 | `/Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0217/page.json` | `9a92e3bcb59d59ff98a8365b07a676b5cd7173f2f535cf00d58b54afc845f4e3` |
| 217 | `/Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0217/audit.json` | `c45506151b6cc568761432d1edc7ccee7b461438ab545ff13218b465984bd9d5` |
| 218 | `/Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0218/page.md` | `f28def6191ef6e22cc68e0488ba9966bf791433755d3902600e5074c19bee753` |
| 218 | `/Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0218/page.json` | `08ab65604279ad7d064276ebebd503b232434818001d2c1973994890ec82453c` |
| 218 | `/Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0218/audit.json` | `75686a4a4c0a3a35f58aec5da492ce2913534c126c3b95eac029ebfd763cbee8` |
| 219 | `/Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0219/page.md` | `beb49b0000ce00763e22efe4e3e01f7120f9f1de1e56d5864047519d5165a7ee` |
| 219 | `/Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0219/page.json` | `ead546937f0e87fc5a3bb2cd478245dde06df2ea09fef7a82c253b59174dc523` |
| 219 | `/Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0219/audit.json` | `cb6b0ca0ebad7eb370250a0474a92da2d6970460ed799ae54d5ce5208a5b7dda` |
| 220 | `/Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0220/page.md` | `895241e3224c3e5856b3a947920e1ffd4e86ebefeba1fb1d3f41164e6d3bde6e` |
| 220 | `/Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0220/page.json` | `52c5f0437a67906a701268042f00aef6e265dd3c02752c6ccdbab02d39af3a22` |
| 220 | `/Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0220/audit.json` | `c5e9c942ffae777418f83d10876a532b12173c398097e011666e05333b818c4b` |

## Four Actual Images

One fresh batch, exactly four images in this context (4/24); each loaded once
using `functions.view_image` with `detail: original`. Reopens, crops, other
images, 216 reads and PDF-image reads: 0. No image payload is included in
the report or returned to another chat.

| Physical | Actual absolute image path | SHA-256 |
| --- | --- | --- |
| 217 | `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0217/page.grid.png` | `14f6b9fc7b83121bf9fbd420b694ea5c99a2751fb38726a66e3d7dc7beba9a07` |
| 218 | `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0218/page.grid.png` | `a2708a1e0e76d5601e413ff073f3a385b56cb8228ba7a609356e3092f4373399` |
| 219 | `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0219/page.grid.png` | `b60da08d58ca797348343b47a8cc7328899ad73f7b0785f4658c247887b0501b` |
| 220 | `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0220/page.grid.png` | `c33c1ae82b2d94485541733f01224dd63b0379b7ff15be9f2ffcc866b0462dc7` |

These are grid-image hashes, not the separate ungridded render hashes in page
metadata. Cropped figure bytes were not opened or independently certified.

## Author and Actual FIRST Evidence

The actual author files were read and independently hashed; both match the
hashes supplied by the human:

- `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-9/source217-220-author.md`
  SHA-256 `18a2628f6b0b216aab1ac6e7e961930f220ec22c97367c850837e92bc0b48cfe`.
- `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-9/source217-220-author.json`
  SHA-256 `feff546252838eea995016f6b8e10e1a881916fbdeab10df22e0800a559b379d`.

All four actual start files, raw stdout files, empty raw stderr files, and
final receipts were read, not merely copied as claims from the author report.
All have invocation 1, W as cwd, matching start/final command and sourceBefore,
exit 0, signal null, error null. Raw stdout line totals and figure boxes match
the durable audits. All 16 evidence-file hashes agree with the author report;
each stdout/stderr hash also agrees with its actual final receipt.

| Physical | Actual absolute final receipt path | SHA-256 |
| --- | --- | --- |
| 217 | `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-9/p217.finalize-FIRST.final.receipt.json` | `66cfa4b6e40f061e848273ea56d37e8ba08a34d07c0e6dc20d4678aca734a5a3` |
| 218 | `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-9/p218.finalize-FIRST.final.receipt.json` | `58a834c9ada9d02e560db77791a0f8c82f52a6eec0b39a877065df913e5efcaf` |
| 219 | `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-9/p219.finalize-FIRST.final.receipt.json` | `b45c0aaca6a93188c0ad128f69a0720845c3df2e01ac099a890cd6c7790f0229` |
| 220 | `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-9/p220.finalize-FIRST.final.receipt.json` | `2cc40fe4aa37ed40686522eaf9d0f1c9ca41b4fab26a9ebc0b6e80e39dfb2fed` |

For the following companion bindings, expand the exact absolute prefix
`/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-9/`
with the listed filename:

| Actual filename | SHA-256 |
| --- | --- |
| `p217.finalize-FIRST.start.json` | `7a7fc128bb6efa57d27442b41e0d9bf51c55c7c97f3c42fa35f4f4b8320f75cb` |
| `p217.finalize-FIRST.rawstdout` | `75766b10db95591446c0862d3d2bf871d1fedc7b7a01ad6fea78aea4bd0c909b` |
| `p217.finalize-FIRST.rawstderr` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `p218.finalize-FIRST.start.json` | `03528ef5c6888f8e1e09fb950fe5b75d874d2d10b6daae22006b217bcb7d6bbe` |
| `p218.finalize-FIRST.rawstdout` | `8ca74f9e8b60a4e3a61a0fd42e9f803f1d1804ff35490cd032cdca05f7865c40` |
| `p218.finalize-FIRST.rawstderr` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `p219.finalize-FIRST.start.json` | `9a340696c3c8646e60561e53c3cde30d104aca932cd713c582c57016f10089ad` |
| `p219.finalize-FIRST.rawstdout` | `2bb40ab2e1ed07d765b70d798efaef0c10967fcbcbc70dfbb3688f209a457bc8` |
| `p219.finalize-FIRST.rawstderr` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `p220.finalize-FIRST.start.json` | `fe8b1ed18da7e5eed8e386e3966f5090e8d4ae219a2451873b2ea9422178c469` |
| `p220.finalize-FIRST.rawstdout` | `6098b0de59dc3289164bcc50a1682a180e9f05c5f28f2edf35d3ee4c90ba0d28` |
| `p220.finalize-FIRST.rawstderr` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |

Recorded sourceBefore MD hashes, corroborated between actual start and final
receipts: 217 `461d2c2f61abe1cc50e101135752112ff6757f9b21ee1749116580c88eb235e4`;
218 `3aaa6e84e4b3c1e77709d4e106d4da7abd00e44eea74bf7f9e3a161b891c9270`;
219 `d0c8788890975a7be255a61d129e4f96d5f1391d30c78068d7504c19fad82473`;
220 `44543a50a1d90637b9b5f85e1efabb24bb54c33a28fb1cfde4a30a3e8e44902c`.
Those historical pre-finalize bytes were not independently reopened; their
direct byte verification is null. They are not substituted for the current
MD hashes. Initial/pre-create absence assertions and prepare receipt were not
reopened or rerun; independent verification of those stages is null.

## Commands and Read Contract

Every review `exec_command` had explicit `workdir: W`. All shell operations
were offline reads/hashes. Read/discovery commands used `pwd`, `sed`, `cat`,
`rg --files --hidden`, `ls -l`, and `shasum -a 256`.

- Entry: `pwd`; `sed -n '1,220p' .intentfold/readme.md`;
  `cat .intentfold/charter/engineering.md` (combined with profile read).
- Required rules: `sed -n '1,260p' .claude/skills/ld-s10y-lesson/SKILL.md`;
  `sed -n '1,260p' .claude/skills/ld-s10y-lesson/references/production-resume.md`;
  `sed -n '1,240p' .agents/skills/ld-s10y-image/SKILL.md`;
  `cat .claude/skills/ld-s10y-lesson/profiles/soviet-cn.json`.
- Discovery initially tried `tmp/resume182-9`, which does not exist at W's
  top level. Read-only `rg`/`ls` then located the actual ticket tmp directory.
  One filename-only `rg` over resource/scratch directories was broad and its
  output truncated; it loaded no additional file contents or images. A later
  narrow `rg` omitted ignored files and returned no matches; `ls -l` succeeded.
  These discovery outcomes are not content failures.
- Four `cat` commands each read
  `ssot-resources/soviet10year-textbooks/artifacts/7a/pages/PPPP/page.md`,
  `page.json`, `audit.json`, for PPPP exactly 0217, 0218, 0219, 0220.
- One `cat` read the two author files. Two `cat` commands read the actual
  FIRST start/rawstdout/rawstderr/final.receipt files, grouped 217/218 and
  219/220. No receipt command was executed or replayed.
- One `shasum -a 256` command used the two author files, all 12 durable
  files and the four grid files explicitly. Another used
  `.intentfold/tickets/STEMROBIN-182/tmp/resume182-9/p{217,218,219,220}.finalize-FIRST.{start.json,rawstdout,rawstderr,final.receipt.json}`
  plus the four required skill/profile files.
- Visual commands: four `functions.view_image` calls on the four absolute
  paths in the image table, in order 217, 218, 219, 220, each `detail: original`.
- Only write: `functions.apply_patch` adding this new Markdown report at
  its absolute W/ticket tmp path. No optional JSON or helper script is created.
- Closing read-only command: `shasum -a 256` for this report, the two author
  files and the 12 durable files; its output supplies the returned report hash
  and checks that the reviewed current bindings have not changed.

Actual recorded author FIRST command, **read only, not invoked by reviewer**,
for N exactly 217, 218, 219, 220:

```text
.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 7a --page N --root /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts --books /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/sources --work /Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson
```

Required-rule file hashes:
lesson SKILL `f63f3eac20f57814d511b3c792c58637a45627cdbf3fba3f89a59a4980f6ffec`;
production-resume `8d489fdcdd1a00866e951958009f6c8602e6b970108f8e7fc87368c3197b6a58`;
page profile `dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849`;
image SKILL `d31ecbea164b4c5c0ac781146976f50381466ae4a8931486bdb2e92e29015747`.

Reviewer actions: source/material/solution edits 0; counter or pipeline changes
0; prepare/finalize/assemble/render calls 0; Git/DB/publish/app/deploy/network
calls 0; agents/other chats 0; extra integrity platform 0; other workers'
changes reverted 0; existing HOLD edits 0. Only the requested new review
Markdown is written. Review is complete for this assigned four-page batch.
