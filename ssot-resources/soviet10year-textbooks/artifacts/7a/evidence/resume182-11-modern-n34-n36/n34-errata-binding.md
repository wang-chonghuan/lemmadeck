# 7a n34 Source/Erratum Binding
Date: 2026-11-18. W: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.
Decision: **PASS local metadata binding only; REVISE requested crop-hash preservation evidence.** No metadata correction is indicated by this review. Crop-byte identity cannot be certified from the allowed evidence.

## Inputs
Before root: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-errata/before`; exactly `{0215,0219}/{page.md,page.json,audit.json}` compared.
Current root: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages`; same six relative files compared.
Receipt root: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/stages`; only `n34-source{215,219}-errata-registration.{start.json,receipt.json,stdout,stderr}` read.
Reused adjudication: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/evidence/resume182-8-modern-n31-n33/resume182-8/n34-local-math-review.md`.
Adjudication SHA-256: `43ee191e176f07eadcf53f3aae02feab7e71540cbe89a9f36e1ec279254cedc8`, recomputed exactly; both registered reasons cite this digest. Its scientific conclusions were reused, not independently re-solved.

## Concrete Diff
- p0215 JSON `/meta/notes/2` and matching MD frontmatter `/notes/2`: `气温上升区间首端点本次像素识别为0，转写]0,16[；可能存在0/6识别或原书印误，保留不确定性供独立源审，零勘误，不按语义修正。` -> `独立源审确认气温上升区间印刷首端点为0，忠实正文仍保留]0,16[；独立局部数学裁决确认应为]6,16[，仅登记勘误供现代层应用。`
- p0219 JSON `/meta/notes/0` and matching MD frontmatter `/notes/0`: `751 а) 的左端印作 x，忠实写为 $x=-\frac{6}{x}$，不改成 y，也不新增答案.` -> `751 а) 的左端独立源审确认印作x，忠实正文仍写$x=-\frac{6}{x}$；局部独立数学裁决确认函数题应为$y=-\frac{6}{x}$，仅登记勘误供现代层应用。`
- Each JSON `/meta/errata` and matching MD frontmatter `/errata`: `[]` -> one object, keys exactly `id`, `block`, `original`, `reason`. p0215: `p0215-math-1`, `p0215#5`, `$]0,16[$`. p0219: `p0219-math-1`, `p0219#10`, `$x=-\frac{6}{x}$`. The corrections are recorded in notes/reasons, not applied to source bodies; no separate correction field was added.
- Each audit `/errata`: `0` -> `1`. Every other audit field is unchanged: `lines_printed=19`, `lines_md=19`, `errors=[]`, `normalizations=[]`, `unknown_chars=[]`, `katex_warnings=[]`.
- These are the only structured differences. Before and current MD JSON frontmatter each exactly match their corresponding page JSON `meta`. The complete MD bytes after the closing frontmatter delimiter are unchanged.
- All 13 p0215 blocks and all 11 p0219 blocks are deeply identical, including every text line, ordering, kind, label, ID, owner, flag, figure, caption and box. Other page metadata, figure coordinates and audit crop-origin/component metadata are unchanged.

## Binding
- **PASS p0215-math-1:** one-based `p0215#5` still addresses the same paragraph. Complete original `$]0,16[$` occurs exactly once in this block and once in the MD body. Concatenating its preserved printed lines matches the prior adjudication's entire original statement. The registered reason matches section 2's contradiction, named turning points and context-preserving correction `$]0,16[$` -> `$]6,16[$`, retaining all brackets and other text.
- **PASS p0219-math-1:** one-based `p0219#10` still addresses the same exercise block, kind `ex`, label `751`. Complete original `$x=-\frac{6}{x}$` occurs exactly once in this block and once in the MD body. Its full three-line original task matches section 5 after removing Markdown quote prefixes only. The reason matches the existing real-relation/context adjudication and correction `$x=-\frac{6}{x}$` -> `$y=-\frac{6}{x}$`; the right-hand expression and companion `$y=\frac{4}{x}$` remain unchanged.
- No reason contradicts or broadens the reused correction. Source-print assertions in the revised notes are inherited requester/adjudication facts, not newly certified source fidelity.

