# Mass text-author handoff

2026-11-17. Assigned offline worktree: `/Users/yong/.codex/worktrees/0f12/lemmadeck`;
assigned branch: `codex/STEMROBIN-180-textbooks` (no Git commands used).
This is a frozen text candidate for independent review, not a lesson/figure approval or publication.

## Current files

All scratch paths below are relative to
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-mass-b51/`.

| Artifact | Path |
|---|---|
| Final candidate templates, still `draft` | `work/adapt/6p/modern-us-neutral/lessons/phy6-c3-s9/{lesson,exercises,figures}.template.json` |
| Approved canonical snapshots | `inputs/approved/{lesson.json,lesson.md,exercises.json,fig-44.png,fig-44.svg,fig-45.png,fig-45.svg}` |
| Untouched official prepared templates | `inputs/templates/{lesson,exercises,figures}.template.json` |
| Initial normalization and paragraph output | `evidence/normalize.log`, `evidence/prose-flow.json` |
| Single focused check and final resolved boundaries | `evidence/text-check.log`, `evidence/text-check.json`, `evidence/final-prose-flow.json` |
| Exact executable wrappers | `normalize_candidate.py`, `check_text.py` |
| Plain current-file manifest, 21 scratch files | `evidence/files.txt` |

The only durable file this author created is this handoff. Candidate templates and all ten input
snapshot files were made read-only with `chmod a-w`, exit 0, after the check. No candidate edits
followed the check.

## Inputs and authorship

Canonical input:
`ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c3-s9/`.
Official prepared input:
`.tmp/ld-s10y-lesson/adapt/6p/modern-us-neutral/lessons/phy6-c3-s9/`.
The parent supplied the sole official `adapt-prepare` PASS/exit 0; this author did not rerun it.
Four `cp -p` calls copied: three official templates to `inputs/templates/`, three canonical
lesson files to `inputs/approved/`, four canonical PNG/SVG files to `inputs/approved/`, and three
official templates to the isolated `work/adapt/` lesson directory. All four exited 0.
`mkdir -p` for these four directories exited 0.

All 16 source blocks remain: 12 prose-text blocks, two figure blocks and two captions.
Nine source blocks have changed text; three unit-relation text blocks remain unchanged.
All nine tasks are present and reworded, with groups `g1` (问题, five tasks) and `g2`
(练习 10, four tasks), printed numbers, stable identities and source bindings unchanged.
There are 15 final prose paragraphs, 14 formula spans and two section boundaries.
No numeric changes or mathematical corrections were introduced. Figure references to the
earlier 图 41 and 图 43 remain in the prose; only supplied 图 44 and 图 45 belong to this manifest.

No fictional cultural entities require replacement in this lesson. The source's kilogram
prototype definition is framed as history, without introducing a replacement modern definition
or new dates. Platinum/iridium alloy, storage location and precision copies remain.
Four declarations on `lesson.prose[9]` retain 国际千克原器, 法国, 巴黎 and 塞佛尔城, each
with a reason bound to `p0063#7`. Neutral boat, recoil and hunting-cartridge exercise facts remain;
no solutions, quantities of propellant or other new operational details were added.

## Original PNG observations

Opened each actual canonical PNG once through `functions.view_image`; no crops or reopens.

- `fig-44.png`: two vertically stacked subfigures, with original small subfigure labels
  а and б. Each has two differently drawn wheeled carts on a long horizontal support, two
  visible wheels per cart. In the upper view the carts are adjacent, with the spring strip
  bent/constrained between them; in the lower view they are separated, and the strip on the
  left cart stands upright. A central dark support/marker is visible in both views.
  There are no printed speeds, masses, measurement ticks or numerical distances.
  This supplies before/after apparatus meaning, not a numerical speed measurement.
- `fig-45.png`: a cylindrical object on a round base, inside two nested bell-shaped covers.
  Both covers have a loop/knob at the top. The drawing has no numerical values or scale.
  The object's historical identity, alloy and storage location come from approved prose,
  not inferred from the pixels.

Image use: 2/8 for this task, 2/24 in this context. Parent receives text only.
No image generation, modern specs or modern FIG gates were attempted.
The candidate `figures.template.json` is byte-identical to the supplied template.

## Calls and outcomes

Executed from the assigned worktree:

```sh
env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/ld-s10y-lesson/text-author-mass-b51/normalize_candidate.py > .tmp/ld-s10y-lesson/text-author-mass-b51/evidence/normalize.log 2>&1
env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/ld-s10y-lesson/text-author-mass-b51/check_text.py > .tmp/ld-s10y-lesson/text-author-mass-b51/evidence/text-check.log 2>&1
```

Both exited 0, once each. Preparation invoked `edition.normalize_lesson_layout` and
`edition.normalize_exercise_layout` once, then
`node .claude/skills/ld-s10y-lesson/tools/prose_flow.mjs --stdin`, exit 0.
The final check used existing source, identity, errata, text, delimiter, KaTeX and layout APIs.
Its final `prose_flow.mjs --stdin` contract validation and `katex_check.js` each exited 0;
these are constituents of the one focused check, not a rerun of a successful check.
Modern FigureSpec, render, review, generation and FIG validation functions were not invoked.
The check produced PASS with no errors or warnings; this is mechanical text evidence only.
Both boundary objects were copied from unaffected adjacent paragraphs in the initial output;
the final validator resolved them at indices 5 and 10.

Repair budget: **1 used, 0 remaining**. After normalization and before the focused check,
one manual repair batch moved two closing bold markers before sentence punctuation to remove
isolated marker lines, and clarified question 4 as asking for the first introduced unit.
No normalization rerun occurred. Candidate/check first-failure count: **0**, independently
of the repair usage. One preliminary inventory command,
`ls -ld .tmp/ld-s10y-lesson/text-author-mass-b51 ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-44.png ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-45.png`,
exited 1 because the new owned directory did not yet exist; it was not a candidate check
or a repair/retry.

Manifest command: `rg --files --hidden --no-ignore . > evidence/files.txt`, exit 0,
with cwd equal to this author's scratch root. No further validation was run.

## Frozen candidate hashes

| Template | SHA-256 |
|---|---|
| `lesson.template.json` | `4d2c771abf8bea5bd815a801100b62923dc0745284ba648a11c2ede7f2ebba8a` |
| `exercises.template.json` | `1a4f512bc4bb53b76884c1884af1b79fc2d8adc8f378f9bff1366b5aed9116b3` |
| `figures.template.json` | `565939469902d520cc1c1afbdf739c7e250fa4ecfd52451cc0078d7b9d1d0d02` |

The focused check matched source snapshots against canonical bytes, template source payloads
against the supplied inputs, and all four figure-source hashes. It did not retranscribe or
semantically re-review the approved canonical source.

No answer/solution files, choice drafts, interaction files or prior keys were read.
No services, FINAL/finalize, retain, publish, database, Git, application or dependency operations
were performed. Independent text review and the later modern figure work remain with the parent.
