# phy6-c5-s3 Modern TEXT Author Freeze

Status: TEXT AUTHOR COMPLETE, mechanical text checks PASS; awaiting main's independent full TEXT review. This is not an independent semantic approval or whole-lesson approval. All four modern figures remain deferred.

## Roots and Input

- Independent work root: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c5-s3`.
- Candidate: `adapt/6p/modern-us-neutral/lessons/phy6-c5-s3/{lesson,exercises,figures}.template.json` beneath that root.
- Canonical original read in full: `ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c5-s3/{lesson.json,lesson.md,exercises.json}`.
- Main's successful single official adapt-prepare is reused as reported by main. This author did not invoke prepare again. The three existing prepared templates were copied into the new root and separately preserved in `initial-prepared-copy/`.
- Default templates were not edited. Their original byte hashes and paths are recorded in `copy-baseline.json`; the sole text check confirms them unchanged.
- The original course has 16 source blocks, 3 questions and 4 original figures. All 16 blocks, all 3 questions, their group/source identities and all 4 figure identities remain in the candidate. `source.data`, `source_text`, source refs and question pages retain their exact original bindings.
- The input files actually used by the text check are byte-snapshotted in `author-input-snapshot/`. A whole-book input snapshot/hash is historical gate evidence, not a demand that an unrelated later assembly produce identical global book bytes.

## Full Text Changes

Only punctuation, Latin subfigure glyphs, source-attributed historical context and deterministic layout were changed.

| Source Unit | Preserved Content / Change |
| --- | --- |
| p0189#11 | Ancient use of devices to perform mechanical work; punctuation only |
| p0189#12 | Stone, cupboard and lathe examples; strong long lever; same figure176 reference; Cyrillic а/б becomes Latin a/b in the same order |
| p0189#13 | Exact original 三千年前 retained; 古埃及, 金字塔, heavy stone blocks and high lifting retained; explicitly attributed to the source textbook |
| p0189#14 + p0190#8 | Inclined plane rolling/pulling versus direct lifting, followed by pulley lifting; both figure178/179 references and both requests remain |
| p0190#1..#7 | Figure176/caption, figure177/caption, figure178/caption, figure179 block identities and order unchanged |
| p0190#9 | Bold original definition 用来改变力的装置叫做简单机械 retained; punctuation and official layout only |
| p0190#10 | Lever/pulley/winch and inclined-plane/wedge/screw classification retained in full |
| p0190#11 + p0191#1 | Household/various machines; steel-sheet cutting/rolling/pressing; fine artificial textile fibres; automatic machinery, printing machines and computers all retained |
| p0190#12 | Figure179 caption unchanged |
| p0191#2 | Understanding simple-machine principles helps understand complex-machine construction; punctuation only |
| p0191#4 | Question1 definition request unchanged |
| p0191#5 | Question2 purpose request unchanged |
| p0191#6 | Question3 asks the same historical machine-identification request; adds only 原教材所述的 attribution |

Historical declarations are local to `lesson.prose[2]` (古埃及, 金字塔) and `exercises[2]` (埃及, 金字塔), each with its actual p0189#13/p0191#6 source reason. They do not disable cultural checks globally. No fictional modern replacements, new data, scientific claim, worked answer or additional task was introduced. No knowledge request or original example was removed.

“三千年前” is preserved literally rather than replaced with a new present-day historical date. All actual non-formula numeric signatures and figure numbers match their source targets; `numeric_changes` remains empty throughout. This course contains zero mathematical `$...$` spans. Source and modern mathematical signatures are empty and equal.

## Original Pixels and Figure Boundary

Original PNGs176,177,178,179 were each actually opened individually at original detail. `source-image-observations.md` records full apparatus/context observations: two lever arrangements and their labels; pyramid/people/stone blocks/lever supports; worker/cylindrical load/cart/incline; and the complete tall pulley/masonry/rope/suspended-container scene.

Original PNG SHA-256:

- fig176: `c8bd8fa74fc7f9751e4cc60f89a47e5c239e94582e09dca56d7e7ff98720bc92`
- fig177: `b977d03afb840fdfecc8bc7c65df7ac2ad7ed8176b33d853384421255e0dc3e0`
- fig178: `2049b8283e1a3bcc0e5aed60e1a3f7c65122623f18c9c5bcbaa3f504875c1e8c`
- fig179: `270d4b17d65f45650c19b9591e2c4762191f45b2a9d5ff2a7bb486ad62775af7`

Both PNG and SVG original bindings match actual bytes in the text-check evidence. The figures template is byte-identical to the copied main-prepared template. No FigureSpec, modern drawing, rendering, independent figure approval or promotion was performed.

## Commands and Actual Results

Shared Python: `/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python`.

All commands ran from `/Users/yong/.codex/worktrees/0f12/lemmadeck`, through this root's `run-recorded.mjs` with `PYTHONDONTWRITEBYTECODE=1` and `PWDEBUG` removed:

1. `layout-normalize-01`: shared Python `normalize-text.py`, official `normalize_lesson_layout` and `normalize_exercise_layout`, exit0 once.
2. `prose-flow-01`: `node .claude/skills/ld-s10y-lesson/tools/prose_flow.mjs --json <candidate>/lesson.template.json`, exit0 once.
3. `text-mechanics-01`: shared Python `text-mechanics.py`, exit0 once, no errors. Uses the official edition text/source/identity/errata/subpart/prose-flow/reference helpers plus math delimiters; no image-output gate is run or filtered into approval.

The actual prose-flow output has 8 final paragraphs. Two adjacent `{before,after}` anchors were copied from that output: examples to the definition, and classification to machine applications. The text gate resolves them to indices4 and6. These are tool-resolved facts, not manually counted block breaks.

The text gate records 16/16 blocks, 3/3 questions, per-target source/modern number and math signatures, complete source snapshots, identity equality, historical declarations, original image bindings and normalized-layout equality. The source-bound errata count for this lesson is zero. Logs, exact argv, timestamps and hashes are in `author-ledger.json` and `text-mechanics.json`.

Failures: 0. Author repairs: 0/1. No repeated gate, test suite, adapt-finalize, assemble, figure creation, answer/choice/private-solution read, DB, Git, environment-file read, browser or service call.

## Tool Epoch Note

During this handoff main reported a separate one-line `katex_check.js` pipeline fix: `process.stdin.setEncoding("utf8")`, addressing split-UTF8 false `unknownSymbol` on large stdin after through200. Main reported four focused tests and the p0184#9 single-formula affected check passing without warnings. Those are main's reported results, not checks rerun by this author.

This author did not capture the pre-fix katex checker hash and does not invent it. The observed post-notification file has that line at14 and SHA-256 `b5e082a863b785bf037a3fbf7b27f92221342359d313be144a27fc6ed98df35e`. The c5-s3 gate had zero math spans and zero KaTeX calls, so this checker was not executed by this task. It is not a TEXT author failure/repair. No gate is rerun for cross-epoch hash equality; gate-time input snapshots and freeze-time tool snapshots are separately labelled.

## Candidate Bindings and Next Step

- Lesson template SHA-256: `bdbe0e0f09262ddf7104e948bbee0ce2bc81f890b6000308593caedb7abac8f1`
- Exercises template SHA-256: `d1539b9a9608714b50c4f0b52baf6881c36085cace885935b3a1910b72e29f8f`
- Figures template SHA-256: `f79737408969b5e8b71a95764d9d81643f9db6d5be9bec062929ba12cb8f6273`

`author-handoff.json` binds these final bytes, the author report, actual source/image observations, gate inputs, logs, command ledger and immutable candidate snapshots. Main performs the separate independent complete TEXT review next. This author stops at freeze and does not start figure work.
