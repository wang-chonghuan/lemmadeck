# STEMROBIN-180 Modern Text Author C5 S11

Role: modern text author, not independent reviewer.
Status: frozen author candidate, main-appointed TEXT review pending.
Lesson: phy6-c5-s11, printed78“势能”, physical207–208/printed196–197.

## Frozen Candidate

Root:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c5-s11`.

Complete candidate directory:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c5-s11/adapt/6p/modern-us-neutral/lessons/phy6-c5-s11`.

- lesson.template.json SHA256: `aa2a979042248195bc661a430cd7d8fae0a0642ecac2e3c8aad2c8abbbe95e7a`.
- exercises.template.json SHA256: `761873bb3ce2ea9f0c5808a7e6ff4e5501de4c0962a13f3cd5ffaaf5fc0e8772`.
- figures.template.json SHA256: `eca8b1c256777641ffcfcf4093758d01a806c880364c6f73c392c8195278f9f4`.
- source-freeze.json SHA256: `59ed102e9ae4b4c6b2564859d15a670efb82deae99a141c668c3372b5aa582e8`.

The root contains the untouched three prepared-original templates, complete
raw-source-snapshot, full-text-snapshot.json, prose-flow.json, actual helper
execution records, source bindings, author-freeze-manifest.json and author-handoff.json.
Handoff and manifest hashes are returned by the freeze command, not hand-created.

## Content

Complete raw lesson.json/lesson.md/exercises.json, source207/208MD, and each actual
full source PNG were read as context. No source page gates or source reviews were
repeated. The already-prepared main templates are exact current raw snapshots:
lesson SHA256 `93cd3ff8a6e3f151198c434e760c56757bec799a700733f6d1757a9fb2511ffc`,
exercises SHA256 `a6b924a23b5957011dc506996040b881a218eaa8dd9fab56685e173feede9282`.

All8source prose blocks,7source tasks,0figures, source_text/source.data,
source references, item identities, groups and numbers are preserved.
Five“问题”tasks and two“练习39”tasks retain stable IDs1,2,3,4,5,g2-1,g2-2.
Exercise5retains all three questions; g2-2retains both requested quantities.
100kg,500kg,10m,4m remain unchanged, with no added numerical givens or formulas.

The modern layer regularizes punctuation, merged bold delimiters and complete
sentence layout. Necessary conceptual clarification is explicit: the gravitational
zero at ground is a reference convention, not zero of every form of energy;
a compressed spring at ground is the counterexample, not an added task.
The pile-driving example identifies the raised hammer, not the entire machine,
as the working gravitational-energy carrier. The compressed-gas comparison is
qualified as the same gas with other conditions equal. All original water/dam,
spring-door, rifle-striker, watch/toy, heat-engine and pneumatic-pick examples remain.
The original emphasized definition, elastic-deformation statement and both
compressed-gas emphasized clauses remain emphasized.

## Actual Mechanics

Used the shared existing interpreter:
`/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python`.

```text
<shared-python> -B /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c5-s11/author-tools.py start
<shared-python> -B /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c5-s11/author-tools.py layout
<shared-python> -B /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c5-s11/author-tools.py check
<shared-python> -B /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c5-s11/author-tools.py freeze
```

start copies existing main templates; it is NOT adapt-prepare. This author ran
zero official prepare calls. Main's existing-file-guard exit1 is user-reported;
its original failure evidence was not touched and no retry was made.

layout used existing edition.normalize_lesson_layout and
edition.normalize_exercise_layout, then one actual prose_flow.mjs invocation.
Final normalized flow is9paragraphs. Two section_breaks are exact adjacent
anchors at flow indices5and7, copied from that result, not calculated from raw blocks.
The TEXT-only check reused the captured unchanged normalized flow without
rerunning prose_flow. It used current edition source/identity/text/numeric/math/
profile/reference/layout helpers and one mathcheck.

First TEXT-only check: exit0,15targets,0errors,0warnings.
No firstFAIL; total repair use0/1. This is mechanical author evidence only.
Helper/tool hashes before and after are recorded in layout-execution.json and
text-only-mechanics.json; source bindings are verified unchanged at freeze.

## Boundary

No answer keys, choices, private solutions/history, figure authoring, browser,
service, environment/dependency, DB or Git work. No canonical/source/tool edits,
adapt-finalize, retain, assembly, promotion or publication. No selfindependent approval.
TEXT and source-only answers are separate roots. No in-flight sessions at TEXT freeze.
Token usage not measured; model/service requests and new cost are zero.