## Preservation Evidence
MD body SHA-256, identical before/current: p0215 `ccf7497b4afb396270d14c3c4a2877c835f60f883ad7d315e6ca5a475b3a897d`; p0219 `08e12739a7953f85cf43a74164f22108473aa44637b9f66579cca8d20bc4d0b8`.
Recorded source PDF SHA-256, unchanged on both pages: `8070c333ee46fb0dc650cb32d4d898f605ed308559b6cc430425d908dae6b052`.
Recorded render SHA-256, unchanged: p0215 `1ccb3a3b0fc68439bf7da3c1a4ac914a00566b865c187ad0e1b20ceacbc5ff0f`; p0219 `0176c913635fc6f38409b0b226533635068c8658b86396755662f2dacdd0a819`.
**REVISE evidence only:** the six snapshots/current triplets and named receipts contain no crop-byte digests or before/current crop-hash manifest. Unchanged references, boxes and crop-origin metadata do not prove unchanged crop hashes. PDF/render values above are verified metadata bindings, not fresh binary hashes. No PDF, render, crop or sourcefigure was reopened. An already-recorded before/current crop-hash baseline would be needed to settle that requested claim without reopening assets.

## Receipts
Both start/receipt pairs agree on W, command, book `7a`, target page and start time. Each receipt records actual `exit=0`, `signal=null`, `error=null` and a later finish time; each raw stdout reports 19/19, the current block count and matching figure boxes. Each stderr is empty. No finalize was rerun; once-each completion is reused as supplied.
| Page | Receipt SHA-256 | Start SHA-256 | Raw stdout SHA-256, matches receipt |
| --- | --- | --- | --- |
| 0215 | `b0e1ec2509f5d8b851cacad002d09526a357130eb7eb32359ad7cd71272fd9d3` | `6881bebd94ea571f489bc0d10c8a365da7805c5b13b0cf590c5210a9ecd739aa` | `1624f94548d2d4583a8eff357c0e2a6f3f62bcc6fb4d9dfd4594ac966fcfd8a8` |
| 0219 | `45799e81f7e4d8811db214bae091c879e85ebf7e99eef3665c62812f96af19ae` | `73859a4569be24d874e0c274d2aef329a366d9af3ae5650d228b881bd6ccc27a` | `2bb40ab2e1ed07d765b70d798efaef0c10967fcbcbc70dfbb3688f209a457bc8` |
Both raw stderr SHA-256 values recompute to receipt value `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` (0 bytes). Output-file hashes below were recomputed from current persistent files; the receipts themselves do not contain output-file digests.

## Triplet Hashes
Paths below are relative to the absolute before/current roots above. All values are SHA-256 of complete file bytes.
| File | Before | Current |
| --- | --- | --- |
| 0215/page.md | `87c366792afd1d584ded2ca89078e2033996433799538f03ad856b231f0af4b1` | `2344ddc69559cc2e50ca05d7e59b0ac52b04f5d7658e60f13f7ce1acab18d99b` |
| 0215/page.json | `de5077bed7e8a5a717363665b9b17b96b7f6bca0c7d201f597f65ee7f76e778d` | `598516f01b92650eb963d8dc366e7173c5e18a7c7d99285467425c9d7cd3da8a` |
| 0215/audit.json | `643ed2a09ab064d63fb28c309cd4157a1ea511460d7ca0715d457526cf7c574e` | `e1c4fe870dcc2760da49782c64a0c7c1a12b707856e3f3293de6dabd8e73b2c9` |
| 0219/page.md | `beb49b0000ce00763e22efe4e3e01f7120f9f1de1e56d5864047519d5165a7ee` | `75bc69bb0ef592636c963196db24e2efc89610ceb308adbe2e56cf137249e1f8` |
| 0219/page.json | `ead546937f0e87fc5a3bb2cd478245dde06df2ea09fef7a82c253b59174dc523` | `cd05d8a0688f31d850847ab83e0ba3851d57c8964fb3da416162baa5314756a9` |
| 0219/audit.json | `cb6b0ca0ebad7eb370250a0474a92da2d6970460ed799ae54d5ce5208a5b7dda` | `823bb7c94bba92e32f1e78ec6dba3880ed43daad7bc863da261f2e4a587683db` |

## Scope
Images opened/rendered/examined: **0**. No independent scientific review, answers, choices, other historical reports, Git, network, .env, DB, app or pipeline reruns. Every shell command used explicit workdir W. Concurrent source221-227 work was ignored and preserved.
This is a source/erratum metadata-binding report only. n34 modern text, figure, answer, choice, display and whole lesson are **NOT APPROVED**.
Only write: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-errata-binding.md`.
