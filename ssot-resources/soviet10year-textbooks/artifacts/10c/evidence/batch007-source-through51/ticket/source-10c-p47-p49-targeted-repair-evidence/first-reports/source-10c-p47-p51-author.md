# AUTHOR-REPORT: 10c physical 47-51

2026-11-16; STEMROBIN-184; original source author: Peirce. Codex is only the mechanical packager of existing first-finalize records, not the prose author. Written once; no page edit, command replay, image opening, diagnosis, or new content certification.

Workspace: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
Evidence root: `.intentfold/tickets/STEMROBIN-184/tmp/source-10c-p47-p51-author-evidence`.
Package manifest: `.intentfold/tickets/STEMROBIN-184/tmp/source-10c-p47-p51-author-manifest.json`.

## First attempts only

Each page's existing `command.json` records attempt 1 of:
`env -u PWDEBUG PLAYWRIGHT_HTML_OPEN=never .claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page <physical-page>`.
This is a historical command citation, not an instruction executed by this packager.

| Physical page | Existing first result | Exit | Recorded audit lines: MD / printed | Exact evidence under root |
|---|---|---|---|---|
| 47 | PASS | 0 | 23 / 23 | `0047/{command.json,result.json,stdout.txt,stderr.txt,attempt.manifest.json}` |
| 48 | FAIL | 1 | 19 / 20 | `0048/{command.json,result.json,stdout.txt,stderr.txt,attempt.manifest.json}` |
| 49 | FAIL | 1 | 24 / 25 | `0049/{command.json,result.json,stdout.txt,stderr.txt,attempt.manifest.json}` |
| 50 | PASS | 0 | 22 / 22 | `0050/{command.json,result.json,stdout.txt,stderr.txt,attempt.manifest.json}` |
| 51 | PASS | 0 | 20 / 20 | `0051/{command.json,result.json,stdout.txt,stderr.txt,attempt.manifest.json}` |

The original attempts span `2026-11-16T08:13:12.795Z` through `2026-11-16T08:19:07.682Z`. All stderr files are empty. Pages 48/49 retain their original line-reconciliation errors; no retry or repair is represented.

## Existing bindings

`prepared-before.manifest.json` records that none of the five durable page directories existed before authoring. It binds `prepared-before/<page>/` and `source-book.before.json`. Each `source-first-<page>.md`, `first-draft-before-finalize/page.md`, first command/output/result, and `after-{durable,scratch}/` remains at its original path.

`first-finalize-generated-diff.json` records byte-identical before/after MD bodies for all five pages; only generated `/printed_lines`, `/figures: []`, and `/provenance` metadata was added. It is not a content review.

The packager's read-only hash check found no mismatch in the prepared manifest, five attempt manifests, author source-first bindings, or current prepared/durable bindings. Current `page.md`, `page.json`, and `audit.json` equal their first after snapshots. Existing audits report zero figures, normalizations, errata, and count exclusions. No new image, crop, source, tool, assembly, lesson, DB, or Git work was performed.

Remaining first mechanical failures: **2 (48, 49)**. Fidelity and literal UNKNOWNs belong to the separately frozen independent Stage A and its sole Stage B, not this packaging report. This report does not promote any page or unit.
