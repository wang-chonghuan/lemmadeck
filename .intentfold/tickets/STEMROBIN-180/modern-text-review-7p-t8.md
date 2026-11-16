# STEMROBIN-180/C: Metal Casting Text FIRST Review

**Decision: PASS**

Independent, full, offline TEXT FIRST review on 2026-11-16, solely `phy7-c1-s2-t8`, **金属的铸造**（补充阅读材料）. No concrete text defects or within-scope uncertainties found. This decision does not approve figure content, a live product, or course completion.

## Scope

Workspace W: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Ticket T: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180`.

Candidate: the five immutable files in T's `tmp/t8-text-author-ready/`: `lesson.template.json`, `exercises.template.json`, `figures.template.json`, `prose-flow.json`, `manifest.json`. Original `tmp/t8-text-author/` remained unchanged. Raw authority: W's `ssot-resources/soviet10year-textbooks/artifacts/7p/lessons/phy7-c1-s2-t8/{lesson.json,exercises.json}`.

Read the lesson skill, edition text contract, neutral-edition profile and official text-flow implementation. Review covers every source block and all source-to-modern text, not a sample: **8/8 source blocks (4 original p + 2 fig identities + 2 cap), 6/6 final text paragraphs, 2/2 figure identities in order 230 then 231, 0 exercises, 0 invented questions**.

Only this report and direct leaves of T's `tmp/t8-text-first-review/` were written. Concurrent work outside that ownership was untouched.

## Pre-review Grouping

Before the independent decision, executed the official `edition.normalize_prose_layout` in memory on the ready text and original author text. Ready text was already exactly normalized. Normalizing the original author document reproduced the ready document structurally, with **zero non-whitespace delta** in every block. Only the long seven-sentence source paragraph receives the ready draft's two additional blank-line boundaries; no source correction, rejection, repair, or re-review occurred.

The skill's `.venv/bin/python` was absent, and whole-module import under system Python lacked `PIL`. No environment, dependency or shared code was changed. Instead, compiled the unmodified AST nodes for `MATH`, `masked_math`, `nesting_depths` and `normalize_prose_layout` from the directly hashed `edition.py`, then called `edition.normalize_prose_layout`. No substitute algorithm or import stub was used. Python bytecode writing was disabled.

Called only `htmlfrag.js`'s text-only `proseFlow` and `proseOutline`, not a renderer or validator. The resulting complete flow exactly matches the supplied ready `prose-flow.json`, including six text paragraphs and the two figure/caption pairs. `section_breaks=[]` introduces no invented separator.

## Every Source Block

Indices below are zero-based JSON indices. Final paragraphs P1-P6 correspond to official outline indices 0-5. Full source and modern wording, metadata and complete final flow are frozen in `full-text-comparison.json`; this table records the independent semantic judgment.

| Source block | Source refs | Final text | Independent observation |
|---|---|---|---|
| 0, p | `p0264#10` | P1 | Both sentences retain heating/melting, cooling/solidifying as the casting basis, and varied products. The comma separates existing clauses; sentence stops and line layout do not change the proposition. |
| 1, p | `p0264#11`, `p0265#5` | P2-P4 | All seven sentences remain in source order: wood pattern; metal sand flask; moist packed moulding sand; careful pattern removal and matching cavity; conditional upper/lower flask; oven drying and sprue filling; solidification before extraction; larger pattern volume for shrinkage with the original majority qualifier. |
| 2, fig | `p0265#1` | Identity only | Empty text, `fig-230`, `图 230`, page and first-figure placement unchanged. The wood-pattern text retains its reference. No image content approved. |
| 3, cap | `p0265#2` | `图230` | Exact caption, label, null id and page retained, paired with fig-230. No descriptive caption invented. |
| 4, fig | `p0265#3` | Identity only | Empty text, `fig-231`, `图 231`, page and second-figure placement unchanged. The flask/sand text retains its reference. No image content approved. |
| 5, cap | `p0265#4` | `图231` | Exact caption, label, null id and page retained, paired with fig-231. No descriptive caption invented. |
| 6, p | `p0265#6` | P5 | Some factories use a pre-made high-melting-point metal mould instead of a sand flask. Qualification, contrast and material are retained; no new method or advantage added. |
| 7, p | `p0265#7` | P6 | Plastic or rock casting remains; molten-rock examples retain pipes, machine-tool bases and building components. Both original sentences survive. |

## Whole-text Review

P1 establishes the casting basis. P2 follows pattern creation, moist sand packing, pattern extraction and the resulting cavity. P3 retains the two-part arrangement where needed, drying, sprue pouring to fill the cavity, solidification and extraction. P4 preserves the source explanation for shrinkage allowance. The unchanged 230/231 identity-and-caption pairs follow, then P5 gives the metal-mould alternative and P6 extends the original examples to plastic and rock.

