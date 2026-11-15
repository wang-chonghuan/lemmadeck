# phy6-c4-s2 Modern Text Author Freeze

Date: 2026-11-15. Ticket: STEMROBIN-180. Role: text author only.

Status: frozen future-batch candidate for independent review. This is not independent approval,
finalization, promotion, publication, or batch-7 readiness.

## Scope And Inputs

Candidate directory:
`.tmp/ld-s10y-lesson/text-author-c4-s2/adapt/6p/modern-us-neutral/lessons/phy6-c4-s2/`.

Read the full durable `lesson.json` and `exercises.json` for §49 液压机械, the lesson skill,
`modern-us-neutral` profile and edition text contract. Actually opened the original
`ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-100.png` with `functions.view_image`.
All four source files below are byte-identical between durable raw and approved-through-130 raw.
No answer keys, choices, main source-answer freeze, or other author/reviewer reports were read.

## Official Prepare

Inspected current `p2c.py` CLI help, `common()`, `_book_dir()`, `_catalog_config()` and production
edition directory functions. The artifact flag is `--root`; `--books` selects original PDF/source
manifest and was left at its default. No new aliases, tooling, documentation or dependencies.

Executed once, without `--force`, exit 0:

```bash
env PYTHONDONTWRITEBYTECODE=1 \
  /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B \
  .claude/skills/ld-s10y-lesson/tools/p2c.py adapt-prepare \
  --book 6p --edition modern-us-neutral --lesson phy6-c4-s2 \
  --root .tmp/ld-s10y-lesson/approved-through-130/artifacts \
  --work .tmp/ld-s10y-lesson/text-author-c4-s2
```

Official output: 14 prose blocks, 4 exercises, 1 source figure. Only isolated templates were created.
The generated scratch `book.template.json` remains unedited scaffolding, SHA-256
`7ea66bb56a6367e6fcc63e9ff13c6c13480a767945d70ff70cb50a6cd4ed650a`.
No canonical index or book was changed.

## Exact Counts

| Object | Frozen Count |
|---|---:|
| Original and candidate prose blocks | 14 / 14 |
| Prose kinds | 12 p, 1 fig, 1 cap |
| Prose source-reference occurrences | 15 |
| Final prose-flow paragraphs | 15 |
| True anchored section breaks | 2 |
| Original and candidate tasks | 4 / 4 |
| Groups | g1 问题: 2; g2 练习 21: 2 |
| Source figure | 1, fig-100 |
| Exact same-order math fragments in prose | 39 / 39 |
| Math fragments in exercises | 0 |
| Source footnote definitions / marker occurrences | 1 / 2 |
| Prose text changed / exercise text changed | 12 / 3 |
| Historical declarations | 2, both source-bound 帕斯卡 |
| Numeric changes / errata | 0 / 0 |
| Modern figures, answer keys or choices authored in this text task | 0 / 0 / 0 |

All block identities, source snapshots, printed pages, title/number/start identity, original
figure/caption, task numbers, printed source numbers, groups, group ids, page references and figure
references remain intact. Tasks are `1`, `2`, `g2-1`, `g2-2`, bound respectively to
`p0122#4`, `p0122#5`, `p0122#7`, `p0122#8`.

## Author Adjustments

The footnote retains its original circled marker and the definition of hydraulic machinery.
Modern Chinese punctuation and wording replace old phrasing; the continuous bold force-gain
conclusion is preserved. The original example retains all values, units, formulas, formula numbers
and its source-authored solution; no new exercise answers were added.

The prose now distinguishes transmitted **additional pressure** from total pressure that varies
with height. It explicitly states the equal-height, same external pressure, negligible friction
and negligible piston-weight ideal model; a non-negligible hydraulic head must be considered
separately. No extra hydrostatic formula, changed formula signature, calibrated force length, or
new numerical datum was introduced.

The force-gain question retains those ideal conditions. The trade-off question remains open and
requires a reason using piston motion. The air-machine question retains a possible/impossible
judgment with complete reasons and asks for a comparison of working media. It does not declare
gas incompressible or air machines impossible, and supplies neither answer conclusions nor keys.

Ran the actual prose-flow command before copying its adjacent paragraph anchors:

```bash
node .claude/skills/ld-s10y-lesson/tools/prose_flow.mjs \
  .tmp/ld-s10y-lesson/text-author-c4-s2/adapt/6p/modern-us-neutral/lessons/phy6-c4-s2/lesson.template.json
```

Anchors resolve to paragraph indices `[4, 11]`: unloaded connected liquid columns to force-balance
derivation, and the conclusion/model limits to the original worked example. These are copied
text anchors, not authored integer boundaries.

