# PhaseB exact-candidate text bindings

Date: 2026-11-22. One released candidate set, TEXT ONLY. No new image/ROI/decode, producer, source-code read, candidate edit or PhaseA edit.

## Roots and release

- R = `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck`.
- W = `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/source10c5255-work`.
- Owned write root = `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/source10c6567-review/phaseB/`.
- PhaseA = `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/source10c6567-review/phaseA/`.
- The exact-candidate arrangement is a release within the original bounded human delegation; it is NOT treated as a new direct-human production authorization.
- Every exec used cwd R. No existing dirt was reverted or changed. All manual writes used apply_patch under the owned PhaseB root.

## Frozen independent baseline

The following hashes were byte-verified against the still-locked TEXT files; no image was opened, hashed anew or decoded in PhaseB.

| PhaseA file | SHA-256 |
| --- | --- |
| seal.md | `e587a7ffc027bb97d6325b1f93e8a4e8ea6dd2698c508313d6bd27a2eb73d183` |
| p0065.freeze.md | `a0f80f4886cf5adfff9ef2abf5038432eace0ae1d5a506689255ab237e14e553` |
| p0066.freeze.md | `22ec1a1f543c755becf7458e8e63218939879b2f3f5e4172f8a4c3b930ebdd09` |
| p0067.freeze.md | `bf89c5c56a2bc788dfc02245c81a703a8bad16f7c138475d9b440690f53487c2` |

Source grid hashes REUSED FROM PhaseA, not new image access:

- 0065: `1c801eac2cb4e50c16205998d4cd488ead9807576bd770e1642ba6da620a253e`.
- 0066: `47deb0b673c1294483da4c6f98302c28e4ed63fef16b2459c60a546d68064305`.
- 0067: `f973b4feb544311258016e7f48c26fa292b00f14203d38b54265e404b9c985a5`.

## Current MD / JSON / AUDIT

Every path in this table expands under W. MD hashes exactly match the release. JSON/AUDIT hashes were independently measured, then matched to the first receipt output snapshots and the author's released handoff table.

| Path under W | Bytes | SHA-256 |
| --- | --- | --- |
| artifacts/10c/pages/0065/page.md | 2471 | `ebf2c5dab95ea5cb2e7a30d30fce006c42686bbfdfdfab32003ce029b73c0429` |
| artifacts/10c/pages/0065/page.json | 5028 | `bb6c5f124e832ddfa9e18836329fc29b51b44f64724b86c160b581751f642875` |
| artifacts/10c/pages/0065/audit.json | 203 | `fcefa9fdc576453b5eaf16c76cbcf0967114c690073065dd33a6361ab517d3f8` |
| artifacts/10c/pages/0066/page.md | 3709 | `984d3cf5b5bc05f65a68e09efc9240e90dc161e2375127c3c6dd04315b84f63b` |
| artifacts/10c/pages/0066/page.json | 9589 | `9ceda0b868fd6f352e77012462d549269cd44c9a66b6ff7339c6c4b6deb52691` |
| artifacts/10c/pages/0066/audit.json | 325 | `b0926aa252e8c3d51c8a620bb44fb46be79452683321fcfaf99d34b26b12a8e6` |
| artifacts/10c/pages/0067/page.md | 2484 | `b4a57fa3535d84cee8eb9e85e39d4aed7bde109bf08bc5afc30db29194fada0d` |
| artifacts/10c/pages/0067/page.json | 4033 | `21e7f1e03d6c040179b835b5ddd052c3223783bbd7fc91a4ed423a465fe8b2d3` |
| artifacts/10c/pages/0067/audit.json | 441 | `6a9f19c1c84549983e5f497b37ad77746bb7ec375a0ba9a557d4c24134414e9a` |

Released author report:

- `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/source10c6567-author/handoff.md`.
- SHA-256 independently verified: `276bc49ea9c6b363e0149a7127f6322a768005bcf67f7d985c3cd3e6c76a947c`.
- Its CLOSED author state and its glyph/crop/complete-sentence claims are not independent source approval.
- The referenced author `evidence.json`, `verify_evidence.py`, ROI and image traces were NOT read or run.

## Native text-receipt verification, once

One read-only inline Node verification checked the three known receipt objects, exact cwd/argv/exit, text snapshot byte lengths and SHA-256, current-output byte equality, and MD JSON-frontmatter/meta equality. It ran once and exited 0. No producer/helper source was opened; no producer was executed.

