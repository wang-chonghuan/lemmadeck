# Actual commands and stream provenance: narrow affected-text

All commands used cwd `/Users/yong/.codex/worktrees/a07e/lemmadeck` and the existing zsh/Node environment. No session ID was returned; every exec ended synchronously. This record distinguishes actual post-compaction tool-delivered streams from transported summaries. No OS-level split-pipe capture is claimed where the exec tool supplied only a combined `Output` field.

## Pre-compaction T01-T06: transported summary only

The compacted handoff says:

| ID | Command description | Actual chunk transport | Exit |
| --- | --- | --- | --- |
| T01 | `rg --files` retained-author directory, filenames only | `3d2e23` | 0 |
| T02 | `cat` copy-manifest | `a6e0ce` | 0 |
| T03 | Node manifest mapping and before/current hash verification | `e2ed20` | 0 |
| T04 | `diff -u` before/current 164 | `76889c` | 1 |
| T05 | `diff -u` before/current 165 | `064178` | 1 |
| T06 | Node exact allowed-byte reconstruction | `85eef7` | 0 |

T03/T06 were reported to match exact authorized deltas, zero new images and no pipeline operation. Their complete command bodies and raw outputs are not present in the resumed model context and were not saved before compaction. They are **not reconstructed as actual historical streams**. The retained summary is continuity transport, not a substitute for raw capture. C01 below is a fresh, disclosed, narrow byte-delta command with its own actual output.

## Post-compaction control reads

These are routing, existence, path discovery and frozen-text context reads, not a new source/author full pass. No listed PNG, author inventory, prepare, snapshot or 166/167 MD was opened. Commands are exact; output disposition and any truncation are disclosed.

P01, chunk `95cc1d`, exit 1:

```sh
ls -ld .intentfold/tickets/STEMROBIN-184/tmp/production-source10c164-167-review/affected-text
```

Complete tool-delivered output:

```text
ls: .intentfold/tickets/STEMROBIN-184/tmp/production-source10c164-167-review/affected-text: No such file or directory
```

P02, chunk `eb03b4`, exit 0:

```sh
cat .intentfold/readme.md .intentfold/charter/engineering.md .claude/skills/ld-s10y-lesson/SKILL.md .agents/skills/ld-s10y-image/SKILL.md
```

The tool reported 1099 total lines and displayed a truncated instruction output. It is not labeled a complete raw stream or reproduced as one. These instruction files were read without workflow refresh/setup/backend operations. No instruction file was modified. This is an explicit ancillary control-stream limitation.

P03, chunk `47869f`, exit 0:

```sh
cat /Users/yong/.agents/skills/intentfold/SKILL.md
```

Instruction-read output remains in the actual tool transcript; not duplicated as a claimed frozen proof stream. No capability refresh/setup was invoked.

P04, chunk `51942d`, exit 0:

```sh
rg --files .intentfold/tickets/STEMROBIN-184/tmp/production-source10c164-167-review
```

Filename discovery only. Frozen 164/165 addresses and StageB report/freeze were used; 166/167 comparison or inventory contents and all crop/image contents were not opened. Output remains in the actual tool transcript; not promoted to source evidence.

P05, chunk `da7a3a`, exit 0:

```sh
node <<'NODE'
const fs = require('node:fs');
const crypto = require('node:crypto');
const path = require('node:path');
const root = process.cwd();
const base = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/10c');
const manifestPath = path.join(base, 'evidence/batch012-source164-167-author-before-review-edits/copy-manifest.json');
const bytes = fs.readFileSync(manifestPath);
const manifest = JSON.parse(bytes);
console.log(JSON.stringify({path: manifestPath, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex'), manifest}, null, 2));
NODE
```

Actual output wrapped the unchanged input copy-manifest (14557 bytes, SHA `a6ac7b308fc436edc8707a26b7f011303817d36f76c216713c25e926765e636b`) with those path/bytes/hash fields. The full output remains in the actual tool transcript; the exact source input is retained at its bound path. C01 records only the two authorized mappings and does not read any other listed input.

P06, chunk `0810b1`, exit 0:

```sh
rg -n -C 3 '0164-r1[56]|0165-r(19|20)|exposed|prepare|113|114|UNKNOWN|human|transport' .intentfold/tickets/STEMROBIN-184/tmp/production-source10c164-167-review/stageB/comparison-0164.md .intentfold/tickets/STEMROBIN-184/tmp/production-source10c164-167-review/stageB/comparison-0165.md .intentfold/tickets/STEMROBIN-184/tmp/production-source10c164-167-review/stageB/StageB-report.md .intentfold/tickets/STEMROBIN-184/tmp/production-source10c164-167-review/inventory-0164.md .intentfold/tickets/STEMROBIN-184/tmp/production-source10c164-167-review/inventory-0165.md
```

Actual excerpts establish the frozen row correspondence and preserved qualifications. The full excerpt output remains in the tool transcript; these exact frozen text inputs are bound in C01. Reading the frozen report's descriptions of other pages is not opening or re-reviewing their MDs or pixels.

## P07: full actual 164 unified-diff stream

Chunk `776ba5`, exit **1**. Exit 1 means differences found, not a failed hash check.

```sh
diff -u ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/batch012-source164-167-author-before-review-edits/before-pages/0164/page.md ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0164/page.md
```

Complete tool-delivered output:

```diff
--- ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/batch012-source164-167-author-before-review-edits/before-pages/0164/page.md	2026-11-17 06:45:20
+++ ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0164/page.md	2026-11-17 07:12:27
@@ -20,7 +20,8 @@
     "sha256": "dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849"
   },
   "notes": [
-    "AUTHOR ONLY：顶部承接上页正文；单元 113 归属暂定，须由父会话结合另行观察的物理页 0163 文字确认。本页未见单元标题，末句续下页。"
+    "AUTHOR ONLY：顶部承接上页正文；单元 113 归属暂定，须由父会话结合另行观察的物理页 0163 文字确认。本页未见单元标题，末句续下页。",
+    "唯一 StageB 对照确认导函数推导占两印刷行；仅移除已有 ↵ 后重复表达同一断点的 Markdown 换行，保留全部等式、符号及一个 ↵。不声明下游行数已通过。"
   ],
   "errata": []
 }
@@ -57,8 +58,7 @@
 性和极值．为此，求导函数
 
 <!-- p -->
-$f'(x)=(\sqrt{x}\ln x)'=\sqrt{x}'\ln x+\sqrt{x}(\ln x)'↵
-=\frac{\ln x}{2\sqrt{x}}+\frac{\sqrt{x}}{x}=\frac{\ln x+2}{2\sqrt{x}}$．
+$f'(x)=(\sqrt{x}\ln x)'=\sqrt{x}'\ln x+\sqrt{x}(\ln x)'↵=\frac{\ln x}{2\sqrt{x}}+\frac{\sqrt{x}}{x}=\frac{\ln x+2}{2\sqrt{x}}$．
 
 <!-- p open -->
 当 $\ln x=-2$ 也就是当 $x=e^{-2}$ 时，它等于零．在区间 $]e^{-2},\infty[$
```

## P08: full actual 165 unified-diff stream

Chunk `70295d`, exit **1**, normal differences found.

```sh
diff -u ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/batch012-source164-167-author-before-review-edits/before-pages/0165/page.md ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0165/page.md
```

Complete tool-delivered output:

```diff
--- ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/batch012-source164-167-author-before-review-edits/before-pages/0165/page.md	2026-11-17 06:45:20
+++ ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0165/page.md	2026-11-17 07:12:27
@@ -20,7 +20,9 @@
     "sha256": "dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849"
   },
   "notes": [
-    "AUTHOR ONLY：图 75 粗框只含图形，图题另列并与“设”同排。页首续物理页 0164，页尾第 4 条性质及括号续下页；性质编号不是习题编号。"
+    "AUTHOR ONLY：图 75 粗框只含图形，图题另列并与“设”同排。页首续物理页 0164，页尾第 4 条性质及括号续下页；性质编号不是习题编号。",
+    "唯一 StageB 对照确认性质 2 占两印刷行；仅移除已有 ↵ 后重复表达同一断点的 Markdown 换行，保留全部文字、公式及一个 ↵。不声明下游行数已通过。",
+    "独立 NEW native crop 后图 75 原点字形仍为 O/0 UNKNOWN；不得由作者自述或坐标惯例替代像素判定。"
   ],
   "errata": []
 }
@@ -76,8 +78,7 @@
 1．对数函数的定义域是区间 $]0,\infty[$：$D(\log_a)=R_+$．
 
 <!-- p -->
-2．对数函数值的集合是整个数轴 $]-\infty,\infty[$：$E(\log_a)↵
-=R$．
+2．对数函数值的集合是整个数轴 $]-\infty,\infty[$：$E(\log_a)↵=R$．
 
 <!-- p -->
 3．对数函数连续并且可以微分．
```

## C01: complete actual narrow byte-delta command/output

Chunk `64aab9`, exit 0. Exact command:

```sh
node < .intentfold/tickets/STEMROBIN-184/tmp/production-source10c164-167-review/affected-text/C01-command.js.txt
```

The entire actual stdin program is `C01-command.js.txt`, manually created with `apply_patch` before this execution. The entire tool-delivered output is transcribed without omission in `C01.stdout.json`, including absolute input bindings, exact before/after strings, all three appended notes, full-buffer equality flags, and the zero-image/scope flags. This is a faithful text transcript, not a claimed separate raw OS pipe capture. No stderr text appeared in the tool output; no separate stderr capture was provided by the exec tool.

Result: `EXACT_AUTHORIZED_TEXT_DELTA_MATCH; NOT_PAGE_COUNT_FIGURE_OR_UNIT_PASS`. No pipeline parser, count, finalize, render, source/author write or frozen-review write occurred. Only copy-manifest JSON and evidence text/byte identity were handled. No 166/167 current hash check exists or failed in this review.

## Freeze stream boundary

Subsequent C02/C03 are evidence-only digest/binding operations and are retained append-only with their exact command bodies and actual tool outputs. They do not rerun C01, read author inputs or verify the old StageB full binding packet. The manifest excludes itself and the final envelope to avoid circular self-hashes; the final envelope binds the manifest and final digest stream. Its own final SHA-256 is returned separately.

C02's exact command is:

```sh
node < .intentfold/tickets/STEMROBIN-184/tmp/production-source10c164-167-review/affected-text/C02-command.js.txt
```

The complete stdin program is retained at `C02-command.js.txt`. Its full actual output will be retained unchanged as `input-output-hash-manifest.json`, with chunk/exit recorded separately in `C02-receipt.md`. It hashes only new evidence and transports C01 input bindings without reopening them.

C03's exact command is:

```sh
node < .intentfold/tickets/STEMROBIN-184/tmp/production-source10c164-167-review/affected-text/C03-command.js.txt
```

Its entire stdin program will be retained before execution, and its complete actual JSON output will be retained unchanged as `freeze.json`. It performs one new-evidence binding comparison, not source verification. Its own envelope SHA is a terminal digest returned in text, necessarily outside the envelope's self-binding.
