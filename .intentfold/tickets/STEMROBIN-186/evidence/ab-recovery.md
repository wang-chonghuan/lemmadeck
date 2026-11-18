# A/B Retained Recovery Facts (2026-11-18)

Read-only sidecar. No workers resumed/contacted; no production, DB, env, model/API, browser, tests, copies, deletions or Git mutation. Only this note written. Package completion is not approval.

Exact path prefixes used below:
- `A=/Users/yong/.codex/worktrees/d9b1/lemmadeck`
- `B=/Users/yong/.codex/worktrees/a07e/lemmadeck`
- `AT=A/.intentfold/tickets/STEMROBIN-182/tmp`
- `BT=B/.intentfold/tickets/STEMROBIN-184/tmp`
- `BG=B/ssot-resources/soviet10year-textbooks/artifacts/9-10g`
- `AUTH=BT/production-source9g108-111-author`
- `REV=BT/production-source9g108-111-review`

## B: Completed Results Not Received

`B/.intentfold/tickets/STEMROBIN-184/usage.json` first two checkpoints record no parent intake/result for 108-111 AUTHOR/A or 112-115, and a pending 116-119 worker. Actual retained files now exist, frozen 0444. Do not execute their historical worker-control instructions.

108-111 AUTHOR: `COMPLETE OPEN`, four canonical MD slices retained, approvals explicitly `NONE`. Independent review: `COMPLETE OPEN TEXTONLY - BLIND A SOURCE ONLY - HOLD/UNKNOWN`; **no B/comparison, source, unit or lesson approval**. This is a recoverable author/independent-observation pair, not an approved pair. Incoming107/outgoing112, continued295/figure119 and111 glyph uncertainty remain; theory/written proofs are whole-object blind-seed exclusions.

Measured raw SHA256; row paths are `AUTH/FIRST-NNNN.md`, `REV/FIRST/NNNN.md`, `AUTH/canonical-retained/NNNN/page.md`:

| NNNN | Author FIRST | Independent FIRST | Retained canonical MD |
|---|---|---|---|
|0108|acb9aa90c04ef91ee74bfe59ad07e43cc03719fcd26e080c6fba8f37c2356893|4f2bd6d5e1e4b7dc0f268826ca35af8dda7b76c693c300da4ebe853510ff949f|31ffccf9ffe53b8900affb439f1c8ca4dc0288d38af607a11ac46ac7bc4497b2|
|0109|4a8d912efca96e3344df30cb70de1429a35cf1fdc27f863f0f155b97cc852919|72d8b3b1483a5726ecd43fa249d61b51f0ce2e91bceaa19efb1a8e898676c799|8f1a97e1eae8d3ed73c5a3cc3392e59bcba7757bc313b324673e60478a48d9b8|
|0110|1be2f6b61420a3fe8ee1e985983ea383a3aa0a0859754a44796be07d5f8c6fc3|3788f8272b1e72c5d65b2f83511eaa3fccf614d97b36050ccceafff74933748d|1069406ad15c720bd463bcb3edfda5625acd6a4f551a9f4d02517107945a6a0f|
|0111|853cf82bbc90ce90a2e25f462d23bd80e90be80fa3eed6f2c2633576fbae0500|d7ec68fa81023e0fc6dd9d97262b9c1541d712e8752b366b9eae3af7c4b3a482|10f510bfad34ded24325fe3f2f894dde9d85b18d617be92fa0854e905fe9a119|

Small authoritative package pointers, measured SHA256:

| Path | SHA256 |
|---|---|
|AUTH/completion-state.json|fb02085241434c29a92eb993d7965d5390ee00cc909a16bb9095d8e514412a1f|
|AUTH/seal.json|79ee4294f0eb1188bd4ba7a5693a8a03a5378157d4965a0e1ec82be5e06dd28d|
|REV/REPORT.md|b1fc31ccab1747f7b1a4bab91f9e083843f3ceb159ac402ee7791ba32fb75428|
|REV/QUALIFICATIONS.json|ae6703cfb7780e9cd4186ea303e1f799e907d779860d38f0f0cb8dc83aa709ec|
|REV/seal.json|635cfddeaae2164188fc9f6543460d295d1d424899290e0e9ab573e2a0024ced|

112-115: `PREPARED_ONLY_SEALED_PARENT_RECEPTION_PENDING`. 116-119: `COMPLETEOPEN`, mechanical prepare only. Each of eight recorded page calls ran once, exit0/signalnull/errornull. No transcription, canonical, review or downstream approval. Reuse retained preparation; do not rerun successful calls to recover results.