There is no omitted, repeated or reordered source sentence, severed process dependency, altered referent, invented question or semantic padding. The one-sentence shrinkage and metal-mould paragraphs are valid official grouping outcomes, not reasons to add material. Do not expand the science beyond the source or require temperatures, dimensions, comparative claims, new safety instructions, or new examples for this text pass.

Title and printed title remain exactly `**金属的铸造**（补充阅读材料）`; the bold terms `木模` and `砂箱` remain. No heading or caption text was dropped or invented. Raw-to-modern differences are sentence punctuation and whitespace layout, including the first sentence's clarifying comma, not scientific or cultural rewriting.

All lesson identity fields match the raw authority, including null chapter/section/number, physical start 264 and printed start 253. Every block's kind/id/label/printed_page and ordered `source_refs` match; the merged paragraph retains both original page references rather than inventing per-paragraph refs. Each `source_text` and both embedded `source.data` snapshots match the directly read raw JSON exactly. The declared raw hashes match direct bytes.

The numeric figure references and captions remain 230/231 in order. No quantities or formulas were introduced, removed or changed; formulas present: 0; `numeric_changes=[]`; `errata=[]`. Raw and modern exercise data are identical: lesson identity retained, `count=0`, `exercises=[]`.

Cultural neutrality passes on full semantic reading as well as empty forbidden-term/Cyrillic observations. The generic factory, materials and products have no fictional Russian/Soviet names, political institutions, currency or source-bound historical identity needing substitution or declaration. Chinese prose and Chinese surrounding captions remain appropriate; the English-only figure-label rule is not a demand to translate these captions. Source wording `现在` is retained as source text, not claimed to be newly verified contemporary evidence.

## Defects And Uncertainty

- Concrete text defects: **none**.
- Unresolved uncertainty within this text scope: **none**.
- Figure pixels, FigureSpec assertions, image labels and modern artwork: **PENDING separate task, NOT APPROVED**. Figure-template paths, hashes and `modernized` declarations are metadata only, not visual evidence; no image file was opened or hashed.
- Live product and course completion: **NOT REVIEWED, NOT APPROVED**.
- Scan/OCR fidelity beyond the supplied raw JSON and external scientific currency: outside this review. No scan or network authority was consulted, and no expansion or new scientific claim was requested.

## Frozen Evidence

All evidence is under `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/t8-text-first-review/`:

- `normalization-observations.json`: exact original/ready grouping observations and official six-paragraph outline.
- `full-text-comparison.json`: every source/modern block, identity field, source ref, token observation, caption and full normalized flow.
- `semantic-review.json`: independent per-block and whole-flow judgment, exclusions and unchanged repair budget.
- `input-bytehashes.json`: direct byte lengths and SHA-256 of all 12 input leaves and 5 text contract/implementation files, with original manifest claims compared against directly read bytes.
- `seal-observations.json`: final direct input bytehash reread, separate from semantic review.
- `capture-review.mjs`: scoped evidence generator; no candidate/raw/shared writes.
- `manifest.json`: exactly `{workspaceW,files:[{path,bytes,sha256}]}`, listing every own direct leaf plus this report, excluding itself. No inherited manifest is used as proof of output bytes.

Key direct input hashes:

| Input | Bytes | SHA-256 |
|---|---:|---|
| raw lesson | 2995 | `de33e2c36dd894ec38f633a30f56e61d3bc132e606d952275b7c0876be8bf9aa` |
| raw exercises | 65 | `3768ecf9ba9838605d4c8bc893b9ec0ac2f4379b476455dc71ff0d168efa3d60` |
| ready lesson | 8831 | `3753571fbafae2f2fe80a305a7a7c7cbe43f3d8b628b25cd1715ec7e8046abb9` |
| ready exercises | 416 | `92f7525a5e4fc8569403ff4ca27274721cd4e467e165c05748554826814a978b` |
| ready figures metadata | 824 | `ad5ac84acf8976c7382a0de479fb46ac47f434439e43ef09fbe9945f105051b4` |
| ready prose flow | 6359 | `2cb5a2c938a5e8acdaadc1f5324a1f8c6556ba2568ff2e34db4f89413aa47c3a` |
| ready manifest | 1711 | `c3ba543930c9b5b4be590d86d5fda56edb1cefae7196db61950b0086199d07ad` |
| original author lesson | 8763 | `96c0cfd11a68443ac926afe82e9af11bee5bdcfc2a63ccbb55605653dc878511` |

## Return

**PASS; full coverage 8/8 source blocks and 6/6 final text paragraphs; figure identities 230 then 231; exercises 0; invented questions 0; repairs unchanged: used 0, unused 1; repairs now 0; images 0; inflight 0.**

No candidate, raw or shared code edits. No pipeline checks, renders, finalize, database, Git, app, backend, network, freshness or automation actions. Local text normalization, comparison observations and requested direct bytehash capture are the only execution evidence. This is a single independent TEXT FIRST decision, not a product handoff.
