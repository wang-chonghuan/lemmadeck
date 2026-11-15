# Modern Text Author: phy6-c3-s27 / phy6-c3-s28

2026-11-15. **AUTHOR COMPLETE: draft text frozen, independent review pending.** Author-only modern text for 6p section 41 / section 42, using the complete durable raw lessons assembled through approved physical page 105. Neither lesson is approved, finalized, published or counted toward batch6 by this report.

## Scope And Files

Used the existing `adapt-prepare` entrypoint for exactly `phy6-c3-s27` and `phy6-c3-s28`, without `--force`, with an isolated work root to avoid overwriting parallel agents' shared scratch templates.

Frozen text files:

- [s27 lesson.template.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c3-s27-s28/adapt/6p/modern-us-neutral/lessons/phy6-c3-s27/lesson.template.json)
- [s27 exercises.template.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c3-s27-s28/adapt/6p/modern-us-neutral/lessons/phy6-c3-s27/exercises.template.json)
- [s28 lesson.template.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c3-s27-s28/adapt/6p/modern-us-neutral/lessons/phy6-c3-s28/lesson.template.json)
- [s28 exercises.template.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c3-s27-s28/adapt/6p/modern-us-neutral/lessons/phy6-c3-s28/exercises.template.json)

The command also generated the standard draft `figures.template.json` scaffolds and an unused `book.template.json` within this isolated scratch root. They were not manually edited, approved or promoted; no existing shared or durable source/index was changed. No modern FigureSpec or image was authored.

## Text Decisions

All original prose, prompts, titles, identities, source bindings, ordering, figure IDs and quantities are retained. Source snapshots and their tool-generated hashes are unedited.

Culture-neutral wording required no cultural replacement. No fictional names, institutions, quantities or source-based scientific statements were rewritten. Edits are solely `layout`: Chinese full stops outside math, sentence breaks, normalized short paragraphs and matching exercise `lines`. The source emphasis spans remain intact.

| Lesson | Section / Title | Raw Blocks | Final Prose Paragraphs | Questions | Figures | Boundaries In Final Flow |
| --- | --- | ---: | ---: | ---: | --- | --- |
| phy6-c3-s27 | 41 / 自然界和工程技术中的摩擦 | 16 | 16 | 5 | 78, 79, 80 | 8, 12 |
| phy6-c3-s28 | 42 / 分子间的相互作用力 | 8 | 7 | 4 | 81, 82 | 3, 5 |

The boundary indices above are diagnostic output only. Both templates store full adjacent `{before, after}` paragraph-text anchors, not integer indices.

- s27 retains beneficial/harmful friction, walking/sand, holding objects, braking/startup, tire tread/chains, the friction-disappearance prompt, lubrication, sliding-bearing construction, rolling bearings and all applications.
- s27 retains the original sliding-bearing caption mapping `1` to 轴承架, `2` to 轴瓦, `3` to 轴 and `4` to 加油孔. The original 巴氏合金 circled-footnote formula marker is unchanged; no unsupported footnote text was invented.
- s27 retains exactly `$\frac{1}{20}\sim\frac{1}{30}$`, including its original ordering. Its five questions remain in `g1` / “问题”, with unchanged `number`, `source_number`, source pages and empty exercise figure-reference lists.
- s28 retains `1` 毫米平方, approximately `250` 牛顿 and `25` 千克; no conversion or change to the source's approximate force/mass relationship.
- s28 retains figure 82's upper/middle/lower references and attraction/repulsion progression, and the full steel-cable stretching/compression explanation. Its four questions remain in `g1` / “问题” with unchanged identities/bindings.
- All `numeric_changes`, `historical_entities` and `errata` remain empty. No mathematical correction or solution/answer annotation was introduced.

## Final-Normalized Anchors

Before editing the anchors, constructed candidate text in memory, applied the existing `edition.normalize_lesson_layout`, then obtained the final paragraph outline through `edition.prose_flow_contract`, which invokes the existing `prose_flow.mjs --stdin`. Selected the actual adjacent paragraph pairs by source-bound block identity, not by hand-counted authored paragraphs:

- s27: first normalized paragraph of `p0101#9` (harmful friction) after the preceding reflection prompt; first normalized paragraph of `p0102#4` (rolling bearings) after the final sliding-bearing paragraph.
- s28: first normalized paragraph of `p0104#6` (distance/force comparison) after the compression explanation; first normalized paragraph of `p0104#7` (steel-cable application) after the final molecular-distance paragraph.

