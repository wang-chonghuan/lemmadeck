# STEMROBIN-180 C: Fresh Offline Choice Author n93 b94

Finish: review. No semantic review or reviewer verdict was authored.

Package: `.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n93-choice-author/`.

## Snapshots

| File | Byte SHA-256 | Canonical SHA-256 |
| --- | --- | --- |
| `stage1-solutions.json` | `c873e9bdb7c0498c1654b9a01860ffe7897627ecc44f9f4d0ce37b0053be203b` | `9883c075ed5e73340185d72fc46eeaef5812c4ad3002c7b0484725dbc929625e` |
| `seed.json` | `720f22849e03c73c9392c539aefc5d92166a07bf192efbb764b0396d6d434a24` | `65150f447821ec808ab8be151d1fd16e4b2c9c125f97d3364b30966b09c20928` |
| `draft.json` | `007cd587eda00f3f26a988c139841144162a662b579b0ff4a1d5d78d7f627126` | `fd5de6818534bdc8d31681105f87a866f773ddf2c22af7964c89b1b6b6de4afa` |
| `learner-only-views.json` | `3f8cb31e5b81c60cbd6f27e156cdc0622c51e0bb9a86591212ceb1e1fc40a783` | Not used for review binding |

Stage 1 independently solves all 8 source tasks and was made `0444` by receipt `n93-choice-author-013-freeze-stage1-1.json` before `n93-choice-author-016-prepare-1.json`. Selected sources: `2,3,4,g2-2,g2-3,g2-4`. Definition blocks: `1,7,8,9,18,19`; numerical solved examples excluded.

Counts: 8 solved sources; 6 selected; 2 omitted; 5 questions (3 single, 2 multiple); 20 options; all 3 numeric parts retained; 1 reused table; 0 new figures; exactly 2 image loads, each opened once; 0 crops/reopens; 1 structural validation without review; 0 semantic reviews.

## Checks And Evidence

All exec calls used `/Users/yong/.codex/worktrees/stemrobin-180-resume/lemmadeck` and the existing `run-stage.mjs` recorder with unique `n93-choice-author-*` labels. `commands-manifest.json` records the exact first 22 command receipts, arguments, stdout/stderr hashes and receipt hashes. Manifest-generation receipt: `n93-choice-author-023-manifests-1.json`; final snapshot audit: `n93-choice-author-024-final-audit-1.json`. Both reside in the same `resume-180-4/commands/` directory and are outside the captured 22-command authoring census.

Structural command: `python3 -B .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n93-choice-author/seed.json --draft .intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n93-choice-author/draft.json`. Receipt: `n93-choice-author-019-structural-validate-1.json`. Exit 0: `mechanical checks passed; semantic review still required`. No second validation or review flag was used.

The learner-only file is exactly `{questions: [{id, view}]}` projected from the draft, with modes inside `view`; no keys, solutions, rationales, source relationships or intent fields. Exact equality was checked in receipt `n93-choice-author-020-package-audit-1.json`.

Source PNG: `ssot-resources/soviet10year-textbooks/artifacts/7p/figures/tbl-p0241-01.png`, SHA-256 `e14a09002ecc89035ccce5528109cebff7007998ba552db4952e52706df81189`. Approved native screenshot: `.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n92-table-author/native-repair-1-1440-full.png`, SHA-256 `9a98cb8d83eeb6dd72bf986a1c7b633c74aa9c0772b92920feeff1ae14e51924`. Each was opened once as a complete image. All 16 rows, both units, rightmost column and bottom Water row/border were visible. Existing modern SVG: SHA-256 `52cb88ebaa2fdec1e04363541c61da85174094544faf922cea640bbb4f5ada17`. Authorized n93 mapping spec: SHA-256 `e7a209151291f6047db5ec91168d86a2ded836dd58e44695cb13cfdf28b51c3d`. No figure was authored.

`author-manifest.json` and `commands-manifest.json` are `0444`, with artifact/source/image hashes, counts, conditions, omissions and command evidence. The seed, draft, views, frozen stage 1, manifest helper and this durable record are also read-only.

## Findings And Recorded Losses

Bounded omissions: source `1` standalone recall/listing of the needed data; source `g2-1` standalone interpretation of aluminum's two rounded unit representations. Use of those quantities elsewhere is not counted as assessment of the omitted tasks.

Choice capacity losses: learner-created example, independent formula writing, written calculation steps and unit conversions, learner-generated experimental conclusion, and free-form causal reasoning. Numeric source `g2-4` retains all three requested results, materials, masses and temperatures in one ordered unit.

Visible qualifications: equal masses and equal net absorbed power for liquid ranking; all compared substances remain liquid; constant specific heats; positive released heat versus signed energy change; container/surrounding transfers in mixing; coolant claims bounded to specific-heat capacity. The liquid item adds an explicit 1 kg, 1 degree C heat amount to its response, not a hidden source requirement. The coolant task does not assess broader engineering tradeoffs.

No mechanical/input blocker observed. Mathematical fidelity, misconception plausibility, redundancy and leakage remain for semantic review, including the liquid item's added supporting quantity and its incomplete-domain distractor. No approval is claimed. No DB, env file, publishing, app/dependency change, other chat/history lookup, prior choices, answer files, judging parts, interactions or reviewer outputs were consulted.
