# STEMROBIN-180/C: 7p 328/329 FIRST SOURCE Review

Status: **2 SOURCE BLOCKED, 0 SOURCE approved, 0 permanent rejection newly assigned,
0 environment HOLD, 2 pending possible author repairs.**
This is the sole fresh FIRST source review for this bounded offline batch.
No freshness update, Grill, live-ticket restart, formal handoff, or product operation.

## Findings

**328: one independently confirmed italic omission.**
Unit `D328-1`, `p0328#12`, printed row R17: exact affected text **柔软**.
Original-only inventory froze this word as italic before any author material was read.
Frozen FIRST candidate, FIRST actual MD, current MD, and actual/current page JSON
all leave `柔软` plain in:
`图 279 所示是两条平行放置的、柔软的直导线. 它们都`
The author's frozen/current typography inventory also omits this italic unit.
No source approval. No repair was performed by this reviewer.

**329: one independently confirmed italic omission, crossing two printed rows.**
Unit `D329-1`, `p0329#2`, printed rows R07-R08, exact affected text:
`如果除了电流强度以外，其它条件都相同，则每`
`一条导线中的电流强度越大，导线间的相互作用力就越大`
The terminal sentence stop's weight/style is not part of this confirmed defect.
This is **one continuous clause**, not two independent row defects.
Original-only inventory froze the whole conditional as italic.
FIRST candidate, FIRST actual/current MD, and actual/current JSON leave it plain;
the author's frozen/current italic inventory does not list it.
No source approval. No repair was performed by this reviewer.

## Source-First Sequence And Scope

Workspace: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Owned scratch: `.tmp/ld-s10y-lesson/source-review-7p328329-first/`.
Only durable owned file: this report. Other workers' paths were read only.
Read router, engineering/operations/product charter, lesson cap1 and image-batch rules.
This is a parallel local sidecar to Main's batch39 preparation; no other chat was messaged.

Only clean inputs:
`source7p328-clean-review-input.json`, 4830 bytes,
`46374ed55f4a0b4d8cd2b3519e6777797687e66e630451140029531c488a89eb`;
`source7p329-clean-review-input.json`, 4396 bytes,
`e80df88dc233feae871331ca66c870e26a3fad7ceccac75b808e23c6e0515568`.
Initial shape/hash inspection confirmed these exact inputs. Actual input root key is
`workspace_base`, equal to W, with `files` an array of direct path/bytes/sha256 objects.
The return manifest uses the requested `workspace` key.
Every selected path is directly under `source-author-7p-328329/`; no recursive pointer was followed.
Main's 146 completed author bindings were reused; zero author-origin leaf rehashes and
zero rehash of the whole leaf set. Return hashes of selected origins are Main's supplied bindings;
owned snapshot hashes describe the actual bytes copied once. Full streams remain owned locally.

Observed both original grids, then five own unscaled/unenhanced crops of those grids.
Froze complete independent inventories `source-0328-frozen.md` and `source-0329-frozen.md`
before any author inventory, candidate, actual, JSON, MD, or mechanical receipt was read.
The recorded snapshot command then copied each of the 28 selected author text files exactly once.
Byte-identical copies were compared directly in memory and displayed once with alias lines;
their snapshots are separate, not reconstructed artifacts. Two output fragments omitted by the
tool's display truncation were read from the already-owned full stream, not from source or origins.
Only then was FIRST actual `fig-279.png` inspected, once. No post-candidate SOURCE image reopen.
No author crop, work figure, PDF, failed predecessor body/image/report, aggregate, history, helper,
or authority pointer was opened.

## Complete Inventory Comparison

328: independent and actual 19 printed text rows, 15 blocks, 1 figure, five questions.
All printed lexical text, question numbers, §142, unit 131, year 1948, figure references,
long dash/quoted phrases, continuation endpoints, caption and italic footer 317 are present.
Confirmed bold spans are preserved. `D328-1` is the only confirmed content defect.
FIRST candidate figure coarse box `[225,1585,1080,330]` became actual
`[232,1593,1067,317]`; candidate body was otherwise preserved and the actual has its figure link.
This is mechanical FIRST finalization, not a repair.

329: independent and actual 25 rows, 10 blocks, 0 figures. The source partition separately
grouped R18-R19 and combined R22-R23; actual keeps R14-R19 together and splits R22/R23.
This equivalent parser grouping loses no row, math, sentence or boundary and is not a defect.
Underdots are preserved across R02-R03, including the nine-character mutual-action phrase and
the subsequent fourteen-character explanation, with comma/period outside the wrappers.
Candidate additionally uses an em wrapper for the mutual-action phrase; this review does not
derive any new italic requirement from the author's inventory.
Confirmed bold definitions, three unit conversions, naming terms, equation values and italic
math variables/footer 318 are present. Exact values are `2*10^-7`, `0.0000002`, `0.001`,
`0.000001`, `1000`, `I=q/t`, `q=It`, `I=1`, `t=1`, and `1 coulomb=1 ampere*1 second`.
The electron-charge announcement ends in a colon and remains open; no later value is invented.
`D329-1` is the only confirmed content defect.
FIRST candidate body equals FIRST actual/current body; finalization adds metadata only.

