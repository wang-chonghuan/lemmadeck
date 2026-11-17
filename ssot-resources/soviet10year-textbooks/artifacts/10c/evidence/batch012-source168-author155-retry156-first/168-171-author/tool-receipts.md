# Receipt Provenance

Session B, source author only, authorized continuation of STEMROBIN-184 cap3.
This is a provenance note, not a reconstructed stdout/stderr capture.

## Early Commands Returned Directly by the Tool

All of these were actually executed with functions.exec_command and returned
exit code 0. Their output was read in the tool result. No local raw-stream files
exist for these early invocations; this list is a metadata summary only.

| Tool result | Command | Observed result summary |
| --- | --- | --- |
| afd824 | sed -n '1,240p' .intentfold/readme.md | Session router read |
| a038dc | sed -n '1,260p' .claude/skills/ld-s10y-lesson/SKILL.md | Source extraction and row rules read |
| b5f436 | sed -n '1,280p' .agents/skills/ld-s10y-image/SKILL.md | Image batch/lifetime rules read |
| 131ce4 | git status --short | Dirty shared checkout; unrelated entries including T/ observed, not edited |
| c4bd4d | sed -n '1,240p' /Users/yong/.agents/skills/intentfold/SKILL.md | Existing authorized invocation context read; no capability/setup refresh run |
| 866828 | sed -n '1,240p' .intentfold/charter/engineering.md | Binding read-only engineering rules read |
| 266e06 | sed -n '1,200p' .intentfold/charter/operations.md | Evidence/operations rules read; no operations run |
| e298c2 | sed -n '1,200p' .intentfold/charter/product.md | Read-only product intent read |
| ba1730 | cat .intentfold/project.json | Project routing read; no backend access |
| f32fa9 | rg --files --hidden .intentfold/tickets/STEMROBIN-184/tmp/production-source10c168-171 | Prepared original/template/receipt paths found |
| 5c298a | sed -n '280,380p' .claude/skills/ld-s10y-lesson/SKILL.md | Remaining lesson process read; downstream actions not executed |

## Locally Captured Child Processes

capture.mjs writes child stdout and stderr directly from spawnSync Buffer results,
then writes a receipt with the actual argv, cwd, times, exit code, and stream
byte counts/hashes. Only commands/*/stdout.txt and stderr.txt created this way
are actual local raw stream captures. Command names do not claim source approval.

- 001-branch: actual git branch command; codex/STEMROBIN-184-textbooks.
- 002-templates-prepare: actual Node reads of the four supplied templates and
  four supplied prepare receipts, printed as JSON records.
- 003-native-crops: actual existing lesson-venv Python invocation. Three new
  native crops saved without resizing; creation.json has geometry and hashes.
- Subsequent numbered commands document final filesystem snapshots, hashes,
  row ownership text, and targeted status only. They are not tests or finalize.

## Tool Edits and Images

Manual source and evidence edits use functions.apply_patch; successful tool
results, not a reconstructed shell transcript, establish those edit operations.
Every model image load is recorded in image-ledger.json in observed order.
Pillow Image.open and byte-copy snapshots do not send an image to the model.
No original was reopened, no grid image was loaded, and no image is sent back
to the parent. Image tool payloads are intentionally not embedded in the handoff.

The original snapshot records real file existence and copied bytes at capture
time; all four target page.md paths were absent. The final snapshot copies all
four complete page.md files. Snapshot JSON is actual filesystem evidence, not
stdout reconstructed after the fact.
