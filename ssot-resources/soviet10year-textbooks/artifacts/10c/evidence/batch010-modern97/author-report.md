# STEMROBIN-184: Modern Text Author n97

Date: 2026-11-17. Same offline invocation. Role: MODERN TEXT AUTHOR n97 ONLY.

Status: author edits and read-only author comparisons complete; WAIT for the parent.
All three templates remain `status: "draft"`. This is not finalization, rendering,
publication validation, acceptance of a published lesson, or a blind-seed artifact.

## Scope and Files

Workspace: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

Written files:

- `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-modern10c97/adapt/10c/modern-us-neutral/lessons/ana10-c7-s1-n97/lesson.template.json`
- `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-modern10c97/adapt/10c/modern-us-neutral/lessons/ana10-c7-s1-n97/exercises.template.json`
- `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-modern10c97/author-report.md`

Owned file read and left byte-identical:

- `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-modern10c97/adapt/10c/modern-us-neutral/lessons/ana10-c7-s1-n97/figures.template.json`

Only the above files were written, using `apply_patch`. No other author's file was
edited or reverted. No Git operation was performed. The successful existing
`adapt-prepare` was not repeated.

Current local cap4 and edition-text-contract were read at:

- `/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/SKILL.md`
- `/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/references/edition-text-contract.md`

Only n97 template content and its already embedded source snapshots were read as
curriculum sources. No separate source lesson/page, scan, answer, choice file, or
other lesson was read. No model image was opened. No modern figure is needed;
every existing empty `figures: []` and exercise `figure_refs: []` is preserved.

## Exact Edit Inventory

The top-level lesson still has 15 prose objects, in exactly the original order,
with exactly the original source ownership. Short paragraphs are represented by
newlines inside those objects, not by splitting or moving source owners.

Changed prose text indices, zero-based:
`[0, 1, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]`.
Unchanged prose text indices: `[2, 4]`.

| Template prose index | Source owner | Exact nature of the change | `changes` |
|---|---|---|---|
| 0 | `p0104#4` | Three short lines; rephrase the initial-condition sentence and free-fall introduction without changing the condition. | `["wording","layout"]` |
| 1 | `p0104#5` | Formula untouched; outside-math full stop becomes Chinese `。`; retain label `(1)`. | `["layout"]` |
| 2 | `p0104#6` | No change. | `[]` |
| 3 | `p0104#7` | Formula untouched; outside-math full stop becomes Chinese `。`; retain label `(2)`. | `["layout"]` |
| 4 | `p0104#8` | No change. | `[]` |
| 5 | `p0104#9` | Formula untouched; outside-math full stop becomes Chinese `。`; retain label `(3)`. | `["layout"]` |
| 6 | `p0104#10` | Outside-math full stop becomes Chinese `。`. | `["layout"]` |
| 7 | `p0104#11` | Three short sentences for historical attribution, known acceleration, and the inverse problem; declare Galileo only on this source-bound block. | `["wording","layout"]` |
| 8 | `p0104#12` | Two complete sentence lines with Chinese full stops. | `["layout"]` |
| 9 | `p0104#13` | Chinese full stop. | `["layout"]` |
| 10 | `p0105#1` | Add the colon after `定义`; retain the all-values-on-the-given-interval condition. | `["layout"]` |
| 11 | `p0105#2` | Put unchanged formula and existing `(4)` label on one line; comma remains outside math. | `["layout"]` |
| 12 | `p0105#3` | Chinese full stop; definition conclusion otherwise unchanged. | `["layout"]` |
| 13 | `p0105#4` | Whole Example 1 kept in one owner, with three short paragraphs; derivative chain on its own line; retain the constant-7 discussion, nonuniqueness, and next-subsection sentence. | `["wording","layout"]` |
| 14 | `p0105#5` | Whole Example 2 kept in one owner, with two short paragraphs; derivative chain on its own line; modernize `象` to `像` and separate the unchanged interval into a concluding sentence. | `["wording","layout"]` |

Exercises remain ten objects, 392-401, with unchanged numbering, order, group,
group_id, pages, figure references, source_text and embedded source snapshot:

- 392-397: replace only Cyrillic subpart labels `а)` / `б)` with Latin `a)` / `b)`.
  The existing prefix and two separate subpart lines remain. Retain the `*` on 397.
