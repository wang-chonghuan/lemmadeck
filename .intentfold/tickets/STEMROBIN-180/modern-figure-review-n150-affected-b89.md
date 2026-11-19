# B89 n150 Independent Affected FIG Review

Affected verdict: **PASS** for F1.
Composed current FIG verdict: **PASS**, using the unchanged FIRST unaffected
whole-FIG coverage plus this affected review of the bound `repair-wire2` output.
The immutable original FIRST report remains **REVISE**. It is not rewritten,
retroapproved or treated as a standalone PASS.

SAME `STEMROBIN-180` cap3 invocation `180-3`; B89; figure `fig-309`.
Affected review round 1 after the FIRST independent review. This is not a
second whole-FIG review, an author-PASS adoption or an official recorder file.
Every shell cwd was `/Users/yong/.codex/worktrees/0f12/lemmadeck` (W).

## F1 Resolution

Inspected only the affected battery-return route in the two specified existing
new previews: 308 px neutral and 640 px print. No source, baseline preview,
crop or other image was opened during this continuation.

At 640 px, a distinct wire leaves the retained return terminal, crosses the
battery top clear of the shared front/top border, and exits toward the existing
left exterior lead. It no longer uses the casing outline as a conductor.
The same wire-to-border separation remains visible at 308 px.
Its passage out over the top's left boundary is an apparatus-edge exit, not
a newly added electrical junction. It does not traverse the battery front
interior, touch the other terminal or join the outgoing overhead lead.

F1 is resolved. No new affected finding remains.
This judgment concerns only the distinct return conductor, retained terminal
connection, casing clearance and absence of a new conductor crossing.
All other source/semantic/label/icon/display coverage is reused from FIRST.

## Scope Guard And Endpoints

Independently compared the current spec to the actual FIRST-reviewed
`repair-wire1/fig-309.spec.json`, without reopening or judging any unaffected
source/image content. Restoring only the authorized route-object and matching
assertion endpoint arrays gives exact DeepEqual with that spec.

Two internal vertices changed:
`[185,685] -> [185,697]` and `[90,720] -> [90,732]`.
The terminal `[215,715]` and exterior continuation `[65,715] -> [55,585]`
remain fixed.

| Eligible route object | Current spec endpoints | Current SVG screen endpoints |
|---|---|---|
| `battery-switch-return-1` | `[215,715] -> [185,697]` | `[215,425] -> [185,443]` |
| `battery-switch-return-casing-1` | `[185,697] -> [90,732]` | `[185,443] -> [90,408]` |
| `battery-switch-return-casing-2` | `[90,732] -> [65,715]` | `[90,408] -> [65,425]` |
| `battery-switch-return-casing-3` | `[65,715] -> [55,585]` | `[65,425] -> [55,555]` |

The last eligible span and its assertion remain unchanged.
Three objects and three matching `*-connects` assertions changed; eight
endpoint arrays changed across those objects/assertions. All matching
assertion endpoints agree with their route objects. The four current SVG
lines agree with those endpoints after the canvas y-transform.
All 81 objects, 67 assertions, source authority, inventory, text, styles,
display contract, labels, circuit roles and unaffected relationships remain
unchanged. No new electrical component, terminal or branch was introduced.

Read-only geometry observation corroborates the existing guard:

- Shared front/top border centerline clearance: `11.260117401805323` canvas
  pixels. This is layout clearance, not a physical apparatus measurement.
- Other battery terminal centerline distance: `18.865635296007163` pixels,
  exceeding its radius 9 plus wire half-stroke 2.5.
- Intersections with the outgoing overhead lead: 0.
- The altered route stays above the front/top border or outside the front
  face's horizontal extent; it does not cross the front interior.

These observations and the actual affected pixels support F1 PASS.
They are not a standalone draft/render/native replay.

## Current Bindings

Candidate root:
`W/.tmp/ld-s10y-lesson/b89-fig309-author/repair-wire2/`.
All four current candidate files were observed sealed `0444`; their actual
hashes match the supplied values.

| Artifact | SHA-256 |
|---|---|
| `fig-309.spec.json` | `2d206a4bc76cede55d70eaf9964b9d33c930ad94e6269db39608936d9903d2f5` |
| `fig-309.svg` | `debe8ac54c4481ed5ee762d0a20fd38faafc0809c2c1bae68f25857e7161ff04` |
| `fig-309.render.json` | `46801bd2a96ccba822c25622b70d94dd8a05b15d4e1dc369aff6e374c28066f4` |
| `native-preview.FIRST.json` | `f32ed744577f2cf6729a04dd374908279a59f621ed9d189f469787dd8f5cef39` |
| `native-308-neutral.FIRST.png` | `2530886d6e083373f90bdef48590ff14ec8f6c78f16af772c2d53c74044b8a0d` |
| `native-640-print.FIRST.png` | `d0692e765c003144b3fb76b5ac87adebb692854168f02dc5f4eb39a2bb2f585a` |

