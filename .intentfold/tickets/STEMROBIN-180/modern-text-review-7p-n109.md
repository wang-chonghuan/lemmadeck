# STEMROBIN-180/C Batch 26: n109 First Text Review

**Frozen decision: FIRST PASS.** No semantic or candidate-binding defects found.
Sole fresh independent FIRST TEXT review of `7p / phy7-c1-s3-n109`, authored by
Meitner. This is the same active cap3, offline, not an IntentFold formal handoff.
Approval applies only to the exact candidate bytes below, not to a completed course.

## Byte Binding

Author root: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-7p-n109/`.

| File | Bytes | SHA-256 |
|---|---:|---|
| `manifest.json` | 41900 | `8f212a6d7e165066c0d93692b4605be1bde4abd7e8819a93b0e62cdff8615c84` |
| `author-handoff.json` | 76951 | `c53869b8021f3603455c4c4e170647c9f8b3f8428a9195b7e8feb8bee90ff0ba` |
| `lesson.template.json` | 10363 | `42c1615405ca4a4893b4bce65985c551ab6af6ec27e6003dc0d7c8257694c76a` |
| `exercises.template.json` | 3269 | `27160c001fb8bb5ffcdd9969d496b9b17e6a75ff6094c499ad32a0dec53c65a9` |
| `figures.template.json` | 154 | `d1ab32c6c8745660906e8bca7b98fea7e7194b9ffd0f1d6ffb0c220908ab3927` |

Current raw lesson JSON, lesson Markdown and exercises JSON equal their frozen
copies byte-for-byte. All eight frozen input records match their declared bytes
and hashes. Both complete `source.data` objects equal current raw JSON; both
`source` objects equal the original templates. All nine `source_text` values and
all three task `source_text` values equal raw text. Returned template files and
the handoff's embedded UTF-8/base64 bytes equal the three candidates.
All seven original tool receipts, their seven call files and fourteen stream files
were byte-bound without executing their commands.

## Every Prose Object

Indices below identify objects and paragraphs in the author's existing output;
they are not newly calculated section-break instructions.

| Index / Source Ref | Complete Semantic Comparison | Allowed Difference |
|---|---|---|
| 0 / `p0278#3` | Full use of fuel's large internal energy and its relationship to technical development retained. | None. |
| 1 / `p0278#4` | Useful work, raising loads, pulling vehicles and conversion from internal to mechanical energy retained. | One sentence boundary becomes a newline. |
| 2 / `p0278#5` | The complete question introducing how to realize the conversion retained. | None. |
| 3 / `p0278#6` | Small quantity of water, tightly stopped test tube, boiling, steam pressure, stopper rising, fuel-to-steam internal energy and expansion doing work all retained. | Two sentence boundaries become newlines. |
| 4 / `p0278#7` | Strong metal cylinder, closely fitting movable piston, simplest heat engine, conversion, invention in `十七世纪末` and subsequent improvement all retained. Bold `热机` retained. | Two sentence boundaries become newlines. |
| 5 / `p0278#8` | Complete bold definition `热机是一种能把燃料的内能转换为机械能的机器.` retained, including its period and bold coverage. | None. |
| 6 / `p0278#9` | Entire bold list retained: `蒸汽机、内燃机、汽轮机和燃气轮机、火箭发动机等.` | Only the adjacent bold close/open between `火` and `箭` is coalesced. No letter or emphasis lost. |
| 7 / `p0278#10`, `p0279#1` | Fuel energy to gas/steam energy, dependence on gas, expansion work, lower temperature after work and conversion to mechanical energy retained across both source refs. Exact source wording `气机膨胀而做功` retained, not silently corrected. | One sentence boundary becomes a newline. |
| 8 / `p0279#2` | Restriction to introducing the two practically usable types, internal-combustion engine and steam turbine, retained. | None. |

Every original prose metadata field other than authored `text` is retained.
Changed prose 1, 3, 4, 6 and 7 declare only `layout`; all other prose changes are empty.
No missing knowledge, added claim, changed quantity, rewritten history or formula.
The complete raw Markdown agrees with the raw prose sequence and headings.

## Every Task

| Number / Source Number | Group / Ref | Exact Unchanged Modern Text |
|---|---|---|
| `1 / 1` | `**问题** / g1 / p0279#4` | `(1) 什么样的发动机叫做热机？` |
| `2 / 2` | `**问题** / g1 / p0279#5` | `(2) 在热机中，燃料的能量转换为机械能的过程是怎样实现的？` |
| `3 / 3` | `**问题** / g1 / p0279#6` | `(3) 你知道哪些种热机？` |

