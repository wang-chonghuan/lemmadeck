# phy6-c5-s1 full modern TEXT author freeze

Status: READY for main's independent full TEXT review. Author mechanics PASS only; no selfapproval, finalize, retention or publication.

Work root `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c5-s1`.

## Frozen binding

- `author-handoff.json`: SHA256 `f247bb12a2daa61ceeba57b6b50433c64d4b6799268db820e3df68de454e31e7`
- `author-context.json`: `dbb33a58baf90be2f3cac38b40da5c85d7b42a0e9606bd500961f8f90076fcd3`
- `author-ledger.json`: `d80dc6f219e204a9a72f610d069473f82704ace6ba271cc55a9ce26c99530ad3`
- `frozen-01/manifest.json`: `07cb2b4a51cebe62c60f3bd0aeb2f1066571883b49bab2b05d5d7cca5a9f511c`, immutable30-file snapshot.

Exact templates under `adapt/6p/modern-us-neutral/lessons/phy6-c5-s1/`:

- lesson.template.json: `ffc3ae0474d1badc5578b74d85b4bdb69d67af35d363ebc864f459d37003d1e4`
- exercises.template.json: `40b88c301fe812931b069172868ff9358fdd269a2a7d7827cd6d91217fe0d566`
- figures.template.json: `4d68242e91f51e802e967be66828e94873c998e4053637c5615853d0a0eacd16`

Durable raw source:

- lesson.json: `cd62c27881ee414d183cd289da44e00fa66b12e2a48d45a774a289b2eb6649b3`
- lesson.md: `bcbece66a7996ab52e9cbd3ecffb5e438935029f5ef125325f21cbeee6c57bb9`
- exercises.json: `ee24d553986a0875524ba8cf4c18f3cf2ec49b23cd333c9b4e283f4c3a833bc4`

## Scope and content

Read all raw25blocks/11tasks and complete upper templates; retained all25/11/0figures, original group IDs/source refs/printed numbers/conditions and all scientific values. Worked examples remain prose20..24, not added to questions or seeds. `author-context.json` contains complete upper modern prose/prompts; immutable freeze contains full modern templates, raw snapshots, prepared snapshot and execution evidence.

Direct A=Fs and proportionality statements are scoped to constant force/displacement in the same direction. Nonzero work needs the direction relation; perpendicular force/no displacement yield no work, opposite force can do negative work; zero resultant does not mean all individual forces do no work. Uniform vertical lifting/traction scope preserves the source worked examples and exercise givens without task answers.

Source British/Joule history is item-locally declared. Krylov/title Monkey are retained with p0185#9 declarations and only the source handling-wood scene, no invented motive/outcome/story premise. Gun/propellant example is explicitly a textbook apparatus description, not operating or building advice. No mathematics erratum was invented; mathematical signatures preserved, with only nonnumeric text-literal punctuation/layout changed.

## Actual evidence

Once each via own `run-recorded.py`, using sharedPython `-B`:

1. `author-tools.py normalize` — exit0, canonical scratch text formatting.
2. Official `prose_flow.mjs <own lesson.template.json>` — exit0, actual paragraph outline/anchors read; four boundary objects copied with apply_patch.
3. `author-tools.py check` — exit0/PASS, one combined check of all36 upper targets: source snapshots/identity/errata/math/number signatures/declarations/layout/flow and0figure membership. Supplemental complete numeric-token check includes CJK-adjacent givens; no private answer read. All source worked-example products match.
4. `freeze-author.py` — exit0, metadata-only freeze; unchanged text hashes verified against the single mechanics result, no gate rerun.

Final31paragraphs, boundaries[14,20,25,27], errors0/KaTeXwarnings0. Full report `author-report.md`; evidence `text-only-mechanics.json`, `prose-flow-final.json`, `layout-execution.json`, `evidence/*.{call.json,stdout,stderr}`. Freeze wrapper's call/stdout metadata is written after immutable snapshot; prior three author commands and freeze invocation are bound in ledger/freeze-execution.

This author prepare calls0: main had already prepared once; existing prepared templates reused and initial bytes preserved in `prepared-01/`. Normalization1, author flow inspection1, combined mechanics1 (one internal final flow resolution), metadata freeze1. First textFAILs0; repairs0/1. Browser/service/generation/figure authoring or approval/render/finalize/assemble/retention/publish/Git/DB calls0. No source/app/schema/dependency/Charter writes;167/169 freezes unchanged. Stop for independent full TEXT review.