Parent author report:
`W/.intentfold/tickets/STEMROBIN-180/modern-figure-repair-n150-wire2-b89.md`,
SHA-256 `ceff904e150a29b526e7b1d3de46d6c93c30b4f14911d902cf9903f5062496f3`.
Parent guard:
`W/.intentfold/tickets/STEMROBIN-180/tmp/b89-n150-wire2.json`,
SHA-256 `33a15d3038c2f59f0ab1465353247f14952228653e497b1bc3a4dd970642f118`.
These are author evidence; neither is substituted for independent approval.

## Reused FIRST Coverage

The following FIRST files were verified unchanged in bytes and mode `0444`:

- `W/.intentfold/tickets/STEMROBIN-180/modern-figure-review-n150-b89.md`:
  `7f6f527d2e8ec7ff6d61bd45b81923e74aabbcbb670105f2ac212724e4d73817`.
- `W/.intentfold/tickets/STEMROBIN-180/tmp/b89-n150-FIG/review-freeze.json`:
  `2d0b72c7243bfb71d4f2d0d6d36f2a37430fc52a81d9b7a2bdde73f95afd9e3f`.
- `W/.intentfold/tickets/STEMROBIN-180/tmp/b89-n150-FIG/source-inventory.md`:
  `35dc7057f35d1a98dd871c40cc00dd7769a7953dd7f6d6c95c3a9c0a9e7211a2`.

FIRST-reviewed baseline spec hash:
`8be55856f89d9a6d2d4a410b79b54fd317950b2a2ac9dc138f75169c46693db0`.
The exact-restoration comparison establishes the affected-only boundary.
Unchanged source inventory, TEXT PASS, electrical relationships, labels/icons,
cultural/physical-claim limits and display declarations retain their FIRST
coverage. Historical B55 UNKNOWN bindings remain UNKNOWN, and historical
semantic FAIL evidence is not retroapproved.

## Existing Receipts Only

Read the saved parent author/render/native receipts and streams; ran none of
those commands again. Each receipt records cwd W, one call, exit 0,
no error/signal, and empty stderr.

| Saved action | UTC interval | Receipt SHA-256 |
|---|---|---|
| Author F1 repair | `2026-11-19T04:33:40.205Z -> 04:33:40.252Z` | `74d4ba1e794c11aa59e4dee0791bad630f5460511796064528084c32f71a4e7e` |
| Render | `2026-11-19T04:33:48.962Z -> 04:33:50.005Z` | `624758e8739708bc0db95eed83e9d3da40ce0486523f31ed266320934e7d5b76` |
| Native preview | `2026-11-19T04:33:54.731Z -> 04:33:57.103Z` | `a60d1f4bff0690d3ceab1e68c423f42c6c4dd809f6b0eab911e13429fa293616` |

Receipts are under
`W/.intentfold/tickets/STEMROBIN-180/tmp/b83-n65-raw-and-text/`,
named `b89-n150-wire2-{author,render,native}.call.json`.
Current render passes with five labels and zero collisions; current native
passes 12/12 at actual media widths 308/331/358/640 px.
Minimum transformed text remains 17.325 px, above 16 px.
The two inspected widths measure 308 px and 640 px respectively.
These remain offline native media results, not new headed-app/whole-lesson
or A4 acceptance evidence.

## Counts And Stop

This continuation loaded exactly two new images: current context **4 -> 6/8**.
New source opens/reopens 0; baseline/preview reopens 0; crops 0;
new screenshot files 0. No new image-bearing evidence was copied.

Reviewer render/native/draft/paid/official-recorder calls: all 0.
Reviewer candidate edits/content revisions: 0.
Whole-FIG review count stays 1; independent affected review rounds: 1.
Author counters are preserved at overall repair ordinal 4 and actual content
revisions 3, rather than reset by this PASS.

Affected freeze:
`W/.intentfold/tickets/STEMROBIN-180/tmp/b89-n150-FIG/affected-review-freeze.json`.
It binds this report, current candidate/evidence, retained FIRST coverage and
the composed PASS verdict. Original FIRST remains REVISE and `0444`.

No official `record_review` or promotion was performed. The composed PASS is
independent review evidence for the parent, not a publication action.
No candidate edit, source reopen, full re-review, DB/app/dependency/Git/backend,
paid call or other-chat action occurred. Stopped at affected PASS.