The templates contain the returned full-text anchors. After the sole spacing repair described below, rederived the affected s28 anchor through the same in-memory normalized flow. Final author checks confirm normalization is idempotent and every stored anchor matches its unique adjacent final-paragraph pair.

Complete normalized paragraph outlines and resolved anchors are in [author-evidence.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c3-s27-s28/author-evidence.json). These are author-side structural evidence, not independent review approval.

## First Failure And Minimal Repair

The first author check exited 1:

```text
AssertionError: ["phy6-c3-s28.prose[6] 的非公式数字变化未被准确声明: want=['82', '82'], got=['82', '82', '82']"]
```

The proposed nonessential spacing change `图 82的上图` -> `图 82 的上图` exposed an unchanged figure number to the existing `NUMBER` expression's `(?![\w.])` boundary. Chinese `的` is a word character, so the source signature had not counted that first `82`. No number or source fact had changed.

Before repairing, copied the full s28 draft lesson/exercises/figure scaffold plus the author helper into [failure-01-number-spacing](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c3-s27-s28/failure-01-number-spacing/first-failure.md). The original failed lesson SHA256 is `5eb9ec9315aaf286f857b1fb7a982d8bc26f0f62dfdbacbc1935dbc6e88e4666`.

Sole minimal repair: restored original `图 82的上图` spacing in the modern paragraph and its newly rederived adjacent anchor. No validator/tool/threshold/source change or artificial numeric declaration. The first failure and its snapshots remain intact.

## Actual Commands And Results

All Python commands used the existing shared runtime, with `PYTHONDONTWRITEBYTECODE=1` and `-B`; no new environment or dependency.

```sh
PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/p2c.py adapt-prepare --book 6p --edition modern-us-neutral --lesson phy6-c3-s27 --lesson phy6-c3-s28 --work .tmp/ld-s10y-lesson/text-author-c3-s27-s28
PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/ld-s10y-lesson/text-author-c3-s27-s28/author-check.py
PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/ld-s10y-lesson/text-author-c3-s27-s28/author-check.py --verify-frozen
```

Prepare exited 0. Author check first exited 1 as retained above; after the sole spacing repair exited 0. Final freeze verification exited 0 with `UNCHANGED: 20 frozen inputs/templates`.

The focused author helper compares complete source snapshots and actual raw hashes, all source block fields/identities, words after only the declared punctuation/whitespace normalization, exact math substrings, existing mathematical/non-math number signatures, prompt counts/groups/source pages/figure references, exercise line arrays, allowed cultural text, untouched figure-source scaffolds/bytes and normalized adjacent section anchors. No text-validation error remains. It does not perform independent semantic review or figure acceptance.

## Frozen SHA256

These are hashes of the complete text template files, including source snapshots and final anchors:

| Lesson | lesson.template.json | exercises.template.json |
| --- | --- | --- |
| s27 | `ea115767149acc2ade3d1b2a74028fe574dc75f8ea51a86806ec3a690980db58` | `5e94bf782b9a8812cea9d80af5abb19e54fa295a8438afdc3e030de813695bf4` |
| s28 | `2b9207e7a552d55178c18e97c4ae812cf2908d6d889e0645c19b4be67808bc7d` | `15ba255ebfed40560adb940416f546b8f609e9ebd94422e10fc92e35c51fb5dd` |

Raw sources, unchanged:

| Lesson | raw lesson.json | raw exercises.json |
| --- | --- | --- |
| s27 | `a7b5bb9022b03fc89659befa4614fde6fc19785b45a08f85428d13fce02b7dae` | `dcc9482cb3762f2d04d871913ad446277ebf7dabc44fbd37d800609cf3bf5da3` |
| s28 | `c8d7a200e2c20391aa5f20a62a80be4f47f333da4af0a219ac8732d8168b085e` | `d95f1a05443b659ea2371ac0c405d380c913e68ca1c6d453be2bde8ec1ea4ef4` |

Author helper SHA256: `46e56ba2a9c8d11f89ed0ec0b6e4679cd66d59d33955e2581ab378e6a12c385a`.

Author evidence SHA256: `092880759dd98245408bcdd634b7f5e5dad1f75953b6bf24a9e1080cfaf51d1b`.

## Handoff Boundary

Both text drafts remain `status: draft`. Await independent modern-text review; modern figures are separately owned work. No answers/choice material was read, no modern image authored, no independent review self-approved, no adapt-finalize/render/publish/assemble executed, no raw page/lesson or existing index modified, and no app/DB/Git/dependency action.

All task commands have exited, with no in-flight command/browser session. This author report is delivered independently before beginning the separately authorized source review of 116-120. The next source batch remains in-flight preparation, not batch6 completion.
