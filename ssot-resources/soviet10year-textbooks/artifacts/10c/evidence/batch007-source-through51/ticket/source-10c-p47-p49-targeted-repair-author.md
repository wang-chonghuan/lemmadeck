# 10c physical 47-49: targeted repair author

2026-11-16; STEMROBIN-184; Codex, repair author only. This is not an independent source PASS or a full-source gate.

Workspace: `/Users/yong/.codex/worktrees/a07e/lemmadeck`. All `tmp/` paths below mean `.intentfold/tickets/STEMROBIN-184/tmp/`.

## Literal scope

Sole Stage B: `tmp/source-10c-p47-p51-independent-review.md`, unchanged SHA-256 `95276911747d2ce7d6e60deeb465b07ee21534dfb37b894b2f19bf6576dd2043`.

- 47 JSON `/blocks/2/lines/1`: comma before equation tag (3) becomes an ASCII period; expression, spacing and shared tag row unchanged.
- 49 `/blocks/9/lines/0`: `\sin x\geqslant0` becomes the printed strict `\sin x>0`. Its printed qualifier `(x\in Z)` stays literal.
- 49 `/blocks/10/lines/0`: only the qualifier `(x\in Z)` becomes printed `(n\in Z)`.
- 49 `/meta/notes/1`: correct only those qualifier/sign claims. Property4's colon, every other note and body/header byte remain unchanged. No erratum or mathematical correction.

## Count Diagnosis

Existing `layout.ink_mask`, `counting_ink`, `line_bands` and `blocks.printed_lines` were reused without code, threshold, argument-width or count-override changes. Initial recomputation exactly matches the existing prepared layouts: 48 has 20 bands versus 19 MD rows; 49 has 25 versus 24.

| Page | Extra band, inclusive | Actual native finding | Preserved folio band |
|---|---|---|---|
| 48 | y2478-2498, x18-1645 | Irregular, broken bottom scan-boundary trace; no printed text or separator | y2263-2294, dot42dot |
| 49 | y2484-2504, x86-1649 | Irregular, broken bottom scan-boundary trace; no printed text or separator | y2280-2310, dot43dot |

Exactly four images were loaded once at native detail: each page's bottom-margin strip and folio strip. No whole page, other-page image, repair glyph, enhancement, annotation or reopen was loaded. Every strip is a verified unscaled pixel slice of the unchanged prepared source. One batch, 4/8 images; fresh-context total 4/24.

Both pages receive one `scan-artifact` `count_exclusions` entry, box `[0,2470,1695,40]`, with page-specific source/noise/folio reasoning. The current guard accepts it because y2470 is below the bottom-margin boundary y2451. One candidate calculation per page removes only the last noise band; all prior body and folio band coordinates remain identical. Exclusion affects the counting copy only. No extraction pixels, source/figure crops, blank rows, body rows, formula breaks or manual expected counts were changed. Existing notes saying no exclusions were added in the first author pass remain verbatim historical notes.

## Actual Results

Complete before MD/JSON/audit, first drafts, first-finalize triples and commands/stdout/stderr/results, and first source REVISE were saved before repair. Evidence root: `tmp/source-10c-p47-p49-targeted-repair-evidence/`.

Each affected page ran exactly once through:
`env -u PWDEBUG PLAYWRIGHT_HTML_OPEN=never .claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page <47|48|49>`.

| Page | Immutable first result, MD/printed | Targeted exit/result, MD/printed |
|---|---|---|
| 47 | PASS, 23/23 | 0 / mechanical PASS, 23/23 |
| 48 | FAIL, 19/20 | 0 / mechanical PASS, 19/19 |
| 49 | FAIL, 24/25 | 0 / mechanical PASS, 24/24 |

All targeted audits contain zero normalizations, unknown characters, KaTeX warnings, figures and errata, and empty errors. No retry occurred. Exact final commands, outputs, results and after triples are under each affected four-digit page directory.

Pre-finalize and post-finalize assertions verify the entire MD against exact declared substitutions/additions; final JSON/audit bytes match only the declared changes. All blocks, headers, flags, other notes, source/render/profile fields and MD row counts are preserved. All 154 protected bindings and 40 saved before/first-evidence snapshots remain byte-identical, including all prepared pixels/layouts for47-51, durable50/51, original first-evidence package, immutable reports and tool files.

## Limits And Stop

The original first FAILs and first source REVISE are retained, not rewritten as successes. No fresh independent review or full-source approval is claimed. Inherited46's argument UNKNOWN remains outside scope; unit86 and future apparatus remain unreviewed. No mathematical facts were sought.

Only durable47/48/49 and this scratch evidence were written. No prepare, source/tool/app/dependency change, index, vectorization, assembly, adaptation, answer, choice, broad check, browser/window/CDP action, Git, DB, other-chat action or promotion occurred. Browser-background rules were read; no browser was needed. Stop this batch.

Machine manifest: `tmp/source-10c-p47-p49-targeted-repair-manifest.json`.
