# 9-10g Physical49 Targeted Source Repair

## Role And Frozen Scope

STEMROBIN-184; original source author, performing only the two explicitly authorized literal repairs after n83 modern-text handoff was frozen. This is not an independent source approval. Original Banach affected-only comparison remains required.

Authority: `T/source-review-9g-p49.md`, actual SHA-256 `302ab89943760c6291c1e0ba3c33cffb389c184d32854b45bbdb3a7c30b96746`. No original image was reopened, no geometry was solved, and no source erratum was registered. `T` is `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp`.

## Exact Changes

Only durable `ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0049/page.md` was manually edited, with `apply_patch`:

1. `p0049#2`, exercise118 second subquestion, JSON `/blocks/1/lines/2`: `如果正方体的棱长` becomes `如果正方形的棱长`. The first subquestion and exercise119 retain `正方体` unchanged.
2. `p0049#7`, exercise122 second printed row, JSON `/blocks/6/lines/1`: `平面内，这些点` becomes `平面内. 这些点`.

Before the actual finalize, exact-string comparison established that the MD was precisely the original bytes with these two unique replacements, with no other text or line-count change. Finalize did not rewrite the manually repaired MD. The resulting JSON strict diff has exactly the two block-line paths above; every other body line, formula, object flag, boundary, metadata, identity, note, and erratum field is unchanged. Audit is byte-identical.

## Preservation And Actual Gate

Evidence root: `T/source-9g-p49-targeted-repair-evidence/`.

Before editing, complete current durable triples and all prepared PNG/grid/template/layout bytes were saved in `before/`; the original existing `source-9g-p49-evidence/` tree and both initial author/reviewer reports were copied separately. The original package, original reports and all prepared bytes remain unchanged. `manual-before-finalize/` preserves the repaired MD and still-original JSON/audit; `after/` preserves actual post-run durable and prepared files.

Exactly one authorized repair finalize ran:

```text
cwd: /Users/yong/.codex/worktrees/a07e/lemmadeck
command: .claude/skills/ld-s10y-lesson/.venv/bin/python
args: ["-B", ".claude/skills/ld-s10y-lesson/tools/p2c.py",
       "finalize", "--book", "9-10g", "--page", "49"]
exit: 0; signal: null; error: null
```

Actual stdout:

```text
[finalize] 9-10g p0049: 10 块 / 23 行（印刷 23）, 插图 0 张, 规范化 0 处
  ✓ 通过 行数对账 + 白名单 + 公式
```

Stderr is empty. This is mechanical **23/23, exit0**, not independent semantic PASS. There are no figure crops on49, so none was created or reopened. No second finalize, prepare, counter diagnosis, exclusion/mask, tool change, assembly/index, modern edit, answer/choice read, browser/network, DB, Git, or other-chat action was performed.

## Immutable Bindings

| Artifact | Before SHA-256 | After SHA-256 |
| --- | --- | --- |
| Durable `0049/page.md` | `83e0f316a540bc0c057052d7d41d8dd80a22b7179b6f66ff00dc7579bd51648e` | `3c33b9864d1809d5792c150e97ad9b057825d04ad74ee9afb8403ac45ccdea9d` |
| Durable `0049/page.json` | `5717f5e77b8b92370db444688e96c58ca926d2cd0079e5726d6a84ba8f2ef284` | `6b030c183df1bd80f8f30845b6518f727fd3caaa88b3cea433bb177d46132c69` |
| Durable `0049/audit.json` | `d18b61a07dd2c3444edcc291c9b286188caa2b592b2d6a684ff814b56649c36d` | Same bytes |

Evidence `hashes.json` SHA: `d53a386f7d074894b02e79087a12319ef037ba16a1929e7c3a0038388aa202b6`.

Evidence `strict-block-diff-and-bindings.json` SHA: `08a51de6bd51fc8e238f2a81ebfc608ef5cc2b699a758a26a4a167f8fe1a33b7`; includes all exact before/after block strings, unchanged prepared-input hashes, original-package byte comparisons, and current triples.

Evidence `finalize.stdout.txt` SHA: `73d1dae2ddab7a0b1d98865410d8173a72a2aff351da55c9cbd0aef4b418751e`. Full argv/status/stderr and before/after file hashes are retained in the same evidence directory.

The earlier source49 report (`eed16e8775f71c07e9fea406188c62b2a7313f6f54aecaef136fdada5864f043`) and original package are not overwritten. The n83 report (`915e64f8d0f44d36a04b03415dae481804511c51f1fb67be50fd096b9d774f1f`) was already frozen before this separate repair began. Author writes stop here; report SHA is obtained externally.