- 398-401: separate each unchanged number prefix from its unchanged formula into
  two lines. The group instruction remains exactly `求函数$f$在$R$上的原函数：`.
- For all ten, `lines` exactly equals `text.split("\n")`; `changes` is `["layout"]`.
- 392-397 are UNSOLVED proof/verification requests, two subparts each. Giving both
  `F` and `f` in the prompt does not make these solved examples. No proof was added.
- 398-401 are UNSOLVED requests to find primitives on `R`; no primitive was added.
- 394a retains the already corrected interval `]0,\infty[` exactly. No new
  correction or erratum was introduced.
- 401 retains literal `$f(x)=2\frac{1}{2}.$`. This is the existing mixed numeral,
  with value 5/2, not a product or an instruction to replace it by `\frac{5}{2}`.
  It was not rewritten.

No formula punctuation, sign, variable, exponent, coefficient, derivative mark,
operator, interval bracket, or math delimiter was altered. Existing ASCII
punctuation inside exercise math remains exactly as supplied.

## Exact Final Prose

Each heading identifies the unchanged template object and source owner. Blank
lines inside a fenced block are the authored paragraph boundaries.

### `prose[0]`: `p0104#4`

```text
我们来回想在力学中运用微分运算的例子。
物体在初始时刻 $t=0$ 的速度为 $v(0)=0$。
在地球上自由下落时，$t$ 时刻物体通过的路程为：
```

### `prose[1]`: `p0104#5`

```text
$s(t)=\frac{g}{2}t^2$。(1)
```

### `prose[2]`: `p0104#6` (unchanged)

```text
利用微分求出速度：
```

### `prose[3]`: `p0104#7`

```text
$s'(t)=v(t)=gt$。(2)
```

### `prose[4]`: `p0104#8` (unchanged)

```text
二阶微分得出加速度：
```

### `prose[5]`: `p0104#9`

```text
$v'(t)=a(t)=g$。(3)
```

### `prose[6]`: `p0104#10`

```text
可以看出，加速度是不变的。
```

### `prose[7]`: `p0104#11`

```text
在这个问题中，公式(1)是由伽利略从实验得出的。
力学中更普遍的另一种情况，是已知加速度所服从的规律（在上例中它是不变的）。
这时，需要求出速度 $v(t)$ 的变化规律，并求出坐标 $s(t)$。
```

### `prose[8]`: `p0104#12`

```text
为此，可以采用作为微分的逆运算的积分运算。
在这一章里，我们来学习积分运算。
```

### `prose[9]`: `p0104#13`

```text
我们先来看几个定义。
```

### `prose[10]`: `p0105#1`

```text
定义：如果对于给定区间上所有 $x$ 的值，
```

### `prose[11]`: `p0105#2`

```text
$F'(x)=f(x)$，(4)
```

### `prose[12]`: `p0105#3`

```text
那么函数 $F$ 就叫做函数 $f$ 在这个区间上的原函数。
```

### `prose[13]`: `p0105#4`, WHOLE solved Example 1

```text
例1：函数 $F(x)=\frac{x^3}{3}$ 是函数 $f(x)=x^2$ 在区间 $]-\infty,\infty[$ 上的原函数。
因为对于所有的 $x\in]-\infty,\infty[$，有：
$F'(x)=\left(\frac{x^3}{3}\right)'=\frac{1}{3}(x^3)'=\frac{1}{3}\cdot 3x^2=x^2=f(x)$。

容易看出，$\frac{x^3}{3}+7$ 具有同样的导函数 $x^2$。
因此，函数 $\frac{x^3}{3}+7$ 也是 $x^2$ 在 $R$ 上的原函数。

显然，可以用任何一个常数代替7。
因此，我们看到，求原函数的问题不是唯一的，它有无穷多个解。
在下一小节里，我们将要看到怎样求出所有这些解。
```

### `prose[14]`: `p0105#5`, WHOLE solved Example 2

```text
例2：在区间 $]0,\infty[$ 上，函数 $f(x)=\frac{1}{\sqrt{x}}$ 的原函数是 $F(x)=2\sqrt{x}$。
因为对于这个区间上的所有 $x$ 的值，有：
$F'(x)=(2\sqrt{x})'=2\cdot\frac{1}{2\sqrt{x}}=\frac{1}{\sqrt{x}}=f(x)$。

像例1一样，$2\sqrt{x}+c$（$c$ 是任意常数）是函数 $\frac{1}{\sqrt{x}}$ 的原函数。
这里的区间仍为 $]0,\infty[$。
```

