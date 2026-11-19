# SOURCE REVIEWONLY: 8p physical161 / b58 / FIRST

## Findings First: HOLD

1. **[P1] Newly found missing source comma, p0161#2 row 2.**
   Original pixels clearly read
   `的支座上（图 109），则它对支座的作用力，`.
   Current page.md line 54 and page.json block #2 row 2 instead end at
   `作用力`, dropping `，` before the next row `也叫做重量.`.
   This is an additional source-fidelity omission, independent of the author's
   disclosed spacing HOLD. The original full page and independent source-top
   crop were inspected before candidate text. No repair was made.

2. **[P2] Independently confirmed missing sentence-boundary space,
   p0161#8 row 1.** Current page.md line 77 and page.json block #8 row 1
   end in `重力.` with last codepoint U+002E and no U+0020. The next row starts
   `但是，只有当...`; direct concatenation produces `重力.但是`.
   The actual soviet-cn profile requires ASCII sentence periods, and the
   lesson skill's source-transcription rule explicitly requires a trailing
   ASCII space at such a printed line break. This is not an invisible glyph
   inferred from physics or an author-report-only finding. The source shows
   the period, and current stored bytes independently establish the missing
   separator. No repair was made.

**FIRST source review result: HOLD.** No other word, mathematical-letter,
number, emphasis-word, heading, footer, or complete-figure omission was found
in this one pass. Mechanical 25/25 and vector 0.000% do not clear either
finding. This is source fidelity, not approval of the source's physics.

## Scope and Independence

Existing STEMROBIN-180 invocation. Only physical161 was read. Candidate roots:

```text
/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b58-suspended-mass/artifacts/8p/pages/0161/
/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b58-suspended-mass/work/8p/pages/0161/
```

The original page was opened first, then independent source-only details.
The complete source inventory was written before opening candidate
page.md/page.json/audit.json, candidate PNG, or the author report:

```text
/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-source-review161/independent-source-inventory.md
SHA256 9787a5427d54ba02ab698de0a55fee46262a627c5c2b703c8e64705a2f093cf2
```

It records every printed body row, caption, numerical/math reference, emphasis
range, local boundary, footer, and complete figure apparatus. Its statement
that the top paragraph continues prior discussion means unit context, not a
textual `cont` requirement: indentation and its complete ending support a new
paragraph. Preceding-page words and preceding n37 completeness are not proven.

Author report was read only after that independent inventory, for current
hashes and FIRST receipt locations, never as source-fidelity proof:

```text
/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/source-author-8p161-b58.md
SHA256 95af6ace5d5d6d3bf0c2a2cee5eb5929cbcdfdacf9306bd6fcb09bcf8ae85c82
```

Six images total: original page, three independent source-detail crops, one
independent complete original-figure enlargement, and actual finalized
fig-109.png. No image was reopened. No grid or author-made detail image was
visually loaded. Their target-page hashes alone were bound. The machine-saved
exact comparison crop was not opened as an additional image.

## Complete Candidate Comparison

References below are one-based page.json blocks. Complete source rows are in
the independent inventory; this table records their first comparison.

| Ref | Kind / Rows | FIRST comparison |
| --- | --- | --- |
| p0161#1 | p / 2 | All words retained; italic source P transcribed as `$P$`; complete new paragraph, no `cont` or `open`. |
| p0161#2 | p / 3 | Source reference 图 109 and all words retained; final comma in row 2 missing, F1. |
| p0161#3 | fig / 0 | One fig-109 containing both spring states; complete original-pixel comparison below. |
| p0161#4 | p / 2 | Full source definition and entire two-line bold range retained with `<strong>`. |
| p0161#5 | cap / 1 | Exact 图 109; `samerow: true` agrees with caption/first-definition-line baseline; not baked into apparatus PNG. |
| p0161#6 | p / 2 | All words and long dash retained. Under-dot markup covers both source word ranges from `不是` through `力`, across the break; initial subject and final period remain outside. |
| p0161#7 | p / 3 | All thread, metal-wire, table wording and punctuation retained; no math correction or added label. |
| p0161#8 | p / 3 | All words and stationary/uniform-straight-motion condition retained; F2 missing row-end space remains. |
| p0161#9 | p / 2 | Entire caution retained; under-dot markup covers source words through `用在不同物体上`; `应当注意：` and final period outside. Locally closes prior unit prose. |
| p0161#10 | h3 / 1 | Genuine source heading `38. 用悬挂法测物体的质量`, not fabricated from author/TOC prose; retained as h3. |
| p0161#11 | p / 6 | Full six-line n38 introduction retained; `第四章` remains a prose reference; last row `该物体的质量彼此成正比：`, `open: true`. |
| p0161#12 | foot / 1 | Actual printed `149`, both solid flanking dots preserved as `• 149 •`. |

