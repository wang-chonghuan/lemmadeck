# 7a Physical232 Affected-Only Source Review

**PASS**, STEMROBIN-182, offline `finish:review`. Sole cwd: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`. Verdict covers page232's exponent repair only, not the whole batch or production.

## Source And Exact Delta

- Before current-source comparison, the sole view of `.tmp/ld-s10y-lesson/7a/pages/0232/page.grid.png` showed printed738, Cyrillic `а`, as `sqrt(2^6*3^4)`. At x435-451,y960-982, the superscript has an open upper stroke and a lower loop: **6**, not two stacked loops of8.
- Image SHA256: `bb58dc31ba4713688c479b81fb885ef40e52907148fb5a4e554b68f410f93f57` (88073 bytes), matching prior review. **1 image open; 0 crops, reopens or other images. No returned image payloads.**
- Sole structured MD/JSON difference: `p0232#3`, `/blocks/2/lines/1`, `а) $\sqrt{2^8\times3^4}$` -> `а) $\sqrt{2^6\times3^4}$`. Same-line `б) $\sqrt{5^4\times2^6}$` is unchanged.
- Raw MD: exactly1 changed byte at offset1697, line49, ASCII8 ->6;2702 other bytes identical. Raw JSON: exactly1 changed byte at offset2406, line74;4320 other bytes identical. Both retain file length. Reverting just that digit reproduces each FIRST hash.
- Parse JSON frontmatter and every ordered ex/foot block with exact lines and flags: **FIRST and current MD/JSON parity pass; identical recursive diffs contain exactly1 leaf**. Audit structured diff is empty and its bytes are identical.

## Hash-Bound Inheritance

Current directory: `ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0232`. FIRST directory: `.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/source-FIRST-snapshots/0232`.

|File|Current SHA256|FIRST SHA256|
|---|---|---|
|page.md|`6fce5b6efa4397d3e5481a59b64e5ac8921b0dd251f251e43c94c7a3d3fa3a95`|`9851c744d025f61cf3d7baa4fc6be00775d448616b769693bcfcc7ebb01be6b7`|
|page.json|`161aad261df2a406e721bb9a667a94633895218b5e2cc9dd572cd9755622e61a`|`6f33d0d1fa4eda073b0855289e46e6d3a5197558e50429fbd753b1dc1a772492`|
|audit.json|`f7ea81656e04ba7325a5e87678dbba58a7dac6ae83670501cf358b2b37c46e29`|`f7ea81656e04ba7325a5e87678dbba58a7dac6ae83670501cf358b2b37c46e29`|

FIRST hashes match both snapshot manifest and prior independent report. Verified prior `source228-234-review.json` SHA256: `5065a97ab7f37141d7ccea648a8edefe3f3bd268d725c6b980c8f4b89fefd845`; companion MD: `b0a21d44efd417de74fc8bb3385c41eca8b90b8f62caf9a7edf5f1109590efa8`. Both match retained `report-hashes.json`.

Every other byte/content field is inherited unchanged:20 non-target logical body lines,6 non-target blocks, all metadata/notes/errata, all7 marker lines and flags, genuine790 `↵`, footer226, and zero figures/ownership. Preserve printed736/737/738, not inferred786/787/788. Prior row counts by blocks remain `[1,5,3,2,7,3,1]`:22 including footer,21 content rows. Existing736-cont and791-open page232-side boundaries are unchanged; neighboring current triplets were not opened.

## Existing Gate And Verdict

Existing `stages/source232-exponent-affected.receipt.json` SHA256: `4b3560fd44688def34094b35a198c16809e2c24fae96d9c8f02025bcb28d292d`. Its recorded cwd/7a/page232 command and stdout/stderr hashes verify; exit0, no signal/error. Stdout reports7 blocks, **22/22 lines**,0 figures and0 normalizations. Current audit has `errors: []`, unknown_chars/warnings/normalizations empty, errata0.

**Substantive pass:** fresh source pixels establish6; exact bytes and structured parity prove only the intended exponent changed; unchanged prior evidence remains usable. Finding `p0232-ex738-a-exponent` is resolved. No revision required for this scope. Prior other-page holds are not cleared.

Only these owned reports were written. No source/tool/product/index edits, prepare/finalize reruns, git, network, DB, app, dependencies, publish, or agents. Detailed evidence bindings are in the companion JSON.
