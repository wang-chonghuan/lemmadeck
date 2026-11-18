# B83 independent SOURCE SVG fidelity review: 7p figs 397-400

Date: 2026-11-18.
Ticket/session: STEMROBIN-180 / 180-3.
Workspace: /Users/yong/.codex/worktrees/0f12/lemmadeck.
Branch: codex/STEMROBIN-180-textbooks, as instructed and recorded in ticket.json;
no Git commands were used to inspect or change it.

## Verdicts

| Figure | Verdict | Raw/native dimensions | Concrete fidelity defect |
| --- | --- | --- | --- |
| 397 | PASS | 293 x 411 | None identified at original detail |
| 398 | PASS | 342 x 410 | None identified at original detail |
| 399 | PASS | 620 x 232 | None identified at original detail |
| 400 | PASS | 965 x 255 | None identified at original detail |

These are independent visual verdicts for the existing SOURCE SVG contours
against the supplied raw PNGs, not modern-figure approval. No figure is REVISE
or HOLD in this narrowly defined comparison. This is not an assertion of
pixel identity: the rasterized vector boundaries are smoother than the raw
bitmap boundaries.

## Scope And Method

Read the lesson SKILL, production-resume contract and image-batches rules.
For each figure, viewed its original PNG FIRST once at `detail: original`,
froze its apparatus/contacts/relationships/labels/subfigures/ambiguities in
the owned observations file, then ran the existing unmodified helper once,
without a width argument, and viewed its output once at `detail: original`.
Output parents were created by apply_patch before the first helper call.

Actual image use, in order:
397 original, 397 native; 398 original, 398 native; 399 original, 399 native;
400 original, 400 native. Total: **8/8 images = 4 originals + 4 native rasters**.
No reopens, enlargements, extra crops, whole pages, or additional images.

All full-native apparatus silhouettes, leads, contact mergers, crossings,
holes, scale marks, label outlines, subfigure separation, relative positions,
aspect and composition were compared. No missing/extra required contour or
new clipping relative to the supplied PNG was identified. This expressly
does NOT approve the crop boundaries, page data, or whole-page text.
The sibling whole-page SOURCE text/crop review was not consulted or repeated.

SVG structural reads found matching PNG/SVG/native width and height for each
figure, a single path using currentColor and evenodd fill in each SVG, and
no text nodes or embedded images. Glyphs are traced outlines, not newly
typeset labels. Structural reads and hashes loaded no additional images.

The source author's reported six images and once-per-figure vectorize mismatch
results (397: 0.000%; 398: 0.006%; 399: 0.004%; 400: 0.000%) are supplied
numerical history, not this review's visual approval or independently rerun
measurements. No vectorize/finalize stage was run here.

## Per-Figure Coverage

### Fig 397: PASS

The upper box's two front faces, central edge, top fittings/light holes and
plus-shaped mark match. The tilted upper-right board retains its double
edge, upper/right contacts and central circular feature. The lower-left
lever/pivot/block assembly, handle, base and tiny openings match, as do the
lower-right bulb, interior mark, collar/stem slit, foot and contacts.
All four visible lead routes and their source attachments, diagonal across
the upper box, overlapping dark contacts and small light gaps are retained.
No missing/extra apparatus, changed proportion, displaced mark, lost
meaningful hole or newly severed lead was observed. Apparatus naming is
descriptive, not an approved electrical model.

### Fig 398: PASS

The box, top holes and separate polarity-like marks match. The large meter
retains its top ledge, nested rectangular frame, bowed scale contours,
tick groups, diagonal needle, three scale-glyph regions, central lower
window and interior opening, horizontal rules and five staggered base
circles. The lamp's bulb/collar/stem/base, lower-right lever/contact assembly
and handle-tip opening match. Outer/inner left-side lead contours,
upper-box-to-lamp route, right descending route and low inter-apparatus
route retain the source bends, contact positions and mergers.
The less-clear right scale glyph remains unresolved; faithful tracing does
not establish its numeric meaning.

### Fig 399: PASS

Both complete side-by-side subfigures retain circular meter outlines,
arched scales, protruding ticks, small endpoint/upper glyph contours,
A-shaped outlines, opposite needle tilts, paired hollow left terminal
marks, squared upper leads, right bar stacks and intervening gaps,
lower crossed circles with four light sectors and bottom return leads.
Relative sizes, central separation and all source contact positions match.
**Exact terminal/scale digits remain UNKNOWN.** Their original contours
are faithfully retained; no exact digit reading, idealized circuit or
modern model is approved.

### Fig 400: PASS

All three distinct gauge faces remain present and separate. Both small
rectangular frames retain their different bowed scales, tick density,
glyph outlines, inner spaces and upper-right diagonal needle positions.
The large curved/flared frame retains its heavy bands and slanted sides,
both curved scale boundaries with end closures, radial ticks, rotated
numeral contours, long nearly vertical pointer and its scale crossings
and protruding tip. No re-typeset/repositioned glyph or regularized
scale was introduced.
**The possible minus at the middle face's left end remains UNKNOWN.**
No signed-scale interpretation or pointer-value reading is approved.