Within-batch continuation 328 `它们都` -> 329 `与电源相接` is retained.
No approval is extended across the 327 gap, to 330, or to full units 129/130/131.

## Figure Review

Figure facts came only from frozen independent source pixels, not the author's inventory.
One printed figure with two scenes: each has a battery labeled minus/plus, a switch,
two upper/lower two-contact support bars, connecting wires and two flexible conductors.
Left: both conductor arrows up, conductors bow inward.
Right: left conductor arrow down, right arrow up, conductors bow outward.
FIRST actual preserves both complete scenes, support contacts, polarity labels, wire routes,
direction marks and switches. It excludes the independently transcribed caption/footer.
No confirmed figure defect. This is not a new exact arrowhead count or a modern-figure approval.

## Receipts, Failures And Budgets

Author FIRST actual, read once from owned receipt snapshots:

| Page | UTC Start | UTC End | Exit | Printed/MD Rows | Blocks | Figures | Normalizations |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 328 | 2026-11-16T21:32:34.479Z | 2026-11-16T21:32:34.821Z | 0 | 19/19 | 15 | 1 | 0 |
| 329 | 2026-11-16T21:36:16.033Z | 2026-11-16T21:36:16.572Z | 0 | 25/25 | 10 | 0 | 0 |

Exact argv/cwd/full stdout/full empty stderr are in each owned
`snapshots/first/0328/actual/command.*` and `snapshots/first/0329/actual/command.*`.
Original receipt stream pointers were recorded but not followed.
Both audits have no errors, unknown characters, KaTeX warnings, or errata.
**Mechanical pass is not SOURCE approval.**

Each page: actual repair used 0, unused 1, cap 1 total including environment/mechanical repair;
no prior repair, startup failure, replacement, successful replay, or in-flight author command.
Reviewer: content/environment/mechanical repair 0; no prepare/finalize/render/checker run.
Own Pillow crop runtime was the explicitly supplied absolute Python with `-B`; exit 0.
Own command records contain actual argv, W cwd, measured start/end, exit and full streams.
One bootstrap `ls` exit 1 is preserved: both owned destinations did not yet exist.
Its unknown start/end clocks are null. It is a discovery failure, not startup failure,
not a SOURCE rejection and not an actual repair.

Images: 8/8 batch, 8/24 context; 2 original grids + 5 own crops + 1 FIRST actual figure.
328 contributes 5 images, 329 contributes 3. Reopens 0; parent image opens 0;
no image payload in the textual return. No new batch or delegated image history.

## Uncertainties

Four frozen nonblocking uncertainty units, two per page:
`U328-1` ordinary question calligraphy does not prove whole-question italics;
`U328-2` glyph encoding/spacing and isolated specks do not prove extra emphasis;
`U329-1` underdot wrapper/punctuation encoding is not supplied by pixels;
`U329-2` dark standalone math/sign/punctuation weight does not prove extra bold.
No unresolved lexical or numeric-value uncertainty.
Exact individual arrowhead total is not independently established by the frozen directional
groups; doubled/thick ink is not a separate proven arrow or typography defect.
Author's own unresolved arrowhead-count note is retained, not converted into a new finding.
No uncertainty excuses either confirmed italic omission. No fresh permanent status assigned.

## Current Metadata Only

User-supplied current baseline, unchanged and not independently re-audited:
`7p64/8p13/raw54-21-85/entries8p0/modern0/numberingUNSET`.
61 SOURCE BLOCKED: 3 uncertainties, repair used 1/unused 0.
62 permanent: 3 italic defects, used 0/unused 1.
327 permanent: 3 italic defects, used 0/unused 1.
326 single confirmed italic repair pending, no approval.
66 AUTHOR BLOCKED 17 versus 19, no actual repair.
322/323 genuine SOURCE BLOCKED HOLD has resolved environment repair 1 each.
No claim about any earlier history, global numbering or cross-gap completed object.

No Git, DB, promotion, assembly, modern content, app, profile, dependency, schema,
supervision, other-chat message or formal handoff operation was performed.
The flat manifest contains direct owned evidence and needed clean/selected current origins;
it excludes itself, external runtime and recursive aggregates.