| Range | Exact result path (5173 bytes each) | Measured result SHA256 |
|---|---|---|
|112-115|BT/source-9g-p112-p115-prepare/result.json|e7e11a1cb6dc4a0b35adde283d1d6d08ff11a9d5940f5e3d5e25841f5c6f62d9|
|116-119|BT/source-9g-p116-p119-prepare/result.json|ec566fc9c68359ffad3625b6b68b786e6fcc3f998facae14f808965c67cc8175|

For each range, `BT/production-source9g<RANGE>-prepare-worker/` contains REPORT.json, copy-manifest.json and seal.json. Durable copies are `BG/evidence/batch012-source<RANGENODASH>-first-prepare/`. Manifests contain exact retained page PNG/grid/layout/template, command, stream and helper paths/bytes/hashes; worker and durable manifest hashes match.

| Range | REPORT.json SHA256 | copy-manifest.json SHA256 | Worker seal.json SHA256 |
|---|---|---|---|
|112-115|61219af23709e0387818b7f3eb9b5f7f5f820215fbd48cb1b8036c52051ab474|198d3d0830e6fbc5212be4a6cea099886c299b5518f290dadbf49c74661ab9b6|93af08781409fb35bf728e939e0b4775e8f094fb785dc2e81cb8d00248ae5f84|
|116-119|71a30a394cd80d10f8ca0554d2bfc0c2c8ee01437dfe403a0a7c43baf475e304|6802695c9bca00ea5439b6fbcbb3fc8b0353547f402ef96f57907b75323df7b6|4e449acace1eaaf30597b9e144e967feb628be697531e8eb895a77c996709236|

Bounded manifest verification: 127/114 entries; 214/212 small source+retained bindings hashed, zero issues; 40/16 opaque/large bindings stat-only, not image/PDF/runtime inspection. No complete custody/import/FD/model-visibility claim. **Zero approved pages found in requested108-119 range.**

## B: Approved Bytes Parent Can Reuse

Four sufficient existing source-page fixtures: `BG/pages/0028/`, `0029/`, `0030/`, `0031/`, each page.md/page.json/audit.json. All twelve current hashes equal the independent report's frozen comparison/audit hashes. No reauthor or new review needed for byte-identical copying; approval is source-transcription/crop package only, not whole unit/lesson. Original/crop hashes and exact paths also live in that report.

| Page | page.md SHA256 | page.json SHA256 |
|---|---|---|
|0028|8191f0a3e46dc1e10843449707a78eed2b8f2cfec9b0ec21d063baaf29c5fe43|143b82623830eae4f15e0f5435477176c0f47abbff5df8143e8c1cca89e46891|
|0029|61764340010f4714046c5820b22aef341b82d98981ae242a210106571403a455|3946826c159e94deec707abeff30bc57a187ccaaa9d7e32a754017ac9c2c08c0|
|0030|6d924da4da775b6533d231032680fbb95e7a0c09dd5997fa451afdd487ac367a|77d3ccc26fe22707a0a703ce9ef10bba80ca49a22bf9c22f6dd4a466447fbc6d|
|0031|c4e0e204df5c24e1eb0f733ccfbae7da26337456969ccac47ada6cf7689cb9e1|80559b5bddf12fae0e71986cb503ff2c1e092caf9266dbe5815b1050e8c2a67c|

PASS evidence: `B/.intentfold/tickets/STEMROBIN-184/evidence/transcription-review-9-10g-p28-p31.md`, 27606 bytes, SHA256 `63f1ece7b172837ad9af1343e7732443f37bc11f2aa3809968474594b240d65b`. Author receipt `BT/transcription-author-9-10g-p28-p31.md`, SHA256 `57f4156e6334cbd02ed66302bfe856ae380926c7366197899e3c018a3af60ad3`. Independent26/19/24/19 rows; audit errors empty. Last relevant commit `586905649881616ed6a93684fe0a7b91aa272971`; targeted working diff empty.

## B: Large Duplicate Trees (Path/Stat Only)

Largest measured named runtime/helper trees within BT, depth<=7; allocated KiB, not deduplicated bytes:
- `BT/production-9c14-pipeline/runtime`: 446800 KiB.
- `BT/production-source9c64-67-prepare-worker/runtime`: 332184 KiB; retained counterpart `BT/production-source9c64-67-review/inputs/parent-full-prepare-retention/package/runtime`: 332148 KiB.
- `BT/production-source9c52-55-stageb/runtime` and `BT/production-9c12-pipeline/inputs/batch012-source5255-stageB/package/runtime`: 148632 KiB each.
- `BT/production-source9g112-115-prepare-worker/helpers-before` and `helpers-after`: 143180 KiB each.

Largest observed PDF copies at depth<=8: `BT/production-source9g112-115-prepare-worker/helpers-before/14-9-10g 苏联十年制学校数学教材 几何 9-10年级.pdf` and the identical filename under `helpers-after/`: stat size8302528 each. `BT/production-source10c314-317-author/inputs/source.pdf` and `BT/production-source10c314-317-stageb/intake/author/package/inputs/source.pdf`: size7567970 each. Same filenames/sizes are duplicate-copy candidates, not a new byte-equality proof. Nothing copied/deleted.