Totals independently computed from current blocks: 12 blocks, 25 distinct
printed/transcribed rows, one figure, one same-row caption (#5), one open
paragraph (#11), zero cont blocks. No exercise/exhead, extra heading, equation,
fraction, numerical mass/force, or answer has been invented. There is no
printed 37 label on this page; supplied n37 context is distinguished from
visible n38.

Emphasis comparison concerns source words and stored markup only. No
product/browser emphasis-rendering approval is claimed. The internal comma
between the dotted word ranges remains source punctuation; final periods
remain outside emphasis markup.

The n37 tail closes locally before the real n38 heading. N38 does not close:
its target-page ending is a colon with an open paragraph. The parent may reuse
its supplied already-approved 162 continuation; neither physical162 nor any
other page/image/candidate/review contents were read here. No cross-page
assembly or full-unit closure was inferred.

## Actual Complete PNG Crop

Original full-page pixels and original-figure detail were inventoried before
the actual candidate PNG was opened. Compared:

```text
Original:
/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b58-suspended-mass/work/8p/pages/0161/page.png
Candidate:
/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b58-suspended-mass/work/8p/pages/0161/figures/fig-109.png
```

- Independent complete source-detail extent: xyxy `[1195,435,1520,675]`.
- Source ink bbox within it: xyxy `[1206,453,1505,668]`, exactly the
  current snapped xywh `[1206,453,299,215]`.
- Actual candidate: 323 x 239; derived padding 12 pixels on every side.
- Exact original corresponding extent: xyxy `[1194,441,1517,680]`.
- All **77,197 RGB pixels** compared, **0 differing pixels**, no difference bbox.
- Thus the actual complete apparatus pixels match the original, including
  tall unloaded spring, compressed loaded spring, block/seat, downward
  arrowhead, vector-accent P, coil holes, intervening level strokes, shelf
  edges, left underside hatching, and all original minor ink strokes.
  No caption/prose is present in the candidate crop, and no support edge,
  load top, label, or figure subpart is clipped.

Saved exact original comparison crop:

```text
/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-source-review161/original-exact-candidate-extent.png
```

This establishes PNG source fidelity, not SVG physics/modern-figure approval.
The SVG was hash-bound to the author's FIRST vector receipt; it was not
re-rendered or regenerated.

## Current Input and FIRST Bindings

Every current candidate/source target-page hash listed by the author matches
the current bytes captured by the reviewer. The actual profile hash also
matches page metadata. Load-bearing hashes:

| Current file | SHA256 |
| --- | --- |
| artifacts/8p/pages/0161/page.md | 638b38c91a2485a8c638229f347f440c77e53a195bfc72e981e30e5e4d6dda43 |
| artifacts/8p/pages/0161/page.json | 8bdabba524b5634c913da2ed77dbc5c39d454ad4807a2ccfc4b3eeffa263ada7 |
| artifacts/8p/pages/0161/audit.json | 05c9ca5565699cc8ffd5e777c65622d716a66885e17987dd0be18a9810bd2996 |
| work/8p/pages/0161/page.png | 1453faae6d44ad5af9c1883e1489257eee3c50226451a0c01a8f0b475731a9b8 |
| work/8p/pages/0161/figures/fig-109.png | 4cf8bfe1cb7d51d4a367394a46883eb7d36a9238f266972aa2cb2494e884a2de |
| work/8p/pages/0161/figures/fig-109.svg | f01cf4c216566a9c59f56f4bfbe23a0132598c2e1844065936f581b914c6e81a |
| profiles/soviet-cn.json | dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849 |

The full absolute-path byte/hash manifest, including the author report,
target-page work metadata, independent inventory, scripts, evidence PNGs,
and all nine existing FIRST receipt files:

```text
/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-source-review161/current-input-and-first-receipts.json
SHA256 4e8bde2d552a108f1b6aa2f62de1e481e51c5b355acd6c739fc4620218bd2b3f
```

Existing receipts were read, not run. Exact command arrays, cwd, timestamps,
stdout, stderr, current hashes and stream-byte/hash comparisons are recorded
in the FIRST comparison evidence. All six stdout/stderr stream bindings match
their .call.json declarations:

| Existing FIRST prefix | Original finished UTC | Existing result |
| --- | --- | --- |
| b58-author161-prepare-first | 2026-11-17T15:28:44.546Z | exit 0; 1695x2580, 300dpi, 25 printed rows |
| b58-author161-finalize-first | 2026-11-17T15:30:34.840Z | exit 0; 12 blocks, 25/25, 1 figure, 0 normalizations |
| b58-author161-vectorize-once | 2026-11-17T15:30:55.472Z | exit 0; 1 passed, 0 over-limit, mismatch 0.000% |

Absolute receipt root:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/commands/`.
No receipt was rewritten. Current audit keeps empty errors, unknown_chars,
katex_warnings and normalizations; errata 0. These are mechanical outcomes
only, preserved despite the two source findings.

Independent first-comparison evidence:

```text
/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-source-review161/first-comparison.json
SHA256 e0e3ac308919c5448862676a68bf03ea621818f6146f1a7e6c65fe945f7aa3a1
```

## Stop / Preservation

Only this newly created review report and newly created evidence under
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-source-review161/`
were written. Existing source/candidate/author/HOLD files, receipts and dirty
work remain untouched.

No source or tool edit; no prepare/finalize/vector/gate execution or rerun;
no repair, assemble, adapt, promote, answer/choice, freshness/setup,
backend/network, Git, app DB, or checkpoint usage. Reviewer source-crop
interpreter-launch failures and the successful first pixel comparison are
disclosed in evidence; no check result was overwritten by a second pass.

Stopped after this FIRST source review. Both findings remain HOLD for the
parent; no source acceptance or unit completion is claimed.