## Whole Solved Owners and Definition Whitelist

All template prose indices below are ZERO-BASED. Display-flow indices are a
separate coordinate system and are not stored as `section_breaks`.

| Owner classification | Exact source refs | Template indices | Final display-flow indices | Future blind concept use |
|---|---|---|---|---|
| WHOLE solved free-fall demonstration | `p0104#4`, `p0104#5`, `p0104#6`, `p0104#7`, `p0104#8`, `p0104#9`, `p0104#10` | `[0,1,2,3,4,5,6]` | `[0,1,2,3,4,5,6]` | Exclude the entire demonstration, conditions, formula labels and conclusion together. |
| WHOLE solved Example 1 | `p0105#4` | `[13]` | `[13,14,15]` | Exclude ALL three paragraphs, including constant replacement, nonuniqueness, and the concluding forward reference. |
| WHOLE solved Example 2 | `p0105#5` | `[14]` | `[16,17]` | Exclude BOTH paragraphs, including the arbitrary-constant and interval conclusion. |
| Separate UNSOLVED definition authority | `p0105#1`, `p0105#2`, `p0105#3` | `[10,11,12]` | `[10,11,12]` | Parent may whitelist only these three complete objects together for the actual definition. |
| Motivation/transition, not part of the definition whitelist | `p0104#11`, `p0104#12`, `p0104#13` | `[7,8,9]` | `[7,8,9]` | Do not silently expand the definition whitelist to include these. |

Exact parent selection:

```text
definition_template_prose_indices_zero_based = [10, 11, 12]
definition_template_prose_ordinals_one_based = [11, 12, 13]
definition_source_refs = ["p0105#1", "p0105#2", "p0105#3"]
whole_solved_template_prose_indices_zero_based = [0, 1, 2, 3, 4, 5, 6, 13, 14]
whole_solved_display_flow_indices_zero_based = [0, 1, 2, 3, 4, 5, 6, 13, 14, 15, 16, 17]
```

The quantifier, derivative relation, and definition conclusion form one
concept-authority selection. No fragment from either example, including the
apparently general discussion of constants or infinitely many primitives, is
included. Layout changes never reduce the solved exclusion owner.

## Source-Bound Historical Declaration

Only `prose[7].historical_entities` was populated:

```json
[
  {
    "term": "伽利略",
    "reason": "来源 p0104#11（印刷页98，lesson.source.sha256=44dfb7277e2c0bde32915d7c9fad39e9441e6c0de0aaf8395caae79ac1ad2bda）将公式(1)的实验推导归于真实科学史人物伽利略；原文快照和现代文本均保留该身份，不替换为虚构姓名。"
  }
]
```

The term occurs in that same object's original `source_text`, embedded source
snapshot, and modern text. This preserves the existing historical attribution;
it does not claim an independent historical verification or create a lesson-wide
profile exemption. No other historical declaration was added.

## Tool-Selected Section Breaks

The current tool was run against the edited lesson template before copying its
exact adjacent `{before, after}` boundary objects. The final read-only tool run
resolved them to `[7, 9, 13]`, with 18 paragraphs and unchanged `blockIndex`
ownership. These numbers are reported tool results, not authored break indices.

Concept transitions:

- Completed forward free-fall demonstration to the known-acceleration inverse problem.
- Integration motivation to the definition introduction.
- Complete definition to its worked illustrations.

No section break is placed inside a whole solved owner, or between the two
worked illustrations merely because the printed example number changes.

Exact stored value:

```json
[
  {
    "before": "可以看出，加速度是不变的。",
    "after": "在这个问题中，公式(1)是由伽利略从实验得出的。\n力学中更普遍的另一种情况，是已知加速度所服从的规律（在上例中它是不变的）。\n这时，需要求出速度 $v(t)$ 的变化规律，并求出坐标 $s(t)$。"
  },
  {
    "before": "为此，可以采用作为微分的逆运算的积分运算。\n在这一章里，我们来学习积分运算。",
    "after": "我们先来看几个定义。"
  },
  {
    "before": "那么函数 $F$ 就叫做函数 $f$ 在这个区间上的原函数。",
    "after": "例1：函数 $F(x)=\\frac{x^3}{3}$ 是函数 $f(x)=x^2$ 在区间 $]-\\infty,\\infty[$ 上的原函数。\n因为对于所有的 $x\\in]-\\infty,\\infty[$，有：\n$F'(x)=\\left(\\frac{x^3}{3}\\right)'=\\frac{1}{3}(x^3)'=\\frac{1}{3}\\cdot 3x^2=x^2=f(x)$。"
  }
]
```