## A: Precise Old ex4 Gap

No exact old private evidence recovered in bounded search. `AT/STEMROBIN-182-runtime-checkpoint.md` is the retained expectation receipt, measured SHA256 `c33a2772eecc8ec8502c211a44ddbb5e46059a3d64506fa96b420333476ba87d`; sections ex4 A/B/C and Whole ex4 Package distinguish previously written bytes from unwritten claims. Four named old reviewer roots are absent. Representative exact expected missing files/hashes:

| Expected path | Receipt raw SHA256 (not a recovered file) |
|---|---|
|AT/reviewer-5m-c3-ex4-a-view/changed-only-review.json|d0f48c57536201c59f2c09db3c3b1b3ad3e40237e57d0f668048e13444dd59eb|
|AT/reviewer-5m-c3-ex4-b/source-handoff.json|f3be40eeb7451bfd3e9cb6d4227658dfa713f16e016661de12efac202427a9a2|
|AT/reviewer-5m-c3-ex4-c/source-handoff.json|632dedf40ba0236d98430cd3c9a2b212ab1d7f08afafb80b15ab68421adeebd5|
|AT/reviewer-5m-c3-ex4-c/internal-comparison-original.json|19c3d1a4108f4c4d81b3c67e0b7caa9f5934d1ba260eb54a14b25b3f1e039bb2|
|AT/reviewer-5m-c3-ex4-c/review-original.json|2b120499f314859dd8919807be75ce55bd0bc6d04b141ba610f6880e2ad8fa38|
|AT/reviewer-5m-c3-ex4-package/package-review-initial.json|abd383319fa55e4f7c252bf68b9e2d2a3a2af7b076d90f07177822feab19ee5c|
|AT/reviewer-5m-c3-ex4-package/package-ready.json|d9674a8ecec6fdba54ff48d4dca2648ed29d9ce6b041195c95073185185e5e8a|

All17 raw-hash rows from the checkpoint were compared against218 current small ex4 files (current choice-set plus ticket ex4 directories) and126 reachable blobs restricted to the exact ex4 product/old reviewer paths: **zero matches**. Draft "canonical" IDs in the receipt were not falsely treated as raw file hashes. B INTERNAL/runner-consolidation and C changed-only loss files were explicitly unwritten, not recoverable frozen originals.

Bounded Git evidence: old reviewer path `git log --all -8` empty; `git ls-tree -r 3b0d669dd42efac5610557bc888920e907273d61 -- <exact ex4 modern lesson dir>` has seven historical lesson files and no choice/private-review evidence. Exact modern ex4 path history has only `824f755b99326e1802011c2f71f76e6ec5b412a3` (2026-10-11) and `b1c459f1e27009e5cf15433fbab8a8ebee348c0a` (2026-11-18 qualified subset). The new four-part subset is not the missing old three-chunk92-source private package. No stash ref found; no global/unreachable object scan or cleanup.

Existing backup lookup, filenames only: `/Users/yong/.codex/backups` contains September n-litellm configuration backup, not ex4. Targeted A ticket-tmp recovery/backup names at depth<=2 identify unrelated book-binding recovery, not an ex4 archive. Main `/Users/yong/work/lemmadeck-ws/lemmadeck/.tmp/backup` contains only July31 SQL gzip backups (not opened). Main `.intentfold/tmp/182-recovery-protocol` is protocol schema files, not original content. Depth-limited workspace/Codex lookup found no182/d9b1 tar or ex4 zip. No external snapshot/Time Machine search performed.

Reproducible bounded search shape (read-only, not approval):
```sh
git -C "$A" --no-optional-locks log --all -8 --format='%H %cs %s' -- .intentfold/tickets/STEMROBIN-182/tmp/reviewer-5m-c3-ex4-a-view .intentfold/tickets/STEMROBIN-182/tmp/reviewer-5m-c3-ex4-b .intentfold/tickets/STEMROBIN-182/tmp/reviewer-5m-c3-ex4-c .intentfold/tickets/STEMROBIN-182/tmp/reviewer-5m-c3-ex4-package
git -C "$A" --no-optional-locks rev-list --objects --all -- ssot-resources/soviet10year-textbooks/artifacts/5m/editions/modern-us-neutral/lessons/math5-c3-ex4
```
Blob comparison used read-only `cat-file -t/-s/blob`, <=2MiB candidates, SHA256 against the checkpoint table. Remaining dependency is an actual backup/snapshot holding the missing receipt-matching bytes; prose reconstruction/new review cannot satisfy this recovery gap.
