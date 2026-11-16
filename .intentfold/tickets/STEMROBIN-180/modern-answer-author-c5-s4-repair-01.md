# phy6-c5-s4 Sole Historical Metadata Repair

Identity: `answer_author_not_independent_reviewer`. Status: repaired author candidate frozen, pending main's FIRST final full-answer comparison. Current seven-key validation passed; independent answer approval is not claimed.

## Exact Handoff

Repair root: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/final-author-c5-s4/repair-01`.

| File | SHA-256 |
|---|---|
| New `author-handoff.json` | `b572b0c5857f935a7a917aaeebba0cd33355ce27509a01549c69d8c6cbbbb8dd` |
| New `answer-keys.template.json` | `4029c5c37e77fe7955adcc769fef7ca8529eddfd34407246d4d82d6ca0e7e3f9` |
| New `validation.json` | `462af13e26ec9d1de4b64ff0656de5f36eae0bfdefafa571e8df30f0e09ad0b8` |
| Current official `lesson_answers.py` | `9da87526a5c3d596687ce6c9171cf296b27b0e34126e079fc9ea7819c84946a3` |
| Preserved original author handoff | `e3072c70ea17d3fe30b2c07a9b0099dc6eaa63dc8c140f05f314bc84e6067e98` |
| Preserved original candidate | `42dd625522c6520eb2eeb4faf6b59b3020902060812b2091e84c57ebd4d77b6d` |
| Preserved original H6 notice | `e373d19578b50b6bc558b68041a8181863d83a52d811d018511b9e5f5dcf18e9` |

## Bounded Change

Only `/answers/5/historical_entities` and `/answers/5/notes` changed. Answer 6 retains its exact Chinese `displayAnswer`:

> 按本教材的科学史介绍，杠杆平衡的这一规律是阿基米德发现的。

Its declaration now contains `term: 阿基米德`, a reason describing the textbook's source-bound scientific-history attribution, and `lessonSourceRef: p0193#6`. The metadata note resolves the prior H6 English assumption and obsolete question-only binding requirement.

Main clarified that figure language is English, while this approved body and answer remain Chinese. The current official validator supports a declared same-lesson source paragraph for a “who discovered” question, avoiding inserting the answer into its prompt. This is a necessary metadata repair under a legitimate new tool epoch, not a content or source-derivation error. Old tool epochs and historical evidence were not retroactively updated.

All seven display answers, prompts, both prompt hash fields, ordering, source/grading, figure evidence, parts, other six keys, and all remaining fields are identical to the old candidate. There remain seven `derived/ungraded` answers and zero parts/auto keys. The open experiment and its honest absence of measured box weight are untouched.

## Source And Prompt Binding

`affected-history-binding.json` records the exact modern/source block at `p0193#6` (prose index18), including modern text, historical declaration, `source_text`, `source.data.prose` block and equal `source_refs`. The entity is present in the modern paragraph, faithful source text, source snapshot and answer.

Approved final modern inputs remain byte-identical:

| Input | SHA-256 |
|---|---|
| `lesson.json`, 26 blocks | `34746de9019264bb7ff370700929bb7b44bb5419e7a03d5bda5ed49f5b089cb9` |
| `exercises.json`, seven prompts | `78d18ac6b89ae5c84b38560bbaddf592ec3d59861813496f1a2f000601eb9180` |
| `figures.json` | `89c8723ae119e800a30e21d30273c77035f543ab4d8be0a96d931025917358bb` |
| Exact seven-prompt binding file | `b335e9045015915d88aad856c3820e7f206b76e6e5a0026d06061fb3a72ce8f8` |

`repair-input-bindings.json` records old frozen evidence without rehash replacement, separately bound current tools/skill/profile, unchanged final prompts, original own pre-key source freeze, and reused approved figure bindings. `preserved-old-freeze.json` records unchanged original handoff/candidate/notice and every file listed in the old freeze. No private main source, other answer keys or choices were accessed.

## Actual Validation

Exactly once:

```text
env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python .tmp/ld-s10y-answer/final-author-c5-s4/repair-01/repair-and-validate.py
```

The helper called the current official `lesson_answers.validate_lesson` once on the repaired seven-key candidate and exact isolated exercises, with the exact final lesson beside them for the source paragraph binding. Result: exit0, no validation errors. This did not call official finalize or retain.

Mechanical-inclusive repair consumed **1/1**; no further author repair is available. No old source/mechanical/KaTeX gate, focused tests, figure/render/theme gate, browser, model service, DB, Git, publication or canonical edit was run. Original author evidence remains immutable. Handoff is ready for main's FIRST final-answer comparison; work stops here.
