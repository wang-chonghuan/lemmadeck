# Source Author 106-110

Session C, STEMROBIN-180. Scope: original 6p physical pages 106-110 only.
Authoring, not independent approval. No assemble/book/lessons, app, DB,
publication, dependency or Git actions. No choices or answers consulted.

Interpreter: existing shared
`/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python`.
No environment/dependency installation. Every command uses
`PYTHONDONTWRITEBYTECODE=1`.

## Current Status

| Physical Page | Printed Page | Prepare | Finalize | Vectorize |
|---|---|---|---|---|
| 106 | 95 | PASS | FAIL: printed-row tool defect | Not run: finalize blocked |
| 107 | 96 | PASS | PASS: 15/15 lines | PASS: 2 figures |
| 108 | 97 | PASS | PASS: 26/26 lines | Exit 0: no source figures |
| 109 | 98 | PASS | PASS: 25/25 lines | Exit 0: no source figures |
| 110 | 99 | PASS | PASS: 17/17 lines | PASS: 2 figures |

## First Failure: 106

- Original `page.png` and `page.grid.png` opened individually at original
  resolution, 1472 x 2161 at prepare's 300 dpi.
- Source contains 25 text rows including heading and foot; authored md has 25.
- `finalize` exit 1, `audit.json`: `lines_printed=24`, `lines_md=25`.
- `layout.json` merges standalone emphasized short line `引力.` at y~1003
  with next paragraph's `人们在实践中是要考虑浸润现象和不浸润现象并加以利`
  at y~1073 into `[1003,1113]`. Both are visually distinct printed rows.
- No source fig box on 106. No cropping can explain the mismatch.
- Charset/normalization/formula checks: no other errors, no unknown characters,
  no KaTeX warnings. Do not delete a source row or edit the counter to pass.
- First failure retained at
  `.tmp/ld-s10y-lesson/6p/pages/0106/author-evidence/finalize-1/`:
  pre-finalize md, post-finalize md/json/audit, stdout and stderr.
- Reported immediately to main. No repair or skill edits performed.

## Boundary

Read 105 `page.md` tail only. Its `p open` ends `不`; 106 starts `p cont`
with `过这时...`. 106 ends an open pressure paragraph with `力` for 107.
No edit to 105 or older pages. Page completion does not claim a complete lesson.

## Page 107 Evidence

- Finalize first attempt exit 0; 11 blocks / 15 printed and md lines.
- Fig-84 coarse `[210,210,1120,475]` snapped to `[224,224,1085,455]`.
- Fig-85 coarse `[300,1540,890,313]` snapped to `[307,1551,873,299]`.
- Captions excluded from figure boxes; original subpart labels stay in pixels.
- `vectorize --book 6p --page 107` exit 0: fig-84 mismatch 0.017%,
  fig-85 0.010%, both below the 2% gate with unchanged defaults.
- Charset/formula/audit errors: none. Repairs: 0.
- Open experiment paragraph crosses fig-85 and ends `立着`; continuation in 108.

## Page 108 Evidence

- Finalize first attempt exit 0; 24 blocks / 26 printed and md lines.
- No source figures, no boxes. `vectorize --page 108` was run, exit 0,
  zero figure inputs; this is not a claim that any figure was verified.
- All original example columns, quantities and units retained with `samerow`
  for co-printed column entries. No answer key consulted.
- Charset/formula/audit errors: none. Repairs: 0.
- Counting diagnostic caveat: aggregate equality is not a row-by-row layout
  proof. `layout.json` splits the tall definition fraction into
  `[1361,1411]` / `[1412,1463]`, while `[1958,2034]` includes the last
  example line and foot. These offset in the total. Reported for main's
  independent review; no counter/threshold changes or invented `↵`.

## Page 109 Evidence

- Finalize first attempt exit 0; 15 blocks / 25 printed and md lines.
- Source questions 1-6 and exercise 18 questions 1-3 retain separate exhead
  groups and original numbering. No solutions or choices generated.
- No source figures/boxes. `vectorize --page 109` ran and returned exit 0,
  zero figure inputs.
- Charset/formula/audit errors: none. Repairs: 0.
- Section 45 begins; last paragraph complete on this page. No open boundary.

## Page 110 Evidence

- Finalize first attempt exit 0; 12 blocks / 17 printed and md lines.
- Fig-86 coarse `[330,820,340,602]` snapped to `[339,832,325,578]`;
  includes the original internal foundation label.
- Fig-87 coarse `[860,1080,430,307]` snapped to `[874,1087,403,288]`.
- Captions remain separate; fig-87 caption uses `samerow` for the original
  shared caption row.
- `vectorize --book 6p --page 110` exit 0: fig-86 mismatch 0.012%,
  fig-87 0.006%, both below the 2% gate with unchanged defaults.
- Charset/formula/audit errors: none. Repairs: 0.
- Last paragraph remains `p open`, ending `故对木头所`; continuation belongs
  to page 111. Page 111 was not read or modified.
- Source PDF SHA-256:
  `46e2b2e4a92b7c00fab9adfc6a8a9b5340a9519fa90f1b82e79bc1e1432fcbb0`.
- Source page PNG SHA-256:
  `a9e5c628acabfa15fe60becc3a50f0120d1991ba776cf03e018cb47a9d6c850f`.
- `page.md` SHA-256:
  `02ac855e40b1b38c8e264ef743de565cce1edb1c342b32459dabb35e6d401f05`.
- `page.json` SHA-256:
  `3fb6446a1699cb4eb0a3890b8be293118d53332ba11b7ff3cb4b5c3d6c1331a9`.
- `audit.json` SHA-256:
  `316aea1886da2564aacdbd70ad1bd73a569f4687d5a372992ec2665adf05cd08`.
- Fig-86 PNG SHA-256:
  `4663080585aafc7af9c9e8341565cae20492b3ad2a706b6f55a59e1e6dcc2c09`.
- Fig-86 SVG SHA-256:
  `b628fed9d80e03f757d84a302d2be188960f289d694ec35b8399935e769d5a84`.
- Fig-87 PNG SHA-256:
  `a3c7c7e6b4d9faab1b3760712e380848025f9162446fcf127d27d8230540838f`.
- Fig-87 SVG SHA-256:
  `5b310d139b1a9390e481cd93469de551411ed9906fe5c8f58ba168b465342e58`.
- Command evidence:
  `.tmp/ld-s10y-lesson/6p/pages/0110/author-evidence/commands.json`.
- Author work stopped. No in-flight command session; independent review
  remains with main. No new source-page or figure task accepted.

## Commands

Scoped wrapper:
`node .tmp/ld-s10y-lesson/6p/pages/0106/source-author.mjs prepare|finalize|vectorize N`.
It calls the existing `p2c.py` with `--book 6p --page N`, records command arrays,
exit codes and first-attempt snapshots below each owned page's scratch
`author-evidence/`. Only pages 106-110 are permitted by the wrapper.

Independent review will be assigned by main. No self-approval.