Command evidence:

```bash
node /Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs --json /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-modern10c97/adapt/10c/modern-us-neutral/lessons/ana10-c7-s1-n97/lesson.template.json
```

Exit code: 0. Paragraph count: 18. Source prose-object count: 15.

## Formula Equality and Preservation Evidence

Read-only in-memory Node comparisons used pre-edit bytes of only the three
owned templates; no backup file or other workflow artifact was created.

- For EACH of the 15 prose and 10 exercise targets, the ordered list of complete
  `$...$` math strings is exactly equal to both the pre-edit text and that
  target's unchanged `source_text`, including every internal character.
- Exact formula-string occurrence counts: prose 31, exercises 20, total 51.
  These are occurrences, not counts of unique mathematical expressions.
- For EACH target, the ordered sequence of numeric tokens is equal to both the
  pre-edit text and unchanged source_text.
- Actual numeric changes: **0**. Every `numeric_changes` remains exactly `[]`.
- Mathematical changes: **0**. No `math-correction` or `context-number` was added.
  Lesson `errata` remains `[]`.
- All `source_refs`, exercise `pages`, `source_text`, `source.data`,
  `source.sha256`, object counts, source identities, group strings, group IDs,
  figure refs, figure lists, and all unowned metadata fields are unchanged.
- Exercise changes reduce exactly to the label mapping and whitespace changes;
  after reversing only `a)`/`b)` to `а)`/`б)` and collapsing whitespace, every
  exercise text equals its pre-edit text.
- The modern exercise texts contain no Cyrillic letters. The faithful embedded
  snapshots retain their original labels untouched.
- Specific literal checks passed for corrected 394a `x\in]0,\infty[` and 401
  `$f(x)=2\frac{1}{2}.$`.
- The figure template is byte-identical to its baseline; no image generation,
  figure-spec authoring, image opening, or figure output was performed.

Preserved embedded source hashes:

| Snapshot | SHA-256 |
|---|---|
| Lesson `source.sha256` | `44dfb7277e2c0bde32915d7c9fad39e9441e6c0de0aaf8395caae79ac1ad2bda` |
| Exercises `source.sha256` | `153f222b103ba5e1b2e09bbb02f950bf70f0dddcc624dbb04ce91c8bd0f3ca5e` |

These source hash fields were preserved, not recomputed from separately opened
source files. `source.data` was compared structurally against its in-memory
baseline and is unchanged.

## Template Byte Hashes

File names in this table identify the full paths listed in Scope and Files.
SHA-256 was computed from actual file bytes.

| File | Pre-edit SHA-256 | Final SHA-256 | Final bytes |
|---|---|---|---|
| `lesson.template.json` | `07f46d3f69df34c01ee8e22a86bec054ba8de290c5146a27416809f02f754407` | `60099725cd867c014e8a5f8b2aa80f1f242cf6d7d416d3c081608a925d24e721` | 15400 |
| `exercises.template.json` | `7e5b2e7e1c701188148073d1b86da76ed398f373653fa67399d234c3acbf5301` | `fbd7dfe7c4ef732d4918fdd6f5189967b97b68cf9162ed5c0b0e4bf5091bd871` | 13799 |
| `figures.template.json` | `239a0c182b67cd62689d595cac8037c5adc410063d227c7646b0adbe185abc44` | `239a0c182b67cd62689d595cac8037c5adc410063d227c7646b0adbe185abc44` | 154 |

The author report's own byte SHA-256 is returned in the final closeout after this
file is written; it is not embedded into its own bytes.

## Explicit Stop

Not performed: prepare rerun; finalize/adapt-finalize; render; validate_publish;
DB connection; env read/change; publish; app, dependency, schema or Charter
change; Git operation; SkillHost update; grill; new workflow; new ticket; another
chat message; answer or choice authoring.

No claim of renderer appearance or publication acceptance is made. Further
pipeline work belongs to the parent after receiving this n97-only report.

WAIT.