All three candidate task objects and the entire exercises template are unchanged
from the frozen original template. Raw question 2 has two physical `lines`; its
modern single line was already present in the frozen template, with no missing
characters. No task renumbering, regrouping, additional subparts or answer material.
Lesson identity, null chapter, section, title, printed title, number, start physical
page 278, start printed page 267 and exercise count 3 remain unchanged.

## Recorded Prose Flow

The original `batch26-n109-text-prose-flow.stdout` is human-readable text, not JSON.
Its existing nine final paragraphs match the modern full text, including newlines
and bold. Its exact boundary objects before recorded paragraphs 3 and 6 match the
two candidate anchors:

```json
[
  {
    "before": "那么，怎样来实现这种转换呢？",
    "after": "往试管中倒进少量的水，然后用塞子将管口紧紧塞住，加热到水沸腾.\n在蒸汽的压力作用下，塞子就会从管口中蹦出来，飞到半空.\n在这个实验里，燃料的能量转变为蒸汽的内能，而蒸汽在膨胀的过程中做了功——使塞子升高."
  },
  {
    "before": "**热机是一种能把燃料的内能转换为机械能的机器.**",
    "after": "热机有很多种，如**蒸汽机、内燃机、汽轮机和燃气轮机、火箭发动机等.**"
  }
]
```

These are genuine adjacent transitions: conversion question to experiment, and
definition to engine types. The author's existing `preflight-flow.stdout` and
embedded focused-preflight flow report the same nine paragraphs, two boundaries
and resolved indices `[3, 6]`. Neither proseFlow nor another parser was rerun.
Multi-sentence paragraphs contain complete sentences; standalone definition and
question paragraphs remain complete. No handwritten ASCII `<span>` wrappers.

## Culture, Math And Figures

No fictional cultural entities or profile-forbidden names/terms require replacement.
There are no named historical people, places, countries or institutions requiring
`historical_entities`; the historical period remains intact. All item
`historical_entities`, `numeric_changes` and lesson `errata` arrays are empty.
No math spans exist in the source or modern prose/tasks, so formula splitting and
punctuation-inside-math are inapplicable, not newly validated.
Source punctuation, including the halfwidth periods, is retained; numeric question
prefixes are unchanged and have no manual HTML wrappers.

Zero source figures, zero modern figures, and empty raw/modern lesson figures and
task `figure_refs`/`figures` justify the unchanged 154-byte empty figure manifest.
No missing-graph inference was made. Actual image opens: **0**.
The authoritative prior SOURCE page approval is **reused, not duplicated**, as
explicitly directed by the user and recorded in the frozen packet. No source page,
source image, private answer, author answer key or choice packet was opened.

## Honest Receipt Limitations

Author's first `ls` exit 1 and its preserved receipt/stdout/stderr remain untouched.
Those files contain complete tool-returned text partitioned by `ls` semantics;
the original tool did not expose separate raw stream buffers or timestamps.
They are not upgraded here into fictitious raw streams. The single startup
directory repair had already spent the budget: **1/1, remaining 0**, unchanged.
The author focused preflight's PASS is existing mechanical evidence only; this
independent semantic decision comes from reading every source and modern item.

Two reviewer observation commands also returned exit 1, with no repair or rerun:
the ownership discovery `ls` found the intentionally new output paths absent;
the read-only inline byte-binding summary completed packet, candidate, source and
all receipt bindings, then attempted JSON parsing of the human-readable original
prose-flow stdout and raised `SyntaxError: Unexpected non-whitespace character
after JSON at position 4 (line 1 column 5)`. Its subsequent contract-hash and
flow-summary statements did not run and are not reported as passed. Direct `cat`
reads of that original stdout, call receipt, profiles and frozen manifest completed
the text inspection. Full commands and returned output remain in this review
chat's tool transcript; no reviewer raw-stream capture or timestamp is claimed.

## Frozen Scope

No defects, no repair request, no candidate edits, no budget reset.
Any later REVISE would be BLOCKED at budget 1/1; no repair is authorized here.
No validator, normalization, proseFlow, finalize, render or check rerun; no freshness
restart, backend/network/DB access, service operation, publication, Git operation,
merge, deployment, closure, approval edit or formal handoff. Other work preserved.
Reviewer inflight at return: **0**. This decision does not complete or publish the
course and does not authorize downstream operations.

The input readlist and bindings are in
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-review-7p-n109-first/manifest.json`;
the return artifact is `review-handoff.json` in the same reviewer directory.