## Original Pixel Observation

The opened PNG is 465 × 417. It shows two unequal-width upright cylinders joined through the
bottom, a thick horizontal piston boundary in each, and short horizontal liquid marks below
the pistons and in the common passage. Labels are `S₁`, `S₂`, `F₁`, `F₂`, `A`, `B`.
Both force arrows point down; the right arrow is visibly longer, but its pixel length is not a
calibrated force value. Piston/liquid boundaries are drawn approximately level. There are no
given force/area values, stroke labels, calibrated scales or exercise results. Equal-height and
negligible-weight assumptions are identified as model clarifications, not measurements from pixels.
No modern figure was created in this text task; the official source-figure template is unchanged.

## Author Checks And First Failure

Read-only shared-Python checks used production `validate_identity_fields`, `validate_text`,
`normalize_prose_layout`, `validate_numbered_subpart_layout`, `figure_sources`, and
`prose_flow_contract`, plus exact original math-fragment sequence comparisons and source/metadata
hash comparisons. These are author structure checks, not independent semantic or image review.

First attempt exit 1: one defect with two messages, both at `prose[7]` / `p0121#4`.
The paraphrased second sentence omitted the original repeated `$F_1$` and `$S_1$` fragments.
Saved its rejected text, source text, diagnostics, template hashes and full-text hash before repair.
One minimal repair only: restore those two existing fragments in their original order.
Second attempt exit 0, `errors=[]`.

The rejected template can be reconstructed in memory by replacing only the final `prose[7].text`
JSON string with the saved rejected string, leaving every other byte unchanged. This was actually
checked against the first rejected template SHA-256:
`4a607fb37a09d0a9ad92a7450180e83dd6747bd4e9d6cab716efb4a39e21bccf`.
No counter, validator, tool or source edits were used.

## Frozen Hashes

SHA-256, exact bytes:

| Candidate File | Bytes | SHA-256 |
|---|---:|---|
| lesson.template.json | 16984 | `de3f913b63022eb1e0119798fd619aea17646a05f362cf5f5f7230f4accaaed8` |
| exercises.template.json | 5649 | `b218df93632a361b9e683e264e9eb70deaccfd474f0d7cfc927f31cdd7b0506d` |
| figures.template.json, unedited | 642 | `1ce52cec4454961afb03d4653d8f287fe0f2b4bb8faaf3c95dc51cad2e22fe4d` |
| author-handoff.json | | `75b49e5c6bc7b4eac3dcd9b7345817df59348a0670e9c3d16984db9a5cee3f9a` |

| Evidence File Under Work Root | SHA-256 |
|---|---|
| author-check-first-failure.json | `000622b08d2db8fd8d9d3254dbcbc017a392ad959e5d9a7152fc7731dcc54caf` |
| author-check-final.json | `8b76f7afdc377a08f5495927b1601005a7e63e65252b6f2017c0d0bbb09cf266` |

| Raw File Under Either Source Root | SHA-256 |
|---|---|
| lessons/phy6-c4-s2/lesson.json | `c2b3ecb5c1df5ab1c182576370aaea59a76fe07eecd559ddb15bad5540ff2340` |
| lessons/phy6-c4-s2/exercises.json | `75bd800d010c82abfc4f5a3424f7ad17d83f4e0c2ea0dd7342211f9bf2f336e0` |
| figures/fig-100.png | `b084c7cb7596084c85e551fde2d8f32e555764db6e76277c81f12f61bf61df6b` |
| figures/fig-100.svg | `aa6fa4d9e6e31198fc57fbb8caf3d86b7b239b620c44efe5a9d55c759dab7b49` |

Profile SHA-256:
`f03840602a5de0c22b7eea096fe24db758c6d66b6532c75cda26c6766a1573f1`.

Full prose text SHA-256:
`c04bb6e17658e412a4f02c9d89c4dc8ae4c5207a35936e7843f061a29a9a54b0`.

Full exercise text SHA-256:
`2663f806af9e7ef16183c0117bc7cf561bfb74dfebbee04e928e8a5e1b2c4104`.

Text-hash convention: UTF-8 ordered `text` fields joined with exactly two LF characters, no
extra terminal newline; prose includes the empty fig text and cap text. Per-task text hashes,
original prompt hashes and production implementation hashes are in the frozen JSON evidence.

## Boundary

Text freeze is delivered for main's independent reviewer. No independent PASS is claimed.
No finalize, promotion, assembly, vectorization, publishing, durable edition/index writes,
Git, DB, services, browser sessions, dependency changes, app/schema/tool/charter writes, or
changes to other authors' freezes. Modern fig-100 approval and main-owned official finalization
remain separate dependencies.
