# Read-Only Execution Facts

R = /Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck

Every exec_command explicitly supplied workdir=R. The native pwd output independently confirmed R. All eight calls completed synchronously, exit_code=0; none returned a session ID. No native image/producer subprocess, browser, backend, network command, install or Git command was invoked.

The following command argv are the individual native command/builtin argument vectors actually submitted in the exec_command cmd field. The tool's underlying shell-wrapper argv is not exposed; it is UNKNOWN, not manufactured. The declared environment shell is zsh. There were no redirects or stream files. stdout/stderr were captured in the tool results; the displayed results do not provide separate stderr byte counts. No error text was observed. Stable tool-output chunk references and stream summaries follow instead of copying entire rule documents.

| Call | cwd | Command argv | Exit | Observed stdout / streams |
| --- | --- | --- | --- | --- |
| 1 | R | ["pwd"] | 0 | Chunk bdeb7c: /Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck followed by newline. No error text. |
| 2 | R | ["sed","-n","1,240p",".agents/skills/ld-s10y-image/SKILL.md"] | 0 | Chunk 4f0dbb: current skill lines 1..240, including shared image batch rules. No error text. |
| 3 | R | ["sed","-n","1,260p",".claude/skills/ld-s10y-lesson/references/production-resume.md"] | 0 | Chunk a7bafd: current recovery contract. No error text. |
| 4 | R | ["test","!","-e",".tmp/stemrobin-184-six/n88-original-crop-gap-first"] | 0 | Chunk 14ce8d: empty output, proving the new evidence directory initially did not exist. Shell builtin, not a producer subprocess. |
| 5 | R | ["sed","-n","1,180p",".intentfold/readme.md"] | 0 | Chunk 44170f: session routing rules. No error text. |
| 6 | R | ["sed","-n","241,420p",".agents/skills/ld-s10y-image/SKILL.md"] | 0 | Chunk cfeca0: remaining current skill rules. No error text. |
| 7 | R | ["sed","-n","1,220p",".intentfold/charter/engineering.md"] | 0 | Chunk 5cd96e: engineering rules through requested line 220. No error text. |
| 8 | R | ["sed","-n","1,220p",".intentfold/charter/operations.md"] | 0 | Chunk de1774: operations and evidence rules through requested line 220. No error text. |

Calls 2..5 and calls 6..8 used multi_tool_use.parallel. No commands were chained.

Persistent node_repl operations verified nodeRepl.cwd=R, used absolute paths below R, and spawned no subprocess. Two image-decoder initialization attempts failed before any source or crop was opened: the hosted sharp import rejected an internal ../package.json import; the local require reported Cannot find module 'sharp'. Both original failures remain in the tool history. The subsequent pngjs import succeeded without an installation or network request. An initial figure query selected kind=figure rather than kind=fig and returned empty arrays; an overbroad follow-up accidentally surfaced page prose and was replaced with kind=fig/cap selection. These are technical/query facts, not content verdicts.

Image read/decode/view order: original 0067, original 0068, original 0070, original-freeze.md write/hash binding, corresponding metadata reads, crop 38, crop 39, crop 40, crop 41, cached pixel checks, one cached-source ROI for figure 39. No image reopened. New ROI bytes were generated from cached pixels and written with exclusive flag wx inside the sole new write scope.

No browser or exec session was opened or left running. The persistent node runtime will be reset after final evidence hashing; no producer/runtime copies or additional image payloads are delivered to the parent.
