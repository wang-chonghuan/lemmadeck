# Text Execution Ledger

Every `exec_command` used explicit workdir
`/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck`.
15 text executions; limit 16. No background session, polling, install,
backend/DB/Git/branch/chat operation, environment configuration or public web.

The original shell commands, exact `-e` argument text and terminal streams for
the read-only calls remain in this chat's tool transcript. Those are not
misrepresented as newly captured on-disk raw stream files. The executable
browser stage has its own complete file-backed actual receipt and streams.

| # | Actual Command Or Purpose | Exit | Original Tool Stream ID |
|---|---|---|---|
| 1 | `sed -n '1,220p' .intentfold/readme.md` FIRST | 0 | `0e256f` |
| 2 | `sed -n '1,260p' .intentfold/charter/engineering.md` | 0 | `7fbda7` |
| 3 | `sed -n '1,300p' .intentfold/charter/operations.md` | 0 | `76e2e2` |
| 4 | `sed -n '1,240p' .intentfold/charter/product.md .intentfold/project.json .intentfold/charter/ui.md` | 0 | `1af35b` |
| 5 | `sed -n '1,260p' /Users/yong/.agents/skills/intentfold/SKILL.md .agents/skills/ld-s10y-image/SKILL.md` | 0 | `8f5096` |
| 6 | `sed -n '1,280p' .agents/skills/ld-s10y-image/SKILL.md` | 0 | `427bb7` |
| 7 | `rg --files /Users/yong/.agents/skills/intentfold/references .claude/skills/ld-s10y-lesson .agents/skills/ld-s10y-image -g '*production*' -g '*resume*' -g '*batch*' -g 'SKILL.md' -g '!node_modules' -g '!.venv'` | 0 | `0d5197` |
| 8 | `sed -n '1,300p' .claude/skills/ld-s10y-lesson/references/production-resume.md` | 0 | `d1d2e8` |
| 9 | `sed -n '1,220p' node_modules/playwright-core/lib/tools/cli-client/skill/SKILL.md` | 1 | `c11d29` |
| 10 | `node --input-type=module -e` existing directory absence, installed app Playwright/skill, bound HTML hashes and relevant selectors | 0 | `28f6e4` |
| 11 | `node --input-type=module -e` bound HTML stylesheet/structure/part-marker inspection only | 0 | `5e3acb` |
| 12 | `node .tmp/stemrobin-184-six/c6-first-offline-display-review/run-once.mjs` ONE FIRST browser command | 1 | `fd3123` |
| 13 | `node --input-type=module -e` saved browser evidence/receipt text summary, no browser call | 0 | `d530b5` |
| 14 | `node --input-type=module -e` explicit evidence/output hashes, post-display input hashes, six PNG absence records | 0 | `b6fb23` |
| 15 | `node .tmp/stemrobin-184-six/c6-first-offline-display-review/verify-manifest.mjs` final manifest verification only | See `manifest.json` | Final tool transcript |

Calls 2-5 and 6-7 and 8-9 used the parallel wrapper. Their identities above
are individual executions, not an undercount of wrapper calls.
Call 5's `sed` limit yielded only the IntentFold text; call 6 read the image
skill directly. Call 9's missing root skill path is retained as a technical
read fault. Call 10 read the installed `app/node_modules` skill instead.
No CLI browser or separate Playwright installation was used.

## Browser Receipt

`execution.json` records actual cwd and argv:

```text
/Users/yong/.local/opt/node-v24.16.0/bin/node
/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/c6-first-offline-display-review/review-check.mjs
```

Execution: 2026-11-22T20:45:25.670Z through 2026-11-22T20:45:27.772Z.
Exit 1; signal null; spawn error null; timeout false; stream truncation false.
Stdout 490 bytes; stderr 0 bytes. Both are hash-bound in `bindings.json`.
`browser-evidence.json` retains all 40 flags, owner/group geometry, fonts,
part-line boxes, text-view evidence, requests and browser-closed status.

The browser's owned fresh profile is retained locally under this evidence
directory as incidental runtime output, not content input or screenshot
evidence. It is not copied into another package or presented as an asset
approval. No user browser or login was accessed.