The full source-first frozen inventories and viewing ledger are retained at:
/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b83-source-svg-review/observations.md

## Exact Helper Results

Each command ran from the workspace above, with its stdout and stderr
redirected separately into the owned review directory. The four invocations
were the following, each exactly once and without an optional width:

```text
node .claude/skills/ld-s10y-lesson/tools/svg_raster.js .tmp/ld-s10y-lesson/b83-source-next/7p/pages/0467/figures/fig-397.svg .intentfold/tickets/STEMROBIN-180/tmp/b83-source-svg-review/fig-397.native.png
node .claude/skills/ld-s10y-lesson/tools/svg_raster.js .tmp/ld-s10y-lesson/b83-source-next/7p/pages/0467/figures/fig-398.svg .intentfold/tickets/STEMROBIN-180/tmp/b83-source-svg-review/fig-398.native.png
node .claude/skills/ld-s10y-lesson/tools/svg_raster.js .tmp/ld-s10y-lesson/b83-source-next/7p/pages/0468/figures/fig-399.svg .intentfold/tickets/STEMROBIN-180/tmp/b83-source-svg-review/fig-399.native.png
node .claude/skills/ld-s10y-lesson/tools/svg_raster.js .tmp/ld-s10y-lesson/b83-source-next/7p/pages/0468/figures/fig-400.svg .intentfold/tickets/STEMROBIN-180/tmp/b83-source-svg-review/fig-400.native.png
```

| Figure | Exit | Exact stdout, followed by newline | Stderr |
| --- | --- | --- | --- |
| 397 | 0 | `{"ok":true,"w":293,"h":411}` | Empty, 0 bytes |
| 398 | 0 | `{"ok":true,"w":342,"h":410}` | Empty, 0 bytes |
| 399 | 0 | `{"ok":true,"w":620,"h":232}` | Empty, 0 bytes |
| 400 | 0 | `{"ok":true,"w":965,"h":255}` | Empty, 0 bytes |

Original logs are retained, separately per figure, as
`fig-397.stdout.txt` / `fig-397.stderr.txt` through
`fig-400.stdout.txt` / `fig-400.stderr.txt` under:
/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b83-source-svg-review/
No helper stage failed or was retried.

Helper SHA-256:
`bc37462e28d5b44e574505c03ed062441185a7ba747a0f9af1702d4d67656db8`.
The helper and all eight source input hashes were identical before and
after this review.

## SHA-256 Bindings

The following manifest records all four raw PNGs, all four existing native
SVG inputs, all four viewed native raster outputs, all eight original
stdout/stderr files, and the frozen observation report:
/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b83-source-svg-review/evidence.sha256

| Fig | Raw PNG SHA-256 | Native SVG input SHA-256 | Viewed native raster SHA-256 |
| --- | --- | --- | --- |
| 397 | `e0ebd77548f0e64f484e9bb281e4741b6b22c8c310d4e926631712c7de1a1e52` | `d3e2d98f9747acea4214386b456f9e6fa0c1fda859eb32e9d32835db6d1cb985` | `c85029a83a6ffa9a53230a03ffb6ad3c9f37bb479553c723ae9e8d24a2cc4763` |
| 398 | `00986309223f8393f53cc6fdcd7eb5e2e7efaae881c2ab154c181a05da267cca` | `22a71fc0f8037c0a24aa0073acf984ca2f598591db2ff066fceb1f04d8e38ef0` | `b0092eb096400c2242dc1520d3fe9d0bd1cbf9db051e420b05c08b69b809c60f` |
| 399 | `b73b024e750a1dfa3c8114512acff361c68071603822d91d8c0596b7fd10b5d0` | `78741f0b64144f3dc844ea3bdf340cba34bf6fd95d6d479b444c8eda65eb838f` | `7955dfe76e0bf26acd8f2cbd104777577d692bc1481a4d051ab4da99d1a08e36` |
| 400 | `58a6568d59a507c0e3ec50950cf398e8672c2ca782a70a9cd386f4d1fbbbdfc9` | `cb879fbd8dd8a7b5776fbeefdc6857e784447bdeebc6c26f6bbf2a9663419a51` | `ff006e711f31e5cc563ae3c44f3ef986a3aaeaba803716e1b6ddf3ef4aa1f978` |

Frozen observations SHA-256:
`6b1472602139b077dbe4421abd3ad2c983fd2602c19c29dca4ba87c2529959ff`.
This durable report's final byte hash is recorded separately, avoiding
a self-referential hash, at:
/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b83-source-svg-review/report.sha256

## Boundaries

Only the owned review directory and this durable report were written.
No source figure was changed or promoted. No descendants/chats, Git,
database access, publishing, tests, builds, modern figures, helper patches,
vectorization, finalization or other production reruns were performed.
The review does not approve whole-page SOURCE text/crops, modern models,
publication, or completion of a lesson/book/course.