| Receipt path under W | Receipt SHA-256 | Recorded start / finish UTC | Recorded exit |
| --- | --- | --- | --- |
| receipts/nov22-finalize-p0065-01/execution.json | `7889197d07feea95b269dcdf8f01b0c5c2c8c76c859a9186e37f22a8f0cfd3a1` | 05:10:07.768350 / 05:10:08.626225 | 0 |
| receipts/nov22-finalize-p0066-01/execution.json | `586664d1ca34cf4af9c31869f75989cd44afe529a544d81d8e20f121661858ad` | 05:11:31.854871 / 05:11:32.778351 | 1 |
| receipts/nov22-finalize-p0067-01/execution.json | `dc20a4e762053439841693d8ed22dcae0794962774dae3e13205da6e17879547` | 05:12:26.904361 / 05:12:27.706526 | 0 |

All timestamps are on 2026-11-22. Recorded cwd for all three is R. Exact recorded argv, with P substituted only as 65,66,67:

```text
[
  ".claude/skills/ld-s10y-lesson/.venv/bin/python",
  ".claude/skills/ld-s10y-lesson/tools/p2c.py",
  "finalize",
  "--book", "10c",
  "--page", "P",
  "--root", ".tmp/stemrobin-184-six/source10c5255-work/artifacts",
  "--books", "ssot-resources/soviet10year-textbooks/sources",
  "--work", ".tmp/stemrobin-184-six/source10c5255-work"
]
```

This is a receipt quotation, not a command authorized or run by this reviewer.

For each receipt directory, `output-page.md`, `output-page.json`, `output-audit.json` have the corresponding current hashes in the table above. All nine output snapshots were byte-compared equal to current released files. All three output MD frontmatters parse equal to page JSON meta; book/page/printed-page identities are 10c / 65,66,67 / 59,60,61.

Text input/stream bindings, actually verified:

| Receipt page / filename | Bytes | SHA-256 |
| --- | --- | --- |
| 0065/input-page.md | 2369 | `7104895e5e41f98de129f40f89d1b84a7226e52c51cdbe87df93a1983778a1d4` |
| 0065/stdout.txt | 131 | `b10156372eb754eb2059b5e3e7b4cad062bf22a3eea4b18ea9cc5bc023b74e3f` |
| 0065/stderr.txt | 475 | `5a3ddd620c9e21b6c2b52e0bc9af9d9df768264e9a8708066167a2bf08a442df` |
| 0066/input-page.md | 3607 | `d58c06c70a673c5f138a47c69bed80fa9cf6a341b474a41bfa6003dd78cdc2b8` |
| 0066/stdout.txt | 223 | `76b76de6706f8489d7b1d06475dc7ddb840df930acdb582c2a6415aef6e13469` |
| 0066/stderr.txt | 475 | `2ee2bf55cfcc7d68edb4c48433c8cfdb962ba3a5af47d9ce88bf582fa11943d2` |
| 0067/input-page.md | 2215 | `a802e1cbf19222936d1f28493c46af003e44b4f8514d0950d1d4b2ff967c64c1` |
| 0067/stdout.txt | 175 | `28ae21437bf9ec63417ee52a36b13f93c63f814c8e6168d50e5907eb6e0c39b3` |
| 0067/stderr.txt | 475 | `76d1031a97ee416c8257620d89609db585ef80dd7d06679f8e5d3645d01d9649` |

### Input/output changes and actual faults

- 0065/0066: input/output MD bodies exactly equal. Thus the identified 0065 punctuation problems were already in the authored input, not introduced by native finalize.
- 0067: native body changes are figure header box `[600,1450,550,700]` -> `[613,1458,525,685]`, insertion of the figure Markdown link, and accompanying blank-line shifts. Prose/heading/caption/foot text is retained from the input. No independent crop-fidelity conclusion follows.
- 0065 stdout: 12 blocks / 23 authored rows / 23 native printed rows, figures 0, native check success.
- 0066 stdout and audit: 29 blocks / 23 authored rows / 24 native printed rows, figures 0, first finalize failed. Error: `行数对不上：印刷 24 行，块体 23 行（块体一行 = 印刷一行；公式跨行用 ↵ 标断点）`.
- 0067 stdout: 7 blocks / 13 authored rows / 13 native printed rows, figures 1, native check success with box `[613,1458,525,685]`.
- All three stderr streams actually retain an ignored shutdown exception from logging `_removeHandlerRef`, through the named instrumentation `profile` at `sitecustomize.py` line 18: `AttributeError: 'NoneType' object has no attribute 'startswith'`. The instrumentation source was NOT opened. This is not concealed and does not replace the recorded native exit/content verdict.
- Image trace files were NOT read or hash-verified. Trace/native decode/crop counts in the author handoff remain AUTHOR-REPORTED, not independently verified here.
- Source PDF, PNG/render hash and profile hash appearing in candidate meta remain DECLARED identities; they were not reopened/decoded or independently source-verified in PhaseB. The independent image authority remains the sealed PhaseA grid bindings.
- This receipt-integrity verification does not grant page/course PASS and does not lift the 0066 count HOLD.
